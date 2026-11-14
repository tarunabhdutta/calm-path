// Calm Path - PC shell (Electron).
// Data:    %APPDATA%\Calm Path\calmpath.vault   (override: CALMPATH_DATA_DIR)
// Backups: chosen in Settings; default Documents\Calm Path Backups (override: CALMPATH_BACKUP_DIR)
// Self-test: "Calm Path.exe" --self-test  -> writes selftest.json, exit code 0/1
const { app, BrowserWindow, ipcMain, dialog, Notification, shell, Tray, Menu, nativeImage, powerMonitor } = require('electron');
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
// ── Reminders that stay with you (v1.9) ──
// The page hands over its plan; the shell keeps it, fires it on time even with the window closed,
// catches up within 90 minutes after sleep, and opens the right practice when a reminder is clicked.
const HIDDEN = process.argv.includes('--hidden');
let plan = [];
let keepRunning = true;
let quitting = false;
try { const desk = readDesk(); plan = desk.plan || []; keepRunning = desk.keepRunning !== false; } catch { /* first run */ }

function showWin(route) {
  if (!win) return;
  if (win.isMinimized()) win.restore();
  win.show(); win.focus();
  if (route) win.webContents.send('desk:open', route);
}
function remind(title, body, route) {
  if (!Notification.isSupported()) return;
  const n = new Notification({ title, body, silent: false, icon: path.join(__dirname, '..', 'build', 'icon.png') });
  n.on('click', () => showWin(route));
  n.show();
}
ipcMain.on('desk:notify', (_e, title, body, route) => remind(title, body, route));

const dayKey = (t) => { const d = new Date(t); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; };
function checkReminders() {
  if (SELF_TEST || !plan.length) return;
  const now = Date.now();
  const desk = readDesk();
  const fired = desk.fired || {};
  let changed = false;
  for (const p of plan) {
    let due;
    if (p.daily) {
      const [h, m] = String(p.daily).split(':').map(Number);
      const t = new Date(); t.setHours(h, m, 0, 0); due = t.getTime();
    } else due = p.at;
    if (!due || now < due || now - due > 90 * 60_000) continue;
    const key = p.daily ? `${p.id}@${dayKey(due)}` : `${p.id}@${p.at}`;
    if (fired[key]) continue;
    fired[key] = now; changed = true;
    remind(p.title, p.body, JSON.stringify(p.route));
  }
  if (changed) {
    for (const k of Object.keys(fired)) if (now - fired[k] > 3 * 86_400_000) delete fired[k];
    desk.fired = fired; writeDesk(desk);
  }
}
ipcMain.on('desk:schedule', (_e, planJson, opts) => {
  try { plan = opts.enabled ? JSON.parse(planJson) : []; } catch { plan = []; }
  keepRunning = !!opts.enabled;
  const desk = readDesk(); desk.plan = plan; desk.keepRunning = keepRunning; writeDesk(desk);
  if (app.isPackaged && !SELF_TEST) app.setLoginItemSettings({ openAtLogin: !!(opts.enabled && opts.startWithPc), args: ['--hidden'] });
  tray?.setToolTip(keepRunning ? 'Calm Path: reminders are on' : 'Calm Path');
  checkReminders();
});

let tray = null;
function makeTray() {
  if (SELF_TEST || tray) return;
  const img = nativeImage.createFromPath(path.join(__dirname, '..', 'build', 'icon.png')).resize({ width: 16, height: 16 });
  tray = new Tray(img);
  tray.setToolTip(keepRunning ? 'Calm Path: reminders are on' : 'Calm Path');
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: 'Open Calm Path', click: () => showWin() },
    { label: 'SURGE: help right now', click: () => showWin(JSON.stringify({ name: 'surge' })) },
    { label: 'Slow breathing', click: () => showWin(JSON.stringify({ name: 'breathe' })) },
    { type: 'separator' },
    { label: 'Quit (reminders stop until you open it again)', click: () => { quitting = true; app.quit(); } },
  ]));
  tray.on('click', () => showWin());
}

let win = null;
function createWindow() {
  win = new BrowserWindow({
    width: 560, height: 920, minWidth: 380, minHeight: 600,
    title: 'Calm Path', backgroundColor: '#f4f7f3', autoHideMenuBar: true, show: !SELF_TEST && !HIDDEN,
    icon: path.join(__dirname, '..', 'build', 'icon.png'),
    webPreferences: { preload: path.join(__dirname, 'preload.cjs'), contextIsolation: true, nodeIntegration: false, sandbox: true },
  });
  win.removeMenu();
  // links (tel:, https:) never open inside the app
  win.webContents.setWindowOpenHandler(({ url }) => { if (/^https?:/.test(url)) shell.openExternal(url); return { action: 'deny' }; });
  win.webContents.on('will-navigate', (e, url) => { if (!url.startsWith('file:')) e.preventDefault(); });
  win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  // closing the window keeps Calm Path in the tray while reminders are on (said once, in a reminder)
  win.on('close', (e) => {
    if (quitting || SELF_TEST || !keepRunning) return;
    e.preventDefault(); win.hide();
    const desk = readDesk();
    if (!desk.trayTold) { desk.trayTold = true; writeDesk(desk); remind('Calm Path is still here', 'It waits quietly near the clock to bring your reminders. Right-click its icon to quit.'); }
  });

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
  app.on('second-instance', () => showWin());
  app.setAppUserModelId('com.tdfilmstudio.calmpath');
  app.whenReady().then(() => {
    createWindow();
    makeTray();
    autoBackup();
    setInterval(autoBackup, 3600_000);
    setInterval(checkReminders, 30_000);
    setTimeout(checkReminders, 5_000);
    powerMonitor.on('resume', () => setTimeout(checkReminders, 3_000));
  });
  app.on('before-quit', () => { quitting = true; });
  app.on('window-all-closed', () => { if (!keepRunning || SELF_TEST) app.quit(); });
}
