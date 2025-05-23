import { QuizType } from './quizType';

export type SinglePlayHistoryType = {
    id: number;
    user_id: number;
    quiz_id: number[];
    correct_num: number;
    duration: number;
    created_at: Date;
    updated_at: Date;
}

export type MultiPlayHistoryType = {
    session_id: number;
    user_id: number;
    quiz_id: number[];
    opponent_user_id: number;
    who_win: number;
    points_awarded: number;
    match_duration: number;
    created_at: Date;
    updated_at: Date;
}

export type PreSingleSettingsProps = {
    category: string;
    difficulty: string;
    setCategory: React.Dispatch<React.SetStateAction<string>>;
    setDifficulty: React.Dispatch<React.SetStateAction<string>>;
    setTimeLimit: React.Dispatch<React.SetStateAction<number>>;
    setQuestionCount: React.Dispatch<React.SetStateAction<number>>;
    timeLimit: number;
    questionCount: number;
    handleStartQuiz: () => void;
    customCategory: string;
    setCustomCategory: React.Dispatch<React.SetStateAction<string>>;
    useCustomCategory: boolean;
    setUseCustomCategory: React.Dispatch<React.SetStateAction<boolean>>;
}

export type AfterSingleResultProps = {
    correctCount: number;
    questionCount: number;
    duration: number;
    category: string;
    difficulty: string;
    handleRestart: () => void;
    handleGoHistory: () => void;
    isCustomMatch?: boolean;
}

export type SingleGameProps = {
    quiz: QuizType;
    questionCount: number;
    countdown: number;
    isCounting: boolean;
    currentQuizIndex: number;
    isAnswerCorrect: boolean | null;
    correctCount: number;
    isTimeUp: boolean;
    handleAnswerSelect: (selectAnswer: string) => void;
    canAnswer: boolean;
}
