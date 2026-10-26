import type { FormDef } from './types';

// Living documents and repeatable logs used by the sessions.

export const FORMS: Record<string, FormDef> = {
  fearCycle: {
    id: 'fearCycle',
    title: 'My fear cycle',
    kind: 'persistent',
    intro: 'Use a real, recent wave. Fill in each link of the circle in your own words.',
    fields: [
      { id: 'trigger', label: '1. Trigger: what did I notice first?', type: 'textarea', placeholder: 'e.g. a thump in my chest while sitting on the sofa' },
      { id: 'thought', label: '2. Thought: what did my mind say it meant?', type: 'textarea', placeholder: 'e.g. "Something is wrong with my heart"' },
      { id: 'feeling', label: '3. Feeling: what emotion came?', type: 'text', placeholder: 'e.g. fear, panic, doom' },
      { id: 'body', label: '4. Body: what happened in my body next?', type: 'textarea', placeholder: 'e.g. heart racing, shaking hands, hot face' },
      { id: 'behaviour', label: '5. What did I do to feel safe?', type: 'textarea', placeholder: 'e.g. checked the watch, took an ECG, asked someone if I was OK' },
      { id: 'relief', label: '6. What happened afterwards, a few hours later?', type: 'textarea', placeholder: 'e.g. relief for a while, then I kept listening to my heart' },
    ],
  },
  safetyInventory: {
    id: 'safetyInventory',
    title: 'My safety behaviours',
    kind: 'persistent',
    intro: 'List everything you do to check, to get reassurance, or to avoid the feeling. Rate how hard each one would be to drop (0 = easy, 100 = very hard).',
    fields: [
      {
        id: 'items', label: 'Safety behaviours', type: 'rated-list',
        help: 'Ideas: looking at heart rate on the watch, taking an ECG, feeling the pulse, Googling symptoms, asking "Am I OK?", avoiding exercise, avoiding being alone, staying near a hospital, avoiding coffee, sitting down at the first flutter.',
      },
    ],
  },
  watchSetup: {
    id: 'watchSetup',
    title: 'Smartwatch: from alarm to calm coach',
    kind: 'persistent',
    intro: 'For anyone who wears a smartwatch or fitness band. Names differ between brands; on an Apple Watch the paths are shown in brackets. Tick each change once it is done. If you have no watch, skip this page.',
    fields: [
      {
        id: 'steps', label: 'Changes', type: 'checklist',
        options: [
          'High heart rate alerts: OFF (Apple: Watch app → Heart → High Heart Rate)',
          'Live heart-rate number removed from the watch face',
          'A quick button or shortcut opens a breathing exercise (Apple Watch Ultra: Action Button → Mindfulness)',
          'Breathing reminders set to 2 a day',
          'Emergency SOS and fall detection left ON',
          'Medical ID / emergency info up to date (allergies, emergency contact)',
          'ECG app kept, but not opened out of worry',
        ],
      },
    ],
  },
  reassurancePlan: {
    id: 'reassurancePlan',
    title: 'Our reassurance plan',
    kind: 'persistent',
    intro: 'Agree this together with someone close to you. When you ask "Am I OK?", they answer with this instead of "You\'re fine".',
    fields: [
      { id: 'signal', label: 'What I usually ask', type: 'textarea', placeholder: 'e.g. "Feel my pulse, is it too fast?"' },
      { id: 'reply', label: 'What they will say instead', type: 'textarea', placeholder: 'e.g. "I can see the anxiety is loud. We agreed to ride it out. Let\'s do the SURGE steps together."' },
      { id: 'together', label: 'What we will do together', type: 'text', placeholder: 'e.g. SURGE, then a short walk' },
    ],
  },
  ladder: {
    id: 'ladder',
    title: 'My facing-fear ladder',
    kind: 'persistent',
    intro: 'List situations you avoid or endure with dread. Rate how frightening each would be (0–100). Start practising from the low end.',
    fields: [
      {
        id: 'rungs', label: 'Situations', type: 'rated-list',
        help: 'Ideas: a 20-minute walk alone, staying at home alone for an evening, going far from a hospital, reading an article about heart attacks, a yoga class, a long drive, a crowded market, a cup of coffee, climbing stairs quickly.',
      },
    ],
  },
  exposureLog: {
    id: 'exposureLog',
    title: 'Practice log',
    kind: 'repeatable',
    intro: 'Fill in the first two lines BEFORE you start, and the rest afterwards.',
    fields: [
      { id: 'task', label: 'What I am going to do', type: 'text' },
      { id: 'prediction', label: 'What I fear will happen', type: 'textarea' },
      { id: 'confidence', label: 'How sure am I that it will happen? (0–100)', type: 'scale100' },
      { id: 'peak', label: 'Afterwards: the highest fear I felt (0–100)', type: 'scale100' },
      { id: 'happened', label: 'What actually happened', type: 'textarea' },
      { id: 'learned', label: 'What I learned', type: 'textarea' },
      { id: 'safety', label: 'Did I use any safety behaviour? Which one?', type: 'text', optional: true },
    ],
  },
  worstCase: {
    id: 'worstCase',
    title: 'My worry story',
    kind: 'persistent',
    intro: 'Write the feared story in full, in the present tense, as if it is happening now. Then read it slowly once a day until it becomes boring.',
    fields: [
      { id: 'story', label: 'The story', type: 'textarea' },
      { id: 'readings', label: 'Fear while reading today (0–100)', type: 'scale100' },
    ],
  },
  bodyPractice: {
    id: 'bodyPractice',
    title: 'Body-sensation practice',
    kind: 'repeatable',
    intro: 'Bring on the feeling on purpose, let it peak, and do not check anything. Rate before and after.',
    fields: [
      {
        id: 'exercise', label: 'Exercise', type: 'choice',
        options: [
          'Climb stairs quickly, 1 minute',
          'Spot-running, 1 minute',
          'Fast breathing, 30 seconds',
          'Breathe through a thin straw, 1 minute',
          'Spin slowly on a chair, 30 seconds',
          'Hold your breath, 20 seconds',
          'Stare at your hand, 1 minute (gentle)',
          'Sit in a warm, closed room, 5 minutes (gentle)',
          'Stand up quickly from lying down (gentle)',
        ],
      },
      { id: 'prediction', label: 'What I fear will happen', type: 'text' },
      { id: 'fear', label: 'Peak fear (0–100)', type: 'scale100' },
      { id: 'similar', label: 'How similar to a real wave? (0–100)', type: 'scale100' },
      { id: 'learned', label: 'What I noticed or learned', type: 'textarea' },
    ],
  },
  thoughtRecord: {
    id: 'thoughtRecord',
    title: 'Thought record',
    kind: 'repeatable',
    fields: [
      { id: 'situation', label: 'Situation: where, when, what was happening?', type: 'textarea' },
      { id: 'thought', label: 'Hot thought: what went through my mind?', type: 'textarea' },
      { id: 'belief', label: 'How much do I believe it? (0–100)', type: 'scale100' },
      { id: 'for', label: 'Evidence that seems to support it', type: 'textarea' },
      { id: 'against', label: 'Evidence that does not fit it', type: 'textarea' },
      { id: 'balanced', label: 'A balanced thought', type: 'textarea' },
      { id: 'beliefAfter', label: 'How much do I believe the hot thought now? (0–100)', type: 'scale100' },
    ],
  },
  evidenceCheck: {
    id: 'evidenceCheck',
    title: 'The track record',
    kind: 'persistent',
    fields: [
      { id: 'episodes', label: 'Roughly how many frightening heart waves have I had in the past year?', type: 'number' },
      { id: 'predicted', label: 'In how many did I fear something terrible was happening?', type: 'number' },
      { id: 'outcome', label: 'How did each of them end?', type: 'textarea' },
      { id: 'lesson', label: 'What does this track record tell me about the next one?', type: 'textarea' },
    ],
  },
  defusion: {
    id: 'defusion',
    title: 'Unhooking practice',
    kind: 'repeatable',
    fields: [
      { id: 'thought', label: 'The sticky thought', type: 'text' },
      { id: 'having', label: 'Rewrite it: "I am having the thought that…"', type: 'text' },
      { id: 'noticing', label: 'Again: "I notice I am having the thought that…"', type: 'text' },
      { id: 'grip', label: 'How strongly does it grip me now? (0–10)', type: 'scale10' },
    ],
  },
  values: {
    id: 'values',
    title: 'What matters to me',
    kind: 'persistent',
    fields: [
      { id: 'family', label: 'Family and loved ones', type: 'textarea' },
      { id: 'self', label: 'My health and body (movement, rest, food)', type: 'textarea' },
      { id: 'joy', label: 'Joy, hobbies, friends', type: 'textarea' },
      { id: 'growth', label: 'Work, learning, contribution', type: 'textarea' },
      { id: 'dropped', label: 'Things I stopped doing because of the anxiety', type: 'textarea' },
    ],
  },
  activityPlan: {
    id: 'activityPlan',
    title: 'This week\'s plan',
    kind: 'repeatable',
    fields: [
      { id: 'activity', label: 'One valued activity I will do', type: 'text' },
      { id: 'when', label: 'When', type: 'text' },
      { id: 'done', label: 'Afterwards: how did it go?', type: 'textarea', optional: true },
      { id: 'enjoy', label: 'Enjoyment (0–10)', type: 'scale10', optional: true },
    ],
  },
  relapsePlan: {
    id: 'relapsePlan',
    title: 'If it comes back',
    kind: 'persistent',
    intro: 'Your own plan, written while you feel well.',
    fields: [
      { id: 'signs', label: 'My early warning signs', type: 'textarea', placeholder: 'e.g. checking the watch again, Googling, avoiding walks' },
      { id: 'first', label: 'My first three actions', type: 'textarea', placeholder: 'e.g. SURGE, restart the urge timer, redo the ladder from rung 2' },
      { id: 'helped', label: 'What helped me most in this programme', type: 'textarea' },
      { id: 'who', label: 'Who I will talk to', type: 'text' },
      { id: 'pro', label: 'When I will book a professional', type: 'text', placeholder: 'e.g. if it stays high for 3 weeks' },
    ],
  },
};
