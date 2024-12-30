import React, { useState, useEffect } from "react";
import axios from "axios";
const API_URL =process.env.REACT_APP_API_URL;


const TierComponent = ({ userTier, userId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [isUpgradeSelected, setIsUpgradeSelected] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentUserTier, setCurrentUserTier] = useState(userTier);
  const [currentTierRequestStatus, setCurrentTierRequestStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch tier request status and user tier
  const fetchTierRequestStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/users/tier-upgrade/status`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const { status, tierLevel } = response.data;
      setCurrentTierRequestStatus(status);
      setCurrentUserTier(tierLevel);
    } catch (error) {
      console.error("Error fetching tier request status:", error);
      setErrorMessage("Error fetching tier request status.");
    }
  };

  useEffect(() => {
    fetchTierRequestStatus(); // Fetch on component mount
  }, [userId]);

  useEffect(() => {
    if (requestSubmitted || currentTierRequestStatus === "rejected") {
      fetchTierRequestStatus();
      setRequestSubmitted(false);
    }
  }, [requestSubmitted, currentTierRequestStatus]);

  useEffect(() => {
    if (currentTierRequestStatus === "rejected") {
      localStorage.removeItem("upgradeRequested");
    }
  }, [currentTierRequestStatus]);

  const handleUpgradeClick = (level) => {
    setSelectedLevel(level);
    setIsModalOpen(true);
  };

  const confirmUpgrade = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/api/users/tier-upgrade`,
        { tierLevel: selectedLevel === "Elite Level" ? 2 : 3 },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setRequestSubmitted(true);
      setIsUpgradeSelected(true);
      setIsModalOpen(false);

      localStorage.setItem("upgradeRequested", "true");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "An error occurred while requesting an upgrade."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const cancelUpgrade = () => {
    setIsModalOpen(false);
  };

  const tierBenefits = {
    1: {
      name: "Basic Level",
      description: "You are on the Basic Level. Upgrade to enjoy more benefits.",
      benefits: [
        "Basic wallet features",
        "Standard withdrawal limits",
        "Access to general offers",
      ],
    },
    2: {
      name: "Elite Level",
      description: "Enjoy the benefits of the Elite Level.",
      benefits: [
        "Priority customer support",
        "Increased withdrawal limits",
        "Exclusive promotions and offers",
        "Higher transaction limits",
      ],
    },
    3: {
      name: "Premium Level",
      description: "Unlock all features with the Premium Level.",
      benefits: [
        "Personal account manager",
        "Unlimited withdrawals",
        "Exclusive rewards",
        "VIP event invitations",
      ],
    },
  };

  const renderUpgradeButton = () => {
    if (currentTierRequestStatus === "pending") {
      return (
        <button className="w-full py-2 bg-gray-600 text-white rounded-lg" disabled>
          Upgrade Pending Approval
        </button>
      );
    }

    if (currentTierRequestStatus === "approved") {
      return (
        <button className="w-full py-2 bg-green-600 text-white rounded-lg" disabled>
          Upgrade Approved
        </button>
      );
    }

    return renderUpgradeOptions();
  };

  const renderUpgradeOptions = () => {
    const options = [];
    const upgradeRequested = localStorage.getItem("upgradeRequested");

    if (
      currentUserTier < 3 &&
      !isUpgradeSelected &&
      currentTierRequestStatus !== "approved" &&
      !upgradeRequested
    ) {
      options.push(
        <button
          key="upgrade-premium"
          onClick={() => handleUpgradeClick("Premium Level")}
          className="w-full py-2 bg-green-900 text-white rounded-lg hover:bg-green-600"
          disabled={isLoading}
        >
          {isLoading ? "Requesting..." : "Upgrade to Premium Level"}
        </button>
      );
    }

    if (
      currentUserTier < 2 &&
      !isUpgradeSelected &&
      currentTierRequestStatus !== "approved" &&
      !upgradeRequested
    ) {
      options.push(
        <button
          key="upgrade-elite"
          onClick={() => handleUpgradeClick("Elite Level")}
          className="w-full py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-600 mb-4"
          disabled={isLoading}
        >
          {isLoading ? "Requesting..." : "Upgrade to Elite Level"}
        </button>
      );
    }

    return options.length > 0 ? options : <p>No upgrades available at this time.</p>;
  };

  return (
    <div className="p-6 bg-stone-900 rounded-lg shadow-lg w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-200 mb-6">
        User Tier: {tierBenefits[currentUserTier]?.name || "Unknown"}
      </h2>

      <p className="mb-4 text-white">
        {tierBenefits[currentUserTier]?.description}
      </p>

      <ul className="list-disc pl-6 mb-6 text-white">
        {tierBenefits[currentUserTier]?.benefits.map((benefit, index) => (
          <li key={index}>{benefit}</li>
        ))}
      </ul>

      {currentUserTier < 3 && (
        <div>
          <h3 className="text-lg font-bold text-white mb-4">Upgrade Options</h3>
          {renderUpgradeButton()}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">
              Confirm Upgrade
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Are you sure you want to request an upgrade to <strong>{selectedLevel}</strong>?
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={confirmUpgrade}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
                disabled={isLoading}
              >
                Confirm
              </button>
              <button
                onClick={cancelUpgrade}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {errorMessage && <div className="mt-4 text-red-500">{errorMessage}</div>}
    </div>
  );
};

export default TierComponent;
