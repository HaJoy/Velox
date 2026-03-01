import { isIpifyResponse, isIpinfoResponse } from "@/guards/isp.guard";
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
export const getISP = async () => {
    const clientIP = await getIP();
    try {
        const response = await axios.post(`http://localhost:${import.meta.env.VITE_PORT}/api/measurements/isp`, { ip: clientIP.ip });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            const fallbackResponse = await axios.post(`http://localhost:${import.meta.env.VITE_PORT}/api/isp`, { ip: clientIP.ip });
            const data = fallbackResponse.data;
            if (isIpinfoResponse(data)) {
                // console.log(data);
                return data;
            } else {
                throw new Error("Invalid response from ipinfo");
            }
        } else {
            throw error;
        }
    }
}