import { supabase } from "@/lib/supabase/client";

// Sign In
export const signIn = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });
};

// Sign Up
export const signUp = async (email: string, password: string) => {
  return await supabase.auth.signUp({
    email: email,
    password: password,
  });
};

// Sign Out
export const signOut = async () => {
  return await supabase.auth.signOut();
};
