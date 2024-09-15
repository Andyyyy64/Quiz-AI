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
    <div className="min-h-screen flex flex-col bg-inherit">
      <Header />
      <main className="flex-grow flex flex-col justify-center relative items-center">
        <div className="w-full flex flex-col items-center">
          {!showMatchmaking && (
            <div className="md:px-0 px-4 pb-10">
              <Rule />
              <Button
                variant="text"
                onClick={handleMatchmakeClick}
                size="large"
                className="hover:bg-[#FF8787] hover:shadow-xl hover:scale-105 hover:text-white"
                sx={{
                  width: "100%",
                  maxWidth: 900,
                  textAlign: "center",
                  mb: 6,
                  display: "flex",
                  alignItems: "center",
                  color: "white",
                  backgroundColor: "#FF6B6B",
                  borderRadius: 9999,
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                  marginTop: 3,
                }}
              >
                マッチメイキング開始
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
