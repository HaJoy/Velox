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
import { getUserHistory } from "@/api/measurementService";
import type { User } from "@supabase/supabase-js";

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

    if (user) {loadHistory(); console.log(measurements)};
  }, [user]);

  if (!measurements || measurements.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 w-full">
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
