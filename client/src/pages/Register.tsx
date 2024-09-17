import React, { useState } from "react";
import { register } from "../api/user";
import { Link, useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

export const Register: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (password !== confirmPassword) {
      setError("パスワードが一致しません。");
      setLoading(false);
      return;
    }
    try {
      const res = await register(name, email, password);
      localStorage.setItem("email", res.user.email);
      navigate("/login");
    } catch (err) {
      setError("Failed to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-inherit">
      <div className="bg-white p-8 rounded-lg shadow-lg md:w-96 w-[95%]">
        <h2 className="text-2xl font-semibold text-center mb-6">登録</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              名前
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none 
              focus:ring-[#FF8787] focus:border-[#FF8787] sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              メールアドレス
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none 
              focus:ring-[#FF8787] focus:border-[#FF8787] sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              パスワード
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none 
              focus:ring-[#FF8787] focus:border-[#FF8787] sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-700"
            >
              パスワード確認
            </label>
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none 
              focus:ring-[#FF8787] focus:border-[#FF8787] sm:text-sm"
            />
          </div>

          <div>
            <button
              type="submit"
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                bg-[#FF6B6B] hover:bg-[#FF8787] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF8787]
                ${password !== confirmPassword
                  ? "opacity-50 cursor-not-allowed"
                  : ""
                }`}
              disabled={loading || password !== confirmPassword}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "登録"
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="md:text-sm text-xs text-gray-600">
            すでにアカウントをもっていますか?{" "}<br />
            <Link
              to="/login"
              className="font-medium text-[#FF6B6B] hover:text-[#FF8787]"
            >
              ログイン
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
