// Tulu, the baby one-horned rhino from the Brahmaputra islands. Drawn in SVG, animated in CSS.

export type Mood = 'happy' | 'calm' | 'sleep' | 'excited' | 'curious';

/** The rhino as an SVG group (viewBox 0 0 140 110), usable inside any scene. */
export function TuluG({ mood = 'happy', hop = false }: { mood?: Mood; hop?: boolean }) {
  const eyesClosed = mood === 'calm' || mood === 'sleep';
  return (
    <g className={'tulu' + (hop ? ' hop' : '')}>
      <ellipse cx="74" cy="103" rx="46" ry="5" fill="rgba(20,40,40,.13)" />
      <g className="tulu-body">
        {/* far legs */}
        <rect x="52" y="74" width="14" height="27" rx="7" fill="#7f8f9c" />
        <rect x="100" y="74" width="14" height="27" rx="7" fill="#7f8f9c" />
        {/* tail */}
        <path d="M118 62 q10 2 9 12" stroke="#8a99a6" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <circle cx="127" cy="75" r="3" fill="#6f7f8c" />
        {/* body */}
        <ellipse cx="82" cy="66" rx="40" ry="28" fill="#a7b5c1" />
        <ellipse cx="86" cy="58" rx="28" ry="14" fill="#b6c3cd" opacity=".55" />
        <path d="M72 41 Q66 66 73 92" stroke="#93a2ae" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <path d="M100 42 Q106 64 101 90" stroke="#93a2ae" strokeWidth="2" fill="none" strokeLinecap="round" opacity=".7" />
        {/* near legs */}
        <rect x="40" y="76" width="15" height="26" rx="7.5" fill="#97a6b2" />
        <rect x="88" y="76" width="15" height="26" rx="7.5" fill="#97a6b2" />
        <path d="M42 100 h11 M90 100 h11" stroke="#7d8c98" strokeWidth="2" strokeLinecap="round" />
        {/* ears */}
        <g>
          <ellipse cx="62" cy="34" rx="6" ry="10" transform="rotate(18 62 34)" fill="#97a6b2" />
          <ellipse cx="50" cy="31" rx="6.5" ry="11" transform="rotate(-16 50 31)" fill="#a7b5c1" />
          <ellipse cx="50" cy="32" rx="3.2" ry="6.5" transform="rotate(-16 50 32)" fill="#f2c3cb" />
        </g>
        {/* head */}
        <ellipse cx="44" cy="57" rx="28" ry="25" fill="#b0bdc8" />
        <ellipse cx="25" cy="67" rx="17" ry="13.5" fill="#bfcad3" />
        {/* horns */}
        <path d="M15 58 Q9 42 21 45 Q22 51 25 57 Z" fill="#f3e8d3" stroke="#e2d3b6" strokeWidth="1" />
        <path d="M27 54 Q26 47 31 48 Q31 51 32 54 Z" fill="#f3e8d3" />
        {/* nostril */}
        <ellipse cx="15" cy="69" rx="1.8" ry="2.4" fill="#7c8a95" />
        {/* cheek */}
        <ellipse cx="36" cy="66" rx="5.5" ry="3.4" fill="#f5b3bf" opacity=".75" />
        {/* eye */}
        {eyesClosed ? (
          <path d="M37 52 q4.5 4 9 0" stroke="#2c393f" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        ) : (
          <g className="tulu-eye">
            <ellipse cx="41.5" cy="52" rx="4.6" ry="5.2" fill="#2c393f" />
            <circle cx="43.2" cy="50" r="1.7" fill="#fff" />
            <circle cx="40.2" cy="54.2" r=".8" fill="#fff" opacity=".8" />
          </g>
        )}
        {/* mouth */}
        {mood === 'excited' ? (
          <path d="M22 75 q6 7 13 0 z" fill="#c9707e" />
        ) : (
          <path d="M22 75 q6 5 12 0" stroke="#5d6a73" strokeWidth="2" fill="none" strokeLinecap="round" />
        )}
      </g>
      {mood === 'sleep' && (
        <g className="zzz" fill="#7c8fa8" fontFamily="inherit" fontWeight="800">
          <text x="62" y="18" fontSize="12">z</text>
          <text x="72" y="9" fontSize="9">z</text>
        </g>
      )}
      {mood === 'excited' && (
        <g className="sparkles" fill="#ffcf5a">
          <path d="M10 26 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" />
          <path d="M70 14 l1.5 3.5 3.5 1.5 -3.5 1.5 -1.5 3.5 -1.5 -3.5 -3.5 -1.5 3.5 -1.5z" />
        </g>
      )}
    </g>
  );
}

export function Tulu({ mood = 'happy', size = 120, hop = false }: { mood?: Mood; size?: number; hop?: boolean }) {
  return (
    <svg viewBox="0 0 140 110" width={size} height={(size * 110) / 140} aria-hidden>
      <TuluG mood={mood} hop={hop} />
    </svg>
  );
}

/** Things Tulu says when tapped. Encouraging, never reassuring about health. */
export const TULU_LINES = [
  'Hi! Shall we water the island together?',
  'I love slow breathing. My ears go all floppy.',
  'Waves come and waves go. We just float.',
  'Every little practice makes our island greener.',
  'Want to surf an urge with me? I\'m getting good at it.',
  'Rhinos are slow and steady. So are we.',
  'Look how the river keeps moving. Nothing stays forever.',
  'I found a new path on our journey. Want to see?',
  'You did the hard thing. That deserves a happy wiggle.',
  'Tea hills, lotus ponds… there\'s so much to explore.',
];
