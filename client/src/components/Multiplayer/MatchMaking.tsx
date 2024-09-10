import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../../context/AuthContext";

import { saveAnsweredQuiz } from "../../api/user";
import { saveMultiHistory, saveMultiQuizHistory } from "../../api/history";

import { MultiGame } from "./UI/MultiGame";
import { PreMatchLoading } from "./UI/PreMatchLoading";
import { MatchedUI } from "./UI/MatchedUI";
import { WinUI } from "./UI/WinUI";
import { LoseUI } from "./UI/LoseUI";

import { useWebSocket } from "../../hooks/useWebSocket";
import { useCountDown } from "../../hooks/useCountDown";
import { useNotification } from "../../hooks/useNotification";

import { QuizType } from "../../types/quizType";
import { wsUserType } from "../../types/userType";

import { Notification } from "../Common/Notification";

export const Matchmaking: React.FC<{ onMatchReset: () => void }> = ({ onMatchReset }) => {
  const MATCH_QUESTION_NUM = 10; // マッチング時の問題数
  const MATCH_POINT = 5; // マッチング時のポイント数

  // datas
  const [quiz, setQuiz] = useState<QuizType>(); // 現在のクイズ
  const [nextQuiz, setNextQuiz] = useState<QuizType>(); // 次のクイズ 
  const [opponent, setOpponent] = useState<wsUserType | null>(null); // マッチした相手の情報
  const [userAnswer, setUserAnswer] = useState<string>(""); // ユーザーの回答
  const [currentQuizIndex, setCurrentQuizIndex] = useState(1); // 現在のクイズのインデックス
  const [correctCount, setCorrectCount] = useState(0); // 正解数
  const [answerdQuizIds, setAnsweredQuizIds] = useState<number[]>([]); // 解答済みクイズID
  const [sessionId, setSessionId] = useState<number | null>(null); // セッションID

  // flags
  // before match
  const [matchedNotification, setMatchedNotification] = useState<boolean>(false); // マッチング通知用, ToDo:useNotificationに変更したい
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
    useCountDown(10);

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
        console.log(data.quiz.correct_answer)
        setOpponent(data.opponent);
        setQuiz(data.quiz);
        setMatchedNotification(true);
        startCountDown();
        setTimeout(() => {
          setMatchedNotification(false);
          resetCountDown();
          setIsMatched(true);
          startCountDown();
        }, 3000); // 3秒後に開始

        // 相手が正答した場合、
      } else if (data.message === "opponent_answerd" && data.is_correct === true) {
        resetCountDown();
        console.log("opponent_correct_answer");
        handleAnswerSaved(false, data.quiz, userAnswer);
        setIsAnswerCorrect(false);

        // 相手が誤答した場合、
      } else if (data.message === "opponent_answerd" && data.is_correct === false) {
        console.log("opponent_wrong_answer");
        setEveryOneWrong((prev) => prev + 1);
        showNotification("相手が誤答しました！", "info");

        // 相手の接続が切れた場合、マッチをリセット
      } else if (data.message === "Opponent has disconnected.") {
        if (!matchEnd && !winner) {
          showNotification("相手の接続が切れました。topに戻ります", "error");
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
    }
  );

  // どちらかが現在の問題に正解で次の問題のfetchを申請する
  useEffect(() => {
    const fetchNextQuiz = async () => {
      if (isAnswerCorrect) {
        send({ action: "fetch_next_quiz" });
      }
    };
    fetchNextQuiz();
  }, [isAnswerCorrect]);

  // 次の問題がfetchされたら、5秒後に次の問題を表示
  useEffect(() => {
    // nextQuizが存在し、勝者が決まっていない場合
    if (nextQuiz != undefined && !winner) {
      console.log(nextQuiz.correct_answer);
      setTimeout(() => {
        handleNextQuestion();
      }, 5000);
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
      // お互いのcountdonwは同期しているので2回送信してしまう
      // 一方のみに送信するようにidを比較
      if (((user?.user_id ?? 0) > (opponent?.id ?? 1))) {
        send({ action: "fetch_next_quiz" });
      }
    }
  }, [countdown]);

  // 引き分けの場合
  useEffect(() => {
    if (isDraw && !winner) {
      setCanAnswer(false);
      resetCountDown();
      handleAnswerSaved(false, quiz, userAnswer);
      // 一方のみに送信するようにidを比較
      if (((user?.user_id ?? 0) > (opponent?.id ?? 1))) {
        send({ action: "fetch_next_quiz" });
      }
    }
  }, [isDraw])

  // お互いの回答が不正解の場合
  useEffect(() => {
    if (isEveryOneWrong == 2) {
      setIsDraw(true);
    }
  }, [isEveryOneWrong]);

  // 回答送信時の処理
  const handleAnswerSelect = async (selectAnswer: string) => {
    setCanAnswer(false);
    setUserAnswer(selectAnswer);
    if (selectAnswer === quiz?.correct_answer) {
      // 正解時の処理
      resetCountDown(); // カウントダウンをリセット
      setCorrectCount((prev) => prev + 1); // 正解数を更新
      handleAnswerSaved(true, quiz, selectAnswer); // クイズと回答/正答をユーザーの履歴に保存
      send({ action: "answerd", selectedAnswer: selectAnswer });

      // MATCH_POINT点先取した場合
      if (correctCount + 1 === MATCH_POINT) {
        send({ action: "victory", winner: user?.name });
        return;
      }
      setIsAnswerCorrect(true); // 正解フラグを立てる
    } else {
      // 不正解時の処理
      setEveryOneWrong((prev) => prev + 1);
      send({ action: "answerd", selectedAnswer: selectAnswer });
      showNotification("不正解です！", "error");
    }
  };

  useEffect(() => {
    console.log("answerdQuizIds:", answerdQuizIds);
    console.log("currentQuizIndex:", currentQuizIndex);
    if (
      matchEnd &&
      !isHistorySaved && // 履歴がまだ保存されていない
      (answerdQuizIds.length === currentQuizIndex) // 全てのクイズの履歴が保存された
    ) {
      console.log(answerdQuizIds);
      handleSaveHistory(opponent);
      setIsHistorySaved(true); // 履歴が保存されたらフラグを立てる
    }
  }, [matchEnd, answerdQuizIds, currentQuizIndex]);

  // 次の問題に進む処理
  const handleNextQuestion = () => {
    // 10問終わって引き分けの場合
    if (currentQuizIndex >= MATCH_QUESTION_NUM) {      
      setWinner("引き分け");
      console.log("マッチ引き分け");
      console.log("correctCount:", correctCount);
      console.log("winner:", winner);
      console.log("user:", user);

      // マッチング履歴を保存
      handleSaveHistory(opponent);
    } else {
      // 問題数とstateを更新
      setIsAnswerCorrect(null);
      setIsDraw(false);
      setEveryOneWrong(0);
      setCurrentQuizIndex((prev) => prev + 1);
      setIsTimeUp(false);
      // 次の問題をfetch
      setQuiz(nextQuiz);
      setCanAnswer(true);
      startCountDown();
    }
  };

  // 回答を保存する処理
  const handleAnswerSaved = async (is_correct: boolean, quizz: QuizType | undefined, user_answer?: string) => {
    const res = await saveAnsweredQuiz(user?.user_id, quizz, user_answer ? user_answer : "", is_correct);
    const quiz_id = res.quizID;
    console.log("got quiz_id", quiz_id);
    setAnsweredQuizIds((prev) => [...prev, quiz_id]);
  }

  // マッチングの履歴を保存する処理
  const handleSaveHistory = async (opponentt: any) => {
    const match_duration = 100; // 仮のマッチ時間
    const points_awarded = correctCount * 10; // 仮のスコア計算
    const winnerId = winner === user?.name ? user.user_id : opponentt?.id;

    // マッチング履歴を保存
    const res = await saveMultiHistory(
      user?.user_id,
      opponentt,
      winnerId,
      points_awarded,
      match_duration,
      MATCH_QUESTION_NUM
    );
    const multiSessionId = res.id;
    setSessionId(multiSessionId);
    // このマッチにおけるクイズ履歴を保存
    console.log(answerdQuizIds);
    await saveMultiQuizHistory(multiSessionId, answerdQuizIds);

    setAnsweredQuizIds([]);
  }

  const handleGoHistory = () => {
    navi(`/history/multiplay/${sessionId}`);
  }

  return (
    <div className="w-full h-full flex justify-center items-center relative">
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
        />
      )}
      {/* 勝者が決まったら表示　*/}
      {winner && (
        <div className="w-full text-center">
          {
            winner === user?.name ? (
              <WinUI handleGoHistory={handleGoHistory} />
            ) : (
              <LoseUI 
              winner={winner}
              handleGoHistory={handleGoHistory} 
              />
            )
          }
        </div>
      )}
    </div>
  );
};
