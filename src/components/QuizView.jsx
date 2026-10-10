import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Play, 
  RotateCcw, 
  ArrowRight, 
  Check, 
  X, 
  HelpCircle, 
  Clock, 
  Sparkles,
  Eye,
  Radio,
  Flame,
  Volume2
} from 'lucide-react';
import { soundFx } from '../services/soundFx';
import { previewPlayer } from '../services/previewService';
import { spotifyPlayer } from '../services/spotify';

export default function QuizView({
  tracks = [],
  packName = '',
  fragmentDuration = 10,
  onDurationChange,
  isSpotifyConnected,
  onAddWeakTrack,
  score,
  streak,
  onRecordAnswer
}) {
  // Default to 'flashcards' as requested by the user
  const [subMode, setSubMode] = useState('flashcards'); // 'flashcards' | 'buzzer' | 'options'
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(fragmentDuration);
  const [isFlipped, setIsFlipped] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [options, setOptions] = useState([]);

  // Buzzer mode specific state
  const [buzzerPressed, setBuzzerPressed] = useState(false);
  const [buzzerCountdown, setBuzzerCountdown] = useState(5);

  const timerIntervalRef = useRef(null);
  const buzzerIntervalRef = useRef(null);

  const currentTrack = tracks[currentIndex] || null;

  // Whenever track changes, reset and autoplay
  useEffect(() => {
    if (!currentTrack || tracks.length === 0) return;

    // Pick 3 distractors for the optional 'options' submode
    const otherTracks = tracks.filter(t => t.id !== currentTrack.id);
    const shuffledOthers = [...otherTracks].sort(() => 0.5 - Math.random());
    const distractors = shuffledOthers.slice(0, Math.min(3, shuffledOthers.length));
    const combined = [currentTrack, ...distractors].sort(() => 0.5 - Math.random());
    setOptions(combined);

    // Reset round states
    setIsFlipped(false);
    setHasAnswered(false);
    setSelectedOption(null);
    setIsCorrect(false);
    setBuzzerPressed(false);
    setTimeLeft(fragmentDuration);
    stopAudio();

    // Autoplay current track
    const autoPlayTimer = setTimeout(() => {
      startPlayback(currentTrack);
    }, 350);

    return () => {
      clearTimeout(autoPlayTimer);
      stopAudio();
    };
  }, [currentIndex, tracks, fragmentDuration]);

  // Handle timer tick while playing
  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current);
            stopAudio();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerIntervalRef.current);
    }

    return () => clearInterval(timerIntervalRef.current);
  }, [isPlaying, timeLeft]);

  // Buzzer countdown
  useEffect(() => {
    if (buzzerPressed && buzzerCountdown > 0) {
      buzzerIntervalRef.current = setInterval(() => {
        setBuzzerCountdown(prev => {
          if (prev <= 1) {
            clearInterval(buzzerIntervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(buzzerIntervalRef.current);
    }

    return () => clearInterval(buzzerIntervalRef.current);
  }, [buzzerPressed, buzzerCountdown]);

  const startPlayback = (track) => {
    if (!track) return;
    setTimeLeft(fragmentDuration);
    setIsPlaying(true);

    if (isSpotifyConnected && track.spotifyUri) {
      const randomStartMs = Math.floor(Math.random() * 40000) + 15000;
      spotifyPlayer.playTrack(track.spotifyUri, randomStartMs);
      setTimeout(() => {
        stopAudio();
      }, fragmentDuration * 1000);
    } else if (track.audioUrl) {
      previewPlayer.play(track.audioUrl, fragmentDuration, () => {
        setIsPlaying(false);
      });
    }
  };

  const stopAudio = () => {
    setIsPlaying(false);
    clearInterval(timerIntervalRef.current);
    if (isSpotifyConnected) {
      spotifyPlayer.pause();
    } else {
      previewPlayer.stop();
    }
  };

  const handleReplay = (e) => {
    if (e) e.stopPropagation();
    soundFx.playClick();
    startPlayback(currentTrack);
  };

  const handleFlipCard = () => {
    soundFx.playClick();
    setIsFlipped(true);
    stopAudio();
  };

  // FLASHCARD: User evaluates whether they knew the song
  const handleCardResult = (knewIt) => {
    stopAudio();
    if (knewIt) {
      soundFx.playCorrect();
      onRecordAnswer(true, currentTrack);
      if (streak + 1 >= 3) {
        confetti({
          particleCount: 65,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
    } else {
      soundFx.playWrong();
      onRecordAnswer(false, currentTrack);
      onAddWeakTrack(currentTrack);
    }
    handleNextTrack();
  };

  const handleNextTrack = () => {
    soundFx.playClick();
    if (currentIndex < tracks.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  // Options mode click
  const handleOptionClick = (option) => {
    if (hasAnswered) return;
    setHasAnswered(true);
    setSelectedOption(option.id);
    stopAudio();

    const correct = option.id === currentTrack.id;
    setIsCorrect(correct);

    if (correct) {
      soundFx.playCorrect();
      onRecordAnswer(true, currentTrack);
      if (streak + 1 >= 3) {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      }
    } else {
      soundFx.playWrong();
      onRecordAnswer(false, currentTrack);
      onAddWeakTrack(currentTrack);
    }
  };

  // Buzzer mode press
  const handleBuzzerPress = () => {
    if (hasAnswered || buzzerPressed) return;
    soundFx.playBuzzer();
    stopAudio();
    setBuzzerPressed(true);
    setBuzzerCountdown(5);
  };

  const handleBuzzerResult = (correct) => {
    setHasAnswered(true);
    setIsCorrect(correct);
    if (correct) {
      soundFx.playCorrect();
      onRecordAnswer(true, currentTrack);
    } else {
      soundFx.playWrong();
      onRecordAnswer(false, currentTrack);
      onAddWeakTrack(currentTrack);
    }
  };

  if (!currentTrack) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <HelpCircle size={48} color="var(--accent-purple)" style={{ marginBottom: 16 }} />
        <h3>В этом плейлисте нет треков</h3>
        <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>
          Выберите другой плейлист во вкладке «Плейлисты».
        </p>
      </div>
    );
  }

  const progressPercent = (timeLeft / fragmentDuration) * 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      {/* Mode Switcher: Flashcards is default */}
      <div className="mode-selector">
        <button 
          className={`mode-btn ${subMode === 'flashcards' ? 'active' : ''}`}
          onClick={() => { soundFx.playClick(); setSubMode('flashcards'); }}
        >
          <span>🃏 Карточки (Тренажер)</span>
        </button>
        <button 
          className={`mode-btn ${subMode === 'buzzer' ? 'active' : ''}`}
          onClick={() => { soundFx.playClick(); setSubMode('buzzer'); }}
        >
          <span>🚨 Фальстарт</span>
        </button>
        <button 
          className={`mode-btn ${subMode === 'options' ? 'active' : ''}`}
          onClick={() => { soundFx.playClick(); setSubMode('options'); }}
        >
          <span>🎯 Тест А-Б-В-Г</span>
        </button>
      </div>

      {/* Top Header: Track Counter & Duration Selector */}
      <div className="quiz-top-info">
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 700 }}>
            Трек {currentIndex + 1} из {tracks.length}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Clock size={13} color="var(--text-muted)" />
          {[3, 5, 10, 15].map(sec => (
            <button
              key={sec}
              onClick={() => { soundFx.playClick(); onDurationChange(sec); }}
              style={{
                background: fragmentDuration === sec ? 'var(--accent-purple)' : 'rgba(255,255,255,0.06)',
                border: 'none',
                color: fragmentDuration === sec ? '#fff' : 'var(--text-muted)',
                fontSize: '0.74rem',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
              title={sec === 3 ? 'Интро-раунд квиза' : `${sec} секунд`}
            >
              {sec}с{sec === 3 ? ' 🔥' : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Timer Bar */}
      <div className="timer-container" style={{ marginBottom: 14 }}>
        <div 
          className={`timer-fill ${timeLeft <= 2 ? 'danger' : ''}`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* ============================================================ */}
      {/* PRIMARY MODE: FLASHCARDS (Active Recall Memory Trainer)       */}
      {/* ============================================================ */}
      {subMode === 'flashcards' && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div 
            className="flashcard-wrapper" 
            style={{ height: 320, margin: '6px 0 16px' }}
            onClick={!isFlipped ? handleFlipCard : undefined}
          >
            <div className={`flashcard-inner ${isFlipped ? 'flipped' : ''}`}>
              {/* FRONT: Audio playing & hidden answer */}
              <div className="flashcard-front">
                <div style={{
                  width: 104,
                  height: 104,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, #252530 0%, #101016 70%, #050508 100%)',
                  border: '3px solid #3b3b4f',
                  boxShadow: isPlaying ? '0 0 25px rgba(139, 92, 246, 0.5)' : '0 10px 25px rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 14,
                  position: 'relative'
                }}>
                  <div className={`vinyl-disc ${isPlaying ? 'spinning' : ''}`} style={{ border: 'none', boxShadow: 'none' }}>
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      background: 'var(--grad-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: '1.2rem',
                      fontWeight: 900
                    }}>
                      {isPlaying ? '♫' : '?'}
                    </div>
                  </div>
                </div>

                {/* Animated Waveform */}
                <div className="waveform-container" style={{ height: 26, marginBottom: 8 }}>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                    <div 
                      key={i} 
                      className={`waveform-bar ${isPlaying ? 'playing' : ''}`} 
                      style={{ width: 3 }}
                    />
                  ))}
                </div>

                <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                  {isPlaying ? 'Слушайте отрывок...' : 'Отрывок сыгран'}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 4, textAlign: 'center', maxWidth: 280 }}>
                  Вспомните песню и исполнителя вслух, затем переверните карточку
                </div>

                {/* Card Controls */}
                <div style={{ display: 'flex', gap: 10, marginTop: 14 }} onClick={(e) => e.stopPropagation()}>
                  <button 
                    className="icon-button"
                    onClick={handleReplay}
                    title="Повторить отрывок"
                    style={{ width: 40, height: 40, borderRadius: '50%' }}
                  >
                    <RotateCcw size={16} />
                  </button>
                  <button 
                    className="icon-button"
                    onClick={() => {
                      if (isPlaying) stopAudio();
                      else startPlayback(currentTrack);
                    }}
                    style={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: '50%',
                      background: isPlaying ? 'rgba(239, 68, 68, 0.2)' : 'var(--grad-primary)',
                      color: '#fff',
                      borderColor: 'transparent'
                    }}
                  >
                    {isPlaying ? <span style={{ fontWeight: 800, fontSize: '0.8rem' }}>❚❚</span> : <Play size={16} fill="#fff" />}
                  </button>
                </div>
              </div>

              {/* BACK: Revealed Answer */}
              <div className="flashcard-back">
                {currentTrack.albumArt && (
                  <img 
                    src={currentTrack.albumArt} 
                    alt="" 
                    style={{ 
                      width: 104, 
                      height: 104, 
                      borderRadius: 16, 
                      objectFit: 'cover', 
                      marginBottom: 12,
                      boxShadow: '0 8px 25px rgba(0,0,0,0.6)',
                      border: '2px solid rgba(255,255,255,0.1)'
                    }} 
                  />
                )}
                <div style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 900, 
                  textAlign: 'center',
                  lineHeight: 1.25,
                  maxWidth: '90%'
                }}>
                  {currentTrack.name}
                </div>
                <div style={{ 
                  fontSize: '1.05rem', 
                  color: '#c4b5fd', 
                  fontWeight: 700, 
                  marginTop: 6,
                  textAlign: 'center'
                }}>
                  {currentTrack.artist}
                </div>
                {currentTrack.year && (
                  <div style={{ 
                    fontSize: '0.82rem', 
                    color: 'var(--text-muted)', 
                    marginTop: 6,
                    background: 'rgba(255,255,255,0.06)',
                    padding: '2px 8px',
                    borderRadius: 8
                  }}>
                    Год выпуска: {currentTrack.year}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Area: Reveal Button vs Right / Wrong Buttons */}
          {!isFlipped ? (
            <button 
              className="action-btn"
              onClick={handleFlipCard}
              style={{
                padding: '16px 20px',
                fontSize: '1.05rem',
                borderRadius: 'var(--radius-lg)'
              }}
            >
              <Eye size={20} />
              <span>Показать ответ (Перевернуть)</span>
            </button>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <button 
                className="action-btn"
                style={{ 
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  boxShadow: '0 0 25px rgba(16, 185, 129, 0.4)',
                  padding: '16px 14px',
                  borderRadius: 'var(--radius-lg)'
                }}
                onClick={() => handleCardResult(true)}
              >
                <Check size={22} />
                <span style={{ fontSize: '1rem' }}>Знал! (+1)</span>
              </button>

              <button 
                className="action-btn"
                style={{ 
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  boxShadow: '0 0 25px rgba(239, 68, 68, 0.4)',
                  padding: '16px 14px',
                  borderRadius: 'var(--radius-lg)'
                }}
                onClick={() => handleCardResult(false)}
              >
                <X size={22} />
                <span style={{ fontSize: '1rem' }}>Не вспомнил</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* MODE 2: BUZZER / PARTY MODE (Кто быстрее назвал трек вслух)  */}
      {/* ============================================================ */}
      {subMode === 'buzzer' && (
        <div className="buzzer-container">
          {!buzzerPressed ? (
            <>
              <button 
                className={`buzzer-btn ${!isPlaying ? 'disabled' : ''}`}
                onClick={handleBuzzerPress}
                disabled={!isPlaying}
              >
                <span>ЖМИ!</span>
                <span style={{ fontSize: '0.8rem', opacity: 0.85, fontWeight: 600 }}>
                  {isPlaying ? 'Знаешь трек?' : 'Включи музыку'}
                </span>
              </button>
              <p style={{ marginTop: 18, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                Нажмите, как только узнали песню — музыка остановится для проверки ответа!
              </p>
            </>
          ) : (
            <div style={{ width: '100%' }}>
              <div style={{
                background: 'rgba(236, 72, 153, 0.15)',
                border: '1px solid rgba(236, 72, 153, 0.4)',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
                marginBottom: 16
              }}>
                <div style={{ fontSize: '0.85rem', color: '#f472b6', fontWeight: 700, textTransform: 'uppercase' }}>
                  Время назвать песню вслух
                </div>
                <div style={{ fontSize: '3rem', fontWeight: 900, color: '#fff', margin: '8px 0' }}>
                  {buzzerCountdown}с
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Назовите исполнителя и название друзьям!
                </div>
              </div>

              {!hasAnswered ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <button 
                    className="action-btn"
                    style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                    onClick={() => handleBuzzerResult(true)}
                  >
                    <Check size={18} /> Угадали (+1)
                  </button>
                  <button 
                    className="action-btn"
                    style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}
                    onClick={() => handleBuzzerResult(false)}
                  >
                    <X size={18} /> Мимо (-1)
                  </button>
                </div>
              ) : (
                <div className="reveal-card">
                  {currentTrack.albumArt && <img src={currentTrack.albumArt} alt="" className="reveal-art" />}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '1rem', fontWeight: 800 }}>{currentTrack.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{currentTrack.artist}</div>
                  </div>
                  <button className="action-btn" onClick={handleNextTrack} style={{ width: 'auto', padding: '10px 14px' }}>
                    <ArrowRight size={18} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* MODE 3: 4 OPTIONS (Optional Test Mode)                        */}
      {/* ============================================================ */}
      {subMode === 'options' && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div className="player-hero" style={{ padding: '0 0 16px' }}>
            <div className="waveform-container">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className={`waveform-bar ${isPlaying ? 'playing' : ''}`} />
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="icon-button" onClick={handleReplay} style={{ width: 40, height: 40, borderRadius: '50%' }}>
                <RotateCcw size={16} />
              </button>
              <button 
                className="icon-button"
                onClick={() => { if (isPlaying) stopAudio(); else startPlayback(currentTrack); }}
                style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--grad-primary)', color: '#fff', borderColor: 'transparent' }}
              >
                {isPlaying ? <span style={{ fontWeight: 800, fontSize: '0.8rem' }}>❚❚</span> : <Play size={16} fill="#fff" />}
              </button>
            </div>
          </div>

          <div className="options-grid">
            {options.map((opt) => {
              const isSelected = selectedOption === opt.id;
              const isRightAnswer = opt.id === currentTrack.id;

              let buttonClass = 'option-btn';
              if (hasAnswered) {
                if (isRightAnswer) buttonClass += ' correct';
                else if (isSelected) buttonClass += ' wrong';
              }

              return (
                <button
                  key={opt.id}
                  className={buttonClass}
                  onClick={() => handleOptionClick(opt)}
                  disabled={hasAnswered}
                >
                  <div>
                    <div className="option-text-main">{opt.name}</div>
                    <div className="option-text-sub">{opt.artist} {opt.year ? `(${opt.year})` : ''}</div>
                  </div>
                  {hasAnswered && isRightAnswer && <Check size={20} color="#10b981" />}
                  {hasAnswered && isSelected && !isRightAnswer && <X size={20} color="#ef4444" />}
                </button>
              );
            })}
          </div>

          {hasAnswered && (
            <div className="reveal-card">
              {currentTrack.albumArt && <img src={currentTrack.albumArt} alt="" className="reveal-art" />}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: isCorrect ? '#4ade80' : '#f87171' }}>
                  {isCorrect ? '✓ Верно!' : '✗ Не угадали'}
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 800 }}>{currentTrack.name}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{currentTrack.artist}</div>
              </div>
              <button className="action-btn" onClick={handleNextTrack} style={{ width: 'auto', padding: '10px 14px' }}>
                <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
