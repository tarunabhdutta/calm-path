import type { Measure } from './types';

// GAD-7 and PHQ-9 (Spitzer, Kroenke, Williams; free to use, no permission required).
// Whiteley Index-7 (Fink et al. 1999), 5-point version, for health anxiety.

const twoWeeks = 'Over the last 2 weeks, how often have you been bothered by the following problems?';
const freq = ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'];

export const MEASURES: Record<string, Measure> = {
  GAD7: {
    id: 'GAD7',
    name: 'GAD-7 (general anxiety)',
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
  WI7: {
    id: 'WI7',
    name: 'Whiteley Index-7 (health worry)',
    short: 'Health worry',
    stem: 'How much does each of these apply to you at present?',
    options: ['Not at all', 'A little', 'Moderately', 'Quite a lot', 'A great deal'],
    items: [
      'Do you worry a lot about your health?',
      'Do you think there is something seriously wrong with your body?',
      'Is it hard for you to forget about yourself and think about all sorts of other things?',
      'If you feel ill and someone tells you that you are looking better, do you become annoyed?',
      'Do you find that you are often aware of various things happening in your body?',
      'Are you bothered by many aches and pains?',
      'Are you afraid of illness?',
    ],
    everyDays: 14,
    max: 28,
    band: (t) => (t <= 7 ? 'low' : t <= 14 ? 'some' : t <= 21 ? 'high' : 'very high'),
  },
  PHQ9: {
    id: 'PHQ9',
    name: 'PHQ-9 (mood)',
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
