import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import myImage from "../assets/info-img.PNG";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import TawkToChat from "./Tawkto"; // Import the TawkToChat component

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cryptoData, setCryptoData] = useState([]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    // Fetch cryptocurrency data
    const fetchCryptoData = async () => {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets",
          {
            params: {
              vs_currency: "usd",
              order: "market_cap_desc",
              per_page: 10,
              page: 1,
            },
          }
        );
        setCryptoData(response.data);
      } catch (error) {
        console.error("Error fetching cryptocurrency data:", error);
      }
    };

    fetchCryptoData();
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-stone-900 via-black to-pink-700 text-gray-100 flex flex-col overflow-x-hidden">
      {/* Navigation Bar */}
      <nav className="w-full bg-black shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center relative">
          <h1 className="text-2xl font-bold text-white">P2PVault</h1>
          <button
            className="text-white md:hidden"
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 7.5h16.5M3.75 12h16.5M3.75 16.5h16.5"
              />
            </svg>
          </button>
          <ul
            className={`${
              isMenuOpen ? "block" : "hidden"
            } md:flex md:space-x-6 absolute md:static top-16 left-0 w-full bg-black md:bg-transparent md:w-auto md:top-0 transition duration-300 z-50`}
          >
            <li className="border-b md:border-none">
              <Link
                to="/"
                className="block text-gray-300 hover:text-white py-2 px-4 transition duration-300"
                aria-label="Go to Home page"
              >
                Home
              </Link>
            </li>
            <li className="border-b md:border-none">
              <Link
                to="/about"
                className="block text-gray-300 hover:text-white py-2 px-4 transition duration-300"
                aria-label="Go to About page"
              >
                About
              </Link>
            </li>
            <li className="border-b md:border-none">
              <Link
                to="/signup"
                className="block text-gray-300 hover:text-white hover:bg-pink-700 py-2 px-4 rounded-lg border border-gray-600 transition duration-300"
                aria-label="Go to Signup page"
              >
                Signup
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                className="block text-gray-300 hover:text-white py-2 px-4 rounded-lg border border-gray-600 transition duration-300"
                aria-label="Go to Login page"
              >
                Login
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      {/* Main Content */}
      <div className="flex flex-col md:flex-row items-center justify-center flex-grow px-4 py-8 space-y-8 md:space-y-0 md:space-x-8">
        <div className="flex-shrink-0">
          <img
            src={myImage}
            alt="Wallet management illustration"
            className="w-full max-w-md rounded-lg shadow-lg transform hover:scale-105 transition duration-500 ease-in-out"
          />
        </div>

        <div className="text-center md:text-left max-w-lg">
          <h1 className="text-4xl font-bold mb-4 text-white">
            Welcome to P2PVault
          </h1>
          <p className="text-lg mb-6 text-gray-300">
            The best platform to manage and track your cryptocurrency portfolio.
            Discover the future of decentralized finance today.
          </p>
          <Link
            to="/signup"
            className="inline-block py-3 px-6 bg-black text-white font-semibold rounded-lg shadow-md hover:bg-pink-700 transition duration-300 transform hover:scale-105"
            aria-label="Get started with P2PVault"
          >
            Get Started
          </Link>
        </div>
      </div>
      {/* Cryptocurrency Carousel */}
      <div className="px-4 py-8 overflow-hidden">
        <Slider {...sliderSettings}>
          {cryptoData.map((crypto) => (
            <div
              key={crypto.id}
              className="text-center p-2 flex flex-col items-center justify-center border border-white"
            >
              <img
                src={crypto.image}
                alt={crypto.name}
                className="w-10 h-10 mx-auto mb-1"
              />
              <h3 className="text-sm font-bold text-white">{crypto.name}</h3>
              <p className="text-gray-400 text-xs">
                {crypto.symbol.toUpperCase()}
              </p>
              <p className="text-pink-500 text-sm">${crypto.current_price}</p>
              <p
                className={`text-xs font-semibold ${
                  crypto.price_change_percentage_24h > 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {crypto.price_change_percentage_24h > 0 ? "▲" : "▼"}{" "}
                {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
              </p>
            </div>
          ))}
        </Slider>
      </div>
      {/* Footer Section */}
      <footer className="text-gray-400 text-center py-4">
        <p>&copy; 2024 P2PVault. All Rights Reserved.</p>
      </footer>
      {/* Add TawkToChat component */}
      <TawkToChat /> {/* This will load the chat widget */}
    </div>
  );
};

export default HomePage;
