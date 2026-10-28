import { useStore } from '../lib/store';
import { MEASURES } from '../content/measures';
import { weekly } from '../lib/progress';
import { drops, earned, gardenDays, level, LEVELS, TREASURES } from '../game/rewards';
import type { Data } from '../lib/model';

// Calm charts of recovery. Deliberately no heart-rate data anywhere.

function Line({ points, max, color }: { points: { x: string; y: number }[]; max: number; color: string }) {
  const W = 320, H = 120, pad = 18;
  if (points.length === 0) return <p className="muted">No scores yet.</p>;
  const step = points.length > 1 ? (W - pad * 2) / (points.length - 1) : 0;
  const pt = (i: number, y: number) => [pad + i * step, H - pad - (y / max) * (H - pad * 2)];
  const d = points.map((p, i) => pt(i, p.y)).map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="score trend">
      <line x1={pad} x2={W - pad} y1={H - pad} y2={H - pad} stroke="var(--line)" />
      <path d={d} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => { const [x, y] = pt(i, p.y); return <g key={i}><circle cx={x} cy={y} r={4} fill={color} /><text x={x} y={y - 8} fontSize="10" textAnchor="middle" fill="var(--ink-2)">{p.y}</text></g>; })}
      <text x={pad} y={H - 4} fontSize="9" fill="var(--muted)">{points[0].x}</text>
      {points.length > 1 && <text x={W - pad} y={H - 4} fontSize="9" textAnchor="end" fill="var(--muted)">{points[points.length - 1].x}</text>}
    </svg>
  );
}

function Bars({ rows, keys }: { rows: Record<string, number | string>[]; keys: { k: string; label: string; color: string }[] }) {
  const W = 320, H = 130, pad = 16;
  const max = Math.max(1, ...rows.flatMap((r) => keys.map((k) => Number(r[k.k]))));
  const gw = (W - pad * 2) / rows.length;
  const bw = Math.max(3, (gw - 6) / keys.length);
  return (
    <>
      <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="weekly counts">
        <line x1={pad} x2={W - pad} y1={H - pad} y2={H - pad} stroke="var(--line)" />
        {rows.map((r, i) => keys.map((k, j) => {
          const v = Number(r[k.k]); const h = (v / max) * (H - pad * 2);
          return <rect key={i + k.k} x={pad + i * gw + 3 + j * bw} y={H - pad - h} width={bw - 1} height={h} rx={2} fill={k.color} />;
        }))}
        <text x={pad} y={H - 3} fontSize="9" fill="var(--muted)">{String(rows[0].week).slice(5)}</text>
        <text x={W - pad} y={H - 3} fontSize="9" textAnchor="end" fill="var(--muted)">this week</text>
      </svg>
      <div className="legend">{keys.map((k) => <span key={k.k}><i style={{ background: k.color }} />{k.label}</span>)}</div>
    </>
  );
}

const fmt = (iso: string) => new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });

export function series(d: Data, kind: string) {
  return d.measures.filter((m) => m.kind === kind).map((m) => ({ x: fmt(m.at), y: m.total }));
}

export function Progress() {
  const { data } = useStore();
  const d = data!;
  const rows = weekly(d, 8);
  const checkins = d.checkins.slice(-21).map((c) => ({ x: c.date.slice(5), y: c.anxiety }));
  const surfed = d.urges.filter((u) => u.outcome === 'surfed').length;
  return (
    <div className="app">
      <h1>Treasures</h1>
      <p className="muted">{earned(d).length} of {TREASURES.length} found · {drops(d)} 💧 earned · {gardenDays(d)} island days</p>
      <div className="chest">
        {TREASURES.map((t) => {
          const got = t.got(d);
          return (
            <div key={t.id} className={'treasure' + (got ? ' got' : '')} title={t.how}>
              <i>{got ? t.icon : '?'}</i>
              <b>{got ? t.name : 'Hidden'}</b>
              <span>{t.how}</span>
            </div>
          );
        })}
      </div>

      <h2>Island story</h2>
      <div className="card">
        {LEVELS.map((lv, i) => (
          <div key={i} className={'level-row' + (i <= level(d) ? ' on' : '')}>
            <span className="lv-dot">{i <= level(d) ? '✓' : i + 1}</span>
            <span className="grow"><b>{lv.name}</b><small>{i <= level(d) ? lv.adds : `at ${lv.at} 💧`}</small></span>
          </div>
        ))}
      </div>

      <h2>Your compass</h2>
      <p className="muted">How far you've come. Scores go up and down like weather; the long trend is what matters.</p>
      <div className="grid2">
        <div className="card soft"><h3>{Object.keys(d.sessions).length}</h3><span className="muted">{Object.keys(d.sessions).length === 1 ? "session" : "sessions"} done</span></div>
        <div className="card soft"><h3>{surfed}</h3><span className="muted">urges surfed</span></div>
        <div className="card soft"><h3>{d.surges.length}</h3><span className="muted">waves ridden out</span></div>
        <div className="card soft"><h3>{d.breaths.reduce((a, b) => a + b.minutes, 0)}</h3><span className="muted">minutes of breathing</span></div>
      </div>
      {(['HW7', 'GAD7', 'PHQ9'] as const).map((k) => (
        <div className="card" key={k}>
          <h3>{MEASURES[k].name}</h3>
          <p className="muted">Lower is better. Max {MEASURES[k].max}.</p>
          <Line points={series(d, k)} max={MEASURES[k].max} color={k === 'HW7' ? 'var(--water)' : k === 'GAD7' ? 'var(--leaf)' : 'var(--sun)'} />
        </div>
      ))}
      <div className="card">
        <h3>Checking and reassurance, per week</h3>
        <p className="muted">The goal is for these to shrink.</p>
        <Bars rows={rows as any} keys={[{ k: 'checks', label: 'checks (watch, pulse, ECG, Google)', color: 'var(--water)' }, { k: 'reassurance', label: 'asked for reassurance', color: 'var(--sun)' }]} />
      </div>
      <div className="card">
        <h3>Urges, per week</h3>
        <Bars rows={rows as any} keys={[{ k: 'surfed', label: 'surfed', color: 'var(--leaf)' }, { k: 'checked', label: 'checked anyway', color: 'var(--muted)' }]} />
      </div>
      <div className="card">
        <h3>Waves (SURGE), per week</h3>
        <Bars rows={rows as any} keys={[{ k: 'surges', label: 'waves', color: 'var(--water)' }]} />
      </div>
      <div className="card">
        <h3>Daily anxiety (check-in)</h3>
        <Line points={checkins} max={10} color="var(--leaf-2)" />
      </div>
    </div>
  );
}
