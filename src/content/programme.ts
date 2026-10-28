import type { Session } from './types';

// CALM PATH: the programme (content v1.3, 28 Oct 2026).
//
// Built from a full reading of 35 books. The method:
//   - Frame: two theories (Veale & Willson; Taylor & Asmundson).
//   - Engine: exposure plus stopping relief-seeking (Hedman-Lagerlöf's internet CBT; Abramowitz;
//     Cassiday).
//   - Body-sensation practice early and properly dosed (Barlow & Craske; Bourne).
//   - Every practice an experiment (Greenberger & Padesky; Burns).
//   - Acceptance and defusion (Weekes; Harris; McKay; McDonagh).
//   - Urge habits (Brewer; Fogg), attention training (Wells, via Veale & Willson), sleep
//     (Carney & Manber), and family (Thieda).
// All text is written fresh; no book text is copied.
//
// House rules for every line (enforced by src/selftest.ts):
//   - never promise a symptom is harmless or safe, and never mention a heart-rate number;
//   - never tell her to check anything;
//   - breathing and floating are for staying with a feeling, never for switching it off.

export const PROGRAMME: Session[] = [
  // ───────────────────────── QUICK START · week 1 (one a day) ─────────────────────────
  {
    id: 'QS1', phase: 'quickstart', week: 1, title: 'Welcome. Two theories', minutes: 10,
    cards: [
      { title: 'Why you are here', art: 'welcome', body: [
        'Maybe for months your heart has raced, thumped and frightened you. You have probably been through tests, and the answer pointed to health anxiety: a real problem, with real sensations, and a well-studied way out.',
        'Knowing that does not switch the fear off. That is not a failure of yours. Fear is unlearned by doing, not by being told. This app is the doing part, made as gentle and playful as possible.',
      ]},
      { title: 'Two theories', art: 'theory', body: [
        'Theory A: "Something is wrong with my heart, so I must watch it, check it and get reassurance."',
        'Theory B: "I have a sensitive alarm system. My watching, checking and reassurance-seeking keep the alarm loud."',
        'Only one can be the main story. You don\'t have to believe B today. For the next ten weeks, you will simply act as if B were true, and collect your own evidence. At the end you decide.',
      ]},
      { title: 'How the journey works', art: 'map', body: [
        '- Week 1, Quick Start: seven short daily steps.',
        '- Weeks 2–10, Strengthen: about three steps a week, 10–15 minutes each.',
        '- Every day: a tiny practice. Tiny counts fully.',
        'The more you practise, the more it works. That is the strongest finding in all the research behind this app. A little, often, beats a lot, rarely.',
      ]},
    ],
    practice: [{ type: 'game', game: 'theory' }],
    reflection: 'If the anxiety took up much less space in your life, what would you do more of?',
  },
  {
    id: 'QS2', phase: 'quickstart', week: 1, title: 'The alarm and the magnifying glass', minutes: 10,
    cards: [
      { title: 'A smoke alarm, set too sensitive', art: 'alarm', body: [
        'Your body has an alarm built to protect you. When it fires, adrenaline flows: the heart beats harder and faster, breathing quickens, hands may shake, you feel hot or unreal.',
        'After a long stressful time, the alarm becomes trigger-happy. It fires at ordinary signals, such as one strong beat, the way a kitchen alarm shrieks at toast. Doctors call this sensitisation.',
      ]},
      { title: 'Attention turns up the volume', art: 'magnifier', body: [
        'Try this now. For one minute, pay close attention to your left foot. Notice the toes, the sock, any tingle or pressure.',
        'Did your foot suddenly have more sensations? It had them all along. Attention works like a magnifying glass. The more you watch your heart, the more beats you notice, and every beat noticed feels like a message.',
        'That is why this app never shows a heart-rate number, and why later you will train your attention like a muscle.',
      ]},
      { title: 'Your tool for a wave: SURGE', art: 'float', body: [
        'The big SURGE button guides you through a wave: notice it, let it come, float, let time pass, then step back into your day.',
        'SURGE does not try to switch the feeling off. It teaches you to let it be there. That is what makes the next wave smaller. Today, try it once while calm, as a rehearsal.',
      ]},
    ],
    practice: [{ type: 'surge-practice' }],
    reflection: 'What did you notice in the foot experiment?',
  },
  {
    id: 'QS3', phase: 'quickstart', week: 1, title: 'Your fear loop', minutes: 12,
    cards: [
      { title: 'The loop that keeps it going', art: 'cycle', body: [
        'Every wave follows the same loop: a sensation → a frightening thought → fear → more adrenaline and more sensations → something you do to feel safe → brief relief → more watching.',
        'You will draw your own loop now, from a real recent wave. When you can see the loop, you can step out of it.',
      ]},
      { title: 'Where you can step out', art: 'hook', body: [
        'You can\'t stop a sensation from arriving. But you can change the last link: what you do. Every check, every "am I OK?", every search is a small payment that keeps the loop running.',
        'In the coming weeks you will stop paying, one link at a time.',
      ]},
    ],
    practice: [{ type: 'game', game: 'fearCycle' }],
    reflection: 'Which link of your loop surprised you?',
  },
  {
    id: 'QS4', phase: 'quickstart', week: 1, title: 'First fear, second fear, and the struggle switch', minutes: 10,
    cards: [
      { title: 'Two different fears', art: 'twoFears', body: [
        'The first fear is the automatic flash: a jolt that comes by itself. The second fear is what we add: "Oh no, here it is again, what if this time it\'s serious?"',
        'The flash passes quickly when it is left alone. The second fear keeps pouring in adrenaline. The second fear is the only part you can change.',
      ]},
      { title: 'The struggle switch', art: 'switch', body: [
        'Imagine a switch at the back of your mind. When it is ON, you fight the feeling: you check, Google, ask, brace, avoid. Every fight adds sparks: more fear on top of the fear.',
        'When the switch is OFF, the feeling is still there. But you stop adding to it. Clean discomfort stays; the extra layer drains away. You will practise turning the switch off.',
      ]},
      { title: 'Go with it, not put up with it', art: 'float', body: [
        'Gritting your teeth and enduring is still fighting. Real acceptance is softer: loosen the shoulders and the jaw, let the feeling come, and carry on with what you were doing.',
        'A test: can the thump be there while you keep reading this sentence? Then you are already doing it.',
      ]},
    ],
    practice: [{ type: 'game', game: 'switch' }],
    reflection: 'In your last wave, what was your "second fear" thought?',
  },
  {
    id: 'QS5', phase: 'quickstart', week: 1, title: 'Why checking backfires', minutes: 10,
    cards: [
      { title: 'The relief trap', art: 'hook', body: [
        'Looking at the watch, taking an ECG, feeling the pulse, Googling, asking "am I OK?": each brings a few minutes of relief. And the relief is the trap.',
        'Relief teaches the brain two things: that the sensation was dangerous, and that you were safe only because you checked. So the next sensation feels more urgent, and the next check is needed sooner.',
      ]},
      { title: 'The slot machine', art: 'counter', body: [
        'Checking works like a slot machine. Sometimes it calms you, sometimes it shows something that worries you more. That unpredictability is exactly what makes a habit strongest.',
        'This week you don\'t need to stop. Just drop a pebble on the home screen each time you check, ask or search. Counting turns an automatic act into a noticed one, and noticing is the first win.',
      ]},
    ],
    practice: [{ type: 'game', game: 'noting' }],
    reflection: 'Which check do you do most often?',
  },
  {
    id: 'QS6', phase: 'quickstart', week: 1, title: 'Urges are waves', minutes: 10,
    cards: [
      { title: 'Surf, don\'t obey', art: 'urgeWave', body: [
        'The pull to check is an urge, and urges behave like waves: they rise, peak and fall, even if you do nothing. You don\'t have to fight the urge, and you don\'t have to obey it.',
        'The urge timer walks you through four steps: Recognise it, Allow it, Investigate it with curiosity (where is it? what is it like?), and Note it in a word.',
      ]},
      { title: 'Noticing is the win', art: 'curious', body: [
        'At first, the win is not stopping the check. The win is noticing the moment of choice. Every urge you notice earns a drop, even if you check anyway.',
        'Afterwards, ask one gentle question: "What did the last check really give me, ten minutes later?" Feeling the honest answer, again and again, is what makes the habit lose its grip.',
      ]},
    ],
    practice: [{ type: 'urge', minutes: 3 }],
    reflection: 'What did you notice about the urge as the minutes passed?',
  },
  {
    id: 'QS7', phase: 'quickstart', week: 1, title: 'Your starting point and your tiny habit', minutes: 12,
    cards: [
      { title: 'One week done', art: 'calendar', body: [
        'You know the tools now: SURGE, the urge timer, the pebble counters, and the loop.',
        'Today, two short questionnaires give you a starting line. Scores often go up a little in the first weeks, because you are looking at the anxiety more honestly. That is normal, and it is not a step back.',
      ]},
      { title: 'A tiny daily habit', art: 'garden', body: [
        'Big changes grow from tiny habits tied to something you already do. Build one recipe: "After I…, I will…, then I celebrate."',
        'Also start calm-time breathing: a few minutes once or twice a day, when you are NOT in a wave. It is training for your nervous system, like a gym, not a fire extinguisher.',
      ]},
    ],
    practice: [{ type: 'measure', measureId: 'GAD7' }, { type: 'measure', measureId: 'WI7' }, { type: 'game', game: 'recipe' }],
    reflection: 'What has been most useful this week?',
  },

  // ───────────────────────── week 2: stop paying the loop ─────────────────────────
  {
    id: 'S2.1', phase: 'strengthen', week: 2, title: 'Everything you do to feel safe', minutes: 12,
    cards: [
      { title: 'Safety behaviours', art: 'backpack', body: [
        'Safety behaviours are the things we do to prevent, check on or escape a feared outcome. They feel protective, but they rob the brain of the chance to learn that the feared thing doesn\'t come.',
        'Some are obvious: the watch, the pulse, the ECG, Googling, asking. Some hide: avoiding stairs, keeping the phone close, sitting down at the first flutter, avoiding coffee or heat, scanning the body, counting, replaying reassurance in your head, staying busy so you never feel it.',
      ]},
      { title: 'Body "hacks" count too', art: 'detective', body: [
        'Splashing cold water on the face, bearing down, coughing, pressing the neck, special breathing tricks aimed at the heartbeat, sleep-position rules, checking stress or HRV scores: these are all ways of controlling the heart. They are safety behaviours too, and some carry real medical risk. Put them on the list.',
        'One question sorts them: does this help me stay with the feeling, or does it try to make it go away? If it makes it go away, it is a safety behaviour.',
      ]},
    ],
    practice: [{ type: 'form', formId: 'safetyInventory' }],
    reflection: 'Which safety behaviour surprised you when you wrote it down?',
  },
  {
    id: 'S2.2', phase: 'strengthen', week: 2, title: 'Remove the prompts', minutes: 10,
    cards: [
      { title: 'Change the job of your devices', art: 'watch', body: [
        'If you wear a smartwatch: while your heart was still being checked, its job was to catch episodes. Once your doctors have finished, that job is done. Now each buzz and each glance at a number restarts the loop.',
        'The easiest habit to break is the one that is never prompted. Switch off heart alerts, remove the live number from the watch face, move health apps off the home screen, take the phone out of the bedroom. Safety features (emergency SOS, fall detection, medical ID) stay on.',
      ]},
      { title: 'Paraphernalia', art: 'backpack', body: [
        'A home pulse oximeter, a blood-pressure cuff you would never own if you weren\'t worried, bookmarked health pages: put them away in a cupboard, or give them away. Out of sight makes the next step much easier.',
      ]},
    ],
    practice: [{ type: 'form', formId: 'watchSetup' }],
    reflection: 'How do you feel about the watch without the heart alerts?',
  },
  {
    id: 'S2.3', phase: 'strengthen', week: 2, title: 'Your checking-free plan', minutes: 12,
    cards: [
      { title: 'One source at a time', art: 'jars', body: [
        'Stopping everything at once is very hard. Instead, make a plan for each source: watch, pulse, ECG, gadgets, Googling, asking someone, scanning the body. For each one, choose stop, cap ("once a day, not at night") or delay ("wait 30 minutes"), and keep the rule the same on good and bad days.',
        'The destination is no checking at all. Each week, tighten one rule.',
      ]},
      { title: 'Costs and benefits', art: 'scale', body: [
        'Be honest: what does checking give you? A minute of relief. What does it cost? Time, attention, a louder alarm, a life organised around your heart.',
        'If you slip, drop a pebble honestly and carry on. A slip is information, not failure. The trend over weeks is what matters.',
      ]},
    ],
    practice: [{ type: 'form', formId: 'checkingPlan' }, { type: 'budget' }],
    reflection: 'Which source will you tighten first?',
  },

  // ───────────────────────── week 3: reassurance, doctors, and the body lab ─────────────────────────
  {
    id: 'S3.1', phase: 'strengthen', week: 3, title: 'Reassurance from loved ones', minutes: 12,
    cards: [
      { title: 'Love that feeds the fear', art: 'team', body: [
        'When you ask someone close "Is my heart OK?" and they reassure you, they give love, and the anxiety takes it as fuel. A few minutes later the question comes back, a little hungrier.',
        'The kindest help is not an answer. It is warmth plus a nudge back to the practice: "I can see you\'re scared. We agreed I won\'t answer the heart question. Let\'s do the steps together."',
      ]},
      { title: 'Make the plan together, on a calm day', art: 'family', body: [
        'Sit together for ten minutes. Write down what you usually ask, the warm words they will use instead, and what you will do together. Show them the "For family" page in the toolbox.',
        'This is a team plan, not a rejection. They are not saying no to you. You are both saying no to the anxiety.',
      ]},
    ],
    practice: [{ type: 'form', formId: 'reassurancePlan' }],
    reflection: 'How did it feel to make this plan together?',
  },
  {
    id: 'S3.2', phase: 'strengthen', week: 3, title: 'Doctor Google and real doctors', minutes: 12,
    cards: [
      { title: 'More information is not more certainty', art: 'search', body: [
        'Searching symptoms feels like gathering facts, but there is always one more page and one more rare possibility, and fear finds the worst one. From today, symptom searches become paper boats in the worry river.',
        'Start a no-search window: a stretch of time with no health searching, growing a little every few days.',
      ]},
      { title: 'A medical plan, not medical avoidance', art: 'doctor', body: [
        'You deserve good, ordinary medical care. Write a plan with one trusted doctor: your regular check-ups, the specific signs the doctor says need a call, and a wait-a-week rule for grey sensations. Write them down, wait a week, and see whether they still matter.',
        'Your plan always lets you act on the true red flags on the safety card at once.',
      ]},
    ],
    practice: [{ type: 'form', formId: 'medicalPlan' }],
    reflection: 'What do you usually search for, and how do you feel afterwards?',
  },
  {
    id: 'S3.3', phase: 'strengthen', week: 3, title: 'The Body Lab: first visit', minutes: 15,
    cards: [
      { title: 'Feeling it on purpose', art: 'lab', body: [
        'The deepest fear is of the sensations themselves. The most powerful practice is to bring them on deliberately, for a short time, and watch what really happens.',
        'In the Body Lab you try a few short exercises (staring, tensing, spinning, stairs and more) and rate two things: how scary the feeling was, and how much it resembled a real wave.',
      ]},
      { title: 'Lab rules', art: 'curious', body: [
        '- Make the feeling as strong as you can. A timid version teaches little.',
        '- Keep going about 30 seconds after the feeling starts.',
        '- No checking, no sitting down to recover, no breathing tricks during the exercise.',
        '- The gentle exercises are always open. The ones that raise the heart rate open after your doctor has said yes once (Settings → "My doctor said yes").',
      ]},
    ],
    practice: [{ type: 'game', game: 'bodyLab' }],
    reflection: 'Which exercise felt most like a real wave?',
  },

  // ───────────────────────── week 4: facing it ─────────────────────────
  {
    id: 'S4.1', phase: 'strengthen', week: 4, title: 'Why facing fear heals', minutes: 10,
    cards: [
      { title: 'The brain learns from surprises', art: 'learning', body: [
        'Fear is unlearned by experience. When you face something and the feared outcome doesn\'t come, the brain writes a new memory. The bigger the surprise (the gap between what anxiety predicted and what happened), the stronger the new memory.',
        'So every practice starts with a forecast from the anxiety, and ends with what really happened.',
      ]},
      { title: 'Fear is welcome', art: 'expand', body: [
        'You don\'t need the fear to go down for a practice to work. Feeling it and staying is the training. Some days it will be loud. Those are often the most useful days.',
        'Vary it: different times, places, moods; tired, hungry, after tea. The more varied the practice, the more the learning sticks everywhere.',
      ]},
    ],
    practice: [{ type: 'game', game: 'theory' }],
    reflection: 'What is one thing you have stopped doing because of the fear?',
  },
  {
    id: 'S4.2', phase: 'strengthen', week: 4, title: 'Find the real fear, build your ladder', minutes: 15,
    cards: [
      { title: '"And then?"', art: 'detective', body: [
        'Behind each avoided situation sits a specific fear. Ask: "If I did it, what would happen? And then? And then?" until you reach the real one. It may be "I\'ll collapse alone", "I won\'t get help in time", or "I\'ll never stop feeling like this".',
        'Knowing the real fear tells you what to test.',
      ]},
      { title: 'Your ladder', art: 'ladder', body: [
        'List 8–12 situations you avoid or get through with dread, and rate each 0–100. Include one thing you stopped after a single scary sensation, and a few everyday heart-raisers: stairs, a brisk walk, a hot shower, a strong tea, a warm room.',
        'You may start in the middle, and later you can let the app draw a rung at random, because real life doesn\'t come in order.',
      ]},
    ],
    practice: [{ type: 'form', formId: 'ladder' }],
    reflection: 'What is the real fear underneath your ladder?',
  },
  {
    id: 'S4.3', phase: 'strengthen', week: 4, title: 'The first experiment', minutes: 15,
    cards: [
      { title: 'Today\'s experiment', art: 'forecast', body: [
        'Choose a rung. Let the anxiety make its forecast and rate how sure it is. Then do the step fully: no checking, no reassurance, no escaping early. When you feel like leaving, stay ten more seconds.',
        'Afterwards, write what actually happened and how you coped. A rung is climbed after two practices without safety behaviours, whatever the fear did.',
      ]},
    ],
    practice: [{ type: 'game', game: 'forecast' }],
    reflection: 'How did the outcome compare with the forecast?',
  },

  // ───────────────────────── week 5: daily body practice and attention ─────────────────────────
  {
    id: 'S5.1', phase: 'strengthen', week: 5, title: 'Body Lab, every day', minutes: 15,
    cards: [
      { title: 'The daily dose', art: 'lab', body: [
        'Pick the exercise that felt most like a real wave and was at least a little scary. Do three rounds today: each time, keep going 30 seconds past the start of the feeling, then rate it, let it settle by itself, and go again.',
        'Repeat daily. When the day\'s highest fear stays low for a few days, move on to the next exercise.',
      ]},
      { title: 'What to watch for', art: 'curious', body: [
        'Doing it mildly, only when someone is home, only on calm days, or while thinking of dinner: these are ways of not really doing it. Bring it on fully. The goal is to be less afraid of the feeling, not to make the feeling disappear.',
      ]},
    ],
    practice: [{ type: 'game', game: 'bodyLab' }],
    reflection: 'What did the feeling do across the three rounds?',
  },
  {
    id: 'S5.2', phase: 'strengthen', week: 5, title: 'Everyday heart-raisers', minutes: 12, needsDoctorOk: true,
    cards: [
      { title: 'Life raises the heart rate', art: 'walk', body: [
        'Climbing stairs, a brisk walk, dancing, a hot bath, a heavy meal, an exciting film, a strong cup of tea: all of them make the heart beat faster. If you have been avoiding them, they belong on your ladder.',
        'Do them on purpose, a few times a week, and do something ordinary afterwards instead of sitting and listening.',
      ]},
    ],
    practice: [{ type: 'game', game: 'forecast' }],
    gentleAlternative: [{ type: 'game', game: 'bodyLab' }],
    reflection: 'Which everyday heart-raiser did you take back?',
  },
  {
    id: 'S5.3', phase: 'strengthen', week: 5, title: 'The Sound Garden: training attention', minutes: 15,
    cards: [
      { title: 'A gym for attention', art: 'sound', body: [
        'A mind that has spent months listening to the heart gets stuck facing inward. The Sound Garden trains attention to move where you choose: first focus on one sound, then switch quickly between sounds, then spread out to hear them all.',
        'It is not distraction. Do it once or twice a day when you are not in a wave, eyes open, about 12 minutes. Thoughts and sensations may come; let them, and return to the sounds.',
      ]},
    ],
    practice: [{ type: 'game', game: 'soundGarden' }],
    reflection: 'Where was your attention during the day: inward, outward, or both?',
  },

  // ───────────────────────── week 6: the worry story and uncertainty ─────────────────────────
  {
    id: 'S6.1', phase: 'strengthen', week: 6, title: 'The worry story', minutes: 15,
    cards: [
      { title: 'Facing the thought itself', art: 'story', body: [
        'Some fears live only as a story in the mind. Avoiding the story keeps it frightening. Write it in the present tense, with detail, as if it is happening now. End it in uncertainty: "I don\'t know how this ends." Never end it with a rescue.',
        'Read it slowly every day for about 15 minutes, not near bedtime, until it starts to feel boring. Boring is the goal.',
      ]},
    ],
    practice: [{ type: 'form', formId: 'worstCase' }],
    reflection: 'How did the fear change between the first and the last reading?',
  },
  {
    id: 'S6.2', phase: 'strengthen', week: 6, title: 'Living with not knowing', minutes: 12,
    cards: [
      { title: 'Certainty is not on the menu', art: 'sky', body: [
        'Health anxiety demands certainty: 100% proof of perfect health. Nobody, anywhere, has that, about any part of the body. Every check is an attempt to buy a certainty that isn\'t for sale.',
        'The skill is not to win the argument, but to let the question stay open and carry on with life.',
      ]},
      { title: '"This time it\'s real"', art: 'forecast', body: [
        'Every wave arrives saying "this one is different". That is the alarm\'s job: it always sounds convincing. Notice the sentence, name it ("there\'s the this-time-it\'s-real story"), and let it ride along.',
        'Practise waiting: when a worry wants an answer right now, wait 30 minutes before doing anything about it, and notice what happens to the urgency.',
      ]},
    ],
    practice: [{ type: 'game', game: 'leaves' }],
    reflection: 'What uncertainties do you already live with every day, without checking?',
  },
  {
    id: 'S6.3', phase: 'strengthen', week: 6, title: 'Halfway review', minutes: 12,
    cards: [
      { title: 'Halfway', art: 'compass', body: [
        'Answer the health-worry questionnaire and look at your treasures, your ladder and your forecaster record.',
        'If nothing has moved at all, or waves are much more frequent, it is a good moment to book a CBT psychologist and take your progress page. Using every tool is wise, not failure.',
      ]},
    ],
    practice: [{ type: 'measure', measureId: 'WI7' }, { type: 'game', game: 'theory' }],
    reflection: 'What is still hardest, and what is one small step towards it?',
  },

  // ───────────────────────── week 7: thoughts as guesses ─────────────────────────
  {
    id: 'S7.1', phase: 'strengthen', week: 7, title: 'Catching the hot thought', minutes: 15,
    cards: [
      { title: 'Thoughts are guesses', art: 'detective', body: [
        'In a wave, the mind produces a "hot thought": "My heart is failing." It feels like a fact. It is a guess, and an anxious one.',
        'A thought record slows the guess down: the situation, what you felt in your body, all the thoughts (then pick the hottest), the facts on each side, and a balanced view that you can actually believe.',
      ]},
      { title: 'Facts vs interpretations', art: 'scale', body: [
        '"My heart beat fast for five minutes" is a fact. "It was dangerous" is an interpretation. Keep the evidence columns to facts.',
        'And don\'t use a thought record to argue yourself into feeling safe. That turns it into reassurance. The goal is a wider view, not a verdict.',
      ]},
    ],
    practice: [{ type: 'form', formId: 'thoughtRecord' }],
    reflection: 'How did writing it down change the thought?',
  },
  {
    id: 'S7.2', phase: 'strengthen', week: 7, title: 'Track record and coping record', minutes: 12,
    cards: [
      { title: 'The forecaster\'s record', art: 'forecast', body: [
        'Anxiety forecasts disaster with every wave. Look at its record: how many waves since they began, how many forecasts of disaster, and how each actually ended. Also note how you coped each time, because anxiety underestimates you as much as it overestimates danger.',
      ]},
      { title: 'All the causes', art: 'pie', body: [
        'When a sensation comes, list every possible cause you can think of: adrenaline, tea, a heavy meal, tiredness, a sudden movement, heat, stress, a poor night, hormones, excitement. The scary explanation becomes one slice among many, and you don\'t need to know which slice it is.',
      ]},
    ],
    practice: [{ type: 'form', formId: 'evidenceCheck' }],
    reflection: 'If the anxiety were a weather forecaster, how would you rate it?',
  },
  {
    id: 'S7.3', phase: 'strengthen', week: 7, title: 'Climb with a random draw', minutes: 15,
    cards: [
      { title: 'Shake up the order', art: 'ladder', body: [
        'Real life doesn\'t deliver fears in tidy order. This week, let the ladder draw a rung for you at random now and then, and try a familiar rung in a new place or at a new time of day.',
        'If a hot thought shows up during the practice, catch it in a thought record afterwards.',
      ]},
    ],
    practice: [{ type: 'game', game: 'ladder' }, { type: 'budget' }],
    reflection: 'What did today\'s practice teach you?',
  },

  // ───────────────────────── week 8: unhooking ─────────────────────────
  {
    id: 'S8.1', phase: 'strengthen', week: 8, title: 'The defusion workshop', minutes: 15,
    cards: [
      { title: 'You are not your thoughts', art: 'leaves', body: [
        'Arguing with a thought keeps you tangled in it. Defusion means stepping back and seeing a thought as words passing through: "I\'m having the thought that my heart is failing."',
        'There are many ways in: thank your mind, name the story ("ah, the heart story again"), say it in a silly voice, sing it, or put it on a leaf on a stream. Try several, keep the two or three that work for you.',
      ]},
      { title: 'Not a trick to feel better', art: 'sky', body: [
        'Defusion is not a way to make the thought go away. Sometimes it fades, sometimes it stays. The point is that it no longer pushes you around.',
      ]},
    ],
    practice: [{ type: 'game', game: 'leaves' }],
    reflection: 'Which defusion move worked best for you?',
  },
  {
    id: 'S8.2', phase: 'strengthen', week: 8, title: 'Making room for the thump', minutes: 12,
    cards: [
      { title: 'Observe, breathe, allow', art: 'expand', body: [
        'When a sensation comes, try expansion. Observe it like a curious scientist: where exactly is it, how big, what shape, does it move? Breathe into and around it, softly. Allow it: make room for it, the way you would let an awkward guest sit in the corner.',
        'You are not trying to change it. You are making space for it to be there while you live.',
      ]},
      { title: 'The sky and the weather', art: 'sky', body: [
        'Your feelings are like weather: storms, clouds, sunshine. You are like the sky. The sky has room for every kind of weather, and no storm ever hurts the sky.',
      ]},
    ],
    practice: [{ type: 'game', game: 'noting' }],
    reflection: 'What happened when you made room instead of pushing?',
  },
  {
    id: 'S8.3', phase: 'strengthen', week: 8, title: 'Willing, with passengers', minutes: 15,
    cards: [
      { title: 'The willingness switch', art: 'bus', body: [
        'Willingness isn\'t liking it. It is saying yes to the feeling, fully, for the sake of something you care about. "I\'m willing to feel the thump to walk to the market."',
        'Imagine driving a bus towards your life. Fear and Worry are passengers, shouting "Turn back! Check!" You don\'t have to throw them off, and you don\'t have to obey them. They can ride along while you drive.',
      ]},
    ],
    practice: [{ type: 'game', game: 'forecast' }],
    reflection: 'Which passenger shouted loudest, and where did you drive anyway?',
  },

  // ───────────────────────── week 9: living fully ─────────────────────────
  {
    id: 'S9.1', phase: 'strengthen', week: 9, title: 'Your compass', minutes: 12,
    cards: [
      { title: 'Filling the space', art: 'compass', body: [
        'As the anxiety shrinks, it leaves space. Fill it with what matters, or the worry will move back in.',
        'Choose what matters in a few areas of life (family, health, joy, work, friends) and pick one small, specific step for this week: what, when, where.',
      ]},
      { title: 'Goals for the living', art: 'garden', body: [
        '"No more palpitations" is a goal a statue could achieve. Choose goals that a living person does: "walk to the temple with my family on Sunday", "say yes to my friend\'s invitation".',
      ]},
    ],
    practice: [{ type: 'form', formId: 'values' }, { type: 'form', formId: 'activityPlan' }],
    reflection: 'What would you love to do again?',
  },
  {
    id: 'S9.2', phase: 'strengthen', week: 9, title: 'Sleep, movement and tea', minutes: 12,
    cards: [
      { title: 'Sleep, the gentle way', art: 'sleep', body: [
        '- Get up at the same time every day, and get daylight in the morning.',
        '- Do your worry planning early in the evening, not in bed.',
        '- Keep the last hour before bed free of demands.',
        '- Bed is for sleep. If you are awake and upset for a long while, get up, do something calm in dim light, and come back when sleepy.',
        '- After a poor night, change nothing: keep your plans and skip the nap.',
      ]},
      { title: 'Movement and caffeine', art: 'walk', body: [
        'Regular movement lowers baseline arousal and gives the heart honest reasons to beat fast. Aim for a daily walk and some gentle yoga.',
        'Caffeine can itself cause palpitations. If you drink a lot of tea or coffee, taper gently, and none in the six hours before bed. Not because it is dangerous, simply so your alarm has less to react to.',
      ]},
    ],
    practice: [{ type: 'form', formId: 'activityPlan' }],
    reflection: 'Which sleep rule will you try first?',
  },
  {
    id: 'S9.3', phase: 'strengthen', week: 9, title: 'Harder conditions, top rungs', minutes: 15,
    cards: [
      { title: 'Stronger than daily life needs', art: 'mountain', body: [
        'Now combine things: a top rung after a strong tea, on a tired day, alone, without the watch. Practising in harder conditions makes you stronger than everyday life will ever demand.',
        'Use everything you\'ve learned: forecast, do it fully, let the passengers shout, no checking, stay ten more seconds, then write what happened.',
      ]},
    ],
    practice: [{ type: 'game', game: 'ladder' }, { type: 'budget' }],
    reflection: 'What does reaching this rung say about you?',
  },

  // ───────────────────────── week 10: staying well ─────────────────────────
  {
    id: 'S10.1', phase: 'strengthen', week: 10, title: 'What helped: the verdict on the theories', minutes: 12,
    cards: [
      { title: 'Look back', art: 'theory', body: [
        'Answer the questionnaires and re-rate the two theories. Look at your forecaster record, your ladder, your pebbles over the weeks.',
        'You don\'t have to be certain. You only need to decide which theory you will live by.',
      ]},
    ],
    practice: [{ type: 'measure', measureId: 'GAD7' }, { type: 'measure', measureId: 'WI7' }, { type: 'game', game: 'theory' }],
    reflection: 'Which three things helped you most?',
  },
  {
    id: 'S10.2', phase: 'strengthen', week: 10, title: 'Your flare-up plan', minutes: 15,
    cards: [
      { title: 'A flare is not a relapse', art: 'anchor', body: [
        'Waves may visit again: after a stressful week, an illness, poor sleep, a hormonal change. A flare-up is a flat tyre, not a return to the start. You have the tools now, and the second time is usually shorter.',
        'Warning signs are things you DO, not things you feel: checking again, Googling, asking, avoiding, dropping practice.',
      ]},
      { title: 'Write it while you are well', art: 'map', body: [
        'Your plan: what I learned about my anxiety; what helps short-term but hurts long-term; what really helps. And the steps for a flare: remind yourself it is temporary, write the forecasts, no checking or reassurance, return quickly to anything you\'ve started avoiding, and, if it doesn\'t settle within a few weeks, see a professional.',
      ]},
    ],
    practice: [{ type: 'form', formId: 'relapsePlan' }],
    reflection: 'What would you say to yourself on the day a wave returns?',
  },
  {
    id: 'S10.3', phase: 'strengthen', week: 10, title: 'Graduation', minutes: 10,
    cards: [
      { title: 'You did this', art: 'graduate', body: [
        'Ten weeks. You let waves come, surfed urges, stopped paying the loop, felt sensations on purpose, faced what you avoided. The learning lives in you now, not in this app.',
        'Feeling a little flat after finishing something big is common. It isn\'t a sign of anything going wrong.',
      ]},
      { title: 'Keeping it fresh', art: 'calendar', body: [
        '- A short practice on most days.',
        '- A booster practice from your ladder now and then, because skipping practice for months lets fear grow back.',
        '- A monthly visit to Home Shore.',
      ]},
    ],
    practice: [{ type: 'game', game: 'recipe' }, { type: 'budget' }],
    reflection: 'Write a short note to yourself, to read on a hard day.',
  },

  // ───────────────────────── STAY WELL · monthly ─────────────────────────
  {
    id: 'SW', phase: 'staywell', week: 11, title: 'Monthly check-in', minutes: 8,
    cards: [
      { title: 'Staying well', art: 'calendar', body: [
        'A quick monthly visit: answer the questionnaires, glance at your pebbles, and do one booster practice from your ladder or the Body Lab.',
        'If you notice old behaviours creeping back (checking, searching, avoiding), open your flare-up plan and restart a few Strengthen steps. That is not going backwards. It is maintenance.',
      ]},
    ],
    practice: [{ type: 'measure', measureId: 'GAD7' }, { type: 'measure', measureId: 'WI7' }, { type: 'measure', measureId: 'PHQ9' }, { type: 'game', game: 'bodyLab' }],
    reflection: 'How has this month been?',
  },
];

export const sessionById = (id: string) => PROGRAMME.find((s) => s.id === id);
