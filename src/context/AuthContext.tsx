'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, getAuthToken, setAuthToken, getStoredUser, setStoredUser, authApi } from '@/lib/apiClient';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, targetRole?: string, experienceLevel?: string) => Promise<void>;
  logout: () => void;
  updateProfile: (payload: { name?: string; targetRole?: string; experienceLevel?: string; password?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check initial stored user & token
    const token = getAuthToken();
    const stored = getStoredUser();

    if (token && stored) {
      setUser(stored);
      // Attempt to verify with backend asynchronously
      authApi.getMe()
        .then((profile) => {
          const updated = { ...stored, ...profile };
          setUser(updated);
          setStoredUser(updated);
        })
        .catch(() => {
          // If token expired/invalid, clear auth
          setAuthToken(null);
          setStoredUser(null);
          setUser(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const data = await authApi.login({ email, password });
    setAuthToken(data.token);
    setStoredUser(data);
    setUser(data);
  };

  const register = async (name: string, email: string, password: string, targetRole?: string, experienceLevel?: string) => {
    const data = await authApi.register({ name, email, password, targetRole, experienceLevel });
    setAuthToken(data.token);
    setStoredUser(data);
    setUser(data);
  };

  const logout = () => {
    setAuthToken(null);
    setStoredUser(null);
    setUser(null);
  };

  const updateProfile = async (payload: { name?: string; targetRole?: string; experienceLevel?: string; password?: string }) => {
    const data = await authApi.updateProfile(payload);
    setAuthToken(data.token);
    setStoredUser(data);
    setUser(data);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
