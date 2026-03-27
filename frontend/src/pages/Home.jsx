import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, Clock, Leaf } from 'lucide-react'
import api from '../api/axios'
import toast from 'react-hot-toast'

export default function Home() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ source: '', destination: '', distance_km: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.source || !form.destination || !form.distance_km) {
      toast.error('Please fill in all fields.')
      return
    }
    setLoading(true)
    try {
      const { data } = await api.post('/trips/compare', {
        source: form.source,
        destination: form.destination,
        distance_km: parseFloat(form.distance_km),
      })
      navigate('/results', { state: data })
    } catch (err) {
      toast.error('Failed to compare trips.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50 flex flex-col items-center justify-center px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
          <Leaf className="w-3.5 h-3.5" />
          Sustainable Transportation Platform
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-3 leading-tight">
          Travel Smarter,<br />
          <span className="text-green-500">Go Greener</span>
        </h1>
        <p className="text-slate-500 text-lg max-w-md mx-auto">
          Compare 8 transport modes instantly. Earn green credits for eco-friendly choices.
        </p>
      </div>

      {/* Search Card */}
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <h2 className="text-lg font-bold text-slate-800 mb-6">Plan Your Trip</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Source */}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="source"
              name="source"
              type="text"
              placeholder="Source city or location"
              value={form.source}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition"
            />
          </div>

          {/* Destination */}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
            <input
              id="destination"
              name="destination"
              type="text"
              placeholder="Destination city or location"
              value={form.destination}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition"
            />
          </div>

          {/* Distance */}
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="distance_km"
              name="distance_km"
              type="number"
              min="0.1"
              step="0.1"
              placeholder="Distance in km (e.g. 25)"
              value={form.distance_km}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition"
            />
          </div>


          <button
            id="search-btn"
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-sm disabled:opacity-60"
          >
            <Search className="w-4 h-4" />
            {loading ? 'Comparing...' : 'Search Transport Options'}
          </button>
        </form>
      </div>

      {/* Stats Strip */}
      <div className="flex gap-8 mt-10 text-center">
        {[
          { label: 'Transport Modes', value: '8' },
          { label: 'CO₂ Tracked', value: '∞' },
          { label: 'Green Credits', value: '💚' },
        ].map((item) => (
          <div key={item.label}>
            <div className="text-2xl font-bold text-slate-800">{item.value}</div>
            <div className="text-xs text-slate-400 mt-0.5">{item.label}</div>
          </div>
        ))}
      </div>
    </main>
  )
}
