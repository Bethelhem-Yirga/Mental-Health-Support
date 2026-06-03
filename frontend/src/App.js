import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import io from 'socket.io-client';
import './App.css';

import AnonymousChat from './components/AnonymousChat';
import TherapistDirectory from './components/TherapistDirectory';
import SelfAssessment from './components/SelfAssessment';
import MoodJournal from './components/MoodJournal';
import ResourceLibrary from './components/ResourceLibrary';
import CrisisHotline from './components/CrisisHotline';
import MindfulnessTools from './components/MindfulnessTools';

const API_URL = 'http://localhost:5000/api';
const SOCKET_URL = 'http://localhost:5000';

const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
});

function App() {
  const [moodEntries, setMoodEntries] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadOrCreateUser = async () => {
      try {
        let storedUserId = localStorage.getItem('userId');
        
        if (storedUserId) {
          setUserId(storedUserId);
        } else {
          const response = await fetch(`${API_URL}/users/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          });
          const data = await response.json();
          
          if (data.success && data.data.userId) {
            localStorage.setItem('userId', data.data.userId);
            setUserId(data.data.userId);
          }
        }
      } catch (error) {
        console.error('Error creating user:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadOrCreateUser();
  }, []);
  
  useEffect(() => {
    const saved = localStorage.getItem('moodEntries');
    if (saved) setMoodEntries(JSON.parse(saved));
  }, []);
  
  const saveMoodEntry = (entry) => {
    const newEntries = [entry, ...moodEntries].slice(0, 30);
    setMoodEntries(newEntries);
    localStorage.setItem('moodEntries', JSON.stringify(newEntries));
  };
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading MindSpace...</p>
      </div>
    );
  }
  
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <h1 className="logo">💚 MindSpace</h1>
          <div className="nav-links">
            <Link to="/">Chat</Link>
            <Link to="/therapists">Therapists</Link>
            <Link to="/assessment">Assessment</Link>
            <Link to="/journal">Mood Journal</Link>
            <Link to="/mindfulness">Mindfulness</Link>
            <Link to="/resources">Resources</Link>
            <Link to="/crisis">Crisis Help</Link>
          </div>
          <div className="user-info">
            <span className="user-badge">👤 Anonymous</span>
          </div>
        </nav>
        
        <Routes>
          <Route path="/" element={<AnonymousChat socket={socket} userId={userId} />} />
          <Route path="/therapists" element={<TherapistDirectory apiUrl={API_URL} userId={userId} />} />
          <Route path="/assessment" element={<SelfAssessment apiUrl={API_URL} userId={userId} />} />
          <Route path="/journal" element={<MoodJournal onSave={saveMoodEntry} entries={moodEntries} userId={userId} />} />
          <Route path="/mindfulness" element={<MindfulnessTools />} />
          <Route path="/resources" element={<ResourceLibrary apiUrl={API_URL} />} />
          <Route path="/crisis" element={<CrisisHotline apiUrl={API_URL} userId={userId} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
