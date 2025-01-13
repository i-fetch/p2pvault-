import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import QRCode from "qrcode.react"; // Make sure to install this package

const API_URL = process.env.REACT_APP_API_URL2;

const TransactionForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { coin } = location.state; // Receive coin data passed from ActivityList
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [transactionType, setTransactionType] = useState("send");
  const [network, setNetwork] = useState(coin.symbol); // Default to the coin's symbol (BTC, ETH, etc.)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showReceive, setShowReceive] = useState(false); // State for showing QR and address

  useEffect(() => {
    // Reset network selection to the coin's symbol on coin change
    setNetwork(coin.symbol);
  }, [coin]);

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleRecipientChange = (e) => {
    setRecipient(e.target.value);
  };

  const handleTransactionTypeChange = (e) => {
    setTransactionType(e.target.value);
    setShowReceive(e.target.value === "receive"); // Show QR and address if "receive" is selected
  };

  const handleNetworkChange = (e) => {
    setNetwork(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount.");
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in again.");
        navigate("/login");
        return;
      }

      // Transaction request payload
      const payload = {
        coinId: coin.id,
        amount,
        recipient: transactionType === "send" ? recipient : null, // Only send recipient if it's a send transaction
        type: transactionType,
        network, // Add the selected network here
      };

      // API call to submit transaction
      const response = await axios.post(`${API_URL}/api/transactions`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        navigate(`/dashboard`);
      } else {
        setError(response.data.message || "Transaction failed.");
      }
    } catch (error) {
      console.error("Error submitting transaction:", error);
      setError("Failed to process transaction. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatNumber = (value) => {
    return parseFloat(value).toFixed(2);
  };

  return (
    <div className="bg-stone-900 p-6 rounded-lg shadow-lg mt-10 w-full max-w-5xl mx-auto">
      <h3 className="text-xl font-bold mb-4 text-white">Transaction for {coin.name}</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="transactionType" className="block text-white">
            Transaction Type
          </label>
          <select
            id="transactionType"
            value={transactionType}
            onChange={handleTransactionTypeChange}
            className="mt-2 p-2 w-full bg-gray-800 text-white rounded"
          >
            <option value="send">Send</option>
            <option value="receive">Receive</option>
          </select>
        </div>

        {transactionType === "send" && (
          <>
            <div className="mb-4">
              <label htmlFor="recipient" className="block text-white">
                Recipient Address
              </label>
              <input
                type="text"
                id="recipient"
                value={recipient}
                onChange={handleRecipientChange}
                className="mt-2 p-2 w-full bg-gray-800 text-white rounded"
                placeholder="Enter recipient address"
              />
            </div>
          </>
        )}

        <div className="mb-4">
          <label htmlFor="amount" className="block text-white">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={handleAmountChange}
            className="mt-2 p-2 w-full bg-gray-800 text-white rounded"
            placeholder="Enter amount"
          />
        </div>

        {/* Network selection */}
        <div className="mb-4">
          <label htmlFor="network" className="block text-white">
            Network
          </label>
          <select
            id="network"
            value={network}
            onChange={handleNetworkChange}
            className="mt-2 p-2 w-full bg-gray-800 text-white rounded"
          >
            <option value="BTC">Bitcoin (BTC)</option>
            <option value="ETH">Ethereum (ETH)</option>
            <option value="XRP">Ripple (XRP)</option>
            <option value="SOL">Solana (SOL)</option>
            <option value="USDT">Tether (USDT)</option>
            <option value="TON">TON (TON)</option>
          </select>
        </div>

        {showReceive && (
          <div className="mt-6 text-center">
            <p className="text-white mb-4">Scan to Receive {coin.name}</p>
            <div className="bg-gray-800 p-4 rounded-lg">
              <QRCode value={`${network.toLowerCase()}:${coin.address}`} size={128} />
              <p className="text-white mt-4">{coin.address}</p>
              <button
                onClick={() => navigator.clipboard.writeText(coin.address)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Copy Address
              </button>
            </div>
          </div>
        )}

        <div className="mt-6">
          {error && <p className="text-red-400 text-center">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Transaction"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
