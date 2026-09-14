-- ==============================================================================
-- DREAMBASKET: SAFE CONTROLLED TEST ORDER CLEANUP
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/ukouhgquakvmwxuyhexq/sql
-- ==============================================================================

DO $$
DECLARE
    v_order_id TEXT := 'DB-20260914-001';
    v_order_uuid UUID := '1c0b5d31-2774-4979-afa4-7f09604464a4'::UUID;
    v_customer_uuid UUID := '49c8b944-64fb-4715-816f-bdf8a1ec4b44'::UUID;
    v_target_prod TEXT := 'prod-1';
    v_current_stock INTEGER;
    v_found_order_id TEXT;
    v_found_cust_uuid UUID;
BEGIN
    -- 1. Safety Check: Verify order UUID and order ID match
    SELECT order_id, customer_id INTO v_found_order_id, v_found_cust_uuid
    FROM public.orders
    WHERE id = v_order_uuid;

    IF v_found_order_id IS NULL OR v_found_order_id != v_order_id THEN
        RAISE EXCEPTION 'Safety check failed: Order UUID % does not match Order ID %', v_order_uuid, v_order_id;
    END IF;

    -- 2. Safety Check: Verify customer UUID matches
    IF v_found_cust_uuid IS NULL OR v_found_cust_uuid != v_customer_uuid THEN
        RAISE EXCEPTION 'Safety check failed: Customer UUID % does not match order customer %', v_customer_uuid, v_found_cust_uuid;
    END IF;

    -- 3. Safety Check: Verify prod-1 stock is currently 24
    SELECT stock_quantity INTO v_current_stock
    FROM public.products
    WHERE id = v_target_prod;

    IF v_current_stock != 24 THEN
        RAISE EXCEPTION 'Safety check failed: Product % stock is %, expected 24', v_target_prod, v_current_stock;
    END IF;

    -- 4. Delete the test order (order_items cascade delete automatically)
    DELETE FROM public.orders WHERE id = v_order_uuid;

    -- 5. Delete only the test customer
    DELETE FROM public.customers WHERE id = v_customer_uuid;

    -- 6. Restore product prod-1 stock back to exactly 25 and In Stock
    UPDATE public.products
    SET stock_quantity = 25,
        stock_status = 'In Stock',
        updated_at = timezone('utc'::text, now())
    WHERE id = v_target_prod;

    RAISE NOTICE 'Safety checks passed and cleanup executed successfully!';
END $$;
