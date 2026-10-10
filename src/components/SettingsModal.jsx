import React, { useState } from 'react';
import { 
  X, 
  Disc, 
  Smartphone, 
  Copy, 
  Check, 
  ExternalLink, 
  Volume2, 
  VolumeX, 
  Sparkles,
  HelpCircle,
  LogOut,
  LogIn
} from 'lucide-react';
import { 
  getStoredClientId, 
  saveClientId, 
  redirectToSpotifyAuth, 
  logoutSpotify, 
  getRedirectUri 
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
  const [clientId, setClientId] = useState(getStoredClientId());
  const [copiedUri, setCopiedUri] = useState(false);
  const [authError, setAuthError] = useState('');

  if (!isOpen) return null;

  const currentRedirectUri = getRedirectUri();

  const handleCopyUri = () => {
    soundFx.playClick();
    navigator.clipboard.writeText(currentRedirectUri);
    setCopiedUri(true);
    setTimeout(() => setCopiedUri(false), 2000);
  };

  const handleSpotifyLogin = async () => {
    soundFx.playClick();
    if (!clientId.trim()) {
      setAuthError('Пожалуйста, введите ваш Spotify Client ID');
      return;
    }
    setAuthError('');
    saveClientId(clientId);
    try {
      await redirectToSpotifyAuth(clientId);
    } catch (err) {
      setAuthError(err.message);
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
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Настройки & Гайд</h2>
          <button className="icon-button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* SECTION 1: Spotify Integration */}
        <div style={{
          background: 'rgba(29, 185, 84, 0.08)',
          border: '1px solid rgba(29, 185, 84, 0.3)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px',
          marginBottom: 16
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'var(--accent-spotify)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}>
              <Disc size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Spotify Premium API</div>
              <div style={{ fontSize: '0.75rem', color: isSpotifyConnected ? '#4ade80' : 'var(--text-secondary)' }}>
                {isSpotifyConnected ? '● Подключено (Web Playback SDK)' : '○ Не подключено (Используются превью)'}
              </div>
            </div>
          </div>

          {!isSpotifyConnected ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                  Ваш Spotify Client ID:
                </label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Например: 4a2b9c8d1e3f..."
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                />
              </div>

              {authError && (
                <div style={{ color: '#f87171', fontSize: '0.78rem' }}>{authError}</div>
              )}

              <button 
                className="action-btn"
                style={{ background: 'var(--grad-spotify)', boxShadow: 'var(--shadow-neon-green)' }}
                onClick={handleSpotifyLogin}
              >
                <LogIn size={18} /> Войти через Spotify
              </button>

              {/* Instructions toggle */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.25)',
                borderRadius: 12,
                padding: '12px',
                marginTop: 6,
                fontSize: '0.78rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.5
              }}>
                <div style={{ fontWeight: 700, color: '#fff', marginBottom: 6 }}>
                  Как получить Client ID за 2 минуты:
                </div>
                <ol style={{ paddingLeft: 18, margin: 0 }}>
                  <li>Откройте <a href="https://developer.spotify.com/dashboard" target="_blank" rel="noreferrer" style={{ color: '#1db954', textDecoration: 'underline' }}>Spotify Developer Dashboard</a></li>
                  <li>Нажмите <b>Create App</b>, введите имя (напр. <i>QuizBeat</i>)</li>
                  <li>В поле <b>Redirect URI</b> добавьте этот адрес:</li>
                </ol>
                <div style={{ display: 'flex', gap: 6, marginTop: 8, alignItems: 'center' }}>
                  <code style={{ background: '#000', padding: '4px 8px', borderRadius: 6, fontSize: '0.7rem', color: '#c4b5fd', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {currentRedirectUri}
                  </code>
                  <button className="icon-button" style={{ width: 32, height: 32 }} onClick={handleCopyUri} title="Скопировать Redirect URI">
                    {copiedUri ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Вы вошли под Premium аккаунтом
              </span>
              <button 
                className="action-btn btn-secondary" 
                style={{ width: 'auto', padding: '8px 12px', fontSize: '0.8rem' }}
                onClick={handleSpotifyLogout}
              >
                <LogOut size={14} /> Выйти
              </button>
            </div>
          )}
        </div>

        {/* SECTION 2: Как выложить на GitHub и играть с телефона (PWA) */}
        <div style={{
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px',
          marginBottom: 16
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <Smartphone size={20} color="var(--accent-cyan)" />
            <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Как играть с телефона (PWA & Git)</div>
          </div>
          
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            <p>1. <b>Деплой на GitHub</b>: залейте проект в репозиторий и включите <i>GitHub Pages</i> (или за 1 клик на Vercel).</p>
            <p style={{ marginTop: 6 }}>
              2. <b>Установка как мобильное приложение</b>:
            </p>
            <ul style={{ paddingLeft: 20, marginTop: 4 }}>
              <li><b>iOS (iPhone Safari)</b>: нажмите значок «Поделиться» (квадрат со стрелкой вверх) $\rightarrow$ <b>«На экран Домой»</b>.</li>
              <li><b>Android (Chrome)</b>: меню три точки $\rightarrow$ <b>«Установить приложение»</b>.</li>
            </ul>
            <p style={{ marginTop: 6, color: '#c4b5fd' }}>
              Приложение откроется на весь экран без адресной строки браузера!
            </p>
          </div>
        </div>

        {/* SECTION 3: Gameplay Settings */}
        <div style={{
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 14
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Звуковые эффекты</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Клики, звуки ответов и фанфары</div>
            </div>
            <button 
              className="icon-button"
              onClick={() => { soundFx.playClick(); onToggleSound(); }}
            >
              {soundEnabled ? <Volume2 size={18} color="var(--accent-purple)" /> : <VolumeX size={18} color="var(--text-muted)" />}
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Длительность фрагмента</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Сколько секунд играет трек</div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[3, 5, 10, 15, 30].map(s => (
                <button
                  key={s}
                  onClick={() => { soundFx.playClick(); onDurationChange(s); }}
                  style={{
                    background: fragmentDuration === s ? 'var(--accent-purple)' : 'rgba(255,255,255,0.06)',
                    border: 'none',
                    color: fragmentDuration === s ? '#fff' : 'var(--text-secondary)',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    padding: '6px 10px',
                    borderRadius: 8,
                    cursor: 'pointer'
                  }}
                >
                  {s}с
                </button>
              ))}
            </div>
          </div>
        </div>

        <button 
          className="action-btn"
          style={{ marginTop: 20 }}
          onClick={onClose}
        >
          Готово
        </button>
      </div>
    </div>
  );
}
