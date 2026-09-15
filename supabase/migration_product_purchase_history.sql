-- ==============================================================================
-- DREAMBASKET MIGRATION: PRODUCT PURCHASE HISTORY & ORDER DELETION CASCADE
-- Admin-only internal financial data for wholesale buying prices & supplier tracking
-- ==============================================================================

-- 1. Create product_purchase_history table
CREATE TABLE IF NOT EXISTS public.product_purchase_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    supplier_name TEXT NOT NULL,
    buying_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    packaging_cost NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    selling_price_snapshot NUMERIC(12, 2) DEFAULT 0.00,
    purchase_date DATE NOT NULL DEFAULT CURRENT_DATE,
    notes TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Performance indexes for supplier filtering, product joins, and date sorting
CREATE INDEX IF NOT EXISTS idx_purchase_history_product_id ON public.product_purchase_history(product_id);
CREATE INDEX IF NOT EXISTS idx_purchase_history_supplier ON public.product_purchase_history(supplier_name);
CREATE INDEX IF NOT EXISTS idx_purchase_history_date ON public.product_purchase_history(purchase_date DESC);

-- 3. Row Level Security (RLS) Configuration
-- CRITICAL: Anonymous (public customer website) users must NEVER access this table!
ALTER TABLE public.product_purchase_history ENABLE ROW LEVEL SECURITY;

-- Clean existing policies if re-running
DROP POLICY IF EXISTS "Admin full access purchase history" ON public.product_purchase_history;
DROP POLICY IF EXISTS "Public read purchase history" ON public.product_purchase_history;

-- Policy for Authenticated Admin full access
CREATE POLICY "Admin full access purchase history" 
ON public.product_purchase_history 
FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);

-- Explicitly revoke public access
REVOKE ALL ON public.product_purchase_history FROM anon, public;

-- 4. Verify Order Items Cascade Deletion
-- Ensures that when an unpaid/cancelled order is deleted from public.orders,
-- all corresponding items in public.order_items are cleanly removed.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints tc
        JOIN information_schema.referential_constraints rc ON tc.constraint_name = rc.constraint_name
        WHERE tc.table_name = 'order_items' 
          AND rc.delete_rule = 'CASCADE'
    ) THEN
        -- Alter constraint if not already ON DELETE CASCADE
        ALTER TABLE public.order_items
        DROP CONSTRAINT IF EXISTS order_items_order_id_fkey,
        ADD CONSTRAINT order_items_order_id_fkey 
            FOREIGN KEY (order_id) 
            REFERENCES public.orders(id) 
            ON DELETE CASCADE;
    END IF;
END $$;

-- 5. ADMIN AUTHENTICATION SETUP INSTRUCTIONS
-- To log in to Dreambasket Admin with Supabase Auth:
-- Option A (Recommended — Supabase Dashboard):
--   1. Go to Supabase Dashboard -> Authentication -> Users.
--   2. Click "Add user" -> "Create user".
--   3. Enter Email: admin@dreambasket.studio (or your chosen email).
--   4. Enter your chosen password.
--   5. Toggle "Auto Confirm User?" to ON.
--   6. Click "Create user".
--
-- Option B (SQL Editor):
--   If your Supabase project allows direct auth.users creation, you can create it via:
--   INSERT INTO auth.users (
--       instance_id, id, aud, role, email, encrypted_password,
--       email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data,
--       raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
--   ) VALUES (
--       '00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated',
--       'admin@dreambasket.studio', crypt('YOUR_STRONG_PASSWORD', gen_salt('bf')),
--       now(), now(), now(), '{"provider":"email","providers":["email"]}',
--       '{"name":"Admin"}', now(), now(), '', '', '', ''
--   ) ON CONFLICT (email) DO NOTHING;

