// Spotify Web API and Web Playback SDK Integration with PKCE OAuth

const SPOTIFY_CLIENT_ID_KEY = 'quizbeat_spotify_client_id';
const SPOTIFY_TOKEN_KEY = 'quizbeat_spotify_access_token';
const SPOTIFY_REFRESH_TOKEN_KEY = 'quizbeat_spotify_refresh_token';
const SPOTIFY_TOKEN_EXPIRY_KEY = 'quizbeat_spotify_token_expiry';
const SPOTIFY_CODE_VERIFIER_KEY = 'quizbeat_code_verifier';

export function getStoredClientId() {
  return localStorage.getItem(SPOTIFY_CLIENT_ID_KEY) || '';
}

export function saveClientId(clientId) {
  localStorage.setItem(SPOTIFY_CLIENT_ID_KEY, clientId.trim());
}

export function getRedirectUri() {
  // Normalize current URL without search/hash
  return window.location.origin + window.location.pathname;
}

// Generate code verifier and code challenge for PKCE
function generateRandomString(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function generateCodeChallenge(codeVerifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export async function redirectToSpotifyAuth(clientId) {
  const verifier = generateRandomString(128);
  const challenge = await generateCodeChallenge(verifier);

  localStorage.setItem(SPOTIFY_CODE_VERIFIER_KEY, verifier);
  if (clientId) saveClientId(clientId);

  const activeClientId = clientId || getStoredClientId();
  if (!activeClientId) {
    throw new Error('Укажите Spotify Client ID в настройках');
  }

  const redirectUri = getRedirectUri();
  const scopes = [
    'streaming',
    'user-read-email',
    'user-read-private',
    'user-modify-playback-state',
    'user-read-playback-state',
    'playlist-read-private',
    'playlist-read-collaborative'
  ].join(' ');

  const authUrl = new URL('https://accounts.spotify.com/authorize');
  authUrl.search = new URLSearchParams({
    response_type: 'code',
    client_id: activeClientId,
    scope: scopes,
    code_challenge_method: 'S256',
    code_challenge: challenge,
    redirect_uri: redirectUri,
  }).toString();

  window.location.href = authUrl.toString();
}

export async function handleSpotifyCallback() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  const error = params.get('error');

  if (error) {
    console.error('Spotify Auth Error:', error);
    cleanUrlParams();
    return false;
  }

  if (!code) return false;

  const verifier = localStorage.getItem(SPOTIFY_CODE_VERIFIER_KEY);
  const clientId = getStoredClientId();
  const redirectUri = getRedirectUri();

  if (!verifier || !clientId) {
    cleanUrlParams();
    return false;
  }

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
        code_verifier: verifier,
      }),
    });

    const data = await response.json();
    if (data.access_token) {
      localStorage.setItem(SPOTIFY_TOKEN_KEY, data.access_token);
      if (data.refresh_token) {
        localStorage.setItem(SPOTIFY_REFRESH_TOKEN_KEY, data.refresh_token);
      }
      const expiry = Date.now() + (data.expires_in || 3600) * 1000;
      localStorage.setItem(SPOTIFY_TOKEN_EXPIRY_KEY, expiry.toString());
      localStorage.removeItem(SPOTIFY_CODE_VERIFIER_KEY);
      cleanUrlParams();
      return true;
    }
  } catch (err) {
    console.error('Failed to exchange Spotify token:', err);
  }

  cleanUrlParams();
  return false;
}

function cleanUrlParams() {
  const cleanUrl = window.location.origin + window.location.pathname;
  window.history.replaceState({}, document.title, cleanUrl);
}

export function getSpotifyToken() {
  const token = localStorage.getItem(SPOTIFY_TOKEN_KEY);
  const expiry = localStorage.getItem(SPOTIFY_TOKEN_EXPIRY_KEY);
  if (!token) return null;
  if (expiry && Date.now() > parseInt(expiry, 10)) {
    // expired
    return null;
  }
  return token;
}

export function logoutSpotify() {
  localStorage.removeItem(SPOTIFY_TOKEN_KEY);
  localStorage.removeItem(SPOTIFY_REFRESH_TOKEN_KEY);
  localStorage.removeItem(SPOTIFY_TOKEN_EXPIRY_KEY);
}

// Fetch tracks from a Spotify Playlist ID
export async function fetchPlaylistTracks(playlistId) {
  const token = getSpotifyToken();
  if (!token) throw new Error('Требуется авторизация в Spotify');

  // Support both full Spotify URLs and raw IDs
  let cleanId = playlistId.trim();
  if (cleanId.includes('playlist/')) {
    cleanId = cleanId.split('playlist/')[1].split('?')[0];
  }

  const res = await fetch(`https://api.spotify.com/v1/playlists/${cleanId}?fields=name,images,tracks.items(track(id,name,artists,album(name,images,release_date),uri,duration_ms))`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    throw new Error(`Ошибка загрузки плейлиста (${res.status})`);
  }

  const data = await res.json();
  const tracks = (data.tracks?.items || [])
    .filter(item => item.track && item.track.id && item.track.uri)
    .map(item => {
      const t = item.track;
      return {
        id: t.id,
        name: t.name,
        artist: t.artists.map(a => a.name).join(', '),
        albumArt: t.album?.images?.[0]?.url || '',
        year: t.album?.release_date ? t.album.release_date.substring(0, 4) : '—',
        spotifyUri: t.uri,
        durationMs: t.duration_ms || 180000,
        source: 'spotify'
      };
    });

  return {
    playlistName: data.name,
    coverArt: data.images?.[0]?.url || '',
    tracks
  };
}

// User playlists
export async function fetchUserPlaylists() {
  const token = getSpotifyToken();
  if (!token) return [];

  const res = await fetch('https://api.spotify.com/v1/me/playlists?limit=20', {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) return [];
  const data = await res.json();
  return (data.items || []).map(p => ({
    id: p.id,
    name: p.name,
    image: p.images?.[0]?.url || '',
    tracksCount: p.tracks?.total || 0
  }));
}

// Web Playback SDK Player Controller
class SpotifyPlayerService {
  constructor() {
    this.player = null;
    this.deviceId = null;
    this.isReady = false;
    this.statusListeners = [];
  }

  onStatusChange(fn) {
    this.statusListeners.push(fn);
  }

  notifyStatus(status) {
    this.statusListeners.forEach(fn => fn(status));
  }

  async initialize() {
    const token = getSpotifyToken();
    if (!token) return false;

    return new Promise((resolve) => {
      const initPlayer = () => {
        if (!window.Spotify || !window.Spotify.Player) {
          setTimeout(initPlayer, 200);
          return;
        }

        if (this.player) {
          resolve(true);
          return;
        }

        this.player = new window.Spotify.Player({
          name: 'QuizBeat Web Trainer',
          getOAuthToken: cb => {
            const currentToken = getSpotifyToken();
            cb(currentToken);
          },
          volume: 0.8
        });

        this.player.addListener('ready', ({ device_id }) => {
          this.deviceId = device_id;
          this.isReady = true;
          this.notifyStatus({ isReady: true, deviceId: device_id });
          resolve(true);
        });

        this.player.addListener('not_ready', () => {
          this.isReady = false;
          this.notifyStatus({ isReady: false });
        });

        this.player.addListener('initialization_error', ({ message }) => {
          console.error('Spotify Init Error:', message);
          resolve(false);
        });

        this.player.addListener('authentication_error', ({ message }) => {
          console.error('Spotify Auth Error:', message);
          logoutSpotify();
          resolve(false);
        });

        this.player.connect();
      };

      if (window.Spotify && window.Spotify.Player) {
        initPlayer();
      } else {
        window.onSpotifyWebPlaybackSDKReady = initPlayer;
        setTimeout(() => resolve(false), 8000);
      }
    });
  }

  async playTrack(spotifyUri, positionMs = 30000) {
    const token = getSpotifyToken();
    if (!token || !this.deviceId) return false;

    try {
      await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${this.deviceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          uris: [spotifyUri],
          position_ms: positionMs
        })
      });
      return true;
    } catch (e) {
      console.error('Error starting playback:', e);
      return false;
    }
  }

  async pause() {
    if (this.player) {
      await this.player.pause();
    }
  }

  async resume() {
    if (this.player) {
      await this.player.resume();
    }
  }
}

export const spotifyPlayer = new SpotifyPlayerService();
