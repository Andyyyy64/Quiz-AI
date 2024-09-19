import React, { useState, useEffect } from "react";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import { QuizProps } from "../../types/quizType";
import { useDots } from "../../hooks/useDots";

export const QuizDisplay: React.FC<QuizProps> = ({
  quiz,
  countdown,
  isCounting,
  isAnswerCorrect,
  handleAnswerSelect,
  canAnswer,
  isTimeUp,
  correctCount,
  isMultiplayer,
  isDraw,
  opponentAnswer,
}) => {
  const dots = useDots();
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (isAnswerCorrect !== null) {
      setShowAnimation(true);
      const timer = setTimeout(() => setShowAnimation(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isAnswerCorrect]);

  return (
    <div className="w-full text-center mt-3 relative h-full">
      {
        // クイズ表示
        isAnswerCorrect == null && !isTimeUp && !isDraw ? (
          <div className="md:px-8 md:py-4 p-5">
            {(isAnswerCorrect == null || !isTimeUp || !isDraw) && (
              <h1 className="md:text-xl text-base font-bold text-[#FF6B6B] mb-5">
                難易度: {quiz?.difficulty}
              </h1>
            )}
            <h2 className="md:text-2xl text-lg font-bold mb-10 text-center">
              {quiz?.question}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quiz?.choices.map((item, index) => {
                const isOpponentWrong: boolean = Boolean(
                  isMultiplayer &&
                    opponentAnswer &&
                    opponentAnswer === item &&
                    !isAnswerCorrect,
                );
                return (
                  <button
                    key={index}
                    disabled={!canAnswer || isOpponentWrong}
                    className={`md:text-lg text-base py-4 border-2 rounded-lg transition-all flex items-center justify-center
                 ${
                   isMultiplayer
                     ? canAnswer
                       ? "border-[#4ECDC4] text-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-white hover:cursor-pointer bg-white"
                       : "bg-[#FF6B6B] border-[#FF6B6B] text-white hover:cursor-not-allowed"
                     : canAnswer
                       ? "border-[#4ECDC4] text-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-white hover:cursor-pointer bg-white"
                       : "border-[#4ECDC4] text-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-white bg-white cursor-not-allowed"
                 }
                ${
                  isOpponentWrong
                    ? "bg-[#FF6B6B] border-[#FF6B6B] hover:cursor-not-allowed hover:bg-[#FF6B6B]"
                    : ""
                }
                    `}
                    onClick={() => handleAnswerSelect(item)}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          // 結果表示
          <div className="md:text-2xl text-lg p-5">
            <div className="">
              {isTimeUp || isDraw ? (
                <h1 className="mb-5 font-bold md:text-2xl text-lg">
                  {isTimeUp ? "時間切れ！" : "引き分け！"}
                </h1>
              ) : isAnswerCorrect ? (
                <div className="flex items-center justify-center mb-5">
                  <CheckCircle
                    className={`h-8 w-8 text-green-500 mr-2 ${
                      showAnimation ? "animate-bounce" : ""
                    }`}
                  />
                  <h1 className="font-bold md:text-2xl text-xl text-green-500">
                    正解！
                  </h1>
                </div>
              ) : (
                <div className="flex items-center justify-center mb-5">
                  <XCircle
                    className={`h-8 w-8 text-red-500 mr-2 ${
                      showAnimation ? "animate-shake" : ""
                    }`}
                  />
                  <h1 className="font-bold md:text-2xl text-xl text-red-500">
                    {isMultiplayer ? "相手が正解しました..." : "不正解"}
                  </h1>
                </div>
              )}
            </div>
            <h1 className="font-bold text-green-500 mb-5 md:text-2xl text-lg">
              {quiz?.correct_answer}
            </h1>
            {quiz?.explanation}
          </div>
        )
      }
      {/* 正解数と時間制限と結果時のローディング */}
      <div className="flex justify-between items-center p-5">
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-6 w-6 text-[#4ECDC4]" />
          <span className="md:text-2xl text-base font-bold">
            正解数: {correctCount}
          </span>
        </div>
        {isCounting && (
          <div className="flex items-center space-x-2 text-center">
            <Clock className="md:h-9 md:w-9 w-7 h-7 text-[#FF6B6B]" />
            <span className="md:text-2xl text-lg font-bold">{countdown}秒</span>
          </div>
        )}
        {(isAnswerCorrect != null || isTimeUp || isDraw) && (
          <div className="flex items-center space-x-2">
            <h1 className="text-[#FF6B6B] font-bold md:text-base text-xs">
              AIがクイズを生成中{dots}
            </h1>
          </div>
        )}
      </div>
      {/* @ts-ignore */}
      <style jsx global>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};
