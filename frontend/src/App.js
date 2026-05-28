import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import './App.css';

// Components
import AnonymousChat from './components/AnonymousChat';
import TherapistDirectory from './components/TherapistDirectory';
import SelfAssessment from './components/SelfAssessment';
import MoodJournal from './components/MoodJournal';
import ResourceLibrary from './components/ResourceLibrary';
import CrisisHotline from './components/CrisisHotline';

const API_URL = 'http://localhost:5000/api';
const socket = io('http://localhost:5000');

function App() {
  const [moodEntries, setMoodEntries] = useState([]);
  
  useEffect(() => {
    const saved = localStorage.getItem('moodEntries');
    if (saved) setMoodEntries(JSON.parse(saved));
  }, []);
  
  const saveMoodEntry = (entry) => {
    const newEntries = [entry, ...moodEntries].slice(0, 30);
    setMoodEntries(newEntries);
    localStorage.setItem('moodEntries', JSON.stringify(newEntries));
  };
  
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
            <Link to="/resources">Resources</Link>
            <Link to="/crisis">Crisis Help</Link>
          </div>
        </nav>
        
        <Routes>
          <Route path="/" element={<AnonymousChat socket={socket} />} />
          <Route path="/therapists" element={<TherapistDirectory apiUrl={API_URL} />} />
          <Route path="/assessment" element={<SelfAssessment apiUrl={API_URL} />} />
          <Route path="/journal" element={<MoodJournal onSave={saveMoodEntry} entries={moodEntries} />} />
          <Route path="/resources" element={<ResourceLibrary apiUrl={API_URL} />} />
          <Route path="/crisis" element={<CrisisHotline apiUrl={API_URL} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;