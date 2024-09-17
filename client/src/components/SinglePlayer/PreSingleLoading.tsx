import { useState, useEffect } from 'react'
import { Loader2 } from "lucide-react"
import { LinearProgress } from '@mui/material'

export const PreSingleLoading: React.FC = () => {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress >= 100) {
                    clearInterval(timer)
                    // 状態更新をレンダリング後に行うために別の非同期処理に移す
                    return 100
                }
                const diff = Math.random() * 10
                return Math.min(oldProgress + diff, 100)
            })
        }, 100)

        return () => {
            clearInterval(timer)
        }
    }, [])

    const loadingPhrases = [
        "あなたの知識の冒険を準備中…",
        "最も興味深い質問を集めています…",
        "難易度レベルを調整中…",
        "知恵の水晶玉を磨いています…",
        "クイズエンジンをウォームアップ中…",
    ]

    const [currentPhrase, setCurrentPhrase] = useState(loadingPhrases[0])

    useEffect(() => {
        const phraseInterval = setInterval(() => {
            setCurrentPhrase(loadingPhrases[Math.floor(Math.random() * loadingPhrases.length)])
        }, 3000)

        return () => clearInterval(phraseInterval)
    }, [])

    return (
        <div className="relative z-10 w-full max-w-md px-4 md:mt-32 mt-32">
            <div className="text-center mb-8">
                <p className="md:text-2xl text-xl text-[#4ECDC4] font-bold animate-pulse">もうすぐクイズが始まります!</p>
            </div>

            <div className="bg-white rounded-xl shadow-xl p-6 mb-8">
                <div className="flex items-center justify-center mb-4">
                    <Loader2 className="h-8 w-8 text-[#FF6B6B] animate-spin" />
                </div>
                <p className="text-center md:text-lg text-base mb-4">{currentPhrase}</p>
                <LinearProgress value={progress} className="w-full h-2" color='warning' />
            </div>
        </div>
    )
}
