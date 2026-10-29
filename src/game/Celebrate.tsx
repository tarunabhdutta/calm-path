// Gentle celebrations: drops floating up, a treasure found, the island growing.
// Watches the data, so every flow gets it for free. Each moment plays once (data.game.seen*).
import { fx, hasSound } from '../lib/sound';
import { useEffect, useRef, useState } from 'react';
import { useStore } from '../lib/store';
import { drops, earned, LANDS, level, LEVELS, TREASURES } from './rewards';
import { levelsDone, missionsIn, toolsOpenedBy } from '../lib/pathway';
import { Island } from './Island';

let ctx: AudioContext | null = null;
function tone(freq: number, at: number, dur: number, vol = 0.05) {
  ctx ??= new AudioContext();
  const o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime + at;
  o.type = 'sine'; o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.03); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + dur + 0.05);
}
// What arrives at each island level makes its own small sound after the fanfare.
const ARRIVES: Record<number, string> = { 1: 'F-09', 2: 'F-09', 3: 'F-09', 4: 'F-09', 5: 'F-14', 6: 'F-28', 7: 'F-30', 8: 'F-09', 9: 'F-29', 10: 'F-31' };

export function chime(kind: 'drop' | 'treasure' | 'grow', lvl = 0) {
  const rec = { drop: 'F-08', treasure: 'S-01', grow: 'S-02' }[kind];
  if (hasSound(rec)) {
    fx(rec);
    if (kind === 'grow' && ARRIVES[lvl]) window.setTimeout(() => fx(ARRIVES[lvl]), 1600);
    return;
  }
  try {
    if (kind === 'drop') { tone(784, 0, 0.35); tone(1175, 0.09, 0.45, 0.035); }
    else if (kind === 'treasure') [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.11, 0.6, 0.045));
    else [392, 523, 659, 784, 988].forEach((f, i) => tone(f, i * 0.14, 0.8, 0.04));
  } catch { /* no audio */ }
}

type Moment = { kind: 'treasure'; id: string } | { kind: 'grow'; level: number } | { kind: 'levelDone'; level: number };

export function Celebrations() {
  const { data, update } = useStore();
  const [floater, setFloater] = useState<{ n: number; key: number } | null>(null);
  const [queue, setQueue] = useState<Moment[]>([]);
  const first = useRef(true);

  useEffect(() => {
    if (!data) return;
    const g = data.game;
    const nDrops = drops(data), lvl = level(data), got = earned(data);
    if (first.current) {
      first.current = false;
      // a vault from v1.0.0: count what she already earned as seen, without fanfare
      if (g.seenDrops === 0 && nDrops > 0 && g.seenTreasures.length === 0) {
        update((d) => { d.game.seenDrops = nDrops; d.game.seenLevel = lvl; d.game.seenTreasures = got; });
        return;
      }
    }
    // v1.7 levels: an older vault counts the levels it already finished as seen, quietly.
    const lvDone = levelsDone(data).length;
    if (g.levelsSeen === undefined) { update((d) => { d.game.levelsSeen = lvDone; }); return; }
    const newLevels = lvDone > g.levelsSeen ? [lvDone] : [];
    const newT = got.filter((id) => !g.seenTreasures.includes(id));
    const grew = lvl > g.seenLevel;
    const gained = nDrops - g.seenDrops;
    if (gained <= 0 && !newT.length && !grew && !newLevels.length) return;
    if (gained > 0) {
      setFloater({ n: gained, key: Date.now() });
      if (g.sound) chime('drop');
      window.setTimeout(() => setFloater(null), 2200);
    }
    if (newT.length || grew || newLevels.length) {
      setQueue((q) => [...q, ...newLevels.map((l) => ({ kind: 'levelDone', level: l }) as Moment), ...(grew ? [{ kind: 'grow', level: lvl } as Moment] : []), ...newT.map((id) => ({ kind: 'treasure', id }) as Moment)]);
    }
    update((d) => { d.game.levelsSeen = Math.max(d.game.levelsSeen ?? 0, lvDone); d.game.seenDrops = nDrops; d.game.seenLevel = Math.max(d.game.seenLevel, lvl); d.game.seenTreasures = Array.from(new Set([...d.game.seenTreasures, ...newT])); });
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const m = queue[0];
  useEffect(() => { if (m && data?.game.sound) chime(m.kind === 'treasure' ? 'treasure' : 'grow', m.kind === 'grow' ? m.level : 0); }, [m]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {floater && (
        <div className="drop-float" key={floater.key} aria-live="polite">
          <span className="drop-ico" aria-hidden>💧</span> +{floater.n} drop{floater.n > 1 ? 's' : ''} for the island
        </div>
      )}
      {m && (
        <div className="moment-back" onClick={() => setQueue((q) => q.slice(1))}>
          <div className="moment" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="celebration">
            <div className="confetti" aria-hidden>{Array.from({ length: 22 }).map((_, i) => <i key={i} style={{ ['--i' as any]: i, left: `${(i * 37) % 100}%`, animationDelay: `${((i * 7) % 11) * 0.09}s`, animationDuration: `${2 + ((i * 5) % 7) * 0.25}s` }} />)}</div>
            {m.kind === 'levelDone' ? (() => {
              const next = m.level + 1;
              const tools = missionsIn(next).flatMap((x) => toolsOpenedBy(x.id)).map((t) => t.name);
              return (
                <>
                  <div className="moment-icon">{LANDS[m.level].icon}</div>
                  <p className="moment-kicker">Level {m.level} complete!</p>
                  <h1>{LANDS[m.level].name}</h1>
                  <p className="ink2">{next <= 10
                    ? `Level ${next} is open: ${LANDS[next].name}. Its first mission is on your home screen.${tools.length ? ` In this level you will learn: ${tools.join(', ')}.` : ''}`
                    : 'You finished all ten levels. A short visit once a month keeps it strong.'}</p>
                </>
              );
            })() : m.kind === 'treasure' ? (() => {
              const t = TREASURES.find((x) => x.id === m.id)!;
              return (
                <>
                  <div className="moment-icon">{t.icon}</div>
                  <p className="moment-kicker">Treasure found!</p>
                  <h1>{t.name}</h1>
                  <p className="ink2">{t.how}. It's in your treasure chest now.</p>
                </>
              );
            })() : (
              <>
                <div className="moment-island"><Island level={m.level} mood="excited" /></div>
                <p className="moment-kicker">Your island grew!</p>
                <h1>{LEVELS[m.level].name}</h1>
                <p className="ink2">{LEVELS[m.level].adds}</p>
              </>
            )}
            <button className="btn block" onClick={() => setQueue((q) => q.slice(1))}>Lovely!</button>
          </div>
        </div>
      )}
    </>
  );
}
