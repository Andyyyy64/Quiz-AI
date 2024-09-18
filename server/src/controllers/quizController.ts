import { Request, Response } from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import db from '../database/database';
import { QuizType } from '../type/quizType';
dotenv.config();

const client: any = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
export type GenerateQuizResponse = QuizType | { error: string; details?: any; response?: any; };

// テキストの配列を受け取り埋め込みの配列を返す
const getEmbeddings = async (texts: string[]) => {
    const response = await client.embeddings.create({
        model: 'text-embedding-3-small',
        input: texts,
    });
    // 埋め込みデータが正しく返されているかチェック
    if (!response.data || !response.data.length || !response.data[0].embedding) {
        throw new Error("埋め込みデータが取得できませんでした");
    }

    return response.data.map((item: any) => item.embedding);
};

// コサイン類似度を計算
const cosineSimilarity = (vecA: number[], vecB: number[]) => {
    if (!vecA || !vecB) {
        throw new Error("ベクトルが undefined です");
    }

    const dotProduct = vecA.reduce((sum, a, idx) => sum + a * vecB[idx], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));

    if (magnitudeA === 0 || magnitudeB === 0) {
        throw new Error("ベクトルの大きさがゼロです");
    }

    return dotProduct / (magnitudeA * magnitudeB);
};

// 新しい質問と過去の質問のリストを受け取り、新しい質問が過去の質問と類似しているかどうかをembedding apiで評価
const isSimilarQuestion = async (newQuestion: string, pastQuestions: string[], threshold: number = 0.8) => {
    try {
        // 新しい質問と過去の質問の埋め込みを一度に取得
        const texts = [newQuestion, ...pastQuestions];
        const embeddings = await getEmbeddings(texts);

        const newEmbedding = embeddings[0];
        const pastEmbeddings = embeddings.slice(1);

        for (let i = 0; i < pastEmbeddings.length; i++) {
            const similarity = cosineSimilarity(newEmbedding, pastEmbeddings[i]);
            console.log(`類似度: ${similarity}`);
            if (similarity >= threshold) {
                console.log(`類似度が高い質問が見つかりました: ${similarity}`);
                console.log(`過去の質問: ${pastQuestions[i]}`);
                console.log(`新しい質問: ${newQuestion}`);
                return true;
            }
        }
    } catch (error) {
        console.error("類似度評価エラー:", error);
        return false;
    }
    return false;
};

export const generateQuiz = async (
    category?: string,
    difficulty?: string,
    user_id?: number,
    opponent_id?: number
): Promise<any> => {
    const categories = ["科学", "文学", "地理", "歴史", "情報", "一般常識", "工学", "環境"];
    const difficulties = ["簡単", "普通", "難しい", "超難しい"];

    let subcategory: string | null = null; // サブカテゴリ

    // 科学のサブカテゴリ
    const scienceCategories = [
        "生物",        // 生物学
        "物理",        // 物理学
        "化学",        // 化学
        "天文学",       // 天文学
        "地学",         // 地質学や地球科学
        "気象学",        // 気象学
    ];

    // 地理のサブカテゴリ
    const geographyCategories = [
        "自然地理学",      // 自然の地形や気候
        "人文地理学",      // 人間活動と地理の関係
        "都市地理学",      // 都市の形成や都市計画
        "経済地理学",      // 経済活動と地理の関係
        "観光地理学",      // 旅行や観光地に関する地理
    ];

    // 歴史のサブカテゴリ
    const historyCategories = [
        "日本史",          // 日本の歴史
        "世界史",          // 世界の歴史
        "文化史",          // 文化や芸術の歴史
        "政治史",          // 政治の発展や歴史
        "宗教史",          // 宗教と歴史の関係
        "戦争史",          // 戦争や軍事に関する歴史
    ];

    // 情報のサブカテゴリ
    const informationCategories = [
        "プログラミング",    // プログラミング言語と技術
        "ネットワーク",      // コンピュータネットワークと通信
        "機械学習",       // 人工知能と機械学習
        "サイバーセキュリティ", // 情報セキュリティとその対策
        "データベース",      // データの管理と操作
        "クラウドコンピューティング", // クラウド技術とサービス
    ];

    // 一般常識のサブカテゴリ
    const generalKnowledgeCategories = [
        "文化",     // 社会構造、文化、習慣に関する知識
        "政治",          // 政治制度、政党、選挙に関する知識
        "法律",     // 交通規則や労働法、消費者保護など
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

    // 環境のサブカテゴリ
    const environmentCategories = [
        "エネルギー科学",   // エネルギー問題と代替エネルギー
        "資源管理",        // 天然資源の管理と保全
        "生物多様性",      // 生物多様性とその保護
        "廃棄物管理",      // 廃棄物処理やリサイクル
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
    if (category && category === "環境") {
        subcategory = environmentCategories[Math.floor(Math.random() * environmentCategories.length)];
    }

    console.log("Category: " + category + "subCategory: " + subcategory + ", Difficulty: " + difficulty);

    // 指定されたカテゴリと難易度でユーザーが解いたクイズを取得
    if (!user_id) return ({ error: "ユーザーIDが指定されていません" });

    let pastQuizzes: QuizType[] | undefined | null = []; // 初期化を空の配列に変更

    // サブカテゴリが指定されていない場合はカテゴリのみで検索
    if (subcategory === null) {
        pastQuizzes = await db.all(
            `SELECT question 
         FROM user_quiz_history 
         WHERE user_id = $1 AND category = $2 AND difficulty = $3
         ORDER BY quiz_id DESC
         LIMIT 100`,
            [user_id, category, difficulty]
        );
    } else {
        pastQuizzes = await db.all(
            `SELECT question 
         FROM user_quiz_history 
         WHERE user_id = $1 AND category = $2 AND subcategory = $3 AND difficulty = $4
         ORDER BY quiz_id DESC
         LIMIT 100`,
            [user_id, category, subcategory, difficulty]
        );
    }

    // 過去に解いたクイズの質問をセットに追加
    const pastQuestionsSet = new Set<string>();
    if (pastQuizzes) {
        pastQuizzes.forEach((quiz) => pastQuestionsSet.add(quiz.question));
    }

    // 対戦相手がいる場合、対戦相手が解いたクイズも取得
    if (opponent_id) {
        let opponentQuizzes: QuizType[] | undefined | null = [];
        if (subcategory === null) {
            opponentQuizzes = await db.all(
                `SELECT question 
             FROM user_quiz_history 
             WHERE user_id = $1 AND category = $2 AND difficulty = $3
             ORDER BY quiz_id DESC 
             LIMIT 100`,
                [opponent_id, category, difficulty]
            );
        } else {
            opponentQuizzes = await db.all(
                `SELECT question 
             FROM user_quiz_history 
             WHERE user_id = $1 AND category = $2 AND subcategory = $3 AND difficulty = $4
             ORDER BY quiz_id DESC 
             LIMIT 100`,
                [opponent_id, category, subcategory, difficulty]
            );
        }

        // 対戦相手の過去に解いたクイズの質問をセットに追加
        if (opponentQuizzes) {
            opponentQuizzes.forEach((quiz) => pastQuestionsSet.add(quiz.question));
        }
    }

    console.log([...pastQuestionsSet].join(",")); // セットを配列に変換してログに出力

    let parsedQuiz: QuizType | undefined;

    try {
        let isDuplicate = true;
        // 類似しないクイズが生成されるまで再生成
        while (isDuplicate) {
            const response = await client.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: `
                        あなたはクイズ作成者です。以下のJSON形式で、**4つの選択肢と1つの正解がある問題を生成してください**
                        指定されたジャンルと難易度に基づいたクイズ問題を生成してください。高校生レベルを[普通]としてください。
                        以下のの過去にあなたが生成した問題の履歴をすべて確認して、問題が重複しないように生成してください:
                        ${[...pastQuestionsSet].join(", ")},
                        出力はJSONのみを返してください。また、問題文の要約を検索用ワードとして入れてください。

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
                            "explanation": "<解説>",
                            "search_word": "<検索用ワード>"
                        }
                            また、**正しい事実に基づき、情報源が明確である問題** を作成してください。
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

            try {
                parsedQuiz = JSON.parse(generatedQuiz);
                // 新しく生成されたクイズが過去のクイズと類似しているか確認
                if (parsedQuiz !== undefined && pastQuestionsSet !== undefined) {
                    isDuplicate = await isSimilarQuestion(parsedQuiz.question, [...pastQuestionsSet]);
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
