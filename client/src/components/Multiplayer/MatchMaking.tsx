import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../../context/AuthContext";

import { saveAnsweredQuiz, updatePoints } from "../../api/user";
import { saveMultiHistory, saveMultiQuizHistory } from "../../api/history";

import { MultiGame } from "./UI/MultiGame";
import { PreMatchLoading } from "./UI/PreMatchLoading";
import { MatchedUI } from "./UI/MatchedUI";
import { WinUI } from "./UI/WinUI";
import { LoseUI } from "./UI/LoseUI";

import { useWebSocket } from "../../hooks/useWebSocket";
import { useCountDown } from "../../hooks/useCountDown";
import { useCalcDuration } from "../../hooks/useCalcDuration";
import { useNotification } from "../../hooks/useNotification";
import { useSound } from "../../hooks/useSound";

import { QuizType } from "../../types/quizType";
import { wsUserType } from "../../types/userType";

import { Notification } from "../Common/Notification";

export const Matchmaking: React.FC<{ onMatchReset: () => void }> = ({
  onMatchReset,
}) => {
  const MATCH_QUESTION_NUM = 3; // マッチング時の問題数
  // datas
  const [quiz, setQuiz] = useState<QuizType>(); // 現在のクイズ
  const [nextQuiz, setNextQuiz] = useState<QuizType>(); // 次のクイズ
  const [opponent, setOpponent] = useState<wsUserType | null>(null); // マッチした相手の情報
  const [userAnswer, setUserAnswer] = useState<string>(""); // ユーザーの回答
  const [opponentAnswer, setOpponentAnswer] = useState<string>(""); // 相手の回答
  const [currentQuizIndex, setCurrentQuizIndex] = useState(1); // 現在のクイズのインデックス
  const [correctCount, setCorrectCount] = useState(0); // 正解数
  const [opponentCorrectCount, setOpponentCorrectCount] = useState(0); // 相手の正解数
  const [answerdQuizIds, setAnsweredQuizIds] = useState<number[]>([]); // 解答済みクイズID
  const [sessionId, setSessionId] = useState<number | null>(null); // セッションID

  // flags
  // before match
  const [matchedNotification, setMatchedNotification] =
    useState<boolean>(false); // マッチング通知用
  const [isMatched, setIsMatched] = useState(false); // マッチング完了フラグ

  // on match
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null); // 回答の正誤
  const [canAnswer, setCanAnswer] = useState(true); // 回答可能フラグ
  const [isTimeUp, setIsTimeUp] = useState(false); // タイムアップフラグ
  const [isEveryOneWrong, setEveryOneWrong] = useState<number>(0); // お互いの回答が不正解の場合
  const [isDraw, setIsDraw] = useState(false); // 引き分けフラグ

  // after match
  const [winner, setWinner] = useState<string | null>(""); // 勝者
  const [isHistorySaved, setIsHistorySaved] = useState(false); // 履歴保存が終わったかどうかのフラグ
  const [matchEnd, setMatchEnd] = useState(false); // マッチ終了フラグ

  const { countdown, isCounting, startCountDown, resetCountDown } =
    useCountDown(30); // 制限時間
  const { duration, startCountUp, stopCountUp, resetCountUp } =
    useCalcDuration();

  const correctSound = useSound("correct");
  const incorrectSound = useSound("incorrect");

  const { notification, showNotification } = useNotification();
  const navi = useNavigate();

  const authContext = useContext(AuthContext);
  if (authContext === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  const { user } = authContext;

  const { status, send } = useWebSocket(
    import.meta.env.VITE_APP_WS_URL,
    user,
    (data) => {
      // 接続が確立されたときの処理
      if (data.success && data.opponent && data.quiz) {
        setOpponent(data.opponent);
        setQuiz(data.quiz);
        setMatchedNotification(true);
        startCountDown();
        setTimeout(() => {
          setMatchedNotification(false);
          resetCountDown();
          setIsMatched(true);
          startCountDown();
          // マッチ時間の計測開始
          startCountUp();
        }, 10000); // 10秒後に開始

        // 相手が正答した場合、
      } else if (
        data.message === "opponent_answerd" &&
        data.is_correct === true
      ) {
        // カウントダウンをリセット
        resetCountDown();
        console.log("opponent_correct_answer");
        // 相手の正解数を更新
        setOpponentCorrectCount((prev) => prev + 1);
        // クイズをユーザーの履歴に保存
        handleAnswerSaved(false, data.quiz, userAnswer);
        // 自分は不正解として処理
        setIsAnswerCorrect(false);

        // 相手が誤答した場合、
      } else if (
        data.message === "opponent_answerd" &&
        data.is_correct === false
      ) {
        console.log("opponent_wrong_answer");
        setOpponentAnswer(data.opponent_selected_answer);
        setEveryOneWrong((prev) => prev + 1);
        showNotification("相手が誤答しました！", "info");

        // 相手の接続が切れた場合、マッチをリセット
      } else if (data.message === "Opponent has disconnected.") {
        if (!matchEnd && !winner) {
          showNotification("相手の接続が切れました。topに戻ります", "error");

          // flagをリセット
          setQuiz(undefined);
          setOpponent(null);
          setAnsweredQuizIds([]);
          setCorrectCount(0);
          setCurrentQuizIndex(1);
          setOpponentCorrectCount(0);
          setIsAnswerCorrect(null);
          setIsTimeUp(false);
          setCanAnswer(true);
          setEveryOneWrong(0);
          setIsDraw(false);

          setTimeout(() => {
            setIsMatched(false);
            onMatchReset();
          }, 3000);
        }

        // 次のクイズを受信した場合、
      } else if (data.message === "next_quiz") {
        console.log("next_quiz_feched");
        setNextQuiz(data.quiz);

        // 勝者が決まった場合、勝者を表示してマッチをリセット
      } else if (data.winner) {
        console.log("winner:", data.winner);
        setWinner(data.winner);
        setOpponent(data.opponent);
        setMatchEnd(true);
      } else if (data.message === "time_up_refetch") {
        send({ action: "fetch_next_quiz" });
      }
    },
  );

  // どちらかが現在の問題に正解で次の問題のfetchを申請する
  // 最後の問題の時はfetchしない
  useEffect(() => {
    const fetchNextQuiz = async () => {
      console.log(isAnswerCorrect);
      if (isAnswerCorrect && !(currentQuizIndex >= MATCH_QUESTION_NUM)) {
        send({ action: "fetch_next_quiz" });
      } else if (
        currentQuizIndex >= MATCH_QUESTION_NUM &&
        isAnswerCorrect != null
      ) {
        handleNextQuestion();
      }
    };
    fetchNextQuiz();
  }, [isAnswerCorrect]);

  // 次の問題がfetchされたら、3秒後に次の問題を表示
  useEffect(() => {
    console.log(nextQuiz?.correct_answer);
    // nextQuizが存在し、勝者が決まっていない場合
    if (nextQuiz != undefined && !winner) {
      setTimeout(() => {
        handleNextQuestion();
      }, 1000);
    }
  }, [nextQuiz]);

  // 時間切れの場合
  useEffect(() => {
    if (isCounting && countdown === 0) {
      setIsTimeUp(true);
      setCanAnswer(false);
      resetCountDown();
      // クイズをユーザーの履歴に保存
      handleAnswerSaved(false, quiz, userAnswer);
      // 一方のみに送信するようにidを比較
      if (currentQuizIndex < MATCH_QUESTION_NUM) {
        if ((user?.user_id ?? 0) > (opponent?.id ?? 1)) {
          send({ action: "fetch_next_quiz" });
        }
      } else if (currentQuizIndex >= MATCH_QUESTION_NUM && countdown === 0) {
        handleNextQuestion();
      }
    }
  }, [countdown]);

  // 引き分けの場合
  useEffect(() => {
    if (isDraw && !winner) {
      setCanAnswer(false);
      resetCountDown();
      handleAnswerSaved(false, quiz, userAnswer);
      if (currentQuizIndex < MATCH_QUESTION_NUM) {
        // 一方のみに送信するようにidを比較
        if ((user?.user_id ?? 0) > (opponent?.id ?? 1)) {
          send({ action: "fetch_next_quiz" });
        }
      } else {
        handleNextQuestion();
      }
    }
  }, [isDraw]);

  // お互いの回答が不正解の場合
  useEffect(() => {
    if (isEveryOneWrong == 2) {
      setIsDraw(true);
    }
  }, [isEveryOneWrong]);

  // 全てのクイズの履歴が保存されたら、マッチングの履歴を保存
  useEffect(() => {
    if (
      matchEnd &&
      !isHistorySaved && // 履歴がまだ保存されていない
      answerdQuizIds.length === currentQuizIndex // 全てのクイズの履歴が保存された
    ) {
      stopCountUp(); // マッチ時間の計測を終了
      handleSaveHistory(opponent);
      setIsHistorySaved(true); // 履歴が保存されたらフラグを立てる
      resetCountUp();
    }
  }, [matchEnd, answerdQuizIds, currentQuizIndex]);

  // 回答送信時の処理
  const handleAnswerSelect = async (selectAnswer: string) => {
    setCanAnswer(false);
    setUserAnswer(selectAnswer);
    if (selectAnswer === quiz?.correct_answer) {
      // 正解時の処理
      resetCountDown(); // カウントダウンをリセット
      correctSound.play(); // 正解音を再生
      setCorrectCount((prev) => prev + 1); // 正解数を更新
      handleAnswerSaved(true, quiz, selectAnswer); // クイズと回答/正答をユーザーの履歴に保存
      send({ action: "answerd", selectedAnswer: selectAnswer });
      setIsAnswerCorrect(true); // 正解フラグを立てる
    } else {
      // 不正解時の処理
      incorrectSound.play(); // 不正解音を再生
      setEveryOneWrong((prev) => prev + 1);
      send({ action: "answerd", selectedAnswer: selectAnswer });
    }
  };

  // 次の問題に進む処理
  const handleNextQuestion = () => {
    // 10問終わって勝者が決まった場合
    if (currentQuizIndex >= MATCH_QUESTION_NUM) {
      if (correctCount > opponentCorrectCount) {
        send({ action: "victory", winner: user?.name });
        return;
      } else if (correctCount === opponentCorrectCount) {
        send({ action: "victory", winner: "引き分け" });
        return;
      }
    } else {
      // 問題数とstateを更新
      setIsAnswerCorrect(null);
      setIsDraw(false);
      setEveryOneWrong(0);
      // インデックスを更新
      setCurrentQuizIndex((prev) => prev + 1);
      setIsTimeUp(false);
      // fetchされた次の問題をセット
      setQuiz(nextQuiz);
      setCanAnswer(true);
      startCountDown();
    }
  };

  // 回答を保存する処理
  const handleAnswerSaved = async (
    is_correct: boolean,
    quizz: QuizType | undefined,
    user_answer?: string,
  ) => {
    const res = await saveAnsweredQuiz(
      user?.user_id,
      quizz,
      user_answer ? user_answer : "",
      is_correct,
    );
    const quiz_id = res.quizID;
    setAnsweredQuizIds((prev) => [...prev, quiz_id]);
  };

  // マッチングの履歴を保存する処理
  const handleSaveHistory = async (opponentt: any) => {
    const match_duration = duration;
    // 勝者によってポイントを変更
    const points_awarded =
      winner === user?.name ? correctCount * 10 : correctCount * 3;
    const userPoints = user?.points ? user?.points : 0;
    const winnerId = winner === user?.name ? user.user_id : opponentt?.id;

    // ポイントを更新
    await updatePoints(user?.user_id, userPoints + points_awarded);

    // マッチング履歴を保存
    const res = await saveMultiHistory(
      user?.user_id,
      opponentt,
      winnerId,
      points_awarded,
      match_duration,
      MATCH_QUESTION_NUM,
    );
    const multiSessionId = res.id;
    setSessionId(multiSessionId);
    // このマッチにおけるクイズ履歴を保存
    await saveMultiQuizHistory(multiSessionId, answerdQuizIds);

    setAnsweredQuizIds([]);
  };

  const handleGoHistory = () => {
    navi(`/history/multiplay/${sessionId}`);
  };

  return (
    <div className="w-full h-full flex justify-center items-center relative pb-20">
      {/* 通知 */}
      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}
      {/* マッチング中のローディング表示 */}
      {!isMatched && !matchedNotification && (
        <PreMatchLoading status={status} />
      )}
      {/* マッチング完了通知 7秒引いて3秒のカウントダウンにしてる藁*/}
      {matchedNotification && isCounting && (
        <MatchedUI opponent={opponent} user={user} countdown={countdown} />
      )}
      {/* マッチした　かつ　勝者が決まってない場合 対戦を表示*/}
      {!matchedNotification && isMatched && !winner && (
        <MultiGame
          user={user}
          quiz={quiz}
          handleAnswerSelect={handleAnswerSelect}
          opponent={opponent}
          countdown={countdown}
          isCounting={isCounting}
          isAnswerCorrect={isAnswerCorrect}
          canAnswer={canAnswer}
          isTimeUp={isTimeUp}
          currentQuizIndex={currentQuizIndex}
          correctCount={correctCount}
          isDraw={isDraw}
          opponentAnswer={opponentAnswer}
        />
      )}
      {/* 勝者が決まったら表示　*/}
      {winner && (
        <div className="w-full text-center p-2">
          {winner === user?.name ? (
            <WinUI
              handleGoHistory={handleGoHistory}
              correctCount={correctCount}
              isHistorySaved={isHistorySaved}
            />
          ) : (
            <LoseUI winner={winner} handleGoHistory={handleGoHistory} />
          )}
        </div>
      )}
    </div>
  );
};
