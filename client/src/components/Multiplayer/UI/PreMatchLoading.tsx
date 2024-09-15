import { Users } from "lucide-react";
import { PreMatchLoadingProps } from "../../../types/quizType";

import { useDots } from "../../../hooks/useDots";

export const PreMatchLoading: React.FC<PreMatchLoadingProps> = ({ status }) => {
  const dots = useDots();
  return (
    <div
      className="sm:w-auto w-[80%] bg-white text-[#333333]
        overflow-hidden flex items-center justify-center shadow-xl
        absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl"
    >
      <div className="z-10 text-center">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-md mx-auto">
          <Users className="md:h-20 md:w-20 w-16 h-16 text-[#4ECDC4] mx-auto mb-6 animate-pulse" />
          <h2 className="md:text-2xl text-xl font-bold mb-4">
            {status}
            {dots}
          </h2>
          <p className="text-[#666666] mb-6 md:text-md text-sm">
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
