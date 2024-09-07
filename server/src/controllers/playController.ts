import { Request, Response } from 'express';
import db from '../database/database';
import dotenv from 'dotenv';

dotenv.config();

export const saveSinglePlayHistory = async (req: Request, res: Response) => {
    const { id, user_id, quiz_id, correct_num, duration } = req.body;

    try {
        await db.run("INSERT INTO singleplay_history (id, user_id, quiz_id, correct_num, duration, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7)",
            [id, user_id, quiz_id, correct_num, duration, new Date(), new Date()]
        );
        return res.status(200).json({ message: "シングルプレイの履歴保存に成功しました", id });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "シングルプレイの履歴保存に失敗しました" });
    }
}

export const saveMultiPlayHistory = async (req: Request, res: Response) => {
    const { session_id, user_id, quiz_id, opponent_user_id, who_win, points_awarded, match_duration } = req.body;

    try {
        await db.run("INSERT INTO multiplay_history (session_id, user_id, quiz_id, opponent_user_id, who_win, points_awarded, match_duration, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
            [session_id, user_id, quiz_id, opponent_user_id, who_win, points_awarded, match_duration, new Date(), new Date()]
        );
        return res.status(200).json({ message: "マルチプレイの履歴保存に成功しました", session_id });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "マルチプレイの履歴保存に失敗しました" });
    }
}

export const getSinglePlayHistory = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const singlePlayHistory = await db.get(
            "SELECT * FROM singleplay_history WHERE id = $1",
            [id]
        );

        if (!singlePlayHistory) {
            return res.status(400).json({ message: "Single play history not found" });
        }

        res.status(200).json({ singlePlayHistory: singlePlayHistory });
    } catch (err) {
        console.error("Failed to get single play history:", err);
        return res.status(500).json({ message: "Failed to get single play history" });
    }
}

export const getMultiPlayHistory = async (req: Request, res: Response) => {
    const { session_id } = req.params;

    try {
        const multiPlayHistory = await db.get(
            "SELECT * FROM multiplay_history WHERE session_id = $1",
            [session_id]
        );

        if (!multiPlayHistory) {
            return res.status(400).json({ message: "Multi play history not found" });
        }

        res.status(200).json({ multiPlayHistory: multiPlayHistory });
    } catch (err) {
        console.error("Failed to get multi play history:", err);
        return res.status(500).json({ message: "Failed to get multi play history" });
    }
}

export const getAllSinglePlayHistory = async (req: Request, res: Response) => {
    try {
        const singlePlayHistory = await db.all(
            "SELECT * FROM singleplay_history"
        );

        if (!singlePlayHistory) {
            return res.status(400).json({ message: "Single play history not found" });
        }

        res.status(200).json({ singlePlayHistory: singlePlayHistory });
    } catch (err) {
        console.error("Failed to get single play history:", err);
        return res.status(500).json({ message: "Failed to get single play history" });
    }
}

export const getAllMultiPlayHistory = async (req: Request, res: Response) => {
    try {
        const multiPlayHistory = await db.all(
            "SELECT * FROM multiplay_history"
        );

        if (!multiPlayHistory) {
            return res.status(400).json({ message: "Multi play history not found" });
        }

        res.status(200).json({ multiPlayHistory: multiPlayHistory });
    } catch (err) {
        console.error("Failed to get multi play history:", err);
        return res.status(500).json({ message: "Failed to get multi play history" });
    }
}