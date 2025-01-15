import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CoinDataContext } from "../context/coindatacontext";

const ActivityList = () => {
  const { coins, isLoading, error, fetchBalancesAndMarketData } = useContext(CoinDataContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBalancesAndMarketData();
  }, [fetchBalancesAndMarketData]);

  const formatNumber = (value) => {
    const number = parseFloat(value);
    return isNaN(number) ? "0.00" : number.toFixed(2);
  };

  const handleCoinClick = (coin) => {
    navigate(`/transaction/:type/${coin.id}`, {
      state: { coin },
    });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {coins.map((coin, index) => (
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
