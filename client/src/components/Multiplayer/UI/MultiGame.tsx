import React from "react";
import { QuizDisplay } from "../../Quiz/QuizDisplay";
import { PlayerUI } from "./PlayerUI";
import { OpponentUI } from "./OpponentUI";
import { QuizDisplayProps } from "../../../types/quizType";

export const MultiGame: React.FC<QuizDisplayProps> = ({
  user,
  quiz,
  inputAnswer,
  setInputAnswer,
  handleAnswerClick,
  handleAnswerDone,
  canAnswer,
  isAnswering,
  opponentAnswering,
  opponent,
  countdown,
  isCounting,
}) => {
  return (
    <div
      className="w-full flex flex-col items-center max-w-4xl mx-auto 
    bg-white/10 backdrop-blur-md rounded-lg shadow-lg p-6"
    >
      <div className="w-full flex justify-between items-center">
        <PlayerUI user={user} />
        <OpponentUI opponent={opponent} />
      </div>
      <QuizDisplay
        quiz={quiz}
        countdown={countdown}
        isCounting={isCounting}
        isAnswering={isAnswering}
        opponentAnswering={opponentAnswering}
        inputAnswer={inputAnswer}
        setInputAnswer={setInputAnswer}
        handleAnswerClick={handleAnswerClick}
        handleAnswerDone={handleAnswerDone}
        canAnswer={canAnswer}
      />
    </div>
  );
};
