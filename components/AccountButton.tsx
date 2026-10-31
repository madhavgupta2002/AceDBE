'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { History, Loader2, LogIn, LogOut, UserRound, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

type Mode = 'login' | 'signup';

/** Header account control: a Log in button that opens the login / sign-up dialog, or the signed-in username. */
const AccountButton: React.FC<{ className: string }> = ({ className }) => {
  const { enabled, user, username, signIn, signUp, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  if (!enabled) return null;

  if (user) {
    return (
      <div className="relative">
        <button onClick={() => setMenuOpen(!menuOpen)} className={className} aria-expanded={menuOpen}>
          <UserRound className="h-4 w-4" />
          {username}
        </button>
        {menuOpen && (
          <div className="absolute right-0 mt-1 w-44 rounded-lg border border-slate-700 bg-slate-900 p-1 shadow-xl z-20">
            <Link
              href="/history"
              onClick={() => setMenuOpen(false)}
              className="w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <History className="h-4 w-4" /> Quiz history
            </Link>
            <button
              onClick={() => {
                setMenuOpen(false);
                void signOut();
              }}
              className="w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className={className}>
        <LogIn className="h-4 w-4" />
        Log in
      </button>
      {open && <AuthDialog onClose={() => setOpen(false)} signIn={signIn} signUp={signUp} />}
    </>
  );
};

function AuthDialog({
  onClose,
  signIn,
  signUp,
}: {
  onClose: () => void;
  signIn: (u: string, p: string) => Promise<string | null>;
  signUp: (u: string, p: string) => Promise<string | null>;
}) {
  const [mode, setMode] = useState<Mode>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const err = await (mode === 'login' ? signIn : signUp)(username, password);
    setBusy(false);
    if (err) setError(err);
    else onClose();
  };

  const tabCls = (active: boolean) =>
    `flex-1 py-1.5 rounded-md text-sm font-semibold transition-colors ${
      active ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
    }`;
  const inputCls =
    'mt-1 w-full bg-slate-800 border border-slate-600 rounded-md px-3 py-2 text-sm text-white outline-none focus:border-emerald-500';

  // Portal: the sticky header uses backdrop-blur, which would otherwise trap this fixed overlay inside it.
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <form
        onSubmit={submit}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-5 space-y-4 text-slate-200"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">{mode === 'login' ? 'Log in' : 'Create account'}</h2>
          <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-white" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex gap-1 p-1 bg-slate-800/70 rounded-lg">
          <button type="button" className={tabCls(mode === 'login')} onClick={() => { setMode('login'); setError(null); }}>
            Log in
          </button>
          <button type="button" className={tabCls(mode === 'signup')} onClick={() => { setMode('signup'); setError(null); }}>
            Sign up
          </button>
        </div>

        <label className="block">
          <span className="text-xs text-slate-400">Username</span>
          <span className="block text-[11px] text-slate-500">Your IIMB id: firstname.lastname + batch year, e.g. firstname.lastname25</span>
          <input
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="firstname.lastname25"
            autoComplete="username"
            autoCapitalize="none"
            autoFocus
            className={inputCls}
          />
        </label>
        <label className="block">
          <span className="text-xs text-slate-400">Password</span>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            className={inputCls}
          />
        </label>

        {error && <p className="text-xs text-red-300">{error}</p>}

        <button
          type="submit"
          disabled={busy || !username || !password}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 text-sm font-bold"
        >
          {busy && <Loader2 className="w-4 h-4 animate-spin" />}
          {mode === 'login' ? 'Log in' : 'Create account'}
        </button>
        <p className="text-[11px] text-slate-500 text-center">
          Optional. Signing in saves your tracker progress and quiz history to your account.
        </p>
      </form>
    </div>,
    document.body,
  );
}

export default AccountButton;
