'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Clock, 
  Video, 
  Calendar,
  ChevronRight,
  Phone,
  Mail,
  Bookmark,
  Share2,
  X,
  CheckCircle,
  Award,
  Users,
  MessageCircle
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface Therapist {
  id: number
  name: string
  specialty: string
  subSpecialties: string[]
  rating: number
  reviewCount: number
  available: boolean
  experience: string
  location: string
  onlineOnly?: boolean
  price: number
  languages: string[]
  education: string[]
  about: string
  imageUrl: string
}

const therapists: Therapist[] = [
  {
    id: 1,
    name: "Dr. Sarah Chen",
    specialty: "Anxiety & Depression",
    subSpecialties: ["Social Anxiety", "Panic Disorders", "Major Depression"],
    rating: 4.9,
    reviewCount: 128,
    available: true,
    experience: "12 years",
    location: "Online",
    onlineOnly: true,
    price: 120,
    languages: ["English", "Mandarin"],
    education: ["PhD in Clinical Psychology - Stanford University", "BA in Psychology - UC Berkeley"],
    about: "Dr. Chen specializes in helping adults overcome anxiety and depression using evidence-based approaches like CBT and mindfulness. She believes in creating a warm, non-judgmental space where clients feel safe to explore their thoughts and feelings.",
    imageUrl: "/therapists/sarah-chen.jpg"
  },
  {
    id: 2,
    name: "Michael Okonkwo",
    specialty: "Trauma & PTSD",
    subSpecialties: ["Childhood Trauma", "Complex PTSD", "EMDR Therapy"],
    rating: 4.8,
    reviewCount: 94,
    available: false,
    experience: "8 years",
    location: "New York",
    onlineOnly: false,
    price: 150,
    languages: ["English"],
    education: ["MSW - Columbia University", "EMDR Certified"],
    about: "Michael is a trauma-informed therapist with specialized training in EMDR. He works with individuals who have experienced various forms of trauma and helps them build resilience and find healing.",
    imageUrl: "/therapists/michael-okonkwo.jpg"
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    specialty: "Teen Counseling",
    subSpecialties: ["Adolescent Anxiety", "School Stress", "Identity Issues"],
    rating: 4.9,
    reviewCount: 156,
    available: true,
    experience: "10 years",
    location: "California",
    onlineOnly: false,
    price: 130,
    languages: ["English", "Spanish"],
    education: ["PsyD in Child Psychology - UCLA", "MA in Counseling - USC"],
    about: "Dr. Rodriguez has dedicated her career to supporting teenagers through the challenges of adolescence. She uses a combination of talk therapy, art therapy, and family systems approaches.",
    imageUrl: "/therapists/emily-rodriguez.jpg"
  },
  {
    id: 4,
    name: "Dr. James Wilson",
    specialty: "Addiction & Recovery",
    subSpecialties: ["Substance Abuse", "Behavioral Addictions", "Relapse Prevention"],
    rating: 4.7,
    reviewCount: 203,
    available: true,
    experience: "15 years",
    location: "Online",
    onlineOnly: true,
    price: 140,
    languages: ["English"],
    education: ["MD - Johns Hopkins", "Addiction Medicine Fellowship - Yale"],
    about: "Dr. Wilson is a board-certified addiction specialist who takes a compassionate, non-judgmental approach to recovery. He believes in treating the whole person, not just the addiction.",
    imageUrl: "/therapists/james-wilson.jpg"
  },
  {
    id: 5,
    name: "Lisa Thompson, LCSW",
    specialty: "Relationship Counseling",
    subSpecialties: ["Couples Therapy", "Family Conflict", "Communication Skills"],
    rating: 4.9,
    reviewCount: 187,
    available: true,
    experience: "11 years",
    location: "Chicago",
    onlineOnly: false,
    price: 125,
    languages: ["English"],
    education: ["MSW - University of Chicago", "Gottman Method Level 3"],
    about: "Lisa helps couples and families improve communication, resolve conflicts, and build stronger relationships. She's trained in the Gottman Method and Emotionally Focused Therapy.",
    imageUrl: "/therapists/lisa-thompson.jpg"
  },
  {
    id: 6,
    name: "Dr. Marcus Lee",
    specialty: "BIPOC Mental Health",
    subSpecialties: ["Cultural Identity", "Racial Trauma", "Immigration Stress"],
    rating: 5.0,
    reviewCount: 89,
    available: true,
    experience: "7 years",
    location: "Online",
    onlineOnly: true,
    price: 135,
    languages: ["English", "Korean"],
    education: ["PhD in Counseling Psychology - University of Texas", "MA in Ethnic Studies"],
    about: "Dr. Lee specializes in supporting BIPOC individuals navigating cultural identity, racial trauma, and systemic stressors. He offers a culturally-affirming space for healing.",
    imageUrl: "/therapists/marcus-lee.jpg"
  }
]

const specialties = [
  "All Specialties",
  "Anxiety & Depression",
  "Trauma & PTSD",
  "Teen Counseling",
  "Addiction & Recovery",
  "Relationship Counseling",
  "BIPOC Mental Health"
]

const sortOptions = [
  { value: "rating", label: "Highest Rated" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "experience", label: "Most Experienced" }
]

export default function TherapistsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties")
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [showOnlineOnly, setShowOnlineOnly] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 200])
  const [sortBy, setSortBy] = useState("rating")
  const [savedTherapists, setSavedTherapists] = useState<number[]>([])

  // Filter and sort therapists
  const filteredTherapists = therapists
    .filter(therapist => {
      // Search filter
      const matchesSearch = therapist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        therapist.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        therapist.subSpecialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
      
      // Specialty filter
      const matchesSpecialty = selectedSpecialty === "All Specialties" || 
        therapist.specialty === selectedSpecialty
      
      // Online only filter
      const matchesOnline = !showOnlineOnly || therapist.onlineOnly
      
      // Price filter
      const matchesPrice = therapist.price >= priceRange[0] && therapist.price <= priceRange[1]
      
      return matchesSearch && matchesSpecialty && matchesOnline && matchesPrice
    })
    .sort((a, b) => {
      switch(sortBy) {
        case "rating":
          return b.rating - a.rating
        case "price_asc":
          return a.price - b.price
        case "price_desc":
          return b.price - a.price
        case "experience":
          return parseInt(b.experience) - parseInt(a.experience)
        default:
          return 0
      }
    })

  const toggleSave = (id: number) => {
    setSavedTherapists(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl p-8 mb-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Find a Therapist</h1>
        <p className="text-green-100 mb-6">Connect with licensed mental health professionals who specialize in your needs</p>
        
        {/* Search Bar */}
        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, specialty, or issue..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition"
        >
          <Filter className="w-4 h-4" />
          Filters
        </button>
        
        <div className="flex flex-wrap gap-2">
          {specialties.map(specialty => (
            <button
              key={specialty}
              onClick={() => setSelectedSpecialty(specialty)}
              className={`px-3 py-1 rounded-full text-sm transition ${
                selectedSpecialty === specialty
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
              }`}
            >
              {specialty}
            </button>
          ))}
        </div>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-1 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Filter Options</h3>
            <button onClick={() => setShowFilters(false)} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 mb-3">
                <input
                  type="checkbox"
                  checked={showOnlineOnly}
                  onChange={(e) => setShowOnlineOnly(e.target.checked)}
                  className="w-4 h-4 text-green-500 rounded"
                />
                <span>Show only online therapy</span>
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Price Range: ${priceRange[0]} - ${priceRange[1]}</label>
              <input
                type="range"
                min="0"
                max="200"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="mb-4 text-gray-600 dark:text-gray-400">
        Found {filteredTherapists.length} therapists
      </div>

      {/* Therapists Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTherapists.map((therapist) => (
          <div
            key={therapist.id}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all group"
          >
            {/* Header */}
            <div className="relative h-32 bg-gradient-to-r from-green-500 to-emerald-600">
              <button
                onClick={() => toggleSave(therapist.id)}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition"
              >
                <Bookmark className={`w-4 h-4 ${savedTherapists.includes(therapist.id) ? 'fill-white text-white' : 'text-white'}`} />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6 -mt-12">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">{therapist.name}</h3>
                  <p className="text-green-600 dark:text-green-400 font-medium">{therapist.specialty}</p>
                </div>
                <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-lg">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{therapist.rating}</span>
                  <span className="text-xs text-gray-500">({therapist.reviewCount})</span>
                </div>
              </div>
              
              {/* Details */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{therapist.experience} experience</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>{therapist.location} {therapist.onlineOnly && '(Online only)'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Award className="w-4 h-4" />
                  <span>${therapist.price}/session</span>
                </div>
              </div>
              
              {/* Tags */}
              <div className="mt-3 flex flex-wrap gap-1">
                {therapist.subSpecialties.slice(0, 2).map((sub, idx) => (
                  <span key={idx} className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                    {sub}
                  </span>
                ))}
              </div>
              
              {/* Actions */}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setSelectedTherapist(therapist)}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition font-medium"
                >
                  View Profile
                </button>
                <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                  <MessageCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Therapist Profile Modal */}
      {selectedTherapist && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Therapist Profile</h2>
              <button
                onClick={() => setSelectedTherapist(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              {/* Profile Header */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-1">{selectedTherapist.name}</h3>
                <p className="text-green-600 dark:text-green-400 font-medium">{selectedTherapist.specialty}</p>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl">
                  <div className="flex items-center gap-1 mb-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold">{selectedTherapist.rating}</span>
                    <span className="text-sm text-gray-500">({selectedTherapist.reviewCount} reviews)</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Patient rating</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl">
                  <div className="font-bold mb-1">{selectedTherapist.experience}</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Years of experience</p>
                </div>
              </div>
              
              {/* About */}
              <div className="mb-6">
                <h4 className="font-semibold mb-2">About</h4>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{selectedTherapist.about}</p>
              </div>
              
              {/* Specialties */}
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Specialties</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTherapist.subSpecialties.map((sub, idx) => (
                    <span key={idx} className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-3 py-1 rounded-full text-sm">
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Education */}
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Education</h4>
                <ul className="space-y-1">
                  {selectedTherapist.education.map((edu, idx) => (
                    <li key={idx} className="text-gray-600 dark:text-gray-400 text-sm flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {edu}
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Languages */}
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Languages</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTherapist.languages.map((lang, idx) => (
                    <span key={idx} className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Booking Actions */}
              <div className="flex gap-3">
                <button className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-medium transition flex items-center justify-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Book Session
                </button>
                <button className="flex-1 border border-green-500 text-green-600 dark:text-green-400 py-3 rounded-xl font-medium hover:bg-green-50 dark:hover:bg-green-900/20 transition flex items-center justify-center gap-2">
                  <Video className="w-5 h-5" />
                  Free Consultation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* No Results */}
      {filteredTherapists.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">No therapists found</h3>
          <p className="text-gray-500">Try adjusting your filters or search term</p>
        </div>
      )}
    </div>
  )
}
