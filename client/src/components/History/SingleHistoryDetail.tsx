import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SinglePlayHistoryType } from "../../types/histroyType";
import { JoinedQuizType } from "../../types/quizType";
import {
  Clock,
  CheckCircle,
  XCircle,
  Book,
  BarChart2,
  Tag,
  Star,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useLoading } from "../../hooks/useLoading";

import { getSingleQuizHistory, getSingleHistoryById } from "../../api/history";
import { Header } from "../Common/Header";
import { Footer } from "../Common/Footer";

import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSound } from "../../hooks/useSound";

export const SingleHistoryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [history, setHistory] = useState<SinglePlayHistoryType | null>(null);
  const [quizHistory, setQuizHistory] = useState<Array<JoinedQuizType>>([]);
  const { loading, startLoading, stopLoading } = useLoading();

  const navi = useNavigate();
  const intaractSound = useSound("intaract");

  // シングルプレイの履歴とクイズを取得
  useEffect(() => {
    const fetchHistory = async () => {
      startLoading();
      try {
        const history = await getSingleHistoryById(Number(id));
        setHistory(history);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchQuizHistory = async () => {
      try {
        const quizHistory = await getSingleQuizHistory(Number(id));
        setQuizHistory(quizHistory);
      } catch (err) {
        console.log(err);
      } finally {
        stopLoading();
      }
    };
    fetchHistory();
    fetchQuizHistory();
  }, [id]);

  const handleBack = () => {
    intaractSound.play();
    navi("/history");
  };

  const percentageCorrect =
    history && (history.correct_num / history.question_num) * 100;

  return (
    <div className="min-h-screen flex flex-col relative bg-inherit overflow-hidden">
      <Header />
      <main className="container mx-auto px-4 pb-10">
        <div className="flex items-center justify-center md:mb-5">
          <button
            onClick={handleBack}
            className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors duration-200"
            aria-label="戻る"
          >
            <ArrowLeft className="h-8 w-8 text-black hidden md:block" />
          </button>
          <h1 className="text-3xl font-bold text-center hidden md:block">
            シングルプレイ履歴詳細
          </h1>
        </div>
        {loading ? (
          <div className="animate-pulse">
            <div className="bg-white rounded-xl p-6 mb-8">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="h-8 w-8 bg-gray-200 rounded-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                  </div>
                ))}
              </div>
            </div>
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl p-6 mb-6">
                <div className="flex justify-between mb-4">
                  <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {[...Array(4)].map((_, choiceIndex) => (
                    <div
                      key={choiceIndex}
                      className="h-10 bg-gray-200 rounded-lg"
                    ></div>
                  ))}
                </div>
                <div className="h-24 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-24 ml-auto"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {history && quizHistory && (
              <div
                className="bg-white rounded-xl p-6 mb-8"
                style={{
                  boxShadow:
                    "0 10px 20px 0px rgba(0, 0, 0, 0.1), 0 0px 20px 0px rgba(0, 0, 0, 0.1)",
                }}
              >
                <h2 className="text-xl font-semibold mb-4">クイズサマリー</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div className="flex flex-col items-center">
                    <Clock className="h-8 w-8 text-[#4ECDC4] mb-2" />
                    <p className="text-sm font-medium">ゲーム時間</p>
                    <p className="text-lg font-bold">
                      {Math.floor(history.duration / 60)}:
                      {(history.duration % 60).toString().padStart(2, "0")}
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <CheckCircle className="h-8 w-8 text-[#FFD93D] mb-2" />
                    <p className="text-sm font-medium">正解数</p>
                    <p className="text-lg font-bold">
                      {history.correct_num} / {history.question_num}
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <BarChart2 className="h-8 w-8 text-[#FF6B6B] mb-2" />
                    <p className="text-sm font-medium">精度</p>
                    <p className="text-lg font-bold">
                      {percentageCorrect && percentageCorrect.toFixed(1)}%
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <Tag className="h-8 w-8 text-[#4ECDC4] mb-2" />
                    <p className="text-sm font-medium">カテゴリ</p>
                    <p className="text-lg font-bold md:text-wrap text-nowrap">
                      {history.category == "" ? "ランダム" : history.category}
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <Star className="h-8 w-8 text-[#FFD93D] mb-2" />
                    <p className="text-sm font-medium">難易度</p>
                    <p className="text-lg font-bold">
                      {history.difficulty == ""
                        ? "ランダム"
                        : history.difficulty}
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <Book className="h-8 w-8 text-[#FF6B6B] mb-2" />
                    <p className="text-sm font-medium">問題数</p>
                    <p className="text-lg font-bold">{history.question_num}</p>
                  </div>
                </div>
              </div>
            )}
            {quizHistory.length !== 0 &&
              quizHistory.map((quiz, index) => (
                <div
                  key={quiz.quiz_id}
                  style={{
                    boxShadow:
                      "0 10px 20px 0px rgba(0, 0, 0, 0.1), 0 0px 20px 0px rgba(0, 0, 0, 0.1)",
                  }}
                  className="bg-white rounded-xl p-6 mb-8"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`md:text-2xl text-xl font-bold`}>問題 {index + 1}</h3>
                    <span
                      className={`text-sm ${
                        quiz.is_correct ? "text-green-500" : "text-red-500"
                      } flex items-center`}
                    >
                      {quiz.is_correct ? (
                        <CheckCircle className="h-5 w-5 mr-1" />
                      ) : (
                        <XCircle className="h-5 w-5 mr-1" />
                      )}
                      {quiz.is_correct ? "正解" : "不正解"}
                    </span>
                  </div>
                  <p className="font-medium mb-4">{quiz.question}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {quiz.choices.map((choice, choiceIndex) => (
                      <div
                        key={choiceIndex}
                        className={`p-3 rounded-lg flex items-center justify-between ${
                          choice === quiz.correct_answer
                            ? "bg-green-100 text-green-800 border-2 border-green-500"
                            : choice === quiz.user_choices && !quiz.is_correct
                              ? "bg-red-100 text-red-800 border-2 border-red-500"
                              : choice === quiz.user_choices
                                ? "bg-green-100 text-green-800 border-2 border-green-500"
                                : "bg-gray-100"
                        }`}
                      >
                        <span>{choice}</span>
                        {choice === quiz.correct_answer && (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        )}
                        {choice === quiz.user_choices && !quiz.is_correct && (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="bg-blue-100 text-blue-800 p-4 rounded-lg">
                    <p className="font-medium">解説:</p>
                    <p>{quiz.explanation}</p>
                  </div>
                  <div className="md:mt-5 mt-2 text-right">
                    <Link
                      to={`https://www.google.co.jp/search?q=${quiz.search_word}`}
                      className="inline-flex items-center text-blue-500 hover:text-blue-700 transition-colors duration-200"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="md:hidden mr-2">検索</span>
                      <ExternalLink className="h-4 w-4 mr-1 md:mt-[2px]" />
                      <span className="underline hidden md:block">
                        {quiz.search_word}
                      </span>
                    </Link>
                  </div>
                </div>
              ))}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};
