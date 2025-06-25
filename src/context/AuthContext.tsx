
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import type { UserDataForSideMenu } from '@/types';

interface AuthContextType {
  user: UserDataForSideMenu | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserDataForSideMenu | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const avatarAiHint = 'user avatar';
        setUser({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'Bucks User',
          email: firebaseUser.email || '',
          avatarUrl: firebaseUser.photoURL || `https://source.unsplash.com/random/48x48/?${avatarAiHint.split(' ').join(',')}`,
          avatarAiHint: avatarAiHint,
          moments: [],
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
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
