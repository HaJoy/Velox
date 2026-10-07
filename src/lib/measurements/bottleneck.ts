import type { TCPInfo } from "@/types/ndt7";

export type BottleneckLocation = "red" | "cliente" | "servidor" | "desconocido";

export interface BottleneckResult {
  location: BottleneckLocation;
  networkPercent: number; // % del tiempo limitado por la red (cwnd)
  clientPercent: number; // % del tiempo limitado por el cliente (rwnd)
  serverPercent: number; // % del tiempo limitado por el servidor (sndbuf)
}

/**
 * Calcula donde estuvo el cuello de botella de la prueba de descarga
 * usando los campos `BusyTime`, `RWndLimited` y `SndBufLimited` del TCPInfo
 * del servidor (solo valido durante la descarga).
 * @param tcpInfo El TCPInfo del ultimo mensaje del servidor (o `LastServerMeasurement`).
 * @returns {BottleneckResult} Ubicacion y porcentajes de congestion.
 */
export const calculateBottleneck = (
  tcpInfo: Pick<TCPInfo, "BusyTime" | "RWndLimited" | "SndBufLimited">,
): BottleneckResult => {
    
    const busyTime = tcpInfo?.BusyTime ?? 0;

    // Si busyTime no existe...
    if (busyTime <= 0) {
        return {
            location: "desconocido",
            networkPercent: 0,
            clientPercent: 0,
            serverPercent: 0,
        }
    }

    const rwndLimited = tcpInfo?.RWndLimited ?? 0;
    const sndBufLimited = tcpInfo?.SndBufLimited ?? 0;
    // Tiempo limitado por la ventana de congestion (no viene explicito, se calcula por diferencia)
    const cwndLimited = Math.max(busyTime - rwndLimited - sndBufLimited);

    // Calcular porcentajes de congestion
    const clientPercent = (rwndLimited / busyTime) * 100;
    const serverPercent = (sndBufLimited / busyTime) * 100;
    const networkPercent = (cwndLimited / busyTime) * 100;

    // Detectar ubicacion del cuello de botella
    let location: BottleneckLocation = "red";
    if (rwndLimited >= sndBufLimited && rwndLimited >= cwndLimited) {
        location = "cliente";
    }
    if (sndBufLimited > rwndLimited && sndBufLimited >= cwndLimited) {
        location = "servidor";
    }

    return { location, networkPercent, clientPercent, serverPercent };
};
