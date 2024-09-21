import { Button, Slider, InputLabel } from "@mui/material";
import { Zap } from "lucide-react";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useSound } from "../../hooks/useSound";

import { useIsOnline } from "../../context/isOnlineContext";
import { useWebSocketContext } from "../../context/webSocketContext";
import { AuthContext } from "../../context/AuthContext";

import { Header } from "../Common/Header";
import { Footer } from "../Common/Footer";

const categories = [
  "ランダム",
  "科学",
  "歴史",
  "地理",
  "文学",
  "一般常識",
  "工学",
  "環境",
  "情報",
];

const difficulties = ["ランダム", "簡単", "普通", "難しい", "超難しい"];

export const CreateMatch: React.FC = () => {
  const [useCustomCategory, setUseCustomCategory] = useState(true);
  const [customCategory, setCustomCategory] = useState("");
  const [category, setCategory] = useState("ランダム");
  const [difficulty, setDifficulty] = useState("ランダム");
  const [timeLimit, setTimeLimit] = useState(30);
  const [questionCount, setQuestionCount] = useState(10);

  const navi = useNavigate();
  const intaractSound = useSound("intaract");
  const isOnline = useIsOnline();

  const authContext = useContext(AuthContext);
  if (authContext === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const { user } = authContext;
  const { ws, send } = useWebSocketContext();

  const handleCreateMatch = () => {
    intaractSound.play();
    if (ws) {
      ws.onmessage = (message) => {
        const data = JSON.parse(message.data);
        if (data.message === "create_new_custom_session" && data.sessionId) {
          navi(`/multiplay/custom/${data.sessionId}`);
        }
      };
      send({
        action: "create_custom_session",
        category: useCustomCategory ? customCategory : category,
        difficulty: difficulty,
        timeLimit: timeLimit,
        questionCount: questionCount,
        id: user?.user_id,
        name: user?.name,
        prof_image_url: user?.prof_image_url,
      });
    }
  };

  // エンターキーでクイズ開始
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" && isOnline) {
        handleCreateMatch();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOnline]);

  return (
    <div className="min-h-screen flex flex-col bg-inherit text-[#333333] relative overflow-hidden">
      <Header />
      <main className="md:w-1/2 w-full md:px-0 px-3 md:mb-16 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className=" bg-white rounded-xl shadow-xl md:px-8 md:py-6 p-5">
          <h1 className="font-bold md:text-2xl md:mb-10 mb-5 text-center text-sm">
            部屋をカスタマイズしよう!
          </h1>
          <div className="space-y-3">
            <div>
              <div className="flex items-center space-x-2 mb-5">
                <input
                  type="checkbox"
                  id="customCategory"
                  checked={useCustomCategory}
                  onChange={(e) => {
                    intaractSound.play();
                    setUseCustomCategory(e.target.checked);
                  }}
                  className="md:w-4 md:h-4 w-3 h-3 rounded border-gray-300 text-[#4ECDC4] focus:ring-[#4ECDC4]"
                />
                <label
                  htmlFor="customCategory"
                  className="md:text-base text-sm font-medium text-gray-700"
                >
                  自分でカテゴリを決める！
                </label>
              </div>
              {useCustomCategory ? (
                <input
                  type="text"
                  placeholder="カテゴリを入力"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="mb-1 w-full px-3 py-2 border border-gray-300 rounded-md
                        shadow-sm focus:outline-none focus:ring-1 focus:ring-[#4ECDC4] focus:border-[#4ECDC4]"
                />
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    おすすめカテゴリ
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          intaractSound.play();
                          setCategory(cat);
                          setUseCustomCategory(false);
                        }}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
                                        ${
                                          category === cat && !useCustomCategory
                                            ? "bg-[#4ECDC4] text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                難易度
              </label>
              <div className="flex gap-2 mb-8">
                {difficulties.map((diff) => (
                  <button
                    key={diff}
                    onClick={() => {
                      intaractSound.play();
                      setDifficulty(diff);
                    }}
                    className={`flex-1 px-2 py-1 md:px-3 md:py-2 rounded-md md:text-sm font-medium transition-colors text-[10px]
                                            ${
                                              difficulty === diff
                                                ? "bg-[#FF6B6B] text-white"
                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
            {/* 時間制限 */}
            <div className="">
              <InputLabel htmlFor="timeLimit" sx={{ fontWeight: "bold" }}>
                時間制限: {timeLimit}秒
              </InputLabel>
              <Slider
                id="timeLimit"
                min={5}
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
                max={20}
                step={1}
                value={questionCount}
                onChange={(_e, newValue) =>
                  setQuestionCount(newValue as number)
                }
                valueLabelDisplay="auto"
                sx={{ color: "#4ECDC4" }}
              />
            </div>
          </div>

          {/* 開始 */}
          <div className="mt-5">
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
              onClick={handleCreateMatch}
              startIcon={<Zap className="h-8 w-8" />}
              onKeyDown={(e) => {
                if (e.key === "enter") {
                  handleCreateMatch();
                }
              }}
            >
              開始
            </Button>
          </div>
          <p className="mt-4 md:text-sm text-[10px] text-gray-500 text-center">
            ※当サイトではAIを活用してクイズを生成しているため、誤った解答や偏りのある問題が含まれる場合があります。あらかじめご了承ください。
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};
