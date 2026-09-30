import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { BottleneckResult } from "@/lib/measurements/bottleneck";
import { Network, Server, UserRound } from "lucide-react";
import type { ReactNode } from "react";

interface BottleneckModalProps {
  bottleneck: BottleneckResult | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ----------------- Cuello de botella (barras de progreso) ------------------------

// Labels
const locationLabels: Record<BottleneckResult["location"], string> = {
  red: "Red",
  cliente: "Cliente",
  servidor: "Servidor",
  desconocido: "Desconocido",
};

// Metricas con sus respectivas variables e iconos
const metrics: {
  key: "networkPercent" | "clientPercent" | "serverPercent";
  label: string;
  icon: typeof Network;
}[] = [
  { key: "networkPercent", label: "Red", icon: Network },
  { key: "clientPercent", label: "Cliente", icon: UserRound },
  { key: "serverPercent", label: "Servidor", icon: Server },
];

// ------------------ Anotaciones ----------------------

// Lista de notas
const noteList: { title?: string; content: ReactNode }[] = [
  // Nota cuella de botella
  {
    title: "Cuello de botella",
    content: (
      <>
        <p>
          El cuello de botella es donde más se congestionaron los datos durante
          la prueba de descarga. Un cuello de botella alto en:
        </p>
        <br />
        <ul>
          <li>
            <strong>Red: </strong>es normal. Cuando realizas la prueba de
            velocidad la conexión entre tu dispositivo y el servidor de pruebas
            seleccionado se satura de datos para asi medir el rendimiento.
          </li>
          <br />
          <li>
            <strong>Cliente: </strong>tu dispostivo de interconexion
            (generalmente router) o el medio que usas para conectarte (como una
            antena Wi-Fi) no pudo procesar los datos lo suficientemente rapido,
            provocando una congestión de datos.
          </li>
          <br />
          <li>
            <strong>Servidor: </strong>el servidor de pruebas seleccionado no
            está enviando los datos a un ritmo esperado, puede que el servidor
            no haya sido configurado correctamente. Este es un caso raro donde
            la causa no es tu red.
          </li>
        </ul>
      </>
    ),
  },

  // Nota RTT
  {
    title: "Round-Trip Time (RTT)",
    content: (
      <>
        <p>Tiempo que tarda los datos de tu red en ir y volver del servidor.</p>
        <br />
        <ul>
          <li>
            <strong>Mínimo: </strong>el RTT más bajo obtenido durante toda la
            prueba. Puede usarse como latencia en reposo{" "}
            <b>pero es solo una aproximación.</b>
          </li>
          <br />
          <li>
            <strong>Promedio: </strong>el promedio de RTT bajo carga obtenido
            durante toda la prueba.
          </li>
        </ul>
      </>
    ),
  },
];

export const BottleneckModal = ({
  bottleneck,
  open,
  onOpenChange,
}: BottleneckModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:!max-w-fit">
        <DialogHeader>
          <DialogTitle>Otras métricas de rendimiento</DialogTitle>
          <DialogDescription className="md:max-w-2/3">
            Aquí puedes ver el cuello de botella durante la prueba de descarga,
            también el RTT mínimo y promedio de toda la prueba.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto md:gap-5">
          {/* Lado izquierdo: Mas metricas */}
          <div>
            <span className="text-lg font-bold">Cuello de botella</span>
            {bottleneck ? (
              <div className="flex flex-col gap-5 my-3">
                <p>
                  Principal limitación:{" "}
                  <strong>{locationLabels[bottleneck.location]}</strong>
                </p>
                <div className="custom-scrollbar flex flex-col gap-4 overflow-auto">
                  {metrics.map(({ key, label, icon: Icon }) => {
                    const percentage = bottleneck[key];
                    const boundedPercentage = Math.min(
                      100,
                      Math.max(0, percentage),
                    );

                    return (
                      <div key={key} className="flex flex-col gap-1.5">
                        <div className="flex justify-between gap-4 text-sm">
                          <span className="flex items-center gap-2">
                            <Icon
                              className="h-4 w-4 text-muted-foreground"
                              aria-hidden="true"
                            />
                            {label}
                          </span>
                          <span className="font-medium">
                            {percentage.toFixed(1)}%
                          </span>
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
          </div>

          {/* Lado derecho: Anotaciones */}
          <div className="flex md:max-h-[350px] min-h-0 flex-col md:overflow-hidden">
            <span className="text-lg font-bold">Anotaciones</span>
            <div className="custom-scrollbar mt-3 min-h-0 flex-1 md:overflow-y-auto flex flex-col gap-4">
              {noteList.map((note, index) => (
                <Note key={index} title={note.title}>
                  {note.content}
                </Note>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Note = ({ title, children }: { title?: string; children: ReactNode }) => {
  return (
    <div className="note-container md:border-l-2 md:border-cyan-400 md:px-3">
      {title && <span className="font-semibold">{title}</span>}
      <div className="text-sm text-muted-foreground">{children}</div>
    </div>
  );
};
