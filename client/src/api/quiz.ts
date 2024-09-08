import axios from "axios";
import { QuizType } from "../types/quizType";

const API_URL = import.meta.env.VITE_APP_SERVER_URL;

export const generateQuiz = async (category: string, difficulty: string, user_id: number | undefined) => {
    try {
        const res = await axios.post(`${API_URL}/quiz/generate`, { category, difficulty, user_id }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        });
        return res.data;
    } catch (err) {
        console.log("クイズの取得に失敗しました:", err);
        throw err;
    }
};

export const saveQuiz = async (quiz: QuizType) => {
    try {
        const res = await axios.post(`${API_URL}/quiz/save`,
            {
                quiz_id: quiz.quiz_id,
                question: quiz.question,
                category: quiz.category,
                choices: quiz.choices,
                explanation: quiz.explanation,
                correct_answer: quiz.correct_answer,
                difficulty: quiz.difficulty,
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            });
        return res.data;
    } catch (err) {
        console.log("クイズの保存に失敗しました:", err);
        throw err;
    }
}

export const getQuiz = async (id: number) => {
    try {
        const res = await axios.get(`${API_URL}/quiz/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        });
        return res.data;
    } catch (err) {
        console.log("クイズの取得に失敗しました:", err);
        throw err;
    }
}

export const getQuizzes = async () => {
    try {
        const res = await axios.get(`${API_URL}/quiz`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        });
        return res.data;
    } catch (err) {
        console.log("クイズの取得に失敗しました:", err);
        throw err;
    }
}