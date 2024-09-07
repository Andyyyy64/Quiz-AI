import React, { useState, useContext, useEffect } from "react";
import { Typography } from "@mui/material";
import { AuthContext } from "../../context/AuthContext";

import { MultiGame } from "./UI/MultiGame";

import { useWebSocket } from "../../hooks/useWebSocket";
import { useCountDown } from "../../hooks/useCountDown";

import { Category, Difficulty, QuizType } from "../../types/quizType";
import { wsUserType } from "../../types/userType";
import { PreMatchLoading } from "./UI/PreMatchLoading";
import { MatchedUI } from "./UI/MatchedUI";

const dummyQuiz: QuizType = {
  quiz_id: 1,
  problem: "フランスの首都は？",
  answer: "パリ",
  category: Category.noCategory,
  difficulty: Difficulty.easy,
};

export const Matchmaking: React.FC<{ onMatchReset: () => void }> = ({
  onMatchReset,
}) => {
  const [opponent, setOpponent] = useState<wsUserType | null>(null); // 相手の情報
  const [matchedNotification, setMatchedNotification] =
    useState<boolean>(false); // マッチング通知用, ToDo:useNotificationに変更したい
  const [isMatched, setIsMatched] = useState(false); // マッチング完了フラグ
  const [isAnswering, setIsAnswering] = useState(false); // 回答中フラグ
  const [opponentAnswering, setOpponentAnswering] = useState(false); // 相手が回答中フラグ
  const [canAnswer, setCanAnswer] = useState(true); // 回答可能フラグ
  const [inputAnswer, setInputAnswer] = useState(""); // 回答入力
  const [quiz, _setQuiz] = useState<QuizType>(dummyQuiz);
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
      if (data.success && data.opponent) {
        setOpponent(data.opponent);
        setMatchedNotification(true);
        startCountDown();
        setTimeout(() => {
          setMatchedNotification(false);
          resetCountDown();
          setIsMatched(true);
        }, 3000);

        // 相手が回答中の場合、回答中フラグを立てる
      } else if (data.message === "opponent_answering") {
        setOpponentAnswering(true);
        setIsAnswering(false);
        setCanAnswer(false);

        // 相手が回答完了の場合、回答可能フラグを立てる
      } else if (data.message === "opponent_answering_done") {
        setOpponentAnswering(false);
        setCanAnswer(true);

        // 相手の接続が切れた場合、マッチをリセット
      } else if (data.message === "Opponent has disconnected.") {
        alert("相手の接続が切れました。");
        setIsMatched(false);
        onMatchReset();

        // 相手の回答が不正解の場合、アラートを表示
      } else if (data.message === "opponent_wrong_answer") {
        alert("相手の回答は不正解でした！");

        // 勝者が決まった場合、勝者を表示してマッチをリセット
      } else if (data.winner) {
        setWinner(data.winner);
        setTimeout(() => {
          onMatchReset();
        }, 3000);
      }
    }
  );

  useEffect(() => {
    if (isAnswering && countdown === 0) {
      handleTimeOut();
      setCanAnswer(false); // 一回回答したらもう回答できない
    }
  }, [countdown, isAnswering]);

  // 回答送信時の処理
  const handleAnswerClick = () => {
    setIsAnswering(true);
    send({ action: "answering" });
    startCountDown();
  };

  const handleAnswerDone = () => {
    setIsAnswering(false); // 自分の回答終了
    send({ action: "done" });
    resetCountDown(); // タイマーリセット
    setCanAnswer(false); // 一回回答したらもう回答できない
    setInputAnswer(""); // 回答入力リセット
    // 正解の場合、勝者を通知してマッチをリセット
    if (inputAnswer.trim().toLowerCase() === quiz.answer.toLowerCase()) {
      setWinner(user?.name ?? "You");
      send({ action: "victory", winner: user?.name ?? "You" });
      setTimeout(() => {
        onMatchReset();
      }, 3000);
      // 不正解の場合、相手に不正解を通知してアラートを表示
    } else {
      send({ action: "wrong_answer" });
      alert("不正解です！");
    }
  };

  const handleTimeOut = () => {
    setIsAnswering(false);
    send({ action: "done" });
    alert("時間切れです！");
    resetCountDown(); // タイマーリセット
  };

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
          inputAnswer={inputAnswer}
          setInputAnswer={setInputAnswer}
          handleAnswerClick={handleAnswerClick}
          handleAnswerDone={handleAnswerDone}
          canAnswer={canAnswer}
          isAnswering={isAnswering}
          opponentAnswering={opponentAnswering}
          opponent={opponent}
          countdown={countdown}
          isCounting={isCounting}
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
