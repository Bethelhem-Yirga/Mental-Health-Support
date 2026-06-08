'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import ConnectionStatus from './ConnectionStatus'

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Chat', href: '/chat' },
  { name: 'Guidelines', href: '/guidelines' },
  { name: 'Therapists', href: '/therapists' },
  { name: 'Assessment', href: '/assessment' },
  { name: 'Mood Journal', href: '/journal' },
  { name: 'Mindfulness', href: '/mindfulness' },
  { name: 'Resources', href: '/resources' },
  { name: 'Crisis Help', href: '/crisis' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2 text-xl font-bold group">
            <span className="text-2xl group-hover:scale-110 transition-transform">💚</span>
            <span>MindSpace</span>
          </Link>

          <div className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors hover:text-green-200 ${
                  pathname === item.href ? 'text-green-200 border-b-2 border-green-200' : ''
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <ConnectionStatus />
            </div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-green-700 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 border-t border-green-500">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`block py-2 px-4 rounded-lg transition-colors hover:bg-green-700 ${
                  pathname === item.href ? 'bg-green-700' : ''
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="mt-4 pt-4 border-t border-green-500 px-4">
              <ConnectionStatus />
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
