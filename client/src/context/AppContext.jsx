import React from "react";
import { AuthProvider } from "./AuthContext.jsx";
import { UserProvider } from "./UserContext.jsx";
import { NotificationProvider } from "./NotificationContext.jsx";

export const AppProvider = ({ children }) => {
  return (
    <AuthProvider>
      <UserProvider>
        <NotificationProvider>{children}</NotificationProvider>
      </UserProvider>
    </AuthProvider>
  );
};
