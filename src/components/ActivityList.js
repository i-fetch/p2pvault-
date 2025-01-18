import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const defaultCoins = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC", networks: ["Bitcoin"] },
  { id: "ethereum", name: "Ethereum", symbol: "ETH", networks: ["ERC20", "BSC"] },
  { id: "solana", name: "Solana", symbol: "SOL", networks: ["Solana"] },
  { id: "ton", name: "TON", symbol: "TON", networks: ["TON"] },
  { id: "usdt-erc20", name: "USDT (ERC20)", symbol: "USDT", networks: ["ERC20"] },
  { id: "usdt-trc20", name: "USDT (TRC20)", symbol: "USDT", networks: ["TRC20"] },
  { id: "usdt-bep20", name: "USDT (BEP20)", symbol: "USDT", networks: ["BEP20"] },
  { id: "xrp", name: "XRP", symbol: "XRP", networks: ["XRP"] },
];

const walletAddresses = {
  "usdt-erc20": "0x120995dac6a97050adb4f1c496200ec92d162beb",
  "usdt-trc20": "TB2w4BhFrKtS4a7eWZGfCzkggmtc9FfSxY",
  "usdt-bep20": "0x120995dac6a97050adb4f1c496200ec92d162beb",
  Bitcoin: "1PgFcjATXEM6jwb2MDtZtiNwuoRS4W6f2r",
  Ethereum: "0x120995dac6a97050adb4f1c496200ec92d162beb",
  Solana: "FkYpX3f625MaaRmYVNF5AWtX3jXXP9iB9Y5AqeUYFFft",
  TON: "EQBIvhjeezdpYekgPEEa4qWF_XdmzBIyIgqwI4yvp5wTxLX0",
  XRP: "rKPyUkd7rPVmKY7KKbkMqhq49bYi6Tdd3h",
};

const ActivityList = () => {
  const navigate = useNavigate();
  const [userBalances, setUserBalances] = useState({});

  useEffect(() => {
    // Fetch user balances from the backend
    const fetchBalances = async () => {
      try {
        const response = await fetch("/api/users/balances");
        const data = await response.json();
        setUserBalances(data);
      } catch (error) {
        console.error("Failed to fetch balances:", error);
      }
    };

    fetchBalances();
  }, []);

  const handleCoinClick = (coin) => {
    navigate(`/transaction/${coin.id}`, {
      state: { coin, walletAddress: walletAddresses[coin.id] },
    });
  };

  return (
    <div className="p-6 bg-stone-900 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-200 mb-4">Your Assets</h2>
      <ul>
        {defaultCoins.map((coin) => (
          <li
            key={coin.id}
            className="p-4 mb-2 bg-stone-800 rounded-lg flex justify-between items-center hover:bg-stone-700 cursor-pointer"
            onClick={() => handleCoinClick(coin)}
          >
            <span className="text-gray-200">{coin.name}</span>
            <span className="text-gray-400">
              {userBalances[coin.name] || 0} {coin.symbol}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityList;
