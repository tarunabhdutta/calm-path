// Walkthrough-film screens (v1.7, the game path): phone-size captures (390x844 CSS px at 2x) of every step a
// new person takes, from the first open, with seeded TEST data in a temp folder (never real data, law E-04),
// plus the measured position of each tapped control.
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
  const shot = async (name, settle = 900) => {
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
  const rect = (expr) => js(`(() => { const b = ${expr}; if (!b) return null; const r = b.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; })()`);
  const save = (name, r, label) => {
    if (r) taps[name] = { x: Math.round(r.x * Z), y: Math.round(r.y * Z), w: Math.round(r.w * Z), h: Math.round(r.h * Z), label };
    else console.log('MISSING target', name, label);
  };
  /** Records where a control sits on the CURRENT screen (for the film's tap ripple), by its text or a CSS selector. */
  const mark = async (name, text) => save(name, await rect(find(text)), text);
  const markSel = async (name, sel) => save(name, await rect(`document.querySelector(${JSON.stringify(sel)})`), sel);
  const click = async (text) => { const ok = await js(`(() => { const b = ${find(text)}; if (!b) return false; b.click(); return true; })()`); if (!ok) console.log('MISSING click', text); await wait(350); };
  const clickSel = async (sel) => { await js(`document.querySelector(${JSON.stringify(sel)})?.click()`); await wait(350); };
  const setVal = (sel, i, v) => js(`(() => { const el=document.querySelectorAll(${JSON.stringify(sel)})[${i}]; const set=Object.getOwnPropertyDescriptor(el.__proto__,'value').set; set.call(el,${JSON.stringify(v)}); el.dispatchEvent(new Event('input',{bubbles:true})); })()`);
  const closeMoments = async () => { for (let k = 0; k < 10; k++) { await js(`document.querySelector('.moment button')?.click()`); await wait(120); } };
  const top = () => js('window.scrollTo(0,0)');
  const scrollTo = (sel, block = 'center') => js(`document.querySelector(${JSON.stringify(sel)})?.scrollIntoView({block:${JSON.stringify(block)}})`);
  const tab = async (label) => { await js(`[...document.querySelectorAll('nav.tabs button')].find(b => b.innerText.trim() === ${JSON.stringify(label)})?.click()`); await wait(400); await top(); await wait(200); };
  const back = async () => { await click('‹'); await wait(300); };
  const iso = (k) => `new Date(Date.now() - (${k}) * 86400000).toISOString()`;

  try {
    await js('window.__calmHour = 10');
    await wait(1200);
    // ── step 2: first open
    await shot('welcome_empty', 300);
    await setVal('input[type=text]', 0, 'Asha');
    await markSel('welcome_name', 'input[type=text]');
    await js(`document.querySelector('input[type=checkbox]').click()`);
    await scrollTo('.safety-card .check'); await wait(200);
    await markSel('welcome_check', '.safety-card .check');
    await mark('welcome_start', 'Start my island');
    await shot('welcome', 400);
    await click('Start my island'); await wait(1200);
    await js(`window.__calmUpdate((d) => { d.settings.voice = false; d.settings.sound = { music: 0, ambience: 0, effects: 0, voice: 0, quiet: true, captions: true, breatheMusic: false }; })`);
    // ── step 3: the five guide cards
    for (let i = 1; i <= 5; i++) {
      await shot('guide_' + i, i === 1 ? 900 : 700);
      if (i < 5) { await mark('guide_next', 'Next'); await click('Next'); }
    }
    await mark('guide_start', 'Start Level 1');
    await click('Start Level 1'); await wait(900); await closeMoments(); await top();
    // ── step 4: home
    await markSel('home_level', '.level-strip');
    await markSel('home_mission', '.mission-card');
    await markSel('home_go', '.mission-go');
    await shot('home', 700);
    await scrollTo('.surge', 'start'); await wait(300);
    await markSel('home_surge2', '.surge');
    await markSel('home_rings', '.quests');
    await shot('home_rings', 500);
    await scrollTo('.grid2', 'center'); await wait(300); await shot('home_tools', 500);
    await top(); await wait(300);
    // ── step 5: today's mission (Level 1, Mission 1)
    await clickSel('.mission-go'); await wait(700);
    await mark('mission_next', 'Next');
    await shot('mission_read', 800);
    await click('Next'); await wait(300); await click('Next'); await wait(300);
    await mark('mission_step2', 'Go to step 2'); await shot('mission_read_last', 600);
    await click('Go to step 2'); await wait(500); await top();
    await markSel('mission_practice', '.tulu-says + .tile, .tile');
    await shot('mission_practice', 600);
    await setVal('textarea', 0, 'Go for long walks again');
    await scrollTo('textarea', 'center'); await wait(200);
    await mark('mission_finish', 'Finish the mission');
    await shot('mission_finish', 500);
    await click('Finish the mission'); await wait(300); await closeMoments(); await top();
    await shot('home_done', 100);       // the toast: "Mission complete! New tool open: Two stories"
    await closeMoments(); await wait(2600); await top();
    await shot('home_wait', 400);       // "Done for now. This mission opens tomorrow."
    // ── step 6: daily rings
    await scrollTo('.quests', 'center'); await wait(200);
    await mark('ring_breathe', 'Breathe 5'); await mark('ring_checkin', 'How am I today');
    await shot('home_rings_2', 300);
    await click('Breathe 5'); await wait(400); await shot('breathe_pick', 400);
    await click('3 min'); await click('Begin'); await shot('breathe', 4200);
    await click('Finish early'); await wait(600); await tab('Home');
    await scrollTo('.quests', 'center'); await click('How am I today'); await wait(400);
    await click('Light clouds'); await click('Well'); await shot('checkin', 600);
    await back(); await tab('Home');
    // ── step 7: SURGE
    await markSel('surge_tap', '.surge');
    await shot('home_surge', 300);
    await clickSel('.surge'); await shot('surge', 7000);
    await click('Finish'); await wait(600); await shot('surge_log', 600);
    await click('Save'); await wait(600); await closeMoments(); await tab('Home');
    // ── step 8: tools open as you go (only Mission 1 done: most are locked)
    await closeMoments(); await tab('Tools'); await closeMoments(); await shot('tools', 500);
    await js('window.scrollTo(0, 620)'); await shot('tools_locked', 500); await top();

    // ── Level 1 complete: missions 2-6 done earlier, finish Mission 7 on screen
    await js(`window.__calmUpdate((d) => { ['QS1','QS2','QS3','QS4','QS5','QS6'].forEach((id, k) => d.sessions[id] = { doneAt: ${iso('9 - k')} }); d.game.seenDrops = 0; })`);
    await wait(800); await closeMoments(); await tab('Home');
    await clickSel('.mission-go'); await wait(500);
    for (let k = 0; k < 6; k++) { await click('Go to step 2'); await click('Next'); }
    await top(); await click('Finish the mission'); await wait(1600);
    await js(`(() => { const q = [...document.querySelectorAll('.moment')]; return q.length; })()`);
    // the first moment in the queue is "Level 1 complete"
    for (let k = 0; k < 6; k++) {
      const kicker = await js(`document.querySelector('.moment-kicker')?.innerText || ''`);
      if (/LEVEL 1 COMPLETE/i.test(kicker)) break;
      await js(`document.querySelector('.moment button')?.click()`); await wait(400);
    }
    await shot('level_done', 1400);
    await closeMoments(); await tab('Home'); await shot('home_level2', 600);

    // ── a few weeks on: the island has grown and more tools are open
    await js(`window.__calmUpdate((d) => {
      ['S2.1','S2.2','S2.3','S3.1','S3.2','S3.3','S4.1','S4.2','S4.3','S5.1','S5.2','S5.3','S6.1'].forEach((id, k) => d.sessions[id] = { doneAt: ${iso('2 + 13 - k')} });
      for (let k = 0; k < 40; k++) d.breaths.push({ at: ${iso('k / 2')}, minutes: 5 });
      for (let k = 0; k < 14; k++) d.urges.push({ id: 'u'+k, at: ${iso('k')}, kind: 'Heart rate / watch', start: 7, end: 3, minutes: 3, outcome: k % 4 ? 'surfed' : 'checked' });
      for (let k = 0; k < 20; k++) d.checkins.push({ date: ${iso('k + 1')}.slice(0,10), anxiety: 5 - (k % 3), sleep: 6, mood: 'Calm', caffeine: 1, moveMin: 20 });
      for (let k = 0; k < 4; k++) d.surges.push({ id: 's'+k, at: ${iso('3 + k * 4')}, strength: 7 - k, minutes: 4, helped: ['Floating'], note: '', repeat: false });
      d.persistent.watchSetup = { steps: ['a','b','c','d','e','f'] };
      d.persistent.reassurancePlan = { signal: 'x' };
      d.persistent.fearCycle = { trigger: 'x' };
      d.worries.push({ id: 'w1', at: ${iso(0)}, text: 'Was that thump normal?', status: 'parked' }, { id: 'w2', at: ${iso(0)}, text: 'Should I check again tonight?', status: 'parked' }, { id: 'w3', at: ${iso(1)}, text: 'What if it happens at the market?', status: 'parked' });
      for (let k = 0; k < 6; k++) d.worries.push({ id: 'l'+k, at: ${iso('5 + k')}, text: 'old', status: 'letgo' });
      [21, 14, 7, 0].forEach((k, i) => d.measures.push({ id: 'm'+i, kind: 'GAD7', at: new Date(Date.now() - k * 86400000).toISOString(), answers: [1,1,1,1,1,1,1], total: [14, 11, 8, 6][i] }));
      d.settings.budgetLevel = 2;
      d.profile.doctorOkBodyPractice = new Date().toISOString().slice(0, 10);
    })`);
    await wait(1200);
    for (let k = 0; k < 8; k++) {
      const kicker = await js(`document.querySelector('.moment-kicker')?.innerText || ''`);
      if (/ISLAND GREW/i.test(kicker)) break;
      await js(`document.querySelector('.moment button')?.click()`); await wait(400);
    }
    await shot('island_grown', 1800);   // a celebration moment over the grown island
    await win.webContents.insertCSS('.moment-back { display: none !important; }');  // no pop-ups on the other screens
    await closeMoments(); await tab('Home');
    await scrollTo('.grid2', 'start'); await wait(300); await shot('home_tools_many', 500); await top();
    await tab('Tools'); await shot('tools_many', 500);

    // tool examples
    await mark('urge_tap', 'Surf an urge'); await click('Surf an urge'); await click('Heart rate'); await shot('urge_start', 500);
    await click('Paddle out'); await shot('urge', 5000);
    await click("I'm back"); await wait(400); await click('Surfed it'); await wait(500);
    await tab('Tools'); await click('Worry river'); await shot('worry', 1600); await back();
    await tab('Tools'); await click('Body Lab'); await shot('bodylab', 900); await back();
    await tab('Tools'); await click('Listening Garden'); await wait(500); await click('Short'); await shot('garden', 4000); await click('‹ Close'); await wait(400);

    // levels, rewards
    await tab('Levels'); await wait(600); await shot('levels', 600);
    await tab('Rewards'); await shot('treasures', 700);
    await js('window.scrollTo(0, 700)'); await shot('treasures_charts', 600); await top();

    // bedtime
    await js('window.__calmHour = 22');
    await js(`window.__calmUpdate((d) => { d.settings.voice = true; })`);
    await tab('Tools'); await click('Wind down'); await shot('winddown', 1500);
    await back(); await tab('Home'); await shot('home_night', 1200);
    await js('window.__calmHour = 10');

    // family, safety, settings
    await tab('Tools'); await scrollTo('h2:nth-of-type(1)'); await click('For family'); await shot('family', 900); await back();
    await tab('Tools'); await click('Safety card'); await shot('safety', 900); await back();
    await js(`window.__calmUpdate((d) => { d.settings.voice = true; d.settings.sound = undefined; })`);
    await tab('Settings'); await mark('settings_guide', 'How Calm Path works'); await shot('settings', 600);
    await js(`[...document.querySelectorAll('h2')].find(h => h.innerText.includes('Sound'))?.scrollIntoView({block:'start'})`); await shot('settings_sound', 700);
  } catch (e) {
    console.error('SHOOT ERROR', e);
  }
  fs.writeFileSync(path.join(out, 'taps.json'), JSON.stringify(taps, null, 1));
  app.quit();
});
