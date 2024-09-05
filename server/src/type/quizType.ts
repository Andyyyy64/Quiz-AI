export enum Difficulty {
    "難易度なし",
    "簡単",
    "普通",
    "難しい",
    "超難しい"
}

export enum Category {
    "カテゴリなし",
}

type QuizType = {
    quiz_id: number;
    problem: string;
    answer: string;
    category: Category | string; // カテゴリは仮なのでstringを許容
    difficulty: Difficulty;
    created_at: Date;
    updated_at: Date;
}

export default QuizType;