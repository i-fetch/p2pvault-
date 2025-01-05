import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';


function Signup() {
  const navigate = useNavigate(); // React Router hook for navigation
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState(''); // State for success message

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setErrors((prevState) => ({
      ...prevState,
      [name]: '', // Clear error when user types
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate Username
    if (!formData.username) newErrors.username = 'Username is required.';
    
    // Validate Email manually
    if (!formData.email) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    // Validate Password
    if (!formData.password) newErrors.password = 'Password is required.';
    
    // Validate Confirm Password
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password.';
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      try {
        const response = await fetch(`https://p2pvaultuserbackend-production.up.railway.app/api/users/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          setSuccessMessage('Registration successful! Redirecting to login...');
          setTimeout(() => {
            navigate('/login'); // Redirect to login page after 2 seconds
          }, 7000); 
        } else {
          const errorData = await response.json();
          setErrors({ form: errorData.message });
        }
      } catch (error) {
        setErrors({ form: 'An error occurred. Please try again later.' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-stone-900 via-black to-pink-700 text-gray-100 flex flex-col">
      {/* Navigation Bar */}
      <nav className="w-full bg-black shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-white">
            P2PVault
          </Link>
        </div>
      </nav>

      {/* Signup Form Section */}
      <div className="flex justify-center items-center flex-grow px-4 py-8">
        <div className="bg-black p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-xs sm:max-w-sm">
          <h2 className="text-xl text-white text-center mb-4">Create an Account</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="text-gray-400 text-sm">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-2 mt-1 bg-white text-black border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 text-sm"
              />
              {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="text-gray-400 text-sm">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 mt-1 bg-white text-black border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 text-sm"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div className="mb-3 relative">
              <label htmlFor="password" className="text-gray-400 text-sm">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 mt-1 bg-white text-black border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 text-sm"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-3 top-8 text-gray-400 hover:text-black focus:outline-none text-sm"
                aria-label="Toggle password visibility"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="text-gray-400 text-sm">Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-2 mt-1 bg-white text-black border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 text-sm"
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-white-500 text-sm"
            >
              Sign Up
            </button>
          </form>

          {/* Success Alert */}
          {successMessage && (
            <div className="mt-4 bg-green-100 text-green-800 p-3 border border-green-300 rounded-md text-sm text-center">
              {successMessage}
            </div>
          )}
          {errors.form && (
            <div className="mt-4 bg-red-100 text-red-800 p-3 border border-red-300 rounded-md text-sm text-center">
              {errors.form}
            </div>
          )}

          <p className="mt-4 text-gray-400 text-center text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-pink-500 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="text-gray-400 text-center py-4 text-sm">
        <p>&copy; 2024 P2PVault. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default Signup;
