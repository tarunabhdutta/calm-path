// "How Calm Path works": five plain cards, shown once after setup (and once to people updating
// from v1.6), and any time from Settings. No metaphors without the plain words beside them.
import { useState } from 'react';
import { fx } from '../lib/sound';
import { useStore } from '../lib/store';
import { Tulu } from '../game/Mascot';
import { Island } from '../game/Island';

function Levels() {
  return (
    <div className="g-levels" aria-hidden>
      {Array.from({ length: 10 }, (_, i) => <span key={i} className={i === 0 ? 'on' : ''}>{i + 1}</span>)}
    </div>
  );
}

function MissionMock() {
  return (
    <div className="g-mock mission-card" aria-hidden style={{ background: 'linear-gradient(135deg, #ffe3c4, #fff6e8)' }}>
      <small>TODAY'S MISSION · LEVEL 1 · MISSION 1</small>
      <b>Welcome. Two stories</b>
      <span className="g-steps"><i>1 Read</i><i>2 Practise</i><i>3 Finish</i></span>
      <span className="btn">Start</span>
    </div>
  );
}

function Rings() {
  return (
    <div className="g-rings" aria-hidden>
      {[['🪷', 'Breathe 5 min'], ['⛅', 'How am I?'], ['🧭', 'Mission']].map(([i, l]) => <span key={l}><em>{i}</em>{l}</span>)}
    </div>
  );
}

function SurgeMock() {
  return <div className="surge g-mock" aria-hidden><b>SURGE</b><span>Feeling a wave of fear? Press here.</span></div>;
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
  { title: 'Your island grows as you practise', art: <div className="g-island"><Island level={3} /></div>, body: [
    'Everything you practise earns water drops 💧. The drops grow Tulu\'s island.',
    'New tools open as you finish missions. You will always see which mission opens each one.',
  ]},
];

export function Guide({ onDone }: { onDone: () => void }) {
  const { data, update } = useStore();
  const [i, setI] = useState(0);
  const c = CARDS[i];
  const last = i === CARDS.length - 1;
  const started = Object.keys(data?.sessions ?? {}).length > 0;
  const finish = () => {
    update((d) => { d.game.tutorialSeen = true; });
    onDone();
  };
  return (
    <div className="full guide">
      <div className="row spread">
        <div className="pager-dots" aria-hidden>{CARDS.map((_, k) => <i key={k} className={k <= i ? 'on' : ''} />)}</div>
        <button className="link" onClick={finish}>Skip</button>
      </div>
      <div className="guide-tulu"><Tulu size={96} mood={last ? 'excited' : 'happy'} /></div>
      <p className="moment-kicker">How Calm Path works · {i + 1} of {CARDS.length}</p>
      <h1>{c.title}</h1>
      <div className="guide-art" key={i}>{c.art}</div>
      {c.body.map((b) => <p key={b} className="guide-p">{b}</p>)}
      <div className="row" style={{ marginTop: 16 }}>
        <button className="btn ghost" disabled={i === 0} onClick={() => { fx('F-04'); setI(i - 1); }}>Back</button>
        <button className="btn grow" onClick={() => { fx('F-04'); if (last) finish(); else setI(i + 1); }}>
          {last ? (started ? 'Back to my island' : 'Start Level 1') : 'Next'}
        </button>
      </div>
    </div>
  );
}
