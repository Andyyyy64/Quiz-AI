import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, ArrowLeft } from "lucide-react";
import { useSound } from "../../hooks/useSound";
import { useIsOnline } from "../../context/isOnlineContext";
import { AuthContext } from "../../context/AuthContext";
import { Header } from "../Common/Header";
import { Footer } from "../Common/Footer";

export const JoinMatch: React.FC = () => {
  const [sessionId, setSessionId] = useState<string>("");
  const navi = useNavigate();
  const intaractSound = useSound("intaract");
  const isOnline = useIsOnline();

  const authContext = useContext(AuthContext);
  if (authContext === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const handleJoinMatch = () => {
    if (sessionId.trim() !== "") {
      intaractSound.play();
      navi(`/multiplay/custom/${sessionId}`);
    }
  };

  const handleBack = () => {
    intaractSound.play();
    navi("/multiplay");
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" && isOnline && sessionId.trim() !== "") {
        handleJoinMatch();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOnline, sessionId]);

  return (
    <div className="min-h-screen flex flex-col bg-inherit relative">
      <Header />
      <main className="flex-grow flex items-center justify-center px-4 mb-32">
        <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8">
          <button
            onClick={handleBack}
            className="mb-6 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            aria-label="戻る"
          >
            <ArrowLeft className="h-6 w-6 text-[#FF6B6B]" />
          </button>
          <h1 className="md:text-3xl text-xl font-bold mb-8 text-center text-[#FF6B6B]">
            部屋に参加する
          </h1>
          <div className="mb-6">
            <label
              htmlFor="sessionId"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              部屋ID
            </label>
            <input
              id="sessionId"
              name="sessionId"
              type="number"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none
                         focus:ring-2 focus:ring-[#FF8787] focus:border-[#FF8787] md:text-lg text-xs"
              placeholder="部屋IDを入力してください"
            />
          </div>
          <button
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-full shadow-sm text-lg font-medium text-white
                      bg-[#FF6B6B] hover:bg-[#FF8787] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6B6B]
                      disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            disabled={!isOnline || sessionId.trim() === ""}
            onClick={handleJoinMatch}
          >
            <Zap size={24} className="mr-2" />
            参加する
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};
