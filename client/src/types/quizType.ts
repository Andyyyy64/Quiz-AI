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
    quiz_id?: number;
    question: string;
    category: Category | string; // カテゴリは仮なのでstringを許容
    difficulty: Difficulty;
    choices: string[];
    explanation: string;
    correct_answer: string;
}

export type QuizProps = {
    quiz: QuizType | undefined;
    countdown: number;
    isCounting: boolean;
    isAnswerCorrect: boolean | null;
    canAnswer: boolean;
    isTimeUp?: boolean;
    currentQuizIndex?: number;
    correctCount: number;
    questionCount?: number;
    isMultiplayer?: boolean;
    handleAnswerSelect: (selectAnswer: string) => void;
}

export type PlayerUIProps = {
    user: UserType | null;
}

export type OpponentUIProps = {
    opponent: wsUserType | null;
}

export type PreMatchLoadingProps = {
    status: string;
}

export type MatchedUIProps = {
    opponent: wsUserType | null;
    user: UserType | null;
    countdown: number;
}

export type QuizProgressUIProps = {
    currentQuizIndex: number;
    questionCount?: number;
}

export interface QuizDisplayProps extends QuizProps {
    quiz: QuizType | undefined;
    user: UserType | null;
    opponent: wsUserType | null;
    countdown: number;
    isCounting: boolean;
}

export type MultiResultUIProps = {
    handleGoHistory: () => void;
}

export type JoinedQuizType = {
    quiz_id?: number;
    question: string;
    category: Category | string; // カテゴリは仮なのでstringを許容
    difficulty: Difficulty;
    choices: string[];
    explanation: string;
    correct_answer: string;
    user_choices: string;
    user_id: number;
    is_correct: boolean;
    answered_at: Date;
}