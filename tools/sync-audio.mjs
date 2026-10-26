// Copies voice clips (see docs/VOICE_SCRIPTS.md) into public/audio and writes a manifest of
// which clips exist, so the app knows at build time what it can play.
// Source: ./voice-audio (override with CALMPATH_AUDIO_SRC).
import fs from 'node:fs';
import path from 'node:path';

const src = process.env.CALMPATH_AUDIO_SRC || path.resolve('voice-audio');
const dest = path.resolve('public/audio');
fs.mkdirSync(dest, { recursive: true });

const found = [];
if (fs.existsSync(src)) {
  for (const f of fs.readdirSync(src)) {
    if (/^V-\d\d[A-Z]?_.*\.mp3$/i.test(f)) {
      fs.copyFileSync(path.join(src, f), path.join(dest, f));
      found.push(f);
    }
  }
}
// keep clips already in public/audio (e.g. copied by hand)
for (const f of fs.readdirSync(dest)) if (f.endsWith('.mp3') && !found.includes(f)) found.push(f);

fs.writeFileSync(path.resolve('src/content/audioManifest.json'), JSON.stringify(found.sort(), null, 2));
console.log(`audio: ${found.length} clip(s) ${found.length ? '- ' + found.join(', ') : '(none yet; captions only)'}`);
