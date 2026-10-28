// On-screen captions that mirror the voice scripts (docs/VOICE_SCRIPTS.md, v1.3).
// When a clip's MP3 is bundled it plays alongside; without it, the captions alone guide her at the same pace.
//
// SURGE: notice the first and second fear, turn towards the feeling, go with it, float, let time
// pass, then step back into the day. It never promises calm, never says the heart is fine, and
// never uses the breath to push the feeling away.

export interface Line { text: string; secs: number; breath?: 'out' | 'in' }

export const SURGE: Line[] = [
  { text: 'You pressed the button. Good. Let\'s meet this wave together.', secs: 5 },
  { text: 'Here is the flash: the jolt, the fast heart, maybe that thump. That is the first fear. It came by itself.', secs: 8 },
  { text: 'Now listen for the second voice: "What if… this time…" That is the second fear. You don\'t have to answer it.', secs: 8 },
  { text: 'You can reply, lightly: "So it races. Let it race."', secs: 6 },
  { text: 'Turn towards the feeling, like a curious scientist. Where is it? How big? What is it like?', secs: 9 },
  { text: 'Now go with it. Not gritting your teeth. Loosening.', secs: 5 },
  { text: 'Let your shoulders drop. Soften your jaw. Open your hands. Let your tummy go soft.', secs: 8 },
  { text: 'Make room for the feeling. Let it be as strong as it wants. The switch is off. You are adding nothing.', secs: 9 },
  { text: 'Let your breath be soft and slow on its own. Breathe around the feeling, not against it.', secs: 7, breath: 'out' },
  { text: 'Imagine floating on warm, still water. You don\'t swim. The water holds you, and the feeling moves through.', secs: 10 },
  { text: 'Now let time pass. Waves rise, peak and fall in their own time.', secs: 8 },
  { text: 'Your only job is to let the seconds go by.', secs: 14 },
  { text: 'Whatever the wave is doing now (higher, lower, or the same), it is allowed to be here.', secs: 8 },
  { text: 'Now step back into your day. Pick up the next ordinary thing, and let the feeling come along if it wants.', secs: 8 },
  { text: 'You met the wave without fighting it. That is how it loses its power over you.', secs: 6 },
];

export const SURGE_REPEAT: Line[] = [
  { text: 'Still strong? That is allowed. Some waves are longer.', secs: 5 },
  { text: 'Nothing needs fixing right now. Let it stay as long as it wants.', secs: 6 },
  { text: 'Where is it now? Has its shape changed? Just notice.', secs: 8 },
  { text: 'Soften around it. Shoulders, jaw, hands.', secs: 7, breath: 'out' },
  { text: 'Float. Let time pass.', secs: 14 },
  { text: 'Staying with it, without checking, is the whole of the work. Keep floating.', secs: 6 },
];

export const URGE_PROMPTS: { at: number; text: string }[] = [
  { at: 0, text: 'The pull to check is here. You noticed it. That is already the win.' },
  { at: 10, text: 'Notice it. Say quietly: "urge to check."' },
  { at: 25, text: 'Allow it. You don\'t have to push it away, and you don\'t have to obey it.' },
  { at: 45, text: 'Explore it. Where do you feel it: chest, hands, throat? What is it like: tight, buzzy, pulling?' },
  { at: 75, text: 'Name it in a word, each time it changes. "Tight"… "pulling"… "fading"…' },
  { at: 110, text: 'If the thought says "just one quick check", answer: "Thank you, mind. I\'m surfing this one."' },
  { at: 140, text: 'Ask gently: what did the last check really give me, ten minutes later?' },
  { at: 170, text: 'Every urge you notice and ride makes the next one weaker.' },
];

export const AUDIO = {
  surge: 'V-01_SURGE.mp3',
  surgeRepeat: 'V-01B_SURGE_REPEAT.mp3',
  breatheIntro: 'V-02A_BREATHE_INTRO.mp3',
  breatheIn: 'V-02B_IN.mp3',
  breatheOut: 'V-02C_OUT.mp3',
  breatheMid: 'V-02D_MIDWAY.mp3',
  breatheClose: 'V-02E_CLOSE.mp3',
  urge: 'V-03_URGE_SURF.mp3',
  worry: 'V-04_WORRY_TIME.mp3',
  winddown: 'V-05_WIND_DOWN.mp3',
  morning: 'V-06A_MORNING.mp3',
  win: 'V-06B_WIN.mp3',
  logged: 'V-06C_LOGGED.mp3',
  missed: 'V-06D_MISSED_DAY.mp3',
  exposureStart: 'V-06E_EXPOSURE_START.mp3',
  exposureEnd: 'V-06F_EXPOSURE_END.mp3',
  lab: 'V-07_BODY_LAB.mp3',
  garden: 'V-08_LISTENING_GARDEN.mp3',
  night: 'V-09_NIGHT_GUIDE.mp3',
} as const;

export const WIND_DOWN_TEXT = [
  'The day is done. The worries are parked for tonight. Nothing more to solve.',
  'Lie back, and let the bed take your weight.',
  'Feet heavy and warm. Legs sinking a little deeper.',
  'If your heart is noticeable, let it be noticeable. You don\'t need to listen to it.',
  'Notice the sounds outside: something near… something far…',
  'Shoulders, arms, hands loose. Jaw, forehead, eyes soft.',
  'If a thought comes, let it pass by, like a boat on the river.',
  'Sleep can\'t be forced, and it doesn\'t need to be. Resting is enough.',
];

/** Night Guide: for waking at night. */
export const NIGHT_GUIDE = [
  'Awake at night? That happens to everyone. Nothing needs to be done about it.',
  'If you are calm, stay and rest. If you are upset and wide awake for a while, get up, go to another room, and keep the light dim.',
  'Do something quiet you chose in the daytime: a gentle book, folding clothes, a warm (caffeine-free) drink.',
  'If worries come, they are parked until tomorrow\'s worry time. You can say: "Not now. Tomorrow at worry time."',
  'If your body feels strange as you wake (a fast heart, a jolt), that is common when waking between sleep stages. Let it be there, like weather.',
  'When you feel sleepy, go back to bed. Tomorrow, get up at your usual time, whatever the night was like.',
];
