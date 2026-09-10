import { signOut } from "@/lib/supabase/auth";
import { supabase } from "@/lib/supabase/client";
import type { Session, User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  logout: () => Promise<void>;
  authLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({ children }: { children: React.ReactNode; }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {

    // Obtener sesion inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });

    // Escuchar cambios de sesion
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setAuthLoading(false);
    });

    // Evitar duplicar los listeners al montar un componente
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

    // Manejo de cierre de sesion
    const handleLogout = async () => {
      try {
        const { error } = await signOut();
        if (error) console.error(error.message);
      } catch (err) {
        console.error(err);
      }
    };

  return (
    <AuthContext.Provider
      value={{ session, user: session?.user ?? null, logout: handleLogout, authLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
};
