// On-screen captions that mirror the ElevenLabs voice scripts
// (docs/VOICE_SCRIPTS.md). When a clip's MP3 is bundled it
// plays alongside; without it, the captions alone guide her at the same pace.

export interface Line { text: string; secs: number; breath?: 'out' | 'in' }

export const SURGE: Line[] = [
  { text: 'You pressed the button. That was the right thing to do.', secs: 5 },
  { text: 'Something is rising in your body. A fast heart. Maybe that thump. Maybe trembling hands.', secs: 7 },
  { text: 'You know this wave. It is adrenaline, the body\'s alarm, ringing loudly.', secs: 7 },
  { text: 'We are not going to fight it. And we are not going to check it.', secs: 5 },
  { text: 'Put the phone down if you can, or just let your hand rest.', secs: 6 },
  { text: 'Say to yourself, quietly: let it come.', secs: 5 },
  { text: 'Let it do whatever it wants to do. It is allowed to be here.', secs: 7 },
  { text: 'A long, slow breath out, as if through a straw…', secs: 6, breath: 'out' },
  { text: 'And let the next breath come in by itself.', secs: 4, breath: 'in' },
  { text: 'Again, slowly out…', secs: 6, breath: 'out' },
  { text: 'And let it come in.', secs: 4, breath: 'in' },
  { text: 'One more, long and slow, all the way out…', secs: 6, breath: 'out' },
  { text: 'Let your shoulders drop. Unclench your jaw. Soften your hands.', secs: 8 },
  { text: 'If the heart races, let it race.', secs: 4 },
  { text: 'You are lying on warm, still water. You don\'t swim. You float.', secs: 7 },
  { text: 'The water holds you, and the feeling moves through you.', secs: 10 },
  { text: 'Time is on your side. Every wave rises, reaches its top, and falls, without you doing anything.', secs: 8 },
  { text: 'Your only job is to let time pass.', secs: 12 },
  { text: 'The wave may already be lower. Or it may still be here. Either way is all right.', secs: 7 },
  { text: 'When you are ready, do one small, ordinary thing: a sip of water, a look out of the window.', secs: 8 },
  { text: 'You let the wave pass through. That is exactly how this gets weaker.', secs: 6 },
];

export const SURGE_REPEAT: Line[] = [
  { text: 'It\'s still here, and that is all right. Some waves are longer.', secs: 5 },
  { text: 'Nothing needs to be fixed right now. Let it stay as long as it wants.', secs: 6 },
  { text: 'Breathe out slowly, long and soft…', secs: 6, breath: 'out' },
  { text: 'And let the breath come back in.', secs: 4, breath: 'in' },
  { text: 'Again, out…', secs: 6, breath: 'out' },
  { text: 'And in.', secs: 4, breath: 'in' },
  { text: 'Let it come. Float. Let time pass.', secs: 14 },
  { text: 'Staying with it, without checking, is the work. Keep floating.', secs: 6 },
];

export const URGE_PROMPTS: { at: number; text: string }[] = [
  { at: 0, text: 'You feel the pull to check. That pull is the anxiety asking for reassurance.' },
  { at: 10, text: 'Notice where you feel the urge. Your chest? Your hands? Your stomach?' },
  { at: 25, text: 'An urge is a wave. It builds, it peaks, and it falls, whether you act on it or not.' },
  { at: 45, text: 'Just watch it, with curiosity. Breathe out slowly.' },
  { at: 75, text: 'If the thought says "just one check", answer: "Thank you, mind. I\'m surfing this one."' },
  { at: 110, text: 'Look at the wave now. Same, stronger, or a little lower? Either way, you\'re still on the board.' },
  { at: 150, text: 'Keep breathing. Let the urge be there without doing what it says.' },
  { at: 175, text: 'Every urge you surf makes the next one weaker.' },
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
} as const;

export const WIND_DOWN_TEXT = [
  'The day is done. Let\'s put it down gently.',
  'Lie back, and let the bed take your weight. Breathe out slowly.',
  'Feet heavy and warm. Legs sinking a little deeper.',
  'Belly rising and falling on its own.',
  'Whatever your heart is doing, let it do it. You don\'t need to listen to it.',
  'Shoulders, arms, hands, loose. Jaw, forehead, eyes, soft.',
  'If a thought comes, let it pass by, like a boat on the river.',
  'Nothing more to do tonight. Just rest.',
];
