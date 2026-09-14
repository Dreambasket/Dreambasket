-- ==============================================================================
-- DREAMBASKET LIVE SUPABASE DATABASE SCHEMA
-- Brand: @dreambasket.studio
-- Complete Production PostgreSQL Schema for Dreambasket E-Commerce
-- Single source of truth for Customer Website ↔ Supabase ↔ Admin Dashboard
-- ==============================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. STORE SETTINGS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.store_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_name TEXT NOT NULL DEFAULT 'Dreambasket',
    instagram_handle TEXT NOT NULL DEFAULT '@dreambasket.studio',
    instagram_url TEXT NOT NULL DEFAULT 'https://instagram.com/dreambasket.studio',
    whatsapp_number TEXT DEFAULT '',
    tagline TEXT NOT NULL DEFAULT 'Little treasures, made to make you smile 🎀',
    delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    delivery_method TEXT NOT NULL DEFAULT 'Standard Shipping',
    delivery_eta TEXT NOT NULL DEFAULT '6–7 business days',
    manual_upi_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    upi_id TEXT DEFAULT '',
    payment_instructions TEXT DEFAULT '',
    payment_proof_required BOOLEAN NOT NULL DEFAULT FALSE,
    free_shipping_threshold NUMERIC(10, 2) DEFAULT 799.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 2. CATEGORIES TABLE
-- Preserves complete category hierarchy & category-level content
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    tagline TEXT DEFAULT '',
    description TEXT,
    highlights JSONB DEFAULT '[]'::jsonb,
    subcategories JSONB DEFAULT '[]'::jsonb,
    image TEXT,
    featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 3. PRODUCTS TABLE (Public & Customer Facing)
-- Cost Price, Packing Cost, and Profit are explicitly EXCLUDED from this table
-- to ensure zero accidental exposure to public customers or search engines.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL, -- SKU / Human-readable code e.g. DB-SKU-0001
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
    subcategory_id TEXT,
    selling_price NUMERIC(10, 2) NOT NULL CHECK (selling_price >= 0),
    mrp NUMERIC(10, 2) CHECK (mrp >= 0),
    stock_quantity INTEGER NOT NULL DEFAULT 25 CHECK (stock_quantity >= 0),
    stock_status TEXT NOT NULL DEFAULT 'In Stock' 
        CHECK (stock_status IN ('In Stock', 'Low Stock', 'Out of Stock')),
    low_stock_threshold INTEGER NOT NULL DEFAULT 5,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_archived BOOLEAN NOT NULL DEFAULT FALSE,
    is_bestseller BOOLEAN NOT NULL DEFAULT FALSE,
    is_new_arrival BOOLEAN NOT NULL DEFAULT FALSE,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    is_combo BOOLEAN NOT NULL DEFAULT FALSE,
    combo_items JSONB DEFAULT '[]'::jsonb,
    combo_description TEXT,
    -- Optional Product Specifications entered explicitly by Admin
    material TEXT,
    colour TEXT,
    size TEXT,
    waterproof TEXT,
    anti_tarnish BOOLEAN DEFAULT FALSE,
    hypoallergenic TEXT,
    badge TEXT,
    rating NUMERIC(3, 2) DEFAULT 5.00,
    reviews_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active, is_archived);
CREATE INDEX IF NOT EXISTS idx_products_stock ON public.products(stock_status);

-- ------------------------------------------------------------------------------
-- 4. PRIVATE PRODUCT COST DATA (Admin ONLY 🔒)
-- Stores Dreambasket's internal business cost prices and calculates profit.
-- Completely isolated from public customer product tables.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_costs (
    product_id TEXT PRIMARY KEY REFERENCES public.products(id) ON DELETE CASCADE,
    cost_price NUMERIC(10, 2) DEFAULT 0.00,
    packing_cost NUMERIC(10, 2) DEFAULT 0.00,
    total_internal_cost NUMERIC(10, 2) GENERATED ALWAYS AS (COALESCE(cost_price, 0) + COALESCE(packing_cost, 0)) STORED,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 5. PRODUCT IMAGES TABLE (Multi-image Support)
-- Supports multiple persistent images per product with reordering & primary flag.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    image_url TEXT NOT NULL,
    storage_path TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_product_images_prod ON public.product_images(product_id, sort_order);

-- ------------------------------------------------------------------------------
-- 6. CUSTOMER-SELECTABLE PACKAGING TABLE
-- Normal Packaging, Floating Box, Jewellery Box (with images & pricing)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.packaging_options (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    customer_facing_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    images JSONB DEFAULT '[]'::jsonb,
    image TEXT,
    description TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 7. HANDMADE CARDS OPTIONS TABLE
-- Color options (Pink, Lavender, Blue, Red, Black) & Themes (Birthday, Anniversary, Friends)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.handmade_card_options (
    id TEXT PRIMARY KEY,
    option_type TEXT NOT NULL CHECK (option_type IN ('color', 'theme')),
    name TEXT NOT NULL,
    hex TEXT,
    border TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 8. CUSTOMERS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    city TEXT,
    state TEXT,
    pincode TEXT,
    instagram_id TEXT, -- OPTIONAL
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone);

-- ------------------------------------------------------------------------------
-- 9. ORDERS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT UNIQUE NOT NULL, -- e.g. DB-20260913-001
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    city TEXT,
    state TEXT,
    pincode TEXT,
    instagram_id TEXT, -- OPTIONAL
    subtotal NUMERIC(10, 2) NOT NULL,
    delivery_charge NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    final_total NUMERIC(10, 2) NOT NULL,
    delivery_method TEXT DEFAULT 'Standard Shipping',
    delivery_eta TEXT DEFAULT '6–7 business days',
    payment_status TEXT NOT NULL DEFAULT 'Pending' 
        CHECK (payment_status IN ('Pending', 'Paid', 'Failed', 'Refunded', 'PENDING', 'PAYMENT_SENT', 'PAYMENT_VERIFIED')),
    order_status TEXT NOT NULL DEFAULT 'New' 
        CHECK (order_status IN ('New', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled', 'Returned')),
    order_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON public.orders(created_at DESC);

-- ------------------------------------------------------------------------------
-- 10. ORDER ITEMS TABLE (Immutable History Snapshot)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
    product_id_snapshot TEXT,
    product_name_snapshot TEXT NOT NULL,
    product_image_snapshot TEXT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    product_price NUMERIC(10, 2) NOT NULL,
    selected_packaging_id TEXT,
    selected_packaging_name TEXT,
    selected_packaging_price NUMERIC(10, 2) DEFAULT 0.00,
    selected_card_color TEXT,
    selected_card_theme TEXT,
    item_total NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);

-- ------------------------------------------------------------------------------
-- 10B. DAILY ORDER SEQUENCES (Authoritative YYMMDDNNN Generation)
-- Tracks atomic sequential order number per calendar day in Asia/Kolkata (IST).
-- Row-level locking during ON CONFLICT ensures strict uniqueness during concurrent checkouts.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.daily_order_sequences (
    order_date DATE PRIMARY KEY,
    last_sequence INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Standalone atomic order ID generator function
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

-- ------------------------------------------------------------------------------
-- 11. ATOMIC STOCK SAFETY & ORDER CREATION FUNCTION
-- Prevents overselling, validates quantity, updates stock_status to 'Out of Stock'
-- if stock reaches 0, generates authoritative YYMMDDNNN order ID, and records
-- order and order items atomically.
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- 11B. ADMIN PRODUCTS WITH COSTS RPC (Secure Admin Cost Access)
-- Returns products with internal cost & profit metrics securely.
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_admin_products_with_costs()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_res JSONB;
BEGIN
    SELECT json_agg(
        json_build_object(
            'id', p.id,
            'product_id', p.product_id,
            'name', p.name,
            'slug', p.slug,
            'description', p.description,
            'category_id', p.category_id,
            'subcategory_id', p.subcategory_id,
            'selling_price', p.selling_price,
            'mrp', p.mrp,
            'stock_quantity', p.stock_quantity,
            'stock_status', p.stock_status,
            'low_stock_threshold', p.low_stock_threshold,
            'is_active', p.is_active,
            'is_archived', p.is_archived,
            'is_bestseller', p.is_bestseller,
            'is_new_arrival', p.is_new_arrival,
            'is_featured', p.is_featured,
            'is_combo', p.is_combo,
            'combo_items', p.combo_items,
            'combo_description', p.combo_description,
            'material', p.material,
            'colour', p.colour,
            'size', p.size,
            'waterproof', p.waterproof,
            'anti_tarnish', p.anti_tarnish,
            'hypoallergenic', p.hypoallergenic,
            'badge', p.badge,
            'rating', p.rating,
            'reviews_count', p.reviews_count,
            'created_at', p.created_at,
            'updated_at', p.updated_at,
            'categoryName', cat.name,
            'cost_price', c.cost_price,
            'packing_cost', c.packing_cost,
            'total_internal_cost', c.total_internal_cost,
            'product_images', (
                SELECT json_agg(json_build_object('image_url', img.image_url, 'sort_order', img.sort_order, 'is_primary', img.is_primary))
                FROM public.product_images img
                WHERE img.product_id = p.id
            )
        )
    )::jsonb INTO v_res
    FROM public.products p
    LEFT JOIN public.product_costs c ON p.id = c.product_id
    LEFT JOIN public.categories cat ON p.category_id = cat.id;

    RETURN COALESCE(v_res, '[]'::jsonb);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.get_admin_products_with_costs FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_admin_products_with_costs TO authenticated;

-- ------------------------------------------------------------------------------
-- 12. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packaging_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.handmade_card_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Clean existing policies if re-running
DROP POLICY IF EXISTS "Public read store settings" ON public.store_settings;
DROP POLICY IF EXISTS "Public read categories" ON public.categories;
DROP POLICY IF EXISTS "Public read active products" ON public.products;
DROP POLICY IF EXISTS "Public read product images" ON public.product_images;
DROP POLICY IF EXISTS "Public read packaging options" ON public.packaging_options;
DROP POLICY IF EXISTS "Public read card options" ON public.handmade_card_options;
DROP POLICY IF EXISTS "Public create orders via function" ON public.orders;
DROP POLICY IF EXISTS "Admin full access settings" ON public.store_settings;
DROP POLICY IF EXISTS "Admin full access categories" ON public.categories;
DROP POLICY IF EXISTS "Admin full access products" ON public.products;
DROP POLICY IF EXISTS "Admin full access product costs" ON public.product_costs;
DROP POLICY IF EXISTS "Admin full access product images" ON public.product_images;
DROP POLICY IF EXISTS "Admin full access packaging" ON public.packaging_options;
DROP POLICY IF EXISTS "Admin full access card options" ON public.handmade_card_options;
DROP POLICY IF EXISTS "Admin full access customers" ON public.customers;
DROP POLICY IF EXISTS "Admin full access orders" ON public.orders;
DROP POLICY IF EXISTS "Admin full access order items" ON public.order_items;

-- Public can read store settings, active categories, active products (without private costs), packaging, and card options
CREATE POLICY "Public read store settings" ON public.store_settings FOR SELECT USING (true);
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active products" ON public.products FOR SELECT USING (is_active = true AND is_archived = false);
CREATE POLICY "Public read product images" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "Public read packaging options" ON public.packaging_options FOR SELECT USING (is_active = true);
CREATE POLICY "Public read card options" ON public.handmade_card_options FOR SELECT USING (is_active = true);

-- Authenticated Admin has full access to manage all entities
CREATE POLICY "Admin full access settings" ON public.store_settings FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access categories" ON public.categories FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access products" ON public.products FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access product costs" ON public.product_costs FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access product images" ON public.product_images FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access packaging" ON public.packaging_options FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access card options" ON public.handmade_card_options FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access customers" ON public.customers FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access orders" ON public.orders FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access order items" ON public.order_items FOR ALL TO authenticated USING (true);

-- Allow public to place orders and order items (inserts)
CREATE POLICY "Public insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert order items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert customers" ON public.customers FOR INSERT WITH CHECK (true);

-- Allow public to select own order details by order_id (e.g. for Order Success page)
CREATE POLICY "Public select order by order_id" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public select order items" ON public.order_items FOR SELECT USING (true);

-- Allow anon update on stock during atomic orders RPC (granted by SECURITY DEFINER on place_order_with_stock_check)
GRANT EXECUTE ON FUNCTION public.place_order_with_stock_check TO anon, authenticated;

-- ------------------------------------------------------------------------------
-- 13. STORAGE BUCKETS SETUP
-- ------------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('product-images', 'product-images', true),
    ('packaging-images', 'packaging-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policy Idempotency & Public Read / Authenticated Admin Write Policies
DROP POLICY IF EXISTS "Public read product images bucket" ON storage.objects;
DROP POLICY IF EXISTS "Public read packaging images bucket" ON storage.objects;
DROP POLICY IF EXISTS "Admin insert product images bucket" ON storage.objects;
DROP POLICY IF EXISTS "Admin update product images bucket" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete product images bucket" ON storage.objects;

-- Public can read product and packaging images
CREATE POLICY "Public read product images bucket" 
ON storage.objects FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Public read packaging images bucket" 
ON storage.objects FOR SELECT USING (bucket_id = 'packaging-images');

-- Authenticated Admin only can insert, update, or delete images
CREATE POLICY "Admin insert product images bucket" 
ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id IN ('product-images', 'packaging-images'));

CREATE POLICY "Admin update product images bucket" 
ON storage.objects FOR UPDATE TO authenticated USING (bucket_id IN ('product-images', 'packaging-images'));

CREATE POLICY "Admin delete product images bucket" 
ON storage.objects FOR DELETE TO authenticated USING (bucket_id IN ('product-images', 'packaging-images'));

-- ------------------------------------------------------------------------------
-- 14. INITIAL SEED DATA (Categories, Packaging, Cards, Products)
-- NOTE: 0 orders are seeded. Real orders database starts at 0 orders.
-- ------------------------------------------------------------------------------

-- Default Store Settings
INSERT INTO public.store_settings (store_name, instagram_handle, instagram_url, tagline, delivery_fee, delivery_eta)
VALUES (
    'Dreambasket',
    '@dreambasket.studio',
    'https://instagram.com/dreambasket.studio',
    'Little treasures, made to make you smile 🎀',
    0.00,
    '6–7 business days'
)
ON CONFLICT DO NOTHING;

-- Main Categories
INSERT INTO public.categories (id, name, slug, tagline, description, highlights, subcategories, image, featured)
VALUES 
(
    'anti-tarnish',
    '✨ Anti-Tarnish Jewellery',
    '/anti-tarnish',
    'Long-lasting shine for your everyday style.',
    'Our anti-tarnish jewellery is designed to resist everyday tarnishing and maintain its beautiful finish with proper care. Perfect for daily wear, work, outings, and gifting—stylish pieces that stay elegant for longer.',
    '["Anti-tarnish stainless steel", "Long-lasting shine", "Waterproof", "Hypoallergenic", "High quality"]'::jsonb,
    '[{"id":"chains","name":"Chains","slug":"chains"},{"id":"bracelets","name":"Bracelets","slug":"bracelets"},{"id":"earrings","name":"Earrings","slug":"earrings"},{"id":"rings","name":"Rings","slug":"rings"}]'::jsonb,
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=700&q=80',
    true
),
(
    'budget-friendly',
    'Budget-Friendly Jewellery',
    '/budget-friendly',
    'Chic designs at gentle prices.',
    'Our budget-friendly jewellery brings you fashionable designs. Perfect for experimenting with new styles, adding a statement to your outfits, or building your jewellery collection affordably.',
    '["Budget-Friendly Jewellery", "Trendy designs", "Affordable fashion", "Perfect for casual wear"]'::jsonb,
    '[{"id":"chains","name":"Chains","slug":"chains"},{"id":"bracelets","name":"Bracelets","slug":"bracelets"},{"id":"korean-earrings","name":"Korean Earrings","slug":"korean-earrings"},{"id":"rings","name":"Rings","slug":"rings"}]'::jsonb,
    'https://images.unsplash.com/photo-1611591475879-1662922ecb5c?auto=format&fit=crop&w=700&q=80',
    true
),
(
    'handmade-cards',
    'Handmade Cards',
    '/handmade-cards',
    'Crafted with love for your special moments.',
    'Our handmade cards are crafted with love and creativity to make every special moment a little more meaningful. From birthdays and celebrations to heartfelt messages and surprises, each card is designed to add a personal touch to your wishes.',
    '["💕 Handmade with love", "🎨 Unique & creative designs", "✂️ Carefully handcrafted", "🌸 Personalized designs", "🎁 Perfect for gifting", "💌 Made for special moments"]'::jsonb,
    '[]'::jsonb,
    'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=700&q=80',
    false
),
(
    'jewellery-combos',
    'Jewellery Combos',
    '/jewellery-combos',
    'Matching sets curated for gifting.',
    'Carefully curated jewellery pairings that complement each other beautifully.',
    '["Curated pairings", "Gift ready", "Value bundle"]'::jsonb,
    '[]'::jsonb,
    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=700&q=80',
    true
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    tagline = EXCLUDED.tagline,
    description = EXCLUDED.description,
    highlights = EXCLUDED.highlights,
    subcategories = EXCLUDED.subcategories,
    image = EXCLUDED.image,
    featured = EXCLUDED.featured;

-- Packaging Options
INSERT INTO public.packaging_options (id, name, customer_facing_price, is_active, images, image, description, sort_order)
VALUES 
(
    'normal-packaging',
    'Normal Packaging',
    0.00,
    true,
    '["https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80"]'::jsonb,
    'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80',
    'Standard boutique Dreambasket pouch and card backing.',
    1
),
(
    'floating-box',
    'Floating Box',
    50.00,
    true,
    '["https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80"]'::jsonb,
    'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80',
    'Transparent 3D floating display frame box that showcases jewellery suspended.',
    2
),
(
    'jewellery-box',
    'Jewellery Box',
    100.00,
    true,
    '["https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80"]'::jsonb,
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
    'Hardcover pastel cushioned keepsake box with velvet interior, perfect for gifting.',
    3
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    customer_facing_price = EXCLUDED.customer_facing_price,
    images = EXCLUDED.images,
    image = EXCLUDED.image,
    description = EXCLUDED.description,
    sort_order = EXCLUDED.sort_order;

-- Handmade Card Options (Colors & Themes)
INSERT INTO public.handmade_card_options (id, option_type, name, hex, border, sort_order)
VALUES 
('card-color-pink', 'color', 'Pink', '#F4D9E8', '#E8B8D0', 1),
('card-color-lavender', 'color', 'Lavender', '#E8DEEE', '#D0BFDE', 2),
('card-color-blue', 'color', 'Blue', '#DCEBFA', '#B9D5F2', 3),
('card-color-red', 'color', 'Red', '#FFD1D5', '#F29DA6', 4),
('card-color-black', 'color', 'Black', '#333333', '#111111', 5),
('card-theme-bday', 'theme', 'Happy Birthday', NULL, NULL, 1),
('card-theme-anniv', 'theme', 'Happy Anniversary', NULL, NULL, 2),
('card-theme-friends', 'theme', 'Best Friends', NULL, NULL, 3)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    hex = EXCLUDED.hex,
    border = EXCLUDED.border,
    sort_order = EXCLUDED.sort_order;

-- Initial Products Catalog
INSERT INTO public.products (
    id, product_id, name, slug, description, category_id, subcategory_id,
    selling_price, mrp, stock_quantity, stock_status, low_stock_threshold,
    is_active, is_archived, is_bestseller, is_new_arrival, is_featured, is_combo,
    anti_tarnish, badge, rating, reviews_count
) VALUES
('prod-1', 'DB-SKU-0001', 'Pearl Bow Earrings', 'pearl-bow-earrings', 'Dainty ribbon bows crafted with high-lustre faux freshwater drops. Lightweight, hypoallergenic and endlessly romantic for brunch or dates.', 'anti-tarnish', 'earrings', 349.00, 449.00, 25, 'In Stock', 5, true, false, true, false, true, false, true, 'Bestseller', 4.90, 38),
('prod-2', 'DB-SKU-0002', 'Dainty Heart Necklace', 'dainty-heart-necklace', 'A whisper-light chain suspending an organic puffed golden heart with subtle shimmer. Perfect for everyday layering.', 'anti-tarnish', 'chains', 399.00, 499.00, 20, 'In Stock', 5, true, false, false, true, false, false, true, 'New', 4.80, 24),
('prod-3', 'DB-SKU-0003', 'Tulip Chain', 'tulip-chain', 'A charming miniature pastel enamel tulip pendant hanging from an ultra-delicate gold cable link chain.', 'anti-tarnish', 'chains', 320.00, 399.00, 18, 'In Stock', 5, true, false, true, true, true, false, true, 'New', 5.00, 42),
('prod-4', 'DB-SKU-0004', 'Tulip Earrings', 'tulip-earrings', 'Matching gentle blush tulip studs with golden stems. Designed to pair seamlessly with our signature Tulip Chain.', 'anti-tarnish', 'earrings', 249.00, 299.00, 22, 'In Stock', 5, true, false, true, false, true, false, true, 'Popular', 4.90, 29),
('prod-5', 'DB-SKU-0005', 'Tulip Chain + Tulip Earrings Combo', 'tulip-combo', 'Our most loved duo! The complete Tulip matching set featuring the Tulip Chain and Tulip Earrings bundled with a free pastel gift pouch.', 'jewellery-combos', NULL, 500.00, 569.00, 15, 'In Stock', 5, true, false, true, true, true, true, true, 'Made to Match 💞', 5.00, 56),
('prod-6', 'DB-SKU-0006', 'Minimal Pearl Bracelet', 'minimal-pearl-bracelet', 'Uniform mini freshwater pearls dotted along a sleek, whisper-thin golden chain. Fits every wrist gently.', 'anti-tarnish', 'bracelets', 289.00, 349.00, 25, 'In Stock', 5, true, false, true, false, true, false, true, 'Bestseller', 4.90, 31),
('prod-7', 'DB-SKU-0007', 'Princess Chain', 'princess-chain', 'Fit for modern royalty. Shimmering cubic zirconia stones set in an arched crown motif on a radiant golden collar.', 'anti-tarnish', 'chains', 499.00, 599.00, 12, 'In Stock', 5, true, false, true, true, true, false, true, 'Royal Dream ✨', 5.00, 19),
('prod-8', 'DB-SKU-0008', 'Cute Bow Ring', 'cute-bow-ring', 'An open adjustable band wrapped in an adorable micro-sculpted bow ribbon with pave crystal highlights.', 'budget-friendly', 'rings', 220.00, 280.00, 30, 'In Stock', 5, true, false, false, true, false, false, false, 'New', 4.70, 15),
('prod-9', 'DB-SKU-0009', 'Floral Hair Clip', 'floral-hair-clip', 'Pastel matte resin hair claw in blooming spring flower silhouette with smooth rounded grips that prevent hair breakage.', 'budget-friendly', NULL, 199.00, 250.00, 35, 'In Stock', 5, true, false, false, true, false, false, false, 'Cute Pick', 4.80, 22),
('prod-10', 'DB-SKU-0010', 'Dreamy Gift Hamper', 'dreamy-gift-hamper', 'Our signature pastel basket containing 1 necklace, 1 earring set, 1 silk scrunchie, dried lavender bouquet and a customizable handwritten card.', 'jewellery-combos', NULL, 999.00, 1299.00, 10, 'In Stock', 5, true, false, true, true, true, true, true, 'Ultimate Gift 🎁', 5.00, 47),
('prod-11', 'DB-SKU-0011', 'Handmade Birthday Card', 'handmade-birthday-card', 'Pressed wild petals on textured deckle-edge paper with gold foil calligraphic lettering. Blank inside for your sweetest personal wishes.', 'handmade-cards', NULL, 120.00, 160.00, 50, 'In Stock', 5, true, false, false, false, false, false, false, 'Handcrafted', 4.90, 18),
('prod-12', 'DB-SKU-0012', 'Lavender Sparkle Huggies', 'lavender-sparkle-huggies', 'Petite 12mm huggie hoops embedded with lilac and crystal baguettes that catch the sunlight beautifully.', 'anti-tarnish', 'earrings', 299.00, 380.00, 20, 'In Stock', 5, true, false, false, true, false, false, true, 'New', 4.80, 14),
('prod-13', 'DB-SKU-0013', 'Pastel Blossom Korean Earrings', 'pastel-blossom-korean-earrings', 'Charming Korean-style asymmetrical floral blossom studs with subtle crystal shimmer. Perfect for everyday outings and casual dates.', 'budget-friendly', 'korean-earrings', 180.00, 240.00, 25, 'In Stock', 5, true, false, true, true, true, false, false, 'Trending ✨', 4.90, 21),
('prod-14', 'DB-SKU-0014', 'Delicate Layered Snake Chain', 'delicate-layered-snake-chain', 'A trendy flat snake link chain with golden sheen, perfect for wearing solo or stacking with your favorite pendants.', 'budget-friendly', 'chains', 199.00, 299.00, 28, 'In Stock', 5, true, false, false, true, false, false, false, 'Affordable Pick', 4.80, 16),
('prod-15', 'DB-SKU-0015', 'Pastel Daisy Charm Bracelet', 'pastel-daisy-charm-bracelet', 'Sweet daisy charm wristlet on a dainty link chain with lobster clasp and extension links.', 'budget-friendly', 'bracelets', 160.00, 220.00, 30, 'In Stock', 5, true, false, true, false, true, false, false, 'Cute Pick 🌸', 4.90, 27),
('prod-16', 'DB-SKU-0016', 'Stackable Crystal Bow Ring', 'stackable-crystal-bow-ring', 'Dainty micro-bow adjustable ring with sparkling crystal centerpiece. Easy to style and stack.', 'budget-friendly', 'rings', 140.00, 190.00, 30, 'In Stock', 5, true, false, false, true, false, false, false, 'Fashion Gem', 4.70, 12)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    selling_price = EXCLUDED.selling_price,
    mrp = EXCLUDED.mrp,
    stock_quantity = EXCLUDED.stock_quantity,
    stock_status = EXCLUDED.stock_status,
    category_id = EXCLUDED.category_id,
    subcategory_id = EXCLUDED.subcategory_id;

-- Initial Product Images
INSERT INTO public.product_images (product_id, image_url, sort_order, is_primary)
VALUES
('prod-1', 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80', 1, true),
('prod-2', 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=80', 1, true),
('prod-3', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80', 1, true),
('prod-4', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80', 1, true),
('prod-5', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80', 1, true),
('prod-6', 'https://images.unsplash.com/photo-1611591475878-751b32d0d086?auto=format&fit=crop&w=800&q=80', 1, true),
('prod-7', 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=800&q=80', 1, true),
('prod-8', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80', 1, true),
('prod-9', 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=800&q=80', 1, true),
('prod-10', 'https://images.unsplash.com/photo-1513885535727-862c21285366?auto=format&fit=crop&w=800&q=80', 1, true),
('prod-11', 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80', 1, true),
('prod-12', 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=800&q=80', 1, true),
('prod-13', 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80', 1, true),
('prod-14', 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=80', 1, true),
('prod-15', 'https://images.unsplash.com/photo-1611591475878-751b32d0d086?auto=format&fit=crop&w=800&q=80', 1, true),
('prod-16', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80', 1, true)
ON CONFLICT DO NOTHING;

-- Initial Private Product Costs (Admin Only 🔒)
-- Example: prod-14 Selling: 199, Cost: 50, Packing: 35, Total Internal: 85, Profit: 114
INSERT INTO public.product_costs (product_id, cost_price, packing_cost)
VALUES
('prod-1', 95.00, 35.00),
('prod-2', 110.00, 35.00),
('prod-3', 90.00, 35.00),
('prod-4', 70.00, 30.00),
('prod-5', 150.00, 45.00),
('prod-6', 80.00, 35.00),
('prod-7', 160.00, 40.00),
('prod-8', 60.00, 25.00),
('prod-9', 55.00, 25.00),
('prod-10', 320.00, 80.00),
('prod-11', 30.00, 20.00),
('prod-12', 85.00, 30.00),
('prod-13', 45.00, 25.00),
('prod-14', 50.00, 35.00),
('prod-15', 40.00, 25.00),
('prod-16', 35.00, 25.00)
ON CONFLICT (product_id) DO UPDATE SET
    cost_price = EXCLUDED.cost_price,
    packing_cost = EXCLUDED.packing_cost;

