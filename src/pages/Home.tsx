import { getIP, getISP } from "@/api/ipService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNdt7 } from "@/hooks/useNdt7";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import ReactSpeedometer from "react-d3-speedometer";
import { MeasurementsTable } from "@/components/MeasurementsTable";
import { isIpinfoResponse } from "@/guards/isp.guard";
import { isGetOneMeasurementResponse } from "@/guards/measurement.guard";
import { Download, Signal, Upload } from "lucide-react";

// Este componente es toda la pagina de la aplicacion.
export const Home = () => {
  // Obtener las metricas a traves del custom hook.
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);

  const { downloadSpeed, uploadSpeed, pingAvg, downloadPing, uploadPing, complete, testTime, isDownStream, downloadComplete, uploadComplete, startTest } =
    useNdt7({ onMeasurementSaved: () => setHistoryRefreshKey((value) => value + 1) });

  const { session, user } = useAuth();

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

        const ispRaw = await getISP();
        // Parsear el ISP segun la respuesta
        let isp = "";
        if (isGetOneMeasurementResponse(ispRaw)) {
          isp = ispRaw.measurement.isp;
        }
        if (isIpinfoResponse(ispRaw)) {
          isp = ispRaw.ispinfo.org;
        }
        // Quitar el AS#####
        const parsedISP = isp.split(' ').slice(1).join(' ');
        // const isp = "UNE TELECOMUNICACIONES S.A";

        setUserIsp(parsedISP);
        setIspErrorMsg("");
      } catch (error) {
        console.error("Failed to fetch user ISP: ", error);
        setUserIsp("No disponible");
        setIspErrorMsg("No se pudo obtener el proveedor");
      }
    };

    fetchPublicIP();
  }, []);

  return (
    <div className="flex flex-col items-center h-full min-w-[285px]">
      <div className="flex justify-center w-full">
        <Card className="w-full bg-[#0b0b0f]">
          <CardHeader>
            <CardTitle>Mide tu velocidad de internet</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col gap-10">
              <div className="flex justify-center gap-8 w-full md:text-base">
                {/* Mediciones de velocidad */}
                <div className="w-1/2 grid grid-cols-1 grid-rows-2">
                  <div>
                    <h2>Descarga</h2>
                    <span className="text-base md:text-2xl font-bold">{`${(downloadComplete && downloadSpeed) || 0} Mb/s`}</span>
                  </div>
                  <div className="flex justify-center items-center gap-2 text-sm text-muted-foreground mt-2">
                    <Download className="text-blue-500" />
                    <span>{`${(downloadPing && downloadPing !== Infinity ? downloadPing.toFixed(1) : 0)} ms`}</span>
                  </div>
                </div>
                <div className="w-1/2">
                  <h2>RTT promedio</h2>
                  <div className={`flex justify-center items-center gap-2 text-sm mt-2 ${!complete ? 'text-muted-foreground' : 'font-bold'}`}>
                    <Signal />
                    <span>{`${(pingAvg && pingAvg !== Infinity ? pingAvg.toFixed(1) : 0)} ms`}</span>
                  </div>
                </div>
                <div className="w-1/2 grid grid-cols-1 grid-rows-2">
                  <div>
                    <h2>Subida</h2>
                    <span className="text-base md:text-2xl font-bold">{`${(uploadComplete && uploadSpeed) || 0} Mb/s`}</span>
                  </div>
                  <div className="flex justify-center items-center gap-2 text-sm text-muted-foreground mt-2">
                    <Upload className="text-pink-300" />
                    <span>{`${(uploadPing && uploadPing !== Infinity ? uploadPing.toFixed(1) : 0)} ms`}</span>
                  </div>
                </div>
              </div>

              {/* Velocimetro */}
              <div className="flex justify-center w-full">
                <ReactSpeedometer
                  minValue={0}
                  maxValue={100}
                  value={!complete? isDownStream? downloadSpeed : uploadSpeed : 0}
                  currentValueText={`${!complete? isDownStream? downloadSpeed : uploadSpeed : 0} Mb/s`}
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

              {/* Tabla de historial del usuario (solo si está autenticado) */}
              {user && <MeasurementsTable user={user} refreshKey={historyRefreshKey} />}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
