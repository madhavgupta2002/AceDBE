'use client';

import { useCallback, useEffect, useState } from 'react';
import { supabase } from './supabase';

// Per-user module completion, cached in localStorage and mirrored to Supabase while signed in.
// Shape: { [subjectCode]: { [module]: { video?: true, questions?: true } } }
export type CheckKind = 'video' | 'questions';
export type ModuleProgress = Partial<Record<CheckKind, boolean>>;
export type ProgressMap = Record<string, Record<string, ModuleProgress>>;

const STORAGE_KEY = 'ace_dbe_module_progress';
const CHANGE_EVENT = 'ace_dbe_progress_change';

const read = (): ProgressMap => {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') as ProgressMap;
  } catch {
    return {};
  }
};

const write = (map: ProgressMap) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  window.dispatchEvent(new Event(CHANGE_EVENT));
};

// ── Account sync ──────────────────────────────────────────────────────────────

let syncUserId: string | null = null;

const pushModule = (code: string, module: string, p: ModuleProgress) => {
  if (!supabase || !syncUserId) return;
  void supabase
    .from('module_progress')
    .upsert({ subject_code: code, module, video: !!p.video, questions: !!p.questions, updated_at: new Date().toISOString() })
    .then(({ error }) => error && console.error('Progress sync failed:', error.message));
};

/** Called by AuthProvider. Signing in merges this device's progress with the account; signing out clears it. */
export const setProgressUser = async (userId: string | null) => {
  if (userId === syncUserId) return;
  const wasSignedIn = syncUserId !== null;
  syncUserId = userId;
  if (!userId) {
    if (wasSignedIn) write({});
    return;
  }
  if (!supabase) return;
  const { data, error } = await supabase.from('module_progress').select('subject_code, module, video, questions');
  if (error || syncUserId !== userId) return;

  const map = read();
  const remote = new Set<string>();
  for (const row of data ?? []) {
    remote.add(`${row.subject_code}|${row.module}`);
    const subject = (map[row.subject_code] ??= {});
    const local = subject[row.module];
    const merged = { video: !!(row.video || local?.video), questions: !!(row.questions || local?.questions) };
    if (merged.video !== row.video || merged.questions !== row.questions) pushModule(row.subject_code, row.module, merged);
    if (merged.video || merged.questions) subject[row.module] = merged;
  }
  // Upload what only this device had.
  for (const [code, modules] of Object.entries(map)) {
    for (const [module, p] of Object.entries(modules)) {
      if (!remote.has(`${code}|${module}`)) pushModule(code, module, p);
    }
  }
  write(map);
};

export const isModuleDone = (p?: ModuleProgress) => !!(p?.video && p?.questions);

/** Shared progress state, kept in sync across components and tabs. */
export const useProgress = () => {
  const [progress, setProgress] = useState<ProgressMap>({});

  useEffect(() => {
    const sync = () => setProgress(read());
    sync();
    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  /** Set one or more checks for a module. */
  const setChecks = useCallback((code: string, module: string, checks: ModuleProgress) => {
    const map = read();
    const subject = (map[code] ??= {});
    const next = { ...subject[module], ...checks };
    if (!next.video && !next.questions) delete subject[module];
    else subject[module] = next;
    write(map);
    pushModule(code, module, next);
  }, []);

  return { progress, setChecks };
};

// ── Module lists (numbered keys of each subject's videos.json; extras like live sessions are skipped) ─────

const moduleCache = new Map<string, Promise<string[]>>();

export const fetchModules = (code: string): Promise<string[]> => {
  if (!moduleCache.has(code)) {
    moduleCache.set(
      code,
      fetch(`/data/Subjects/${code}/videos.json`)
        .then(r => (r.ok ? r.json() : {}))
        .then((v: Record<string, unknown>) => Object.keys(v).filter(k => /^\d+(\.\d+)?$/.test(k)))
        .catch(() => []),
    );
  }
  return moduleCache.get(code)!;
};

export const useModules = (codes: string[]) => {
  const [modules, setModules] = useState<Record<string, string[]>>({});
  const key = codes.join(',');

  useEffect(() => {
    let cancelled = false;
    Promise.all(codes.map(c => fetchModules(c).then(m => [c, m] as const))).then(entries => {
      if (!cancelled) setModules(Object.fromEntries(entries));
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return modules;
};
