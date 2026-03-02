import { supabase } from "@/lib/supabase/client";
import axios from "axios";

export const api = axios.create({
    baseURL: `http://localhost:${import.meta.env.VITE_PORT}/api`,
});

api.interceptors.request.use(async (config) => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
})