import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Navigation } from 'lucide-react';
import TransportCard from '../components/TransportCard';
import GreenCredits from '../components/GreenCredits';
import { tripsApi } from '../api';
import { useUser } from '../context/UserContext';
import { motion } from 'motion/react';

export default function Results() {
  const location = useLocation();
  const { results, source, destination, distance } = location.state || {};
  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { user, refreshUser } = useUser();

  if (!results) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">No results found</h2>
        <Link to="/" className="text-green-500 font-bold hover:underline">Go back to search</Link>
      </div>
    );
  }

  const handleSelect = async (trip: any) => {
    setLoading(true);
    try {
      await tripsApi.select({
        ...trip,
        source,
        destination
      });
      setSelectedTrip(trip);
      await refreshUser();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <Link to="/" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-slate-700 mb-4 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Search
          </Link>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Comparison Results</h1>
        </div>
        
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-slate-400" />
            <span className="text-sm font-bold text-slate-700">{source}</span>
          </div>
          <div className="h-4 w-px bg-slate-200" />
          <div className="flex items-center space-x-2">
            <Navigation className="h-4 w-4 text-slate-400" />
            <span className="text-sm font-bold text-slate-700">{destination}</span>
          </div>
          <div className="h-4 w-px bg-slate-200" />
          <div className="text-sm font-bold text-green-600">{distance} km</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {results.map((trip: any, index: number) => (
          <motion.div
            key={trip.mode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <TransportCard 
              trip={trip} 
              isBest={index === 0} 
              onSelect={handleSelect}
              isSelected={selectedTrip?.mode === trip.mode}
            />
          </motion.div>
        ))}
      </div>

      {selectedTrip && (
        <GreenCredits 
          pointsEarned={Math.floor(selectedTrip.eco_score / 10)} 
          totalCredits={user?.green_points || 0} 
        />
      )}
    </div>
  );
}
