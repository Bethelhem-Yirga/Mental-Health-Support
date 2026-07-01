const { Server } = require('socket.io');
const chatHistory = [];

let io;

exports.initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('✅ User connected:', socket.id);
    
    // Send chat history
    socket.emit('chat history', chatHistory.slice(-50));
    
    socket.on('chat message', (data) => {
      const message = {
        id: Date.now(),
        text: data.text,
        timestamp: new Date().toISOString(),
        anonymousId: socket.id.slice(-6)
      };
      
      chatHistory.push(message);
      
      // Keep only last 500 messages
      if (chatHistory.length > 500) chatHistory.shift();
      
      io.emit('chat message', message);
    });
    
    socket.on('typing', (data) => {
      socket.broadcast.emit('user typing', {
        isTyping: data.isTyping,
        userId: socket.id.slice(-6)
      });
    });
    
    socket.on('disconnect', () => {
      console.log('❌ User disconnected:', socket.id);
    });
  });
  
  return io;
};

exports.getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};