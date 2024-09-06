import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { Button, IconButton } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
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
              <IconButton
                color="inherit"
                aria-label="profile"
                onClick={handleProfileClick}
              >
                <AccountCircle fontSize="large" />
              </IconButton>
              <IconButton
                color="inherit"
                aria-label="history"
                onClick={handleHistoryClick}
              >
                <HistoryIcon fontSize="medium" />
              </IconButton>
              <IconButton
                color="inherit"
                aria-label="logout"
                onClick={handleLogout}
              >
                <LogoutIcon fontSize="medium" />
              </IconButton>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
