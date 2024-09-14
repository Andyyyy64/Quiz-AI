import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { SinglePlayHistoryType } from '../../types/histroyType';
import { JoinedQuizType } from '../../types/quizType';
import { Clock, CheckCircle, XCircle, Book, BarChart2, Tag, Star, ExternalLink } from "lucide-react"
import { Link } from 'react-router-dom';

import { getSingleQuizHistory, getSingleHistoryById } from '../../api/history';
import { Header } from '../Common/Header';
import { Footer } from '../Common/Footer';

export const SingleHistoryDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [history, setHistory] = useState<SinglePlayHistoryType | null>(null);
    const [quizHistory, setQuizHistory] = useState<Array<JoinedQuizType>>([]);

    // シングルプレイの履歴とクイズを取得
    useEffect(() => {
        const fetchHistory = async () => {
            const history = await getSingleHistoryById(Number(id));            
            setHistory(history);
        }

        const fetchQuizHistory = async () => {
            const quizHistory = await getSingleQuizHistory(Number(id));
            setQuizHistory(quizHistory);
        }

        fetchHistory();
        fetchQuizHistory();
    }, [id]);
    
    const percentageCorrect = history && ((history.correct_num / history.question_num) * 100)

    return (
        <div className="min-h-screen flex flex-col relative bg-inherit overflow-hidden">
            <Header />
            <main className="container mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold mb-8 text-center">シングルプレイ履歴詳細</h1>
                {
                    history && (
                        <div className="bg-white rounded-xl p-6 mb-8"
                            style={{
                                boxShadow: '0 10px 20px 0px rgba(0, 0, 0, 0.1), 0 0px 20px 0px rgba(0, 0, 0, 0.1)'
                            }}
                        >
                            <h2 className="text-xl font-semibold mb-4">クイズサマリー</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                <div className="flex flex-col items-center">
                                    <Clock className="h-8 w-8 text-[#4ECDC4] mb-2" />
                                    <p className="text-sm font-medium">ゲーム時間</p>
                                    <p className="text-lg font-bold">{Math.floor(history.duration / 60)}:{(history.duration % 60).toString().padStart(2, '0')}</p>
                                </div>
                                <div className="flex flex-col items-center">
                                    <CheckCircle className="h-8 w-8 text-[#FFD93D] mb-2" />
                                    <p className="text-sm font-medium">正解数</p>
                                    <p className="text-lg font-bold">{history.correct_num} / {history.question_num}</p>
                                </div>
                                <div className="flex flex-col items-center">
                                    <BarChart2 className="h-8 w-8 text-[#FF6B6B] mb-2" />
                                    <p className="text-sm font-medium">精度</p>
                                    <p className="text-lg font-bold">{percentageCorrect && percentageCorrect.toFixed(1)}%</p>
                                </div>
                                <div className="flex flex-col items-center">
                                    <Tag className="h-8 w-8 text-[#4ECDC4] mb-2" />
                                    <p className="text-sm font-medium">カテゴリ</p>
                                    <p className="text-lg font-bold">{history.category == "" ? "ランダム" : history.category}</p>
                                </div>
                                <div className="flex flex-col items-center">
                                    <Star className="h-8 w-8 text-[#FFD93D] mb-2" />
                                    <p className="text-sm font-medium">難易度</p>
                                    <p className="text-lg font-bold">{history.difficulty == "" ? "ランダム" : history.difficulty}</p>
                                </div>
                                <div className="flex flex-col items-center">
                                    <Book className="h-8 w-8 text-[#FF6B6B] mb-2" />
                                    <p className="text-sm font-medium">問題数</p>
                                    <p className="text-lg font-bold">{history.question_num}</p>
                                </div>
                            </div>
                        </div>
                    )

                }
                {
                    quizHistory.length !== 0 && quizHistory.map((quiz, index) => (
                        <div key={quiz.quiz_id}
                            style={{
                                boxShadow: '0 10px 20px 0px rgba(0, 0, 0, 0.1), 0 0px 20px 0px rgba(0, 0, 0, 0.1)'
                            }}
                            className="bg-white rounded-xl p-6 mb-8"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className={`text-2xl font-bold`}>問題 {index + 1}</h3>
                                <span className={`text-sm ${quiz.is_correct ? 'text-green-500' : 'text-red-500'} flex items-center`}>
                                    {quiz.is_correct ? (
                                        <CheckCircle className="h-5 w-5 mr-1" />
                                    ) : (
                                        <XCircle className="h-5 w-5 mr-1" />
                                    )}
                                    {quiz.is_correct ? '正解' : '不正解'}
                                </span>
                            </div>
                            <p className="font-medium mb-4">{quiz.question}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                {quiz.choices.map((choice, choiceIndex) => (
                                    <div
                                        key={choiceIndex}
                                        className={`p-3 rounded-lg flex items-center justify-between ${choice === quiz.correct_answer
                                            ? 'bg-green-100 text-green-800 border-2 border-green-500'
                                            : choice === quiz.user_choices && !quiz.is_correct
                                                ? 'bg-red-100 text-red-800 border-2 border-red-500'
                                                : choice === quiz.user_choices
                                                    ? 'bg-green-100 text-green-800 border-2 border-green-500'
                                                    : 'bg-gray-100'
                                            }`}
                                    >
                                        <span>{choice}</span>
                                        {choice === quiz.correct_answer && <CheckCircle className="h-5 w-5 text-green-600" />}
                                        {choice === quiz.user_choices && !quiz.is_correct && <XCircle className="h-5 w-5 text-red-600" />}
                                    </div>
                                ))}
                            </div>
                            <div className="bg-blue-100 text-blue-800 p-4 rounded-lg">
                                <p className="font-medium">解説:</p>
                                <p>{quiz.explanation}</p>
                            </div>
                            <div className='mt-5 text-right'>
                                <Link
                                    to={`https://www.google.co.jp/search?q=${quiz.search_word}`}
                                    className='inline-flex items-center text-blue-500 hover:text-blue-700 transition-colors duration-200'
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <ExternalLink className="h-4 w-4 mr-1 mt-[2px]" />
                                    <span className="underline">{quiz.search_word}</span>
                                </Link>
                            </div>
                        </div>
                    ))
                }
                { }
            </main>
            <Footer />
        </div>
    )
}
