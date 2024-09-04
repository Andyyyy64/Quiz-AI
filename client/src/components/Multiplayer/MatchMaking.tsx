import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export const Matchmaking: React.FC = () => {
  const [status, setStatus] = useState("Connecting...");
  const [opponent, setOpponent] = useState<{ id: string; name: string } | null>(
    null
  );
  const authContext = useContext(AuthContext);
  if (authContext === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  const { user } = authContext;
  let ws: WebSocket;

  useEffect(() => {
    // WebSocketサーバーに接続
    ws = new WebSocket("ws://localhost:3000");

    ws.onopen = () => {
      setStatus("Waiting for match...");
      // マッチメイキング開始
      if (user != null) {
        ws.send(JSON.stringify({ id: user.user_id, name: user.name }));
      }
    };

    // メッセージを受信したときの処理
    ws.onmessage = (message) => {
      const data = JSON.parse(message.data);

      if (data.success && data.opponent) {
        setStatus("Match found!");
        setOpponent(data.opponent);
      } else if (data.message === "Opponent has disconnected.") {
        alert("Opponent has disconnected.");
        setStatus("Opponent has disconnected.");
        setOpponent(null);
      } else if (data.message) {
        setStatus(data.message);
      }
    };

    // ページリロードやタブ閉じる際にWebSocketを閉じる
    const handleBeforeUnload = () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };

    // イベントリスナーを追加することで、コンポーネントがアンマウントされたときにWebSocketを閉じることができる
    // (タブを閉じたときや、リロードしたとき)
    window.addEventListener("beforeunload", handleBeforeUnload);

    // コンポーネントがアンマウントされたときにWebSocketを閉じる
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [user]);

  return (
    <div>
      <h2>{status}</h2>
      {opponent && <div>{<p>Opponent: {opponent.name}</p>}</div>}
    </div>
  );
};
