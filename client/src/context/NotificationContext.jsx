import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import {
  getSendNotifications,
  sendNotification,
  getRecipientNotifications,
} from "../utils/api";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notifications, setNotifications] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) fetchNotifications();
  }, [user]);

  const fetchNotifications = useCallback(async () => {
    setError("");
    setLoading(true);

    try {
      const [sendRes, recipientRes] = await Promise.all([
        getSendNotifications(),
        getRecipientNotifications(),
      ]);

      setNotifications({
        send: sendRes.data.data,
        recipient: recipientRes.data.data,
      });
    } catch (error) {
      setError(error.response?.data?.message || "Notification fetching failed");
    } finally {
      setLoading(false);
    }
  }, []);

  const createNotification = useCallback(async (notificationData) => {
    setError("");
    setLoading(true);

    try {
      await sendNotification(notificationData);
      await fetchNotifications();
    } catch (error) {
      setError(error.response?.data?.message || "Request creation failed");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <NotificationContext.Provider
      value={{ loading, error, notifications, user, createNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
