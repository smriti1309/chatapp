// ProtectedRoute.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from "../store/useAuthStore.js"; 
  // Adjust path

const ProtectedRoute = () => {
  const { authUser } = useAuthStore();

  // If user is not authenticated, redirect them to the login page
  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the children routes (the Outlet)
  return <Outlet />;
};

export default ProtectedRoute;