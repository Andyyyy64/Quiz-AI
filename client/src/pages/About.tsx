import { Link } from "react-router-dom"
import { Zap, Users, Trophy } from "lucide-react"
import { Header } from "../components/Common/Header"
import { Footer } from "../components/Common/Footer"

export const About = () => {
    return (
        <div className="min-h-screen flex flex-col relative bg-inherit overflow-hidden">
            <Header />
            <main className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xl p-8">
                    <h1 className="text-4xl font-bold mb-6 text-center text-black">AIクイズ！ について</h1>
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-[#4ECDC4]">AIクイズ！ ってなに？</h2>
                        <p className="text-gray-700 leading-relaxed">
                            AIクイズ！ は、幅広いトピックにわたってあなたの知識を試すために設計された革新的なオンラインクイズプラットフォームです。シングルプレイヤーとマルチプレイヤーの両方のモードを提供しており、AIが生成したクイズに挑戦したり、インターネットの誰かとリアルタイムで競い合うことができます。
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-[#4ECDC4]">私たちの目的</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            AIクイズ！ では、生成AIを通じて学びを楽しく、魅力的で、誰にでもアクセスできるものにすることを目指しています。私たちは次のことを目標としています
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                            <li>好奇心を刺激し、生涯学習を促進すること</li>
                            <li>フレンドリーな競争と知識共有の場を提供すること</li>
                            <li>多様な興味に応えるため、幅広いトピックを提供すること</li>
                            <li>あらゆるレベルのクイズ愛好者に対して、包括的な環境を作り出すこと</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-[#4ECDC4]">主な特徴</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex flex-col items-center text-center">
                                <Zap className="h-12 w-12 text-[#FF6B6B] mb-2" />
                                <h3 className="font-semibold mb-1">シングルプレイヤー</h3>
                                <p className="text-sm text-gray-600">AIが生成したクイズに挑戦しよう</p>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <Users className="h-12 w-12 text-[#FF6B6B] mb-2" />
                                <h3 className="font-semibold mb-1">マルチプレイヤー</h3>
                                <p className="text-sm text-gray-600">一対一の真剣クイズ勝負！</p>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <Trophy className="h-12 w-12 text-[#FF6B6B] mb-2" />
                                <h3 className="font-semibold mb-1">リーダーボード</h3>
                                <p className="text-sm text-gray-600">進捗を追跡し、ランキングを上げよう</p>
                            </div>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-[#FF6B6B]">AIクイズ！ に関する注意点</h2>
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
                            <p className="text-yellow-700">
                                <strong>ご注意ください：</strong> AIクイズ！ のクイズはAIを使用して生成されています。私たちは正確さと品質を追求していますが、間違った回答や偏りのある質問が含まれる場合があります。ユーザーの皆様には、批判的な視点を持ってコンテンツに向き合い、不正確な点やバグなどがあれば報告して頂けると幸いです。
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-[#4ECDC4]">さあ始めよう！</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            あなたのクイズの冒険に出発する準備はできましたか？今すぐ飛び込んで、自分自身に挑戦するか、インターネットの誰かと競い合いましょう。成功の鍵は勝つことだけでなく、学びと発見の喜びを楽しむことにあります。
                        </p>
                        <Link to="/" className="inline-block px-6 py-3 bg-[#FF6B6B] text-white font-semibold rounded-full hover:bg-[#FF8787] transition-colors duration-200">
                            今すぐクイズを始めよう！
                        </Link>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    )
}
