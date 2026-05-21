const app = require('./app');
const { createServer } = require('http');
const { initSocket } = require('./config/socket');

const PORT = process.env.PORT || 5000;

const server = createServer(app);

// Initialize Socket.io
initSocket(server);

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
});