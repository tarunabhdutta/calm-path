// "How Calm Path works": five plain cards, shown once after setup (and once to people updating
// from v1.6), and any time from Settings. No metaphors without the plain words beside them.
import { useState } from 'react';
import { fx } from '../lib/sound';
import { useStore } from '../lib/store';
import { Tulu } from '../game/Mascot';
import { Island } from '../game/Island';
import { useSwipe } from '../lib/motion';

function Levels() {
  return (
    <div className="g-levels" aria-hidden>
      {Array.from({ length: 10 }, (_, i) => (
        <span key={i} className={i === 0 ? 'on' : i === 1 ? 'two' : ''} style={{ ['--k' as any]: i }}>{i + 1}{i > 0 && <em>🔒</em>}</span>
      ))}
    </div>
  );
}

function MissionMock() {
  return (
    <div className="g-mock mission-card" aria-hidden style={{ background: 'linear-gradient(135deg, #ffe3c4, #fff6e8)' }}>
      <small>TODAY'S MISSION · LEVEL 1 · MISSION 1</small>
      <b>Welcome. Two stories</b>
      <span className="g-steps"><i>1 Read</i><i>2 Practise</i><i>3 Finish</i></span>
      <span className="btn g-press">Start</span>
      <span className="g-finger">👆</span>
    </div>
  );
}

function Rings() {
  return (
    <div className="g-rings" aria-hidden>
      {[['🪷', 'Breathe 5 min'], ['⛅', 'How am I?'], ['🧭', 'Mission']].map(([i, l]) => (
        <span key={l}>
          <span className="g-ring">
            <svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="27" fill="var(--surface)" stroke="var(--line)" strokeWidth="6" />
              <circle className="fill" cx="32" cy="32" r="27" fill="none" stroke="var(--leaf)" strokeWidth="6" strokeLinecap="round" transform="rotate(-90 32 32)" /></svg>
            <em>{i}</em>
          </span>{l}
        </span>
      ))}
    </div>
  );
}

function SurgeMock() {
  return (
    <div className="surge g-mock" aria-hidden>
      <svg className="surge-waves" viewBox="0 0 400 60" preserveAspectRatio="none">
        <path className="wave w1" d="M0 30 Q50 18 100 30 T200 30 T300 30 T400 30 T500 30 T600 30 T700 30 T800 30 V60 H0Z" fill="rgba(255,255,255,.18)" />
        <path className="wave w2" d="M0 38 Q50 28 100 38 T200 38 T300 38 T400 38 T500 38 T600 38 T700 38 T800 38 V60 H0Z" fill="rgba(255,255,255,.14)" />
      </svg>
      <span className="g-surge-tap" />
      <b>SURGE</b><span>Feeling a wave of fear? Press here.</span>
    </div>
  );
}

const CARDS = [
  { title: 'Calm Path works like a game', art: <Levels />, body: [
    'There are 10 levels. Each level takes about one week.',
    'Each level has a few missions. Finish them all, and the next level opens.',
  ]},
  { title: 'Every day, start with the green button', art: <MissionMock />, body: [
    'Open the app and press Start on "Today\'s mission". A mission takes 10 to 15 minutes.',
    'Every mission has three steps: 1. Read a few short cards. 2. Do one practice. 3. Answer one question.',
    'Missions open one at a time, so there is never too much at once.',
  ]},
  { title: 'Three small things each day', art: <Rings />, body: [
    'Fill three rings every day: slow breathing for 5 minutes, a 30-second "How am I today?", and your mission.',
    'A little every day helps more than a lot once in a while.',
  ]},
  { title: 'When a wave of fear comes', art: <SurgeMock />, body: [
    'Any time, day or night, press the blue SURGE button.',
    'A calm voice guides you step by step, and every word is written on screen.',
  ]},
  { title: 'Your island grows as you practise', art: <div className="g-island"><span className="g-drop">💧</span><span className="g-drop">💧</span><span className="g-drop">💧</span><Island level={3} /></div>, body: [
    'Everything you practise earns water drops 💧. The drops grow Tulu\'s island.',
    'New tools open as you finish missions. You will always see which mission opens each one.',
  ]},
];

export function Guide({ onDone }: { onDone: () => void }) {
  const { data, update } = useStore();
  const [i, setIRaw] = useState(0);
  const [turn, setTurn] = useState<'fwd' | 'back'>('fwd');
  const setI = (n: number) => { setTurn(n < i ? 'back' : 'fwd'); setIRaw(n); };
  const c = CARDS[i];
  const last = i === CARDS.length - 1;
  const started = Object.keys(data?.sessions ?? {}).length > 0;
  const finish = () => {
    update((d) => { d.game.tutorialSeen = true; });
    onDone();
  };
  const swipe = useSwipe(() => { if (!last) { fx('F-04'); setI(i + 1); } }, () => { if (i > 0) { fx('F-04'); setI(i - 1); } });
  return (
    <div className="full guide">
      <div className="row spread">
        <div className="pager-dots" aria-hidden>{CARDS.map((_, k) => <i key={k} className={k === i ? 'on here' : k < i ? 'on' : ''} />)}</div>
        <button className="link" onClick={finish}>Skip</button>
      </div>
      <div className="guide-tulu hop" key={'t' + i}><Tulu size={96} mood={last ? 'excited' : 'happy'} /></div>
      <p className="moment-kicker">How Calm Path works · {i + 1} of {CARDS.length}</p>
      <h1>{c.title}</h1>
      <div className="swipe-zone" {...swipe}>
        <div className={`guide-art turn-${turn}`} key={i}>{c.art}</div>
        {c.body.map((b) => <p key={b} className="guide-p">{b}</p>)}
      </div>
      <div className="row" style={{ marginTop: 16 }}>
        <button className="btn ghost" disabled={i === 0} onClick={() => { fx('F-04'); setI(i - 1); }}>Back</button>
        <span className="grow beacon" style={{ display: 'block', borderRadius: 16, ['--beacon' as any]: 'var(--leaf-2)' }}>
          <button className="btn block shine" onClick={() => { fx('F-04'); if (last) finish(); else setI(i + 1); }}>
            <span className="shine-band" aria-hidden />{last ? (started ? 'Back to my island' : 'Start Level 1') : 'Next ›'}
          </button>
        </span>
      </div>
    </div>
  );
}
