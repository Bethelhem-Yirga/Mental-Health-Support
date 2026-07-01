const validateAssessment = (req, res, next) => {
  const { answers } = req.body;
  
  if (!answers || !Array.isArray(answers)) {
    return res.status(400).json({ error: 'Answers must be an array' });
  }
  
  if (answers.length !== 9) {
    return res.status(400).json({ error: 'Need exactly 9 answers' });
  }
  
  for (let answer of answers) {
    if (typeof answer !== 'number' || answer < 0 || answer > 3) {
      return res.status(400).json({ error: 'Each answer must be a number between 0-3' });
    }
  }
  
  next();
};

module.exports = { validateAssessment };