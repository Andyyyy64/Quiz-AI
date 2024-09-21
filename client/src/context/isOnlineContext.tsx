import React, { createContext, useState, useEffect, useContext } from "react";

const IsOnlineContext = createContext<boolean>(true);

export const IsOnlineProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <IsOnlineContext.Provider value={isOnline}>
      {children}
    </IsOnlineContext.Provider>
  );
};

export const useIsOnline = () => useContext(IsOnlineContext);
