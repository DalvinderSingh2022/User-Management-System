import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import * as jwtDecode from "jwt-decode";
import { getUserProfile, authRegister, authLogin } from "../utils/api.js";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("token");

    if (token) {
      const decoded = jwtDecode.jwtDecode(token);

      if (decoded.exp > Date.now() / 1000) {
        fetchUserData();
      } else {
        localStorage.removeItem("token");
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const res = await getUserProfile();
      setUser(res.data.data);
    } catch (error) {
      setError(error.response?.data?.message || "User data fetching failed");
    } finally {
      setLoading(false);
    }
  };

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const res = await authLogin(email, password);
      localStorage.setItem("token", res.data.data.token);
      await fetchUserData();

      return res.data.data.isAdmin;
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
    setLoading(false);
  }, []);

  const register = useCallback(async (name, email, password) => {
    setLoading(true);
    try {
      await authRegister(name, email, password);
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, error, login, logout, register, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
