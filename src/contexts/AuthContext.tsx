import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, API_URL } from '../utils/supabase/client';
import { publicAnonKey } from '../utils/supabase/info';

interface User {
  id: string;
  email: string;
  user_metadata: {
    name?: string;
  };
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithOAuth: (provider: 'google' | 'apple' | 'azure') => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user as User);
        setAccessToken(session.access_token);
      } else {
        setUser(null);
        setAccessToken(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    try {
      const currentUserId = localStorage.getItem('current_user_id');
      if (currentUserId) {
        const users = JSON.parse(localStorage.getItem('app_users') || '[]');
        const user = users.find((u: any) => u.id === currentUserId);
        if (user) {
          setUser({
            id: user.id,
            email: user.email,
            user_metadata: { name: user.name }
          });
          setAccessToken('mock-token');
          setLoading(false);
          return;
        }
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user as User);
        setAccessToken(session.access_token);
      }
    } catch (error) {
      console.error('Error checking user session:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeUserData = (userId: string) => {
    // Initialize empty data for new user
    const userTasksKey = `user_${userId}_tasks`;
    const userCompletedKey = `user_${userId}_completed_tasks_count`;
    const userPortfolioAboutKey = `user_${userId}_portfolio_about_me`;
    const userPortfolioSkillsKey = `user_${userId}_portfolio_skills`;

    // Only initialize if doesn't exist
    if (!localStorage.getItem(userTasksKey)) {
      localStorage.setItem(userTasksKey, JSON.stringify([]));
    }
    if (!localStorage.getItem(userCompletedKey)) {
      localStorage.setItem(userCompletedKey, '0');
    }
    if (!localStorage.getItem(userPortfolioAboutKey)) {
      localStorage.setItem(userPortfolioAboutKey, '');
    }
    if (!localStorage.getItem(userPortfolioSkillsKey)) {
      localStorage.setItem(userPortfolioSkillsKey, JSON.stringify([]));
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Get existing users
    const users = JSON.parse(localStorage.getItem('app_users') || '[]');

    // Check if user already exists
    const existingUser = users.find((u: any) => u.email === email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Create new user
    const userId = 'user-' + Date.now();
    const newUser = {
      id: userId,
      email: email,
      password: password, // In real app, this should be hashed
      name: name || email.split('@')[0],
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('app_users', JSON.stringify(users));

    // Set current user
    localStorage.setItem('current_user_id', userId);

    // Initialize empty user data
    initializeUserData(userId);

    setUser({
      id: userId,
      email: email,
      user_metadata: { name: newUser.name }
    });
    setAccessToken('mock-token');
  };

  const signIn = async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Get existing users
    const users = JSON.parse(localStorage.getItem('app_users') || '[]');

    // Find user
    const user = users.find((u: any) => u.email === email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check password
    if (user.password !== password) {
      throw new Error('Invalid email or password');
    }

    // Set current user
    localStorage.setItem('current_user_id', user.id);

    setUser({
      id: user.id,
      email: user.email,
      user_metadata: { name: user.name }
    });
    setAccessToken('mock-token');
  };

  const signInWithOAuth = async (provider: 'google' | 'apple' | 'azure') => {
    const mockUser: User = {
      id: 'mock-oauth-' + Date.now(),
      email: 'user007@example.com',
      user_metadata: { name: 'user007' }
    };

    createSampleTasks();
    localStorage.setItem('mock_user', JSON.stringify(mockUser));
    setUser(mockUser);
    setAccessToken('mock-token');
  };

  const signOut = async () => {
    localStorage.removeItem('current_user_id');
    setUser(null);
    setAccessToken(null);
  };

  const value = {
    user,
    accessToken,
    loading,
    signUp,
    signIn,
    signInWithOAuth,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
