import { Request, Response } from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import db from '../database/database';
dotenv.config();

const client: any = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const generateQuiz = async (category?: string, difficulty?: string) => {
    if (category === undefined) {
        category = "ランダム";
    }
    if (difficulty === undefined) {
        console.log("ランダム");
        difficulty = "ランダム";
    }

    const pastQuizzesNames = await db.all("SELECT question FROM quiz");
    const pastQuizzesNamesString = JSON.stringify(pastQuizzesNames);

    try {
        const response = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `
                あなたはクイズ作成者です。以下のJSON形式で、4つの選択肢と1つの正解があるクイズ問題を生成してください。
                フォーマットに必ず従い、正しいJSONを返してください。ジャンルと難易度に基づいたクイズ問題を作成してください。
                過去に生成した問題と重複しない問題を作成してください。
                ${pastQuizzesNamesString},
                ジャンルがランダムの場合、[科学] [歴史] [芸術] [スポーツ] [文学] [地理] [一般常識]のいずれかです。
                難易度がランダムの場合、「簡単」「普通」「難しい」[超難しい]のいずれかです。
                出力はJSONのみを返してください。

                フォーマット:
                {
                    "category": "<ジャンル>",
                    "difficulty": "<難易度>",
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
            max_tokens: 1000,
        });

        console.log(response.choices[0]);

        let generatedQuiz = response.choices[0].message.content;
        // 余計な文字列を削除
        generatedQuiz = generatedQuiz.replace(/```json/g, '').replace(/```/g, '').trim();
        // GPT-4が生成したクイズテキストをパースして、指定された形式に変換
        try {
            // クイズが文字列として返ってきた場合、JSONとしてパース
            const parsedQuiz = JSON.parse(generatedQuiz);

            // 生成したクイズをデータベースに保存(quiz_idはuuidを手動で挿入)
            const uuid: number = Math.floor(100000 + Math.random() * 900000);

            const choicesJson = JSON.stringify(parsedQuiz.choices);

            try {
                await db.run(
                    "INSERT INTO quiz (quiz_id, question, category, difficulty, choices, explanation, correct_answer, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
                    [
                        uuid,
                        parsedQuiz.question,
                        parsedQuiz.category,
                        parsedQuiz.difficulty,
                        choicesJson,
                        parsedQuiz.explanation,
                        parsedQuiz.correct_answer,
                        new Date(),
                        new Date(),
                    ]
                );
                console.log("クイズが正常に保存されました");
            } catch (error) {
                console.error("Failed to save quiz:", error);
                return ({ error: "クイズの保存に失敗しました", details: error, response: response });
            }

            // パースしたJSONをそのままフロントに返す
            return parsedQuiz;
        } catch (parseError) {
            // パースエラーが発生した場合の処理
            console.error("JSON parsing error:", parseError);
            return ({ error: "クイズデータのパースに失敗しました", details: parseError, response: response });
        }
    } catch (error) {
        console.error(error);
        return ({ error: 'クイズの生成に失敗しました' });
    }
};

export const GenerateQuiz = async (req: Request, res: Response) => {
    const { category, difficulty } = req.body;
    try {
        const quiz = await generateQuiz(category, difficulty);
        console.log(quiz);
        return res.status(200).json(quiz);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "クイズの生成に失敗しました" });
    }
}

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

export const generateQuizzesInTwoSteps = async (category?: string, difficulty?: string, numQuestions: number = 1) => {
    if (category === undefined) {
        category = "ランダム";
    }
    if (difficulty === undefined) {
        difficulty = "ランダム";
    }

    try {
        // 1回目: クイズ問題の作成
        const response1 = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `
                    あなたはクイズ作成者です。指定されたジャンルと難易度に基づいて、${numQuestions}問のクイズ問題を作成してください。
                    ジャンルがランダムの場合、[科学] [歴史] [芸術] [スポーツ] [文学] [地理] [一般常識]のいずれかです。
                    難易度がランダムの場合、「簡単」「普通」「難しい」[超難しい]のいずれかです。
                    `
                },
                {
                    role: "user",
                    content: `ジャンル「${category}」、難易度「${difficulty}」のクイズ問題を${numQuestions}問作成してください。`
                }
            ],
            max_tokens: 3000, // 必要に応じて適切な値に調整
        });

        const generatedQuizzes = response1.choices[0].message.content;
        console.log(generatedQuizzes);
        // 2回目: 指定フォーマットでJSONに変換
        const response2 = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `
                    あなたはクイズ作成者です。次に示すテキストをJSON形式に変換してください。
                    各クイズは4つの選択肢、1つの正解、そして解説を含む必要があります。
                    
                    フォーマット:
                    [
                        {
                            "category": "<ジャンル>",
                            "difficulty": "<難易度>",
                            "question": "<問題文>",
                            "choices": [
                                "<選択肢1>",
                                "<選択肢2>",
                                "<選択肢3>",
                                "<選択肢4>"
                            ],
                            "correct_answer": "<正解>",
                            "explanation": "<解説>"
                        },
                        ...
                    ]
                    `
                },
                {
                    role: "user",
                    content: `次のクイズを指定のJSON形式に変換してください: ${generatedQuizzes}`
                }
            ],
            max_tokens: 3000,
        });

        let formattedQuizzes = response2.choices[0].message.content;

        // 不要なフォーマットを削除
        formattedQuizzes = formattedQuizzes.replace(/```json/g, '').replace(/```/g, '').trim();

        // JSONとしてパース
        try {
            const parsedQuizzes = JSON.parse(formattedQuizzes);
            return parsedQuizzes;
        } catch (parseError) {
            console.error("JSON parsing error:", parseError);
            return ({ error: "クイズデータのパースに失敗しました", details: parseError, response: formattedQuizzes });
        }
    } catch (error) {
        console.error(error);
        return ({ error: 'クイズの生成に失敗しました' });
    }
};

// APIエンドポイント: 2ステップでクイズを生成
export const GenerateQuizzes = async (req: Request, res: Response) => {
    const { category, difficulty, numQuestions } = req.body;

    try {
        // 2回のプロンプトでクイズを生成し、フォーマットに変換
        const quizzes = await generateQuizzesInTwoSteps(category, difficulty, numQuestions);
        return res.status(200).json(quizzes);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "クイズの生成に失敗しました" });
    }
};

export const generateQuizzesInOneStep = async (category?: string, difficulty?: string, numQuestions: number = 1) => {
    if (category === undefined) {
        category = "ランダム";
    }
    if (difficulty === undefined) {
        difficulty = "ランダム";
    }

    try {
        const response = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `
                    あなたはクイズ作成者です。次に示すフォーマットに従い、${numQuestions}問のクイズを生成してください。
                    各クイズは4つの選択肢、1つの正解、そして解説を含む必要があります。
                    
                    フォーマット:
                    [
                        {
                            "category": "<ジャンル>",
                            "difficulty": "<難易度>",
                            "question": "<問題文>",
                            "choices": [
                                "<選択肢1>",
                                "<選択肢2>",
                                "<選択肢3>",
                                "<選択肢4>"
                            ],
                            "correct_answer": "<正解>",
                            "explanation": "<解説>"
                        }
                    ]
                    
                    ジャンルがランダムの場合、[科学] [歴史] [芸術] [スポーツ] [文学] [地理] [一般常識]のいずれかです。
                    難易度がランダムの場合、「簡単」「普通」「難しい」[超難しい]のいずれかです。
                    `
                },
                {
                    role: "user",
                    content: `ジャンル「${category}」、難易度「${difficulty}」のクイズ問題を${numQuestions}問作成してください。`
                }
            ],
            max_tokens: 3000,
        });

        let formattedQuizzes = response.choices[0].message.content;

        // 不要なフォーマットを削除
        formattedQuizzes = formattedQuizzes.replace(/```json/g, '').replace(/```/g, '').trim();

        // JSONとしてパース
        try {
            const parsedQuizzes = JSON.parse(formattedQuizzes);
            return parsedQuizzes;
        } catch (parseError) {
            console.error("JSON parsing error:", parseError);
            return ({ error: "クイズデータのパースに失敗しました", details: parseError, response: formattedQuizzes });
        }
    } catch (error) {
        console.error(error);
        return ({ error: 'クイズの生成に失敗しました' });
    }
};

// APIエンドポイント
export const GenerateQuizzesOneStep = async (req: Request, res: Response) => {
    const { category, difficulty, numQuestions } = req.body;

    try {
        // 1回のプロンプトでクイズを生成
        const quizzes = await generateQuizzesInOneStep(category, difficulty, numQuestions);
        return res.status(200).json(quizzes);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "クイズの生成に失敗しました" });
    }
};
