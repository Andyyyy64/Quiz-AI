import { Zap } from "lucide-react";
import { MatchedUIProps } from "../../../types/quizType";
import { useEffect, useState } from "react";

export const MatchedUI: React.FC<MatchedUIProps> = ({
  opponent,
  user,
  countdown,
}) => {
  const [showVs, setShowVs] = useState(false);

  useEffect(() => {
    const vsTimer = setTimeout(() => {
      setShowVs(true);
    }, 500)

    return () => clearTimeout(vsTimer)
  }, [])

  return (
    <div className="w-full z-10 text-center">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-[#4ECDC4]">
          マッチしました！
        </h2>
        <div className="flex justify-around mt-12">
          <div className="text-center">
            <img
              className="w-32 h-32 rounded-full object-cover border-2 border-[#4ECDC4]"
              src={user?.prof_image_url}
              alt={user?.name}
            />
            <p className="font-bold">あなた</p>
          </div>
          <div className={`text-6xl font-bold text-[#FFD93D] flex item-center transition-all duration-500 mt-12 
            ${showVs ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
          >
            <Zap className="h-12 w-12 mr-2 animate-pulse" />
            <span className="animate-bounce">VS</span>
            <Zap className="h-12 w-12 ml-2 animate-pulse" />
          </div>
          <div className="text-center">
            <img
              className="w-32 h-32 rounded-full object-cover border-2 border-[#FF6B6B]"
              src={opponent?.prof_image_url}
              alt={opponent?.name}
            />
            <p className="font-bold">{opponent?.name}</p>
            <p className="text-[#666666]">ランク: {opponent?.rank}</p>
          </div>
        </div>
        <p className="text-xl mb-6">壮大な知識のバトルに備えよ！</p>
        <div className="rounded-full w-24 h-24 flex items-center justify-center mx-auto">
          <span className="text-4xl font-bold">{countdown - 27}</span>
        </div>
      </div>
    </div>
  );
};
