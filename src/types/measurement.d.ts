
// measurement.d.ts
// ---------
// Strongly typed entities returned by the backend and
// helpers for working with them in the frontend.

// core record representing a single measurement
export interface Measurement {
    /* who performed the test (nullable when anonymous) */
    user: string | null;

    /* whether the user was logged in */
    isAuthenticated: boolean;

    /* network information */
    userIP: string;
    isp: string;
    country: string;

    /* quantitative results */
    downloadSpeed: number;
    uploadSpeed: number;
    ping: number;
    review: number;

    /* metadata */
    userAgent: string;
    createdAt: string;
}

// generic API responses in the `/measurement` namespace
export interface GetAllMeasurementsResponse {
    message: string;
    measurements: Measurement[];
    count: number;
}

export interface GetOneMeasurementResponse {
    message: string;
    measurement: Measurement;
}

export interface GetMeasurementHistoryResponse {
    message: string;
    measurementHistory: Measurement[];
}


