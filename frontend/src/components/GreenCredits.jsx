import { Leaf, Gift, Star } from 'lucide-react'

const REWARD_TIERS = [
  { pts: 100, reward: '₹50 coupon' },
  { pts: 250, reward: '₹150 coupon' },
  { pts: 500, reward: '₹300 coupon' },
]

export default function GreenCredits({ pointsEarned, totalPoints }) {
  return (
    <div className="mt-8 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-green-500 p-1.5 rounded-lg">
          <Leaf className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-lg font-bold text-green-800">Green Credits Earned!</h2>
      </div>

      {/* Points Summary */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 bg-white rounded-xl p-4 border border-green-100 text-center">
          <div className="text-3xl font-bold text-green-600">+{pointsEarned}</div>
          <div className="text-xs text-slate-500 mt-1">Points This Trip</div>
        </div>
        <div className="flex-1 bg-white rounded-xl p-4 border border-green-100 text-center">
          <div className="text-3xl font-bold text-slate-800">{totalPoints}</div>
          <div className="text-xs text-slate-500 mt-1">Total Credits</div>
        </div>
      </div>

      {/* Reward Tiers */}
      <div>
        <div className="flex items-center gap-1.5 mb-3">
          <Gift className="w-4 h-4 text-green-600" />
          <span className="text-sm font-semibold text-green-800">Reward Tiers</span>
        </div>
        <div className="space-y-2">
          {REWARD_TIERS.map((tier) => {
            const unlocked = totalPoints >= tier.pts
            return (
              <div
                key={tier.pts}
                className={`flex items-center justify-between p-3 rounded-xl border text-sm ${
                  unlocked
                    ? 'bg-green-100 border-green-300 text-green-800'
                    : 'bg-white border-slate-100 text-slate-600'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Star
                    className={`w-4 h-4 ${unlocked ? 'text-yellow-500 fill-yellow-400' : 'text-slate-300'}`}
                  />
                  <span className="font-semibold">{tier.pts} pts</span>
                  <span className="text-slate-400">=</span>
                  <span>{tier.reward}</span>
                </span>
                {unlocked && (
                  <span className="text-xs font-bold text-green-600 bg-green-200 px-2 py-0.5 rounded-full">
                    Unlocked
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
