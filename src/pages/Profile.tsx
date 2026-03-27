import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { profileApi } from '../api';
import { User, Mail, Award, CheckCircle, Edit2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function Profile() {
  const { user, setUser } = useUser();
  const [name, setName] = useState(user?.name || '');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await profileApi.update({ name });
      setUser(res.data);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Profile</h1>
        <p className="text-slate-500 mt-2">Manage your account and view your achievements.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
      >
        <div className="bg-green-500 h-32 relative">
          <div className="absolute -bottom-12 left-8">
            <div className="w-24 h-24 rounded-3xl bg-white p-1 shadow-lg">
              <div className="w-full h-full rounded-2xl bg-slate-100 flex items-center justify-center">
                <User className="h-12 w-12 text-slate-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-16 pb-12 px-8">
          <div className="flex justify-between items-start mb-12">
            <div>
              {isEditing ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="text-2xl font-black text-slate-900 border-b-2 border-green-500 outline-none bg-transparent py-1"
                    autoFocus
                  />
                  <button 
                    onClick={handleUpdate}
                    disabled={loading}
                    className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-all"
                  >
                    <CheckCircle className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <h2 className="text-3xl font-black text-slate-900">{user.name}</h2>
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="text-slate-400 hover:text-green-500 transition-colors"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                </div>
              )}
              <div className="flex items-center text-slate-500 mt-2">
                <Mail className="h-4 w-4 mr-2" />
                {user.email}
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold border border-green-200">
                Eco Warrior
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-green-500 p-2 rounded-lg">
                  <Award className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-bold text-slate-900">Green Credits</h3>
              </div>
              <p className="text-4xl font-black text-green-600">{user.green_points}</p>
              <p className="text-sm text-slate-500 mt-2">Redeem these points for rewards.</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-blue-500 p-2 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-bold text-slate-900">Verified Trips</h3>
              </div>
              <p className="text-4xl font-black text-blue-600">12</p>
              <p className="text-sm text-slate-500 mt-2">Total trips tracked so far.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
