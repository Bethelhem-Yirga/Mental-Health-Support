import React, { useState } from 'react';
import BreathingExercise from './BreathingExercise';
import MeditationTimer from './MeditationTimer';
import GroundingTechnique from './GroundingTechnique';
import PMRExercise from './PMRExercise';

function MindfulnessTools() {
  const [activeTool, setActiveTool] = useState('dashboard');
  
  const tools = [
    { id: 'breathing', name: '🌬️ Breathing Exercise', icon: '🌬️', component: BreathingExercise },
    { id: 'meditation', name: '🧘 Meditation Timer', icon: '🧘', component: MeditationTimer },
    { id: 'grounding', name: '🌱 Grounding Technique', icon: '🌱', component: GroundingTechnique },
    { id: 'pmr', name: '💪 PMR Exercise', icon: '💪', component: PMRExercise }
  ];
  
  const ActiveComponent = tools.find(t => t.id === activeTool)?.component;
  
  if (activeTool !== 'dashboard' && ActiveComponent) {
    return (
      <div>
        <button onClick={() => setActiveTool('dashboard')} className="back-btn">
          ← Back to All Tools
        </button>
        <ActiveComponent />
      </div>
    );
  }
  
  return (
    <div className="mindfulness-dashboard">
      <h1>🧘 Mindfulness & Coping Tools</h1>
      <p className="dashboard-description">
        Choose a technique to help manage stress, anxiety, and improve mental wellbeing.
      </p>
      
      <div className="tools-grid">
        {tools.map(tool => (
          <div key={tool.id} className="tool-card" onClick={() => setActiveTool(tool.id)}>
            <div className="tool-icon">{tool.icon}</div>
            <h3>{tool.name}</h3>
            <p className="tool-description">
              {tool.id === 'breathing' && '4-7-8 breathing technique with visual guidance'}
              {tool.id === 'meditation' && 'Customizable meditation timer with background sounds'}
              {tool.id === 'grounding' && '5-4-3-2-1 sensory awareness exercise'}
              {tool.id === 'pmr' && 'Systematic muscle relaxation for anxiety relief'}
            </p>
            <button className="tool-btn">Start →</button>
          </div>
        ))}
      </div>
      
      <div className="mindfulness-tips">
        <h3>💡 When to Use These Tools:</h3>
        <div className="tips-grid">
          <div className="tip">
            <strong>🌬️ Breathing Exercise</strong>
            <p>Use during sudden anxiety or panic attacks</p>
          </div>
          <div className="tip">
            <strong>🧘 Meditation</strong>
            <p>Daily practice for long-term stress reduction</p>
          </div>
          <div className="tip">
            <strong>🌱 Grounding</strong>
            <p>When feeling disconnected or dissociating</p>
          </div>
          <div className="tip">
            <strong>💪 PMR</strong>
            <p>Before bed to improve sleep quality</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MindfulnessTools;
