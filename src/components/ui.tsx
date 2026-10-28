import React, { createContext, useContext, useState } from 'react';

// Navigation: a small stack of routes, no router library.
export type Route =
  | { name: 'home' } | { name: 'path' } | { name: 'tools' } | { name: 'progress' } | { name: 'settings' }
  | { name: 'surge' } | { name: 'urge' } | { name: 'breathe'; minutes?: number } | { name: 'winddown' }
  | { name: 'checkin' } | { name: 'worry' } | { name: 'worrytime' } | { name: 'safety'; crisis?: boolean }
  | { name: 'session'; id: string } | { name: 'form'; formId: string; entryId?: string }
  | { name: 'measure'; id: string } | { name: 'budget' } | { name: 'logs'; formId: string }
  | { name: 'game'; id: GameId; task?: string } | { name: 'family' } | { name: 'hospital' };

export type GameId = 'fearCycle' | 'leaves' | 'forecast' | 'ladder' | 'noting' | 'recipe' | 'bodyLab' | 'listening' | 'theory' | 'switch';

interface Nav { route: Route; go: (r: Route) => void; back: () => void; toast: (t: string) => void }
const NavC = createContext<Nav>(null as unknown as Nav);
export const useNav = () => useContext(NavC);

export function NavProvider({ children, initial = { name: 'home' }, onExit }: {
  children: (r: Route) => React.ReactNode; initial?: Route; onExit?: () => void;
}) {
  const [stack, setStack] = useState<Route[]>([initial]);
  const [msg, setMsg] = useState<string | null>(null);
  const route = stack[stack.length - 1];
  const tabs = ['home', 'path', 'tools', 'progress', 'settings'];
  const go = (r: Route) => {
    setStack((s) => (tabs.includes(r.name) ? [r] : [...s, r]));
    window.scrollTo(0, 0);
  };
  const back = () => {
    if (stack.length <= 1) { onExit?.(); return; }
    setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
    window.scrollTo(0, 0);
  };
  const toast = (t: string) => { setMsg(t); window.setTimeout(() => setMsg(null), 2600); };
  return (
    <NavC.Provider value={{ route, go, back, toast }}>
      {children(route)}
      {msg && <div className="toast" role="status">{msg}</div>}
    </NavC.Provider>
  );
}

export function Back({ label = 'Back', onClick }: { label?: string; onClick?: () => void }) {
  const { back } = useNav();
  return <button className="back" onClick={onClick ?? back}>‹ {label}</button>;
}

export function Scale({ value, onChange, max = 10, step = 1, low, high }: {
  value: number; onChange: (n: number) => void; max?: number; step?: number; low?: string; high?: string;
}) {
  return (
    <div>
      <div className="row">
        <input type="range" min={0} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
        <span className="scale-val">{value}</span>
      </div>
      {(low || high) && <div className="row spread muted"><span>{low}</span><span>{high}</span></div>}
    </div>
  );
}

export function Chips({ options, value, onChange, multi = false }: {
  options: string[]; value: string[]; onChange: (v: string[]) => void; multi?: boolean;
}) {
  return (
    <div className="row wrap">
      {options.map((o) => {
        const on = value.includes(o);
        return (
          <button key={o} type="button" className={'chip' + (on ? ' on' : '')}
            onClick={() => onChange(multi ? (on ? value.filter((x) => x !== o) : [...value, o]) : [o])}>{o}</button>
        );
      })}
    </div>
  );
}

/** Paragraphs with "- " bullets. */
export function Body({ lines }: { lines: string[] }) {
  const out: React.ReactNode[] = [];
  let bullets: string[] = [];
  const flush = (k: number) => {
    if (bullets.length) { out.push(<ul className="b" key={'u' + k}>{bullets.map((b, i) => <li key={i}>{b}</li>)}</ul>); bullets = []; }
  };
  lines.forEach((l, i) => {
    if (l.startsWith('- ')) bullets.push(l.slice(2));
    else { flush(i); out.push(<p key={i}>{l}</p>); }
  });
  flush(lines.length);
  return <>{out}</>;
}

const P = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
export const Icon = {
  home: <svg viewBox="0 0 24 24"><path {...P} d="M4 11l8-6 8 6v8a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z" /></svg>,
  path: <svg viewBox="0 0 24 24"><path {...P} d="M5 20c0-5 4-5 7-8s2-7 7-8" /><circle {...P} cx="5" cy="20" r="1.5" /><circle {...P} cx="19" cy="4" r="1.5" /></svg>,
  tools: <svg viewBox="0 0 24 24"><rect {...P} x="4" y="4" width="7" height="7" rx="2" /><rect {...P} x="13" y="4" width="7" height="7" rx="2" /><rect {...P} x="4" y="13" width="7" height="7" rx="2" /><rect {...P} x="13" y="13" width="7" height="7" rx="2" /></svg>,
  progress: <svg viewBox="0 0 24 24"><path {...P} d="M4 19h16M6 16l4-5 3 3 5-7" /></svg>,
  settings: <svg viewBox="0 0 24 24"><circle {...P} cx="12" cy="12" r="3" /><path {...P} d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" /></svg>,
};
