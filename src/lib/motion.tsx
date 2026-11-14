// v1.8 motion layer: one place for the app's movement.
// - 3D tilt: cards lean toward the pointer, and dip under a finger like a real button.
// - Reveal: cards rise into view as the screen opens and as you scroll, one after another.
// - Count-up: numbers roll up to their value.
// Everything respects the system "reduce motion" setting and the app's own "Gentle movement" setting.
import { useEffect, useRef, useState } from 'react';
import type React from 'react';

export const lessMotion = () =>
  document.documentElement.dataset.motion === 'gentle' ||
  (typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches);

const TILT = '.tile:not(:disabled), .quest, .mission-card, .island-card, .level-strip, .land-card, .tilt, .stone:not(:disabled) .stone-disc, .rung';
const MAX = 9; // degrees

let tilted: HTMLElement | null = null;
function setTilt(el: HTMLElement, x: number, y: number, press: boolean) {
  const r = el.getBoundingClientRect();
  const px = Math.min(1, Math.max(0, (x - r.left) / r.width));
  const py = Math.min(1, Math.max(0, (y - r.top) / r.height));
  // big surfaces lean less than small ones
  const k = MAX * Math.min(1, 220 / Math.max(r.width, 120)) * (press ? 1.25 : 1);
  el.style.setProperty('--rx', `${((0.5 - py) * k).toFixed(2)}deg`);
  el.style.setProperty('--ry', `${((px - 0.5) * k).toFixed(2)}deg`);
  el.style.setProperty('--gx', `${(px * 100).toFixed(1)}%`);
  el.style.setProperty('--gy', `${(py * 100).toFixed(1)}%`);
  el.classList.add('tilting');
}
function clearTilt(el: HTMLElement | null) {
  if (!el) return;
  el.style.setProperty('--rx', '0deg');
  el.style.setProperty('--ry', '0deg');
  el.classList.remove('tilting');
}

/** One listener for the whole app, so every card gets depth without extra code in each screen. */
export function installTilt() {
  let raf = 0;
  const pick = (e: PointerEvent) => (e.target instanceof Element ? (e.target.closest(TILT) as HTMLElement | null) : null);
  const move = (e: PointerEvent) => {
    if (lessMotion()) return;
    if (e.pointerType === 'touch' && e.buttons === 0) return;
    const el = pick(e);
    if (el !== tilted) { clearTilt(tilted); tilted = el; }
    if (!el) return;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => setTilt(el, e.clientX, e.clientY, e.buttons > 0));
  };
  const down = (e: PointerEvent) => { if (!lessMotion()) { const el = pick(e); if (el) { clearTilt(tilted); tilted = el; setTilt(el, e.clientX, e.clientY, true); } } };
  const up = () => { if (tilted && matchMedia('(hover: none)').matches) { clearTilt(tilted); tilted = null; } };
  const leave = (e: PointerEvent) => { if (tilted && !(e.relatedTarget instanceof Node && tilted.contains(e.relatedTarget))) { clearTilt(tilted); tilted = null; } };
  window.addEventListener('pointermove', move, { passive: true });
  window.addEventListener('pointerdown', down, { passive: true });
  window.addEventListener('pointerup', up, { passive: true });
  window.addEventListener('pointercancel', up, { passive: true });
  document.addEventListener('pointerout', leave, { passive: true });
  window.addEventListener('scroll', () => { clearTilt(tilted); tilted = null; }, { passive: true });
}

const REVEAL = [
  '.app > :not(.back):not(.toast)', '.grid2 > *', '.quests > *', '.chest > *', '.counters > *',
  '.stone', '.land', '.card', '.tile', '.guide-p', '.flow-list > *',
].join(', ');

/** Cards rise in one after another as a screen opens, and as you scroll down to them.
 *  Cards that appear later (the next step of a mission, a new row) rise in too. */
export function revealIn(root: HTMLElement | null) {
  if (!root || lessMotion() || typeof IntersectionObserver !== 'function') return () => undefined;
  const done = (e: AnimationEvent) => {
    if (e.animationName !== 'rise3d') return;
    const el = e.target as HTMLElement;
    el.classList.remove('rv', 'rv-in');
    el.style.animationDelay = '';
  };
  const io = new IntersectionObserver((entries) => {
    let n = 0;
    for (const en of entries) {
      if (!en.isIntersecting) continue;
      const el = en.target as HTMLElement;
      el.style.animationDelay = `${Math.min(n++ * 0.07, 0.35)}s`;
      el.classList.add('rv-in');
      io.unobserve(el);
    }
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0.08 });
  const scan = () => {
    const vh = window.innerHeight;
    let first = 0;
    const els = Array.from(root.querySelectorAll<HTMLElement>(REVEAL)).filter((el) =>
      !el.dataset.rv && !el.closest('.no-reveal') && !el.classList.contains('lesson') && !el.classList.contains('tulu-says'));
    for (const el of els) {
      el.dataset.rv = '1';
      const r = el.getBoundingClientRect();
      if (r.height === 0) continue;
      el.classList.add('rv');
      if (r.top < vh) { el.style.animationDelay = `${Math.min(first++ * 0.06, 0.6)}s`; el.classList.add('rv-in'); }
      else io.observe(el);
    }
  };
  scan();
  let raf = 0;
  const mo = new MutationObserver(() => { cancelAnimationFrame(raf); raf = requestAnimationFrame(scan); });
  mo.observe(root, { childList: true, subtree: true });
  root.addEventListener('animationend', done);
  return () => {
    io.disconnect(); mo.disconnect(); cancelAnimationFrame(raf); root.removeEventListener('animationend', done);
    // anything not yet revealed is handed back, so a fresh pass (or no pass) never leaves a card invisible
    root.querySelectorAll<HTMLElement>('[data-rv]').forEach((el) => {
      if (!el.classList.contains('rv-in')) el.classList.remove('rv');
      delete el.dataset.rv;
    });
  };
}

/** A number that rolls up to its value (from 0 the first time, then from the last value). */
export function CountUp({ value, ms = 900 }: { value: number; ms?: number }) {
  const [shown, setShown] = useState(lessMotion() ? value : 0);
  const from = useRef(lessMotion() ? value : 0);
  useEffect(() => {
    if (lessMotion()) { setShown(value); from.current = value; return; }
    const a = from.current, t0 = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - k, 3);
      setShown(Math.round(a + (value - a) * e));
      if (k < 1) raf = requestAnimationFrame(step); else from.current = value;
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, ms]);
  return <span className="count-up">{shown}</span>;
}

/** Left/right swipes on a card (for the guide and the mission cards). */
export function useSwipe(onLeft: () => void, onRight: () => void) {
  const start = useRef<{ x: number; y: number } | null>(null);
  return {
    onPointerDown: (e: React.PointerEvent) => { start.current = { x: e.clientX, y: e.clientY }; },
    onPointerUp: (e: React.PointerEvent) => {
      const s = start.current; start.current = null;
      if (!s) return;
      const dx = e.clientX - s.x, dy = e.clientY - s.y;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) (dx < 0 ? onLeft : onRight)();
    },
  };
}
