import React, { useState, useEffect, useContext } from "react";

import { updateUser } from "../api/user";

import { AuthContext } from "../context/AuthContext";
import { useLoading } from "../hooks/useLoading";

import { Header } from "../components/Common/Header";
import { Footer } from "../components/Common/Footer";

import { getUserById, handleFileUpload } from "../api/user";

export const Profile: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [profImageUrl, setProfImageUrl] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const authcontext = useContext(AuthContext);
  if (authcontext === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  const { user, setUser } = authcontext;

  const { loading, startLoading, stopLoading } = useLoading();

  useEffect(() => {
    const fetchUser = async () => {
      if (user && user.user_id) {
        const updatedUser = await getUserById(user.user_id); // 最新のユーザー情報を取得
        setUser(updatedUser.user); // コンテキストに保存
      }
    };

    fetchUser();
  }, []); // 空の依存配列でリロード時のみ実行

  useEffect(() => {
    if (user) {
      setName(user.name);
      setProfImageUrl(user.prof_image_url);
    }
  }, [user]);

  const handleUpdateProfile = async () => {
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
        console.log(res);
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
      console.log(user);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setProfImageUrl(URL.createObjectURL(e.target.files[0])); // 選択した画像をプレビュー
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col relative">
      <Header />
      <div className="flex-grow flex flex-col items-center justify-center p-4 absolute top-96 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <h1 className="text-3xl font-bold mb-10">プロフィール</h1>
        {loading ? (
          <div className="flex items-center justify-center h-32 w-32">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <img
            className="w-60 h-60 rounded-full mb-4"
            src={user?.prof_image_url}
            alt={name}
          />
        )}

        {isEditing ? (
          <div className="w-full max-w-md">
            <input
              type="text"
              placeholder="名前"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4"
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
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                保存
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                キャンセル
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-xl font-semibold">名前: {user?.name}</p>
            <p className="text-lg">Email: {user?.email}</p>
            <p className="text-lg">ランク: {user?.rank}</p>
            <p className="text-lg">ポイント: {user?.points}</p>
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
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
