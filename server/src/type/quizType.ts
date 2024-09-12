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

export type QuizType = {
    quiz_id?: number;
    question: string;
    category: Category | string; // カテゴリは仮なのでstringを許容
    subcategory: string | null;
    choices: string[];
    explanation: string;
    correct_answer: string;
    difficulty: Difficulty;
}


export default QuizType;