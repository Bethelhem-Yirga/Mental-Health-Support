import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import { Providers } from '@/components/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MindSpace - Mental Health Support',
  description: 'Anonymous mental health support platform with chat, mood tracking, and assessment tools',
  keywords: 'mental health, therapy, anxiety, depression, wellness, support',
  authors: [{ name: 'MindSpace Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
              {children}
            </main>
            <footer className="bg-gray-800 text-white py-6 mt-auto">
              <div className="container mx-auto px-4 text-center">
                <p>&copy; 2024 MindSpace. Your mental health matters. 💚</p>
                <p className="text-sm text-gray-400 mt-2">
                  If you're in crisis, call 988 Suicide & Crisis Lifeline
                </p>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  )
}
