import type { Session } from './types';

// CALM PATH: the programme (content v1.2).
// Self-guided CBT for health anxiety: Quick Start (week 1, daily), then Strengthen (weeks 2-10,
// three short sessions a week), then Stay Well. Grounded in Veale & Willson (Overcoming Health
// Anxiety), Weekes (Self-Help for Your Nerves), McDonagh (DARE), Greenberger & Padesky (Mind Over
// Mood), exposure by inhibitory learning (Abramowitz/Craske), ACT (Harris), habit loops (Brewer).
// Written fresh in plain words; no book text is copied.
//
// House rules for every line here: never promise that a symptom is harmless, never mention a
// heart-rate number, never tell her to check anything. Teach allowing, not arguing.

export const PROGRAMME: Session[] = [
  // ───────────────────────── QUICK START · week 1 (one a day) ─────────────────────────
  {
    id: 'QS1', phase: 'quickstart', week: 1, title: 'Welcome. Your story, and the way out', minutes: 10,
    cards: [
      { title: 'Why this app exists', body: [
        'Maybe for months your heart has raced, thumped and frightened you. You may have been through many tests, and your doctors found no heart disease. What drives the fear has a name: health anxiety.',
        'Knowing that is a big step. But knowing alone does not switch the fear off, which is why a wave can still arrive. This app is the training that teaches your body and mind to let those waves pass.',
      ]},
      { title: 'How it works', body: [
        'Health anxiety is kept alive by a loop: a sensation, a frightening thought, fear, more sensations, and then checking or asking for reassurance. Checking brings relief for a few minutes, and that relief teaches the brain that the danger was real.',
        'So this app will not hand you reassurance. It will teach you something stronger: how to let the feeling come, and how to stop checking, so that your brain learns for itself.',
      ]},
      { title: 'The plan', body: [
        '- Week 1, Quick Start: 7 short daily sessions. You learn the SURGE button, slow breathing and the urge timer.',
        '- Weeks 2–10, Strengthen: three sessions of 10–15 minutes a week. You drop the checking, face what you avoid, and unhook from the thoughts.',
        '- After that, Stay Well: a short check-in once a month.',
        'Small and steady beats big and rare. Missing a day is fine. Just do the next one.',
      ]},
    ],
    practice: [{ type: 'breathe', minutes: 3 }],
    reflection: 'If the anxiety took up much less space in your life, what would you do more of?',
  },
  {
    id: 'QS2', phase: 'quickstart', week: 1, title: 'The body\'s alarm', minutes: 10,
    cards: [
      { title: 'A smoke alarm, set too sensitive', body: [
        'Your body has an alarm system built to protect you. When it fires, it releases adrenaline. The heart beats faster and harder, breathing quickens, hands may tremble, you feel hot or shaky, and your attention locks onto the body.',
        'In health anxiety the alarm has become oversensitive. It fires at ordinary signals, such as a single strong beat or a flutter, the way a kitchen smoke alarm shrieks at toast.',
      ]},
      { title: 'Noticing makes it louder', body: [
        'The more you watch your heart, the more you notice it, and every beat you notice feels like a message. Attention works like a magnifying glass.',
        'This is why the app does not show heart rate. Watching the number keeps the magnifying glass in place.',
      ]},
      { title: 'Your tool for the alarm: SURGE', body: [
        'The big SURGE button guides you through about two minutes of: notice → let it come → breathe out slowly → float → let time pass.',
        'Today, while you are calm, try it once as a rehearsal, so that you know it well before you need it.',
      ]},
    ],
    practice: [{ type: 'surge-practice' }, { type: 'breathe', minutes: 5 }],
    reflection: 'What sensation usually sets your alarm off first?',
  },
  {
    id: 'QS3', phase: 'quickstart', week: 1, title: 'Your fear cycle', minutes: 12,
    cards: [
      { title: 'Drawing the circle', body: [
        'Every wave follows the same circle. When you can see the circle, you can step out of it.',
        'Think of a recent wave. Write down what happened at each step: what you noticed, what you thought, what you felt, what your body did, and what you did to feel safe.',
      ]},
      { title: 'Where you can step out', body: [
        'You cannot stop a sensation from arriving. But you can change two links: how you respond to the thought ("Here is the alarm again"), and what you do (let it come instead of checking). The next sessions train exactly these two links.',
      ]},
    ],
    practice: [{ type: 'form', formId: 'fearCycle' }],
    reflection: 'Looking at your circle, which link feels easiest to change first?',
  },
  {
    id: 'QS4', phase: 'quickstart', week: 1, title: 'First fear, second fear', minutes: 10,
    cards: [
      { title: 'Two different fears', body: [
        'Dr Claire Weekes noticed that every frightening wave has two parts. The first fear is the automatic jolt that comes by itself, like a flash. The second fear is what we add afterwards: "Oh no, here it comes again, what if this time it is serious?"',
        'The first fear passes quickly if it is left alone. The second fear keeps feeding adrenaline, and it is the second fear that keeps a wave going.',
      ]},
      { title: 'Four words', body: [
        '- Face it: don\'t run from the feeling.',
        '- Accept it: let it be there. "Let it come."',
        '- Float: loosen the body, as if lying on water.',
        '- Let time pass: waves are not cured by force, only by time.',
      ]},
      { title: 'Practise floating', body: [
        'Sit back and let your shoulders sag. Breathe out slowly. Imagine warm, still water holding you. Each time a worry comes, let it float past and go back to the water.',
      ]},
    ],
    practice: [{ type: 'breathe', minutes: 5 }],
    reflection: 'In your last wave, what was your "second fear" thought?',
  },
  {
    id: 'QS5', phase: 'quickstart', week: 1, title: 'Why checking backfires', minutes: 10,
    cards: [
      { title: 'The reassurance trap', body: [
        'Looking at the watch, taking an ECG, feeling your pulse, Googling, or asking someone "Am I OK?" all bring relief. And the relief is the trap.',
        'Each time relief follows a check, your brain learns two things: that the sensation was dangerous, and that you only survived because you checked. So the next sensation feels more urgent, and the next check is needed sooner.',
      ]},
      { title: 'Not yet stopping, just counting', body: [
        'This week you don\'t have to stop anything. Just count. Each time you check or ask, tap the matching counter on the home screen. Counting by itself often starts to shrink the habit, because it turns an automatic act into a noticed one.',
      ]},
    ],
    practice: [{ type: 'breathe', minutes: 5 }],
    reflection: 'Which check do you do most often in a day?',
  },
  {
    id: 'QS6', phase: 'quickstart', week: 1, title: 'Urges are waves', minutes: 10,
    cards: [
      { title: 'Surfing instead of obeying', body: [
        'The pull to check is an urge, and urges behave like waves: they rise, peak and fall, even if you do nothing. You don\'t have to fight the urge, and you don\'t have to obey it. You can watch it, with curiosity.',
      ]},
      { title: 'The urge timer', body: [
        'When you feel the pull to check, tap "Urge to check". A voice guides you for three minutes. Notice where the urge sits in your body, rate it, breathe, and watch it change.',
        'After three minutes you choose. Often the urge has dropped. If not, you can surf ten minutes more. Every urge you surf weakens the habit.',
      ]},
    ],
    practice: [{ type: 'urge', minutes: 3 }],
    reflection: 'What did you notice about the urge as the minutes passed?',
  },
  {
    id: 'QS7', phase: 'quickstart', week: 1, title: 'Your starting point', minutes: 12,
    cards: [
      { title: 'One week done', body: [
        'You now know the four tools: SURGE for a wave, Breathe twice a day, the urge timer when you want to check, and the counters.',
        'Today you answer two short questionnaires. They are not a test. They are a starting line, so that you can see your progress in a few weeks.',
      ]},
      { title: 'What comes next', body: [
        'From next week, sessions come three times a week. Weeks 2–3: dropping the checks and the reassurance. Weeks 4–6: facing what you avoid, gently, one step at a time. Weeks 7–8: unhooking from the thoughts. Weeks 9–10: living fully, and a plan to stay well.',
      ]},
    ],
    practice: [{ type: 'measure', measureId: 'GAD7' }, { type: 'measure', measureId: 'WI7' }],
    reflection: 'What has been most useful this week?',
  },

  // ───────────────────────── STRENGTHEN · week 2: map and loosen the safety behaviours ─────────────────────────
  {
    id: 'S2.1', phase: 'strengthen', week: 2, title: 'Your safety behaviours', minutes: 12,
    cards: [
      { title: 'Everything you do to feel safe', body: [
        'Safety behaviours are the things we do to prevent, check on or escape a feared outcome. They feel protective. But they stop the brain from ever learning that the feared outcome does not come.',
        'Some are obvious, like checking the watch. Some are hidden: avoiding stairs, keeping the phone close "in case", sitting down at the first flutter, avoiding coffee, never being alone.',
      ]},
      { title: 'Make your list', body: [
        'Write every one you can think of, and rate how hard each would be to give up. Use your counter totals from week 1. There is no need to stop anything today.',
      ]},
    ],
    practice: [{ type: 'form', formId: 'safetyInventory' }],
    reflection: 'Which safety behaviour surprised you when you wrote it down?',
  },
  {
    id: 'S2.2', phase: 'strengthen', week: 2, title: 'Turn the watch into a calm coach', minutes: 10,
    cards: [
      { title: 'Change the job of your watch', body: [
        'If you wear a smartwatch: while your heart was still being checked, its job was to catch episodes. Once your doctors have finished, that job is done. Now each "high heart rate" buzz and each glance at a number restarts the fear cycle.',
        'So the watch gets a new job: a quick button opens a breathing exercise, and the alarms that feed the fear are switched off. The safety features (emergency SOS, fall detection, medical ID) stay on.',
      ]},
      { title: 'Do it now, step by step', body: [
        'Tick each change as you make it. It takes about ten minutes. If one step feels too hard today, leave it and come back tomorrow. No watch? Simply complete this step.',
      ]},
    ],
    practice: [{ type: 'form', formId: 'watchSetup' }],
    reflection: 'How do you feel about the watch without the heart-rate alerts?',
  },
  {
    id: 'S2.3', phase: 'strengthen', week: 2, title: 'Your checking budget', minutes: 10,
    cards: [
      { title: 'Less checking, step by step', body: [
        'Stopping all checking at once is very hard. So we use a budget that shrinks every week or two:',
        '- Level 1: health data at most once a day, not at night',
        '- Level 2: at most every other day',
        '- Level 3: at most once a week',
        '- Level 4: no checking. Your body looks after itself.',
        'The home screen shows today\'s rule. When the urge comes outside the budget, use the urge timer.',
      ]},
      { title: 'If you slip', body: [
        'A slip is not failure. Tap the counter honestly, notice what pulled you, and carry on. The trend over weeks is what matters.',
      ]},
    ],
    practice: [{ type: 'budget' }, { type: 'urge', minutes: 3 }],
    reflection: 'Which level did you choose, and what will help you keep it?',
  },

  // ───────────────────────── week 3: reassurance, Google, worry time ─────────────────────────
  {
    id: 'S3.1', phase: 'strengthen', week: 3, title: 'Reassurance from loved ones', minutes: 12,
    cards: [
      { title: 'Love that feeds the fear', body: [
        'When you ask someone close "Is my heart OK?" and they reassure you, they give love, and the anxiety takes it as fuel. A few minutes later the question comes back.',
        'Families can help most by not answering the question, and by helping you ride the wave instead.',
      ]},
      { title: 'Make a plan together', body: [
        'Sit together for ten minutes and fill in the plan: what you usually ask, the warm words they will use instead, and what you will do together (for example, SURGE and then a short walk).',
        'This is a team plan, not a rejection. They are not saying no to you. You are both saying no to the anxiety.',
      ]},
    ],
    practice: [{ type: 'form', formId: 'reassurancePlan' }],
    reflection: 'How did it feel to make this plan together?',
  },
  {
    id: 'S3.2', phase: 'strengthen', week: 3, title: 'Doctor Google', minutes: 10,
    cards: [
      { title: 'Searching symptoms', body: [
        'Searching a symptom feels like gathering information. In practice it is a reassurance check that never satisfies: there is always one more page and one more rare possibility, and fear finds the worst one.',
        'From today, symptom searching goes into the Worry box instead. Write the question down and park it until worry time.',
      ]},
      { title: 'The worry box', body: [
        'Tap "Worry box", write the worry in a line, and close it. That\'s all. You are not ignoring it. You are giving it an appointment.',
      ]},
    ],
    practice: [{ type: 'urge', minutes: 3 }],
    reflection: 'What do you usually search for, and how do you feel after?',
  },
  {
    id: 'S3.3', phase: 'strengthen', week: 3, title: 'Worry time', minutes: 10,
    cards: [
      { title: 'A fixed time for worry', body: [
        'Worries that arrive during the day get parked in the box. At one set time each evening (15 minutes, never at bedtime) you open the box.',
        'For each worry, ask: is there one practical step? If yes, write it. If not, let it go back. Many parked worries have faded by the evening, which is a lesson in itself.',
      ]},
      { title: 'Sleep note', body: [
        'Poor sleep makes the alarm more sensitive. Keep regular sleep and wake times, dim the lights in the last hour, keep screens and news away from bed, and use the Wind-down audio.',
      ]},
    ],
    practice: [{ type: 'worry-time' }],
    reflection: 'How many of today\'s parked worries still felt urgent by worry time?',
  },

  // ───────────────────────── week 4: facing it ─────────────────────────
  {
    id: 'S4.1', phase: 'strengthen', week: 4, title: 'Why facing fear heals', minutes: 10,
    cards: [
      { title: 'How the brain learns safety', body: [
        'Fear is unlearned by experience, not by argument. When you step into a feared situation, without checking or escaping, and the feared outcome does not come, the brain writes a new memory.',
        'The bigger the gap between what you predicted and what happened, the stronger the new learning. That is why each practice starts with a prediction.',
      ]},
      { title: 'Fear during practice is welcome', body: [
        'You don\'t need the fear to go down for a practice to work. Feeling anxious and doing it anyway is the training. Aim to stay with it, not to feel calm.',
      ]},
    ],
    practice: [{ type: 'breathe', minutes: 5 }],
    reflection: 'What is one thing you have stopped doing because of the fear?',
  },
  {
    id: 'S4.2', phase: 'strengthen', week: 4, title: 'Build your ladder', minutes: 15,
    cards: [
      { title: 'Small steps up', body: [
        'Make a list of 8–12 situations you avoid, or get through only with dread. Rate each one 0–100 for how frightening it would be. Include easy ones (around 20–30) and hard ones (80+).',
        'Next session you start at the bottom. You move up a rung only after doing one twice, without checking, with fear lower than at the start.',
      ]},
      { title: 'Ideas', body: [
        '- A 20-minute walk alone; then a longer one',
        '- An evening alone at home',
        '- Going somewhere far from a hospital',
        '- Reading an article about heart disease',
        '- A gentle yoga class',
        '- Leaving the watch at home for an afternoon',
      ]},
    ],
    practice: [{ type: 'form', formId: 'ladder' }],
    reflection: 'Which rung would you be proud to reach by week 10?',
  },
  {
    id: 'S4.3', phase: 'strengthen', week: 4, title: 'The first rung', minutes: 15,
    cards: [
      { title: 'Today\'s practice', body: [
        'Choose your lowest rung. Before you start, write your prediction and how sure you are. Then do it fully, without checking, without reassurance, and without escaping early. Stay until the end.',
        'Afterwards, write what actually happened and what you learned. Then compare it with your prediction.',
      ]},
    ],
    practice: [{ type: 'form', formId: 'exposureLog' }],
    reflection: 'How did the outcome compare with what you predicted?',
  },

  // ───────────────────────── week 5: climbing; the worry story ─────────────────────────
  {
    id: 'S5.1', phase: 'strengthen', week: 5, title: 'Up the ladder', minutes: 15,
    cards: [
      { title: 'Repeat and climb', body: [
        'Repeat your last rung, or move up if it has become easier. Try to practise 3–4 times this week. Short and frequent works better than long and rare.',
        'Vary it: a different time of day, a different place, after coffee, when tired. Variety makes the new learning stronger.',
      ]},
    ],
    practice: [{ type: 'form', formId: 'exposureLog' }],
    reflection: 'What made this practice easier or harder than last time?',
  },
  {
    id: 'S5.2', phase: 'strengthen', week: 5, title: 'Writing the worry story', minutes: 15,
    cards: [
      { title: 'Facing the thought itself', body: [
        'Some fears live only in the mind: the worst-case story. Avoiding the story keeps it frightening. Facing it on paper, again and again, takes its power away.',
        'Write the feared story in the present tense, with detail, as if it is happening. Read it slowly. Rate your fear. Read it once a day this week. It will start to feel boring, and boring is the goal.',
      ]},
      { title: 'Be kind to yourself', body: [
        'This is hard. If it feels too much, write a gentler version first and build up.',
      ]},
    ],
    practice: [{ type: 'form', formId: 'worstCase' }],
    reflection: 'How did your fear change between the first and last reading?',
  },
  {
    id: 'S5.3', phase: 'strengthen', week: 5, title: 'Check-in and next level', minutes: 10,
    cards: [
      { title: 'Look how far you have come', body: [
        'Open Progress and look at your counters and practice logs since week 1. Then answer the questionnaire again.',
        'If checking has fallen, move your checking budget down one level.',
      ]},
    ],
    practice: [{ type: 'measure', measureId: 'GAD7' }, { type: 'budget' }],
    reflection: 'What change are you most proud of so far?',
  },

  // ───────────────────────── week 6: body sensations (gated) ─────────────────────────
  {
    id: 'S6.1', phase: 'strengthen', week: 6, title: 'Feeling it on purpose', minutes: 10,
    cards: [
      { title: 'Making friends with the sensations', body: [
        'The deepest fear is of the sensations themselves: a racing heart, breathlessness, dizziness. The most powerful practice is to bring these feelings on deliberately, in a planned way, and let them peak and fade without checking.',
        'Each time, the brain learns that the sensation is something it can feel and let pass.',
      ]},
      { title: 'One condition first', body: [
        'Some of these exercises raise your heart rate on purpose. They unlock only after your cardiologist has said yes once. Record it in Settings → "Doctor said yes". Until then you use the gentle versions, which still work.',
      ]},
    ],
    practice: [{ type: 'breathe', minutes: 5 }],
    reflection: 'Which body sensation do you fear most?',
  },
  {
    id: 'S6.2', phase: 'strengthen', week: 6, title: 'Body practice', minutes: 15, needsDoctorOk: true,
    cards: [
      { title: 'Today', body: [
        'Choose one exercise. Predict what you fear will happen. Do it for the full time and let the sensation build. Then sit and let it fade by itself: no checking, no Breathe button, just time. Rate it.',
        'Repeat the same exercise 2–3 times in a row if you can. The fear usually drops a little each time.',
      ]},
    ],
    practice: [{ type: 'form', formId: 'bodyPractice' }],
    gentleAlternative: [{ type: 'form', formId: 'bodyPractice' }],
    reflection: 'What did you notice when the sensation came on purpose?',
  },
  {
    id: 'S6.3', phase: 'strengthen', week: 6, title: 'Halfway review', minutes: 12,
    cards: [
      { title: 'Halfway', body: [
        'You are halfway through Strengthen. Answer the health-worry questionnaire and look at the trend.',
        'If your scores have not moved at all since the start, or the waves are more frequent, this is a good moment to book one appointment with a CBT psychologist and take your Progress page. That is not failure. It is using every tool.',
      ]},
    ],
    practice: [{ type: 'measure', measureId: 'WI7' }],
    reflection: 'What is still hardest, and what is one small step towards it?',
  },

  // ───────────────────────── week 7: thoughts ─────────────────────────
  {
    id: 'S7.1', phase: 'strengthen', week: 7, title: 'Catching the hot thought', minutes: 15,
    cards: [
      { title: 'Thoughts are guesses, not facts', body: [
        'In a wave the mind produces a "hot thought", such as "Something is wrong with my heart." It feels like a fact, but it is a guess, and an anxious one.',
        'A thought record slows the guess down: what happened, what you thought, how strongly you believed it, the evidence on both sides, and a more balanced way of seeing it.',
      ]},
    ],
    practice: [{ type: 'form', formId: 'thoughtRecord' }],
    reflection: 'How did writing it down change the thought?',
  },
  {
    id: 'S7.2', phase: 'strengthen', week: 7, title: 'Your track record', minutes: 12,
    cards: [
      { title: 'What actually happened, every time', body: [
        'Anxiety predicts disaster every time. Let\'s check its record: count the frightening waves you have had in the past year, and how each one ended.',
        'The point is not to convince yourself of anything. The point is to see clearly how accurate the anxiety\'s forecasts have been.',
      ]},
    ],
    practice: [{ type: 'form', formId: 'evidenceCheck' }],
    reflection: 'If the anxiety were a weather forecaster, how would you rate it?',
  },
  {
    id: 'S7.3', phase: 'strengthen', week: 7, title: 'Keep climbing', minutes: 15,
    cards: [
      { title: 'Ladder, with a thought record', body: [
        'Do the next rung of your ladder or a body practice. If a hot thought shows up during it, fill in a short thought record afterwards.',
      ]},
    ],
    practice: [{ type: 'form', formId: 'exposureLog' }, { type: 'budget' }],
    reflection: 'What did today\'s practice teach you?',
  },

  // ───────────────────────── week 8: unhooking (ACT) ─────────────────────────
  {
    id: 'S8.1', phase: 'strengthen', week: 8, title: 'Unhooking from thoughts', minutes: 12,
    cards: [
      { title: 'You are not your thoughts', body: [
        'Sometimes arguing with a thought keeps you tangled in it. Another way is to step back and see it as a thought: words passing through the mind.',
        'Try it: "My heart is failing" becomes "I am having the thought that my heart is failing", then "I notice I am having the thought…". Feel the distance grow.',
      ]},
      { title: 'Leaves on a stream', body: [
        'Close your eyes. Picture a slow stream with leaves floating by. Place each thought on a leaf and watch it drift away. When you get caught, notice that, and return to the stream.',
      ]},
    ],
    practice: [{ type: 'form', formId: 'defusion' }],
    reflection: 'Which thought loosened its grip the most?',
  },
  {
    id: 'S8.2', phase: 'strengthen', week: 8, title: 'Passengers on the bus', minutes: 10,
    cards: [
      { title: 'You drive the bus', body: [
        'Imagine you are driving a bus towards the life you want. Passengers get on: Fear, Worry, the Thump. They shout "Turn back! Check!"',
        'You don\'t have to throw them off, and you don\'t have to obey them. They can ride along and shout while you keep driving where you choose.',
      ]},
    ],
    practice: [{ type: 'form', formId: 'values' }],
    reflection: 'Where do you want your bus to go this month?',
  },
  {
    id: 'S8.3', phase: 'strengthen', week: 8, title: 'Practice with passengers', minutes: 15,
    cards: [
      { title: 'Today', body: [
        'Choose a ladder rung or a body practice. When the passengers start shouting, name them ("Here is Worry"), and keep driving.',
      ]},
    ],
    practice: [{ type: 'form', formId: 'exposureLog' }],
    reflection: 'Which passenger shouted loudest, and what did you do?',
  },

  // ───────────────────────── week 9: living fully ─────────────────────────
  {
    id: 'S9.1', phase: 'strengthen', week: 9, title: 'Getting life back', minutes: 12,
    cards: [
      { title: 'Filling the space', body: [
        'As the anxiety shrinks, it leaves space. Fill that space with what matters, or the worry will move back in.',
        'Look at your values page and the things you stopped doing. Pick one valued activity for this week and give it a day and time.',
      ]},
    ],
    practice: [{ type: 'form', formId: 'activityPlan' }],
    reflection: 'What would you love to do again?',
  },
  {
    id: 'S9.2', phase: 'strengthen', week: 9, title: 'Movement and the body', minutes: 12,
    cards: [
      { title: 'Moving freely', body: [
        'Regular movement lowers baseline anxiety. It also gives the heart a healthy reason to beat fast, which helps the brain separate "fast" from "dangerous".',
        'Aim for a daily walk and two gentle yoga or movement sessions a week, kind to your neck and back. If your doctor has said yes, include some brisk effort that makes you breathe harder.',
      ]},
      { title: 'Everyday basics', body: [
        '- Regular meals and water; caffeine in moderation, earlier in the day',
        '- Take the iron, vitamin D and zinc as your doctor advised',
        '- Daylight every morning, and regular sleep',
      ]},
    ],
    practice: [{ type: 'form', formId: 'activityPlan' }],
    reflection: 'How did your body feel after moving?',
  },
  {
    id: 'S9.3', phase: 'strengthen', week: 9, title: 'The top rungs', minutes: 15,
    cards: [
      { title: 'Reaching higher', body: [
        'Try one of the top rungs of your ladder this week. It will feel big. Use everything you\'ve learned: predict, do it fully, let the passengers shout, no checking, then write what happened.',
      ]},
    ],
    practice: [{ type: 'form', formId: 'exposureLog' }, { type: 'budget' }],
    reflection: 'What does reaching this rung say about you?',
  },

  // ───────────────────────── week 10: stay well ─────────────────────────
  {
    id: 'S10.1', phase: 'strengthen', week: 10, title: 'What helped', minutes: 12,
    cards: [
      { title: 'Look back', body: [
        'Answer the two questionnaires and open Progress. Compare them with your starting point in week 1. Look at your counters, your ladder and your practice logs.',
      ]},
    ],
    practice: [{ type: 'measure', measureId: 'GAD7' }, { type: 'measure', measureId: 'WI7' }],
    reflection: 'Which three things helped you most?',
  },
  {
    id: 'S10.2', phase: 'strengthen', week: 10, title: 'If it comes back', minutes: 15,
    cards: [
      { title: 'A lapse is not a relapse', body: [
        'Waves may visit again, after a stressful week, illness, poor sleep or a hormonal change. A wave does not mean you are back at the start. You now have the skills, and the second time is usually shorter.',
        'Write your plan now, while you feel well: your early warning signs, your first three actions, and who you will talk to.',
      ]},
    ],
    practice: [{ type: 'form', formId: 'relapsePlan' }],
    reflection: 'What would you say to yourself on the day a wave returns?',
  },
  {
    id: 'S10.3', phase: 'strengthen', week: 10, title: 'Graduation', minutes: 10,
    cards: [
      { title: 'You did this', body: [
        'Ten weeks of practice. You let waves pass, surfed urges, faced what you avoided and gave your watch a gentler job. The learning lives in you now, not in this app.',
        'From now on: Breathe on most days, practise a ladder rung now and then so the learning stays fresh, and do a monthly check-in here. SURGE is always one tap away.',
      ]},
    ],
    practice: [{ type: 'breathe', minutes: 5 }, { type: 'budget' }],
    reflection: 'Write a short note to yourself, to read on a hard day.',
  },

  // ───────────────────────── STAY WELL · monthly ─────────────────────────
  {
    id: 'SW', phase: 'staywell', week: 11, title: 'Monthly check-in', minutes: 8,
    cards: [
      { title: 'Staying well', body: [
        'A quick monthly look: answer the questionnaires, glance at your counters, and do one practice from your ladder to keep the learning fresh.',
        'If the scores are climbing, open your "If it comes back" plan, restart the urge timer, and repeat a few Strengthen sessions.',
      ]},
    ],
    practice: [{ type: 'measure', measureId: 'GAD7' }, { type: 'measure', measureId: 'WI7' }, { type: 'measure', measureId: 'PHQ9' }],
    reflection: 'How has this month been?',
  },
];

export const sessionById = (id: string) => PROGRAMME.find((s) => s.id === id);
