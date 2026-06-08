'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface ConnectionContextType {
  isConnected: boolean
  isChecking: boolean
  checkConnection: () => Promise<void>
}

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined)

export function useConnection() {
  const context = useContext(ConnectionContext)
  if (!context) {
    throw new Error('useConnection must be used within a ConnectionProvider')
  }
  return context
}

export function ConnectionProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  const checkConnection = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/health')
      setIsConnected(response.ok)
    } catch (error) {
      setIsConnected(false)
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    checkConnection()
    
    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000)
    
    // Check connection when page becomes visible again
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkConnection()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return (
    <ConnectionContext.Provider value={{ isConnected, isChecking, checkConnection }}>
      {children}
    </ConnectionContext.Provider>
  )
}
