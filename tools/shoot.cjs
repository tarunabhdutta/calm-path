// Screenshot harness: renders every screen of the built app (dist/) with seeded TEST data in a
// temp data folder, and saves PNGs. Never touches real data (law E-04).
//   npx electron tools/shoot.cjs <outDir>
const { app, BrowserWindow, ipcMain, nativeTheme } = require('electron');
nativeTheme.themeSource = process.env.SHOOT_THEME || 'light';
const path = require('node:path');
const fs = require('node:fs');
const os = require('node:os');

const out = process.argv[2] || path.join(os.tmpdir(), 'calmpath-shots');
fs.mkdirSync(out, { recursive: true });
const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'calmpath-shoot-'));
let vault = null;
ipcMain.handle('vault:read', () => vault);
ipcMain.handle('vault:write', (_e, t) => { vault = t; });
ipcMain.handle('vault:backup', () => path.join(dataDir, 'b.calmpath'));
ipcMain.handle('vault:restorePick', () => null);
ipcMain.handle('file:export', () => null);
ipcMain.handle('desk:info', () => ({ dataDir, backupDir: dataDir, version: 'shoot' }));
ipcMain.handle('desk:chooseBackupDir', () => null);
ipcMain.on('desk:notify', () => {});

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    width: 400, height: 860, show: false, paintWhenInitiallyHidden: true,
    webPreferences: { preload: path.join(__dirname, '..', 'electron', 'preload.cjs'), contextIsolation: true, sandbox: true, backgroundThrottling: false, offscreen: true },
  });
  await win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'), { hash: 'shoot' });
  const js = (code) => win.webContents.executeJavaScript(code);
  const shot = async (name, settle = 900, keepModal = false) => {
    await wait(settle);
    if (!keepModal) for (let k = 0; k < 6; k++) await js(`document.querySelector('.moment button')?.click()`);
    await wait(150);
    const img = await win.webContents.capturePage();
    fs.writeFileSync(path.join(out, name + '.png'), img.toPNG());
    console.log('shot', name);
  };
  const click = (text) => js(`(() => { const all=[...document.querySelectorAll('button')]; const t=${JSON.stringify(text)}; const b=all.find(b=>b.innerText.trim().startsWith(t)) || all.find(b=>b.innerText.includes(t)); if(!b) return 'MISSING ${text.replace(/'/g, '')}'; b.click(); return 'ok'; })()`);
  const fullPage = async (name) => {
    const h = await js('document.documentElement.scrollHeight');
    win.setSize(400, Math.min(h + 40, 4000));
    await shot(name, 700);
    win.setSize(400, 860);
  };
  const setVal = (sel, i, v) => js(`(() => { const el=document.querySelectorAll(${JSON.stringify(sel)})[${i}]; const set=Object.getOwnPropertyDescriptor(el.__proto__,'value').set; set.call(el,${JSON.stringify(v)}); el.dispatchEvent(new Event('input',{bubbles:true})); })()`);

  try {
    await js('window.__calmHour = 10');
    await shot('01_welcome', 1200);
    await setVal('input[type=text]', 0, 'Asha'); await js(`document.querySelector('input[type=checkbox]').click()`);
    await shot('01b_welcome_filled', 400);
    await click('Start my island'); await wait(1500);
    await fullPage('02_home_level0_day');

    // seed a few weeks of practice
    await js(`window.__calmUpdate((d) => {
      const now = Date.now(), iso = (k) => new Date(now - k * 86400000).toISOString();
      ['QS1','QS2','QS3','QS4','QS5','QS6','QS7','S2.1','S2.2','S2.3','S3.1'].forEach((id, k) => d.sessions[id] = { doneAt: iso(20 - k) });
      for (let k = 0; k < 16; k++) d.breaths.push({ at: iso(k), minutes: 5 });
      for (let k = 0; k < 12; k++) d.urges.push({ id: 'u'+k, at: iso(k), kind: 'ECG', start: 7, end: 3, minutes: 3, outcome: k % 4 ? 'surfed' : 'checked' });
      for (let k = 0; k < 15; k++) d.checkins.push({ date: iso(k).slice(0,10), anxiety: 5 - (k % 3), sleep: 6, mood: 'Calm', caffeine: 1, moveMin: 20 });
      d.surges.push({ id: 's1', at: iso(3), strength: 6, minutes: 4, helped: ['Floating'], note: '', repeat: false });
      d.persistent.watchSetup = { steps: ['a','b','c','d','e','f'] };
      d.persistent.reassurancePlan = { signal: 'x' };
      d.persistent.fearCycle = { trigger: 'x' };
      d.worries.push({ id: 'w1', at: iso(0), text: 'Was that thump normal?', status: 'parked' }, { id: 'w2', at: iso(0), text: 'Should I check my ECG tonight?', status: 'parked' }, { id: 'w3', at: iso(1), text: 'What if it happens at the market?', status: 'parked' });
      for (let k = 0; k < 6; k++) d.worries.push({ id: 'l'+k, at: iso(5+k), text: 'old', status: 'letgo' });
      [7, 14, 0].forEach((k, i) => d.measures.push({ id: 'm'+i, kind: 'GAD7', at: iso(k), answers: [1,1,1,1,1,1,1], total: [12, 9, 6][i] }));
      d.settings.budgetLevel = 2;
    })`);
    await wait(800);
    await shot('03_celebration_moment', 2600, true);
    for (let k = 0; k < 6; k++) { await click('Lovely!'); await wait(250); }
    await fullPage('04_home_grown_day');
    await js('window.__calmHour = 18'); await click('Journey'); await wait(200); await click('Island'); await wait(300);
    await shot('05_home_dusk');
    await js('window.__calmHour = 22'); await click('Journey'); await wait(200); await click('Island'); await wait(300);
    await shot('06_home_night');
    await js('window.__calmHour = 10');
    await js(`window.__calmUpdate((d) => { for (let k = 0; k < 60; k++) d.breaths.push({ at: new Date(Date.now() - k * 3600e3).toISOString(), minutes: 10 }); })`);
    await wait(500); for (let k = 0; k < 8; k++) { await click('Lovely!'); await wait(200); }
    await click('Journey'); await wait(200); await click('Island'); await wait(300);
    await shot('07_home_level10_day');

    await click('Journey'); await wait(500);
    await js('window.scrollTo(0,0)'); await fullPage('08_journey');
    await click('Treasures'); await wait(400); await fullPage('09_treasures');
    await click('Toolbox'); await wait(300); await fullPage('10_toolbox');

    await click('Island'); await wait(300); await click('SURGE'); await shot('11_surge_1', 2500); await shot('12_surge_2', 6000);
    await click('Finish'); await shot('13_surge_log', 900); await click('Save'); await wait(600);
    await click('Lotus breathing'); await wait(300); await shot('14_breathe_pick');
    await click('3 min'); await wait(200); await click('Begin'); await shot('15_breathe_in', 3800); await shot('16_breathe_out', 5000);
    await click('Finish early'); await wait(500);
    await click('Surf an urge'); await wait(300); await click('ECG'); await shot('17_urge_start', 600);
    await click('Paddle out'); await shot('18_urge_surf', 4000);
    await click("I'm back"); await shot('19_urge_shore', 1800); await click('I surfed'); await wait(600);
    await click('Inner weather'); await wait(300); await click('⛅'); await click('🌗'); await fullPage('20_checkin');
    await click('‹'); await wait(300);
    await click('Worry river'); await shot('21_worry_river', 1500);
    await click('Open worry time'); await fullPage('22_worry_time');
    await click('‹'); await wait(200); await click('‹'); await wait(300);
    await click('Wind down'); await shot('23_winddown', 1200); await click('‹'); await wait(300);
    await click('Journey'); await wait(400);
    await js(`[...document.querySelectorAll('.stone')].find(b=>b.innerText.includes('Reassurance'))?.click()`); await shot('24_session_card', 900);
    await js(`(()=>{ const b=[...document.querySelectorAll('button')].filter(b=>/^(Next|To practice)/.test(b.innerText.trim())); b[0]?.click(); })()`); await wait(200);
    await js(`(()=>{ const b=[...document.querySelectorAll('button')].filter(b=>/^(Next|To practice)/.test(b.innerText.trim())); b[0]?.click(); })()`); await shot('25_session_practice', 700);
    await click('‹'); await wait(300); await click('Settings'); await wait(300); await fullPage('26_settings');
  } catch (e) {
    console.error('SHOOT ERROR', e);
  }
  app.quit();
});
