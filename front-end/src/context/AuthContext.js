import React, { createContext, useContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('accessToken'));
  const [roleId, setRoleId] = useState(
    localStorage.getItem('roleId') ? Number(localStorage.getItem('roleId')) : null
  );
  const [userId, setUserId] = useState(
    localStorage.getItem('roleId') ? Number(localStorage.getItem('userId')) : null
  );

  const saveCredentials = (accessToken, roleId, userId) => {
    try {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('roleId', roleId);
      localStorage.setItem('userId', userId);
      setIsLoggedIn(true);
      setRoleId(roleId);
      setUserId(userId);
      return true;
    } catch (err) {
      console.error('>>> Save credentials:', err);
    }
    return false;
  };

  const removeCredentials = () => {
    try {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('roleId');
      localStorage.removeItem('userId');
      setIsLoggedIn(false);
      setRoleId(null);
      setUserId(null);
    } catch (err) {
      console.error('>>> Remove credentials: ', err);
    }
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const accessToken = localStorage.getItem('accessToken');
      const roleId = localStorage.getItem('roleId');
      const userId = localStorage.getItem('userId');
      setIsLoggedIn(!!accessToken);
      setRoleId(roleId ? parseInt(roleId) : null);
      setUserId(userId ? parseInt(userId) : null);
    };

    if (!isLoggedIn || !roleId || !userId) {
      removeCredentials();
    }

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [isLoggedIn, roleId]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        roleId,
        userId,
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
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};
