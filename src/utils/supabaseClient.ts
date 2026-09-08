import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'hosny-clinic-auth'
  }
});

/**
 * Staff stay signed in for 48 hours, then must log in again.
 * Supabase refreshes tokens indefinitely on its own, so we enforce the cap
 * ourselves by stamping the first sign-in and checking it on load.
 */
export const SESSION_MAX_AGE_MS = 48 * 60 * 60 * 1000;
const SESSION_START_KEY = 'hosny-clinic-session-start';

export const markSessionStart = () => {
  localStorage.setItem(SESSION_START_KEY, String(Date.now()));
};

export const clearSessionStart = () => {
  localStorage.removeItem(SESSION_START_KEY);
};

/** True when the 48-hour window has elapsed since the user first signed in. */
export const isSessionExpired = (): boolean => {
  const started = localStorage.getItem(SESSION_START_KEY);
  if (!started) return false;
  return Date.now() - Number(started) > SESSION_MAX_AGE_MS;
};

export const ATTACHMENTS_BUCKET = 'patient-attachments';
export const AVATARS_BUCKET = 'avatars';
