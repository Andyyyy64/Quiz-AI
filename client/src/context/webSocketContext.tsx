import React, { createContext, useContext, useEffect, useRef } from "react";
import { UserType } from "../types/userType";

interface WebSocketContextProps {
  ws: WebSocket | null;
  send: (message: any) => void;
}

const WebSocketContext = createContext<WebSocketContextProps | null>(null);

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error(
      "useWebSocketContext must be used within a WebSocketProvider",
    );
  }
  return context;
};

interface WebSocketProviderProps {
  children: React.ReactNode;
  url: string;
  user: UserType | null;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
  url,
  user,
}) => {
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      console.log("WebSocket connection opened.");
    };

    ws.current.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    return () => {
      ws.current?.close();
    };
  }, [url, user]);

  const send = (message: any) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    }
  };

  return (
    <WebSocketContext.Provider value={{ ws: ws.current, send }}>
      {children}
    </WebSocketContext.Provider>
  );
};
