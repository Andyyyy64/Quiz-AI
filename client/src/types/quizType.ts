import { UserType, wsUserType } from "./userType";

export enum Difficulty {
    "noDiff" = "難易度なし",
    "easy" = "簡単",
    "normal" = "普通",
    "difficult" = "難しい",
    "superDifficult" = "超難しい"
}

export enum Category {
    "noCategory" = "カテゴリなし",
}

// クイズの型
export type QuizType = {
    quiz_id: number;
    problem: string;
    answer: string;
    category: Category | string; // カテゴリは仮なのでstringを許容
    difficulty: Difficulty;
}

export type QuizProps = {
    quiz: QuizType;
    countdown: number;
    isCounting: boolean;
    isAnswering: boolean;
    opponentAnswering: boolean;
    inputAnswer: string;
    setInputAnswer: React.Dispatch<React.SetStateAction<string>>;
    handleAnswerClick: () => void;
    handleAnswerDone: () => void;
    canAnswer: boolean;
}

export type PlayerUIProps = {
    user: UserType | null;
}

export type OpponentUIProps = {
    opponent: wsUserType | null;
}

export interface QuizDisplayProps extends QuizProps {
    quiz: QuizType;
    user: UserType | null;
    opponent: wsUserType | null;
    countdown: number;
    isCounting: boolean;
}