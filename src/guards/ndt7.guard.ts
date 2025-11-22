import type {
  TCPInfo,
  ClientData,
  ClientMeasurementMsg,
  ServerMeasurementMsg,
  StartMsg,
  CompleteMsg,
  ErrorMsg,
  Ndt7Message,
} from "@/types/ndt7";

/** Basic object guard */
export const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

/** TCPInfo: BytesReceived (number) and ElapsedTime (number) */
export function isTCPInfo(v: unknown): v is TCPInfo {
  if (!isObject(v)) return false;
  const maybe = v as Record<string, unknown>;
  return (
    typeof maybe.BytesReceived === "number" &&
    typeof maybe.ElapsedTime === "number"
  );
}

/** ClientData: optional MeanClientMbps (number) and optional TCPInfo */
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

/** ClientMeasurementMsg: Source === "client" and optional Data validated */
export function isClientMeasurementMsg(v: unknown): v is ClientMeasurementMsg {
  if (!isObject(v)) return false;
  const maybe = v as Record<string, unknown>;
  if (maybe.Source !== "client") return false;
  if ("Data" in maybe && maybe.Data !== undefined) {
    return isClientData(maybe.Data);
  }
  return true;
}

/** ServerMeasurementMsg: Source === "server" and Data.TCPInfo present */
export function isServerMeasurementMsg(v: unknown): v is ServerMeasurementMsg {
  if (!isObject(v)) return false;
  const maybe = v as Record<string, unknown>;
  if (maybe.Source !== "server") return false;
  if (!("Data" in maybe) || maybe.Data === undefined || !isObject(maybe.Data))
    return false;
  const data = maybe.Data as Record<string, unknown>;
  if (!("TCPInfo" in data) || data.TCPInfo === undefined) return false;
  return isTCPInfo(data.TCPInfo);
}

/** Start / control / terminal messages */
export function isStartMsg(v: unknown): v is StartMsg {
  return isObject(v) && (v as Record<string, unknown>).MsgType === "start";
}
export function isCompleteMsg(v: unknown): v is CompleteMsg {
  return isObject(v) && (v as Record<string, unknown>).MsgType === "complete";
}
export function isErrorMsg(v: unknown): v is ErrorMsg {
  if (!isObject(v)) return false;
  const maybe = v as Record<string, unknown>;
  if (maybe.MsgType !== "error") return false;
  if ("Error" in maybe && maybe.Error !== undefined && typeof maybe.Error !== "string")
    return false;
  return true;
}

/** Broad union guard */
export function isNdt7Message(v: unknown): v is Ndt7Message {
  if (!isObject(v)) return false;
  return (
    isClientMeasurementMsg(v) ||
    isServerMeasurementMsg(v) ||
    isStartMsg(v) ||
    isCompleteMsg(v) ||
    isErrorMsg(v)
  );
}