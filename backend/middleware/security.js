// Additional security middleware
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

// Prevent NoSQL injection
app.use(mongoSanitize());

// Sanitize user input against XSS
app.use(xss());

// These would need to be installed:
// npm install express-mongo-sanitize xss-clean