// Funciones para preparar los datos del dashboard

import type { Measurement } from "@/types/measurement";

export const formatChartData = (measurements: Measurement[]) => {
    const chartData = measurements.map((measurement) => ({
    date: new Date(measurement.createdAt).toLocaleDateString(),
    time: new Date(measurement.createdAt).toLocaleTimeString(),
    downloadSpeed: measurement.downloadSpeed,
    uploadSpeed: measurement.uploadSpeed,
    ping: measurement.ping,
  }));

  return chartData;
};

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
      ? (measurements.reduce((sum, m) => sum + m.ping, 0) / measurements.length).toFixed(2)
      : 0;

    return { avgDownloadSpeed, avgUploadSpeed, avgPing };
};