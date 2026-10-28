import { useState } from 'react';
import { Back, Body, Chips, Scale, useNav } from '../components/ui';
import { PROGRAMME, sessionById } from '../content/programme';
import { FORMS } from '../content/forms';
import { MEASURES, scoreMeasure, triggersSafety } from '../content/measures';
import type { Field, Practice } from '../content/types';
import { useStore } from '../lib/store';
import { BUDGET_LEVELS, uid } from '../lib/model';
import { coreCount, doneCount, nextSession } from '../lib/progress';
import { crisisText } from '../lib/safety';
import { Breathe, Surge, Urge } from './Flows';
import { WorryTime } from './Logs';
import { LANDS } from '../game/rewards';
import { Tulu } from '../game/Mascot';
import { LessonArt } from '../game/LessonArt';
import { FearCycleGame, ForecastGame, LadderGame, LeavesGame, NotingGame, RecipeGame } from '../game/Games';
import { BodyLab, ListeningGarden, SwitchGame, TheoryGame } from '../game/Games2';

const PHASES = [
  { key: 'quickstart', title: 'Quick Start', sub: 'Week 1 · one a day' },
  { key: 'strengthen', title: 'Strengthen', sub: 'Weeks 2–10 · three a week' },
  { key: 'staywell', title: 'Stay Well', sub: 'Monthly' },
] as const;

export function PathList() {
  const { data } = useStore();
  const { go } = useNav();
  const { session: next, readyOn } = nextSession(data!);
  return (
    <div className="app">
      <h1>Your path</h1>
      <p className="muted">{doneCount(data!)} of {coreCount()} sessions done</p>
      <div className="bar"><i style={{ width: `${(doneCount(data!) / coreCount()) * 100}%` }} /></div>
      {PHASES.map((ph) => (
        <div key={ph.key}>
          <h2>{ph.title} <span className="muted">· {ph.sub}</span></h2>
          {PROGRAMME.filter((s) => s.phase === ph.key).map((s) => {
            const done = !!data!.sessions[s.id];
            const isNext = next?.id === s.id;
            const open = done || (isNext && !readyOn);
            return (
              <button key={s.id} className="tile" style={{ width: '100%', margin: '6px 0', opacity: open || isNext ? 1 : 0.55 }}
                disabled={!open} onClick={() => go({ name: 'session', id: s.id })}>
                <div className="row spread">
                  <b>{s.id.startsWith('S') && s.phase === 'strengthen' ? `Week ${s.week} · ` : ''}{s.title}</b>
                  {done ? <span className="pill done">done</span> : isNext ? <span className="pill">{readyOn ? `from ${readyOn}` : 'next'}</span> : null}
                </div>
                <span>{s.minutes} min</span>
              </button>
            );
          })}
        </div>
      ))}
      <p className="muted">Finished sessions stay open to reread.</p>
    </div>
  );
}

const GAME_LABEL: Record<string, string> = {
  fearCycle: '🌀 Build your fear loop, then break it', leaves: '🍃 Leaves on the river', forecast: '⛈️→☀️ The anxiety forecaster',
  ladder: '🪜 Climb your ladder', noting: '🔍 Get curious about the feeling', recipe: '🌱 Make a little-habit recipe',
  bodyLab: '🧪 The Body Lab', listening: '🎧 The Listening Garden', theory: '⚖️ Which story fits?', switch: '🔌 The fight switch',
};

function practiceLabel(p: Practice): string {
  switch (p.type) {
    case 'breathe': return `Breathe for ${p.minutes} minutes`;
    case 'surge-practice': return 'Rehearse the SURGE steps';
    case 'urge': return `Urge timer (${p.minutes} min). Use it when the next urge comes, or now as practice.`;
    case 'form': return FORMS[p.formId].title;
    case 'measure': return MEASURES[p.measureId].name;
    case 'budget': return 'Set your checking budget';
    case 'worry-time': return 'Open worry time';
    case 'game': return GAME_LABEL[p.game];
    default: return '';
  }
}

export function SessionView({ id }: { id: string }) {
  const s = sessionById(id)!;
  const { data, update } = useStore();
  const { back, toast } = useNav();
  const [page, setPage] = useState(0);
  const [doneP, setDoneP] = useState<Record<number, boolean>>({});
  const [active, setActive] = useState<number | null>(null);
  const [reflection, setReflection] = useState(data!.sessions[id]?.reflection ?? '');
  const gated = s.needsDoctorOk && !data!.profile.doctorOkBodyPractice;
  const practice = gated && s.gentleAlternative ? s.gentleAlternative : s.practice;
  const onCards = page < s.cards.length;

  if (active !== null) {
    const p = practice[active];
    const fin = () => { setDoneP({ ...doneP, [active]: true }); setActive(null); };
    if (p.type === 'breathe') return <Breathe minutes={p.minutes} onFinished={fin} />;
    if (p.type === 'surge-practice') return <Surge practice onFinished={fin} />;
    if (p.type === 'urge') return <Urge minutes={p.minutes} onFinished={fin} />;
    if (p.type === 'form') return <FormView formId={p.formId} gentleOnly={gated} onFinished={fin} />;
    if (p.type === 'measure') return <MeasureView id={p.measureId} onFinished={fin} />;
    if (p.type === 'budget') return <BudgetView week={s.week} onFinished={fin} />;
    if (p.type === 'worry-time') return <WorryTime onFinished={fin} />;
    if (p.type === 'game') {
      const G = { fearCycle: FearCycleGame, leaves: LeavesGame, forecast: ForecastGame, ladder: LadderGame, noting: NotingGame, recipe: RecipeGame, bodyLab: BodyLab, listening: ListeningGarden, theory: TheoryGame, switch: SwitchGame }[p.game];
      return <G onFinished={fin} />;
    }
  }

  const complete = () => {
    update((d) => { d.sessions[id] = { doneAt: new Date().toISOString(), reflection }; });
    if (crisisText(reflection)) { update((d) => d.safetyEvents.push({ at: new Date().toISOString(), source: 'reflection' })); }
    toast('Stepping stone lit! The path goes on.');
    back();
  };

  return (
    <div className="app">
      <Back />
      <div className="land-banner" style={{ background: `linear-gradient(135deg, ${LANDS[s.week].sky[0]}, ${LANDS[s.week].sky[1]})` }}>
        <span className="land-icon big">{LANDS[s.week].icon}</span>
        <div className="grow">
          <small>{LANDS[s.week].name} · {s.phase === 'quickstart' ? 'Quick Start' : s.phase === 'staywell' ? 'Stay Well' : `week ${s.week}`} · {s.minutes} min</small>
          <h1 style={{ margin: '2px 0 0' }}>{s.title}</h1>
        </div>
      </div>
      {onCards && <div className="pager-dots" aria-hidden>{s.cards.map((_, k) => <i key={k} className={k <= page ? 'on' : ''} />)}<i className="flag">🏁</i></div>}
      {onCards ? (
        <>
          <div className="card lesson" key={page}>
            {s.cards[page].art && <LessonArt id={s.cards[page].art!} />}
            {s.cards[page].title && <h3>{s.cards[page].title}</h3>}
            <Body lines={s.cards[page].body} />
          </div>
          <div className="row spread">
            <button className="btn ghost" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</button>
            <span className="muted">{page + 1} / {s.cards.length}</span>
            <button className="btn" onClick={() => setPage(page + 1)}>{page === s.cards.length - 1 ? 'To practice' : 'Next'}</button>
          </div>
        </>
      ) : (
        <>
          <div className="tulu-says"><Tulu size={70} mood="excited" /><p>Now let's practise! Each one helps our island grow.</p></div>
          {gated && <div className="banner">The heart-raising exercises unlock once your cardiologist has said yes (Settings → Doctor said yes). For now, use the gentle exercises. They work too.</div>}
          {practice.map((p, i) => (
            <button key={i} className="tile" style={{ width: '100%', margin: '6px 0' }} onClick={() => setActive(i)}>
              <div className="row spread"><b>{practiceLabel(p)}</b>{doneP[i] && <span className="pill done">done</span>}</div>
              <span>Tap to start</span>
            </button>
          ))}
          {s.reflection && (
            <div className="card">
              <label className="f">{s.reflection}</label>
              <textarea value={reflection} onChange={(e) => setReflection(e.target.value)} placeholder="A few words are enough" />
            </div>
          )}
          <div className="row">
            <button className="btn ghost" onClick={() => setPage(s.cards.length - 1)}>Reread</button>
            <button className="btn grow" onClick={complete}>{data!.sessions[id] ? 'Save' : 'Light the stepping stone · +5 💧'}</button>
          </div>
        </>
      )}
    </div>
  );
}

function FieldInput({ f, value, onChange, gentleOnly }: { f: Field; value: any; onChange: (v: any) => void; gentleOnly?: boolean }) {
  switch (f.type) {
    case 'text': return <input type="text" value={value ?? ''} placeholder={f.placeholder} onChange={(e) => onChange(e.target.value)} />;
    case 'textarea': return <textarea value={value ?? ''} placeholder={f.placeholder} onChange={(e) => onChange(e.target.value)} />;
    case 'number': return <input type="number" inputMode="numeric" value={value ?? ''} onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))} />;
    case 'scale10': return <Scale value={value ?? 5} onChange={onChange} />;
    case 'scale100': return <Scale value={value ?? 50} onChange={onChange} max={100} step={5} />;
    case 'choice': {
      const opts = gentleOnly ? f.options!.filter((o) => o.includes('(gentle)')) : f.options!;
      return <Chips options={opts} value={value ? [value] : []} onChange={(v) => onChange(v[0])} />;
    }
    case 'multi': return <Chips multi options={f.options!} value={value ?? []} onChange={onChange} />;
    case 'checklist': {
      const v: string[] = value ?? [];
      return (
        <div>
          {f.options!.map((o) => (
            <label key={o} className="check">
              <input type="checkbox" checked={v.includes(o)} onChange={(e) => onChange(e.target.checked ? [...v, o] : v.filter((x) => x !== o))} />
              <span>{o}</span>
            </label>
          ))}
          <p className="muted">{v.length} of {f.options!.length} done</p>
        </div>
      );
    }
    case 'rated-list': {
      const rows: { text: string; rating: number }[] = value ?? [];
      const set = (i: number, patch: Partial<{ text: string; rating: number }>) => onChange(rows.map((r, j) => (j === i ? { ...r, ...patch } : r)));
      return (
        <div>
          {rows.map((r, i) => (
            <div key={i} className="card soft" style={{ margin: '8px 0', padding: 12 }}>
              <input type="text" value={r.text} onChange={(e) => set(i, { text: e.target.value })} placeholder="Describe it" />
              <Scale value={r.rating} onChange={(n) => set(i, { rating: n })} max={100} step={5} low="easy" high="very hard" />
              <button className="link" onClick={() => onChange(rows.filter((_, j) => j !== i))}>Remove</button>
            </div>
          ))}
          <button className="btn soft" onClick={() => onChange([...rows, { text: '', rating: 50 }])}>+ Add one</button>
          {rows.length > 1 && <button className="link" style={{ marginLeft: 12 }} onClick={() => onChange([...rows].sort((a, b) => a.rating - b.rating))}>Sort easiest first</button>}
        </div>
      );
    }
  }
}

export function FormView({ formId, entryId, gentleOnly, onFinished }: { formId: string; entryId?: string; gentleOnly?: boolean; onFinished?: () => void }) {
  const def = FORMS[formId];
  const { data, update } = useStore();
  const { back, go, toast } = useNav();
  const existing = def.kind === 'persistent' ? data!.persistent[formId]
    : entryId ? data!.entries[formId]?.find((e) => e.id === entryId)?.values : undefined;
  const [values, setValues] = useState<Record<string, any>>(existing ?? {});
  const save = () => {
    update((d) => {
      if (def.kind === 'persistent') d.persistent[formId] = values;
      else {
        d.entries[formId] ??= [];
        const e = entryId && d.entries[formId].find((x) => x.id === entryId);
        if (e) e.values = values; else d.entries[formId].push({ id: uid(), at: new Date().toISOString(), values });
      }
    });
    const text = Object.values(values).filter((v) => typeof v === 'string').join(' ');
    toast('Saved.');
    if (crisisText(text)) {
      update((d) => d.safetyEvents.push({ at: new Date().toISOString(), source: formId }));
      go({ name: 'safety', crisis: true });
      return;
    }
    onFinished ? onFinished() : back();
  };
  return (
    <div className="app">
      <Back onClick={onFinished} />
      <h1>{def.title}</h1>
      {def.intro && <p className="ink2">{def.intro}</p>}
      {gentleOnly && formId === 'bodyPractice' && <div className="banner">Showing the gentle exercises only, until your doctor's OK is recorded in Settings.</div>}
      <div className="card">
        {def.fields.map((f) => (
          <div key={f.id}>
            <label className="f">{f.label}{f.optional && <span className="muted"> (optional)</span>}</label>
            {f.help && <p className="help">{f.help}</p>}
            <FieldInput f={f} value={values[f.id]} gentleOnly={gentleOnly} onChange={(v) => setValues((prev) => ({ ...prev, [f.id]: v }))} />
          </div>
        ))}
      </div>
      <button className="btn block" onClick={save}>Save</button>
      {def.kind === 'repeatable' && (data!.entries[formId]?.length ?? 0) > 0 && (
        <button className="link" onClick={() => go({ name: 'logs', formId })}>See earlier entries ({data!.entries[formId].length})</button>
      )}
    </div>
  );
}

export function LogsView({ formId }: { formId: string }) {
  const def = FORMS[formId];
  const { data } = useStore();
  const { go } = useNav();
  const list = [...(data!.entries[formId] ?? [])].reverse();
  return (
    <div className="app">
      <Back />
      <h1>{def.title}: entries</h1>
      {list.length === 0 && <p className="muted">Nothing yet.</p>}
      {list.map((e) => (
        <button key={e.id} className="tile" style={{ width: '100%', margin: '6px 0' }} onClick={() => go({ name: 'form', formId, entryId: e.id })}>
          <b>{String(e.values[def.fields[0].id] ?? '(untitled)').slice(0, 80)}</b>
          <span>{new Date(e.at).toLocaleDateString()}</span>
        </button>
      ))}
      <button className="btn block" onClick={() => go({ name: 'form', formId })}>+ New entry</button>
    </div>
  );
}

export function MeasureView({ id, onFinished }: { id: string; onFinished?: () => void }) {
  const m = MEASURES[id];
  const { update } = useStore();
  const { back, go } = useNav();
  const [answers, setAnswers] = useState<number[]>(Array(m.items.length).fill(-1));
  const [result, setResult] = useState<number | null>(null);
  const complete = answers.every((a) => a >= 0);
  const save = () => {
    const total = scoreMeasure(answers);
    update((d) => d.measures.push({ id: uid(), kind: m.id, at: new Date().toISOString(), answers, total }));
    if (triggersSafety(m.id, answers)) {
      update((d) => d.safetyEvents.push({ at: new Date().toISOString(), source: m.id + ' item 9' }));
      go({ name: 'safety', crisis: true });
      return;
    }
    setResult(total);
  };
  if (result !== null) {
    return (
      <div className="app">
        <h1>{m.name}</h1>
        <div className="card">
          <p>Your score: <b>{result}</b> of {m.max} ({m.band(result)}).</p>
          <p className="muted">One score is a snapshot. The trend over weeks is what matters. You can see it in Progress.</p>
        </div>
        <button className="btn block" onClick={() => (onFinished ? onFinished() : back())}>Done</button>
      </div>
    );
  }
  return (
    <div className="app">
      <Back onClick={onFinished} />
      <h1>{m.name}</h1>
      <p className="ink2">{m.stem}</p>
      {m.items.map((it, i) => (
        <div className="card" key={i}>
          <p><b>{i + 1}.</b> {it}</p>
          <Chips options={m.options} value={answers[i] >= 0 ? [m.options[answers[i]]] : []}
            onChange={(v) => setAnswers((prev) => prev.map((a, j) => (j === i ? m.options.indexOf(v[0]) : a)))} />
        </div>
      ))}
      <button className="btn block" disabled={!complete} onClick={save}>{complete ? 'See my score' : `Answer all ${m.items.length} to finish`}</button>
    </div>
  );
}

export function BudgetView({ week = 2, onFinished }: { week?: number; onFinished?: () => void }) {
  const { data, update } = useStore();
  const { back, toast } = useNav();
  const suggested = week <= 2 ? 1 : week <= 4 ? 2 : week <= 6 ? 3 : 4;
  const [level, setLevel] = useState<number>(data!.settings.budgetLevel || suggested);
  const save = () => {
    update((d) => { d.settings.budgetLevel = level as 1 | 2 | 3 | 4; });
    toast('Checking budget set.');
    onFinished ? onFinished() : back();
  };
  return (
    <div className="app">
      <Back onClick={onFinished} />
      <h1>Checking budget</h1>
      <p className="ink2">"Health data" means heart rate, ECG, blood oxygen, or any health reading on the watch or phone. Suggested for this stage: <b>level {suggested}</b>. You may go slower, but try not to go back up.</p>
      {[1, 2, 3, 4].map((l) => (
        <button key={l} className={'tile'} style={{ width: '100%', margin: '6px 0', borderColor: level === l ? 'var(--leaf)' : undefined, borderWidth: level === l ? 2 : 1 }} onClick={() => setLevel(l)}>
          <b>{BUDGET_LEVELS[l]}</b>{l === suggested && <span>suggested now</span>}
        </button>
      ))}
      <button className="btn block" onClick={save}>Save budget</button>
    </div>
  );
}
