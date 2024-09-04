import React, { useState, useContext } from "react";
import { CircularProgress, Typography } from "@mui/material";
import { AuthContext } from "../../context/AuthContext";

import { QuizDisplay } from "../Quiz/QuizDisplay";

import { useWebSocket } from "../../hooks/useWebSocket";
import { useCountDown } from "../../hooks/useCountDown";

import { QuizType } from "../../types/quizType";
import { wsUserType } from "../../types/userType";

const dummyQuiz: QuizType = {
  quiz_id: 1,
  problem: "フランスの首都は？",
  answer: "パリ",
  category: ["地理"],
  difficulty: ["簡単"],
};

export const Matchmaking: React.FC<{ onMatchReset: () => void }> = ({
  onMatchReset,
}) => {
  const [opponent, setOpponent] = useState<wsUserType | null>(null);
  const [matchedNotification, setMatchedNotification] =
    useState<boolean>(false);
  const [isMatched, setIsMatched] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const [opponentAnswering, setOpponentAnswering] = useState(false);
  const [canAnswer, setCanAnswer] = useState(true);
  const [inputAnswer, setInputAnswer] = useState("");
  const [quiz, setQuiz] = useState<QuizType>(dummyQuiz);
  const [winner, setWinner] = useState<string | null>(null);

  const { countdown, isCounting, startCountDown } = useCountDown(3);

  const authContext = useContext(AuthContext);
  if (authContext === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  const { user } = authContext;

  const { status, send } = useWebSocket("ws://localhost:3000", user, (data) => {
    // 接続が確立されたときの処理
    if (data.success && data.opponent) {
      setOpponent(data.opponent);
      setMatchedNotification(true);
      startCountDown();
      setTimeout(() => {
        setMatchedNotification(false);
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
  });

  // 回答送信時の処理
  const handleAnswerClick = () => {
    setIsAnswering(true);
    send({ action: "answering" });
  };

  const handleAnswerDone = () => {
    setIsAnswering(false); // 自分の回答終了
    send({ action: "done" });
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
      setCanAnswer(false); // 一回回答したらもう回答できない
      alert("不正解です！");
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      {/* マッチング中のローディング表示 */}
      {!isMatched && !matchedNotification && (
        <div className="flex flex-col items-center justify-center">
          <Typography variant="h6" className="mt-4" sx={{ marginBottom: 10 }}>
            {status}
          </Typography>
          <CircularProgress />
        </div>
      )}
      {/* マッチング完了通知 */}
      {matchedNotification && isCounting && (
        <div className="w-full text-center">
          <Typography variant="h4" className="font-bold">
            マッチングしました！
          </Typography>
          <Typography variant="h6" className="font-bold">
            {countdown}秒後に開始します...
          </Typography>
        </div>
      )}
      {/* マッチした　かつ　勝者が決まってない場合 対戦を表示*/}
      {!matchedNotification && isMatched && !winner && (
        <QuizDisplay
          quiz={quiz}
          inputAnswer={inputAnswer}
          setInputAnswer={setInputAnswer}
          handleAnswerClick={handleAnswerClick}
          handleAnswerDone={handleAnswerDone}
          canAnswer={canAnswer}
          isAnswering={isAnswering}
          opponentAnswering={opponentAnswering}
          opponent={opponent}
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
