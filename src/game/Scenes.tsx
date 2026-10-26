// Full-screen scenes for the calm flows: the dusk ocean (SURGE), the lotus (Breathe),
// the surf (urge timer) and the worry river.
import { TuluG } from './Mascot';

const wave = (y: number, a: number, bottom = 760) => `M0 ${y} Q100 ${y - a} 200 ${y} T400 ${y} T600 ${y} T800 ${y} V${bottom} H0Z`;

/** SURGE: a dusk sea with a little boat (portrait, for phones). `breath` swells the sea gently. */
export function Ocean({ breath }: { breath?: 'in' | 'out' }) {
  const swell = breath === 'in' ? 1.1 : breath === 'out' ? 0.92 : 1;
  return (
    <svg viewBox="0 0 400 760" preserveAspectRatio="xMidYMax slice" className="scene-svg" aria-hidden>
      <defs>
        <linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1f2c52" /><stop offset=".42" stopColor="#4d4f86" /><stop offset=".6" stopColor="#9a7aa6" /><stop offset=".7" stopColor="#f0a98a" /><stop offset=".74" stopColor="#fbd3b0" />
        </linearGradient>
        <radialGradient id="moonglow"><stop offset="0" stopColor="#fbe9c8" stopOpacity=".35" /><stop offset="1" stopColor="#fbe9c8" stopOpacity="0" /></radialGradient>
      </defs>
      <rect width="400" height="760" fill="url(#dusk)" />
      {[[40, 60], [110, 120], [170, 40], [260, 90], [330, 54], [370, 170], [70, 220], [220, 190], [140, 300], [320, 280], [30, 360], [200, 340]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 ? 1.1 : 1.7} fill="#fff" className="twinkle" style={{ animationDelay: `${i * 0.5}s` }} />
      ))}
      <circle cx="300" cy="170" r="70" fill="url(#moonglow)" />
      <circle cx="300" cy="170" r="24" fill="#fbe9c8" opacity=".95" />
      <g style={{ transform: `scaleY(${swell})`, transformOrigin: '200px 760px', transition: `transform ${breath === 'in' ? 4 : 6}s ease-in-out` }}>
        <path className="wave w1" d={wave(546, 10)} fill="#6a78a8" opacity=".85" />
        <path className="wave w2" d={wave(566, 12)} fill="#56679a" />
        <g className="boat">
          <path d="M176 562 h48 l-8 12 h-32z" fill="#8a5a3c" />
          <path d="M176 562 h48" stroke="#6e4630" strokeWidth="2" />
          <rect x="199" y="532" width="2.4" height="30" fill="#6e4630" />
          <path d="M201.4 534 l20 24 h-20z" fill="#f6eedf" />
          <circle cx="186" cy="556" r="3" fill="#ffd27a" className="lantern" />
        </g>
        <path className="wave w3" d={wave(586, 14)} fill="#43578a" />
        <path className="wave w4" d={wave(620, 12)} fill="#344876" />
        <path className="wave w2" d={wave(672, 10)} fill="#2b3d68" />
      </g>
    </svg>
  );
}

/** Breathe: a lotus that opens on the in-breath and closes on the out-breath. */
export function LotusBloom({ phase, running, secs }: { phase: 'in' | 'out'; running: boolean; secs: number }) {
  const open = running && phase === 'in';
  const outer = [-62, -40, -20, 0, 20, 40, 62];
  const inner = [-26, -9, 9, 26];
  const tr = `transform ${secs}s ease-in-out`;
  return (
    <svg viewBox="0 0 240 220" className="lotus-svg" aria-hidden>
      <defs>
        <linearGradient id="petal" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#f39ab6" /><stop offset="1" stopColor="#fde3ec" /></linearGradient>
        <linearGradient id="petal2" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#f7b3c8" /><stop offset="1" stopColor="#fff3f7" /></linearGradient>
        <radialGradient id="pond"><stop offset="0" stopColor="#bfe6ee" /><stop offset="1" stopColor="#bfe6ee" stopOpacity="0" /></radialGradient>
      </defs>
      <ellipse cx="120" cy="176" rx="110" ry="26" fill="url(#pond)" />
      <g className={'ripples' + (running ? ' on' : '')}>
        <ellipse cx="120" cy="176" rx="40" ry="8" fill="none" stroke="#9fd3df" strokeWidth="1.5" />
        <ellipse cx="120" cy="176" rx="40" ry="8" fill="none" stroke="#9fd3df" strokeWidth="1.5" />
      </g>
      <path d="M60 176 q-30 -4 -40 6 q24 8 52 0z" fill="#6db37a" />
      <path d="M180 176 q30 -4 40 6 q-24 8 -52 0z" fill="#5ea56c" />
      <g style={{ transform: `scale(${open ? 1.12 : running ? 0.86 : 0.95})`, transformOrigin: '120px 170px', transition: tr }}>
        {outer.map((a, i) => (
          <path key={a} d="M120 170 C100 132 106 96 120 74 C134 96 140 132 120 170Z" fill="url(#petal)"
            style={{ transform: `rotate(${open ? a : a * 0.35}deg)`, transformOrigin: '120px 170px', transition: tr, opacity: i === 0 || i === 6 ? 0.85 : 1 }} />
        ))}
        {inner.map((a) => (
          <path key={a} d="M120 170 C106 140 110 112 120 96 C130 112 134 140 120 170Z" fill="url(#petal2)"
            style={{ transform: `rotate(${open ? a : a * 0.3}deg)`, transformOrigin: '120px 170px', transition: tr }} />
        ))}
        <ellipse cx="120" cy="150" rx="9" ry="6" fill="#ffd45e" style={{ opacity: open ? 1 : 0.4, transition: tr }} />
      </g>
      {running && [0, 1, 2, 3, 4].map((i) => <circle key={i} className="mote" cx={70 + i * 25} cy="160" r="2" fill="#fff" style={{ animationDelay: `${i * 1.3}s` }} />)}
    </svg>
  );
}

/** Urge timer: Tulu surfs a wave that gets smaller as the urge passes. h = 0..1 (portrait). */
export function SurfScene({ h, ashore }: { h: number; ashore: boolean }) {
  const base = 560, crest = base - 20 - 160 * h;
  const d = `M0 760 V${base + 4} C70 ${base + 4} 110 ${crest + 56} 170 ${crest} C222 ${crest - 6} 250 ${crest + 62} 300 ${base - 2} C340 ${base - 8} 370 ${base + 4} 400 ${base + 2} V760Z`;
  return (
    <svg viewBox="0 0 400 760" preserveAspectRatio="xMidYMax slice" className="scene-svg" aria-hidden>
      <defs>
        <linearGradient id="sunsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7ec9ea" /><stop offset=".7" stopColor="#d9f1f8" /></linearGradient>
        <linearGradient id="surfsea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4fb3c9" /><stop offset="1" stopColor="#25708c" /></linearGradient>
      </defs>
      <rect width="400" height="760" fill="url(#sunsky)" />
      <circle cx="320" cy="300" r="26" fill="#ffd76a" />
      <circle cx="320" cy="300" r="50" fill="#ffd76a" opacity=".18" />
      <g className="cloud c1" fill="#fff" opacity=".9"><ellipse cx="80" cy="330" rx="26" ry="10" /><circle cx="72" cy="323" r="11" /><circle cx="90" cy="320" r="13" /></g>
      <g className="cloud c2" fill="#fff" opacity=".7"><ellipse cx="240" cy="380" rx="20" ry="8" /><circle cx="234" cy="374" r="9" /><circle cx="248" cy="372" r="10" /></g>
      <path d={`M0 ${base + 10} H400 V760 H0Z`} fill="#3d97b3" />
      <g style={{ opacity: ashore ? 1 : 0, transition: 'opacity 2s' }}>
        <path d={`M240 ${base + 6} Q320 ${base - 14} 400 ${base - 10} V760 H220Z`} fill="#f1dcae" />
        <rect x="350" y={base - 80} width="6" height="76" rx="2" fill="#a37b52" transform={`rotate(8 353 ${base})`} />
        <g fill="#5fae66" transform={`translate(0 ${base - 410})`}><path d="M360 330 q-26 -4 -36 10 q20 -6 36 -10z" /><path d="M360 330 q24 -8 36 4 q-20 -4 -36 -4z" /><path d="M360 330 q-6 -22 -24 -26 q15 10 24 26z" /></g>
      </g>
      <path d={d} fill="url(#surfsea)" style={{ transition: 'd 1.2s ease-in-out' } as any} />
      <path d={d} fill="none" stroke="#e9fbff" strokeWidth="3" opacity=".7" style={{ transition: 'd 1.2s ease-in-out' } as any} />
      <g style={{ transform: `translate(${ashore ? 252 : 116}px, ${(ashore ? base - 100 : crest - 98)}px)`, transition: 'transform 1.2s ease-in-out' }}>
        <g className="surf-bob">
          <ellipse cx="72" cy="104" rx="56" ry="7" fill="#ffb86b" stroke="#e8964a" strokeWidth="2" />
          <g transform="translate(6 2) scale(.9)"><TuluG mood={ashore ? 'excited' : 'happy'} /></g>
        </g>
      </g>
    </svg>
  );
}

/** Worry river: each parked worry is a paper boat. */
export function River({ boats, launching }: { boats: { id: string; leaving?: boolean }[]; launching?: boolean }) {
  return (
    <svg viewBox="0 0 400 170" className="river-svg" role="img" aria-label={`${boats.length} paper boats on the river`}>
      <defs><linearGradient id="riv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#bfe6ef" /><stop offset="1" stopColor="#82c3d6" /></linearGradient></defs>
      <rect width="400" height="170" rx="22" fill="#d6efcf" />
      <path d="M0 60 Q100 40 200 64 T400 56 V140 Q300 160 200 136 T0 144Z" fill="url(#riv)" />
      <g stroke="#e9f8fb" strokeWidth="2" fill="none" strokeLinecap="round">
        <path className="ripple r1" d="M30 100 q12 -3 24 0 t24 0" /><path className="ripple r2" d="M260 120 q12 -3 24 0 t24 0" />
      </g>
      {[[20, 40], [360, 36], [380, 150], [10, 156]].map(([x, y]) => <g key={x}><ellipse cx={x} cy={y} rx="16" ry="9" fill="#9ccf8e" /><ellipse cx={x + 4} cy={y - 3} rx="8" ry="5" fill="#b2dda4" /></g>)}
      {boats.slice(-8).map((b, i) => (
        <g key={b.id} className={'paper-boat' + (b.leaving ? ' leaving' : '') + (launching && i === Math.min(boats.length, 8) - 1 ? ' launch' : '')}
          style={{ ['--bx' as any]: `${40 + (i % 4) * 82}px`, ['--by' as any]: `${74 + Math.floor(i / 4) * 34}px`, animationDelay: `${i * 0.35}s` }}>
          <g className="boat-bob">
            <path d="M0 14 h34 l-6 8 h-22z" fill="#fffdf6" stroke="#d9cdb4" strokeWidth="1" />
            <path d="M8 14 l9 -14 9 14z" fill="#fff7e6" stroke="#d9cdb4" strokeWidth="1" />
          </g>
        </g>
      ))}
    </svg>
  );
}
