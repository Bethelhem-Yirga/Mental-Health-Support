import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import MoodCalendar from './MoodCalendar';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const moods = ['😊 Great', '🙂 Good', '😐 Okay', '😔 Low', '😢 Very Low'];

function MoodJournal({ onSave, entries, userId }) {
  const [selectedMood, setSelectedMood] = useState(2);
  const [note, setNote] = useState('');
  const [activeTab, setActiveTab] = useState('journal'); // 'journal' or 'calendar'
  
  const saveEntry = () => {
    const entry = {
      id: Date.now(),
      mood: moods[selectedMood],
      moodValue: selectedMood,
      note,
      date: new Date().toISOString(),
      userId: userId
    };
    onSave(entry);
    setNote('');
    
    // Also save to backend
    fetch('http://localhost:5000/api/moods/entry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: userId,
        moodValue: selectedMood,
        moodLabel: moods[selectedMood],
        note: note
      })
    }).catch(err => console.error('Error saving to backend:', err));
    
    alert('Mood saved!');
  };
  
  // Prepare chart data
  const last30Days = [...entries].slice(0, 30).reverse();
  const chartData = {
    labels: last30Days.map(e => new Date(e.date).toLocaleDateString()),
    datasets: [{
      label: 'Mood Trend (0=Great, 4=Very Low)',
      data: last30Days.map(e => e.moodValue),
      borderColor: '#4CAF50',
      backgroundColor: 'rgba(76, 175, 80, 0.1)',
      tension: 0.3,
      fill: true
    }]
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      y: {
        reverse: true,
        min: 0,
        max: 4,
        ticks: {
          stepSize: 1,
          callback: (value) => {
            switch(value) {
              case 0: return '😊 Great';
              case 1: return '🙂 Good';
              case 2: return '😐 Okay';
              case 3: return '😔 Low';
              case 4: return '😢 Very Low';
              default: return value;
            }
          }
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed.y;
            switch(value) {
              case 0: return 'Mood: Great 😊';
              case 1: return 'Mood: Good 🙂';
              case 2: return 'Mood: Okay 😐';
              case 3: return 'Mood: Low 😔';
              case 4: return 'Mood: Very Low 😢';
              default: return `Mood: ${value}`;
            }
          }
        }
      }
    }
  };
  
  return (
    <div className="journal-container">
      <h2>📔 Mood Tracking Journal</h2>
      
      {/* Tab Navigation */}
      <div className="journal-tabs">
        <button 
          className={`tab-btn ${activeTab === 'journal' ? 'active' : ''}`}
          onClick={() => setActiveTab('journal')}
        >
          ✍️ New Entry
        </button>
        <button 
          className={`tab-btn ${activeTab === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveTab('calendar')}
        >
          📅 Calendar Heatmap
        </button>
        <button 
          className={`tab-btn ${activeTab === 'trends' ? 'active' : ''}`}
          onClick={() => setActiveTab('trends')}
        >
          📈 Trends & Analytics
        </button>
      </div>
      
      {/* New Entry Tab */}
      {activeTab === 'journal' && (
        <div className="mood-selector">
          <h3>How are you feeling today?</h3>
          <div className="mood-buttons">
            {moods.map((mood, idx) => (
              <button 
                key={idx} 
                className={`mood-btn ${selectedMood === idx ? 'active' : ''}`} 
                onClick={() => setSelectedMood(idx)}
              >
                {mood}
              </button>
            ))}
          </div>
          <textarea 
            placeholder="What's on your mind? (Optional)"
            value={note} 
            onChange={(e) => setNote(e.target.value)} 
            rows="4"
          />
          <button onClick={saveEntry} className="save-btn">
            💾 Save Today's Mood
          </button>
        </div>
      )}
      
      {/* Calendar Heatmap Tab */}
      {activeTab === 'calendar' && (
        <MoodCalendar moodEntries={entries} />
      )}
      
      {/* Trends Tab */}
      {activeTab === 'trends' && entries.length > 0 && (
        <div className="mood-chart">
          <h3>📈 Your Mood Trend (Last 30 Days)</h3>
          <Line data={chartData} options={chartOptions} />
          
          <div className="trend-insights">
            <h4>💡 Insights</h4>
            <ul>
              <li>📊 Total entries: {entries.length}</li>
              <li>📅 Most frequent mood: {
                moods[Object.entries(
                  entries.reduce((acc, e) => {
                    acc[e.moodValue] = (acc[e.moodValue] || 0) + 1;
                    return acc;
                  }, {})
                ).sort((a,b) => b[1] - a[1])[0]?.[0]] || 'None'
              }</li>
              <li>🔄 Consistency: {((entries.length / 30) * 100).toFixed(0)}% of last 30 days</li>
            </ul>
          </div>
        </div>
      )}
      
      {activeTab === 'trends' && entries.length === 0 && (
        <div className="no-data">
          <p>No mood entries yet. Start tracking to see your trends!</p>
        </div>
      )}
    </div>
  );
}

export default MoodJournal;