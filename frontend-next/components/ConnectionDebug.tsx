'use client'

import { useConnection } from '../contexts/ConnectionContext'
import { useState } from 'react'

export default function ConnectionDebug() {
  const { isConnected, isChecking, checkConnection } = useConnection()
  const [showDebug, setShowDebug] = useState(false)

  // Only show in development mode
  if (process.env.NODE_ENV !== 'development') return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setShowDebug(!showDebug)}
        className="bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-50 hover:opacity-100"
      >
        Debug
      </button>
      
      {showDebug && (
        <div className="absolute bottom-8 right-0 bg-gray-900 text-white text-xs p-3 rounded-lg shadow-lg w-64">
          <div className="mb-2 font-bold">Connection Debug Info</div>
          <div className="space-y-1">
            <div>Status: {isChecking ? 'Checking...' : (isConnected ? '✅ Connected' : '❌ Disconnected')}</div>
            <div>Backend URL: http://localhost:5000</div>
            <button
              onClick={checkConnection}
              className="mt-2 bg-blue-600 px-2 py-1 rounded text-xs w-full"
            >
              Force Reconnect
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
