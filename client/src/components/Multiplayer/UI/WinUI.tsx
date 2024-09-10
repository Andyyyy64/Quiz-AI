import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trophy, Star, ArrowRight } from "lucide-react"
import confetti from 'canvas-confetti'
import { MultiResultUIProps } from '../../../types/quizType'

export const WinUI: React.FC<MultiResultUIProps> = ({ handleGoHistory }) => {
    const navi = useNavigate()

    useEffect(() => {
        const duration = 100 * 1000
        const animationEnd = Date.now() + duration
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }
        function randomInRange(min: number, max: number) {
            return Math.random() * (max - min) + min
        }

        const interval: ReturnType<typeof setInterval> = setInterval(function () {
            const timeLeft = animationEnd - Date.now()

            if (timeLeft <= 0) {
                return clearInterval(interval)
            }

            const particleCount = 50 * (timeLeft / duration)
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }))
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }))
        }, 250)

        return () => clearInterval(interval)
    }, [])

    const handleTopClick = () => {
        navi('/')
    }
    return (
        <div className="bg-inherit text-[#333333] relative overflow-hidden flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto mb-5">
                <Trophy className="h-24 w-24 text-[#FFD93D] mx-auto mb-6 animate-bounce" />
                <h2 className="text-3xl font-bold mb-4 text-[#4ECDC4]">おめでとうございます!</h2>
                <p className="text-xl mb-6 font-semibold">マッチに勝利しました!</p>
                <button
                    className="mb-6 bg-[#4ECDC4] hover:bg-[#45b7a7] text-white 
                        p-2 pl-5 pr-5 rounded-lg"
                    onClick={handleGoHistory} // 1は仮のid
                >
                    履歴を見る
                </button>

                <div className="flex justify-center space-x-2 mb-6">
                    {[1, 2, 3].map((_, index) => (
                        <Star key={index} className="h-8 w-8 text-[#FFD93D] fill-current" />
                    ))}
                </div>

                <button className="w-full bg-[#FF6B6B] hover:bg-[#ff8c8c] 
                text-white p-2 rounded-lg relative font-semibold"
                    onClick={handleTopClick}
                >
                    topに戻る
                    <ArrowRight className="ml-2 h-5 w-5 absolute right-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                </button>
            </div>
        </div>
    )
}
