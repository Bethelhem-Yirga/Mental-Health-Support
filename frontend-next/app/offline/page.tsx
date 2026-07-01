'use client'

import Link from 'next/link'
import { WifiOff, Heart, ArrowLeft } from 'lucide-react'

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <WifiOff className="w-10 h-10 text-gray-400" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-2">You're Offline</h1>
          <p className="text-gray-600 mb-6">
            Don't worry! You can still access your mood journal and previous entries.
            Your new entries will sync when you're back online.
          </p>
          
          <div className="space-y-3">
            <Link
              href="/journal"
              className="block w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl transition"
            >
              📔 Go to Mood Journal
            </Link>
            
            <Link
              href="/"
              className="block w-full border border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Try to reconnect
            </Link>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Heart className="w-4 h-4 text-red-500" />
              <span>Your privacy is protected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
