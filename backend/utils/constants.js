exports.MOODS = ['😊 Great', '🙂 Good', '😐 Okay', '😔 Low', '😢 Very Low'];

exports.calculatePHQ9Score = (total) => {
  let severity = 'Minimal';
  let recommendation = 'Continue your wellness practices';
  
  if (total >= 5 && total <= 9) {
    severity = 'Mild';
    recommendation = 'Consider self-help strategies and monitor symptoms';
  } else if (total >= 10 && total <= 14) {
    severity = 'Moderate';
    recommendation = 'Consider speaking with a therapist';
  } else if (total >= 15 && total <= 19) {
    severity = 'Moderately Severe';
    recommendation = 'Strongly recommend consulting a mental health professional';
  } else if (total >= 20) {
    severity = 'Severe';
    recommendation = 'Please seek professional help immediately';
  }
  
  return { severity, recommendation };
};