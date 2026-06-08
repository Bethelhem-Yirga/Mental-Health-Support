'use client'

import { useState, useEffect } from 'react'
import { Download, X } from 'lucide-react'

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent
  }
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function PWAInstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // Listen for install prompt event
    const handler = (e: BeforeInstallPromptEvent) => {
      e.preventDefault()
      setInstallPrompt(e)
      setIsVisible(true)
    }

    window.addEventListener('beforeinstallprompt', handler as EventListener)

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true)
      setIsVisible(false)
    })

    return () => {
      window.removeEventListener('beforeinstallprompt', handler as EventListener)
    }
  }, [])

  const handleInstall = async () => {
    if (!installPrompt) return

    // Show install prompt
    await installPrompt.prompt()
    const result = await installPrompt.userChoice

    if (result.outcome === 'accepted') {
      setIsInstalled(true)
    }
    setIsVisible(false)
    setInstallPrompt(null)
  }

  if (isInstalled || !isVisible) return null

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:bottom-6 md:max-w-sm z-50 animate-slideUp">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <Download className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-800 dark:text-white">Install MindSpace App</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Install our app for quick access, offline journaling, and daily reminders.
            </p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleInstall}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition"
              >
                Install
              </button>
              <button
                onClick={() => setIsVisible(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 px-4 py-1.5 rounded-lg text-sm transition"
              >
                Dismiss
              </button>
            </div>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  )
}
