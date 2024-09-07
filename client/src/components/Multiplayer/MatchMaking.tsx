import React, { useState, useContext, useEffect } from "react";
import { Typography } from "@mui/material";
import { AuthContext } from "../../context/AuthContext";

import { MultiGame } from "../Multiplayer/MultiGame";

import { useWebSocket } from "../../hooks/useWebSocket";
import { useCountDown } from "../../hooks/useCountDown";
import { useDots } from "../../hooks/useDots";

import { Category, Difficulty, QuizType } from "../../types/quizType";
import { wsUserType } from "../../types/userType";
import { Users, User, Zap } from "lucide-react";

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

  const dots = useDots();

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
        <div
          className="p-5 bg-white text-[#333333] overflow-hidden 
        flex items-center justify-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          <div className="z-10 text-center">
            <div className="bg-white rounded-xl shadow-md p-8 max-w-md mx-auto">
              <Users className="h-20 w-20 text-[#4ECDC4] mx-auto mb-6 animate-pulse" />
              <h2 className="text-2xl font-bold mb-4">
                {status}
                {dots}
              </h2>
              <p className="text-[#666666] mb-6">
                壮大な頭脳バトルの準備を整えています。
                あなたの知識を披露する準備はできていますか？
              </p>
              <div className="w-full h-2 bg-[#F0F0F0] rounded-full overflow-hidden">
                <div className="h-full bg-[#4ECDC4] animate-[loading_2s_ease-in-out_infinite]"></div>
              </div>
            </div>
          </div>
          <style jsx global>{`
            @keyframes moveBackground {
              0% {
                transform: translate(0, 0);
              }
              100% {
                transform: translate(20px, 20px);
              }
            }
            @keyframes loading {
              0% {
                width: 0%;
              }
              50% {
                width: 100%;
              }
              100% {
                width: 0%;
              }
            }
          `}</style>
        </div>
      )}
      {/* マッチング完了通知 7秒引いて3秒のカウントダウンにしてる藁*/}
      {matchedNotification && isCounting && (
        <div className="w-full z-10 text-center">
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-[#FF6B6B]">
              マッチしました！
            </h2>
            <div className="flex justify-around mb-8">
              <div className="text-center">
                <User className="h-32 w-32 text-[#4ECDC4] mx-auto mb-2" />
                <p className="font-bold">あなた</p>
              </div>
              <div className="text-4xl font-bold text-[#FFD93D] flex items-center">
                <Zap className="h-8 w-8 mr-2" />
                VS
                <Zap className="h-8 w-8 ml-2" />
              </div>
              <div className="text-center">
                <img
                  className="w-32 h-32 rounded-full object-cover border-2 border-[#4ECDC4]"
                  src={opponent?.prof_image_url}
                  alt={user?.name}
                />
                <p className="font-bold">{opponent?.name}</p>
                <p className="text-[#666666]">ランク: {opponent?.rank}</p>
              </div>
            </div>
            <p className="text-xl mb-6">壮大な知識のバトルに備えよ！</p>
            <div className="bg-[#F0F0F0] rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl font-bold">{countdown - 7}</span>
            </div>
          </div>
        </div>
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
