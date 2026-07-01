'use client'

import CommunityGuidelines from '@/components/CommunityGuidelines'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function GuidelinesPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition">
        <ArrowLeft className="w-4 h-4" />
        Back to Chat
      </Link>
      
      <CommunityGuidelines />
      
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Thank you for being part of our community. 💚</p>
        <p className="mt-2">Together, we can make mental health support accessible to everyone.</p>
      </div>
    </div>
  )
}
