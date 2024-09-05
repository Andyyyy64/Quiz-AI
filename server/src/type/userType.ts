export enum Rank {
    "unrank" = "ランクなし",
    "rookie" = "ルーキー",
    "hardworker" = "努力家",
    "expert" = "エキスパート",
}

type UserType = {
    user_id: number;
    name: string;
    email: string;
    password: string;
    points: number;
    rank: Rank;
    prof_image_url: string;
    email_verified: boolean;
    varification_code: number;
    last_login: Date;
    created_at: Date;
    updated_at: Date;
}

export default UserType;