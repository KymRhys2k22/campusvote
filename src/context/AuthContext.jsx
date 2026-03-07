import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [studentData, setStudentData] = useState(() => {
    // Initialize student data from sessionStorage
    const savedData = sessionStorage.getItem("student_session");
    return savedData ? JSON.parse(savedData) : null;
  });

  const login = (data) => {
    setStudentData(data);
    sessionStorage.setItem("student_session", JSON.stringify(data));
  };

  const logout = () => {
    setStudentData(null);
    sessionStorage.removeItem("student_session");
  };

  return (
    <AuthContext.Provider value={{ studentData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
