import { isIpifyResponse, isIpinfoResponse } from "@/guards/isp.guard";
import { isGetOneMeasurementResponse } from "@/guards/measurement.guard";
import type { ipinfoResponse } from "@/types/isp";
import type { GetOneMeasurementResponse } from "@/types/measurement";
import axios from "axios";

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
        const response = await axios.post(`http://localhost:${import.meta.env.VITE_PORT}/api/measurement/isp`, { ip: clientIP.ip });
        
        if (isGetOneMeasurementResponse(response.data)) {
            return response.data;
        } else {
            throw new Error("Invalid response from server.");
        }
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            const fallbackResponse = await axios.post(`http://localhost:${import.meta.env.VITE_PORT}/api/isp`, { ip: clientIP.ip });
            const data = fallbackResponse.data;
            if (isIpinfoResponse(data)) {
                return data;
            } else {
                throw new Error("Invalid response from ipinfo");
            }
        } else {
            throw error;
        }
    }
}