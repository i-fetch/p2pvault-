import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { TransactionProvider } from "./context/TransactionContext";
import "react-toastify/dist/ReactToastify.css";

// Components
import Sidebar from "./components/Sidebar";
import BalanceCard from "./components/BalanceCard";
import ActivityList from "./components/ActivityList";
import TransactionForm from "./components/TransactionForm";
import TransactionHistory from "./components/TransactionHistory";
import CryptoCarousel from "./components/CryptoCarousel";
import TierComponent from "./components/TierComponent";
import Profile from "./components/Profile";
import KYCPage from "./components/KycPage";
import SupportPage from "./components/Supportpage";

// Pages
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import AboutPage from "./pages/AboutPage";
import ForgotPasswordPage from "./pages/ForgotPassword";
import ResetPasswordPage from "./pages/ResetLink";
import NotFoundPage from "./pages/NotFoundPage"; // 404 Page

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    toast.error("You need to be logged in to access this page.");
    return <LoginPage />;
  }
  return children;
};

const DashboardLayout = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex bg-black text-gray-50 transition duration-300">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />
      <div className="flex-1 flex flex-col w-full">
        <header className="flex justify-between items-center p-4 shadow-md bg-stone-900">
          <h1 className="text-lg sm:text-xl font-bold">My Dashboard</h1>
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
              <PrivateRoute>
                <DashboardLayout>
                  <Profile />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <div className="flex flex-col md:flex-row justify-between items-stretch w-full gap-4">
                    <BalanceCard
                      walletAddress={walletAddress}
                      walletBalance={walletBalance}
                    />
                    <TierComponent
                      userTier={userTier}
                      upgradePending={upgradePending}
                      onRequestUpgrade={handleTierUpgradeRequest}
                    />
                  </div>
                  <ActivityList />
                  <CryptoCarousel className="h-48 sm:h-64 md:h-80 lg:h-96 my-4" />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/support"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <SupportPage />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/transaction/:type/:id"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <TransactionForm walletAddress={walletAddress} />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/transaction-history"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <TransactionHistory />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/kyc"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <KYCPage />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          {/* Catch-All Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </TransactionProvider>
  );
};

export default App;
