import React from "react";

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
  isDraw
}) => {
  return (
    <div
      className="w-full flex flex-col items-center max-w-4xl mx-auto 
    bg-white/10 backdrop-blur-md rounded-lg shadow-lg p-6"
    >
      <div className="w-full flex justify-between items-center">
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
      />
    </div>
  );
};
