import React, { useState, useContext, useEffect } from "react";
import { Typography } from "@mui/material";
import { AuthContext } from "../../context/AuthContext";

import { MultiGame } from "./UI/MultiGame";

import { useWebSocket } from "../../hooks/useWebSocket";
import { useCountDown } from "../../hooks/useCountDown";

import { QuizType } from "../../types/quizType";
import { wsUserType } from "../../types/userType";
import { PreMatchLoading } from "./UI/PreMatchLoading";
import { MatchedUI } from "./UI/MatchedUI";

export const Matchmaking: React.FC<{ onMatchReset: () => void }> = ({
  onMatchReset,
}) => {
  const [opponent, setOpponent] = useState<wsUserType | null>(null); // 相手の情報
  const [matchedNotification, setMatchedNotification] =
    useState<boolean>(false); // マッチング通知用, ToDo:useNotificationに変更したい
  const [isMatched, setIsMatched] = useState(false); // マッチング完了フラグ
  const [selectedAnswer, setSelectedAnswer] = useState(""); // 回答入力
  const [quiz, setQuiz] = useState<QuizType>();
  const [nextQuiz, setNextQuiz] = useState<QuizType>();
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0); // 現在のクイズのインデックス
  const [correctCount, setCorrectCount] = useState(0); // 正解数
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null); // 回答の正誤
  const [canAnswer, setCanAnswer] = useState(true); // 回答可能フラグ(1回回答したら次の問題が表示されるまでfalse)
  const [winner, setWinner] = useState<string | null>(null); // 勝者

  const { countdown, isCounting, startCountDown, resetCountDown } =
    useCountDown(10);

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
        setIsAnswerCorrect(false);

        // 相手が誤答した場合、
      } else if (data.message === "opponent_answerd" && data.is_correct === false) {
        alert("相手が誤答しました！");
        setCanAnswer(true);

        // 相手の接続が切れた場合、マッチをリセット
      } else if (data.message === "Opponent has disconnected.") {
        alert("相手の接続が切れました。");
        setIsMatched(false);
        onMatchReset();

        // 次のクイズを受信した場合、
      } else if (data.message === "next_quiz") {
        resetCountDown();
        setNextQuiz(data.quiz);

        // 勝者が決まった場合、勝者を表示してマッチをリセット
      } else if (data.winner) {
        setWinner(data.winner);
        setTimeout(() => {
          onMatchReset();
        }, 3000);
      } else if (data.message === "opponent_wrong_answer") {
        alert("相手が誤答しました！");
        setCanAnswer(true);
      }
    }
  );

  // 回答送信時の処理
  const handleAnswerSelect = (selectAnswer: string) => {
    setSelectedAnswer(selectAnswer);
    setCanAnswer(false);
    if (selectAnswer === quiz?.correct_answer) {
      // 正解時の処理
      setIsAnswerCorrect(true);
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
      alert("不正解です！");
    }
  };

  const handleNextQuestion = () => {
    if (currentQuizIndex + 1 >= 10) {
      alert("10問が終了しました。");
      onMatchReset();
    } else {
      // 問題数とstateを更新
      setIsAnswerCorrect(null);
      setCurrentQuizIndex((prev) => prev + 1);
      // 次の問題をfetch
      setQuiz(nextQuiz);
      setCanAnswer(true);
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
      setTimeout(() => {
        handleNextQuestion();
      }, 5000);
    }
  }, [nextQuiz]);

  return (
    <div className="w-full h-full flex justify-center items-center relative">
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
          selectedAnswer={selectedAnswer}
          setSelectedAnswer={setSelectedAnswer}
          handleAnswerSelect={handleAnswerSelect}
          opponent={opponent}
          countdown={countdown}
          isCounting={isCounting}
          isAnswerCorrect={isAnswerCorrect}
          canAnswer={canAnswer}
        />
      )}
      {/* 勝者が決まったら表示　*/}
      {winner && (
        <div className="w-full text-center">
          <Typography variant="h4" className="font-bold">
            {winner === user?.name ? "勝利！" : "敗北..."}
          </Typography>
        </div>
      )}
    </div>
  );
};
