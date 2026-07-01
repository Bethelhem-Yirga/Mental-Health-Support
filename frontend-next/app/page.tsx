'use client'

import Link from 'next/link'
import { ArrowRight, Heart, Users, MessageCircle, Shield, Calendar, BookOpen, Activity, Smile, Star, TrendingUp, Award } from 'lucide-react'

export default function Homepage() {
  const features = [
    {
      icon: MessageCircle,
      title: "Anonymous Chat",
      description: "Connect with others in a safe, anonymous environment. Share, listen, and support without revealing your identity.",
      color: "from-green-500 to-emerald-500",
      link: "/chat"
    },
    {
      icon: Smile,
      title: "Mood Journal",
      description: "Track your daily emotions with our interactive journal. Visualize your mood patterns over time.",
      color: "from-blue-500 to-cyan-500",
      link: "/journal"
    },
    {
      icon: Activity,
      title: "Self-Assessment",
      description: "Take clinically-validated PHQ-9 depression screening and track your mental health progress.",
      color: "from-purple-500 to-indigo-500",
      link: "/assessment"
    },
    {
      icon: BookOpen,
      title: "Resource Library",
      description: "Access articles, videos, and guides about mental health, coping strategies, and wellness.",
      color: "from-orange-500 to-red-500",
      link: "/resources"
    },
    {
      icon: Users,
      title: "Therapist Directory",
      description: "Find licensed mental health professionals matched to your needs and preferences.",
      color: "from-pink-500 to-rose-500",
      link: "/therapists"
    },
    {
      icon: Heart,
      title: "Mindfulness Tools",
      description: "Guided breathing exercises, meditation timers, and grounding techniques for anxiety relief.",
      color: "from-teal-500 to-emerald-500",
      link: "/mindfulness"
    }
  ]

  const stats = [
    { value: "10,000+", label: "Active Users", icon: Users },
    { value: "50,000+", label: "Messages Sent", icon: MessageCircle },
    { value: "95%", label: "Would Recommend", icon: Star },
    { value: "24/7", label: "Support Available", icon: Shield }
  ]

  const testimonials = [
    {
      text: "This platform helped me through one of the darkest times in my life. The anonymous chat made it easy to open up.",
      author: "Anonymous User",
      role: "Community Member"
    },
    {
      text: "The mood journal and assessment tools helped me understand my patterns and seek professional help.",
      author: "Sarah M.",
      role: "Regular User"
    },
    {
      text: "Finally, a safe space where I can talk about my struggles without judgment. The crisis resources are a lifesaver.",
      author: "Michael T.",
      role: "Community Supporter"
    }
  ]

  return (
    <div className="space-y-12">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-3xl">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl animate-float" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl animate-float-delayed" />
        </div>
        
        <div className="relative z-10 px-6 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-4 py-2 rounded-full text-sm mb-6">
              <Heart className="w-4 h-4 animate-pulse" />
              <span>Free & Anonymous Support</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 dark:text-white mb-6">
              Your Mental Health
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-500"> Matters</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              A safe, anonymous space to talk, track your mood, and find resources. You're not alone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/chat" className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-medium hover:shadow-xl transition-all inline-flex items-center gap-2 group">
                Start Anonymous Chat
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </Link>
              <Link href="/assessment" className="border-2 border-green-500 text-green-600 dark:text-green-400 px-8 py-3 rounded-xl font-medium hover:bg-green-50 dark:hover:bg-green-900/20 transition-all inline-flex items-center gap-2">
                Take Self-Assessment
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all group">
              <div className="w-12 h-12 mx-auto bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">{stat.value}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
            </div>
          )
        })}
      </div>

      {/* Features Grid */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Everything You Need</h2>
        <p className="text-gray-600 dark:text-gray-300">Comprehensive tools to support your mental wellness journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, idx) => {
          const Icon = feature.icon
          return (
            <Link href={feature.link} key={idx} className="group">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 h-full">
                <div className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                <div className="mt-4 flex items-center gap-2 text-green-600 dark:text-green-400 group-hover:gap-3 transition-all">
                  <span className="text-sm font-medium">Learn more</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Testimonials */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 md:p-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Loved by Our Community</h2>
          <p className="text-gray-600 dark:text-gray-300">Real stories from real people</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic mb-4">"{testimonial.text}"</p>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                <p className="font-semibold text-gray-800 dark:text-white">{testimonial.author}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-3xl p-8 md:p-12 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to Start Your Journey?</h2>
        <p className="text-green-100 mb-6 max-w-2xl mx-auto">
          Join thousands of others who have found support and community on MindSpace.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/chat" className="bg-white text-green-600 px-8 py-3 rounded-xl font-medium hover:shadow-xl transition-all inline-flex items-center gap-2 group">
            Start Chatting Now
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>
          <Link href="/guidelines" className="border-2 border-white text-white px-8 py-3 rounded-xl font-medium hover:bg-white/10 transition-all">
            Read Guidelines
          </Link>
        </div>
      </div>

      {/* Crisis Banner */}
      <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-4 border border-red-200 dark:border-red-800">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-red-800 dark:text-red-300">In Crisis? Immediate Help Available</p>
              <p className="text-sm text-red-700 dark:text-red-400">24/7 confidential support</p>
            </div>
          </div>
          <div className="flex gap-3">
            <a href="tel:988" className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition text-sm font-medium">
              Call 8335
            </a>
            <a href="/crisis" className="border border-red-500 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg hover:bg-red-50 transition text-sm font-medium">
              More Resources
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
