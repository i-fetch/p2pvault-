import React, { useEffect, useState } from "react";
import Slider from "react-slick"; // Import react-slick
import "slick-carousel/slick/slick.css"; // Slick styles
import "slick-carousel/slick/slick-theme.css"; // Slick theme styles

const CryptoCarousel = () => {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the market prices from CoinGecko API
    const fetchCryptoPrices = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setCryptos(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching crypto prices:", error);
        setError("Failed to load cryptocurrency data.");
        setLoading(false);
      }
    };

    fetchCryptoPrices();
  }, []);

  // Carousel settings
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  // Function to handle redirect to CoinGecko
  const handleRedirect = (coinId) => {
    const url = `https://www.coingecko.com/en/coins/${coinId}`;
    window.open(url, "_blank"); // Open the CoinGecko page in a new tab
  };

  return (
    <div className="crypto-carousel px-4 sm:px-6 md:px-8 lg:px-10 w-full max-w-4xl mx-auto py-6">
      <h2 className="text-center text-2xl font-bold mb-6 text-gray-100">
        Cryptocurrency Market Prices
      </h2>

      {loading ? (
        <div className="text-center">
          <div className="animate-spin border-t-2 border-pink-500 rounded-full w-8 h-8 mx-auto mb-2"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <Slider {...settings}>
          {cryptos.map((crypto) => (
            <div
              key={crypto.id}
              className="p-4 cursor-pointer"
              onClick={() => handleRedirect(crypto.id)} // Redirect to CoinGecko
            >
              <div className="p-4 bg-red text-white rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
                <div className="flex items-center space-x-4">
                  <img
                    src={crypto.image}
                    alt={crypto.name}
                    className="w-12 h-12 rounded-full shadow-md"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">
                      {crypto.name} ({crypto.symbol.toUpperCase()})
                    </h3>
                    <p className="text-sm">
                      Price: ${crypto.current_price.toFixed(2)}
                    </p>
                    <p className="text-sm">
                      Market Cap: ${crypto.market_cap.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default CryptoCarousel;
