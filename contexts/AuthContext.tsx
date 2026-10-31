'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { batchForUsername, emailToUsername, normalizeUsername, supabase, USERNAME_PATTERN, usernameToEmail } from '@/lib/supabase';
import { setProgressUser } from '@/lib/progress';
import { useBatch } from './BatchContext';

interface AuthContextType {
  /** False when Supabase isn't configured; the account UI is hidden. */
  enabled: boolean;
  user: User | null;
  username: string;
  /** Both resolve to an error message, or null on success. */
  signIn: (username: string, password: string) => Promise<string | null>;
  signUp: (username: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  enabled: false,
  user: null,
  username: '',
  signIn: async () => 'Accounts are not available.',
  signUp: async () => 'Accounts are not available.',
  signOut: async () => {},
});

const USERNAME_HINT = 'Use the format name.surname25 (lowercase letters, a dot, and your 2-digit year).';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const { setSelectedBatch } = useBatch();

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    void setProgressUser(user?.id ?? null);
  }, [user?.id]);

  const applyDefaultBatch = (username: string) => {
    const batch = batchForUsername(username);
    if (batch) setSelectedBatch(batch);
  };

  const signIn = async (raw: string, password: string) => {
    if (!supabase) return 'Accounts are not available.';
    const username = normalizeUsername(raw);
    if (!USERNAME_PATTERN.test(username)) return USERNAME_HINT;
    const { error } = await supabase.auth.signInWithPassword({ email: usernameToEmail(username), password });
    if (error) return error.message === 'Invalid login credentials' ? 'Wrong username or password.' : error.message;
    applyDefaultBatch(username);
    return null;
  };

  const signUp = async (raw: string, password: string) => {
    if (!supabase) return 'Accounts are not available.';
    const username = normalizeUsername(raw);
    if (!USERNAME_PATTERN.test(username)) return USERNAME_HINT;
    if (password.length < 6) return 'Password must be at least 6 characters.';
    const { data, error } = await supabase.auth.signUp({ email: usernameToEmail(username), password });
    if (error) return /already registered/i.test(error.message) ? 'That username is already taken.' : error.message;
    if (!data.session) {
      // With "Confirm email" on, Supabase hides duplicates and returns no session.
      return 'Could not create the account. The username may already be taken.';
    }
    applyDefaultBatch(username);
    return null;
  };

  const signOut = async () => {
    await supabase?.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{ enabled: !!supabase, user, username: emailToUsername(user?.email), signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
