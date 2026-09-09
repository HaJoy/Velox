import { useAuth } from "@/context/AuthContext"
import { Navigate } from "react-router-dom"

/**
 * Componente que protege a las páginas que requieran autenticación.
 * Lee la sesión del usuario, si está autenticado lo mantiene en la
 * página protegida, si no, lo redirige inmediatamente a `Home.tsx`.
 * @param children La página protegida. 
 * @returns Un `div` vacío mientas obtiene la sesión. `children` si
 * el usuario está autenticado. `Navigate` hacia `Home.tsx` si no
 * está autenticado.
 */
export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {

  // Obtener la sesión
  const { session, authLoading } = useAuth();

  return (
    <>
        {/* Mientras se obtiene la sesión devuelve un div vacío, despues comprueba
            la existencia de la sesión.
        */}
        {authLoading ? <div></div> : session ? <>{children}</> : <Navigate to="/" />}
    </>
  )
}
