// Player Stats & Leaderboard Service (Local + Cloud Sync / Firebase Support)

const PLAYER_PROFILE_KEY = 'quizbeat_player_profile';
const LEADERBOARD_CACHE_KEY = 'quizbeat_leaderboard_cache';
const FIREBASE_CONFIG_KEY = 'quizbeat_firebase_config';

// Default starter profile
export function getLocalPlayerProfile() {
  try {
    const saved = localStorage.getItem(PLAYER_PROFILE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {}

  const defaultProfile = {
    id: 'user_' + Math.random().toString(36).substring(2, 9),
    nickname: 'Player',
    avatar: '🪩',
    totalGuessed: 0,
    totalMissed: 0,
    score: 0,
    bestStreak: 0,
    currentStreak: 0,
    lastActive: Date.now()
  };
  saveLocalPlayerProfile(defaultProfile);
  return defaultProfile;
}

export function saveLocalPlayerProfile(profile) {
  try {
    localStorage.setItem(PLAYER_PROFILE_KEY, JSON.stringify(profile));
    syncScoreToLeaderboard(profile);
  } catch (e) {}
}

// Calculate player title / rank based on score
export function getPlayerRank(totalGuessed) {
  if (totalGuessed >= 50) return { title: 'Oldies Party Legend', badge: '👑', color: '#f59e0b' };
  if (totalGuessed >= 25) return { title: 'Disco Superstar', badge: '⭐', color: '#ec4899' };
  if (totalGuessed >= 10) return { title: 'Retro Music Expert', badge: '🎧', color: '#8b5cf6' };
  return { title: 'Quiz Rookie', badge: '🌱', color: '#06b6d4' };
}

// Default community / party leaders so board is lively
const DEFAULT_LEADERS = [
  { id: 'leader_1', nickname: 'Disco Queen', avatar: '💃', score: 3200, totalGuessed: 32, bestStreak: 8, accuracy: 88 },
  { id: 'leader_2', nickname: 'Karol Duchoň Fan', avatar: '🎙️', score: 2600, totalGuessed: 26, bestStreak: 6, accuracy: 82 },
  { id: 'leader_3', nickname: 'Queen & ABBA Crew', avatar: '🎸', score: 1900, totalGuessed: 19, bestStreak: 5, accuracy: 76 }
];

export function getCachedLeaderboard() {
  try {
    const saved = localStorage.getItem(LEADERBOARD_CACHE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return DEFAULT_LEADERS;
}

export function syncScoreToLeaderboard(playerProfile) {
  try {
    let board = getCachedLeaderboard();
    const existingIdx = board.findIndex(item => item.id === playerProfile.id);

    const accuracy = (playerProfile.totalGuessed + playerProfile.totalMissed) > 0
      ? Math.round((playerProfile.totalGuessed / (playerProfile.totalGuessed + playerProfile.totalMissed)) * 100)
      : 100;

    const entry = {
      id: playerProfile.id,
      nickname: playerProfile.nickname || 'Player',
      avatar: playerProfile.avatar || '🪩',
      score: playerProfile.score || 0,
      totalGuessed: playerProfile.totalGuessed || 0,
      bestStreak: playerProfile.bestStreak || 0,
      accuracy
    };

    if (existingIdx >= 0) {
      board[existingIdx] = entry;
    } else {
      board.push(entry);
    }

    // Sort by score descending
    board.sort((a, b) => b.score - a.score);

    localStorage.setItem(LEADERBOARD_CACHE_KEY, JSON.stringify(board));
  } catch (e) {}
}

export function resetPlayerStats() {
  const profile = getLocalPlayerProfile();
  const reset = {
    ...profile,
    totalGuessed: 0,
    totalMissed: 0,
    score: 0,
    bestStreak: 0,
    currentStreak: 0
  };
  saveLocalPlayerProfile(reset);
  return reset;
}
