import React from "react";
import { Button, TextField, Typography } from "@mui/material";
import { PlayerUIProps } from "../../../types/quizType";

export const PlayerUI: React.FC<PlayerUIProps> = ({
  isAnswering,
  opponentAnswering,
  inputAnswer,
  setInputAnswer,
  handleAnswerClick,
  handleAnswerDone,
  canAnswer,
}) => {
  return (
    <div className="w-80 p-8 border-4 border-gray-300 bg-blue-100 shadow-lg rounded-lg">
      <Typography
        variant="h6"
        className="font-bold text-blue-700"
        sx={{ textAlign: "center" }}
      >
        あなた
      </Typography>
      {!isAnswering && !opponentAnswering ? (
        <div className="flex flex-col mt-4">
          <Button
            variant="contained"
            color="primary"
            onClick={handleAnswerClick}
            disabled={!canAnswer}
            size="large"
          >
            回答
          </Button>
        </div>
      ) : (
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
              className="mt-4"
              size="large"
            >
              送信
            </Button>
          </div>
        )
      )}
    </div>
  );
};
