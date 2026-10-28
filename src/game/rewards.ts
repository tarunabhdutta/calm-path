// Tulu's Island: the reward engine. Everything is DERIVED from her logs, so it can never be lost.
//
// Rules that keep the play safe for health anxiety (checked by the self-test):
//  1. Drops reward PRACTICE (breathing, surfing urges, riding waves with SURGE, sessions,
//     facing fears), never low scores or "anxiety-free" days. A high score never costs anything.
//  2. Nothing is ever taken away: no streak that breaks, no wilting, no lost levels.
//  3. Checking is never rewarded. A counter tap earns nothing. "I checked anyway" after an urge
//     earns one drop for having tried to surf.
import type { Data } from '../lib/model';
import { localDate } from '../lib/progress';
import { PROGRAMME } from '../content/programme';

export const DROP_RULES = {
  breathMinute: 1,      // capped at 10 per sitting
  urgeSurfed: 3,
  urgeTried: 1,
  waveRidden: 3,        // a SURGE logged
  session: 5,
  checkin: 1,
  worryParked: 1,
  worrySettled: 1,
  measure: 2,
  practiceEntry: 3,     // any repeatable log (exposure, body practice, thought record...)
  pageFilled: 3,        // a living page filled for the first time
};

export function drops(d: Data): number {
  const r = DROP_RULES;
  let n = 0;
  n += d.breaths.reduce((a, b) => a + Math.min(10, b.minutes) * r.breathMinute, 0);
  n += d.urges.reduce((a, u) => a + (u.outcome === 'surfed' ? r.urgeSurfed : r.urgeTried), 0);
  n += d.surges.length * r.waveRidden;
  n += Object.keys(d.sessions).length * r.session;
  n += d.checkins.length * r.checkin;
  n += d.worries.length * r.worryParked + d.worries.filter((w) => w.status !== 'parked').length * r.worrySettled;
  n += d.measures.length * r.measure;
  n += Object.values(d.entries).reduce((a, e) => a + e.length * r.practiceEntry, 0);
  n += Object.keys(d.persistent).length * r.pageFilled;
  return n;
}

/** Distinct days on which she practised anything. Only ever goes up. */
export function gardenDays(d: Data): number {
  const days = new Set<string>();
  const add = (iso: string) => days.add(iso.length > 10 ? localDate(iso) : iso);
  d.breaths.forEach((b) => add(b.at));
  d.urges.forEach((u) => add(u.at));
  d.surges.forEach((s) => add(s.at));
  Object.values(d.sessions).forEach((s) => add(s.doneAt));
  d.checkins.forEach((c) => add(c.date));
  Object.values(d.entries).flat().forEach((e) => add(e.at));
  return days.size;
}

// ── Island levels: each adds something to the scene, forever ──
export const LEVELS = [
  { at: 0, name: 'A quiet island', adds: 'Tulu has found a little island in the river.' },
  { at: 10, name: 'First sprouts', adds: 'Tiny green sprouts are peeking out.' },
  { at: 30, name: 'Wildflowers', adds: 'Wildflowers opened on the meadow.' },
  { at: 60, name: 'Bamboo grove', adds: 'A bamboo grove is swaying in the breeze.' },
  { at: 100, name: 'Tea garden', adds: 'Tea bushes grew in neat green rows.' },
  { at: 160, name: 'Lotus pond', adds: 'A lotus pond appeared, with pink blossoms.' },
  { at: 240, name: 'Butterflies', adds: 'Butterflies have come to visit.' },
  { at: 340, name: 'Hornbill tree', adds: 'A big tree grew, and a hornbill made it home.' },
  { at: 460, name: 'Stilt house', adds: 'A cosy stilt house now stands by the water.' },
  { at: 600, name: 'Firefly nights', adds: 'Fireflies dance here every evening, and a rainbow appears.' },
  { at: 800, name: 'Rhino family', adds: 'Tulu\'s mother came to live on the island too.' },
];

export function level(d: Data): number {
  const n = drops(d);
  let l = 0;
  LEVELS.forEach((lv, i) => { if (n >= lv.at) l = i; });
  return l;
}

export function nextLevelProgress(d: Data): { have: number; need: number; pct: number } {
  const n = drops(d);
  const l = level(d);
  if (l >= LEVELS.length - 1) return { have: n, need: n, pct: 100 };
  const from = LEVELS[l].at, to = LEVELS[l + 1].at;
  return { have: n - from, need: to - from, pct: Math.round(((n - from) / (to - from)) * 100) };
}

// ── Treasures (badges) ──
export interface Treasure { id: string; icon: string; name: string; how: string; got: (d: Data) => boolean }

const done = (d: Data, id: string) => !!d.sessions[id];
const surfed = (d: Data) => d.urges.filter((u) => u.outcome === 'surfed').length;
const entries = (d: Data, f: string) => d.entries[f]?.length ?? 0;
const breathDays = (d: Data) => new Set(d.breaths.map((b) => localDate(b.at))).size;

export const TREASURES: Treasure[] = [
  { id: 'sprout', icon: '🌱', name: 'First Sprout', how: 'Finish your first step on the journey', got: (d) => done(d, 'QS1') },
  { id: 'brave-wave', icon: '🌊', name: 'Brave Wave', how: 'Ride out a wave with SURGE', got: (d) => d.surges.length >= 1 },
  { id: 'surfer', icon: '🏄‍♀️', name: 'Urge Surfer', how: 'Surf your first urge to check', got: (d) => surfed(d) >= 1 },
  { id: 'shells', icon: '🐚', name: 'Shell Collector', how: 'Surf 10 urges', got: (d) => surfed(d) >= 10 },
  { id: 'dolphin', icon: '🐬', name: 'River Dolphin', how: 'Surf 30 urges', got: (d) => surfed(d) >= 30 },
  { id: 'lotus', icon: '🪷', name: 'Lotus Breath', how: 'Breathe slowly on 7 different days', got: (d) => breathDays(d) >= 7 },
  { id: 'wind', icon: '🍃', name: 'Gentle Wind', how: 'Breathe slowly for 60 minutes in total', got: (d) => d.breaths.reduce((a, b) => a + b.minutes, 0) >= 60 },
  { id: 'weather', icon: '⛅', name: 'Weather Watcher', how: 'Do 14 daily check-ins', got: (d) => d.checkins.length >= 14 },
  { id: 'boats', icon: '🛶', name: 'Paper Boats', how: 'Let 5 worries float away at worry time', got: (d) => d.worries.filter((w) => w.status === 'letgo').length >= 5 },
  { id: 'sunrise', icon: '🌅', name: 'Sunrise Meadow', how: 'Complete the Quick Start week', got: (d) => PROGRAMME.filter((s) => s.phase === 'quickstart').every((s) => done(d, s.id)) },
  { id: 'watch', icon: '⌚', name: 'New Watch Job', how: 'Turn the watch into a calm coach', got: (d) => ((d.persistent.watchSetup?.steps as string[] | undefined)?.length ?? 0) >= 5 },
  { id: 'team', icon: '🤝', name: 'Team of Two', how: 'Make the reassurance plan with someone close', got: (d) => !!d.persistent.reassurancePlan },
  { id: 'rung', icon: '🪜', name: 'First Rung', how: 'Do your first facing-fear practice', got: (d) => entries(d, 'exposureLog') >= 1 },
  { id: 'climber', icon: '⛰️', name: 'Hill Climber', how: 'Do 10 facing-fear practices', got: (d) => entries(d, 'exposureLog') >= 10 },
  { id: 'heartbeat', icon: '🧪', name: 'Lab Explorer', how: 'Do your first Body Lab round', got: (d) => entries(d, 'bodyLab') + entries(d, 'bodyPractice') >= 1 },
  { id: 'labMaster', icon: '🔬', name: 'Brave Scientist', how: 'Do 30 Body Lab rounds', got: (d) => entries(d, 'bodyLab') >= 30 },
  { id: 'listener', icon: '🎧', name: 'Garden Listener', how: 'Train attention in the Sound Garden 5 times', got: (d) => entries(d, 'soundGarden') >= 5 },
  { id: 'theorist', icon: '⚖️', name: 'Fair Judge', how: 'Weigh Theory A and B on three different days', got: (d) => (((d.persistent.theory as any)?.history ?? []) as unknown[]).length >= 3 },
  { id: 'noticer', icon: '👀', name: 'Noticer', how: 'Notice 20 urges (surfed or not)', got: (d) => d.urges.length >= 20 },
  { id: 'detective', icon: '🔍', name: 'Thought Detective', how: 'Write your first thought record', got: (d) => entries(d, 'thoughtRecord') >= 1 },
  { id: 'butterfly', icon: '🦋', name: 'Free Butterfly', how: 'Reach checking budget level 4', got: (d) => d.settings.budgetLevel === 4 },
  { id: 'island', icon: '🏝️', name: 'Island of Calm', how: 'Finish the whole journey', got: (d) => done(d, 'S10.3') },
];

export const earned = (d: Data) => TREASURES.filter((t) => t.got(d)).map((t) => t.id);

// ── Journey lands: one per week ──
export const LANDS: Record<number, { name: string; icon: string; sky: [string, string]; line: string }> = {
  1: { name: 'Sunrise Meadow', icon: '🌅', sky: ['#ffe3c4', '#fff6e8'], line: 'Where every journey begins' },
  2: { name: 'Bamboo Grove', icon: '🎋', sky: ['#d9f0d2', '#f1faee'], line: 'Bending, never breaking' },
  3: { name: 'Tea Hills', icon: '🍵', sky: ['#cdebc9', '#eef8e9'], line: 'Rows of quiet green' },
  4: { name: 'River Crossing', icon: '🌉', sky: ['#cfe8f3', '#eef7fb'], line: 'One stepping stone at a time' },
  5: { name: 'Lotus Pond', icon: '🪷', sky: ['#f9dbe6', '#fdf0f5'], line: 'Blooming out of the mud' },
  6: { name: 'Firefly Forest', icon: '✨', sky: ['#d6d3f0', '#f0eefb'], line: 'Little lights in the dark' },
  7: { name: 'Hornbill Heights', icon: '🦜', sky: ['#fde7b8', '#fff7e2'], line: 'Seeing from higher up' },
  8: { name: 'Cloud Bridge', icon: '☁️', sky: ['#dfe9f7', '#f5f8fd'], line: 'Thoughts drift like clouds' },
  9: { name: 'Rhino Plains', icon: '🦏', sky: ['#e6edc8', '#f6f9ea'], line: 'Strong, steady, at home' },
  10: { name: 'Island of Calm', icon: '🏝️', sky: ['#c8ecea', '#ecf9f8'], line: 'The island is yours' },
  11: { name: 'Home Shore', icon: '🏡', sky: ['#efe4d6', '#faf6f0'], line: 'Visit once a month' },
};

/** Today's three little quests. */
export function quests(d: Data, todayStr: string, sessionDoneToday: boolean) {
  const breathToday = d.breaths.filter((b) => localDate(b.at) === todayStr).reduce((a, b) => a + b.minutes, 0);
  return [
    { id: 'breathe', label: 'Breathe 5 minutes', done: breathToday >= 5, progress: Math.min(1, breathToday / 5) },
    { id: 'checkin', label: 'Weather check', done: d.checkins.some((c) => c.date === todayStr), progress: d.checkins.some((c) => c.date === todayStr) ? 1 : 0 },
    { id: 'step', label: 'A journey step or practice', done: sessionDoneToday, progress: sessionDoneToday ? 1 : 0 },
  ];
}
