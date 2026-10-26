// Gentle celebrations: drops floating up, a treasure found, the island growing.
// Watches the data, so every flow gets it for free. Each moment plays once (data.game.seen*).
import { useEffect, useRef, useState } from 'react';
import { useStore } from '../lib/store';
import { drops, earned, level, LEVELS, TREASURES } from './rewards';
import { Island } from './Island';

let ctx: AudioContext | null = null;
function tone(freq: number, at: number, dur: number, vol = 0.05) {
  ctx ??= new AudioContext();
  const o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime + at;
  o.type = 'sine'; o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.03); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + dur + 0.05);
}
export function chime(kind: 'drop' | 'treasure' | 'grow') {
  try {
    if (kind === 'drop') { tone(784, 0, 0.35); tone(1175, 0.09, 0.45, 0.035); }
    else if (kind === 'treasure') [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.11, 0.6, 0.045));
    else [392, 523, 659, 784, 988].forEach((f, i) => tone(f, i * 0.14, 0.8, 0.04));
  } catch { /* no audio */ }
}

type Moment = { kind: 'treasure'; id: string } | { kind: 'grow'; level: number };

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
    const newT = got.filter((id) => !g.seenTreasures.includes(id));
    const grew = lvl > g.seenLevel;
    const gained = nDrops - g.seenDrops;
    if (gained <= 0 && !newT.length && !grew) return;
    if (gained > 0) {
      setFloater({ n: gained, key: Date.now() });
      if (g.sound) chime('drop');
      window.setTimeout(() => setFloater(null), 2200);
    }
    if (newT.length || grew) {
      setQueue((q) => [...q, ...(grew ? [{ kind: 'grow', level: lvl } as Moment] : []), ...newT.map((id) => ({ kind: 'treasure', id }) as Moment)]);
    }
    update((d) => { d.game.seenDrops = nDrops; d.game.seenLevel = Math.max(d.game.seenLevel, lvl); d.game.seenTreasures = Array.from(new Set([...d.game.seenTreasures, ...newT])); });
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const m = queue[0];
  useEffect(() => { if (m && data?.game.sound) chime(m.kind === 'grow' ? 'grow' : 'treasure'); }, [m]); // eslint-disable-line react-hooks/exhaustive-deps

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
            {m.kind === 'treasure' ? (() => {
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
