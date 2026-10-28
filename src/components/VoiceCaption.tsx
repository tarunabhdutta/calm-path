import { useStore } from '../lib/store';
import { soundPrefs } from '../lib/model';
import { useEffect, useState } from 'react';
import { onSpeaking, playClip, stopClipIf } from '../lib/audio';
import type { Speaking } from '../lib/audio';
import { AUDIO } from '../content/scripts';

/** What the voice is saying now, or null when nothing is playing. */
export function useSpeaking(): Speaking | null {
  const [s, setS] = useState<Speaking | null>(null);
  useEffect(() => onSpeaking(setS), []);
  return s;
}

// These screens show the spoken line in their own caption box.
const OWN = new Set<string>([AUDIO.surge, AUDIO.surgeRepeat, AUDIO.winddown, AUDIO.urge, AUDIO.breatheIn, AUDIO.breatheOut, AUDIO.night]);

/** Plays a voice clip once when a screen opens (if voice guidance is on) and stops it on leaving. */
export function useIntroClip(clip: string, on: boolean) {
  useEffect(() => {
    if (on) playClip(clip);
    return () => stopClipIf(clip);
  }, [clip, on]);
}

/** Captions for every other clip: a quiet bar at the bottom of the screen. */
export function VoiceCaption() {
  const s = useSpeaking();
  const { data } = useStore();
  if (!s || !s.text || OWN.has(s.clip) || (data && !soundPrefs(data.settings).captions)) return null;
  return <div className="voice-caption" aria-live="polite" key={s.text}>{s.text}</div>;
}
