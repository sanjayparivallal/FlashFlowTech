import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import GreenCredits from '../components/GreenCredits'
import api from '../api/axios'
import { useUser } from '../context/UserContext'
import toast from 'react-hot-toast'

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
      })
      setSelectedOption(option)
      setGreenData(data)
      updateUser({ green_points: data.total_green_points })
      toast.success(`Trip saved! You earned ${data.points_earned} green points.`, {
        icon: '🌱',
      })
    } catch (err) {
      toast.error('Failed to save trip. Please try again.')
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

        {/* Vertical Feature Comparison Matrix */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm mt-6 overflow-hidden">
          <div className="overflow-x-auto w-full custom-scrollbar">
            <div className="flex w-max min-w-full">
              {/* Sticky Row Labels (Y-Axis) */}
              <div className="flex flex-col w-40 flex-shrink-0 bg-slate-50/90 backdrop-blur-sm border-r border-slate-200 sticky left-0 z-20 shadow-[4px_0_15px_-3px_rgba(0,0,0,0.05)]">
                <div className="h-32 p-4 flex items-center justify-start border-b border-slate-100 font-bold text-slate-500 uppercase tracking-widest text-xs">Features</div>
                <div className="h-16 p-4 flex items-center justify-start border-b border-slate-100 font-bold text-slate-600 text-sm">Distance</div>
                <div className="h-20 p-4 flex items-center justify-start border-b border-slate-100 font-bold text-slate-600 text-sm">Time</div>
                <div className="h-20 p-4 flex items-center justify-start border-b border-slate-100 font-bold text-slate-600 text-sm">Cost</div>
                <div className="h-20 p-4 flex items-center justify-start border-b border-slate-100 font-bold text-slate-600 text-sm">CO₂ Emitted</div>
                <div className="h-20 p-4 flex items-center justify-start border-b border-slate-100 font-bold text-slate-600 text-sm">Calories</div>
                <div className="h-20 p-4 flex items-center justify-start border-b border-slate-100 font-bold text-slate-600 text-sm">Comfort</div>
                <div className="h-20 p-4 flex items-center justify-start border-b border-slate-100 font-bold text-slate-600 text-sm">Eco Score</div>
                <div className="h-24 p-4 flex items-center justify-start font-bold text-slate-600 text-sm rounded-bl-2xl">Action</div>
              </div>

              {/* Data Columns (X-Axis) - One column per transport mode */}
              <div className="flex flex-1">
                {options.map((option, index) => {
                  const isBest = option.transport_mode === bestOption?.transport_mode
                  const isSelected = selectedOption?.transport_mode === option.transport_mode
                  const modeLabel = option.transport_mode.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())

                  return (
                    <div 
                      key={option.transport_mode} 
                      className={`flex flex-col w-44 flex-shrink-0 border-r border-slate-100 transition-colors hover:bg-slate-50 relative group ${isBest ? 'bg-green-50/30' : ''}`}
                    >
                      {isBest && <div className="absolute top-0 left-0 w-full h-1 bg-green-500 z-10"></div>}

                      {/* Header (Mode & Icon) */}
                      <div className="h-32 p-4 flex flex-col items-center justify-center border-b border-slate-100 text-center relative gap-2">
                        {isBest && <span className="absolute -top-3 bg-green-500 text-white text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm z-10">Top Choice</span>}
                        <div className={`flex items-center justify-center w-12 h-12 rounded-xl text-2xl shadow-sm border transition-transform group-hover:scale-110 ${isBest ? 'bg-white border-green-200' : 'bg-slate-50 border-slate-100'}`}>
                          {option.icon}
                        </div>
                        <h3 className="font-extrabold text-slate-800 text-sm">{modeLabel}</h3>
                      </div>

                      {/* Distance */}
                      <div className="h-16 p-4 flex items-center justify-center border-b border-slate-100">
                        <span className="text-sm font-semibold text-slate-600">{option.distance_km} km</span>
                      </div>

                      {/* Time */}
                      <div className={`h-20 p-4 flex flex-col items-center justify-center border-b border-slate-100 ${option.is_best_time ? 'bg-blue-50/50' : ''}`}>
                        <span className={`text-lg font-black ${option.is_best_time ? 'text-blue-600' : 'text-slate-700'}`}>{option.time_min} <span className="text-[10px] font-semibold text-slate-400">min</span></span>
                        {option.is_best_time && <span className="text-[9px] font-bold text-blue-500 uppercase mt-0.5 tracking-wider bg-blue-100 px-1.5 py-0.5 rounded">Fastest</span>}
                      </div>

                      {/* Cost */}
                      <div className={`h-20 p-4 flex flex-col items-center justify-center border-b border-slate-100 ${option.is_best_cost ? 'bg-amber-50/50' : ''}`}>
                        <span className={`text-lg font-black ${option.is_best_cost ? 'text-amber-600' : 'text-slate-700'}`}>₹{option.cost_inr}</span>
                        {option.is_best_cost && <span className="text-[9px] font-bold text-amber-500 uppercase mt-0.5 tracking-wider bg-amber-100 px-1.5 py-0.5 rounded">Cheapest</span>}
                      </div>

                      {/* CO2 */}
                      <div className={`h-20 p-4 flex flex-col items-center justify-center border-b border-slate-100 ${option.is_best_co2 ? 'bg-green-50/50' : ''}`}>
                        <span className={`text-lg font-black ${option.is_best_co2 ? 'text-green-600' : 'text-slate-700'}`}>{option.co2_kg} <span className="text-[10px] font-semibold text-slate-400">kg</span></span>
                        {option.is_best_co2 && <span className="text-[9px] font-bold text-green-500 uppercase mt-0.5 tracking-wider bg-green-100 px-1.5 py-0.5 rounded">Greenest</span>}
                      </div>

                      {/* Calories */}
                      <div className={`h-20 p-4 flex flex-col items-center justify-center border-b border-slate-100 ${option.is_best_health ? 'bg-rose-50/50' : ''}`}>
                        <span className={`text-lg font-black ${option.is_best_health ? 'text-rose-600' : 'text-slate-700'}`}>{option.calories} <span className="text-[10px] font-semibold text-slate-400">kcal</span></span>
                        {option.is_best_health && <span className="text-[9px] font-bold text-rose-500 uppercase mt-0.5 tracking-wider bg-rose-100 px-1.5 py-0.5 rounded">Healthiest</span>}
                      </div>

                      {/* Comfort */}
                      <div className={`h-20 p-4 flex flex-col items-center justify-center border-b border-slate-100 ${option.is_best_comfort ? 'bg-purple-50/50' : ''}`}>
                        <span className={`text-lg font-black ${option.is_best_comfort ? 'text-purple-600' : 'text-slate-700'}`}>{option.comfort} <span className="text-[10px] font-semibold text-slate-400">/10</span></span>
                        {option.is_best_comfort && <span className="text-[9px] font-bold text-purple-500 uppercase mt-0.5 tracking-wider bg-purple-100 px-1.5 py-0.5 rounded">Comfiest</span>}
                      </div>

                      {/* Score */}
                      <div className="h-20 p-4 flex flex-col items-center justify-center border-b border-slate-100">
                         <div className="relative w-12 h-12 flex items-center justify-center">
                            <span className="text-sm font-black text-slate-800 z-10">{option.eco_score}</span>
                            <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90">
                              <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-100" />
                              <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray="125" strokeDashoffset={125 - (125 * option.eco_score) / 100} className="text-green-500 transition-all duration-1000 ease-out" />
                            </svg>
                         </div>
                      </div>

                      {/* Action */}
                      <div className="h-24 p-4 flex items-center justify-center">
                        <button
                          onClick={() => handleSelect(option)}
                          disabled={isSelected}
                          className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                            isSelected
                              ? 'bg-green-100 text-green-700 border border-green-300 shadow-inner cursor-default'
                              : isBest
                              ? 'bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg active:scale-95'
                              : 'bg-slate-800 hover:bg-slate-700 text-white shadow-md hover:shadow-lg active:scale-95'
                          }`}
                        >
                          {isSelected ? '✓ Saved' : 'Select'}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
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
