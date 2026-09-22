import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ukouhgquakvmwxuyhexq.supabase.co';
const ANON_KEY = 'sb_publishable_lotBfd98AGrqqLZs9iUjRQ_3FHoG_Rc';

const supabase = createClient(SUPABASE_URL, ANON_KEY);

async function test() {
  const { data, error } = await supabase.from('product_purchase_history').select('*');
  console.log('product_purchase_history result:', data, error);
}

test();
