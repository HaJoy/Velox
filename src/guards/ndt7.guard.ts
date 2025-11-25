/**
 * ---------------------------------------------------------------------------
 * Type guards para la revision de las respuestas de la API de NDT7 (M-lab).
 * Estan ordenados desde lo mas especificos hasta lo mas general.
 * ---------------------------------------------------------------------------
 */

import type {
  TCPInfo,
  ClientData,
  ClientMeasurementMsg,
  ServerMeasurementMsg,
  CompleteMsg,
  Ndt7Message,
  LastClientMeasurement,
  LastServerMeasurement,
} from "@/types/ndt7";

/**
 * Comprueba si `v` es un objeto (json).
 * @param v unknown
 * @returns `true` si el parametro es un objecto, `false` si no.
 */
export const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

/**
 * Comprueba si `v` es un objeto y cumple con la interfaz `TCPInfo`.
 * @param v unknown
 * @returns `true` si cumple con la interfaz, `false` si no.
 */
export function isTCPInfo(v: unknown): v is TCPInfo {
  if (!isObject(v)) return false;
  const maybe = v as Record<string, unknown>;
  return (
    typeof maybe.BytesReceived === "number" &&
    typeof maybe.ElapsedTime === "number"
  );
}

/**
 * Comprueba si `v` es el ultimo mensaje enviado en la prueba de velocidad.
 * @param v unknown
 * @returns `true` si cumple con la interfaz `LastClientMeasurement`, `false` si no.
 */
export function isLastClientMeasurement(v: unknown): v is LastClientMeasurement {
  if (!isObject(v)) return false;
  const maybe = v as Record<string, unknown>;
  return typeof maybe.MeanClientMbps === "number";
}

/**
 * Comprueba si `v` es el ultimo mensaje enviado en la prueba de velocidad.
 * @param v unknown
 * @returns `true` si cumple con la interfaz `LastServerMeasurement`, `false` si no.
 */
export function isLastServerMeasurement(v: unknown): v is LastServerMeasurement {
  if (!isObject(v)) return false;
  const maybe = v as Record<string, unknown>;
  if ("TCPInfo" in maybe && maybe.TCPInfo !== undefined) {
    return isTCPInfo(maybe.TCPInfo);
  } else {
    return false;
  }
}

/**
 * Comprueba si `v` cumple con la estructura del atributo `Data` (`data.Data`).
 * @param v unknown
 * @returns `true` si cumple con la interfaz `ClientData`, `false` si no.
 */
export function isClientData(v: unknown): v is ClientData {
  if (!isObject(v)) return false;
  const maybe = v as Record<string, unknown>;
  if (
    "MeanClientMbps" in maybe &&
    maybe.MeanClientMbps !== undefined &&
    typeof maybe.MeanClientMbps !== "number"
  ) {
    return false;
  }
  if ("TCPInfo" in maybe && maybe.TCPInfo !== undefined) {
    return isTCPInfo(maybe.TCPInfo);
  }
  return true;
}

/**
 * Comprueba si `v` es un mensaje del cliente y si cumple con su estructura.
 * @param v unknown
 * @returns `true` si cumple con la interfaz `ClientMeasurementMsg`, `false` si no.
 */
export function isClientMeasurementMsg(v: unknown): v is ClientMeasurementMsg {
  if (!isObject(v)) return false;
  const maybe = v as Record<string, unknown>;
  if (maybe.Source !== "client") return false;
  if ("Data" in maybe && maybe.Data !== undefined) {
    return isClientData(maybe.Data); // Revisar la estructura de Data
  } else {
    return false;
  }
}

/**
 * Comprueba si `v` es un mensaje del servidor y si cumple con su estructura.
 * @param v unknown
 * @returns `true` si cumple con la interfaz `ServerMeasurementMsg`, `false` si no.
 */
export function isServerMeasurementMsg(v: unknown): v is ServerMeasurementMsg {
  if (!isObject(v)) return false;
  const maybe = v as Record<string, unknown>;
  if (maybe.Source !== "server") return false;
  if (!("Data" in maybe) || maybe.Data === undefined || !isObject(maybe.Data))
    return false;
  const data = maybe.Data as Record<string, unknown>;
  if (!("TCPInfo" in data) || data.TCPInfo === undefined) return false;
  return isTCPInfo(data.TCPInfo); // Comprobar la estructura de TCPInfo
}

/**
 * Comprueba si `v` es un mensaje de finalizacion (para ambas pruebas).
 * @param v unknown
 * @returns `true` si el mensaje tiene los **objetos** `LastClientMeasurement`
 * y `LastServerMeasurement`, con sus respectivas estructuras, `false` si alguna
 * de las dos condiciones no se cumple.
 */
export function isCompleteMsg(v: unknown): v is CompleteMsg {
  if (!isObject(v)) return false;
  const maybe = v as Record<string, unknown>;
  return isLastClientMeasurement(maybe.LastClientMeasurement) && isLastServerMeasurement(maybe.LastServerMeasurement);  
}


/**
 * Comprueba si `v` cumple con uno de los tipos de mensajes de la API NDT7,
 * estos pueden ser: `ClientMeasurementMsg`, `ServerMeasurementMsg` o `CompleteMsg`.
 * @param v unknown
 * @returns `true` si el mensaje coincide con uno de los tipos, `false` si no.
 */
export function isNdt7Message(v: unknown): v is Ndt7Message {
  if (!isObject(v)) return false;
  return (
    isClientMeasurementMsg(v) ||
    isServerMeasurementMsg(v) ||
    isCompleteMsg(v)
  );
}