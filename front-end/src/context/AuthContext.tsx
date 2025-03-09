import React, { createContext, useContext, useEffect, useState } from "react";
import { loginApi } from "../api/authApi";

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  role: string | null;
  login: (email: string, password: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("accessToken")
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    localStorage.getItem("refreshToken")
  );
  const [role, setRole] = useState<string | null>(localStorage.getItem("role"));

  const login = (email: string, password: string) => {
    try {
      const response = loginApi(email, password);
      console.log(response);
    } catch (err) {
      console.log(err);
    }
    // setAccessToken(accessToken);
    // setRefreshToken(refreshToken);
    // setRole(role);
  };

  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setRole(null);
  };

  useEffect(() => {
    if (accessToken && refreshToken) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("role", role as string);
    } else {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("role");
    }
  }, [accessToken, refreshToken, role]);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        role,
        isAuthenticated: !!accessToken,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};
