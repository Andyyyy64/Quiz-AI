import { useNavigate } from 'react-router-dom'
import { Frown, ArrowRight, RefreshCw } from "lucide-react"

export const LoseUI = () => {
  const navi = useNavigate()

  const handleHistoryClick = (id: number) => {
    navi(`/history/${id}`)
  }

  const handleTopClick = () => {
    navi('/')
  }

  const handleSinglePlayClick = () => {
    navi('/singleplay')
  }

  return (
    <div className="bg-inherit text-[#333333] relative overflow-hidden flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto mb-5">
        <Frown className="h-24 w-24 text-[#FF6B6B] mx-auto mb-6" />
        <h2 className="text-3xl font-bold mb-4 text-[#FF6B6B]">残念！</h2>
        <p className="text-xl mb-10 font-semibold">マッチに負けてしまいました。よく頑張りました！</p>
        <button
          className="mb-10 bg-[#4ECDC4] hover:bg-[#45b7a7] text-white 
                        p-2 pl-5 pr-5 rounded-lg"
          onClick={() => handleHistoryClick(1)} // 1は仮のid
        >
          履歴を見る
        </button>


        <div className="grid grid-cols-2 gap-4">
          <button className="w-full bg-[#FF6B6B] hover:bg-[#ff8c8c] 
                text-white p-2 rounded-lg relative font-semibold"
            onClick={handleTopClick}
          >
            topに戻る
            <ArrowRight className="ml-2 h-5 w-5 absolute right-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </button>
          <button className="w-full bg-[#4ECDC4] hover:bg-[#45b7a7] 
                text-white p-2 rounded-lg relative font-semibold pr-6"
            onClick={handleSinglePlayClick}
          >
            シングルで練習
            <RefreshCw className="ml-2 h-5 w-5 absolute right-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </button>
        </div>
      </div>
    </div>
  )
}