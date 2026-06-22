import React, { useState, useEffect } from 'react';

function MeditationTimer() {
  const [duration, setDuration] = useState(5); // minutes
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedSound, setSelectedSound] = useState('calm');
  
  const sounds = {
    calm: '🌊 Ocean Waves',
    forest: '🌲 Forest Birds',
    rain: '☔ Gentle Rain',
    bell: '🔔 Meditation Bell'
  };
  
  useEffect(() => {
    let interval;
    
    if (isActive && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      // Meditation complete
      setIsActive(false);
      playCompletionSound();
    }
    
    return () => clearInterval(interval);
  }, [isActive, isPaused, timeLeft]);
  
  const playCompletionSound = () => {
    // Play beep or bell sound
    const audio = new Audio('data:audio/wav;base64,U3RlYWx0aCBzb3VuZA==');
    audio.play().catch(console.error);
    alert('✨ Meditation Complete! Well done! ✨');
  };
  
  const startMeditation = () => {
    setTimeLeft(duration * 60);
    setIsActive(true);
    setIsPaused(false);
  };
  
  const pauseMeditation = () => {
    setIsPaused(true);
  };
  
  const resumeMeditation = () => {
    setIsPaused(false);
  };
  
  const resetMeditation = () => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(0);
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="mindfulness-container">
      <h2>🧘 Guided Meditation Timer</h2>
      <p className="exercise-description">
        Take a moment for yourself. Set a timer and enjoy a peaceful meditation.
      </p>
      
      {!isActive ? (
        <div className="meditation-setup">
          <div className="duration-selector">
            <label>Select Duration:</label>
            <div className="duration-buttons">
              {[3, 5, 10, 15, 20].map((mins) => (
                <button
                  key={mins}
                  className={`duration-btn ${duration === mins ? 'active' : ''}`}
                  onClick={() => setDuration(mins)}
                >
                  {mins} min
                </button>
              ))}
            </div>
          </div>
          
          <div className="sound-selector">
            <label>Background Sound:</label>
            <select value={selectedSound} onChange={(e) => setSelectedSound(e.target.value)}>
              {Object.entries(sounds).map(([key, name]) => (
                <option key={key} value={key}>{name}</option>
              ))}
            </select>
          </div>
          
          <button onClick={startMeditation} className="mindfulness-btn start-btn">
            🧘 Start Meditation
          </button>
        </div>
      ) : (
        <div className="meditation-active">
          <div className="meditation-timer">
            <div className="timer-circle">
              <div className="timer-text">{formatTime(timeLeft)}</div>
              <div className="timer-label">remaining</div>
            </div>
          </div>
          
          <div className="meditation-controls">
            {!isPaused ? (
              <button onClick={pauseMeditation} className="mindfulness-btn pause-btn">
                ⏸️ Pause
              </button>
            ) : (
              <button onClick={resumeMeditation} className="mindfulness-btn resume-btn">
                ▶️ Resume
              </button>
            )}
            <button onClick={resetMeditation} className="mindfulness-btn stop-btn">
              ⏹️ End
            </button>
          </div>
          
          <div className="meditation-guidance">
            <p>🌬️ Focus on your breath</p>
            <p>🧠 Let go of thoughts</p>
            <p>💚 Be kind to yourself</p>
          </div>
        </div>
      )}
      
      <div className="meditation-tips">
        <h4>💡 Meditation Tips:</h4>
        <ul>
          <li>Find a quiet, comfortable space</li>
          <li>Sit with your back straight</li>
          <li>Focus on your natural breath</li>
          <li>Don't judge wandering thoughts</li>
        </ul>
      </div>
    </div>
  );
}

export default MeditationTimer;
