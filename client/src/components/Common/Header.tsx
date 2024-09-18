import React, { useContext } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { User, LogOut, History, Info, Trophy, Home } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { useSound } from "../../hooks/useSound";

export const Header: React.FC = () => {
  const authContext = useContext(AuthContext);
  const intaractSound = useSound("intaract");
  const navi = useNavigate();
  // get /{something} in the URL in string
  const location = useLocation();
  if (authContext === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  const { user, setUser } = authContext;

  const handleProfileClick = () => {
    navi("/profile");
    intaractSound.play();
  };
  const handleHistoryClick = () => {
    navi("/history");
    intaractSound.play();
  };
  const handleAboutClick = () => {
    navi("/about");
    intaractSound.play();
  };
  const handleRankingClick = () => {
    navi("/rankings");
    intaractSound.play();
  };
  const handleHomeClick = () => {
    navi("/");
    intaractSound.play();
  };

  const handleLogout = () => {
    intaractSound.play();
    localStorage.removeItem("token");
    setUser(null);
    navi("/login");
  };

  return (
    <div className="relative">
      {/* 上部バー */}
      <div className="flex justify-between items-center md:px-4 md:pt-1">
        {/* 左側 */}
        <div className="flex items-center">
          {/* スマホ時の favicon */}
          <Link to="/" className="md:hidden p-2">
            <img
              className="w-32 h-16 object-contain"
              src="/favicon.png"
              alt="Logo"
            />
          </Link>

          {/* デスクトップ時のロゴ */}
          <Link to="/" className="hidden md:block" onClick={handleHomeClick}>
            <img
              className="w-44 h-22 object-fill"
              src="/favicon.png"
              alt="Logo"
            />
          </Link>
        </div>

        {/* 右側 */}
        <div className="flex items-center">
          {/* スマホ時の /about アイコン */}
          <button
            className="text-[#333333] hover:text-[#4ECDC4] md:hidden mr-10"
            onClick={handleAboutClick}
          >
            <Info className="h-6 w-6" />
          </button>
          {location.pathname === "/profile" && (
            <button
              className="text-[#333333] hover:text-[#4ECDC4] md:hidden mr-4"
              onClick={handleLogout}
            >
              <LogOut className="h-6 w-6" />
            </button>
          )}
          {/* デスクトップ時のヘッダー */}
          {user && (
            <div className="hidden md:flex items-center space-x-10 mb-5">
              <button
                className="text-[#333333] hover:text-[#4ECDC4]"
                onClick={handleProfileClick}
              >
                <User className="h-6 w-6" />
              </button>
              <button
                className="text-[#333333] hover:text-[#4ECDC4]"
                onClick={handleHistoryClick}
              >
                <History className="h-6 w-6" />
              </button>
              <button
                className="text-[#333333] hover:text-[#4ECDC4]"
                onClick={handleRankingClick}
              >
                <Trophy className="h-6 w-6" />
              </button>
              <button
                className="text-[#333333] hover:text-[#4ECDC4]"
                onClick={handleAboutClick}
              >
                <Info className="h-6 w-6" />
              </button>
              <button
                className="text-[#333333] hover:text-[#4ECDC4]"
                onClick={handleLogout}
              >
                <LogOut className="h-6 w-6" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* スマホ時のボトムナビゲーション */}
      {user && (
        <div
          className="md:hidden fixed bottom-0 left-0 right-0 bg-white
        flex justify-around items-center p-4 z-10"
        >
          <button
            className="text-[#333333] hover:text-[#4ECDC4]"
            onClick={handleHomeClick}
          >
            <Home className="h-6 w-6" />
          </button>
          <button
            className="text-[#333333] hover:text-[#4ECDC4]"
            onClick={handleHistoryClick}
          >
            <History className="h-6 w-6" />
          </button>
          <button
            className="text-[#333333] hover:text-[#4ECDC4]"
            onClick={handleRankingClick}
          >
            <Trophy className="h-6 w-6" />
          </button>
          <button
            className="text-[#333333] hover:text-[#4ECDC4]"
            onClick={handleProfileClick}
          >
            <User className="h-6 w-6" />
          </button>
        </div>
      )}
    </div>
  );
};
