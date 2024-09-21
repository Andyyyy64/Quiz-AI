import React, { createContext, useState, useEffect, useContext } from "react";

const IsOnlineContext = createContext<boolean>(true);

export const IsOnlineProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOnline, setIsOnline] = useState(true);

  const checkInternetConnection = () => {
    // ネットワークリクエストを行い接続状態を確認
    fetch("https://clients3.google.com/generate_204", { mode: "no-cors" })
      .then(() => setIsOnline(true))
      .catch(() => setIsOnline(false));
  };

  useEffect(() => {
    // 初回チェック
    checkInternetConnection();

    // 一定間隔で接続状態をチェック
    const interval = setInterval(() => {
      checkInternetConnection();
    }, 5000); // 5秒ごとにチェック

    return () => clearInterval(interval);
  }, []);

  return (
    <IsOnlineContext.Provider value={isOnline}>
      {children}
    </IsOnlineContext.Provider>
  );
};

// Contextを使うためのカスタムフック
export const useIsOnline = () => useContext(IsOnlineContext);
