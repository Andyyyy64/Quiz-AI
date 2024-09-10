import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { QuizType } from "../types/quizType";

import { generateQuiz } from "../api/quiz";
import { saveAnsweredQuiz } from "../api/user";
import { saveSingleHistory, saveSingleQuizHistory } from "../api/history";

import { AuthContext } from "../context/AuthContext";

import { useCountDown } from "../hooks/useCountDown";
import { useNotification } from "../hooks/useNotification";
import { useCalcDuration } from "../hooks/useCalcDuration";

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
    const [answeredQuizIds, setAnsweredQuizIds] = useState<number[]>([]); // 解答したクイズIDを配列で保存
    const [singleId, setSingleId] = useState<number | null>(null); // シングルプレイID

    const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null); // 回答正誤フラグ
    const [is_settings, setIsSettings] = useState<boolean>(true); // 設定画面フラグ
    const [is_loading, setIsLoading] = useState<boolean>(false); // ローディングフラグ
    const [isEnded, setIsEnded] = useState<boolean>(false); // ゲーム終了フラグ
    const [gameStart, setGameStart] = useState<boolean>(false); // ゲームスタートフラグ
    const [isTimeUp, setIsTimeUp] = useState<boolean>(false); // 時間切れフラグ


    const { countdown, isCounting, startCountDown, resetCountDown } = useCountDown(timeLimit);
    const { notification, showNotification } = useNotification();
    const { duration, startCalc, stopCalc } = useCalcDuration();
    const navi = useNavigate();

    const authContext = useContext(AuthContext);
    if (authContext === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    const { user } = authContext;

    const handleStartQuiz = () => {
        setIsSettings(false);
        setIsLoading(true);
    }

    // クイズの取得が終わったらローディングを終了
    useEffect(() => {
        const fetchQuiz = async () => {
            if (is_loading && !is_settings) {
                const res: any = await generateQuiz(category, difficulty, user?.user_id);
                setQuiz(res);
                setIsLoading(false);
            }
        }
        fetchQuiz();
    }, [is_loading])

    // ローディングが終わったらゲームスタート
    useEffect(() => {
        if (!is_loading && !is_settings && quiz) {
            startCalc(); // ゲームの開始時刻を記録
            setGameStart(true);
            startCountDown();
        }
    }, [quiz])

    // 回答した または 時間切れの場合、次の問題を取得
    useEffect(() => {
        const fetchNextQuiz = async () => {
            // 次の問題を取得(ただし最後は除く)
            if (currentQuizIndex !== questionCount) {
                console.log("fetching next quiz");
                const res: any = await generateQuiz(category, difficulty, user?.user_id);
                setNextQuiz(res);
            }
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
    }, [nextQuiz, questionCount === currentQuizIndex])

    // 時間切れの場合
    useEffect(() => {
        const handleTimeUp = async () => {
            resetCountDown();
            const res = await saveAnsweredQuiz(user?.user_id, quiz, "", false);
            const quiz_id = res.quizID;
            setAnsweredQuizIds(prev => [...prev, quiz_id]);
            setIsTimeUp(true);
        }
        if (isCounting && countdown === 0) {
            handleTimeUp();
        }
    }, [countdown])

    // ゲーム終了時に履歴を保存
    useEffect(() => {
        const saveHistory = async () => {
            if (isEnded) {
                console.log(answeredQuizIds);
                const res = await saveSingleHistory(user?.user_id, category, difficulty, questionCount, correctCount, duration);
                const singleplay_id = res.id;
                setSingleId(singleplay_id);
                await saveSingleQuizHistory(singleplay_id, answeredQuizIds);
                setAnsweredQuizIds([]);
            }
        }
        saveHistory();
    }, [isEnded])

    // 回答送信時の処理
    const handleAnswerSelect = async (selectAnswer: string) => {
        if (selectAnswer === quiz?.correct_answer) {
            // 正解時の処理
            resetCountDown();
            // クイズと回答/正答をユーザーの履歴に保存
            const res = await saveAnsweredQuiz(user?.user_id, quiz, selectAnswer, true);
            const quiz_id = res.quizID;
            setAnsweredQuizIds(prev => [...prev, quiz_id]);
            setIsAnswerCorrect(true);
            setCorrectCount((prev) => prev + 1);
        } else {
            // 不正解時の処理
            resetCountDown();
            // クイズと回答/正答をユーザーの履歴に保存
            const res = await saveAnsweredQuiz(user?.user_id, quiz, selectAnswer, false);
            const quiz_id = res.quizID;
            setAnsweredQuizIds(prev => [...prev, quiz_id]);
            setIsAnswerCorrect(false);
        }
    };

    // 次の問題へ
    const handleNextQuestion = async () => {
        // 最後の問題の場合
        if (currentQuizIndex >= questionCount) {
            showNotification("クイズが終了しました。", "info")
            setGameStart(false);
            stopCalc(); // ゲームの終了時刻
            setIsAnswerCorrect(null);
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
        setQuiz(undefined);
        setNextQuiz(undefined);
        setCorrectCount(0);
        setCurrentQuizIndex(1);
        resetCountDown();
        setIsSettings(true);
        setIsEnded(false);
        setGameStart(false);
    }

    const handleRestartWithSettings = () => {
        // 設定そのままでリスタート
        resetCountDown();
        setQuiz(undefined);
        setNextQuiz(undefined);
        setCorrectCount(0);
        setCurrentQuizIndex(1);
        setIsLoading(true);
        setIsEnded(false);
        setGameStart(false);
    }

    const handleGoHistory = () => {
        navi(`/history/singleplay/${singleId}`);
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
                            duration={duration}
                            category={category}
                            difficulty={difficulty}
                            handleRestart={handleRestart}
                            handleRestartWithSettings={handleRestartWithSettings}
                            handleGoHistory={handleGoHistory}
                        />
                    )
                }
            </main>
            <Footer />
        </div>
    )
}