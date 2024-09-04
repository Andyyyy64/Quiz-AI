// DB上で取得するユーザー情報の型
export type UserType = {
    user_id: number;
    name: string;
    email: string;
    password: string;
    points: number;
    rank: string[];
    prof_image_url: string;
    last_login: Date;
    created_at: Date;
    updated_at: Date;
    exp?: number;
    iat?: number;
}

// websocket上で取得するユーザー情報の型
export type wsUserType = {
    id: number;
    name: string;
    rank: string;
    ws: WebSocket;
}
