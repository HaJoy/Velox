import { useState } from "react";
import { signOut } from "@/lib/supabase/auth";

/**
 * Custom hook para cierre de sesion de usuario
 * @returns {Object} Un objeto con las siguientes propiedades:
 *   - `logout`: Función asíncrona que devuelve una promesa que resuelve a un objeto con 'success' (booleano) o 'error' (detalles del error si falla)
 *   - `isLoading`: Booleano que indica si la operación de cierre de sesion está en progreso
 *   - `error`: Cadena de texto con el mensaje de error o null si no hay error
 */
export const useLogout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logout = async () => {
    
    setIsLoading(true);
    setError(null);
    try {
        const { error } = await signOut();

        if (error) {
            console.error(error.message);
            setError(error.message || "Unknown error while trying to logout.");
        }

      return { success: true };
    } catch (err) {
      console.error(err);
      setError("Unknown logout error");
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  };

  return { logout, isLoading, error };
};