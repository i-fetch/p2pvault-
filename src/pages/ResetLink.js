import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ResetPasswordPage = () => {
  const { token } = useParams(); // Get the token from the URL
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/reset-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setSuccess("Password reset successful. You can now log in with your new password.");
      } else {
        const data = await response.json();
        setError(data.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-stone-900 via-black to-pink-700 text-gray-100 flex flex-col">
      <div className="flex justify-center items-center flex-grow px-4 py-8">
        <div className="bg-black p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-xs sm:max-w-sm">
          <h2 className="text-xl text-white text-center mb-4">Reset Your Password</h2>

          {success && <p className="text-green-500 text-center mb-4">{success}</p>}
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="password" className="text-gray-400 text-sm">
                New Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 mt-1 bg-white text-black border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700 text-sm"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="text-gray-400 text-sm">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 mt-1 bg-white text-black border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700 text-sm"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-400 focus:outline-none focus:ring-2 focus:ring-white text-sm"
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
