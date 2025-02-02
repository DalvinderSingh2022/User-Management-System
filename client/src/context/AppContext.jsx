import React from "react";
import { AuthProvider } from "./AuthContext.jsx";
import { UserProvider } from "./UserContext.jsx";

export const AppProvider = ({ children }) => {
  return (
    <AuthProvider>
      <UserProvider>{children}</UserProvider>
    </AuthProvider>
  );
};
