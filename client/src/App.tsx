import React, { useState, useEffect, useCallback, useRef } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Circle, X } from "lucide-react"

import { Login } from "./pages/Login";
import { Home } from "./pages/Home";
import { Register } from "./pages/Register";
import { VerifyEmail } from "./pages/Verify-Email";

import { Multiplayer } from "./pages/MultiPlayer";
import { SinglePlayer } from "./pages/SinglePlayer";
import { Profile } from "./pages/Profile";
import { About } from "./pages/About";
import { History } from "./pages/History";
import { Ranking } from "./pages/Ranking";

import { SingleHistoryDetail } from "./components/History/SingleHistoryDetail";
import { MultiHistoryDetail } from "./components/History/MultiHistoryDetail";
import { PrivateRoute } from "./components/PrivateRoute";

import "./index.css";

type Bubble = {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  icon: string;
  oscillationCenter: number;
  oscillationAmplitude: number;
  oscillationSpeed: number;
}

export const App: React.FC = () => {
  const bubblesRef = useRef<Bubble[]>([]);
  const animationRef = useRef<number>();
  const lastUpdateTimeRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  const createBubbles = useCallback(() => {
    const colors = ['#FF6B6B', '#4ECDC4', '#FFD93D'];
    const icons = ['❓', '🧠', '🏆', '⚡', '📚', 'circle', 'x'];
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 40 + 20,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: Math.random() * 30 + 15,
      icon: icons[Math.floor(Math.random() * icons.length)],
      oscillationCenter: 0,
      oscillationAmplitude: Math.random() * 100 + 50,
      oscillationSpeed: Math.random() * 2 + 1
    }));
  }, []);

  useEffect(() => {
    bubblesRef.current = createBubbles();
    startTimeRef.current = performance.now();
  }, [createBubbles]);

  const updateBubbles = useCallback((currentTime: number) => {
    if (!lastUpdateTimeRef.current) {
      lastUpdateTimeRef.current = currentTime;
    }

    const deltaTime = (currentTime - lastUpdateTimeRef.current) / 1000;
    const elapsedTime = (currentTime - startTimeRef.current) / 1000;
    lastUpdateTimeRef.current = currentTime;

    bubblesRef.current = bubblesRef.current.map(bubble => {
      let newY = bubble.y - bubble.speed * deltaTime;

      if (newY < -bubble.size) {
        newY = window.innerHeight;
      }

      if (elapsedTime > 10) {
        if (bubble.oscillationCenter === 0) {
          bubble.oscillationCenter = newY;
        }
        const oscillationOffset = Math.sin((elapsedTime - 10) * bubble.oscillationSpeed) * bubble.oscillationAmplitude;
        newY = bubble.oscillationCenter + oscillationOffset;
      }

      return {
        ...bubble,
        y: newY
      };
    });

    animationRef.current = requestAnimationFrame(updateBubbles);
  }, []);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(updateBubbles);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [updateBubbles]);

  const renderIcon = (icon: string, _size: number) => {
    switch (icon) {
      case 'circle':
        return <Circle className="w-full h-full" />;
      case 'x':
        return <X className="w-full h-full" />;
      default:
        return icon;
    }
  };

  const [, forceUpdate] = useState({});

  useEffect(() => {
    const intervalId = setInterval(() => forceUpdate({}), 1000 / 60); // 60 FPS
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none" style={{ pointerEvents: 'none' }}>
        {bubblesRef.current.map((bubble) => (
          <div
            key={bubble.id}
            className="absolute rounded-full flex items-center justify-center text-white font-bold transition-all duration-300 ease-in-out"
            style={{
              left: `${bubble.x}px`,
              top: `${bubble.y}px`,
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              backgroundColor: bubble.color,
              opacity: 0.7,
              fontSize: `${bubble.size / 2}px`,
            }}
          >
            <div className="w-1/2 h-1/2 flex items-center justify-center">
              {renderIcon(bubble.icon, bubble.size / 2)}
            </div>
          </div>
        ))}
      </div>
      <div className="background-container"></div>
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
          <Route path="/about" element={<About />} />
          <Route path="/history" element={<History />} />
          <Route path="/rankings" element={<Ranking />} />
          <Route path="/history/singleplay/:id" element={<SingleHistoryDetail />} />
          <Route path="/history/multiplay/:id" element={<MultiHistoryDetail />} />
          <Route path="*" element={<h2>404 - Page not found</h2>} />
        </Routes>
      </Router>
    </div>
  );
};