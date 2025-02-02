import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import Layout from "./components/Layout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import NotificationsPage from "./pages/NotificationPage.jsx";
import { useAuth } from "./context/AuthContext.jsx";

const App = () => {
  const { user } = useAuth();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route
            path="profile"
            element={<Navigate to={user ? `${user._id}` : "/login"} />}
          />
          <Route path="profile/:userId" element={<ProfilePage />} />
          <Route path="*" element={<div>Page Not found</div>} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default App;
