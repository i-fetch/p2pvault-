import React, { useEffect, useState } from "react";
import axios from "axios"; // or any other method to make HTTP requests

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const { user } = useAuth(); // Access the logged-in user details from context

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get("/api/user/transactions", {
          headers: {
            Authorization: `Bearer ${user.token}`, // Include token in the header
          },
        });
        setTransactions(response.data.transactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, [user.token]); // Refetch when user token changes

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
                  transaction.status === "Success"
                    ? "bg-green-700"
                    : "bg-red-700"
                }`}
              >
                <p><strong>Coin:</strong> {transaction.coin}</p>
                <p><strong>Amount:</strong> {transaction.amount} {transaction.coin}</p>
                <p><strong>Recipient:</strong> {transaction.recipient}</p>
                <p><strong>Status:</strong> {transaction.status}</p>
                <p><strong>Timestamp:</strong> {new Date(transaction.timestamp).toLocaleString()}</p>
                <p><strong>Gas Fee:</strong> {transaction.gasFee} ETH</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
