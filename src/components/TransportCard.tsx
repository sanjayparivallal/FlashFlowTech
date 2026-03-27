import React from 'react';
import { Footprints, Bike, Zap, Car, Bus, Train, Leaf } from 'lucide-react';
import { motion } from 'motion/react';

const iconMap: Record<string, any> = {
  Walking: Footprints,
  Bike,
  Motorcycle: Bike,
  Zap,
  Car,
  Bus,
  Train
};

interface TransportCardProps {
  trip: any;
  isBest?: boolean;
  onSelect: (trip: any) => void;
  isSelected?: boolean;
}

export default function TransportCard({ trip, isBest, onSelect, isSelected }: TransportCardProps) {
  const Icon = iconMap[trip.icon] || Car;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`bg-white rounded-2xl shadow-sm border p-6 flex flex-col transition-all duration-300 ${
        isBest ? 'border-green-400 bg-green-50/30' : 'border-slate-100'
      } ${isSelected ? 'ring-2 ring-green-500' : ''}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${isBest ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-600'}`}>
          <Icon className="h-6 w-6" />
        </div>
        {isBest && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
            <Leaf className="h-3 w-3 mr-1" />
            Best Choice
          </span>
        )}
      </div>

      <h3 className="text-lg font-bold text-slate-900 mb-1 capitalize">{trip.name}</h3>
      <div className="flex items-baseline space-x-2 text-slate-500 text-sm mb-4">
        <span>{trip.distance_km} km</span>
        <span>•</span>
        <span>{trip.time_min} min</span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Cost</p>
          <p className="text-lg font-bold text-slate-900">₹{trip.cost_inr}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400 uppercase font-semibold mb-1">CO₂</p>
          <p className="text-lg font-bold text-slate-900">{trip.co2_kg} kg</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-semibold text-slate-500 uppercase">Eco Score</span>
          <span className="text-xs font-bold text-green-600">{trip.eco_score}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-500" 
            style={{ width: `${trip.eco_score}%` }}
          />
        </div>
      </div>

      <button
        onClick={() => onSelect(trip)}
        disabled={isSelected}
        className={`mt-auto w-full py-2.5 rounded-xl font-bold transition-all duration-200 ${
          isSelected 
            ? 'bg-green-100 text-green-600 cursor-default'
            : 'bg-green-500 text-white hover:bg-green-600 active:scale-95'
        }`}
      >
        {isSelected ? 'Selected' : 'Select Option'}
      </button>
    </motion.div>
  );
}
