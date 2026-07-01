const { body, param, query, validationResult } = require('express-validator');

// Helper function to check validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

// ==================== USER VALIDATORS ====================

const validateUserId = [
  param('userId').isMongoId().withMessage('Invalid user ID format'),
  validate
];

const validateCreateUser = [
  body('name').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('preferences').optional().isObject().withMessage('Preferences must be an object'),
  validate
];

// ==================== MOOD ENTRY VALIDATORS ====================

const validateMoodEntry = [
  body('userId').isMongoId().withMessage('Valid user ID is required'),
  body('moodValue').isInt({ min: 0, max: 4 }).withMessage('Mood value must be between 0 and 4'),
  body('moodLabel').isIn(['😊 Great', '🙂 Good', '😐 Okay', '😔 Low', '😢 Very Low'])
    .withMessage('Invalid mood label'),
  body('note').optional().trim().isLength({ max: 500 }).withMessage('Note cannot exceed 500 characters')
    .escape(), // Prevents XSS attacks
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('tags.*').optional().isIn(['work', 'relationships', 'health', 'finance', 'family', 'other'])
    .withMessage('Invalid tag value'),
  body('sleep').optional().isInt({ min: 0, max: 24 }).withMessage('Sleep must be 0-24 hours'),
  body('exercise').optional().isBoolean().withMessage('Exercise must be true/false'),
  body('social').optional().isBoolean().withMessage('Social must be true/false'),
  validate
];

const validateMoodQuery = [
  query('userId').isMongoId().withMessage('Valid user ID is required'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100'),
  query('startDate').optional().isISO8601().withMessage('Invalid date format'),
  query('endDate').optional().isISO8601().withMessage('Invalid date format'),
  validate
];

const validateDeleteMood = [
  param('id').isMongoId().withMessage('Invalid mood entry ID'),
  body('userId').isMongoId().withMessage('User ID is required'),
  validate
];

// ==================== ASSESSMENT VALIDATORS ====================

const validateAssessment = [
  body('userId').isMongoId().withMessage('Valid user ID is required'),
  body('answers').isArray({ min: 9, max: 9 }).withMessage('Must provide exactly 9 answers'),
  body('answers.*').isInt({ min: 0, max: 3 }).withMessage('Each answer must be 0, 1, 2, or 3'),
  validate
];

const validateAssessmentHistory = [
  param('userId').isMongoId().withMessage('Invalid user ID'),
  validate
];

// ==================== THERAPIST VALIDATORS ====================

const validateTherapistQuery = [
  query('available').optional().isBoolean().withMessage('Available must be true/false'),
  query('specialty').optional().trim().isLength({ min: 2 }).withMessage('Specialty too short'),
  validate
];

const validateTherapistId = [
  param('id').isInt().withMessage('Therapist ID must be a number'),
  validate
];

// ==================== RESOURCE VALIDATORS ====================

const validateResourceQuery = [
  query('category').optional().isIn(['anxiety', 'depression', 'sleep', 'coping', 'meditation'])
    .withMessage('Invalid category'),
  query('type').optional().isIn(['article', 'video', 'audio', 'pdf'])
    .withMessage('Invalid resource type'),
  validate
];

// ==================== CHAT VALIDATORS ====================

const validateChatMessage = [
  body('text').trim().notEmpty().withMessage('Message cannot be empty')
    .isLength({ max: 500 }).withMessage('Message cannot exceed 500 characters')
    .escape(), // Prevents XSS
  validate
];

// ==================== RATE LIMITING INFO ====================

const validateRateLimit = [
  query('reset').optional().isBoolean(),
  validate
];

// ==================== EXPORT ALL VALIDATORS ====================

module.exports = {
  // User validators
  validateUserId,
  validateCreateUser,
  
  // Mood validators
  validateMoodEntry,
  validateMoodQuery,
  validateDeleteMood,
  
  // Assessment validators
  validateAssessment,
  validateAssessmentHistory,
  
  // Therapist validators
  validateTherapistQuery,
  validateTherapistId,
  
  // Resource validators
  validateResourceQuery,
  
  // Chat validators
  validateChatMessage,
  
  // Rate limit validators
  validateRateLimit
};

// Custom validation messages (optional)
const customMessages = {
  required: '{{field}} is required',
  isInt: '{{field}} must be a number',
  isLength: '{{field}} must be between {{min}} and {{max}} characters',
  isMongoId: 'Invalid ID format',
  isIn: 'Invalid value for {{field}}'
};

// Example of custom validator
const validatePhoneNumber = (value) => {
  const phoneRegex = /^\+?[\d\s-]{10,}$/;
  if (!phoneRegex.test(value)) {
    throw new Error('Invalid phone number format');
  }
  return true;
};

// Add to mood validation for emergency contact
const validateEmergencyContact = [
  body('emergencyPhone').optional().custom(validatePhoneNumber),
  validate
];
