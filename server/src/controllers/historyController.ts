import { Request, Response } from 'express';
import db from "../database/database"

export const getSinglePlayHistory = async (req: Request, res: Response) => {
    const { user_id } = req.params;
    try {
        const data = await db.all("SELECT * FROM singleplay_history WHERE user_id = $1",
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
        const data = await db.all("SELECT * FROM multiplay_history WHERE user_id = $1",
            [user_id]
        );
        res.status(200).json(data);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

export const getSinglePlayHistoryById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const data = await db.get("SELECT * FROM singleplay_history WHERE id = $1", [id]);
        console.log(data);
        res.status(200).json(data);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

export const getMultiPlayHistoryById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const data = await db.get("SELECT * FROM multiplay_history WHERE session_id = $1",
            [id]
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
        const result: any = await db.run(
            `INSERT INTO singleplay_history 
            (user_id, category, difficulty, question_num, correct_num, duration, created_at, updated_at) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
            RETURNING id`,
            [user_id, category, difficulty, question_num, correct_num, duration, new Date(), new Date()],
            true
        );
        if (result && result.rows && result.rows.length > 0) {
            const singleplay_id = result.rows[0].id;
            console.log("Saving single history, ID: " + singleplay_id);
            res.status(200).json({ id: singleplay_id });
        } else {
            console.error("No rows returned from the INSERT query");
            res.status(500).json({ message: 'Failed to retrieve the inserted ID.' });
        }
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

export const saveMultiPlayHistory = async (req: Request, res: Response) => {
    const { user_id, opponent, who_win, points_awarded, match_duration, question_num } = req.body;
    console.log(opponent);
    try {
        // Modify the query to return the inserted ID
        const result: any = await db.run(
            `INSERT INTO multiplay_history 
            (user_id, opponent_user_id, opponent_name, who_win, points_awarded, match_duration, question_num, created_at, updated_at) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
            RETURNING session_id`,
            [user_id, opponent.id, opponent.name, who_win, points_awarded, match_duration, question_num, new Date(), new Date()],
            true
        );

        if (result && result.rows && result.rows.length > 0) {
            const multiplay_id = result.rows[0].session_id;
            console.log("Saving multiplay history, ID: " + multiplay_id);
            res.status(200).json({ id: multiplay_id });
        } else {
            console.error("No rows returned from the INSERT query");
            res.status(500).json({ message: 'Failed to retrieve the inserted ID.' });
        }
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

export const saveSinglePlayQuizHistory = async (req: Request, res: Response) => {
    const { singleplay_id, quiz_ids } = req.body;
    console.log(quiz_ids);
    try {
        // トランザクションを開始
        await db.run('BEGIN');

        // 各クイズを個別に挿入
        for (const quiz_id of quiz_ids) {
            await db.run('INSERT INTO singleplay_quiz_history (singleplay_id, quiz_id) VALUES ($1, $2)',
                [singleplay_id, quiz_id]);
        }

        // コミット
        await db.run('COMMIT');

        console.log("Saving singleplay quiz history");
        res.status(200).json({ message: 'Quiz history saved successfully' });
    } catch (error: any) {
        await db.run('ROLLBACK');
        console.error('Failed to save single play quiz history:', error);
        res.status(500).json({ message: error.message });
    }
}

export const saveMultiPlayQuizHistory = async (req: Request, res: Response) => {
    const { session_id, quiz_ids } = req.body;
    console.log("saveMultiPlayQuizHistory");
    console.log(quiz_ids);
    try {
        // トランザクションを開始
        await db.run('BEGIN');

        // 各クイズを個別に挿入
        for (const quiz_id of quiz_ids) {
            await db.run('INSERT INTO multiplay_quiz_history (session_id, quiz_id) VALUES ($1, $2)',
                [session_id, quiz_id]);
        }

        // コミット
        await db.run('COMMIT');

        console.log("Saving multiplay quiz history");
        res.status(200).json({ message: 'Quiz history saved successfully' });
    } catch (error: any) {
        await db.run('ROLLBACK');
        console.error('Failed to save single play quiz history:', error);
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