import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { Data } from './model';
import { migrate, newData } from './model';
import { open } from './crypto';
import type { Vault } from './crypto';
import { loadRaw, saveRaw } from './storage';

// Data is one plain JSON object kept on the device. No PIN, no account.
// 'legacy' = a PIN-protected vault from v1.0/1.1 waiting to be brought across once.
type Status = 'loading' | 'setup' | 'legacy' | 'open';

interface Ctx {
  status: Status;
  data: Data | null;
  /** apply a change; it is saved shortly after */
  update: (fn: (d: Data) => void) => void;
  create: (d: Data) => Promise<void>;
  /** bring a v1.0/1.1 PIN-protected vault across; false = wrong PIN */
  unlockLegacy: (pin: string) => Promise<boolean>;
  /** replace everything with a backup file (plain, or a legacy one with its PIN) */
  restore: (raw: string, pin?: string) => Promise<'ok' | 'need-pin' | 'bad'>;
  snapshot: () => string | null;
}

const C = createContext<Ctx>(null as unknown as Ctx);
export const useStore = () => useContext(C);

export const isLegacyVault = (o: any): o is Vault => !!o && typeof o === 'object' && 'ct' in o && 'salt' in o;

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<Status>('loading');
  const [data, setData] = useState<Data | null>(null);
  const timer = useRef<number | null>(null);
  const latest = useRef<Data | null>(null);
  const legacy = useRef<Vault | null>(null);

  const persist = useCallback(async () => {
    if (latest.current) await saveRaw(JSON.stringify(latest.current));
  }, []);

  const accept = useCallback((d: Data) => {
    latest.current = migrate(d);
    setData(latest.current);
    setStatus('open');
  }, []);

  useEffect(() => {
    loadRaw().then((raw) => {
      if (!raw) { setStatus('setup'); return; }
      const o = JSON.parse(raw);
      if (isLegacyVault(o)) { legacy.current = o; setStatus('legacy'); }
      else accept(o as Data);
    }).catch(() => setStatus('setup'));
  }, [accept]);

  const update = useCallback((fn: (d: Data) => void) => {
    setData((prev) => {
      if (!prev) return prev;
      const next = structuredClone(prev);
      fn(next);
      latest.current = next;
      return next;
    });
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => { void persist(); }, 400);
  }, [persist]);

  const create = useCallback(async (d: Data) => {
    accept(d);
    await persist();
  }, [accept, persist]);

  const unlockLegacy = useCallback(async (pin: string) => {
    if (!legacy.current) return false;
    try {
      const r = await open<Data>(legacy.current, pin);
      accept(r.data);
      await persist();
      legacy.current = null;
      return true;
    } catch { return false; }
  }, [accept, persist]);

  const restore = useCallback(async (raw: string, pin?: string) => {
    let o: any;
    try { o = JSON.parse(raw); } catch { return 'bad' as const; }
    if (isLegacyVault(o)) {
      if (!pin) return 'need-pin' as const;
      try { accept((await open<Data>(o, pin)).data); } catch { return 'need-pin' as const; }
    } else if (o && o.version === 1 && o.profile) accept(o as Data);
    else return 'bad' as const;
    await persist();
    return 'ok' as const;
  }, [accept, persist]);

  const snapshot = useCallback(() => (latest.current ? JSON.stringify(latest.current) : null), []);

  useEffect(() => {
    const flush = () => { if (document.hidden) void persist(); };
    document.addEventListener('visibilitychange', flush);
    window.addEventListener('beforeunload', () => void persist());
    return () => document.removeEventListener('visibilitychange', flush);
  }, [persist]);

  // screenshot harness only (tools/shoot.cjs opens the page with #shoot)
  if (location.hash === '#shoot') (window as any).__calmUpdate = update;

  return (
    <C.Provider value={{ status, data, update, create, unlockLegacy, restore, snapshot }}>
      {children}
    </C.Provider>
  );
}

export { newData };
