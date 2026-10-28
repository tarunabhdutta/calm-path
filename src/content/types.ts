// Content model for the programme. Everything the app teaches is data, not code.

export type FieldType =
  | 'text'        // one line
  | 'textarea'    // several lines
  | 'scale10'     // 0..10 slider
  | 'scale100'    // 0..100 slider (confidence, SUDS)
  | 'number'
  | 'choice'      // one of options
  | 'multi'       // several of options
  | 'checklist'   // tick-boxes (options), progress counted
  | 'rated-list'; // repeatable rows: text + 0..100 rating (ladders, inventories)

export interface Field {
  id: string;
  label: string;
  type: FieldType;
  help?: string;
  options?: string[];
  placeholder?: string;
  optional?: boolean;
}

export interface FormDef {
  id: string;
  title: string;
  intro?: string;
  /** persistent = one living document she edits over time; repeatable = a new entry each time */
  kind: 'persistent' | 'repeatable';
  fields: Field[];
}

export type Practice =
  | { type: 'breathe'; minutes: number }
  | { type: 'surge-practice' }
  | { type: 'urge'; minutes: number }
  | { type: 'form'; formId: string }
  | { type: 'measure'; measureId: MeasureId }
  | { type: 'budget' }
  | { type: 'worry-time' }
  | { type: 'game'; game: import('../components/ui').GameId }
  | { type: 'none' };

export interface Card {
  title?: string;
  /** animated illustration shown above the card */
  art?: import('../game/LessonArt').ArtId;
  /** paragraphs; a line starting with "- " renders as a bullet */
  body: string[];
}

export interface Session {
  id: string;            // QS1, S2.1 ...
  phase: 'quickstart' | 'strengthen' | 'staywell';
  week: number;          // 1..10
  title: string;
  minutes: number;
  cards: Card[];
  practice: Practice[];
  reflection?: string;   // one closing question, free text
  /** sessions that need the doctor's OK for heart-rate-raising exercises */
  needsDoctorOk?: boolean;
  /** shown instead of the gated practice when the OK is not recorded */
  gentleAlternative?: Practice[];
}

export type MeasureId = 'GAD7' | 'PHQ9' | 'HW7';

export interface Measure {
  id: MeasureId;
  name: string;
  short: string;
  stem: string;
  options: string[];      // answer labels, scored 0..n-1
  items: string[];
  everyDays: number;
  max: number;
  band: (total: number) => string;
  /** index of an item that triggers the crisis card when > 0 */
  safetyItem?: number;
}
