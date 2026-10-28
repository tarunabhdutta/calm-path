import { fx } from './sound';
import type { Reminders } from './model';
import { isDesk } from './storage';

// Daily reminders.
//  - Phone (Capacitor APK): real Android alarms via LocalNotifications (law E-18).
//  - PC (Electron): a gentle desktop notification while the app is open.

const ITEMS: { key: keyof Reminders; id: number; title: string; body: string }[] = [
  { key: 'checkin', id: 101, title: 'Good morning', body: 'Thirty seconds for your check-in.' },
  { key: 'breathe1', id: 102, title: 'Time to breathe', body: 'Five slow minutes. Your body knows how to settle.' },
  { key: 'breathe2', id: 103, title: 'Time to breathe', body: 'Five slow minutes before evening.' },
  { key: 'worry', id: 104, title: 'Worry time', body: 'Fifteen minutes for the worry box, then close it.' },
  { key: 'winddown', id: 105, title: 'Wind down', body: 'Lights low, screens away. The wind-down is ready.' },
];

const plugin = () => window.Capacitor?.Plugins?.LocalNotifications ?? null;

export async function scheduleReminders(r: Reminders): Promise<string> {
  const ln = plugin();
  if (ln) {
    try {
      const perm = await ln.requestPermissions();
      if (perm.display !== 'granted') return 'Notifications are not allowed. Turn them on in Android settings.';
      await ln.cancel({ notifications: ITEMS.map((i) => ({ id: i.id })) });
      if (!r.enabled) return 'Reminders are off.';
      // v1.6: a new channel carries the soft reminder sound (a channel's sound cannot change once made)
      await ln.deleteChannel?.({ id: 'calm' }).catch?.(() => {});
      await ln.createChannel?.({ id: 'calm-sound', name: 'Calm reminders', importance: 3, vibration: false, sound: 'reminder.ogg' });
      await ln.schedule({
        notifications: ITEMS.map((i) => {
          const [hour, minute] = (r[i.key] as string).split(':').map(Number);
          return { id: i.id, title: i.title, body: i.body, channelId: 'calm-sound', sound: 'reminder.ogg', schedule: { on: { hour, minute }, allowWhileIdle: true } };
        }),
      });
      return 'Daily reminders are set.';
    } catch (e) {
      return 'Could not set reminders: ' + String(e);
    }
  }
  startDeskTicker(r);
  return isDesk() ? 'Reminders show on this PC while the app is open.' : 'Reminders work in the phone and PC apps.';
}

let tick: number | null = null;
function startDeskTicker(r: Reminders) {
  if (tick) window.clearInterval(tick);
  if (!r.enabled || !isDesk()) return;
  let lastFired = '';
  tick = window.setInterval(() => {
    const d = new Date();
    const hm = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    if (hm === lastFired) return;
    const hit = ITEMS.find((i) => r[i.key] === hm);
    if (hit) { lastFired = hm; window.calmDesk!.notify(hit.title, hit.body); fx('F-23'); }
  }, 20_000);
}
