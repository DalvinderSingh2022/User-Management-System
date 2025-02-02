import React from "react";
import { AuthProvider } from "./AuthContext.jsx";

export const AppProvider = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};
