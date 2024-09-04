import React, { useState } from "react";

import { Button } from "@mui/material";

import { Matchmaking } from "../components/Multiplayer/MatchMaking";
import { Header } from "../components/Common/Header";
import { Footer } from "../components/Common/Footer";
import { Rule } from "../components/Common/Rule";

export const Multiplayer: React.FC = () => {
  const [showMatchmaking, setShowMatchmaking] = useState(false);

  const handleMatchmakeClick = () => {
    setShowMatchmaking(true); // ボタンがクリックされたときにマッチメイキングを表示
  };

  const handleMatchReset = () => {
    setShowMatchmaking(false); // マッチがリセットされたときに再度表示
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-grow flex flex-col justify-center items-center">
        <div className="w-full flex flex-col items-center">
          {!showMatchmaking && (
            <div>
              <Rule />
              <Button
                variant="outlined"
                color="primary"
                onClick={handleMatchmakeClick}
                size="large"
                sx={{
                  width: "100%",
                  maxWidth: 600,
                  textAlign: "center",
                  mb: 6,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Start
              </Button>
            </div>
          )}
          {showMatchmaking && <Matchmaking onMatchReset={handleMatchReset} />}
        </div>
      </main>
      <Footer />
    </div>
  );
};
