import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import QuizView from './components/QuizView';
import PlaylistsView from './components/PlaylistsView';
import WeakTracksView from './components/WeakTracksView';
import SettingsModal from './components/SettingsModal';

import { CURATED_PACKS } from './services/previewService';
import { 
  handleSpotifyCallback, 
  getSpotifyToken, 
  spotifyPlayer, 
  fetchUserPlaylists 
} from './services/spotify';
import { soundFx } from './services/soundFx';

export default function App() {
  const [activeTab, setActiveTab] = useState('quiz'); // 'quiz' | 'packs' | 'weak' | 'settings'
  const [activePack, setActivePack] = useState(CURATED_PACKS[0]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Stats & Progress
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [weakTracks, setWeakTracks] = useState(() => {
    try {
      const saved = localStorage.getItem('quizbeat_weak_tracks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Settings
  const [fragmentDuration, setFragmentDuration] = useState(() => {
    const saved = localStorage.getItem('quizbeat_duration');
    return saved ? parseInt(saved, 10) : 10;
  });
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Spotify State
  const [isSpotifyConnected, setIsSpotifyConnected] = useState(false);
  const [userPlaylists, setUserPlaylists] = useState([]);

  // Check Spotify callback & auth on mount
  useEffect(() => {
    const initAuth = async () => {
      const codeHandled = await handleSpotifyCallback();
      const token = getSpotifyToken();
      if (token) {
        setIsSpotifyConnected(true);
        spotifyPlayer.initialize();
        const playlists = await fetchUserPlaylists();
        setUserPlaylists(playlists);
      }
    };
    initAuth();
  }, []);

  // Save weak tracks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('quizbeat_weak_tracks', JSON.stringify(weakTracks));
    } catch (e) {
      console.warn('Failed to save weak tracks:', e);
    }
  }, [weakTracks]);

  const handleAddWeakTrack = (track) => {
    setWeakTracks(prev => {
      if (prev.some(t => t.id === track.id)) return prev;
      return [track, ...prev];
    });
  };

  const handleRemoveWeakTrack = (trackId) => {
    setWeakTracks(prev => prev.filter(t => t.id !== trackId));
  };

  const handleClearWeakTracks = () => {
    setWeakTracks([]);
  };

  const handleTrainWeakTracks = () => {
    if (weakTracks.length < 2) return;
    setActivePack({
      id: `weak_drill_${Date.now()}`,
      name: '🎯 Работа над ошибками',
      subtitle: `${weakTracks.length} проблемных треков`,
      tracks: [...weakTracks].sort(() => 0.5 - Math.random())
    });
    setActiveTab('quiz');
  };

  const handleRecordAnswer = (isCorrect, track) => {
    if (isCorrect) {
      setScore(prev => prev + 100 * Math.max(1, streak));
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
  };

  const handleDurationChange = (sec) => {
    setFragmentDuration(sec);
    localStorage.setItem('quizbeat_duration', sec.toString());
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundFx.enabled = next;
  };

  const handleSelectPack = (pack) => {
    setActivePack(pack);
    setActiveTab('quiz');
  };

  const handleTabChange = (tab) => {
    soundFx.playClick();
    if (tab === 'settings') {
      setIsSettingsOpen(true);
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div className="app-container">
      {/* Top Header */}
      <Header 
        score={score}
        streak={streak}
        isSpotifyConnected={isSpotifyConnected}
        onOpenSettings={() => setIsSettingsOpen(true)}
        activePackName={activePack.name}
      />

      {/* Main View Area */}
      <main className="main-content">
        {activeTab === 'quiz' && (
          <QuizView 
            tracks={activePack.tracks}
            packName={activePack.name}
            fragmentDuration={fragmentDuration}
            onDurationChange={handleDurationChange}
            isSpotifyConnected={isSpotifyConnected}
            onAddWeakTrack={handleAddWeakTrack}
            score={score}
            streak={streak}
            onRecordAnswer={handleRecordAnswer}
          />
        )}

        {activeTab === 'packs' && (
          <PlaylistsView 
            activePackId={activePack.id}
            onSelectPack={handleSelectPack}
            isSpotifyConnected={isSpotifyConnected}
            userSpotifyPlaylists={userPlaylists}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        )}

        {activeTab === 'weak' && (
          <WeakTracksView 
            weakTracks={weakTracks}
            onClearWeakTracks={handleClearWeakTracks}
            onRemoveWeakTrack={handleRemoveWeakTrack}
            onTrainWeakTracks={handleTrainWeakTracks}
            isSpotifyConnected={isSpotifyConnected}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <Navigation 
        activeTab={activeTab}
        onTabChange={handleTabChange}
        weakTracksCount={weakTracks.length}
      />

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isSpotifyConnected={isSpotifyConnected}
        fragmentDuration={fragmentDuration}
        onDurationChange={handleDurationChange}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />
    </div>
  );
}
