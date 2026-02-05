import { getIP, getISP } from "@/api/ipService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNdt7 } from "@/hooks/useNdt7";
import { useEffect, useState } from "react";
import ReactSpeedometer from "react-d3-speedometer";

// Este componente es toda la pagina de la aplicacion.
export const Home = () => {
  // Obtener las metricas a traves del custom hook.
  const { downloadSpeed, uploadSpeed, complete, testTime, isDownStream, startTest } =
    useNdt7();
  
    const [publicIp, setPublicIp] = useState<string>("Cargando...");
    const [userIsp, setUserIsp] = useState<string>("Cargando...");
    const [ipErrorMsg, setIpErrorMsg] = useState<string>("");
    const [ispErrorMsg, setIspErrorMsg] = useState<string>("");
    
    useEffect(() => {
      
      const fetchPublicIP = async () => {
        try {
          const ipifyRaw = await getIP();
          const userPublicIP = ipifyRaw.ip;

          setPublicIp(userPublicIP);
          setIpErrorMsg("");
        } catch (error) {
          console.error("Failed to fetch user IP: ", error);
          setPublicIp("No disponible");
          setIpErrorMsg("No se pudo obtener la IP pública");
        }

        try {
          // Para el desarrollo se utilizara 'isp' como una variable estatica
          // para evitar requests innecesarias a ipinfo

          // const infoIpRaw = await getISP();
          // const isp = infoIpRaw.ispinfo.org.split(' ').slice(1).join(' ');
          const isp = "UNE TELECOMUNICACIONES S.A";

          setUserIsp(isp);
          setIspErrorMsg("");
        } catch (error) {
          console.error("Failed to fetch user ISP: ", error);
          setUserIsp("No disponible");
          setIspErrorMsg("No se pudo obtener el proveedor");
        }
      };
    
      fetchPublicIP();

    }, [])
    

  return (
    <div className="flex flex-col items-center h-full min-w-[285px]">
      {/* Titulo */}
      <header className="flex h-1/3 justify-center items-center">
        <h1 className="text-6xl md:text-8xl" lang="en">
          Velox
        </h1>
      </header>
      <main className="flex justify-center w-full">
        <Card className="w-full max-w-[562px]">
          <CardHeader>
            <CardTitle>Mide tu velocidad de internet</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col gap-10">
              <div className="flex justify-center gap-18 w-full md:text-base">
                {/* Mediciones de velocidad */}
                <div className="w-1/2">
                  <h2>Descarga</h2>
                  <span className="text-base md:text-2xl font-bold">{`${downloadSpeed || 0} Mb/s`}</span>
                </div>
                <div className="w-1/2">
                  <h2>Subida</h2>
                  <span className="text-base md:text-2xl font-bold">{`${uploadSpeed || 0} Mb/s`}</span>
                </div>
              </div>

              {/* Velocimetro */}
              <div className="flex justify-center w-full">
                <ReactSpeedometer
                  minValue={0}
                  maxValue={100}
                  value={isDownStream? downloadSpeed : uploadSpeed}
                  currentValueText={`${isDownStream? downloadSpeed : uploadSpeed} Mb/s`}
                  segmentColors={["#0000FF", "#0040FF", "#0080FF", "#00BFFF", "#00FFFF"]}
                  height={180}
                />
              </div>

              {/* Tiempo que duro la prueba */}
              <h3>Duración: {`${testTime.toFixed(1) || 0} segundos`}</h3>
              
              {/* Direccion IP e ISP del usuario */}
              <div>
                <div className="text-sm md:text-base">
                  <p>IP: {ipErrorMsg? ipErrorMsg : publicIp}</p>
                  <p>Proveedor: {ispErrorMsg? ispErrorMsg : userIsp}</p>
                </div>
              </div>

              {/* Boton para iniciar la prueba */}
              <div>
                <Button
                  className="w-[125px] hover:bg-primary/60 hover:cursor-pointer disabled:cursor-default"
                  onClick={startTest}
                  disabled={!complete}
                >
                  {complete ? "Iniciar" : "Calculando..."}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
