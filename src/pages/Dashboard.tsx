import { getAllMeasurements } from "@/api/measurementService";
import { useEffect, useState } from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import type { Measurement } from "@/types/measurement.d";
import { Card } from "@/components/ui/card";

const downloadChartConfig = {
  downloadSpeed: {
    label: "Velocidad de Descarga (Mbps)",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

const uploadChartConfig = {
  uploadSpeed: {
    label: "Velocidad de Subida (Mbps)",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig;

const pingChartConfig = {
  ping: {
    label: "Ping (ms)",
    color: "hsl(var(--destructive))",
  },
} satisfies ChartConfig;

export const Dashboard = () => {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getMeasurements = async () => {
      try {
        const response = await getAllMeasurements();
        console.log(response);
        // Ordenar por fecha para mejor visualización en gráficas
        const measurementsArray = response.measurements || [];
        const sortedMeasurements = measurementsArray.sort(
          (a: Measurement, b: Measurement) => {
            return (
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
          },
        );
        setMeasurements(sortedMeasurements);
      } catch (error) {
        console.error(
          "Error trying to fetch measurements from Dashboard: ",
          error,
        );
      } finally {
        setLoading(false);
      }
    };

    getMeasurements();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Cargando datos...
      </div>
    );
  }

  if (measurements.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        No hay mediciones disponibles
      </div>
    );
  }

  // Preparar datos para las gráficas
  const chartData = measurements.map((measurement) => ({
    date: new Date(measurement.createdAt).toLocaleDateString(),
    time: new Date(measurement.createdAt).toLocaleTimeString(),
    downloadSpeed: measurement.downloadSpeed,
    uploadSpeed: measurement.uploadSpeed,
    ping: measurement.ping,
  }));

  return (
    <div>
      <div className="grid grid-cols-3 w-full h-full gap-4">
        {/* <h1 className="text-3xl font-bold">Dashboard de Mediciones</h1> */}

        {/* Gráfica de Velocidad de Descarga */}
        <Card className="space-y-2 p-5">
          <h2 className="text-xl font-semibold">
            Velocidad de Descarga vs Tiempo
          </h2>
          <ChartContainer config={downloadChartConfig} className="h-50">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 9, angle: -45, textAnchor: "end" }} />
              <YAxis
                label={{ value: "Mbps", angle: -90, position: "insideLeft", offset: 15 }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Line
                type="monotone"
                dataKey="downloadSpeed"
                stroke="#0080FF"
                dot={false}
                strokeWidth={2}
              />
            </LineChart>
          </ChartContainer>
        </Card>

        {/* Gráfica de Velocidad de Subida */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">
            Velocidad de Subida vs Tiempo
          </h2>
          <ChartContainer config={uploadChartConfig} className="h-50">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12, angle: 45, textAnchor: "start" }} />
              <YAxis
                label={{ value: "Mbps", angle: -90, position: "insideLeft", offset: -5 }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Line
                type="monotone"
                dataKey="uploadSpeed"
                stroke="#9900ff"
                dot={false}
                strokeWidth={2}
              />
            </LineChart>
          </ChartContainer>
        </div>

        {/* Gráfica de Ping */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Ping vs Tiempo</h2>
          <ChartContainer config={pingChartConfig} className="h-50">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12, angle: 45, textAnchor: "start" }} />
              <YAxis
                label={{ value: "ms", angle: -90, position: "insideLeft", offset: -5 }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Line
                type="monotone"
                dataKey="ping"
                stroke="#00ff95"
                dot={false}
                strokeWidth={2}
              />
            </LineChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
};
