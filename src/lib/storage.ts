// Where the data lives (plain JSON, on this device only).
//  - PC (Electron): a file in the data folder, through the preload bridge (window.calmDesk).
//  - Phone (Android app), web version and browser preview: IndexedDB.

export interface DeskBridge {
  readVault(): Promise<string | null>;
  writeVault(json: string): Promise<void>;
  backup(json: string): Promise<string>;          // returns the backup file path
  restorePick(): Promise<string | null>;          // returns file contents
  exportFile(name: string, json: string): Promise<string | null>;
  info(): Promise<{ dataDir: string; backupDir: string; version: string }>;
  chooseBackupDir(): Promise<string | null>;
  notify(title: string, body: string): void;
}

declare global {
  interface Window { calmDesk?: DeskBridge; Capacitor?: any }
}

export const isDesk = () => !!window.calmDesk;
export const isNative = () => !!window.Capacitor?.isNativePlatform?.();

const DB = 'calmpath';
const STORE = 'vault';

function idb(): Promise<IDBDatabase> {
  return new Promise((res, rej) => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => r.result.createObjectStore(STORE);
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}

async function idbGet(): Promise<string | null> {
  const db = await idb();
  return new Promise((res, rej) => {
    const q = db.transaction(STORE).objectStore(STORE).get('main');
    q.onsuccess = () => res((q.result as string) ?? null);
    q.onerror = () => rej(q.error);
  });
}

async function idbPut(v: string): Promise<void> {
  const db = await idb();
  return new Promise((res, rej) => {
    const t = db.transaction(STORE, 'readwrite');
    t.objectStore(STORE).put(v, 'main');
    t.oncomplete = () => res();
    t.onerror = () => rej(t.error);
  });
}

export async function loadRaw(): Promise<string | null> {
  return isDesk() ? window.calmDesk!.readVault() : idbGet();
}

export async function saveRaw(raw: string): Promise<void> {
  if (isDesk()) await window.calmDesk!.writeVault(raw);
  else await idbPut(raw);
}

/** Saves a backup file. PC: the backup folder. Phone: Documents. Web: a download. */
export async function backupRaw(raw: string): Promise<string> {
  if (isDesk()) return window.calmDesk!.backup(raw);
  const name = `CalmPath_backup_${new Date().toISOString().slice(0, 10)}.calmpath`;
  if (isNative()) {
    const fs = window.Capacitor?.Plugins?.Filesystem;
    if (fs) {
      await fs.writeFile({ path: name, data: raw, directory: 'DOCUMENTS', encoding: 'utf8' });
      return `Documents/${name}`;
    }
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([raw], { type: 'application/json' }));
  a.download = name;
  a.click();
  return name;
}
