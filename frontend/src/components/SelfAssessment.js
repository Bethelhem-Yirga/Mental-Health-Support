import React, { useState } from 'react';
import axios from 'axios';

const questions = [
  "Little interest or pleasure in doing things?",
  "Feeling down, depressed, or hopeless?",
  "Trouble falling/staying asleep or sleeping too much?",
  "Feeling tired or having little energy?",
  "Poor appetite or overeating?",
  "Feeling bad about yourself?",
  "Trouble concentrating on things?",
  "Moving/speaking slowly or being fidgety/restless?",
  "Thoughts of self-harm?"
];

function SelfAssessment({ apiUrl }) {
  const [answers, setAnswers] = useState(Array(9).fill(0));
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  const handleAnswer = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = parseInt(value);
    setAnswers(newAnswers);
  };
  
  const submitAssessment = async () => {
    setSubmitting(true);
    try {
      const response = await axios.post(`${apiUrl}/assessment/submit`, { answers });
      
      // Handle different response formats
      let score, severity, recommendation;
      if (response.data.score !== undefined) {
        score = response.data.score;
        severity = response.data.severity;
        recommendation = response.data.recommendation;
      } else if (response.data.data) {
        score = response.data.data.score;
        severity = response.data.data.severity;
        recommendation = response.data.data.recommendation;
      }
      
      setResult({ score, severity, recommendation });
    } catch (err) {
      console.error('Error submitting assessment:', err);
      alert('Failed to submit assessment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'Minimal': return '#4CAF50';
      case 'Mild': return '#FFC107';
      case 'Moderate': return '#FF9800';
      case 'Moderately Severe': return '#FF5722';
      case 'Severe': return '#f44336';
      default: return '#2196F3';
    }
  };
  
  return (
    <div className="assessment-container">
      <h2>Mental Health Self-Assessment</h2>
      <p className="assessment-info">
        This PHQ-9 questionnaire helps assess your mental wellbeing over the last 2 weeks.
        Rate each symptom: <strong>0=Not at all, 1=Several days, 2=More than half days, 3=Nearly every day</strong>
      </p>
      
      <div className="questions-container">
        {questions.map((q, idx) => (
          <div key={idx} className="question-card">
            <p className="question-text">{idx+1}. {q}</p>
            <div className="rating-buttons">
              {[0,1,2,3].map(val => (
                <button
                  key={val}
                  type="button"
                  className={`rating-btn ${answers[idx] === val ? 'selected' : ''}`}
                  onClick={() => handleAnswer(idx, val)}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <button onClick={submitAssessment} disabled={submitting} className="submit-btn">
        {submitting ? 'Analyzing...' : 'Get Results'}
      </button>
      
      {result && (
        <div className="result-card" style={{ borderColor: getSeverityColor(result.severity) }}>
          <h3>Your Assessment Results</h3>
          <div className="score-display">
            <span className="score">Score: {result.score}/27</span>
            <span className="severity" style={{ color: getSeverityColor(result.severity) }}>
              {result.severity} Depression
            </span>
          </div>
          <p className="recommendation">{result.recommendation}</p>
          {result.severity !== "Minimal" && (
            <div className="crisis-warning-small">
              ⚠️ Consider speaking with a mental health professional
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SelfAssessment;