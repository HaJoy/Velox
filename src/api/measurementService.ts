import { isGetOneMeasurementResponse } from "@/guards/measurement.guard";
import { api } from "./axios";
import { getIP, getISP } from "./ipService";
import { isIpinfoResponse } from "@/guards/isp.guard";
import type { Measurement } from "@/types/measurement";


export const getAllMeasurements = async () => {
  try {
    const response = await api.get('/measurement');
    return response.data;
  } catch (error) {
    console.error('Error while fetching all measurements: ', error);
  }
};

type CreateMeasurementPayload = {
  downloadSpeed: number;
  uploadSpeed: number;
  ping: number;
};

export const createMeasurement = async (payload: CreateMeasurementPayload) => {

    try {
          // Detecta la IP publica del usuario
          const ipResponse = await getIP();
          const userIP = ipResponse.ip;

          // Detectar el ISP y pais segun origen de respuesta (db o IPinfo)
          const ispResponse = await getISP();
          let userISP = "Unavailable";
          let userCountry = "Unavailable";

          if (isGetOneMeasurementResponse(ispResponse)) {
            userISP = ispResponse.measurement.isp;
            userCountry = ispResponse.measurement.country;
          } else if (isIpinfoResponse(ispResponse)) {
            userISP = ispResponse.ispinfo.org;
            userCountry = ispResponse.ispinfo.country;
          }
          
          // const userISP = 'Test ISP'; // ISP de testeo
          

        const dataToSend = {
          userIP: userIP,
          isp: userISP,
          country: userCountry ?? "Unavailable",
          ...payload
        };
        console.log('Data being sent to /measurement:', dataToSend);

        const response = await api.post('/measurement', dataToSend);

        console.log('Measurement created succesfully.')
        return response.data;
        
    } catch (error) {
        console.error('Error trying to create measurement: ', error);
    }
}

type userHistoryResponse = {
  message: string;
  measurementHistory: Measurement[];
};

export const getUserHistory = async (): Promise<userHistoryResponse> => {

  try {
    const response = await api.get(`/measurement/history`);
    return response.data;
  } catch (error) {
    console.error('Error while fetching user history: ', error);
    return { message: 'Error fetching user history', measurementHistory: [] };
  }
};

type CountryISPData = {
  message: string;
  countries: { [key: string]: string[] };
};

export const getCountriesAndIsps = async (): Promise<CountryISPData> => {
  try {
    const response = await api.get('/measurement/countries');
    return response.data;
  } catch (error) {
    console.error('Error while fetching countries and ISPs: ', error);
    throw error;
  }
};