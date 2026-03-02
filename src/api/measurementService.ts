import { api } from "./axios";


export const getAllMeasurements = async () => {
  try {
    const response = await api.get('/measurement');
    return response.data;
  } catch (error) {
    console.error('Error while fetching all measurements: ', error);
  }
};

export const createMeasurement = async (payload: any) => {
    try {
        const response = await api.post('/measurement', payload);
        return response.data;
    } catch (error) {
        console.error('Error trying to create measurement: ', error);
    }
}
