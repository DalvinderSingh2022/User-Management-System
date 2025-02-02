import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import TopNav from "./TopNav.jsx";

const Layout = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <main>
      <TopNav />
      <Outlet />
    </main>
  );
};

export default Layout;
