import React from "react";
import { Typography } from "@mui/material";
import { OpponentUIProps } from "../../../types/quizType";

export const OpponentUI: React.FC<OpponentUIProps> = ({
  opponent,
  opponentAnswering,
}) => {
  return (
    <div className="w-80 p-8 border-4 border-gray-300 bg-red-100 shadow-lg rounded-lg">
      <Typography
        variant="h6"
        className="font-bold text-red-700"
        sx={{ textAlign: "center" }}
      >
        {opponent?.name}
      </Typography>
      <Typography variant="body1" className="mt-4" sx={{ textAlign: "center" }}>
        ランク: {opponent?.rank}
      </Typography>
      {/* 相手が回答中　*/}
      {opponentAnswering && (
        <Typography
          variant="body1"
          className="mt-4"
          sx={{ textAlign: "center" }}
        >
          相手が回答中...
        </Typography>
      )}
    </div>
  );
};
