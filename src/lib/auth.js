import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co',
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key'
);

export const signUp = (email, pass) => supabase.auth.signUp({ email, password: pass });
export const signIn = (email, pass) => supabase.auth.signInWithPassword({ email, password: pass });
export const signOut = () => supabase.auth.signOut();
export const getUser = () => supabase.auth.getUser();
export const getSession = () => supabase.auth.getSession();
