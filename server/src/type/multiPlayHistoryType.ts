type MultiPlayHistoryType = {
    session_id: number;
    user_id: number;
    quiz_id: number;
    opponent_user_id: number;
    did_win: boolean;
    points_awarded: number;
    created_at: Date;
    updated_at: Date;
}

export default MultiPlayHistoryType;