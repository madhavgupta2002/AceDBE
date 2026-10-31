import { createClient, SupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/** Browser client; null when the env vars are missing, in which case accounts are hidden and everything stays local. */
export const supabase: SupabaseClient | null = url && key ? createClient(url, key) : null;

// ── Usernames ─────────────────────────────────────────────────────────────────
// Format: name.surnameYY (e.g. firstname.lastname25). Supabase Auth needs an email, so the username is stored as
// "<username>@acedbe.app". That address is never mailed ("Confirm email" is off in the project).
export const USERNAME_PATTERN = /^[a-z]+(\.[a-z]+)+[0-9]{2}$/;
const EMAIL_DOMAIN = 'acedbe.app';

export const normalizeUsername = (raw: string) => raw.trim().toLowerCase();
export const usernameToEmail = (username: string) => `${username}@${EMAIL_DOMAIN}`;
export const emailToUsername = (email?: string | null) => (email ? email.split('@')[0] : '');

// Year suffix → batch: 24 → 1, 25 → 2, 26 → 3.
const BATCH_BY_YEAR: Record<string, number> = { '24': 1, '25': 2, '26': 3 };
export const batchForUsername = (username: string): number | undefined => BATCH_BY_YEAR[username.slice(-2)];
