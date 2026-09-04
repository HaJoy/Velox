import { getAllMeasurements } from "@/api/measurementService";
import { useCallback, useState } from "react";
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
import {
  calcAvgs,
  calcISPdata,
  formatChartData,
  type ISPMetric,
} from "@/lib/measurements/measurementCharts";
import Select from "@/components/Select";
import {
  Select as MetricSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  avgRTT: {
    label: "Ping (ms)",
    color: "hsl(var(--destructive))",
  },
} satisfies ChartConfig;

const renderXAxisTick = ({
  x = 0,
  y = 0,
  payload,
}: {
  x?: number;
  y?: number;
  payload?: { value?: string | number };
}) => {
  return (
    <text
      x={x}
      y={y + 16}
      textAnchor="end"
      fill="#666"
      transform={`rotate(-45 ${x} ${y})`}
    >
      {payload?.value}
    </text>
  );
};

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
  const [ispSortMetric, setIspSortMetric] = useState<ISPMetric>("Descarga (Mbps)");

  // Funcion para obtener todos las mediciones de un pais e isp en especifico
  const getMeasurements = async (country?: string, isp?: string) => {
    setLoading(true);
    try {
      const response = await getAllMeasurements(country, isp);
      // Ordenar por fecha para mejor visualización en gráficas
      const measurementsArray = response?.measurements || [];
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

  const onFilterChange = useCallback(
    (filters: { country?: string; isp?: string }) => {
      getMeasurements(filters.country, filters.isp);
    },
    [],
  );

  if (loading) {
    return (
      <div className="space-y-6 px-4 pb-8 md:px-0">
        <Select onFilterChange={onFilterChange} initialCountry="Colombia" />
        <div className="flex items-center justify-center h-screen">
          Cargando datos...
        </div>
      </div>
    );
  }

  if (measurements.length === 0) {
    return (
      <div className="space-y-6 px-4 pb-8 md:px-0">
        <Select onFilterChange={onFilterChange} initialCountry="Colombia" />
        <div className="flex items-center justify-center h-screen">
          No hay mediciones disponibles
        </div>
      </div>
    );
  }

  // Preparar datos para las gráficas
  const chartData = formatChartData(measurements);

  // Calcular promedios
  const { avgDownloadSpeed, avgUploadSpeed, avgPing } = calcAvgs(measurements);

  // preparar los datos para la grafica Pie y de barras de ISPs
  const { ispPieData, ispBarData } = calcISPdata(measurements, ispSortMetric);

  // Componente KPI
  const KPICard = ({ label, value, unit }: { label: string; value: string | number; unit: string }) => (
    <Card className="p-6 flex flex-col items-center justify-center space-y-2 bg-[#0b0b0f]">
      <h3 className="text-lg font-medium text-gray-600">{label}</h3>
      <p className="text-4xl font-bold text-primary">{value}</p>
      <p className="text-sm text-gray-500">{unit}</p>
    </Card>
  );

  return (
    <div className="min-w-0 max-w-full space-y-6 px-4 pb-8 md:px-0 w-full">
      <Select onFilterChange={onFilterChange} initialCountry="Colombia" />
      {/* Primera fila: 3 KPIs */}
      <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-3 w-full">
        <KPICard label="Descarga Promedio" value={avgDownloadSpeed} unit="Mbps" />
        <KPICard label="Subida Promedio" value={avgUploadSpeed} unit="Mbps" />
        <KPICard label="Ping Promedio" value={avgPing} unit="ms" />
      </div>

      {/* Segunda fila: Gráfica de Descarga (ancho completo) */}
      <Card className="min-w-0 max-w-full space-y-2 px-4 py-5 w-full bg-[#0b0b0f] md:px-5">
        <h2 className="text-xl font-semibold">Velocidad de Descarga vs Tiempo</h2>
        <ChartContainer config={downloadChartConfig} className="h-64 md:h-96">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={renderXAxisTick} />
            <YAxis label={{ value: "Mbps", angle: -90, position: "insideLeft", offset: 15 }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} wrapperStyle={{ paddingTop: 25 }} />
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
      <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 w-full">
        {/* Gráfica de Velocidad de Subida */}
        <Card className="min-w-0 max-w-full space-y-2 px-4 py-5 bg-[#0b0b0f] md:px-5">
          <h2 className="text-xl font-semibold">Velocidad de Subida vs Tiempo</h2>
          <ChartContainer config={uploadChartConfig} className="h-64 md:h-72">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={renderXAxisTick} />
              <YAxis label={{ value: "Mbps", angle: -90, position: "insideLeft", offset: 15 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} wrapperStyle={{ paddingTop: 25 }} />
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
        <Card className="min-w-0 max-w-full space-y-2 px-4 py-5 bg-[#0b0b0f] md:px-5">
          <h2 className="text-xl font-semibold">Ping vs Tiempo</h2>
          <ChartContainer config={pingChartConfig} className="h-64 md:h-72">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={renderXAxisTick} />
              <YAxis label={{ value: "ms", angle: -90, position: "insideLeft", offset: 15 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} wrapperStyle={{ paddingTop: 25 }} />
              <Line
                type="monotone"
                dataKey="avgRTT"
                stroke="#00ff95"
                dot={false}
                strokeWidth={2}
              />
            </LineChart>
          </ChartContainer>
        </Card>
      </div>

      {/* Cuarta fila: Distribución de ISPs y Promedios por ISP */}
      <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 w-full">
        {/* Gráfica Pie de Distribución de ISPs */}
        <Card className="min-w-0 max-w-full space-y-2 px-4 py-5 bg-[#0b0b0f] md:px-5">
          <h2 className="text-xl font-semibold">Distribución de ISPs</h2>
          <div className="flex justify-center h-64 md:h-72">
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
        <Card className="min-w-0 max-w-full space-y-2 px-4 py-5 bg-[#0b0b0f] md:px-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">Promedios por ISP</h2>
            <MetricSelect
              value={ispSortMetric}
              onValueChange={(value) => setIspSortMetric(value as ISPMetric)}
            >
              <SelectTrigger size="sm" aria-label="Ordenar ISPs por métrica">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Descarga (Mbps)">Descarga</SelectItem>
                <SelectItem value="Subida (Mbps)">Subida</SelectItem>
                <SelectItem value="Ping (ms)">Ping</SelectItem>
              </SelectContent>
            </MetricSelect>
          </div>
          <ChartContainer config={{}} className="h-64 md:h-72">
              <BarChart data={ispBarData} margin={{ bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  textAnchor="middle"
                  tick={ window.innerWidth > 680 ? { fontSize: 10 } : false}
                  height={60}
                  tickFormatter={(nombreIsp: string) => {
                    const parsedIsp = nombreIsp.split(' ').slice(1).join(' ');
                    return parsedIsp;
                  }}
                />
                <YAxis />
                <Tooltip labelStyle={{ color: "#fff" }} contentStyle={{ backgroundColor: "#0009" }}/>
                <Legend />
                <Bar dataKey="Descarga (Mbps)" fill="#0080FF" />
                <Bar dataKey="Subida (Mbps)" fill="#9900ff" />
                <Bar dataKey="Ping (ms)" fill="#00ff95" />
              </BarChart>
          </ChartContainer>
        </Card>
      </div>
    </div>
  );
};
