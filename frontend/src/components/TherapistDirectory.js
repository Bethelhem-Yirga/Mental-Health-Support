import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TherapistDirectory({ apiUrl }) {
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchTherapists();
  }, [apiUrl]);
  
  const fetchTherapists = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/therapists`);
      
      // Handle both response formats: direct array or { data: [] }
      let therapistsData = [];
      if (Array.isArray(response.data)) {
        therapistsData = response.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        therapistsData = response.data.data;
      } else if (response.data.therapists && Array.isArray(response.data.therapists)) {
        therapistsData = response.data.therapists;
      }
      
      setTherapists(therapistsData);
      setError(null);
    } catch (err) {
      console.error('Error fetching therapists:', err);
      setError('Failed to load therapists. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) return <div className="loading">Loading therapists...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!therapists.length) return <div className="no-data">No therapists available at the moment.</div>;
  
  return (
    <div className="resource-container">
      <h2>Therapist Directory</h2>
      <p className="subtitle">Find licensed therapists specialized in mental health support</p>
      
      <div className="therapists-grid">
        {therapists.map(therapist => (
          <div key={therapist.id} className="therapist-card">
            <h3>{therapist.name}</h3>
            <p className="specialty">🎯 {therapist.specialty}</p>
            <p className="rating">⭐ {therapist.rating} / 5.0</p>
            {therapist.experience && <p className="experience">📅 {therapist.experience}</p>}
            {therapist.location && <p className="location">📍 {therapist.location}</p>}
            <p className={`availability ${therapist.available ? 'available' : 'unavailable'}`}>
              {therapist.available ? '✅ Available for booking' : '❌ Currently unavailable'}
            </p>
            <button className="book-btn" disabled={!therapist.available}>
              {therapist.available ? 'Book Session' : 'Not Available'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TherapistDirectory;