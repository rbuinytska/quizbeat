import React, { useState } from 'react';
import { 
  AlertCircle, 
  Play, 
  Trash2, 
  Zap, 
  CheckCircle, 
  RotateCcw,
  Music2
} from 'lucide-react';
import { previewPlayer } from '../services/previewService';
import { spotifyPlayer } from '../services/spotify';
import { soundFx } from '../services/soundFx';

export default function WeakTracksView({
  weakTracks = [],
  onClearWeakTracks,
  onRemoveWeakTrack,
  onTrainWeakTracks,
  isSpotifyConnected
}) {
  const [playingId, setPlayingId] = useState(null);

  const handlePlayPreview = (track) => {
    soundFx.playClick();
    if (playingId === track.id) {
      if (isSpotifyConnected) spotifyPlayer.pause();
      else previewPlayer.stop();
      setPlayingId(null);
      return;
    }

    setPlayingId(track.id);
    if (isSpotifyConnected && track.spotifyUri) {
      spotifyPlayer.playTrack(track.spotifyUri, 30000);
      setTimeout(() => setPlayingId(null), 10000);
    } else if (track.audioUrl) {
      previewPlayer.play(track.audioUrl, 10, () => {
        setPlayingId(null);
      });
    }
  };

  if (weakTracks.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          background: 'rgba(16, 185, 129, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          border: '1px solid rgba(16, 185, 129, 0.3)'
        }}>
          <CheckCircle size={36} color="#10b981" />
        </div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>No mistakes yet!</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 8, lineHeight: 1.5 }}>
          Great job! When you miss a song or forget the artist during gameplay, it will automatically save here so you can review before your pub quiz.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header Info Banner */}
      <div style={{
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fca5a5' }}>
            Mistakes Review ({weakTracks.length})
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 2 }}>
            Songs that gave you a hard time
          </div>
        </div>

        <button 
          className="icon-button"
          onClick={() => {
            soundFx.playClick();
            onClearWeakTracks();
          }}
          title="Clear list"
        >
          <Trash2 size={16} color="#f87171" />
        </button>
      </div>

      {/* Start Drill Button */}
      {weakTracks.length >= 4 && (
        <button 
          className="action-btn"
          style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}
          onClick={() => {
            soundFx.playClick();
            onTrainWeakTracks();
          }}
        >
          <Zap size={18} /> Practice ONLY Missed Songs ({weakTracks.length})
        </button>
      )}

      {/* List of Mistaken Tracks */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {weakTracks.map(track => {
          const isThisPlaying = playingId === track.id;
          return (
            <div 
              key={track.id}
              style={{
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
                {track.albumArt ? (
                  <img src={track.albumArt} alt="" style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Music2 size={20} color="var(--text-muted)" />
                  </div>
                )}
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {track.name}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {track.artist} {track.year ? `(${track.year})` : ''}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button 
                  className="icon-button"
                  style={{ width: 34, height: 34 }}
                  onClick={() => handlePlayPreview(track)}
                  title="Play snippet"
                >
                  {isThisPlaying ? <span style={{ fontSize: '0.7rem', fontWeight: 900 }}>❚❚</span> : <Play size={14} />}
                </button>

                <button 
                  className="icon-button"
                  style={{ width: 34, height: 34 }}
                  onClick={() => {
                    soundFx.playClick();
                    onRemoveWeakTrack(track.id);
                  }}
                  title="Remove from mistakes"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
