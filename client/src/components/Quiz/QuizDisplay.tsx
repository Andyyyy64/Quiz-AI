import React from "react";
import { Clock } from "lucide-react";
import { QuizProps } from "../../types/quizType";
import { CheckCircle } from "lucide-react";

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
}) => {
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
        // 未回答 && 時間切れでない場合
        (isAnswerCorrect == null) && !isTimeUp && !isDraw ? (
          <div className="p-8 mb-8">
            <h2 className="text-2xl font-bold mb-16 text-center">
              {quiz?.question}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quiz?.choices.map((item, index) => (
                <button
                  key={index}
                  disabled={!canAnswer}
                  className={`text-lg py-4 border-2 rounded-lg transition-all flex items-center justify-center
                    ${canAnswer
                      ? 'bg-white border-[#4ECDC4] text-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-white hover:cursor-pointer'
                      : 'bg-[#FF6B6B] border-[#FF6B6B] text-white hover:cursor-not-allowed'
                    }`}
                  onClick={() => handleAnswerSelect(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        ) : (
          // 回答済み || 時間切れ || 引き分け
          <div className="text-2xl">
            {
              isTimeUp || isDraw ? (
                <h1 className="mb-10 font-bold text-2xl">{isTimeUp ? "時間切れ！" : "引き分け！"}</h1>
              ) : (
                isAnswerCorrect ? (
                  <h1 className="mb-10 font-bold text-2xl">正解！</h1>
                ) : (
                  <h1 className="mb-10 font-bold text-2xl">{isMultiplayer ? "相手が正解しました..." : "不正解"}</h1>
                )
              )
            }
            {quiz?.explanation}
          </div>
        )
      }
      <div className="flex justify-between items-center mt-10">
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-6 w-6 text-[#4ECDC4]" />
          <span className="text-lg font-bold">正解数: {correctCount}</span>
        </div>
        <div className="flex items-center space-x-2">
        </div>
      </div>
    </div>
  );
};
