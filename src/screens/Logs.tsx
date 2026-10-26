import { useState } from 'react';
import { Back, Chips, useNav } from '../components/ui';
import { useStore } from '../lib/store';
import { emptyCounts, today, uid } from '../lib/model';
import type { Counts } from '../lib/model';
import { crisisText } from '../lib/safety';
import { AUDIO } from '../content/scripts';
import { playClip } from '../lib/audio';
import { River } from '../game/Scenes';
import { Tulu } from '../game/Mascot';

// Inner weather: calm = clear sky. The numbers behind it stay the same 0-10 anxiety scale.
const WEATHER = [
  { v: 1, icon: '☀️', label: 'Clear' },
  { v: 3, icon: '🌤️', label: 'Light clouds' },
  { v: 5, icon: '⛅', label: 'Cloudy' },
  { v: 7, icon: '🌧️', label: 'Rainy' },
  { v: 9, icon: '⛈️', label: 'Stormy' },
];
const SLEEP = [
  { v: 1, icon: '🌑', label: 'Hardly' },
  { v: 4, icon: '🌘', label: 'Poorly' },
  { v: 6, icon: '🌗', label: 'OK' },
  { v: 8, icon: '🌖', label: 'Well' },
  { v: 10, icon: '🌕', label: 'Deeply' },
];
const MOODS = ['😌 Calm', '🙂 Okay', '🥱 Tired', '😔 Low', '😟 Worried', '🌱 Hopeful', '😊 Happy'];

function IconPick({ items, value, onChange }: { items: { v: number; icon: string; label: string }[]; value: number; onChange: (v: number) => void }) {
  return (
    <div className="icon-pick">
      {items.map((it) => (
        <button key={it.v} type="button" className={value === it.v ? 'on' : ''} onClick={() => onChange(it.v)} aria-pressed={value === it.v}>
          <i>{it.icon}</i><span>{it.label}</span>
        </button>
      ))}
    </div>
  );
}

export function CheckIn() {
  const { data, update } = useStore();
  const { back, toast, go } = useNav();
  const prev = data!.checkins.find((c) => c.date === today());
  const nearest = (v: number, items: { v: number }[]) => items.reduce((a, b) => (Math.abs(b.v - v) < Math.abs(a.v - v) ? b : a)).v;
  const [anxiety, setAnxiety] = useState(prev ? nearest(prev.anxiety, WEATHER) : 0);
  const [sleep, setSleep] = useState(prev ? nearest(prev.sleep, SLEEP) : 0);
  const [mood, setMood] = useState<string[]>(prev?.mood ? [MOODS.find((m) => m.endsWith(prev.mood)) ?? prev.mood] : []);
  const [caffeine, setCaffeine] = useState(prev?.caffeine ?? 1);
  const [moveMin, setMoveMin] = useState(prev?.moveMin ?? 0);
  const save = () => {
    update((d) => {
      d.checkins = d.checkins.filter((c) => c.date !== today());
      d.checkins.push({ date: today(), anxiety, sleep, mood: (mood[0] ?? '').replace(/^\S+\s/, ''), caffeine, moveMin });
    });
    if (data!.settings.voice) playClip(AUDIO.logged);
    toast('Weather noted. Every sky passes.');
    back();
  };
  return (
    <div className="app">
      <Back />
      <div className="row" style={{ gap: 4 }}>
        <div className="grow"><h1>Inner weather</h1><p className="muted" style={{ margin: 0 }}>Thirty seconds. Every kind of weather is welcome.</p></div>
        <Tulu size={86} mood="curious" />
      </div>
      <div className="card">
        <label className="f">What's the weather inside today?</label>
        <IconPick items={WEATHER} value={anxiety} onChange={setAnxiety} />
        <label className="f">How did you sleep?</label>
        <IconPick items={SLEEP} value={sleep} onChange={setSleep} />
        <label className="f">One word for your mood</label>
        <Chips options={MOODS} value={mood} onChange={setMood} />
        <label className="f">Cups of tea or coffee today</label>
        <div className="cups">
          {[0, 1, 2, 3, 4].map((n) => (
            <button key={n} type="button" className={caffeine === n ? 'on' : ''} onClick={() => setCaffeine(n)}>
              {n === 0 ? '—' : '☕'.repeat(Math.min(n, 3)) + (n >= 4 ? '+' : '')}
            </button>
          ))}
        </div>
        <label className="f">Walking or movement</label>
        <Chips options={['0', '10', '20', '30', '45', '60+']} value={[moveMin >= 60 ? '60+' : String(moveMin)]} onChange={(v) => setMoveMin(v[0] === '60+' ? 60 : Number(v[0]))} />
        <p className="muted" style={{ marginTop: 4 }}>minutes 🚶‍♀️</p>
      </div>
      <button className="btn block" disabled={!anxiety || !sleep} onClick={save}>Save · +1 💧</button>
      <button className="link" onClick={() => go({ name: 'measure', id: 'GAD7' })}>Compass check (weekly questionnaire)</button>
    </div>
  );
}

export function WorryBox() {
  const { data, update } = useStore();
  const { back, toast, go } = useNav();
  const [text, setText] = useState('');
  const [launching, setLaunching] = useState(false);
  const parked = data!.worries.filter((w) => w.status === 'parked');
  const add = () => {
    if (!text.trim()) return;
    if (crisisText(text)) { update((d) => d.safetyEvents.push({ at: new Date().toISOString(), source: 'worry' })); go({ name: 'safety', crisis: true }); }
    update((d) => d.worries.push({ id: uid(), at: new Date().toISOString(), text: text.trim(), status: 'parked' }));
    setText('');
    setLaunching(true);
    window.setTimeout(() => setLaunching(false), 1600);
    toast(`Folded into a boat. It waits for worry time (${data!.settings.reminders.worry}).`);
  };
  return (
    <div className="app">
      <Back />
      <h1>Worry river 🛶</h1>
      <p className="ink2">Write the worry or the question in one line, then fold it into a paper boat. It floats safely until worry time ({data!.settings.reminders.worry}). No searching in between.</p>
      <div className="river-card"><River boats={parked.map((w) => ({ id: w.id }))} launching={launching} /></div>
      <div className="card">
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="e.g. Was that thump normal? Should I look it up?" />
        <button className="btn block" style={{ marginTop: 10 }} onClick={add} disabled={!text.trim()}>Fold into a boat · +1 💧</button>
      </div>
      <p className="muted">{parked.length} boat{parked.length === 1 ? '' : 's'} waiting for worry time.</p>
      <button className="btn ghost block" onClick={() => go({ name: 'worrytime' })}>Open worry time now</button>
      <button className="link" onClick={back}>Leave the river</button>
    </div>
  );
}

export function WorryTime({ onFinished }: { onFinished?: () => void }) {
  const { data, update } = useStore();
  const { back } = useNav();
  const [steps, setSteps] = useState<Record<string, string>>({});
  const [leaving, setLeaving] = useState<string[]>([]);
  const parked = data!.worries.filter((w) => w.status === 'parked');
  const settle = (id: string, status: 'step' | 'letgo') => {
    if (status === 'letgo') {
      setLeaving((l) => [...l, id]);
      window.setTimeout(() => update((d) => { const w = d.worries.find((x) => x.id === id)!; w.status = 'letgo'; }), 1400);
    } else update((d) => { const w = d.worries.find((x) => x.id === id)!; w.status = 'step'; w.step = steps[id]; });
  };
  return (
    <div className="app">
      <Back onClick={onFinished} />
      <h1>Worry time</h1>
      <p className="ink2">Fifteen minutes. For each boat: is there one practical step? Write it. If not, let the boat float away down the river.</p>
      <div className="river-card"><River boats={parked.map((w) => ({ id: w.id, leaving: leaving.includes(w.id) }))} /></div>
      {parked.length === 0 && <div className="card soft" style={{ textAlign: 'center' }}><Tulu size={90} mood="happy" /><p>The river is clear. Nothing to do. That's a good evening.</p></div>}
      {parked.map((w) => (
        <div className={'card worry-item' + (leaving.includes(w.id) ? ' leaving' : '')} key={w.id}>
          <p>🛶 {w.text}</p>
          <p className="muted">{new Date(w.at).toLocaleString()}</p>
          <input type="text" placeholder="One practical step (optional)" value={steps[w.id] ?? ''} onChange={(e) => setSteps({ ...steps, [w.id]: e.target.value })} />
          <div className="grid2" style={{ marginTop: 10 }}>
            <button className="btn soft" disabled={!steps[w.id]} onClick={() => settle(w.id, 'step')}>Save the step</button>
            <button className="btn ghost" onClick={() => settle(w.id, 'letgo')}>Let it float away</button>
          </div>
        </div>
      ))}
      <button className="btn block" onClick={() => (onFinished ? onFinished() : back())}>Close worry time</button>
    </div>
  );
}

const COUNTERS: { k: keyof Counts; label: string; icon: string }[] = [
  { k: 'checks', label: 'Checked watch / pulse', icon: '⌚' },
  { k: 'ecg', label: 'Took ECG', icon: '📈' },
  { k: 'reassurance', label: 'Asked "am I OK?"', icon: '💬' },
  { k: 'google', label: 'Googled', icon: '🔎' },
];

export function Counters() {
  const { data, update } = useStore();
  const c = data!.counts[today()] ?? emptyCounts();
  return (
    <div className="counters">
      {COUNTERS.map(({ k, label, icon }) => (
        <button key={k} className="counter pebble" aria-label={`${label}: ${c[k]}. Tap to add one.`}
          onClick={() => update((d) => { d.counts[today()] ??= emptyCounts(); d.counts[today()][k]++; })}>
          <em aria-hidden>{icon}</em><b>{c[k]}</b><span>{label}</span>
        </button>
      ))}
    </div>
  );
}

export function UndoCounter() {
  const { data, update } = useStore();
  const c = data!.counts[today()];
  if (!c || !Object.values(c).some((n) => n > 0)) return null;
  return (
    <div className="row wrap muted" style={{ gap: 6, marginTop: 6 }}>
      Tapped by mistake?
      {COUNTERS.filter(({ k }) => c[k] > 0).map(({ k, label }) => (
        <button key={k} className="link" onClick={() => update((d) => { d.counts[today()][k]--; })}>−1 {label.split(' ')[0].toLowerCase()}</button>
      ))}
    </div>
  );
}
