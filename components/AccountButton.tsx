'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { History, Loader2, LogIn, LogOut, UserRound, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Modal from './Modal';
import Button from './Button';

type Mode = 'login' | 'signup';

/**
 * Header account control: a Log in button that opens the login / sign-up dialog, or the signed-in username.
 * `inline` renders the user menu in flow (for the mobile menu); `onNavigate` fires when a menu link is used;
 * `onOpen` fires when the login dialog opens (so a parent menu can close).
 */
const AccountButton: React.FC<{
  className: string;
  inline?: boolean;
  onNavigate?: () => void;
  onOpen?: () => void;
}> = ({ className, inline = false, onNavigate, onOpen }) => {
  const { enabled, authReady, user, username, signIn, signUp, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  if (!enabled) return null;

  // Same size as the Log in button, so the header doesn't jump or flash "Log in" for signed-in users.
  if (!authReady) {
    return (
      <span className={`${className} invisible`} aria-hidden="true">
        <LogIn className="h-4 w-4" />
        Log in
      </span>
    );
  }

  if (user) {
    const itemCls =
      'w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-slate-300 hover:bg-surface-light hover:text-white';
    return (
      <div ref={wrapRef} className={inline ? '' : 'relative'}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={className}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
        >
          <UserRound className="h-4 w-4" />
          {username}
        </button>
        {menuOpen && (
          <div
            role="menu"
            className={
              inline
                ? 'mt-1 ml-3 border-l border-surface-border pl-2 space-y-0.5'
                : 'absolute right-0 mt-1 w-44 rounded-lg border border-surface-border bg-surface p-1 shadow-xl z-dropdown'
            }
          >
            <Link
              href="/history"
              role="menuitem"
              onClick={() => {
                setMenuOpen(false);
                onNavigate?.();
              }}
              className={itemCls}
            >
              <History className="h-4 w-4" /> Quiz history
            </Link>
            <button
              role="menuitem"
              onClick={() => {
                setMenuOpen(false);
                onNavigate?.();
                void signOut();
              }}
              className={itemCls}
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
      <button
        onClick={() => {
          setOpen(true);
          onOpen?.();
        }}
        className={className}
        aria-haspopup="dialog"
      >
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
  const titleId = useId();

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
      active ? 'bg-surface-border text-white' : 'text-slate-400 hover:text-white'
    }`;
  const inputCls =
    'mt-1 w-full bg-surface-light border border-surface-border rounded-md px-3 py-2 text-sm text-white outline-none focus:border-emerald-500';

  return (
    <Modal onClose={onClose} labelledBy={titleId}>
      <form onSubmit={submit} className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 id={titleId} className="text-base font-bold text-white">{mode === 'login' ? 'Log in' : 'Create account'}</h2>
          <button type="button" onClick={onClose} className="p-2 -m-2 text-slate-400 hover:text-white" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex gap-1 p-1 bg-surface-dark rounded-lg">
          <button type="button" className={tabCls(mode === 'login')} onClick={() => { setMode('login'); setError(null); }}>
            Log in
          </button>
          <button type="button" className={tabCls(mode === 'signup')} onClick={() => { setMode('signup'); setError(null); }}>
            Sign up
          </button>
        </div>

        <label className="block">
          <span className="text-xs text-slate-400">Username</span>
          <span className="block text-[11px] text-slate-400">Your IIMB id: firstname.lastname25</span>
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

        <div aria-live="polite">{error && <p role="alert" className="text-xs text-red-300">{error}</p>}</div>

        <Button type="submit" variant="primary" disabled={busy || !username || !password} className="w-full">
          {busy && <Loader2 className="w-4 h-4 animate-spin" />}
          {mode === 'login' ? 'Log in' : 'Create account'}
        </Button>
      </form>
    </Modal>
  );
}

export default AccountButton;
