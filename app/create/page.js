'use client'
import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

const GENRES = [
  { id: 'synth', name: 'Synthwave', art: '🎹', color: '#A855F7', desc: 'Neon & Retro' },
  { id: 'pop', name: 'Pop', art: '🎤', color: '#3B82F6', desc: 'High Energy' },
  { id: 'lofi', name: 'Lo-fi', art: '🎧', color: '#10B981', desc: 'Chill Vibes' },
  { id: 'epic', name: 'Epic', art: '⚔️', color: '#EF4444', desc: 'Heroic' },
  { id: 'rap', name: 'Rap', art: '🎤', color: '#F59E0B', desc: 'Lyrical' },
  { id: 'rock', name: 'Rock', art: '🎸', color: '#DC2626', desc: 'High Energy' },
  { id: 'soul', name: 'Soul Funk', art: '🎷', color: '#8B5CF6', desc: 'Groovy Vibes' },
];

const STATUS_MESSAGES = [
  "Initializing Studio Session...",
  "Tuning AI Vocals...",
  "Synthesizing Vibe...",
  "Applying Mastering Chain...",
  "Exporting 90s Anthem..."
];

export default function RecordingStudio() {
  const [mode, setMode] = useState(null);
  const [recipientName, setRecipientName] = useState('');
  const [accomplishment, setAccomplishment] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [error, setError] = useState(null);
  const [statusIdx, setStatusIdx] = useState(0);
  const [songId, setSongId] = useState(null);
  const [userTeams, setUserTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  
  const supabase = createClient();

  useEffect(() => {
    async function loadTeams() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/login';
        return;
      }

      const { data: memberships } = await supabase
        .from('team_members')
        .select('team_id, team:teams(id, name, song_credits_remaining)')
        .eq('user_id', user.id);

      const teams = memberships?.map(m => m.team).filter(Boolean) || [];
      setUserTeams(teams);
    }
    loadTeams();
  }, []);

  useEffect(() => {
    if (mode === 'team' && userTeams.length > 0 && !selectedTeamId) {
      setSelectedTeamId(userTeams[0].id);
      setRecipientName(userTeams[0].name);
    }
  }, [mode, userTeams, selectedTeamId]);

  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setStatusIdx(prev => (prev + 1) % STATUS_MESSAGES.length);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [isGenerating]);

  useEffect(() => {
    if (isGenerating && songId) {
      const checkStatus = async () => {
        const { data: song } = await supabase
          .from('songs')
          .select('status, audio_url, error_message')
          .eq('id', songId)
          .single();

        if (song?.status === 'completed' && song.audio_url) {
          setAudioUrl(song.audio_url);
          setIsGenerating(false);
        } else if (song?.status === 'failed') {
          setError(song.error_message || 'Song generation failed');
          setIsGenerating(false);
        }
      };

      const interval = setInterval(checkStatus, 3000);
      return () => clearInterval(interval);
    }
  }, [isGenerating, songId, supabase]);

  async function handleGenerate() {
    if (!accomplishment || !selectedGenre) return;
    
    if (mode === 'individual') {
      if (userTeams.length === 0) {
        setError('Please create a team first to generate songs');
        return;
      }
      if (!selectedTeamId) {
        setSelectedTeamId(userTeams[0].id);
      }
    }

    if (!selectedTeamId) {
      setError('Please select a team');
      return;
    }

    setError(null);
    setIsGenerating(true);
    setAudioUrl(null);

    try {
      const weekStart = new Date();
      const weekEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      const response = await fetch('/api/songs/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamId: selectedTeamId,
          accomplishments: [{ text: accomplishment }],
          genre: selectedGenre.toLowerCase(),
          weekStartDate: weekStart.toISOString(),
          weekEndDate: weekEnd.toISOString(),
          title: `High Five for ${recipientName}`
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate song');
      }

      setSongId(data.songId);
    } catch (err) {
      setError(err.message);
      setIsGenerating(false);
    }
  }

  function handleReset() {
    setMode(null);
    setRecipientName('');
    setAccomplishment('');
    setSelectedGenre('');
    setAudioUrl(null);
    setSongId(null);
    setError(null);
    setSelectedTeamId(null);
  }

  const selectedTeam = userTeams.find(t => t.id === selectedTeamId);
  const hasCredits = selectedTeam && selectedTeam.song_credits_remaining > 0;
  const canGenerate = recipientName && accomplishment && selectedGenre && hasCredits && !isGenerating;

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0c', color: 'white', fontFamily: 'sans-serif', padding: '40px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '60px' }}>
          <a href="/" style={{ color: '#666', textDecoration: 'none', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>← Back to Dashboard</a>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#111', padding: '8px 16px', borderRadius: '20px', border: '1px solid #222' }}>
            <div style={{ width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%', boxShadow: '0 0 10px #ef4444' }}></div>
            <span style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', color: '#ef4444' }}>Studio Live</span>
          </div>
        </header>

        <h2 style={{ fontSize: '48px', fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase', letterSpacing: '-2px', marginBottom: '40px', textAlign: 'center' }}>
          Record the <span style={{ color: '#a855f7' }}>Win</span>
        </h2>

        {error && (
          <div style={{ background: '#ef444420', border: '1px solid #ef4444', borderRadius: '12px', padding: '16px', marginBottom: '24px', color: '#ef4444', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {!mode && !isGenerating && !audioUrl && (
          <div style={{ background: '#121218', padding: '40px', borderRadius: '24px', border: '1px solid #ffffff0d', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '900', textTransform: 'uppercase', color: '#666', letterSpacing: '2px', marginBottom: '24px', textAlign: 'center' }}>
              Who is this High Five for?
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              <button onClick={() => setMode('team')} style={{ background: '#a855f7', border: 'none', borderRadius: '16px', padding: '40px 20px', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🏢</div>
                <div style={{ fontWeight: '900', fontSize: '16px', textTransform: 'uppercase', color: 'white' }}>My Team</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', marginTop: '8px' }}>Use team credits</div>
              </button>

              <button onClick={() => setMode('individual')} style={{ background: '#3b82f6', border: 'none', borderRadius: '16px', padding: '40px 20px', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>👤</div>
                <div style={{ fontWeight: '900', fontSize: '16px', textTransform: 'uppercase', color: 'white' }}>Individual</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', marginTop: '8px' }}>For someone specific</div>
              </button>
            </div>
          </div>
        )}

        {mode && !isGenerating && !audioUrl && (
          <div style={{ background: '#121218', padding: '40px', borderRadius: '24px', border: '1px solid #ffffff0d', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
            
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '10px', color: '#666', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px' }}>
                {mode === 'team' ? 'Select Team' : 'Recipient Name'}
              </label>
              
              {mode === 'team' ? (
                userTeams.length > 0 ? (
                  <select value={selectedTeamId || ''} onChange={(e) => {
                    setSelectedTeamId(e.target.value);
                    const team = userTeams.find(t => t.id === e.target.value);
                    if (team) setRecipientName(team.name);
                  }} style={{ width: '100%', background: '#000', border: '1px solid #333', borderRadius: '12px', padding: '16px', color: 'white', fontSize: '16px', outline: 'none' }}>
                    {userTeams.map(team => (
                      <option key={team.id} value={team.id}>
                        {team.name} ({team.song_credits_remaining} credits)
                      </option>
                    ))}
                  </select>
                ) : (
                  <div style={{ padding: '16px', background: '#ef444420', border: '1px solid #ef4444', borderRadius: '12px', color: '#ef4444' }}>
                    No teams found. <a href="/dashboard" style={{ color: '#ef4444', textDecoration: 'underline' }}>Create a team first</a>
                  </div>
                )
              ) : (
                <input type="text" style={{ width: '100%', background: '#000', border: '1px solid #333', borderRadius: '12px', padding: '16px', color: 'white', fontSize: '16px', outline: 'none' }} placeholder="Enter their name..." value={recipientName} onChange={(e) => setRecipientName(e.target.value)} />
              )}
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '10px', color: '#666', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px' }}>
                Log the Accomplishment
              </label>
              <textarea rows={6} style={{ width: '100%', background: '#000', border: '1px solid #333', borderRadius: '12px', padding: '16px', color: 'white', fontSize: '16px', outline: 'none', resize: 'none' }} placeholder="Describe what was achieved..." value={accomplishment} onChange={(e) => setAccomplishment(e.target.value)} />
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '10px', color: '#666', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '16px' }}>
                Choose the Vibe
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
                {GENRES.map(g => (
                  <button key={g.id} onClick={() => setSelectedGenre(g.name)} style={{ background: selectedGenre === g.name ? g.color : '#121218', border: selectedGenre === g.name ? `2px solid ${g.color}` : '1px solid #333', borderRadius: '16px', padding: '20px 12px', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center' }}>
                    <div style={{ fontSize: '36px', marginBottom: '8px' }}>{g.art}</div>
                    <div style={{ fontWeight: '900', fontSize: '11px', textTransform: 'uppercase', color: 'white' }}>{g.name}</div>
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleGenerate} disabled={!canGenerate} style={{ width: '100%', padding: '24px', background: canGenerate ? '#a855f7' : '#333', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', cursor: canGenerate ? 'pointer' : 'not-allowed', boxShadow: canGenerate ? '0 10px 30px -5px rgba(168,85,247,0.5)' : 'none', transition: 'all 0.3s' }}>
              {!hasCredits ? '⚠️ No Credits - Buy More' : !recipientName ? `Enter ${mode === 'team' ? 'Team' : 'Name'}` : !accomplishment ? 'Log Accomplishment' : !selectedGenre ? 'Select Vibe' : '🎵 Generate High Five Song'}
            </button>

            <button onClick={() => setMode(null)} style={{ width: '100%', marginTop: '12px', padding: '12px', background: 'none', border: 'none', color: '#666', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', cursor: 'pointer' }}>
              ← Change Mode
            </button>
          </div>
        )}

        {isGenerating && (
          <div style={{ textAlign: 'center', padding: '80px 40px' }}>
            <div style={{ width: '280px', height: '280px', borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, #1a1a1a, #000)', margin: '0 auto 40px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.8), inset 0 0 30px rgba(0,0,0,0.9)', animation: 'spin 3s linear infinite', border: '20px solid #0a0a0c' }}>
              <div style={{ position: 'absolute', width: '90%', height: '90%', borderRadius: '50%', border: '1px solid #333' }}></div>
              <div style={{ position: 'absolute', width: '70%', height: '70%', borderRadius: '50%', border: '1px solid #333' }}></div>
              <div style={{ position: 'absolute', width: '50%', height: '50%', borderRadius: '50%', border: '1px solid #333' }}></div>
              <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', boxShadow: '0 0 20px rgba(168,85,247,0.6)' }}>✋</div>
            </div>
            <div style={{ fontSize: '16px', fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase', color: '#a855f7', letterSpacing: '4px', marginBottom: '20px' }}>
              {STATUS_MESSAGES[statusIdx]}
            </div>
            <div style={{ width: '300px', height: '4px', background: '#111', borderRadius: '2px', margin: '0 auto', overflow: 'hidden' }}>
              <div style={{ width: '60%', height: '100%', background: '#a855f7', boxShadow: '0 0 10px #a855f7', animation: 'slideProgress 2s ease-in-out infinite' }}></div>
            </div>
          </div>
        )}

        {audioUrl && !isGenerating && (
          <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s ease-out' }}>
            <div style={{ width: '320px', height: '320px', background: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)', borderRadius: '24px', margin: '0 auto 40px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '140px', boxShadow: '0 40px 80px -20px rgba(168,85,247,0.6)' }}>✋</div>
            <h2 style={{ fontSize: '36px', fontWeight: '900', textTransform: 'uppercase', fontStyle: 'italic', marginBottom: '8px' }}>Mastering Complete</h2>
            <p style={{ color: '#666', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '4px', marginBottom: '32px' }}>High Five for: {recipientName}</p>
            <div style={{ background: '#121218', border: '1px solid #333', borderRadius: '16px', padding: '24px', maxWidth: '500px', margin: '0 auto 24px' }}>
              <audio controls style={{ width: '100%', outline: 'none' }} src={audioUrl} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px', margin: '0 auto' }}>
              <a href={audioUrl} download style={{ display: 'block', padding: '20px', background: 'white', color: 'black', fontWeight: '900', textTransform: 'uppercase', borderRadius: '12px', textDecoration: 'none', fontSize: '14px', letterSpacing: '2px', boxShadow: '0 4px 12px rgba(255,255,255,0.2)' }}>⬇️ Download MP3</a>
              <button onClick={handleReset} style={{ background: '#a855f7', border: 'none', color: 'white', fontWeight: '900', textTransform: 'uppercase', fontSize: '14px', padding: '20px', borderRadius: '12px', cursor: 'pointer', letterSpacing: '2px' }}>🎤 Record Another</button>
            </div>
          </div>
        )}

      </div>

      <style jsx>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideProgress { 0% { transform: translateX(-100%); } 100% { transform: translateX(250%); } }
      `}</style>
    </div>
  )
}
