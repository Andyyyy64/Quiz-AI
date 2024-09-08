export type SinglePlayHistoryType = {
    id: number;
    user_id: number;
    quiz_id: number[];
    correct_num: boolean;
    duration: number;
    created_at: Date;
    updated_at: Date;
}
