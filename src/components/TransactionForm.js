import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FaClipboard, FaClipboardCheck } from "react-icons/fa";

const networkOptions = {
  Bitcoin: ["Bitcoin"],
  Ethereum: ["ERC20", "BSC"],
  Solana: ["Solana"],
  TON: ["TON"],
  Tether: ["ERC20", "TRC20", "BEP20"],
  XRP: ["XRP"],
};

const walletAddresses = {
  Bitcoin: "1PgFcjATXEM6jwb2MDtZtiNwuoRS4W6f2r",
  Ethereum: {
    ERC20: "0x120995dac6a97050adb4f1c496200ec92d162beb",
    BSC: "0x120995dac6a97050adb4f1c496200ec92d162beb",
    
  },
  Solana: "FkYpX3f625MaaRmYVNF5AWtX3jXXP9iB9Y5AqeUYFFft",
  TON: "EQBIvhjeezdpYekgPEEa4qWF_XdmzBIyIgqwI4yvp5wTxLX0",
  Tether: {
    ERC20: "0x120995dac6a97050adb4f1c496200ec92d162beb",
    TRC20: "TB2w4BhFrKtS4a7eWZGfCzkggmtc9FfSxY",
    BEP20: "0x120995dac6a97050adb4f1c496200ec92d162beb",
  },
  XRP: "rKPyUkd7rPVmKY7KKbkMqhq49bYi6Tdd3h",
};

const getWalletAddress = (coinName, network) => {
  return walletAddresses[coinName]
    ? walletAddresses[coinName][network] || walletAddresses[coinName]
    : "No Address Available";
};

const TransactionForm = ({ userBalances = {}, addTransaction }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [network, setNetwork] = useState("");
  const [gasFee, setGasFee] = useState(0.02); // Fixed gas fee
  const [error, setError] = useState("");
  const [isReceiving, setIsReceiving] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [receiveNetwork, setReceiveNetwork] = useState(""); // Network for receiving
  const [isCopied, setIsCopied] = useState(false);

  const { coin } = location.state || {}; // Retrieve coin data passed from ActivityList
  const coinName = coin?.name;

  useEffect(() => {
    if (!coinName) {
      setError("Invalid coin data. Please go back and select a coin.");
      return;
    }

    const defaultNetwork = networkOptions[coinName]?.[0] || "Unknown";
    setNetwork(defaultNetwork);
    setReceiveNetwork(defaultNetwork);

    const address = getWalletAddress(coinName, defaultNetwork);
    setWalletAddress(address);
  }, [coinName]);

  const handleBack = () => navigate(-1);

  const handleSend = () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError("Invalid amount. Please enter a valid number.");
      return;
    }

    if (!address) {
      setError("Recipient address is required.");
      return;
    }

    const balance = userBalances[coinName] || 0;
    if (parseFloat(amount) > balance) {
      setError("Insufficient balance.");
      return;
    }

    // Deduct gas fee and add transaction
    const totalAmount = parseFloat(amount) + gasFee;
    if (totalAmount > balance) {
      setError("Insufficient balance to cover the gas fee.");
      return;
    }

    addTransaction({
      type: "Send",
      coin: coinName,
      amount: parseFloat(amount),
      address,
      network,
    });

    alert(`Transaction successful: ${amount} ${coinName} sent to ${address}`);
    navigate(-1);
  };

  const handleReceive = () => setIsReceiving(!isReceiving);

  const handleCopy = () => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleReceiveNetworkChange = (e) => {
    const selectedNetwork = e.target.value;
    setReceiveNetwork(selectedNetwork);
    const address = getWalletAddress(coinName, selectedNetwork);
    setWalletAddress(address);
  };

  return (
    <div className="p-6 bg-stone-900 rounded-lg shadow-lg w-full max-w-5xl mx-auto">
      <button
        onClick={handleBack}
        className="mb-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
      >
        Back
      </button>
      <h2 className="text-2xl font-bold mb-6 text-gray-200">
        {coinName} Transaction
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-500 text-white rounded-lg">{error}</div>
      )}

      {/* SEND FORM */}
      <div>
        <h3 className="text-xl font-semibold text-gray-300">Send {coinName}</h3>
        <div className="mb-4">
          <label htmlFor="amount" className="block text-gray-200">
            Amount
          </label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-2 p-2 border rounded-lg w-full bg-stone-900 text-gray-200 border-stone-600"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="address" className="block text-gray-200">
            Recipient Address
          </label>
          <input
            id="address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-2 p-2 border rounded-lg w-full bg-stone-900 text-gray-200 border-stone-600"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="network" className="block text-gray-200">
            Select Network
          </label>
          <select
            id="network"
            value={network}
            onChange={(e) => setNetwork(e.target.value)}
            className="mt-2 p-2 border rounded-lg w-full bg-stone-900 text-gray-200 border-stone-600"
          >
            {networkOptions[coinName]?.map((net, idx) => (
              <option key={idx} value={net}>
                {net}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Send
        </button>
      </div>

      {/* RECEIVE SECTION */}
      <div className="mt-6">
        <button
          onClick={handleReceive}
          className="w-full py-2 text-white rounded-lg bg-green-800 hover:bg-green-500"
        >
          {isReceiving ? "Hide" : "Receive"} {coinName}
        </button>
        {isReceiving && (
          <div className="mt-4">
            <div className="mb-4">
              <label htmlFor="receiveNetwork" className="block text-gray-200">
                Select Network
              </label>
              <select
                id="receiveNetwork"
                value={receiveNetwork}
                onChange={handleReceiveNetworkChange}
                className="mt-2 p-2 border rounded-lg w-full bg-stone-900 text-gray-200 border-stone-600"
              >
                {networkOptions[coinName]?.map((net, idx) => (
                  <option key={idx} value={net}>
                    {net}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-sm md:text-base text-gray-200 mb-2 break-words w-full max-w-full mx-auto flex items-center justify-between">
              <span className="truncate" title={walletAddress}>{walletAddress}</span>
              <CopyToClipboard text={walletAddress} onCopy={handleCopy}>
                <button className="ml-2 px-2 py-1 bg-gray-600 text-white rounded-lg">
                  {isCopied ? <FaClipboardCheck /> : <FaClipboard />}
                </button>
              </CopyToClipboard>
            </div>
            <QRCodeCanvas
              value={walletAddress}
              size={150}
              className="mx-auto mt-4"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionForm;
