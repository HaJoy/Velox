import { useState } from "react";
import { signIn } from "@/lib/supabase/auth";

/**
 * Custom hook para logeo de usuario
 * @returns {Object} Un objeto con las siguientes propiedades:
 *   - `login`: Función asíncrona que recibe email y password, y devuelve una promesa que resuelve a un objeto con 'success' (booleano), 'data' (datos del usuario si éxito) o 'error' (detalles del error si falla)
 *   - `isLoading`: Booleano que indica si la operación de login está en progreso
 *   - `error`: Cadena de texto con el mensaje de error o null si no hay error
 */
export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    
    setIsLoading(true);
    setError(null);
    try {
        const { data, error } = await signIn(email, password);

        if (error) {
            console.error(error.message);
            setError(error.message || "Unknown error while trying to login.");
        }

      return { success: true, data: data };
    } catch (err) {
      console.error(err);
      setError("Unknown login error");
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
};
