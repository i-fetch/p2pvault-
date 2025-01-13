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

  const networkOptions = {
    Bitcoin: ["Bitcoin", "Bitcoin Cash"],
    Ethereum: ["ERC20", "BSC", "Polygon"],
    Solana: ["Solana"],
    TON: ["TON"],
    Usdt: ["ERC20", "TRC20", "BEP20"],
    XRP: ["XRP"],
  };

  useEffect(() => {
    if (!coin) {
      setError("Invalid coin data. Please go back and select a coin.");
      return;
    }

    setNetwork(networkOptions[coin.name] ? networkOptions[coin.name][0] : "Unknown");
    const address = getWalletAddress(coin, network);
    setWalletAddress(address);
  }, [coin]);

  const getWalletAddress = (coin, network) => {
    if (!coin || !coin.network) return "0x8F0889b7F1Aac33999ad6e3361cE29e76BF8d470"; 

    const walletAddresses = {
      Bitcoin: "1PgFcjATXEM6jwb2MDtZtiNwuoRS4W6f2r",
      Ethereum: {
        ERC20: "0x8F0889b7F1Aac33999ad6e3361cE29e76BF8d470",
        BSC: "0xB4fA0a9C0fB3463E9028d8a01D77548b9D3271B0",
        Polygon: "0x7a19d123fa6f05A16f56CBB66c01D39A4Caf987A",
      },
      Solana: "FkYpX3f625MaaRmYVNF5AWtX3jXXP9iB9Y5AqeUYFFft",
      TON: "EQBIvhjeezdpYekgPEEa4qWF_XdmzBIyIgqwI4yvp5wTxLX0",
      Usdt: {
        ERC20: "0x8F0889b7F1Aac33999ad6e3361cE29e76BF8d470",
        TRC20: "TzYjscHJkMG6BYbmYrEmyApKzcdjoHR7d9",
        BEP20: "0xB9b04DcbB64d7B10dB18F44231A1E26392c8c9b5",
      },
      XRP: "rKPyUkd7rPVmKY7KKbkMqhq49bYi6Tdd3h",
    };

    return walletAddresses[coin.name] ? walletAddresses[coin.name][network] || walletAddresses[coin.name] : "No Address Available";
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
          <select
            id="network"
            value={network}
            onChange={(e) => {
              setNetwork(e.target.value);
              const address = getWalletAddress(coin, e.target.value);
              setWalletAddress(address);
            }}
            className="mt-2 p-2 border rounded-lg w-full bg-stone-900 text-gray-200 border-stone-600"
          >
            {networkOptions[coin.name]?.map((net, idx) => (
              <option key={idx} value={net}>
                {net}
              </option>
            ))}
          </select>
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
          <div className="mt-4 text-center">
            <QRCodeCanvas value={walletAddress} size={256} />
            <div className="mt-2 text-lg text-gray-200">{walletAddress}</div>
            <CopyToClipboard text={walletAddress} onCopy={handleCopy}>
              <button className="mt-2 px-4 py-2 bg-gray-600 text-white rounded-lg">
                {isCopied ? <FaClipboardCheck /> : <FaClipboard />} Copy Address
              </button>
            </CopyToClipboard>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionForm;
