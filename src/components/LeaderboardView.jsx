import React, { useState } from 'react';
import { 
  Trophy, 
  Flame, 
  Target, 
  CheckCircle, 
  XCircle, 
  Edit2, 
  Share2, 
  Check, 
  Sparkles, 
  User,
  RotateCcw
} from 'lucide-react';
import { 
  getPlayerRank, 
  getCachedLeaderboard, 
  saveLocalPlayerProfile,
  resetPlayerStats
} from '../services/leaderboardService';
import { soundFx } from '../services/soundFx';

const AVATAR_OPTIONS = ['🪩', '👑', '🎸', '💃', '🎧', '⚡', '🕺', '🦊', '🦁', '🌟'];

export default function LeaderboardView({
  playerProfile,
  onUpdateProfile
}) {
  const [isEditingNick, setIsEditingNick] = useState(false);
  const [nickInput, setNickInput] = useState(playerProfile.nickname || 'Player');
  const [copiedShare, setCopiedShare] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const leaderboard = getCachedLeaderboard();
  const rank = getPlayerRank(playerProfile.totalGuessed || 0);

  const totalAttempts = (playerProfile.totalGuessed || 0) + (playerProfile.totalMissed || 0);
  const accuracy = totalAttempts > 0 
    ? Math.round(((playerProfile.totalGuessed || 0) / totalAttempts) * 100) 
    : 100;

  const handleSaveNick = (e) => {
    e.preventDefault();
    if (!nickInput.trim()) return;
    soundFx.playClick();
    const updated = { ...playerProfile, nickname: nickInput.trim() };
    saveLocalPlayerProfile(updated);
    onUpdateProfile(updated);
    setIsEditingNick(false);
  };

  const handleSelectAvatar = (emoji) => {
    soundFx.playClick();
    const updated = { ...playerProfile, avatar: emoji };
    saveLocalPlayerProfile(updated);
    onUpdateProfile(updated);
    setShowAvatarPicker(false);
  };

  const handleShareStats = () => {
    soundFx.playClick();
    const shareText = `🎵 I guessed ${playerProfile.totalGuessed || 0} retro hits and scored ${playerProfile.score || 0} pts on QuizBeat (Oldies Party)! Try it out: https://rbuinytska.github.io/quizbeat/`;

    if (navigator.share) {
      navigator.share({
        title: 'QuizBeat Oldies Party',
        text: shareText,
        url: 'https://rbuinytska.github.io/quizbeat/'
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* SECTION 1: Player Profile Card */}
      <div style={{
        background: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-glow)',
        borderRadius: 'var(--radius-lg)',
        padding: '18px 16px',
        position: 'relative',
        boxShadow: 'var(--shadow-card)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Avatar with click-to-change */}
          <div 
            onClick={() => setShowAvatarPicker(!showAvatarPicker)}
            style={{
              width: 58,
              height: 58,
              borderRadius: '50%',
              background: 'var(--grad-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-neon-purple)',
              position: 'relative',
              flexShrink: 0
            }}
            title="Click to choose avatar"
          >
            {playerProfile.avatar || '🪩'}
            <div style={{
              position: 'absolute',
              bottom: -2,
              right: -2,
              background: '#0f1322',
              borderRadius: '50%',
              padding: 3,
              border: '1px solid var(--border-subtle)',
              fontSize: '0.65rem'
            }}>
              ✏️
            </div>
          </div>

          {/* Nickname & Title */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {!isEditingNick ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {playerProfile.nickname || 'Player'}
                </span>
                <button 
                  className="icon-button"
                  style={{ width: 26, height: 26, borderRadius: 6, flexShrink: 0 }}
                  onClick={() => setIsEditingNick(true)}
                  title="Edit nickname"
                >
                  <Edit2 size={12} />
                </button>
              </div>
            ) : (
              <form onSubmit={handleSaveNick} style={{ display: 'flex', gap: 6 }}>
                <input 
                  type="text" 
                  className="input-field"
                  style={{ padding: '6px 10px', fontSize: '0.9rem' }}
                  value={nickInput}
                  onChange={(e) => setNickInput(e.target.value)}
                  autoFocus
                  maxLength={18}
                />
                <button 
                  type="submit" 
                  className="action-btn"
                  style={{ width: 'auto', padding: '6px 12px' }}
                >
                  <Check size={14} />
                </button>
              </form>
            )}

            {/* Rank badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: rank.color,
                background: 'rgba(255,255,255,0.06)',
                padding: '2px 8px',
                borderRadius: 6,
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                {rank.badge} {rank.title}
              </span>
            </div>
          </div>

          {/* Big Score Pill */}
          <div style={{
            background: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            borderRadius: 14,
            padding: '8px 12px',
            textAlign: 'center',
            flexShrink: 0
          }}>
            <div style={{ fontSize: '0.68rem', color: '#fcd34d', fontWeight: 700, textTransform: 'uppercase' }}>
              Points
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#fff' }}>
              {playerProfile.score || 0}
            </div>
          </div>
        </div>

        {/* Avatar Picker Palette */}
        {showAvatarPicker && (
          <div style={{
            display: 'flex',
            gap: 8,
            overflowX: 'auto',
            paddingTop: 14,
            marginTop: 14,
            borderTop: '1px solid var(--border-subtle)'
          }}>
            {AVATAR_OPTIONS.map(emoji => (
              <button
                key={emoji}
                onClick={() => handleSelectAvatar(emoji)}
                style={{
                  background: playerProfile.avatar === emoji ? 'var(--accent-purple)' : 'rgba(255,255,255,0.06)',
                  border: 'none',
                  borderRadius: 10,
                  fontSize: '1.4rem',
                  padding: '6px 10px',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: Detailed Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        <div style={{
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: varCSS('radius-md'),
          padding: '12px 6px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#4ade80' }}>
            {accuracy}%
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 2, fontWeight: 600 }}>
            Accuracy
          </div>
        </div>

        <div style={{
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: varCSS('radius-md'),
          padding: '12px 6px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#fff' }}>
            {playerProfile.totalGuessed || 0}
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 2, fontWeight: 600 }}>
            Guessed
          </div>
        </div>

        <div style={{
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: varCSS('radius-md'),
          padding: '12px 6px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#f59e0b' }}>
            x{playerProfile.bestStreak || 0}
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 2, fontWeight: 600 }}>
            Best Streak
          </div>
        </div>

        <div style={{
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: varCSS('radius-md'),
          padding: '12px 6px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#f87171' }}>
            {playerProfile.totalMissed || 0}
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 2, fontWeight: 600 }}>
            Missed
          </div>
        </div>
      </div>

      {/* Share / Brag Button */}
      <button 
        className="action-btn"
        style={{ background: 'var(--grad-primary)', padding: '12px 16px', fontSize: '0.92rem' }}
        onClick={handleShareStats}
      >
        {copiedShare ? <Check size={18} /> : <Share2 size={18} />}
        <span>{copiedShare ? 'Link & score copied!' : 'Share Score with Friends'}</span>
      </button>

      {/* SECTION 3: Leaderboard */}
      <div style={{ marginTop: 6 }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800, fontSize: '0.95rem' }}>
            <Trophy size={16} color="var(--accent-amber)" />
            <span>Quiz Leaderboard</span>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Top Players
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {leaderboard.map((item, index) => {
            const isMe = item.id === playerProfile.id;
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`;

            return (
              <div 
                key={item.id}
                style={{
                  background: isMe ? 'rgba(139, 92, 246, 0.15)' : 'var(--bg-surface-elevated)',
                  border: isMe ? '1px solid var(--accent-purple)' : '1px solid var(--border-subtle)',
                  borderRadius: 14,
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: isMe ? '0 0 15px rgba(139, 92, 246, 0.25)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ 
                    fontSize: index < 3 ? '1.3rem' : '0.85rem', 
                    fontWeight: 800, 
                    color: index < 3 ? '#fff' : 'var(--text-muted)',
                    width: 24,
                    textAlign: 'center'
                  }}>
                    {medal}
                  </div>

                  <div style={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem'
                  }}>
                    {item.avatar || '🪩'}
                  </div>

                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#fff', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span>{item.nickname}</span>
                      {isMe && (
                        <span style={{ 
                          fontSize: '0.65rem', 
                          background: 'var(--accent-purple)', 
                          color: '#fff', 
                          padding: '1px 6px', 
                          borderRadius: 6,
                          fontWeight: 700
                        }}>
                          YOU
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      Guessed: {item.totalGuessed} • Accuracy: {item.accuracy || 0}%
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 900, fontSize: '1rem', color: '#fcd34d' }}>
                    {item.score}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                    pts
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function varCSS(token) {
  return `var(--${token})`;
}
