import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  Disc, 
  Layers, 
  ExternalLink, 
  CheckCircle2, 
  PlusCircle, 
  Music,
  ArrowRight,
  ListMusic
} from 'lucide-react';
import { CURATED_PACKS, searchTracksOnline } from '../services/previewService';
import { fetchPlaylistTracks } from '../services/spotify';
import { soundFx } from '../services/soundFx';

export default function PlaylistsView({
  activePackId,
  onSelectPack,
  isSpotifyConnected,
  userSpotifyPlaylists = [],
  onOpenSettings
}) {
  const [activeTab, setActiveTab] = useState('curated'); // 'curated' | 'search' | 'spotify'
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [customPackName, setCustomPackName] = useState('');

  // Spotify Playlist link input
  const [spotifyUrlInput, setSpotifyUrlInput] = useState('');
  const [isImportingSpotify, setIsImportingSpotify] = useState(false);
  const [spotifyImportError, setSpotifyImportError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    soundFx.playClick();
    setIsSearching(true);
    try {
      const results = await searchTracksOnline(searchQuery);
      setSearchResults(results);
      setCustomPackName(`Поиск: "${searchQuery}"`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCreateSearchPack = () => {
    if (searchResults.length < 4) return;
    soundFx.playClick();
    onSelectPack({
      id: `custom_search_${Date.now()}`,
      name: customPackName || 'Пользовательский пак',
      subtitle: `${searchResults.length} треков для тренировки`,
      tracks: searchResults
    });
  };

  const handleImportSpotifyUrl = async (e) => {
    e.preventDefault();
    if (!spotifyUrlInput.trim()) return;

    if (!isSpotifyConnected) {
      onOpenSettings();
      return;
    }

    setIsImportingSpotify(true);
    setSpotifyImportError('');
    try {
      const result = await fetchPlaylistTracks(spotifyUrlInput);
      if (result.tracks.length < 4) {
        setSpotifyImportError('В плейлисте должно быть минимум 4 трека для квиза');
        return;
      }
      soundFx.playClick();
      onSelectPack({
        id: `spotify_${Date.now()}`,
        name: `Spotify: ${result.playlistName}`,
        subtitle: `${result.tracks.length} треков из вашего Spotify`,
        tracks: result.tracks
      });
    } catch (err) {
      setSpotifyImportError(err.message || 'Не удалось загрузить плейлист');
    } finally {
      setIsImportingSpotify(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Tab Switcher */}
      <div className="mode-selector">
        <button 
          className={`mode-btn ${activeTab === 'curated' ? 'active' : ''}`}
          onClick={() => { soundFx.playClick(); setActiveTab('curated'); }}
        >
          <span>🔥 Готовые паки</span>
        </button>
        <button 
          className={`mode-btn ${activeTab === 'search' ? 'active' : ''}`}
          onClick={() => { soundFx.playClick(); setActiveTab('search'); }}
        >
          <span>🔍 Поиск онлайн</span>
        </button>
        <button 
          className={`mode-btn ${activeTab === 'spotify' ? 'active' : ''}`}
          onClick={() => { soundFx.playClick(); setActiveTab('spotify'); }}
        >
          <span>🎧 Spotify</span>
        </button>
      </div>

      {/* TAB 1: Curated Packs */}
      {activeTab === 'curated' && (
        <div className="packs-grid">
          {CURATED_PACKS.map(pack => {
            const isActive = activePackId === pack.id;
            return (
              <div 
                key={pack.id}
                className={`pack-card ${isActive ? 'active' : ''}`}
                onClick={() => {
                  soundFx.playClick();
                  onSelectPack(pack);
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background: 'var(--bg-surface)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.6rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                  }}>
                    {pack.emoji}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: '#fff' }}>
                      {pack.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                      {pack.subtitle}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--accent-purple)', marginTop: 4, fontWeight: 700 }}>
                      {pack.tracks.length} треков
                    </div>
                  </div>
                </div>

                {isActive && <CheckCircle2 size={22} color="var(--accent-purple)" />}
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: Online Search (iTunes preview engine) */}
      {activeTab === 'search' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8 }}>
            <input 
              type="text" 
              className="input-field"
              placeholder="Артист, жанр или трек (напр. Руки Вверх, Queen)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              type="submit" 
              className="action-btn"
              style={{ width: 'auto', padding: '0 18px', borderRadius: 'var(--radius-md)' }}
              disabled={isSearching}
            >
              {isSearching ? '...' : <Search size={18} />}
            </button>
          </form>

          {searchResults.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  Найдено: {searchResults.length} треков
                </span>
                <button 
                  className="action-btn"
                  style={{ width: 'auto', padding: '8px 14px', fontSize: '0.85rem' }}
                  onClick={handleCreateSearchPack}
                >
                  <PlusCircle size={16} /> Начать играть этот пак
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {searchResults.slice(0, 8).map(track => (
                  <div 
                    key={track.id}
                    style={{
                      background: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 12,
                      padding: '10px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12
                    }}
                  >
                    <img 
                      src={track.albumArt} 
                      alt="" 
                      style={{ width: 42, height: 42, borderRadius: 8, objectFit: 'cover' }} 
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {track.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {track.artist} {track.year ? `(${track.year})` : ''}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Spotify Playlists */}
      {activeTab === 'spotify' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {!isSpotifyConnected ? (
            <div style={{
              background: 'rgba(29, 185, 84, 0.08)',
              border: '1px solid rgba(29, 185, 84, 0.3)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              textAlign: 'center'
            }}>
              <div style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: 'var(--accent-spotify)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px'
              }}>
                <Disc size={26} />
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Подключите Spotify Premium</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.4 }}>
                Позволит загружать любые ваши плейлисты и тренироваться на полных треках прямо в браузере.
              </p>
              <button 
                className="action-btn"
                style={{ 
                  background: 'var(--grad-spotify)', 
                  marginTop: 16,
                  boxShadow: 'var(--shadow-neon-green)'
                }}
                onClick={onOpenSettings}
              >
                Настроить Spotify вход
              </button>
            </div>
          ) : (
            <div>
              <form onSubmit={handleImportSpotifyUrl} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  Вставьте ссылку на любой Spotify плейлист:
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input 
                    type="text" 
                    className="input-field"
                    placeholder="https://open.spotify.com/playlist/..."
                    value={spotifyUrlInput}
                    onChange={(e) => setSpotifyUrlInput(e.target.value)}
                  />
                  <button 
                    type="submit" 
                    className="action-btn"
                    style={{ width: 'auto', padding: '0 18px', background: 'var(--grad-spotify)' }}
                    disabled={isImportingSpotify}
                  >
                    {isImportingSpotify ? '...' : <ArrowRight size={18} />}
                  </button>
                </div>
                {spotifyImportError && (
                  <div style={{ color: '#f87171', fontSize: '0.8rem' }}>
                    {spotifyImportError}
                  </div>
                )}
              </form>

              {userSpotifyPlaylists.length > 0 && (
                <div style={{ marginTop: 20 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 10 }}>
                    Ваши плейлисты:
                  </div>
                  <div className="packs-grid">
                    {userSpotifyPlaylists.map(pl => (
                      <div 
                        key={pl.id}
                        className="pack-card"
                        onClick={async () => {
                          soundFx.playClick();
                          try {
                            const res = await fetchPlaylistTracks(pl.id);
                            onSelectPack({
                              id: `spotify_${pl.id}`,
                              name: pl.name,
                              subtitle: `${res.tracks.length} треков`,
                              tracks: res.tracks
                            });
                          } catch (e) {
                            alert(e.message);
                          }
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          {pl.image ? (
                            <img src={pl.image} alt="" style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <ListMusic size={20} />
                            </div>
                          )}
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{pl.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{pl.tracksCount} треков</div>
                          </div>
                        </div>
                        <ArrowRight size={18} color="var(--text-muted)" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
