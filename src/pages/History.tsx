import React, { useEffect, useState } from 'react';
import { tripsApi } from '../api';
import { format } from 'date-fns';
import { History as HistoryIcon, ArrowRight, Leaf } from 'lucide-react';
import { motion } from 'motion/react';

export default function History() {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await tripsApi.getHistory();
        setTrips(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center">
          <HistoryIcon className="h-8 w-8 mr-3 text-green-500" />
          Travel History
        </h1>
        <p className="text-slate-500 mt-2">Review your past trips and green points earned.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="h-12 w-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : trips.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-sm">
          <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <HistoryIcon className="h-10 w-10 text-slate-300" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">No trips yet</h2>
          <p className="text-slate-500 mb-8">Start your first sustainable journey today!</p>
          <a href="/" className="bg-green-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-600 transition-all">
            Find a Trip
          </a>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Route</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Transport</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Distance</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">CO₂ Saved</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Points</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {trips.map((trip) => (
                  <tr key={trip.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-6">
                      <div className="flex items-center space-x-3">
                        <span className="font-bold text-slate-900">{trip.source}</span>
                        <ArrowRight className="h-3 w-3 text-slate-300" />
                        <span className="font-bold text-slate-900">{trip.destination}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-sm font-bold capitalize">
                        {trip.name}
                      </span>
                    </td>
                    <td className="px-6 py-6 font-medium text-slate-600">{trip.distance_km} km</td>
                    <td className="px-6 py-6">
                      <div className="flex items-center text-green-600 font-bold">
                        <Leaf className="h-3 w-3 mr-1" />
                        {trip.co2_kg} kg
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className="bg-green-50 text-green-700 px-3 py-1 rounded-lg text-sm font-black">
                        +{trip.points_earned}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-sm text-slate-400">
                      {format(new Date(trip.created_at), 'MMM dd, yyyy')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
