// Declaracion del modulo ndt7
declare module "@m-lab/ndt7" {
  // opciones básicas que acepta la librería
  export type Ndt7Options = {
    userAcceptedDataPolicy: boolean;
    downloadworkerfile?: string;
    uploadworkerfile?: string;
    metadata?: Record<string, unknown>;
    [key: string]: unknown;
  };

  // callbacks usados por la librería (firma mínima)
  export type Ndt7Callbacks = {
    downloadStart?: () => void;
    downloadMeasurement?: (data: ClientMeasurementMsg) => void;
    downloadComplete?: (data: LastClientMeasurement | CompleteMsg) => void;
    uploadStart?: () => void;
    uploadMeasurement?: (data: ServerMeasurementMsg) => void;
    uploadComplete?: (data: LastServerMeasurement | CompleteMsg) => void;
    error?: (err: Error) => void;
    [key: string]: unknown;
  };

  export function test(
    opts: Ndt7Options,
    callbacks?: Ndt7Callbacks
  ): Promise<number>;

  const ndt7: { test: typeof test };

  export default ndt7;
}