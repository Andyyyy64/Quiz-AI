import { useEffect, useState, useRef } from "react";
import { UserType } from "../types/userType";

export const useWebSocket = (url: string, user: UserType | null, onMessage: (data: any) => void) => {
    const ws = useRef<WebSocket | null>(null);
    const [status, setStatus] = useState("接続中...");

    console.log(url);
    useEffect(() => {
        // WebSocketオブジェクトをグローバルに保持するためにuseRefを使用
        ws.current = new WebSocket(url);
        
        // WebSocketサーバーに接続
        ws.current.onopen = () => {
            setStatus("マッチ待機中");
            if (user != null) {
                ws.current?.send(
                    JSON.stringify({ id: user.user_id, name: user.name, rank: user.rank, prof_image_url: user.prof_image_url })
                );
            }
        };

        // メッセージを受信したときの処理
        ws.current.onmessage = (message) => {
            const data = JSON.parse(message.data);
            onMessage(data);
        };

        // ウィンドウが閉じられたときにWebSocketを閉じる
        const handleBeforeUnload = () => {
            if (ws.current?.readyState === WebSocket.OPEN) {
                ws.current?.close();
            }
        };

        // クリーンアップ
        window.addEventListener("beforeunload", handleBeforeUnload);

        // WebSocketを閉じる
        return () => {
            if (ws.current?.readyState === WebSocket.OPEN) {
                ws.current?.close();
            }
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [user]);

    // メッセージを送信する関数
    const send = (message: any) => {
        if (ws.current && ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify(message));
        }
    };

    return { status, send };
}