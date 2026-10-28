# Voice scripts (text-to-speech), Calm Path

**Save each finished clip, named exactly as below, into the `voice-audio/` folder of this repository**, then run `npm run build`.

> **v1.3 scripts (updated 28 Oct 2026, v1.4 naming).**
> - **SURGE:** name the first fear, notice the second, turn towards the feeling, go with it rather than grit your teeth, float, let time pass, then step back into the day.
> - **Breathing** is calm-time training only, never a way to stop a wave.
> - **The urge script:** notice, allow, explore, name.
> - **Also:** Body Lab, Listening Garden, Night Guide.
> - No line says "you're safe", "your heart is fine" or "it's harmless", and none promises calm.
> - **Two wording changes since the first v1.3 scripts (re-record only these if already done): V-03 (no letters before the four steps) and V-08 (the garden is now the "Listening Garden").**

## How to produce (read once)

**Voice:**
- One warm, unhurried, gentle voice for every clip. Same voice, same settings, every clip.
- A soft Indian-English voice is ideal.
- Avoid "meditation-guru" breathiness and anything that sounds like a news reader.

**Settings (starting point):**
- Use a multilingual neural voice model that supports `<break>` pause tags.
- Speed **0.85–0.90**, Stability **~65%**, Similarity **~75%**, Style exaggeration **0**.
- Output: MP3 44.1 kHz.

**Pauses:**
- `<break time="2.0s" />` gives a pause of up to 3 seconds.
- `[SILENCE 8s]` means a longer pause. Generate the parts on either side separately and join them
  with that much silence (any audio editor), or let the build join them.

**Tone:** curious, warm, steady, slightly matter-of-fact, like a kind coach standing beside her. It
is not pitying and not hushed.

---

## V-01_SURGE.mp3 — SURGE (about 2½ minutes)
*Plays when she presses SURGE. The most important clip.*

> You pressed the button. Good. <break time="1.0s" /> Let's meet this wave together. <break time="2.5s" />
>
> Here is the flash. <break time="1.0s" /> The jolt, the fast heart, maybe that thump. <break time="1.5s" /> That is the first fear. It came by itself. <break time="2.5s" />
>
> Now listen for the second voice. <break time="1.0s" /> "What if… this time…" <break time="1.5s" /> That is the second fear. <break time="1.0s" /> You don't have to answer it. <break time="2.5s" />
>
> You can reply, lightly: <break time="1.0s" /> "So it races. <break time="0.6s" /> Let it race." <break time="3.0s" />
>
> Turn towards the feeling, like a curious scientist. <break time="1.5s" /> Where is it? <break time="2.0s" /> How big? <break time="2.0s" /> What is it like? <break time="3.0s" />
>
> Now go with it. <break time="1.0s" /> Not gritting your teeth. <break time="1.0s" /> Loosening. <break time="2.5s" />
>
> Let your shoulders drop. <break time="1.5s" /> Soften your jaw. <break time="1.5s" /> Open your hands. <break time="1.5s" /> Let your tummy go soft. <break time="3.0s" />
>
> Make room for the feeling. <break time="1.0s" /> Let it be as strong as it wants. <break time="1.5s" /> The switch is off. You are adding nothing. <break time="3.0s" />
>
> Let your breath be soft and slow on its own. <break time="1.0s" /> Breathe around the feeling, <break time="0.6s" /> not against it. <break time="3.0s" />
>
> Imagine floating on warm, still water. <break time="1.5s" /> You don't swim. <break time="1.0s" /> The water holds you, <break time="1.0s" /> and the feeling moves through. <break time="3.0s" />
>
> Now let time pass. <break time="1.5s" /> Waves rise, <break time="0.8s" /> peak, <break time="0.8s" /> and fall, in their own time. <break time="2.5s" />
> Your only job is to let the seconds go by. <break time="3.0s" />
>
> [SILENCE 10s]
>
> Whatever the wave is doing now (higher, lower, or the same), <break time="1.0s" /> it is allowed to be here. <break time="3.0s" />
>
> Now step back into your day. <break time="1.0s" /> Pick up the next ordinary thing, <break time="0.8s" /> and let the feeling come along if it wants. <break time="2.5s" />
>
> You met the wave without fighting it. <break time="1.0s" /> That is how it loses its power over you.

---

## V-01B_SURGE_REPEAT.mp3 — "Still strong?" (about 1 minute)

> Still strong? <break time="1.0s" /> That is allowed. Some waves are longer. <break time="2.0s" />
> Nothing needs fixing right now. <break time="1.0s" /> Let it stay as long as it wants. <break time="2.5s" />
> Where is it now? <break time="1.5s" /> Has its shape changed? <break time="1.5s" /> Just notice. <break time="3.0s" />
> Soften around it. <break time="1.0s" /> Shoulders. <break time="1.0s" /> Jaw. <break time="1.0s" /> Hands. <break time="3.0s" />
> Float. <break time="1.5s" /> Let time pass. <break time="3.0s" />
>
> [SILENCE 10s]
>
> Staying with it, without checking, is the whole of the work. <break time="1.0s" /> Keep floating.

---

## V-02 CALM-TIME BREATHING (played as pieces)
*Daily training on calm days, about 6 breaths a minute. NOT for use in a wave. The app plays a soft
tone for the pace; the voice gives the opening, the first few cues and the close.*

**V-02A_BREATHE_INTRO.mp3**
> This is calm-time practice: training for your nervous system, like a gentle gym. <break time="1.5s" />
> Sit comfortably, eyes open or closed. <break time="1.5s" /> Breathe in gently through your nose, <break time="0.8s" /> and out a little longer. <break time="1.5s" />
> Keep it soft and unforced. There's nothing to achieve. <break time="1.0s" /> Just follow the sound.

**V-02B_IN.mp3**
> In…

**V-02C_OUT.mp3**
> And out… softly.

**V-02D_MIDWAY.mp3**
> If your mind wanders, that's fine. Notice where it went, and come back to the next breath. No effort needed.

**V-02E_CLOSE.mp3**
> Let your breathing find its own rhythm again. <break time="2.0s" />
> Notice whatever your body feels now, without needing it to be anything. <break time="1.5s" />
> A little every day is how this skill grows. Well done.

---

## V-03_URGE_SURF.mp3 — the urge to check (about 3 minutes)  ⚠ CHANGED

> The pull to check is here. <break time="1.0s" /> You noticed it. <break time="0.8s" /> That is already the win. <break time="2.5s" />
>
> Notice it. <break time="1.0s" /> Say quietly: "urge to check." <break time="3.0s" />
>
> Allow it. <break time="1.0s" /> You don't have to push it away, <break time="0.8s" /> and you don't have to obey it. <break time="3.0s" />
>
> Explore it, with curiosity. <break time="1.0s" /> Where do you feel it? <break time="1.5s" /> Your chest? <break time="1.0s" /> Your hands? <break time="1.0s" /> Your throat? <break time="2.0s" />
> What is it like: <break time="0.8s" /> tight, <break time="0.6s" /> buzzy, <break time="0.6s" /> pulling? <break time="3.0s" />
>
> Name it in a word, each time it changes. <break time="1.0s" /> "Tight." <break time="2.0s" /> "Pulling." <break time="2.0s" /> "Fading." <break time="3.0s" />
>
> [SILENCE 20s]
>
> If the thought says, "just one quick check", <break time="1.0s" /> you can answer: <break time="0.8s" /> "Thank you, mind. I'm surfing this one." <break time="3.0s" />
>
> [SILENCE 20s]
>
> Ask gently: <break time="0.8s" /> what did the last check really give me, <break time="0.6s" /> ten minutes later? <break time="3.0s" />
>
> [SILENCE 20s]
>
> Every urge you notice and ride makes the next one weaker. <break time="1.0s" /> You're doing it.

---

## V-04_WORRY_TIME.mp3 — evening worry time (about 45 seconds)

> This is your worry time: early in the evening, never in bed. <break time="1.5s" />
> Open the worry river and look at today's paper boats. <break time="1.5s" />
> For each one, ask: is there one small next step I can take? <break time="1.0s" /> If yes, write it. <break time="1.0s" /> If it's a health "what if", there is no step. Let it float away. <break time="2.0s" />
> When the time is up, close it. <break time="1.0s" /> Tomorrow's worries can wait for tomorrow's worry time.

---

## V-05_WIND_DOWN.mp3 — wind-down (about 4 minutes)
*Sleepy, slower, effortless. The last thing she hears at night.*

> The day is done. <break time="2.0s" /> The worries are parked for tonight. Nothing more to solve. <break time="3.0s" />
> Lie back, and let the bed take your weight. <break time="3.0s" />
> Feet heavy and warm. <break time="2.0s" /> Legs sinking a little deeper. <break time="3.0s" />
> If your heart is noticeable, let it be noticeable. <break time="1.5s" /> You don't need to listen to it. <break time="3.0s" />
> Notice the sounds outside. <break time="1.5s" /> Something near… <break time="2.5s" /> something far… <break time="3.0s" />
> Shoulders, arms, hands loose. <break time="2.0s" /> Jaw, forehead, eyes soft. <break time="3.0s" />
>
> [SILENCE 10s]
>
> If a thought comes, let it pass by, like a boat on the river. <break time="1.0s" /> You don't need to climb aboard. <break time="3.0s" />
>
> [SILENCE 15s]
>
> Sleep can't be forced, and it doesn't need to be. <break time="1.5s" /> Resting is enough. <break time="3.0s" /> Good night.

---

## V-06 SHORT LINES (each its own small file)
| File | Line |
|---|---|
| `V-06A_MORNING.mp3` | "Good morning. Thirty seconds for your weather check: how was the night, and what's the weather inside today?" |
| `V-06B_WIN.mp3` | "You stayed with it. That's the real step. Well done." |
| `V-06C_LOGGED.mp3` | "Noted. Thank you for noticing. Noticing is half the work." |
| `V-06D_MISSED_DAY.mp3` | "Welcome back. Nothing is lost. Let's just do today, even a tiny bit." |
| `V-06E_EXPOSURE_START.mp3` | "Before you start: what does the anxiety predict, and how sure is it? Then do it fully: no checking, no escaping early. Let the feelings come along." |
| `V-06F_EXPOSURE_END.mp3` | "Done. Now write what actually happened, and how you coped. The gap between the forecast and what happened is how the brain learns." |

---

## V-07_BODY_LAB.mp3 — Body Lab intro (about 40 seconds)

> Welcome to the Body Lab. <break time="1.0s" /> Here you bring on a feeling on purpose, for a short time, and see what really happens. <break time="2.0s" />
> Make it as strong as you can. <break time="0.8s" /> Keep going about thirty seconds after the feeling starts. <break time="1.0s" /> No checking, no sitting down to recover, no breathing tricks. <break time="2.0s" />
> Then rate it, let it settle by itself, and go again. <break time="1.0s" /> Three rounds. <break time="1.0s" /> You're a scientist today.

## V-08_LISTENING_GARDEN.mp3 — Listening Garden intro (about 30 seconds)  ⚠ CHANGED

> Welcome to the Listening Garden. <break time="1.0s" /> Keep your eyes open, resting on one spot. <break time="1.5s" />
> First you'll focus on one sound at a time, then switch quickly between them, then hear them all at once. <break time="1.5s" />
> Thoughts and feelings may come. <break time="0.8s" /> Let them, and return to the sounds. <break time="1.0s" /> This is a gym for your attention.

## V-09_NIGHT_GUIDE.mp3 — Night Guide (about 1 minute)

> Awake at night? <break time="1.0s" /> That happens to everyone. Nothing needs to be done about it. <break time="2.0s" />
> If you're calm, stay and rest. <break time="1.0s" /> If you're upset and wide awake for a while, get up, go to another room, and keep the light dim. <break time="2.0s" />
> Do something quiet you chose in the daytime. <break time="2.0s" />
> If worries come: <break time="0.8s" /> "Not now. <break time="0.6s" /> Tomorrow, at worry time." <break time="2.0s" />
> If your body feels strange as you wake, let it be there, like weather. <break time="2.0s" />
> When you feel sleepy, go back to bed. <break time="1.0s" /> Tomorrow, get up at your usual time, whatever the night was like.

---

**Clip count: 19.** That is V-01, V-01B, V-02A–E (5), V-03, V-04, V-05, V-06A–F (6), V-07, V-08 and
V-09. The app plays any clip it finds and shows captions for the rest.
