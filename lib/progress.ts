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
type SyncStatus = 'local' | 'syncing' | 'synced' | 'error';
type PendingEdit = { checks: ModuleProgress; token: string };
type PendingMap = Record<string, Record<string, PendingEdit>>;
let syncUserId: string | null = null;
let syncStatus: SyncStatus = 'local';
let activeSync: Promise<void> | null = null;
let retryTimer: ReturnType<typeof setTimeout> | undefined;
let retryDelay = 1000;
let generation = 0;

const cacheKey = (userId = syncUserId) => userId ? `${STORAGE_KEY}:${userId}` : STORAGE_KEY;
const pendingKey = (userId: string) => `${cacheKey(userId)}:pending`;
const readJson = <T,>(key: string): T => {
  try { return JSON.parse(localStorage.getItem(key) || '{}') as T; }
  catch { return {} as T; }
};
const read = (): ProgressMap => typeof window === 'undefined' ? {} : readJson<ProgressMap>(cacheKey());
const notify = () => window.dispatchEvent(new Event(CHANGE_EVENT));
const write = (map: ProgressMap) => {
  localStorage.setItem(cacheKey(), JSON.stringify(map));
  notify();
};
const setStatus = (status: SyncStatus) => { syncStatus = status; notify(); };

// Pending edits are kept per account, including explicit false values, until the server accepts them.
// A cloud snapshot replaces a stale cache; only unsaved user edits are applied over that snapshot.
const retryProgressSync = (): Promise<void> => {
  if (!supabase || !syncUserId) return Promise.resolve();
  if (activeSync) return activeSync;
  clearTimeout(retryTimer);
  const userId = syncUserId;
  const currentGeneration = generation;
  const client = supabase;
  const isCurrent = () => syncUserId === userId && generation === currentGeneration;
  setStatus('syncing');
  const run = async () => {
    try {
      const { data, error } = await client.from('module_progress')
        .select('subject_code, module, video, questions').eq('user_id', userId);
      if (error) throw error;
      if (!isCurrent()) return;
      const map: ProgressMap = {};
      for (const row of data ?? []) {
        (map[row.subject_code] ??= {})[row.module] = { video: row.video, questions: row.questions };
      }
      const guestKey = `${pendingKey(userId)}:guest`;
      const guest = readJson<ProgressMap>(guestKey);
      const imported = readJson<PendingMap>(pendingKey(userId));
      for (const [code, modules] of Object.entries(guest)) {
        for (const [module, checks] of Object.entries(modules)) {
          if (!map[code]?.[module] && !imported[code]?.[module]) {
            (imported[code] ??= {})[module] = { checks, token: crypto.randomUUID() };
          }
        }
      }
      localStorage.setItem(pendingKey(userId), JSON.stringify(imported));
      localStorage.removeItem(guestKey);
      // Re-read the queue after each write so edits made during a request are not lost.
      while (isCurrent()) {
        const pending = readJson<PendingMap>(pendingKey(userId));
        const entries = Object.entries(pending).flatMap(([code, modules]) =>
          Object.entries(modules).map(([module, edit]) => ({ code, module, edit })));
        if (!entries.length) { write(map); setStatus('synced'); retryDelay = 1000; return; }
        for (const { code, module, edit } of entries) {
          if (!isCurrent()) return;
          const next = { ...map[code]?.[module], ...edit.checks };
          const { error: saveError } = await client.from('module_progress').upsert({
            user_id: userId, subject_code: code, module,
            video: !!next.video, questions: !!next.questions, updated_at: new Date().toISOString(),
          });
          if (saveError) throw saveError;
          if (!isCurrent()) return;
          (map[code] ??= {})[module] = next;
          const latest = readJson<PendingMap>(pendingKey(userId));
          if (latest[code]?.[module]?.token === edit.token) delete latest[code][module];
          localStorage.setItem(pendingKey(userId), JSON.stringify(latest));
        }
      }
    } catch (error) {
      if (!isCurrent()) return;
      console.error('Progress sync failed:', error);
      setStatus('error');
      retryTimer = setTimeout(() => { void retryProgressSync(); }, retryDelay);
      retryDelay = Math.min(retryDelay * 2, 30000);
    }
  };
  const task = run();
  activeSync = task;
  void task.finally(() => { if (activeSync === task) activeSync = null; });
  return task;
};

/** Load the account's cloud state. Guest progress is imported only for modules absent from the account. */
export const setProgressUser = async (userId: string | null) => {
  if (userId === syncUserId) return;
  if (userId && !syncUserId) {
    const guestKey = `${pendingKey(userId)}:guest`;
    const guest = { ...readJson<ProgressMap>(guestKey), ...read() };
    localStorage.setItem(guestKey, JSON.stringify(guest));
    localStorage.removeItem(STORAGE_KEY);
  }
  generation++;
  clearTimeout(retryTimer);
  activeSync = null;
  syncUserId = userId;
  retryDelay = 1000;
  setStatus(userId ? 'syncing' : 'local');
  await retryProgressSync();
};

export const isModuleDone = (p?: ModuleProgress) => !!(p?.video && p?.questions);

/** Shared progress state, kept in sync across components and tabs. */
export const useProgress = () => {
  const [progress, setProgress] = useState<ProgressMap>({});
  const [status, setSyncStatus] = useState<SyncStatus>('local');
  useEffect(() => {
    const sync = () => { setProgress(read()); setSyncStatus(syncStatus); };
    const online = () => { void retryProgressSync(); };
    sync();
    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener('storage', sync);
    window.addEventListener('online', online);
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener('storage', sync);
      window.removeEventListener('online', online);
    };
  }, []);
  const setChecks = useCallback((code: string, module: string, checks: ModuleProgress) => {
    const map = read();
    const subject = (map[code] ??= {});
    subject[module] = { ...subject[module], ...checks };
    write(map);
    if (syncUserId) {
      const pending = readJson<PendingMap>(pendingKey(syncUserId));
      const modules = (pending[code] ??= {});
      modules[module] = {
        checks: { ...modules[module]?.checks, ...checks },
        token: crypto.randomUUID(),
      };
      localStorage.setItem(pendingKey(syncUserId), JSON.stringify(pending));
      void retryProgressSync();
    }
  }, []);
  return { progress, setChecks, syncStatus: status, retrySync: retryProgressSync };
};

// ── Module lists (numbered keys of each subject's videos.json; extras like live sessions are skipped) ─────

const moduleCache = new Map<string, Promise<string[]>>();

const fetchModules = (code: string): Promise<string[]> => {
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
