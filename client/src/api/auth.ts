import axios from "axios";

const API_URL = import.meta.env.VITE_APP_SERVER_URL;

export const login = async (email: string, password: string) => {
    const res = await axios.post(`${API_URL}/auth/login`, { email, password });
    return res.data;
}

export const verify = async (email: string | null, verification_code: number) => {
    const res = await axios.post(`${API_URL}/auth/verify`, { email, verification_code });
    return res.data;
}