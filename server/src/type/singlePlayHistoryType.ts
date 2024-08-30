type SinglePlayHistoryType = {
    id: number;
    user_id: number;
    quiz_id: number;
    did_correct: boolean;
    created_at: Date;
    updated_at: Date;
}

export default SinglePlayHistoryType;