import React, { useState } from "react";
import { FaPlus, FaInbox, FaPaperPlane } from "react-icons/fa";
import NotificationForm from "../components/NotificationForm.jsx";
import { useNotification } from "../context/NotificationContext";

const NotificationsPage = () => {
  const [activeTab, setActiveTab] = useState("send");
  const [show, setShow] = useState(false);
  const { notifications, user } = useNotification();

  if (!notifications || !user) {
    return <div>loading</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center">
            <FaInbox className="mr-2 text-blue-600" />
            Notifications
          </h1>
          <button
            onClick={() => setShow(true)}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
          >
            <FaPlus className="mr-2" />
            New Notification
          </button>
        </div>

        {show && (
          <div className="mb-8">
            <NotificationForm close={() => setShow(false)} />
          </div>
        )}

        <div className="flex mb-4">
          <button
            className={`flex items-center px-4 py-2 cursor-pointer ${
              activeTab === "send"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-blue-500"
            }`}
            onClick={() => setActiveTab("send")}
          >
            <FaPaperPlane className="mr-2" />
            Send ({notifications.send.length})
          </button>
          <button
            className={`flex items-center px-4 py-2 cursor-pointer ${
              activeTab === "recipient"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-blue-500"
            }`}
            onClick={() => setActiveTab("recipient")}
          >
            <FaInbox className="mr-2" />
            Recipient ({notifications.recipient.length})
          </button>
        </div>
        <div className="bg-white rounded-lg shadow">
          {notifications[activeTab].map((notification) => (
            <div
              key={notification._id}
              className="p-4 border-b last:border-b-0 hover:bg-gray-50"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{notification.message}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {user._id !== notification.sender._id && (
                      <>
                        {notification.sender.name}
                        <span className="mx-2">•</span>
                      </>
                    )}
                    {`${new Date(notification.sentAt).toDateString()}
                      at 
                      ${new Date(notification.sentAt).toLocaleTimeString()}`}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {!notifications[activeTab].length && (
            <div className="p-8 text-center text-gray-500">
              No {activeTab} notifications found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
