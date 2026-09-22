import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ukouhgquakvmwxuyhexq.supabase.co';
const ANON_KEY = 'sb_publishable_lotBfd98AGrqqLZs9iUjRQ_3FHoG_Rc';

const supabase = createClient(SUPABASE_URL, ANON_KEY);

async function testAuth() {
  console.log('Testing admin login...');
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'admin@dreambasket.studio',
    password: 'admin' // testing common default or checking
  });
  console.log('Sign in result:', data?.session ? 'SESSION CREATED' : 'FAILED', error);

  if (error && error.status === 400) {
    console.log('Testing sign up for admin@dreambasket.com...');
    const { data: suData, error: suErr } = await supabase.auth.signUp({
      email: 'admin@dreambasket.com',
      password: 'admin_password_123',
    });
    console.log('Sign up result:', suData?.session ? 'SESSION CREATED' : 'NO SESSION (Confirmation required?)', suErr);
    if (suData?.user) {
      console.log('User created:', suData.user.id, suData.user.email);
    }
  }


}

testAuth();
