import type { Measurement } from "@/types/measurement";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { deleteMeasurement, getUserHistory } from "@/api/measurementService";
import type { User } from "@supabase/supabase-js";
import { Download, Trash2 } from "lucide-react";
import { toastError } from "@/lib/toast-utils";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./ui/context-menu";
import { Spinner } from "./ui/spinner";
import { Button } from "./ui/button";

const waitForHistoryTestDelay = () =>
  new Promise<void>((resolve) => setTimeout(resolve, 5000));

export const MeasurementsTable = ({
  user,
  refreshKey,
}: {
  user?: User | null;
  refreshKey?: number;
}) => {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(false); // No hace falta decirle el error al usuario.

  // Cargar las mediciones
  useEffect(() => {
    const loadHistory = async () => {
      setHistoryLoading(true);
      try {
        await waitForHistoryTestDelay();
        const data = await getUserHistory();
        // Ordenar de más antiguo a más reciente (fecha ascendente)
        const sorted = (data.measurementHistory ?? [])
          .slice()
          .sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
          );
        setMeasurements(sorted);
      } catch (err) {
        console.error("Failed to load user history:", err);
        toastError({
          title: "Error al intentar cargar el historial de mediciones",
          description: "Ocurrió un error al intentar cargar el historial de mediciones, por favor, intenta recargar la página.",
          toasterId: "toaster-home",
        });
        setMeasurements([]);
        setHistoryError(true);
      } finally {
        setHistoryLoading(false);
      }
    };

    if (user) {
      loadHistory();
    }
  }, [user, refreshKey]);

  // Caso no hay mediciones
  if (!measurements || measurements.length === 0) {
    return null;
  }

  // Cabeceras de la tabla
  const csvHeaders = [
    { label: "#", key: "index" },
    { label: "IP", key: "userIP" },
    { label: "ISP", key: "isp" },
    { label: "Descarga (Mb/s)", key: "downloadSpeed" },
    { label: "Subida (Mb/s)", key: "uploadSpeed" },
    { label: "RTT promedio (ms)", key: "avgRTT" },
    { label: "RTT mínimo (ms)", key: "minRTT" },
    { label: "Congestión de red (%)", key: "networkLimitedPercent" },
    { label: "Congestión del cliente (%)", key: "clientLimitedPercent" },
    { label: "Congestión del servidor (%)", key: "serverLimitedPercent" },
    { label: "Fecha", key: "createdAt" },
  ];

  // Datos del CSV para ser exportado
  const csvData = measurements.map((m, idx) => ({
    index: idx + 1,
    userIP: m.userIP ?? "N/A",
    isp: m.isp ?? "N/A",
    downloadSpeed: m.downloadSpeed ?? 0,
    uploadSpeed: m.uploadSpeed ?? 0,
    avgRTT: m.avgRTT ?? 0,
    minRTT: m.minRTT ?? 0,
    networkLimitedPercent: m.networkLimitedPercent ?? 0,
    clientLimitedPercent: m.clientLimitedPercent ?? 0,
    serverLimitedPercent: m.serverLimitedPercent ?? 0,
    createdAt: new Date(m.createdAt).toLocaleString("es-ES", {
      dateStyle: "medium",
      timeStyle: "short",
    }),
  }));

  // Handler para eliminar una medicion
  const handleDelete = async (id: string) => {
    const response = await deleteMeasurement(id);

    // Notificar al usuario si ocurre un error (la medicion devuelta es null)
    if (!response.measurement) {
      toastError({
        title: "Error al intentar eliminar la medición",
        description:
          "Ocurrió un error al intentar eliminar la medición, inténtelo de nuevo más tarde.",
        toasterId: "toaster-home",
      });
      return;
    }

    setMeasurements((current) =>
      current.filter((measurement) => measurement._id !== id),
    );
  };

  // Returns dependiendo del estado
  // Estado cargando
  if (historyLoading) {
    return (
      <div className="flex justify-center items-center py-9 gap-2">
        <Spinner />
        <span className="text-muted-foreground text-sm">Cargando historial de mediciones...</span>
      </div>
    );
  }

  // Estado error
  if (historyError) {
    return (
      <div className="flex justify-center items-center py-9">
        <div className="flex flex-col justify-center items-center gap-5">
          <span className="text-muted-foreground text-sm">Ocurrió un error al cargar las mediciones</span>
          <Button className="hover:cursor-pointer" variant={"outline"} onClick={() => location.reload()}>
            Recargar la página
          </Button>
        </div>
      </div>
    );
  }

  // Estado de exito
  return (
    // Comprobar primero el estado de carga
    <div className="mt-6 w-full">
      <div className="mb-4 flex justify-end">
        <CSVLink
          data={csvData}
          headers={csvHeaders}
          filename="mediciones.csv"
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border bg-background shadow-xs px-4 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50"
        >
          <Download />
          Descargar CSV
        </CSVLink>
      </div>
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-[#0b0b0f]">
          <TableRow className="[&_th]:text-center">
            <TableHead>#</TableHead>
            <TableHead>IP</TableHead>
            <TableHead>ISP</TableHead>
            <TableHead>Descarga (Mb/s)</TableHead>
            <TableHead>Subida (Mb/s)</TableHead>
            <TableHead>RTT promedio (ms)</TableHead>
            <TableHead>RTT mínimo (ms)</TableHead>
            <TableHead>Congestión de red (%)</TableHead>
            <TableHead>Congestión del cliente (%)</TableHead>
            <TableHead>Congestión del servidor (%)</TableHead>
            <TableHead>Fecha</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {measurements.map((m: Measurement, idx: number) => {
            const id = m._id;
            const ip = m.userIP ?? "N/A";
            const isp = m.isp ?? "N/A";
            const download = m.downloadSpeed ?? 0;
            const upload = m.uploadSpeed ?? 0;
            const avgRTT = m.avgRTT ?? 0;
            const minRTT = m.minRTT ?? 0;
            const networkLimitedPercent = m.networkLimitedPercent ?? 0;
            const clientLimitedPercent = m.clientLimitedPercent ?? 0;
            const serverLimitedPercent = m.serverLimitedPercent ?? 0;
            const date = new Date(m.createdAt).toLocaleString("es-ES", {
              dateStyle: "medium",
              timeStyle: "short",
            });

            return (
              <ContextMenu key={id}>
                <ContextMenuTrigger asChild>
                  <TableRow className="[&_td]:whitespace-normal">
                    <TableCell className="font-bold">{idx + 1}</TableCell>
                    <TableCell>{ip}</TableCell>
                    <TableCell>{isp}</TableCell>
                    <TableCell>{download}</TableCell>
                    <TableCell>{upload}</TableCell>
                    <TableCell>{avgRTT}</TableCell>
                    <TableCell>{minRTT}</TableCell>
                    <TableCell>{networkLimitedPercent}</TableCell>
                    <TableCell>{clientLimitedPercent}</TableCell>
                    <TableCell>{serverLimitedPercent}</TableCell>
                    <TableCell className="!whitespace-nowrap">{date}</TableCell>
                  </TableRow>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem
                    variant="destructive"
                    onSelect={() => void handleDelete(id)}
                  >
                    <Trash2 />
                    Borrar medición
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
