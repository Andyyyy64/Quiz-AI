import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Header } from '../components/Common/Header';
import { Footer } from '../components/Common/Footer';
import { SinglePlayerHistory } from '../components/History/SinglePlayerHistory';
import { MultiPlayerHistory } from '../components/History/MultiPlayerHistory';
import { Users, User } from "lucide-react";

export const History: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'singleplayer' | 'multiplayer'>('singleplayer');

    const authContext = useContext(AuthContext);
    if (authContext === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    const { user } = authContext;

    return (
        <div className="min-h-screen flex flex-col relative bg-inherit overflow-hidden">
            <Header />
            <main className="container mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold mb-8 text-center">クイズの履歴</h1>

                <div className="bg-white rounded-xl shadow-xl p-6 max-w-3xl mx-auto">
                    <div className="flex mb-6">
                        <button
                            onClick={() => setActiveTab('multiplayer')}
                            className={`flex-1 py-2 px-4 text-center rounded-l-md flex items-center justify-center ${activeTab === 'multiplayer'
                                ? 'bg-[#4ECDC4] text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            <Users className="mr-2 h-4 w-4" />
                            マルチプレイ
                        </button>
                        <button
                            onClick={() => setActiveTab('singleplayer')}
                            className={`flex-1 py-2 px-4 text-center rounded-r-md flex items-center justify-center ${activeTab === 'singleplayer'
                                ? 'bg-[#4ECDC4] text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            <User className="mr-2 h-4 w-4" />
                            シングルプレイ
                        </button>
                    </div>

                    {user && activeTab === 'singleplayer' && <SinglePlayerHistory user_id={user.user_id} />}
                    {user && activeTab === 'multiplayer' && <MultiPlayerHistory user_id={user.user_id} />}
                </div>
            </main>
            <Footer />
        </div>
    );
};
