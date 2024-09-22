import React, { useState, useEffect } from "react";
import { Users, Zap, Plus, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Matchmaking } from "../components/Multiplayer/MatchMaking";
import { Header } from "../components/Common/Header";
import { Footer } from "../components/Common/Footer";
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
              <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl md:px-8 md:py-4 p-4">
                <div className="grid md:grid-cols-2 justify-center gap-8 md:mb-8 mb-4">
                  <div>
                    <h2 className="md:text-2xl text-lg font-bold mb-4 flex items-center">
                      <Users className="h-6 w-6 mr-2 text-[#4ECDC4]" />
                      遊び方
                    </h2>
                    <ul className="list-disc list-inside space-y-2 text-[#333333] font-medium text-xs md:text-base">
                      <li>他のプレイヤーとリアルタイムで競い合う！</li>
                      <li>様々なカテゴリの問題が出題！</li>
                      <li>正解するとポイントを獲得！</li>
                      <li>ポイントの変動に応じてランキングが変動！</li>
                      <li>連勝して、ランキング1位を目指そう！</li>
                    </ul>
                  </div>
                  <div>
                    <h2 className="md:text-2xl text-lg font-bold mb-4 flex items-center">
                      <Zap className="h-6 w-6 mr-2 text-[#FFD93D]" />
                      マッチルール
                    </h2>
                    <ul className="list-disc list-inside space-y-2 text-[#333333] font-medium text-xs md:text-base">
                      <li>1マッチにつき10問</li>
                      <li>各質問に答える時間は30秒</li>
                      <li>10問解いて得点が多いほうが勝利</li>
                      <li>不正行為や外部の助けは禁止</li>
                      <li>他のプレイヤーへの敬意を忘れずに</li>
                    </ul>
                  </div>
                </div>
                <button
                  onClick={handleMatchmakeClick}
                  className="w-full max-h-[60px] text-center flex items-center justify-center text-white bg-[#FF6B6B] rounded-full font-bold
                          md:text-xl text-base md:mt-0 mt-3 mb-5 py-4 hover:bg-[#FF8787] hover:shadow-xl hover:scale-105 hover:text-white transition-all duration-300"
                >
                  マッチメイキング開始
                </button>
                <p className="md:text-sm text-[10px] text-gray-500 text-center">
                  ※当サイトではAIを活用してクイズを生成しているため、誤った解答や偏りのある問題が含まれる場合があります。あらかじめご了承ください。
                </p>
              </div>
              <div className="flex flex-col w-full mt-8">
                <div className="relative text-center mb-6">
                  <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-inherit px-4 text-gray-500 font-medium">
                    または
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <button
                    onClick={handleCreateMatchClick}
                    className="w-full max-h-[60px] text-center flex items-center justify-center text-white bg-[#4ECDC4] rounded-full font-bold
                            md:text-xl text-base py-4 hover:bg-[#66E4DB] hover:shadow-xl hover:scale-105 hover:text-white transition-all duration-300"
                  >
                    <Plus className="mr-2 h-6 w-6" />
                    部屋を作成する
                  </button>
                  <button
                    onClick={handleJoinMatchClick}
                    className="w-full max-h-[60px] text-center flex items-center justify-center text-white bg-[#FFD93D] rounded-full font-bold
                            md:text-xl text-base py-4 hover:bg-[#FFD93D] hover:shadow-xl hover:scale-105 transition-all duration-300"
                  >
                    <LogIn className="mr-2 h-6 w-6" />
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
