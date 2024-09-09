import { SingleGameProps } from '../../types/playType';

import { QuizDisplay } from '../Quiz/QuizDisplay';
import { QuizProgressUI } from '../Quiz/QuizProgressUI';

export const SingleGame: React.FC<SingleGameProps> = ({
    quiz,
    questionCount,
    countdown,
    isCounting,
    currentQuizIndex,
    isAnswerCorrect,
    correctCount,
    isTimeUp,
    handleAnswerSelect,
}) => {
    return (
        <div
            className="w-full flex flex-col items-center max-w-4xl mx-auto 
      bg-white/10 backdrop-blur-md rounded-lg shadow-lg p-6"
        >
            <div className=' mb-10'>
                <QuizProgressUI currentQuizIndex={currentQuizIndex} questionCount={questionCount} />
            </div>
            <QuizDisplay
                quiz={quiz}
                questionCount={questionCount}
                countdown={countdown}
                isCounting={isCounting}
                handleAnswerSelect={handleAnswerSelect}
                isAnswerCorrect={isAnswerCorrect}
                canAnswer={true}
                isMultiplayer={false}
                correctCount={correctCount}
                isTimeUp={isTimeUp}
            />
        </div>
    )
}