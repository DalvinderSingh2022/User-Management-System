import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const TopNav = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLoginLogout = () => {
    user ? logout() : navigate("/login");
    setMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="flex-shrink-0 font-bold text-xl text-blue-600"
          >
            SiteName
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            <Link
              to={user?.isAdmin ? "/admin-dashboard" : "/user-dashboard"}
              className="flex items-center text-gray-600 hover:text-blue-600"
            >
              Dashboard
            </Link>
            <Link
              to="/profile"
              className="flex items-center text-gray-600 hover:text-blue-600"
            >
              Profile
            </Link>
            <Link
              to="/notifications"
              className="flex items-center text-gray-600 hover:text-blue-600"
            >
              Notifications
            </Link>
            <button
              onClick={handleLoginLogout}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
            >
              {user ? "Logout" : "Login"}
            </button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-600 hover:text-blue-600"
            >
              {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link
              to={user?.isAdmin ? "/admin-dashboard" : "/user-dashboard"}
              className="w-full flex items-center text-gray-600 hover:text-blue-600 p-2"
            >
              Dashboard
            </Link>
            <Link
              to="/profile"
              className="w-full flex items-center text-gray-600 hover:text-blue-600 p-2"
            >
              Profile
            </Link>
            <Link
              to="/notifications"
              className="w-full flex items-center text-gray-600 hover:text-blue-600 p-2"
            >
              Notifications
            </Link>
            <button
              onClick={handleLoginLogout}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
            >
              {user ? "Logout" : "Login"}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default TopNav;
