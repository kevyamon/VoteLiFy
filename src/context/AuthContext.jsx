import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Vérification de la session active au chargement
  const checkAuth = async () => {
    try {
      const data = await api.getMe();
      setAdmin(data);
    } catch {
      setAdmin(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (credentials) => {
    const data = await api.loginAdmin(credentials);
    setAdmin(data);
    return data;
  };

  const register = async (credentials) => {
    const data = await api.registerAdmin(credentials);
    setAdmin(data);
    return data;
  };

  const logout = async () => {
    try {
      await api.logoutAdmin();
    } finally {
      setAdmin(null);
    }
  };

  return (
    <AuthContext.Provider value={{ admin, isLoading, isAuthenticated: Boolean(admin), login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé au sein d’un AuthProvider.');
  }
  return context;
};
