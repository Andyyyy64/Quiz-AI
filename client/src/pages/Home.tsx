import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography, Grid } from "@mui/material";
import { EmojiPeople, Group, Leaderboard, History } from "@mui/icons-material";
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

  const handleSinglePlayClick = () => navi("/singleplay");
  const handleMultiPlayClick = () => navi("/multiplay");
  const handleHistoryClick = () => navi("/history");
  const handleRankingClick = () => navi("/ranking");

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#333333] relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(#FF6B6B 1px, transparent 1px), radial-gradient(#4ECDC4 1px, transparent 1px)`,
            backgroundSize: "20px 20px, 30px 30px",
            backgroundPosition: "0 0, 15px 15px",
            animation: "moveBackground 20s linear infinite",
          }}
        ></div>
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(#FFD93D 1px, transparent 1px), radial-gradient(#FF6B6B 1px, transparent 1px)`,
            backgroundSize: "20px 20px, 30px 30px",
            backgroundPosition: "0 0, 15px 15px",
            animation: "moveBackground 15s linear infinite reverse",
          }}
        ></div>
      </div>
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center relative z-10">
        <Grid
          container
          spacing={4}
          direction="column"
          alignItems="center"
          className="mb-8"
        >
          <Grid item>
            <Button
              variant="contained"
              startIcon={<EmojiPeople />}
              onClick={handleSinglePlayClick}
              size="large"
              sx={{ backgroundColor: "#FF6B6B"}}
              className="w-96 h-16 text-lg flex items-center justify-center hover:bg-[#45b7a7] text-white transition-all hover:shadow-xl hover:scale-105"
            >
              シングルプレイ
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<Group />}
              onClick={handleMultiPlayClick}
              className="w-96 h-16 text-lg flex items-center justify-center bg-[#FF6B6B] hover:bg-[#ff5252] text-white rounded-full shadow-lg transition-all hover:shadow-xl hover:scale-105"
            >
              マルチプレイ
            </Button>
          </Grid>
        </Grid>

        <Grid container spacing={4} justifyContent="center">
          <Grid item>
            <Button
              onClick={handleRankingClick}
              className="w-24 h-24 rounded-full transition-colors flex flex-col items-center justify-center"
            >
              <Leaderboard fontSize="large" className="text-[#FF6B6B]" />
              <Typography variant="body2" className="mt-2 text-[#333333]">
                ランキング
              </Typography>
            </Button>
          </Grid>
          <Grid item>
            <Button
              onClick={handleHistoryClick}
              className="w-24 h-24 rounded-full transitionflex flex-col items-center justify-center"
            >
              <History fontSize="large" className="text-[#FF6B6B]" />
              <Typography variant="body2" className="mt-2 text-[#333333]">
                対戦履歴
              </Typography>
            </Button>
          </Grid>
        </Grid>
      </main>
      <Footer />
      <style jsx global>{`
        @keyframes moveBackground {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(20px, 20px);
          }
        }
      `}</style>
    </div>
  );
};
