# Voice scripts (for ElevenLabs or any text-to-speech)

**Save each finished clip, named exactly as below, into the `voice-audio/` folder of this repository**, then run `npm run build`.


## How to produce (read once)

**Voice:** one warm, unhurried, gentle voice for every clip, so she learns to link that one voice
with calm. A soft Indian-English voice is ideal. Avoid "meditation-guru" breathiness and anything
that sounds like a news reader. Use the **same voice and settings for every clip.**

**Settings (starting point, adjust by ear):**
- Model: **Eleven Multilingual v2**. It obeys the `<break>` pause tags used below.
- Speed: **0.85–0.90**
- Stability: **~65%**, so the voice stays calm and even.
- Similarity: **~75%**
- Style exaggeration: **0**
- Output: MP3 44.1 kHz.

**Pauses:**
- `<break time="2.0s" />` is a pause ElevenLabs makes itself. Its maximum is 3 seconds.
- `[SILENCE 6s]` is longer. Generate the text on either side as separate parts, then join them with
  that much silence in an audio editor (Audacity or Vegas). Or simply give me the separate parts and
  I will join them during the build.

**Rules these scripts follow (please don't edit them out):**
- **No promise that nothing is wrong**, and no "you're safe, your heart is fine". Reassurance feeds
  health anxiety. The scripts teach her to *allow* the feeling, not to argue it away.
- **No heart-rate numbers. No instruction to check the pulse.**
- Medical red flags (chest pain with breathlessness, fainting) are on the app screen, not in the
  audio.

---

## V-01_SURGE.mp3 — the SURGE button (about 2½ minutes)
*Plays when she presses SURGE. This is the most important clip.*

> You pressed the button. That was the right thing to do. <break time="2.0s" />
> Something is rising in your body. A fast heart. Maybe that thump. Maybe trembling hands. <break time="1.5s" />
> You know this wave. You have met it before. It is adrenaline, the body's alarm, ringing loudly. <break time="2.5s" />
>
> We are not going to fight it. And we are not going to check it. <break time="1.5s" />
> Put the phone down if you can, or just let your hand rest. <break time="3.0s" />
>
> Say to yourself, quietly: *Let it come.* <break time="2.0s" />
> Let it do whatever it wants to do. <break time="2.0s" />
> You don't have to slow it down. It is allowed to be here. <break time="3.0s" />
>
> Now, a long, slow breath out, as if you are blowing through a straw. <break time="3.0s" />
> And let the next breath come in by itself. <break time="2.5s" />
> Again, slowly out. <break time="3.0s" />
> And let it come in. <break time="2.5s" />
> One more, long and slow, all the way out. <break time="3.0s" />
>
> Let your shoulders drop. <break time="1.5s" /> Unclench your jaw. <break time="1.5s" /> Soften your hands. <break time="3.0s" />
>
> If the heart races, let it race. <break time="1.5s" />
> Imagine you are lying on warm, still water. You don't swim, you don't struggle. You float. <break time="2.5s" />
> The water holds you, and the feeling moves through you. <break time="3.0s" />
>
> [SILENCE 6s]
>
> Time is on your side. Every wave rises, <break time="1.0s" /> reaches its top, <break time="1.0s" /> and falls, without you doing anything at all. <break time="3.0s" />
> Your only job is to let time pass. <break time="3.0s" />
>
> [SILENCE 8s]
>
> The wave may already be lower. Or it may still be here. Either way is all right. You are letting it be. <break time="3.0s" />
>
> When you are ready, open your eyes, and do one small, ordinary thing. <break time="1.0s" /> A sip of water. <break time="1.0s" /> A look out of the window. <break time="1.0s" /> A few steps around the room. <break time="2.5s" />
>
> You let the wave pass through. That is exactly how this gets weaker. <break time="1.5s" /> Well done.

---

## V-01B_SURGE_REPEAT.mp3 — "Still here?" (about 1 minute)
*The app offers this after V-01 if she taps "It's still strong".*

> It's still here, and that is all right. Some waves are longer. <break time="2.0s" />
> Nothing needs to be fixed right now. <break time="1.5s" /> Let it stay as long as it wants. <break time="2.5s" />
> Breathe out slowly, long and soft. <break time="3.0s" /> And let the breath come back in. <break time="2.5s" />
> Again, out. <break time="3.0s" /> And in. <break time="2.5s" />
> Let it come. <break time="1.5s" /> Float. <break time="1.5s" /> Let time pass. <break time="3.0s" />
>
> [SILENCE 10s]
>
> You are doing it. Staying with it, without checking, is the work. <break time="1.5s" /> Keep floating.

---

## V-02 BREATHE — resonance breathing (the app plays these as separate pieces)
*The app plays a soft tone at 6 breaths a minute (4 seconds in, 6 seconds out). The voice is only
the opening, the first few cues, and the close.*

**V-02A_BREATHE_INTRO.mp3**
> Let's breathe together for a few minutes. <break time="1.5s" />
> Sit comfortably, feet on the floor, shoulders loose. <break time="2.0s" />
> Breathe in gently through your nose, and out slowly, a little longer than the in-breath. <break time="1.5s" />
> No need to breathe deeply. Just slowly. Follow the sound.

**V-02B_IN.mp3**
> In…

**V-02C_OUT.mp3**
> And out… slowly.

**V-02D_MIDWAY.mp3**
> Good. Let the sound lead you now. If your mind wanders, that's fine. Just come back to the next breath.

**V-02E_CLOSE.mp3**
> Let your breathing return to its own rhythm. <break time="2.0s" />
> Notice how your body feels now, whatever it feels. <break time="2.0s" />
> Two slow breaths a day, every day, teach your body that it knows how to settle. Well done.

---

## V-03_URGE_SURF.mp3 — the urge to check (about 3 minutes)
*Plays when she taps "Urge to check" (the watch, an ECG, Google, or asking someone).*

> You feel the pull to check. <break time="1.5s" /> That pull is the anxiety asking for reassurance. <break time="2.0s" />
> Checking gives relief for a minute, and then the worry comes back stronger. So today, we're going to surf this urge instead. <break time="2.5s" />
>
> Notice where you feel the urge. Your chest? Your hands? A tight feeling in your stomach? <break time="3.0s" />
> Rate it in your mind. How strong, from zero to ten? <break time="3.0s" />
>
> An urge is like a wave. It builds, <break time="1.0s" /> it peaks, <break time="1.0s" /> and it falls, whether you act on it or not. <break time="2.0s" />
> You don't need to push it away. Just watch it, with curiosity. <break time="3.0s" />
>
> [SILENCE 15s]
>
> Breathe out slowly. <break time="3.0s" /> And in. <break time="2.5s" />
> If the thought says, *"Just one check, to be sure,"* <break time="1.0s" /> you can answer: *"Thank you, mind. I'm surfing this one."* <break time="3.0s" />
>
> [SILENCE 20s]
>
> Check the wave now. Is it the same, <break time="1.0s" /> stronger, <break time="1.0s" /> or a little lower? <break time="2.5s" />
> Whatever it is, you're still on the board. <break time="3.0s" />
>
> [SILENCE 30s]
>
> Three minutes. <break time="1.0s" /> You didn't check, and you're still here. <break time="1.5s" />
> If the urge is still there, the app can give you ten more minutes. If it's lower, go on with your day. <break time="1.5s" />
> Every urge you surf makes the next one weaker. That's a real win.

---

## V-04_WORRY_TIME.mp3 — evening worry time (about 45 seconds)
*Opens her daily 15-minute worry time.*

> This is your worry time. For the next fifteen minutes, worries are allowed. <break time="2.0s" />
> Open the worry box, and look at what you parked today. <break time="2.0s" />
> For each one, ask: is this something I can act on? If yes, write one small step. <break time="1.5s" /> If no, let it go back in the box. <break time="2.0s" />
> When the time is up, close the box. Tomorrow's worries can wait for tomorrow's worry time.

---

## V-05_WIND_DOWN.mp3 — sleep wind-down (about 4 minutes)
*The last thing she hears at night. It must be sleepy, slower, and without effort.*

> The day is done. <break time="2.0s" /> Let's put it down gently. <break time="3.0s" />
> Lie back, and let the bed take your weight. <break time="3.0s" />
> Breathe out slowly, <break time="3.0s" /> and let the breath return. <break time="3.0s" />
>
> Let your attention rest on your feet. <break time="1.5s" /> Heavy. <break time="1.5s" /> Warm. <break time="3.0s" />
> Your legs, <break time="1.0s" /> sinking a little deeper. <break time="3.0s" />
> Your belly, <break time="1.0s" /> rising and falling on its own. <break time="3.0s" />
> Your chest. <break time="1.0s" /> Whatever your heart is doing, let it do it. You don't need to listen to it. Let it look after itself, as it always has, all through the night. <break time="3.0s" />
> Your shoulders, <break time="1.0s" /> your arms, <break time="1.0s" /> your hands, loose. <break time="3.0s" />
> Your jaw, <break time="1.0s" /> your forehead, <break time="1.0s" /> your eyes, soft. <break time="3.0s" />
>
> [SILENCE 10s]
>
> If a thought comes, let it pass by, like a boat on the river. You don't need to climb aboard. <break time="3.0s" />
>
> [SILENCE 15s]
>
> Nothing more to do tonight. <break time="2.0s" /> Just rest. <break time="3.0s" /> Good night.

---

## V-06 SHORT LINES (each its own small file)
| File | Line |
|---|---|
| `V-06A_MORNING.mp3` | "Good morning. Thirty seconds for your check-in: how did you sleep, and how is the body today?" |
| `V-06B_WIN.mp3` | "You let that wave pass. That's a real step. Well done." |
| `V-06C_LOGGED.mp3` | "Logged. Thank you for noticing it. Noticing is half the work." |
| `V-06D_MISSED_DAY.mp3` | "Welcome back. No catching up needed. Let's just do today." |
| `V-06E_EXPOSURE_START.mp3` | "Before you start: what do you think will happen, and how sure are you? Write it down, then begin. Let the feeling come, and stay with it." |
| `V-06F_EXPOSURE_END.mp3` | "Done. Now write what actually happened. The difference between what you feared and what happened is how your brain learns." |

---

**Clip count:** V-01, V-01B, V-02A–E (5), V-03, V-04, V-05, V-06A–F (6) = **16 clips.**
More scripts (lesson narrations for each week) will follow in build phase B0.
