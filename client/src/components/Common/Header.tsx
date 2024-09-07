import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@mui/material";
import { User, LogOut, Clock } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

import { Brain } from "lucide-react";

export const Header: React.FC = () => {
  const authContext = useContext(AuthContext);
  const navi = useNavigate();

  if (authContext === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  const { user, setUser } = authContext;

  const handleProfileClick = () => {
    navi("/profile");
  };

  const handleHomeClick = () => {
    navi("/");
  };

  const handleHistoryClick = () => {
    navi("/history");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navi("/login");
  };

  return (
    <div className="">
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center">
          <Button
            variant="text"
            color="inherit"
            aria-label="home"
            onClick={handleHomeClick}
            sx={{
              color: "black",
              fontWeight: "bold",
              fontSize: "1.2rem",
              backgroundColor: "inherit",
            }}
          >
            <Brain className="h-8 w-8 text-[#FF6B6B]" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          {user && (
            <div className="container mx-auto flex justify-between items-center p-4">
              <div className="flex items-center space-x-10">
                <button
                  className="text-[#333333] hover:text-[#4ECDC4] hover:bg-inherit"
                  onClick={handleProfileClick}
                >
                  <User className="h-6 w-6" />
                </button>
                <button
                  className="text-[#333333] hover:text-[#4ECDC4] hover:bg-inherit"
                  onClick={handleHistoryClick}
                >
                  <Clock className="h-6 w-6" />
                </button>
                <button
                  className="text-[#333333] hover:text-[#4ECDC4] hover:bg-inherit"
                  onClick={handleLogout}
                >
                  <LogOut className="h-6 w-6" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
