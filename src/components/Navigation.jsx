import React from 'react';
import { Gamepad2, Disc3, AlertCircle, Settings } from 'lucide-react';

export default function Navigation({ activeTab, onTabChange, weakTracksCount }) {
  return (
    <nav className="bottom-nav">
      <button 
        className={`nav-tab ${activeTab === 'quiz' ? 'active' : ''}`}
        onClick={() => onTabChange('quiz')}
      >
        <Gamepad2 size={22} />
        <span>Игра</span>
      </button>

      <button 
        className={`nav-tab ${activeTab === 'packs' ? 'active' : ''}`}
        onClick={() => onTabChange('packs')}
      >
        <Disc3 size={22} />
        <span>Плейлисты</span>
      </button>

      <button 
        className={`nav-tab ${activeTab === 'weak' ? 'active' : ''}`}
        onClick={() => onTabChange('weak')}
      >
        <AlertCircle size={22} />
        <span>Ошибки</span>
        {weakTracksCount > 0 && (
          <span className="nav-badge">{weakTracksCount}</span>
        )}
      </button>

      <button 
        className={`nav-tab ${activeTab === 'settings' ? 'active' : ''}`}
        onClick={() => onTabChange('settings')}
      >
        <Settings size={22} />
        <span>Настройки</span>
      </button>
    </nav>
  );
}
