import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ukouhgquakvmwxuyhexq.supabase.co';
const ANON_KEY = 'sb_publishable_lotBfd98AGrqqLZs9iUjRQ_3FHoG_Rc';

const supabase = createClient(SUPABASE_URL, ANON_KEY);

async function testDeleteOrder() {
  console.log('--- TESTING ORDER DELETION LOGIC ---');
  const testOrderNum = `DB-TEST-${Date.now().toString().slice(-6)}`;

  // 1. Create test order
  const { data: order, error: insertErr } = await supabase.from('orders').insert([{
    order_id: testOrderNum,
    customer_name: 'Test Delete User',
    phone: '9998887776',
    delivery_address: '123 Delete Street',
    subtotal: 150.00,
    delivery_charge: 0.00,
    final_total: 150.00,
    payment_status: 'Pending',
    order_status: 'New'
  }]).select().single();

  if (insertErr) {
    console.error('Failed to create test order:', insertErr);
    return;
  }
  console.log(`✓ Test order created with order_id (TEXT): "${order.order_id}" and id (UUID): "${order.id}"`);

  const { data: prods } = await supabase.from('products').select('id').limit(1);
  const realProdId = prods && prods[0] ? prods[0].id : null;

  // 2. Insert test order item if product exists
  if (realProdId) {
    const { data: item, error: itemErr } = await supabase.from('order_items').insert([{
      order_id: order.id, // Foreign key referencing orders.id (UUID)
      product_id: realProdId,
      product_name_snapshot: 'Test Product',
      quantity: 1,
      product_price: 150.00,
      item_total: 150.00
    }]).select().single();

    if (itemErr) {
      console.error('Failed to create order item:', itemErr);
      return;
    }
    console.log(`✓ Test order item created (ID: ${item.id}) referencing order UUID (${item.order_id}).`);
  }

  // 3. Test deleting order as authenticated admin by string order_id (e.g. "DB-TEST-XXXXXX")
  await supabase.auth.signInWithPassword({
    email: 'admin@dreambasket.com',
    password: 'admin_password_123',
  });

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(testOrderNum);
  let deleteQuery = supabase.from('orders').delete();
  if (isUuid) {
    deleteQuery = deleteQuery.eq('id', testOrderNum);
  } else {
    deleteQuery = deleteQuery.eq('order_id', testOrderNum);
  }

  const { error: delErr } = await deleteQuery;
  if (delErr) {
    console.error('❌ Deletion failed with error:', delErr);
  } else {
    console.log(`✓ Successfully deleted order by order_id string "${testOrderNum}" with ZERO UUID errors!`);

    // Verify cascade deletion of order_items
    const { data: itemsLeft } = await supabase.from('order_items').select('*').eq('order_id', order.id);
    if (itemsLeft && itemsLeft.length > 0) {
      console.error('❌ Cascade delete failed: order_items still exist.');
    } else {
      console.log('✓ Order items automatically cascade-deleted via PostgreSQL foreign key constraint!');
    }
  }
}

testDeleteOrder();
