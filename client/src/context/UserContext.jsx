import React, { createContext, useCallback, useContext, useState } from "react";
import { updateUserProfile } from "../utils/api";
import { useAuth } from "./AuthContext.jsx";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user, setUser } = useAuth();

  const updateProfile = useCallback(async (profileData) => {
    setLoading(true);
    try {
      const res = await updateUserProfile(profileData);
      setUser(res.data.data);
    } catch (error) {
      setError(error.response?.data?.message || "Profile updation failed");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, error, loading, updateProfile }}>
      {children}
    </UserContext.Provider>
  );
};
