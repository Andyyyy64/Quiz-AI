import React from "react";
import { Users, Zap, Trophy } from "lucide-react";

export const Rule: React.FC = () => {
  return (
    <main className="container md:mx-auto md:px-4 md:py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-8">
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

        <div className="bg-[#F0F0F0] rounded-lg p-6 mb-5 hidden md:block">
          <h2 className="md:text-2xl text-xl font-bold mb-4 flex items-center">
            <Trophy className="h-6 w-6 mr-2 text-[#FF6B6B]" />
            報酬
          </h2>
          <p className="text-[#333333] mb-2 font-medium text-sm md:text-base">
            ポイントを獲得し、ランキングを上り詰めましょう。毎週トップのプレイヤーには特別なバッジとボーナスポイントが贈られます！
          </p>
          <p className="text-[#333333] font-medium text-sm md:text-base">
            友達に挑戦して、誰が究極のクイズマスターかを確かめよう！
          </p>
        </div>
        <p className="md:text-sm text-[10px] text-gray-500 text-center">
          ※当サイトではAIを活用してクイズを生成しているため、誤った解答や偏りのある問題が含まれる場合があります。あらかじめご了承ください。
        </p>
      </div>
    </main>
  );
};
