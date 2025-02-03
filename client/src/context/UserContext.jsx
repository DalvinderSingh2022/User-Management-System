import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { updateUserProfile, getUsers, getUser } from "../utils/api";
import { useAuth } from "./AuthContext.jsx";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();

  const updateProfile = useCallback(async (profileData) => {
    setError("");
    setLoading(true);

    try {
      const res = await updateUserProfile(profileData);
      return res.data.data;
    } catch (error) {
      setError(error.response?.data?.message || "Profile updation failed");
    } finally {
      setLoading(false);
    }
  }, []);

  const getProfile = useCallback(async (userId) => {
    setError("");
    setLoading(true);

    try {
      const res = await getUser(userId);
      return res.data.data;
    } catch (error) {
      setError(error.response?.data?.message || "Profile updation failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchUsers();
  }, [user]);

  const fetchUsers = useCallback(async () => {
    setError("");
    setLoading(true);

    try {
      const res = await getUsers();
      setUsers(res.data.data);
    } catch (error) {
      setError(error.response?.data?.message || "Users fetching failed");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <UserContext.Provider
      value={{ user, users, error, loading, updateProfile, getProfile }}
    >
      {children}
    </UserContext.Provider>
  );
};
