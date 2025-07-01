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

// Default user state with empty values
const DEFAULT_USER = {
  id: '',
  name: '',
  email: '',
  avatarUrl: '',
  avatarAiHint: '',
  moments: [],
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserDataForSideMenu | null>(null);
  const [loading, setLoading] = useState(false);

  // Use Supabase authentication
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setLoading(false);
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Fetch user profile data from Supabase
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError || !profileData) {
          console.error('Error fetching user profile:', profileError);
          // Create a basic user object with just the data from auth
          setUser({
            id: data.user.id,
            name: data.user.user_metadata?.name || email.split('@')[0],
            email: data.user.email || '',
            avatarUrl: data.user.user_metadata?.avatar_url || '',
            avatarAiHint: '',
            moments: [],
          });
        } else {
          // Use the profile data from the database
          setUser({
            id: data.user.id,
            name: profileData.name || data.user.user_metadata?.name || email.split('@')[0],
            email: data.user.email || '',
            avatarUrl: profileData.avatarUrl || data.user.user_metadata?.avatar_url || '',
            avatarAiHint: profileData.avatarAiHint || '',
            moments: profileData.moments || [],
          });
        }

        setLoading(false);
        return { success: true };
      }

      setLoading(false);
      return { success: false, error: 'Login failed' };
    } catch (error: any) {
      console.error('Login error:', error);
      setLoading(false);
      return { success: false, error: error.message || 'An unknown error occurred' };
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
      }
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Fetch user profile data
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          setUser({
            id: session.user.id,
            name: profileData?.name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || '',
            email: session.user.email || '',
            avatarUrl: profileData?.avatarUrl || session.user.user_metadata?.avatar_url || '',
            avatarAiHint: profileData?.avatarAiHint || '',
            moments: profileData?.moments || [],
          });
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          // User signed in, update the user state
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          setUser({
            id: session.user.id,
            name: profileData?.name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || '',
            email: session.user.email || '',
            avatarUrl: profileData?.avatarUrl || session.user.user_metadata?.avatar_url || '',
            avatarAiHint: profileData?.avatarAiHint || '',
            moments: profileData?.moments || [],
          });
        } else if (event === 'SIGNED_OUT') {
          // User signed out, clear the user state
          setUser(null);
        }
      }
    );
    
    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
