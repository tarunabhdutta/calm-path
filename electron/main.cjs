// Calm Path - PC shell (Electron).
// Data:    %APPDATA%\Calm Path\calmpath.vault   (override: CALMPATH_DATA_DIR)
// Backups: chosen in Settings; default Documents\Calm Path Backups (override: CALMPATH_BACKUP_DIR)
// Self-test: "Calm Path.exe" --self-test  -> writes selftest.json, exit code 0/1
const { app, BrowserWindow, ipcMain, dialog, Notification, shell } = require('electron');
const path = require('node:path');
const fs = require('node:fs');
const os = require('node:os');

const SELF_TEST = process.argv.includes('--self-test');
if (SELF_TEST) process.env.CALMPATH_DATA_DIR ||= fs.mkdtempSync(path.join(os.tmpdir(), 'calmpath-selftest-'));

const dataDir = process.env.CALMPATH_DATA_DIR || path.join(app.getPath('appData'), 'Calm Path');
fs.mkdirSync(dataDir, { recursive: true });
// v1.0/1.1 kept data under an older folder name: move it across once.
if (!process.env.CALMPATH_DATA_DIR) {
  const old = path.join(app.getPath('appData'), 'Himakhi Calm Path');
  for (const f of ['calmpath.vault', 'desk.json']) {
    try { if (fs.existsSync(path.join(old, f)) && !fs.existsSync(path.join(dataDir, f))) fs.copyFileSync(path.join(old, f), path.join(dataDir, f)); } catch { /* ignore */ }
  }
}
const vaultFile = path.join(dataDir, 'calmpath.vault');
const deskFile = path.join(dataDir, 'desk.json');

function readDesk() {
  try { return JSON.parse(fs.readFileSync(deskFile, 'utf8')); } catch { return {}; }
}
function writeDesk(d) { fs.writeFileSync(deskFile, JSON.stringify(d, null, 2)); }

function backupDir() {
  if (process.env.CALMPATH_BACKUP_DIR) return process.env.CALMPATH_BACKUP_DIR;
  const d = readDesk();
  if (d.backupDir) return d.backupDir;
  return path.join(app.getPath('documents'), 'Calm Path Backups');
}

function writeAtomic(file, text) {
  const tmp = file + '.tmp';
  fs.writeFileSync(tmp, text);
  if (fs.existsSync(file)) fs.copyFileSync(file, file + '.prev');
  fs.renameSync(tmp, file);
}

function stamp() {
  const d = new Date(); const z = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}_${z(d.getHours())}${z(d.getMinutes())}`;
}

function makeBackup(text) {
  const dir = backupDir();
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `CalmPath_${stamp()}.calmpath`);
  fs.writeFileSync(file, text);
  // keep the newest 30
  const all = fs.readdirSync(dir).filter((f) => /^CalmPath_.*\.calmpath$/.test(f)).sort();
  for (const old of all.slice(0, Math.max(0, all.length - 30))) fs.unlinkSync(path.join(dir, old));
  const desk = readDesk(); desk.lastBackup = Date.now(); writeDesk(desk);
  return file;
}

function autoBackup() {
  if (SELF_TEST || !fs.existsSync(vaultFile)) return;
  const last = readDesk().lastBackup || 0;
  if (Date.now() - last > 20 * 3600_000) {
    try { makeBackup(fs.readFileSync(vaultFile, 'utf8')); } catch (e) { console.error('auto-backup failed', e); }
  }
}

ipcMain.handle('vault:read', () => (fs.existsSync(vaultFile) ? fs.readFileSync(vaultFile, 'utf8') : null));
ipcMain.handle('vault:write', (_e, text) => { writeAtomic(vaultFile, text); });
ipcMain.handle('vault:backup', (_e, text) => makeBackup(text));
ipcMain.handle('vault:restorePick', async () => {
  const r = await dialog.showOpenDialog({ title: 'Choose a Calm Path backup', defaultPath: backupDir(), filters: [{ name: 'Calm Path backup', extensions: ['calmpath'] }], properties: ['openFile'] });
  return r.canceled || !r.filePaths[0] ? null : fs.readFileSync(r.filePaths[0], 'utf8');
});
ipcMain.handle('file:export', async (_e, name, text) => {
  const r = await dialog.showSaveDialog({ defaultPath: path.join(app.getPath('documents'), name) });
  if (r.canceled || !r.filePath) return null;
  fs.writeFileSync(r.filePath, text);
  return r.filePath;
});
ipcMain.handle('desk:info', () => ({ dataDir, backupDir: backupDir(), version: app.getVersion() }));
ipcMain.handle('desk:chooseBackupDir', async () => {
  const r = await dialog.showOpenDialog({ title: 'Choose the backup folder', defaultPath: backupDir(), properties: ['openDirectory', 'createDirectory'] });
  if (r.canceled || !r.filePaths[0]) return null;
  const desk = readDesk(); desk.backupDir = r.filePaths[0]; writeDesk(desk);
  return r.filePaths[0];
});
ipcMain.on('desk:notify', (_e, title, body) => { if (Notification.isSupported()) new Notification({ title, body, silent: true }).show(); });

let win = null;
function createWindow() {
  win = new BrowserWindow({
    width: 560, height: 920, minWidth: 380, minHeight: 600,
    title: 'Calm Path', backgroundColor: '#f4f7f3', autoHideMenuBar: true, show: !SELF_TEST,
    icon: path.join(__dirname, '..', 'build', 'icon.png'),
    webPreferences: { preload: path.join(__dirname, 'preload.cjs'), contextIsolation: true, nodeIntegration: false, sandbox: true },
  });
  win.removeMenu();
  // links (tel:, https:) never open inside the app
  win.webContents.setWindowOpenHandler(({ url }) => { if (/^https?:/.test(url)) shell.openExternal(url); return { action: 'deny' }; });
  win.webContents.on('will-navigate', (e, url) => { if (!url.startsWith('file:')) e.preventDefault(); });
  win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));

  if (SELF_TEST) {
    win.webContents.on('did-finish-load', async () => {
      let result;
      try { result = await win.webContents.executeJavaScript('window.__calmSelfTest()'); }
      catch (e) { result = { pass: false, checks: [{ name: 'renderer loaded', ok: false, detail: String(e) }] }; }
      result.checks.unshift({ name: 'packaged window loaded dist/index.html', ok: true });
      const out = process.env.CALMPATH_SELFTEST_OUT || path.join(dataDir, 'selftest.json');
      fs.writeFileSync(out, JSON.stringify({ ...result, dataDir, version: app.getVersion() }, null, 2));
      process.stdout.write(`SELFTEST ${result.pass ? 'PASS' : 'FAIL'} (${result.checks.filter((c) => c.ok).length}/${result.checks.length}) -> ${out}\n`);
      app.exit(result.pass ? 0 : 1);
    });
    win.webContents.on('did-fail-load', (_e, code, desc) => {
      fs.writeFileSync(process.env.CALMPATH_SELFTEST_OUT || path.join(dataDir, 'selftest.json'), JSON.stringify({ pass: false, error: desc, code }));
      app.exit(1);
    });
  }
}

if (!SELF_TEST && !app.requestSingleInstanceLock()) app.quit();
else {
  app.on('second-instance', () => { if (win) { if (win.isMinimized()) win.restore(); win.focus(); } });
  app.setAppUserModelId('com.tdfilmstudio.calmpath');
  app.whenReady().then(() => {
    createWindow();
    autoBackup();
    setInterval(autoBackup, 3600_000);
  });
  app.on('window-all-closed', () => app.quit());
}
