'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  AuthUser,
  getAuthToken,
  setAuthToken,
  getStoredUser,
  setStoredUser,
  authApi,
} from '@/lib/apiClient';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isEmailVerified: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    targetRole?: string,
    experienceLevel?: string
  ) => Promise<{ message?: string }>;
  logout: () => Promise<void>;
  updateProfile: (payload: {
    name?: string;
    targetRole?: string;
    experienceLevel?: string;
  }) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<string>;
  resetPassword: (token: string, password: string) => Promise<string>;
  verifyEmail: (token: string) => Promise<string>;
  resendVerification: () => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ─── Force Logout Listener ──────────────────────────────
  useEffect(() => {
    const handleForceLogout = () => {
      setAuthToken(null);
      setStoredUser(null);
      setUser(null);
    };

    window.addEventListener('mockly:forceLogout', handleForceLogout);
    return () => window.removeEventListener('mockly:forceLogout', handleForceLogout);
  }, []);

  // ─── Check initial stored user & verify with backend ────
  useEffect(() => {
    const initAuth = async () => {
      const token = getAuthToken() || await authApi.refreshToken();
      const stored = getStoredUser();

      if (token) {
        if (stored) setUser(stored);

        try {
          const profile = await authApi.getMe();
          const updated = { ...stored, ...profile };
          setUser(updated);
          setStoredUser(updated);
        } catch {
          // Token might be expired — try refresh
          try {
            const newToken = await authApi.refreshToken();
            if (newToken) {
              const profile = await authApi.getMe();
              const updated = { ...stored, ...profile, token: newToken };
              setUser(updated);
              setStoredUser(updated);
            } else {
              setAuthToken(null);
              setStoredUser(null);
              setUser(null);
            }
          } catch {
            setAuthToken(null);
            setStoredUser(null);
            setUser(null);
          }
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await authApi.login({ email, password });
    setAuthToken(data.token);
    setStoredUser(data);
    setUser(data);
  }, []);

  const register = useCallback(
    async (
      name: string,
      email: string,
      password: string,
      targetRole?: string,
      experienceLevel?: string
    ) => {
      const data = await authApi.register({
        name,
        email,
        password,
        targetRole,
        experienceLevel,
      });
      setAuthToken(data.token);
      setStoredUser(data);
      setUser(data);
      return { message: data.message };
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      /* clear locally even if server call fails */
    }
    setAuthToken(null);
    setStoredUser(null);
    setUser(null);
  }, []);

  const updateProfile = useCallback(
    async (payload: { name?: string; targetRole?: string; experienceLevel?: string }) => {
      const data = await authApi.updateProfile(payload);
      setAuthToken(data.token);
      setStoredUser(data);
      setUser(data);
    },
    []
  );

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    await authApi.changePassword({ currentPassword, newPassword });
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    const data = await authApi.forgotPassword(email);
    return data.message;
  }, []);

  const resetPassword = useCallback(async (token: string, password: string) => {
    const data = await authApi.resetPassword(token, password);
    // Clear any existing auth state after password reset
    setAuthToken(null);
    setStoredUser(null);
    setUser(null);
    return data.message;
  }, []);

  const verifyEmail = useCallback(async (token: string) => {
    const data = await authApi.verifyEmail(token);
    // Update user's verified status
    if (user) {
      const updated = { ...user, isEmailVerified: true };
      setUser(updated);
      setStoredUser(updated);
    }
    return data.message;
  }, [user]);

  const resendVerification = useCallback(async () => {
    const data = await authApi.resendVerification();
    return data.message;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isEmailVerified: user?.isEmailVerified ?? false,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        forgotPassword,
        resetPassword,
        verifyEmail,
        resendVerification,
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
