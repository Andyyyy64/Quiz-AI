import React, { useEffect, useState } from 'react';
import { SinglePlayHistoryType } from '../../types/histroyType';
import { getSingleHistory } from '../../api/history';
import { Link } from 'react-router-dom';
import { Star, ChevronRight } from "lucide-react";

type SinglePlayerHistoryProps = {
    user_id: number;
};

const categories = [
    "ランダム", "科学", "歴史", "地理", "文学", "一般常識", "数学", "工学", "心理学", "環境", "情報"
];


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

export const SinglePlayerHistory: React.FC<SinglePlayerHistoryProps> = ({ user_id }) => {
    const [singleHistory, setSingleHistory] = useState<Array<SinglePlayHistoryType>>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const fetchSingleHistory = async () => {
            const singleRes = await getSingleHistory(user_id);
            if (Array.isArray(singleRes)) {
                setSingleHistory(singleRes.reverse());
                setTimeout(() => setIsLoaded(true), 100);
            }
        };
        fetchSingleHistory();
    }, [user_id]);

    return (
        <div className="grid grid-cols-1 gap-4">
            {singleHistory.map((history: SinglePlayHistoryType, index: number) => (
                <Link to={`/history/singleplay/${history.id}`} key={history.id}>
                    <div
                        className={`flex flex-grow items-center justify-between bg-gray-50 p-4 rounded-lg
                         hover:bg-gray-100 transition-all duration-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                         `}
                        style={{ transitionDelay: `${index * 50}ms` }}
                    >
                        <div className="flex items-center space-x-4">
                            <Star className={`h-8 w-8 ${categories.includes(history.category) ? 'text-[#4ECDC4]' : 'text-[#FF6B6B]'}`} />
                            <div>
                                <p className="font-semibold">{history.category == "" ? "ランダム" : history.category}</p>
                                <p className="text-sm text-gray-600">{formatDateToMonthDay(history.created_at)}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <p className="font-semibold">{history.correct_num}/{history.question_num}</p>
                                <p className="text-sm text-gray-600">{history.difficulty == "" ? "ランダム" : history.difficulty} • {history.duration}秒</p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};