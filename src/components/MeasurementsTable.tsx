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
import { getUserHistory } from "@/api/measurementService";
import type { User } from "@supabase/supabase-js";
import { Download } from "lucide-react";

export const MeasurementsTable = ({ user }: { user?: User | null }) => {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await getUserHistory();
        setMeasurements(data.measurementHistory);
      } catch (err) {
        console.error("Failed to load user history:", err);
        setMeasurements([]);
      }
    };

    if (user) {
      loadHistory();
      console.log(measurements);
    }
  }, [measurements, user]);

  if (!measurements || measurements.length === 0) {
    return null;
  }

  const csvHeaders = [
    { label: "#", key: "index" },
    { label: "IP", key: "userIP" },
    { label: "ISP", key: "isp" },
    { label: "Descarga (Mb/s)", key: "downloadSpeed" },
    { label: "Subida (Mb/s)", key: "uploadSpeed" },
    { label: "Ping (ms)", key: "ping" },
    { label: "Fecha", key: "createdAt" },
  ];

  const csvData = measurements.map((m, idx) => ({
    index: idx + 1,
    userIP: m.userIP ?? "N/A",
    isp: m.isp ?? "N/A",
    downloadSpeed: m.downloadSpeed ?? 0,
    uploadSpeed: m.uploadSpeed ?? 0,
    ping: m.ping ?? 0,
    createdAt: new Date(m.createdAt).toLocaleString("es-ES", {
      dateStyle: "medium",
      timeStyle: "short",
    }),
  }));

  return (
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
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>IP</TableHead>
            <TableHead>ISP</TableHead>
            <TableHead>Descarga (Mb/s)</TableHead>
            <TableHead>Subida (Mb/s)</TableHead>
            <TableHead>Ping (ms)</TableHead>
            <TableHead>Fecha</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {measurements.map((m: Measurement, idx: number) => {
            const ip = m.userIP ?? "N/A";
            const isp = m.isp ?? "N/A";
            const download = m.downloadSpeed ?? 0;
            const upload = m.uploadSpeed ?? 0;
            const ping = m.ping ?? 0;
            const date = new Date(m.createdAt).toLocaleString("es-ES", {
              dateStyle: "medium",
              timeStyle: "short",
            });

            return (
              <TableRow key={idx}>
                <TableCell className="font-bold">{idx + 1}</TableCell>
                <TableCell>{ip}</TableCell>
                <TableCell>{isp}</TableCell>
                <TableCell>{download}</TableCell>
                <TableCell>{upload}</TableCell>
                <TableCell>{ping}</TableCell>
                <TableCell>{date}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
