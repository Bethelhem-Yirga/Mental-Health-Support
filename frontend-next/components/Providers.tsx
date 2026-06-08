'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { SocketProvider } from '@/contexts/SocketContext'

interface UserContextType {
  userId: string | null
  setUserId: (id: string) => void
}

const UserContext = createContext<UserContextType>({
  userId: null,
  setUserId: () => {},
})

export const useUser = () => useContext(UserContext)

export function Providers({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const initUser = async () => {
      try {
        let storedUserId = localStorage.getItem('userId')
        
        if (!storedUserId) {
          const response = await fetch('http://localhost:5000/api/users/create', {
            method: 'POST',
          })
          const data = await response.json()
          storedUserId = data.data.userId
          localStorage.setItem('userId', storedUserId)
        }
        
        setUserId(storedUserId)
      } catch (error) {
        console.error('Error initializing user:', error)
      }
    }
    
    initUser()
  }, [])

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      <SocketProvider userId={userId}>
        {children}
      </SocketProvider>
    </UserContext.Provider>
  )
}
