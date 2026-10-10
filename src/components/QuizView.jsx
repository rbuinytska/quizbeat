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
  Shuffle,
  Volume2,
  Trophy
} from 'lucide-react';
import { soundFx } from '../services/soundFx';
import { previewPlayer, shuffleArray } from '../services/previewService';
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
  const [subMode, setSubMode] = useState('flashcards'); // 'flashcards' | 'buzzer' | 'options'
  
  // Local shuffled playlist so every game session is random without repeating songs
  const [shuffledDeck, setShuffledDeck] = useState(() => shuffleArray(tracks));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(fragmentDuration);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Pinned track info for the back face of the card to prevent spoiler leak
  const [displayedBackTrack, setDisplayedBackTrack] = useState(null);

  // Pack completion state
  const [isPackCompleted, setIsPackCompleted] = useState(false);

  // Options submode state
  const [hasAnswered, setHasAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [options, setOptions] = useState([]);

  // Buzzer submode state
  const [buzzerPressed, setBuzzerPressed] = useState(false);
  const [buzzerCountdown, setBuzzerCountdown] = useState(5);

  const timerIntervalRef = useRef(null);
  const buzzerIntervalRef = useRef(null);

  // When parent tracks array changes (e.g. user selected another pack), re-shuffle
  useEffect(() => {
    if (tracks && tracks.length > 0) {
      setShuffledDeck(shuffleArray(tracks));
      setCurrentIndex(0);
      setIsPackCompleted(false);
      setIsFlipped(false);
      setDisplayedBackTrack(null);
    }
  }, [tracks]);

  const currentTrack = shuffledDeck[currentIndex] || null;

  // Whenever currentIndex or deck changes, reset states and autoplay
  useEffect(() => {
    if (!currentTrack || isPackCompleted) return;

    // Pick 3 distractors for the optional test mode
    const otherTracks = shuffledDeck.filter(t => t.id !== currentTrack.id);
    const shuffledOthers = shuffleArray(otherTracks);
    const distractors = shuffledOthers.slice(0, Math.min(3, shuffledOthers.length));
    setOptions(shuffleArray([currentTrack, ...distractors]));

    // Reset round states
    setHasAnswered(false);
    setSelectedOption(null);
    setIsCorrect(false);
    setBuzzerPressed(false);
    setTimeLeft(fragmentDuration);
    stopAudio();

    // Start playback after brief delay
    const autoPlayTimer = setTimeout(() => {
      startPlayback(currentTrack);
    }, 300);

    return () => {
      clearTimeout(autoPlayTimer);
      stopAudio();
    };
  }, [currentIndex, shuffledDeck, fragmentDuration, isPackCompleted]);

  // Timer countdown while playing
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

  // Buzzer 5s countdown
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

  // Turn card over to reveal answer
  const handleFlipCard = () => {
    if (isTransitioning) return;
    soundFx.playClick();
    // Pin currentTrack to displayedBackTrack so it cannot change during animations
    setDisplayedBackTrack(currentTrack);
    setIsFlipped(true);
    stopAudio();
  };

  // Transition to next track cleanly:
  // 1. Flip card back FIRST
  // 2. Wait for 350ms animation
  // 3. ONLY THEN advance currentIndex
  // This completely eliminates the spoiler leak bug!
  const advanceToNext = () => {
    setIsTransitioning(true);
    setIsFlipped(false); // Flip back to front
    stopAudio();

    setTimeout(() => {
      if (currentIndex < shuffledDeck.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setIsPackCompleted(true);
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
      }
      setDisplayedBackTrack(null);
      setIsTransitioning(false);
    }, 380); // Wait for 3D flip animation to finish
  };

  // Card Result: user evaluates themselves
  const handleCardResult = (knewIt) => {
    if (isTransitioning) return;
    if (knewIt) {
      soundFx.playCorrect();
      onRecordAnswer(true, currentTrack);
      if (streak + 1 >= 3) {
        confetti({ particleCount: 65, spread: 60, origin: { y: 0.6 } });
      }
    } else {
      soundFx.playWrong();
      onRecordAnswer(false, currentTrack);
      onAddWeakTrack(currentTrack);
    }
    advanceToNext();
  };

  // Manual re-shuffle button
  const handleManualReshuffle = () => {
    soundFx.playClick();
    stopAudio();
    setIsFlipped(false);
    setDisplayedBackTrack(null);
    setIsPackCompleted(false);
    setShuffledDeck(shuffleArray(tracks));
    setCurrentIndex(0);
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

  // Buzzer mode
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

  if (!currentTrack || isPackCompleted) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'var(--grad-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          boxShadow: 'var(--shadow-neon-purple)',
          marginBottom: 16
        }}>
          <Trophy size={40} />
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 900 }}>Пак завершен!</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: 8, fontSize: '0.9rem', maxWidth: 300, lineHeight: 1.4 }}>
          Вы прошли все <b>{shuffledDeck.length}</b> треков без единого повтора!
        </p>

        <button 
          className="action-btn"
          style={{ marginTop: 24, width: 'auto', padding: '14px 28px' }}
          onClick={handleManualReshuffle}
        >
          <Shuffle size={18} /> Перемешать и начать заново
        </button>
      </div>
    );
  }

  const progressPercent = (timeLeft / fragmentDuration) * 100;
  // Card back shows displayedBackTrack if pinned, else currentTrack
  const backTrackData = displayedBackTrack || currentTrack;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      {/* Submode Switcher */}
      <div className="mode-selector">
        <button 
          className={`mode-btn ${subMode === 'flashcards' ? 'active' : ''}`}
          onClick={() => { soundFx.playClick(); setSubMode('flashcards'); }}
        >
          <span>🃏 Карточки</span>
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

      {/* Top Header: Progress Counter & Duration & Reshuffle */}
      <div className="quiz-top-info">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '0.85rem', color: '#c4b5fd', fontWeight: 800 }}>
            {currentIndex + 1} / {shuffledDeck.length}
          </span>
          <button 
            className="icon-button"
            onClick={handleManualReshuffle}
            style={{ width: 28, height: 28, borderRadius: 8 }}
            title="Перемешать треки в случайном порядке"
          >
            <Shuffle size={13} />
          </button>
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
      <div className="timer-container" style={{ marginBottom: 12 }}>
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
            style={{ height: 320, margin: '4px 0 16px' }}
            onClick={!isFlipped && !isTransitioning ? handleFlipCard : undefined}
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
                  marginBottom: 12,
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
                <div className="waveform-container" style={{ height: 24, marginBottom: 6 }}>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                    <div 
                      key={i} 
                      className={`waveform-bar ${isPlaying ? 'playing' : ''}`} 
                      style={{ width: 3 }}
                    />
                  ))}
                </div>

                <div style={{ fontSize: '1.08rem', fontWeight: 800 }}>
                  {isPlaying ? 'Слушайте отрывок...' : 'Отрывок сыгран'}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 4, textAlign: 'center', maxWidth: 280 }}>
                  Вспомните песню вслух, затем переверните карточку
                </div>

                {/* Card Controls */}
                <div style={{ display: 'flex', gap: 10, marginTop: 12 }} onClick={(e) => e.stopPropagation()}>
                  <button 
                    className="icon-button"
                    onClick={handleReplay}
                    title="Повторить отрывок"
                    style={{ width: 38, height: 38, borderRadius: '50%' }}
                  >
                    <RotateCcw size={15} />
                  </button>
                  <button 
                    className="icon-button"
                    onClick={() => {
                      if (isPlaying) stopAudio();
                      else startPlayback(currentTrack);
                    }}
                    style={{ 
                      width: 38, 
                      height: 38, 
                      borderRadius: '50%',
                      background: isPlaying ? 'rgba(239, 68, 68, 0.2)' : 'var(--grad-primary)',
                      color: '#fff',
                      borderColor: 'transparent'
                    }}
                  >
                    {isPlaying ? <span style={{ fontWeight: 800, fontSize: '0.8rem' }}>❚❚</span> : <Play size={15} fill="#fff" />}
                  </button>
                </div>
              </div>

              {/* BACK: Revealed Answer (pinned to backTrackData) */}
              <div className="flashcard-back">
                {backTrackData && backTrackData.albumArt && (
                  <img 
                    src={backTrackData.albumArt} 
                    alt="" 
                    style={{ 
                      width: 100, 
                      height: 100, 
                      borderRadius: 14, 
                      objectFit: 'cover', 
                      marginBottom: 10,
                      boxShadow: '0 8px 25px rgba(0,0,0,0.6)',
                      border: '2px solid rgba(255,255,255,0.1)'
                    }} 
                  />
                )}
                <div style={{ 
                  fontSize: '1.2rem', 
                  fontWeight: 900, 
                  textAlign: 'center',
                  lineHeight: 1.25,
                  maxWidth: '92%'
                }}>
                  {backTrackData ? backTrackData.name : ''}
                </div>
                <div style={{ 
                  fontSize: '1rem', 
                  color: '#c4b5fd', 
                  fontWeight: 700, 
                  marginTop: 4,
                  textAlign: 'center'
                }}>
                  {backTrackData ? backTrackData.artist : ''}
                </div>
                {backTrackData && backTrackData.year && (
                  <div style={{ 
                    fontSize: '0.8rem', 
                    color: 'var(--text-muted)', 
                    marginTop: 6,
                    background: 'rgba(255,255,255,0.06)',
                    padding: '2px 8px',
                    borderRadius: 8
                  }}>
                    Год выпуска: {backTrackData.year}
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
              disabled={isTransitioning}
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
                disabled={isTransitioning}
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
                disabled={isTransitioning}
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
      {/* MODE 2: BUZZER / PARTY MODE                                  */}
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
                  <button className="action-btn" onClick={advanceToNext} style={{ width: 'auto', padding: '10px 14px' }}>
                    <ArrowRight size={18} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* MODE 3: 4 OPTIONS                                            */}
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
              <button className="action-btn" onClick={advanceToNext} style={{ width: 'auto', padding: '10px 14px' }}>
                <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
