import { QuizProgressUIProps } from "../../types/quizType";

export const QuizProgressUI: React.FC<QuizProgressUIProps> = ({ currentQuizIndex, questionCount }) => {
    const quizNum = questionCount ? questionCount : 10;
    return (
        <div className="text-center">
            <p className="text-xl font-bold mb-5 mt-5">問題 {currentQuizIndex}/{quizNum}</p>
            <div className="w-64 h-3 bg-[#F0F0F0] rounded-full mx-auto">
                <div className="h-full bg-[#FF6B6B] rounded-full" style={{ width: `${(currentQuizIndex / quizNum) * 100}%` }}></div>
            </div>
        </div>
    )
}