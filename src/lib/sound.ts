import manifest from '../content/soundManifest.json';

// The sound world, in four layers (top to bottom): voice, effects, ambience, music.
//  - Music beds stream from file and cross-fade into themselves at the end, so they never stop.
//  - Ambience, garden sources and effects are decoded once and played from memory: loops are seamless.
//  - When the voice speaks, music dips 12 dB and ambience 6 dB over 0.6 s, then returns.
//  - Screens cross-fade over 1.5 s. Every music bed is in D major, so cross-fades never clash.
// Files are built by tools/build-sound.py. A missing file is simply silent.

const FILES = manifest as Record<string, { file: string; secs: number }>;
export const hasSound = (id: string) => id in FILES;

export interface Levels { music: number; ambience: number; effects: number; quiet: boolean }
let levels: Levels = { music: 0.7, ambience: 0.7, effects: 0.8, quiet: false };

const XFADE = 1.5, DUCK_MUSIC = 0.25, DUCK_AMB = 0.5, DUCK_TIME = 0.6;

let ctx: AudioContext | null = null;
let ambBus: GainNode | null = null, fxBus: GainNode | null = null, gardenBus: GainNode | null = null;
function ac() {
  if (!ctx) {
    ctx = new AudioContext();
    ambBus = ctx.createGain(); ambBus.connect(ctx.destination);
    fxBus = ctx.createGain(); fxBus.connect(ctx.destination);
    gardenBus = ctx.createGain(); gardenBus.connect(ctx.destination);
    applyLevels(0);
  }
  return ctx;
}

const buffers = new Map<string, Promise<AudioBuffer | null>>();
function buffer(id: string) {
  if (!buffers.has(id)) {
    buffers.set(id, fetch(`./sound/${FILES[id].file}`).then((r) => r.arrayBuffer()).then((b) => ac().decodeAudioData(b)).catch(() => null));
  }
  return buffers.get(id)!;
}

/* ── music: two media elements, cross-faded ── */
let musicId: string | null = null;
let musicEl: HTMLAudioElement | null = null;
let ducked = false, held = false, paused = false;
const fades = new Map<HTMLAudioElement, number>();

const musicTarget = () => (levels.quiet || held ? 0 : levels.music) * (ducked ? DUCK_MUSIC : 1);

function rampEl(el: HTMLAudioElement, to: number, secs: number, then?: () => void) {
  const from = el.volume, t0 = performance.now();
  cancelAnimationFrame(fades.get(el) ?? 0);
  const step = () => {
    const k = Math.min(1, (performance.now() - t0) / (secs * 1000 || 1));
    el.volume = Math.max(0, Math.min(1, from + (to - from) * k));
    if (k < 1) fades.set(el, requestAnimationFrame(step)); else { fades.delete(el); then?.(); }
  };
  step();
}

function startMusic(id: string, at = 0) {
  const el = new Audio(`./sound/${FILES[id].file}`);
  el.volume = 0;
  el.currentTime = at;
  el.ontimeupdate = () => {   // seamless repeat: begin a fresh copy before this one ends
    if (el === musicEl && el.duration && el.currentTime > el.duration - XFADE - 0.2) { const old = el; musicEl = startMusic(id); rampEl(old, 0, XFADE, () => old.pause()); }
  };
  el.play().catch(() => { /* waits for the first tap; see unlock() */ });
  rampEl(el, musicTarget(), XFADE);
  return el;
}

function setMusic(id: string | null) {
  if (id && !hasSound(id)) id = null;
  if (id === musicId) return;
  musicId = id;
  const old = musicEl;
  if (old) rampEl(old, 0, XFADE, () => old.pause());
  musicEl = id && !paused ? startMusic(id) : null;
}

/* ── ambience: looping buffers through their own gain ── */
let ambId: string | null = null;
let amb: { src: AudioBufferSourceNode; g: GainNode } | null = null;

const ambTarget = () => (levels.quiet ? 0 : levels.ambience) * (ducked ? DUCK_AMB : 1);

async function setAmbience(id: string | null) {
  if (id && !hasSound(id)) id = null;
  if (id === ambId) return;
  ambId = id;
  const c = ac(), now = c.currentTime;
  if (amb) { const a = amb; a.g.gain.setTargetAtTime(0, now, XFADE / 3); window.setTimeout(() => { try { a.src.stop(); } catch { /* already stopped */ } }, XFADE * 1500); amb = null; }
  if (!id) return;
  const b = await buffer(id);
  if (!b || ambId !== id) return;
  const src = c.createBufferSource(); src.buffer = b; src.loop = true;
  const g = c.createGain(); g.gain.value = 0;
  src.connect(g).connect(ambBus!);
  src.start();
  g.gain.setTargetAtTime(1, c.currentTime, XFADE / 3);
  amb = { src, g };
}

function applyLevels(secs = DUCK_TIME) {
  if (ctx && ambBus && fxBus && gardenBus) {
    const now = ctx.currentTime;
    ambBus.gain.setTargetAtTime(ambTarget(), now, secs / 3 || 0.01);
    fxBus.gain.setTargetAtTime(levels.quiet ? 0 : levels.effects, now, 0.01);
    gardenBus.gain.setTargetAtTime(levels.quiet ? 0 : 1, now, 0.01);
  }
  if (musicEl) rampEl(musicEl, musicTarget(), secs);
}

let base: [string | null, string | null] = [null, null];
let over: [string | null, string | null] | null = null;
const applyScene = () => { const [m, a] = over ?? base; setMusic(m); void setAmbience(a); };

/** The music bed and ambience for the screen on show. null = silence for that layer. */
export function setScene(music: string | null, ambience: string | null) { base = [music, ambience]; applyScene(); }

/** A practice that brings its own sound (or silence), even when opened inside a lesson. */
export function overrideScene(scene: [string | null, string | null] | null) { over = scene; applyScene(); }

/** While the voice speaks, everything else steps back. */
export function duck(on: boolean) { if (ducked !== on) { ducked = on; applyLevels(); } }

/** Silences the music without changing the scene (an active Body Lab round). */
export function holdMusic(on: boolean) { if (held !== on) { held = on; applyLevels(1); } }

export function setLevels(l: Levels) { levels = l; applyLevels(0.3); }

let lastFx = 0;
/** A short effect or stinger (F-xx, S-xx). */
export function fx(id: string, vol = 1) {
  if (!hasSound(id) || levels.quiet || levels.effects <= 0) return;
  lastFx = performance.now();
  const c = ac();
  void buffer(id).then((b) => {
    if (!b) return;
    const s = c.createBufferSource(); s.buffer = b;
    const g = c.createGain(); g.gain.value = vol;
    s.connect(g).connect(fxBus!); s.start();
  });
}
/** True if a specific effect has just played (so a generic tap sound can stay quiet). */
export const fxJustPlayed = () => performance.now() - lastFx < 80;

/** The Listening Garden: each isolated source looping in its own place left to right. */
export function garden(sources: { id: string; pan: number; vol?: number }[]) {
  const c = ac();
  const nodes: { src: AudioBufferSourceNode; g: GainNode }[] = [];
  let stopped = false;
  sources.forEach(async (s) => {
    const b = await buffer(s.id);
    if (!b || stopped) return;
    const src = c.createBufferSource(); src.buffer = b; src.loop = true;
    src.loopStart = 0; src.loopEnd = b.duration;
    const g = c.createGain(); g.gain.value = 0;
    const p = c.createStereoPanner(); p.pan.value = s.pan;
    src.connect(g).connect(p).connect(gardenBus!);
    src.start(0, Math.random() * b.duration);   // each source starts at a different point
    g.gain.setTargetAtTime(s.vol ?? 1, c.currentTime, 0.8);
    nodes.push({ src, g });
  });
  return {
    stop() {
      stopped = true;
      const now = c.currentTime;
      nodes.forEach(({ src, g }) => { g.gain.setTargetAtTime(0, now, 0.3); window.setTimeout(() => { try { src.stop(); } catch { /* done */ } }, 1500); });
    },
  };
}

/** Phones only allow sound after a tap: the first one wakes everything. */
export function unlock() {
  const c = ac();
  if (c.state === 'suspended') void c.resume();
  if (musicEl && musicEl.paused && !paused) musicEl.play().catch(() => {});
}

/** The app went to the background (keep: the bedtime screens play on). */
export function background(hidden: boolean, keep: boolean) {
  if (hidden && !keep) {
    paused = true;
    musicEl?.pause();
    void ctx?.suspend();
  } else if (!hidden && paused) {
    paused = false;
    void ctx?.resume();
    if (musicEl) musicEl.play().catch(() => {}); else if (musicId) musicEl = startMusic(musicId);
  }
}

/** What is playing now (for the self-test and debugging). */
export const soundState = () => ({ music: musicId, musicVolume: musicEl ? +musicEl.volume.toFixed(2) : 0, musicPlaying: !!musicEl && !musicEl.paused, ambience: ambId, ducked, held, ctx: ctx?.state ?? 'none' });
