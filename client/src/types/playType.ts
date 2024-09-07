export type SinglePlayHistoryType = {
    id: number;
    user_id: number;
    quiz_id: number[];
    correct_num: boolean;
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
