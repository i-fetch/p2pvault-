import React, { useEffect, useState } from "react";
import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL2;

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const token = localStorage.getItem("token"); // Get the token from localStorage

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/user/transactions`, {
          headers: {
            Authorization: `Bearer ${token}`, // Use the token in the header
          },
        });
        setTransactions(response.data.transactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    if (token) {
      fetchTransactions();
    }
  }, [token]); // Refetch when token changes

  if (!transactions) {
    return (
      <div className="p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-lg w-full max-w-5xl mx-auto">
        <p className="text-gray-800 dark:text-gray-200">Loading transactions...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-stone-900 rounded-lg shadow-lg w-full max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-200 mb-6">
        Your Transaction History
      </h2>
      <div>
        {transactions.length === 0 ? (
          <p>No transactions yet.</p>
        ) : (
          <ul>
            {transactions.map((transaction, index) => (
              <li
                key={index}
                className={`mb-4 p-4 rounded-lg ${
                  transaction.transaction_type === "deposit"
                    ? "bg-green-700"
                    : "bg-red-700"
                }`}
              >
                <p><strong>Coin:</strong> {transaction.coin}</p>
                <p><strong>Amount:</strong> {transaction.amount} {transaction.coin}</p>
                <p><strong>Recipient:</strong> {transaction.recipient}</p>
                <p><strong>Status:</strong> {transaction.status}</p>
                <p><strong>Timestamp:</strong> {new Date(transaction.timestamp).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
