import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";

import { MultiGame } from "./UI/MultiGame";
import { PreMatchLoading } from "./UI/PreMatchLoading";
import { MatchedUI } from "./UI/MatchedUI";

import { useWebSocket } from "../../hooks/useWebSocket";
import { useCountDown } from "../../hooks/useCountDown";
import { useNotification } from "../../hooks/useNotification";

import { QuizType } from "../../types/quizType";
import { wsUserType } from "../../types/userType";
import { WinUI } from "./UI/WinUI";
import { LoseUI } from "./UI/LoseUI";
import { Notification } from "../Common/Notification";


export const Matchmaking: React.FC<{ onMatchReset: () => void }> = ({ onMatchReset }) => {
  // datas
  const [quiz, setQuiz] = useState<QuizType>(); // 現在のクイズ
  const [nextQuiz, setNextQuiz] = useState<QuizType>(); // 次のクイズ 
  const [opponent, setOpponent] = useState<wsUserType | null>(null); // マッチした相手の情報
  const [currentQuizIndex, setCurrentQuizIndex] = useState(1); // 現在のクイズのインデックス
  const [correctCount, setCorrectCount] = useState(0); // 正解数

  // flags
  const [matchedNotification, setMatchedNotification] = useState<boolean>(false); // マッチング通知用, ToDo:useNotificationに変更したい
  const [isMatched, setIsMatched] = useState(false); // マッチング完了フラグ
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null); // 回答の正誤
  const [canAnswer, setCanAnswer] = useState(true); // 回答可能フラグ
  const [isTimeUp, setIsTimeUp] = useState(false); // タイムアップフラグ
  const [winner, setWinner] = useState<string | null>(""); // 勝者

  const { countdown, isCounting, startCountDown, resetCountDown } =
    useCountDown(10);

  const { notification, showNotification } = useNotification();

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
        }, 3000); // 3秒後に開始

        // 相手が正答した場合、
      } else if (data.message === "opponent_answerd" && data.is_correct === true) {
        resetCountDown();
        setIsAnswerCorrect(false);

        // 相手が誤答した場合、
      } else if (data.message === "opponent_answerd" && data.is_correct === false) {
        showNotification("相手が誤答しました！", "info");
        setCanAnswer(true);

        // 相手の接続が切れた場合、マッチをリセット
      } else if (data.message === "Opponent has disconnected.") {
        showNotification("相手の接続が切れました。topに戻ります", "error");
        setTimeout(() => {
          console.log("reset");
          setIsMatched(false);
          onMatchReset();
        }, 3000);

        // 次のクイズを受信した場合、
      } else if (data.message === "next_quiz") {
        setNextQuiz(data.quiz);

        // 勝者が決まった場合、勝者を表示してマッチをリセット
      } else if (data.winner) {
        setWinner(data.winner);
      } else if (data.message === "opponent_wrong_answer") {
        showNotification("相手が誤答しました！", "info");
        setCanAnswer(true);
      } else if (data.message === "time_up_refetch") {
        send({ action: "fetch_next_quiz" });
      }
    }
  );

  // 回答送信時の処理
  const handleAnswerSelect = (selectAnswer: string) => {
    setCanAnswer(false);
    if (selectAnswer === quiz?.correct_answer) {
      // 正解時の処理
      setIsAnswerCorrect(true);
      resetCountDown();
      setCorrectCount((prev) => prev + 1);
      if (correctCount + 1 === 5) {
        // 5点先取で勝利
        send({ action: "victory", winner: user?.name });
        setWinner(user?.name ?? "You");
        return;
      }

      send({ action: "answerd", selectedAnswer: selectAnswer });
    } else {
      // 不正解時の処理
      send({ action: "wrong_answer" });
      showNotification("不正解です！", "error");
    }
  };

  const handleNextQuestion = () => {
    if (currentQuizIndex >= 10) {
      showNotification("マッチが終了しました。", "info");
      onMatchReset();
    } else {
      // 問題数とstateを更新
      setIsAnswerCorrect(null);
      setCurrentQuizIndex((prev) => prev + 1);
      setIsTimeUp(false);
      // 次の問題をfetch
      setQuiz(nextQuiz);
      setCanAnswer(true);
      startCountDown();
    }
  };

  // どちらかが現在の問題に正解した時点で次の問題をfetchする
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
    if (nextQuiz != undefined) {
      console.log(nextQuiz);
      setTimeout(() => {
        handleNextQuestion();
      }, 5000);
    }
  }, [nextQuiz]);

  useEffect(() => {
    console.log(countdown);
    if (isCounting && countdown === 0) {
      setIsTimeUp(true);
      setCanAnswer(false);
      resetCountDown();
      // お互いのcountdonwは同期しているので2回送信してしまう
      // 一方のみに送信するようにidを比較
      if (((user?.user_id ?? 0) > (opponent?.id ?? 1))) {
        send({ action: "fetch_next_quiz" });
      }
    }
  }, [countdown]);

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
        />
      )}
      {/* 勝者が決まったら表示　*/}
      {winner && (
        <div className="w-full text-center">
          {
            winner === user?.name ? (
              <WinUI />
            ) : (
              <LoseUI />
            )
          }
        </div>
      )}
    </div>
  );
};
