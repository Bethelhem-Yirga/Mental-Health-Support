'use client'

import { useSocket } from '@/contexts/SocketContext'
import { Wifi, WifiOff } from 'lucide-react'

export default function ConnectionStatus() {
  const { isConnected } = useSocket()

  if (isConnected) {
    return (
      <div className="flex items-center gap-2 text-green-300 text-sm">
        <Wifi className="w-4 h-4" />
        <span>Connected</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 text-red-300 text-sm">
      <WifiOff className="w-4 h-4" />
      <span>Disconnected</span>
    </div>
  )
}
