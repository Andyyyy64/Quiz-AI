import React from "react";
import { Clock } from "lucide-react";
import { QuizProps } from "../../types/quizType";

export const QuizDisplay: React.FC<QuizProps> = ({
  quiz,
  countdown,
  isCounting,
  isAnswerCorrect,
  handleAnswerSelect,
  selectedAnswer,
  canAnswer,
}) => {
  return (
    <div className="w-full text-center mt-8">
      {isAnswerCorrect == null ? (
        <div className="p-8 mb-8">
          <h2 className="text-2xl font-bold mb-16 text-center">
            {quiz?.question}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quiz?.choices.map((item, index) => (
              <button
                key={index}
                disabled={!canAnswer}
                className={`text-lg py-4 bg-white border-2 border-[#4ECDC4] text-[#4ECDC4] hover:bg-[#4ECDC4]
                 hover:cursor-pointer rounded-lg transition-all
                 ${!canAnswer ? "hover:bg-inherit hover:text-[#4ECDC4] hover:cursor-default"
                    : "hover:bg-[#4ECDC4] hover:text-white"
                  }`}
                onClick={() => handleAnswerSelect(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-2xl">
          <h1 className="mb-10 font-bold text-2xl">{isAnswerCorrect ? "正解！" : "相手が正解しました..."}</h1>
          {quiz?.explanation}
        </div>
      )}
    </div>
  );
};
