import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";

import { Header } from "../components/Common/Header";
import { Footer } from "../components/Common/Footer";
import { AuthContext } from "../context/AuthContext";

export const Home: React.FC = () => {
  const authContext = useContext(AuthContext);
  const navi = useNavigate();

  if (authContext === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  const { user } = authContext;

  useEffect(() => {
    if (!user) {
      navi("/login");
    }
  }, [user, navi]);

  const handleSinglePlayClick = () => {
    navi("/singleplay");
  };

  const handleMultiPlayClick = () => {
    navi("/multiplay");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center">
        <div className="flex flex-wrap justify-center gap-6 mt-6">
          <IconButton
            color="primary"
            aria-label="multiplay"
            onClick={handleSinglePlayClick}
          >
            <EmojiPeopleIcon color="primary" fontSize="large" />
          </IconButton>
          <IconButton
            color="primary"
            aria-label="multiplay"
            onClick={handleMultiPlayClick}
          >
            <GroupIcon color="primary" fontSize="large" />
          </IconButton>
        </div>
      </main>
      <Footer />
    </div>
  );
};
