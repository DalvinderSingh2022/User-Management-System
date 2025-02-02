import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import * as jwtDecode from "jwt-decode";
import { getUser, authRegister, authLogin } from "../utils/api.js";

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
        fetchUserData(decoded.userId);
      } else {
        localStorage.removeItem("token");
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserData = async (userId) => {
    setError("");
    setLoading(true);

    try {
      const res = await getUser(userId);
      setUser(res.data.data);
    } catch (error) {
      setError(error.response?.data?.message || "User data fetching failed");
    } finally {
      setLoading(false);
    }
  };

  const login = useCallback(async (email, password) => {
    setError("");
    setLoading(true);

    try {
      const res = await authLogin(email, password);
      localStorage.setItem("token", res.data.data.token);
      await fetchUserData(res.data.data.userId);

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
  }, []);

  const register = useCallback(async (name, email, password) => {
    setError("");
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
