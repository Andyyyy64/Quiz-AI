import { Zap, Sparkles } from "lucide-react";
import { MatchedUIProps } from "../../../types/quizType";
import { useEffect, useState } from "react";

export const MatchedUI: React.FC<MatchedUIProps> = ({
  opponent,
  user,
  countdown,
}) => {
  const [showVs, setShowVs] = useState(false);
  const [showPlayers, setShowPlayers] = useState(false);

  useEffect(() => {
    const playersTimer = setTimeout(() => {
      setShowPlayers(true);
    }, 300);

    const vsTimer = setTimeout(() => {
      setShowVs(true);
    }, 1000);

    return () => {
      clearTimeout(vsTimer);
      clearTimeout(playersTimer);
    };
  }, []);

  return (
    <div className="w-full z-10 text-center">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-2xl mx-auto relative overflow-hidden">
        <div className="absolute inset-0"></div>
        <h2 className="text-3xl font-bold mb-6 text-[#black] relative">
          マッチしました！
        </h2>
        <div className="flex justify-around mt-12 relative">
          <div className={`text-center transition-all duration-500 ${showPlayers ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'}`}>
            <img
              className="w-32 h-32 rounded-full object-cover border-4 border-[#4ECDC4] shadow-lg transform transition-transform duration-300 hover:scale-110"
              src={user?.prof_image_url}
              alt={user?.name}
            />
            <p className="font-bold mt-2">あなた</p>
          </div>
          <div className={`text-6xl font-bold text-[#FFD93D] flex items-center transition-all duration-500
            ${showVs ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
          >
            <Zap className="h-12 w-12 mr-2 animate-pulse text-[#FF6B6B]" />
            <span className="animate-bounce">VS</span>
            <Zap className="h-12 w-12 ml-2 animate-pulse text-[#4ECDC4]" />
          </div>
          <div className={`text-center transition-all duration-500 ${showPlayers ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}`}>
            <img
              className="w-32 h-32 rounded-full object-cover border-4 border-[#FF6B6B] shadow-lg transform transition-transform duration-300 hover:scale-110"
              src={opponent?.prof_image_url}
              alt={opponent?.name}
            />
            <p className="font-bold mt-2">{opponent?.name}</p>
          </div>
        </div>
        <p className="text-xl mt-8 animate-pulse mb-5">壮大な知識のバトルに備えよ！</p>
        <h1 className="text-lg font-bold">開始まで{countdown - 25}秒</h1>
      </div>
    </div>
  );
};