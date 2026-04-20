import { createContext, useState, useEffect, useCallback } from 'react';
import API from '../api/axios';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!token && !!user;

  // Restore user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (credentials) => {
    const { data } = await API.post('/auth/login', credentials);
    setUser(data);
    setToken(data.token);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    return data;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isLoading,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
