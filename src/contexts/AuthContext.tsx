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
      const localUser = localStorage.getItem('mock_user');
      if (localUser) {
        setUser(JSON.parse(localUser));
        setAccessToken('mock-token');
        setLoading(false);
        return;
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

  const createSampleTasks = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const sampleTasks = [
      {
        id: 'sample-1',
        userId: 'mock-user',
        title: 'Finalize Compiler Design Lab',
        description: 'Complete the syntax analyzer module and write test cases for nested loops.',
        dueDate: today.toISOString().split('T')[0],
        category: 'CS-402',
        priority: 'high',
        progress: 45,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'sample-2',
        userId: 'mock-user',
        title: 'Linear Algebra Quiz',
        description: 'Review Eigenvalues and Eigenvectors',
        dueDate: today.toISOString().split('T')[0],
        category: 'MATH-201',
        priority: 'medium',
        progress: 70,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'sample-3',
        userId: 'mock-user',
        title: 'Market Analysis Report',
        description: 'Submit the 2-page report on current inflation trends.',
        dueDate: tomorrow.toISOString().split('T')[0],
        category: 'ECON-101',
        priority: 'medium',
        progress: 30,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'sample-4',
        userId: 'mock-user',
        title: 'History Essay Draft',
        description: 'Write draft for history assignment',
        dueDate: nextWeek.toISOString().split('T')[0],
        category: 'Study',
        priority: 'low',
        progress: 0,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    if (!localStorage.getItem('mock_tasks')) {
      localStorage.setItem('mock_tasks', JSON.stringify(sampleTasks));
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    const username = email || 'user007';
    const mockUser: User = {
      id: 'mock-' + Date.now(),
      email: email || 'user007@example.com',
      user_metadata: { name: name || username }
    };

    createSampleTasks();
    localStorage.setItem('mock_user', JSON.stringify(mockUser));
    setUser(mockUser);
    setAccessToken('mock-token');
  };

  const signIn = async (email: string, password: string) => {
    const username = email || 'user007';
    const mockUser: User = {
      id: 'mock-' + Date.now(),
      email: email || 'user007@example.com',
      user_metadata: { name: username }
    };

    createSampleTasks();
    localStorage.setItem('mock_user', JSON.stringify(mockUser));
    setUser(mockUser);
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
    localStorage.removeItem('mock_user');
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
