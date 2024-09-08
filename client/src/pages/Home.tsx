import React, { useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@mui/material";
import { Header } from "../components/Common/Header";
import { Footer } from "../components/Common/Footer";
import { AuthContext } from "../context/AuthContext";
import { Users, User, Clock, BarChart } from "lucide-react"

export const Home: React.FC = () => {
  const authContext = useContext(AuthContext);
  const navi = useNavigate();

  if (authContext === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  const { user } = authContext;

  useEffect(() => {
    if (!user) {
      navi("/login");
    }
  }, [user, navi]);

  const handleSinglePlayClick = () => navi("/singleplay");
  const handleMultiPlayClick = () => navi("/multiplay");

  return (
    <div className="min-h-screen flex flex-col bg-inherit text-[#333333] relative overflow-hidden">
      <Header />
      <main className="container mx-auto mt-20 px-4 flex flex-col items-center 
      absolute sm:top-96 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        <div className="text-center space-y-8 mb-16 w-full max-w-md">
          <Button
            className="w-full h-16 text-black shadow-lg hover:shadow-xl 
            hover:scale-105 hover:cursor-pointer hover:bg-[#FF8787] transition-all"
            sx={{
              backgroundColor: "#FF6B6B",
              color: "white",
              borderRadius: "9999px",
              fontWeight: "bold",
              fontSize: "1.2rem",
            }}
            onClick={handleMultiPlayClick}
          >
            <Users className="mr-4 h-8 w-8" />
            マルチプレイ
          </Button>
          <Button
            className="w-60 h-12 text-xl py-6 px-12 hover:bg-[#66e4db]
            hover:scale-105 rounded-full transition-all"
            sx={{
              backgroundColor: "#4ECDC4",
              color: "white",
              borderRadius: "9999px",
              fontWeight: "bold",
            }}
            onClick={handleSinglePlayClick}
          >
            <User className="mr-4 h-6 w-6" />
            シングルプレイ
          </Button>
        </div>

        <div className="flex justify-center space-x-12 mt-8">
          <Link
            to="/history"
            className="group flex flex-col items-center transition-transform 
            transform hover:scale-110"
          >
            <div className="bg-inherit p-4 rounded-full 
            group-hover:bg-[#FFD93D] transition-colors"
            >
              <Clock className="h-10 w-10 text-[#FF6B6B]"
              />
            </div>
            <span className="mt-1 text-sm font-bold text-[#333333] 
            group-hover:text-[#FF6B6B] transition-colors"
            >
              履歴
            </span>
          </Link>
          <Link
            to="/rankings"
            className="group flex flex-col items-center transition-transform 
            transform hover:scale-110"
          >
            <div className="bg-inherit p-4 rounded-full 
            group-hover:bg-[#FFD93D] transition-colors"
            >
              <BarChart className="h-10 w-10 text-[#FF6B6B]" />
            </div>
            <span className="mt-1 text-sm font-bold text-[#333333] 
            group-hover:text-[#FF6B6B] transition-colors"
            >
              ランキング
            </span>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};
