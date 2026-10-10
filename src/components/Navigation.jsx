import React from 'react';
import { Gamepad2, Disc3, Trophy, AlertCircle, Settings } from 'lucide-react';

export default function Navigation({ activeTab, onTabChange, weakTracksCount }) {
  return (
    <nav className="bottom-nav">
      <button 
        className={`nav-tab ${activeTab === 'quiz' ? 'active' : ''}`}
        onClick={() => onTabChange('quiz')}
      >
        <Gamepad2 size={21} />
        <span>Game</span>
      </button>

      <button 
        className={`nav-tab ${activeTab === 'packs' ? 'active' : ''}`}
        onClick={() => onTabChange('packs')}
      >
        <Disc3 size={21} />
        <span>Playlists</span>
      </button>

      <button 
        className={`nav-tab ${activeTab === 'leaderboard' ? 'active' : ''}`}
        onClick={() => onTabChange('leaderboard')}
      >
        <Trophy size={21} />
        <span>Leaders</span>
      </button>

      <button 
        className={`nav-tab ${activeTab === 'weak' ? 'active' : ''}`}
        onClick={() => onTabChange('weak')}
      >
        <AlertCircle size={21} />
        <span>Mistakes</span>
        {weakTracksCount > 0 && (
          <span className="nav-badge">{weakTracksCount}</span>
        )}
      </button>

      <button 
        className={`nav-tab ${activeTab === 'settings' ? 'active' : ''}`}
        onClick={() => onTabChange('settings')}
      >
        <Settings size={21} />
        <span>Settings</span>
      </button>
    </nav>
  );
}
