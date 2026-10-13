

/**
 * Calcula el jitter de un conjunto de RTTs, o bien, la desviacion
 * estandar de un `array[]`, utilizando la varianza muestral (n - 1).
 * @param rtts Array de RTTs.
 * @returns `number` El jitter calculado (desviacion estandar).
 */
export const calcJitter = (rtts: number[]): number => {
    // Comprobar que no hayan RTTs infinitos
    const validRtts = rtts.filter((v) => Number.isFinite(v));
    if (validRtts.length < 2) return 0;
    
    const mean = validRtts.reduce((sum, num) => sum + num, 0) / validRtts.length; // Promedio
    const sumSq = validRtts.reduce((sum, num) => sum + (num - mean) ** 2, 0); // Suma de cuadrados
    const sampleVariance = sumSq / (validRtts.length - 1) // Varianza muestral (n - 1)

    return Math.sqrt(sampleVariance); // Desviacion estandar (jitter)
};