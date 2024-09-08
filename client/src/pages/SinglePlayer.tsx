import { useState, useEffect } from "react";
import { QuizType } from "../types/quizType";

import { generateQuiz } from "../api/quiz";
import { useCountDown } from "../hooks/useCountDown";
import { useNotification } from "../hooks/useNotification";

import { Header } from "../components/Common/Header";
import { Footer } from "../components/Common/Footer";
import { Notification } from "../components/Common/Notification";

import { PreSingleSettings } from "../components/SinglePlayer/PreSingleSettings";
import { PreSingleLoading } from "../components/SinglePlayer/PreSingleLoading";
import { SingleGame } from "../components/SinglePlayer/SingleGame";
import { AfterSingleResult } from "../components/SinglePlayer/AfterSingleResult";

export const SinglePlayer: React.FC = () => {
    const [quiz, setQuiz] = useState<QuizType>();
    const [nextQuiz, setNextQuiz] = useState<QuizType>();
    const [category, setCategory] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [timeLimit, setTimeLimit] = useState(30);
    const [questionCount, setQuestionCount] = useState(10);
    const [correctCount, setCorrectCount] = useState(0);
    const [currentQuizIndex, setCurrentQuizIndex] = useState(1);

    const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null); // 回答正誤フラグ
    const [is_settings, setIsSettings] = useState<boolean>(true); // 設定画面フラグ
    const [is_loading, setIsLoading] = useState<boolean>(false); // ローディングフラグ
    const [isEnded, setIsEnded] = useState<boolean>(false); // ゲーム終了フラグ
    const [gameStart, setGameStart] = useState<boolean>(false); // ゲームスタートフラグ
    const [isTimeUp, setIsTimeUp] = useState<boolean>(false); // 時間切れフラグ


    const { countdown, isCounting, startCountDown, resetCountDown } = useCountDown(timeLimit);
    const { notification, showNotification } = useNotification();

    const handleStartQuiz = () => {
        setIsSettings(false);
        setIsLoading(true);
    }

    // クイズの取得が終わったらローディングを終了
    useEffect(() => {
        const fetchQuiz = async () => {
            if (is_loading && !is_settings) {
                const res: any = await generateQuiz(category, difficulty);
                setQuiz(res);
                setIsLoading(false);
            }
        }
        fetchQuiz();
    }, [is_loading])

    // ローディングが終わったらゲームスタート
    useEffect(() => {
        if (!is_loading && !is_settings && quiz) {
            setGameStart(true);
            startCountDown();
        }
    }, [quiz])

    // 回答か時間切れの場合、次の問題を取得
    useEffect(() => {
        const fetchNextQuiz = async () => {
            const res: any = await generateQuiz(category, difficulty);
            console.log(res);
            setNextQuiz(res);
        }
        if ((isAnswerCorrect != null) || isTimeUp) {
            fetchNextQuiz();
        }
    }, [isAnswerCorrect, isTimeUp])

    // 次の問題が取得できたら5秒後に次の問題へ
    useEffect(() => {
        if (nextQuiz != undefined) {
            setTimeout(() => {
                handleNextQuestion();
            }, 5000);
        }
    }, [nextQuiz])

    // 時間切れの場合
    useEffect(() => {
        if (isCounting && countdown === 0) {
            setIsTimeUp(true);
            resetCountDown();
        }
    }, [countdown])

    // 回答送信時の処理
    const handleAnswerSelect = (selectAnswer: string) => {
        if (selectAnswer === quiz?.correct_answer) {
            console.log("correct");
            // 正解時の処理
            resetCountDown();
            setIsAnswerCorrect(true);
            setCorrectCount((prev) => prev + 1);
        } else {
            // 不正解時の処理
            console.log("wrong");
            resetCountDown();
            setIsAnswerCorrect(false);
        }
    };

    // 次の問題へ
    const handleNextQuestion = () => {
        // 最後の問題の場合
        if (currentQuizIndex >= questionCount) {
            showNotification("クイズが終了しました。", "info");
            setGameStart(false);
            setIsEnded(true);
        } else {
            // 問題数とstateを更新
            setIsAnswerCorrect(null);
            setCurrentQuizIndex((prev) => prev + 1);
            setIsTimeUp(false);
            // 次の問題をfetch
            setQuiz(nextQuiz);
            startCountDown();
        }
    }

    const handleRestart = () => {
        // ゲームをリスタート
        setIsSettings(true);
        setIsEnded(false);
        setGameStart(false);
        setQuiz(undefined);
        setNextQuiz(undefined);
        setCorrectCount(0);
        setCurrentQuizIndex(1);
        resetCountDown();
    }

    const handleRestartWithSettings = () => {
        // 設定そのままでリスタート
        setQuiz(undefined);
        setNextQuiz(undefined);
        setIsLoading(true);
        setIsEnded(false);
        setGameStart(false);
        setCorrectCount(0);
        setCurrentQuizIndex(1);
        resetCountDown();
    }

    return (
        <div className="min-h-screen flex flex-col bg-inherit">
            {/* 通知 */}
            {notification && (
                <Notification message={notification.message} type={notification.type} />
            )}
            <Header />
            <main className="flex-grow flex flex-col justify-center items-center">

                {
                    // 設定画面
                    is_settings && (
                        <PreSingleSettings
                            category={category}
                            setCategory={setCategory}
                            difficulty={difficulty}
                            setDifficulty={setDifficulty}
                            timeLimit={timeLimit}
                            setTimeLimit={setTimeLimit}
                            questionCount={questionCount}
                            setQuestionCount={setQuestionCount}
                            handleStartQuiz={handleStartQuiz}
                        />
                    )

                }
                {
                    // ローディング画面
                    is_loading && (
                        <PreSingleLoading />
                    )

                }
                {
                    // シングルプレイゲーム画面
                    gameStart && quiz && (
                        <SingleGame
                            quiz={quiz}
                            questionCount={questionCount}
                            countdown={countdown}
                            isCounting={isCounting}
                            handleAnswerSelect={handleAnswerSelect}
                            currentQuizIndex={currentQuizIndex}
                            isAnswerCorrect={isAnswerCorrect}
                            correctCount={correctCount}
                            isTimeUp={isTimeUp}
                        />
                    )
                }
                {
                    // リゾルト画面
                    !gameStart && isEnded && (
                        <AfterSingleResult 
                            correctCount={correctCount}
                            questionCount={questionCount}
                            duration={timeLimit} // 仮
                            category={category}
                            difficulty={difficulty}
                            handleRestart={handleRestart}
                            handleRestartWithSettings={handleRestartWithSettings}
                        />
                    )
                }
            </main>
            <Footer />
        </div>
    )
}