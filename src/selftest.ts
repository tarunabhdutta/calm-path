// In-app self-test, run by the packaged PC app with --self-test (law E-03) and by the unit tests.
import { PROGRAMME } from './content/programme';
import { FORMS } from './content/forms';
import { MEASURES, scoreMeasure, triggersSafety } from './content/measures';
import { SURGE } from './content/scripts';
import { deriveKey, newSalt, open, seal } from './lib/crypto';
import { crisisText } from './lib/safety';
import { newData } from './lib/model';
import { nextSession } from './lib/progress';
import { drops, TREASURES } from './game/rewards';

export interface Check { name: string; ok: boolean; detail?: string }

const HR_NUMBER = /\b(1[0-9]{2}|[6-9][0-9])\s*(bpm|beats)/i;
const REASSURE = /(you('| a)re (fine|safe|ok|okay)|nothing is wrong|your heart is (fine|healthy|ok))/i;

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
    ...SURGE.map((l) => l.text),
  ].join('\n');
  out.push({ name: 'no heart-rate numbers in content', ok: !HR_NUMBER.test(allText) });
  out.push({ name: 'no reassurance phrases in content', ok: !REASSURE.test(allText), detail: allText.match(REASSURE)?.[0] });
  out.push({ name: 'GAD-7 has 7 items', ok: MEASURES.GAD7.items.length === 7 });
  out.push({ name: 'PHQ-9 has 9 items', ok: MEASURES.PHQ9.items.length === 9 });
  out.push({ name: 'WI-7 has 7 items', ok: MEASURES.WI7.items.length === 7 });
  out.push({ name: 'scoring sums answers', ok: scoreMeasure([1, 2, 3, 0, 1, 2, 3]) === 12 });
  out.push({ name: 'PHQ-9 item 9 > 0 triggers safety', ok: triggersSafety('PHQ9', [0, 0, 0, 0, 0, 0, 0, 0, 1]) && !triggersSafety('PHQ9', [3, 3, 3, 3, 3, 3, 3, 3, 0]) });
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

export async function runSelfTest(): Promise<{ pass: boolean; checks: Check[] }> {
  const checks = [...contentChecks(), ...(await cryptoCheck())];
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
