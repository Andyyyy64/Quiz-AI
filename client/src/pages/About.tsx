import { Zap, Users, Trophy, ArrowLeft, AlertCircle } from "lucide-react";
import { Header } from "../components/Common/Header";
import { Footer } from "../components/Common/Footer";
import { useNavigate } from "react-router-dom";
import { useSound } from "../hooks/useSound";

export const About = () => {
  const navi = useNavigate();
  const intaractSound = useSound("intaract");

  const handleBack = () => {
    intaractSound.play();
    navi("/");
  };

  // report
  const handleReport = () => {
    intaractSound.play();
    window.open("https://forms.gle/s1qgtkDhyk6PYMHw8", "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-inherit overflow-hidden pb-20">
      <Header />
      <main className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xl p-8">
          <div className="flex items-center justify-center md:mb-10 mb-6">
            <button
              onClick={handleBack}
              className="mr-1 p-2 rounded-full hover:bg-gray-200 transition-colors duration-200"
              aria-label="戻る"
            >
              <ArrowLeft className="h-7 w-7 text-black hidden md:block" />
            </button>
            <h1 className="hidden md:block md:text-2xl text-xl font-bold text-center text-black">
                クイズ！AIが作った問題 について
            </h1>
          </div>

          <section className="mb-8">
            <h2 className="md:text-2xl text-xl font-semibold mb-4 text-[#4ECDC4]">
              クイズ！AIが作った問題って何？
            </h2>
            <p className="text-gray-700 leading-relaxed md:text-base text-xs">
              <span className="block mb-3">
                AIがリアルタイムで作成したクイズに、その場でチャレンジできる新感覚のクイズアプリです！
              </span>
              <span className="block mb-3">
                クイズのカテゴリや難易度は自由に設定可能です。
              </span>
              <span className="block mb-3">
                プレイするたびに新しい発見と挑戦が待っています。
              </span>
              <span className="block">
                あなただけのクイズを体験してみませんか？
              </span>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="md:text-2xl text-xl font-semibold mb-4 text-[#4ECDC4]">
              私たちの目的
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4 md:text-base text-xs">
              <span className="block mb-3">
                AIが進化する中で、どれだけの人がその可能性を知っているでしょうか？
              </span>
              <span className="block mb-3">
                実際、まだAIを使ったことがない方も多くいます。
              </span>
              <span className="block mb-3">
                私たちの目的は、一人でも多くの人にクイズを楽しみながら、AIの可能性を知ってもらうことです。
              </span>
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 md:text-base text-xs">
              <li>クイズを通じてAIをより身近に感じてもらう</li>
              <li>AIの価値と使い方を知ってもらう</li>
              <li>クイズを一人で、皆で楽しんでもらう</li>
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
                <span className="block  mb-2">
                  このアプリではAIを使用してクイズを生成しています。
                </span>
                <span className="block mb-2">
                  私たちは正確さと品質を追求していますが、間違った回答や偏りのある質問が含まれる場合があります。
                </span>
                <span className="block">
                ユーザーの皆様には、批判的な視点を持ってコンテンツに向き合い、不正確な点やバグなどがあれば報告して頂けると幸いです。
                </span>
                </p>
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleReport}
                  className="flex items-center bg-[#FF6B6B] text-white font-semibold px-4 py-2 rounded hover:bg-[#e55a5a] transition-colors duration-200"
                >
                  <AlertCircle className="h-5 w-5 mr-2" />
                  報告する
                </button>
              </div>
            </div>
          </section>

          <section>
            <h2 className="md:text-2xl font-semibold mb-4 text-[#4ECDC4]">
              さあ始めよう！
            </h2>
            <p className="text-gray-700 leading-relaxed md:text-base text-xs">
              <span className="block  mb-2">
                あなただけのクイズの冒険に出発する準備はできましたか？
              </span>
              <span className="block mb-2">
                今すぐ飛び込んで、自分自身に挑戦するか、インターネットの誰かと競い合いましょう。
              </span>
              <span className="block">
                成功の鍵は勝つことだけでなく、学びと発見の喜びを楽しむことにあります。
              </span>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};
