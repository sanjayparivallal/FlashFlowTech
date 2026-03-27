import { useState, useEffect } from 'react'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { TrendingUp, Cloud, Leaf, Star } from 'lucide-react'
import api from '../api/axios'

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#f97316', '#14b8a6']

const StatCard = ({ label, value, unit, icon: Icon, color }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
    <div className={`inline-flex p-2 rounded-xl mb-3 ${color}`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div className="text-2xl font-bold text-slate-800">
      {value}
      {unit && <span className="text-sm font-normal text-slate-400 ml-1">{unit}</span>}
    </div>
    <div className="text-sm text-slate-500 mt-1">{label}</div>
  </div>
)

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/dashboard/stats')
      .then(({ data }) => setData(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-slate-50 flex items-center justify-center">
        <p className="text-slate-400 text-sm">Loading dashboard...</p>
      </main>
    )
  }

  const stats = data || {}
  const modeBreakdown = stats.mode_breakdown || []
  const monthlyCo2 = stats.monthly_co2 || []

  // Map mode breakdown to PieChart format { name, value }
  const usage_chart = modeBreakdown.map(item => ({
    name: item.mode.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()),
    value: item.count
  }))

  const statCards = [
    { label: 'Total Distance', value: stats.total_distance ?? 0, unit: 'km', icon: TrendingUp, color: 'bg-blue-500' },
    { label: 'Total CO₂ Saved', value: stats.total_co2_saved ?? 0, unit: 'kg', icon: Cloud, color: 'bg-orange-400' },
    { label: 'Total Trips', value: stats.total_trips ?? 0, unit: 'trips', icon: Leaf, color: 'bg-green-500' },
    { label: 'Green Points', value: stats.total_points ?? 0, unit: 'pts', icon: Star, color: 'bg-purple-500' },
  ]

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Your sustainability impact at a glance</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Line Chart: Monthly CO2 */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-sm font-bold text-slate-700 mb-4">Monthly CO₂ Footprint</h2>
            {monthlyCo2.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-slate-300 text-sm">No data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={monthlyCo2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="co2_kg" name="CO₂ (kg)" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Bar Chart: Trips by Month */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-sm font-bold text-slate-700 mb-4">Trips per Month</h2>
            {monthlyCo2.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-slate-300 text-sm">No data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={monthlyCo2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="trips" name="Trips" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Pie Chart: Transport usage */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 lg:col-span-2">
            <h2 className="text-sm font-bold text-slate-700 mb-4">Transport Usage Distribution</h2>
            {usage_chart.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-slate-300 text-sm">No data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={usage_chart}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {usage_chart.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
