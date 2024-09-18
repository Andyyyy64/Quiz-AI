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
import { useSound } from "../hooks/useSound";

import { Header } from "../components/Common/Header";
import { Footer } from "../components/Common/Footer";
import { Notification } from "../components/Common/Notification";

import { PreSingleSettings } from "../components/SinglePlayer/PreSingleSettings";
import { PreSingleLoading } from "../components/SinglePlayer/PreSingleLoading";
import { SingleGame } from "../components/SinglePlayer/SingleGame";
import { AfterSingleResult } from "../components/SinglePlayer/AfterSingleResult";

export const SinglePlayer: React.FC = () => {
  // data
  const [quiz, setQuiz] = useState<QuizType>();
  const [nextQuiz, setNextQuiz] = useState<QuizType>();
  const [category, setCategory] = useState("ランダム");
  const [difficulty, setDifficulty] = useState("ランダム");
  const [timeLimit, setTimeLimit] = useState(30);
  const [questionCount, setQuestionCount] = useState(10); // 問題数
  const [correctCount, setCorrectCount] = useState(0); // 正答数
  const [currentQuizIndex, setCurrentQuizIndex] = useState(1); // 現在の問題数
  const [answeredQuizIds, setAnsweredQuizIds] = useState<number[]>([]); // 解答したクイズIDを配列で保存
  const [singleId, setSingleId] = useState<number | null>(null); // シングルプレイID

  // flags
  // before game start
  const [is_settings, setIsSettings] = useState<boolean>(true); // 設定画面フラグ
  const [customCategory, setCustomCategory] = useState<string>(""); // カスタムカテゴリ
  const [useCustomCategory, setUseCustomCategory] = useState<boolean>(true); // カスタムカテゴリフラグ
  const [is_loading, setIsLoading] = useState<boolean>(false); // ローディングフラグ

  // during game
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null); // 回答正誤フラグ
  const [canAnswer, setCanAnswer] = useState<boolean>(true); // 回答可能フラグ
  const [gameStart, setGameStart] = useState<boolean>(false); // ゲームスタートフラグ
  const [isTimeUp, setIsTimeUp] = useState<boolean>(false); // 時間切れフラグ

  // after game
  const [isEnded, setIsEnded] = useState<boolean>(false); // ゲーム終了フラグ

  // hooks
  const { countdown, isCounting, startCountDown, resetCountDown } =
    useCountDown(timeLimit);
  const { notification, showNotification } = useNotification();
  const { duration, startCountUp, stopCountUp, resetCountUp } =
    useCalcDuration();
  const correctSound = useSound("correct");
  const incorrectSound = useSound("incorrect");
  const navi = useNavigate();

  // context
  const authContext = useContext(AuthContext);
  if (authContext === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  const { user } = authContext;

  // ゲーム開始時に設定画面を非表示、ローディングを開始
  const handleStartQuiz = () => {
    setIsSettings(false);
    setIsLoading(true);
  };

  // クイズの取得が終わったらローディングを終了
  useEffect(() => {
    const fetchQuiz = async () => {
      if (is_loading && !is_settings) {
        const res: any = await generateQuiz(
          useCustomCategory ? customCategory : category,
          difficulty,
          user?.user_id,
        );
        setQuiz(res);
        setIsLoading(false);
      }
    };
    fetchQuiz();
  }, [is_loading]);

  // ローディングが終わったらゲームスタート
  useEffect(() => {
    if (!is_loading && !is_settings && quiz) {
      setGameStart(true);
      startCountDown(); // タイムリミットのカウントダウンを開始
      startCountUp(); // ゲームの開始時刻を記録
    }
  }, [quiz]);

  // 回答した または 時間切れの場合、次の問題を取得
  useEffect(() => {
    const fetchNextQuiz = async () => {
      // 次の問題を取得(ただし最後は除く)
      if (currentQuizIndex !== questionCount) {
        console.log("fetching next quiz");
        const res: any = await generateQuiz(
          useCustomCategory ? customCategory : category,
          difficulty,
          user?.user_id,
        );
        setNextQuiz(res);

        // 最後の問題の場合はquizをフェッチせずにhandleNextQuestionを呼ぶ
      } else {
        setTimeout(() => {
          handleNextQuestion();
        }, 5000);
      }
    };
    if (isAnswerCorrect != null || isTimeUp) {
      fetchNextQuiz();
    }
  }, [isAnswerCorrect, isTimeUp]);

  // 次の問題が取得できたら5秒後に次の問題へ
  useEffect(() => {
    if (nextQuiz != undefined) {
      setTimeout(() => {
        handleNextQuestion();
      }, 5000);
    }
  }, [nextQuiz]);

  // 時間切れの場合
  useEffect(() => {
    const handleTimeUp = async () => {
      resetCountDown();
      const res = await saveAnsweredQuiz(user?.user_id, quiz, "", false);
      const quiz_id = res.quizID;
      setAnsweredQuizIds((prev) => [...prev, quiz_id]);
      setIsTimeUp(true);
    };
    if (isCounting && countdown === 0) {
      handleTimeUp();
    }
  }, [countdown]);

  // ゲーム終了時に履歴を保存
  useEffect(() => {
    const saveHistory = async () => {
      if (isEnded) {
        stopCountUp(); // ゲームの終了時にカウントアップを停止
        const res = await saveSingleHistory(
          user?.user_id,
          useCustomCategory ? customCategory : category,
          difficulty,
          questionCount,
          correctCount,
          duration,
        );
        const singleplay_id = res.id;
        setSingleId(singleplay_id);
        await saveSingleQuizHistory(singleplay_id, answeredQuizIds);
        setAnsweredQuizIds([]);
      }
    };
    saveHistory();
  }, [isEnded]);

  // 回答送信時の処理
  const handleAnswerSelect = async (selectAnswer: string) => {
    setCanAnswer(false);
    if (selectAnswer === quiz?.correct_answer) {
      // 正解時の処理
      resetCountDown();
      // 正解音を再生
      correctSound.play();

      // クイズと回答/正答をユーザーの履歴に保存
      const res = await saveAnsweredQuiz(
        user?.user_id,
        quiz,
        selectAnswer,
        true,
      );
      const quiz_id = res.quizID;
      setAnsweredQuizIds((prev) => [...prev, quiz_id]);
      // 正解フラグを立てる
      setIsAnswerCorrect(true);
      // 正解数を更新
      setCorrectCount((prev) => prev + 1);
    } else {
      // 不正解時の処理
      resetCountDown();
      // 不正解音を再生
      incorrectSound.play();

      // クイズと回答/正答をユーザーの履歴に保存
      const res = await saveAnsweredQuiz(
        user?.user_id,
        quiz,
        selectAnswer,
        false,
      );
      const quiz_id = res.quizID;
      setAnsweredQuizIds((prev) => [...prev, quiz_id]);
      // 不正解フラグを立てる
      setIsAnswerCorrect(false);
    }
  };

  // 次の問題へ
  const handleNextQuestion = async () => {
    setCanAnswer(true);
    // 最後の問題の場合
    if (currentQuizIndex >= questionCount) {
      showNotification("クイズが終了しました。", "info");
      setGameStart(false);
      setIsAnswerCorrect(null);
      setIsEnded(true);
    } else {
      setIsAnswerCorrect(null);
      // 現在の問題数を更新
      setCurrentQuizIndex((prev) => prev + 1);
      setIsTimeUp(false);
      // 次の問題をfetch
      setQuiz(nextQuiz);
      startCountDown();
    }
  };

  // ゲームをリスタート
  const handleRestart = () => {
    resetCountDown();
    resetCountUp();
    setIsAnswerCorrect(null);
    setQuiz(undefined);
    setNextQuiz(undefined);
    setCorrectCount(0);
    setCurrentQuizIndex(1);
    setIsTimeUp(false);
    setIsEnded(false);
    setGameStart(false);

    setIsSettings(true);
  };

  const handleGoHistory = () => {
    navi(`/history/singleplay/${singleId}`);
  };
  return (
    <div className="min-h-screen flex flex-col relative pb-20 md:pb-0 bg-inherit">
      {/* 通知 */}
      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}
      <Header />
      <main className="flex flex-col justify-center items-center">
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
              customCategory={customCategory}
              setCustomCategory={setCustomCategory}
              useCustomCategory={useCustomCategory}
              setUseCustomCategory={setUseCustomCategory}
            />
          )
        }
        {
          // ローディング画面
          is_loading && <PreSingleLoading />
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
              canAnswer={canAnswer}
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
              handleGoHistory={handleGoHistory}
            />
          )
        }
      </main>
      <Footer />
    </div>
  );
};
