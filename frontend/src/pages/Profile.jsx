import { useState, useEffect } from 'react'
import { User, Mail, Leaf, Save, Edit2, CheckCircle } from 'lucide-react'
import api from '../api/axios'
import { useUser } from '../context/UserContext'

export default function Profile() {
  const { user, updateUser } = useUser()
  const [profileData, setProfileData] = useState(null)
  const [editName, setEditName] = useState('')
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    api.get('/profile/me')
      .then(({ data }) => {
        setProfileData(data)
        setEditName(data.name)
        updateUser({ green_points: data.green_points })
      })
      .catch(console.error)
  }, [])

  const handleSave = async () => {
    if (!editName.trim()) return
    setSaving(true)
    try {
      const { data } = await api.put('/profile/update', { name: editName.trim() })
      setProfileData((prev) => ({ ...prev, name: data.name }))
      updateUser({ name: data.name })
      setEditing(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const displayData = profileData || user

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Profile</h1>
          <p className="text-sm text-slate-500 mt-1">Your account information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          {/* Avatar */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-3 shadow-lg">
              {displayData.name?.charAt(0) ?? 'S'}
            </div>
            <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-full px-4 py-1.5">
              <Leaf className="w-4 h-4 text-green-500" />
              <span className="text-sm font-bold text-green-700">{displayData.green_points} Green Points</span>
            </div>
          </div>

          {/* Fields */}
          <div className="space-y-5">
            {/* Name */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                <User className="w-3.5 h-3.5" />
                Name
              </label>
              {editing ? (
                <div className="flex gap-2">
                  <input
                    id="edit-name"
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition"
                    autoFocus
                  />
                  <button
                    id="save-name-btn"
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition disabled:opacity-60"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => { setEditing(false); setEditName(displayData.name) }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-2.5 rounded-xl text-sm transition"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3">
                  <span className="text-slate-800 font-medium">{displayData.name}</span>
                  <button
                    id="edit-name-btn"
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-1.5 text-xs text-green-600 font-semibold hover:text-green-700 transition"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                <Mail className="w-3.5 h-3.5" />
                Email
              </label>
              <div className="bg-slate-50 rounded-xl px-4 py-3">
                <span className="text-slate-600">{displayData.email}</span>
              </div>
            </div>

            {/* Green Points */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                <Leaf className="w-3.5 h-3.5" />
                Green Points
              </label>
              <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3">
                <span className="text-green-700 font-bold text-lg">{displayData.green_points}</span>
                <span className="text-green-500 text-sm ml-2">points accumulated</span>
              </div>
            </div>
          </div>

          {/* Saved Confirmation */}
          {saved && (
            <div className="mt-4 flex items-center gap-2 text-green-600 text-sm font-medium bg-green-50 rounded-xl px-4 py-2.5 border border-green-200">
              <CheckCircle className="w-4 h-4" />
              Profile updated successfully!
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
