import React from "react";
import { Typography } from "@mui/material";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full text-center py-6 mt-auto bg-gray-800 text-white">
      <Typography variant="body2">
        © 2024 AI Quiz Battle. All rights reserved.
      </Typography>
    </footer>
  );
};
