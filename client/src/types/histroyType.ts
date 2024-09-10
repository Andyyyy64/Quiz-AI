export type SinglePlayHistoryType = {
    id: number;
    user_id: number;
    category: string;
    difficulty: string;
    question_num: number;
    correct_num: number;
    duration: number;
}

export type SinglePlayQuizHistroyType = {
    singleplay_id: number; // singleplay_historyのid
    quiz_id: number;
}

export type MultiPlayHistoryType = {
    session_id: number;
    user_id: number;
    opponent_user_id: number;
    opponent_name: string;
    who_win: number;
    points_awarded: number;
    question_num: number;
    match_duration: number;
    created_at: Date;
    updated_at: Date;
}

export type MultiPlayQuizHistroyType = {
    session_id: number;
    quiz_id: number;
}

