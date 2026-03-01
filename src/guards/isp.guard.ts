import type {
    ipifyResponse,
    continent,
    ispinfo,
    ipinfoResponse
} from "@/types/isp";

export const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

export function isContinent(v: unknown): v is continent {
    if (!isObject(v)) return false;
    const maybe = v as Record<string, unknown>;
    return (
        typeof maybe.code === "string" &&
        typeof maybe.name === "string"
    );
}

export function isIspinfo(v: unknown): v is ispinfo {
    if (!isObject(v)) return false;
    const maybe = v as Record<string, unknown>;
    return (
        typeof maybe.org === "string" &&
        typeof maybe.country === "string" &&
        typeof maybe.countryCode === "string" &&
        "continent" in maybe &&
        maybe.continent !== undefined &&
        isContinent(maybe.continent)
    );
}

export function isIpifyResponse(v: unknown): v is ipifyResponse {
    if (!isObject(v)) return false;
    const maybe = v as Record<string, unknown>;
    return typeof maybe.ip === "string";
}

export function isIpinfoResponse(v: unknown): v is ipinfoResponse {
    if (!isObject(v)) return false;
    const maybe = v as Record<string, unknown>;
    return (
        typeof maybe.message === "string" &&
        "ispinfo" in maybe &&
        maybe.ispinfo !== undefined &&
        isIspinfo(maybe.ispinfo)
    );
}