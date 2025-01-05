import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";


function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setErrors((prevState) => ({
      ...prevState,
      [name]: "",
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.username) {
      newErrors.username = "Username is required.";
    }
    if (!formData.password) {
      newErrors.password = "Password is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setIsLoading(true);
      try {
        const response = await fetch(`https://p2pvaultuserbackend-production.up.railway.app/api/users/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        console.log("API response:", response); // Debugging API response

        if (response.ok) {
          const data = await response.json();
          console.log("Login successful:", data); // Debugging login success
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify({ username: data.username, email: data.email }));
          setTimeout(() => {
            setIsLoading(false);
            navigate("/dashboard");
          }, 1000);
        } else {
          const errorData = await response.json();
          console.log("Error data:", errorData); // Debugging error response
          if (response.status === 401) {
            setErrors({ form: "Invalid credentials. Please try again." });
          } else {
            setErrors({ form: errorData.message || "An error occurred. Please try again later." });
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error during login:", error);
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
          <h2 className="text-xl text-white text-center mb-4">Login to Your Account</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="text-gray-400 text-sm">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-2 mt-1 bg-white text-black border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700 text-sm"
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">{errors.username}</p>
              )}
            </div>
            <div className="mb-4 relative">
              <label htmlFor="password" className="text-gray-400 text-sm">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 mt-1 bg-white text-black border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700 text-sm"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-3 top-8 text-gray-700 hover:text-black focus:outline-none text-sm"
                aria-label="Toggle password visibility"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-400 focus:outline-none focus:ring-2 focus:ring-white text-sm"
            >
              Login
            </button>
          </form>

          {errors.form && (
            <div className="mt-4 bg-red-100 text-red-800 p-3 border border-red-300 rounded-md text-sm text-center">
              {errors.form}
            </div>
          )}

          <p className="mt-4 text-gray-400 text-center text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-pink-500 hover:underline">
              Sign Up
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

export default LoginPage;
