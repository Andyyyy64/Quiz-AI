import React, { useEffect, useState } from 'react';
import { MultiPlayHistoryType } from '../../types/histroyType';
import { getMultiHistory } from '../../api/history';
import { Link } from 'react-router-dom';
import { ChevronRight, Trophy, Medal } from "lucide-react";
import { useLoading } from '../../hooks/useLoading';

type MultiPlayerHistoryProps = {
    user_id: number;
};

// 日付を "MM/DD" 形式にフォーマットする関数（Date型かISO 8601文字列を受け取る）
const formatDateToMonthDay = (dateInput: string | Date): string => {
    const date = new Date(dateInput); // 文字列の場合はDate型に変換
    if (isNaN(date.getTime())) {
        return "Invalid Date"; // 無効な日付の場合のフォールバック
    }
    const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Tokyo',
        month: 'numeric',
        day: 'numeric',
    };
    return new Intl.DateTimeFormat('ja-JP', options).format(date);
};

export const MultiPlayerHistory: React.FC<MultiPlayerHistoryProps> = ({ user_id }) => {
    const [multiHistory, setMultiHistory] = useState<Array<MultiPlayHistoryType>>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const { loading, startLoading, stopLoading } = useLoading();

    useEffect(() => {
        const fetchMultiHistory = async () => {
            startLoading();
            try {
                const multiRes = await getMultiHistory(user_id);
                if (Array.isArray(multiRes)) {
                    setMultiHistory(multiRes.reverse());
                    setTimeout(() => setIsLoaded(true), 100);
                }
            } catch (err) {
                console.log(err);
            } finally {
                stopLoading();
            }
        };
        fetchMultiHistory();
    }, [user_id]);

    return (
        <>
            {
                loading ? (
                    <div className="animate-pulse space-y-4">
                        {[...Array(5)].map((_, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-gray-300 h-8 w-8 rounded-full"></div>
                                    <div>
                                        <div className="bg-gray-300 h-4 w-32 rounded mb-2"></div>
                                        <div className="bg-gray-300 h-3 w-24 rounded"></div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="text-right">
                                        <div className="bg-gray-300 h-4 w-24 rounded mb-2 hidden md:block"></div>
                                        <div className="bg-gray-300 h-3 w-16 rounded"></div>
                                    </div>
                                    <div className="bg-gray-300 h-5 w-5 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {multiHistory.map((battle: MultiPlayHistoryType, index: number) => (
                            <Link to={`/history/multiplay/${battle.session_id}`} key={battle.session_id}>
                                <div
                                    className={`flex items-center justify-between bg-gray-50 p-4 rounded-lg 
                hover:bg-gray-100 transition-all duration-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                                    style={{ transitionDelay: `${index * 50}ms` }}
                                >
                                    <div className="flex items-center space-x-4">
                                        {battle.who_win === user_id ? (
                                            <Trophy className="h-8 w-8 text-[#FFD93D]" />
                                        ) : (
                                            <Medal className="h-8 w-8 text-[#FF6B6B]" />
                                        )}
                                        <div>
                                            <p className="font-semibold">{battle.opponent_name}</p>
                                            <p className="text-sm text-gray-600">{formatDateToMonthDay(battle.created_at)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="text-right">
                                            <p className="font-semibold hidden md:block">+{battle.points_awarded}ポイント</p>
                                            <p className="text-sm text-gray-600">{battle.who_win === user_id ? '勝利' : '敗北'}</p>
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-gray-400" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )
            }
        </>
    );
};