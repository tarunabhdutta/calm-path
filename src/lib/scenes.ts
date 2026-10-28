import type { Route } from '../components/ui';
import type { Data } from './model';
import { soundPrefs } from './model';
import { PROGRAMME } from '../content/programme';
import { coreCount, doneCount, nextSession } from './progress';

// Which music bed and ambience play on each screen (10-03_AUDIO_TRACKER.csv, "plays on").
// Silence zones: the Listening Garden, the safety card and "Urge to go to hospital?" have no music,
// and SURGE has ambience only: music is never offered as a way to calm a wave.

/** One ambience per journey land (week). */
const LAND_AMB: Record<number, string> = {
  1: 'A-01', 2: 'A-05', 3: 'A-06', 4: 'A-07', 5: 'A-08', 6: 'A-09', 7: 'A-10', 8: 'A-11', 9: 'A-12', 10: 'A-01', 11: 'A-03',
};

const GAME_SCENE: Record<string, [string | null, string | null]> = {
  leaves: ['M-09', 'A-07'], forecast: ['M-11', 'A-01'], fearCycle: ['M-11', 'A-01'], ladder: ['M-11', 'A-01'],
  noting: ['M-11', 'A-01'], recipe: ['M-11', 'A-01'], theory: ['M-11', 'A-01'], switch: ['M-11', 'A-01'],
  bodyLab: ['M-10', 'A-01'], listening: [null, null],
};

export const isNight = (h = new Date().getHours()) => h >= 18 || h < 6;

/** [music, ambience] for a route. */
export function sceneFor(r: Route, d: Data): [string | null, string | null] {
  const night = isNight();
  const home: [string, string] = night ? ['M-02', 'A-02'] : ['M-01', 'A-01'];
  switch (r.name) {
    case 'home': case 'tools': case 'progress': case 'settings': return home;
    case 'path': {
      if (doneCount(d) >= coreCount()) return ['M-15', 'A-01'];
      const next = nextSession(d).session;
      return ['M-04', LAND_AMB[next?.week ?? 1]];
    }
    case 'session': {
      const s = PROGRAMME.find((p) => p.id === r.id);
      return ['M-05', LAND_AMB[s?.week ?? 1]];
    }
    case 'surge': return [null, 'A-03'];
    case 'urge': return ['M-08', 'A-04'];
    case 'breathe': return [soundPrefs(d.settings).breatheMusic ? 'M-07' : null, 'A-08'];
    case 'winddown': return ['M-12', 'A-02'];
    case 'checkin': return ['M-13', 'A-06'];
    case 'worry': case 'worrytime': return ['M-09', 'A-07'];
    case 'form': case 'logs': case 'measure': case 'budget': return ['M-05', home[1]];
    case 'game': return r.id === 'forecast' ? GAME_SCENE.forecast : GAME_SCENE[r.id] ?? ['M-11', 'A-01'];
    case 'family': return ['M-14', home[1]];
    case 'safety': case 'hospital': return [null, null];
  }
  return home;
}
