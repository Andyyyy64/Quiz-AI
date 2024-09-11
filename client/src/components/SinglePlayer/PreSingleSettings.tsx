import { Button, MenuItem, Select, Slider, InputLabel, FormControl } from '@mui/material';
import { Zap } from 'lucide-react';
import { PreSingleSettingsProps } from '../../types/playType';

const categories = [
    "ランダム", "科学", "歴史", "地理", "文学", "映画", "音楽", "スポーツ"
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
    handleStartQuiz
}) => {

    return (
        <main className="w-1/2">
            <div className=" bg-white rounded-xl shadow-xl p-8">
                <h1 className="text-3xl font-bold mb-10 text-center">クイズをカスタマイズしよう！</h1>
                <div className="space-y-6">
                    {/* カテゴリ*/}
                    <FormControl fullWidth>
                        <p className='font-bold'>カテゴリ</p>
                        <Select
                            labelId="category-label"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            placeholder='カテゴリ'
                            sx={{ height: 48, borderRadius: "10px" }}
                            defaultValue='ランダム'
                        >
                            {categories.map((cat) => (
                                <MenuItem key={cat} value={cat}
                                    sx={{ fontWeight: "bold", margin: 1, color: "#4ECDC4" }}
                                >
                                    {cat}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* 難易度 */}
                    <FormControl fullWidth>
                        <p className='font-bold'>難易度</p>
                        <Select
                            labelId="difficulty-label"
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
                            sx={{ height: 48, borderRadius: "10px" }}                                                    
                            defaultValue='ランダム'
                        >
                            {difficulties.map((diff) => (
                                <MenuItem key={diff} value={diff}
                                    sx={{ fontWeight: "bold", margin: 1, color: "#FF6B6B" }}
                                >
                                    {diff}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* 時間制限 */}
                    <div>
                        <InputLabel htmlFor="timeLimit" sx={{ fontWeight: "bold" }}>
                            時間制限: {timeLimit}s
                        </InputLabel>
                        <Slider
                            id="timeLimit"
                            min={3}
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
                            min={2}
                            max={20}
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
            </div>
        </main>
    );
};
