'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { 
  Wind, Brain, Flower2, Waves, Clock, Volume2, VolumeX,
  Play, Pause, RefreshCw, Sparkles, Heart, Moon, Music
} from 'lucide-react'
import { soundService } from '@/utils/soundService'

// Breathing Exercise Component
function BreathingExercise() {
  const [isActive, setIsActive] = useState(false)
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale')
  const [timer, setTimer] = useState(4)
  const [cycles, setCycles] = useState(0)
  
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isActive) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            if (phase === 'inhale') { setPhase('hold'); return 7 }
            else if (phase === 'hold') { setPhase('exhale'); return 8 }
            else { setPhase('inhale'); setCycles(c => c + 1); return 4 }
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isActive, phase])
  
  const phaseText = {
    inhale: { text: 'Breathe In', instruction: 'Fill your lungs slowly', color: 'from-blue-500 to-cyan-500' },
    hold: { text: 'Hold', instruction: 'Keep the air in', color: 'from-yellow-500 to-orange-500' },
    exhale: { text: 'Breathe Out', instruction: 'Release slowly', color: 'from-green-500 to-emerald-500' }
  }
  
  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8 text-center">
      <div className="mb-6">
        <Wind className="w-12 h-12 text-purple-500 mx-auto mb-2" />
        <h3 className="text-2xl font-bold">4-7-8 Breathing</h3>
        <p className="text-gray-500">Calm your nervous system</p>
      </div>
      
      <div className="relative w-48 h-48 mx-auto mb-6">
        <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${phaseText[phase].color} opacity-20 transition-all duration-1000 ${isActive ? 'scale-100' : 'scale-75'}`} />
        <div className={`absolute inset-4 rounded-full bg-gradient-to-r ${phaseText[phase].color} opacity-40 transition-all duration-1000 ${isActive ? 'scale-90' : 'scale-50'}`} />
        <div className={`absolute inset-8 rounded-full bg-gradient-to-r ${phaseText[phase].color} flex items-center justify-center transition-all duration-1000 ${isActive ? 'scale-75' : 'scale-25'}`}>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">{timer}</div>
            <div className="text-xs text-white/80">{phaseText[phase].text}</div>
          </div>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">{phaseText[phase].instruction}</p>
      <p className="text-xs text-gray-400 mb-4">Cycles completed: {cycles}</p>
      
      <div className="flex gap-3 justify-center">
        {!isActive ? (
          <button onClick={() => setIsActive(true)} className="bg-green-500 text-white px-6 py-2 rounded-full flex items-center gap-2 hover:bg-green-600 transition">
            <Play className="w-4 h-4" /> Start
          </button>
        ) : (
          <button onClick={() => setIsActive(false)} className="bg-red-500 text-white px-6 py-2 rounded-full flex items-center gap-2 hover:bg-red-600 transition">
            <Pause className="w-4 h-4" /> Stop
          </button>
        )}
        <button onClick={() => { setCycles(0); setPhase('inhale'); setTimer(4); }} className="bg-gray-500 text-white px-6 py-2 rounded-full flex items-center gap-2 hover:bg-gray-600 transition">
          <RefreshCw className="w-4 h-4" /> Reset
        </button>
      </div>
    </div>
  )
}

// Meditation Timer Component
function MeditationTimer() {
  const [duration, setDuration] = useState(5)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isActive && !isPaused && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000)
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false)
      alert('✨ Meditation Complete! Well done! ✨')
    }
    return () => clearInterval(interval)
  }, [isActive, isPaused, timeLeft])
  
  const startMeditation = () => {
    setTimeLeft(duration * 60)
    setIsActive(true)
    setIsPaused(false)
  }
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-2xl p-8 text-center">
      <div className="mb-6">
        <Brain className="w-12 h-12 text-indigo-500 mx-auto mb-2" />
        <h3 className="text-2xl font-bold">Meditation Timer</h3>
        <p className="text-gray-500">Find your inner peace</p>
      </div>
      
      {!isActive ? (
        <div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
            <div className="flex justify-center gap-2">
              {[3, 5, 10, 15, 20].map(m => (
                <button
                  key={m}
                  onClick={() => setDuration(m)}
                  className={`px-4 py-2 rounded-lg transition ${duration === m ? 'bg-indigo-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          <button onClick={startMeditation} className="bg-indigo-500 text-white px-8 py-3 rounded-full hover:bg-indigo-600 transition">
            Start Meditation
          </button>
        </div>
      ) : (
        <div>
          <div className="text-6xl font-bold mb-6 font-mono">{formatTime(timeLeft)}</div>
          <div className="flex gap-3 justify-center">
            <button onClick={() => setIsPaused(!isPaused)} className="bg-yellow-500 text-white px-6 py-2 rounded-full hover:bg-yellow-600 transition">
              {isPaused ? 'Resume' : 'Pause'}
            </button>
            <button onClick={() => setIsActive(false)} className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition">
              End
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Grounding Technique Component
function GroundingTechnique() {
  const [step, setStep] = useState(0)
  const [items, setItems] = useState<string[]>([])
  const [input, setInput] = useState('')
  
  const steps = [
    { sense: '👁️ Sight', instruction: 'Find 5 things you can SEE', target: 5 },
    { sense: '✋ Touch', instruction: 'Find 4 things you can TOUCH', target: 4 },
    { sense: '👂 Sound', instruction: 'Find 3 things you can HEAR', target: 3 },
    { sense: '👃 Smell', instruction: 'Find 2 things you can SMELL', target: 2 },
    { sense: '👅 Taste', instruction: 'Find 1 thing you can TASTE', target: 1 }
  ]
  
  const addItem = () => {
    if (input.trim()) {
      setItems([...items, input.trim()])
      setInput('')
      if (items.length + 1 === steps[step].target && step < 4) {
        setTimeout(() => { setStep(step + 1); setItems([]) }, 500)
      }
    }
  }
  
  const reset = () => { setStep(0); setItems([]); setInput('') }
  
  if (step === 5) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-8 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-2xl font-bold mb-2">Grounding Complete!</h3>
        <p className="text-gray-600 mb-4">You're now present in the moment</p>
        <button onClick={reset} className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition">Start Over</button>
      </div>
    )
  }
  
  return (
    <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-2xl p-8">
      <div className="mb-6 text-center">
        <Flower2 className="w-12 h-12 text-amber-500 mx-auto mb-2" />
        <h3 className="text-2xl font-bold">5-4-3-2-1 Grounding</h3>
        <p className="text-gray-500">Return to the present moment</p>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="font-semibold">{steps[step].sense}</span>
          <span className="text-sm text-gray-500">{items.length}/{steps[step].target}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-amber-500 rounded-full h-2 transition-all" style={{ width: `${(items.length / steps[step].target) * 100}%` }} />
        </div>
      </div>
      
      <p className="text-center text-gray-700 mb-4">{steps[step].instruction}</p>
      
      <div className="flex gap-2 mb-4">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addItem()} placeholder="What do you notice?" className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
        <button onClick={addItem} className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition">Add</button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => <span key={i} className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">✓ {item}</span>)}
      </div>
    </div>
  )
}

// Progressive Muscle Relaxation Component
function PMRExercise() {
  const [step, setStep] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [isTensing, setIsTensing] = useState(true)
  const muscleGroups = ['👊 Hands and Fists', '💪 Arms and Biceps', '🤯 Shoulders', '😬 Jaw and Face', '🦵 Legs and Thighs', '🦶 Feet and Toes']
  
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isActive) {
      timer = setTimeout(() => {
        if (isTensing) setIsTensing(false)
        else if (step < muscleGroups.length - 1) { setStep(step + 1); setIsTensing(true) }
        else { setIsActive(false); setStep(0); alert('🎉 PMR Complete! Feel the relaxation! 🎉') }
      }, isTensing ? 7000 : 15000)
    }
    return () => clearTimeout(timer)
  }, [isActive, isTensing, step])
  
  if (!isActive) {
    return (
      <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-2xl p-8 text-center">
        <div className="mb-6"><Waves className="w-12 h-12 text-teal-500 mx-auto mb-2" /><h3 className="text-2xl font-bold">Muscle Relaxation</h3><p className="text-gray-500">Release tension from your body</p></div>
        <p className="text-gray-600 mb-4">This 10-minute exercise will guide you through tensing and relaxing each muscle group.</p>
        <button onClick={() => setIsActive(true)} className="bg-teal-500 text-white px-6 py-2 rounded-full hover:bg-teal-600 transition">Start PMR</button>
      </div>
    )
  }
  
  return (
    <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-2xl p-8 text-center">
      <div className="mb-4"><div className="text-6xl mb-2">{isTensing ? '💪' : '😌'}</div><div className="text-2xl font-bold mb-1">{muscleGroups[step]}</div><p className="text-gray-600">{isTensing ? 'TENSE... hold for 7 seconds' : 'RELAX... feel the release'}</p></div>
      <div className="w-full bg-gray-200 rounded-full h-1 mb-4"><div className="bg-teal-500 rounded-full h-1 transition-all" style={{ width: `${((step + 1) / muscleGroups.length) * 100}%` }} /></div>
      <button onClick={() => setIsActive(false)} className="text-sm text-gray-500 hover:text-gray-700">Cancel</button>
    </div>
  )
}

// Main Mindfulness Page with Working Sounds
export default function MindfulnessPage() {
  const [activeTool, setActiveTool] = useState('breathing')
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [ambientSound, setAmbientSound] = useState('none')
  const [isSoundPlaying, setIsSoundPlaying] = useState(false)
  
  const tools = [
    { id: 'breathing', name: 'Breathing', icon: Wind, color: 'from-purple-500 to-pink-500', component: BreathingExercise },
    { id: 'meditation', name: 'Meditation', icon: Brain, color: 'from-indigo-500 to-blue-500', component: MeditationTimer },
    { id: 'grounding', name: 'Grounding', icon: Flower2, color: 'from-amber-500 to-yellow-500', component: GroundingTechnique },
    { id: 'pmr', name: 'PMR', icon: Waves, color: 'from-teal-500 to-cyan-500', component: PMRExercise }
  ]
  
  const ActiveComponent = tools.find(t => t.id === activeTool)?.component || BreathingExercise
  
  // Handle sound changes
  const handleSoundChange = async (sound: string) => {
    setAmbientSound(sound)
    if (!soundEnabled) return
    
    if (sound === 'none') {
      soundService.stopSound()
      setIsSoundPlaying(false)
    } else {
      // Resume audio context (browsers require user interaction)
      await soundService.resume()
      await soundService.playSound(sound)
      setIsSoundPlaying(true)
    }
  }
  
  const toggleSoundEnabled = () => {
    const newState = !soundEnabled
    setSoundEnabled(newState)
    if (!newState) {
      soundService.stopSound()
      setIsSoundPlaying(false)
    } else if (ambientSound !== 'none') {
      soundService.playSound(ambientSound)
      setIsSoundPlaying(true)
    }
  }
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      soundService.stopSound()
    }
  }, [])
  
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-4 py-2 rounded-full text-sm mb-4">
          <Sparkles className="w-4 h-4" />
          <span>Mindfulness Tools</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-3">Find Your Calm</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Explore evidence-based mindfulness techniques to reduce stress, manage anxiety, and improve well-being
        </p>
      </div>
      
      {/* Tool Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {tools.map((tool) => {
          const Icon = tool.icon
          return (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`p-4 rounded-xl transition-all ${
                activeTool === tool.id
                  ? `bg-gradient-to-r ${tool.color} text-white shadow-lg scale-105`
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md'
              }`}
            >
              <Icon className="w-8 h-8 mx-auto mb-2" />
              <div className="font-medium">{tool.name}</div>
            </button>
          )
        })}
      </div>
      
      {/* Active Tool Component */}
      <div className="mb-8">
        <ActiveComponent />
      </div>
      
      {/* Tips Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center"><Clock className="w-5 h-5 text-blue-600" /></div>
            <h3 className="font-semibold">Start Small</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Even 2-3 minutes of mindfulness daily can make a difference. Build the habit gradually.</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center"><Heart className="w-5 h-5 text-green-600" /></div>
            <h3 className="font-semibold">Be Patient</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Your mind will wander. That's normal. Gently bring your attention back without judgment.</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center"><Moon className="w-5 h-5 text-purple-600" /></div>
            <h3 className="font-semibold">Consistency</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Try to practice at the same time each day to build a lasting mindfulness habit.</p>
        </div>
      </div>
      
      {/* Working Sound Settings */}
      <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Music className="w-5 h-5 text-gray-500" />
          <span className="text-sm font-medium">Background Ambience</span>
          {isSoundPlaying && <span className="text-xs text-green-500 animate-pulse">🔊 Playing</span>}
        </div>
        <div className="flex gap-3 items-center">
          <button 
            onClick={toggleSoundEnabled} 
            className={`p-2 rounded-lg transition ${soundEnabled ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}`}
            title={soundEnabled ? 'Disable sounds' : 'Enable sounds'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <select
            value={ambientSound}
            onChange={(e) => handleSoundChange(e.target.value)}
            disabled={!soundEnabled}
            className="px-3 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
          >
            <option value="none">No sound 🎵</option>
            <option value="rain">Rain 🌧️</option>
            <option value="waves">Ocean Waves 🌊</option>
            <option value="forest">Forest Birds 🍃</option>
          </select>
        </div>
      </div>
      
      {/* Sound Instructions */}
      <div className="mt-4 text-center text-xs text-gray-400">
        <p>ℹ️ Ambient sounds are generated using Web Audio API. Click the play button on your browser if needed.</p>
      </div>
    </div>
  )
}
