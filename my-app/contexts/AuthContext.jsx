import React, { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext(null);

const STORAGE_KEY = 'booking_app_auth';

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null,
    token: null,
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAuth({ ...parsed, isAuthenticated: !!parsed.token });
      } catch (err) {
        console.error('Failed to parse auth from storage', err);
      }
    }
  }, []);

  useEffect(() => {
    if (auth.token) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ user: auth.user, token: auth.token }),
      );
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [auth]);

  const login = (user, token) => {
    setAuth({
      isAuthenticated: true,
      user,
      token,
    });
  };

  const logout = () => {
    setAuth({
      isAuthenticated: false,
      user: null,
      token: null,
    });
  };

  const value = {
    ...auth,
    login,
    logout,
    hasRole: (role) => auth.user?.role === role,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
