import axios from "axios";

const API_URL = import.meta.env.VITE_APP_SERVER_URL;

export const register = async (name: string, email: string, password: string,) => {
    const res = await axios.post(`${API_URL}/user/register`, { name, email, password });
    console.log(res.data);
    return res.data;
}

export const getme = async () => {
    const res = await axios.get(`${API_URL}/user/me`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
    });
    return res.data;
}
