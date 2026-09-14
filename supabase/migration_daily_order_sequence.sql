-- ==============================================================================
-- DREAMBASKET: DAILY ORDER SEQUENCE & COMPACT YYMMDDNNN ORDER ID GENERATION
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- ==============================================================================

-- 1. Create table for tracking daily sequence numbers
CREATE TABLE IF NOT EXISTS public.daily_order_sequences (
    order_date DATE PRIMARY KEY,
    last_sequence INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.daily_order_sequences ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admin full access daily sequences" ON public.daily_order_sequences;
CREATE POLICY "Admin full access daily sequences" ON public.daily_order_sequences FOR ALL TO authenticated USING (true);

-- 2. Seed/Initialize current sequence for today from existing orders
INSERT INTO public.daily_order_sequences (order_date, last_sequence, updated_at)
SELECT 
    (timezone('Asia/Kolkata', now()))::date,
    COALESCE(MAX(
        CASE 
            WHEN order_id ~ '^[0-9]{9}$' THEN SUBSTRING(order_id FROM 7 FOR 3)::INTEGER
            WHEN order_id ~ 'DB-[0-9]{8}-[0-9]+' THEN SUBSTRING(order_id FROM '[0-9]+$')::INTEGER
            ELSE 0 
        END
    ), 0),
    timezone('utc'::text, now())
FROM public.orders
WHERE (timezone('Asia/Kolkata', created_at))::date = (timezone('Asia/Kolkata', now()))::date
ON CONFLICT (order_date) 
DO UPDATE SET 
    last_sequence = GREATEST(public.daily_order_sequences.last_sequence, EXCLUDED.last_sequence),
    updated_at = timezone('utc'::text, now());

-- 3. Standalone atomic sequence generator function
CREATE OR REPLACE FUNCTION public.generate_next_order_id()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_order_date DATE;
    v_seq INTEGER;
BEGIN
    -- Order date based on Store India Timezone (IST)
    v_order_date := (timezone('Asia/Kolkata', now()))::date;

    INSERT INTO public.daily_order_sequences (order_date, last_sequence, updated_at)
    VALUES (v_order_date, 1, timezone('utc'::text, now()))
    ON CONFLICT (order_date)
    DO UPDATE SET 
        last_sequence = public.daily_order_sequences.last_sequence + 1,
        updated_at = timezone('utc'::text, now())
    RETURNING last_sequence INTO v_seq;

    -- Format as YYMMDDNNN (e.g. 260914001, 260914002...)
    RETURN to_char(v_order_date, 'YYMMDD') || lpad(v_seq::text, 3, '0');
END;
$$;

GRANT EXECUTE ON FUNCTION public.generate_next_order_id TO anon, authenticated;

-- 4. Update atomic order creation function
CREATE OR REPLACE FUNCTION public.place_order_with_stock_check(
    p_order_id TEXT,
    p_customer JSONB,
    p_items JSONB,
    p_pricing JSONB,
    p_delivery_method TEXT DEFAULT 'Standard Shipping',
    p_delivery_eta TEXT DEFAULT '6–7 business days'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_customer_id UUID;
    v_order_id UUID;
    v_item JSONB;
    v_prod_id TEXT;
    v_qty INTEGER;
    v_current_stock INTEGER;
    v_current_status TEXT;
    v_threshold INTEGER;
    v_res JSONB;
    v_final_order_id TEXT;
BEGIN
    -- 1. Validate items array
    IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
        RAISE EXCEPTION 'Order must contain at least one item.';
    END IF;

    -- 2. Determine authoritative YYMMDDNNN order ID
    IF p_order_id IS NOT NULL AND p_order_id ~ '^[0-9]{9}$' AND NOT EXISTS (SELECT 1 FROM public.orders WHERE order_id = p_order_id) THEN
        v_final_order_id := p_order_id;
    ELSE
        v_final_order_id := public.generate_next_order_id();
    END IF;

    -- 3. Lock & Validate Stock for every product
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        v_prod_id := v_item->>'productId';
        v_qty := COALESCE((v_item->>'quantity')::INTEGER, 1);

        -- Fetch and lock product row
        SELECT stock_quantity, stock_status, low_stock_threshold
        INTO v_current_stock, v_current_status, v_threshold
        FROM public.products
        WHERE id = v_prod_id
        FOR UPDATE;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Product with ID % not found.', v_prod_id;
        END IF;

        IF v_current_status = 'Out of Stock' OR v_current_stock < v_qty THEN
            RAISE EXCEPTION 'Product % is Out of Stock or does not have sufficient quantity (Available: %, Requested: %).',
                COALESCE(v_item->>'productName', v_prod_id), v_current_stock, v_qty;
        END IF;

        -- Decrement stock safely
        UPDATE public.products
        SET stock_quantity = stock_quantity - v_qty,
            stock_status = CASE 
                WHEN (stock_quantity - v_qty) <= 0 THEN 'Out of Stock'
                WHEN (stock_quantity - v_qty) <= v_threshold THEN 'Low Stock'
                ELSE 'In Stock'
            END,
            updated_at = timezone('utc'::text, now())
        WHERE id = v_prod_id;
    END LOOP;

    -- 4. Upsert Customer Record
    INSERT INTO public.customers (
        name,
        phone,
        delivery_address,
        city,
        state,
        pincode,
        instagram_id
    ) VALUES (
        p_customer->>'fullName',
        p_customer->>'phoneNumber',
        p_customer->>'address',
        p_customer->>'city',
        p_customer->>'state',
        p_customer->>'pincode',
        NULLIF(p_customer->>'instagramId', '')
    )
    RETURNING id INTO v_customer_id;

    -- 5. Create Order
    INSERT INTO public.orders (
        order_id,
        customer_id,
        customer_name,
        phone,
        delivery_address,
        city,
        state,
        pincode,
        instagram_id,
        subtotal,
        delivery_charge,
        final_total,
        delivery_method,
        delivery_eta,
        order_notes
    ) VALUES (
        v_final_order_id,
        v_customer_id,
        p_customer->>'fullName',
        p_customer->>'phoneNumber',
        p_customer->>'address',
        p_customer->>'city',
        p_customer->>'state',
        p_customer->>'pincode',
        NULLIF(p_customer->>'instagramId', ''),
        (p_pricing->>'subtotal')::NUMERIC,
        COALESCE((p_pricing->>'delivery')::NUMERIC, 0.00),
        (p_pricing->>'total')::NUMERIC,
        p_delivery_method,
        p_delivery_eta,
        p_customer->>'notes'
    )
    RETURNING id INTO v_order_id;

    -- 6. Create Order Items
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        INSERT INTO public.order_items (
            order_id,
            product_id,
            product_id_snapshot,
            product_name_snapshot,
            product_image_snapshot,
            quantity,
            product_price,
            selected_packaging_id,
            selected_packaging_name,
            selected_packaging_price,
            selected_card_color,
            selected_card_theme,
            item_total
        ) VALUES (
            v_order_id,
            v_item->>'productId',
            v_item->>'sku',
            v_item->>'productName',
            v_item->>'image',
            (v_item->>'quantity')::INTEGER,
            (v_item->>'price')::NUMERIC,
            v_item->'packaging'->>'id',
            v_item->'packaging'->>'name',
            COALESCE((v_item->>'packagingPrice')::NUMERIC, 0.00),
            v_item->>'color',
            v_item->>'theme',
            (v_item->>'lineTotal')::NUMERIC
        );
    END LOOP;

    -- Return order summary
    SELECT json_build_object(
        'id', v_order_id,
        'orderNumber', v_final_order_id,
        'customerId', v_customer_id,
        'status', 'New'
    )::jsonb INTO v_res;

    RETURN v_res;
END;
$$;

GRANT EXECUTE ON FUNCTION public.place_order_with_stock_check TO anon, authenticated;
