import { fx } from './sound';
import type { Data, Reminders } from './model';
import { isDesk } from './storage';
import { nextSession, addDays } from './progress';
import { missionNo } from './pathway';
import type { Route } from '../components/ui';

// Reminders that stay with you (v1.9).
//  - One plan for every device (planReminders): five daily practice reminders, a reminder on each day
//    a mission is open, and a gentle "still here" note if the app has not been opened for three days.
//  - Phone (Android app): real Android alarms (LocalNotifications), which survive a restart.
//  - PC: the plan is handed to the desktop shell, which keeps running in the tray, starts with
//    Windows, and catches up on a reminder missed while the PC was asleep.
//  - Tapping a reminder opens the practice it is about, not just the app.

export interface Planned { id: number; title: string; body: string; route: Route; daily?: string; at?: number }

export const DAILY: { key: keyof Reminders; id: number; label: string; title: string; body: string; route: Route }[] = [
  { key: 'checkin', id: 101, label: 'Morning check-in', title: 'Good morning', body: 'Thirty seconds: how are you today?', route: { name: 'checkin' } },
  { key: 'breathe1', id: 102, label: 'Breathe (late morning)', title: 'Time to breathe', body: 'Five slow minutes. Your body knows how to settle.', route: { name: 'breathe' } },
  { key: 'breathe2', id: 103, label: 'Breathe (evening)', title: 'Time to breathe', body: 'Five slow minutes before the evening.', route: { name: 'breathe' } },
  { key: 'worry', id: 104, label: 'Worry time', title: 'Worry time', body: 'Fifteen minutes for your saved worries, then close the box.', route: { name: 'worrytime' } },
  { key: 'winddown', id: 105, label: 'Wind down', title: 'Wind down', body: 'Lights low, screens away soon. The wind-down is ready.', route: { name: 'winddown' } },
];
const MISSION_ID = 106, STILL_HERE_ID = 107, TEST_ID = 199;

const hm = (t: string | undefined, fb: string) => (/^\d{1,2}:\d{2}$/.test(t ?? '') ? t! : fb).split(':').map(Number) as [number, number];
const atLocal = (date: string, time: [number, number]) => {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(y, m - 1, d, time[0], time[1], 0, 0).getTime();
};
const localDay = (now: Date) => `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

/** Everything Calm Path will remind you about, from now on. Pure: the same on every device, and tested. */
export function planReminders(d: Data, now = new Date()): Planned[] {
  const r = d.settings.reminders;
  if (!r.enabled) return [];
  const out: Planned[] = DAILY.map((i) => ({ id: i.id, title: i.title, body: i.body, route: i.route, daily: r[i.key] as string }));
  const day = localDay(now);
  // the day's mission: on the next day one is open, at the mission time
  const { session, readyOn } = nextSession(d, now);
  if (session) {
    const t = hm(r.mission, '09:30');
    let date = readyOn ?? day;
    if (!readyOn && atLocal(day, t) <= now.getTime()) date = addDays(day, 1);
    const sw = session.phase === 'staywell';
    out.push({
      id: MISSION_ID, at: atLocal(date, t), route: { name: 'session', id: session.id },
      title: sw ? 'Your monthly visit is ready' : readyOn ? 'A new mission is open today' : "Today's mission is waiting",
      body: sw ? 'A short visit keeps everything you learned strong.' : `Level ${session.week} · Mission ${missionNo(session)}: ${session.title}. About ${session.minutes} minutes.`,
    });
  }
  // never abandoned: if three days pass without opening the app, one kind note (moved forward every time it opens)
  out.push({
    id: STILL_HERE_ID, at: atLocal(addDays(day, 3), hm(r.checkin, '08:30')), route: { name: 'breathe' },
    title: 'Tulu is still here', body: "No pressure. Whenever you're ready, two minutes of slow breathing is a good start.",
  });
  return out;
}

// ── opening the right screen when a reminder is tapped ──
let pending: Route | null = null;
export function openFromReminder(route: Route | string | undefined) {
  if (!route) return;
  const r: Route = typeof route === 'string' ? JSON.parse(route) : route;
  pending = r;
  window.dispatchEvent(new CustomEvent('calm:open', { detail: r }));
}
/** The navigator calls this once it exists (a reminder may be tapped before the app has opened). */
export const takePendingRoute = () => { const r = pending; pending = null; return r; };

const plugin = () => window.Capacitor?.Plugins?.LocalNotifications ?? null;
let listening = false;
function listen() {
  if (listening) return;
  listening = true;
  plugin()?.addListener?.('localNotificationActionPerformed', (a: any) => openFromReminder(a?.notification?.extra?.route));
  window.calmDesk?.onOpen?.((route) => openFromReminder(route));
}

export async function scheduleReminders(d: Data): Promise<string> {
  listen();
  const r = d.settings.reminders;
  const plan = planReminders(d);
  const ln = plugin();
  if (ln) {
    try {
      const perm = await ln.requestPermissions();
      if (perm.display !== 'granted') return 'Notifications are switched off for Calm Path. Turn them on in your phone settings, then press Apply again.';
      await ln.cancel({ notifications: [...DAILY.map((i) => ({ id: i.id })), { id: MISSION_ID }, { id: STILL_HERE_ID }] });
      if (!r.enabled) return 'Reminders are off.';
      await ln.deleteChannel?.({ id: 'calm' }).catch?.(() => {});
      await ln.createChannel?.({ id: 'calm-sound', name: 'Calm reminders', importance: 4, vibration: true, sound: 'reminder.ogg' });
      await ln.schedule({
        notifications: plan.map((p) => {
          const extra = { route: JSON.stringify(p.route) };
          if (p.daily) {
            const [hour, minute] = hm(p.daily, '09:00');
            return { id: p.id, title: p.title, body: p.body, channelId: 'calm-sound', sound: 'reminder.ogg', extra, schedule: { on: { hour, minute }, allowWhileIdle: true } };
          }
          return { id: p.id, title: p.title, body: p.body, channelId: 'calm-sound', sound: 'reminder.ogg', extra, schedule: { at: new Date(p.at!), allowWhileIdle: true } };
        }),
      });
      const exact = await ln.checkExactNotificationSetting?.().catch?.(() => null);
      if (exact && exact.exact_alarm && exact.exact_alarm !== 'granted') return 'Reminders are set. For reminders exactly on time, also allow "Alarms and reminders" (button below).';
      return 'Daily reminders are set. They come even when the app is closed.';
    } catch (e) {
      return 'Could not set reminders: ' + String(e);
    }
  }
  if (isDesk() && window.calmDesk!.schedule) {
    window.calmDesk!.schedule(JSON.stringify(plan), { enabled: r.enabled, startWithPc: r.startWithPc !== false });
    if (!r.enabled) return 'Reminders are off.';
    return r.startWithPc !== false
      ? 'Reminders are set. Calm Path starts quietly with Windows and waits in the tray, so reminders come even when the window is closed.'
      : 'Reminders are set. They come while Calm Path is running (it waits in the tray when you close the window).';
  }
  return 'Reminders work in the phone and PC apps.';
}

/** Is "Alarms and reminders" allowed (Android 12+)? null when not on a phone. */
export async function exactAlarmsAllowed(): Promise<boolean | null> {
  const ln = plugin();
  if (!ln?.checkExactNotificationSetting) return null;
  try { return (await ln.checkExactNotificationSetting()).exact_alarm === 'granted'; } catch { return null; }
}
export async function openExactAlarmSetting() { try { await plugin()?.changeExactNotificationSetting?.(); } catch { /* not available */ } }

/** A sample reminder in five seconds, so a person can see and hear what one looks like. */
export async function testReminder(): Promise<string> {
  listen();
  const title = 'This is a Calm Path reminder', body = 'Tap it, and Calm Path opens the right practice for you.';
  const route = JSON.stringify({ name: 'breathe' });
  const ln = plugin();
  if (ln) {
    try {
      const perm = await ln.requestPermissions();
      if (perm.display !== 'granted') return 'Notifications are switched off for Calm Path. Turn them on in your phone settings.';
      await ln.schedule({ notifications: [{ id: TEST_ID, title, body, channelId: 'calm-sound', sound: 'reminder.ogg', extra: { route }, schedule: { at: new Date(Date.now() + 5000), allowWhileIdle: true } }] });
      return 'A sample reminder will arrive in 5 seconds.';
    } catch (e) { return 'Could not send a sample: ' + String(e); }
  }
  if (isDesk()) {
    window.setTimeout(() => { window.calmDesk!.notify(title, body, route); fx('F-23'); }, 5000);
    return 'A sample reminder will appear in 5 seconds, at the corner of the screen.';
  }
  return 'Reminders work in the phone and PC apps.';
}

/** The next reminder still to come today, for the Home screen ("Next: Breathe at 17:30"). */
export function nextToday(d: Data, now = new Date()): { label: string; time: string; route: Route } | null {
  const r = d.settings.reminders;
  if (!r.enabled) return null;
  const mins = now.getHours() * 60 + now.getMinutes();
  const items = DAILY.map((i) => ({ label: i.label, time: r[i.key] as string, route: i.route }));
  const { session, readyOn } = nextSession(d, now);
  if (session && !readyOn) items.push({ label: "Today's mission", time: r.mission ?? '09:30', route: { name: 'session', id: session.id } });
  return items.filter((i) => { const [h, m] = hm(i.time, '00:00'); return h * 60 + m > mins; })
    .sort((a, b) => a.time.localeCompare(b.time))[0] ?? null;
}
