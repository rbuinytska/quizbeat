import React from 'react';
import { Music2, Settings as SettingsIcon, Flame, Trophy } from 'lucide-react';

export default function Header({ 
  score, 
  streak, 
  onOpenSettings,
  activePackName 
}) {
  return (
    <header className="app-header">
      <div className="brand-section">
        <div className="logo-badge" style={{ width: 32, height: 32, borderRadius: 10 }}>
          <Music2 size={16} color="#fff" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span className="brand-title" style={{ fontSize: '1.05rem' }}>QuizBeat</span>
            <span className="brand-badge" style={{ fontSize: '0.6rem', padding: '1px 5px' }}>OLDIES</span>
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', marginTop: '1px' }}>
            {activePackName || 'Oldies Party'}
          </div>
        </div>
      </div>

      <div className="header-actions">
        {streak > 1 && (
          <div className="stat-chip streak" title={`Streak: ${streak}`}>
            <Flame size={14} color="#f59e0b" fill="#f59e0b" />
            <span>x{streak}</span>
          </div>
        )}

        <div className="stat-chip" title="Your score">
          <Trophy size={13} color="var(--accent-purple)" />
          <span>{score}</span>
        </div>

        <button 
          className="icon-button"
          onClick={onOpenSettings}
          aria-label="Settings"
        >
          <SettingsIcon size={18} />
        </button>
      </div>
    </header>
  );
}
