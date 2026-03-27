import { useState, useEffect } from 'react'
import { Clock, Leaf, Zap } from 'lucide-react'
import api from '../api/axios'

export default function History() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/trips/history')
      .then(({ data }) => setTrips(data.trips || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

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
                    <th className="text-left px-6 py-4 font-semibold text-slate-600">CO₂</th>
                    <th className="text-left px-6 py-4 font-semibold text-slate-600">Points</th>
                    <th className="text-left px-6 py-4 font-semibold text-slate-600">Date</th>
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
                        <span className={`text-xs font-semibold ${trip.co2_kg === 0 ? 'text-green-600' : 'text-orange-500'}`}>
                          {trip.co2_kg} kg
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-green-600 font-semibold">
                          <Leaf className="w-3.5 h-3.5" />
                          +{trip.points_earned}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-slate-500">
                          <Clock className="w-3.5 h-3.5" />
                          {formatDate(trip.created_at)}
                        </div>
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
