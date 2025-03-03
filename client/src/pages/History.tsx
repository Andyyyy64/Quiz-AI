import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Header } from "../components/Common/Header";
import { Footer } from "../components/Common/Footer";
import { SinglePlayerHistory } from "../components/History/SinglePlayerHistory";
import { MultiPlayerHistory } from "../components/History/MultiPlayerHistory";
import { Users, User } from "lucide-react";
import { useSound } from "../hooks/useSound";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const History: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"singleplayer" | "multiplayer">(
    "singleplayer",
  );
  const [isTransitioning, setIsTransitioning] = useState(false);

  const intaractSound = useSound("intaract");

  const navi = useNavigate();
  const authContext = useContext(AuthContext);
  if (authContext === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  const { user } = authContext;

  const handleTabChange = (tab: "singleplayer" | "multiplayer") => {
    if (tab !== activeTab) {
      intaractSound.play();
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveTab(tab);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handleBack = () => {
    intaractSound.play();
    navi("/");
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-inherit overflow-hidden">
      <Header />
      <main className="container mx-auto px-4 pb-20">
        <div className="flex items-center justify-center md:mb-5">
          <button
            onClick={handleBack}
            className="mr-1 p-2 rounded-full hover:bg-gray-200 transition-colors duration-200"
            aria-label="戻る"
          >
            <ArrowLeft className="h-8 w-8 text-black hidden md:block" />
          </button>
          <h1 className="md:text-3xl text-2xl font-bold text-center hidden md:block">
            クイズの履歴
          </h1>
        </div>
        <div className="bg-white rounded-xl shadow-xl p-6 max-w-3xl mx-auto">
          <div className="flex mb-6 gap-2">
            <button
              onClick={() => handleTabChange("singleplayer")}
              className={`flex-1 py-2 px-4 text-center flex items-center justify-center rounded-lg shadow-sm transition-colors duration-300
                                ${
                                  activeTab === "singleplayer"
                                    ? "bg-[#4ECDC4] text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
            >
              <User className="md:mr-2 md:h-4 md:w-4 w-10 h-10" />
              <p className="hidden md:block">シングルプレイ</p>
            </button>
            <button
              onClick={() => handleTabChange("multiplayer")}
              className={`flex-1 py-2 px-4 text-center flex items-center justify-center rounded-lg shadow-sm transition-colors duration-300
                                ${
                                  activeTab === "multiplayer"
                                    ? "bg-[#4ECDC4] text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
            >
              <Users className=",d:mr-2 md:h-4 md:w-4 w-10 h-10" />
              <p className="hidden md:block">マルチプレイ</p>
            </button>
          </div>

          <div className="overflow-hidden">
            <div
              className={`w-full transition-all duration-300 ${
                isTransitioning ? "opacity-0" : "opacity-100"
              }`}
            >
              {user && activeTab === "multiplayer" && (
                <MultiPlayerHistory user_id={user.user_id} />
              )}
              {user && activeTab === "singleplayer" && (
                <SinglePlayerHistory user_id={user.user_id} />
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
