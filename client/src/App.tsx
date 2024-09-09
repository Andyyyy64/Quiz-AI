import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { Login } from "./pages/Login";
import { Home } from "./pages/Home";
import { Register } from "./pages/Register";
import { VerifyEmail } from "./pages/Verify-Email";

import { Multiplayer } from "./pages/MultiPlayer";
import { SinglePlayer } from "./pages/SinglePlayer";
import { Profile } from "./pages/Profile";
import { History } from "./pages/History";

import { PrivateRoute } from "./components/PrivateRoute";

import "./index.css";

export const App: React.FC = () => {
  return (
    <div className="relative min-h-screen">
      <div className="background-container"></div> {/* 背景コンテナを追加 */}
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          <Route path="/multiplay" element={<Multiplayer />} />
          <Route path="/singleplay" element={<SinglePlayer />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/history" element={<History />} />
          
          <Route path="*" element={<h2>404 - Page not found</h2>} />
        </Routes>
      </Router>
    </div>
  );
};
