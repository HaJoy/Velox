import { signIn, signOut, signUp } from "@/lib/supabase/auth";
import { supabase } from "@/lib/supabase/client";
import type { Session } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext({});

interface AuthProps {
  children: React.ReactNode;
};

export const AuthContextProvider = ({ children }: AuthProps) => {
  const [session, setSession] = useState<Session | null>();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    })
  }, [])
  
  

  return (
    <AuthContext.Provider value={{ session, signUp, signIn, signOut }}>{children}</AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};