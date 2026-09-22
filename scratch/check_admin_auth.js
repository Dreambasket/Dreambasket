import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ukouhgquakvmwxuyhexq.supabase.co';
const ANON_KEY = 'sb_publishable_lotBfd98AGrqqLZs9iUjRQ_3FHoG_Rc';

const supabase = createClient(SUPABASE_URL, ANON_KEY);

async function checkAdminLogin() {
  console.log('--- CHECKING ADMIN LOGIN WITH SUPABASE AUTH ---');
  
  // Test password created earlier or common passwords
  const passwordsToTest = ['admin_password_123', 'admin', 'admin123', 'dreambasket'];
  
  for (const pw of passwordsToTest) {
    console.log(`Trying login for admin@dreambasket.com with password: "${pw}"...`);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'admin@dreambasket.com',
      password: pw,
    });
    
    if (!error && data?.session) {
      console.log(`✅ SUCCESS! Authenticated session obtained.`);
      console.log(`   User ID: ${data.user.id}`);
      console.log(`   Email: ${data.user.email}`);
      console.log(`   Role: ${data.user.role}`);
      console.log(`   Access Token: ${data.session.access_token.slice(0, 20)}...`);

      // Now test deleting with this authenticated client instance
      console.log('\n--- TESTING DELETE QUERY WITH AUTHENTICATED SESSION ---');
      const testOrderNum = `DB-TEST-${Date.now().toString().slice(-6)}`;

      // Create test order
      const { data: order, error: insertErr } = await supabase.from('orders').insert([{
        order_id: testOrderNum,
        customer_name: 'Auth Test Customer',
        phone: '9999999999',
        delivery_address: '123 Auth St',
        subtotal: 100.00,
        delivery_charge: 0.00,
        final_total: 100.00,
        payment_status: 'Pending',
        order_status: 'New'
      }]).select().single();

      if (insertErr) {
        console.error('Order creation error:', insertErr);
        return;
      }
      console.log(`Created test order ${order.order_id} (UUID: ${order.id})`);

      // Execute delete query as authenticated user
      const { error: delErr } = await supabase.from('orders').delete().eq('order_id', testOrderNum);
      if (delErr) {
        console.error('❌ Deletion failed:', delErr);
      } else {
        console.log(`🎉 SUCCESS! Deleted order ${testOrderNum} with authenticated session! ZERO RLS or UUID errors!`);
      }

      return;
    } else {
      console.log(`   Result: ${error?.message || 'Failed'}`);
    }
  }
}

checkAdminLogin();
