import React, { useEffect, useState } from "react";

import { QuizDisplay } from "../../Quiz/QuizDisplay";
import { PlayerUI } from "./PlayerUI";
import { OpponentUI } from "./OpponentUI";
import { QuizProgressUI } from "../../Quiz/QuizProgressUI";

import { QuizDisplayProps } from "../../../types/quizType";

export const MultiGame: React.FC<QuizDisplayProps> = ({
  user,
  quiz,
  handleAnswerSelect,
  opponent,
  countdown,
  isCounting,
  isAnswerCorrect,
  canAnswer,
  isTimeUp,
  currentQuizIndex,
  correctCount,
  isDraw,
  opponentAnswer,
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
      className={`md:w-full w-[85%] flex flex-col items-center max-w-4xl mx-auto 
                bg-white rounded-xl shadow-lg
                transition-all duration-500
                ${showAnimation ? "scale-110" : "scale-100"}`}
    >
      <div className="w-full flex justify-between items-center px-2 md:p-4">
        <PlayerUI user={user} />
        <QuizProgressUI currentQuizIndex={currentQuizIndex ?? 0} />
        <OpponentUI opponent={opponent} />
      </div>
      <QuizDisplay
        quiz={quiz}
        countdown={countdown}
        isCounting={isCounting}
        handleAnswerSelect={handleAnswerSelect}
        isAnswerCorrect={isAnswerCorrect}
        canAnswer={canAnswer}
        isTimeUp={isTimeUp}
        correctCount={correctCount}
        isMultiplayer={true}
        isDraw={isDraw}
        opponentAnswer={opponentAnswer}
      />
    </div>
  );
};
