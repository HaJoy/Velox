// Funciones para preparar los datos del dashboard

import type { Measurement } from "@/types/measurement";

/**
 * Prepara los datos para las graficas.
 * @param measurements
 * @returns `chartData` - Objeto que contiene los datos importantes
 * para las graficas
 */
export const formatChartData = (measurements: Measurement[]) => {
  const chartData = measurements.map((measurement) => ({
    date: new Date(measurement.createdAt).toLocaleDateString(),
    time: new Date(measurement.createdAt).toLocaleTimeString(),
    downloadSpeed: measurement.downloadSpeed,
    uploadSpeed: measurement.uploadSpeed,
    avgRTT: measurement.avgRTT,
  }));

  return chartData;
};

/**
 * Calcula el promedio de velocidad de descarga, de subida, y ping
 * @param measurements 
 * @returns `{ avgDownloadSpeed, avgUploadSpeed, avgPing }` - El promedio de los tres valores.
 */
export const calcAvgs = (measurements: Measurement[]) => {
  const avgDownloadSpeed =
    measurements.length > 0
      ? (
          measurements.reduce((sum, m) => sum + m.downloadSpeed, 0) /
          measurements.length
        ).toFixed(2)
      : 0;

  const avgUploadSpeed =
    measurements.length > 0
      ? (
          measurements.reduce((sum, m) => sum + m.uploadSpeed, 0) /
          measurements.length
        ).toFixed(2)
      : 0;

  const avgPing =
    measurements.length > 0
      ? (
          measurements.reduce((sum, m) => sum + m.avgRTT, 0) / measurements.length
        ).toFixed(2)
      : 0;

  return { avgDownloadSpeed, avgUploadSpeed, avgPing };
};

/**
 * Calcula los datos necesarios para las graficas que comparan ISPs
 * @param measurements 
 * @returns `{ ispDistribution, ispPieData, ispAverages }` - Distribucion, datos
 * preaprados y promedios de ISPs
 */
export type ISPMetric = "Descarga (Mbps)" | "Subida (Mbps)" | "Ping (ms)";

export const calcISPdata = (
  measurements: Measurement[],
  sortMetric: ISPMetric = "Descarga (Mbps)",
) => {

  // Calcular distribución de ISPs
  const ispDistribution = measurements.reduce(
    (acc: { [key: string]: number }, m) => {
      acc[m.isp] = (acc[m.isp] || 0) + 1;
      return acc;
    },
    {},
  );

  const ispPieData = Object.entries(ispDistribution).map(([name, value]) => ({
    name,
    value,
  }));

  // Calcular promedios por ISP
  const ispAverages = measurements.reduce(
    (
      acc: {
        [key: string]: { download: number[]; upload: number[]; avgRTT: number[] };
      },
      m,
    ) => {
      if (!acc[m.isp]) {
        acc[m.isp] = { download: [], upload: [], avgRTT: [] };
      }
      acc[m.isp].download.push(m.downloadSpeed);
      acc[m.isp].upload.push(m.uploadSpeed);
      acc[m.isp].avgRTT.push(m.avgRTT);
      return acc;
    },
    {},
  );

  // Formatear, ordenar y limitar los datos de la grafica de barras.
  const ispBarData = Object.entries(ispAverages)
    .map(([name, data]) => ({
      name,
      "Descarga (Mbps)": parseFloat((data.download.reduce((a, b) => a + b, 0) / data.download.length).toFixed(2)),
      "Subida (Mbps)": parseFloat((data.upload.reduce((a, b) => a + b, 0) / data.upload.length).toFixed(2)),
      "Ping (ms)": parseFloat((data.avgRTT.reduce((a, b) => a + b, 0) / data.avgRTT.length).toFixed(2)),
    }))
    .sort((a, b) => b[sortMetric] - a[sortMetric] || a.name.localeCompare(b.name))
    .slice(0, 5);

  return { ispDistribution, ispPieData, ispAverages, ispBarData };
};
