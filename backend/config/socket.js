const { Server } = require('socket.io');
const Message = require('../models/Message');
const mongoose = require('mongoose');

// Rate limiting storage
const messageLimiter = new Map(); // Store timestamps per user
const TYPING_LIMITER = new Map(); // Store typing cooldowns

let io;

// Clean up old rate limit entries every hour
setInterval(() => {
  const now = Date.now();
  for (const [userId, timestamp] of messageLimiter.entries()) {
    if (now - timestamp > 60000) { // Remove entries older than 1 minute
      messageLimiter.delete(userId);
    }
  }
  for (const [userId, timestamp] of TYPING_LIMITER.entries()) {
    if (now - timestamp > 5000) { // Remove typing entries after 5 seconds
      TYPING_LIMITER.delete(userId);
    }
  }
}, 60000);

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
    
    // Load messages from Atlas
    if (mongoose.connection.readyState === 1) {
      try {
        const recentMessages = await Message.find()
          .sort({ timestamp: -1 })
          .limit(50)
          .lean();
        socket.emit('chat history', recentMessages.reverse());
        console.log(`📨 Sent ${recentMessages.length} messages to user`);
      } catch (error) {
        console.error('Error loading chat history:', error.message);
        socket.emit('chat history', []);
      }
    } else {
      console.log('⚠️ Database not ready yet');
      socket.emit('chat history', []);
    }
    
    // ========== RATE LIMITED CHAT MESSAGE ==========
    socket.on('chat message', async (data) => {
      const now = Date.now();
      const userId = socket.id;
      const lastMessageTime = messageLimiter.get(userId) || 0;
      
      // Rate limit: 5 messages per 10 seconds
      if (now - lastMessageTime < 2000) { // Minimum 2 seconds between messages
        socket.emit('rate_limit', {
          message: 'Please slow down. You can send a message every 2 seconds.',
          waitTime: 2000 - (now - lastMessageTime)
        });
        return;
      }
      
      // Validate message length
      if (!data.text || data.text.trim().length === 0) {
        socket.emit('error', 'Message cannot be empty');
        return;
      }
      
      if (data.text.length > 500) {
        socket.emit('error', 'Message cannot exceed 500 characters');
        return;
      }
      
      // Update rate limiter
      messageLimiter.set(userId, now);
      
      try {
        let savedMessage = null;
        
        if (mongoose.connection.readyState === 1) {
          const message = new Message({
            anonymousId: socket.id.slice(-6),
            text: data.text.trim(),
            room: 'general'
          });
          savedMessage = await message.save();
          console.log(`💾 Message saved to Atlas: ${data.text.substring(0, 30)}`);
        }
        
        const messageToSend = {
          id: savedMessage?._id || Date.now(),
          text: data.text.trim(),
          timestamp: new Date().toISOString(),
          anonymousId: socket.id.slice(-6)
        };
        
        io.emit('chat message', messageToSend);
      } catch (error) {
        console.error('Error saving message:', error.message);
        // Still broadcast even if DB fails
        io.emit('chat message', {
          id: Date.now(),
          text: data.text.trim(),
          timestamp: new Date().toISOString(),
          anonymousId: socket.id.slice(-6)
        });
      }
    });
    
    // ========== RATE LIMITED TYPING INDICATOR ==========
    socket.on('typing', (data) => {
      const userId = socket.id;
      const now = Date.now();
      const lastTyping = TYPING_LIMITER.get(userId) || 0;
      
      // Rate limit typing events to 1 per 3 seconds
      if (now - lastTyping < 3000) {
        return;
      }
      
      TYPING_LIMITER.set(userId, now);
      socket.broadcast.emit('user_typing', {
        userId: socket.id.slice(-6),
        isTyping: data.isTyping
      });
    });
    
    socket.on('disconnect', () => {
      console.log('❌ User disconnected:', socket.id);
      // Clean up rate limit entries on disconnect
      messageLimiter.delete(socket.id);
      TYPING_LIMITER.delete(socket.id);
    });
  });
  
  return io;
};

exports.getIO = () => {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
};