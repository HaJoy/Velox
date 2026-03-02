import { api } from "./axios";


export const getAllMeasurements = async () => {
  try {
    const response = await api.get('/measurement');
    return response.data;
  } catch (error) {
    console.error('Error while fetching all measurements: ', error);
  }
};
