import { wsUserType } from "./userType";

// クイズの型
export type QuizType = {
    quiz_id: number;
    problem: string;
    answer: string;
    category: string[];
    difficulty: string[];
}

// クイズ表示コンポーネントのプロップス
export type QuizDisplayProps = {
    quiz: QuizType;
    inputAnswer: string;
    setInputAnswer: (answer: string) => void;
    handleAnswerClick: () => void;
    handleAnswerDone: () => void;
    canAnswer: boolean;
    isAnswering: boolean;
    opponentAnswering: boolean;
    opponent: wsUserType | null;
}
