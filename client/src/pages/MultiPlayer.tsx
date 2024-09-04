import React, { useState } from "react";
import { Matchmaking } from "../components/Multiplayer/MatchMaking";
import { Header } from "../components/Common/Header";
import { Footer } from "../components/Common/Footer";
import { Button } from "@mui/material";

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
      <main className="flex-grow mt-10">
        <div className="min-h-screen flex flex-col items-center">
          <div className="flex flex-wrap justify-center gap-6 mt-6">
            {!showMatchmaking && (
              <Button
                variant="outlined"
                color="primary"
                onClick={handleMatchmakeClick}
              >
                Start
              </Button>
            )}
            {showMatchmaking && <Matchmaking onMatchReset={handleMatchReset} />}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
