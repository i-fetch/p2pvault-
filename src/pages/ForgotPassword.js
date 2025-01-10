import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";
const API_URL = process.env.REACT_APP_API_URL2;

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/users/forgot-password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Password reset email sent:", data);
          setIsLoading(false);
          navigate("/login"); // Redirect to login after successful email submission
        } else {
          const errorData = await response.json();
          setErrors({ form: errorData.message || "An error occurred. Please try again later." });
          setIsLoading(false);
        }
      } catch (error) {
        setErrors({ form: "An error occurred. Please try again later." });
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-stone-900 via-black to-pink-700 text-gray-100 flex flex-col">
      {isLoading && <LoadingScreen />}
      <nav className="w-full bg-black shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-white">
            P2PVault
          </Link>
        </div>
      </nav>

      <div className="flex justify-center items-center flex-grow px-4 py-8">
        <div className="bg-black p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-xs sm:max-w-sm">
          <h2 className="text-xl text-white text-center mb-4">Forgot Your Password?</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="text-gray-400 text-sm">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
                className="w-full p-2 mt-1 bg-white text-black border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700 text-sm"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-400 focus:outline-none focus:ring-2 focus:ring-white text-sm"
            >
              Submit
            </button>
          </form>

          {errors.form && (
            <div className="mt-4 bg-red-100 text-red-800 p-3 border border-red-300 rounded-md text-sm text-center">
              {errors.form}
            </div>
          )}

          <p className="mt-4 text-gray-400 text-center text-sm">
            Remembered your password?{" "}
            <Link to="/login" className="text-pink-500 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>

      <footer className="text-gray-400 text-center py-4 text-sm">
        <p>&copy; 2024 P2PVault. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default ForgotPasswordPage;
