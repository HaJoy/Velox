import { useAuth } from "@/context/AuthContext"
import { Navigate } from "react-router-dom"

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {

    const { session } = useAuth();


  return (
    <>
        {session ? <>{children}</> : <Navigate to="/" />}
    </>
  )
}
