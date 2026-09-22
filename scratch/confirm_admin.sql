-- DREAMBASKET: CONFIRM ADMIN EMAIL IN SUPABASE AUTH
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/ukouhgquakvmwxuyhexq/sql

UPDATE auth.users
SET email_confirmed_at = now()
WHERE email = 'admin@dreambasket.com';
