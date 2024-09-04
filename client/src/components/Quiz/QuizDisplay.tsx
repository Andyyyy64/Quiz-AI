import { Button, TextField, Typography } from "@mui/material";
import { QuizDisplayProps } from "../../types/quizType";

export const QuizDisplay: React.FC<QuizDisplayProps> = ({
  quiz,
  inputAnswer,
  setInputAnswer,
  handleAnswerClick,
  handleAnswerDone,
  canAnswer,
  isAnswering,
  opponentAnswering,
  opponent,
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center gap-y-44">
      {/* クイズの問題表示部分 */}
      <div className="w-full text-center mt-8">
        <Typography variant="h4" className="font-bold">
          {quiz.problem} {/* クイズの問題を表示 */}
        </Typography>
      </div>

      <div className="w-full flex justify-center items-center mb-8 gap-10">
        {/* 自分のUI */}
        <div className="w-80 p-8 border-4 border-gray-300 bg-blue-100 shadow-lg rounded-lg">
          <Typography
            variant="h6"
            className="font-bold text-blue-700"
            sx={{ textAlign: "center" }}
          >
            あなた
          </Typography>
          {!isAnswering && !opponentAnswering ? (
            <div className="flex flex-col mt-4">
              <Button
                variant="contained"
                color="primary"
                onClick={handleAnswerClick}
                disabled={!canAnswer}
                size="large"
              >
                回答
              </Button>
            </div>
          ) : isAnswering ? (
            <div className="flex flex-col mt-4">
              <TextField
                variant="outlined"
                label="Your Answer"
                className="mt-4"
                value={inputAnswer}
                onChange={(e) => setInputAnswer(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAnswerDone()}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleAnswerDone}
                className="mt-4"
                size="large"
              >
                送信
              </Button>
            </div>
          ) : (
            <Typography variant="body1" className="mt-4">
              相手が回答中...
            </Typography>
          )}
        </div>

        {/* 相手のUI */}
        <div className="w-80 p-8 border-4 border-gray-300 bg-red-100 shadow-lg rounded-lg">
          <Typography
            variant="h6"
            className="font-bold text-red-700"
            sx={{ textAlign: "center" }}
          >
            {opponent?.name} {/* 相手の名前を表示 */}
          </Typography>
          <Typography
            variant="body1"
            className="mt-4"
            sx={{ textAlign: "center" }}
          >
            ランク: {opponent?.rank} {/* 相手のランクを表示 */}
          </Typography>
        </div>
      </div>
    </div>
  );
};
