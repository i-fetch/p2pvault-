// src/context/CoinDataContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CoinDataContext = createContext();

export const CoinDataProvider = ({ children }) => {
  const [coins, setCoins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const defaultCoins = [
    { id: "bitcoin", name: "Bitcoin", symbol: "BTC", image: "https://cryptologos.cc/logos/bitcoin-btc-logo.png", balance: 0.0 },
    { id: "ethereum", name: "Ethereum", symbol: "ETH", image: "https://cryptologos.cc/logos/ethereum-eth-logo.png", balance: 0.0 },
    { id: "tether", name: "Tether", symbol: "USDT", image: "https://cryptologos.cc/logos/tether-usdt-logo.png", balance: 0.0 },
    { id: "solana", name: "Solana", symbol: "SOL", image: "https://cryptologos.cc/logos/solana-sol-logo.png", balance: 0.0 },
    { id: "toncoin", name: "TON", symbol: "TON", image: "https://cryptologos.cc/logos/toncoin-ton-logo.png", balance: 0.0 },
    { id: "ripple", name: "Ripple", symbol: "XRP", image: "https://cryptologos.cc/logos/xrp-xrp-logo.png", balance: 0.0 },
  ];

  useEffect(() => {
    const fetchCoinData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found. Please log in again.");
        }

        const balanceResponse = await axios.get(`${process.env.REACT_APP_API_URL2}/api/users/balances`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!balanceResponse.data.success) {
          throw new Error("Failed to fetch user balances.");
        }

        const userBalances = balanceResponse.data.balances;

        const coinIds = defaultCoins.map((coin) => coin.id).join(",");
        const marketResponse = await axios.get(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds}&order=market_cap_desc&sparkline=false`
        );

        const updatedCoins = defaultCoins.map((coin) => {
          const marketInfo = marketResponse.data.find((data) => data.id === coin.id);
          return {
            ...coin,
            current_price: marketInfo?.current_price || 0.0,
            price_change_percentage_24h: marketInfo?.price_change_percentage_24h || 0.0,
            balance: userBalances?.[coin.id] || 0.0,
          };
        });

        setCoins(updatedCoins);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoinData();
  }, []);

  return (
    <CoinDataContext.Provider value={{ coins, isLoading, error }}>
      {children}
    </CoinDataContext.Provider>
  );
};

export const useCoinData = () => useContext(CoinDataContext);
