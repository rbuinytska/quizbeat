// Curated Packs and Audio Preview Engine (95+ Oldies Tracks)
import { SK_TRACKS, WORLD_TRACKS } from '../data/tracksData';

export function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export const PACK_CATEGORIES = [
  { id: 'all', name: 'All Packs' },
  { id: 'slovak', name: '🇸🇰 Slovak Oldies' },
  { id: 'world', name: '🌍 World Oldies' }
];

// Helper to filter by genre/decade if desired
const DISCO_SUB = WORLD_TRACKS.filter(t => 
  ['ABBA', 'Boney M.', 'Earth, Wind & Fire', 'Modern Talking', 'Bee Gees', 'Gloria Gaynor', 'Ottawan', 'Village People', 'Corona', 'Ace of Base', 'Aqua', 'Mr. President', 'Scatman John', 'Dr. Alban'].some(a => t.artist.includes(a))
);

const ROCK_SUB = [...WORLD_TRACKS, ...SK_TRACKS].filter(t => 
  ['Queen', 'Europe', 'AC/DC', 'Deep Purple', 'Scorpions', 'Bon Jovi', 'Guns N\' Roses', 'Survivor', 'Elán', 'Team', 'Tublatanka', 'Iné Kafe'].some(a => t.artist.includes(a))
);

export const CURATED_PACKS = [
  {
    id: 'pack_super_mix',
    category: 'all',
    name: '🪩 Oldies Party: Mega Mix',
    subtitle: '95 iconic world & Slovak retro hits shuffled',
    emoji: '🔥',
    color: 'from-purple-600 to-pink-600',
    tracks: shuffleArray([...SK_TRACKS, ...WORLD_TRACKS])
  },
  {
    id: 'pack_sk_mega',
    category: 'slovak',
    name: '🇸🇰 Slovak Oldies: Classics (53 Tracks)',
    subtitle: 'Karol Duchoň, Meky Žbirka, Elán, Team, Marika Gombitová, Müller',
    emoji: '👑',
    color: 'from-blue-600 to-indigo-700',
    tracks: shuffleArray(SK_TRACKS)
  },
  {
    id: 'pack_world_mega',
    category: 'world',
    name: '🌍 World Oldies: Greatest Hits (42 Tracks)',
    subtitle: 'ABBA, Boney M, Queen, Jackson, Whitney, Modern Talking, a-ha',
    emoji: '🪩',
    color: 'from-amber-400 to-pink-600',
    tracks: shuffleArray(WORLD_TRACKS)
  },
  {
    id: 'pack_disco_dance',
    category: 'world',
    name: '🕺 Disco & Eurodance (70s / 80s / 90s)',
    subtitle: 'Boney M, ABBA, Ottawan, Modern Talking, Dr. Alban, Haddaway',
    emoji: '🪩',
    color: 'from-pink-500 to-purple-600',
    tracks: shuffleArray(DISCO_SUB)
  },
  {
    id: 'pack_retro_rock',
    category: 'all',
    name: '⚡ Retro Rock: Legends & Anthems',
    subtitle: 'Queen, AC/DC, Scorpions, Elán, Tublatanka, Team, Bon Jovi',
    emoji: '🎸',
    color: 'from-amber-500 to-red-600',
    tracks: shuffleArray(ROCK_SUB)
  }
];

// JSONP Fetcher to bypass CORS in all browsers without server/proxy
export function fetchJsonp(url, timeoutMs = 8000) {
  return new Promise((resolve, reject) => {
    const callbackName = 'itunes_jsonp_' + Date.now() + '_' + Math.floor(Math.random() * 100000);
    const script = document.createElement('script');
    const separator = url.includes('?') ? '&' : '?';
    script.src = `${url}${separator}callback=${callbackName}`;

    const timer = setTimeout(() => {
      cleanup();
      reject(new Error('Request timed out'));
    }, timeoutMs);

    function cleanup() {
      clearTimeout(timer);
      if (window[callbackName]) {
        delete window[callbackName];
      }
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    }

    window[callbackName] = (data) => {
      cleanup();
      resolve(data);
    };

    script.onerror = (err) => {
      cleanup();
      reject(err);
    };

    document.body.appendChild(script);
  });
}

// Search songs using Apple iTunes Search API via JSONP (prioritizes SK, falls back to US/Global)
export async function searchTracksOnline(query, country = 'sk', limit = 30) {
  if (!query || query.trim().length === 0) return [];

  try {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&country=${country}&media=music&entity=song&limit=${limit}`;
    const data = await fetchJsonp(url);
    let results = data.results || [];

    if (results.length === 0 && country !== 'us') {
      const globalUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&country=us&media=music&entity=song&limit=${limit}`;
      const gData = await fetchJsonp(globalUrl);
      results = gData.results || [];
    }

    return results
      .filter(item => item.previewUrl)
      .map(item => ({
        id: `itunes_${item.trackId}`,
        name: item.trackName,
        artist: item.artistName,
        albumArt: (item.artworkUrl100 || '').replace('100x100bb', '600x600bb'),
        year: item.releaseDate ? item.releaseDate.substring(0, 4) : '—',
        audioUrl: item.previewUrl,
        source: 'preview'
      }));
  } catch (err) {
    console.error('searchTracksOnline error:', err);
    return [];
  }
}

// Resolve a single song name or "Artist - Title" query to a playable track
export async function resolveTrackFromQuery(query) {
  if (!query || query.trim().length === 0) return null;
  const results = await searchTracksOnline(query, 'sk', 3);
  if (results && results.length > 0) return results[0];
  const globalResults = await searchTracksOnline(query, 'us', 3);
  return globalResults && globalResults.length > 0 ? globalResults[0] : null;
}

// Parse multi-line text tracklist (e.g. copied from Spotify, text or playlist)
export async function parseTrackListText(text, onProgress) {
  const lines = text
    .split('\n')
    .map(line => line.replace(/^[\d+.\-–—\s*]+/, '').trim())
    .filter(line => line.length > 2);

  const tracks = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (onProgress) onProgress(i + 1, lines.length, line);
    try {
      const track = await resolveTrackFromQuery(line);
      if (track) {
        // avoid duplicates
        if (!tracks.some(t => t.id === track.id)) {
          tracks.push(track);
        }
      }
    } catch (e) {
      console.warn('Failed to resolve line:', line, e);
    }
  }
  return tracks;
}

// LocalStorage helpers for user-saved custom packs
const CUSTOM_PACKS_KEY = 'quizbeat_custom_packs';

export function getCustomSavedPacks() {
  try {
    const raw = localStorage.getItem(CUSTOM_PACKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomPack(pack) {
  try {
    const existing = getCustomSavedPacks();
    const updated = [pack, ...existing.filter(p => p.id !== pack.id)];
    localStorage.setItem(CUSTOM_PACKS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('saveCustomPack error:', e);
    return [];
  }
}

export function deleteCustomPack(packId) {
  try {
    const existing = getCustomSavedPacks();
    const updated = existing.filter(p => p.id !== packId);
    localStorage.setItem(CUSTOM_PACKS_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

// HTML5 Audio Controller for 30s previews
class PreviewPlayerService {
  constructor() {
    this.audio = new Audio();
    this.audio.preload = 'auto';
    this.timeoutId = null;
    this.onEndedCallback = null;
  }

  play(audioUrl, durationSeconds = 10, onEnded = null) {
    this.stop();
    this.onEndedCallback = onEnded;

    this.audio.src = audioUrl;
    this.audio.currentTime = 0;

    const playPromise = this.audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          if (durationSeconds && durationSeconds > 0) {
            this.timeoutId = setTimeout(() => {
              this.stop();
              if (this.onEndedCallback) this.onEndedCallback();
            }, durationSeconds * 1000);
          }
        })
        .catch(err => {
          console.warn('Playback interrupted:', err);
        });
    }

    this.audio.onended = () => {
      this.stop();
      if (this.onEndedCallback) this.onEndedCallback();
    };
  }

  stop() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    if (this.audio) {
      this.audio.pause();
    }
  }

  pause() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.audio.pause();
  }

  resume(remainingSeconds) {
    this.audio.play();
    if (remainingSeconds > 0) {
      this.timeoutId = setTimeout(() => {
        this.stop();
        if (this.onEndedCallback) this.onEndedCallback();
      }, remainingSeconds * 1000);
    }
  }

  setVolume(vol) {
    this.audio.volume = Math.max(0, Math.min(1, vol));
  }
}

export const previewPlayer = new PreviewPlayerService();
