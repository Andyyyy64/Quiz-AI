import React, { useEffect, useState } from 'react';
import { SinglePlayHistoryType } from '../../types/histroyType';
import { getSingleHistory } from '../../api/history';
import { Link } from 'react-router-dom';
import { Star, ChevronRight } from "lucide-react";

type SinglePlayerHistoryProps = {
    user_id: number;
};

export const SinglePlayerHistory: React.FC<SinglePlayerHistoryProps> = ({ user_id }) => {
    const [singleHistory, setSingleHistory] = useState<Array<SinglePlayHistoryType>>([]);

    useEffect(() => {
        const fetchSingleHistory = async () => {
            const singleRes = await getSingleHistory(user_id);
            if (Array.isArray(singleRes)) {
                setSingleHistory(singleRes);
            }
        };
        fetchSingleHistory();
    }, [user_id]);    

    return (
        <div className="grid grid-cols-1 gap-4">
            {singleHistory.length > 0 && singleHistory.map((history: SinglePlayHistoryType) => (
                <Link to={`/history/singleplay/${history.id}`} key={history.id}>
                    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg
                     hover:bg-gray-100 transition-colors"
                    >
                        <div className="flex items-center space-x-4">
                            <Star className="h-8 w-8 text-[#4ECDC4]" />
                            <div>
                                <p className="font-semibold">{history.category}</p>
                                <p className="text-sm text-gray-600">日にち{ }</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <p className="font-semibold">正解数 {history.correct_num}/{history.question_num}</p>
                                <p className="text-sm text-gray-600">{history.difficulty} • {history.duration}秒</p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};
