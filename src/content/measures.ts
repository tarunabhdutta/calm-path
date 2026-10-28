import type { Measure } from './types';

// Self-checks shown as the "compass".
//  - Anxiety check (7) and Mood check (9): standard public-domain screening items, free to use.
//  - Health worry check (7): original items written for this app.

const twoWeeks = 'Over the last 2 weeks, how often have you been bothered by the following problems?';
const freq = ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'];

export const MEASURES: Record<string, Measure> = {
  GAD7: {
    id: 'GAD7',
    name: 'Anxiety check',
    short: 'Anxiety',
    stem: twoWeeks,
    options: freq,
    items: [
      'Feeling nervous, anxious, or on edge',
      'Not being able to stop or control worrying',
      'Worrying too much about different things',
      'Trouble relaxing',
      'Being so restless that it is hard to sit still',
      'Becoming easily annoyed or irritable',
      'Feeling afraid, as if something awful might happen',
    ],
    everyDays: 7,
    max: 21,
    band: (t) => (t <= 4 ? 'minimal' : t <= 9 ? 'mild' : t <= 14 ? 'moderate' : 'severe'),
  },
  HW7: {
    id: 'HW7',
    name: 'Health worry check',
    short: 'Health worry',
    stem: 'Thinking about the past week, how much does each of these apply to you?',
    options: ['Not at all', 'A little', 'Moderately', 'Quite a lot', 'A great deal'],
    items: [
      'I worried about my health',
      'I felt that something serious might be wrong with my body',
      'Body sensations grabbed my attention',
      'I felt an urge to check my body, my pulse or health data',
      'I looked for reassurance (asking, searching, tests)',
      'Health worries made me avoid things',
      'Health worries got in the way of my day',
    ],
    everyDays: 14,
    max: 28,
    band: (t) => (t <= 7 ? 'low' : t <= 14 ? 'some' : t <= 21 ? 'high' : 'very high'),
  },
  PHQ9: {
    id: 'PHQ9',
    name: 'Mood check',
    short: 'Mood',
    stem: twoWeeks,
    options: freq,
    items: [
      'Little interest or pleasure in doing things',
      'Feeling down, depressed, or hopeless',
      'Trouble falling or staying asleep, or sleeping too much',
      'Feeling tired or having little energy',
      'Poor appetite or overeating',
      'Feeling bad about yourself, or that you are a failure or have let yourself or your family down',
      'Trouble concentrating on things, such as reading the newspaper or watching television',
      'Moving or speaking so slowly that other people could have noticed, or the opposite: being so fidgety or restless that you have been moving around a lot more than usual',
      'Thoughts that you would be better off dead, or of hurting yourself in some way',
    ],
    everyDays: 28,
    max: 27,
    band: (t) => (t <= 4 ? 'minimal' : t <= 9 ? 'mild' : t <= 14 ? 'moderate' : t <= 19 ? 'moderately severe' : 'severe'),
    safetyItem: 8,
  },
};

export function scoreMeasure(answers: number[]): number {
  return answers.reduce((a, b) => a + (b ?? 0), 0);
}

export function triggersSafety(id: string, answers: number[]): boolean {
  const m = MEASURES[id];
  return m.safetyItem !== undefined && (answers[m.safetyItem] ?? 0) > 0;
}
