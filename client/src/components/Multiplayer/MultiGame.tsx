import React from "react";
import { QuizDisplay } from "../Quiz/QuizDisplay";
import { PlayerUI } from "./UI/PlayerUI";
import { OpponentUI } from "./UI/OpponentUI";
import { QuizDisplayProps } from "../../types/quizType";

export const MultiGame: React.FC<QuizDisplayProps> = ({
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
    <div className="min-h-screen flex flex-col items-center gap-y-40">
      <QuizDisplay quiz={quiz} countdown={countdown} isCounting={isCounting} />

      <div className="w-full flex justify-center items-center mb-8 gap-10">
        <PlayerUI
          isAnswering={isAnswering}
          opponentAnswering={opponentAnswering}
          inputAnswer={inputAnswer}
          setInputAnswer={setInputAnswer}
          handleAnswerClick={handleAnswerClick}
          handleAnswerDone={handleAnswerDone}
          canAnswer={canAnswer}
        />

        <OpponentUI opponent={opponent} opponentAnswering={opponentAnswering} />
      </div>
    </div>
  );
};
