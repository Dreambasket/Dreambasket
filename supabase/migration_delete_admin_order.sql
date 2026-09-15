-- ==============================================================================
-- MIGRATION: Narrowly Scoped Admin Order Deletion RPC
-- Allows authenticated/anon Admin UI to safely delete non-protected orders
-- without granting direct DELETE permissions on public.orders or public.order_items.
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.delete_admin_order(p_order_id TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_order RECORD;
    v_payment_status TEXT;
    v_order_status TEXT;
    v_is_uuid BOOLEAN;
BEGIN
    -- 1. Validate input
    IF p_order_id IS NULL OR trim(p_order_id) = '' THEN
        RAISE EXCEPTION 'Invalid order ID provided.';
    END IF;

    -- 2. Check if p_order_id is formatted as a UUID
    v_is_uuid := p_order_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

    -- 3. Find the target order
    IF v_is_uuid THEN
        SELECT id, order_id, payment_status, order_status
        INTO v_order
        FROM public.orders
        WHERE id = p_order_id::UUID;
    ELSE
        SELECT id, order_id, payment_status, order_status
        INTO v_order
        FROM public.orders
        WHERE order_id = p_order_id;
    END IF;

    -- If not found by primary lookup and not uuid, fallback to text match on id::text
    IF v_order.id IS NULL AND NOT v_is_uuid THEN
        SELECT id, order_id, payment_status, order_status
        INTO v_order
        FROM public.orders
        WHERE id::TEXT = p_order_id;
    END IF;

    IF v_order.id IS NULL THEN
        RAISE EXCEPTION 'Order not found: %', p_order_id;
    END IF;

    -- 4. Check protected statuses
    v_payment_status := UPPER(COALESCE(v_order.payment_status, ''));
    v_order_status := LOWER(COALESCE(v_order.order_status, ''));

    IF v_order_status IN ('delivered', 'shipped', 'packed', 'confirmed', 'completed') OR
       v_payment_status IN ('PAYMENT_VERIFIED', 'PAID') THEN
        RAISE EXCEPTION 'Protected order cannot be deleted. Paid/Confirmed/Shipped/Delivered/Completed orders are protected from deletion.';
    END IF;

    -- 5. Delete order items explicitly
    DELETE FROM public.order_items
    WHERE order_id = v_order.id;

    -- 6. Delete order
    DELETE FROM public.orders
    WHERE id = v_order.id;

    RETURN jsonb_build_object(
        'success', true,
        'deleted_id', v_order.id,
        'deleted_order_id', v_order.order_id
    );
END;
$$;

-- Revoke default public execution rights and grant explicitly to anon and authenticated
REVOKE ALL ON FUNCTION public.delete_admin_order(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.delete_admin_order(TEXT) TO anon, authenticated;
