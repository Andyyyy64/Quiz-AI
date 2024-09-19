import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { Header } from "../components/Common/Header";
import { Footer } from "../components/Common/Footer";
import { AuthContext } from "../context/AuthContext";
import { Users, User, History, Trophy } from "lucide-react";
import { useSound } from "../hooks/useSound";

export const Home: React.FC = () => {
  const authContext = useContext(AuthContext);
  const intaractSound = useSound("intaract");
  const navi = useNavigate();

  if (authContext === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  const { user } = authContext;

  const handleSinglePlayClick = () => {
    intaractSound.play();
    if(user) {
      navi("/singleplay");
    } else {
      navi("/login");
    }
  };
  const handleMultiPlayClick = () => {
    intaractSound.play();
    if(user) {
      navi("/multiplay");
    } else {
      navi("/login");
    }
  };

  const handleHistroyClick = () => {
    intaractSound.play();
    if(user) {
      navi("/history");
    } else {
      navi("/login");
    }
  };

  const handleRankingClick = () => {
    intaractSound.play();
    if(user) {
      navi("/rankings");
    } else {
      navi("/login");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-inherit text-[#333333] relative overflow-hidden">
      <Header />
      <main
        className="container mx-auto  px-4 flex flex-col items-center
      absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        <div className="text-center space-y-8 mb-16 w-full max-w-md">
          <Button
            className="w-full h-16 text-xl py-6 px-12 hover:bg-[#66e4db]
            hover:scale-105 rounded-full"
            sx={{
              backgroundColor: "#4ECDC4",
              color: "white",
              borderRadius: "9999px",
              fontWeight: "bold",
              fontSize: "1.2rem",
              transition: "all 0.3s",
            }}
            onClick={handleSinglePlayClick}
          >
            <User className="mr-2 h-8 w-8" />
            シングルプレイ
          </Button>
          <Button
            className=" w-60 h-12 text-black shadow-lg
            hover:scale-105 hover:cursor-pointer hover:bg-[#FF8787] transition-all"
            sx={{
              backgroundColor: "#FF6B6B",
              color: "white",
              borderRadius: "9999px",
              fontWeight: "bold",
              transition: "all 0.3s",
            }}
            onClick={handleMultiPlayClick}
          >
            <Users className="mr-2 h-6 w-6" />
            マルチプレイ
          </Button>
        </div>

        <div className="justify-center space-x-12 mt-8 md:flex hidden">
          <button
            className="group flex flex-col items-center transform transition-all 
            duration-300 hover:scale-110"
            onClick={handleHistroyClick}
          >
            <div
              className="bg-inherit p-4 rounded-full 
            group-hover:bg-[#FFD93D] transition-colors"
            >
              <History className="h-10 w-10 text-[#FF6B6B]" />
            </div>
            <span
              className="text-sm font-extrabold text-[#333333] 
            group-hover:text-[#FF6B6B] transition-colors"
            >
              履歴
            </span>
          </button>
          <button
            className="group flex flex-col items-center transform transition-all 
            duration-300 hover:scale-110"
            onClick={handleRankingClick}
          >
            <div
              className="bg-inherit p-4 rounded-full 
            group-hover:bg-[#FFD93D] transition-colors"
            >
              <Trophy className="h-10 w-10 text-[#FF6B6B]" />
            </div>
            <span
              className="text-sm font-extrabold text-[#333333] 
            group-hover:text-[#FF6B6B] transition-colors"
            >
              ランキング
            </span>
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};
