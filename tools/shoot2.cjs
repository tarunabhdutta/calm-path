// Screenshot harness, part 2 (v1.3 screens): lessons with animated art, Body Lab, Sound Garden,
// Theory A/B, struggle switch, leaves, fear loop, family, hospital card, check-in diary.
// Temp test data only (law E-04).   npx electron tools/shoot2.cjs <outDir>
const { app, BrowserWindow, ipcMain, nativeTheme } = require('electron');
const path = require('node:path');
const fs = require('node:fs');
const os = require('node:os');
nativeTheme.themeSource = process.env.SHOOT_THEME || 'light';

const out = process.argv[2] || path.join(os.tmpdir(), 'calmpath-shots2');
fs.mkdirSync(out, { recursive: true });
let vault = null;
ipcMain.handle('vault:read', () => vault);
ipcMain.handle('vault:write', (_e, t) => { vault = t; });
for (const ch of ['vault:backup', 'vault:restorePick', 'file:export', 'desk:chooseBackupDir']) ipcMain.handle(ch, () => null);
ipcMain.handle('desk:info', () => ({ dataDir: os.tmpdir(), backupDir: os.tmpdir(), version: 'shoot' }));
ipcMain.on('desk:notify', () => {});
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

app.whenReady().then(async () => {
  const win = new BrowserWindow({ width: 400, height: 860, show: false, webPreferences: { preload: path.join(__dirname, '..', 'electron', 'preload.cjs'), contextIsolation: true, sandbox: true, offscreen: true, backgroundThrottling: false } });
  await win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'), { hash: 'shoot' });
  const js = (c) => win.webContents.executeJavaScript(c);
  const shot = async (name, settle = 900) => {
    await wait(settle);
    for (let k = 0; k < 6; k++) await js(`document.querySelector('.moment button')?.click()`);
    await wait(150);
    fs.writeFileSync(path.join(out, name + '.png'), (await win.webContents.capturePage()).toPNG());
    console.log('shot', name);
  };
  const full = async (name) => { const h = await js('document.documentElement.scrollHeight'); win.setSize(400, Math.min(h + 40, 4000)); await shot(name, 700); win.setSize(400, 860); };
  const click = (t) => js(`(() => { const all=[...document.querySelectorAll('button')]; const t=${JSON.stringify(t)}; const b=all.find(b=>b.innerText.trim().startsWith(t)) || all.find(b=>b.innerText.includes(t)); if(!b) return 'MISSING '+t; b.click(); return 'ok'; })()`);
  const setVal = (sel, i, v) => js(`(() => { const el=document.querySelectorAll(${JSON.stringify(sel)})[${i}]; Object.getOwnPropertyDescriptor(el.__proto__,'value').set.call(el,${JSON.stringify(v)}); el.dispatchEvent(new Event('input',{bubbles:true})); })()`);
  const go = (route) => js(`window.__calmGo && window.__calmGo(${JSON.stringify(route)})`);
  try {
    await js('window.__calmHour = 10');
    await setVal('input[type=text]', 0, 'Asha'); await js(`document.querySelector('input[type=checkbox]').click()`); await click('Start my island'); await wait(1500);
    // lesson with art
    await click('Journey'); await wait(400);
    await js(`[...document.querySelectorAll('.stone')][0]?.click()`); await shot('31_lesson_welcome', 1500);
    await click('Next'); await shot('32_lesson_theory', 1500);
    await click('Next'); await click('To practice'); await wait(300); await click('⚖️'); await wait(300);
    await setVal('input[type=text]', 0, 'the thump came while I was relaxed after tea'); await click('Fits B'); await wait(200);
    await setVal('input[type=text]', 0, 'my heart went to 160'); await click('Fits A'); await wait(200);
    await full('33_theory_game');
    await js(`[...document.querySelectorAll('button')].find(b=>b.innerText.startsWith('Save'))?.click()`); await wait(400);
    await js(`[...document.querySelectorAll('button')].find(b=>b.innerText.includes('Light the stepping'))?.click()`); await wait(600);
    // tools
    await click('Toolbox'); await wait(400); await full('34_toolbox');
    await click('Body Lab'); await wait(400); await full('35_bodylab_menu');
    await js(`[...document.querySelectorAll('.lab-card')][1].click()`); await wait(300);
    await setVal('input[type=text]', 0, 'my hands will shake and not stop'); await click('Start'); await shot('36_bodylab_running', 1500);
    await click('I can feel it now'); await wait(300); await click('Stop here'); await wait(300); await click('Yes'); await shot('37_bodylab_rate', 500);
    await click('‹'); await wait(300); await click('‹'); await wait(400);
    await click('Toolbox'); await wait(300); await click('Sound Garden'); await wait(300); await click('Short'); await shot('38_sound_garden', 3500);
    await click('‹'); await wait(400);
    await click('Toolbox'); await wait(300); await click('Struggle switch'); await wait(300);
    await js(`[...document.querySelectorAll('.spark')].slice(0,5).forEach(b=>b.click())`); await shot('39_switch_on', 900);
    await js(`document.querySelector('.big-switch').click()`); await shot('40_switch_off', 1200);
    await click('Got it'); await wait(300);
    await click('Toolbox'); await wait(300); await click('Leaves'); await wait(300);
    await setVal('input[type=text]', 0, 'my heart is failing'); await click('Place it on a leaf'); await wait(200);
    await setVal('input[type=text]', 0, 'what if this time it is real'); await click('Say it in a cartoon'); await click('Place it on a leaf'); await shot('41_leaves', 2500);
    await click('‹'); await wait(300);
    await click('Toolbox'); await wait(300); await click('Fear loop'); await wait(300);
    for (const [i, v] of [[0, 'a thump in my chest'], [0, 'something is wrong with my heart'], [0, 'fear'], [0, 'heart raced'], [0, 'checked my watch']].entries()) { await setVal('input[type=text]', 0, v[1]); if (i < 4) await click('Next link'); await wait(150); }
    await shot('42_fearloop_full', 900); await click('See how to break it'); await shot('43_fearloop_snip', 1200);
    await click('Save my loop'); await wait(300);
    await click('Toolbox'); await wait(300); await click('For family'); await full('44_family');
    await click('‹'); await wait(300); await click('Toolbox'); await wait(300); await click('Urge to go to hospital'); await shot('45_hospital', 700);
    await click('‹'); await wait(300); await click('Island'); await wait(300); await click('Inner weather'); await wait(300); await click('+ Sleep diary'); await full('46_checkin_diary');
    await click('‹'); await wait(300); await click('SURGE'); await shot('47_surge_new', 6500);
    await click('Finish'); await full('48_surge_log');
    await click('Save'); await wait(500); await click('Calm-time'); await shot('49_breathe_pick', 800);
  } catch (e) { console.error('SHOOT ERROR', e); }
  app.quit();
});
