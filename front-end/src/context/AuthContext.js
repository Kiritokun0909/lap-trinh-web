import React, { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("accessToken")
  );
  const [roleId, setRoleId] = useState(
    localStorage.getItem("roleId")
      ? Number(localStorage.getItem("roleId"))
      : null
  );

  const saveCredentials = (accessToken, roleId) => {
    try {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("roleId", roleId);
      setIsLoggedIn(true);
      setRoleId(roleId);
      return true;
    } catch (err) {
      console.error(">>> Save credentials:", err);
    }
    return false;
  };

  const removeCredentials = () => {
    try {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("roleId");
      setIsLoggedIn(false);
      setRoleId(null);
    } catch (err) {
      console.error(">>> Remove credentials: ", err);
    }
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const accessToken = localStorage.getItem("accessToken");
      const roleId = localStorage.getItem("roleId");
      setIsLoggedIn(!!accessToken);
      setRoleId(roleId ? parseInt(roleId) : null);
    };

    if (!isLoggedIn || !roleId) {
      removeCredentials();
    }

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [isLoggedIn, roleId]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        roleId,
        saveCredentials,
        removeCredentials,
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
