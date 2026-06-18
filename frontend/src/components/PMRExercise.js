import React, { useState, useEffect } from 'react';

function PMRExercise() {
  const [step, setStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isTensing, setIsTensing] = useState(true);
  
  const muscleGroups = [
    { name: "👊 Hands & Fists", area: "hands", instruction: "Make tight fists and feel the tension in your hands and forearms" },
    { name: "💪 Arms & Biceps", area: "arms", instruction: "Bend your elbows and tense your biceps" },
    { name: "🤯 Shoulders", area: "shoulders", instruction: "Shrug your shoulders up toward your ears" },
    { name: "😬 Face & Jaw", area: "face", instruction: "Clench your jaw and scrunch your face" },
    { name: "🦵 Legs & Thighs", area: "legs", instruction: "Tense your thigh muscles" },
    { name: "🦶 Feet", area: "feet", instruction: "Flex your feet and curl your toes" },
    { name: "😌 Full Body", area: "full", instruction: "Tense your entire body at once" }
  ];
  
  useEffect(() => {
    let timer;
    
    if (isActive) {
      timer = setTimeout(() => {
        if (isTensing) {
          // Switch to relaxation
          setIsTensing(false);
        } else {
          // Move to next muscle group or complete
          if (step < muscleGroups.length - 1) {
            setStep(step + 1);
            setIsTensing(true);
          } else {
            // Exercise complete
            setIsActive(false);
            setStep(0);
            alert('🎉 Progressive Muscle Relaxation Complete! 🎉');
          }
        }
      }, isTensing ? 7000 : 15000); // Tense for 7 seconds, relax for 15
    }
    
    return () => clearTimeout(timer);
  }, [isActive, isTensing, step]);
  
  const startExercise = () => {
    setIsActive(true);
    setStep(0);
    setIsTensing(true);
  };
  
  const stopExercise = () => {
    setIsActive(false);
    setStep(0);
  };
  
  if (!isActive) {
    return (
      <div className="mindfulness-container">
        <h2>🧘 Progressive Muscle Relaxation (PMR)</h2>
        <p className="exercise-description">
          PMR helps reduce anxiety by systematically tensing and relaxing different muscle groups.
        </p>
        
        <div className="pmr-info">
          <h4>How it works:</h4>
          <ul>
            <li>You'll tense each muscle group for 7 seconds</li>
            <li>Then relax for 15 seconds</li>
            <li>Focus on the difference between tension and relaxation</li>
            <li>Total time: ~10 minutes</li>
          </ul>
        </div>
        
        <button onClick={startExercise} className="mindfulness-btn start-btn">
          🧘 Start PMR Exercise
        </button>
      </div>
    );
  }
  
  const currentMuscle = muscleGroups[step];
  const phaseText = isTensing ? "TENSE" : "RELAX";
  const phaseColor = isTensing ? "#ff9800" : "#4CAF50";
  
  return (
    <div className="mindfulness-container">
      <div className="pmr-active">
        <div className="pmr-header">
          <h2>Progressive Muscle Relaxation</h2>
          <div className="pmr-progress">
            Step {step + 1} of {muscleGroups.length}
          </div>
        </div>
        
        <div className="pmr-phase" style={{ backgroundColor: phaseColor }}>
          <div className="phase-label">{phaseText}</div>
          <div className="phase-timer">
            {isTensing ? (
              <div className="timer-animation">💪</div>
            ) : (
              <div className="timer-animation">😌</div>
            )}
          </div>
        </div>
        
        <div className="pmr-instruction">
          <h3>{currentMuscle.name}</h3>
          <p>{currentMuscle.instruction}</p>
        </div>
        
        <div className="pmr-guidance">
          {isTensing ? (
            <p>🔴 Feel the tension building...</p>
          ) : (
            <p>🟢 Slowly release... notice the relaxation spreading...</p>
          )}
        </div>
        
        <button onClick={stopExercise} className="mindfulness-btn stop-btn">
          ⏹️ Stop Exercise
        </button>
      </div>
    </div>
  );
}

export default PMRExercise;
