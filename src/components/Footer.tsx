import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";

export const Footer = () => {
  const { user } = useAuth();

  return (
    <div className="w-full bg-[#111116] border-t p-5">
      <div className="flex flex-col gap-3">
        <div>
          <h3 className="font-bold my-3">Velox</h3>
          <nav className="flex flex-col gap-3 text-gray-300 hover:underline hover:underline-offset-4 hover:text-white">
            {user && (
              <>
                <Link to={"/"}>Inicio</Link>
                <Link to={"/dashboard"}>Dashboard</Link>
              </>
            )}
            <Link to={"/privacy"}>Política de privacidad</Link>
          </nav>
        </div>

        <div className="flex justify-center">
          <Link to={"/"}>
            <img src="/icon.png" alt="Velox" height={300} width={300} />
          </Link>
        </div>
      </div>
    </div>
  );
};
