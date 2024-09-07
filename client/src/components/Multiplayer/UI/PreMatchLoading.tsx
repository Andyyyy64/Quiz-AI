import { Users } from "lucide-react";
import { PreMatchLoadingProps } from "../../../types/quizType";

import { useDots } from "../../../hooks/useDots";

export const PreMatchLoading: React.FC<PreMatchLoadingProps> = ({ status }) => {
  const dots = useDots();
  return (
    <div
      className="p-5 bg-white text-[#333333] overflow-hidden 
        flex items-center justify-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
    >
      <div className="z-10 text-center">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-md mx-auto">
          <Users className="h-20 w-20 text-[#4ECDC4] mx-auto mb-6 animate-pulse" />
          <h2 className="text-2xl font-bold mb-4">
            {status}
            {dots}
          </h2>
          <p className="text-[#666666] mb-6">
            壮大な頭脳バトルの準備を整えています。
            あなたの知識を披露する準備はできていますか？
          </p>
          <div className="w-full h-2 bg-[#F0F0F0] rounded-full overflow-hidden">
            <div className="h-full bg-[#4ECDC4] animate-[loading_2s_ease-in-out_infinite]"></div>
          </div>
        </div>
      </div>
      {/* @ts-ignore */}
      <style jsx global>{`
        @keyframes moveBackground {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(20px, 20px);
          }
        }
        @keyframes loading {
          0% {
            width: 0%;
          }
          50% {
            width: 100%;
          }
          100% {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};
