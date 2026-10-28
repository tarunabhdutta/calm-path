// v1.3 games:
//  BodyLab          - bring on body sensations on purpose (gentle items open; strong items need the doctor's OK)
//  ListeningGarden  - attention training with island sounds: focus → switch → spread
//  TheoryGame       - the Danger story vs the Alarm story: evidence jars and belief ratings
//  SwitchGame       - the fight switch: the feeling itself vs the struggle we add
import { useEffect, useRef, useState } from 'react';
import { Back, Chips, Scale, useNav } from '../components/ui';
import { useStore } from '../lib/store';
import { localDate } from '../lib/progress';
import { today, uid } from '../lib/model';
import { crisisText } from '../lib/safety';
import { TuluG, Tulu } from './Mascot';

const doneBtn = (label: string, onClick: () => void) => <button className="btn block" style={{ marginTop: 14 }} onClick={onClick}>{label}</button>;

/* ═════════════ Body Lab ═════════════ */
export interface LabEx { id: string; name: string; how: string; secs: number; strong: boolean; anim: string; feel: string }
export const LAB: LabEx[] = [
  { id: 'stare', name: 'Mirror stare', how: 'Stare at your face in a mirror (or at your hand), as hard as you can.', secs: 120, strong: false, anim: 'stare', feel: 'strange, unreal, floaty' },
  { id: 'tense', name: 'Whole-body squeeze', how: 'Tense your arms, legs, tummy, shoulders and face, firmly but without pain.', secs: 60, strong: false, anim: 'tense', feel: 'trembling, weak, tight' },
  { id: 'headrise', name: 'Head down, up quickly', how: 'Sit, put your head between your knees for 30 seconds, then sit up quickly.', secs: 35, strong: false, anim: 'headrise', feel: 'light-headed, a rush' },
  { id: 'warm', name: 'Warm, stuffy room', how: 'Sit in a warm room with a shawl or blanket on, windows closed.', secs: 300, strong: false, anim: 'warm', feel: 'hot, heavy, airless' },
  { id: 'run', name: 'Run on the spot', how: 'Run on the spot, lifting your knees high.', secs: 120, strong: true, anim: 'run', feel: 'pounding heart, breathless' },
  { id: 'stairs', name: 'Brisk stairs', how: 'Climb a flight of stairs briskly, up and down.', secs: 60, strong: true, anim: 'stairs', feel: 'racing heart, warm' },
  { id: 'overbreathe', name: 'Fast breathing', how: 'Sitting down, breathe deep, fast and forcefully, as if blowing up balloons.', secs: 60, strong: true, anim: 'puff', feel: 'tingling, dizzy, unreal' },
  { id: 'straw', name: 'Straw breathing', how: 'Breathe only through a thin drinking straw, holding your nose if needed.', secs: 120, strong: true, anim: 'straw', feel: 'not enough air' },
  { id: 'spin', name: 'Gentle spin', how: 'Turn around on the spot, about one turn every 3 seconds, near a soft chair.', secs: 60, strong: true, anim: 'spin', feel: 'dizzy, off-balance' },
  { id: 'hold', name: 'Breath hold', how: 'Take a normal breath and hold it.', secs: 30, strong: true, anim: 'hold', feel: 'pressure, air hunger' },
];

type LabEntry = { exercise: string; round: number; anxiety: number; similarity: number; prediction: string; happened: string; date: string };

function labEntries(d: any): LabEntry[] {
  return ((d.entries.bodyLab ?? []) as { values: LabEntry }[]).map((e) => e.values);
}

function LabTulu({ anim, running }: { anim: string; running: boolean }) {
  return (
    <svg viewBox="0 0 220 170" className="lab-svg" aria-hidden>
      <ellipse cx="110" cy="158" rx="80" ry="8" fill="rgba(0,0,0,.07)" />
      {anim === 'stairs' && <g fill="#d9c49b">{[0, 1, 2, 3].map((i) => <rect key={i} x={40 + i * 36} y={150 - i * 16} width="40" height={16 + i * 16} rx="3" />)}</g>}
      {anim === 'warm' && <circle cx="185" cy="30" r="18" fill="#ffb26b" className="la-pulse" />}
      {anim === 'stare' && <g><rect x="150" y="30" width="46" height="70" rx="23" fill="#dff1f7" stroke="#a9c3cc" strokeWidth="4" /><circle cx="173" cy="64" r="10" fill="#b0bdc8" className={running ? 'la-pulse' : ''} /></g>}
      {anim === 'straw' && <rect x="44" y="96" width="44" height="4" rx="2" fill="#ef8fb0" transform="rotate(-12 66 98)" />}
      <g transform="translate(38 46)"><g className={'lab-tulu ' + (running ? 'lab-' + anim : '')}><TuluG mood={running ? 'excited' : 'happy'} /></g></g>
    </svg>
  );
}

export function BodyLab({ onFinished }: { onFinished?: () => void }) {
  const { data, update } = useStore();
  const { back, go } = useNav();
  const ok = !!data!.profile.doctorOkBodyPractice;
  const all = labEntries(data!);
  const [ex, setEx] = useState<LabEx | null>(null);
  const [stage, setStage] = useState<'menu' | 'predict' | 'go' | 'rate' | 'settle' | 'done'>('menu');
  const [round, setRound] = useState(1);
  const [prediction, setPrediction] = useState('');
  const [left, setLeft] = useState(0);
  const [felt, setFelt] = useState(false);
  const [anx, setAnx] = useState(5);
  const [sim, setSim] = useState(5);
  const [happened, setHappened] = useState<string[]>([]);
  const timer = useRef<number | null>(null);

  useEffect(() => () => { if (timer.current) window.clearInterval(timer.current); }, []);
  const tick = (secs: number, then: () => void) => {
    setLeft(secs);
    if (timer.current) window.clearInterval(timer.current);
    timer.current = window.setInterval(() => setLeft((l) => { if (l <= 1) { window.clearInterval(timer.current!); then(); return 0; } return l - 1; }), 1000);
  };
  const start = () => { setFelt(false); setStage('go'); tick(ex!.secs, () => setStage('rate')); };
  const iFeelIt = () => { if (felt) return; setFelt(true); setLeft((l) => Math.max(l, 30)); };
  const saveRound = () => {
    const v: LabEntry = { exercise: ex!.id, round, anxiety: anx, similarity: sim, prediction, happened: happened.join(', '), date: today() };
    update((d) => { d.entries.bodyLab ??= []; d.entries.bodyLab.push({ id: uid(), at: new Date().toISOString(), values: v as any }); });
    setStage('settle'); tick(45, () => setStage(round >= 3 ? 'done' : 'predict'));
    if (round < 3) setRound(round + 1);
  };
  const best = (id: string) => {
    const rs = all.filter((e) => e.exercise === id);
    if (!rs.length) return null;
    const sim = Math.max(...rs.map((r) => r.similarity));
    const days = Array.from(new Set(rs.map((r) => r.date)));
    const peaks = days.map((d) => Math.max(...rs.filter((r) => r.date === d).map((r) => r.anxiety)));
    return { sim, firstAnx: rs[0].anxiety, lastPeak: peaks[peaks.length - 1], lowDays: peaks.slice(-3).filter((p) => p <= 2).length, n: rs.length };
  };

  if (stage === 'menu' || !ex) {
    return (
      <div className="app">
        <Back onClick={onFinished} />
        <h1>The Body Lab 🧪</h1>
        <p className="ink2">Bring on a feeling on purpose, for a short time, and see what really happens. Rate how scary it was, and how much it felt like a real wave. Practise the ones that feel most like your waves.</p>
        {!ok && <div className="banner">The heart-raising exercises open after your doctor has said yes once (Settings → "My doctor said yes"). The gentle ones are open now.</div>}
        <div className="lab-grid">
          {LAB.map((e) => {
            const b = best(e.id);
            const locked = e.strong && !ok;
            const star = b && b.sim >= 2 && b.firstAnx >= 3 && b.lowDays < 3;
            return (
              <button key={e.id} className={'lab-card' + (locked ? ' locked' : '') + (star ? ' star' : '')} disabled={locked}
                onClick={() => { setEx(e); setRound(1); setPrediction(''); setStage('predict'); }}>
                <LabTulu anim={e.anim} running={false} />
                <b>{e.name}</b>
                <span>{locked ? '🔒 doctor\'s OK' : `${e.secs >= 60 ? e.secs / 60 + ' min' : e.secs + ' s'} · ${e.feel}`}</span>
                {b && <span className="lab-stats">{star ? '⭐ practise this · ' : ''}peak today-ish {b.lastPeak}/10 · {b.n} rounds{b.lowDays >= 3 ? ' · mastered ✓' : ''}</span>}
              </button>
            );
          })}
        </div>
        <p className="muted">Daily dose: three rounds of one exercise, every day, until the day's highest fear stays at 2 or less for a few days. Then move to the next ⭐.</p>
        {onFinished && doneBtn('Back to the session', onFinished)}
        {!onFinished && <button className="link" onClick={() => go({ name: 'settings' })}>Doctor's OK is in Settings</button>}
      </div>
    );
  }

  return (
    <div className="app lab-screen">
      {stage !== 'go' && <Back label="Lab menu" onClick={() => { setStage('menu'); setEx(null); }} />}
      <p className="muted" style={{ textAlign: 'center' }}>{ex.name} · round {round} of 3</p>
      <LabTulu anim={ex.anim} running={stage === 'go'} />
      {stage === 'predict' && (
        <div className="card pop-in">
          <p className="ink2">{ex.how}</p>
          <label className="f">What does the anxiety predict will happen?</label>
          <input type="text" value={prediction} onChange={(e) => setPrediction(e.target.value)} placeholder="e.g. my heart won't settle; I'll faint" />
          <p className="muted">During the exercise: no checking, no sitting down to recover, no breathing tricks. Make it as strong as you can.</p>
          <button className="btn block" onClick={start}>Start {ex.secs >= 60 ? `${ex.secs / 60} min` : `${ex.secs} s`}</button>
        </div>
      )}
      {stage === 'go' && (
        <div className="flow" style={{ gap: 10 }}>
          <div className="lab-timer"><b>{Math.floor(left / 60)}:{String(left % 60).padStart(2, '0')}</b></div>
          <p className="caption small">{felt ? 'Good. Keep going. Stay with it, let it build.' : ex.how}</p>
          {!felt && <button className="btn water" onClick={iFeelIt}>I can feel it now</button>}
          <button className="link" onClick={() => { if (timer.current) window.clearInterval(timer.current); setStage('rate'); }}>Stop here</button>
        </div>
      )}
      {stage === 'rate' && (
        <div className="card pop-in">
          <h3>Stop. Rate it now.</h3>
          <label className="f">How scary were the feelings? (0–10)</label>
          <Scale value={anx} onChange={setAnx} low="not at all" high="extremely" />
          <label className="f">How much like a real wave? (0–10)</label>
          <Scale value={sim} onChange={setSim} low="not at all" high="exactly" />
          <label className="f">Did the anxiety's prediction come true?</label>
          <Chips options={['No', 'Partly', 'Yes']} value={happened} onChange={setHappened} />
          <button className="btn block" style={{ marginTop: 12 }} disabled={!happened.length} onClick={saveRound}>Save round {round} · +3 💧</button>
        </div>
      )}
      {stage === 'settle' && (
        <div className="card soft pop-in" style={{ textAlign: 'center' }}>
          <h3>Let it settle by itself</h3>
          <p>No tricks needed. Just notice what the feelings do on their own, like weather passing. {left}s</p>
          <p className="muted">Three questions to think over: What was I afraid of? How likely was it really? How did I cope?</p>
        </div>
      )}
      {stage === 'done' && (
        <div className="card pop-in" style={{ textAlign: 'center' }}>
          <Tulu size={110} mood="excited" />
          <h3>Three rounds done. That's real courage.</h3>
          <p>Come back tomorrow for the same exercise. Watch what happens to the peak over the days.</p>
          {doneBtn('Back to the lab', () => { setStage('menu'); setEx(null); })}
          {onFinished && <button className="link" onClick={onFinished}>Back to the session</button>}
          {!onFinished && <button className="link" onClick={back}>Close</button>}
        </div>
      )}
    </div>
  );
}

/* ═════════════ Listening Garden (attention training) ═════════════ */
type Src = { id: string; name: string; icon: string; pan: number; x: number; y: number };
const SOUNDS: Src[] = [
  { id: 'river', name: 'the river', icon: '🌊', pan: -0.5, x: 22, y: 70 },
  { id: 'bird', name: 'the bird', icon: '🐦', pan: -0.8, x: 14, y: 22 },
  { id: 'chimes', name: 'the wind chimes', icon: '🎐', pan: 0.7, x: 80, y: 26 },
  { id: 'frog', name: 'the frog', icon: '🐸', pan: 0.55, x: 74, y: 76 },
  { id: 'rain', name: 'the rain on leaves', icon: '🌧️', pan: 0, x: 50, y: 18 },
  { id: 'bell', name: 'the temple bell', icon: '🔔', pan: 0.95, x: 92, y: 52 },
  { id: 'crickets', name: 'the crickets', icon: '🦗', pan: -0.95, x: 8, y: 50 },
  { id: 'knock', name: 'the woodpecker', icon: '🪵', pan: 0.25, x: 60, y: 46 },
  { id: 'breeze', name: 'the breeze in the bamboo', icon: '🎋', pan: -0.25, x: 36, y: 40 },
];

class Garden {
  ctx = new AudioContext();
  master = this.ctx.createGain();
  stops: (() => void)[] = [];
  noise: AudioBuffer;
  timer: number | null = null;
  constructor() {
    this.master.gain.value = 0.55;
    this.master.connect(this.ctx.destination);
    const n = this.ctx.createBuffer(1, this.ctx.sampleRate * 2, this.ctx.sampleRate);
    const ch = n.getChannelData(0);
    for (let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1;
    this.noise = n;
  }
  out(pan: number, vol: number) {
    const g = this.ctx.createGain(); g.gain.value = vol;
    const p = this.ctx.createStereoPanner(); p.pan.value = pan;
    g.connect(p).connect(this.master);
    return g;
  }
  loopNoise(pan: number, type: BiquadFilterType, freq: number, q: number, vol: number, wobble = 0) {
    const s = this.ctx.createBufferSource(); s.buffer = this.noise; s.loop = true;
    const f = this.ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
    const o = this.out(pan, vol);
    s.connect(f).connect(o); s.start();
    let lfo: OscillatorNode | null = null;
    if (wobble) { lfo = this.ctx.createOscillator(); lfo.frequency.value = 0.08; const lg = this.ctx.createGain(); lg.gain.value = wobble; lfo.connect(lg).connect(o.gain); lfo.start(); }
    this.stops.push(() => { s.stop(); lfo?.stop(); });
  }
  ping(pan: number, freq: number, dur: number, vol: number, type: OscillatorType = 'sine', sweep = 0) {
    const t = this.ctx.currentTime, o = this.ctx.createOscillator(), g = this.out(pan, 0);
    o.type = type; o.frequency.setValueAtTime(freq, t); if (sweep) o.frequency.linearRampToValueAtTime(freq + sweep, t + dur * 0.6);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); o.start(t); o.stop(t + dur + 0.05);
  }
  burst(pan: number, freq: number, vol: number) {
    const t = this.ctx.currentTime, s = this.ctx.createBufferSource(); s.buffer = this.noise;
    const f = this.ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = 6;
    const g = this.out(pan, 0); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
    s.connect(f).connect(g); s.start(t); s.stop(t + 0.1);
  }
  start() {
    const S = Object.fromEntries(SOUNDS.map((s) => [s.id, s.pan]));
    this.loopNoise(S.river, 'lowpass', 380, 0.7, 0.5, 0.15);
    this.loopNoise(S.rain, 'bandpass', 3800, 1.4, 0.12, 0.06);
    this.loopNoise(S.breeze, 'bandpass', 900, 0.6, 0.16, 0.14);
    const next: Record<string, number> = {};
    const due = (id: string, min: number, max: number) => {
      const now = this.ctx.currentTime;
      if (!next[id]) next[id] = now + Math.random() * min;
      if (now >= next[id]) { next[id] = now + min + Math.random() * (max - min); return true; }
      return false;
    };
    const penta = [523, 587, 659, 784, 880, 1047];
    this.timer = window.setInterval(() => {
      if (due('bird', 1.5, 4)) [0, 0.14, 0.28].forEach((d, i) => window.setTimeout(() => this.ping(S.bird, 2600 + i * 180, 0.12, 0.08, 'sine', 900), d * 1000));
      if (due('chimes', 2, 5)) this.ping(S.chimes, penta[Math.floor(Math.random() * penta.length)] * 2, 2.2, 0.06);
      if (due('frog', 3, 6)) [0, 0.22].forEach((d) => window.setTimeout(() => this.ping(S.frog, 140, 0.16, 0.12, 'triangle', -30), d * 1000));
      if (due('bell', 7, 12)) [420, 846, 1270].forEach((f, i) => this.ping(S.bell, f, 4 - i, 0.05 / (i + 1)));
      if (due('crickets', 1.2, 3)) [0, 0.06, 0.12, 0.18].forEach((d) => window.setTimeout(() => this.ping(S.crickets, 4600, 0.04, 0.03), d * 1000));
      if (due('knock', 2.5, 7)) { const n = 2 + Math.floor(Math.random() * 4); for (let i = 0; i < n; i++) window.setTimeout(() => this.burst(S.knock, 1100, 0.25), i * 90 + Math.random() * 40); }
    }, 200);
  }
  stop() { if (this.timer) window.clearInterval(this.timer); this.stops.forEach((s) => s()); this.ctx.close().catch(() => {}); }
}

export function ListeningGarden({ onFinished }: { onFinished?: () => void }) {
  const { update } = useStore();
  const { back } = useNav();
  const [mins, setMins] = useState<number | null>(null);
  const [sec, setSec] = useState(0);
  const [focus, setFocus] = useState<number[]>([]);
  const [rating, setRating] = useState<number | null>(null);
  const g = useRef<Garden | null>(null);
  const total = (mins ?? 12) * 60;
  const p1 = Math.round(total * 5 / 12), p2 = Math.round(total * 10 / 12);
  const phase = sec < p1 ? 1 : sec < p2 ? 2 : 3;

  useEffect(() => () => g.current?.stop(), []);
  useEffect(() => {
    if (!mins || rating !== null) return;
    if (sec >= total) { g.current?.stop(); g.current = null; return; }
    const t = window.setTimeout(() => setSec(sec + 1), 1000);
    if (phase === 1) setFocus([Math.floor(sec / (p1 / SOUNDS.length)) % SOUNDS.length]);
    else if (phase === 2 && sec % 5 === 0) setFocus([Math.floor(Math.random() * SOUNDS.length)]);
    else if (phase === 3) setFocus(SOUNDS.map((_, i) => i));
    return () => window.clearTimeout(t);
  }, [mins, sec]); // eslint-disable-line react-hooks/exhaustive-deps

  const begin = (m: number) => { setMins(m); setSec(0); g.current = new Garden(); g.current.start(); };
  const finish = (r: number) => {
    setRating(r);
    update((d) => { d.entries.listening ??= []; d.entries.listening.push({ id: uid(), at: new Date().toISOString(), values: { minutes: Math.round(sec / 60), selfFocus: r } }); });
  };
  const ended = !!mins && sec >= total;
  const f = focus.length === 1 ? SOUNDS[focus[0]] : null;

  return (
    <div className="full garden-screen">
      <Back label="Close" onClick={() => { g.current?.stop(); onFinished ? onFinished() : back(); }} />
      <h1 style={{ textAlign: 'center' }}>The Listening Garden 🎧</h1>
      <div className="garden-map">
        {SOUNDS.map((s, i) => (
          <div key={s.id} className={'garden-src' + (focus.includes(i) ? ' on' : '')} style={{ left: `${s.x}%`, top: `${s.y}%` }}>
            <span>{s.icon}</span>{focus.includes(i) && <i className="src-ring" />}
          </div>
        ))}
        <div className="garden-tulu"><Tulu size={70} mood={mins && !ended ? 'calm' : 'happy'} /></div>
      </div>
      {!mins && (
        <div className="card">
          <p>Headphones help: the sounds sit to your left and right. Keep your eyes open, resting on one spot. Thoughts and sensations may come. Let them, and go back to the sounds.</p>
          <p className="muted">This trains attention. It is practice for calm times, not something to use in a wave.</p>
          <div className="grid2"><button className="btn" onClick={() => begin(12)}>Full · 12 min</button><button className="btn soft" onClick={() => begin(6)}>Short · 6 min</button></div>
        </div>
      )}
      {mins && !ended && (
        <div className="card soft garden-cue" key={phase + (f?.id ?? 'all')}>
          <small>{phase === 1 ? 'Phase 1 · focus' : phase === 2 ? 'Phase 2 · switch' : 'Phase 3 · spread'} · {Math.floor((total - sec) / 60)}:{String((total - sec) % 60).padStart(2, '0')}</small>
          <p className="caption small" style={{ minHeight: 0 }}>{phase === 3 ? 'Now widen out. Hear all the sounds at once. How many can you hold together?' : `Give all your attention to ${f?.name}. Nothing else matters for now. If another sound pulls you away, gently come back.`}</p>
        </div>
      )}
      {ended && rating === null && (
        <div className="card pop-in">
          <h3>Where was your attention, overall?</h3>
          <div className="row spread muted"><span>all on myself</span><span>all outside</span></div>
          <div className="icon-pick" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
            {[-3, -2, -1, 0, 1, 2, 3].map((v) => <button key={v} onClick={() => finish(v)}><i>{v > 0 ? '🌳' : v < 0 ? '🫧' : '⚖️'}</i><span>{v > 0 ? `+${v}` : v}</span></button>)}
          </div>
        </div>
      )}
      {rating !== null && (
        <div className="card pop-in" style={{ textAlign: 'center' }}>
          <h3>Well trained. +3 💧</h3>
          <p>Attention is a muscle. Practise once or twice a day, and it gets easier to move it where you choose.</p>
          {doneBtn('Done', () => (onFinished ? onFinished() : back()))}
        </div>
      )}
    </div>
  );
}

/* ═════════════ Two stories ═════════════ */
export function TheoryGame({ onFinished }: { onFinished?: () => void }) {
  const { data, update } = useStore();
  const { back, go } = useNav();
  const t = (data!.persistent.theory ?? {}) as { a?: number; b?: number; ea?: string[]; eb?: string[]; history?: { at: string; a: number; b: number }[] };
  const [a, setA] = useState(t.a ?? 70);
  const [b, setB] = useState(t.b ?? 30);
  const [ea, setEa] = useState<string[]>(t.ea ?? []);
  const [eb, setEb] = useState<string[]>(t.eb ?? []);
  const [text, setText] = useState('');
  const hist = t.history ?? [];
  const add = (side: 'a' | 'b') => {
    if (!text.trim()) return;
    if (crisisText(text)) { go({ name: 'safety', crisis: true }); return; }
    side === 'a' ? setEa([...ea, text.trim()]) : setEb([...eb, text.trim()]);
    setText('');
  };
  const save = () => {
    update((d) => { d.persistent.theory = { a, b, ea, eb, history: [...hist.filter((h) => localDate(h.at) !== today()), { at: new Date().toISOString(), a, b }] }; });
    onFinished ? onFinished() : back();
  };
  const tilt = Math.max(-14, Math.min(14, (b - a) / 6));
  return (
    <div className="app">
      <Back onClick={onFinished} />
      <h1>Which story fits? ⚖️</h1>
      <div className="theory-scale">
        <svg viewBox="0 0 320 150" aria-hidden>
          <rect x="157" y="40" width="6" height="96" rx="3" fill="#a07a4f" /><path d="M140 140 h40 l-6 -10 h-28z" fill="#a07a4f" />
          <g style={{ transform: `rotate(${tilt}deg)`, transformOrigin: '160px 42px', transition: 'transform .8s cubic-bezier(.3,1.4,.5,1)' }}>
            <rect x="40" y="38" width="240" height="6" rx="3" fill="#b98f5f" />
            <g transform="translate(70 44)"><path d="M-36 0 l-12 40 h96 l-12 -40" fill="none" /><path d="M-40 40 q40 22 80 0z" fill="#f3c1cf" />{ea.slice(0, 8).map((_, i) => <circle key={i} cx={-24 + (i % 4) * 16} cy={32 - Math.floor(i / 4) * 10} r="6" fill="#ef8fb0" className="node-pop" />)}<text y="70" textAnchor="middle" fontSize="11" fontWeight="900" fill="#b0506e">Danger</text></g>
            <g transform="translate(250 44)"><path d="M-40 40 q40 22 80 0z" fill="#bfe3cd" />{eb.slice(0, 8).map((_, i) => <circle key={i} cx={-24 + (i % 4) * 16} cy={32 - Math.floor(i / 4) * 10} r="6" fill="#3e8a62" className="node-pop" />)}<text y="70" textAnchor="middle" fontSize="11" fontWeight="900" fill="#2e6b4b">Alarm</text></g>
          </g>
        </svg>
      </div>
      <div className="grid2">
        <div className="card theory-a"><b>Danger</b><p>"Something is wrong with my heart; I must watch and check."</p><label className="f">I believe it: {a}%</label><Scale value={a} onChange={setA} max={100} step={5} /></div>
        <div className="card theory-b"><b>Alarm</b><p>"My alarm is sensitive; watching and checking keep it loud."</p><label className="f">I believe it: {b}%</label><Scale value={b} onChange={setB} max={100} step={5} /></div>
      </div>
      <div className="card">
        <label className="f">Add a piece of evidence (a fact you noticed)</label>
        <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="e.g. the thump came while I was relaxed after tea" />
        <div className="grid2" style={{ marginTop: 10 }}><button className="btn soft" onClick={() => add('a')}>Fits Danger</button><button className="btn" onClick={() => add('b')}>Fits Alarm</button></div>
        {(ea.length > 0 || eb.length > 0) && <div className="evidence-lists"><ul className="b">{ea.map((x, i) => <li key={'a' + i} className="ev-a">Danger · {x}</li>)}</ul><ul className="b">{eb.map((x, i) => <li key={'b' + i} className="ev-b">Alarm · {x}</li>)}</ul></div>}
      </div>
      {hist.length > 0 && <p className="muted">Your ratings over time: {hist.slice(-6).map((h) => `Danger ${h.a} / Alarm ${h.b}`).join(' → ')}</p>}
      <p className="muted">You don't need to believe the Alarm story to test it. Act as if it were true for ten weeks, and let the evidence decide.</p>
      {doneBtn('Save · +3 💧', save)}
    </div>
  );
}

/* ═════════════ The fight switch ═════════════ */
const SPARKS = ['check the watch', 'Google it', 'ask "am I OK?"', 'brace & tense', '"what if this time…"', 'avoid the stairs'];

export function SwitchGame({ onFinished }: { onFinished?: () => void }) {
  const { update } = useStore();
  const { back } = useNav();
  const [on, setOn] = useState(true);
  const [sparks, setSparks] = useState(2);
  const dirty = on ? Math.min(100, 20 + sparks * 13) : 0;
  return (
    <div className="app">
      <Back onClick={onFinished} />
      <h1>The fight switch 🔌</h1>
      <p className="ink2">There is the feeling itself, and there is everything we add by fighting it. Tap the sparks to see the fighting pile up, then flip the switch.</p>
      <div className="switch-stage">
        <div className="meter">
          <div className="meter-clean"><span>feeling</span></div>
          <div className="meter-dirty" style={{ height: `${dirty * 0.72}%` }}><span>{dirty > 10 ? 'added fight' : ''}</span></div>
        </div>
        <div className="switch-side">
          <button className={'big-switch' + (on ? ' on' : ' off')} onClick={() => { setOn(!on); if (on) update((d) => { d.persistent.switchPractice = { at: new Date().toISOString() }; }); }} aria-pressed={on}>
            <span className="knob" /><b>{on ? 'FIGHTING' : 'OFF'}</b>
          </button>
          <div className="spark-row">
            {SPARKS.map((s, i) => (
              <button key={s} className={'spark' + (on && i < sparks ? ' lit' : '')} disabled={!on} onClick={() => setSparks(Math.max(sparks, i + 1))}>⚡ {s}</button>
            ))}
          </div>
        </div>
      </div>
      {!on ? (
        <div className="card soft pop-in">
          <p><b>Switch off.</b> The feeling is still there, and that's allowed. But nothing is being added to it. You are making room, not fighting.</p>
          <p>Next time a wave comes, say quietly: <i>"Switch off. Let it be here."</i></p>
          {doneBtn('Got it', () => (onFinished ? onFinished() : back()))}
        </div>
      ) : <p className="muted" style={{ textAlign: 'center' }}>Tip: tap the switch.</p>}
    </div>
  );
}
