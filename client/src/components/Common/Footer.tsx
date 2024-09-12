import React from "react";
import { Typography } from "@mui/material";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full text-center py-6 mt-auto text-black">
      <Typography variant="body2">
        © 2024 クイズ！AIが作った問題 All rights reserved.
      </Typography>
    </footer>
  );
};
