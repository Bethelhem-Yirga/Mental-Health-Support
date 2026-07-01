export default function CrisisPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700 font-bold">⚠️ If you're in crisis, help is available 24/7</p>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">🚨 Crisis Support</h1>
        <div className="space-y-4">
          <a href="tel:8335" className="block bg-orange-500 text-white p-4 rounded-lg text-center hover:bg-orange-600 transition">
            📞 Call 8335 - Suicide & Crisis Lifeline
          </a>
          <a href="sms:741741" className="block bg-blue-500 text-white p-4 rounded-lg text-center hover:bg-blue-600 transition">
            💬 Text HOME to 741741 - Crisis Text Line
          </a>
        </div>
      </div>
    </div>
  )
}
