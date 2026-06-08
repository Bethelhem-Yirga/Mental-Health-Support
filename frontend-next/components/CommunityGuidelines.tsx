'use client'

import { useState } from 'react'
import { 
  Heart, 
  Shield, 
  Eye, 
  Scale, 
  LifeBuoy, 
  Sparkles,
  CheckCircle,
  AlertCircle,
  Star,
  Users,
  Lock,
  Smile,
  MessageCircle,
  Award,
  Globe,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

interface Guideline {
  id: number
  title: string
  description: string
  icon: any
  color: string
  tips: string[]
}

const guidelines: Guideline[] = [
  {
    id: 1,
    title: "Be Respectful",
    description: "Treat everyone with kindness and compassion. Every person here is on their own unique journey.",
    icon: Heart,
    color: "from-pink-500 to-rose-500",
    tips: [
      "Use 'I' statements instead of 'You' statements",
      "Avoid judgmental language",
      "Celebrate others' progress",
      "Offer support, not solutions"
    ]
  },
  {
    id: 2,
    title: "Stay Anonymous",
    description: "Protect your privacy and others'. Don't share personal information like names, locations, or contacts.",
    icon: Lock,
    color: "from-blue-500 to-cyan-500",
    tips: [
      "Never share your real name",
      "Don't ask for personal details",
      "Avoid sharing location information",
      "Keep conversations in the chat"
    ]
  },
  {
    id: 3,
    title: "No Judgment",
    description: "Everyone's mental health journey is different. What works for one may not work for another.",
    icon: Scale,
    color: "from-purple-500 to-indigo-500",
    tips: [
      "Listen without judging",
      "Validate others' feelings",
      "Respect different coping mechanisms",
      "Avoid comparing struggles"
    ]
  },
  {
    id: 4,
    title: "Seek Help",
    description: "If you're in crisis, reach out to professional resources. We're here to support, not replace professional help.",
    icon: LifeBuoy,
    color: "from-red-500 to-orange-500",
    tips: [
      "Call 988 for crisis support",
      "Text HOME to 741741",
      "Contact a therapist",
      "Share crisis resources with others"
    ]
  }
]

export default function CommunityGuidelines() {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-xl overflow-hidden">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 px-5 py-4 text-white">
        <div className="flex items-center gap-2 mb-1">
          <Shield className="w-5 h-5" />
          <span className="text-xs font-semibold uppercase tracking-wider">Community Guidelines</span>
        </div>
        <h2 className="text-xl font-bold">Supportive & Anonymous</h2>
        <p className="text-green-100 text-sm mt-1">A safe space for everyone</p>
      </div>

      {/* Guidelines List */}
      <div className="p-4 space-y-3">
        {guidelines.map((guideline) => {
          const Icon = guideline.icon
          const isExpanded = expandedId === guideline.id
          
          return (
            <div
              key={guideline.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700"
            >
              {/* Card Header - Always Visible */}
              <div 
                className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : guideline.id)}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 bg-gradient-to-br ${guideline.color} rounded-xl flex items-center justify-center shadow-md flex-shrink-0`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-gray-800 dark:text-white text-base">
                        {guideline.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">#{guideline.id}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                      {guideline.description}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Expandable Tips Section */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-0 border-t border-gray-100 dark:border-gray-700 mt-2">
                  <div className="pl-13 ml-10">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Tips for following this guideline:
                    </p>
                    <ul className="space-y-1.5">
                      {guideline.tips.map((tip, idx) => (
                        <li key={idx} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-2">
                          <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="leading-relaxed">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer Stats */}
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Users className="w-3 h-3 text-green-500" />
            <span className="text-gray-600 dark:text-gray-400">Safe Community</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="w-3 h-3 text-red-500" />
            <span className="text-gray-600 dark:text-gray-400">Supportive Environment</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-3 h-3 text-blue-500" />
            <span className="text-gray-600 dark:text-gray-400">24/7 Monitoring</span>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="m-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <p className="text-xs text-red-800 dark:text-red-300">
            <span className="font-medium">In crisis?</span> Call 988 for immediate help.
          </p>
          <a href="tel:988" className="ml-auto text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-lg transition">
            Call Now
          </a>
        </div>
      </div>
    </div>
  )
}
