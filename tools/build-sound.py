"""Processes every audio master into the app's sound files (run on this PC, offline, before a build).

  voice  V-*  -> voice-audio/V-*.mp3      clean, gently compressed, -18 LUFS, mono   (sync-audio copies them in)
  music  M-*  -> public/sound/M-*.m4a     full length, -24 LUFS, soft start, AAC 96k stereo
  ambience A-*-> public/sound/A-*.m4a     seamless loop, -30 LUFS, AAC 64k stereo
  garden L-*  -> public/sound/L-*.m4a     seamless loop, mono (the app places it left/right), -26 LUFS
  effects F-* -> public/sound/F-*.m4a     soft, level-matched (-24 dB active level), AAC 96k
  stingers S-*-> public/sound/S-*.m4a     -22 LUFS, AAC 96k
and writes src/content/soundManifest.json (id -> file, seconds).

Where a sound has several takes (names with a space and a number, "V2", or "_tN"), the steadiest,
cleanest take is used and the choice is printed.

usage: python tools/build-sound.py ["T:/AI/ANXIETY APP"]
"""
import json, os, re, subprocess, sys
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OWNER = sys.argv[1] if len(sys.argv) > 1 else r'T:\AI\ANXIETY APP'
SRC = {'V': os.path.join(OWNER, '04_VOICE_AUDIO'), 'M': os.path.join(OWNER, '12_MUSIC_AUDIO'), 'X': os.path.join(OWNER, '13_SOUND_EFFECTS_AUDIO')}
VOICE_OUT = os.path.join(ROOT, 'voice-audio')
SOUND_OUT = os.path.join(ROOT, 'public', 'sound')
MANIFEST = os.path.join(ROOT, 'src', 'content', 'soundManifest.json')
TMP = os.path.join(ROOT, '.sound-tmp')
for d in (VOICE_OUT, SOUND_OUT, TMP):
    os.makedirs(d, exist_ok=True)


def ff(*args):
    return subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-y', *args], capture_output=True, text=True, check=True).stderr


def pcm(path, ch=2):
    """Decode to float32 at 48 kHz."""
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-f', 'f32le', '-ac', str(ch), '-ar', '48000', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).reshape(-1, ch)


def write_wav(x, path):
    ch = x.shape[1]
    p = subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ac', str(ch), '-ar', '48000', '-i', '-', '-c:a', 'pcm_f32le', path],
                       input=x.astype(np.float32).tobytes(), capture_output=True)
    if p.returncode:
        raise RuntimeError(p.stderr.decode())


def loudnorm(src, dst, chain, target, tp, codec):
    """Two-pass EBU R128 loudness normalisation after `chain`, encoded with `codec` args."""
    pre = (chain + ',') if chain else ''
    out = ff('-i', src, '-af', f'{pre}loudnorm=I={target}:TP={tp}:LRA=11:print_format=json', '-f', 'null', '-')
    m = json.loads(out[out.rindex('{'):out.rindex('}') + 1])
    second = (f'{pre}loudnorm=I={target}:TP={tp}:LRA=11:measured_I={m["input_i"]}:measured_TP={m["input_tp"]}:'
              f'measured_LRA={m["input_lra"]}:measured_thresh={m["input_thresh"]}:offset={m["target_offset"]}:linear=true')
    ff('-i', src, '-af', second + ',aresample=48000', *codec, dst)


def steadiness(path):
    """Lower is better: how much the level wanders second to second, plus clipping."""
    x = pcm(path).mean(axis=1)
    n = len(x) // 48000
    db = 20 * np.log10(np.sqrt((x[:n * 48000].reshape(n, 48000) ** 2).mean(axis=1)) + 1e-9)
    return float(np.std(db)) + 50 * float((np.abs(x) > 0.995).mean())


def pick(folder, prefix):
    """All files for one ID; several takes -> the steadiest."""
    takes = [f for f in os.listdir(folder) if f.startswith(prefix + '_') and re.search(r'\.(wav|mp3)$', f, re.I)]
    if len(takes) <= 1:
        return takes[0] if takes else None
    best = min(takes, key=lambda f: steadiness(os.path.join(folder, f)))
    print(f'  {prefix}: {len(takes)} takes -> {best}')
    return best


def trim_silence(x, thresh_db=-60):
    lvl = np.abs(x).max(axis=1)
    on = np.where(lvl > 10 ** (thresh_db / 20))[0]
    return x[on[0]:on[-1] + 1] if len(on) else x


KEEP_TONE = {'L-05'}  # the bee's buzz IS the sound to listen to
ONLY = set(filter(None, os.environ.get('ONLY', '').split(',')))  # e.g. ONLY=L-05 rebuilds one sound


def hum_notches(x):
    """A steady drone (a narrow tone present nearly all the time, e.g. the 199 Hz hum the sound
    generator adds) -> narrow notch filters on it and its harmonics. Natural sounds come and go and are kept."""
    from scipy.ndimage import median_filter
    m = x.mean(axis=1)
    k = len(m) // 8192
    frames = np.abs(np.fft.rfft(m[:k * 8192].reshape(k, 8192) * np.hanning(8192), axis=1))
    fr = np.fft.rfftfreq(8192, 1 / 48000)
    db = 20 * np.log10(frames.mean(0) + 1e-12)
    prom = db - median_filter(db, 51)
    band = np.where((fr > 60) & (fr < 1200))[0]
    i = band[np.argmax(prom[band])]
    if prom[i] < 8:
        return ''
    fdb = 20 * np.log10(frames[:, i] + 1e-12)
    med = 20 * np.log10(np.median(frames[:, max(0, i - 25):i + 25], axis=1) + 1e-12)
    if ((fdb - med) > 8).mean() < 0.8:
        return ''
    f0 = fr[i]
    return ','.join(f'equalizer=f={f0 * h:.1f}:t=q:w=12:g=-{24 if h == 1 else 15}' for h in (1, 2, 3, 4) if f0 * h < 2000)


def make_loop(x, xf_sec=1.5):
    """Folds the tail over the head with an equal-power cross-fade, so the file loops without a seam."""
    n = int(xf_sec * 48000)
    if len(x) < 4 * n:
        n = len(x) // 4
    t = np.linspace(0, np.pi / 2, n)[:, None]
    head, tail = x[:n], x[-n:]
    joined = tail * np.cos(t) + head * np.sin(t)
    return np.concatenate([joined, x[n:-n]])


def main():
    manifest = {}
    # ── voice ──
    for f in ([] if ONLY else sorted(os.listdir(SRC['V']))):
        if not re.match(r'^V-\d\d[A-Z]?_[A-Z_]+\.mp3$', f):
            continue
        loudnorm(os.path.join(SRC['V'], f), os.path.join(VOICE_OUT, f),
                 'highpass=f=70,deesser=i=0.3,acompressor=threshold=-22dB:ratio=2.5:attack=8:release=120:makeup=1.5:knee=6',
                 -18, -1.5, ['-ac', '1', '-c:a', 'libmp3lame', '-b:a', '96k'])
    print('voice: done')
    # ── music, ambience, garden, effects, stingers ──
    ids = {}
    for folder, kinds in ((SRC['M'], 'M'), (SRC['X'], 'ALFS')):
        for f in os.listdir(folder):
            m = re.match(r'^([' + kinds + r']-\d\d)_', f)
            if m:
                ids.setdefault(m.group(1), folder)
    if os.path.exists(MANIFEST):
        manifest.update(json.load(open(MANIFEST, encoding='utf-8')))
    for sid in sorted(ids):
        if ONLY and sid not in ONLY:
            continue
        folder = ids[sid]
        f = pick(folder, sid)
        src = os.path.join(folder, f)
        kind = sid[0]
        out = os.path.join(SOUND_OUT, sid + '.m4a')
        tmp = os.path.join(TMP, sid + '.wav')
        if kind == 'M':
            x = trim_silence(pcm(src))
            fade = np.minimum(1, np.arange(len(x)) / (2.0 * 48000))[:, None]  # sound starts gently
            write_wav(x * fade, tmp)
            loudnorm(tmp, out, 'highpass=f=30', -24, -2, ['-c:a', 'aac', '-b:a', '96k'])
        elif kind in 'AL':
            ch = 1 if kind == 'L' else 2
            x = trim_silence(pcm(src))
            notch = '' if sid in KEEP_TONE else hum_notches(x)
            if notch:
                print(f'  {sid}: steady drone removed ({notch.split(":")[0].split("=")[-1]} Hz and harmonics)')
            x = make_loop(x if ch == 2 else x.mean(axis=1, keepdims=True))
            write_wav(x, tmp)
            loudnorm(tmp, out, 'highpass=f=40' + (',' + notch if notch else ''), -26 if kind == 'L' else -30, -3, ['-c:a', 'aac', '-b:a', '64k'])
        elif kind == 'F':
            x = trim_silence(pcm(src), -55)
            act = x.mean(axis=1)
            win = 480
            n = max(1, len(act) // win)
            db = 20 * np.log10(np.sqrt((act[:n * win].reshape(n, win) ** 2).mean(axis=1)) + 1e-9) if len(act) >= win else np.array([-30.0])
            loud = db[db > db.max() - 20]
            act_db = 10 * np.log10(np.mean(10 ** (loud / 10)))
            g = min(10 ** ((-24 - act_db) / 20), 10 ** (-6 / 20) / (np.abs(x).max() + 1e-9))  # level-matched, peaks under -6 dB
            write_wav(x * g, tmp)
            ff('-i', tmp, '-af', 'afade=t=in:d=0.004', '-c:a', 'aac', '-b:a', '96k', out)
        else:  # stingers
            write_wav(trim_silence(pcm(src), -55), tmp)
            loudnorm(tmp, out, '', -22, -3, ['-c:a', 'aac', '-b:a', '96k'])
        dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', out], capture_output=True, text=True).stdout)
        manifest[sid] = {'file': sid + '.m4a', 'secs': round(dur, 2)}
        os.remove(tmp)
    json.dump(manifest, open(MANIFEST, 'w', encoding='utf-8'), indent=1)
    os.rmdir(TMP)
    size = sum(os.path.getsize(os.path.join(SOUND_OUT, f)) for f in os.listdir(SOUND_OUT))
    print(f'sound: {len(manifest)} files, {size / 1e6:.1f} MB -> {SOUND_OUT}')


if __name__ == '__main__':
    main()
