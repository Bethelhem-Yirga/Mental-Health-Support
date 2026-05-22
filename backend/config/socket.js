const { Server } = require('socket.io');
const Message = require('../models/Message');

let io;

exports.initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', async (socket) => {
    console.log('✅ User connected:', socket.id);
    
    // Send last 50 messages from database
    try {
      const recentMessages = await Message.getRecent('general', 50);
      socket.emit('chat history', recentMessages);
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
    
    socket.on('chat message', async (data) => {
      try {
        const message = new Message({
          anonymousId: socket.id.slice(-6),
          text: data.text,
          room: 'general'
        });
        
        await message.save();
        
        const messageToSend = {
          id: message._id,
          text: message.text,
          timestamp: message.timestamp,
          anonymousId: message.anonymousId
        };
        
        io.emit('chat message', messageToSend);
      } catch (error) {
        console.error('Error saving message:', error);
        socket.emit('error', 'Failed to send message');
      }
    });
    
    socket.on('disconnect', () => {
      console.log('❌ User disconnected:', socket.id);
    });
  });
  
  return io;
};

exports.getIO = () => {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
};