import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Navigation, ArrowRight } from 'lucide-react';
import { tripsApi } from '../api';
import { motion } from 'motion/react';

export default function Home() {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [distance, setDistance] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!source || !destination || !distance) return;

    setLoading(true);
    try {
      const res = await tripsApi.compare({ 
        source, 
        destination, 
        distance_km: Number(distance) 
      });
      navigate('/results', { 
        state: { 
          results: res.data, 
          source, 
          destination, 
          distance: Number(distance) 
        } 
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
      <div className="text-center mb-12">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-6"
        >
          Travel Sustainable, <br />
          <span className="text-green-500">Earn Green Credits.</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-slate-500 max-w-2xl mx-auto"
        >
          Compare transportation modes based on CO₂ emissions, cost, and time. 
          Make eco-friendly choices and get rewarded for every green trip.
        </motion.p>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="max-w-3xl mx-auto"
      >
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">From</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    placeholder="Source location"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                    required
                  />
                </div>
              </div>
              <div className="relative">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">To</label>
                <div className="relative">
                  <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Destination location"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="relative">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Distance (km)</label>
              <input
                type="number"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                placeholder="Estimated distance in kilometers"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 text-white py-5 rounded-2xl font-black text-lg hover:bg-green-600 active:scale-[0.98] transition-all flex items-center justify-center shadow-lg shadow-green-100 disabled:opacity-70"
            >
              {loading ? (
                <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Compare Options
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
