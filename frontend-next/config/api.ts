// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  HEALTH: `${API_BASE_URL}/health`,
  USERS: `${API_BASE_URL}/users`,
  MOODS: `${API_BASE_URL}/moods`,
  ASSESSMENT: `${API_BASE_URL}/assessment`,
  THERAPISTS: `${API_BASE_URL}/therapists`,
  RESOURCES: `${API_BASE_URL}/resources`,
  CRISIS: `${API_BASE_URL}/crisis`,
};

export default API_BASE_URL;
