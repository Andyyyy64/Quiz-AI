import React from "react";
import { useEffect, useState } from "react";
import { SingleGameProps } from "../../types/playType";
import { QuizDisplay } from "../Quiz/QuizDisplay";
import { QuizProgressUI } from "../Quiz/QuizProgressUI";

export const SingleGame: React.FC<SingleGameProps> = ({
  quiz,
  questionCount,
  countdown,
  isCounting,
  currentQuizIndex,
  isAnswerCorrect,
  correctCount,
  isTimeUp,
  handleAnswerSelect,
}) => {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (isAnswerCorrect !== null) {
      setShowAnimation(true);
      const timer = setTimeout(() => setShowAnimation(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isAnswerCorrect]);

  return (
    <div
      className={`md:w-full w-[85%] flex flex-col flex-grow items-center max-w-4xl mx-auto
            bg-white rounded-lg transition-all duration-500 shadow-lg md:mt-10
            ${showAnimation ? "scale-110" : "scale-100"}
            `}
    >
      <QuizProgressUI
        currentQuizIndex={currentQuizIndex}
        questionCount={questionCount}
      />
      <QuizDisplay
        quiz={quiz}
        questionCount={questionCount}
        countdown={countdown}
        isCounting={isCounting}
        handleAnswerSelect={handleAnswerSelect}
        isAnswerCorrect={isAnswerCorrect}
        canAnswer={true}
        isMultiplayer={false}
        correctCount={correctCount}
        isTimeUp={isTimeUp}
      />
    </div>
  );
};
