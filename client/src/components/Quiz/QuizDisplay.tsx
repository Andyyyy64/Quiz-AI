import React from "react";
import { Clock } from "lucide-react";
import { QuizProps } from "../../types/quizType";

import { useDots } from "../../hooks/useDots";

import { Button, TextField } from "@mui/material";

export const QuizDisplay: React.FC<QuizProps> = ({
  quiz,
  countdown,
  isCounting,
  isAnswering,
  opponentAnswering,
  handleAnswerClick,
  canAnswer,
  inputAnswer,
  setInputAnswer,
  handleAnswerDone,
}) => {
  const dots = useDots();
  return (
    <div className="w-full text-center mt-8">
      <div className="p-8 mb-8">
        <h2 className="text-2xl font-bold mb-16 text-center">
          {quiz?.problem}
        </h2>
        {/* if相手が回答中　*/}
        {opponentAnswering && (
          <h2 className="text-md font-bold text-center text-[#FF6B6B]">
            相手が回答中{dots}
          </h2>
        )}
        {/* if自分が回答中　*/}
        {isCounting && (
          <div className="flex items-center space-x-1">
            <Clock className="h-6 w-6 text-[#4ECDC4]" />
            <span className="text-xl font-bold mb-1">{countdown}s</span>
          </div>
        )}
        {/* 回答ボタン　*/}
        {!isAnswering && !opponentAnswering ? (
          <div className="flex flex-col mt-4">
            <Button
              variant="contained"
              color="primary"
              onClick={handleAnswerClick}
              disabled={!canAnswer}
              size="large"
              sx={{ backgroundColor: "#4ECDC4" }}
              className="hover:bg-[#44b8b1]"
            >
              回答
            </Button>
          </div>
        ) : (
          // 回答入力フォーム
          isAnswering && (
            <div className="flex flex-col mt-4">
              <TextField
                variant="outlined"
                label="Your Answer"
                className="mt-4"
                value={inputAnswer}
                onChange={(e) => setInputAnswer(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAnswerDone()}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleAnswerDone}
                size="large"
                sx={{ backgroundColor: "#4ECDC4" }}
                className="hover:bg-[#44b8b1] mt-4"
              >
                送信
              </Button>
            </div>
          )
        )}
      </div>
    </div>
  );
};
