import { Zap, Users, Trophy } from "lucide-react";
import { Header } from "../components/Common/Header";
import { Footer } from "../components/Common/Footer";

export const About = () => {
  return (
    <div className="min-h-screen flex flex-col relative bg-inherit overflow-hidden pb-20">
      <Header />
      <main className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xl p-8">
          <h1 className="md:text-3xl text-2xl font-bold md:mb-10 mb-6 text-center text-black">
            クイズ！AIが作った問題 について
          </h1>
          <section className="mb-8">
            <h2 className="md:text-2xl text-xl font-semibold mb-4 text-[#4ECDC4]">
              クイズ！AIが作った問題 ってなに？
            </h2>
            <p className="text-gray-700 leading-relaxed md:text-base text-xs">
              クイズAI
              は幅広いトピックにわたってあなたの知識を試すために設計された革新的なオンラインクイズプラットフォームです。シングルプレイヤーとマルチプレイヤーの両方のモードを提供しており、AIが生成したクイズに挑戦したり、インターネットの誰かとリアルタイムで競い合うことができます。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="md:text-2xl text-xl font-semibold mb-4 text-[#4ECDC4]">
              私たちの目的
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4 md:text-base text-xs">
              クイズAI
              では生成AIを通じて学びを楽しく、魅力的で、誰にでもアクセスできるものにすることを目指しています。私たちは次のことを目標としています
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 md:text-base text-xs">
              <li>好奇心を刺激し、生涯学習を促進すること</li>
              <li>フレンドリーな競争と知識共有の場を提供すること</li>
              <li>多様な興味に応えるため、幅広いトピックを提供すること</li>
              <li>
                あらゆるレベルのクイズ愛好者に対して、包括的な環境を作り出すこと
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="md:text-2xl text-xl font-semibold mb-4 text-[#4ECDC4]">
              主な特徴
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center">
                <Zap className="md:h-12 md:w-12 w-10 h-10 text-[#FF6B6B] mb-2" />
                <h3 className="font-semibold mb-1 md:text-base text-sm">
                  シングルプレイヤー
                </h3>
                <p className="md:text-sm text-xs text-gray-600">
                  AIが生成したクイズに挑戦しよう！
                </p>
              </div>
              <div className="flex flex-col items-center text-center ">
                <Users className="md:h-12 md:w-12 w-10 h-10 text-[#FF6B6B] mb-2" />
                <h3 className="font-semibold mb-1 md:text-base text-sm">
                  マルチプレイヤー
                </h3>
                <p className="md:text-sm text-xs text-gray-600">
                  一対一の真剣クイズ勝負！
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Trophy className="md:h-12 md:w-12 w-10 h-10 text-[#FF6B6B] mb-2" />
                <h3 className="font-semibold mb-1 md:text-base text-sm">
                  リーダーボード
                </h3>
                <p className="md:text-sm text-xs text-gray-600">
                  進捗を追跡し、ランキングを上げよう！
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="md:text-2xl text-xl font-semibold mb-4 text-[#FF6B6B]">
              注意点
            </h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
              <p className="text-yellow-700 md:text-base text-sm">
                クイズAI
                のクイズはAIを使用して生成されています。私たちは正確さと品質を追求していますが、間違った回答や偏りのある質問が含まれる場合があります。ユーザーの皆様には、批判的な視点を持ってコンテンツに向き合い、不正確な点やバグなどがあれば報告して頂けると幸いです。
              </p>
            </div>
          </section>

          <section>
            <h2 className="md:text-2xl font-semibold mb-4 text-[#4ECDC4]">
              さあ始めよう！
            </h2>
            <p className="text-gray-700 leading-relaxed md:text-base text-xs">
              あなたのクイズの冒険に出発する準備はできましたか？今すぐ飛び込んで、自分自身に挑戦するか、インターネットの誰かと競い合いましょう。成功の鍵は勝つことだけでなく、学びと発見の喜びを楽しむことにあります。
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};
