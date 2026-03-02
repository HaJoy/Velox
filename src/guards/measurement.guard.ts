import type {
  Measurement,
  GetAllMeasurementsResponse,
  GetOneMeasurementResponse,
  GetMeasurementHistoryResponse,
} from "@/types/measurement";

// primitive helpers ---------------------------------------------------------
export const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

export const isString = (v: unknown): v is string => typeof v === "string";
export const isNumber = (v: unknown): v is number => typeof v === "number";
export const isBoolean = (v: unknown): v is boolean => typeof v === "boolean";

// check a single measurement
export function isMeasurement(v: unknown): v is Measurement {
  if (!isObject(v)) return false;
  const m = v as Record<string, unknown>;

  return (
    (isString(m.user) || m.user === null) &&
    isBoolean(m.isAuthenticated) &&
    isString(m.userIP) &&
    isString(m.isp) &&
    isString(m.country) &&
    isNumber(m.downloadSpeed) &&
    isNumber(m.uploadSpeed) &&
    isNumber(m.ping) &&
    isNumber(m.review) &&
    isString(m.userAgent)
  );
}

// arrays and response validators ------------------------------------------------
export function isMeasurementArray(v: unknown): v is Measurement[] {
  return Array.isArray(v) && v.every(isMeasurement);
}

export function isGetAllMeasurementsResponse(
  v: unknown
): v is GetAllMeasurementsResponse {
  if (!isObject(v)) return false;
  const r = v as Record<string, unknown>;
  return (
    isString(r.message) &&
    isMeasurementArray(r.measurements) &&
    isNumber(r.count)
  );
}

export function isGetOneMeasurementResponse(
  v: unknown
): v is GetOneMeasurementResponse {
  if (!isObject(v)) return false;
  const r = v as Record<string, unknown>;
  return isString(r.message) && isMeasurement(r.measurement);
}

export function isGetMeasurementHistoryResponse(
  v: unknown
): v is GetMeasurementHistoryResponse {
  if (!isObject(v)) return false;
  const r = v as Record<string, unknown>;
  return isString(r.message) && isMeasurementArray(r.measurementHistory);
}
