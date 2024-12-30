export const getBalance = async (walletAddress) => {
  // Simulated API call
  return new Promise((resolve) =>
    setTimeout(() => resolve({ balance: 1000 }), 1000)
  );
};

export const updateBalance = async (walletAddress, newBalance) => {
  // Simulated API call to update balance
  return new Promise((resolve) => setTimeout(() => resolve(true), 1000));
};
