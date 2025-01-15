import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL2;
const CMC_API_KEY = process.env.REACT_APP_CMC_API_KEY;

const defaultCoins = [
  { id: "1", name: "Bitcoin", symbol: "BTC", balance: 0.0 },
  { id: "1027", name: "Ethereum", symbol: "ETH", balance: 0.0 },
  { id: "825", name: "Tether", symbol: "USDT", balance: 0.0 },
  { id: "5426", name: "Solana", symbol: "SOL", balance: 0.0 },
  { id: "11419", name: "TON", symbol: "TON", balance: 0.0 },
  { id: "52", name: "Ripple", symbol: "XRP", balance: 0.0 },
];

const ActivityList = () => {
  const [coins, setCoins] = useState(defaultCoins);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBalancesAndMarketData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found. Please log in again.");
          navigate("/login");
          return;
        }

        // Fetch user balances
        const balanceResponse = await axios.get(`${API_URL}/api/users/balances`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const balanceData = balanceResponse.data;
        if (!balanceData.success) {
          throw new Error(balanceData.message || "Failed to fetch user balances.");
        }

        const userBalances = balanceData.balances;

        // Fetch market data from CoinMarketCap
        const coinIds = defaultCoins.map((coin) => coin.id).join(",");
        const marketResponse = await axios.get(
          `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?id=${coinIds}`,
          {
            headers: {
              "X-CMC_PRO_API_KEY": CMC_API_KEY,
            },
          }
        );

        const marketData = marketResponse.data.data;

        // Merge user balances with market data
        const updatedCoins = defaultCoins.map((coin) => {
          const marketInfo = marketData[coin.id];
          return {
            ...coin,
            current_price: marketInfo?.quote?.USD?.price || 0.0,
            price_change_percentage_24h: marketInfo?.quote?.USD?.percent_change_24h || 0.0,
            balance: userBalances?.[coin.symbol] || 0.0,
          };
        });

        setCoins(updatedCoins);
      } catch (error) {
        console.error("Error fetching data:", error.message);
        setError("Failed to load data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalancesAndMarketData();
  }, [navigate]);

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
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div>
      <h3>My Assets</h3>
      <div>
        {coins.map((coin) => (
          <div key={coin.id} onClick={() => handleCoinClick(coin)}>
            <p>{coin.name}</p>
            <p>Balance: {formatNumber(coin.balance || 0)}</p>
            <p>Market Price: ${formatNumber(coin.current_price || 0)}</p>
            <p>
              24h Change:{" "}
              {formatNumber(coin.price_change_percentage_24h || 0)}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityList;
