import React, { useState, useEffect, useContext } from "react";

import { updateUser, getUserRankingById } from "../api/user";

import { AuthContext } from "../context/AuthContext";
import { useLoading } from "../hooks/useLoading";

import { Header } from "../components/Common/Header";
import { Footer } from "../components/Common/Footer";

import { getUserById, handleFileUpload } from "../api/user";
import { Loader2, ArrowLeft } from "lucide-react";
import { useSound } from "../hooks/useSound";
import { useNavigate } from "react-router-dom";

export const Profile: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [profImageUrl, setProfImageUrl] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [ranking, setRanking] = useState<number>(0);

  const authcontext = useContext(AuthContext);
  if (authcontext === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  const { user, setUser } = authcontext;

  const navi = useNavigate();
  const { loading, startLoading, stopLoading } = useLoading();
  const intaractSound = useSound("intaract");

  useEffect(() => {
    const fetchUser = async () => {
      if (user && user.user_id) {
        const updatedUser = await getUserById(user.user_id); // 最新のユーザー情報を取得
        setUser(updatedUser.user); // コンテキストに保存
      }
    };
    const fetchRanking = async () => {
      startLoading();
      if (user && user.user_id) {
        try {
          const res = await getUserRankingById(user.user_id);
          setRanking(res.userRanking);
        } catch (err) {
          console.log(err);
        } finally {
          stopLoading();
        }
      }
    };

    fetchUser();
    fetchRanking();
  }, []); // 空の依存配列でリロード時のみ実行

  useEffect(() => {
    if (user) {
      setName(user.name);
      setProfImageUrl(user.prof_image_url);
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    intaractSound.play();
    try {
      startLoading();
      let updatedImageUrl = profImageUrl;

      // 画像ファイルが選択された場合、GCPにアップロード
      if (selectedFile) {
        const uploadedUrl = await handleFileUpload(selectedFile);
        if (uploadedUrl) updatedImageUrl = uploadedUrl;
      }

      if (user) {
        const res = await updateUser(user.user_id, name, updatedImageUrl); // データベースの更新
        const updatedUser = {
          ...user,
          name: res.user.name,
          prof_image_url: res.user.prof_image_url,
        };
        setUser(updatedUser);
        setIsEditing(false);
        alert("プロフィールを更新しました");
      }
    } catch (err) {
      console.log(err);
      alert("プロフィールの更新に失敗しました");
    } finally {
      stopLoading();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    intaractSound.play();
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setProfImageUrl(URL.createObjectURL(e.target.files[0])); // 選択した画像をプレビュー
    }
  };

  const handleBack = () => {
    intaractSound.play();
    navi("/");
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-inherit">
      <Header />
      <div
        className="w-[80%] flex-grow flex flex-col items-center justify-center bg-white rounded-xl
                   shadow-xl p-5 max-w-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        <div className="flex items-center justify-center md:mb-4">
          <button
            onClick={handleBack}
            className="mr-1 p-2 rounded-full hover:bg-gray-200 transition-colors duration-200"
            aria-label="戻る"
          >
            <ArrowLeft className="h-8 w-8 text-black hidden md:block" />
          </button>
          <h1 className="text-3xl font-bold hidden md:block">
            プロフィール
          </h1>
        </div>
        {loading ? (
          <Loader2 className="animate-spin text-[#FF6B6B]" />
        ) : (
          <div className="relative">
            <img
              className="md:w-40 md:h-40 w-32 h-32 rounded-full object-cover border-2 border-[#4ECDC4]"
              src={profImageUrl}
              alt={name}
            />
          </div>
        )}
        <div className="mt-4 flex items-center">
          <h2 className="text-2xl font-bold">{name}</h2>
        </div>
        {isEditing ? (
          <div className="w-full max-w-md">
            <input
              type="text"
              placeholder="名前"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4 mt-4"
            />
            <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded mb-4">
              <label className="cursor-pointer">
                画像を変更
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </button>
            <div className="flex space-x-4">
              <button
                onClick={handleUpdateProfile}
                className="bg-[#FF6B6B] hover:bg-[#FF8787] text-white px-4 py-2 rounded"
              >
                保存
              </button>
              <button
                onClick={() => {
                  intaractSound.play();
                  setIsEditing(false);
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                キャンセル
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 mt-5">
            <div>
              <label className="block text-sm font-medium text-[#666666]">
                メールアドレス
              </label>
              <p className="text-lg">{user?.email}</p>
            </div>
            <div>
              {loading ? (
                <Loader2 className="animate-spin text-[#FF6B6B]" />
              ) : (
                <div>
                  <label className="block text-sm font-medium text-[#666666]">
                    ランキング
                    <p className="text-lg font-semibold text-[#FF6B6B]">
                      {ranking}位
                    </p>
                  </label>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#666666]">
                ポイント
              </label>
              <p className="text-lg font-semibold text-[#4ECDC4]">
                {user?.points}
              </p>
            </div>
            <button
              onClick={() => {
                intaractSound.play();
                setIsEditing(true);
              }}
              className="w-full mt-4 bg-[#FF6B6B] hover:bg-[#FF8787] text-white px-4 py-2 rounded"
            >
              プロフィール編集
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};
