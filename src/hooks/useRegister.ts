import { useState } from "react";
import { signUp } from "@/lib/supabase/auth";


/**
 * Custom hook para registro de usuario
 * @returns {Object} Un objeto con las siguientes propiedades:
 *   - `register`: Función asíncrona que recibe email y password, y devuelve una promesa que resuelve a un objeto con 'success' (booleano), 'data' (datos del usuario si éxito) o 'error' (detalles del error si falla)
 *   - `isLoading`: Booleano que indica si la operación de registro está en progreso
 *   - `error`: Cadena de texto con el mensaje de error o null si no hay error
 */
export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (email: string, password: string) => {
    
    setIsLoading(true);
    setError(null);
    try {
        const { data, error } = await signUp(email, password);

        if (error) {
            setError(error.message || "Unknown error while trying to register.");
            const errorMsg =
          error.message == "User already registered"
            ? "Ya hay un usuario con este correo electrónico."
            : error.message;
          return { success: false, error: errorMsg };
        }

      return { success: true, data: data };
    } catch (err) {
      console.error(err);
      setError("Unknown register error");
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading, error };
};
