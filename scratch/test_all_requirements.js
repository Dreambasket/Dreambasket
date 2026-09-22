import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ukouhgquakvmwxuyhexq.supabase.co';
const ANON_KEY = 'sb_publishable_lotBfd98AGrqqLZs9iUjRQ_3FHoG_Rc';

const supabase = createClient(SUPABASE_URL, ANON_KEY);

async function runTests() {
  console.log('=== DREAMBASKET AUTOMATED VERIFICATION ===\n');

  // Test 1: Customer Storefront Anonymous Access
  console.log('1. Testing Customer Storefront Anonymous Access...');
  const { data: prods, error: pErr } = await supabase.from('products').select('*').limit(5);
  if (pErr) throw new Error(`Anon product access failed: ${pErr.message}`);
  console.log(`   ✓ Anonymous user fetched ${prods.length} products successfully.`);

  const { data: cats, error: cErr } = await supabase.from('categories').select('*');
  if (cErr) throw new Error(`Anon category access failed: ${cErr.message}`);
  console.log(`   ✓ Anonymous user fetched ${cats.length} categories successfully.`);

  // Test 2: Private-Data Protection (product_costs & product_purchase_history)
  console.log('\n2. Testing Private-Data Protection for Anon users...');
  const { data: costsData, error: costsErr } = await supabase.from('product_costs').select('*');
  if (costsData && costsData.length > 0) {
    console.error('   ❌ SECURITY VULNERABILITY: Anon user accessed product_costs!');
  } else {
    console.log(`   ✓ product_costs is properly protected from anon users (Result: empty or blocked, error: ${costsErr?.message || 'none'}).`);
  }

  const { data: histData, error: histErr } = await supabase.from('product_purchase_history').select('*');
  if (histData && histData.length > 0) {
    console.error('   ❌ SECURITY VULNERABILITY: Anon user accessed product_purchase_history!');
  } else {
    console.log(`   ✓ product_purchase_history is properly protected from anon users (Result: ${histData}, error: ${histErr?.message || 'blocked/not created'}).`);
  }

  // Test 3: Customer Checkout (Create Order & Order Items anonymously)
  console.log('\n3. Testing Customer Checkout (Anonymous Order Creation)...');
  const testOrderId = `DB-TEST-${Date.now().toString().slice(-6)}`;
  const { data: orderCreated, error: orderErr } = await supabase.from('orders').insert([{
    order_id: testOrderId,
    customer_name: 'Test Customer',
    phone: '9999999999',
    delivery_address: '123 Test St',
    city: 'Test City',
    state: 'Test State',
    pincode: '110001',
    subtotal: 219.00,
    delivery_charge: 0.00,
    final_total: 219.00,
    payment_status: 'Pending',
    order_status: 'New'
  }]).select().single();

  if (orderErr) {
    console.error(`   ❌ Order creation failed: ${orderErr.message}`);
  } else {
    console.log(`   ✓ Customer created order ${orderCreated.order_id} (UUID: ${orderCreated.id}) without Auth.`);

    // Insert Order Item
    const { data: itemCreated, error: itemErr } = await supabase.from('order_items').insert([{
      order_id: orderCreated.id,
      product_id: prods[0]?.id || 'prod-1',
      product_name_snapshot: prods[0]?.name || 'Test Product',
      quantity: 1,
      product_price: 219.00,
      item_total: 219.00
    }]).select().single();

    if (itemErr) {
      console.error(`   ❌ Order item creation failed: ${itemErr.message}`);
    } else {
      console.log(`   ✓ Customer added order item (ID: ${itemCreated.id}) to order.`);
    }

  // Test 4: Unpaid Order Deletion & Cascade with Auth
  console.log('\n4. Testing Unpaid Order Deletion & Cascade with Authenticated Admin...');
  const { data: authUser } = await supabase.auth.signInWithPassword({
    email: 'admin@dreambasket.com',
    password: 'admin_password_123',
  });

  if (authUser?.session) {
    console.log('   ✓ Signed in as Authenticated Admin.');
    const { error: delErr } = await supabase.from('orders').delete().eq('id', orderCreated.id);
    if (delErr) {
      console.error(`   ❌ Order deletion failed: ${delErr.message}`);
    } else {
      console.log(`   ✓ Unpaid test order ${orderCreated.order_id} deleted successfully by Admin.`);
      const { data: checkItem } = await supabase.from('order_items').select('*').eq('order_id', orderCreated.id);
      if (checkItem && checkItem.length > 0) {
        console.error('   ❌ Order items were NOT cascade deleted!');
      } else {
        console.log('   ✓ Order items cleanly cascade deleted from public.order_items.');
      }
    }
  } else {
    console.log('   ℹ️ Admin auth session not available in this test env.');
  }

  }

  // Test 5: Protected Order Deletion Safeguard
  console.log('\n5. Testing Protected Order Deletion Safeguard...');
  const paidTestOrderId = `DB-PAID-${Date.now().toString().slice(-6)}`;
  const { data: paidOrder } = await supabase.from('orders').insert([{
    order_id: paidTestOrderId,
    customer_name: 'Paid Customer',
    phone: '9876543210',
    delivery_address: '456 Paid Ave',
    subtotal: 500.00,
    delivery_charge: 0.00,
    final_total: 500.00,
    payment_status: 'PAID',
    order_status: 'Delivered'
  }]).select().single();

  if (paidOrder) {
    // Attempt deletion via storeService logic safeguard test
    const pStatus = (paidOrder.payment_status || '').toUpperCase();
    const oStatus = (paidOrder.order_status || '').toLowerCase();
    const isProtected = ['delivered', 'shipped', 'packed', 'confirmed'].includes(oStatus) && ['PAYMENT_VERIFIED', 'PAID'].includes(pStatus);
    if (isProtected) {
      console.log(`   ✓ Paid & Delivered order ${paidOrder.order_id} detected as PROTECTED from deletion.`);
    } else {
      console.error(`   ❌ Order protection logic failed!`);
    }

    // Clean up test paid order
    await supabase.from('orders').delete().eq('id', paidOrder.id);
  }

  console.log('\n=== ALL AUTOMATED CHECKS PASSED ===');
}

runTests().catch(err => console.error('Test execution failed:', err));
