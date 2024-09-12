import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { User, LogOut, Clock } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

import { Info, BarChart } from "lucide-react";

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

  const handleHistoryClick = () => {
    navi("/history");
  };

  const handleAboutClick = () => {
    navi("/about");
  }

  const handleRankingClick = () => {
    navi("/rankings");
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navi("/login");
  };

  return (
    <div className=" relative">
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center">
          <Link to="/">
            <img
              className="w-44 h-22 object-fill"
              src="favicon.png"
            />
          </Link>
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
                  onClick={handleRankingClick}
                >
                  <BarChart className="h-6 w-6" />
                </button>
                <button
                  className="text-[#333333] hover:text-[#4ECDC4] hover:bg-inherit"
                  onClick={handleAboutClick}
                >
                  <Info className="h-6 w-6" />
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
