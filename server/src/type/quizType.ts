type QuizType = {
    quiz_id: number;
    problem: string;
    answer: string;
    category: string[];
    difficulty: string[];
    created_at: Date;
    updated_at: Date;
}

export default QuizType;