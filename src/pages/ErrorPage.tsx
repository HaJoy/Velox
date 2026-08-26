import { Card } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";


export const ErrorPage = () => {

    const [count, setCount] = useState(5);
    const navigate = useNavigate();

    useEffect(() => {
        if (count === 0) {
            navigate("/");
            return;
        }

        const timer = setInterval(() => {
            setCount((prevCount) => prevCount - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [count, navigate]);

  return (
    <div className="flex justify-center items-center h-[500px]">
        <Card className="flex flex-col justify-center bg-[#0b0b0f] p-10">
            <h1 className="text-8xl">404</h1>
            <h2>Página no encontrada</h2>
            <p>Se le redireccionará al inicio en {count} segundos.</p>
        </Card>
    </div>
  )
}
