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
        <div className="logo-badge">
          <Music2 size={20} color="#fff" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span className="brand-title">QuizBeat</span>
            <span className="brand-badge">OLDIES</span>
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '1px' }}>
            {activePackName || 'Oldies Party'}
          </div>
        </div>
      </div>

      <div className="header-actions">
        {streak > 1 && (
          <div className="stat-chip streak" title={`Серия верных ответов: ${streak}`}>
            <Flame size={14} color="#f59e0b" fill="#f59e0b" />
            <span>x{streak}</span>
          </div>
        )}

        <div className="stat-chip" title="Ваши очки">
          <Trophy size={13} color="var(--accent-purple)" />
          <span>{score}</span>
        </div>

        <button 
          className="icon-button"
          onClick={onOpenSettings}
          aria-label="Настройки"
        >
          <SettingsIcon size={18} />
        </button>
      </div>
    </header>
  );
}
