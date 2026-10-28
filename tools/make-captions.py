"""Builds src/content/captions.json: timed captions for every voice clip.

The caption TEXT is the script in docs/VOICE_SCRIPTS.md, word for word. The TIMING comes from the
recording itself: an offline speech model (faster-whisper, run on this PC at build time, never in
the app) finds when each word is spoken, and each caption starts when its first word does.

usage:  python tools/make-captions.py [voice-folder]      (default: ./voice-audio)
needs:  pip install faster-whisper   (the model downloads once, then works offline)
"""
import json, os, re, sys, difflib

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'voice-audio')
DOC = os.path.join(ROOT, 'docs', 'VOICE_SCRIPTS.md')
OUT = os.path.join(ROOT, 'src', 'content', 'captions.json')

NUM = {'30': 'thirty', '20': 'twenty', '10': 'ten', '15': 'fifteen', '3': 'three', '2': 'two', '1': 'one'}


def scripts():
    """{file: raw script text} from the voice-scripts document."""
    doc = open(DOC, encoding='utf-8').read()
    out, cur = {}, None
    for line in doc.splitlines():
        m = re.match(r'^(?:## |\*\*)(V-\d\d[A-Z]?_[A-Z_]+\.mp3)', line)
        if m:
            cur = m.group(1); out[cur] = ''; continue
        t = re.match(r'^\| `(V-\d\d[A-Z]?_[A-Z_]+\.mp3)` \| "(.*)" \|$', line)
        if t:
            out[t.group(1)] = t.group(2); cur = None; continue
        if line.startswith('---') or line.startswith('## '):
            cur = None
        elif cur and line.startswith('>'):
            out[cur] += ' ' + line[1:].strip()
    return {k: v.strip() for k, v in out.items() if v.strip()}


def cues(text):
    """Split a script into caption cues: at sentence ends and at pauses of 1.5 s or more."""
    text = re.sub(r'\[SILENCE \d+s\]', ' <break time="9s" /> ', text)
    parts = re.split(r'<break time="([\d.]+)s" />', text)
    chunks, buf = [], ''
    for i, p in enumerate(parts):
        if i % 2 == 0:
            buf += ' ' + p
        elif float(p) >= 1.5 or re.search(r'[.?!…:"]\s*$', buf.strip()):
            chunks.append(buf); buf = ''
    chunks.append(buf)
    res = []
    for c in chunks:
        c = re.sub(r'\s+', ' ', c).strip()
        if not c:
            continue
        # a long chunk with several sentences is split again at sentence ends
        for s in re.split(r'(?<=[.?!])\s+(?=[A-Z"])', c):
            if res and len(s.split()) <= 2 and not re.search(r'[.?!…"]$', res[-1]):
                res[-1] += ' ' + s
            else:
                res.append(s)
    return res


def norm(w):
    w = w.lower().replace('’', "'")
    w = re.sub(r"[^a-z0-9']", '', w)
    return NUM.get(w, w)


def main():
    from faster_whisper import WhisperModel
    model = WhisperModel('small.en', device='cpu', compute_type='int8')
    S = scripts()
    result, report = {}, []
    for f in sorted(os.listdir(SRC)):
        if f not in S:
            continue
        segs, info = model.transcribe(os.path.join(SRC, f), word_timestamps=True, vad_filter=False)
        heard = [(norm(w.word), w.start, w.end) for s in segs for w in s.words if norm(w.word)]
        cl = cues(S[f])
        words, owner = [], []
        for i, c in enumerate(cl):
            for w in c.split():
                if norm(w):
                    words.append(norm(w)); owner.append(i)
        sm = difflib.SequenceMatcher(a=words, b=[h[0] for h in heard], autojunk=False)
        at = [None] * len(words)
        for a, b, n in sm.get_matching_blocks():
            for k in range(n):
                at[a + k] = heard[b + k]
        out = []
        for i, c in enumerate(cl):
            idx = [k for k, o in enumerate(owner) if o == i]
            hit = [at[k] for k in idx if at[k]]
            start = hit[0][1] if hit else None
            out.append([start, c, round(len(hit) / max(1, len(idx)), 2)])
        # cues with no matched word take a time between their neighbours
        for i, c in enumerate(out):
            if c[0] is None:
                prev = next((x[0] for x in reversed(out[:i]) if x[0] is not None), 0.0)
                nxt = next((x[0] for x in out[i + 1:] if x[0] is not None), info.duration)
                c[0] = (prev + nxt) / 2
        for c in out:
            if c[2] < 0.6:
                report.append(f'  {f}: only {int(c[2] * 100)}% of "{c[1][:50]}" was heard; check the recording')
        result[f] = {'dur': round(info.duration, 2), 'cues': [[round(max(0, c[0] - 0.1), 2), c[1]] for c in out]}
        print(f'{f}: {len(out)} captions, {round(info.duration, 1)} s')
    json.dump(result, open(OUT, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f'wrote {OUT}')
    print('\n'.join(report) if report else 'every caption matched the recording')


if __name__ == '__main__':
    main()
