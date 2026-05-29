import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const moods = ['😊 Great', '🙂 Good', '😐 Okay', '😔 Low', '😢 Very Low'];

function MoodJournal({ onSave, entries }) {
  const [selectedMood, setSelectedMood] = useState(2);
  const [note, setNote] = useState('');
  
  const saveEntry = () => {
    const entry = {
      id: Date.now(),
      mood: moods[selectedMood],
      moodValue: selectedMood,
      note,
      date: new Date().toISOString()
    };
    onSave(entry);
    setNote('');
    alert('Mood saved!');
  };
  
  const chartData = {
    labels: entries.slice().reverse().map(e => new Date(e.date).toLocaleDateString()),
    datasets: [{
      label: 'Mood Trend (0=Great, 4=Very Low)',
      data: entries.slice().reverse().map(e => e.moodValue),
      borderColor: '#4CAF50',
      tension: 0.3
    }]
  };
  
  return (
    <div className="journal-container">
      <h2>Mood Tracking Journal</h2>
      
      <div className="mood-selector">
        <h3>How are you feeling today?</h3>
        <div className="mood-buttons">
          {moods.map((mood, idx) => (
            <button key={idx} className={`mood-btn ${selectedMood === idx ? 'active' : ''}`} onClick={() => setSelectedMood(idx)}>
              {mood}
            </button>
          ))}
        </div>
        <textarea placeholder="Optional note..." value={note} onChange={(e) => setNote(e.target.value)} rows="3" />
        <button onClick={saveEntry}>Save Entry</button>
      </div>
      
      {entries.length > 0 && (
        <div className="mood-chart">
          <h3>Your Mood Trend</h3>
          <Line data={chartData} />
        </div>
      )}
    </div>
  );
}

export default MoodJournal;