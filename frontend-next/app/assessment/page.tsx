'use client'

import { useState } from 'react'
import { useUser } from '@/components/Providers'
import { ChevronRight, ChevronLeft, CheckCircle, AlertCircle } from 'lucide-react'

const questions = [
  {
    id: 1,
    text: "Little interest or pleasure in doing things?",
    description: "Hobbies, activities, or things you usually enjoy"
  },
  {
    id: 2,
    text: "Feeling down, depressed, or hopeless?",
    description: "Sad, empty, or hopeless feelings"
  },
  {
    id: 3,
    text: "Trouble falling/staying asleep or sleeping too much?",
    description: "Insomnia or hypersomnia"
  },
  {
    id: 4,
    text: "Feeling tired or having little energy?",
    description: "Fatigue, low energy throughout the day"
  },
  {
    id: 5,
    text: "Poor appetite or overeating?",
    description: "Changes in eating habits"
  },
  {
    id: 6,
    text: "Feeling bad about yourself?",
    description: "Feeling like a failure or letting others down"
  },
  {
    id: 7,
    text: "Trouble concentrating on things?",
    description: "Reading, watching TV, or making decisions"
  },
  {
    id: 8,
    text: "Moving or speaking slowly? Or being fidgety or restless?",
    description: "Noticeable to others"
  },
  {
    id: 9,
    text: "Thoughts that you would be better off dead or hurting yourself?",
    description: "Suicidal thoughts or self-harm"
  }
]

const answers_options = [
  { value: 0, label: "Not at all", color: "bg-green-500", description: "0 days" },
  { value: 1, label: "Several days", color: "bg-yellow-500", description: "1-7 days" },
  { value: 2, label: "More than half days", color: "bg-orange-500", description: "8-13 days" },
  { value: 3, label: "Nearly every day", color: "bg-red-500", description: "14+ days" }
]

export default function AssessmentPage() {
  const { userId } = useUser()
  const [answers, setAnswers] = useState<number[]>(Array(9).fill(-1))
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [savedAssessment, setSavedAssessment] = useState<any>(null)

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = value
    setAnswers(newAnswers)
    
    // Auto-advance to next question after 1 second
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1)
      }, 300)
    }
  }

  const goToPrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const calculateResults = () => {
    const total = answers.reduce((sum, val) => sum + val, 0)
    
    let severity = ""
    let severityColor = ""
    let severityIcon = ""
    let recommendation = ""
    let actionItems: string[] = []
    
    if (total >= 0 && total <= 4) {
      severity = "Minimal Depression"
      severityColor = "text-green-600"
      severityIcon = "😊"
      recommendation = "You're doing well! Continue your wellness practices and self-care routines."
      actionItems = [
        "Maintain regular sleep schedule",
        "Exercise 30 minutes daily",
        "Practice mindfulness",
        "Stay connected with friends"
      ]
    } else if (total >= 5 && total <= 9) {
      severity = "Mild Depression"
      severityColor = "text-yellow-600"
      severityIcon = "🙂"
      recommendation = "You may be experiencing some symptoms. Consider self-help strategies and monitoring."
      actionItems = [
        "Start a mood journal",
        "Try breathing exercises",
        "Reduce screen time",
        "Talk to someone you trust"
      ]
    } else if (total >= 10 && total <= 14) {
      severity = "Moderate Depression"
      severityColor = "text-orange-600"
      severityIcon = "😐"
      recommendation = "Your symptoms are affecting your daily life. Consider speaking with a therapist."
      actionItems = [
        "Schedule therapy consultation",
        "Practice grounding techniques",
        "Join support group",
        "Limit stress triggers"
      ]
    } else if (total >= 15 && total <= 19) {
      severity = "Moderately Severe Depression"
      severityColor = "text-orange-800"
      severityIcon = "😔"
      recommendation = "Your symptoms are significant. We strongly recommend consulting a mental health professional."
      actionItems = [
        "Contact a therapist today",
        "Share results with a doctor",
        "Create safety plan",
        "Ask for support from family"
      ]
    } else {
      severity = "Severe Depression"
      severityColor = "text-red-600"
      severityIcon = "😢"
      recommendation = "Your symptoms are severe. Please seek professional help immediately."
      actionItems = [
        "Call 988 Suicide & Crisis Lifeline",
        "Contact emergency services if in crisis",
        "Go to nearest emergency room",
        "Don't be alone - reach out to someone"
      ]
    }
    
    return { total, severity, severityColor, severityIcon, recommendation, actionItems }
  }

  const submitAssessment = async () => {
    const results = calculateResults()
    setSavedAssessment(results)
    setShowResults(true)
    
    // Save to backend
    try {
      await fetch('http://localhost:5000/api/assessment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          answers,
          score: results.total,
          severity: results.severity
        })
      })
    } catch (error) {
      console.error('Error saving assessment:', error)
    }
  }

  const resetAssessment = () => {
    setAnswers(Array(9).fill(-1))
    setCurrentQuestion(0)
    setShowResults(false)
    setSavedAssessment(null)
  }

  const isComplete = answers.every(a => a !== -1)

  if (showResults && savedAssessment) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="card">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">{savedAssessment.severityIcon}</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Your Assessment Results</h1>
            <p className="text-gray-600">Based on your responses over the last 2 weeks</p>
          </div>

          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">PHQ-9 Score</span>
              <span className="text-3xl font-bold">{savedAssessment.total}/27</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-primary-500 rounded-full h-3 transition-all duration-1000"
                style={{ width: `${(savedAssessment.total / 27) * 100}%` }}
              />
            </div>
            <div className="mt-4 text-center">
              <span className={`text-xl font-bold ${savedAssessment.severityColor}`}>
                {savedAssessment.severity}
              </span>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
            <p className="text-blue-800">{savedAssessment.recommendation}</p>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">📋 Recommended Actions:</h3>
            <ul className="space-y-2">
              {savedAssessment.actionItems.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {savedAssessment.total >= 10 && (
            <div className="bg-crisis-50 border border-crisis-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-crisis-600" />
                <h3 className="font-semibold text-crisis-800">Emergency Resources</h3>
              </div>
              <div className="space-y-2">
                <a href="tel:988" className="block text-crisis-700 hover:text-crisis-800">
                  📞 Call 988 - Suicide & Crisis Lifeline
                </a>
                <a href="sms:741741" className="block text-crisis-700 hover:text-crisis-800">
                  💬 Text HOME to 741741 - Crisis Text Line
                </a>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={resetAssessment} className="btn-secondary flex-1">
              Take Again
            </button>
            <button 
              onClick={() => window.location.href = '/therapists'} 
              className="btn-primary flex-1"
            >
              Find a Therapist
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="card">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">📋 PHQ-9 Depression Assessment</h1>
            <span className="text-sm text-gray-500">
              Question {currentQuestion + 1} of {questions.length}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-500 rounded-full h-2 transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <p className="text-sm text-blue-800">
            <strong>About this test:</strong> The PHQ-9 is a 9-question screening tool used by healthcare 
            professionals to assess depression severity over the last 2 weeks.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {questions[currentQuestion].text}
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            {questions[currentQuestion].description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {answers_options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className={`p-4 rounded-lg transition-all text-left ${
                  answers[currentQuestion] === option.value
                    ? `${option.color} text-white shadow-lg scale-105`
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <div className="font-semibold">{option.label}</div>
                <div className="text-sm opacity-80">{option.description}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={goToPrevious}
            disabled={currentQuestion === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              currentQuestion === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          {currentQuestion === questions.length - 1 ? (
            <button
              onClick={submitAssessment}
              disabled={!isComplete}
              className={`btn-primary flex items-center gap-2 ${
                !isComplete ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              See Results
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="text-sm text-gray-500">
              {answers[currentQuestion] === -1 ? 'Select an answer to continue' : '✓ Answered'}
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Answered: {answers.filter(a => a !== -1).length}/{questions.length}</span>
            <span>Confidential • Anonymous</span>
          </div>
        </div>
      </div>
    </div>
  )
}
