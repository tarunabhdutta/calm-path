// For family & friends (Thieda; Cassiday; Barlow & Craske; Veale & Willson; Bourne):
// validate, don't reassure; support practice; look after yourself.
// And the "urge to go to hospital" card: red flags first, never discourages a real emergency.
import { useState } from 'react';
import { Back, Body, useNav } from '../components/ui';
import { useStore } from '../lib/store';
import { CRISIS_LINES, RED_FLAGS } from '../lib/safety';
import { LessonArt } from '../game/LessonArt';
import { Tulu } from '../game/Mascot';
import type { ArtId } from '../game/LessonArt';

const SECTIONS: { title: string; art: ArtId; body: string[] }[] = [
  { title: 'The one big idea', art: 'team', body: [
    'Answering "Is my heart OK?", even lovingly, feeds the fear. The relief lasts minutes, and the question comes back hungrier. The kindest help is warmth without the answer.',
    'Say: "I can see you\'re scared. I\'m right here. We agreed I won\'t answer the heart question. Let\'s do the steps together." Then stop. No facts, no "you\'re fine", no checking her pulse for her.',
  ]},
  { title: 'In a wave: CARE', art: 'float', body: [
    '- Calm: your calm is part of the treatment. Slow voice, short sentences.',
    '- Acknowledge: "This is really hard right now."',
    '- Remind her of the plan: "Shall we press SURGE together?"',
    '- Encourage her to stay, and to step back into the day afterwards.',
    'Don\'t say "fight it", "pull yourself together" or "just relax". Do say "let it come, go with it".',
  ]},
  { title: 'Things not to do', art: 'hook', body: [
    '- Don\'t check her pulse, watch or ECG for her, or look things up together.',
    '- Don\'t make excuses for her or take over things she avoids.',
    '- Don\'t argue about whether the heart is fine. Respond to the process ("that\'s the alarm talking"), not the content.',
    '- Don\'t give in "just this once". One answer makes the next request more likely.',
  ]},
  { title: 'Supporting her practice', art: 'ladder', body: [
    '- Before: help her choose the step and write the forecast. Let her set the pace.',
    '- During: stay nearby if she asks, quietly. Don\'t rescue early or soothe the feeling away.',
    '- After: ask what happened compared with the forecast. Praise the effort, specifically: "You stayed without checking. That took courage."',
    '- Over time, step back, so the learning becomes hers.',
  ]},
  { title: 'Looking after yourself', art: 'kindness', body: [
    'Supporting someone with anxiety is tiring. Frustration, worry and guilt are normal. Keep time for yourself, sleep, and people of your own. You are a partner, not a guard.',
    'Recovery takes weeks and has ups and downs. A bad day is not a return to the start, for her or for you.',
  ]},
];

export function Family() {
  return (
    <div className="app">
      <Back />
      <h1>For family &amp; friends 🤝</h1>
      <p className="ink2">A page for the people who love you. Show it to them, and make your reassurance plan together on a calm day.</p>
      {SECTIONS.map((s) => (
        <div className="card lesson" key={s.title}>
          <LessonArt id={s.art} />
          <h3>{s.title}</h3>
          <Body lines={s.body} />
        </div>
      ))}
    </div>
  );
}

export function HospitalUrge() {
  const { data } = useStore();
  const { go } = useNav();
  const p = data?.profile;
  const [step, setStep] = useState(0);
  const tel = (n: string) => 'tel:' + n.replace(/[^\d+]/g, '');
  return (
    <div className="app">
      <Back />
      <h1>Urge to go to hospital?</h1>
      <div className="safety-card">
        <h3>First: is any of this happening?</h3>
        <ul className="b">{RED_FLAGS.map((r) => <li key={r}>{r}</li>)}</ul>
        <a className="call" href={tel(CRISIS_LINES.emergency)}>Yes, call 108 now</a>
        {p?.doctorPhone && <a className="call calm" href={tel(p.doctorPhone)}>Call {p.doctorName || 'my doctor'}</a>}
      </div>
      {step === 0 ? (
        <div className="card">
          <p>If none of these is happening, and this feels like your familiar wave with a strong pull to be checked, you can try a short pause first. Your medical plan stays in charge.</p>
          <button className="btn block" onClick={() => setStep(1)}>It's my familiar wave</button>
        </div>
      ) : (
        <div className="card pop-in">
          <div style={{ textAlign: 'center' }}><Tulu size={90} mood="calm" /></div>
          <p><b>1.</b> Do the SURGE steps. Let the wave be there.</p>
          <p><b>2.</b> Surf the urge for 10 minutes.</p>
          <p><b>3.</b> Then check your medical plan. If you still feel you need care, call your doctor. Asking for help is never a failure.</p>
          <div className="grid2">
            <button className="btn" onClick={() => go({ name: 'surge' })}>SURGE</button>
            <button className="btn soft" onClick={() => go({ name: 'form', formId: 'medicalPlan' })}>My medical plan</button>
          </div>
        </div>
      )}
    </div>
  );
}
