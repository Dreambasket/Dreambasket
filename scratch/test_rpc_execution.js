import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ukouhgquakvmwxuyhexq.supabase.co';
const ANON_KEY = 'sb_publishable_lotBfd98AGrqqLZs9iUjRQ_3FHoG_Rc';

const supabase = createClient(SUPABASE_URL, ANON_KEY);

async function testRpc() {
  console.log('Testing delete_admin_order RPC call with non-existent order...');
  const { data, error } = await supabase.rpc('delete_admin_order', {
    p_order_id: 'NON_EXISTENT_ORDER_9999'
  });

  console.log('Result data:', data);
  console.log('Result error:', error);
}

testRpc();
