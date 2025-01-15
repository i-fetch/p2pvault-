import React, { useContext, useEffect, useState } from "react";
import { coindatacontext } from "../context/coindatacontext";

const BalanceCard = () => {
  const { coins, isLoading, error, fetchBalancesAndMarketData } = useContext(coindatacontext);
  const [totalBalance, setTotalBalance] = useState(0);

  useEffect(() => {
    fetchBalancesAndMarketData();
  }, [fetchBalancesAndMarketData]);

  useEffect(() => {
    const calculateTotalBalance = () => {
      const total = coins.reduce((sum, coin) => {
        return sum + (coin.balance || 0) * (coin.current_price || 0);
      }, 0);
      setTotalBalance(total);
    };

    if (!isLoading && coins.length > 0) {
      calculateTotalBalance();
    }
  }, [coins, isLoading]);

  const formatNumber = (value) => {
    const number = parseFloat(value);
    return isNaN(number) ? "0.00" : number.toFixed(2);
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-800 rounded-lg shadow-md animate-pulse">
        <div className="h-6 w-32 bg-gray-600 rounded mb-4"></div>
        <div className="h-8 w-48 bg-gray-600 rounded"></div>
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
    <div className="p-6 bg-stone-900 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold text-white mb-4">Total Balance</h3>
      <p className="text-3xl font-semibold text-green-400 mb-6">
        ${formatNumber(totalBalance)}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {coins.map((coin) => (
          <div
            key={coin.id}
            className="p-4 bg-black rounded-lg shadow-md"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <img
                  src={coin.image}
                  alt={`${coin.name} logo`}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p className="text-lg font-semibold text-white">
                    {coin.name} ({coin.symbol.toUpperCase()})
                  </p>
                  <p className="text-sm text-gray-400">
                    Balance: {formatNumber(coin.balance || 0)}
                  </p>
                  <p className="text-sm text-gray-400">
                    Market Price: ${formatNumber(coin.current_price || 0)}
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

export default BalanceCard;
