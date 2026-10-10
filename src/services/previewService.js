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

// Search songs using Apple iTunes Search API (country=SK prioritizing Slovak/local catalogue)
export async function searchTracksOnline(query) {
  if (!query || query.trim().length === 0) return [];

  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&country=sk&media=music&entity=song&limit=30`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to search tracks');

  const data = await res.json();
  let results = data.results || [];

  if (results.length === 0) {
    const globalRes = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&entity=song&limit=30`);
    if (globalRes.ok) {
      const gData = await globalRes.json();
      results = gData.results || [];
    }
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
