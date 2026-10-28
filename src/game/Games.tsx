// Interactive mini-games. Each one TEACHES a skill from the programme (never distraction):
//  FearCycleGame  - build your own loop, then break it at the "check" link
//  LeavesGame     - put sticky thoughts on leaves and let them float down the river
//  ForecastGame   - anxiety's forecast vs what really happened
//  LadderGame     - climb your facing-fear ladder rung by rung
//  NotingGame     - map where an urge sits in the body and name it with curiosity
//  RecipeGame     - "After I…, I will…, then I celebrate" little-habit recipe
import { fx } from '../lib/sound';
import { useScene } from '../lib/useScene';
import { useEffect, useMemo, useState } from 'react';
import { useIntroClip } from '../components/VoiceCaption';
import { AUDIO } from '../content/scripts';
import { Back, Chips, Scale, useNav } from '../components/ui';
import { useStore } from '../lib/store';
import { uid } from '../lib/model';
import { crisisText } from '../lib/safety';
import { TuluG, Tulu } from './Mascot';

function Done({ label = 'Done', onClick }: { label?: string; onClick: () => void }) {
  return <button className="btn block" style={{ marginTop: 14 }} onClick={onClick}>{label}</button>;
}

/* ───────────── Fear cycle builder ───────────── */
const LINKS = [
  { id: 'trigger', label: 'What I noticed', ph: 'a thump in my chest', icon: '💥' },
  { id: 'thought', label: 'What my mind said', ph: '"something is wrong with my heart"', icon: '💭' },
  { id: 'feeling', label: 'What I felt', ph: 'fear, doom', icon: '😨' },
  { id: 'body', label: 'What my body did next', ph: 'heart raced, hands shook', icon: '🫀' },
  { id: 'behaviour', label: 'What I did to feel safe', ph: 'checked my watch, asked "am I OK?"', icon: '⌚' },
];

export function FearCycleGame({ onFinished }: { onFinished?: () => void }) {
  useScene('M-11', 'A-01');
  const { data, update } = useStore();
  const { back, go } = useNav();
  const saved = (data!.persistent.fearCycle ?? {}) as Record<string, string>;
  const [v, setV] = useState<Record<string, string>>(saved);
  const [step, setStep] = useState(0);
  const [broken, setBroken] = useState(false);
  const filled = LINKS.filter((l) => (v[l.id] ?? '').trim()).length;
  const finish = () => {
    update((d) => { d.persistent.fearCycle = { ...v }; });
    if (crisisText(Object.values(v).join(' '))) { go({ name: 'safety', crisis: true }); return; }
    onFinished ? onFinished() : back();
  };
  const R = 92;
  return (
    <div className="app">
      <Back onClick={onFinished} />
      <h1>My fear loop 🌀</h1>
      <p className="ink2">Think of a recent wave. Fill each link, and watch the loop light up.</p>
      <svg viewBox="-130 -130 260 260" className="cycle-svg" aria-label={`${filled} of 5 links filled`}>
        <circle r={R} fill="none" stroke="var(--surface-2)" strokeWidth="16" />
        <circle r={R} fill="none" stroke="var(--leaf-2)" strokeWidth="16" strokeLinecap="round" strokeDasharray={2 * Math.PI * R}
          strokeDashoffset={2 * Math.PI * R * (1 - filled / 5)} transform="rotate(-90)" style={{ transition: 'stroke-dashoffset .8s' }}
          className={filled === 5 && !broken ? 'loop-spin' : ''} />
        {broken && <g transform="rotate(-36)"><g className="snip"><circle cx="0" cy="-92" r="17" fill="var(--surface)" /><path d="M-9 -101 L9 -83 M9 -101 L-9 -83" stroke="var(--safety)" strokeWidth="5" strokeLinecap="round" /></g></g>}
        {LINKS.map((l, i) => {
          const a = (i / 5) * Math.PI * 2 - Math.PI / 2, x = Math.cos(a) * R, y = Math.sin(a) * R;
          const on = !!(v[l.id] ?? '').trim();
          return (
            <g key={l.id} transform={`translate(${x} ${y})`} onClick={() => setStep(i)} style={{ cursor: 'pointer' }}>
              <circle r="24" fill={on ? 'var(--leaf)' : 'var(--surface)'} stroke={step === i ? 'var(--sun)' : 'var(--line)'} strokeWidth="3" className={on ? 'node-pop' : ''} />
              <text textAnchor="middle" y="7" fontSize="20">{l.icon}</text>
            </g>
          );
        })}
        <g transform="translate(-38 -34) scale(.55)"><TuluG mood={broken ? 'excited' : filled === 5 ? 'curious' : 'happy'} /></g>
      </svg>
      {!broken ? (
        <div className="card">
          <label className="f">{step + 1}. {LINKS[step].label}</label>
          <input type="text" value={v[LINKS[step].id] ?? ''} placeholder={`e.g. ${LINKS[step].ph}`}
            onChange={(e) => setV({ ...v, [LINKS[step].id]: e.target.value })} />
          <div className="row" style={{ marginTop: 10 }}>
            <button className="btn ghost" disabled={step === 0} onClick={() => setStep(step - 1)}>Back</button>
            {step < 4 ? <button className="btn grow" onClick={() => setStep(step + 1)}>Next link</button>
              : <button className="btn grow" disabled={filled < 5} onClick={() => { fx('F-17'); setBroken(true); }}>See how to break it ✂️</button>}
          </div>
        </div>
      ) : (
        <div className="card soft pop-in">
          <h3>Snip! The loop breaks at the last link.</h3>
          <p>You can't stop a sensation from arriving. But you can change what you do with it. Instead of "{v.behaviour || 'checking'}", you'll practise <b>letting it come and letting time pass</b>. Then the brain can learn for itself, from what really happens.</p>
          <Done label="Save my loop" onClick={finish} />
        </div>
      )}
    </div>
  );
}

/* ───────────── Thought leaves (defusion) ───────────── */
const TECHNIQUES = [
  { id: 'having', label: 'I\'m having the thought that…', make: (t: string) => `I'm having the thought that ${t}` },
  { id: 'noticing', label: 'I notice I\'m having…', make: (t: string) => `I notice I'm having the thought that ${t}` },
  { id: 'thanks', label: 'Thanks, mind!', make: (t: string) => `"${t}" … thanks, mind, I know you're trying to protect me.` },
  { id: 'silly', label: 'Say it in a cartoon voice', make: (t: string) => t },
];

export function LeavesGame({ onFinished }: { onFinished?: () => void }) {
  useScene('M-09', 'A-07');
  const { update } = useStore();
  const { back, go } = useNav();
  const [text, setText] = useState('');
  const [tech, setTech] = useState(TECHNIQUES[0].id);
  const [leaves, setLeaves] = useState<{ id: string; t: string; silly: boolean }[]>([]);
  const [grip, setGrip] = useState(7);
  const [after, setAfter] = useState<number | null>(null);
  const send = () => {
    fx('F-12');
    if (!text.trim()) return;
    if (crisisText(text)) { go({ name: 'safety', crisis: true }); return; }
    const T = TECHNIQUES.find((x) => x.id === tech)!;
    setLeaves((l) => [...l, { id: uid(), t: T.make(text.trim()), silly: tech === 'silly' }]);
    update((d) => { d.entries.defusion ??= []; d.entries.defusion.push({ id: uid(), at: new Date().toISOString(), values: { thought: text.trim(), having: T.make(text.trim()), grip } }); });
    setText('');
  };
  return (
    <div className="app">
      <Back onClick={onFinished} />
      <h1>Leaves on the river 🍃</h1>
      <p className="ink2">Thoughts are words passing through, not facts or orders. Put a sticky thought on a leaf and watch it float by. You don't have to push it away, and you don't have to follow it.</p>
      <div className="stream">
        <svg viewBox="0 0 400 150" preserveAspectRatio="none" className="stream-bg" aria-hidden>
          <path d="M0 40 Q100 20 200 44 T400 36 V120 Q300 140 200 116 T0 124Z" fill="#a8d8e4" />
          <path className="ripple r1" d="M40 80 q14 -4 28 0 t28 0" stroke="#e9f8fb" strokeWidth="2" fill="none" />
          <path className="ripple r2" d="M260 96 q14 -4 28 0 t28 0" stroke="#e9f8fb" strokeWidth="2" fill="none" />
        </svg>
        {leaves.map((l, i) => (
          <div key={l.id} className={'leaf' + (l.silly ? ' silly' : '')} style={{ top: `${22 + (i % 3) * 26}%` }}>🍃 <span>{l.t}</span></div>
        ))}
        {leaves.length === 0 && <div className="stream-hint">Your leaves will float here</div>}
      </div>
      <div className="card">
        <label className="f">How strongly does the thought grip you right now?</label>
        <Scale value={grip} onChange={setGrip} low="loose" high="tight" />
        <label className="f">The sticky thought</label>
        <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder='e.g. "my heart is failing"' />
        <label className="f">Try a way to unhook</label>
        <Chips options={TECHNIQUES.map((t) => t.label)} value={[TECHNIQUES.find((t) => t.id === tech)!.label]} onChange={(v) => setTech(TECHNIQUES.find((t) => t.label === v[0])!.id)} />
        <button className="btn block" style={{ marginTop: 12 }} disabled={!text.trim()} onClick={send}>Place it on a leaf 🍃</button>
      </div>
      {leaves.length > 0 && (
        <div className="card soft">
          <label className="f">And now, how tight is the grip?</label>
          <Scale value={after ?? grip} onChange={setAfter} low="loose" high="tight" />
          {after !== null && after < grip && <p className="pop-in">The grip loosened by {grip - after}. The thought didn't change. Your relationship to it did. 🌿</p>}
          <Done onClick={() => (onFinished ? onFinished() : back())} />
        </div>
      )}
    </div>
  );
}

/* ───────────── Anxiety forecaster (expectancy violation) ───────────── */
export function ForecastGame({ onFinished, task: initialTask }: { onFinished?: () => void; task?: string }) {
  useScene('M-11', 'A-01');
  const { data, update } = useStore();
  const { back } = useNav();
  const log = data!.entries.exposureLog ?? [];
  const forecasts = log.filter((e) => typeof e.values.confidence === 'number' && e.values.happened);
  const [stage, setStage] = useState<'before' | 'doing' | 'after'>('before');
  const [task, setTask] = useState(initialTask ?? '');
  const [fear, setFear] = useState('');
  const [conf, setConf] = useState(70);
  const [peak, setPeak] = useState(60);
  const [came, setCame] = useState<'yes' | 'no' | 'partly' | ''>('');
  const [learned, setLearned] = useState('');
  const [safety, setSafety] = useState<string[]>([]);
  const voice = !!data!.settings.voice;
  useIntroClip(stage === 'after' ? AUDIO.exposureEnd : AUDIO.exposureStart, voice && stage !== 'doing');
  const save = () => {
    update((d) => {
      d.entries.exposureLog ??= [];
      d.entries.exposureLog.push({ id: uid(), at: new Date().toISOString(), values: { task, prediction: fear, confidence: conf, peak, happened: came === 'no' ? 'The feared outcome did not happen' : came === 'partly' ? 'Partly' : 'It happened', learned, safety: safety.join(', ') } });
    });
    onFinished ? onFinished() : back();
  };
  const wrong = forecasts.filter((e) => /did not happen/i.test(String(e.values.happened))).length;
  return (
    <div className="app">
      <Back onClick={onFinished} />
      <h1>The anxiety forecaster ⛈️→☀️</h1>
      {forecasts.length > 0 && <div className="banner">So far the anxiety forecaster has predicted trouble <b>{forecasts.length}</b> times, and been wrong <b>{wrong}</b> times.</div>}
      {stage === 'before' && (
        <div className="card">
          <h3>Before: anxiety makes a forecast</h3>
          <label className="f">What will you practise?</label>
          <input type="text" value={task} onChange={(e) => setTask(e.target.value)} placeholder="e.g. a 20-minute walk alone, without my watch" />
          <label className="f">What does the anxiety predict will happen?</label>
          <input type="text" value={fear} onChange={(e) => setFear(e.target.value)} placeholder="e.g. my heart will race and I'll collapse" />
          <label className="f">How sure is it? {conf}%</label>
          <div className="forecast-meter"><div className="cloud-fill" style={{ width: `${conf}%` }}>{conf > 60 ? '⛈️' : conf > 30 ? '🌧️' : '⛅'}</div></div>
          <Scale value={conf} onChange={setConf} max={100} step={5} low="not at all" high="certain" />
          <button className="btn block" style={{ marginTop: 12 }} disabled={!task.trim() || !fear.trim()} onClick={() => { fx('F-04'); setStage('doing'); }}>I'm going to do it 💪</button>
        </div>
      )}
      {stage === 'doing' && (
        <div className="card pop-in" style={{ textAlign: 'center' }}>
          <Tulu size={110} mood="excited" />
          <h3>Go and do it fully</h3>
          <p>No checking, no reassurance, no escaping early. Let the feelings come along for the ride. Stay until the end, or a little longer. Come back here afterwards.</p>
          <button className="btn block" onClick={() => { fx('F-04'); setStage('after'); }}>I've done it</button>
        </div>
      )}
      {stage === 'after' && (
        <div className="card pop-in">
          <h3>After: what really happened?</h3>
          <label className="f">Did the forecast come true?</label>
          <Chips options={['No, it did not', 'Partly', 'Yes']} value={came ? [{ no: 'No, it did not', partly: 'Partly', yes: 'Yes' }[came]] : []}
            onChange={(v) => setCame(v[0] === 'Yes' ? 'yes' : v[0] === 'Partly' ? 'partly' : 'no')} />
          {came === 'no' && <div className="forecast-flip">⛈️ <span className="arrow">→</span> ☀️ <b>The forecast was wrong!</b></div>}
          <label className="f">Highest fear during it (0–100)</label>
          <Scale value={peak} onChange={setPeak} max={100} step={5} />
          <label className="f">Did you use any safety behaviour?</label>
          <Chips multi options={['None', 'Checked pulse/watch', 'Asked someone', 'Kept phone ready', 'Left early', 'Distracted myself', 'Something else']} value={safety} onChange={setSafety} />
          <label className="f">What did you learn?</label>
          <input type="text" value={learned} onChange={(e) => setLearned(e.target.value)} placeholder="e.g. the fear peaked and passed; I could cope" />
          {safety.length > 0 && !safety.includes('None') && <p className="muted">Next time, try it with one less safety behaviour. That's how the learning sticks.</p>}
          <Done label="Save · +3 💧" onClick={save} />
        </div>
      )}
    </div>
  );
}

/* ───────────── Ladder climb ───────────── */
export function LadderGame({ onFinished }: { onFinished?: () => void }) {
  useScene('M-11', 'A-01');
  const { data } = useStore();
  const { go } = useNav();
  const rungs = useMemo(() => ([...(((data!.persistent.ladder?.rungs) ?? []) as { text: string; rating: number }[])]).filter((r) => r.text.trim()).sort((a, b) => a.rating - b.rating), [data]);
  const log = data!.entries.exposureLog ?? [];
  const clean = (e: { values: Record<string, unknown> }) => { const s = String(e.values.safety ?? '').trim().toLowerCase(); return !s || s === 'none'; };
  const doneCount = (t: string) => log.filter((e) => String(e.values.task ?? '').toLowerCase().includes(t.toLowerCase().slice(0, 12)) && clean(e)).length;
  const current = rungs.findIndex((r) => doneCount(r.text) < 2);
  const at = current === -1 ? rungs.length : current;
  return (
    <div className="app">
      <Back onClick={onFinished} />
      <h1>My ladder 🪜</h1>
      {rungs.length === 0 ? (
        <div className="card"><p>Your ladder is empty. Add the situations you avoid first.</p>
          <button className="btn block" onClick={() => go({ name: 'form', formId: 'ladder' })}>Build my ladder</button></div>
      ) : (
        <>
          <div className="ladder">
            {[...rungs].reverse().map((r, ri) => {
              const i = rungs.length - 1 - ri;
              const n = doneCount(r.text);
              return (
                <div key={i} className={'rung' + (i < at ? ' done' : i === at ? ' here' : '')}>
                  <span className="rung-n">{r.rating}</span>
                  <span className="grow">{r.text}</span>
                  <span className="rung-stars">{'★'.repeat(Math.min(n, 3))}{'☆'.repeat(Math.max(0, 2 - n))}</span>
                  {i === at && <span className="rung-tulu"><Tulu size={48} mood="excited" /></span>}
                </div>
              );
            })}
          </div>
          <p className="muted">A rung is climbed after two practices without safety behaviours, whatever the fear did. Fear going down is a bonus; doing it anyway is the win.</p>
          {rungs.length > 1 && <button className="btn soft block" style={{ marginBottom: 8 }} onClick={() => { const pool = rungs.slice(0, Math.min(rungs.length, at + 3)); const r = pool[Math.floor(Math.random() * pool.length)]; go({ name: 'game', id: 'forecast', task: r.text }); }}>🎲 Draw a rung at random</button>}
          {at < rungs.length && <button className="btn block" onClick={() => { fx('F-13'); go({ name: 'game', id: 'forecast', task: rungs[at].text }); }}>Practise "{rungs[at].text}"</button>}
          <button className="link" onClick={() => go({ name: 'form', formId: 'ladder' })}>Edit my ladder</button>
        </>
      )}
      {!onFinished ? null : <Done onClick={onFinished} />}
    </div>
  );
}

/* ───────────── Noting the urge (curiosity) ───────────── */
const SPOTS = [
  { id: 'head', x: 50, y: 12, label: 'head' }, { id: 'throat', x: 50, y: 25, label: 'throat' },
  { id: 'chest', x: 50, y: 36, label: 'chest' }, { id: 'belly', x: 50, y: 52, label: 'belly' },
  { id: 'hands', x: 22, y: 50, label: 'hands' }, { id: 'legs', x: 50, y: 78, label: 'legs' },
];
const WORDS = ['tight', 'fluttery', 'buzzy', 'warm', 'heavy', 'pulsing', 'restless', 'cold', 'shaky'];

export function NotingGame({ onFinished }: { onFinished?: () => void }) {
  useScene('M-11', 'A-01');
  const { back } = useNav();
  const [spots, setSpots] = useState<string[]>([]);
  const [words, setWords] = useState<string[]>([]);
  const [t, setT] = useState(0);
  useEffect(() => { const i = window.setInterval(() => setT((x) => x + 1), 1000); return () => window.clearInterval(i); }, []);
  return (
    <div className="app">
      <Back onClick={onFinished} />
      <h1>Get curious 🔍</h1>
      <p className="ink2">Instead of checking, become a curious scientist. Where in your body is it right now? Tap the spots.</p>
      <div className="body-map">
        <svg viewBox="0 0 100 100" aria-hidden>
          <circle cx="50" cy="12" r="8" fill="var(--surface-2)" /><rect x="38" y="22" width="24" height="40" rx="10" fill="var(--surface-2)" />
          <rect x="26" y="24" width="8" height="32" rx="4" fill="var(--surface-2)" /><rect x="66" y="24" width="8" height="32" rx="4" fill="var(--surface-2)" />
          <rect x="40" y="60" width="8" height="34" rx="4" fill="var(--surface-2)" /><rect x="52" y="60" width="8" height="34" rx="4" fill="var(--surface-2)" />
        </svg>
        {SPOTS.map((s) => (
          <button key={s.id} className={'spot' + (spots.includes(s.id) ? ' on' : '')} style={{ left: `${s.x}%`, top: `${s.y}%` }}
            onClick={() => { if (!spots.includes(s.id)) fx('F-18'); setSpots(spots.includes(s.id) ? spots.filter((x) => x !== s.id) : [...spots, s.id]); }} aria-label={s.label}>
            <span className="spot-glow" />
          </button>
        ))}
      </div>
      <div className="card">
        <label className="f">What does it feel like? Notice it, gently.</label>
        <Chips multi options={WORDS} value={words} onChange={setWords} />
        {words.length > 0 && <p className="pop-in">"I notice <b>{words.join(', ')}</b>{spots.length ? ` in my ${spots.map((s) => SPOTS.find((x) => x.id === s)!.label).join(' and ')}` : ''}." Just sensations, rising and changing. Notice how they shift as you watch.</p>}
        <p className="muted">{t < 60 ? `Keep noticing… ${60 - t}s` : 'A whole minute of curiosity instead of checking. 🌿'}</p>
        <Done onClick={() => (onFinished ? onFinished() : back())} />
      </div>
    </div>
  );
}

/* ───────────── Tiny-habit recipe ───────────── */
const ANCHORS = ['After I brush my teeth in the morning', 'After I pour my first tea', 'After I sit down for lunch', 'After I come home', 'After I switch off the lights at night'];
const TINY = ['I will breathe with the lotus for 1 minute', 'I will do my 30-second weather check', 'I will open today\'s journey step', 'I will notice one sensation with curiosity'];
const SHINE = ['Say "I did it!"', 'Do a little Tulu wiggle', 'Smile and nod', 'Fist pump 💪'];

export function RecipeGame({ onFinished }: { onFinished?: () => void }) {
  useScene('M-11', 'A-01');
  const { data, update } = useStore();
  const { back } = useNav();
  const prev = (data!.persistent.habitRecipe ?? {}) as Record<string, string>;
  const [a, setA] = useState<string[]>(prev.anchor ? [prev.anchor] : []);
  const [b, setB] = useState<string[]>(prev.tiny ? [prev.tiny] : []);
  const [c, setC] = useState<string[]>(prev.shine ? [prev.shine] : []);
  const [party, setParty] = useState(false);
  const ready = a.length && b.length && c.length;
  return (
    <div className="app">
      <Back onClick={onFinished} />
      <h1>My little habit 🌱</h1>
      <p className="ink2">Big changes grow from little habits tied to something you already do. Build your recipe.</p>
      <div className="card"><label className="f">1. After I…</label><Chips options={ANCHORS} value={a} onChange={setA} /></div>
      <div className="card"><label className="f">2. I will… (keep it small!)</label><Chips options={TINY} value={b} onChange={setB} /></div>
      <div className="card"><label className="f">3. Then I celebrate by…</label><Chips options={SHINE} value={c} onChange={setC} /></div>
      {ready ? (
        <div className={'recipe-card' + (party ? ' party' : '')}>
          <p><b>{a[0]}</b>,<br />{b[0].charAt(0).toLowerCase() + b[0].slice(1)},<br />then I'll <b>{c[0].charAt(0).toLowerCase() + c[0].slice(1)}</b>.</p>
          {party && <div className="tulu-dance"><Tulu size={90} mood="excited" /></div>}
          {!party ? <button className="btn block" onClick={() => setParty(true)}>Practise the celebration now 🎉</button>
            : <Done label="Save my recipe" onClick={() => { fx('F-19'); update((d) => { d.persistent.habitRecipe = { anchor: a[0], tiny: b[0], shine: c[0] }; }); onFinished ? onFinished() : back(); }} />}
        </div>
      ) : null}
    </div>
  );
}
