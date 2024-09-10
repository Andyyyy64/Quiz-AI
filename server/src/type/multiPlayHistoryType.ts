export type MultiPlayHistoryType = {
    session_id: number;
    user_id: number;
    quiz_id: number[];
    opponent_user_id: number;
    opponent_name: string;
    who_win: number;
    points_awarded: number;
    match_duration: number;
    question_num: number;
    created_at: Date;
    updated_at: Date;
}

export type MultiPlayQuizHistory = {
    session_id: number;
    quiz_id: number;
}