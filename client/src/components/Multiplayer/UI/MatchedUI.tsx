import { User, Zap } from "lucide-react";
import { MatchedUIProps } from "../../../types/quizType";

export const MatchedUI: React.FC<MatchedUIProps> = ({
  opponent,
  user,
  countdown,
}) => {
  return (
    <div className="w-full z-10 text-center">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-[#FF6B6B]">
          マッチしました！
        </h2>
        <div className="flex justify-around mb-8">
          <div className="text-center">
            <User className="h-32 w-32 text-[#4ECDC4] mx-auto mb-2" />
            <p className="font-bold">あなた</p>
          </div>
          <div className="text-4xl font-bold text-[#FFD93D] flex items-center">
            <Zap className="h-8 w-8 mr-2" />
            VS
            <Zap className="h-8 w-8 ml-2" />
          </div>
          <div className="text-center">
            <img
              className="w-32 h-32 rounded-full object-cover border-2 border-[#4ECDC4]"
              src={opponent?.prof_image_url}
              alt={user?.name}
            />
            <p className="font-bold">{opponent?.name}</p>
            <p className="text-[#666666]">ランク: {opponent?.rank}</p>
          </div>
        </div>
        <p className="text-xl mb-6">壮大な知識のバトルに備えよ！</p>
        <div className="bg-[#F0F0F0] rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl font-bold">{countdown - 7}</span>
        </div>
      </div>
    </div>
  );
};
