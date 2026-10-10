import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import QuizView from './components/QuizView';
import LobbyView from './components/LobbyView';
import PlaylistsView from './components/PlaylistsView';
import LeaderboardView from './components/LeaderboardView';
import WeakTracksView from './components/WeakTracksView';
import SettingsModal from './components/SettingsModal';

import { CURATED_PACKS, shuffleArray } from './services/previewService';
import { 
  handleSpotifyCallback, 
  getSpotifyToken, 
  spotifyPlayer, 
  fetchUserPlaylists 
} from './services/spotify';
import { soundFx } from './services/soundFx';
import { 
  getLocalPlayerProfile, 
  saveLocalPlayerProfile 
} from './services/leaderboardService';

export default function App() {
  const [activeTab, setActiveTab] = useState('quiz'); // 'quiz' | 'packs' | 'leaderboard' | 'weak' | 'settings'
  const [gameState, setGameState] = useState('lobby'); // 'lobby' | 'playing'
  const [activePack, setActivePack] = useState(CURATED_PACKS[0]);
  const [roundTracks, setRoundTracks] = useState([]);
  const [roundSettings, setRoundSettings] = useState({ subMode: 'flashcards', songCount: 20 });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Player Profile with Nickname and Cumulative Stats
  const [playerProfile, setPlayerProfile] = useState(getLocalPlayerProfile);

  // Weak tracks
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
    const weakPack = {
      id: `weak_drill_${Date.now()}`,
      name: '🎯 Mistakes Review',
      subtitle: `${weakTracks.length} tracks to master`,
      tracks: [...weakTracks].sort(() => 0.5 - Math.random())
    };
    setActivePack(weakPack);
    setRoundTracks(weakPack.tracks);
    setRoundSettings({ subMode: 'flashcards', songCount: weakTracks.length });
    setGameState('playing');
    setActiveTab('quiz');
  };

  // Start round with customized settings from Lobby
  const handleStartGame = ({ pack, songCount, subMode, duration }) => {
    setActivePack(pack);
    if (duration && duration !== fragmentDuration) {
      handleDurationChange(duration);
    }
    setRoundSettings({ subMode, songCount });

    const shuffled = shuffleArray(pack.tracks);
    const count = songCount === 'all' ? shuffled.length : Math.min(songCount, shuffled.length);
    setRoundTracks(shuffled.slice(0, count));
    setGameState('playing');
    setActiveTab('quiz');
  };

  // Record Answer: Updates player's nickname profile stats and syncs with Leaderboard
  const handleRecordAnswer = (isCorrect, track) => {
    setPlayerProfile(prev => {
      const currentStreak = prev.currentStreak || 0;
      const nextStreak = isCorrect ? currentStreak + 1 : 0;
      const addedPoints = isCorrect ? 100 * Math.max(1, nextStreak) : 0;
      const nextBestStreak = Math.max(prev.bestStreak || 0, nextStreak);

      const updated = {
        ...prev,
        score: (prev.score || 0) + addedPoints,
        totalGuessed: (prev.totalGuessed || 0) + (isCorrect ? 1 : 0),
        totalMissed: (prev.totalMissed || 0) + (isCorrect ? 0 : 1),
        currentStreak: nextStreak,
        bestStreak: nextBestStreak,
        lastActive: Date.now()
      };
      saveLocalPlayerProfile(updated);
      return updated;
    });
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
    setGameState('lobby');
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
        score={playerProfile.score || 0}
        streak={playerProfile.currentStreak || 0}
        onOpenSettings={() => setIsSettingsOpen(true)}
        activePackName={activePack.name}
      />

      {/* Main View Area */}
      <main className="main-content">
        {activeTab === 'quiz' && (
          gameState === 'lobby' ? (
            <LobbyView 
              playerProfile={playerProfile}
              onUpdateProfile={(updated) => {
                setPlayerProfile(updated);
                saveLocalPlayerProfile(updated);
              }}
              initialPack={activePack}
              fragmentDuration={fragmentDuration}
              onDurationChange={handleDurationChange}
              onStartGame={handleStartGame}
            />
          ) : (
            <QuizView 
              tracks={roundTracks.length > 0 ? roundTracks : activePack.tracks}
              packName={activePack.name}
              fragmentDuration={fragmentDuration}
              onDurationChange={handleDurationChange}
              isSpotifyConnected={isSpotifyConnected}
              onAddWeakTrack={handleAddWeakTrack}
              score={playerProfile.score || 0}
              streak={playerProfile.currentStreak || 0}
              onRecordAnswer={handleRecordAnswer}
              initialSubMode={roundSettings.subMode}
              onExitToLobby={() => setGameState('lobby')}
            />
          )
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

        {activeTab === 'leaderboard' && (
          <LeaderboardView 
            playerProfile={playerProfile}
            onUpdateProfile={setPlayerProfile}
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
