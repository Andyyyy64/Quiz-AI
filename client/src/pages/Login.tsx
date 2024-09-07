import React, { useState, useContext } from "react";
import { login } from "../api/auth";
import { Link, useNavigate } from "react-router-dom";
import { useLoading } from "../hooks/useLoading";
import { AuthContext } from "../context/AuthContext";

import CircularProgress from "@mui/material/CircularProgress";

export const Login: React.FC = () => {
  const [email, setEmail] = useState<string>(
    localStorage.getItem("email") ?? ""
  );
  const [pwd, setPwd] = useState<string>("");
  const { loading, startLoading, stopLoading } = useLoading();

  const navi = useNavigate();

  const authContext = useContext(AuthContext);
  if (authContext === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  const { setUser } = authContext;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    startLoading();
    try {
      const res = await login(email, pwd);
      localStorage.setItem("token", res.token);
      // userをcontextにセット
      setUser(res.user);
      stopLoading();
      navi("/");
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "response" in err) {
        const apiError = err as { response: any };
        alert(apiError.response.data.message);
      } else {
        alert("An error occurred.");
      }
      stopLoading();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-inherit">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
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
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none 
              focus:ring-[#FF8787] focus:border-[#FF8787] sm:text-sm"
            />
          </div>
          <div className="text-sm">
            <Link
              to="/forgot-password"
              className="font-medium text-[#FF6B6B] focus:ring-[#FF8787] focus:border-[#FF8787] text-center"
            >
              Forgot your password?
            </Link>
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
              bg-[#FF6B6B] hover:bg-[#FF8787] focus:outline-none focus:ring-2 focus:ring-offset-2"
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Sign in"
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-[#FF6B6B] focus:ring-[#FF8787] focus:border-[#FF8787]"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
