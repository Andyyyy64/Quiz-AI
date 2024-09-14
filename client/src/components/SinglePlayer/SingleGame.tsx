import React from 'react';
import { useEffect, useState } from 'react';
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
    const [showAnimation, setShowAnimation] = useState(false);

    useEffect(() => {
        if (isAnswerCorrect !== null) {
            setShowAnimation(true);
            const timer = setTimeout(() => setShowAnimation(false), 1000);
            return () => clearTimeout(timer);
        }
    }, [isAnswerCorrect]);

    return (
        <div
            className={`w-full flex flex-col items-center max-w-4xl mx-auto 
            bg-white/10 backdrop-blur-3xl rounded-lg shadow-lg p-6 transition-all duration-500
            ${showAnimation ? 'scale-110' : 'scale-100'}
            `}
        >
            <div className='mb-10'>
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