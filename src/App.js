import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { TransactionProvider } from "./context/TransactionContext";
import "react-toastify/dist/ReactToastify.css";
import SupportPage from "./components/Supportpage";

// Dashboard Components
import BalanceCard from "./components/BalanceCard";
import ActivityList from "./components/ActivityList";
import TransactionForm from "./components/TransactionForm";
import Sidebar from "./components/Sidebar";
import TransactionHistory from "./components/TransactionHistory";
import CryptoCarousel from "./components/CryptoCarousel";
import TierComponent from "./components/TierComponent";
import Profile from "./components/Profile";
import KYCPage from "./components/KycPage"; // Import the KYC page

// Pages
import HomePage from "./pages/HomePage"; // Homepage component
import SignupPage from "./pages/SignupPage"; // Signup component
import LoginPage from "./pages/LoginPage"; // Login component
import AboutPage from "./pages/AboutPage";
import ForgotPasswordPage from "./pages/ForgotPassword";
import ResetPasswordPage from "./pages/ResetLink";

// Private Route Component to handle protected routes
const PrivateRoute = ({ element }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    toast.error("You need to be logged in to access this page.");
    return <LoginPage />;
  }

  return element;
};

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState("0x123...456");
  const [userTier, setUserTier] = useState(1);
  const [walletBalance, setWalletBalance] = useState(500);
  const [upgradePending, setUpgradePending] = useState(false);

  const handleTierUpgradeRequest = async () => {
    try {
      setUpgradePending(true);
      toast.info("Upgrade request sent. Waiting for admin approval.");
    } catch (error) {
      toast.error("An error occurred while requesting the upgrade.");
    }
  };

  return (
    <TransactionProvider>
      <ToastContainer position="top-right" autoClose={3000} />
      <Router>
        <div className="min-h-screen flex bg-black text-gray-50 transition duration-300">
          <Sidebar isCollapsed={isSidebarOpen} setIsCollapsed={setIsSidebarOpen} /> {/* Pass the correct props */}
          <div className="flex-1 flex flex-col w-full">
            <header className="flex justify-between items-center p-4 shadow-md bg-stone-900">
              <h1 className="text-lg sm:text-xl font-bold">My Dashboard</h1>
            </header>

            <main className="flex flex-col items-center p-4 overflow-auto w-full max-w-screen-lg mx-auto">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

                {/* User Dashboard Routes */}
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute
                      element={
                        <>
                          <Profile />
                        </>
                      }
                    />
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <>
                      <div className="flex flex-col md:flex-row justify-between items-stretch w-full gap-4">
                        <BalanceCard walletAddress={walletAddress} walletBalance={walletBalance} />
                        <TierComponent
                          userTier={userTier}
                          upgradePending={upgradePending}
                          onRequestUpgrade={handleTierUpgradeRequest}
                        />
                      </div>
                      <ActivityList />
                      <CryptoCarousel className="h-48 sm:h-64 md:h-80 lg:h-96 my-4" />
                    </>
                  }
                />
                <Route
                  path="/support"
                  element={
                    <PrivateRoute
                      element={
                        <>
                          <SupportPage />
                        </>
                      }
                    />
                  }
                />
                <Route
                  path="/transaction/:type/:id"
                  element={
                    <>
                      <TransactionForm walletAddress={walletAddress} />
                    </>
                  }
                />

                <Route
                  path="/transaction-history"
                  element={
                    <>
                      <TransactionHistory />
                    </>
                  }
                />

                {/* KYC Route */}
                <Route
                  path="/kyc"
                  element={
                    <PrivateRoute
                      element={
                        <>
                          <KYCPage />
                        </>
                      }
                    />
                  }
                />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </TransactionProvider>
  );
};

export default App;
