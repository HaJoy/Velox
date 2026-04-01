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
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
  Tooltip,
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

// Colores para la gráfica pie de ISPs
const COLORS = [
  "#0080FF",
  "#9900ff",
  "#00ff95",
  "#ff6b35",
  "#f7931e",
  "#c1272d",
  "#651c32",
];

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

  // Calcular promedios
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

  // Calcular distribución de ISPs
  const ispDistribution = measurements.reduce((acc: { [key: string]: number }, m) => {
    acc[m.isp] = (acc[m.isp] || 0) + 1;
    return acc;
  }, {});

  const ispPieData = Object.entries(ispDistribution).map(([name, value]) => ({
    name,
    value,
  }));

  // Calcular promedios por ISP
  const ispAverages = measurements.reduce(
    (acc: { [key: string]: { download: number[]; upload: number[]; ping: number[] } }, m) => {
      if (!acc[m.isp]) {
        acc[m.isp] = { download: [], upload: [], ping: [] };
      }
      acc[m.isp].download.push(m.downloadSpeed);
      acc[m.isp].upload.push(m.uploadSpeed);
      acc[m.isp].ping.push(m.ping);
      return acc;
    },
    {}
  );

  const ispBarData = Object.entries(ispAverages).map(([name, data]) => ({
    name,
    "Descarga (Mbps)": parseFloat((data.download.reduce((a, b) => a + b, 0) / data.download.length).toFixed(2)),
    "Subida (Mbps)": parseFloat((data.upload.reduce((a, b) => a + b, 0) / data.upload.length).toFixed(2)),
    "Ping (ms)": parseFloat((data.ping.reduce((a, b) => a + b, 0) / data.ping.length).toFixed(2)),
  }));

  // Componente KPI
  const KPICard = ({ label, value, unit }: { label: string; value: string | number; unit: string }) => (
    <Card className="p-6 flex flex-col items-center justify-center space-y-2 bg-[#0b0b0f]">
      <h3 className="text-lg font-medium text-gray-600">{label}</h3>
      <p className="text-4xl font-bold text-primary">{value}</p>
      <p className="text-sm text-gray-500">{unit}</p>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Primera fila: 3 KPIs */}
      <div className="grid grid-cols-3 w-full gap-4">
        <KPICard label="Descarga Promedio" value={avgDownloadSpeed} unit="Mbps" />
        <KPICard label="Subida Promedio" value={avgUploadSpeed} unit="Mbps" />
        <KPICard label="Ping Promedio" value={avgPing} unit="ms" />
      </div>

      {/* Segunda fila: Gráfica de Descarga (ancho completo) */}
      <Card className="space-y-2 px-5 py-5 w-full bg-[#0b0b0f]">
        <h2 className="text-xl font-semibold">Velocidad de Descarga vs Tiempo</h2>
        <ChartContainer config={downloadChartConfig} className="h-96">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12, angle: -45, textAnchor: "end" }} />
            <YAxis label={{ value: "Mbps", angle: -90, position: "insideLeft", offset: 15 }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} wrapperStyle={{ paddingTop: 5 }} />
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

      {/* Tercera fila: 2 Gráficas (Subida y Ping) */}
      <div className="grid grid-cols-2 w-full gap-4">
        {/* Gráfica de Velocidad de Subida */}
        <Card className="space-y-2 px-5 py-5 bg-[#0b0b0f]">
          <h2 className="text-xl font-semibold">Velocidad de Subida vs Tiempo</h2>
          <ChartContainer config={uploadChartConfig} className="h-72">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12, angle: -45, textAnchor: "end" }} />
              <YAxis label={{ value: "Mbps", angle: -90, position: "insideLeft", offset: 15 }} />
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
        </Card>

        {/* Gráfica de Ping */}
        <Card className="space-y-2 px-5 py-5 bg-[#0b0b0f]">
          <h2 className="text-xl font-semibold">Ping vs Tiempo</h2>
          <ChartContainer config={pingChartConfig} className="h-72">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12, angle: -45, textAnchor: "end" }} />
              <YAxis label={{ value: "ms", angle: -90, position: "insideLeft", offset: 15 }} />
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
        </Card>
      </div>

      {/* Cuarta fila: Distribución de ISPs y Promedios por ISP */}
      <div className="grid grid-cols-2 w-full gap-4">
        {/* Gráfica Pie de Distribución de ISPs */}
        <Card className="space-y-2 px-5 py-5 bg-[#0b0b0f]">
          <h2 className="text-xl font-semibold">Distribución de ISPs</h2>
          <div className="flex justify-center h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ispPieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {ispPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Gráfica de Barras: Promedios por ISP */}
        <Card className="space-y-2 px-5 py-5 bg-[#0b0b0f]">
          <h2 className="text-xl font-semibold">Promedios por ISP</h2>
          <ChartContainer config={{}} className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ispBarData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Descarga (Mbps)" fill="#0080FF" />
                <Bar dataKey="Subida (Mbps)" fill="#9900ff" />
                <Bar dataKey="Ping (ms)" fill="#00ff95" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Card>
      </div>
    </div>
  );
};
