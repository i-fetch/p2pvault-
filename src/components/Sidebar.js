import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaIdCard,
  FaLifeRing,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const links = [
    { name: "Dashboard", path: "/dashboard", icon: <FaHome /> },
    { name: "Profile", path: "/profile", icon: <FaUser /> },
    { name: "KYC", path: "/kyc", icon: <FaIdCard /> },
    { name: "Support", path: "/support", icon: <FaLifeRing /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    window.location.href = "/";
  };

  return (
    <>
      {/* Sidebar for Desktop */}
      <div className="hidden md:block w-64 bg-stone-900 shadow-lg min-h-screen p-6">
        <h2 className="text-2xl font-bold text-white mb-6">P2PVault</h2>
        <nav>
          <ul className="space-y-4">
            {links.map((link, index) => (
              <li key={index}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `flex items-center gap-4 py-2 px-4 rounded-lg text-lg font-medium transition ${
                      isActive
                        ? "bg-pink-700 text-white shadow-lg"
                        : "text-white hover:bg-gray-700"
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
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 py-2 px-4 rounded-lg text-lg font-medium transition text-gray-200 hover:bg-gray-700 mt-6"
        >
          <FaSignOutAlt className="text-xl" />
          <span>Logout</span>
        </button>
      </div>

      {/* Mobile Sidebar */}
      {isCollapsed && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsCollapsed(false)} // Close sidebar when clicking outside
        ></div>
      )}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-stone-900 shadow-lg p-6 transform transition-transform duration-300 md:hidden ${
          isCollapsed ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-200">P2PVault</h2>
          <button
            onClick={() => setIsCollapsed(false)}
            className="text-gray-200 text-2xl"
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
                  onClick={() => setIsCollapsed(false)} // Close sidebar on click
                  className={({ isActive }) =>
                    `flex items-center gap-4 py-2 px-4 rounded-lg text-lg font-medium transition ${
                      isActive
                        ? "bg-pink-500 text-white shadow-lg"
                        : "text-gray-200 hover:bg-gray-700"
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
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 py-2 px-4 rounded-lg text-lg font-medium transition text-gray-200 hover:bg-gray-700 mt-6"
        >
          <FaSignOutAlt className="text-xl" />
          <span>Logout</span>
        </button>
      </div>
    </>
  );
};

export default Sidebar;
