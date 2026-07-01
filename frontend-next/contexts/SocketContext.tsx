'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { io, Socket } from 'socket.io-client'

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
  messages: any[]
  sendMessage: (text: string, userId: string) => void
}

const SocketContext = createContext<SocketContextType | undefined>(undefined)

export function useSocket() {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}

export function SocketProvider({ children, userId }: { children: ReactNode; userId: string | null }) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [messages, setMessages] = useState<any[]>([])

  useEffect(() => {
    if (!userId) return

    // Create socket connection
    const newSocket = io('http://localhost:5000', {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    })

    newSocket.on('connect', () => {
      console.log('✅ Socket connected:', newSocket.id)
      setIsConnected(true)
    })

    newSocket.on('disconnect', () => {
      console.log('❌ Socket disconnected')
      setIsConnected(false)
    })

    newSocket.on('chat history', (history) => {
      console.log('📜 Received chat history:', history.length)
      setMessages(history)
    })

    newSocket.on('chat message', (msg) => {
      console.log('💬 New message:', msg)
      setMessages((prev) => [...prev, msg])
    })

    // Rate limit handlers
    newSocket.on('rate_limit', (data) => {
      console.log('⏱️ Rate limit:', data)
      // You can emit this to components if needed
    })

    newSocket.on('error', (error) => {
      console.error('Socket error:', error)
    })

    setSocket(newSocket)

    // Cleanup on unmount
    return () => {
      newSocket.disconnect()
    }
  }, [userId])

  const sendMessage = (text: string, userId: string) => {
    if (socket && isConnected && text.trim()) {
      socket.emit('chat message', { text, userId })
    }
  }

  return (
    <SocketContext.Provider value={{ socket, isConnected, messages, sendMessage }}>
      {children}
    </SocketContext.Provider>
  )
}
