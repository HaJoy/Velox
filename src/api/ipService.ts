import axios from "axios";

/**
 * Obtiene la direccion IP publica del usuario
 * @returns La direccion IPv4 o IPv6 publica del usuario (`string`)
 */
export const getIP = async () => {
    const response = await axios.get('https://api64.ipify.org?format=json');
    console.log(response.data);
    return response.data;
}

/**
 * Obtiene el ISP del usuario
 * @returns El ISP del usuario (`string`)
 */
export const getISP = async () => {
    const clientIP = await getIP();
    const response = await axios.post('http://localhost:3030/api/speedtest', { ip: clientIP.ip });
    console.log(response.data);
    return response.data;
}