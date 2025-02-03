import React, { useState } from "react";
import { FaPaperPlane, FaUsers, FaExclamationTriangle } from "react-icons/fa";
import { useUser } from "../context/UserContext";
import { useNotification } from "../context/NotificationContext";
import LoadingSpinner from "./LaodingSpinner";

const NotificationForm = ({ close, initialRecipients = [] }) => {
  const { user, users } = useUser();
  const { createNotification, loading } = useNotification();
  const [message, setMessage] = useState("");
  const [recipients, setRecipients] = useState(initialRecipients);
  const [isCritical, setIsCritical] = useState(false);

  const handleRecipientToggle = (userId) => {
    setRecipients((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createNotification({ message, recipients, isCritical });

    close();
  };

  if (!Array.isArray(users) || !user) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <FaPaperPlane className="mr-2 text-blue-600" />
        Send Notification
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            placeholder="Write your notification message..."
            required
          />
        </div>

        {user.isAdmin && (
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <FaExclamationTriangle className="mr-2 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                Critical Notification
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsCritical(!isCritical)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isCritical ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isCritical ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        )}

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <FaUsers className="mr-2" />
            Select Recipients
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {users.filter((u) => u._id !== user._id)?.length > 0 ? (
              users
                .filter((u) => u._id !== user._id)
                .map((user) => (
                  <label
                    key={user._id}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                      recipients.includes(user._id)
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={recipients.includes(user._id)}
                      onChange={() => handleRecipientToggle(user._id)}
                      className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </label>
                ))
            ) : users.filter((u) => u._id !== user._id)?.length !== 0 ? (
              <LoadingSpinner />
            ) : (
              "No User Yet (Other than you)"
            )}
          </div>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={close}
            className="cursor-pointer px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="cursor-pointer w-full flex justify-center items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FaPaperPlane className="mr-2" />
            {loading ? "sending" : "Send Notification"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NotificationForm;
