// PIN-based encryption of the whole data vault: PBKDF2-SHA256 -> AES-GCM-256 (WebCrypto).

export interface Vault { v: 1; salt: string; iv: string; ct: string }

const ITER = 210_000;
const enc = new TextEncoder();
const dec = new TextDecoder();

const b64 = (b: ArrayBuffer | Uint8Array) => {
  const u = b instanceof Uint8Array ? b : new Uint8Array(b);
  let s = '';
  for (let i = 0; i < u.length; i++) s += String.fromCharCode(u[i]);
  return btoa(s);
};
const unb64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

export async function deriveKey(pin: string, salt: Uint8Array): Promise<CryptoKey> {
  const base = await crypto.subtle.importKey('raw', enc.encode(pin), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: salt as BufferSource, iterations: ITER, hash: 'SHA-256' },
    base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt'],
  );
}

export function newSalt(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(16));
}

export async function seal(data: unknown, key: CryptoKey, salt: Uint8Array): Promise<Vault> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(JSON.stringify(data)));
  return { v: 1, salt: b64(salt), iv: b64(iv), ct: b64(ct) };
}

/** Throws when the PIN is wrong (AES-GCM authentication fails). */
export async function open<T>(vault: Vault, pin: string): Promise<{ data: T; key: CryptoKey; salt: Uint8Array }> {
  const salt = unb64(vault.salt);
  const key = await deriveKey(pin, salt);
  const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(vault.iv) as BufferSource }, key, unb64(vault.ct) as BufferSource);
  return { data: JSON.parse(dec.decode(pt)) as T, key, salt };
}
