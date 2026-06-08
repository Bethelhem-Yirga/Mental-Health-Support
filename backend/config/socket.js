const { Server } = require('socket.io');
const Message = require('../models/Message');
const mongoose = require('mongoose');

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
    
    socket.on('chat message', async (data) => {
      try {
        let savedMessage = null;
        
        if (mongoose.connection.readyState === 1) {
          const message = new Message({
            anonymousId: socket.id.slice(-6),
            text: data.text,
            room: 'general'
          });
          savedMessage = await message.save();
          console.log(`💾 Message saved to Atlas: ${data.text.substring(0, 30)}`);
        }
        
        const messageToSend = {
          id: savedMessage?._id || Date.now(),
          text: data.text,
          timestamp: new Date().toISOString(),
          anonymousId: socket.id.slice(-6)
        };
        
        io.emit('chat message', messageToSend);
      } catch (error) {
        console.error('Error saving message:', error.message);
        // Still broadcast even if DB fails
        io.emit('chat message', {
          id: Date.now(),
          text: data.text,
          timestamp: new Date().toISOString(),
          anonymousId: socket.id.slice(-6)
        });
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