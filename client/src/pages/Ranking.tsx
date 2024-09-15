import { useContext, useEffect, useState } from "react"
import { Header } from "../components/Common/Header"
import { AuthContext } from "../context/AuthContext"
import { Medal, Star, Trophy } from "lucide-react"
import { getRanking } from "../api/user"
import { Footer } from "../components/Common/Footer"
import { useLoading } from "../hooks/useLoading"
import { unstable_createMuiStrictModeTheme } from "@mui/material"

export const Ranking: React.FC = () => {
    const [rankings, setRankings] = useState<Array<any>>([])
    const [yourRank, setYourRank] = useState<number>(0)
    const { loading, startLoading, stopLoading } = useLoading()

    const authContext = useContext(AuthContext)
    if (authContext === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    const { user } = authContext;

    useEffect(() => {
        const fetchRankings = async () => {
            startLoading()
            // ソートされている順位を取得する
            try {
                const res = await getRanking()
                res.updatedUser.forEach((userWithRanking: any, index: number) => {
                    if (userWithRanking.user_id === user?.user_id) {
                        setYourRank(index + 1)
                    }
                }, 0)
                setRankings(res.updatedUser)
            } catch (err) {
                console.log(err);
            } finally {
                stopLoading()
            }
        }        
        fetchRankings()
    }, [user])

    return (
        <div className="min-h-screen flex flex-col relative bg-inherit">
            <Header />
            <main className="container mx-auto px-4 pb-12">
                <h1 className="text-5xl font-bold mb-12 md:mt-0 mt-10 text-center text-black">
                    ランキング
                </h1>
                {
                    loading ? (
                        <div className="animate-pulse">
                            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-4xl mx-auto">
                                <div className="space-y-4">
                                    {[...Array(10)].map((_, index) => (
                                        <div key={index} className="flex justify-between items-center border-b border-gray-200 pb-4">
                                            <div className="flex items-center space-x-4">
                                                <div className="bg-gray-300 h-6 w-6 rounded-full"></div>
                                                <div className="bg-gray-300 h-4 w-32 rounded"></div>
                                            </div>
                                            <div className="flex space-x-4">
                                                <div className="bg-gray-300 h-4 w-16 rounded"></div>
                                                <div className="bg-gray-300 h-4 w-16 rounded hidden md:block"></div>
                                                <div className="bg-gray-300 h-4 w-16 rounded hidden md:block"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-4xl mx-auto">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-black/20">
                                                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">順位</th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">名前</th>
                                                <th className="px-4 py-3 text-right text-sm font-semibold uppercase tracking-wider">ポイント</th>
                                                <th className="px-4 py-3 text-right text-sm font-semibold uppercase tracking-wider md:table-cell hidden">マッチ数</th>
                                                <th className="px-4 py-3 text-right text-sm font-semibold uppercase tracking-wider md:table-cell hidden">勝率</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rankings.map((userWithRanking: any, index: number) => (
                                                <tr key={index} className="border-b border-white/10 hover:bg-white/10 transition-colors duration-200">
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center">
                                                            {index + 1 === 1 && <Trophy className="h-6 w-6 text-[#FFD700] mr-2 animate-bounce" />}
                                                            {index + 1 === 2 && <Medal className="h-6 w-6 text-[#C0C0C0] mr-2" />}
                                                            {index + 1 === 3 && <Medal className="h-6 w-6 text-[#CD7F32] mr-2" />}
                                                            <span className={`${index + 1 <= 3 ? "font-bold text-lg" : ""} 
                                                        ${index + 1 === 1 ? "text-[#FFD700]" : index + 1 === 2 ? "text-[#C0C0C0]" : index + 1 === 3 ? "text-[#CD7F32]" : ""}
                                                        `}>{index + 1}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 font-bold">{userWithRanking?.name}</td>
                                                    <td className="px-4 py-4 text-right font-bold">{userWithRanking?.points.toLocaleString()}</td>
                                                    <td className="px-4 py-4 text-right font-bold md:table-cell hidden">{userWithRanking?.totalMatchPlay}</td>
                                                    <td className="px-4 py-4 text-right font-bold md:table-cell hidden">
                                                        {userWithRanking.totalWin != 0 ? ((userWithRanking?.totalWin / userWithRanking?.totalMatchPlay) * 100).toFixed(1) : '0'}%
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            {
                                // ユーザーがランキングにいる場合は表示しない
                                rankings.some(ranking => ranking.user_id === user?.user_id) ? (
                                    <></>
                                ) : (
                                    <div className="mt-12 mb-2 text-center">
                                        <h2 className="text-3xl font-bold mb-6 text-black">あなたの順位</h2>
                                        <div className="bg-white/20 backdrop-blur-md rounded-3xl shadow-2xl p-7 inline-block">
                                            <div className="flex items-center justify-center space-x-6">
                                                <Star className="h-12 w-12 text-[#FFD700]" />
                                                <div>
                                                    <p className="text-3xl font-bold">{yourRank}位</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </>
                    )
                }
            </main>
            <Footer />
        </div>
    )
}