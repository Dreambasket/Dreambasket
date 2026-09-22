import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ukouhgquakvmwxuyhexq.supabase.co';
const ANON_KEY = 'sb_publishable_lotBfd98AGrqqLZs9iUjRQ_3FHoG_Rc';

const supabase = createClient(SUPABASE_URL, ANON_KEY);

async function inspect() {
  try {
    const { data: products, error: pErr } = await supabase.from('products').select('*').limit(1);
    console.log('Products sample:', products, pErr);

    const { data: orders, error: oErr } = await supabase.from('orders').select('*').limit(1);
    console.log('Orders sample:', orders, oErr);

    const { data: items, error: iErr } = await supabase.from('order_items').select('*').limit(1);
    console.log('Order items sample:', items, iErr);

    const { data: history, error: hErr } = await supabase.from('product_purchase_history').select('*').limit(1);
    console.log('Purchase history sample:', history, hErr);
  } catch (err) {
    console.error('Error:', err);
  }
}

inspect();

