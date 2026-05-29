import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CrisisHotline({ apiUrl }) {
  const [hotlines, setHotlines] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchHotlines();
  }, [apiUrl]);
  
  const fetchHotlines = async () => {
    try {
      const response = await axios.get(`${apiUrl}/crisis/hotlines`);
      
      let hotlinesData = [];
      if (Array.isArray(response.data)) {
        hotlinesData = response.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        hotlinesData = response.data.data;
      }
      
      setHotlines(hotlinesData);
    } catch (err) {
      console.error('Error fetching hotlines:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCall = (number) => {
    window.location.href = `tel:${number}`;
  };
  
  if (loading) return <div className="loading">Loading crisis resources...</div>;
  
  return (
    <div className="crisis-container">
      <div className="crisis-warning">
        <div className="warning-icon">⚠️</div>
        <div className="warning-text">
          <strong>If you are in immediate danger or having thoughts of harming yourself,</strong><br />
          Please call 911 or go to your nearest emergency room immediately.
        </div>
      </div>
      
      <h2>24/7 Crisis Support Hotlines</h2>
      <p className="crisis-subtitle">Free, confidential support is available 24/7. You are not alone.</p>
      
      <div className="hotlines-grid">
        {hotlines.map((line, idx) => (
          <div key={idx} className="hotline-card-enhanced">
            <h3>{line.name}</h3>
            <div className="hotline-number-large">
              <a href={`tel:${line.number}`}>{line.number}</a>
            </div>
            {line.description && <p className="hotline-description">{line.description}</p>}
            <div className="hotline-features">
              {line.available24_7 && <span className="feature">🕒 24/7 Available</span>}
              {line.sms && <span className="feature">💬 SMS Available</span>}
            </div>
            <button onClick={() => handleCall(line.number)} className="call-btn">
              📞 Call Now
            </button>
          </div>
        ))}
      </div>
      
      <div className="safety-plan-section">
        <h3>📝 Create Your Safety Plan</h3>
        <p>Having a plan can help during difficult moments. Fill this out for yourself:</p>
        
        <div className="safety-plan-form">
          <div className="plan-item">
            <label>Emergency Contacts (friends, family, therapist):</label>
            <textarea placeholder="Name and phone numbers..." rows="2"></textarea>
          </div>
          
          <div className="plan-item">
            <label>Coping Strategies that work for me:</label>
            <textarea placeholder="Deep breathing, walking, music, calling a friend..." rows="2"></textarea>
          </div>
          
          <div className="plan-item">
            <label>Reasons for living / Things that matter to me:</label>
            <textarea placeholder="Family, pets, future goals, favorite activities..." rows="2"></textarea>
          </div>
          
          <button className="save-plan-btn" onClick={() => alert('Save this page or take a screenshot')}>
            Save My Safety Plan
          </button>
        </div>
      </div>
    </div>
  );
}

export default CrisisHotline;