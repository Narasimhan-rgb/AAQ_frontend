import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    // 1. Check for custom backend JWT (Email Auth)
    const token = localStorage.getItem('aaq_token');
    if (token) {
      const email = localStorage.getItem('aaq_user_email');
      setUser({ email, provider: 'email' });
      setLoading(false);
      return;
    }

    // 2. Check Supabase (GitHub Auth)
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
    setLoading(false);
  };

  useEffect(() => {
    checkAuth();

    // Listen to Supabase auth changes (for GitHub flow)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      // Only set user from Supabase if we aren't logged in via email
      if (!localStorage.getItem('aaq_token')) {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    signUp: async (data) => {
      try {
        const response = await fetch('http://localhost:8000/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: data.email, password: data.password })
        });
        if (!response.ok) {
          const err = await response.json();
          return { error: { message: err.detail || 'Signup failed' } };
        }
        const result = await response.json();
        localStorage.setItem('aaq_token', result.access_token);
        localStorage.setItem('aaq_user_email', result.user.email);
        setUser({ email: result.user.email, provider: 'email' });
        return { data: { user: result.user }, error: null };
      } catch (err) {
        return { error: { message: 'Network error connecting to backend.' } };
      }
    },
    signIn: async (data) => {
      try {
        const response = await fetch('http://localhost:8000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: data.email, password: data.password })
        });
        if (!response.ok) {
          const err = await response.json();
          return { error: { message: err.detail || 'Login failed' } };
        }
        const result = await response.json();
        localStorage.setItem('aaq_token', result.access_token);
        localStorage.setItem('aaq_user_email', result.user.email);
        setUser({ email: result.user.email, provider: 'email' });
        return { data: { user: result.user }, error: null };
      } catch (err) {
        return { error: { message: 'Network error connecting to backend.' } };
      }
    },
    signInWithGithub: () => supabase.auth.signInWithOAuth({ 
      provider: 'github',
      options: {
        redirectTo: window.location.origin + '/datasets'
      }
    }),
    signOut: async () => {
      localStorage.removeItem('aaq_token');
      localStorage.removeItem('aaq_user_email');
      await supabase.auth.signOut();
      setUser(null);
    },
    user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
