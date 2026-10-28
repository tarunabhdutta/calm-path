// Promo-film screens: phone-size captures (390x844 CSS px at 2x) of every feature, with seeded TEST
// data in a temp folder (never real data, law E-04), plus the measured position of each tapped button.
//   npx electron tools/shoot-promo.cjs <outDir>
// Writes <outDir>/<name>.png and <outDir>/taps.json  { name: { x, y, w, h } } in image pixels.
const { app, BrowserWindow, ipcMain, nativeTheme } = require('electron');
nativeTheme.themeSource = 'light';
const path = require('node:path');
const fs = require('node:fs');
const os = require('node:os');

const out = process.argv[2] || path.join(os.tmpdir(), 'calmpath-promo');
fs.mkdirSync(out, { recursive: true });
const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'calmpath-promo-'));
let vault = null;
ipcMain.handle('vault:read', () => vault);
ipcMain.handle('vault:write', (_e, t) => { vault = t; });
ipcMain.handle('vault:backup', () => path.join(dataDir, 'b.calmpath'));
ipcMain.handle('vault:restorePick', () => null);
ipcMain.handle('file:export', () => null);
ipcMain.handle('desk:info', () => ({ dataDir, backupDir: dataDir, version: 'promo' }));
ipcMain.handle('desk:chooseBackupDir', () => null);
ipcMain.on('desk:notify', () => {});

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
app.disableHardwareAcceleration();  // software rendering: steadier screenshots, no GPU-process crashes
const Z = 2;
const taps = {};

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    width: 390, height: 844, useContentSize: true, show: false, paintWhenInitiallyHidden: true,
    webPreferences: { preload: path.join(__dirname, '..', 'electron', 'preload.cjs'), contextIsolation: true, sandbox: true, backgroundThrottling: false, offscreen: false },
  });
  await win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'), { hash: 'shoot' });
  const js = (code) => win.webContents.executeJavaScript(code);
  // a 390x844 phone at 2x, emulated by the browser itself (sharp at any window size)
  const dbg = win.webContents.debugger;
  dbg.attach('1.3');
  await dbg.sendCommand('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: Z, mobile: true });
  const shot = async (name, settle = 900, keep = false) => {
    await wait(settle);
    let data = null;
    for (let k = 0; k < 3 && !data; k++) {
      data = await Promise.race([dbg.sendCommand('Page.captureScreenshot', { format: 'png' }).then((r) => r.data), wait(15000).then(() => null)]);
      if (!data) { console.log('retry', name); win.webContents.invalidate(); await wait(500); }
    }
    fs.writeFileSync(path.join(out, name + '.png'), Buffer.from(data, 'base64'));
    console.log('shot', name);
  };
  const find = (text) => `([...document.querySelectorAll('button, .stone, label.check, .tile')].find(b => b.innerText && b.innerText.trim().startsWith(${JSON.stringify(text)})) || [...document.querySelectorAll('button, .stone, .tile')].find(b => b.innerText && b.innerText.includes(${JSON.stringify(text)})))`;
  /** Records where `text` sits on the CURRENT screen (for the film's tap ripple) under shot `name`. */
  const mark = async (name, text) => {
    const r = await js(`(() => { const b = ${find(text)}; if (!b) return null; b.scrollIntoView({ block: 'nearest' }); const r = b.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; })()`);
    if (r) taps[name] = { x: Math.round(r.x * Z), y: Math.round(r.y * Z), w: Math.round(r.w * Z), h: Math.round(r.h * Z), label: text };
    else console.log('MISSING target', name, text);
  };
  const click = async (text) => { const ok = await js(`(() => { const b = ${find(text)}; if (!b) return false; b.click(); return true; })()`); if (!ok) console.log('MISSING click', text); await wait(350); };
  const setVal = (sel, i, v) => js(`(() => { const el=document.querySelectorAll(${JSON.stringify(sel)})[${i}]; const set=Object.getOwnPropertyDescriptor(el.__proto__,'value').set; set.call(el,${JSON.stringify(v)}); el.dispatchEvent(new Event('input',{bubbles:true})); })()`);
  const closeMoments = async () => { for (let k = 0; k < 10; k++) { await js(`document.querySelector('.moment button')?.click()`); await wait(120); } };
  const top = () => js('window.scrollTo(0,0)');
  const home = async () => { await click('Island'); await top(); await wait(300); };

  try {
    await js('window.__calmHour = 10');
    await wait(1200);
    await setVal('input[type=text]', 0, 'Asha'); await js(`document.querySelector('input[type=checkbox]').click()`);
    await mark('welcome', 'Start my island');
    await shot('welcome', 400);
    await click('Start my island'); await wait(1500);
    await js(`window.__calmUpdate((d) => { d.settings.voice = false; d.settings.sound = { music: 0, ambience: 0, effects: 0, voice: 0, quiet: true, captions: true, breatheMusic: false }; })`);
    await closeMoments();
    await mark('home_start', 'SURGE');
    await shot('home_start');

    // a few weeks of practice, so the island has grown
    await js(`window.__calmUpdate((d) => {
      const now = Date.now(), iso = (k) => new Date(now - k * 86400000).toISOString();
      ['QS1','QS2','QS3','QS4','QS5','QS6','QS7','S2.1','S2.2','S2.3','S3.1','S3.2','S4.1'].forEach((id, k) => d.sessions[id] = { doneAt: iso(24 - k) });
      for (let k = 0; k < 40; k++) d.breaths.push({ at: iso(k / 2), minutes: 5 });
      for (let k = 0; k < 14; k++) d.urges.push({ id: 'u'+k, at: iso(k), kind: 'Heart rate / watch', start: 7, end: 3, minutes: 3, outcome: k % 4 ? 'surfed' : 'checked' });
      for (let k = 0; k < 20; k++) d.checkins.push({ date: iso(k + 1).slice(0,10), anxiety: 5 - (k % 3), sleep: 6, mood: 'Calm', caffeine: 1, moveMin: 20 });
      for (let k = 0; k < 4; k++) d.surges.push({ id: 's'+k, at: iso(3 + k * 4), strength: 7 - k, minutes: 4, helped: ['Floating'], note: '', repeat: false });
      d.persistent.watchSetup = { steps: ['a','b','c','d','e','f'] };
      d.persistent.reassurancePlan = { signal: 'x' };
      d.persistent.fearCycle = { trigger: 'x' };
      d.worries.push({ id: 'w1', at: iso(0), text: 'Was that thump normal?', status: 'parked' }, { id: 'w2', at: iso(0), text: 'Should I check again tonight?', status: 'parked' }, { id: 'w3', at: iso(1), text: 'What if it happens at the market?', status: 'parked' });
      for (let k = 0; k < 6; k++) d.worries.push({ id: 'l'+k, at: iso(5+k), text: 'old', status: 'letgo' });
      [21, 14, 7, 0].forEach((k, i) => d.measures.push({ id: 'm'+i, kind: 'GAD7', at: iso(k), answers: [1,1,1,1,1,1,1], total: [14, 11, 8, 6][i] }));
      d.settings.budgetLevel = 2;
    })`);
    await wait(900);
    await shot('island_grown', 1800, true);            // a celebration moment over the grown island
    await win.webContents.insertCSS('.moment-back { display: none !important; }');  // no pop-ups on the other screens
    await closeMoments();
    await home();
    await mark('home_day', 'SURGE'); await shot('home_day');
    await js('window.scrollTo(0, 520)'); await mark('home_quests', 'Weather check'); await shot('home_quests', 500); await top();

    // SURGE
    await mark('surge_tap', 'SURGE');
    await click('SURGE'); await shot('surge', 7000);
    await click('Finish'); await wait(600); await shot('surge_log', 600);
    await click('Save'); await wait(600); await home();

    // toolbox
    await click('Toolbox'); await top(); await shot('toolbox', 500);
    await mark('urge_tap', 'Surf an urge'); await click('Surf an urge'); await click('Heart rate'); await shot('urge_start', 500);
    await click('Paddle out'); await shot('urge', 5000);
    await click("I'm back"); await wait(400); await click('Surfed it'); await wait(500);

    await click('Toolbox'); await top(); await click('Lotus breathing'); await wait(300); await shot('breathe_pick', 400);
    await click('3 min'); await click('Begin'); await shot('breathe', 4200);
    await click('Finish early'); await wait(500);

    await home(); await mark('checkin_tap', 'Weather check'); await click('Weather check'); await wait(400);
    await click('Light clouds'); await click('Well'); await shot('checkin', 600);
    await click('‹'); await wait(300);

    await click('Toolbox'); await top(); await click('Worry time'); await shot('worry', 1600);
    await click('‹'); await wait(300);

    await click('Journey'); await wait(600); await shot('journey', 600);
    await js(`[...document.querySelectorAll('.stone')].find(b => !b.disabled && !b.innerText.includes('done'))?.scrollIntoView({block:'center'})`); await wait(400);
    await js(`[...document.querySelectorAll('.stone')].find(b=>b.innerText.includes('Reassurance'))?.click()`); await shot('lesson', 1000);
    await click('Next'); await shot('lesson_2', 700);
    await click('‹'); await wait(400);

    await click('Toolbox'); await top(); await click('Forecaster'); await shot('game_forecast', 700); await click('‹'); await wait(300);
    await click('Toolbox'); await top(); await click('My ladder'); await shot('game_ladder', 700); await click('‹'); await wait(300);
    await click('Toolbox'); await top(); await click('Leaves'); await shot('game_leaves', 900); await click('‹'); await wait(300);
    await click('Toolbox'); await top(); await click('Fight switch'); await shot('game_switch', 700); await click('‹'); await wait(300);
    await click('Toolbox'); await top(); await click('Two stories'); await shot('game_theory', 700); await click('‹'); await wait(300);

    await js(`window.__calmUpdate((d) => { d.profile.doctorOkBodyPractice = true; })`);
    await click('Toolbox'); await top(); await click('Body Lab'); await shot('bodylab', 900); await click('‹'); await wait(300);
    await click('Toolbox'); await top(); await click('Listening Garden'); await wait(500); await click('Short'); await shot('garden', 4000); await click('‹ Close'); await wait(400);

    await js('window.__calmHour = 22');
    await js(`window.__calmUpdate((d) => { d.settings.voice = true; })`);
    await click('Toolbox'); await top(); await click('Wind down'); await shot('winddown', 1500);
    await js(`document.querySelector('details.night-guide').open = true`); await shot('night_guide', 700);
    await click('‹'); await wait(300);
    await home(); await shot('home_night', 1200);
    await js('window.__calmHour = 10');

    await click('Treasures'); await top(); await shot('treasures', 700);
    await js('window.scrollTo(0, 700)'); await shot('treasures_charts', 600); await top();

    await js(`window.__calmUpdate((d) => { d.settings.voice = true; d.settings.sound = undefined; })`);
    await click('Settings'); await top(); await wait(300);
    await js(`[...document.querySelectorAll('h2')].find(h => h.innerText.includes('Sound'))?.scrollIntoView({block:'start'})`); await shot('settings', 700);
    await top();
    await click('Toolbox'); await top(); await click('For family'); await shot('family', 900);
    await click('‹'); await wait(300);
    await home();
    await click('SURGE'); await wait(800); await click('Different from usual'); await shot('safety', 900);
  } catch (e) {
    console.error('SHOOT ERROR', e);
  }
  fs.writeFileSync(path.join(out, 'taps.json'), JSON.stringify(taps, null, 1));
  app.quit();
});
