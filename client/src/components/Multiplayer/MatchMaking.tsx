import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../../context/AuthContext";

import { PreMatchLoading } from "./UI/PreMatchLoading";

import { useWebSocketContext } from "../../context/webSocketContext";

export const Matchmaking: React.FC = () => {
  const navi = useNavigate();

  const authContext = useContext(AuthContext);
  if (authContext === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  const { user } = authContext;

  const { ws, send } = useWebSocketContext();

  useEffect(() => {
    if (ws) {
      ws.onmessage = (message) => {
        const data = JSON.parse(message.data);
        if (
          data.success &&
          data.sessionId &&
          data.message === "create_new_session"
        ) {
          navi(`/multiplay/${data.sessionId}`);
        }
        if (data.success && data.sessionId && data.message === "matched") {
          navi(`/multiplay/${data.sessionId}`);
        }
        if (
          data.success &&
          data.sessionId &&
          data.message === "joined_session"
        ) {
          navi(`/multiplay/${data.sessionId}`);
        }
      };
      if (ws.readyState === WebSocket.OPEN) {
        send({
          action: "join_matchmaking",
          id: user?.user_id,
          name: user?.name,
          prof_image_url: user?.prof_image_url,
        });
      } else {
        ws.onopen = () => {
          send({
            action: "join_matchmaking",
            id: user?.user_id,
            name: user?.name,
            prof_image_url: user?.prof_image_url,
          });
        };
      }
    }
  }, [ws]);

  return (
    <div className="w-full h-full flex justify-center items-center relative pb-20">
      {/* ローディング表示 */}
      <PreMatchLoading status="セッションを検索中" />
    </div>
  );
};
