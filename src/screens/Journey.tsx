// The journey map: ten lands, one per week, each session a stepping stone.
import { fx } from '../lib/sound';
import { useEffect, useRef } from 'react';
import { useNav } from '../components/ui';
import { useStore } from '../lib/store';
import { PROGRAMME } from '../content/programme';
import { coreCount, doneCount, nextSession } from '../lib/progress';
import { LANDS } from '../game/rewards';
import { Tulu } from '../game/Mascot';

const X = [22, 50, 78, 50]; // zigzag positions (% of width)

export function Journey() {
  const { data } = useStore();
  const { go } = useNav();
  const d = data!;
  const { session: next, readyOn } = nextSession(d);
  const here = useRef<HTMLButtonElement | null>(null);
  useEffect(() => { here.current?.scrollIntoView({ block: 'center' }); }, []);
  const weeks = Array.from(new Set(PROGRAMME.map((s) => s.week)));

  return (
    <div className="app">
      <h1>The journey</h1>
      <p className="muted">{doneCount(d)} of {coreCount()} stepping stones · ten lands to explore</p>
      <div className="bar"><i style={{ width: `${(doneCount(d) / coreCount()) * 100}%` }} /></div>

      {weeks.map((w) => {
        const land = LANDS[w];
        const stones = PROGRAMME.filter((s) => s.week === w);
        const allDone = stones.every((s) => d.sessions[s.id]);
        const reached = stones.some((s) => d.sessions[s.id] || s.id === next?.id);
        const h = stones.length * 92 + 20;
        const pts = stones.map((_, i) => `${X[i % 4]},${46 + i * 92}`).join(' ');
        return (
          <section key={w} className={'land' + (reached ? '' : ' fog')} style={{ background: `linear-gradient(180deg, ${land.sky[0]}, ${land.sky[1]})` }}>
            <header>
              <span className="land-icon big">{land.icon}</span>
              <div>
                <small>{w === 11 ? 'Stay well' : `Week ${w}`}</small>
                <h2>{land.name} {allDone && <span className="pill done">explored</span>}</h2>
                <p className="muted">{land.line}</p>
              </div>
            </header>
            <div className="stones" style={{ height: h }}>
              <svg className="trail" viewBox={`0 0 100 ${h}`} preserveAspectRatio="none" aria-hidden>
                <polyline points={pts} fill="none" stroke="rgba(90,110,90,.35)" strokeWidth="1.2" strokeDasharray="2 2.5" vectorEffect="non-scaling-stroke" />
              </svg>
              {stones.map((s, i) => {
                const isDone = !!d.sessions[s.id];
                const isNext = next?.id === s.id;
                const open = isDone || (isNext && !readyOn);
                return (
                  <button key={s.id} ref={isNext ? here : undefined}
                    className={'stone' + (isDone ? ' done' : '') + (isNext ? ' next' : '') + (!open ? ' locked' : '') + (X[i % 4] > 60 ? ' flip' : '')}
                    style={{ top: 10 + i * 92, ['--x' as any]: `${X[i % 4]}%` }}
                    disabled={!open} onClick={() => { fx('F-10'); go({ name: 'session', id: s.id }); }}
                    aria-label={`${s.title}${isDone ? ', done' : isNext ? ', next' : ', not yet'}`}>
                    <span className="stone-disc">{isDone ? '✓' : isNext ? (readyOn ? '⏳' : '✦') : '·'}
                      {isNext && <span className="stone-tulu"><Tulu size={58} mood={readyOn ? 'sleep' : 'happy'} /></span>}</span>
                    <span className="stone-label">
                      <b>{s.title}</b>
                      <small>{isDone ? 'explored · tap to revisit' : isNext ? (readyOn ? `opens ${readyOn}` : `${s.minutes} min · +5 💧`) : `${s.minutes} min`}</small>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
