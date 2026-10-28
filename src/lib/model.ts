// Everything the person records, as one plain object stored on their device.

export interface Profile {
  name: string;
  doctorName: string;
  doctorPhone: string;
  supportName: string;
  supportPhone: string;
  medicalNote: string;            // shown on the Medical ID card
  doctorOkBodyPractice?: string;  // ISO date the cardiologist said yes to heart-raising exercises
  medicines: string;              // free text log; the app never advises on medicines
}

export interface Reminders {
  enabled: boolean;
  checkin: string;   // "08:30"
  breathe1: string;
  breathe2: string;
  worry: string;
  winddown: string;
}

export interface Settings {
  reminders: Reminders;
  voice: boolean;
  tone: boolean;
  theme: 'auto' | 'light' | 'dark';
  budgetLevel: 0 | 1 | 2 | 3 | 4;  // 0 = not set yet
}

export interface Surge { id: string; at: string; strength: number; minutes: number; helped: string[]; note: string; repeat: boolean }
export interface Urge { id: string; at: string; kind: string; start: number; end: number; minutes: number; outcome: 'surfed' | 'checked' }
export interface SleepLog { lightsOut?: string; toSleep?: string; wakings?: string; rise?: string }
export interface CheckIn { date: string; anxiety: number; sleep: number; mood: string; caffeine: number; moveMin: number; sleepLog?: SleepLog; emotions?: string[]; context?: string }
export interface Counts { checks: number; ecg: number; reassurance: number; google: number }
export interface Worry { id: string; at: string; text: string; status: 'parked' | 'step' | 'letgo'; step?: string }
export interface MeasureResult { id: string; kind: 'GAD7' | 'PHQ9' | 'WI7'; at: string; answers: number[]; total: number }
export interface SessionDone { doneAt: string; reflection?: string }
export interface FormEntry { id: string; at: string; values: Record<string, unknown> }

export interface Data {
  version: 1;
  createdAt: string;
  profile: Profile;
  settings: Settings;
  sessions: Record<string, SessionDone>;
  surges: Surge[];
  urges: Urge[];
  checkins: CheckIn[];
  counts: Record<string, Counts>;            // by date YYYY-MM-DD
  worries: Worry[];
  breaths: { at: string; minutes: number }[];
  measures: MeasureResult[];
  persistent: Record<string, Record<string, unknown>>; // living documents by form id
  entries: Record<string, FormEntry[]>;                // repeatable logs by form id
  safetyEvents: { at: string; source: string }[];
  game: Game;
}

/** Tulu's Island: what she has already been shown (so celebrations play once). */
export interface Game {
  mascotName: string;
  sound: boolean;
  seenTreasures: string[];
  seenLevel: number;
  seenDrops: number;
}

export const newGame = (): Game => ({ mascotName: 'Tulu', sound: true, seenTreasures: [], seenLevel: 0, seenDrops: 0 });

/** Older vaults (v1.0.0) have no game block. */
export function migrate(d: Data): Data {
  if (!d.game) d.game = newGame();
  return d;
}

export const emptyCounts = (): Counts => ({ checks: 0, ecg: 0, reassurance: 0, google: 0 });

export function newData(p: Partial<Profile> = {}): Data {
  return {
    version: 1,
    createdAt: new Date().toISOString(),
    profile: {
      name: '', doctorName: '', doctorPhone: '', supportName: '', supportPhone: '',
      medicalNote: '',
      medicines: '',
      ...p,
    },
    settings: {
      reminders: { enabled: true, checkin: '08:30', breathe1: '11:30', breathe2: '17:30', worry: '19:30', winddown: '22:15' },
      voice: true, tone: true, theme: 'auto', budgetLevel: 0,
    },
    sessions: {}, surges: [], urges: [], checkins: [], counts: {}, worries: [], breaths: [],
    measures: [], persistent: {}, entries: {}, safetyEvents: [], game: newGame(),
  };
}

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
export const today = (d = new Date()) => {
  const z = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
};
export const daysBetween = (a: string, b: string) => Math.round((Date.parse(b) - Date.parse(a)) / 86_400_000);

export const BUDGET_LEVELS: Record<number, string> = {
  0: 'Not set yet',
  1: 'Level 1: health data at most once a day, not at night',
  2: 'Level 2: health data at most every other day',
  3: 'Level 3: health data at most once a week',
  4: 'Level 4: no checking. My body looks after itself.',
};
