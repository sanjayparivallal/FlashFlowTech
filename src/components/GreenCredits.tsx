import React from 'react';
import { motion } from 'motion/react';
import { Award, Gift } from 'lucide-react';

interface GreenCreditsProps {
  pointsEarned: number;
  totalCredits: number;
}

export default function GreenCredits({ pointsEarned, totalCredits }: GreenCreditsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-green-50 border border-green-200 rounded-2xl p-8 mt-12"
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center space-x-6">
          <div className="bg-green-500 p-4 rounded-2xl shadow-lg shadow-green-200">
            <Award className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-green-900">Trip Completed!</h2>
            <p className="text-green-700">You earned <span className="font-bold">{pointsEarned} green points</span> for this sustainable choice.</p>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end">
          <p className="text-sm font-semibold text-green-600 uppercase tracking-wider mb-1">Total Accumulated Credits</p>
          <p className="text-4xl font-black text-green-900">{totalCredits}</p>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-green-200">
        <h3 className="text-sm font-bold text-green-800 uppercase tracking-widest mb-4 flex items-center">
          <Gift className="h-4 w-4 mr-2" />
          Available Rewards
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white/60 p-4 rounded-xl border border-green-100 flex justify-between items-center">
            <span className="font-medium text-green-900">₹50 Coupon</span>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs font-bold">100 pts</span>
          </div>
          <div className="bg-white/60 p-4 rounded-xl border border-green-100 flex justify-between items-center">
            <span className="font-medium text-green-900">₹150 Coupon</span>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs font-bold">250 pts</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
