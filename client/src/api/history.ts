import axios from 'axios';
import { wsUserType } from '../types/userType';

const API_URL = import.meta.env.VITE_APP_SERVER_URL;

export const getSingleHistory = async (user_id: number) => {
    const res = await axios.get(`${API_URL}/history/singleplay/user_id/${user_id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
    });
    return res.data;
}

export const getMultiHistory = async (user_id: number) => {
    const res = await axios.get(`${API_URL}/history/multiplay/user_id/${user_id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
    });
    return res.data;
}

export const getSingleHistoryById = async (id: number) => {
    const res = await axios.get(`${API_URL}/history/singleplay/id/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
    });
    return res.data;
}

export const getMultiHistoryById = async (id: number) => {
    const res = await axios.get(`${API_URL}/history/multiplay/id/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
    });
    return res.data;
}


export const saveSingleHistory = async (user_id: number | undefined, category: string, difficulty: string, question_num: number, correct_num: number, duration: number) => {
    const res = await axios.post(`${API_URL}/history/singleplay`, { user_id, category, difficulty, question_num, correct_num, duration }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
    });
    return res.data;
}

export const saveSingleQuizHistory = async (singleplay_id: number, quiz_id: number[]) => {
    const res = await axios.post(`${API_URL}/history/singleplayquiz`, {
        singleplay_id,
        quiz_ids: quiz_id
    }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
    });
    return res.data;
}

export const saveMultiHistory = async (
    user_id: number | undefined,
    opponent: wsUserType | null,
    who_win: number | undefined | string,
    points_awarded: number,
    match_duration: number,
    question_num: number
) => {
    console.log(opponent);
    const res = await axios.post(`${API_URL}/history/multiplay`,
        {
            user_id,
            opponent,
            who_win,
            points_awarded,
            match_duration,
            question_num

        }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
    });
    return res.data;
}

export const saveMultiQuizHistory = async (session_id: number, quiz_id: number[]) => {
    const res = await axios.post(`${API_URL}/history/multiplayquiz`, { session_id, quiz_ids: quiz_id }, {
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