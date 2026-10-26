// Deterministic safety rules. Never an AI judgement.

const CRISIS = [
  /suicid/i, /kill (my|him|her)self/i, /end (my|it all|my life)/i, /want(ed)? to die/i,
  /better off dead/i, /self[- ]?harm/i, /hurt(ing)? myself/i, /no (reason|point) (to|in) (live|living)/i,
  /don'?t want to (live|be alive|wake up)/i, /take all (the|my) (pills|tablets)/i,
];

/** True when free text she writes contains words that should open the crisis card. */
export function crisisText(text: string): boolean {
  return CRISIS.some((r) => r.test(text));
}

export const CRISIS_LINES = {
  teleManas: '14416',
  teleManasAlt: '1800-891-4416',
  emergency: '108',
};

export const RED_FLAGS = [
  'Chest pain or pressure together with breathlessness, sweating or nausea',
  'Fainting, or nearly fainting',
  'Sudden weakness or numbness on one side, a drooping face, or slurred speech',
  'A fast heartbeat that will not settle, together with chest pain, fainting or severe breathlessness',
  'Any injury or illness you would call a doctor for anyway',
];
