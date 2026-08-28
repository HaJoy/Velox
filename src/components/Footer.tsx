import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";

export const Footer = () => {
  const { user } = useAuth();

  return (
    <div className="w-full bg-[#111116] border-t px-6 py-0">
      <div className="flex flex-col gap-3 lg:flex-row lg:justify-around mx-auto py-8 max-w-[1500px]">
        <div>
          <h3 className="font-bold my-3 text-xl">Velox</h3>
          <nav className="flex flex-col gap-3 text-gray-300">
            {user && (
              <>
                <Link
                  to={"/"}
                  className="hover:underline hover:underline-offset-4 hover:text-white"
                >
                  Inicio
                </Link>
                <Link
                  to={"/dashboard"}
                  className="hover:underline hover:underline-offset-4 hover:text-white"
                >
                  Dashboard
                </Link>
              </>
            )}
            <Link
              to={"/privacy"}
              className="hover:underline hover:underline-offset-4 hover:text-white"
            >
              Política de privacidad
            </Link>
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
