import { useState } from 'react';
import { useNav } from '../components/ui';
import { useStore } from '../lib/store';
import { BUDGET_LEVELS, today } from '../lib/model';
import { measuresDue, nextSession, localDate } from '../lib/progress';
import { MEASURES } from '../content/measures';
import { FORMS } from '../content/forms';
import { Counters, UndoCounter } from './Logs';
import { Island } from '../game/Island';
import { TULU_LINES } from '../game/Mascot';
import { drops, gardenDays, LANDS, level, LEVELS, nextLevelProgress, quests } from '../game/rewards';

function Ring({ p, done, icon }: { p: number; done: boolean; icon: string }) {
  const r = 22, c = 2 * Math.PI * r;
  return (
    <div className={'ring' + (done ? ' done' : '')}>
      <svg viewBox="0 0 56 56" aria-hidden>
        <circle cx="28" cy="28" r={r} fill="none" stroke="var(--surface-2)" strokeWidth="6" />
        <circle cx="28" cy="28" r={r} fill="none" stroke="var(--leaf)" strokeWidth="6" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - p)} transform="rotate(-90 28 28)" style={{ transition: 'stroke-dashoffset .8s' }} />
      </svg>
      <span>{done ? '✓' : icon}</span>
    </div>
  );
}

export function Home() {
  const { data } = useStore();
  const { go } = useNav();
  const d = data!;
  const [line, setLine] = useState<string | null>(null);
  const [hop, setHop] = useState(false);
  const { session, readyOn } = nextSession(d);
  const t = today();
  const due = measuresDue(d).filter((m) => m !== 'PHQ9' || d.measures.length > 0);
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const parked = d.worries.filter((w) => w.status === 'parked').length;
  const recentCrisis = d.safetyEvents.some((e) => Date.now() - Date.parse(e.at) < 7 * 86_400_000);
  const lvl = level(d);
  const nxt = nextLevelProgress(d);
  const stepToday = Object.values(d.sessions).some((s) => localDate(s.doneAt) === t) || Object.values(d.entries).flat().some((e) => localDate(e.at) === t);
  const q = quests(d, t, stepToday);
  const name = d.game.mascotName || 'Tulu';
  const land = session ? LANDS[session.week] : LANDS[11];

  const tapTulu = () => {
    setLine(TULU_LINES[Math.floor(Math.random() * TULU_LINES.length)]);
    setHop(true);
    window.setTimeout(() => setHop(false), 700);
  };

  return (
    <div className="app">
      <div className="row spread" style={{ alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ marginBottom: 0 }}>{greet}, {d.profile.name}</h1>
          <p className="muted" style={{ margin: 0 }}>{name} is waiting on your island</p>
        </div>
        <div className="pills">
          <span className="stat-pill" title="Drops: earned by practising">💧 {drops(d)}</span>
          <span className="stat-pill" title="Days you practised. It only ever goes up.">🌿 {gardenDays(d)}</span>
        </div>
      </div>

      {recentCrisis && (
        <button className="banner" style={{ border: 0, width: '100%', textAlign: 'left' }} onClick={() => go({ name: 'safety', crisis: true })}>
          You mentioned a hard thought recently. Please talk to your doctor or call Tele-MANAS <b>14416</b> (free, 24×7). Tap for help.
        </button>
      )}

      <div className="island-card">
        <Island level={lvl} hop={hop} onTulu={tapTulu} />
        {line && <div className="bubble" onClick={() => setLine(null)}>{line}</div>}
        <div className="island-foot">
          <span><b>{LEVELS[lvl].name}</b>{lvl < LEVELS.length - 1 ? ` · ${nxt.need - nxt.have} drops to “${LEVELS[lvl + 1].name}”` : ' · the island is complete'}</span>
          <div className="bar thin"><i style={{ width: `${nxt.pct}%` }} /></div>
        </div>
      </div>

      <button className="surge" onClick={() => go({ name: 'surge' })} aria-label="SURGE: guided help for a wave of anxiety">
        <svg className="surge-waves" viewBox="0 0 400 60" preserveAspectRatio="none" aria-hidden>
          <path className="wave w1" d="M0 30 Q50 18 100 30 T200 30 T300 30 T400 30 T500 30 T600 30 T700 30 T800 30 V60 H0Z" fill="rgba(255,255,255,.18)" />
          <path className="wave w2" d="M0 38 Q50 28 100 38 T200 38 T300 38 T400 38 T500 38 T600 38 T700 38 T800 38 V60 H0Z" fill="rgba(255,255,255,.14)" />
        </svg>
        <b>SURGE</b><span>Riding a wave? Let's float through it together.</span>
      </button>

      <h2>Today's little quests</h2>
      <div className="quests">
        <button className="quest" onClick={() => go({ name: 'breathe' })}><Ring p={q[0].progress} done={q[0].done} icon="🪷" /><span>{q[0].label}</span></button>
        <button className="quest" onClick={() => go({ name: 'checkin' })}><Ring p={q[1].progress} done={q[1].done} icon="⛅" /><span>{q[1].label}</span></button>
        <button className="quest" onClick={() => go(session && !readyOn ? { name: 'session', id: session.id } : { name: 'tools' })}><Ring p={q[2].progress} done={q[2].done} icon="🧭" /><span>{q[2].label}</span></button>
      </div>

      {session && (
        <button className="land-card" style={{ background: `linear-gradient(135deg, ${land.sky[0]}, ${land.sky[1]})` }}
          disabled={!!readyOn} onClick={() => go({ name: 'session', id: session.id })}>
          <span className="land-icon">{land.icon}</span>
          <span className="grow">
            <small>{session.phase === 'staywell' ? 'Home Shore' : `${land.name} · ${session.id}`}</small>
            <b>{session.phase === 'staywell' ? 'Monthly visit' : session.title}</b>
            <span className="muted">{readyOn ? `The next stone appears on ${readyOn}. Practise with the toolbox meanwhile.` : `${session.minutes} minutes · +5 💧`}</span>
          </span>
          {!readyOn && <span className="go-arrow">›</span>}
        </button>
      )}

      <div className="grid2" style={{ marginTop: 12 }}>
        <button className="tile play" onClick={() => go({ name: 'urge' })}><i>🏄‍♀️</i><b>Surf an urge</b><span>Instead of checking</span></button>
        <button className="tile play" onClick={() => go({ name: 'breathe' })}><i>🪷</i><b>Calm-time breathing</b><span>Daily training, not for waves</span></button>
        <button className="tile play" onClick={() => go({ name: 'checkin' })}><i>⛅</i><b>Inner weather</b><span>30-second check-in</span></button>
        <button className="tile play" onClick={() => go({ name: 'worry' })}><i>🛶</i><b>Worry river</b><span>{parked ? `${parked} boat${parked > 1 ? 's' : ''} waiting` : 'Fold a worry into a boat'}</span></button>
      </div>

      {due.map((m) => (
        <button key={m} className="tile play" style={{ width: '100%', marginTop: 10 }} onClick={() => go({ name: 'measure', id: m })}>
          <i>🧭</i><b>Compass check: {MEASURES[m].short.toLowerCase()}</b><span>2 minutes · +2 💧 · it shows how far you've come</span>
        </button>
      ))}

      <div className="card soft rule-card">
        <div className="row spread"><h3 style={{ margin: 0 }}>🦋 Today's checking rule</h3>
          <button className="link" onClick={() => go({ name: 'budget' })}>change</button></div>
        <p className="ink2" style={{ margin: '6px 0 0' }}>{d.settings.budgetLevel ? BUDGET_LEVELS[d.settings.budgetLevel] : 'Week 1: just count. No rule yet.'}</p>
      </div>

      <h2>Pebble count</h2>
      <p className="muted">Drop a pebble each time it happens. Noticing is half the work.</p>
      <Counters />
      <UndoCounter />

      <div className="row wrap" style={{ marginTop: 18 }}>
        <button className="btn ghost" onClick={() => go({ name: 'winddown' })}>🌙 Wind down</button>
        <button className="btn ghost" onClick={() => go({ name: 'safety' })}>Safety card</button>
        <button className="btn ghost" onClick={() => go({ name: 'hospital' })}>🏥 Urge to go to hospital?</button>
      </div>
    </div>
  );
}

const TOOL_FORMS: [string, string][] = [
  ['fearCycle', '🌀'], ['safetyInventory', '🎒'], ['watchSetup', '⌚'], ['checkingPlan', '🫙'], ['reassurancePlan', '🤝'], ['medicalPlan', '🩺'], ['ladder', '🪜'],
  ['exposureLog', '⛰️'], ['worstCase', '📜'], ['thoughtRecord', '🔍'], ['evidenceCheck', '🌦️'],
  ['defusion', '☁️'], ['values', '🧡'], ['activityPlan', '🎈'], ['relapsePlan', '🗺️'],
];

export function Tools() {
  const { data } = useStore();
  const { go } = useNav();
  return (
    <div className="app">
      <h1>Toolbox</h1>
      <p className="muted">Everything you've learned, ready any time.</p>
      <div className="grid2">
        <button className="tile play" onClick={() => go({ name: 'surge' })}><i>🌊</i><b>SURGE</b><span>Float through a wave</span></button>
        <button className="tile play" onClick={() => go({ name: 'urge' })}><i>🏄‍♀️</i><b>Surf an urge</b><span>Instead of checking</span></button>
        <button className="tile play" onClick={() => go({ name: 'breathe' })}><i>🪷</i><b>Lotus breathing</b><span>1–10 minutes</span></button>
        <button className="tile play" onClick={() => go({ name: 'winddown' })}><i>🌙</i><b>Wind down</b><span>Before sleep</span></button>
        <button className="tile play" onClick={() => go({ name: 'worrytime' })}><i>🛶</i><b>Worry time</b><span>Evening, 15 minutes</span></button>
        <button className="tile play" onClick={() => go({ name: 'budget' })}><i>🦋</i><b>Checking budget</b><span>Level {data!.settings.budgetLevel || '–'} of 4</span></button>
      </div>
      <h2>Practice games</h2>
      <div className="grid2">
        <button className="tile play" onClick={() => go({ name: 'game', id: 'bodyLab' })}><i>🧪</i><b>Body Lab</b><span>Feel it on purpose</span></button>
        <button className="tile play" onClick={() => go({ name: 'game', id: 'soundGarden' })}><i>🎧</i><b>Sound Garden</b><span>Attention training</span></button>
        <button className="tile play" onClick={() => go({ name: 'game', id: 'forecast' })}><i>⛈️</i><b>Forecaster</b><span>An experiment</span></button>
        <button className="tile play" onClick={() => go({ name: 'game', id: 'ladder' })}><i>🪜</i><b>My ladder</b><span>Climb or draw at random</span></button>
        <button className="tile play" onClick={() => go({ name: 'game', id: 'theory' })}><i>⚖️</i><b>Theory A or B</b><span>Weigh the evidence</span></button>
        <button className="tile play" onClick={() => go({ name: 'game', id: 'leaves' })}><i>🍃</i><b>Leaves</b><span>Unhook a thought</span></button>
        <button className="tile play" onClick={() => go({ name: 'game', id: 'switch' })}><i>🔌</i><b>Struggle switch</b><span>Stop adding sparks</span></button>
        <button className="tile play" onClick={() => go({ name: 'game', id: 'noting' })}><i>🔍</i><b>Get curious</b><span>Notice, name</span></button>
        <button className="tile play" onClick={() => go({ name: 'game', id: 'fearCycle' })}><i>🌀</i><b>Fear loop</b><span>See it, break it</span></button>
        <button className="tile play" onClick={() => go({ name: 'game', id: 'recipe' })}><i>🌱</i><b>Tiny habit</b><span>My recipe</span></button>
      </div>
      <h2>Help</h2>
      <div className="grid2">
        <button className="tile play" onClick={() => go({ name: 'family' })}><i>🤝</i><b>For family</b><span>How to help without reassuring</span></button>
        <button className="tile play" onClick={() => go({ name: 'hospital' })}><i>🏥</i><b>Urge to go to hospital?</b><span>Red flags first</span></button>
      </div>
      <h2>My pages and logs</h2>
      <div className="grid2">
        {TOOL_FORMS.map(([id, icon]) => {
          const f = FORMS[id];
          const n = f.kind === 'repeatable' ? data!.entries[id]?.length ?? 0 : data!.persistent[id] ? 1 : 0;
          return (
            <button key={id} className="tile play small" onClick={() => go(f.kind === 'repeatable' && n ? { name: 'logs', formId: id } : { name: 'form', formId: id })}>
              <i>{icon}</i><b>{f.title}</b><span>{n > 0 ? (f.kind === 'repeatable' ? `${n} entr${n > 1 ? 'ies' : 'y'}` : 'filled ✓') : f.kind === 'repeatable' ? 'log' : 'page'}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
