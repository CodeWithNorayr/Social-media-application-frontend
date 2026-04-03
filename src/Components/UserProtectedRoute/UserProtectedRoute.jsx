import React, { useContext } from "react";
import { StoreContext } from "../../Context/AuthContext/AuthContext";
import { Navigate } from "react-router-dom";

const UserProtectedRoute = ({ children }) => {
  const { token, authLoading } = useContext(StoreContext);

  // 🟡 Still checking (important if token comes async)
  if (authLoading) {
    return <p>Checking authentication...</p>;
  }

  // 🔴 No token → go to login
  if (!token) {
    return <Navigate to="/user/login" replace />;
  }

  // 🟢 Token exists → allow access
  return children;
};

export default UserProtectedRoute;