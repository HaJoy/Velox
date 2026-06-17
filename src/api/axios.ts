import { supabase } from "@/lib/supabase/client";
import axios from "axios";

const getBaseUrl = () => {
    const explicit = import.meta.env.VITE_API_URL as string | undefined;
    if (explicit) return explicit.endsWith("/api") ? explicit : `${explicit}/api`;

    const port = import.meta.env.VITE_PORT ?? "3000";
    return `http://localhost:${port}/api`;
};

export const api = axios.create({
    baseURL: getBaseUrl(),
});

api.interceptors.request.use(async (config) => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;

    if (token) {
        config.headers = config.headers ?? {};
        (config.headers as Record<string, unknown>).Authorization = `Bearer ${token}`;
    }

    return config;
});