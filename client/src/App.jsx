import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import LoadingSpinner from "./components/LaodingSpinner.jsx";

const Login = lazy(() => import("./pages/Login.jsx"));
const Register = lazy(() => import("./pages/Register.jsx"));
const ProfilePage = lazy(() => import("./pages/ProfilePage.jsx"));
const Layout = lazy(() => import("./components/Layout.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const NotificationsPage = lazy(() => import("./pages/NotificationPage.jsx"));

const App = () => {
  const { user } = useAuth();

  return (
    <Suspense
      fallback={
        <div className="h-screen w-screen grid place-items-center">
          <LoadingSpinner />
        </div>
      }
    >
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
