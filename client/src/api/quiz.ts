import axios from "axios";

const API_URL = import.meta.env.VITE_APP_SERVER_URL;

export const generateQuiz = async (category: string, difficulty: string) => {
    try {
        const res = await axios.post(`${API_URL}/quiz/generate`, { category, difficulty, }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        });
        return res.data;
    } catch (error) {
        console.error("クイズの取得に失敗しました:", error);
        throw error;
    }
};
