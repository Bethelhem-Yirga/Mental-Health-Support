import React, { useState, useEffect, useRef } from 'react';

function AnonymousChat({ socket }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    if (!socket) return;
    
    socket.on('chat history', (history) => {
      setMessages(history);
    });
    
    socket.on('chat message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });
    
    return () => {
      socket.off('chat history');
      socket.off('chat message');
    };
  }, [socket]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const sendMessage = (e) => {
    e.preventDefault();
    if (input.trim() && socket) {
      socket.emit('chat message', { text: input });
      setInput('');
    }
  };
  
  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Anonymous Support Chat</h2>
        <p>You are anonymous. Be kind and supportive.</p>
      </div>
      <div className="chat-messages">
        {messages.map(msg => (
          <div key={msg.id} className="chat-message">
            <strong>User_{msg.anonymousId}:</strong> {msg.text}
            <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          maxLength="500"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default AnonymousChat;