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

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-black text-gray-50 transition duration-300">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex-1 flex flex-col w-full">
        <header className="flex justify-between items-center p-4 shadow-md bg-stone-900">
          <h1 className="text-lg sm:text-xl font-bold">My Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button
              className="lg:hidden text-gray-100"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </header>

        <main className="flex flex-col items-center p-4 overflow-auto w-full max-w-screen-lg mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

const App = () => {
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
                  <DashboardLayout>
                    <Profile />
                  </DashboardLayout>
                }
              />
            }
          />
          <Route
            path="/dashboard"
            element={
              <DashboardLayout>
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
              </DashboardLayout>
            }
          />
          <Route
            path="/support"
            element={
              <PrivateRoute
                element={
                  <DashboardLayout>
                    <SupportPage />
                  </DashboardLayout>
                }
              />
            }
          />
          <Route
            path="/transaction/:type/:id"
            element={
              <DashboardLayout>
                <TransactionForm walletAddress={walletAddress} />
              </DashboardLayout>
            }
          />
          
          <Route
            path="/transaction-history"
            element={
              <DashboardLayout>
                <TransactionHistory />
              </DashboardLayout>
            }
          />
          
          {/* KYC Route */}
          <Route
            path="/kyc"
            element={
              <PrivateRoute
                element={
                  <DashboardLayout>
                    <KYCPage />
                  </DashboardLayout>
                }
              />
            }
          />
        </Routes>
      </Router>
    </TransactionProvider>
  );
};

export default App;
