import React, { useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

import { Matchmaking } from "../components/Multiplayer/MatchMaking";

export const Home: React.FC = () => {
  const [showMatchmaking, setShowMatchmaking] = useState(false);

  const authContext = useContext(AuthContext);
  if (authContext === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  const { user } = authContext;
  const navi = useNavigate();

  const isTokenExpired = (token: string) => {
    const decoded: { exp: number } = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && isTokenExpired(token)) {
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      alert("Your session has expired. Please log in again.");
      navi("/login");
    }
  }, [navi]);

  useEffect(() => {
    if (!user) {
      navi("/login");
    }
  }, [user, navi]);

  const handleMatchmakeClick = () => {
    setShowMatchmaking(true); // ボタンがクリックされたときにマッチメイキングを表示
  };

  return (
    <div>
      <h1>Home</h1>
      {!showMatchmaking && (
        <button onClick={handleMatchmakeClick}>Start Matchmaking</button> // マッチメイクボタン
      )}
      {showMatchmaking && <Matchmaking />}
    </div>
  );
};
