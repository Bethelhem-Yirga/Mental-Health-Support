'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, Heart, Users, MessageCircle, Shield } from 'lucide-react'
import Link from 'next/link'

export default function HeroSection() {
  const [currentQuote, setCurrentQuote] = useState(0)
  
  const quotes = [
    { text: "You are not alone in your journey.", author: "MindSpace Community" },
    { text: "Every step forward is a victory.", author: "Anonymous" },
    { text: "Your feelings are valid.", author: "Mental Health Advocate" },
    { text: "Reaching out is a sign of strength.", author: "Supportive Voice" },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const stats = [
    { icon: Users, value: "10K+", label: "Community Members", color: "text-blue-500" },
    { icon: MessageCircle, value: "50K+", label: "Messages Sent", color: "text-green-500" },
    { icon: Heart, value: "100%", label: "Anonymous Support", color: "text-pink-500" },
    { icon: Shield, value: "24/7", label: "Safe Space", color: "text-purple-500" },
  ]

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-3xl mb-12">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl animate-float" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl animate-float-delayed" />
      </div>
      
      <div className="relative z-10 px-6 py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Animated Quote */}
          <div className="mb-8 animate-fadeIn">
            <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-4 py-2 rounded-full text-sm mb-6">
              <Heart className="w-4 h-4 animate-pulse" />
              <span>Anonymous & Free Support</span>
            </div>
            <p className="text-2xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4 leading-tight">
              {quotes[currentQuote].text}
            </p>
            <p className="text-gray-500 dark:text-gray-400">— {quotes[currentQuote].author}</p>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/" className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-medium hover:shadow-xl transition-all inline-flex items-center gap-2 group">
              Start Chatting
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </Link>
            <Link href="/assessment" className="border-2 border-green-500 text-green-600 dark:text-green-400 px-8 py-3 rounded-xl font-medium hover:bg-green-50 dark:hover:bg-green-900/20 transition-all inline-flex items-center gap-2">
              Take Assessment
            </Link>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => {
              const Icon = stat.icon
              return (
                <div key={idx} className="text-center group">
                  <div className="w-12 h-12 mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="text-2xl font-bold text-gray-800 dark:text-white">{stat.value}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
