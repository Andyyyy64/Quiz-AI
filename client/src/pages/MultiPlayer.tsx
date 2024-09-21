import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Matchmaking } from "../components/Multiplayer/MatchMaking";
import { Header } from "../components/Common/Header";
import { Footer } from "../components/Common/Footer";
import { Rule } from "../components/Common/Rule";
import { useIsOnline } from "../context/isOnlineContext";

export const Multiplayer: React.FC = () => {
  const [showMatchmaking, setShowMatchmaking] = useState(false);
  const navi = useNavigate();
  const isOnline = useIsOnline();

  const handleMatchmakeClick = () => {
    if (!isOnline) {
      alert("インターネット接続がありません。接続を確認してください。");
      return;
    }
    setShowMatchmaking(true);
  };

  const handleCreateMatchClick = () => {
    navi("/multiplay/create");
  };

  const handleJoinMatchClick = () => {
    navi("/multiplay/join");
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" && isOnline) {
        handleMatchmakeClick();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOnline]);

  return (
    <div className="min-h-screen flex flex-col bg-inherit pb-10">
      <Header />
      <main className="flex-grow flex flex-col justify-center relative items-center">
        <div className="w-full flex flex-col items-center">
          {!showMatchmaking && (
            <div className="md:px-0 px-4 pb-10 w-full max-w-4xl">
              <Rule />
              <div className="flex flex-col w-full">
                <button
                  onClick={handleMatchmakeClick}
                  className="w-full max-h-[60px] text-center flex items-center justify-center text-white bg-[#FF6B6B] rounded-full font-bold
                          md:text-xl text-base md:mt-0 mt-3 md:mb-5 py-4 hover:bg-[#FF8787] hover:shadow-xl hover:scale-105 hover:text-white transition-all duration-300"
                >
                  マッチメイキング開始
                </button>
                <div className="flex flex-col sm:flex-row gap-4 w-full mt-3">
                  <button
                    onClick={handleCreateMatchClick}
                    className="w-full max-h-[60px] text-center flex items-center justify-center text-white bg-[#4ECDC4] rounded-full font-bold
                            md:text-xl text-base py-4 hover:bg-[#66E4DB] hover:shadow-xl hover:scale-105 hover:text-white transition-all duration-300"
                  >
                    部屋を作成する
                  </button>
                  <button
                    onClick={handleJoinMatchClick}
                    className="w-full max-h-[60px] text-center flex items-center justify-center text-white bg-[#F0C000] rounded-full font-bold
                            md:text-xl text-base py-4 hover:bg-[#FFD93D] hover:shadow-xl hover:scale-105 hover:text-white transition-all duration-300"
                  >
                    部屋に参加する
                  </button>
                </div>
              </div>
            </div>
          )}
          {showMatchmaking && <Matchmaking />}
        </div>
      </main>
      <Footer />
    </div>
  );
};
