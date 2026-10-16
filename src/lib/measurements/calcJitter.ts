

/**
 * Calcula el jitter de un conjunto de RTTs utilizando la formula RFC 3550.
 * @param rtts Array de RTTs.
 * @returns `number` El jitter.
 */
export const calcJitter = (rtts: number[]): number => {
    // Verificar que no hayan RTTs infinitos.
    const validRtts = rtts.filter((v) => Number.isFinite(v));
    if (validRtts.length < 2) return 0;

    let J = 0; // Jitter

    for (let i = 1; i < validRtts.length; i++) {
        // Diferencia absoluta entre el paquete actual y el anterior (ms).
        const D = Math.abs(validRtts[i] - validRtts[i - 1]);
        J += (D - J) / 16; // Suavizador
        
    };

    return J;
};



/**
 * Calcula la varianza muestral (n - 1) y desviacion estandar de un conjunto de RTTs.
 * @param rtts Array de RTTs.
 * @returns `{ sampleVariance: number, stdDev: number }` Varianza muestral y desviacion estandar.
 */
export const calcVarDesv = (rtts: number[]): { sampleVariance: number, stdDev: number } => {
    // Comprobar que no hayan RTTs infinitos
    const validRtts = rtts.filter((v) => Number.isFinite(v));
    if (validRtts.length < 2) return { sampleVariance: 0, stdDev: 0 };
    
    const mean = validRtts.reduce((sum, num) => sum + num, 0) / validRtts.length; // Promedio
    const sumSq = validRtts.reduce((sum, num) => sum + (num - mean) ** 2, 0); // Suma de cuadrados
    const sampleVariance = sumSq / (validRtts.length - 1) // Varianza muestral (n - 1)
    const stdDev = Math.sqrt(sampleVariance); // Desviacion estandar

    return { sampleVariance, stdDev }; 
};
