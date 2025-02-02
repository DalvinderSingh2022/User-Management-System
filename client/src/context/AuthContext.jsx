import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import * as jwtDecode from "jwt-decode";
import * as api from "../utils/api.js";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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
    try {
      const res = await api.getUserProfile();
      setUser(res.data.data);
    } catch (error) {
      setError("Error fetching user data");
    } finally {
      setLoading(false);
    }
  };

  const login = useCallback(async (email, password) => {
    setError("");
    try {
      const res = await api.login(email, password);
      localStorage.setItem("token", res.data.data.token);
      await fetchUserData();
      return res.data.data.isAdmin;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
    setLoading(false);
  }, []);

  const register = useCallback(async (name, email, password) => {
    try {
      await api.register(name, email, password);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Registration failed";
      throw new Error(errorMessage);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, error, login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};
