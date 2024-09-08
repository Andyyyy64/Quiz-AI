import axios from "axios";

const API_URL = import.meta.env.VITE_APP_SERVER_URL;

export const register = async (name: string, email: string, password: string,) => {
    const res = await axios.post(`${API_URL}/user/register`, { name, email, password });
    console.log(res.data);
    return res.data;
}

export const updateUser = async (user_id: number, name: string, prof_image_url: string) => {
    const res = await axios.put(`${API_URL}/user/put/${user_id}`, { name, prof_image_url }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
    });
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

export const getUserById = async (id: number) => {
    const res = await axios.get(`${API_URL}/user/get/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
    });

    return res.data;
}

// GCPにファイルをアップロードし、URLを取得
export const handleFileUpload = async (selectedFile: File) => {
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
        const res = await axios.post(`${API_URL}/user/upload`, formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "multipart/form-data",
            }
        });

        return res.data.url; // GCPにアップロードされた画像のURLを返す
    } catch (error) {
        console.error("ファイルアップロードエラー:", error);
        throw new Error("ファイルアップロードに失敗しました");
    }
};

export const saveAnsweredQuiz = async (quiz_id: number | undefined, user_id: number | undefined, is_correct: boolean | null) => {
    const res = await axios.post(`${API_URL}/user/saveAnsweredQuiz`, { quiz_id, user_id, is_correct }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
    });
    return res.data;
}