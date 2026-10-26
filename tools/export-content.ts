// Writes the whole programme as one readable document: docs/PROGRAMME.md (override: CALMPATH_CONTENT_OUT)
import fs from 'node:fs';
import path from 'node:path';
import { PROGRAMME } from '../src/content/programme';
import { FORMS } from '../src/content/forms';
import { MEASURES } from '../src/content/measures';

const out = process.env.CALMPATH_CONTENT_OUT || 'docs/PROGRAMME.md';
const L: string[] = [];
L.push('# Calm Path: the full programme', '');
L.push(`Generated from the app's source (\`src/content/\`). This is exactly what the app shows.`, '');
L.push(`**${PROGRAMME.length} sessions:** Quick Start (week 1, daily) · Strengthen (weeks 2–10, three a week) · Stay Well (monthly).`, '');

let phase = '';
for (const s of PROGRAMME) {
  const ph = s.phase === 'quickstart' ? 'QUICK START · week 1' : s.phase === 'staywell' ? 'STAY WELL · monthly' : `STRENGTHEN · week ${s.week}`;
  if (ph !== phase) { L.push(`## ${ph}`, ''); phase = ph; }
  L.push(`### ${s.id} — ${s.title} (${s.minutes} min)${s.needsDoctorOk ? ' · needs the doctor\'s OK for heart-raising exercises' : ''}`, '');
  for (const c of s.cards) {
    if (c.title) L.push(`**${c.title}**`, '');
    for (const b of c.body) L.push(b.startsWith('- ') ? b : b, b.startsWith('- ') ? '' : '');
    L.push('');
  }
  const pr = s.practice.map((p) => p.type === 'form' ? `form: ${FORMS[p.formId].title}` : p.type === 'measure' ? `questionnaire: ${MEASURES[p.measureId].name}` : p.type === 'breathe' || p.type === 'urge' ? `${p.type} ${p.minutes} min` : p.type);
  L.push(`*Practice:* ${pr.join(' · ')}`, '');
  if (s.reflection) L.push(`*Reflection:* ${s.reflection}`, '');
}

L.push('## Forms (living pages and logs)', '');
for (const f of Object.values(FORMS)) {
  L.push(`### ${f.title} (${f.kind})`, '');
  if (f.intro) L.push(f.intro, '');
  for (const fl of f.fields) L.push(`- ${fl.label}${fl.options ? ` — ${fl.options.join(' / ')}` : ''}`);
  L.push('');
}
L.push('## Questionnaires', '');
for (const m of Object.values(MEASURES)) L.push(`- **${m.name}**: ${m.items.length} items, every ${m.everyDays} days, max ${m.max}`);

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, L.join('\n'));
console.log('written', out);
