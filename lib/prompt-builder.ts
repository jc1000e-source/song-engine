export function buildPrompt(
  team: string,
  week: string,
  genre: string,
  accomplishments: string[]
) {
  const clean = (s: string) => (s ?? "").replace(/\s+/g, " ").trim();
  const bullets = accomplishments.map((a) => `- ${clean(a)}`).join("\n");

  const g = (genre ?? "").toLowerCase();
  const isMC =
    g.includes("mc") || g.includes("announcer") || g.includes("hype");

  // ===============================
  // MC / ANNOUNCER MODE (SPOKEN)
  // ===============================
  if (isMC) {
    return `
You are a top-tier music producer and MC voice director.

Deliverable:
Create a PROFESSIONAL MC / ANNOUNCER STYLE performance with a modern hype instrumental backing.
Primary delivery must be confident, rhythmic SPOKEN WORD (not sung).
Think arena announcer, awards host, hype man energy.

ABSOLUTE RULES:
- POSITIVE WINS ONLY. Clean language.
- Do NOT invent accomplishments.
- Mention the team name "${team}" and reference "${week}".
- Convert each accomplishment into punchy, rhythmic announcement lines.
- DO NOT read accomplishments like a list.

STRUCTURE (MANDATORY):
Intro beat drop (2–4 bars)
MC Verse 1 (spoken hype)
Call-and-response hook (short repeatable chant)
MC Verse 2 (bigger energy)
Final hype section (repeat team name + strongest win)
Outro sting (tagline + beat tail)

VOCAL DIRECTION:
- Spoken/rapped cadence only.
- No sustained singing notes.
- Use emphasis, pauses, crowd hype phrasing.
- Add tasteful ad-libs in final section.

PRODUCTION REQUIREMENTS:
- Punchy drums, tight low end.
- Strong transitions (riser, impact, drop).
- Hook section wider and louder than verses.
- Modern clean master (not distorted).
- Include one signature moment (crowd hit, vocal chop, synth stab).

ACCOMPLISHMENTS (ONLY facts allowed):
${bullets}

Tone:
Confident. Celebratory. “Ladies and gentlemen — this is how we WIN.”
`.trim();
  }

  // ===============================
  // PROFESSIONAL SONG MODE (SUNG)
  // ===============================
  return `
You are a top-tier music producer and commercial songwriter.

Deliverable:
Generate a FULLY PRODUCED, radio-ready song WITH VOCALS in the style/genre: ${genre}.
It must sound like a finished commercial release.

ABSOLUTE RULES:
- POSITIVE WINS ONLY. Clean language.
- Do NOT invent accomplishments.
- Must clearly mention the team name "${team}" and reference "${week}".
- Do NOT read accomplishments like a list.
- Convert each accomplishment into vivid, natural lyric lines.
- Make the chorus the strongest, most memorable section.

STRUCTURE (MANDATORY):
0:00–0:08 Intro (instrumental build)
Verse 1 (8 bars)
Pre-Chorus (4 bars, emotional lift)
Chorus (8 bars, BIG hook, repeat hook line 2–3 times)
Verse 2 (8 bars, fresh imagery)
Pre-Chorus
Chorus
Bridge (4–8 bars, contrast or breakdown)
Final Chorus (bigger with harmonies and added drums)
Outro (tag the hook)

VOCAL PRODUCTION:
- Lead vocal upfront.
- Doubles in chorus.
- Two-part harmonies on key hook words.
- Tasteful ad-libs in final chorus/outro.

PRODUCTION REQUIREMENTS:
- Punchy drums, controlled bass.
- Clear stereo width in chorus (wider than verse).
- Balanced reverb/delay (not washed out).
- Modern commercial mastering.
- Include one memorable ear-candy element.

ACCOMPLISHMENTS (ONLY facts allowed):
${bullets}

Write lyrics that feel like momentum, unity, and celebration.
The chorus must be short, repeatable, and anthem-like.
`.trim();
}