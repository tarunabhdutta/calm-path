import manifest from './content/soundManifest.json';
import type { Route } from './components/ui';
import { sceneFor } from './lib/scenes';
import { hasSound } from './lib/sound';
// In-app self-test, run by the packaged PC app with --self-test (law E-03) and by the unit tests.
import { PROGRAMME } from './content/programme';
import { FORMS } from './content/forms';
import { MEASURES, scoreMeasure, triggersSafety } from './content/measures';
import { NIGHT_GUIDE, SURGE, SURGE_REPEAT, URGE_PROMPTS, WIND_DOWN_TEXT } from './content/scripts';
import { deriveKey, newSalt, open, seal } from './lib/crypto';
import { crisisText } from './lib/safety';
import { newData } from './lib/model';
import { nextSession } from './lib/progress';
import { drops, TREASURES } from './game/rewards';

export interface Check { name: string; ok: boolean; detail?: string }

const HR_NUMBER = /\b(1[0-9]{2}|[6-9][0-9])\s*(bpm|beats)/i;
const REASSURE = /(you('| a)re (fine|safe|ok|okay)|nothing is wrong|your heart is (fine|healthy|ok|strong)|harmless|can'?t hurt you|cannot hurt you|not dangerous|no danger|perfectly safe)/i;
const BREATH_CONTROL = /(calm(s|ing)? (your|the) heart|slow(s|ing)? (down )?(your|the) heart|lower(s|ing)? (your|the) heart|breath(e|ing)? (it )?away)/i;

export function contentChecks(): Check[] {
  const out: Check[] = [];
  const ids = PROGRAMME.map((s) => s.id);
  out.push({ name: 'session ids unique', ok: new Set(ids).size === ids.length });
  out.push({ name: 'programme has 35 sessions', ok: PROGRAMME.length === 35, detail: String(PROGRAMME.length) });
  const missing: string[] = [];
  for (const s of PROGRAMME) {
    for (const p of [...s.practice, ...(s.gentleAlternative ?? [])]) {
      if (p.type === 'form' && !FORMS[p.formId]) missing.push(`${s.id}:${p.formId}`);
      if (p.type === 'measure' && !MEASURES[p.measureId]) missing.push(`${s.id}:${p.measureId}`);
    }
  }
  out.push({ name: 'every practice points at a real form/measure', ok: missing.length === 0, detail: missing.join(', ') });
  const allText = [
    ...PROGRAMME.flatMap((s) => s.cards.flatMap((c) => [c.title ?? '', ...c.body])),
    ...SURGE.map((l) => l.text), ...SURGE_REPEAT.map((l) => l.text), ...URGE_PROMPTS.map((p) => p.text), ...WIND_DOWN_TEXT, ...NIGHT_GUIDE,
  ].join('\n');
  out.push({ name: 'no heart-rate numbers in content', ok: !HR_NUMBER.test(allText) });
  out.push({ name: 'no reassurance phrases in content', ok: !REASSURE.test(allText), detail: allText.match(REASSURE)?.[0] });
  out.push({ name: 'breathing never framed as calming the heart', ok: !BREATH_CONTROL.test(allText), detail: allText.match(BREATH_CONTROL)?.[0] });
  out.push({ name: 'every lesson card has an animated illustration', ok: PROGRAMME.every((s) => s.cards.every((c) => !!c.art)) });
  out.push({ name: 'noticing an urge earns drops even if she checked', ok: (() => { const n = newData(); n.urges.push({ id: 'n', at: new Date().toISOString(), kind: 'ECG', start: 5, end: 5, minutes: 1, outcome: 'checked' }); return drops(n) > 0; })() });
  out.push({ name: 'Anxiety check has 7 items', ok: MEASURES.GAD7.items.length === 7 });
  out.push({ name: 'Mood check has 9 items', ok: MEASURES.PHQ9.items.length === 9 });
  out.push({ name: 'Health worry check has 7 items', ok: MEASURES.HW7.items.length === 7 });
  out.push({ name: 'scoring sums answers', ok: scoreMeasure([1, 2, 3, 0, 1, 2, 3]) === 12 });
  out.push({ name: 'Mood check item 9 > 0 triggers safety', ok: triggersSafety('PHQ9', [0, 0, 0, 0, 0, 0, 0, 0, 1]) && !triggersSafety('PHQ9', [3, 3, 3, 3, 3, 3, 3, 3, 0]) });
  out.push({ name: 'crisis words detected', ok: crisisText('sometimes I want to die') && crisisText('thinking of self-harm') && !crisisText('my heart was racing again') });
  const d = newData();
  out.push({ name: 'first session is QS1', ok: nextSession(d).session?.id === 'QS1' });
  d.sessions.QS1 = { doneAt: new Date().toISOString() };
  out.push({ name: 'Quick Start waits a day', ok: nextSession(d).readyOn !== null });
  // Tulu's Island: the play must never reward anxiety-feeding behaviour or punish high scores.
  const a = newData(), b = newData();
  a.measures.push({ id: 'x', kind: 'GAD7', at: new Date().toISOString(), answers: [0, 0, 0, 0, 0, 0, 0], total: 0 });
  b.measures.push({ id: 'y', kind: 'GAD7', at: new Date().toISOString(), answers: [3, 3, 3, 3, 3, 3, 3], total: 21 });
  out.push({ name: 'island: a high score earns the same as a low one', ok: drops(a) === drops(b) });
  const c = newData();
  c.counts['2026-10-26'] = { checks: 9, ecg: 4, reassurance: 6, google: 3 };
  out.push({ name: 'island: checking earns nothing', ok: drops(c) === 0 });
  const e = newData();
  e.urges.push({ id: 's', at: new Date().toISOString(), kind: 'ECG', start: 8, end: 3, minutes: 3, outcome: 'surfed' });
  e.urges.push({ id: 'c', at: new Date().toISOString(), kind: 'ECG', start: 8, end: 7, minutes: 3, outcome: 'checked' });
  out.push({ name: 'island: surfing earns more than checking anyway', ok: drops(e) === 4 });
  out.push({ name: 'island: no treasure rewards having more waves', ok: !TREASURES.some((t) => /waves? (ridden|logged) \d|\d+ (waves|surges)/i.test(t.how)) });
  return out;
}

export async function cryptoCheck(): Promise<Check[]> {
  const salt = newSalt();
  const key = await deriveKey('2468', salt);
  const v = await seal({ hello: 'Tulu', n: 3 }, key, salt);
  const ok = (await open<{ hello: string }>(v, '2468')).data.hello === 'Tulu';
  let wrongFails = false;
  try { await open(v, '1111'); } catch { wrongFails = true; }
  return [
    { name: 'old PIN vaults can still be opened (one-time move)', ok },
    { name: 'wrong PIN cannot open the vault', ok: wrongFails },
    { name: 'vault holds no plain text', ok: !JSON.stringify(v).includes('Tulu') },
  ];
}

/** The sound world: every sound a screen asks for exists, the quiet places stay quiet, and the files play. */
export async function soundChecks(): Promise<Check[]> {
  const d = newData({ name: 'Test' });
  const routes: Route[] = [{ name: 'home' }, { name: 'path' }, { name: 'surge' }, { name: 'urge' }, { name: 'breathe' }, { name: 'winddown' },
    { name: 'checkin' }, { name: 'worry' }, { name: 'family' }, { name: 'safety' }, { name: 'hospital' }, { name: 'game', id: 'listening' }, { name: 'game', id: 'bodyLab' }];
  const missing = routes.flatMap((r) => sceneFor(r, d)).filter((id): id is string => !!id && !hasSound(id));
  const quiet = (r: Route) => sceneFor(r, d)[0] === null;
  const out: Check[] = [
    { name: 'every scene sound is bundled', ok: missing.length === 0, detail: missing.join(', ') },
    { name: 'SURGE has no music (ambience only)', ok: quiet({ name: 'surge' }) },
    { name: 'silence zones have no music', ok: quiet({ name: 'safety' }) && quiet({ name: 'hospital' }) && sceneFor({ name: 'game', id: 'listening' }, d).every((x) => x === null) },
    { name: 'all 71 sound files listed', ok: ['M', 'A', 'L', 'F', 'S'].every((k) => Object.keys(manifest).some((id) => id.startsWith(k))) && Object.keys(manifest).length === 71, detail: String(Object.keys(manifest).length) },
  ];
  out.push({ name: 'this device can play the sound files (AAC)', ok: !!new Audio().canPlayType('audio/mp4; codecs="mp4a.40.2"') });
  try {
    const r = await fetch('./sound/F-01.m4a');
    const buf = await new AudioContext().decodeAudioData(await r.arrayBuffer());
    out.push({ name: 'a bundled sound decodes', ok: buf.duration > 0, detail: buf.duration.toFixed(2) + ' s' });
  } catch (e) { out.push({ name: 'a bundled sound decodes', ok: false, detail: String(e) }); }
  return out;
}

export async function runSelfTest(): Promise<{ pass: boolean; checks: Check[] }> {
  const checks = [...contentChecks(), ...(await cryptoCheck()), ...(await soundChecks())];
  if (window.calmDesk) {
    try {
      await window.calmDesk.writeVault('{"selftest":1}');
      const back = await window.calmDesk.readVault();
      checks.push({ name: 'data folder write/read', ok: back === '{"selftest":1}' });
      const info = await window.calmDesk.info();
      checks.push({ name: 'data folder is outside the install folder', ok: !/Programs\\calm/i.test(info.dataDir), detail: info.dataDir });
    } catch (e) {
      checks.push({ name: 'data folder write/read', ok: false, detail: String(e) });
    }
  }
  return { pass: checks.every((c) => c.ok), checks };
}
