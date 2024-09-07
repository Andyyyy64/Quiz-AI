import React from "react";
import { OpponentUIProps } from "../../../types/quizType";

export const OpponentUI: React.FC<OpponentUIProps> = ({ opponent }) => {
  return (
    <div>
      <div className="text-center">
        <img
          className="w-24 h-24 rounded-full object-cover border-2 border-[#FF6B6B]"
          src={opponent?.prof_image_url}
          alt={opponent?.name}
        />
        <p className="font-bold">{opponent?.name}</p>
      </div>
    </div>
  );
};
