// Supabase Client Wrapper
// Reads environment variables safely without exposing private/service-role keys.
// When environment keys are absent, the application gracefully falls back to local storage.

import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'https://your-project.supabase.co' &&
    supabaseAnonKey !== 'your-anon-public-key-here' &&
    supabaseUrl.startsWith('https://')
  );
};

export const getSupabaseConfig = () => {
  return {
    url: supabaseUrl,
    anonKey: supabaseAnonKey,
    isConfigured: isSupabaseConfigured(),
  };
};

// Create client instance if configured, otherwise null
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

// Storage upload helper
export const uploadStorageFile = async (bucketName, file, path) => {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  const fileExt = file.name ? file.name.split('.').pop() : 'jpg';
  const filePath = path || `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${fileExt}`;

  const { data, error } = await supabase.storage.from(bucketName).upload(filePath, file, {
    cacheControl: '3600',
    upsert: true,
  });

  if (error) {
    console.error(`Error uploading to ${bucketName}:`, error);
    throw error;
  }

  const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(data.path);
  return {
    path: data.path,
    publicUrl: publicUrlData.publicUrl,
  };
};
