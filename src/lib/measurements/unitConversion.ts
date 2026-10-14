

const UNITS = ["B", "KB", "MB", "GB"] as const;

/**
 * Convierte bytes a la unidad mas legible (B, KB, MB, GB).
 * @param bytes Cantidad de bytes.
 * @param decimals Decimales a mostrar (por defecto 2).
 * @returns `String` La unidad convertida.
 */
export const formatBytes = (bytes: number, decimals = 2): string => {
    if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";

    const BASE = 1000; // Se usa el sistema internacional
    const i = Math.min(
        Math.floor(Math.log(bytes) / Math.log(BASE)),
        UNITS.length - 1
    );

    const value = bytes / BASE ** i;

    // Sin decimales para bytes enteros
    return `${i === 0 ? value : value.toFixed(decimals)} ${UNITS[i]}`;
};