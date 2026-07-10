import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Permanently simulated user so website operates without login
  const [user, setUser] = useState({
    name: 'Guest User',
    email: 'guest@leadfinder.pro',
  });
  
  const loading = false;

  const login = async () => user;
  const register = async () => user;
  const logout = () => {};
  const updateUser = (patch) => setUser((prev) => ({ ...prev, ...patch }));

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
