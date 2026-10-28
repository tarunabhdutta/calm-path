import { useEffect, useState } from 'react';
import { Back, useNav } from '../components/ui';
import { useStore } from '../lib/store';
import { CRISIS_LINES, RED_FLAGS } from '../lib/safety';
import { backupRaw, isDesk } from '../lib/storage';
import { scheduleReminders } from '../lib/notify';
import type { Reminders } from '../lib/model';
import { soundPrefs, today } from '../lib/model';
import type { SoundPrefs } from '../lib/model';

export function Safety({ crisis = false }: { crisis?: boolean }) {
  const { data } = useStore();
  const p = data?.profile;
  const tel = (n: string) => 'tel:' + n.replace(/[^\d+]/g, '');
  const crisisBlock = (
    <div className="card" style={{ borderColor: 'var(--water)' }}>
      <h3>If you are having thoughts of harming yourself</h3>
      <p>You don't have to carry this alone. Please talk to someone now.</p>
      <a className="call calm" href={tel(CRISIS_LINES.teleManas)}>Tele-MANAS {CRISIS_LINES.teleManas}</a>
      <p className="muted">Free, 24×7, in many Indian languages (also {CRISIS_LINES.teleManasAlt}).</p>
      {p?.supportPhone && <a className="call calm" href={tel(p.supportPhone)}>Call {p.supportName || 'my support person'}</a>}
      {p?.doctorPhone && <a className="call calm" href={tel(p.doctorPhone)}>Call {p.doctorName || 'my doctor'}</a>}
    </div>
  );
  return (
    <div className="app">
      <Back />
      <h1>Safety card</h1>
      {crisis && crisisBlock}
      <div className="safety-card">
        <h3>Call 108 now if any of these happen</h3>
        <ul className="b">{RED_FLAGS.map((r) => <li key={r}>{r}</li>)}</ul>
        <a className="call" href={tel(CRISIS_LINES.emergency)}>Call 108 (ambulance)</a>
        {p?.doctorPhone && <a className="call calm" href={tel(p.doctorPhone)}>Call {p.doctorName || 'my doctor'}</a>}
      </div>
      <div className="card soft">
        <p>If this is your familiar wave, with the fast heart and the fear, press SURGE and let it pass. This card is for the signs above, not for reassurance.</p>
      </div>
      {!crisis && crisisBlock}
      {p && (
        <div className="card">
          <h3>Medical ID</h3>
          <p><b>{p.name}</b></p>
          <p>{p.medicalNote}</p>
          <p className="muted">Medicines: {p.medicines}</p>
          {p.supportPhone && <p className="muted">Emergency contact: {p.supportName}, {p.supportPhone}</p>}
        </div>
      )}
    </div>
  );
}

export function Settings() {
  const { data, update, snapshot, restore } = useStore();
  const { toast } = useNav();
  const d = data!;
  const sp = soundPrefs(d.settings);
  const setSound = (p: Partial<SoundPrefs>) => update((x) => { x.settings.sound = { ...soundPrefs(x.settings), ...p }; });
  const [info, setInfo] = useState<{ dataDir: string; backupDir: string; version: string } | null>(null);
  const [pending, setPending] = useState<string | null>(null);   // a backup that needs its old PIN
  const [restorePin, setRestorePin] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => { if (isDesk()) window.calmDesk!.info().then(setInfo); }, []);

  const setRem = (k: keyof Reminders, v: string | boolean) => update((x) => { (x.settings.reminders as any)[k] = v; });
  const applyReminders = async () => setMsg(await scheduleReminders(d.settings.reminders));
  const doBackup = async () => {
    const raw = snapshot();
    if (raw) { const where = await backupRaw(raw); toast('Backup saved'); setMsg('Backup saved: ' + where); }
  };
  const tryRestore = async (raw: string, pin?: string) => {
    const r = await restore(raw, pin);
    if (r === 'ok') { setPending(null); setRestorePin(''); setMsg('Backup restored.'); }
    else if (r === 'need-pin') { setPending(raw); if (pin) setMsg('That PIN does not open this older backup.'); }
    else setMsg('That file is not a Calm Path backup.');
  };
  const pickRestore = async () => {
    if (!window.confirm('Restoring replaces everything in the app with the backup. Continue?')) return;
    if (isDesk()) {
      const raw = await window.calmDesk!.restorePick();
      if (raw) void tryRestore(raw);
    } else {
      const inp = document.createElement('input');
      inp.type = 'file'; inp.accept = '.calmpath,application/json';
      inp.onchange = async () => { const f = inp.files?.[0]; if (f) void tryRestore(await f.text()); };
      inp.click();
    }
  };
  const prof = (k: keyof typeof d.profile) => ({
    value: (d.profile[k] as string) ?? '',
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => update((x) => { (x.profile as any)[k] = e.target.value; }),
  });

  return (
    <div className="app">
      <h1>Settings</h1>
      {msg && <div className="banner">{msg}</div>}

      <h2>People and safety</h2>
      <div className="card">
        <label className="f">Name</label><input type="text" {...prof('name')} />
        <label className="f">Doctor's name</label><input type="text" {...prof('doctorName')} placeholder="e.g. Dr. Sharma" />
        <label className="f">Doctor's phone</label><input type="tel" {...prof('doctorPhone')} />
        <label className="f">Support person</label><input type="text" {...prof('supportName')} />
        <label className="f">Support person's phone</label><input type="tel" {...prof('supportPhone')} />
        <label className="f">Medical ID note</label><textarea {...prof('medicalNote')} />
        <label className="f">Medicines (a log only; the app never advises on medicines)</label><textarea {...prof('medicines')} />
      </div>

      <h2>Doctor said yes</h2>
      <div className="card">
        <p className="ink2">The body-sensation exercises that raise the heart rate (stairs, spot-running, fast breathing) unlock after your doctor says yes once.</p>
        {d.profile.doctorOkBodyPractice ? (
          <>
            <p>Recorded on <b>{d.profile.doctorOkBodyPractice}</b>.</p>
            <button className="btn ghost" onClick={() => update((x) => { delete x.profile.doctorOkBodyPractice; })}>Remove</button>
          </>
        ) : (
          <button className="btn soft" onClick={() => update((x) => { x.profile.doctorOkBodyPractice = today(); })}>My doctor said yes (record today)</button>
        )}
      </div>

      <h2>Reminders</h2>
      <div className="card">
        <label className="check"><input type="checkbox" checked={d.settings.reminders.enabled} onChange={(e) => setRem('enabled', e.target.checked)} /><span>Daily gentle reminders</span></label>
        {([['checkin', 'Morning check-in'], ['breathe1', 'Breathe (1)'], ['breathe2', 'Breathe (2)'], ['worry', 'Worry time'], ['winddown', 'Wind down']] as const).map(([k, label]) => (
          <div className="row" key={k} style={{ marginTop: 8 }}>
            <span className="grow">{label}</span>
            <input type="time" style={{ width: 140 }} value={d.settings.reminders[k]} onChange={(e) => setRem(k, e.target.value)} />
          </div>
        ))}
        <button className="btn soft block" style={{ marginTop: 12 }} onClick={applyReminders}>Apply reminders</button>
      </div>

      <h2>Sound and look</h2>
      <div className="card">
        <label className="check"><input type="checkbox" checked={d.settings.voice} onChange={(e) => update((x) => { x.settings.voice = e.target.checked; })} /><span>Voice guidance (when the audio is installed)</span></label>
        <label className="check"><input type="checkbox" checked={d.settings.tone} onChange={(e) => update((x) => { x.settings.tone = e.target.checked; })} /><span>Soft breathing tone</span></label>
        <label className="check"><input type="checkbox" checked={d.game.sound} onChange={(e) => update((x) => { x.game.sound = e.target.checked; })} /><span>Little sounds for drops and treasures</span></label>
        <label className="check"><input type="checkbox" checked={sp.quiet} onChange={(e) => setSound({ quiet: e.target.checked })} /><span>Quiet mode (no music, nature sounds or effects; the voice stays)</span></label>
        <label className="check"><input type="checkbox" checked={sp.captions} onChange={(e) => setSound({ captions: e.target.checked })} /><span>Show captions when the voice speaks</span></label>
        <label className="check"><input type="checkbox" checked={sp.breatheMusic} onChange={(e) => setSound({ breatheMusic: e.target.checked })} /><span>Soft music during breathing practice</span></label>
        {([['music', 'Music'], ['ambience', 'Nature sounds'], ['effects', 'Effects'], ['voice', 'Voice']] as const).map(([k, label]) => (
          <div key={k} style={{ marginTop: 6 }}>
            <label className="f">{label}: {Math.round(sp[k] * 100)}%</label>
            <input type="range" min={0} max={1} step={0.05} value={sp[k]} disabled={sp.quiet && k !== 'voice'} onChange={(e) => setSound({ [k]: Number(e.target.value) })} />
          </div>
        ))}
        <p className="muted">Music rests during SURGE, the Listening Garden and active Body Lab rounds, so your attention stays on the practice.</p>
        <label className="f">Your island friend's name</label>
        <input type="text" value={d.game.mascotName} maxLength={20} onChange={(e) => update((x) => { x.game.mascotName = e.target.value; })} placeholder="Tulu" />
        <label className="f">Theme</label>
        <select value={d.settings.theme} onChange={(e) => update((x) => { x.settings.theme = e.target.value as any; })}>
          <option value="auto">Follow the device</option><option value="light">Light</option><option value="dark">Dark</option>
        </select>
      </div>

      <h2>Data and privacy</h2>
      <div className="card">
        <p className="ink2">Everything stays on this device. Nothing is sent anywhere. Make a backup now and then, so you can move it to a new phone.</p>
        {info && <p className="muted">Data folder: {info.dataDir}<br />Backup folder: {info.backupDir}<br />Version {info.version}</p>}
        <div className="grid2">
          <button className="btn soft" onClick={doBackup}>Back up now</button>
          <button className="btn soft" onClick={pickRestore}>Restore a backup</button>
        </div>
        {isDesk() && <button className="link" onClick={async () => { const p = await window.calmDesk!.chooseBackupDir(); if (p) { setInfo(await window.calmDesk!.info()); setMsg('Backup folder: ' + p); } }}>Change backup folder</button>}
        {pending && (
          <div className="card soft">
            <p>This backup comes from an older version that used a PIN. Type that PIN once to open it.</p>
            <input type="password" inputMode="numeric" value={restorePin} onChange={(e) => setRestorePin(e.target.value)} />
            <button className="btn block" style={{ marginTop: 8 }} onClick={() => void tryRestore(pending, restorePin)}>Open the backup</button>
          </div>
        )}
      </div>

      <div className="card soft">
        <h3>About</h3>
        <p className="muted">Calm Path supports recovery from health anxiety. It does not diagnose or treat. New, different or severe symptoms → your doctor or emergency services (India: 108). Low mood or thoughts of self-harm → your doctor or a helpline (India: Tele-MANAS 14416). Medicines are changed only by your doctor.</p>
      </div>
    </div>
  );
}
