export const GENRES = [
  { value: 'rap', label: 'Rap', emoji: '🎤', prompt: 'Upbeat hip hop, energetic flow, heavy bass, motivational' },
  { value: 'country', label: 'Country', emoji: '🤠', prompt: 'Acoustic guitar, storytelling, warm vocals, folk country' },
  { value: 'pop', label: 'Pop', emoji: '🍭', prompt: 'Catchy pop, upbeat, radio hit, energetic, danceable' },
  { value: 'rock', label: 'Rock', emoji: '🎸', prompt: 'Electric guitar, driving drums, classic rock, energetic' },
  { value: 'edm', label: 'EDM', emoji: '🎧', prompt: '80s Synthwave, neon, retro, electronic, driving beat' },
  { value: 'anthem', label: 'Anthem', emoji: '🏆', prompt: 'Orchestral, grand, victorious, stadium chant, epic' },
  { value: 'cinematic', label: 'Cinematic', emoji: '🎬', prompt: 'Epic movie score, orchestral, dramatic, building tension' },
  { value: 'lofi', label: 'Lofi', emoji: '☕', prompt: 'Chill lofi hip hop, relaxed, study beats, smooth' },
  { value: 'hype_announcer', label: 'Hype Announcer', emoji: '📢', prompt: 'Sports announcer style, high energy, big intro, exciting' },
  { value: 'jazz', label: 'Jazz', emoji: '🎷', prompt: 'Smooth jazz, saxophone, piano, classy, relaxed' },
] as const;

export type GenreValue = typeof GENRES[number]['value'];
