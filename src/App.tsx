import { useEffect, useState } from 'react';
import { Icon, NavProvider, useNav } from './components/ui';
import type { Route } from './components/ui';
import { useStore } from './lib/store';
import { newData } from './lib/model';
import { scheduleReminders } from './lib/notify';
import { MEASURES } from './content/measures';
import { Home, Tools } from './screens/Home';
import { Breathe, Surge, Urge, WindDown } from './screens/Flows';
import { CheckIn, WorryBox, WorryTime } from './screens/Logs';
import { BudgetView, FormView, LogsView, MeasureView, SessionView } from './screens/Path';
import { Journey } from './screens/Journey';
import { Celebrations } from './game/Celebrate';
import { VoiceCaption } from './components/VoiceCaption';
import { AUDIO } from './content/scripts';
import { isPlaying, playClip } from './lib/audio';
import { Tulu } from './game/Mascot';
import { FearCycleGame, ForecastGame, LadderGame, LeavesGame, NotingGame, RecipeGame } from './game/Games';
import { BodyLab, ListeningGarden, SwitchGame, TheoryGame } from './game/Games2';
import { Family, HospitalUrge } from './screens/Family';
import { Progress } from './screens/Progress';
import { Safety, Settings } from './screens/Settings';

function Screen({ r }: { r: Route }) {
  switch (r.name) {
    case 'home': return <Home />;
    case 'path': return <Journey />;
    case 'tools': return <Tools />;
    case 'progress': return <Progress />;
    case 'settings': return <Settings />;
    case 'surge': return <Surge />;
    case 'urge': return <Urge />;
    case 'breathe': return <Breathe minutes={r.minutes} />;
    case 'winddown': return <WindDown />;
    case 'checkin': return <CheckIn />;
    case 'worry': return <WorryBox />;
    case 'worrytime': return <WorryTime />;
    case 'safety': return <Safety crisis={r.crisis} />;
    case 'session': return <SessionView key={r.id} id={r.id} />;
    case 'form': return <FormView key={r.formId + (r.entryId ?? '')} formId={r.formId} entryId={r.entryId} />;
    case 'logs': return <LogsView formId={r.formId} />;
    case 'measure': return <MeasureView key={r.id} id={r.id} />;
    case 'budget': return <BudgetView />;
    case 'game': {
      if (r.id === 'forecast') return <ForecastGame task={r.task} />;
      const G = GAMES[r.id];
      return <G />;
    }
    case 'family': return <Family />;
    case 'hospital': return <HospitalUrge />;
  }
}

const FULL = new Set(['surge', 'urge', 'breathe', 'winddown']);
const GAMES = { fearCycle: FearCycleGame, leaves: LeavesGame, forecast: ForecastGame, ladder: LadderGame, noting: NotingGame, recipe: RecipeGame,
  bodyLab: BodyLab, listening: ListeningGarden, theory: TheoryGame, switch: SwitchGame } as const;
const routeKey = (r: Route) => r.name + ('id' in r ? String(r.id) : '') + ('formId' in r ? r.formId : '') + ('entryId' in r ? r.entryId ?? '' : '');

const TABS = [
  { name: 'home', label: 'Island' }, { name: 'path', label: 'Journey' }, { name: 'tools', label: 'Toolbox' },
  { name: 'progress', label: 'Treasures' }, { name: 'settings', label: 'Settings' },
] as const;

function Tabs() {
  const { route, go } = useNav();
  if (!TABS.some((t) => t.name === route.name)) return null;
  return (
    <nav className="tabs"><div className="in">
      {TABS.map((t) => (
        <button key={t.name} className={route.name === t.name ? 'on' : ''} onClick={() => go({ name: t.name } as Route)}>
          {Icon[t.name]}{t.label}
        </button>
      ))}
    </div></nav>
  );
}

/** One-time step for people updating from v1.0/1.1, which had a PIN. */
function BringAcross() {
  const { unlockLegacy, create } = useStore();
  const [pin, setPin] = useState('');
  const [err, setErr] = useState('');
  const [fresh, setFresh] = useState(false);
  return (
    <div className="full">
      <div style={{ textAlign: 'center', marginTop: 10 }}><Tulu size={130} mood="happy" /></div>
      <h1>No more PIN</h1>
      <p className="ink2">Calm Path no longer uses a PIN. To bring your progress across, type your old PIN one last time. You'll never be asked again.</p>
      <div className="card">
        <label className="f">Old PIN</label>
        <input type="password" inputMode="numeric" value={pin} onChange={(e) => { setErr(''); setPin(e.target.value.replace(/\D/g, '').slice(0, 8)); }} />
        {err && <p style={{ color: 'var(--safety)', marginTop: 8 }}>{err}</p>}
        <button className="btn block" style={{ marginTop: 12 }} disabled={pin.length < 4}
          onClick={async () => { if (!(await unlockLegacy(pin))) setErr('That PIN did not match. Try again.'); }}>Bring my progress across</button>
      </div>
      {!fresh ? (
        <button className="link" onClick={() => setFresh(true)}>Forgot it? Start fresh instead</button>
      ) : (
        <div className="card soft">
          <p>Starting fresh clears the old progress on this device.</p>
          <button className="btn ghost block" onClick={() => void create(newData())}>Yes, start fresh</button>
        </div>
      )}
    </div>
  );
}

function Setup() {
  const { create } = useStore();
  const [name, setName] = useState('');
  const [ack, setAck] = useState(false);
  const finish = async () => {
    const d = newData({ name: name.trim() });
    await create(d);
    void scheduleReminders(d.settings.reminders);
  };
  return (
    <div className="full">
      <div style={{ textAlign: 'center' }}><Tulu size={150} mood="excited" /></div>
      <h1>Welcome to Calm Path</h1>
      <p className="ink2">Meet Tulu, a baby rhino from the river islands. Together you'll grow a little island, one calm practice at a time.</p>
      <div className="card">
        <label className="f" style={{ marginTop: 0 }}>What's your name?</label>
        <input type="text" value={name} autoFocus maxLength={30} onChange={(e) => setName(e.target.value)} placeholder="Your first name" />
        <p className="muted" style={{ marginTop: 8 }}>Everything you do stays on this device. Nothing is sent anywhere.</p>
      </div>
      <div className="safety-card">
        <h3>Before you start</h3>
        <p>Calm Path supports recovery from health anxiety. It does not diagnose or treat, and it will never tell you whether a symptom is safe.</p>
        <p>New, different or severe symptoms, such as chest pain with breathlessness or fainting: call your doctor or emergency services (India: <b>108</b>). Low mood or thoughts of self-harm: your doctor or a helpline (India: <b>Tele-MANAS 14416</b>, free, 24×7).</p>
        <label className="check"><input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} /><span>I understand</span></label>
      </div>
      <button className="btn block" disabled={!ack || !name.trim()} onClick={finish}>Start my island</button>
      <p className="muted" style={{ textAlign: 'center' }}>You can add a support person and your doctor's number later in Settings.</p>
    </div>
  );
}

export default function App() {
  const { status, data } = useStore();
  const theme = data?.settings.theme ?? 'auto';
  useEffect(() => {
    if (theme === 'auto') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  useEffect(() => { if (status === 'open' && data) void scheduleReminders(data.settings.reminders); }, [status]); // eslint-disable-line react-hooks/exhaustive-deps
  // After two or more days away: a friendly "welcome back" on her first tap (never a "missed" tone).
  useEffect(() => {
    if (status !== 'open' || !data) return;
    const today = new Date().toISOString().slice(0, 10);
    let last: string | null = null;
    try { last = localStorage.getItem('cp.lastOpen'); localStorage.setItem('cp.lastOpen', today); } catch { /* storage unavailable */ }
    if (!last || !data.settings.voice) return;
    if ((Date.parse(today) - Date.parse(last)) / 86_400_000 < 2) return;
    const once = () => window.setTimeout(() => { if (!isPlaying()) playClip(AUDIO.missed); }, 400);
    window.addEventListener('pointerdown', once, { once: true });
    return () => window.removeEventListener('pointerdown', once);
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  if (status === 'loading') return <div className="full" />;
  if (status === 'setup') return <Setup />;
  if (status === 'legacy') return <BringAcross />;
  return (
    <NavProvider>{(r) => (
      <>
        {/* full-screen scenes fade (a transform would break their fixed backgrounds); other screens slide in */}
        <div key={routeKey(r)} className={FULL.has(r.name) ? 'page-fade' : 'page'}><Screen r={r} /></div>
        <Tabs />
        <Celebrations />
        <VoiceCaption />
      </>
    )}</NavProvider>
  );
}

// Exposed for the packaged self-test (electron --self-test).
export const SELF_TEST_MEASURES = Object.keys(MEASURES);
