'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@/components/Providers'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Calendar as CalendarIcon, TrendingUp, Award, Flame, Smile, Meh, Frown, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const moods = [
  { value: 0, label: 'Great', emoji: '😊', color: '#216e39', bgColor: 'bg-green-700' },
  { value: 1, label: 'Good', emoji: '🙂', color: '#30a14e', bgColor: 'bg-green-500' },
  { value: 2, label: 'Okay', emoji: '😐', color: '#40c463', bgColor: 'bg-green-300' },
  { value: 3, label: 'Low', emoji: '😔', color: '#9be9a8', bgColor: 'bg-green-100' },
  { value: 4, label: 'Very Low', emoji: '😢', color: '#ebedf0', bgColor: 'bg-gray-200' }
]

interface MoodEntry {
  id: number
  moodValue: number
  moodLabel: string
  note: string
  date: string
  tags?: string[]
}

export default function MoodJournalPage() {
  const { userId } = useUser()
  const [entries, setEntries] = useState<MoodEntry[]>([])
  const [selectedMood, setSelectedMood] = useState(2)
  const [note, setNote] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const [view, setView] = useState<'journal' | 'calendar' | 'analytics'>('journal')
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [stats, setStats] = useState({
    total: 0,
    average: 0,
    streak: 0,
    bestMood: 0,
    worstMood: 0
  })

  const tags = ['Work', 'Relationships', 'Health', 'Family', 'Finance', 'Social']

  useEffect(() => {
    const saved = localStorage.getItem('moodEntries')
    if (saved) {
      const parsed = JSON.parse(saved)
      setEntries(parsed)
      calculateStats(parsed)
    }
  }, [])

  const calculateStats = (entriesList: MoodEntry[]) => {
    if (entriesList.length === 0) return
    
    const total = entriesList.length
    const sum = entriesList.reduce((acc, e) => acc + e.moodValue, 0)
    const average = sum / total
    const bestMood = Math.min(...entriesList.map(e => e.moodValue))
    const worstMood = Math.max(...entriesList.map(e => e.moodValue))
    
    let streak = 0
    const sorted = [...entriesList].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    
    if (new Date(sorted[0].date).toDateString() === today || 
        new Date(sorted[0].date).toDateString() === yesterday) {
      streak = 1
      for (let i = 1; i < sorted.length; i++) {
        const prevDate = new Date(sorted[i-1].date)
        const currDate = new Date(sorted[i].date)
        const diffDays = Math.floor((prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24))
        if (diffDays === 1) streak++
        else break
      }
    }
    
    setStats({ total, average: Number(average.toFixed(1)), streak, bestMood, worstMood })
  }

  const saveEntry = async () => {
    const entry: MoodEntry = {
      id: Date.now(),
      moodValue: selectedMood,
      moodLabel: moods[selectedMood].label,
      note,
      date: new Date().toISOString(),
      tags: selectedTag ? [selectedTag] : []
    }
    
    const newEntries = [entry, ...entries].slice(0, 100)
    setEntries(newEntries)
    localStorage.setItem('moodEntries', JSON.stringify(newEntries))
    calculateStats(newEntries)
    setNote('')
    setSelectedTag('')
    
    try {
      await fetch('http://localhost:5000/api/moods/entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          moodValue: selectedMood,
          moodLabel: moods[selectedMood].label,
          note
        })
      })
    } catch (error) {
      console.error('Error saving to backend:', error)
    }
  }

  const deleteEntry = (id: number) => {
    const newEntries = entries.filter(e => e.id !== id)
    setEntries(newEntries)
    localStorage.setItem('moodEntries', JSON.stringify(newEntries))
    calculateStats(newEntries)
  }

  // Generate calendar grid for current month
  const getCalendarDays = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    
    const startDayOfWeek = firstDay.getDay()
    const daysInMonth = lastDay.getDate()
    
    const moodMap: Record<string, number> = {}
    entries.forEach(entry => {
      const date = new Date(entry.date).toISOString().split('T')[0]
      moodMap[date] = entry.moodValue
    })
    
    const days = []
    // Add empty cells for days before month starts
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push({ date: null, moodValue: null, isCurrentMonth: false })
    }
    
    // Add days of the month
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      days.push({
        date: d,
        fullDate: dateStr,
        moodValue: moodMap[dateStr],
        isCurrentMonth: true
      })
    }
    
    return days
  }

  const getMoodColor = (value: number | undefined) => {
    if (value === undefined) return '#ebedf0'
    return moods[value]?.color || '#ebedf0'
  }

  const getMoodEmoji = (value: number | undefined) => {
    if (value === undefined) return '❓'
    return moods[value]?.emoji || '❓'
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  // Chart data
  const last30Days = [...entries].slice(0, 30).reverse()
  const chartData = {
    labels: last30Days.map(e => new Date(e.date).toLocaleDateString()),
    datasets: [{
      label: 'Mood Trend (0=Best, 4=Worst)',
      data: last30Days.map(e => e.moodValue),
      borderColor: '#4caf50',
      backgroundColor: 'rgba(76, 175, 80, 0.1)',
      tension: 0.3,
      fill: true,
      pointBackgroundColor: last30Days.map(e => moods[e.moodValue].color),
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 5,
      pointHoverRadius: 7
    }]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      y: {
        reverse: true,
        min: 0,
        max: 4,
        ticks: {
          stepSize: 1,
          callback: (value: number) => moods[value]?.label || value
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.parsed.y
            return `Mood: ${moods[value]?.label} ${moods[value]?.emoji}`
          }
        }
      }
    }
  }

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="max-w-6xl mx-auto">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg p-4 text-center">
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-sm opacity-90">Total Entries</div>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg p-4 text-center">
          <div className="text-2xl font-bold">{stats.average}</div>
          <div className="text-sm opacity-90">Avg Mood</div>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg p-4 text-center">
          <div className="text-2xl font-bold flex items-center justify-center gap-1">
            <Flame className="w-5 h-5" />
            {stats.streak}
          </div>
          <div className="text-sm opacity-90">Day Streak</div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg p-4 text-center">
          <div className="text-2xl font-bold">{moods[stats.bestMood]?.emoji}</div>
          <div className="text-sm opacity-90">Best Mood</div>
        </div>
        <div className="bg-gradient-to-r from-gray-500 to-gray-700 text-white rounded-lg p-4 text-center">
          <div className="text-2xl font-bold">{moods[stats.worstMood]?.emoji}</div>
          <div className="text-sm opacity-90">Worst Mood</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        {[
          { id: 'journal', label: '✍️ New Entry', icon: Smile },
          { id: 'calendar', label: '📅 Calendar View', icon: CalendarIcon },
          { id: 'analytics', label: '📊 Analytics', icon: TrendingUp }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setView(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 transition-all ${
              view === tab.id
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Journal Entry View */}
      {view === 'journal' && (
        <div className="card">
          <h3 className="text-xl font-semibold mb-4">How are you feeling today?</h3>
          
          <div className="grid grid-cols-5 gap-3 mb-6">
            {moods.map((mood) => (
              <button
                key={mood.value}
                onClick={() => setSelectedMood(mood.value)}
                className={`p-4 rounded-xl transition-all text-center ${
                  selectedMood === mood.value
                    ? `${mood.bgColor} text-white scale-105 shadow-lg`
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <div className="text-3xl mb-1">{mood.emoji}</div>
                <div className="text-sm font-medium">{mood.label}</div>
              </button>
            ))}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags (optional)</label>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm transition ${
                    selectedTag === tag
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <textarea
            placeholder="What's on your mind? How was your day? (Optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
            className="input-field mb-4"
          />

          <button onClick={saveEntry} className="btn-primary w-full py-3 text-lg">
            💾 Save Today's Mood
          </button>
        </div>
      )}

      {/* Calendar View - FIXED DISPLAY */}
      {view === 'calendar' && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Mood Calendar</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={prevMonth}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-lg font-medium">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </span>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {getCalendarDays().map((day, idx) => (
              <div
                key={idx}
                className={`aspect-square p-1 rounded-lg transition-all hover:scale-105 ${
                  day.isCurrentMonth ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'
                }`}
                style={{ backgroundColor: day.moodValue !== undefined ? getMoodColor(day.moodValue) : undefined }}
              >
                {day.date && (
                  <div className="flex flex-col items-center justify-center h-full">
                    <span className={`text-sm ${day.moodValue !== undefined ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                      {day.date}
                    </span>
                    {day.moodValue !== undefined && (
                      <span className="text-lg">{getMoodEmoji(day.moodValue)}</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-6 pt-4 border-t flex flex-wrap justify-center gap-4">
            {moods.map(mood => (
              <div key={mood.value} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: mood.color }} />
                <span className="text-sm">{mood.emoji} {mood.label}</span>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gray-200" />
              <span className="text-sm">No Data</span>
            </div>
          </div>

          <div className="mt-4 text-center text-sm text-gray-500">
            💡 Click on any day to see your mood history
          </div>
        </div>
      )}

      {/* Analytics View */}
      {view === 'analytics' && entries.length > 0 && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">📈 Mood Trend (Last 30 Days)</h3>
            <Line data={chartData} options={chartOptions} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">📊 Mood Distribution</h3>
              <div className="space-y-3">
                {moods.map((mood, idx) => {
                  const count = entries.filter(e => e.moodValue === idx).length
                  const percentage = entries.length > 0 ? (count / entries.length) * 100 : 0
                  return (
                    <div key={mood.value}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{mood.emoji} {mood.label}</span>
                        <span>{count} entries ({percentage.toFixed(0)}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%`, backgroundColor: mood.color }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold mb-4">💡 Insights</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <div className="font-medium">Longest Streak</div>
                    <div className="text-sm text-gray-600">{stats.streak} consecutive days</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <div className="font-medium">Average Mood</div>
                    <div className="text-sm text-gray-600">{stats.average} out of 4</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CalendarIcon className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <div className="font-medium">Total Check-ins</div>
                    <div className="text-sm text-gray-600">{stats.total} mood entries recorded</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-4">📝 Recent Entries</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {entries.slice(0, 10).map((entry) => (
                <div key={entry.id} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{moods[entry.moodValue].emoji}</span>
                      <div>
                        <div className="font-medium">{moods[entry.moodValue].label}</div>
                        {entry.note && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{entry.note}</p>}
                        {entry.tags && entry.tags.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {entry.tags.map(tag => (
                              <span key={tag} className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">
                        {new Date(entry.date).toLocaleDateString()}
                      </div>
                      <button
                        onClick={() => deleteEntry(entry.id)}
                        className="text-xs text-red-500 hover:text-red-700 mt-1"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {view === 'analytics' && entries.length === 0 && (
        <div className="card text-center py-12">
          <Smile className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No entries yet</h3>
          <p className="text-gray-500">Start tracking your mood to see analytics and insights!</p>
          <button onClick={() => setView('journal')} className="btn-primary mt-4">
            Add Your First Entry
          </button>
        </div>
      )}
    </div>
  )
}
