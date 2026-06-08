'use client'

import { useState } from 'react'
import { MessageCircle, Heart, Shield, X } from 'lucide-react'
import Link from 'next/link'

export default function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="absolute bottom-16 right-0 mb-2 space-y-2 animate-slideUp">
          <Link href="/crisis" className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full shadow-lg transition-all text-sm">
            <Shield className="w-4 h-4" />
            Crisis Help
          </Link>
          <Link href="/guidelines" className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-full shadow-lg transition-all text-sm">
            <Heart className="w-4 h-4" />
            Guidelines
          </Link>
          <Link href="/" className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full shadow-lg transition-all text-sm">
            <MessageCircle className="w-4 h-4" />
            Chat Now
          </Link>
        </div>
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
          isOpen 
            ? 'bg-gray-700 rotate-90' 
            : 'bg-gradient-to-r from-green-500 to-emerald-600 animate-pulse-slow'
        } hover:scale-110`}
      >
        {isOpen ? <X className="w-6 h-6 text-white" /> : <MessageCircle className="w-6 h-6 text-white" />}
      </button>
    </div>
  )
}
