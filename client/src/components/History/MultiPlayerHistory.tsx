import React, { useEffect, useState } from 'react';
import { MultiPlayHistoryType } from '../../types/histroyType';
import { getMultiHistory } from '../../api/history';
import { Link } from 'react-router-dom';
import { ChevronRight, Trophy, Medal } from "lucide-react";

type MultiPlayerHistoryProps = {
    user_id: number;
};

export const MultiPlayerHistory: React.FC<MultiPlayerHistoryProps> = ({ user_id }) => {
    const [multiHistory, setMultiHistory] = useState<Array<MultiPlayHistoryType>>([]);

    useEffect(() => {
        const fetchMultiHistory = async () => {
            const multiRes = await getMultiHistory(user_id);
            console.log(multiRes);
            if (Array.isArray(multiRes)) {
                setMultiHistory(multiRes); // Directly set the array
            }
        };
        fetchMultiHistory();
    }, [user_id]);
    

    return (
        <div className="grid grid-cols-1 gap-4">
            {multiHistory.length > 0 && multiHistory.map((battle: MultiPlayHistoryType) => (
                <Link to={`/history/multiplay/${battle.session_id}`} key={battle.session_id}>
                    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-4">
                            {battle.who_win === user_id ? (
                                <Trophy className="h-8 w-8 text-[#FFD93D]" />
                            ) : (
                                <Medal className="h-8 w-8 text-[#FF6B6B]" />
                            )}
                            <div>
                                <p className="font-semibold">{battle.opponent_name}</p>
                                <p className="text-sm text-gray-600">{ }</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <p className="font-semibold">+{battle.points_awarded}ポイント</p>
                                <p className="text-sm text-gray-600">{battle.who_win === user_id ? '勝利' : '敗北'}</p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};
