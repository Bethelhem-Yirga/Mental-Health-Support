'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { 
  Search, Filter, Star, MapPin, Clock, Video, Calendar,
  Bookmark, X, Award, MessageCircle
} from 'lucide-react'

interface Therapist {
  _id: string
  name: string
  imageUrl: string
  specialty: string
  subSpecialties: string[]
  rating: number
  reviewCount: number
  available: boolean
  experience: string
  location: string
  onlineOnly: boolean
  price: number
  languages: string[]
  education: string[]
  about: string
}

export default function TherapistsPage() {
  const [therapists, setTherapists] = useState<Therapist[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties")
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [showOnlineOnly, setShowOnlineOnly] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 200])
  const [sortBy, setSortBy] = useState("rating")
  const [specialties, setSpecialties] = useState<string[]>(["All Specialties"])
  const [savedTherapists, setSavedTherapists] = useState<string[]>([])
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetchTherapists()
  }, [selectedSpecialty, showOnlineOnly, priceRange, sortBy])

  useEffect(() => {
    fetchSpecialties()
  }, [])

  const fetchTherapists = async () => {
    setLoading(true)
    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/therapists?`
      if (selectedSpecialty !== "All Specialties") url += `specialty=${encodeURIComponent(selectedSpecialty)}&`
      if (showOnlineOnly) url += `onlineOnly=true&`
      if (priceRange[1] < 200) url += `maxPrice=${priceRange[1]}&`
      
      const response = await fetch(url)
      const data = await response.json()
      if (data.success) setTherapists(data.data)
    } catch (error) {
      console.error('Error fetching therapists:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSpecialties = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/therapists/specialties`)
      const data = await response.json()
      if (data.success) setSpecialties(data.data)
    } catch (error) {
      console.error('Error fetching specialties:', error)
    }
  }

  const handleImageError = (therapistId: string) => {
    setImageErrors(prev => ({ ...prev, [therapistId]: true }))
  }

  const getFallbackImage = (name: string) => {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    return `https://ui-avatars.com/api/?name=${initials}&background=4F46E5&color=fff&size=128&rounded=true&bold=true`
  }

  const filteredTherapists = therapists
    .filter(therapist => {
      const matchesSearch = therapist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        therapist.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        therapist.subSpecialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
      return matchesSearch
    })
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating
      if (sortBy === "price_asc") return a.price - b.price
      if (sortBy === "price_desc") return b.price - a.price
      return 0
    })

  const toggleSave = (id: string) => {
    setSavedTherapists(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading therapists...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl p-8 mb-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Find a Therapist</h1>
        <p className="text-green-100 mb-6">Connect with licensed mental health professionals who specialize in your needs</p>
        
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
          <option value="rating">Highest Rated</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
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
              <label className="block text-sm font-medium mb-2">Max Price: ${priceRange[1]}</label>
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
            key={therapist._id}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all group"
          >
            {/* Image Section with Real Photos */}
            <div className="relative h-56 bg-gradient-to-r from-green-500 to-emerald-600 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200">
                  {!imageErrors[therapist._id] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={therapist.imageUrl}
                      alt={therapist.name}
                      className="w-full h-full object-cover"
                      onError={() => handleImageError(therapist._id)}
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={getFallbackImage(therapist.name)}
                      alt={therapist.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>
              <button
                onClick={() => toggleSave(therapist._id)}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition z-10"
              >
                <Bookmark className={`w-4 h-4 ${savedTherapists.includes(therapist._id) ? 'fill-white text-white' : 'text-white'}`} />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">{therapist.name}</h3>
                <p className="text-green-600 dark:text-green-400 font-medium">{therapist.specialty}</p>
              </div>
              
              <div className="flex justify-center mt-2">
                <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-lg">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{therapist.rating}</span>
                  <span className="text-xs text-gray-500">({therapist.reviewCount})</span>
                </div>
              </div>
              
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
              
              <div className="mt-3 flex flex-wrap gap-1 justify-center">
                {therapist.subSpecialties.slice(0, 2).map((sub, idx) => (
                  <span key={idx} className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                    {sub}
                  </span>
                ))}
              </div>
              
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
              {/* Profile Image */}
              <div className="flex justify-center mb-6">
                <div className="relative w-32 h-32 rounded-full border-4 border-green-500 shadow-lg overflow-hidden bg-gray-200">
                  {!imageErrors[selectedTherapist._id] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={selectedTherapist.imageUrl}
                      alt={selectedTherapist.name}
                      className="w-full h-full object-cover"
                      onError={() => handleImageError(selectedTherapist._id)}
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={getFallbackImage(selectedTherapist.name)}
                      alt={selectedTherapist.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-1">{selectedTherapist.name}</h3>
                <p className="text-green-600 dark:text-green-400 font-medium">{selectedTherapist.specialty}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold">{selectedTherapist.rating}</span>
                    <span className="text-sm text-gray-500">({selectedTherapist.reviewCount} reviews)</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Patient rating</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl text-center">
                  <div className="font-bold mb-1">{selectedTherapist.experience}</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Years of experience</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="font-semibold mb-2">About</h4>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{selectedTherapist.about}</p>
              </div>
              
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
