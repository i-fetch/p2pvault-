import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FaClipboard, FaClipboardCheck } from "react-icons/fa";

const TransactionForm = ({ userBalances = {}, addTransaction }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [network, setNetwork] = useState(""); 
  const [gasFee, setGasFee] = useState(0.02); // Fixed gas fee for all networks
  const [error, setError] = useState("");
  const [isReceiving, setIsReceiving] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const { coin } = location.state || {}; // Retrieve coin data passed from ActivityList

  useEffect(() => {
    if (!coin) {
      setError("Invalid coin data. Please go back and select a coin.");
      return;
    }

    setNetwork(coin.name || "Unknown");
    const address = getWalletAddress(coin);
    setWalletAddress(address);
  }, [coin]);

  const getWalletAddress = (coin) => {
    if (!coin || !coin.network) return "0x8F0889b7F1Aac33999ad6e3361cE29e76BF8d470"; 

    const walletAddresses = {
      Bitcoin: "1PgFcjATXEM6jwb2MDtZtiNwuoRS4W6f2r",
      Ethereum: "0x8F0889b7F1Aac33999ad6e3361cE29e76BF8d470",
      Solana: "FkYpX3f625MaaRmYVNF5AWtX3jXXP9iB9Y5AqeUYFFft",
      TON: "EQBIvhjeezdpYekgPEEa4qWF_XdmzBIyIgqwI4yvp5wTxLX0",
      Usdt: "0x8F0889b7F1Aac33999ad6e3361cE29e76BF8d470",
      XRP: "rKPyUkd7rPVmKY7KKbkMqhq49bYi6Tdd3h",
    };

    return walletAddresses[coin.network] || "No Address Available";
  };

  const handleBack = () => navigate(-1);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!coin) {
      setError("Invalid coin data. Cannot submit transaction.");
      return;
    }

    const balance = userBalances[coin.id] || 0;
    const totalCost = parseFloat(amount) + gasFee;

    if (!amount || !address) {
      setError("Please fill in all fields.");
      return;
    }

    if (parseFloat(amount) <= 0) {
      setError("Amount should be greater than 0.");
      return;
    }

    if (balance < totalCost) {
      setError("Insufficient funds for this transaction.");
      return;
    }

    const isSuccess = Math.random() > 0.2;

    const transaction = {
      coin: coin.name,
      amount: parseFloat(amount),
      recipient: address,
      network,
      gasFee,
      timestamp: new Date().toISOString(),
      status: isSuccess ? "Success" : "Failed",
    };

    addTransaction(transaction); 

    navigate("/transaction-history");
  };

  const handleReceive = () => setIsReceiving(!isReceiving);

  const handleCopy = () => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (!coin) {
    return (
      <div className="p-4 bg-red-500 text-white text-center">
        Error: Coin data is missing. Please go back and try again.
      </div>
    );
  }

  return (
    <div className="p-6 bg-stone-900 rounded-lg shadow-lg w-full max-w-5xl mx-auto">
      <button onClick={handleBack} className="mb-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
        Back
      </button>
      <h2 className="text-2xl font-bold mb-6 text-gray-200">{coin?.name} Transaction</h2>

      {error && <div className="mb-4 p-3 bg-red-500 text-white rounded-lg">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="network" className="block text-gray-200">
            Network
          </label>
          <input
            type="text"
            id="network"
            value={network}
            onChange={(e) => setNetwork(e.target.value)}
            className="mt-2 p-2 border rounded-lg w-full bg-stone-900 text-gray-200 border-stone-600"
            disabled
          />
        </div>
        <div className="mb-4">
          <label htmlFor="amount" className="block text-gray-200">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-2 p-2 border rounded-lg w-full bg-stone-900 text-gray-200 border-gray-300 dark:border-gray-600"
            placeholder="Enter amount"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="address" className="block text-gray-200">
            Recipient Address
          </label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-2 p-2 border rounded-lg w-full bg-stone-900 text-gray-200 border-gray-300 dark:border-gray-600"
            placeholder="Enter wallet address"
          />
          <p className="mt-2 text-sm text-red-700">
            Please ensure that the address is valid for the selected network to avoid loss of funds.
          </p>
        </div>
        <div className="mb-4">
          <p className="text-sm text-gray-400">
            Estimated Gas Fee:{" "}
            <strong>
              {gasFee} ETH
            </strong>
          </p>
        </div>
        <button
          type="submit"
          className="w-full py-2  text-white rounded-lg bg-blue-700 hover:bg-blue-600"
        >
          Complete Transaction
        </button>
      </form>

      <div className="mt-6">
        <button
          onClick={handleReceive}
          className="w-full py-2  text-white rounded-lg bg-green-800 hover:bg-green-500"
        >
          {isReceiving ? "Hide" : "Receive"} {coin?.name}
        </button>
        {isReceiving && (
          <div className="mt-4 p-4 bg-pink-700 rounded-lg">
            <h3 className="text-lg font-bold text-white">
              {coin?.name} Wallet Address:
            </h3>
            <div className="flex items-center space-x-2">
              <p className="text-xs sm:text-sm text-gray-200 truncate w-3/4">
                {walletAddress}
              </p>
              <CopyToClipboard text={walletAddress} onCopy={handleCopy}>
                <button>
                  {isCopied ? (
                    <FaClipboardCheck className="text-green-500" />
                  ) : (
                    <FaClipboard className="text-gray-400 hover:text-gray-200 cursor-pointer" />
                  )}
                </button>
              </CopyToClipboard>
            </div>
            <div className="mt-4">
              <QRCodeCanvas value={walletAddress} size={128} level="H" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionForm;
