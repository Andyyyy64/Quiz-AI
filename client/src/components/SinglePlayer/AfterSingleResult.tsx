import React from "react";
import { Star, Clock, Book, RefreshCcw } from "lucide-react";
import { Button } from "@mui/material";

import { AfterSingleResultProps } from "../../types/playType";

export const AfterSingleResult: React.FC<AfterSingleResultProps> = ({
  correctCount,
  questionCount,
  duration,
  category,
  difficulty,
  handleRestart,
  handleRestartWithSettings,
  handleGoHistory,
}) => {
  return (
    <main className="container mx-auto md:mt-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl p-8">
        <h1 className="md:text-3xl text-xl font-bold mb-6 text-center">クイズの結果！</h1>
        <div className="mb-8">
          <div className="text-center">
            <div className="w-full h-3 bg-[#F0F0F0] rounded-full mx-auto">
              <div
                className="h-full bg-[#FF6B6B] rounded-full"
                style={{ width: `${(correctCount / questionCount) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-600">正解数</span>
            <span className="text-sm font-semibold">
              {correctCount} / {questionCount}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Clock className="h-5 w-5 text-[#FF6B6B] mr-2" />
              <span className="font-semibold md:text-base text-xs">
                かかった時間
              </span>
            </div>
            <p className="md:text-xl text-sm font-bold">{duration}秒</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Book className="h-5 w-5 text-[#4ECDC4] mr-2" />
              <span className="font-semibold md:text-base text-xs">
                カテゴリ
              </span>
            </div>
            <p className="md:text-xl text-sm font-bold">
              {category == "" ? "ランダム" : category}
            </p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Star className="h-5 w-5 text-[#FFD93D] mr-2" />
              <span className="font-semibold md:text-base text-xs">難易度</span>
            </div>
            <p className="md:text-xl text-sm font-bold">
              {difficulty == "" ? "ランダム" : difficulty}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Button
            className="w-full h-10 text-black hover:shadow-xl
                       hover:cursor-pointer hover:bg-[#4ECDC4] hover:text-white transition-all"
            sx={{
              border: "2px solid",
              borderColor: "#4ECDC4",
              backgroundColor: "inherit",
              color: "#4ECDC4",
              borderRadius: "10px",
              fontWeight: "bold",
              fontSize: "1.2rem",
              md: { fontSize: "1.2rem" },
            }}
            onClick={handleGoHistory}
          >
            履歴をみる！
          </Button>
          <Button
            className="w-full h-10 text-black
                       hover:cursor-pointer hover:bg-[#FF8787] transition-all"
            sx={{
              backgroundColor: "#FF6B6B",
              color: "white",
              borderRadius: "10px",
              fontWeight: "bold",
              fontSize: "1.2rem",
              md: { fontSize: "1.2rem" },
            }}
            onClick={handleRestart}
            startIcon={<RefreshCcw className="h-5 w-5" />}
          >
            もう一度プレイ！
          </Button>
          <Button
            className="w-full h-15 text-black
                         hover:cursor-pointer hover:bg-[#FF8787] transition-all"
            sx={{
              backgroundColor: "#FF6B6B",
              color: "white",
              borderRadius: "10px",
              fontWeight: "bold",
              fontSize: "1.2rem",
              md: { fontSize: "1.2rem" },
            }}
            onClick={handleRestartWithSettings}
          >
            設定をそのままで再プレイ！
          </Button>
        </div>
      </div>
    </main>
  );
};
