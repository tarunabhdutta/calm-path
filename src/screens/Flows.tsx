import { useEffect, useRef, useState } from 'react';
import { fx } from '../lib/sound';
import { useScene } from '../lib/useScene';
import { Back, Chips, Scale, useNav } from '../components/ui';
import { AUDIO, NIGHT_GUIDE, SURGE, SURGE_REPEAT, URGE_PROMPTS, WIND_DOWN_TEXT } from '../content/scripts';
import type { Line } from '../content/scripts';
import { breathTone, clipDuration, hasClip, playClip, stopClip } from '../lib/audio';
import { useSpeaking } from '../components/VoiceCaption';
import { useStore } from '../lib/store';
import { today, uid, emptyCounts, soundPrefs } from '../lib/model';
import { LotusBloom, Ocean, SurfScene } from '../game/Scenes';
import { Tulu } from '../game/Mascot';

function useVoice(): boolean {
  const { data } = useStore();
  return data ? data.settings.voice : true;
}

/** Plays a caption timeline over the dusk ocean. With the clip bundled, the captions follow the voice
 *  and the timeline ends with the recording; without it, each line holds for its own seconds. */
function Timeline({ lines, clip, onDone }: { lines: Line[]; clip: string; onDone: () => void }) {
  const voice = useVoice();
  const [audio, setAudio] = useState(() => voice && hasClip(clip));
  const speaking = useSpeaking();
  const said = useRef(lines[0].text);
  const [i, setI] = useState(0);
  const total = audio ? clipDuration(clip) : lines.reduce((a, l) => a + l.secs, 0);
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    let t = 0;
    if (audio) playClip(clip, () => { t = window.setTimeout(onDone, 2500); }, () => setAudio(false));
    return () => { window.clearTimeout(t); stopClip(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (audio) return;
    if (i >= lines.length) { onDone(); return; }
    const t = window.setTimeout(() => setI(i + 1), lines[i].secs * 1000);
    return () => window.clearTimeout(t);
  }, [i, audio]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const t = window.setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => window.clearInterval(t);
  }, []);
  if (audio && speaking?.clip === clip && speaking.text) said.current = speaking.text;
  const line = audio
    ? { text: said.current, breath: lines.find((l) => l.text.startsWith(said.current.slice(0, 18)))?.breath }
    : lines[Math.min(i, lines.length - 1)];
  return (
    <>
      <div className="scene-bg"><Ocean breath={line.breath} /></div>
      <div className="flow over">
        <div className="caption glass" key={line.text} aria-live="polite">{line.text}</div>
        <div className="bar glass-bar" aria-hidden><i style={{ width: `${Math.min(100, (elapsed / (total || 1)) * 100)}%` }} /></div>
        <button className="link light" onClick={() => { stopClip(); onDone(); }}>Finish</button>
      </div>
    </>
  );
}

export function Surge({ practice = false, onFinished }: { practice?: boolean; onFinished?: () => void }) {
  useScene(null, 'A-03');
  const { data, update } = useStore();
  const { back, go, toast } = useNav();
  const [stage, setStage] = useState<'play' | 'repeat' | 'log'>('play');
  const [repeated, setRepeated] = useState(false);
  const [strength, setStrength] = useState(6);
  const [minutes, setMinutes] = useState(['A few minutes']);
  const [helped, setHelped] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [how, setHow] = useState<string[]>([]);
  const [engage, setEngage] = useState<string[]>([]);
  const started = useRef(new Date().toISOString());

  const finish = () => {
    if (data && !practice) {
      const mins = { 'Under 2 minutes': 1, 'A few minutes': 4, '5–15 minutes': 10, 'Longer': 25 }[minutes[0]] ?? 4;
      update((d) => d.surges.push({ id: uid(), at: started.current, strength, minutes: mins, helped: [...helped, ...how.map((h) => 'how: ' + h), ...engage.map((e) => 'engage: ' + e)], note, repeat: repeated }));
      if (hasClip(AUDIO.win) && data.settings.voice) playClip(AUDIO.win);
      toast('Logged. You met the wave.');
    }
    onFinished ? onFinished() : back();
  };

  return (
    <div className="full scene-screen">
      {stage === 'log' && <div className="scene-bg"><Ocean /></div>}
      <div className="row spread over">
        <span className="light-back"><Back label={practice ? 'Back' : 'Close'} /></span>
        <button className="link light" onClick={() => go({ name: 'safety' })}>Different from usual?</button>
      </div>
      {stage === 'play' && <Timeline lines={SURGE} clip={AUDIO.surge} onDone={() => setStage('log')} />}
      {stage === 'repeat' && <Timeline lines={SURGE_REPEAT} clip={AUDIO.surgeRepeat} onDone={() => setStage('log')} />}
      {stage === 'log' && (
        <div className="over" style={{ marginTop: 'auto' }}>
          <div className="sheet">
            <div style={{ textAlign: 'center', marginTop: -70 }}><Tulu size={110} mood="calm" /></div>
            <h1 style={{ textAlign: 'center' }}>{practice ? 'Rehearsal done' : 'You met the wave'}</h1>
            {practice ? (
              <p className="ink2" style={{ textAlign: 'center' }}>Now you know the way. When a real wave comes, press SURGE and float along.</p>
            ) : (
              <>
                <button className="btn soft block" onClick={() => { setRepeated(true); setStage('repeat'); }}>It's still strong. Stay with me.</button>
                {data ? (
                  <>
                    <label className="f">How big was the wave at its peak?</label>
                    <Scale value={strength} onChange={setStrength} low="ripple" high="huge" />
                    <label className="f">How long did it last, roughly?</label>
                    <Chips options={['Under 2 minutes', 'A few minutes', '5–15 minutes', 'Longer']} value={minutes} onChange={setMinutes} />
                    <label className="f">Honestly, was I gritting my teeth or letting go?</label>
                    <Chips options={['Gritting my teeth', 'A bit of both', 'Letting go']} value={how} onChange={setHow} />
                    {how[0] === 'Gritting my teeth' && <p className="muted">That's fine. Letting go is learned wave by wave. Next time, try softening the shoulders and jaw a little earlier.</p>}
                    <label className="f">What helped me stay with it?</label>
                    <Chips multi options={['Letting it come', 'Naming the second fear', 'Curiosity', 'Floating', 'Letting time pass', 'Nothing yet']} value={helped} onChange={setHelped} />
                    <label className="f">Step back into the day: what's next?</label>
                    <Chips options={['Back to what I was doing', 'Make tea, slowly', 'A short walk', 'Call someone (not about my heart)', 'Water the plants', 'Tidy one small thing']} value={engage} onChange={setEngage} />
                    <label className="f">Anything to note? (optional)</label>
                    <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. after a strong tea, while resting" />
                  </>
                ) : (
                  <p className="muted" style={{ textAlign: 'center' }}>Unlock the app afterwards if you want to log this wave.</p>
                )}
              </>
            )}
            <button className="btn block" style={{ marginTop: 14 }} onClick={finish}>{practice ? 'Done' : data ? 'Save · +3 💧 for the island' : 'Finish'}</button>
          </div>
        </div>
      )}
    </div>
  );
}

const URGE_KINDS = ['Heart rate / watch', 'ECG', 'Feeling my pulse', 'Searching online', 'Asking someone', 'Something else'];
const COUNTER_FOR: Record<string, 'checks' | 'ecg' | 'search' | 'reassurance'> = {
  'Heart rate / watch': 'checks', 'ECG': 'ecg', 'Feeling my pulse': 'checks', 'Searching online': 'search', 'Asking someone': 'reassurance', 'Something else': 'checks',
};

export function Urge({ minutes = 3, onFinished }: { minutes?: number; onFinished?: () => void }) {
  useScene('M-08', 'A-04');
  const { data, update } = useStore();
  const { back, toast } = useNav();
  const [stage, setStage] = useState<'start' | 'surf' | 'end'>('start');
  const [kind, setKind] = useState<string[]>([]);
  const [start, setStart] = useState(6);
  const [end, setEnd] = useState(4);
  const [total, setTotal] = useState(minutes * 60);
  const [sec, setSec] = useState(0);
  const [gave, setGave] = useState<string[]>([]);
  const voice = useVoice();
  const at = useRef(new Date().toISOString());

  useEffect(() => {
    if (stage !== 'surf') return;
    if (sec === 0 && total === minutes * 60 && voice) playClip(AUDIO.urge);
    if (sec >= total) { stopClip(); fx('F-20'); setStage('end'); return; }
    const t = window.setTimeout(() => setSec(sec + 1), 1000);
    return () => window.clearTimeout(t);
  }, [stage, sec, total]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => stopClip(), []);

  const speaking = useSpeaking();
  const said = useRef('');
  if (speaking?.clip === AUDIO.urge && speaking.text) said.current = speaking.text;
  const prompt = said.current || ([...URGE_PROMPTS].reverse().find((p) => p.at <= (sec % 180))?.text ?? URGE_PROMPTS[0].text);
  const left = total - sec;
  // The wave starts at her rating and settles as time passes: urges rise, peak and fall.
  const h = stage === 'start' ? start / 10
    : stage === 'surf' ? Math.max(0.12, (start / 10) * (1 - 0.85 * Math.min(1, sec / total)) + 0.04 * Math.sin(sec / 2))
    : 0.1;

  const save = (outcome: 'surfed' | 'checked') => {
    if (data) {
      update((d) => {
        d.urges.push({ id: uid(), at: at.current, kind: (kind[0] ?? 'Something else') + (gave.length ? ' · last check gave: ' + gave[0] : ''), start, end, minutes: Math.round(sec / 60), outcome });
        if (outcome === 'checked') {
          const k = today();
          d.counts[k] ??= emptyCounts();
          d.counts[k][COUNTER_FOR[kind[0] ?? 'Something else']]++;
        }
      });
      toast(outcome === 'surfed' ? 'Noticed and surfed. That urge is a little weaker next time.' : 'Noticed it, logged honestly. Noticing is the first win.');
    }
    onFinished ? onFinished() : back();
  };

  return (
    <div className="full scene-screen surf">
      <div className="scene-bg"><SurfScene h={h} ashore={stage === 'end'} /></div>
      <span className="over"><Back label="Close" /></span>
      {stage === 'start' && (
        <div className="sheet over" style={{ marginTop: 'auto' }}>
          <h1>Surf the urge 🏄‍♀️</h1>
          <p className="ink2">An urge is a wave: it rises, peaks and falls by itself. Let's ride this one with {data?.game.mascotName || 'Tulu'}. What's pulling you?</p>
          <Chips options={URGE_KINDS} value={kind} onChange={setKind} />
          <label className="f">How big is the wave right now?</label>
          <Scale value={start} onChange={setStart} low="ripple" high="huge" />
          <button className="btn block" style={{ marginTop: 16 }} onClick={() => setStage('surf')}>Paddle out · {minutes} minutes</button>
        </div>
      )}
      {stage === 'surf' && (
        <div className="flow over top">
          <div className="caption glass small" key={prompt} aria-live="polite">{prompt}</div>
          <div className="timer-pill">{Math.floor(left / 60)}:{String(left % 60).padStart(2, '0')}</div>
          <button className="link" onClick={() => { stopClip(); fx('F-20'); setStage('end'); }}>I'm back on the shore</button>
        </div>
      )}
      {stage === 'end' && (
        <div className="sheet over" style={{ marginTop: 'auto' }}>
          <h1>Back on the shore! 🏝️</h1>
          <p className="ink2">You noticed the urge and stayed with it: that's a win, whatever comes next. How big is the wave now? It started at {start}.</p>
          <Scale value={end} onChange={setEnd} low="ripple" high="huge" />
          <label className="f">What did your last check really give you, ten minutes later?</label>
          <Chips options={['Relief for a moment', 'Nothing much', 'More worry', 'I checked again soon after']} value={gave} onChange={setGave} />
          <div className="grid2" style={{ marginTop: 12 }}>
            <button className="btn" onClick={() => save('surfed')}>Surfed it! +3 💧</button>
            <button className="btn soft" onClick={() => save('checked')}>I checked anyway</button>
          </div>
          <button className="btn ghost block" style={{ marginTop: 10 }} onClick={() => { setTotal(sec + 600); setStage('surf'); }}>Paddle out again · 10 more minutes</button>
        </div>
      )}
    </div>
  );
}

export function Breathe({ minutes: initial, onFinished }: { minutes?: number; onFinished?: () => void }) {
  const { data, update } = useStore();
  const { back, toast } = useNav();
  const [minutes, setMinutes] = useState<number | null>(initial ?? null);
  const [pace, setPace] = useState<'6' | '5'>('6');
  const [phase, setPhase] = useState<'in' | 'out'>('in');
  const [cycle, setCycle] = useState(0);
  const [running, setRunning] = useState(false);
  const voice = useVoice();
  const tone = data ? data.settings.tone : true;
  useScene(data && soundPrefs(data.settings).breatheMusic ? 'M-07' : null, 'A-08');
  const startAt = useRef(0);
  const IN = pace === '6' ? 4 : 6, OUT = 6;
  const cycles = minutes ? Math.round((minutes * 60) / (IN + OUT)) : 0;

  useEffect(() => {
    if (!running) return;
    if (cycle >= cycles) { finish(true); return; }
    if (tone) breathTone(phase, phase === 'in' ? IN : OUT);
    if (voice && cycle < 3) playClip(phase === 'in' ? AUDIO.breatheIn : AUDIO.breatheOut);
    if (voice && phase === 'in' && cycle === Math.floor(cycles / 2) && cycles > 12) playClip(AUDIO.breatheMid);
    const t = window.setTimeout(() => {
      if (phase === 'in') setPhase('out');
      else { setPhase('in'); setCycle((c) => c + 1); }
    }, (phase === 'in' ? IN : OUT) * 1000);
    return () => window.clearTimeout(t);
  }, [running, phase, cycle]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => stopClip(), []);

  const begin = () => {
    startAt.current = Date.now();
    fx('F-14');
    if (voice && hasClip(AUDIO.breatheIntro)) playClip(AUDIO.breatheIntro, () => setRunning(true));
    else setRunning(true);
  };

  function finish(complete: boolean) {
    setRunning(false);
    const mins = Math.round((Date.now() - startAt.current) / 60000);
    if (data && mins >= 1) update((d) => d.breaths.push({ at: new Date().toISOString(), minutes: mins }));
    if (complete && voice) playClip(AUDIO.breatheClose);
    if (mins >= 1) toast(`${mins} minute${mins > 1 ? 's' : ''} of lotus breathing. Lovely.`);
    onFinished ? onFinished() : back();
  }

  if (!minutes) {
    return (
      <div className="full lotus-screen">
        <Back />
        <div className="flow">
          <LotusBloom phase="in" running={false} secs={1} />
          <h1>Calm-time breathing</h1>
          <p className="ink2" style={{ maxWidth: '34ch' }}>Daily training for your nervous system, best when you are <b>not</b> in a wave. The lotus opens as you breathe in and closes as you breathe out. Keep it soft and unforced. Start with 5 minutes, build up to 20.</p>
          <Chips options={['6 a minute (4 in · 6 out)', '5 a minute (6 in · 6 out)']} value={[pace === '6' ? '6 a minute (4 in · 6 out)' : '5 a minute (6 in · 6 out)']} onChange={(v) => setPace(v[0].startsWith('5') ? '5' : '6')} />
          <div className="grid2" style={{ width: '100%', maxWidth: 360 }}>
            {[3, 5, 10, 20].map((m) => <button key={m} className="btn soft" onClick={() => setMinutes(m)}>{m} min · +{Math.min(10, m)} 💧</button>)}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="full lotus-screen">
      <Back label="Close" onClick={() => (running ? finish(false) : back())} />
      <div className="flow">
        <LotusBloom phase={phase} running={running} secs={phase === 'in' ? IN : OUT} />
        <div className="caption">{!running ? `${minutes} minute${minutes > 1 ? 's' : ''} with the lotus` : phase === 'in' ? 'Breathe in… the lotus opens' : 'And out… slowly, it closes'}</div>
        {running ? <div className="breath-dots" aria-label={`${cycles - cycle} breaths to go`}>{Array.from({ length: Math.min(cycles, 30) }).map((_, k) => <i key={k} className={k < cycle ? 'on' : ''} />)}</div>
          : <button className="btn" onClick={begin}>Begin</button>}
        {running && <button className="link" onClick={() => finish(false)}>Finish early</button>}
      </div>
    </div>
  );
}

export function WindDown() {
  const voice = useVoice();
  const [i, setI] = useState(0);
  const [audio, setAudio] = useState(() => voice && hasClip(AUDIO.winddown));
  const speaking = useSpeaking();
  const said = useRef(WIND_DOWN_TEXT[0]);
  useEffect(() => {
    if (audio) playClip(AUDIO.winddown, undefined, () => setAudio(false));
    return () => stopClip();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (audio || i >= WIND_DOWN_TEXT.length - 1) return;
    const t = window.setTimeout(() => setI(i + 1), 26_000);
    return () => window.clearTimeout(t);
  }, [i, audio]); // eslint-disable-line react-hooks/exhaustive-deps
  if (audio && speaking?.clip === AUDIO.winddown && speaking.text) said.current = speaking.text;
  const text = audio ? said.current : WIND_DOWN_TEXT[i];
  useEffect(() => { fx('F-26', 0.8); }, []);
  const night = (open: boolean) => { if (open && voice) playClip(AUDIO.night); else if (!open) stopClip(); };
  return (
    <div className="full night-screen">
      <div className="stars" aria-hidden>{Array.from({ length: 30 }).map((_, k) => <i key={k} style={{ left: `${(k * 37) % 100}%`, top: `${(k * 53) % 70}%`, animationDelay: `${(k % 7) * 0.6}s` }} />)}</div>
      <span className="light-back"><Back label="Close" /></span>
      <div className="flow">
        <div className="moon" aria-hidden />
        <Tulu size={170} mood="sleep" />
        <div className="caption" key={text}>{text}</div>
        {!audio && <p className="muted">The voice version plays here once the audio is added.</p>}
        <details className="night-guide" onToggle={(e) => night((e.target as HTMLDetailsElement).open)}>
          <summary>Awake in the night? 🌙</summary>
          {NIGHT_GUIDE.map((l) => <p key={l}>{l}</p>)}
        </details>
      </div>
    </div>
  );
}
