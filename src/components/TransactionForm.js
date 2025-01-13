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
  const [gasFee, setGasFee] = useState(0.02); // Fixed gas fee
  const [error, setError] = useState("");
  const [isReceiving, setIsReceiving] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [receiveNetwork, setReceiveNetwork] = useState(""); // Network for receiving
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

    setNetwork(
      networkOptions[coin.name] ? networkOptions[coin.name][0] : "Unknown"
    );
    setReceiveNetwork(
      networkOptions[coin.name] ? networkOptions[coin.name][0] : "Unknown"
    );

    const address = getWalletAddress(coin, network);
    setWalletAddress(address);
  }, [coin]);

  const getWalletAddress = (coin, network) => {
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

    return walletAddresses[coin.name]
      ? walletAddresses[coin.name][network] || walletAddresses[coin.name]
      : "No Address Available";
  };

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

    const balance = userBalances[coin?.name] || 0;
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
      coin: coin.name,
      amount: parseFloat(amount),
      address,
      network,
    });

    alert(`Transaction successful: ${amount} ${coin.name} sent to ${address}`);
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
    const address = getWalletAddress(coin, selectedNetwork);
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
        {coin?.name} Transaction
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-500 text-white rounded-lg">{error}</div>
      )}

      {/* SEND FORM */}
      <div>
        <h3 className="text-xl font-semibold text-gray-300">Send {coin?.name}</h3>
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
            {networkOptions[coin.name]?.map((net, idx) => (
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
          {isReceiving ? "Hide" : "Receive"} {coin?.name}
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
                {networkOptions[coin.name]?.map((net, idx) => (
                  <option key={idx} value={net}>
                    {net}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-sm md:text-base text-gray-200 mb-2 break-words w-full max-w-[90%] mx-auto">
              {walletAddress}
            </div>
            <QRCodeCanvas
              value={walletAddress}
              size={150}
              className="mx-auto"
            />
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
