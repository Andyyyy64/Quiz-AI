import React from "react";
import { Typography } from "@mui/material";
import { QuizProps } from "../../types/quizType";

export const QuizDisplay: React.FC<QuizProps> = ({ quiz, countdown, isCounting }) => {
  return (
    <div className="w-full text-center mt-8">
      <Typography variant="h4" className="font-bold">
        問題: {quiz.problem}
      </Typography>
      <Typography variant="h6" className="mt-4">
        カテゴリ: {quiz.category}
      </Typography>
      <Typography variant="h6" className="mt-4">
        難易度: {quiz.difficulty}
      </Typography>
      {isCounting && (
        <Typography variant="h6" className="mt-4">
          {countdown}秒
        </Typography>
      )}
    </div>
  );
};
