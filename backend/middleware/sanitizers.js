const { sanitizeBody } = require('express-validator');

// Data sanitization middleware
const sanitizeMoodEntry = [
  sanitizeBody('note').trim().escape(),
  sanitizeBody('tags').customSanitizer(value => {
    if (Array.isArray(value)) {
      return value.map(tag => tag.toLowerCase().trim());
    }
    return value;
  }),
  sanitizeBody('userId').trim()
];

// Remove HTML tags from text
const stripHtml = (value) => {
  if (typeof value === 'string') {
    return value.replace(/<[^>]*>/g, '');
  }
  return value;
};

const sanitizeChatMessage = [
  sanitizeBody('text').customSanitizer(stripHtml).trim().escape()
];

module.exports = {
  sanitizeMoodEntry,
  sanitizeChatMessage,
  stripHtml
};
