import React from "react";
import { Users, Zap, Trophy } from "lucide-react";

export const Rule: React.FC = () => {
  return (
    <main className="container md:mx-auto md:px-4 md:py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl md:p-8 p-4">
        <div className="grid md:grid-cols-2 justify-center gap-8 md:mb-8 mb-4">
          <div>
            <h2 className="md:text-2xl text-lg font-bold mb-4 flex items-center">
              <Users className="h-6 w-6 mr-2 text-[#4ECDC4]" />
              遊び方
            </h2>
            <ul className="list-disc list-inside space-y-2 text-[#333333] font-medium text-xs md:text-base">
              <li>他のプレイヤーとリアルタイムで競い合う！</li>
              <li>様々なカテゴリの問題が出題！</li>
              <li>正解するとポイントを獲得！</li>
              <li>ポイントの変動に応じてランキングが変動！</li>
              <li>連勝して、ランキング1位を目指そう！</li>
            </ul>
          </div>
          <div>
            <h2 className="md:text-2xl text-lg font-bold mb-4 flex items-center">
              <Zap className="h-6 w-6 mr-2 text-[#FFD93D]" />
              マッチルール
            </h2>
            <ul className="list-disc list-inside space-y-2 text-[#333333] font-medium text-xs md:text-base">
              <li>1マッチにつき10問</li>
              <li>各質問に答える時間は30秒</li>
              <li>10問解いて得点が多いほうが勝利</li>
              <li>不正行為や外部の助けは禁止</li>
              <li>他のプレイヤーへの敬意を忘れずに</li>
            </ul>
          </div>
        </div>
        <p className="md:text-sm text-[10px] text-gray-500 text-center">
          ※当サイトではAIを活用してクイズを生成しているため、誤った解答や偏りのある問題が含まれる場合があります。あらかじめご了承ください。
        </p>
      </div>
    </main>
  );
};
