import { useEffect } from 'react';
import type { Route } from './ui';
import { useStore } from '../lib/store';
import { soundPrefs } from '../lib/model';
import { background, fx, fxJustPlayed, setLevels, setScene, unlock } from '../lib/sound';
import { setVoiceVolume } from '../lib/audio';
import { sceneFor } from '../lib/scenes';

/** Keeps the sound world in step with the screen on show and her settings. Renders nothing. */
export function SoundDirector({ route }: { route: Route }) {
  const { data } = useStore();
  const prefs = data ? soundPrefs(data.settings) : null;

  useEffect(() => {
    if (!prefs) return;
    setLevels({ music: prefs.music, ambience: prefs.ambience, effects: prefs.effects, quiet: prefs.quiet });
    setVoiceVolume(prefs.quiet ? 0 : prefs.voice);
  }, [JSON.stringify(prefs)]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!data) return;
    const [m, a] = sceneFor(route, data);
    setScene(m, a);
  }, [route, data?.settings.sound?.breatheMusic]); // eslint-disable-line react-hooks/exhaustive-deps

  // Bedtime screens keep playing with the screen off; everything else rests in the background.
  useEffect(() => {
    const keep = route.name === 'winddown';
    const on = () => background(document.hidden, keep);
    document.addEventListener('visibilitychange', on);
    return () => document.removeEventListener('visibilitychange', on);
  }, [route.name]);

  // The first tap wakes the sound (phones allow nothing before it). Every tap gets a soft sound,
  // unless the action already played its own.
  useEffect(() => {
    const down = () => unlock();
    const click = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest('button, input[type=checkbox], input[type=radio], [role=button], .chip');
      if (!el || (el as HTMLButtonElement).disabled) return;
      window.setTimeout(() => {
        if (fxJustPlayed()) return;
        if (el.matches('input')) fx('F-05');
        else if (el.matches('.back')) fx('F-03');
        else if (el.matches('.btn:not(.ghost):not(.soft)')) fx('F-02');
        else fx('F-01');
      }, 0);
    };
    window.addEventListener('pointerdown', down);
    window.addEventListener('click', click);
    return () => { window.removeEventListener('pointerdown', down); window.removeEventListener('click', click); };
  }, []);

  return null;
}
