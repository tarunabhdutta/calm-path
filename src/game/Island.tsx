// The living island on the home screen. Grows with every level and never wilts.
import { TuluG } from './Mascot';
import type { Mood } from './Mascot';

type Time = 'dawn' | 'day' | 'dusk' | 'night';
export function timeOfDay(h: number = (window as any).__calmHour ?? new Date().getHours()): Time {
  if (h >= 5 && h < 8) return 'dawn';
  if (h >= 8 && h < 17) return 'day';
  if (h >= 17 && h < 19) return 'dusk';
  return 'night';
}

const SKY: Record<Time, [string, string]> = {
  dawn: ['#ffcfae', '#fff2e2'],
  day: ['#a9daf0', '#e9f7fc'],
  dusk: ['#f39e86', '#fcdcc0'],
  night: ['#16223f', '#33466f'],
};

function Cloud({ x, y, s = 1, cls }: { x: number; y: number; s?: number; cls: string }) {
  return (
    <g className={cls} transform={`translate(${x} ${y}) scale(${s})`} fill="#fff" opacity=".85">
      <ellipse cx="0" cy="8" rx="22" ry="9" /><circle cx="-8" cy="2" r="9" /><circle cx="6" cy="-1" r="11" /><circle cx="17" cy="5" r="7" />
    </g>
  );
}

function Bamboo({ x, h, delay }: { x: number; h: number; delay: number }) {
  return (
    <g className="sway" style={{ animationDelay: `${delay}s`, transformOrigin: `${x}px 160px` }}>
      <rect x={x - 2.5} y={160 - h} width="5" height={h} rx="2.5" fill="#7fb36a" />
      {[0.25, 0.5, 0.75].map((f) => <rect key={f} x={x - 3.2} y={160 - h * f} width="6.4" height="1.8" rx=".9" fill="#5f9150" />)}
      <path d={`M${x} ${160 - h * 0.8} q10 -6 16 -2 q-9 1 -16 2`} fill="#8fcf74" />
      <path d={`M${x} ${160 - h * 0.6} q-11 -6 -16 -1 q9 1 16 1`} fill="#8fcf74" />
      <path d={`M${x} ${160 - h} q7 -8 13 -6 q-7 3 -13 6`} fill="#9bd97f" />
    </g>
  );
}

function TeaBush({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <ellipse cx={x} cy={y} rx="13" ry="7" fill="#4f9b5a" />
      <ellipse cx={x - 4} cy={y - 3} rx="6" ry="3.5" fill="#67b66e" />
      <ellipse cx={x + 5} cy={y - 2} rx="5" ry="3" fill="#5fae66" />
    </g>
  );
}

function Flower({ x, y, c }: { x: number; y: number; c: string }) {
  return (
    <g>
      <path d={`M${x} ${y} v8`} stroke="#5d9e57" strokeWidth="1.4" />
      {[0, 72, 144, 216, 288].map((a) => <circle key={a} cx={x + 3 * Math.cos((a * Math.PI) / 180)} cy={y + 3 * Math.sin((a * Math.PI) / 180)} r="2.4" fill={c} />)}
      <circle cx={x} cy={y} r="1.6" fill="#ffd45e" />
    </g>
  );
}

function Lotus({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="3" rx="9" ry="2.6" fill="#5ea56a" />
      {[-34, -12, 12, 34].map((a) => <path key={a} d="M0 2 C-3 -4 -2 -9 0 -11 C2 -9 3 -4 0 2Z" fill="#f6a9c0" transform={`rotate(${a})`} />)}
      <path d="M0 2 C-3 -5 -2 -10 0 -12 C2 -10 3 -5 0 2Z" fill="#fbd0dd" />
    </g>
  );
}

function Butterfly({ cls, c }: { cls: string; c: string }) {
  return (
    <g className={cls}>
      <g className="flap">
        <ellipse cx="-3.5" cy="0" rx="3.5" ry="4.5" fill={c} />
        <ellipse cx="3.5" cy="0" rx="3.5" ry="4.5" fill={c} />
      </g>
      <rect x="-.6" y="-3.5" width="1.2" height="7" rx=".6" fill="#3d3a3a" />
    </g>
  );
}

function Hornbill() {
  return (
    <g transform="translate(300 74)">
      <ellipse cx="0" cy="0" rx="9" ry="6" fill="#2e2b2b" />
      <path d="M6 -4 q4 -2 6 1 l-1 2z" fill="#2e2b2b" />
      <circle cx="9" cy="-3.5" r="3.6" fill="#2e2b2b" />
      <path d="M11 -6 q9 -2 12 3 q-6 0 -12 1z" fill="#f4c542" />
      <path d="M11 -3 q8 1 11 3 q-6 1 -11 -1z" fill="#efb22e" />
      <path d="M-9 1 q-9 5 -14 3 q6 -6 14 -6z" fill="#f5f2ea" />
      <circle cx="9.6" cy="-4" r=".9" fill="#fff" />
    </g>
  );
}

function StiltHouse() {
  return (
    <g transform="translate(58 112)">
      {[0, 14, 28, 42].map((x) => <rect key={x} x={x} y="22" width="3" height="28" fill="#a07a4f" />)}
      <rect x="-4" y="18" width="52" height="6" rx="1.5" fill="#b8905f" />
      <rect x="2" y="2" width="40" height="17" fill="#d9b882" />
      <rect x="17" y="7" width="9" height="12" rx="1" fill="#8a6640" />
      <rect x="5" y="6" width="7" height="6" rx="1" fill="#fbe7a6" className="window-glow" />
      <path d="M-8 4 L22 -14 L52 4 Z" fill="#c69b52" />
      <path d="M-8 4 L22 -14 L52 4" stroke="#a87f3c" strokeWidth="2" fill="none" />
    </g>
  );
}

export function Island({ level, mood = 'happy', hop = false, onTulu }: { level: number; mood?: Mood; hop?: boolean; onTulu?: () => void }) {
  const t = timeOfDay();
  const night = t === 'night';
  const [s1, s2] = SKY[t];
  return (
    <svg viewBox="0 0 360 240" className="island-svg" role="img" aria-label={`Tulu's island, level ${level + 1}`}>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={s1} /><stop offset="1" stopColor={s2} /></linearGradient>
        <linearGradient id="water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={night ? '#2c4f6e' : '#8fd0e0'} /><stop offset="1" stopColor={night ? '#1d3550' : '#5aa8c2'} /></linearGradient>
        <radialGradient id="sunglow"><stop offset="0" stopColor="#fff3b0" stopOpacity=".9" /><stop offset="1" stopColor="#fff3b0" stopOpacity="0" /></radialGradient>
      </defs>
      <rect width="360" height="240" fill="url(#sky)" />
      {night ? (
        <g>
          {[[40, 30], [90, 18], [140, 40], [210, 22], [250, 46], [330, 30], [180, 12], [300, 60]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={i % 3 ? 1.2 : 1.8} fill="#fff" className="twinkle" style={{ animationDelay: `${i * 0.4}s` }} />
          ))}
          <circle cx="300" cy="44" r="15" fill="#f6f1d8" /><circle cx="306" cy="40" r="13" fill={s1} />
        </g>
      ) : (
        <g>
          <circle cx={t === 'dawn' ? 60 : t === 'dusk' ? 310 : 300} cy={t === 'day' ? 42 : 92} r="40" fill="url(#sunglow)" />
          <circle cx={t === 'dawn' ? 60 : t === 'dusk' ? 310 : 300} cy={t === 'day' ? 42 : 92} r="17" fill={t === 'day' ? '#ffd76a' : '#ffb26b'} />
        </g>
      )}
      <Cloud x={70} y={46} s={1} cls="cloud c1" />
      <Cloud x={220} y={30} s={0.8} cls="cloud c2" />
      {level >= 9 && !night && (
        <g opacity=".45" fill="none" strokeWidth="5">
          {['#f28b82', '#fbbc6e', '#fff17a', '#9ee493', '#8ccff2', '#b39ddb'].map((c, i) => <path key={c} d={`M${60 + i * 5} 150 A${120 - i * 5} ${100 - i * 5} 0 0 1 ${300 - i * 5} 150`} stroke={c} />)}
        </g>
      )}
      {/* far hills */}
      <path d="M0 140 Q50 100 100 128 T200 120 T300 112 T360 126 V160 H0Z" fill={night ? '#2d4a4a' : '#b9dcc2'} />
      <path d="M0 150 Q70 122 140 142 T280 134 T360 146 V170 H0Z" fill={night ? '#355a52' : '#a2d0ae'} />
      {/* river */}
      <rect y="150" width="360" height="90" fill="url(#water)" />
      <g stroke={night ? '#5f86a6' : '#d9f2f8'} strokeWidth="2" fill="none" strokeLinecap="round" opacity=".8">
        <path className="ripple r1" d="M10 214 q15 -4 30 0 t30 0" />
        <path className="ripple r2" d="M250 222 q15 -4 30 0 t30 0" />
        <path className="ripple r3" d="M150 230 q12 -3 24 0 t24 0" />
      </g>
      {/* island */}
      <ellipse cx="180" cy="176" rx="156" ry="38" fill={night ? '#a89a7a' : '#ead8ae'} />
      <ellipse cx="180" cy="166" rx="146" ry="30" fill={night ? '#4c7a52' : '#92cc86'} />
      <ellipse cx="160" cy="158" rx="90" ry="12" fill={night ? '#5a8a5e' : '#a6da97'} opacity=".7" />

      {level >= 7 && (
        <g>
          <rect x="296" y="96" width="8" height="64" rx="3" fill="#8d6a46" />
          <path d="M300 112 q-14 -6 -22 -16" stroke="#8d6a46" strokeWidth="4" fill="none" strokeLinecap="round" />
          <circle cx="300" cy="96" r="30" fill="#5fa65e" /><circle cx="282" cy="88" r="18" fill="#6fb86b" /><circle cx="318" cy="90" r="18" fill="#56995a" />
          <Hornbill />
        </g>
      )}
      {level >= 3 && <g>{[[40, 70, 0], [52, 88, .6], [64, 62, 1.2], [76, 80, .3]].map(([x, h, dl]) => <Bamboo key={x} x={x} h={h} delay={dl} />)}</g>}
      {level >= 8 && <StiltHouse />}
      {level >= 4 && <g>{[[232, 158], [258, 156], [284, 158], [244, 168], [270, 168], [296, 168]].map(([x, y]) => <TeaBush key={`${x}${y}`} x={x} y={y} />)}</g>}
      {level >= 1 && (
        <g stroke="#4f9447" strokeWidth="1.6" strokeLinecap="round" fill="none">
          {[[120, 172], [205, 176], [228, 180], [96, 166], [190, 160]].map(([x, y]) => <path key={`${x}`} d={`M${x} ${y} q-3 -6 -5 -7 M${x} ${y} q2 -6 5 -8`} />)}
        </g>
      )}
      {level >= 2 && <g>{[[106, 176, '#f7a8c4'], [214, 170, '#fff2a8'], [130, 160, '#c8b6f2'], [240, 182, '#f7a8c4'], [88, 172, '#ffd59e']].map(([x, y, c]) => <Flower key={`${x}`} x={x as number} y={y as number} c={c as string} />)}</g>}
      {level >= 5 && (
        <g>
          <ellipse cx="110" cy="198" rx="40" ry="9" fill={night ? '#3d6585' : '#7ec3d6'} stroke={night ? '#6c8f6c' : '#78b46e'} strokeWidth="2" />
          <Lotus x={98} y={196} /><Lotus x={122} y={199} s={0.8} /><ellipse cx="112" cy="194" rx="5" ry="1.8" fill="#5ea56a" />
        </g>
      )}
      {level >= 10 && <g transform="translate(196 92) scale(.95)" opacity=".98"><TuluG mood="calm" /></g>}
      <g transform={level >= 10 ? 'translate(150 116) scale(.62)' : 'translate(140 104) scale(.72)'} onClick={onTulu} style={{ cursor: onTulu ? 'pointer' : undefined }}>
        <TuluG mood={night ? 'sleep' : mood} hop={hop} />
      </g>
      {level >= 6 && !night && (
        <g>
          <g className="fly f1"><Butterfly cls="" c="#f7a8c4" /></g>
          <g className="fly f2"><Butterfly cls="" c="#ffd166" /></g>
        </g>
      )}
      {((night && level >= 2) || (level >= 9 && t === 'dusk')) && (
        <g fill="#fff6a0">
          {[[80, 120], [130, 100], [230, 110], [270, 128], [190, 96], [60, 140]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="2" className="firefly" style={{ animationDelay: `${i * 0.7}s` }} />
          ))}
        </g>
      )}
    </svg>
  );
}
