import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import { Providers } from '@/components/Providers'
import { ConnectionProvider } from '@/contexts/ConnectionContext'
import FloatingActionButton from '@/components/FloatingActionButton'
import PWAInstallPrompt from '@/components/PWAInstallPrompt'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MindSpace - Mental Health Support',
  description: 'Anonymous mental health support platform with chat, mood tracking, and assessment tools',
  keywords: 'mental health, therapy, anxiety, depression, wellness, support',
  authors: [{ name: 'MindSpace Team' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MindSpace',
  },
  formatDetection: {
    telephone: false,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: true,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MindSpace" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#4CAF50" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
      </head>
      <body className={inter.className}>
        <ConnectionProvider>
          <Providers>
            <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-50">
              <Navbar />
              <main className="flex-1 pt-8 pb-12">
                <div className="container mx-auto px-4 max-w-7xl">
                  {children}
                </div>
              </main>
              <FloatingActionButton />
              <PWAInstallPrompt />
              <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-8 mt-auto">
                <div className="container mx-auto px-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl">💚</span>
                        <span className="font-bold">MindSpace</span>
                      </div>
                      <p className="text-sm text-gray-400">
                        Supporting mental wellness through anonymous community support.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Quick Links</h4>
                      <ul className="space-y-2 text-sm text-gray-400">
                        <li><a href="/" className="hover:text-green-400 transition">Home</a></li>
                        <li><a href="/chat" className="hover:text-green-400 transition">Chat</a></li>
                        <li><a href="/guidelines" className="hover:text-green-400 transition">Guidelines</a></li>
                        <li><a href="/therapists" className="hover:text-green-400 transition">Therapists</a></li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Resources</h4>
                      <ul className="space-y-2 text-sm text-gray-400">
                        <li><a href="/assessment" className="hover:text-green-400 transition">Assessment</a></li>
                        <li><a href="/journal" className="hover:text-green-400 transition">Mood Journal</a></li>
                        <li><a href="/mindfulness" className="hover:text-green-400 transition">Mindfulness</a></li>
                        <li><a href="/resources" className="hover:text-green-400 transition">Library</a></li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Emergency</h4>
                      <div className="space-y-2">
                        <a href="tel:988" className="block bg-red-600 hover:bg-red-700 text-white text-center py-2 rounded-lg transition text-sm font-medium">
                          📞 Call 988
                        </a>
                        <a href="/crisis" className="block border border-gray-600 hover:border-red-500 text-gray-300 hover:text-red-400 text-center py-2 rounded-lg transition text-sm">
                          More Resources →
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
                    <p>&copy; 2024 MindSpace. Your mental health matters. 💚</p>
                    <p className="mt-1">Anonymous • Safe • Supportive</p>
                  </div>
                </div>
              </footer>
            </div>
          </Providers>
        </ConnectionProvider>
      </body>
    </html>
  )
}
import { RegisterServiceWorker } from './register-sw'

// Add inside the body tag, before the main content
<RegisterServiceWorker />
