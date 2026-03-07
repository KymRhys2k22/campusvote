import React from "react";
import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { studentData } = useAuth();

  if (!studentData) {
    // Redirect to login page if student is not verified
    return <Navigate to="/" replace />;
  }

  return children;
}
