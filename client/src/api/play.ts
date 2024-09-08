import axios from 'axios';
import { SinglePlayHistoryType, MultiPlayHistoryType } from '../types/playType';
const API_URL = import.meta.env.VITE_APP_SERVER_URL;

export const saveSinglePlayHistory = async (SinglePlayHistory: SinglePlayHistoryType) => {
    try {
        const res = await axios.post(`${API_URL}/play/single`,
            {
                user_id: SinglePlayHistory.user_id,
                quiz_id: SinglePlayHistory.quiz_id,
                correct_num: SinglePlayHistory.correct_num,
                duration: SinglePlayHistory.duration,
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            });
        return res.data;
    } catch (err) {
        console.error("シングルプレイの履歴保存に失敗しました:", err);
        throw err;
    }
}

export const saveMultiPlayHistory = async (MultiPlayHistory: MultiPlayHistoryType) => {
    try {
        const res = await axios.post(`${API_URL}/play/multi`,
            {
                user_id: MultiPlayHistory.user_id,
                quiz_id: MultiPlayHistory.quiz_id,
                opponent_user_id: MultiPlayHistory.opponent_user_id,
                who_win: MultiPlayHistory.who_win,
                points_awarded: MultiPlayHistory.points_awarded,
                match_duration: MultiPlayHistory.match_duration,
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            });
        return res.data;
    } catch (err) {
        console.error("マルチプレイの履歴保存に失敗しました:", err);
        throw err;
    }
}

export const getSinglePlayHistory = async (id: number) => {
    try {
        const res = await axios.get(`${API_URL}/play/single/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        });
        return res.data;
    } catch (err) {
        console.error("シングルプレイの履歴取得に失敗しました:", err);
        throw err;
    }
}

export const getMultiPlayHistory = async (session_id: number) => {
    try {
        const res = await axios.get(`${API_URL}/play/multi/${session_id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        });
        return res.data;
    } catch (err) {
        console.error("マルチプレイの履歴取得に失敗しました:", err);
        throw err;
    }
}

export const getAllSinglePlayHistory = async () => {
    try {
        const res = await axios.get(`${API_URL}/play/single`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        });
        return res.data;
    } catch (err) {
        console.error("シングルプレイの履歴取得に失敗しました:", err);
        throw err;
    }
}

export const getAllMultiPlayHistory = async () => {
    try {
        const res = await axios.get(`${API_URL}/play/multi`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        });
        return res.data;
    } catch (err) {
        console.error("マルチプレイの履歴取得に失敗しました:", err);
        throw err;
    }
}