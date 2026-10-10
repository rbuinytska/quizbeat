import React, { useState, useEffect } from 'react';
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
  ListMusic,
  Trash2,
  Play,
  RotateCcw,
  Zap,
  Flame,
  Radio
} from 'lucide-react';
import { 
  CURATED_PACKS, 
  PACK_CATEGORIES, 
  searchTracksOnline,
  parseTrackListText,
  saveCustomPack,
  getCustomSavedPacks,
  deleteCustomPack,
  shuffleArray
} from '../services/previewService';
import { soundFx } from '../services/soundFx';

// Quick Generator Presets (Queries that yield 25-30 instant retro party tracks)
const PRESET_THEMES = [
  { id: 'duchon', name: '👑 Karol Duchoň & Slovak Party', query: 'Karol Duchon', emoji: '👑', color: 'from-amber-500 to-red-600', desc: 'Legendary Slovak voice & party classics' },
  { id: 'elan_team', name: '🇸🇰 Elán & Team Classics', query: 'Elan', emoji: '🇸🇰', color: 'from-blue-600 to-indigo-700', desc: 'The biggest stadium rock hits of Slovakia' },
  { id: 'czech_gold', name: '🇨🇿 Czech Golden Hits', query: 'Karel Gott', emoji: '🇨🇿', color: 'from-emerald-500 to-teal-700', desc: 'Karel Gott, Michal David, Olympic' },
  { id: 'disco70s', name: '🕺 Disco 70s Fever', query: 'ABBA', emoji: '🪩', color: 'from-pink-500 to-purple-600', desc: 'ABBA, Boney M, Bee Gees, Chic' },
  { id: 'rock80s', name: '🎸 80s Arena Rock', query: 'Queen', emoji: '⚡', color: 'from-orange-500 to-red-600', desc: 'Queen, AC/DC, Bon Jovi, Europe' },
  { id: 'eurodance90s', name: '🎉 90s Eurodance Explosion', query: 'Haddaway', emoji: '🔥', color: 'from-cyan-500 to-blue-600', desc: 'Haddaway, Dr. Alban, Aqua, Eiffel 65' },
  { id: 'pop2000s', name: '📻 2000s Pop Party', query: 'Britney Spears', emoji: '🎧', color: 'from-purple-500 to-pink-500', desc: 'Britney, Backstreet Boys, Spice Girls' }
];

export default function PlaylistsView({
  activePackId,
  onSelectPack
}) {
  const [activeTab, setActiveTab] = useState('curated'); // 'curated' | 'search' | 'import'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [customPacks, setCustomPacks] = useState(getCustomSavedPacks);

  // Search tab states
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [customPackName, setCustomPackName] = useState('');
  const [isGeneratingPreset, setIsGeneratingPreset] = useState(false);
  const [presetGeneratingName, setPresetGeneratingName] = useState('');

  // Tracklist importer states
  const [textListInput, setTextListInput] = useState('');
  const [isResolvingText, setIsResolvingText] = useState(false);
  const [resolveProgress, setResolveProgress] = useState({ current: 0, total: 0, song: '' });

  // Refresh saved packs
  const refreshCustomPacks = () => {
    setCustomPacks(getCustomSavedPacks());
  };

  // Combine curated + custom packs
  const allAvailablePacks = [...customPacks, ...CURATED_PACKS];

  const filteredPacks = allAvailablePacks.filter(pack => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'custom') return pack.isCustom;
    return pack.category === selectedCategory;
  });

  // 1-Click Preset Generator
  const handleGeneratePreset = async (preset) => {
    soundFx.playClick();
    setIsGeneratingPreset(true);
    setPresetGeneratingName(preset.name);
    try {
      const results = await searchTracksOnline(preset.query, 'sk', 35);
      if (results.length < 2) {
        alert('Could not find enough tracks for this preset');
        return;
      }
      const newPack = {
        id: `preset_${preset.id}_${Date.now()}`,
        isCustom: true,
        name: preset.name,
        subtitle: `${results.length} dynamic tracks`,
        emoji: preset.emoji,
        tracks: shuffleArray(results)
      };
      saveCustomPack(newPack);
      refreshCustomPacks();
      onSelectPack(newPack);
    } catch (e) {
      console.error(e);
      alert('Failed to generate preset pack: ' + e.message);
    } finally {
      setIsGeneratingPreset(false);
      setPresetGeneratingName('');
    }
  };

  // Online Search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    soundFx.playClick();
    setIsSearching(true);
    try {
      const results = await searchTracksOnline(searchQuery.trim(), 'sk', 35);
      setSearchResults(results);
      setCustomPackName(`Hits: ${searchQuery.trim()}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  // Create Pack from Search
  const handlePlaySearchPack = (save = false) => {
    if (searchResults.length < 2) return;
    soundFx.playClick();
    const newPack = {
      id: `search_${Date.now()}`,
      isCustom: true,
      name: customPackName || `Pack: ${searchQuery}`,
      subtitle: `${searchResults.length} online tracks`,
      emoji: '🔍',
      tracks: searchResults
    };
    if (save) {
      saveCustomPack(newPack);
      refreshCustomPacks();
    }
    onSelectPack(newPack);
  };

  // Text/Tracklist Importer
  const handleImportTextList = async () => {
    if (!textListInput.trim()) return;
    soundFx.playClick();
    setIsResolvingText(true);
    try {
      const resolved = await parseTrackListText(textListInput, (current, total, song) => {
        setResolveProgress({ current, total, song });
      });

      if (resolved.length < 2) {
        alert('Could not match enough playable songs from your list. Make sure each line has "Artist - Song".');
        return;
      }

      const newPack = {
        id: `text_pack_${Date.now()}`,
        isCustom: true,
        name: `Custom Playlist (${resolved.length} Songs)`,
        subtitle: `Imported song list with audio previews`,
        emoji: '🎵',
        tracks: shuffleArray(resolved)
      };
      saveCustomPack(newPack);
      refreshCustomPacks();
      setTextListInput('');
      onSelectPack(newPack);
    } catch (err) {
      console.error(err);
      alert('Error importing tracklist: ' + err.message);
    } finally {
      setIsResolvingText(false);
      setResolveProgress({ current: 0, total: 0, song: '' });
    }
  };

  const handleDeleteCustomPack = (e, packId) => {
    e.stopPropagation();
    soundFx.playClick();
    deleteCustomPack(packId);
    refreshCustomPacks();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Main Tab Switcher */}
      <div className="mode-selector">
        <button 
          className={`mode-btn ${activeTab === 'curated' ? 'active' : ''}`}
          onClick={() => { soundFx.playClick(); setActiveTab('curated'); }}
        >
          <span>🔥 Playlists & Packs</span>
        </button>
        <button 
          className={`mode-btn ${activeTab === 'search' ? 'active' : ''}`}
          onClick={() => { soundFx.playClick(); setActiveTab('search'); }}
        >
          <span>🔍 Online Search</span>
        </button>
        <button 
          className={`mode-btn ${activeTab === 'import' ? 'active' : ''}`}
          onClick={() => { soundFx.playClick(); setActiveTab('import'); }}
        >
          <span>📋 Import Songs</span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* TAB 1: CURATED PACKS & CUSTOM PACKS & QUICK PRESET GENERATORS */}
      {/* ============================================================ */}
      {activeTab === 'curated' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Quick 1-Click Generator Presets */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <Zap size={16} color="var(--accent-glow)" />
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff' }}>
                Quick Instant Packs (1-Click Generator)
              </span>
            </div>
            
            <div style={{
              display: 'flex',
              gap: 8,
              overflowX: 'auto',
              paddingBottom: 6,
              scrollbarWidth: 'none'
            }}>
              {PRESET_THEMES.map(preset => (
                <button
                  key={preset.id}
                  onClick={() => handleGeneratePreset(preset)}
                  disabled={isGeneratingPreset}
                  style={{
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    transition: 'all 0.18s ease'
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>{preset.emoji}</span>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#fff' }}>
                      {preset.name}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      Instant 30 tracks
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {isGeneratingPreset && (
              <div style={{
                marginTop: 6,
                padding: '8px 12px',
                background: 'rgba(139, 92, 246, 0.15)',
                border: '1px solid var(--border-glow)',
                borderRadius: 8,
                fontSize: '0.82rem',
                color: '#c4b5fd',
                textAlign: 'center'
              }}>
                ⏳ Generating pack for <strong>{presetGeneratingName}</strong>... Finding audio previews...
              </div>
            )}
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
            {[
              { id: 'all', name: 'All Packs' },
              { id: 'custom', name: `⭐ My Packs (${customPacks.length})` },
              { id: 'slovak', name: '🇸🇰 Slovak Oldies' },
              { id: 'world', name: '🌍 World Hits' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => { soundFx.playClick(); setSelectedCategory(cat.id); }}
                style={{
                  background: selectedCategory === cat.id ? 'var(--grad-primary)' : 'rgba(255,255,255,0.06)',
                  border: selectedCategory === cat.id ? '1px solid transparent' : '1px solid var(--border-subtle)',
                  color: selectedCategory === cat.id ? '#fff' : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  padding: '7px 14px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: selectedCategory === cat.id ? 'var(--shadow-neon-purple)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* List of Packs */}
          <div className="packs-grid">
            {filteredPacks.map(pack => {
              const isActive = activePackId === pack.id;
              return (
                <div 
                  key={pack.id}
                  className={`pack-card ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    soundFx.playClick();
                    onSelectPack(pack);
                  }}
                  style={{ position: 'relative' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 0 }}>
                    <div style={{
                      width: 46,
                      height: 46,
                      borderRadius: 14,
                      background: 'var(--bg-surface)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                      border: '1px solid var(--border-subtle)',
                      flexShrink: 0
                    }}>
                      {pack.emoji || '🎵'}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 800, fontSize: '0.94rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {pack.name}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {pack.subtitle}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#c4b5fd', marginTop: 3, fontWeight: 700 }}>
                        {pack.tracks.length} tracks {pack.isCustom ? '• Custom Pack' : ''}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    {pack.isCustom && (
                      <button
                        onClick={(e) => handleDeleteCustomPack(e, pack.id)}
                        title="Delete custom pack"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                          padding: 4
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                    {isActive && <CheckCircle2 size={22} color="var(--accent-purple)" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: ONLINE SEARCH & BUILDER (CORS-free JSONP)              */}
      {/* ============================================================ */}
      {activeTab === 'search' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8 }}>
            <input 
              type="text" 
              className="input-field"
              placeholder="E.g. Queen, Karol Duchoň, Elán, ABBA, 80s Rock..."
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
                  Found: <strong>{searchResults.length}</strong> playable tracks
                </span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button 
                    className="action-btn"
                    style={{ width: 'auto', padding: '8px 12px', fontSize: '0.82rem' }}
                    onClick={() => handlePlaySearchPack(false)}
                  >
                    <Play size={14} /> Play Now
                  </button>
                  <button 
                    className="btn-secondary"
                    style={{ width: 'auto', padding: '8px 12px', fontSize: '0.82rem' }}
                    onClick={() => handlePlaySearchPack(true)}
                  >
                    <PlusCircle size={14} /> Save & Play
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 380, overflowY: 'auto' }}>
                {searchResults.map(track => (
                  <div 
                    key={track.id}
                    style={{
                      background: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 12,
                      padding: '8px 12px',
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

      {/* ============================================================ */}
      {/* TAB 3: CUSTOM SONG LIST IMPORTER                             */}
      {/* ============================================================ */}
      {activeTab === 'import' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Paste Tracklist */}
          <div style={{
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-glow)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <ListMusic size={18} color="var(--accent-glow)" />
              <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#fff' }}>
                Paste Tracklist (Custom Song List)
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 10, lineHeight: 1.4 }}>
              Paste song titles or artist names from your notes or playlists (one song per line). QuizBeat automatically matches real audio previews for each track completely free:
            </p>

            <textarea 
              rows={4}
              className="input-field"
              style={{ width: '100%', resize: 'vertical', fontFamily: 'monospace', fontSize: '0.8rem', padding: '8px 10px' }}
              placeholder={`Queen - Bohemian Rhapsody\nABBA - Dancing Queen\nKarol Duchoň - Čardáš dvoch sŕdc\nElán - Zaľúbil sa chlapec\nMichael Jackson - Billie Jean`}
              value={textListInput}
              onChange={(e) => setTextListInput(e.target.value)}
              disabled={isResolvingText}
            />

            {isResolvingText && (
              <div style={{ marginTop: 8, padding: '8px', background: 'rgba(139, 92, 246, 0.15)', borderRadius: 8, fontSize: '0.8rem', color: '#c4b5fd' }}>
                🔍 Matching song {resolveProgress.current} of {resolveProgress.total}: <em>{resolveProgress.song}</em>...
              </div>
            )}

            <button 
              className="action-btn"
              onClick={handleImportTextList}
              disabled={isResolvingText || !textListInput.trim()}
              style={{ marginTop: 10 }}
            >
              <Sparkles size={16} /> Generate Quiz Pack with Audio Previews
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
