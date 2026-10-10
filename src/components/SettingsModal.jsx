import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  Volume2, 
  VolumeX, 
  Clock, 
  Disc, 
  LogOut, 
  LogIn, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { 
  getStoredClientId, 
  redirectToSpotifyAuth, 
  logoutSpotify 
} from '../services/spotify';
import { soundFx } from '../services/soundFx';

export default function SettingsModal({
  isOpen,
  onClose,
  isSpotifyConnected,
  fragmentDuration,
  onDurationChange,
  soundEnabled,
  onToggleSound
}) {
  const [showSpotifyOption, setShowSpotifyOption] = useState(false);

  if (!isOpen) return null;

  const handleSpotifyLogin = async () => {
    soundFx.playClick();
    const clientId = getStoredClientId();
    try {
      await redirectToSpotifyAuth(clientId);
    } catch (err) {
      alert(err.message || 'Ошибка подключения Spotify');
    }
  };

  const handleSpotifyLogout = () => {
    soundFx.playClick();
    logoutSpotify();
    window.location.reload();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Настройки игры</h2>
          <button className="icon-button" onClick={onClose} aria-label="Закрыть">
            <X size={18} />
          </button>
        </div>

        {/* SECTION 1: Gameplay Duration & Sound */}
        <div style={{
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          marginBottom: 14
        }}>
          {/* Duration Selector */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Clock size={16} color="var(--accent-purple)" />
                <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>Время на отрывок</span>
              </div>
              <span style={{ fontSize: '0.8rem', color: '#c4b5fd', fontWeight: 700 }}>
                {fragmentDuration} сек.
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
              {[3, 5, 10, 15].map(s => (
                <button
                  key={s}
                  onClick={() => { soundFx.playClick(); onDurationChange(s); }}
                  style={{
                    background: fragmentDuration === s ? 'var(--grad-primary)' : 'rgba(255,255,255,0.06)',
                    border: fragmentDuration === s ? '1px solid transparent' : '1px solid var(--border-subtle)',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    padding: '10px 4px',
                    borderRadius: 10,
                    cursor: 'pointer',
                    boxShadow: fragmentDuration === s ? 'var(--shadow-neon-purple)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {s}с{s === 3 ? ' 🔥' : ''}
                </button>
              ))}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 6 }}>
              3с — раунд «Угадай по интро», 10с — стандарт квиза
            </div>
          </div>

          <div style={{ height: 1, background: 'var(--border-subtle)' }} />

          {/* Sound Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {soundEnabled ? <Volume2 size={18} color="var(--accent-cyan)" /> : <VolumeX size={18} color="var(--text-muted)" />}
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Звуки и фанфары</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Клики и звуки при ответах</div>
              </div>
            </div>

            <button 
              className="icon-button"
              onClick={() => { soundFx.playClick(); onToggleSound(); }}
              style={{
                background: soundEnabled ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255,255,255,0.05)',
                borderColor: soundEnabled ? 'rgba(6, 182, 212, 0.4)' : 'var(--border-subtle)'
              }}
            >
              {soundEnabled ? <Volume2 size={16} color="var(--accent-cyan)" /> : <VolumeX size={16} color="var(--text-muted)" />}
            </button>
          </div>
        </div>

        {/* SECTION 2: Install to Phone (Friendly instructions) */}
        <div style={{
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px',
          marginBottom: 14
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Smartphone size={18} color="var(--accent-pink)" />
            <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>Играть на весь экран с телефона</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            <p>• <b>iPhone (Safari)</b>: Нажмите значок «Поделиться» ⎋ $\rightarrow$ <b>«На экран Домой»</b>.</p>
            <p style={{ marginTop: 4 }}>• <b>Android (Chrome)</b>: Меню ⋮ $\rightarrow$ <b>«Установить приложение»</b>.</p>
          </div>
        </div>

        {/* SECTION 3: Discreet Spotify login for the owner (optional) */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          marginBottom: 14
        }}>
          <button
            onClick={() => setShowSpotifyOption(!showSpotifyOption)}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '0.82rem',
              fontWeight: 600
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Disc size={16} color={isSpotifyConnected ? '#1db954' : 'var(--text-muted)'} />
              <span>{isSpotifyConnected ? 'Spotify подключен (Premium)' : 'Личный Spotify аккаунт'}</span>
            </div>
            {showSpotifyOption ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {showSpotifyOption && (
            <div style={{ padding: '0 16px 14px', borderTop: '1px solid var(--border-subtle)' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '10px 0 12px', lineHeight: 1.4 }}>
                Все 95+ песен уже работают без Spotify. Подключение нужно только если вы хотите слушать свои личные приватные плейлисты.
              </p>
              {!isSpotifyConnected ? (
                <button 
                  className="action-btn"
                  style={{ background: 'var(--grad-spotify)', padding: '10px 14px', fontSize: '0.85rem' }}
                  onClick={handleSpotifyLogin}
                >
                  <LogIn size={16} /> Войти через Spotify
                </button>
              ) : (
                <button 
                  className="action-btn btn-secondary"
                  style={{ padding: '8px 12px', fontSize: '0.8rem' }}
                  onClick={handleSpotifyLogout}
                >
                  <LogOut size={14} /> Отключить Spotify
                </button>
              )}
            </div>
          )}
        </div>

        {/* Done Button */}
        <button 
          className="action-btn"
          onClick={onClose}
        >
          Готово
        </button>
      </div>
    </div>
  );
}
