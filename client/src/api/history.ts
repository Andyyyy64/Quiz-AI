import axios from 'axios';

const API_URL = import.meta.env.VITE_APP_SERVER_URL;

export const getSingleHistory = async (user_id: number) => {
    const res = await axios.get(`${API_URL}/history/singleplay/${user_id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
    });
    return res.data;
}

export const getMultiHistory = async (user_id: number) => {
    const res = await axios.get(`${API_URL}/history/multiplay/${user_id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
    });
    return res.data;
}

export const saveSingleHistory = async (user_id: number, correct_num: number, duration: number) => {
    const res = await axios.post(`${API_URL}/history/singleplay`, { user_id, correct_num, duration }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
    });
    return res.data;
}

export const saveSingleQuizHistory = async (singleplay_id: number, quiz_id: number) => {
    const res = await axios.post(`${API_URL}/history/singleplayquiz`, { singleplay_id, quiz_id }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
    });
    return res.data;
}

export const saveMultiHistory = async (session_id: number, user_id: number, opponent_user_id: number, who_win: number, points_awarded: number, match_duration: number) => {
    const res = await axios.post(`${API_URL}/history/multiplay`, { session_id, user_id, opponent_user_id, who_win, points_awarded, match_duration }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
    });
    return res.data;
}

export const saveMultiQuizHistory = async (session_id: number, quiz_id: number) => {
    const res = await axios.post(`${API_URL}/history/multiplayquiz`, { session_id, quiz_id }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
    });
    return res.data;
}

export const getSingleQuizHistory = async (singleplay_id: number) => {
    const res = await axios.get(`${API_URL}/history/singleplayquiz/${singleplay_id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
    });
    return res.data;
}

export const getMultiQuizHistroy = async (session_id: number) => {
    const res = await axios.get(`${API_URL}/history/multiplayquiz/${session_id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
    });
    return res.data;
}