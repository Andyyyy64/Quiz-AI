import { Button, Slider, InputLabel } from '@mui/material';
import { Zap } from 'lucide-react';
import { PreSingleSettingsProps } from '../../types/playType';

const categories = [
    "ランダム", "科学", "歴史", "地理", "文学", "一般常識", "数学", "工学", "心理学", "環境", "情報"
];

const difficulties = ["ランダム", "簡単", "普通", "難しい", "超難しい"];

export const PreSingleSettings: React.FC<PreSingleSettingsProps> = ({
    category, difficulty,
    setCategory,
    setDifficulty,
    setTimeLimit,
    setQuestionCount,
    timeLimit,
    questionCount,
    handleStartQuiz,
    customCategory,
    setCustomCategory,
    useCustomCategory,
    setUseCustomCategory
}) => {

    return (
        <main className="w-1/2">
            <div className=" bg-white rounded-xl shadow-xl p-8">
                <h1 className="text-3xl font-bold mb-10 text-center">クイズをカスタマイズしよう！</h1>
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">カテゴリ</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => { setCategory(cat); setUseCustomCategory(false); }}
                                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
                                        ${category === cat && !useCustomCategory
                                            ? 'bg-[#4ECDC4] text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center space-x-2 mt-5">
                            <input
                                type="checkbox"
                                id="customCategory"
                                checked={useCustomCategory}
                                onChange={(e) => setUseCustomCategory(e.target.checked)}
                                className="rounded border-gray-300 text-[#4ECDC4] focus:ring-[#4ECDC4]"
                            />
                            <label
                                htmlFor="customCategory"
                                className="text-sm font-medium text-gray-700"
                            >
                                自分でカテゴリを決める！
                            </label>
                        </div>
                        {useCustomCategory && (
                            <input
                                type="text"
                                placeholder="カスタムカテゴリを入力"
                                value={customCategory}
                                onChange={(e) => setCustomCategory(e.target.value)}
                                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md 
                                shadow-sm focus:outline-none focus:ring-1 focus:ring-[#4ECDC4] focus:border-[#4ECDC4]"
                            />
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">難易度</label>
                        <div className="flex gap-2">
                            {difficulties.map((diff) => (
                                <button
                                    key={diff}
                                    onClick={() => setDifficulty(diff)}
                                    className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors
                        ${difficulty === diff
                                            ? 'bg-[#FF6B6B] text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {diff}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 時間制限 */}
                    <div>
                        <InputLabel htmlFor="timeLimit" sx={{ fontWeight: "bold" }}>
                            時間制限: {timeLimit}s
                        </InputLabel>
                        <Slider
                            id="timeLimit"
                            min={2}
                            max={60}
                            step={5}
                            value={timeLimit}
                            onChange={(_e, newValue) => setTimeLimit(newValue as number)}
                            valueLabelDisplay="auto"
                            sx={{ color: "#FF6B6B" }}
                        />
                    </div>

                    {/* 問題数 */}
                    <div>
                        <InputLabel htmlFor="questionCount" sx={{ fontWeight: "bold" }}>
                            問題数: {questionCount}問
                        </InputLabel>
                        <Slider
                            id="questionCount"
                            min={5}
                            max={100}
                            step={1}
                            value={questionCount}
                            onChange={(_e, newValue) => setQuestionCount(newValue as number)}
                            valueLabelDisplay="auto"
                            sx={{ color: "#4ECDC4" }}
                        />
                    </div>
                </div>

                {/* 開始 */}
                <div className="mt-8">
                    <Button
                        className="w-full h-12 text-black shadow-lg hover:shadow-xl hover:scale-105 
                            hover:cursor-pointer hover:bg-[#FF8787] transition-all"
                        sx={{
                            backgroundColor: "#FF6B6B",
                            color: "white",
                            borderRadius: "9999px",
                            fontWeight: "bold",
                            fontSize: "1.2rem",
                        }}
                        onClick={handleStartQuiz}
                        startIcon={<Zap className="h-8 w-8" />}
                    >
                        開始
                    </Button>
                </div>
                <p className="mt-4 text-sm text-gray-500 text-center">
                    当サイトではAIを活用してクイズをリアルタイム生成しているため、誤った解答や偏りのある問題が含まれる場合があります。あらかじめご了承ください。
                </p>
            </div>
        </main>
    );
};
