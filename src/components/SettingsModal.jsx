import React from 'react';
import { 
  X, 
  Smartphone, 
  Volume2, 
  VolumeX, 
  Clock, 
  Sparkles 
} from 'lucide-react';
import { soundFx } from '../services/soundFx';

export default function SettingsModal({
  isOpen,
  onClose,
  fragmentDuration,
  onDurationChange,
  soundEnabled,
  onToggleSound
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Game Settings</h2>
          <button className="icon-button" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* SECTION 1: Gameplay Duration & Sound */}
        <div style={{
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          marginBottom: 14
        }}>
          {/* Duration Selector */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Clock size={16} color="var(--accent-purple)" />
                <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>Snippet Duration</span>
              </div>
              <span style={{ fontSize: '0.8rem', color: '#c4b5fd', fontWeight: 700 }}>
                {fragmentDuration} sec
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
              {[3, 5, 10, 15].map(s => (
                <button
                  key={s}
                  onClick={() => { soundFx.playClick(); onDurationChange(s); }}
                  style={{
                    background: fragmentDuration === s ? 'var(--grad-primary)' : 'rgba(255,255,255,0.06)',
                    border: fragmentDuration === s ? '1px solid transparent' : '1px solid var(--border-subtle)',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    padding: '10px 4px',
                    borderRadius: 10,
                    cursor: 'pointer',
                    boxShadow: fragmentDuration === s ? 'var(--shadow-neon-purple)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {s}s{s === 3 ? ' 🔥' : ''}
                </button>
              ))}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 6 }}>
              3s — Intro round, 10s — Quiz standard
            </div>
          </div>

          <div style={{ height: 1, background: 'var(--border-subtle)' }} />

          {/* Sound Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {soundEnabled ? <Volume2 size={18} color="var(--accent-cyan)" /> : <VolumeX size={18} color="var(--text-muted)" />}
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Sound Effects & Fanfare</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Clicks, countdown, and answer chimes</div>
              </div>
            </div>

            <button 
              className="icon-button"
              onClick={() => { soundFx.playClick(); onToggleSound(); }}
              style={{
                background: soundEnabled ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255,255,255,0.05)',
                borderColor: soundEnabled ? 'rgba(6, 182, 212, 0.4)' : 'var(--border-subtle)'
              }}
            >
              {soundEnabled ? <Volume2 size={16} color="var(--accent-cyan)" /> : <VolumeX size={16} color="var(--text-muted)" />}
            </button>
          </div>
        </div>

        {/* SECTION 2: Install to Phone (Friendly instructions) */}
        <div style={{
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px',
          marginBottom: 14
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Smartphone size={18} color="var(--accent-pink)" />
            <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>Add to Home Screen (Fullscreen PWA)</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            <p>• <b>iPhone (Safari)</b>: Tap Share ⎋ $\rightarrow$ <b>«Add to Home Screen»</b>.</p>
            <p style={{ marginTop: 4 }}>• <b>Android (Chrome)</b>: Tap ⋮ $\rightarrow$ <b>«Install app»</b>.</p>
          </div>
        </div>

        {/* Done Button */}
        <button 
          className="action-btn"
          onClick={onClose}
        >
          Done
        </button>
      </div>
    </div>
  );
}
