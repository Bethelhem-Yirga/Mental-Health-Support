import React, { useState } from 'react';

function GroundingTechnique() {
  const [activeStep, setActiveStep] = useState(0);
  const [userInputs, setUserInputs] = useState({
    sight: [],
    touch: [],
    sound: [],
    smell: [],
    taste: []
  });
  
  const steps = [
    {
      title: "👁️ 5 Things You Can SEE",
      description: "Look around and notice 5 things you can see",
      field: "sight",
      placeholder: "e.g., a blue pen, a tree outside, my hands..."
    },
    {
      title: "✋ 4 Things You Can TOUCH",
      description: "Feel 4 things you can touch around you",
      field: "touch",
      placeholder: "e.g., the soft fabric of my shirt, the cool table..."
    },
    {
      title: "👂 3 Things You Can HEAR",
      description: "Listen carefully for 3 sounds around you",
      field: "sound",
      placeholder: "e.g., birds chirping, the fan humming, my breathing..."
    },
    {
      title: "👃 2 Things You Can SMELL",
      description: "Notice 2 things you can smell",
      field: "smell",
      placeholder: "e.g., fresh coffee, the scent of rain, laundry detergent..."
    },
    {
      title: "👅 1 Thing You Can TASTE",
      description: "Focus on 1 thing you can taste",
      field: "taste",
      placeholder: "e.g., mint from toothpaste, water, coffee..."
    }
  ];
  
  const [currentInput, setCurrentInput] = useState('');
  
  const addItem = () => {
    if (currentInput.trim()) {
      const field = steps[activeStep].field;
      setUserInputs({
        ...userInputs,
        [field]: [...userInputs[field], currentInput.trim()]
      });
      setCurrentInput('');
      
      // Auto-advance if reached required number
      const requiredCount = [5, 4, 3, 2, 1][activeStep];
      if (userInputs[field].length + 1 === requiredCount && activeStep < 4) {
        setTimeout(() => setActiveStep(activeStep + 1), 500);
      }
    }
  };
  
  const resetExercise = () => {
    setActiveStep(0);
    setUserInputs({ sight: [], touch: [], sound: [], smell: [], taste: [] });
    setCurrentInput('');
  };
  
  const requiredCount = [5, 4, 3, 2, 1][activeStep];
  const currentField = steps[activeStep].field;
  const progress = (userInputs[currentField].length / requiredCount) * 100;
  const isComplete = userInputs.taste.length === 1;
  
  if (isComplete) {
    return (
      <div className="mindfulness-container">
        <div className="grounding-complete">
          <div className="complete-icon">🎉</div>
          <h2>Grounding Exercise Complete!</h2>
          <p>You've successfully grounded yourself in the present moment.</p>
          <div className="grounding-summary">
            <h4>Your Observations:</h4>
            <div className="summary-grid">
              <div className="summary-item">
                <strong>👁️ Sight:</strong> {userInputs.sight.join(', ')}
              </div>
              <div className="summary-item">
                <strong>✋ Touch:</strong> {userInputs.touch.join(', ')}
              </div>
              <div className="summary-item">
                <strong>👂 Sound:</strong> {userInputs.sound.join(', ')}
              </div>
              <div className="summary-item">
                <strong>👃 Smell:</strong> {userInputs.smell.join(', ')}
              </div>
              <div className="summary-item">
                <strong>👅 Taste:</strong> {userInputs.taste.join(', ')}
              </div>
            </div>
          </div>
          <button onClick={resetExercise} className="mindfulness-btn start-btn">
            🔄 Start Over
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="mindfulness-container">
      <h2>🌱 5-4-3-2-1 Grounding Technique</h2>
      <p className="exercise-description">
        This exercise helps you return to the present moment during anxiety or stress.
      </p>
      
      <div className="grounding-progress">
        <div className="progress-steps">
          {steps.map((step, idx) => (
            <div 
              key={idx} 
              className={`progress-step ${idx === activeStep ? 'active' : ''} ${idx < activeStep ? 'completed' : ''}`}
            >
              <div className="step-number">{idx + 1}</div>
              <div className="step-label">{step.title.split(' ')[0]}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="grounding-step">
        <h3>{steps[activeStep].title}</h3>
        <p>{steps[activeStep].description}</p>
        <p className="required-count">
          Find {requiredCount} more thing{requiredCount !== 1 ? 's' : ''} ({userInputs[currentField].length}/{requiredCount})
        </p>
        
        <div className="grounding-input">
          <input
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            placeholder={steps[activeStep].placeholder}
            onKeyPress={(e) => e.key === 'Enter' && addItem()}
          />
          <button onClick={addItem}>Add</button>
        </div>
        
        <div className="grounding-list">
          {userInputs[currentField].map((item, idx) => (
            <div key={idx} className="grounding-item">
              ✓ {item}
            </div>
          ))}
        </div>
        
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    </div>
  );
}

export default GroundingTechnique;
