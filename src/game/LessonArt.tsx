// Animated illustrations for lesson cards: every idea in the programme gets a little moving picture.
// Pure SVG + CSS (offline, light). Each scene is 320x170 and loops gently.
import { TuluG } from './Mascot';

export type ArtId =
  | 'welcome' | 'alarm' | 'magnifier' | 'cycle' | 'twoFears' | 'float' | 'hook' | 'counter'
  | 'urgeWave' | 'compass' | 'backpack' | 'watch' | 'jars' | 'team' | 'search' | 'worryBox'
  | 'sleep' | 'learning' | 'ladder' | 'story' | 'drum' | 'detective' | 'forecast' | 'leaves'
  | 'bus' | 'garden' | 'walk' | 'mountain' | 'map' | 'graduate' | 'calendar' | 'anchor'
  | 'kindness' | 'scale' | 'curious' | 'expand' | 'theory' | 'switch' | 'family' | 'doctor' | 'lab' | 'sound' | 'sky' | 'pie';

const Sky = ({ a = '#dff1f7', b = '#f7fbf4' }: { a?: string; b?: string }) => (
  <>
    <defs><linearGradient id={`la-${a.slice(1)}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} /></linearGradient></defs>
    <rect width="320" height="170" rx="18" fill={`url(#la-${a.slice(1)})`} />
  </>
);
const T = ({ x, y, s = 0.5, mood = 'happy' as const }: { x: number; y: number; s?: number; mood?: 'happy' | 'calm' | 'sleep' | 'excited' | 'curious' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}><TuluG mood={mood} /></g>
);
const Heart = ({ x, y, s = 1, cls = 'la-beat' }: { x: number; y: number; s?: number; cls?: string }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}><path className={cls} d="M0 6 C-8 -4 -20 2 -14 12 L0 26 L14 12 C20 2 8 -4 0 6Z" fill="#ef8fb0" /></g>
);
const Ground = ({ c = '#bfe3b4' }: { c?: string }) => <path d="M0 140 Q80 128 160 136 T320 132 V170 H0Z" fill={c} />;

function Scene({ id }: { id: ArtId }) {
  switch (id) {
    case 'welcome': return (<><Sky a="#ffe3c4" b="#fff6e8" /><circle cx="250" cy="52" r="22" fill="#ffd27a" className="la-pulse" /><Ground /><T x={110} y={58} s={0.7} mood="excited" />
      <g className="la-float" fill="#ef8fb0">{[60, 90, 230, 270].map((x, i) => <circle key={x} cx={x} cy={60 + (i % 2) * 20} r="4" style={{ animationDelay: `${i * 0.5}s` }} />)}</g></>);
    case 'alarm': return (<><Sky a="#fff1d9" b="#fffaf0" />
      <g transform="translate(150 22)"><circle r="26" cx="0" cy="26" fill="#fff" stroke="#e8b04a" strokeWidth="4" /><circle cx="0" cy="26" r="6" fill="#f2a541" className="la-blink" />
        {[0, 1, 2].map((i) => <path key={i} className="la-ring" style={{ animationDelay: `${i * 0.35}s` }} d="M34 10 q12 16 0 32 M-34 10 q-12 16 0 32" stroke="#f2a541" strokeWidth="3" fill="none" strokeLinecap="round" />)}</g>
      <g transform="translate(60 112)"><rect width="46" height="30" rx="6" fill="#d9a066" /><path className="la-steam" d="M14 -4 q6 -8 0 -16 M30 -4 q6 -8 0 -16" stroke="#c9b6a0" strokeWidth="3" fill="none" strokeLinecap="round" /></g>
      <text x="40" y="104" fontSize="11" fontWeight="800" fill="#8a6b3a">toast!</text><T x={200} y={86} s={0.55} mood="curious" /></>);
    case 'magnifier': return (<><Sky /><Heart x={160} y={70} s={1.3} />
      <g className="la-scan"><circle cx="160" cy="80" r="40" fill="rgba(255,255,255,.35)" stroke="#5f7f8c" strokeWidth="6" /><rect x="186" y="108" width="12" height="44" rx="6" fill="#5f7f8c" transform="rotate(-40 192 130)" /></g>
      <T x={30} y={92} s={0.45} mood="curious" /></>);
    case 'cycle': return (<><Sky a="#e8f3ea" b="#f7fbf4" /><g transform="translate(160 86)">
      <circle r="58" fill="none" stroke="#cfe3d2" strokeWidth="14" />
      <g className="la-spin"><path d="M0 -58 A58 58 0 0 1 50 29" fill="none" stroke="#6fb489" strokeWidth="6" strokeLinecap="round" /><path d="M50 29 l-2 -14 -10 10z" fill="#6fb489" /></g>
      {['sensation', 'thought', 'fear', 'body', 'check'].map((t, i) => { const a = (i / 5) * Math.PI * 2 - Math.PI / 2; return (
        <g key={t} transform={`translate(${Math.cos(a) * 58} ${Math.sin(a) * 58})`}><circle r="17" fill="#fff" stroke="#3e8a62" strokeWidth="2" className="la-node" style={{ animationDelay: `${i * 0.6}s` }} /><text textAnchor="middle" y="3" fontSize="7.5" fontWeight="800" fill="#24352d">{t}</text></g>); })}
      </g></>);
    case 'twoFears': return (<><Sky a="#dceef7" b="#f4fafc" /><path className="la-wave1" d="M0 120 Q40 100 80 120 T160 120 T240 120 T320 120 V170 H0Z" fill="#8ccbe0" />
      <path className="la-wave2" d="M0 132 Q60 70 120 132 T240 132 T360 132 V170 H0Z" fill="#4b97b6" opacity=".85" />
      <text x="40" y="96" fontSize="11" fontWeight="800" fill="#3b88a6">1st fear: a flash</text><text x="170" y="62" fontSize="11" fontWeight="800" fill="#24527a">2nd fear: "oh no…"</text></>);
    case 'float': return (<><Sky a="#d6eef6" b="#eef9fb" /><rect y="96" width="320" height="74" fill="#8fd0e0" /><path className="la-wave1" d="M0 100 Q40 92 80 100 T160 100 T240 100 T320 100" stroke="#e9fbff" strokeWidth="3" fill="none" />
      <g className="la-bob"><ellipse cx="160" cy="104" rx="70" ry="9" fill="#ffd9b0" /><T x={118} y={50} s={0.6} mood="calm" /></g></>);
    case 'hook': return (<><Sky a="#e3f0f7" b="#f6fbfd" /><path d="M160 0 V70" stroke="#7a8a92" strokeWidth="2" />
      <g className="la-dangle"><path d="M160 70 q0 18 -12 18 q-10 0 -10 -10" stroke="#7a8a92" strokeWidth="3" fill="none" /><circle cx="160" cy="66" r="9" fill="#ffd27a" /><text x="174" y="70" fontSize="10" fontWeight="800" fill="#6b5a2a">relief</text></g>
      <rect y="120" width="320" height="50" fill="#9fd3e2" /><g className="la-swim"><T x={40} y={92} s={0.45} mood="curious" /></g></>);
    case 'counter': return (<><Sky a="#f3e6c8" b="#fbf6ea" />{[0, 1, 2, 3].map((i) => (
      <g key={i} className="la-drop" style={{ animationDelay: `${i * 0.6}s` }}><ellipse cx={90 + i * 46} cy="118" rx="18" ry="13" fill="#d9c49b" /><ellipse cx={86 + i * 46} cy="113" rx="7" ry="4" fill="#efe2c4" /></g>))}
      <T x={20} y={70} s={0.5} /></>);
    case 'urgeWave': return (<><Sky a="#bfe6f3" b="#eaf7fb" /><path className="la-urge" d="M0 170 V140 C60 140 90 60 150 60 C210 60 240 140 320 140 V170Z" fill="#4fb3c9" />
      <g className="la-surf"><ellipse cx="150" cy="58" rx="34" ry="5" fill="#ffb86b" /><T x={122} y={8} s={0.42} mood="excited" /></g></>);
    case 'compass': return (<><Sky a="#efe4d6" b="#faf6f0" /><g transform="translate(160 85)"><circle r="54" fill="#fff" stroke="#c9a46a" strokeWidth="6" /><text y="-36" textAnchor="middle" fontSize="12" fontWeight="900" fill="#a07a4f">N</text>
      <g className="la-needle"><path d="M0 -40 L8 0 L0 40 L-8 0Z" fill="#ef8fb0" /><path d="M0 0 L8 0 L0 40 L-8 0Z" fill="#7f8f9c" /></g><circle r="5" fill="#a07a4f" /></g></>);
    case 'backpack': return (<><Sky /><Ground /><g className="la-bob" transform="translate(120 52)"><rect width="70" height="80" rx="16" fill="#e8964a" /><rect x="12" y="34" width="46" height="30" rx="8" fill="#f2b06b" />
      {['⌚', '🔎', '💬'].map((e, i) => <text key={e} x={6 + i * 22} y="-4" fontSize="16" className="la-pop" style={{ animationDelay: `${i * 0.5}s` }}>{e}</text>)}</g><T x={210} y={84} s={0.5} mood="curious" /></>);
    case 'watch': return (<><Sky a="#e8f3ea" b="#f7fbf4" /><g transform="translate(160 85)"><rect x="-16" y="-70" width="32" height="140" rx="10" fill="#7f8f9c" /><rect x="-44" y="-44" width="88" height="88" rx="22" fill="#24352d" />
      <g className="la-swap1"><Heart x={0} y={-14} s={1} cls="" /></g><g className="la-swap2"><text y="10" textAnchor="middle" fontSize="34">🪷</text></g></g></>);
    case 'jars': return (<><Sky a="#fff1d9" b="#fffaf0" />{[4, 3, 2, 1].map((n, i) => (
      <g key={n} transform={`translate(${50 + i * 62} 60)`}><rect width="40" height="70" rx="8" fill="#fff" stroke="#d7c49e" strokeWidth="3" />
        <rect className="la-fill" style={{ animationDelay: `${i * 0.4}s`, transformOrigin: 'center bottom' }} x="4" y={66 - n * 14} width="32" height={n * 14} rx="4" fill="#9ed3b1" /><text x="20" y="88" textAnchor="middle" fontSize="10" fontWeight="800" fill="#6b7a71">L{i + 1}</text></g>))}</>);
    case 'team': return (<><Sky a="#fde8ef" b="#fff6f9" /><Ground c="#cfe8c4" /><T x={70} y={74} s={0.55} /><T x={170} y={70} s={0.6} mood="calm" />
      <Heart x={160} y={40} s={0.9} cls="la-float" /></>);
    case 'search': return (<><Sky /><rect x="70" y="30" width="180" height="110" rx="12" fill="#fff" stroke="#c7d6dd" strokeWidth="3" />
      {[0, 1, 2, 3].map((i) => <rect key={i} className="la-scroll" x="84" y={50 + i * 20} width={140 - i * 20} height="8" rx="4" fill="#dbe7ec" style={{ animationDelay: `${i * 0.2}s` }} />)}
      <g className="la-boat-in"><path d="M240 140 h40 l-7 9 h-26z" fill="#fffdf6" stroke="#d9cdb4" /><path d="M250 140 l10 -16 10 16z" fill="#fff7e6" stroke="#d9cdb4" /></g></>);
    case 'worryBox': return (<><Sky a="#d6efcf" b="#f1faee" /><path d="M0 110 Q160 90 320 112 V150 Q160 170 0 148Z" fill="#9fd3e2" />
      {[0, 1, 2].map((i) => <g key={i} className="la-boatline" style={{ animationDelay: `${i * 1.6}s` }}><path d="M0 120 h30 l-5 7 h-20z" fill="#fffdf6" stroke="#d9cdb4" /><path d="M8 120 l8 -12 8 12z" fill="#fff7e6" stroke="#d9cdb4" /></g>)}
      <text x="226" y="52" fontSize="22">🕖</text></>);
    case 'sleep': return (<><rect width="320" height="170" rx="18" fill="#26355a" />{[30, 80, 140, 200, 260, 300].map((x, i) => <circle key={x} cx={x} cy={20 + (i % 3) * 18} r="1.6" fill="#fff" className="la-twinkle" style={{ animationDelay: `${i * 0.4}s` }} />)}
      <circle cx="260" cy="44" r="18" fill="#f6f1d8" /><circle cx="268" cy="38" r="15" fill="#26355a" /><T x={110} y={74} s={0.6} mood="sleep" /></>);
    case 'learning': return (<><Sky a="#efeafb" b="#f8f6fd" /><text x="58" y="34" fontSize="11" fontWeight="800" fill="#6b5aa0">I feared…</text><text x="196" y="34" fontSize="11" fontWeight="800" fill="#3e8a62">What happened</text>
      <rect x="60" y="44" width="60" height="100" rx="8" fill="#e6e1f6" /><rect className="la-grow-dn" x="60" y="44" width="60" height="100" rx="8" fill="#b9addf" style={{ transformOrigin: '90px 144px' }} />
      <rect x="200" y="44" width="60" height="100" rx="8" fill="#e2f2e6" /><rect className="la-grow-up" x="200" y="124" width="60" height="20" rx="8" fill="#6fb489" />
      <text x="160" y="100" textAnchor="middle" fontSize="22" className="la-pulse">✨</text></>);
    case 'ladder': return (<><Sky /><g transform="translate(150 10)">{[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x="0" y={20 + i * 22} width="70" height="5" rx="2" fill="#b98f5f" />)}
      <rect x="-4" y="10" width="6" height="140" rx="3" fill="#a07a4f" /><rect x="68" y="10" width="6" height="140" rx="3" fill="#a07a4f" /></g>
      <g className="la-climb"><T x={150} y={100} s={0.38} mood="excited" /></g><text x="236" y="28" fontSize="18">🏁</text></>);
    case 'story': return (<><Sky a="#f6efe0" b="#fbf8f1" /><g className="la-unroll"><rect x="80" y="30" width="160" height="110" rx="10" fill="#fffaf0" stroke="#d9c49b" strokeWidth="3" />
      {[0, 1, 2, 3, 4].map((i) => <rect key={i} x="96" y={46 + i * 16} width={128 - (i % 2) * 30} height="6" rx="3" fill="#e5d6b4" />)}</g><text x="250" y="60" fontSize="20" className="la-yawn">🥱</text></>);
    case 'drum': return (<><Sky a="#fde7d7" b="#fff6ef" /><g transform="translate(160 96)"><ellipse rx="54" ry="16" fill="#e8964a" /><rect x="-54" y="0" width="108" height="40" fill="#d47f38" /><ellipse cy="40" rx="54" ry="16" fill="#c06f2c" /><ellipse rx="54" ry="16" fill="#f7d9b5" className="la-thump" /></g>
      {[0, 1, 2].map((i) => <circle key={i} cx="160" cy="96" r="20" fill="none" stroke="#ef8fb0" strokeWidth="2" className="la-ripple" style={{ animationDelay: `${i * 0.5}s` }} />)}<T x={30} y={88} s={0.45} mood="excited" /></>);
    case 'detective': return (<><Sky a="#eef3e8" b="#f9fbf6" /><g transform="translate(200 30)"><ellipse cx="0" cy="40" rx="60" ry="34" fill="#fff" stroke="#c7d6dd" strokeWidth="3" /><text textAnchor="middle" y="44" fontSize="11" fontWeight="800" fill="#4f6258">"My heart…?"</text></g>
      <g className="la-scan"><circle cx="200" cy="70" r="24" fill="rgba(255,255,255,.4)" stroke="#5f7f8c" strokeWidth="5" /><rect x="216" y="86" width="9" height="30" rx="4" fill="#5f7f8c" transform="rotate(-40 220 100)" /></g><T x={20} y={84} s={0.5} mood="curious" /></>);
    case 'forecast': return (<><Sky a="#e5eef8" b="#f6f9fd" /><rect x="40" y="30" width="240" height="100" rx="12" fill="#fff" stroke="#c7d6dd" strokeWidth="3" />
      {['⛈️', '⛈️', '⛈️', '⛈️'].map((e, i) => <g key={i}><text x={60 + i * 56} y="72" fontSize="22">{e}</text><text x={64 + i * 56} y="112" fontSize="22" className="la-pop" style={{ animationDelay: `${0.6 + i * 0.5}s` }}>☀️</text></g>)}</>);
    case 'leaves': return (<><Sky a="#dff1e6" b="#f4fbf6" /><path d="M0 80 Q160 60 320 84 V140 Q160 160 0 136Z" fill="#a8d8e4" />
      {['what if…', 'my heart!', 'check it'].map((t, i) => <g key={t} className="la-leaf" style={{ animationDelay: `${i * 2}s` }}><path d="M0 110 q20 -16 44 0 q-24 14 -44 0z" fill="#7fbf74" /><text x="6" y="113" fontSize="8" fontWeight="800" fill="#24352d">{t}</text></g>)}</>);
    case 'bus': return (<><Sky /><Ground c="#d8e7c8" /><g className="la-drive"><rect x="60" y="60" width="180" height="70" rx="16" fill="#f2c14e" />{[0, 1, 2, 3].map((i) => <rect key={i} x={74 + i * 40} y="72" width="30" height="24" rx="5" fill="#dff1f7" />)}
      <text x="82" y="90" fontSize="14">😟</text><text x="122" y="90" fontSize="14">😱</text><circle cx="94" cy="132" r="12" fill="#3d3a3a" /><circle cx="206" cy="132" r="12" fill="#3d3a3a" /><g transform="translate(184 66) scale(.22)"><TuluG mood="happy" /></g></g></>);
    case 'garden': return (<><Sky a="#fff1d9" b="#fffaf0" /><Ground />{[60, 110, 160, 210, 260].map((x, i) => <g key={x} className="la-sprout" style={{ animationDelay: `${i * 0.4}s`, transformOrigin: `${x}px 138px` }}><path d={`M${x} 138 v-26`} stroke="#5d9e57" strokeWidth="3" /><circle cx={x} cy="108" r="9" fill={['#f7a8c4', '#ffd166', '#c8b6f2', '#ffb27a', '#9ee493'][i]} /></g>)}</>);
    case 'walk': return (<><Sky a="#dff1f7" b="#f7fbf4" /><Ground /><g className="la-walk"><T x={20} y={80} s={0.48} mood="happy" /></g><circle cx="270" cy="40" r="18" fill="#ffd27a" /></>);
    case 'mountain': return (<><Sky a="#fde7b8" b="#fff7e2" /><path d="M20 150 L130 40 L240 150Z" fill="#a9c9a0" /><path d="M140 150 L230 70 L320 150Z" fill="#8cb784" /><path d="M118 52 L130 40 L142 52 L136 50 L130 56 L124 50Z" fill="#fff" />
      <g className="la-climb2"><T x={60} y={100} s={0.3} mood="excited" /></g><text x="124" y="34" fontSize="16">🚩</text></>);
    case 'map': return (<><Sky a="#efe4d6" b="#faf6f0" /><rect x="50" y="26" width="220" height="118" rx="10" fill="#fbf3e2" stroke="#d9c49b" strokeWidth="3" />
      <path className="la-dash" d="M70 130 Q110 60 160 100 T250 46" stroke="#e8964a" strokeWidth="4" fill="none" strokeDasharray="8 8" strokeLinecap="round" /><text x="242" y="48" fontSize="16">⭐</text></>);
    case 'graduate': return (<><Sky a="#c8ecea" b="#ecf9f8" /><ellipse cx="160" cy="140" rx="130" ry="20" fill="#9fd394" /><T x={112} y={62} s={0.6} mood="excited" />
      <g fill="#ffd166">{[50, 90, 230, 270].map((x, i) => <path key={x} className="la-twinkle" style={{ animationDelay: `${i * 0.3}s` }} d={`M${x} ${40 + (i % 2) * 20} l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z`} />)}</g></>);
    case 'calendar': return (<><Sky a="#efe4d6" b="#faf6f0" /><rect x="90" y="30" width="140" height="112" rx="12" fill="#fff" stroke="#d9c49b" strokeWidth="3" /><rect x="90" y="30" width="140" height="26" rx="12" fill="#e8964a" />
      {Array.from({ length: 12 }).map((_, i) => <circle key={i} cx={110 + (i % 4) * 33} cy={74 + Math.floor(i / 4) * 24} r="8" fill={i < 7 ? '#9ed3b1' : '#eee6d6'} className={i < 7 ? 'la-pop' : ''} style={{ animationDelay: `${i * 0.15}s` }} />)}</>);
    case 'anchor': return (<><Sky a="#d6eef6" b="#eef9fb" /><rect y="80" width="320" height="90" fill="#8fd0e0" /><path className="la-wave1" d="M0 84 Q40 72 80 84 T160 84 T240 84 T320 84" stroke="#e9fbff" strokeWidth="3" fill="none" />
      <g className="la-boat-steady"><path d="M120 82 h80 l-12 16 h-56z" fill="#8a5a3c" /></g><path d="M160 98 V140" stroke="#7a8a92" strokeWidth="2" /><text x="148" y="158" fontSize="20">⚓</text></>);
    case 'kindness': return (<><Sky a="#fde8ef" b="#fff6f9" /><T x={110} y={58} s={0.65} mood="calm" />{[0, 1, 2].map((i) => <Heart key={i} x={90 + i * 70} y={34} s={0.6} cls="la-float" />)}</>);
    case 'scale': return (<><Sky /><g transform="translate(160 40)"><rect x="-3" y="0" width="6" height="96" fill="#a07a4f" /><g className="la-tilt"><rect x="-90" y="0" width="180" height="5" rx="2" fill="#a07a4f" />
      <path d="M-80 5 l-18 34 h36z" fill="#efe2c4" /><path d="M80 5 l-18 34 h36z" fill="#efe2c4" /><text x="-92" y="36" fontSize="9" fontWeight="800">for</text><text x="70" y="36" fontSize="9" fontWeight="800">against</text></g></g></>);
    case 'curious': return (<><Sky a="#efeafb" b="#f8f6fd" /><T x={110} y={60} s={0.6} mood="curious" /><text x="210" y="60" fontSize="26" className="la-pop">❓</text><text x="70" y="70" fontSize="20" className="la-pop" style={{ animationDelay: '.6s' }}>🔍</text></>);
    case 'expand': return (<><Sky a="#e8f3ea" b="#f7fbf4" />{[0, 1, 2].map((i) => <circle key={i} cx="160" cy="88" r="20" fill="none" stroke="#6fb489" strokeWidth="3" className="la-ripple" style={{ animationDelay: `${i * 0.8}s` }} />)}<Heart x={160} y={74} s={1} /></>);
    case 'theory': return (<><Sky a="#efe4d6" b="#faf6f0" /><g transform="translate(160 30)"><rect x="-3" y="0" width="6" height="110" fill="#a07a4f" />
      <g className="la-tilt"><rect x="-110" y="0" width="220" height="6" rx="3" fill="#b98f5f" />
        <g transform="translate(-80 6)"><path d="M-34 30 q34 18 68 0z" fill="#f3c1cf" /><text y="22" textAnchor="middle" fontSize="18" fontWeight="900" fill="#b0506e">A</text></g>
        <g transform="translate(80 6)"><path d="M-34 30 q34 18 68 0z" fill="#bfe3cd" /><text y="22" textAnchor="middle" fontSize="18" fontWeight="900" fill="#2e6b4b">B</text>{[0, 1, 2].map((i) => <circle key={i} cx={-14 + i * 14} cy="34" r="6" fill="#3e8a62" className="la-pop" style={{ animationDelay: `${i * 0.5}s` }} />)}</g></g></g>
      <T x={14} y={96} s={0.42} mood="curious" /></>);
    case 'switch': return (<><Sky a="#fff1d9" b="#fffaf0" /><g transform="translate(120 34)"><rect width="80" height="110" rx="16" fill="#fff" stroke="#d7c49e" strokeWidth="4" />
      <g className="la-flip"><rect x="24" y="16" width="32" height="44" rx="10" fill="#ef8fb0" /></g><text x="40" y="96" textAnchor="middle" fontSize="11" fontWeight="900" fill="#6b7a71">OFF</text></g>
      <g fill="#ffd166">{[0, 1, 2].map((i) => <path key={i} className="la-spark" style={{ animationDelay: `${i * 0.4}s` }} d={`M${90 - i * 24} ${50 + i * 26} l6 -10 l2 8 l8 -4 l-6 10 l-2 -8z`} />)}</g></>);
    case 'family': return (<><Sky a="#fde8ef" b="#fff6f9" /><Ground c="#cfe8c4" /><T x={50} y={78} s={0.5} /><T x={180} y={74} s={0.55} mood="calm" />
      <g className="la-pop"><rect x="120" y="26" width="120" height="34" rx="14" fill="#fff" stroke="#ef8fb0" strokeWidth="2" /><text x="180" y="47" textAnchor="middle" fontSize="11" fontWeight="800" fill="#b0506e">"I hear you're scared"</text></g></>);
    case 'doctor': return (<><Sky a="#e5f1f8" b="#f7fbfd" /><g transform="translate(110 22)"><rect width="100" height="128" rx="12" fill="#fff" stroke="#c7d6dd" strokeWidth="4" /><rect x="34" y="-8" width="32" height="16" rx="6" fill="#7f8f9c" />
      {[0, 1, 2, 3].map((i) => <g key={i} className="la-pop" style={{ animationDelay: `${i * 0.5}s` }}><circle cx="20" cy={32 + i * 24} r="6" fill="#6fb489" /><rect x="34" y={28 + i * 24} width="50" height="7" rx="3" fill="#dbe7ec" /></g>)}</g><text x="236" y="56" fontSize="26">🩺</text></>);
    case 'lab': return (<><Sky a="#e8f3ea" b="#f7fbf4" /><g transform="translate(200 40)"><path d="M10 0 h24 v34 l22 50 a8 8 0 0 1 -8 12 h-52 a8 8 0 0 1 -8 -12 l22 -50z" fill="#fff" stroke="#9fc6b0" strokeWidth="4" />
      <path d="M-8 70 h60 l8 18 a8 8 0 0 1 -8 8 h-60 a8 8 0 0 1 -8 -8z" fill="#9ed3b1" />{[0, 1, 2].map((i) => <circle key={i} cx={10 + i * 14} cy="60" r="4" fill="#fff" className="la-bubble" style={{ animationDelay: `${i * 0.6}s` }} />)}</g>
      <g className="la-bob"><T x={30} y={60} s={0.6} mood="excited" /></g></>);
    case 'sound': return (<><Sky a="#dff1e6" b="#f4fbf6" /><T x={110} y={70} s={0.5} mood="calm" />
      {[['🐦', 40, 40], ['🎐', 260, 36], ['🐸', 250, 120], ['🌊', 50, 124], ['🔔', 160, 30]].map(([e, x, y], i) => <g key={i}><text x={x as number} y={y as number} fontSize="22" className="la-pop" style={{ animationDelay: `${i * 0.7}s` }}>{e}</text>
        <circle cx={(x as number) + 12} cy={(y as number) - 8} r="14" fill="none" stroke="#6fb489" strokeWidth="2" className="la-ripple" style={{ animationDelay: `${i * 0.7}s` }} /></g>)}</>);
    case 'sky': return (<><Sky a="#bfe3f3" b="#eef9fb" /><g className="la-weather"><g fill="#fff"><ellipse cx="60" cy="60" rx="30" ry="12" /><circle cx="50" cy="52" r="12" /><circle cx="68" cy="50" r="14" /></g>
      <g fill="#8a9ab0"><ellipse cx="200" cy="80" rx="34" ry="13" /><circle cx="190" cy="70" r="14" /><circle cx="210" cy="68" r="16" /></g><path d="M196 94 l-6 12 h6 l-4 12" stroke="#ffd166" strokeWidth="3" fill="none" /></g>
      <circle cx="270" cy="40" r="16" fill="#ffd76a" /><Ground c="#cfe8c4" /></>);
    case 'pie': return (<><Sky a="#fff1d9" b="#fffaf0" /><g transform="translate(160 86)" className="la-pie">
      {['#9ed3b1', '#8ccff2', '#ffd166', '#c8b6f2', '#f7a8c4', '#ffb27a', '#b6e3a8', '#efc7a5'].map((c, i) => { const a0 = (i / 8) * Math.PI * 2, a1 = ((i + 1) / 8) * Math.PI * 2;
        return <path key={i} d={`M0 0 L${Math.cos(a0) * 60} ${Math.sin(a0) * 60} A60 60 0 0 1 ${Math.cos(a1) * 60} ${Math.sin(a1) * 60}Z`} fill={c} stroke="#fff" strokeWidth="2" />; })}
      <path d="M0 0 L60 0 A60 60 0 0 1 59.4 8.4Z" fill="#ef8fb0" /></g><text x="236" y="42" fontSize="11" fontWeight="800" fill="#6b5a2a">so many causes</text></>);
    default: return <Sky />;
  }
}

export function LessonArt({ id }: { id: ArtId }) {
  return (
    <svg viewBox="0 0 320 170" className="lesson-art" role="img" aria-hidden>
      <Scene id={id} />
    </svg>
  );
}
