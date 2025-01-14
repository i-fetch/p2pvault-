import { useState, useEffect } from "react";
import axios from "axios";

const useFetchBalancesAndPrices = (API_URL, coinsData) => {
  const [coins, setCoins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      try {
        // Fetch user balances
        const balanceResponse = await axios.get(`${API_URL}/api/users/balances`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userBalances = balanceResponse.data.balances;

        // Fetch current coin prices
        const coinIds = coinsData.map((coin) => coin.id).join(",");
        const priceResponse = await axios.get(
          `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=usd`
        );

        // Update coin data with balances and prices
        const updatedCoins = coinsData.map((coin) => ({
          ...coin,
          balance: userBalances?.[coin.id] || 0,
          current_price: priceResponse.data[coin.id]?.usd || 0,
        }));

        setCoins(updatedCoins);
      } catch (error) {
        setError("Failed to fetch balances or prices.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [API_URL, coinsData]);

  return { coins, isLoading, error };
};

export default useFetchBalancesAndPrices;
