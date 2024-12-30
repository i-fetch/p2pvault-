import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaHome, FaUser, FaBars, FaTimes, FaSignOutAlt, FaIdCard } from "react-icons/fa"; // Added FaIdCard for KYC

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false); // State to control the modal
  const navigate = useNavigate();

  const links = [
    { name: "Dashboard", path: "/dashboard", icon: <FaHome /> },
    { name: "Profile", path: "/profile", icon: <FaUser /> },
    { name: "KYC", path: "/kyc", icon: <FaIdCard /> }, // Added KYC link
  ];

  const handleLogout = () => {
    // Clear user session data (e.g., token, user info from localStorage/sessionStorage)
    localStorage.removeItem("userToken"); // Replace with your token or session management
    // Redirect to the homepage
    navigate("/");
  };

  return (
    <>
      {/* Sidebar for Desktop */}
      <div className={`hidden md:block w-64 bg-stone-900 shadow-lg min-h-screen p-6`}>
        <h2 className="text-2xl font-bold text-white  mb-6">P2PVault</h2>
        <nav>
          <ul className="space-y-4">
            {links.map((link, index) => (
              <li key={index}>
                <NavLink
                  to={link.path}
                  end={link.path === "/"}
                  className={({ isActive }) =>
                    `flex items-center gap-4 py-2 px-4 rounded-lg text-lg font-medium transition ${
                      isActive
                        ? "bg-pink-700 text-white shadow-lg"
                        : "text-white  hover:bg-gray-700"
                    }`
                  }
                >
                  <span className="text-xl">{link.icon}</span>
                  <span>{link.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <button
          onClick={() => setShowLogoutModal(true)} // Show modal on logout click
          className="flex items-center gap-4 py-2 px-4 rounded-lg text-lg font-medium transition text-gray-200 hover:bg-gray-700 mt-6"
        >
          <FaSignOutAlt className="text-xl" />
          <span>Logout</span>
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-stone-900 rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-xl font-semibold text-gray-200 mb-4">Confirm Logout</h3>
            <p className="text-gray-400 mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowLogoutModal(false)} // Close modal
                className="py-2 px-4 rounded-lg bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout} // Perform logout
                className="py-2 px-4 rounded-lg bg-red-700 text-white hover:bg-red-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Collapsible Sidebar for Mobile */}
      <div
        className={`fixed inset-0 bg-stone-900 bg-opacity-50 z-40 transition-transform duration-300 transform ${
          isCollapsed ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        <div className="w-64 bg-black  min-h-screen p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-200">P2PVault</h2>
            <button
              onClick={() => setIsCollapsed(false)}
              className="text-gray-800 dark:text-gray-200 text-2xl"
            >
              <FaTimes />
            </button>
          </div>
          <nav>
            <ul className="space-y-4">
              {links.map((link, index) => (
                <li key={index}>
                  <NavLink
                    to={link.path}
                    end={link.path === "/"}
                    onClick={() => setIsCollapsed(false)} // Close menu on navigation
                    className={({ isActive }) =>
                      `flex items-center gap-4 py-2 px-4 rounded-lg text-lg font-medium transition ${
                        isActive
                          ? "bg-pink-500 text-white shadow-lg"
                          : "text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`
                    }
                  >
                    <span className="text-xl">{link.icon}</span>
                    <span>{link.name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout Button for Mobile */}
          <button
            onClick={() => setShowLogoutModal(true)} // Show modal on logout click
            className="flex items-center gap-4 py-2 px-4 rounded-lg text-lg font-medium transition text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 mt-6"
          >
            <FaSignOutAlt className="text-xl" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="p-4 bg-blue-500 text-white fixed bottom-16 right-4 rounded-full shadow-lg md:hidden"
      >
        <FaBars />
      </button>
    </>
  );
};

export default Sidebar;
