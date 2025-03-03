import { Zap } from "lucide-react";
import { MatchedUIProps } from "../../../types/quizType";
import { useEffect, useState } from "react";
import { useCountDown } from "../../../hooks/useCountDown";

export const MatchedUI: React.FC<MatchedUIProps> = ({ opponent, user }) => {
  const [showVs, setShowVs] = useState(false);
  const [showPlayers, setShowPlayers] = useState(false);
  const { countdown, isCounting, startCountDown, resetCountDown } =
    useCountDown(); // 制限時間

  useEffect(() => {
    startCountDown(10);
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

  useEffect(() => {
    if (isCounting && countdown === 0) {
      resetCountDown(10);
    }
  }, [countdown]);

  return (
    <div className="w-full z-10 text-center">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-2xl mx-auto relative overflow-hidden">
        <div className="absolute inset-0"></div>
        <h2 className="text-3xl font-bold mb-6 text-[#black] relative">
          マッチしました！
        </h2>
        <div className="flex justify-around mt-12 relative">
          <div
            className={`text-center transition-all duration-500 ${
              showPlayers
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-full"
            }`}
          >
            <img
              className="md:w-32 md:h-32 w-12 h-12 rounded-full object-cover border-4 border-[#4ECDC4] shadow-lg transform transition-transform duration-300 hover:scale-110"
              src={user?.prof_image_url}
              alt={user?.name}
            />
            <p className="font-bold mt-2">あなた</p>
          </div>
          <div
            className={`md:text-6xl text-3xl font-bold text-[#FFD93D] flex items-center transition-all duration-500
            ${showVs ? "opacity-100 scale-100" : "opacity-0 scale-0"}`}
          >
            <Zap className="md:h-12 md:w-12 h-6 w-6 mr-2 animate-pulse text-[#FF6B6B]" />
            <span className="animate-bounce">VS</span>
            <Zap className="md:h-12 md:w-12 h-6 w-6 ml-2 animate-pulse text-[#4ECDC4]" />
          </div>
          <div
            className={`text-center transition-all duration-500 ${
              showPlayers
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-full"
            }`}
          >
            <img
              className="md:w-32 md:h-32 w-12 h-12 rounded-full object-cover border-4 border-[#FF6B6B] shadow-lg transform transition-transform duration-300 hover:scale-110"
              src={opponent?.prof_image_url}
              alt={opponent?.name}
            />
            <p className="font-bold mt-2">{opponent?.name}</p>
          </div>
        </div>
        <p className="md:text-xl text-base mt-8 animate-pulse mb-5">
          壮大な知識のバトルに備えよ！
        </p>
        <h1 className="text-lg font-bold">開始まで{countdown}秒</h1>
      </div>
    </div>
  );
};
