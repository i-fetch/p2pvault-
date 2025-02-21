import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const BalanceCard = ({ userTier = "Basic Level" }) => {
  const [coins, setCoins] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [username, setUsername] = useState("");
  const [walletID, setWalletID] = useState("");
  const [loading, setLoading] = useState(true);
  const [showBalance, setShowBalance] = useState(true);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL2;

  const coinsData = [
    { id: "bitcoin", name: "Bitcoin", symbol: "BTC", image: "https://cryptologos.cc/logos/bitcoin-btc-logo.png" },
    { id: "ethereum", name: "Ethereum", symbol: "ETH", image: "https://cryptologos.cc/logos/ethereum-eth-logo.png" },
    { id: "tether", name: "Tether", symbol: "USDT", image: "https://cryptologos.cc/logos/tether-usdt-logo.png" },
    { id: "solana", name: "Solana", symbol: "SOL", image: "https://cryptologos.cc/logos/solana-sol-logo.png" },
    { id: "toncoin", name: "TON", symbol: "TON", image: "https://cryptologos.cc/logos/toncoin-ton-logo.png" },
    { id: "ripple", name: "Ripple", symbol: "XRP", image: "https://cryptologos.cc/logos/xrp-xrp-logo.png" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsername(response.data.username);
        setWalletID(response.data.wallet_id);

        const balanceResponse = await fetch(`${API_URL}/api/users/balances`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!balanceResponse.ok) {
          throw new Error("Failed to fetch user balances.");
        }

        const balanceData = await balanceResponse.json();
        const userBalances = balanceData.balances;

        const ids = coinsData.map((coin) => coin.id).join(",");
        const priceResponse = await axios.get(
          `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
        );
        const prices = priceResponse.data;

        const updatedCoins = coinsData.map((coin) => ({
          ...coin,
          balance: userBalances?.[coin.id] || 0.0,
          current_price: prices[coin.id]?.usd || 0,
        }));

        setCoins(updatedCoins);
      } catch (error) {
        console.error("Error fetching data:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  useEffect(() => {
    const calculateTotalBalance = () => {
      if (coins.every((coin) => coin.balance !== undefined && coin.current_price !== undefined)) {
        const total = coins.reduce((acc, coin) => {
          const coinValue = (coin.balance || 0) * (coin.current_price || 0);
          return acc + coinValue;
        }, 0);
        setTotalBalance(total);
      }
    };

    if (coins.length > 0) {
      calculateTotalBalance();
    }
  }, [coins]);

  const handleTransactionHistoryClick = () => {
    navigate("/transaction-history", { state: { coins } });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex justify-center items-center w-full py-6 px-3">
      <div className="bg-gradient-to-r from-stone-900 via-black-900 to-pink-700 text-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-[90%] sm:max-w-sm md:max-w-md lg:max-w-4xl mx-auto">
        <h3 className="text-lg sm:text-xl font-bold mb-2">Hello, {username || "User"}!</h3>
        <div className="flex items-center justify-start mb-4">
          <h3 className="text-lg sm:text-xl font-bold mr-2">Total Balance</h3>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="text-white focus:outline-none"
          >
            {showBalance ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
          </button>
        </div>
        <p className="text-2xl sm:text-3xl font-bold">
          {showBalance
            ? `$${new Intl.NumberFormat("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(totalBalance)}`
            : "****"}
        </p>

        {walletID ? (
          <div className="mb-3">
            <p className="text-sm font-semibold">Wallet ID:</p>
            <p className="text-xs text-gray-200 break-all">{walletID}</p>
          </div>
        ) : (
          <div className="mb-3 text-gray-200 text-xs">Wallet ID not available.</div>
        )}

        <div className="mb-3">
          <span className="cursor-pointer text-sm font-semibold text-gray-200 hover:text-gray-100">
            {userTier}
          </span>
        </div>

        <div className="mb-3">
          <p className="text-sm font-semibold">User Level: {userTier}</p>
          <p className="text-sm font-semibold">Minimum Withdrawal: $50,000</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mt-4">
          <button
            onClick={handleTransactionHistoryClick}
            className="bg-black hover:bg-gray-900 text-white px-3 py-2 rounded-lg w-full sm:w-auto text-xs"
          >
            View Transaction History
          </button>
        </div>
      </div>
    </div>
  );
};

BalanceCard.propTypes = {
  userTier: PropTypes.oneOf(["Basic Level", "Elite Level"]),
};

export default BalanceCard;
