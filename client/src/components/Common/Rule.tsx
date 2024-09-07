import React from "react";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";
import { Users, Zap, Trophy } from "lucide-react";

export const Rule: React.FC = () => {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-8">
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Users className="h-6 w-6 mr-2 text-[#4ECDC4]" />
              遊び方
            </h2>
            <ul className="list-disc list-inside space-y-2 text-[#333333] font-medium">
              <li>他のプレイヤーとリアルタイムで競い合う！</li>
              <li>様々なカテゴリの問題が出題！</li>
              <li>正解するとポイントを獲得！</li>
              <li>ポイントの変動に応じてランクも変動！</li>
              <li>ランクを上げて、ランキング1位を目指そう！</li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Zap className="h-6 w-6 mr-2 text-[#FFD93D]" />
              マッチルール
            </h2>
            <ul className="list-disc list-inside space-y-2 text-[#333333] font-medium">
              <li>1マッチにつき10問</li>
              <li>各質問に答える時間は10秒</li>
              <li>早く答えるほど多くのポイントを獲得</li>
              <li>不正行為や外部の助けは禁止</li>
              <li>他のプレイヤーへの敬意を忘れずに</li>
            </ul>
          </div>
        </div>

        <div className="bg-[#F0F0F0] rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Trophy className="h-6 w-6 mr-2 text-[#FF6B6B]" />
            報酬
          </h2>
          <p className="text-[#333333] mb-2 font-medium">
            ポイントを獲得し、ランクを上り詰めましょう。毎週トップのプレイヤーには特別なバッジとボーナスポイントが贈られます！
          </p>
          <p className="text-[#333333] font-medium">
            友達に挑戦して、誰が究極のクイズマスターかを確かめましょう！
          </p>
        </div>
      </div>
    </main>
  );
};
