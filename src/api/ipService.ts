import { isIpifyResponse, isIpinfoResponse } from "@/guards/isp.guard";
import { isGetOneMeasurementResponse } from "@/guards/measurement.guard";
import type { ipinfoResponse } from "@/types/isp";
import type { GetOneMeasurementResponse } from "@/types/measurement";
import axios from "axios";
import { api } from "./axios";

/**
 * Obtiene la direccion IP publica del usuario
 * @returns La direccion IPv4 o IPv6 publica del usuario (`string`)
 */
export const getIP = async () => {
    const response = await axios.get('https://api64.ipify.org?format=json');
    const data = response.data;
    if (isIpifyResponse(data)) {
        return data;
    } else {
        throw new Error("Invalid response from ipify");
    }
}

/**
 * Obtiene el ISP del usuario
 * @returns El ISP del usuario (`string`)
 */
export const getISP = async (): Promise<ipinfoResponse | GetOneMeasurementResponse> => {
    const clientIP = await getIP();
    try {
        // Primero buscar la IP en la base de datos para obtener su ISP
        // de mediciones previas.
        const response = await api.post(`/measurement/isp`, { ip: clientIP.ip });
        if (isGetOneMeasurementResponse(response.data)) {
            return response.data;
        } else {
            throw new Error("Invalid response from server.");
        }
    } catch (primaryError) {
        /**
         * Si ocurrio en error de respuesta invalida del servidor, avisar por consola
         * para diagnostico.
         * Es normal que ocurran erroes Not Found (404) si la IP actual del usuario
         * no existe en la base de datos, asi que no se envian a consola.
        */
        if (primaryError instanceof Error && primaryError.message == "Invalid response from server.") {
            console.error("Invalid response from server, trying to get ISP with IPinfo, the error was:", primaryError); 
        }

        // Independientemente del error, realizar el fallback a IPinfo
        try {
            const fallbackResponse = await api.post(`/isp`, { ip: clientIP.ip });
            const data = fallbackResponse.data;
            if (isIpinfoResponse(data)) {
                return data;
            } else {
                throw new Error("Invalid response from IPinfo");
            }
        } catch (fallbackError) {
            throw new AggregateError(
                [primaryError, fallbackError],
                "Could not obtain ISP from server or IPinfo"
            )
        }
    }
}