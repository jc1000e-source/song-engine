export type Genre = 
  | 'rap' 
  | 'country' 
  | 'pop' 
  | 'rock' 
  | 'edm' 
  | 'anthem' 
  | 'cinematic' 
  | 'lofi' 
  | 'hype_announcer' 
  | 'jazz';

export type SongStatus = 'pending' | 'generating' | 'complete' | 'error';

export interface Team {
  id: string;
  created_at: string;
  name: string;
  owner_id: string;
  song_credits_remaining: number;
  auto_generate_enabled: boolean;
  default_genre?: Genre;
}

export interface Accomplishment {
  id: string;
  created_at: string;
  team_id: string;
  user_id: string;
  text: string;
  preferred_genre?: Genre;
  is_used: boolean;
  used_in_song_id?: string;
}

export interface Song {
  id: string;
  created_at: string;
  team_id: string;
  title?: string;
  lyrics?: string;
  audio_url?: string;
  status: SongStatus;
  genre?: Genre;
  week_start_date?: string;
  week_end_date?: string;
  error_message?: string;
}

export interface JoinCode {
  id: string;
  code: string;
  team_id: string;
  is_used: boolean;
  expires_at?: string;
}