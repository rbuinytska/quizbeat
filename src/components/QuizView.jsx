import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Play, 
  RotateCcw, 
  ArrowRight, 
  Volume2, 
  Check, 
  X, 
  HelpCircle, 
  Clock, 
  Sparkles,
  ExternalLink,
  Flame,
  Radio
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
  onTrackGuessed,
  score,
  streak,
  onRecordAnswer
}) {
  const [subMode, setSubMode] = useState('options'); // 'options' | 'buzzer' | 'flashcards'
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(fragmentDuration);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [options, setOptions] = useState([]);
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Buzzer mode specific state
  const [buzzerPressed, setBuzzerPressed] = useState(false);
  const [buzzerCountdown, setBuzzerCountdown] = useState(5);

  const timerIntervalRef = useRef(null);
  const buzzerIntervalRef = useRef(null);

  const currentTrack = tracks[currentIndex] || null;

  // Shuffle and generate 4 options whenever current track changes
  useEffect(() => {
    if (!currentTrack || tracks.length === 0) return;

    // Pick 3 distractors
    const otherTracks = tracks.filter(t => t.id !== currentTrack.id);
    const shuffledOthers = [...otherTracks].sort(() => 0.5 - Math.random());
    const distractors = shuffledOthers.slice(0, Math.min(3, shuffledOthers.length));
    
    const combined = [currentTrack, ...distractors].sort(() => 0.5 - Math.random());
    setOptions(combined);

    // Reset round states
    setHasAnswered(false);
    setSelectedOption(null);
    setIsCorrect(false);
    setIsFlipped(false);
    setBuzzerPressed(false);
    setTimeLeft(fragmentDuration);
    stopAudio();

    // Auto-play next track
    const autoPlayTimer = setTimeout(() => {
      startPlayback(currentTrack);
    }, 400);

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

  // Buzzer countdown timer (5 seconds to say the answer out loud)
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
      // Pick random jump position between 20s and 60s
      const randomStartMs = Math.floor(Math.random() * 40000) + 15000;
      spotifyPlayer.playTrack(track.spotifyUri, randomStartMs);
      
      // Auto pause after fragmentDuration
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

  const handleReplay = () => {
    soundFx.playClick();
    startPlayback(currentTrack);
  };

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
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
    } else {
      soundFx.playWrong();
      onRecordAnswer(false, currentTrack);
      onAddWeakTrack(currentTrack);
    }
  };

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

  const handleFlashcardEvaluate = (remembered) => {
    setHasAnswered(true);
    stopAudio();
    if (remembered) {
      soundFx.playCorrect();
      onRecordAnswer(true, currentTrack);
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
      // Loop or shuffle
      setCurrentIndex(0);
    }
  };

  if (!currentTrack) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <HelpCircle size={48} color="var(--accent-purple)" style={{ marginBottom: 16 }} />
        <h3>В этом плейлисте нет треков</h3>
        <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>
          Выберите другой плейлист или выполните поиск во вкладке «Плейлисты».
        </p>
      </div>
    );
  }

  const progressPercent = (timeLeft / fragmentDuration) * 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      {/* Submode Switcher */}
      <div className="mode-selector">
        <button 
          className={`mode-btn ${subMode === 'options' ? 'active' : ''}`}
          onClick={() => { soundFx.playClick(); setSubMode('options'); }}
        >
          <span>🎯 4 Варианта</span>
        </button>
        <button 
          className={`mode-btn ${subMode === 'buzzer' ? 'active' : ''}`}
          onClick={() => { soundFx.playClick(); setSubMode('buzzer'); }}
        >
          <span>🚨 Фальстарт</span>
        </button>
        <button 
          className={`mode-btn ${subMode === 'flashcards' ? 'active' : ''}`}
          onClick={() => { soundFx.playClick(); setSubMode('flashcards'); }}
        >
          <span>🃏 Карточки</span>
        </button>
      </div>

      {/* Top Controls: Duration & Track Counter */}
      <div className="quiz-top-info">
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Трек {currentIndex + 1} из {tracks.length}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Clock size={13} color="var(--text-muted)" />
          {[3, 5, 10, 15].map(sec => (
            <button
              key={sec}
              onClick={() => { soundFx.playClick(); onDurationChange(sec); }}
              style={{
                background: fragmentDuration === sec ? 'var(--accent-purple)' : 'rgba(255,255,255,0.06)',
                border: 'none',
                color: fragmentDuration === sec ? '#fff' : 'var(--text-muted)',
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '3px 7px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              {sec}с
            </button>
          ))}
        </div>
      </div>

      {/* Timer Bar */}
      <div className="timer-container">
        <div 
          className={`timer-fill ${timeLeft <= 2 ? 'danger' : ''}`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Centerpiece Visualizer / Vinyl */}
      {subMode !== 'flashcards' && (
        <div className="player-hero">
          <div className="vinyl-box">
            <div className={`vinyl-disc ${isPlaying ? 'spinning' : ''}`}>
              <div className="vinyl-grooves" />
              {hasAnswered && currentTrack.albumArt ? (
                <img src={currentTrack.albumArt} alt="" className="vinyl-art" />
              ) : (
                <div style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'var(--grad-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '1.6rem',
                  fontWeight: 900
                }}>
                  ?
                </div>
              )}
              <div className="vinyl-center-hole" />
            </div>
          </div>

          {/* Waveform Equalizer */}
          <div className="waveform-container">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div 
                key={i} 
                className={`waveform-bar ${isPlaying ? 'playing' : ''}`} 
              />
            ))}
          </div>

          {/* Quick Play/Replay Controller */}
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button 
              className="icon-button"
              onClick={handleReplay}
              title="Повторить отрывок"
              style={{ width: 44, height: 44, borderRadius: '50%' }}
            >
              <RotateCcw size={18} />
            </button>

            <button 
              className="icon-button"
              onClick={() => {
                if (isPlaying) stopAudio();
                else startPlayback(currentTrack);
              }}
              style={{ 
                width: 44, 
                height: 44, 
                borderRadius: '50%',
                background: isPlaying ? 'rgba(239, 68, 68, 0.2)' : 'var(--grad-primary)',
                color: '#fff',
                borderColor: 'transparent'
              }}
            >
              {isPlaying ? <span style={{ fontWeight: 800 }}>❚❚</span> : <Play size={18} fill="#fff" />}
            </button>
          </div>
        </div>
      )}

      {/* MODE 1: 4 Options */}
      {subMode === 'options' && (
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
      )}

      {/* MODE 2: Buzzer / Фальстарт */}
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
              ) : null}
            </div>
          )}
        </div>
      )}

      {/* MODE 3: Flashcard 3D Memory Drill */}
      {subMode === 'flashcards' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div 
            className="flashcard-wrapper" 
            onClick={() => {
              soundFx.playClick();
              setIsFlipped(!isFlipped);
            }}
          >
            <div className={`flashcard-inner ${isFlipped ? 'flipped' : ''}`}>
              {/* Front of card */}
              <div className="flashcard-front">
                <div style={{
                  width: 90,
                  height: 90,
                  borderRadius: '50%',
                  background: 'var(--grad-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '2rem',
                  fontWeight: 900,
                  boxShadow: 'var(--shadow-neon-purple)',
                  marginBottom: 16
                }}>
                  {isPlaying ? '♫' : '?'}
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>Слушай отрывок</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 6 }}>
                  Нажмите на карточку, чтобы перевернуть и свериться
                </div>
              </div>

              {/* Back of card */}
              <div className="flashcard-back">
                {currentTrack.albumArt && (
                  <img 
                    src={currentTrack.albumArt} 
                    alt="" 
                    style={{ width: 90, height: 90, borderRadius: 14, objectFit: 'cover', marginBottom: 12 }} 
                  />
                )}
                <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{currentTrack.name}</div>
                <div style={{ fontSize: '0.95rem', color: '#c4b5fd', marginTop: 4, fontWeight: 600 }}>
                  {currentTrack.artist}
                </div>
                {currentTrack.year && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    Год выпуска: {currentTrack.year}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Flashcard Evaluation Buttons */}
          {isFlipped && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, width: '100%' }}>
              <button 
                className="action-btn"
                style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                onClick={() => handleFlashcardEvaluate(true)}
              >
                <Check size={18} /> Помню
              </button>
              <button 
                className="action-btn"
                style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}
                onClick={() => handleFlashcardEvaluate(false)}
              >
                <X size={18} /> Забыл
              </button>
            </div>
          )}
        </div>
      )}

      {/* Reveal Card (Details about the song after answer) */}
      {hasAnswered && subMode !== 'flashcards' && (
        <div className="reveal-card">
          {currentTrack.albumArt && (
            <img src={currentTrack.albumArt} alt="" className="reveal-art" />
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ 
                fontSize: '0.72rem', 
                fontWeight: 700, 
                color: isCorrect ? '#4ade80' : '#f87171',
                textTransform: 'uppercase'
              }}>
                {isCorrect ? '✓ Верно!' : '✗ Не угадали'}
              </span>
              {currentTrack.year && (
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  • {currentTrack.year} г.
                </span>
              )}
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentTrack.name}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentTrack.artist}
            </div>
          </div>

          <button 
            className="action-btn"
            onClick={handleNextTrack}
            style={{ width: 'auto', padding: '10px 14px', borderRadius: 12 }}
          >
            <span>Дальше</span>
            <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
