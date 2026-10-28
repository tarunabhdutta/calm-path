import { PROGRAMME } from '../content/programme';
import { MEASURES } from '../content/measures';
import type { Data } from './model';
import { daysBetween, today } from './model';
import type { MeasureId, Session } from '../content/types';

/** The next session to do. Quick Start allows one a day; Strengthen allows one per ~2 days. */
export function nextSession(d: Data, now = new Date()): { session: Session | null; readyOn: string | null } {
  const core = PROGRAMME.filter((s) => s.phase !== 'staywell');
  const next = core.find((s) => !d.sessions[s.id]);
  if (!next) {
    // Stay Well: monthly
    const sw = PROGRAMME.find((s) => s.phase === 'staywell')!;
    const last = d.sessions[sw.id]?.doneAt ?? lastDoneAt(d);
    if (!last) return { session: sw, readyOn: null };
    const due = addDays(localDate(last), 28);
    return due <= today(now) ? { session: sw, readyOn: null } : { session: sw, readyOn: due };
  }
  const last = lastDoneAt(d);
  if (!last) return { session: next, readyOn: null };
  const gap = next.phase === 'quickstart' ? 1 : 2;
  const ready = addDays(localDate(last), gap);
  return ready <= today(now) ? { session: next, readyOn: null } : { session: next, readyOn: ready };
}

export function lastDoneAt(d: Data): string | null {
  const all = Object.values(d.sessions).map((s) => s.doneAt).sort();
  return all.length ? all[all.length - 1] : null;
}

/** Local calendar date of an ISO timestamp (stored times are UTC). */
export const localDate = (iso: string) => today(new Date(iso));

export function addDays(date: string, n: number): string {
  const t = new Date(date + 'T12:00:00');
  t.setDate(t.getDate() + n);
  return today(t);
}

export function doneCount(d: Data): number {
  return PROGRAMME.filter((s) => s.phase !== 'staywell' && d.sessions[s.id]).length;
}

export const coreCount = () => PROGRAMME.filter((s) => s.phase !== 'staywell').length;

/** Measures that are due (never taken, or older than their interval). */
export function measuresDue(d: Data, now = new Date()): MeasureId[] {
  const out: MeasureId[] = [];
  for (const m of Object.values(MEASURES)) {
    const last = [...d.measures].reverse().find((r) => r.kind === m.id);
    if (!last || daysBetween(localDate(last.at), today(now)) >= m.everyDays) out.push(m.id);
  }
  return out;
}

/** Monday-start week key for weekly charts. */
export function weekKey(iso: string): string {
  const t = new Date((iso.length > 10 ? localDate(iso) : iso) + 'T12:00:00');
  const day = (t.getDay() + 6) % 7;
  t.setDate(t.getDate() - day);
  return today(t);
}

export interface WeekRow { week: string; surges: number; surfed: number; checked: number; checks: number; reassurance: number; breaths: number }

export function weekly(d: Data, weeks = 10, now = new Date()): WeekRow[] {
  const rows: Record<string, WeekRow> = {};
  const start = weekKey(today(now));
  for (let i = weeks - 1; i >= 0; i--) {
    const k = addDays(start, -7 * i);
    rows[k] = { week: k, surges: 0, surfed: 0, checked: 0, checks: 0, reassurance: 0, breaths: 0 };
  }
  const hit = (iso: string) => rows[weekKey(iso)];
  d.surges.forEach((s) => { const r = hit(s.at); if (r) r.surges++; });
  d.urges.forEach((u) => { const r = hit(u.at); if (r) u.outcome === 'surfed' ? r.surfed++ : r.checked++; });
  d.breaths.forEach((b) => { const r = hit(b.at); if (r) r.breaths++; });
  Object.entries(d.counts).forEach(([date, c]) => {
    const r = hit(date);
    if (r) { r.checks += c.checks + c.ecg + c.search; r.reassurance += c.reassurance; }
  });
  return Object.values(rows);
}
