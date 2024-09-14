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
  opponentAnswer
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
    <div className="w-full text-center mt-8 relative">
      {isCounting && (
        <div className="flex items-center space-x-2 text-center mt-5
                absolute -top-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          <Clock className="h-10 w-10 text-[#4ECDC4]" />
          <span className="text-2xl font-bold">{countdown}s</span>
        </div>
      )}
      {
        (isAnswerCorrect == null) && !isTimeUp && !isDraw ? (
          <div className="p-8 mb-8">
            <h2 className="text-2xl font-bold mb-16 text-center">
              {quiz?.question}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quiz?.choices.map((item, index) => {
                const isOpponentWrong: boolean = Boolean(isMultiplayer && opponentAnswer && opponentAnswer === item && !isAnswerCorrect);

                return (
                  <button
                    key={index}
                    disabled={!canAnswer || isOpponentWrong}
                    className={`text-lg py-4 border-2 rounded-lg transition-all flex items-center justify-center
                      ${canAnswer
                        ? 'border-[#4ECDC4] text-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-white hover:cursor-pointer bg-white'
                        : 'bg-[#FF6B6B] border-[#FF6B6B] text-white hover:cursor-not-allowed'
                      }
                      ${isOpponentWrong ? 'bg-[#FF6B6B] border-[#FF6B6B] hover:cursor-not-allowed hover:bg-[#FF6B6B]' : ''}
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
          <div className="text-2xl">
            <div className={`text-2xl transition-all duration-500`}>
              {
                isTimeUp || isDraw ? (
                  <h1 className="mb-10 font-bold text-2xl">{isTimeUp ? "時間切れ！" : "引き分け！"}</h1>
                ) : (
                  isAnswerCorrect ? (
                    <div className="flex items-center justify-center mb-10">
                      <CheckCircle className={`h-8 w-8 text-green-500 mr-2 ${showAnimation ? 'animate-bounce' : ''}`} />
                      <h1 className="font-bold text-2xl text-green-500">正解！</h1>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center mb-10">
                      <XCircle className={`h-8 w-8 text-red-500 mr-2 ${showAnimation ? 'animate-shake' : ''}`} />
                      <h1 className="font-bold text-2xl text-red-500">{isMultiplayer ? "相手が正解しました..." : "不正解"}</h1>
                    </div>
                  )
                )
              }
            </div>
            {quiz?.explanation}
          </div>
        )
      }
      <div className="flex justify-between items-center mt-10">
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-6 w-6 text-[#4ECDC4]" />
          <span className="text-lg font-bold">正解数: {correctCount}</span>
        </div>
        {
          ((isAnswerCorrect != null) || isTimeUp) && (
            <div className="flex items-center space-x-2">
              <h1 className="text-[#FF6B6B]">AIがクイズを生成中です{dots}</h1>
            </div>
          )
        }
      </div>
      {/* @ts-ignore */}
      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};