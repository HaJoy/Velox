import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { BottleneckResult } from "@/lib/measurements/bottleneck";
import { Network, Server, UserRound } from "lucide-react";

interface BottleneckModalProps {
  bottleneck: BottleneckResult | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const locationLabels: Record<BottleneckResult["location"], string> = {
  red: "Red",
  cliente: "Cliente",
  servidor: "Servidor",
  desconocido: "Desconocido",
};

const metrics: {
  key: "networkPercent" | "clientPercent" | "serverPercent";
  label: string;
  icon: typeof Network;
}[] = [
  { key: "networkPercent", label: "Red", icon: Network },
  { key: "clientPercent", label: "Cliente", icon: UserRound },
  { key: "serverPercent", label: "Servidor", icon: Server },
];

export function BottleneckModal({
  bottleneck,
  open,
  onOpenChange,
}: BottleneckModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Análisis del cuello de botella</DialogTitle>
          <DialogDescription>
            Distribución del tiempo limitado durante la prueba de descarga.
          </DialogDescription>
        </DialogHeader>

        {bottleneck ? (
          <div className="flex flex-col gap-5">
            <p>
              Principal limitación: <strong>{locationLabels[bottleneck.location]}</strong>
            </p>
            <div className="flex flex-col gap-4">
              {metrics.map(({ key, label, icon: Icon }) => {
                const percentage = bottleneck[key];
                const boundedPercentage = Math.min(100, Math.max(0, percentage));

                return (
                  <div key={key} className="flex flex-col gap-1.5">
                    <div className="flex justify-between gap-4 text-sm">
                      <span className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                        {label}
                      </span>
                      <span className="font-medium">{percentage.toFixed(1)}%</span>
                    </div>
                    <div
                      className="h-2 overflow-hidden rounded-full bg-muted"
                      role="progressbar"
                      aria-label={`${label}: ${percentage.toFixed(1)}%`}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={boundedPercentage}
                    >
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${boundedPercentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No hay datos de cuello de botella para mostrar.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
