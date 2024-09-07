import { Request, Response } from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import db from '../database/database';
dotenv.config();

const client: any = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const generateQuiz = async () => {
    const category = "コンピュータサイエンス";
    const difficulty = "簡単";

    try {
        const response = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `
                あなたはクイズ作成者です。以下のJSON形式で、4つの選択肢と1つの正解があるクイズ問題を生成してください。
                フォーマットに必ず従い、正しいJSONを返してください。ジャンルと難易度に基づいたクイズ問題を作成してください。

                フォーマット:
                {
                    "category": "<ジャンル>",
                    "difficulty": "<難易度>",
                    "time_limit": "<制限時間>",
                    "question": "<問題文>",
                    "choices": [
                        "<選択肢1>",
                        "<選択肢2>",
                        "<選択肢3>",
                        "<選択肢4>"
                    ],
                    "correct_answer": "<正解>"
                    "explanation": "<解説>"
                }`
                },
                {
                    role: "user",
                    content: `ジャンル「${category}」、難易度「${difficulty}」のクイズ問題を作成してください。`
                }
            ],
            max_tokens: 500
        });


        const generatedQuiz = response.choices[0].message.content;
        // GPT-4が生成したクイズテキストをパースして、指定された形式に変換
        try {
            // クイズが文字列として返ってきた場合、JSONとしてパース
            const parsedQuiz = JSON.parse(generatedQuiz);

            // パースしたJSONをそのままフロントに返す
            return parsedQuiz;
        } catch (parseError) {
            // パースエラーが発生した場合の処理
            console.error("JSON parsing error:", parseError);
            return ({ error: "クイズデータのパースに失敗しました", details: parseError });
        }
    } catch (error) {
        console.error(error);
        return ({ error: 'クイズの生成に失敗しました' });
    }
};

export const saveQuiz = async (req: Request, res: Response) => {
    const { quiz_id, question, category, difficulty, choices, explanation, correct_answer } = req.body;

    try {
        // データベースにクイズを保存する処理
        await db.run("INSET INT quiz (quiz_id, question, category, difficulty, choices, explanation, correct_answer, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6)",
            [quiz_id, question, category, difficulty, choices, explanation, correct_answer, new Date(), new Date()]
        );
        return res.status(200).json({ message: "クイズが正常に保存されました", quiz_id });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "クイズの保存に失敗しました" });
    }
}

export const getQuiz = async (req: Request, res: Response) => {
    const quiz_id = req.params.id;

    try {
        const quiz = await db.get("SELECT * FROM quiz WHERE quiz_id = $1", [quiz_id]);
        return res.status(200).json(quiz);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "クイズの取得に失敗しました" });
    }
}

export const getQuizzes = async (req: Request, res: Response) => {
    try {
        const quizzes = await db.all("SELECT * FROM quiz");
        return res.status(200).json(quizzes);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "クイズの取得に失敗しました" });
    }
}