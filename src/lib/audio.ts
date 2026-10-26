import manifest from '../content/audioManifest.json';

// Voice clips bundled at build time (tools/sync-audio.mjs) and a soft synthesized breathing tone.

const have = new Set<string>(manifest as string[]);
export const hasClip = (f: string) => have.has(f);

let current: HTMLAudioElement | null = null;

export function playClip(f: string, onEnd?: () => void): boolean {
  if (!have.has(f)) return false;
  stopClip();
  current = new Audio(`./audio/${f}`);
  current.onended = () => onEnd?.();
  current.play().catch(() => onEnd?.());
  return true;
}

export function stopClip() {
  if (current) { current.pause(); current.src = ''; current = null; }
}

let ctx: AudioContext | null = null;

/** A gentle rising (in) or falling (out) tone that lasts `secs`. */
export function breathTone(dir: 'in' | 'out', secs: number) {
  try {
    ctx ??= new AudioContext();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    const t = ctx.currentTime;
    o.type = 'sine';
    o.frequency.setValueAtTime(dir === 'in' ? 196 : 262, t);
    o.frequency.linearRampToValueAtTime(dir === 'in' ? 262 : 196, t + secs);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.06, t + Math.min(1.2, secs / 3));
    g.gain.setValueAtTime(0.06, t + secs - 1);
    g.gain.exponentialRampToValueAtTime(0.0001, t + secs);
    o.connect(g).connect(ctx.destination);
    o.start(t);
    o.stop(t + secs + 0.05);
  } catch { /* audio unavailable: silent visual pacing still works */ }
}
