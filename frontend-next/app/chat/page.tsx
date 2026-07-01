'use client'

import { useState, useRef, useEffect } from 'react'
import { useUser } from '@/components/Providers'
import { useSocket } from '@/contexts/SocketContext'
import CommunityGuidelines from '@/components/CommunityGuidelines'
import { 
  Send, Smile, MoreVertical, Phone, Video, CheckCheck, Wifi, WifiOff, 
  Users, Shield, Heart, Image, Mic, Volume2, VolumeX, Sun, Moon,
  ArrowLeft, AlertCircle, Clock
} from 'lucide-react'
import Link from 'next/link'

export default function ChatPage() {
  const { userId } = useUser()
  const { socket, isConnected, messages, sendMessage } = useSocket()
  const [input, setInput] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rateLimitWarning, setRateLimitWarning] = useState<{ message: string; waitTime: number } | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  // Socket event listeners for rate limiting
  useEffect(() => {
    if (!socket) return

    const handleRateLimit = (data: { message: string; waitTime: number }) => {
      setRateLimitWarning(data)
      setTimeout(() => setRateLimitWarning(null), data.waitTime)
    }

    const handleError = (message: string) => {
      setError(message)
      setTimeout(() => setError(null), 3000)
    }

    socket.on('rate_limit', handleRateLimit)
    socket.on('error', handleError)

    return () => {
      socket.off('rate_limit', handleRateLimit)
      socket.off('error', handleError)
    }
  }, [socket])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleTyping = () => {
    if (!isTyping && isConnected) {
      setIsTyping(true)
      socket?.emit('typing', { isTyping: true })
    }
    clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
      socket?.emit('typing', { isTyping: false })
    }, 1000)
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && userId) {
      sendMessage(input, userId)
      setInput('')
      setShowEmojiPicker(false)
      setIsTyping(false)
    }
  }

  const addEmoji = (emoji: string) => {
    setInput(prev => prev + emoji)
    setShowEmojiPicker(false)
    inputRef.current?.focus()
  }

  const groupMessagesByDate = () => {
    const groups: { [key: string]: typeof messages } = {}
    messages.forEach(msg => {
      const date = new Date(msg.timestamp).toLocaleDateString()
      if (!groups[date]) groups[date] = []
      groups[date].push(msg)
    })
    return groups
  }

  const getDateLabel = (dateStr: string) => {
    const today = new Date().toLocaleDateString()
    const yesterday = new Date(Date.now() - 86400000).toLocaleDateString()
    if (dateStr === today) return 'Today'
    if (dateStr === yesterday) return 'Yesterday'
    return dateStr
  }

  const messageGroups = groupMessagesByDate()
  const emojis = ['😊', '😂', '❤️', '👍', '🎉', '😢', '🙏', '💪', '🤗', '😎', '🥺', '🔥', '✨', '🌟', '💎']

  const getAvatarGradient = (id: string) => {
    const gradients = ['from-pink-500 to-rose-500', 'from-blue-500 to-cyan-500', 'from-purple-500 to-indigo-500', 'from-orange-500 to-red-500', 'from-teal-500 to-emerald-500']
    const index = id?.charCodeAt(0) % gradients.length || 0
    return gradients[index]
  }

  return (
    <div data-cy="chat-page" className="h-[calc(100vh-12rem)] transition-all duration-300">
      <div className="flex h-full gap-4">
        
        {/* Back Button - Mobile */}
        <Link 
          href="/" 
          data-cy="back-home-btn"
          className="lg:hidden fixed top-24 left-4 z-20 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>

        {/* Sidebar */}
        <div data-cy="chat-sidebar" className="hidden lg:block w-96 overflow-y-auto rounded-2xl shadow-xl">
          <CommunityGuidelines />
        </div>

        {/* Main Chat Area */}
        <div data-cy="chat-container" className={`flex-1 flex flex-col rounded-2xl shadow-2xl overflow-hidden ${darkMode ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-sm`}>
          
          {/* Header */}
          <div data-cy="chat-header" className={`px-6 py-4 flex items-center justify-between border-b ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gradient-to-r from-green-500 to-emerald-600'}`}>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl backdrop-blur-sm">💬</div>
                <div data-cy="connection-status" className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
              </div>
              <div>
                <h2 data-cy="chat-title" className="font-bold text-white text-lg">Support Circle</h2>
                <div className="flex items-center gap-2 text-xs text-green-100">
                  {isConnected ? <><Wifi className="w-3 h-3" /><span data-cy="message-count">{messages.length} messages</span></> : <><WifiOff className="w-3 h-3" /><span>Reconnecting...</span></>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button data-cy="phone-btn" className="p-2 hover:bg-white/10 rounded-full transition text-white"><Phone className="w-5 h-5" /></button>
              <button data-cy="menu-btn" className="p-2 hover:bg-white/10 rounded-full transition text-white"><MoreVertical className="w-5 h-5" /></button>
            </div>
          </div>

          {/* Rate Limit Warning Banner */}
          {rateLimitWarning && (
            <div data-cy="rate-limit-warning" className="mx-4 mt-4 bg-yellow-100 dark:bg-yellow-900/30 border-l-4 border-yellow-500 text-yellow-800 dark:text-yellow-300 p-3 rounded-lg flex items-center gap-2 animate-slideDown">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{rateLimitWarning.message}</span>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div data-cy="error-banner" className="mx-4 mt-4 bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-800 dark:text-red-300 p-3 rounded-lg flex items-center gap-2 animate-slideDown">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Messages Area */}
          <div data-cy="messages-container" className={`flex-1 overflow-y-auto p-6 space-y-6 ${darkMode ? 'bg-gradient-to-b from-gray-900 to-gray-800' : 'bg-gradient-to-b from-gray-50 to-white'}`}>
            {Object.entries(messageGroups).length === 0 && (
              <div data-cy="empty-state" className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
                <p className="text-sm">Be the first to start a conversation!</p>
              </div>
            )}
            {Object.entries(messageGroups).map(([date, dateMessages]) => (
              <div key={date} data-cy="message-group" data-date={date}>
                <div className="flex justify-center mb-6">
                  <div className={`px-4 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${darkMode ? 'bg-gray-700/80 text-gray-300' : 'bg-white/80 text-gray-600 shadow-sm'}`}>
                    {getDateLabel(date)}
                  </div>
                </div>
                {dateMessages.map((msg, idx) => {
                  const isOwn = msg.anonymousId === userId
                  return (
                    <div 
                      key={msg.id || idx} 
                      data-cy={`message-${isOwn ? 'own' : 'other'}`}
                      className={`flex mb-4 ${isOwn ? 'justify-end' : 'justify-start'} animate-slideIn`}
                    >
                      {!isOwn && (
                        <div className="flex-shrink-0 mr-3">
                          <div data-cy="message-avatar" className={`w-10 h-10 bg-gradient-to-r ${getAvatarGradient(msg.anonymousId)} rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-lg`}>
                            {msg.anonymousId?.slice(-2).toUpperCase()}
                          </div>
                        </div>
                      )}
                      <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'}`}>
                        <div className={`flex items-center gap-2 mb-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                          <span data-cy="message-sender" className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            {isOwn ? 'You' : `User_${msg.anonymousId?.slice(-6)}`}
                          </span>
                          <span data-cy="message-time" className="text-xs text-gray-400">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div data-cy="message-bubble" className={`relative p-3 rounded-2xl shadow-lg transition-all hover:scale-[1.02] ${
                          isOwn
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-br-sm'
                            : `${darkMode ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-800'} rounded-bl-sm border`
                        }`}>
                          <p data-cy="message-text" className="text-sm leading-relaxed break-words">{msg.text}</p>
                          {isOwn && <div className="flex justify-end mt-1"><CheckCheck className="w-3 h-3 text-green-200" /></div>}
                        </div>
                      </div>
                      {isOwn && (
                        <div className="flex-shrink-0 ml-3">
                          <div data-cy="own-avatar" className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-lg">YOU</div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
            {isTyping && (
              <div data-cy="typing-indicator" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-gray-400 to-gray-500 rounded-xl animate-pulse" />
                <div className={`rounded-2xl px-4 py-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
                <span className="text-xs text-gray-400">someone is typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div data-cy="input-area" className={`p-4 border-t ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-white'}`}>
            <form onSubmit={handleSendMessage} className="flex items-end gap-2">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef as any}
                  data-cy="chat-input"
                  value={input}
                  onChange={(e) => { setInput(e.target.value); handleTyping() }}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e) } }}
                  placeholder="Type your message..."
                  rows={1}
                  className={`w-full px-4 py-3 pr-28 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none transition ${
                    darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'
                  }`}
                  style={{ maxHeight: '120px' }}
                  maxLength={500}
                />
                <div className="absolute right-2 bottom-2 flex items-center gap-1">
                  <button 
                    type="button" 
                    data-cy="emoji-picker-btn"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)} 
                    className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full transition"
                  >
                    <Smile className="w-5 h-5" />
                  </button>
                  <button 
                    type="button" 
                    data-cy="image-upload-btn"
                    className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full transition"
                  >
                    <Image className="w-5 h-5" />
                  </button>
                  <button 
                    type="button" 
                    data-cy="mic-btn"
                    className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full transition"
                  >
                    <Mic className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <button
                type="submit"
                data-cy="send-btn"
                disabled={!isConnected || !input.trim()}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-3 rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl group"
              >
                <Send className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              </button>
            </form>
            {showEmojiPicker && (
              <div data-cy="emoji-picker" className="absolute bottom-24 left-6 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-3 border animate-slideUp z-10">
                <div className="grid grid-cols-8 gap-2">
                  {emojis.map(emoji => (
                    <button 
                      key={emoji} 
                      data-cy={`emoji-${emoji}`}
                      onClick={() => addEmoji(emoji)} 
                      className="text-2xl hover:bg-gray-100 p-2 rounded-lg transition transform hover:scale-110"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Safety Notice */}
          <div data-cy="safety-notice" className={`px-6 py-2 text-center border-t ${darkMode ? 'border-gray-700 bg-gray-800/30' : 'border-amber-200 bg-amber-50'}`}>
            <div className="flex items-center justify-center gap-2 text-xs text-amber-700 dark:text-amber-400">
              <Shield className="w-3 h-3" />
              <span>Anonymous & Safe • Be Kind • Support Each Other</span>
              <Heart className="w-3 h-3 text-red-500 animate-pulse" />
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              ⚡ Rate limit: 1 message every 2 seconds
            </div>
          </div>
        </div>
      </div>
      
      {/* Settings Panel */}
      <div data-cy="settings-panel" className="hidden lg:block fixed bottom-6 right-6">
        <div className="bg-white dark:bg-gray-800 rounded-full shadow-lg p-2 flex gap-2">
          <button 
            data-cy="dark-mode-toggle"
            onClick={() => setDarkMode(!darkMode)} 
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button 
            data-cy="sound-toggle"
            onClick={() => setSoundEnabled(!soundEnabled)} 
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  )
}
