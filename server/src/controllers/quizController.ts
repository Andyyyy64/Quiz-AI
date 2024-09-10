import { Request, response, Response } from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import db from '../database/database';
dotenv.config();

const client: any = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const generateQuiz = async (category?: string, difficulty?: string, user_id?: number, opponent_id?: number) => {
    const categories = ["科学", "日本史", "芸術", "文学", "地理", "世界史", "コンピュータサイエンス", "一般常識"];
    const difficulties = ["普通", "難しい", "超難しい", "難しい"];

    if (!category || category === "ランダム") {
        category = categories[Math.floor(Math.random() * categories.length)];
    }
    if (!difficulty || difficulty === "ランダム") {
        difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
    }
    console.log("Category: " + category + ", Difficulty: " + difficulty);
    // ユーザーが解いたクイズを取得    
    const pastQuizzes = await db.all(
        "SELECT question FROM user_quiz_history WHERE user_id = $1",
        [user_id ?? 1]
    );
    // 対戦相手がいる場合、対戦相手が解いたクイズも取得
    const opponentQuizzes = await db.all(
        "SELECT question FROM user_quiz_history WHERE user_id = $1",
        [opponent_id ?? 2]
    );
    // 過去に解いたクイズの質問リストを作成 
    const pastQuestions = pastQuizzes?.map((quiz) => quiz.question);
    const opponentQuestions = opponentQuizzes?.map((quiz) => quiz.question);
    const pastQuestionsString = JSON.stringify(pastQuestions);
    const opponentQuestionsString = JSON.stringify(opponentQuestions);    

    try {
        const response = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `
                    あなたはクイズ作成者です。以下のJSON形式で、4つの選択肢と1つの正解がある問題を生成してください。
                    **過去に生成した問題や類似の表現、または同じテーマを使わないように注意してください。**
                    指定されたジャンルと難易度に基づいたクイズ問題を生成してください。高校生レベルを[普通]としてください。
                    フォーマットに必ず従い、正しいJSONを返してください。   
                    以下の過去に生成した問題の問題文をすべて確認して、絶対に 似ていない/重複しない 問題を生成してください:
                    ${pastQuestionsString},
                    ${opponentQuestionsString},
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

                    また、**正しい事実に基づき、情報源が明確である問題を作成してください。**
                    あなたが作成した問題は、他のユーザーが解くことがありますので、正確な情報を提供してください。
                }`
                },
                {
                    role: "user",
                    content: `ジャンル「${category}」、難易度「${difficulty}」のクイズ問題を作成してください。`
                }
            ],            
            max_tokens: 10000,
            response_format: { type: "json_object"}
        });
        console.log("total_tokens: " + response.usage.total_tokens);
        let generatedQuiz = response.choices[0].message.content;
        // 余計な文字列を削除
        generatedQuiz = generatedQuiz.replace(/```json/g, '').replace(/```/g, '').trim();
        // GPT-4が生成したクイズテキストをパースして、指定された形式に変換
        try {
            // クイズが文字列として返ってきた場合、JSONとしてパース
            const parsedQuiz = JSON.parse(generatedQuiz);
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
    const { category, difficulty, user_id } = req.body;
    try {
        const quiz = await generateQuiz(category, difficulty, user_id);
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
