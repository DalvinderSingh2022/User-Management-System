import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaPaperPlane, FaUser } from "react-icons/fa";
import NotificationForm from "../components/NotificationForm";
import { useUser } from "../context/UserContext";

const Dashboard = () => {
  const [show, setShow] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { users } = useUser();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            User Dashboard
          </h1>
          <p className="text-gray-600">Manage users and send notifications</p>
        </div>

        {show && (
          <div className="mb-8">
            <NotificationForm
              initialRecipients={selectedUser ? [selectedUser] : []}
              close={() => {
                setShow(false);
                setSelectedUser(null);
              }}
            />
          </div>
        )}

        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => setShow(true)}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
          >
            <FaPlus className="mr-2" />
            New Notification
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
            >
              <Link
                to={`/profile/${user._id}`}
                className="block mb-2 hover:text-blue-600"
              >
                <div className="flex items-center mb-2">
                  <FaUser className="mr-2 text-gray-500" />
                  <h3 className="text-xl font-semibold">{user.name}</h3>
                  {user.isAdmin && (
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      Admin
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm">{user.email}</p>
              </Link>

              <button
                onClick={() => {
                  setSelectedUser(user._id);
                  setShow(true);
                }}
                className="cursor-pointer mt-4 w-full flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                <FaPaperPlane className="mr-2" />
                Send Notification
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
