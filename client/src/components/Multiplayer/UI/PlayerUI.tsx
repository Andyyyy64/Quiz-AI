import React from "react";
import { PlayerUIProps } from "../../../types/quizType";

export const PlayerUI: React.FC<PlayerUIProps> = ({ user }) => {
  return (
    <div className="text-center">
      <img
        className="w-24 h-24 rounded-full object-cover border-2 border-[#4ECDC4]"
        src={user?.prof_image_url}
        alt={user?.name}
      />
      <p className="font-bold">You</p>
    </div>
  );
};
