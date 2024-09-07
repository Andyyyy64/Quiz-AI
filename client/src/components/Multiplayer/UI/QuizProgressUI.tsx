import { QuizProgressUIProps } from "../../../types/quizType";

export const QuizProgressUI: React.FC<QuizProgressUIProps> = ({ currentQuizIndex }) => {
    return (
        <div className="text-center">
            <p className="text-xl font-bold mb-5">問題 {currentQuizIndex}/10</p>
            <div className="w-64 h-3 bg-[#F0F0F0] rounded-full mx-auto">
                <div className="h-full bg-[#FF6B6B] rounded-full" style={{ width: `${(currentQuizIndex / 10) * 100}%` }}></div>
            </div>
        </div>
    )
}