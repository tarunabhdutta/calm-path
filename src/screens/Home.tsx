import { useState } from 'react';
import { useNav } from '../components/ui';
import { useStore } from '../lib/store';
import { BUDGET_LEVELS, today } from '../lib/model';
import { PROGRAMME } from '../content/programme';
import { currentLevel, friendlyDate, GOALS, isOpen, missionNo, missionsIn, opensAt, toolById, TOOLS } from '../lib/pathway';
import { addDays, measuresDue, nextSession, localDate } from '../lib/progress';
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

function MissionCard() {
  const { data } = useStore();
  const { go } = useNav();
  const d = data!;
  const { session, readyOn } = nextSession(d);
  if (!session) return null;
  const sw = session.phase === 'staywell';
  const land = LANDS[session.week];
  const tomorrow = readyOn && readyOn === addDays(today(), 1);
  return (
    <div className="mission-card" style={{ background: `linear-gradient(135deg, ${land.sky[0]}, ${land.sky[1]})` }}>
      <small>{readyOn ? 'NEXT MISSION' : "TODAY'S MISSION"} · {sw ? 'STAY WELL' : `LEVEL ${session.week} · MISSION ${missionNo(session)} OF ${missionsIn(session.week).length}`}</small>
      <b>{sw ? 'Monthly visit' : session.title}</b>
      <p>{GOALS[session.id]}</p>
      {readyOn ? (
        <p className="mission-wait">✓ Done for now. This mission opens {tomorrow ? 'tomorrow' : `on ${friendlyDate(readyOn)}`}. Until then, fill your daily rings below.</p>
      ) : (
        <>
          <span className="g-steps"><i>1 Read</i><i>2 Practise</i><i>3 Finish</i></span>
          <button className="btn block mission-go" onClick={() => go({ name: 'session', id: session.id })}>Start · about {session.minutes} minutes</button>
        </>
      )}
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
  const measuresOpen = !!d.sessions.QS7 || d.measures.length > 0;
  const due = measuresOpen ? measuresDue(d).filter((m) => m !== 'PHQ9' || d.measures.length > 0) : [];
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const parked = d.worries.filter((w) => w.status === 'parked').length;
  const recentCrisis = d.safetyEvents.some((e) => Date.now() - Date.parse(e.at) < 7 * 86_400_000);
  const lvl = level(d);
  const nxt = nextLevelProgress(d);
  const stepToday = Object.values(d.sessions).some((s) => localDate(s.doneAt) === t) || Object.values(d.entries).flat().some((e) => localDate(e.at) === t);
  const q = quests(d, t, stepToday);
  const name = d.game.mascotName || 'Tulu';
  const cur = currentLevel(d);
  const inLevel = cur <= 10 ? missionsIn(cur) : [];
  const doneInLevel = inLevel.filter((s) => d.sessions[s.id]).length;
  const open = TOOLS.filter((x) => !['surge', 'counts'].includes(x.id) && isOpen(d, x));
  const locked = TOOLS.filter((x) => !isOpen(d, x));
  const countsOpen = isOpen(d, toolById('counts'));
  const budgetOpen = isOpen(d, toolById('budget'));

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

      <button className="level-strip" onClick={() => go({ name: 'path' })}>
        {cur <= 10 ? (
          <>
            <span className="level-no"><small>LEVEL</small>{cur}<small>of 10</small></span>
            <span className="grow"><b>{LANDS[cur].icon} {LANDS[cur].name}</b>
              <span className="muted">{doneInLevel} of {inLevel.length} missions done</span>
              <span className="bar thin"><i style={{ width: `${(doneInLevel / inLevel.length) * 100}%` }} /></span></span>
          </>
        ) : (
          <><span className="level-no">🏝️</span><span className="grow"><b>All 10 levels done</b><span className="muted">A short visit once a month keeps it strong</span></span></>
        )}
        <span className="go-arrow">›</span>
      </button>

      {session && <MissionCard />}

      <button className="surge" onClick={() => go({ name: 'surge' })} aria-label="SURGE: guided help for a wave of anxiety">
        <svg className="surge-waves" viewBox="0 0 400 60" preserveAspectRatio="none" aria-hidden>
          <path className="wave w1" d="M0 30 Q50 18 100 30 T200 30 T300 30 T400 30 T500 30 T600 30 T700 30 T800 30 V60 H0Z" fill="rgba(255,255,255,.18)" />
          <path className="wave w2" d="M0 38 Q50 28 100 38 T200 38 T300 38 T400 38 T500 38 T600 38 T700 38 T800 38 V60 H0Z" fill="rgba(255,255,255,.14)" />
        </svg>
        <b>SURGE</b><span>Feeling a wave of fear right now? Press here.</span>
      </button>

      <h2>Your daily rings</h2>
      <p className="muted" style={{ marginTop: -6 }}>Three small things to do every day.</p>
      <div className="quests">
        <button className="quest" onClick={() => go({ name: 'breathe' })}><Ring p={q[0].progress} done={q[0].done} icon="🪷" /><span>{q[0].label}</span></button>
        <button className="quest" onClick={() => go({ name: 'checkin' })}><Ring p={q[1].progress} done={q[1].done} icon="⛅" /><span>How am I today?</span></button>
        <button className="quest" onClick={() => go(session && !readyOn ? { name: 'session', id: session.id } : { name: 'tools' })}><Ring p={q[2].progress} done={q[2].done} icon="🧭" /><span>Mission or practice</span></button>
      </div>

      <div className="island-card">
        <Island level={lvl} hop={hop} onTulu={tapTulu} />
        {line && <div className="bubble" onClick={() => setLine(null)}>{line}</div>}
        <div className="island-foot">
          <span><b>{LEVELS[lvl].name}</b>{lvl < LEVELS.length - 1 ? ` · ${nxt.need - nxt.have} more drops grow the island` : ' · the island is complete'}</span>
          <div className="bar thin"><i style={{ width: `${nxt.pct}%` }} /></div>
        </div>
      </div>

      <h2>Your tools</h2>
      <p className="muted" style={{ marginTop: -6 }}>{locked.length ? `${open.length} open. ${locked.length} more open as you finish missions.` : 'Every tool is open.'}</p>
      <div className="grid2">
        {open.map((x) => (
          <button key={x.id} className="tile play" onClick={() => go(x.route)}>
            <i>{x.icon}</i><b>{x.name}</b><span>{x.id === 'worry' && parked ? `${parked} worr${parked > 1 ? 'ies' : 'y'} saved` : x.plain}</span>
          </button>
        ))}
      </div>
      {locked.length > 0 && <button className="link" onClick={() => go({ name: 'tools' })}>See all tools, and when each one opens ›</button>}

      {due.map((m) => (
        <button key={m} className="tile play" style={{ width: '100%', marginTop: 10 }} onClick={() => go({ name: 'measure', id: m })}>
          <i>🧭</i><b>Progress check: {MEASURES[m].short.toLowerCase()}</b><span>2 short minutes · +2 💧 · it shows how far you've come</span>
        </button>
      ))}

      {budgetOpen && (
        <div className="card soft rule-card">
          <div className="row spread"><h3 style={{ margin: 0 }}>🦋 My checking rule</h3>
            <button className="link" onClick={() => go({ name: 'budget' })}>change</button></div>
          <p className="ink2" style={{ margin: '6px 0 0' }}>{d.settings.budgetLevel ? BUDGET_LEVELS[d.settings.budgetLevel] : 'Not set yet.'}</p>
        </div>
      )}

      {countsOpen && (
        <>
          <h2>Checking count</h2>
          <p className="muted">Tap once each time it happens today. Just noticing is half the work.</p>
          <Counters />
          <UndoCounter />
        </>
      )}

      <div className="row wrap" style={{ marginTop: 18 }}>
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
  const d = data!;
  return (
    <div className="app">
      <h1>Tools</h1>
      <p className="muted">Every tool, and when it opens. A tool opens when the mission that teaches it is done.</p>
      <div className="grid2">
        {TOOLS.filter((x) => x.id !== 'counts').map((x) => {
          const o = isOpen(d, x);
          return (
            <button key={x.id} className={'tile play' + (o ? '' : ' locked')} disabled={!o} onClick={() => go(x.route)}>
              <i>{o ? x.icon : '🔒'}</i><b>{x.name}</b><span>{o ? x.plain : `Opens at ${opensAt(x)}`}</span>
            </button>
          );
        })}
      </div>
      <h2>Help</h2>
      <div className="grid2">
        <button className="tile play" onClick={() => go({ name: 'family' })}><i>🤝</i><b>For family</b><span>How to help without feeding the worry</span></button>
        <button className="tile play" onClick={() => go({ name: 'hospital' })}><i>🏥</i><b>Urge to go to hospital?</b><span>Warning signs first</span></button>
        <button className="tile play" onClick={() => go({ name: 'safety' })}><i>🆘</i><b>Safety card</b><span>When to call for help</span></button>
      </div>
      <h2>My pages and notes</h2>
      <p className="muted" style={{ marginTop: -6 }}>Pages you fill in during missions. Each opens with its mission.</p>
      <div className="grid2">
        {TOOL_FORMS.map(([id, icon]) => {
          const f = FORMS[id];
          const n = f.kind === 'repeatable' ? d.entries[id]?.length ?? 0 : d.persistent[id] ? 1 : 0;
          const from = PROGRAMME.find((s) => s.practice.some((p) => (p.type === 'form' && p.formId === id) || (p.type === 'game' && p.game === id)));
          const o = n > 0 || !from || !!d.sessions[from.id];
          return (
            <button key={id} className={'tile play small' + (o ? '' : ' locked')} disabled={!o} onClick={() => go(f.kind === 'repeatable' && n ? { name: 'logs', formId: id } : { name: 'form', formId: id })}>
              <i>{o ? icon : '🔒'}</i><b>{f.title}</b><span>{!o && from ? `Opens at Level ${from.week} · Mission ${missionNo(from)}` : n > 0 ? (f.kind === 'repeatable' ? `${n} entr${n > 1 ? 'ies' : 'y'}` : 'filled ✓') : f.kind === 'repeatable' ? 'log' : 'page'}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
