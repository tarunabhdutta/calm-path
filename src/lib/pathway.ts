// The game path: ten LEVELS (one per week), each made of MISSIONS (the sessions), plus tools that
// OPEN as the missions teach them. Everything is derived from her data, so nothing can be lost:
// a tool she has already used stays open, whatever mission she is on.
import { PROGRAMME } from '../content/programme';
import type { Session } from '../content/types';
import type { Data } from './model';
import type { Route } from '../components/ui';

/** Level number of a mission: week 1..10; the monthly check-in is "Stay well" (11). */
export const levelOf = (s: Session) => s.week;
export const LEVEL_COUNT = 10;

export const missionsIn = (level: number) => PROGRAMME.filter((s) => s.week === level);
export const missionNo = (s: Session) => missionsIn(s.week).findIndex((x) => x.id === s.id) + 1;
export const levelDone = (d: Data, level: number) => missionsIn(level).every((s) => d.sessions[s.id]);
/** Levels finished, in order (1, 2, 3 ...). */
export const levelsDone = (d: Data) => Array.from({ length: LEVEL_COUNT }, (_, i) => i + 1).filter((l) => levelDone(d, l));
/** The level she is on now: the first one not finished. 11 once all ten are done. */
export const currentLevel = (d: Data) => Array.from({ length: LEVEL_COUNT }, (_, i) => i + 1).find((l) => !levelDone(d, l)) ?? 11;

/** One plain sentence per mission: what she will do in it. */
export const GOALS: Record<string, string> = {
  QS1: 'Learn how this app works, and see two ways of explaining your fear.',
  QS2: 'Learn why the body sounds an alarm, and try the SURGE button once while calm.',
  QS3: 'Draw your own fear loop from a real moment, so you can see how it works.',
  QS4: 'Learn the difference between the first fear and the second fear.',
  QS5: 'Learn why checking makes the worry stronger, and start counting your checks.',
  QS6: 'Learn to ride an urge to check, like a wave, for three minutes.',
  QS7: 'Answer two short questionnaires, so you can see your progress later.',
  'S2.1': 'Make a list of everything you do to feel safe.',
  'S2.2': 'Turn off the reminders on your phone and watch that keep you checking.',
  'S2.3': 'Make your plan to check less, one small level at a time.',
  'S3.1': 'Make a plan with a loved one for when you ask "Am I okay?"',
  'S3.2': 'Make a plan for searching online and for visiting doctors.',
  'S3.3': 'Visit the Body Lab: feel a body sensation on purpose, for a short time.',
  'S4.1': 'Learn why facing a fear, in small steps, makes it smaller.',
  'S4.2': 'Build your ladder: a list of feared things, from easiest to hardest.',
  'S4.3': 'Do your first small experiment from the bottom of your ladder.',
  'S5.1': 'Make the Body Lab a short daily practice.',
  'S5.2': 'Try everyday things that raise your heartbeat, such as stairs (with your doctor\'s yes).',
  'S5.3': 'Train your attention in the Listening Garden.',
  'S6.1': 'Write down the worst-case story your mind tells, and look at it calmly.',
  'S6.2': 'Practise living with not knowing for sure.',
  'S6.3': 'Halfway! Look back at how far you have come.',
  'S7.1': 'Catch one frightening thought and write it down.',
  'S7.2': 'Compare what your fear predicted with what really happened.',
  'S7.3': 'Climb your ladder with a random draw.',
  'S8.1': 'Learn to unhook from sticky thoughts.',
  'S8.2': 'Practise making room for a body feeling instead of fighting it.',
  'S8.3': 'Do something that matters to you, even with the fear along for the ride.',
  'S9.1': 'Find what matters most to you, and plan one thing for it.',
  'S9.2': 'Plan your sleep, movement and tea.',
  'S9.3': 'Climb the top steps of your ladder.',
  'S10.1': 'Answer the questionnaires again, and see what changed.',
  'S10.2': 'Make your plan for any future bad day.',
  'S10.3': 'Graduation! Celebrate, and plan how to keep going.',
  SW: 'A short monthly visit to keep your progress strong.',
};

export interface Tool {
  id: string;
  icon: string;
  name: string;
  /** what it is for, in plain words */
  plain: string;
  route: Route;
  /** the mission that opens it; none = open from the start */
  opensWith?: string;
  /** already used, so it stays open */
  used?: (d: Data) => boolean;
}

const has = (d: Data, form: string) => (d.entries[form]?.length ?? 0) > 0 || !!d.persistent[form];

export const TOOLS: Tool[] = [
  { id: 'surge', icon: '🌊', name: 'SURGE', plain: 'Help during a wave of fear, right now', route: { name: 'surge' } },
  { id: 'breathe', icon: '🪷', name: 'Slow breathing', plain: 'Daily breathing practice on calm days', route: { name: 'breathe' } },
  { id: 'checkin', icon: '⛅', name: 'How am I today?', plain: 'A 30-second check-in each morning', route: { name: 'checkin' } },
  { id: 'winddown', icon: '🌙', name: 'Wind down', plain: 'Help to relax before sleep', route: { name: 'winddown' } },
  { id: 'theory', icon: '⚖️', name: 'Two stories', plain: 'Weigh two explanations of your fear', route: { name: 'game', id: 'theory' }, opensWith: 'QS1', used: (d) => !!d.persistent.theory },
  { id: 'fearCycle', icon: '🌀', name: 'Fear loop', plain: 'See how fear keeps itself going', route: { name: 'game', id: 'fearCycle' }, opensWith: 'QS3', used: (d) => has(d, 'fearCycle') },
  { id: 'switch', icon: '🔌', name: 'Fight switch', plain: 'Stop adding fear on top of fear', route: { name: 'game', id: 'switch' }, opensWith: 'QS4', used: (d) => has(d, 'switchPractice') },
  { id: 'worry', icon: '🛶', name: 'Worry river', plain: 'Write a worry down and save it for later', route: { name: 'worry' }, opensWith: 'QS4', used: (d) => d.worries.length > 0 },
  { id: 'noting', icon: '🔍', name: 'Get curious', plain: 'Notice and name a feeling', route: { name: 'game', id: 'noting' }, opensWith: 'QS5' },
  { id: 'counts', icon: '🪨', name: 'Checking count', plain: 'Count each time you check your body', route: { name: 'home' }, opensWith: 'QS5', used: (d) => Object.keys(d.counts).length > 0 },
  { id: 'urge', icon: '🏄‍♀️', name: 'Surf an urge', plain: 'Ride out the pull to check, instead of checking', route: { name: 'urge' }, opensWith: 'QS6', used: (d) => d.urges.length > 0 },
  { id: 'recipe', icon: '🌱', name: 'Little habit', plain: 'Build a tiny daily habit', route: { name: 'game', id: 'recipe' }, opensWith: 'QS7', used: (d) => has(d, 'habitRecipe') },
  { id: 'budget', icon: '🦋', name: 'Checking budget', plain: 'Your rule for how often you may check', route: { name: 'budget' }, opensWith: 'S2.3', used: (d) => d.settings.budgetLevel > 0 },
  { id: 'bodyLab', icon: '🧪', name: 'Body Lab', plain: 'Feel a body sensation on purpose, safely', route: { name: 'game', id: 'bodyLab' }, opensWith: 'S3.3', used: (d) => has(d, 'bodyLab') || has(d, 'bodyPractice') },
  { id: 'ladder', icon: '🪜', name: 'My ladder', plain: 'Face fears one small step at a time', route: { name: 'game', id: 'ladder' }, opensWith: 'S4.2', used: (d) => has(d, 'ladder') || has(d, 'exposureLog') },
  { id: 'forecast', icon: '⛈️', name: 'Forecaster', plain: 'Test what the fear predicts', route: { name: 'game', id: 'forecast' }, opensWith: 'S4.3', used: (d) => has(d, 'exposureLog') },
  { id: 'listening', icon: '🎧', name: 'Listening Garden', plain: 'Train your attention with sounds', route: { name: 'game', id: 'listening' }, opensWith: 'S5.3', used: (d) => has(d, 'listening') },
  { id: 'worrytime', icon: '🕰️', name: 'Worry time', plain: 'Your 15 minutes each evening for saved worries', route: { name: 'worrytime' }, opensWith: 'S6.1', used: (d) => d.worries.some((w) => w.status !== 'parked') },
  { id: 'leaves', icon: '🍃', name: 'Leaves', plain: 'Let a sticky thought float away', route: { name: 'game', id: 'leaves' }, opensWith: 'S6.2', used: (d) => has(d, 'defusion') },
];

export const toolById = (id: string) => TOOLS.find((t) => t.id === id)!;

export function isOpen(d: Data, t: Tool): boolean {
  return !t.opensWith || !!d.sessions[t.opensWith] || !!t.used?.(d);
}

/** "Level 3 · Mission 2", for a locked tool. */
export function opensAt(t: Tool): string {
  const s = PROGRAMME.find((x) => x.id === t.opensWith)!;
  return `Level ${s.week} · Mission ${missionNo(s)}`;
}

/** Tools a mission opens (for the "Mission complete" and "Level complete" moments). */
export const toolsOpenedBy = (sessionId: string) => TOOLS.filter((t) => t.opensWith === sessionId);

/** "Sunday 1 November" for a YYYY-MM-DD date. */
export const friendlyDate = (ymd: string) => new Date(ymd + 'T12:00:00').toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });
