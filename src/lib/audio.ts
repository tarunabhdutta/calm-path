import manifest from '../content/audioManifest.json';
import captions from '../content/captions.json';
import { duck } from './sound';

// Voice clips bundled at build time (tools/sync-audio.mjs) and a soft synthesized breathing tone.
// Captions (tools/make-captions.py) carry the script text, timed to each recording.

const have = new Set<string>(manifest as string[]);
export const hasClip = (f: string) => have.has(f);

type Cue = [number, string];
const CAPS = captions as unknown as Record<string, { dur: number; cues: Cue[] }>;

/** What the voice is saying now: the clip, and the caption of the line being spoken (held through pauses). */
export interface Speaking { clip: string; text: string; ended: boolean }
let speaking: Speaking | null = null;
const listeners = new Set<(s: Speaking | null) => void>();
const emit = (s: Speaking | null) => { speaking = s; listeners.forEach((l) => l(s)); };
export function onSpeaking(l: (s: Speaking | null) => void) { listeners.add(l); l(speaking); return () => { listeners.delete(l); }; }

let current: HTMLAudioElement | null = null;
let raf = 0;
let currentFile = '';
let voiceVolume = 1;
export const setVoiceVolume = (v: number) => { voiceVolume = v; if (current) current.volume = v; };
export const isPlaying = () => current !== null;

/** Length of a bundled clip in seconds (0 when unknown). */
export const clipDuration = (f: string) => CAPS[f]?.dur ?? 0;

function cueAt(f: string, t: number) {
  const cues = CAPS[f]?.cues;
  if (!cues) return '';
  let text = '';
  for (const [at, line] of cues) { if (at <= t) text = line; else break; }
  return text;
}

/** Plays a clip. `onEnd` runs when it finishes or cannot play (a clip stopped on purpose reports nothing);
 *  pass `onFail` to handle "cannot play" separately. */
export function playClip(f: string, onEnd?: () => void, onFail?: () => void): boolean {
  if (!have.has(f)) return false;
  stopClip();
  const a = new Audio(`./audio/${f}`);
  current = a;
  currentFile = f;
  a.volume = voiceVolume;
  duck(true);
  const tick = () => {
    if (current !== a) return;
    const text = cueAt(f, a.currentTime);
    if (!speaking || speaking.text !== text || speaking.clip !== f) emit({ clip: f, text, ended: false });
    raf = requestAnimationFrame(tick);
  };
  a.onended = () => {
    if (current === a) { cancelAnimationFrame(raf); current = null; duck(false); emit({ clip: f, text: '', ended: true }); emit(null); }
    onEnd?.();
  };
  a.play().then(() => { raf = requestAnimationFrame(tick); }).catch(() => {
    if (current !== a) return;
    current = null; duck(false); emit(null);
    (onFail ?? onEnd)?.();
  });
  return true;
}

/** Stops `f` only if it is still the clip playing (a screen closing must not cut off the next one). */
export function stopClipIf(f: string) { if (current && currentFile === f) stopClip(); }

export function stopClip() {
  cancelAnimationFrame(raf);
  if (current) { current.pause(); current.src = ''; current = null; duck(false); }
  if (speaking) emit(null);
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
