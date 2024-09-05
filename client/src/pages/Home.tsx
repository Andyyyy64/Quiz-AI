import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography, Grid, IconButton } from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import HistoryIcon from "@mui/icons-material/History";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";

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

  const handleHistoryClick = () => {
    navi("/history");
  };

  const handleRankingClick = () => {
    navi("/ranking");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 relative">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center">
        <div className=" absolute top-44">
          <Typography variant="h4" component="h1" className="">
            こんにちは、{user?.name}さん！
          </Typography>
          <Typography variant="subtitle1" component="p" className="text-center">
            どのモードで遊びますか？
          </Typography>
        </div>

        <Grid container spacing={0} justifyContent="center" className=" gap-5">
          <Grid item>
            <Button
              variant="contained"
              color="inherit"
              startIcon={<EmojiPeopleIcon />}
              onClick={handleSinglePlayClick}
              style={{
                width: "180px",
                height: "120px",
                fontSize: "18px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              シングルプレイ
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="inherit"
              startIcon={<GroupIcon />}
              onClick={handleMultiPlayClick}
              style={{
                width: "180px",
                height: "120px",
                fontSize: "18px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              マルチプレイ
            </Button>
          </Grid>
        </Grid>

        <Grid
          container
          spacing={4}
          justifyContent="center"
          sx={{ marginTop: 5 }}
        >
          <Grid item>
            <IconButton
              color="error"
              onClick={handleRankingClick}
              style={{
                width: "80px",
                height: "80px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <LeaderboardIcon fontSize="large" />
            </IconButton>
            <Typography variant="body2" align="center" className="mt-2">
              ランキング
            </Typography>
          </Grid>
          <Grid item>
            <IconButton
              color="info"
              onClick={handleHistoryClick}
              style={{
                width: "80px",
                height: "80px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <HistoryIcon fontSize="large" />
            </IconButton>
            <Typography variant="body2" align="center" className="mt-2">
              対戦履歴
            </Typography>
          </Grid>
        </Grid>
      </main>
      <Footer />
    </div>
  );
};
