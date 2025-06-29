"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { UserDataForSideMenu } from '@/types';

interface AuthContextType {
  user: UserDataForSideMenu | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => ({ success: false }),
  logout: () => {},
});

const DUMMY_USER = {
  id: 'dummy-id',
  name: 'Admin User',
  email: 'admin@bucks.app',
  avatarUrl: 'https://source.unsplash.com/random/48x48/?user',
  avatarAiHint: 'user avatar',
  moments: [],
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserDataForSideMenu | null>(null);
  const [loading, setLoading] = useState(false);

  // Dummy login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    if (email === 'admin@bucks.app' && password === '123456') {
      setUser(DUMMY_USER);
      setLoading(false);
      return { success: true };
    } else {
      setLoading(false);
      return { success: false, error: 'Invalid credentials' };
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
