import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { Button, IconButton } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import HistoryIcon from "@mui/icons-material/History";

import { AuthContext } from "../../context/AuthContext";

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
    <div className="bg-gray-100">
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center">
          <Button
            variant="text"
            color="inherit"
            aria-label="home"
            onClick={handleHomeClick}
            sx={{
              color: "black",
              fontFamily: "cursive",
              fontWeight: "bold",
              fontSize: "1.2rem",
            }}
          >
            AI Quiz Battle
          </Button>
        </div>
        <div className="flex items-center gap-2">
          {user && (
            <>
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 hover:cursor-pointer">
                  <img
                    src={user.prof_image_url}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                    onClick={handleProfileClick}
                  />
                </div>
              </div>
              <IconButton
                color="inherit"
                aria-label="history"
                onClick={handleHistoryClick}
              >
                <HistoryIcon />
              </IconButton>
              <IconButton
                color="inherit"
                aria-label="logout"
                onClick={handleLogout}
              >
                <LogoutIcon />
              </IconButton>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
