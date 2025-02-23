import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import $ from "jquery"; // Importing jQuery

const API_URL = process.env.REACT_APP_API_URL2;

const defaultCoins = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC", image: "https://cryptologos.cc/logos/bitcoin-btc-logo.png", balance: 0.0 },
  { id: "ethereum", name: "Ethereum", symbol: "ETH", image: "https://cryptologos.cc/logos/ethereum-eth-logo.png", balance: 0.0 },
  { id: "tether", name: "Tether", symbol: "USDT", image: "https://cryptologos.cc/logos/tether-usdt-logo.png", balance: 0.0 },
  { id: "solana", name: "Solana", symbol: "SOL", image: "https://cryptologos.cc/logos/solana-sol-logo.png", balance: 0.0 },
  { id: "toncoin", name: "TON", symbol: "TON", image: "https://cryptologos.cc/logos/toncoin-ton-logo.png", balance: 0.0 },
  { id: "ripple", name: "Ripple", symbol: "XRP", image: "https://cryptologos.cc/logos/xrp-xrp-logo.png", balance: 0.0 },
];

const ActivityList = () => {
  const [coins, setCoins] = useState(defaultCoins);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBalancesAndMarketData = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in again.");
        navigate("/login");
        return;
      }

      // Fetch user balances
      $.ajax({
        url: `${API_URL}/api/users/balances`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        success: (balanceData) => {
          if (!balanceData.success) {
            setError("Failed to fetch user balances.");
            setIsLoading(false);
            return;
          }

          const userBalances = balanceData.balances;

          // Fetch market data from CoinGecko
          const coinIds = defaultCoins.map((coin) => coin.id).join(",");
          $.ajax({
            url: `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds}&order=market_cap_desc&sparkline=false`,
            method: "GET",
            success: (marketData) => {
              const updatedCoins = defaultCoins.map((coin) => {
                const marketInfo = marketData.find((data) => data.id === coin.id);
                return {
                  ...coin,
                  current_price: marketInfo?.current_price || 0.0,
                  price_change_percentage_24h: marketInfo?.price_change_percentage_24h || 0.0,
                  balance: userBalances?.[coin.id] || 0.0,
                };
              });

              setCoins(updatedCoins);
              setIsLoading(false);
            },
            error: (error) => {
              console.error("Error fetching market data:", error);
              setError("Failed to fetch market data.");
              setIsLoading(false);
            },
          });
        },
        error: (error) => {
          console.error("Error fetching user balances:", error);
          setError("Failed to load user balances.");
          setIsLoading(false);
        },
      });
    };

    fetchBalancesAndMarketData();
  }, [navigate]);

  const formatNumber = (value) => {
    const number = parseFloat(value);
    if (isNaN(number)) return "0.00";

    if (number >= 1e9) return `${(number / 1e9).toFixed(2)}B`;
    if (number >= 1e6) return `${(number / 1e6).toFixed(2)}M`;
    if (number >= 1e3) return `${(number / 1e3).toFixed(2)}K`;
    return number.toFixed(2);
  };

  const handleCoinClick = (coin) => {
    navigate(`/transaction/:type/${coin.id}`, {
      state: { coin },
    });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {defaultCoins.map((coin, index) => (
          <div
            key={index}
            className="p-4 bg-gray-800 rounded-lg shadow-md animate-pulse"
          >
            <div className="flex items-center mb-4">
              <div className="h-8 w-8 bg-gray-600 rounded-full"></div>
              <div className="ml-4 w-24 h-6 bg-gray-600 rounded"></div>
            </div>
            <div className="h-4 bg-gray-600 rounded mb-2"></div>
            <div className="h-4 bg-gray-600 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-lg font-semibold text-red-400">
          {error.includes("token") ? "Authentication error. Please log in again." : error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-stone-900 p-6 rounded-lg shadow-lg mt-10 w-full max-w-5xl mx-auto transition duration-300">
      <h3 className="text-xl font-bold mb-4 text-white">My Assets</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {coins.map((coin) => (
          <div
            key={coin.id}
            className="p-4 bg-black rounded-lg shadow-md transition hover:shadow-lg hover:scale-105 hover:bg-gray-800 cursor-pointer"
            role="button"
            tabIndex="0"
            aria-label={`View details for ${coin.name}`}
            onClick={() => handleCoinClick(coin)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <img
                  src={coin.image}
                  alt={`${coin.name} logo`}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p className="text-lg font-semibold text-white">{coin.name} ({coin.symbol.toUpperCase()})</p>
                  <p className="text-sm text-gray-400">Balance: {formatNumber(coin.balance || 0)}</p>
                  <p className="text-sm text-gray-400">Market Price: ${formatNumber(coin.current_price || 0)}</p>
                  <p
                    className={`text-sm ${coin.price_change_percentage_24h >= 0 ? "text-green-400" : "text-red-400"}`}
                  >
                    24h Change: {formatNumber(coin.price_change_percentage_24h || 0)}%
                  </p>
                </div>
              </div>
              <p className="text-lg font-bold text-white">
                ${formatNumber((coin.balance || 0) * (coin.current_price || 0))}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityList;
