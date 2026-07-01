const app = require('./app');
const { createServer } = require('http');
const { initSocket } = require('./config/socket');
const connectDB = require('./config/database');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas FIRST
connectDB().then(() => {
  const server = createServer(app);
  
  // Initialize Socket.io
  const io = initSocket(server);
  
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  });
}).catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});