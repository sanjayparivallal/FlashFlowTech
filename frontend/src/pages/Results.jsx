import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import TransportCard from '../components/TransportCard'
import GreenCredits from '../components/GreenCredits'
import api from '../api/axios'
import { useUser } from '../context/UserContext'

export default function Results() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { updateUser } = useUser()

  const [selectedOption, setSelectedOption] = useState(null)
  const [greenData, setGreenData] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!state) navigate('/home')
  }, [state, navigate])

  if (!state) return null

  const { source, destination, distance_km, options = [] } = state
  const bestOption = options[0] // sorted by eco_score desc

  const handleSelect = async (option) => {
    if (selectedOption) return
    setLoading(true)
    try {
      const { data } = await api.post('/trips/select', {
        source,
        destination,
        transport_mode: option.transport_mode,
        distance_km: option.distance_km,
        // cost, time, CO2, eco_score are recalculated server-side from transport.py
      })
      setSelectedOption(option)
      setGreenData(data)
      updateUser({ green_points: data.total_green_points })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => navigate('/home')}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {source} → {destination}
            </h1>
            <p className="text-sm text-slate-500">
              {distance_km} km · {options.length} transport options
            </p>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
          {options.map((option) => (
            <TransportCard
              key={option.transport_mode}
              option={option}
              onSelect={handleSelect}
              isBest={option.transport_mode === bestOption?.transport_mode}
              isSelected={selectedOption?.transport_mode === option.transport_mode}
            />
          ))}
        </div>

        {/* Green Credits */}
        {greenData && (
          <GreenCredits
            pointsEarned={greenData.points_earned}
            totalPoints={greenData.total_green_points}
          />
        )}

        {loading && (
          <p className="text-center text-sm text-green-600 mt-4 font-medium">
            Saving your trip selection...
          </p>
        )}
      </div>
    </main>
  )
}
