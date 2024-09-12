import { Request, Response } from 'express';
import stringSimilarity from 'string-similarity';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import db from '../database/database';
import { QuizType } from '../type/quizType';
dotenv.config();

const client: any = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
export type GenerateQuizResponse = QuizType | { error: string; details?: any; response?: any; };

// 過去のクイズとの類似度を確認する関数
const isSimilarQuestion = (newQuestion: string, pastQuestions: string[] | undefined, threshold: number = 0.65) => {
    if (!pastQuestions) return false;
    for (const pastQuestion of pastQuestions) {
        const similarity = stringSimilarity.compareTwoStrings(newQuestion, pastQuestion);
        if (similarity >= threshold) {
            console.log("履歴から: " + pastQuestion);
            console.log("生成された: " + newQuestion);
            return true; // 類似している
        }
    }
    return false;
};

export const generateQuiz = async (
    category?: string,
    difficulty?: string,
    user_id?: number,
    opponent_id?: number
): Promise<any> => {
    const categories = ["科学", "文学", "地理", "歴史", "情報", "一般常識", "工学", "心理学", "環境"];
    const difficulties = ["普通", "難しい", "超難しい", "難しい"];

    let subcategory: string | null = null; // サブカテゴリ

    // 科学のサブカテゴリ
    const scienceCategories = [
        "生物",        // 生物学
        "物理",        // 物理学
        "化学",        // 化学
        "天文学"       // 天文学
    ];

    // 地理のサブカテゴリ
    const geographyCategories = [
        "自然地理学",   // 自然の地形や気候
        "人文地理学",   // 人間活動と地理の関係
        "地図学"        // 地図や地理情報システム
    ];

    // 歴史のサブカテゴリ
    const historyCategories = [
        "日本史",       // 日本の歴史
        "世界史",       // 世界の歴史
        "文化史"        // 文化や芸術の歴史
    ];

    // 情報のサブカテゴリ
    const informationCategories = [
        "プログラミング",   // プログラミング言語
        "ネットワーク",     // コンピュータネットワーク
        "AI・機械学習"      // 人工知能と機械学習
    ];

    // 一般常識のサブカテゴリ
    const generalKnowledgeCategories = [
        "法律",        // 法律や規則
        "経済",        // 経済の基礎知識
        "文化"         // 文化や風習
    ];

    // 文学のサブカテゴリ
    const literatureCategories = [
        "古典文学",   // 古典的な文学作品
        "近代文学",   // 近代の文学
        "詩"          // 詩や詩人に関する知識
    ];

    // 工学のサブカテゴリ
    const engineeringCategories = [
        "機械工学",    // 機械工学
        "電気工学",    // 電気工学
        "バイオエンジニアリング"  // バイオテクノロジー
    ];

    // 心理学のサブカテゴリ
    const psychologyCategories = [
        "認知心理学",   // 認知に関する心理学
        "社会心理学",   // 社会における心理学
        "発達心理学"    // 発達に関する心理学
    ];

    // 環境のサブカテゴリ
    const environmentCategories = [
        "気候変動",     // 気候変動
        "エネルギー科学", // エネルギー問題
        "資源管理"      // 天然資源の管理と保全
    ];

    // カテゴリと難易度が指定されていない場合、ランダムに選択
    if (!category || category === "ランダム") {
        category = categories[Math.floor(Math.random() * categories.length)];
    }
    if (!difficulty || difficulty === "ランダム") {
        difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
    }

    // サブカテゴリをランダムに選択
    if (category && category === "科学") {
        subcategory = scienceCategories[Math.floor(Math.random() * scienceCategories.length)];
    }
    if (category && category === "地理") {
        subcategory = geographyCategories[Math.floor(Math.random() * geographyCategories.length)];
    }
    if (category && category === "歴史") {
        subcategory = historyCategories[Math.floor(Math.random() * historyCategories.length)];
    }
    if (category && category === "情報") {
        subcategory = informationCategories[Math.floor(Math.random() * informationCategories.length)];
    }
    if (category && category === "一般常識") {
        subcategory = generalKnowledgeCategories[Math.floor(Math.random() * generalKnowledgeCategories.length)];
    }
    if (category && category === "文学") {
        subcategory = literatureCategories[Math.floor(Math.random() * literatureCategories.length)];
    }
    if (category && category === "工学") {
        subcategory = engineeringCategories[Math.floor(Math.random() * engineeringCategories.length)];
    }
    if (category && category === "心理学") {
        subcategory = psychologyCategories[Math.floor(Math.random() * psychologyCategories.length)];
    }
    if (category && category === "環境") {
        subcategory = environmentCategories[Math.floor(Math.random() * environmentCategories.length)];
    }

    console.log("Category: " + category + "subCategory: " + subcategory + ", Difficulty: " + difficulty);

    // 指定されたカテゴリと難易度でユーザーが解いたクイズを取得
    if (!user_id) return ({ error: "ユーザーIDが指定されていません" });
    const pastQuizzes: QuizType[] | undefined | null = await db.all(
        `SELECT correct_answer 
         FROM user_quiz_history 
         WHERE user_id = $1 AND category = $2 AND difficulty = $3
         ORDER BY quiz_id DESC
         LIMIT 200`,
        [user_id, category, difficulty]
    );

    // 過去に解いたクイズのリストを作成 
    const pastQuestions: string[] | undefined = pastQuizzes?.map((quiz) => quiz.correct_answer);

    // 対戦相手がいる場合、対戦相手が解いたクイズも取得
    if (opponent_id) {
        const opponentQuizzes = await db.all(
            `SELECT correct_answer 
             FROM user_quiz_history 
             WHERE user_id = $1 AND category = $2 AND difficulty = $3 
             ORDER BY quiz_id DESC 
             LIMIT 200`,
            [opponent_id, category, difficulty]
        );
        const opponentQuestions = opponentQuizzes?.map((quiz) => quiz.correct_answer);
        if (opponentQuestions) {
            pastQuestions?.push(...opponentQuestions);
        }
    }
    console.log(pastQuestions);
    let parsedQuiz: QuizType | undefined;

    try {
        let isDuplicate = true;

        // 類似しないクイズが生成されるまで再生成
        while (isDuplicate) {
            const response = await client.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: `
                        あなたはクイズ作成者です。以下のJSON形式で、**4つの選択肢と1つの正解がある問題を生成してください**
                        "最初の" や ”一番の"、"最も"がつくような問題は避けてください
                        **過去に生成した問題や類似の表現、または同じテーマを使わないように注意してください。**
                        同じジャンル内でも、異なるトピックや視点から問題を生成してください。
                        指定されたジャンルと難易度に基づいたクイズ問題を生成してください。高校生レベルを[普通]としてください。                    
                        以下の過去にあなたが生成した問題の**解答/correct_answer**の履歴をすべて確認して、絶対に生成する問題の解答/correct_answerが重複しないような問題を生成してください:
                        ${JSON.stringify(pastQuestions, null, 2)},
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
                            "correct_answer": "<正解>",
                            "explanation": "<解説>"
                        }
                        `
                    },
                    {
                        role: "user",
                        content: `ジャンル「${subcategory !== null ? subcategory : category}」、難易度「${difficulty}」のクイズ問題を作成してください。`
                    }
                ],
                max_tokens: 4096,
                response_format: { type: "json_object" }
            });
            console.log("totalToken: " + response.usage.total_tokens);
            let generatedQuiz = response.choices[0].message.content;
            generatedQuiz = generatedQuiz.replace(/```json/g, '').replace(/```/g, '').trim();

            try {
                parsedQuiz = JSON.parse(generatedQuiz);
                // 新しく生成されたクイズが過去のクイズと類似しているか確認
                if (parsedQuiz !== undefined) {
                    isDuplicate = isSimilarQuestion(parsedQuiz.correct_answer, pastQuestions);

                    if (isDuplicate) {
                        console.log("類似したクイズが生成されたため、再生成します。");
                    }
                }

            } catch (parseError) {
                console.error("JSON parsing error:", parseError);
                return ({ error: "クイズデータのパースに失敗しました", details: parseError, response: response });
            }
        }
        if (parsedQuiz !== undefined) {
            parsedQuiz.category = category;
            parsedQuiz.subcategory = subcategory;
        }

        return parsedQuiz;

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
