// Checks the one-time move from a v1.0/1.1 PIN vault: seeds an old-style encrypted vault
// (test data, temp only), opens the built app, types the PIN, and confirms the data arrives.
//   npx electron tools/test-legacy.cjs <outDir>
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const fs = require('node:fs');
const os = require('node:os');
const { webcrypto: c } = require('node:crypto');

const out = process.argv[2] || os.tmpdir();
const b64 = (u) => Buffer.from(u).toString('base64');

async function oldVault(data, pin) {
  const salt = c.getRandomValues(new Uint8Array(16)), iv = c.getRandomValues(new Uint8Array(12));
  const base = await c.subtle.importKey('raw', new TextEncoder().encode(pin), 'PBKDF2', false, ['deriveKey']);
  const key = await c.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: 210000, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt']);
  const ct = await c.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(JSON.stringify(data)));
  return JSON.stringify({ v: 1, salt: b64(salt), iv: b64(iv), ct: b64(new Uint8Array(ct)) });
}

app.whenReady().then(async () => {
  const data = { version: 1, createdAt: new Date().toISOString(), profile: { name: 'Mira', doctorName: '', doctorPhone: '', supportName: '', supportPhone: '', medicalNote: '', medicines: '' },
    settings: { reminders: { enabled: false, checkin: '08:30', breathe1: '11:30', breathe2: '17:30', worry: '19:30', winddown: '22:15' }, voice: true, tone: true, theme: 'light', budgetLevel: 1 },
    sessions: { QS1: { doneAt: new Date().toISOString() } }, surges: [], urges: [], checkins: [], counts: {}, worries: [], breaths: [{ at: new Date().toISOString(), minutes: 5 }],
    measures: [], persistent: {}, entries: {}, safetyEvents: [] };   // no game block, like v1.0
  let vault = await oldVault(data, '2468');
  ipcMain.handle('vault:read', () => vault);
  ipcMain.handle('vault:write', (_e, t) => { vault = t; });
  for (const ch of ['vault:backup', 'vault:restorePick', 'file:export', 'desk:chooseBackupDir']) ipcMain.handle(ch, () => null);
  ipcMain.handle('desk:info', () => ({ dataDir: os.tmpdir(), backupDir: os.tmpdir(), version: 'test' }));
  ipcMain.on('desk:notify', () => {});
  const win = new BrowserWindow({ width: 400, height: 860, show: false, webPreferences: { preload: path.join(__dirname, '..', 'electron', 'preload.cjs'), contextIsolation: true, sandbox: true, offscreen: true, backgroundThrottling: false } });
  await win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  const js = (s) => win.webContents.executeJavaScript(s);
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  await wait(1200);
  fs.writeFileSync(path.join(out, 'legacy_1_screen.png'), (await win.webContents.capturePage()).toPNG());
  const typePin = (p) => js(`(()=>{const el=document.querySelector('input[type=password]');Object.getOwnPropertyDescriptor(el.__proto__,'value').set.call(el,'${p}');el.dispatchEvent(new Event('input',{bubbles:true}));})()`);
  const press = () => js(`[...document.querySelectorAll('button')].find(b=>b.innerText.includes('Bring my progress'))?.click()`);
  await typePin('1111'); await press(); await wait(1500);
  const wrong = await js(`document.body.innerText.includes('did not match')`);
  await typePin('2468'); await press(); await wait(2500);
  const home = await js(`document.querySelector('h1')?.innerText`);
  await wait(800);
  const stored = JSON.parse(vault);
  const result = { wrongPinRejected: wrong, homeTitle: home, nowPlain: !('ct' in stored) && stored.profile?.name === 'Mira', sessionsKept: !!stored.sessions?.QS1, gameAdded: !!stored.game };
  fs.writeFileSync(path.join(out, 'legacy_2_after.png'), (await win.webContents.capturePage()).toPNG());
  console.log('LEGACY', JSON.stringify(result));
  app.exit(result.wrongPinRejected && result.nowPlain && result.sessionsKept && result.gameAdded ? 0 : 1);
});
