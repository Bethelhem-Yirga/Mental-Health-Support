import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ResourceLibrary({ apiUrl }) {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  
  useEffect(() => {
    fetchResources();
  }, [apiUrl]);
  
  const fetchResources = async () => {
    try {
      const response = await axios.get(`${apiUrl}/resources`);
      
      let resourcesData = [];
      if (Array.isArray(response.data)) {
        resourcesData = response.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        resourcesData = response.data.data;
      }
      
      setResources(resourcesData);
    } catch (err) {
      console.error('Error fetching resources:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const getTypeIcon = (type) => {
    switch(type) {
      case 'article': return '📄';
      case 'video': return '🎥';
      case 'pdf': return '📕';
      case 'audio': return '🎧';
      default: return '📚';
    }
  };
  
  const filteredResources = filter === 'all' 
    ? resources 
    : resources.filter(r => r.type === filter);
  
  if (loading) return <div className="loading">Loading resources...</div>;
  
  return (
    <div className="resource-container">
      <h2>Resource Library</h2>
      
      <div className="filter-buttons">
        <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>All</button>
        <button onClick={() => setFilter('article')} className={filter === 'article' ? 'active' : ''}>Articles</button>
        <button onClick={() => setFilter('video')} className={filter === 'video' ? 'active' : ''}>Videos</button>
        <button onClick={() => setFilter('audio')} className={filter === 'audio' ? 'active' : ''}>Audio</button>
      </div>
      
      <div className="resources-grid">
        {filteredResources.map(resource => (
          <div key={resource.id} className="resource-card">
            <div className="resource-icon">{getTypeIcon(resource.type)}</div>
            <h3>{resource.title}</h3>
            <p className="resource-type">{resource.type.toUpperCase()}</p>
            {resource.duration && <p className="duration">⏱️ {resource.duration}</p>}
            <a href={resource.link} className="resource-link">Access Resource →</a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResourceLibrary;