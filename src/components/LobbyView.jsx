import React, { useState } from 'react';
import { 
  Play, 
  Disc3, 
  Clock, 
  Sparkles, 
  Gamepad2, 
  Zap, 
  Edit2, 
  Check, 
  Flame, 
  Music2, 
  Layers,
  HelpCircle
} from 'lucide-react';
import { CURATED_PACKS, getCustomSavedPacks } from '../services/previewService';
import { soundFx } from '../services/soundFx';

const SONG_COUNT_OPTIONS = [
  { value: 10, label: '10 Songs', badge: 'Sprint ⚡' },
  { value: 20, label: '20 Songs', badge: 'Standard 🏆' },
  { value: 30, label: '30 Songs', badge: 'Party 🔥' },
  { value: 'all', label: 'All Songs', badge: 'Full Deck ♾️' }
];

const GAME_MODES = [
  { id: 'flashcards', emoji: '🃏', name: 'Flashcards', desc: 'Flip card to check song & artist' },
  { id: 'buzzer', emoji: '🚨', name: 'Buzzer Mode', desc: 'Hit buzzer & name track out loud' },
  { id: 'options', emoji: '🎯', name: '4 Choices', desc: 'Classic A-B-C-D multiple choice test' }
];

const DURATION_OPTIONS = [
  { value: 3, label: '3s', badge: 'Intro 🔥' },
  { value: 5, label: '5s', badge: 'Hard' },
  { value: 10, label: '10s', badge: 'Quiz Standard' },
  { value: 15, label: '15s', badge: 'Easy' }
];

const AVATAR_OPTIONS = ['🪩', '🕺', '💃', '🎙️', '🎸', '👑', '⭐', '🔥', '🎧', '⚡'];

export default function LobbyView({
  playerProfile,
  onUpdateProfile,
  initialPack,
  fragmentDuration,
  onDurationChange,
  onStartGame,
  onOpenPlaylists
}) {
  const customPacks = getCustomSavedPacks();
  const allPacks = [...customPacks, ...CURATED_PACKS];

  const [selectedPackId, setSelectedPackId] = useState(initialPack?.id || allPacks[0].id);
  const [songCount, setSongCount] = useState(20); // 10, 20, 30, or 'all'
  const [selectedMode, setSelectedMode] = useState('flashcards');
  const [isEditingNick, setIsEditingNick] = useState(false);
  const [nickInput, setNickInput] = useState(playerProfile.nickname || 'Player');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const selectedPack = allPacks.find(p => p.id === selectedPackId) || allPacks[0];

  const handleSaveNick = (e) => {
    e.preventDefault();
    if (!nickInput.trim()) return;
    soundFx.playClick();
    onUpdateProfile({ ...playerProfile, nickname: nickInput.trim() });
    setIsEditingNick(false);
  };

  const handleSelectAvatar = (emoji) => {
    soundFx.playClick();
    onUpdateProfile({ ...playerProfile, avatar: emoji });
    setShowAvatarPicker(false);
  };

  const handlePlayClick = () => {
    soundFx.playClick();
    onStartGame({
      pack: selectedPack,
      songCount: songCount === 'all' ? selectedPack.tracks.length : Math.min(songCount, selectedPack.tracks.length),
      subMode: selectedMode,
      duration: fragmentDuration
    });
  };

  const effectiveCount = songCount === 'all' 
    ? selectedPack.tracks.length 
    : Math.min(songCount, selectedPack.tracks.length);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, paddingBottom: 24 }}>
      {/* 1. HERO ONBOARDING BANNER */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(236, 72, 153, 0.15) 100%)',
        border: '1px solid var(--border-glow)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px 18px',
        textAlign: 'center',
        position: 'relative',
        boxShadow: 'var(--shadow-card)',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          padding: '4px 12px',
          borderRadius: 20,
          fontSize: '0.75rem',
          fontWeight: 800,
          color: '#fbcfe8',
          marginBottom: 10
        }}>
          <Sparkles size={13} color="#f472b6" />
          <span>PUB QUIZ TRAINER • OLDIES PARTY</span>
        </div>

        <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', lineHeight: 1.25 }}>
          Ready for the Music Quiz?
        </h1>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.4 }}>
          Choose your music category, round length, and hit play!
        </p>

        {/* Quick Player Profile Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          marginTop: 14,
          background: 'rgba(15, 19, 34, 0.85)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 30,
          padding: '6px 14px'
        }}>
          <div 
            onClick={() => setShowAvatarPicker(!showAvatarPicker)}
            style={{ fontSize: '1.25rem', cursor: 'pointer' }}
            title="Click to change avatar"
          >
            {playerProfile.avatar || '🪩'}
          </div>

          {!isEditingNick ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff' }}>
                {playerProfile.nickname || 'Player'}
              </span>
              <button 
                onClick={() => setIsEditingNick(true)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
                title="Edit name"
              >
                <Edit2 size={12} />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSaveNick} style={{ display: 'flex', gap: 4 }}>
              <input 
                type="text" 
                value={nickInput}
                onChange={(e) => setNickInput(e.target.value)}
                maxLength={18}
                autoFocus
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid var(--accent-purple)',
                  color: '#fff',
                  borderRadius: 6,
                  padding: '2px 6px',
                  fontSize: '0.8rem',
                  width: 100
                }}
              />
              <button 
                type="submit" 
                style={{
                  background: 'var(--accent-purple)',
                  border: 'none',
                  color: '#fff',
                  borderRadius: 6,
                  padding: '2px 8px',
                  cursor: 'pointer'
                }}
              >
                <Check size={12} />
              </button>
            </form>
          )}
        </div>

        {/* Avatar Picker Palette */}
        {showAvatarPicker && (
          <div style={{
            display: 'flex',
            gap: 6,
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginTop: 10,
            padding: '8px',
            background: 'rgba(15, 19, 34, 0.9)',
            borderRadius: 12
          }}>
            {AVATAR_OPTIONS.map(emoji => (
              <button
                key={emoji}
                onClick={() => handleSelectAvatar(emoji)}
                style={{
                  background: playerProfile.avatar === emoji ? 'var(--accent-purple)' : 'transparent',
                  border: 'none',
                  fontSize: '1.2rem',
                  padding: '4px 6px',
                  borderRadius: 8,
                  cursor: 'pointer'
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. CHOOSE MUSIC CATEGORY */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <Disc3 size={18} color="var(--accent-purple)" />
          <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff' }}>
            1. Select Music Pack
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {allPacks.map(pack => {
            const isSelected = pack.id === selectedPackId;
            return (
              <div
                key={pack.id}
                onClick={() => {
                  soundFx.playClick();
                  setSelectedPackId(pack.id);
                }}
                style={{
                  background: isSelected ? 'rgba(139, 92, 246, 0.18)' : 'var(--bg-surface-elevated)',
                  border: isSelected ? '2px solid var(--accent-purple)' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  boxShadow: isSelected ? '0 0 20px rgba(139, 92, 246, 0.25)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                  <div style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    background: 'rgba(255,255,255,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.4rem',
                    flexShrink: 0
                  }}>
                    {pack.emoji || '🎵'}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {pack.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {pack.subtitle}
                    </div>
                  </div>
                </div>

                <div style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: isSelected ? '#c4b5fd' : 'var(--text-muted)',
                  background: isSelected ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255,255,255,0.04)',
                  padding: '4px 8px',
                  borderRadius: 8,
                  marginLeft: 8,
                  flexShrink: 0
                }}>
                  {pack.tracks.length} tracks
                </div>
              </div>
            );
          })}

          {onOpenPlaylists && (
            <button
              onClick={() => { soundFx.playClick(); onOpenPlaylists(); }}
              style={{
                marginTop: 4,
                width: '100%',
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(236, 72, 153, 0.12))',
                border: '1px dashed var(--accent-purple)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 14px',
                color: '#c4b5fd',
                fontSize: '0.86rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                transition: 'all 0.2s ease'
              }}
            >
              <Sparkles size={16} />
              <span>+ Import Spotify Playlist or Search Artists</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. NUMBER OF SONGS */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Layers size={18} color="var(--accent-pink)" />
            <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff' }}>
              2. Number of Songs
            </span>
          </div>
          <span style={{ fontSize: '0.78rem', color: '#f472b6', fontWeight: 700 }}>
            {effectiveCount} to play
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {SONG_COUNT_OPTIONS.map(opt => {
            const isSelected = songCount === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => {
                  soundFx.playClick();
                  setSongCount(opt.value);
                }}
                style={{
                  background: isSelected ? 'var(--grad-primary)' : 'var(--bg-surface-elevated)',
                  border: isSelected ? '1px solid transparent' : '1px solid var(--border-subtle)',
                  borderRadius: 12,
                  padding: '10px 4px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  color: '#fff',
                  boxShadow: isSelected ? 'var(--shadow-neon-pink)' : 'none',
                  transition: 'all 0.18s ease'
                }}
              >
                <span style={{ fontWeight: 900, fontSize: '0.85rem' }}>{opt.label.split(' ')[0]}</span>
                <span style={{ fontSize: '0.62rem', opacity: 0.85, marginTop: 2, fontWeight: 700 }}>
                  {opt.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. GAME MODE */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <Gamepad2 size={18} color="var(--accent-cyan)" />
          <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff' }}>
            3. Game Mode
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {GAME_MODES.map(mode => {
            const isSelected = selectedMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => {
                  soundFx.playClick();
                  setSelectedMode(mode.id);
                }}
                style={{
                  background: isSelected ? 'rgba(6, 182, 212, 0.2)' : 'var(--bg-surface-elevated)',
                  border: isSelected ? '2px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                  borderRadius: 14,
                  padding: '12px 6px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  cursor: 'pointer',
                  boxShadow: isSelected ? '0 0 20px rgba(6, 182, 212, 0.3)' : 'none',
                  transition: 'all 0.18s ease'
                }}
              >
                <span style={{ fontSize: '1.6rem', marginBottom: 4 }}>{mode.emoji}</span>
                <span style={{ fontWeight: 800, fontSize: '0.82rem', color: '#fff' }}>{mode.name}</span>
                <span style={{ fontSize: '0.64rem', color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.2 }}>
                  {mode.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. SNIPPET DURATION */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Clock size={18} color="var(--accent-amber)" />
            <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff' }}>
              4. Snippet Duration
            </span>
          </div>
          <span style={{ fontSize: '0.78rem', color: '#f59e0b', fontWeight: 700 }}>
            {fragmentDuration} seconds
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {DURATION_OPTIONS.map(d => {
            const isSelected = fragmentDuration === d.value;
            return (
              <button
                key={d.value}
                onClick={() => {
                  soundFx.playClick();
                  onDurationChange(d.value);
                }}
                style={{
                  background: isSelected ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'var(--bg-surface-elevated)',
                  border: isSelected ? '1px solid transparent' : '1px solid var(--border-subtle)',
                  borderRadius: 12,
                  padding: '10px 4px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  color: '#fff',
                  boxShadow: isSelected ? '0 0 20px rgba(245, 158, 11, 0.4)' : 'none',
                  transition: 'all 0.18s ease'
                }}
              >
                <span style={{ fontWeight: 900, fontSize: '0.85rem' }}>{d.label}</span>
                <span style={{ fontSize: '0.62rem', opacity: 0.9, marginTop: 2, fontWeight: 700 }}>
                  {d.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. BIG START GAME CTA */}
      <div style={{ position: 'sticky', bottom: 12, zIndex: 30, paddingTop: 6 }}>
        <button
          className="action-btn"
          onClick={handlePlayClick}
          style={{
            background: 'var(--grad-primary)',
            padding: '18px 24px',
            fontSize: '1.15rem',
            fontWeight: 900,
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 0 35px rgba(236, 72, 153, 0.5), 0 8px 25px rgba(0,0,0,0.5)',
            letterSpacing: '0.5px'
          }}
        >
          <Play size={24} fill="#fff" />
          <span>START GAME ({effectiveCount} TRACKS)</span>
        </button>
      </div>
    </div>
  );
}
