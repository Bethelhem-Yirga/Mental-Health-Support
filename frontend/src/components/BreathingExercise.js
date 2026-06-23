import React, { useState, useEffect, useCallback } from 'react';

function BreathingExercise() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('inhale'); // inhale, hold, exhale, rest
  const [timer, setTimer] = useState(4);
  const [cycles, setCycles] = useState(0);
  const [circleSize, setCircleSize] = useState(100);
  
  // 4-7-8 Breathing Technique
  const phases = {
    inhale: { duration: 4, next: 'hold', instruction: 'Breathe In...', color: '#4CAF50' },
    hold: { duration: 7, next: 'exhale', instruction: 'Hold...', color: '#FFC107' },
    exhale: { duration: 8, next: 'rest', instruction: 'Breathe Out...', color: '#2196F3' },
    rest: { duration: 2, next: 'inhale', instruction: 'Rest...', color: '#9C27B0' }
  };
  
  useEffect(() => {
    let interval;
    
    if (isActive) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            // Move to next phase
            const currentPhase = phases[phase];
            setPhase(currentPhase.next);
            setCycles(prev => phase === 'rest' ? prev + 1 : prev);
            return phases[currentPhase.next].duration;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isActive, phase]);
  
  // Animate circle size based on breathing phase
  useEffect(() => {
    if (phase === 'inhale') {
      setCircleSize(150);
    } else if (phase === 'exhale') {
      setCircleSize(80);
    } else if (phase === 'hold') {
      setCircleSize(150);
    } else {
      setCircleSize(100);
    }
  }, [phase]);
  
  const startExercise = () => {
    setIsActive(true);
    setPhase('inhale');
    setTimer(4);
    setCycles(0);
  };
  
  const stopExercise = () => {
    setIsActive(false);
    setPhase('inhale');
    setTimer(4);
  };
  
  const currentPhase = phases[phase];
  
  return (
    <div className="mindfulness-container">
      <h2>🌬️ 4-7-8 Breathing Exercise</h2>
      <p className="exercise-description">
        This breathing technique helps reduce anxiety and promote calmness.
        Inhale for 4 seconds, hold for 7, exhale for 8.
      </p>
      
      <div className="breathing-circle-container">
        <div 
          className="breathing-circle"
          style={{
            width: `${circleSize}px`,
            height: `${circleSize}px`,
            backgroundColor: currentPhase.color,
            transition: 'width 4s ease-in-out, height 4s ease-in-out, background-color 0.5s'
          }}
        >
          <div className="breathing-instruction">
            {currentPhase.instruction}
            <div className="breathing-timer">{timer}s</div>
          </div>
        </div>
      </div>
      
      <div className="breathing-stats">
        <div className="stat">Cycles: {Math.floor(cycles / 4)}</div>
        <div className="stat">Phase: {phase.toUpperCase()}</div>
      </div>
      
      {!isActive ? (
        <button onClick={startExercise} className="mindfulness-btn start-btn">
          ▶ Start Breathing Exercise
        </button>
      ) : (
        <button onClick={stopExercise} className="mindfulness-btn stop-btn">
          ⏹️ Stop Exercise
        </button>
      )}
      
      <div className="breathing-tips">
        <h4>💡 Tips:</h4>
        <ul>
          <li>Sit comfortably with your back straight</li>
          <li>Close your eyes if it helps</li>
          <li>Follow the circle animation</li>
          <li>Repeat for 4-8 cycles</li>
        </ul>
      </div>
    </div>
  );
}

export default BreathingExercise;
