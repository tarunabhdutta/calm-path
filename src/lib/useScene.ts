import { useEffect } from 'react';
import { overrideScene } from './sound';

/** While this practice is open, it sets the music bed and ambience (null = silence), wherever it was opened from. */
export function useScene(music: string | null, ambience: string | null) {
  useEffect(() => {
    overrideScene([music, ambience]);
    return () => overrideScene(null);
  }, [music, ambience]);
}
