import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, Leaf, Zap, RefreshCw } from 'lucide-react'
import api from '../api/axios'

export default function History() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [comparingId, setComparingId] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/trips/history')
      .then(({ data }) => setTrips(data.trips || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleCompareAgain = async (trip, index) => {
    setComparingId(index)
    try {
      const { data } = await api.post('/trips/compare', {
        source: trip.source,
        destination: trip.destination,
        distance_km: trip.distance_km,
      })
      navigate('/results', { state: data })
    } catch (err) {
      console.error(err)
    } finally {
      setComparingId(null)
    }
  }

  const formatMode = (mode) =>
    mode.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    })

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Trip History</h1>
          <p className="text-sm text-slate-500 mt-1">All your past trips and green points earned</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-sm">Loading trips...</div>
          ) : trips.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-4xl mb-3">🌿</div>
              <p className="text-slate-500 font-medium">No trips yet. Start exploring!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="text-left px-6 py-4 font-semibold text-slate-600">Route</th>
                    <th className="text-left px-6 py-4 font-semibold text-slate-600">Transport</th>
                    <th className="text-left px-6 py-4 font-semibold text-slate-600">Distance</th>
                    <th className="text-left px-6 py-4 font-semibold text-slate-600">CO₂ / Points</th>
                    <th className="text-left px-6 py-4 font-semibold text-slate-600">Date</th>
                    <th className="text-right px-6 py-4 font-semibold text-slate-600">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {trips.map((trip, i) => (
                    <tr
                      key={i}
                      className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-800">{trip.source}</div>
                        <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <span>→</span> {trip.destination}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg text-xs font-medium">
                          {formatMode(trip.transport_mode)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        <div className="flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5 text-blue-400" />
                          {trip.distance_km} km
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5">
                          <span className={`text-xs font-bold ${trip.co2_kg === 0 ? 'text-green-600' : 'text-slate-600'}`}>
                            {trip.co2_kg} kg CO₂
                          </span>
                          <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                            <Leaf className="w-3 h-3" /> +{trip.points_earned} pts
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          {formatDate(trip.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleCompareAgain(trip, i)}
                          disabled={comparingId === i}
                          className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 disabled:opacity-50"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${comparingId === i ? 'animate-spin' : ''}`} />
                          {comparingId === i ? 'Loading...' : 'Compare Again'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
