import React, { useState } from "react";
import { verify } from "../api/auth";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

export const VerifyEmail: React.FC = () => {
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await verify(
        localStorage.getItem("email"),
        Number(verificationCode)
      );
      setSuccess(true);
      alert(res.message);
      setTimeout(() => navigate("/login"), 3000); // 3秒後にログインページにリダイレクト
    } catch (err) {
      setError("Failed to verify. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-inherit">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Verify Email
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && (
          <p className="text-green-500 text-center mb-4">
            Verification successful! Redirecting to login...
          </p>
        )}
        {!success && (
          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label
                htmlFor="verificationCode"
                className="block text-sm font-medium text-gray-700"
              >
                Verification Code
              </label>
              <input
                id="verificationCode"
                name="verificationCode"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none 
                focus:ring-[#FF8787] focus:border-[#FF8787] sm:text-sm"
              />
            </div>
            <div>
              <button
                type="submit"
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                  bg-[#FF6B6B] hover:bg-[#FF8787] focus:outline-none focus:ring-2 focus:ring-offset-2
                  ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Verify"
                )}
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Didn't receive a code?{" "}
            <button
              className="font-medium text-[#FF6B6B] hover:text-[#FF8787]"
              onClick={() =>
                alert(
                  "Resend verification code feature is not implemented yet."
                )
              }
            >
              Resend Code
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
