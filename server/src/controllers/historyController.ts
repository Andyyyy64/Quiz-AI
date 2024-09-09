import { Request, Response } from 'express';
import db from "../database/database"

export const getSinglePlayHistory = async (req: Request, res: Response) => {
    const { user_id } = req.params;
    console.log(user_id);
    try {
        const data = await db.get("SELECT * FROM singleplay_history WHERE user_id = $1",
            [user_id]
        );
        res.status(200).json(data);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

export const getMultiPlayHistory = async (req: Request, res: Response) => {
    const { user_id } = req.params;
    try {
        const data = await db.get("SELECT * FROM multiplay_history WHERE user_id = $1",
            [user_id]
        );
        res.status(200).json(data);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

export const saveSinglePlayHistory = async (req: Request, res: Response) => {
    const { user_id, category, difficulty, question_num, correct_num, duration } = req.body;
    try {
        const data = await db.run("INSERT INTO singleplay_history (user_id, category, difficulty, question_num, correct_num, duration, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
            [user_id, category, difficulty, question_num, correct_num, duration, new Date(), new Date()]
        );
        res.status(200).json(data);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

export const saveSinglePlayQuizHistory = async (req: Request, res: Response) => {
    const { singleplay_id, quiz_id } = req.body;

    try {
        const data = await db.run("INSERT INTO singleplay_quiz_history (singleplay_id, quiz_id) VALUES ($1, $2)",
            [singleplay_id, quiz_id]
        );
        res.status(200).json(data);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

export const saveMultiPlayHistory = async (req: Request, res: Response) => {
    const { session_id, user_id, opponent_user_id, who_win, points_awarded, match_duration } = req.body;
    try {
        const data = await db.run("INSERT INTO multiplay_history (session_id, user_id, opponent_user_id, who_win, points_awarded, match_duration, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
            [session_id, user_id, opponent_user_id, who_win, points_awarded, match_duration, new Date(), new Date()]
        );
        res.status(200).json(data);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

export const saveMultiPlayQuizHistory = async (req: Request, res: Response) => {
    const { session_id, quiz_id } = req.body;

    try {
        const data = await db.run("INSERT INTO multiplay_quiz_history (session_id, quiz_id) VALUES ($1, $2)",
            [session_id, quiz_id]
        );
        res.status(200).json(data);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

export const getSinglePlayQuizHistory = async (req: Request, res: Response) => {
    const { singleplay_id } = req.params;
    try {
        const data = await db.all(`
            SELECT uqh.*, uqh.user_choices, uqh.is_correct
            FROM singleplay_quiz_history sqh
            JOIN user_quiz_history uqh ON sqh.quiz_id = uqh.quiz_id
            WHERE sqh.singleplay_id = $1
        `, [singleplay_id]);
        res.status(200).json(data);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

export const getMultiPlayQuizHistory = async (req: Request, res: Response) => {
    const { session_id } = req.params;
    try {
        const data = await db.all(`
            SELECT uqh.*, uqh.user_choices, uqh.is_correct
            FROM multiplay_quiz_history mqh
            JOIN user_quiz_history uqh ON mqh.quiz_id = uqh.quiz_id
            WHERE mqh.session_id = $1
        `, [session_id]);
        res.status(200).json(data);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}