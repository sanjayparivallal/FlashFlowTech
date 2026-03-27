export default function TransportCard({ option, onSelect, isSelected }) {
  const {
    transport_mode,
    icon,
    distance_km,
    time_min,
    cost_inr,
    co2_kg,
    eco_score,
    is_best_time,
    is_best_cost,
    is_best_co2,
    is_best_choice
  } = option

  const modeLabel = transport_mode.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())

  return (
    <div
      className={`relative flex flex-col h-full rounded-2xl border p-5 transition-all duration-200 ${
        is_best_choice
          ? 'bg-green-50 border-2 border-green-400 ring-2 ring-green-200 shadow-md transform -translate-y-1'
          : 'bg-white border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200'
      }`}
    >
      {/* Best Choice Badge */}
      {is_best_choice && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-sm whitespace-nowrap z-10">
          🌿 Best Overall Choice
        </span>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mt-2 mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{icon}</span>
          <div>
            <h3 className="font-bold text-slate-800 text-base">{modeLabel}</h3>
            <p className="text-xs text-slate-400">{distance_km} km</p>
          </div>
        </div>
      </div>

      {/* Stats Grid - Highlight the best values */}
      <div className="grid grid-cols-3 gap-2 text-xs text-slate-500 mb-5 flex-1">
        <div className={`flex flex-col items-center justify-center p-2 rounded-xl border ${is_best_co2 ? 'bg-green-100 border-green-300' : 'bg-slate-50 border-slate-100'}`}>
          <div className="mb-0.5">CO₂</div>
          <div className={`font-bold text-sm ${is_best_co2 ? 'text-green-700' : 'text-slate-700'}`}>{co2_kg} <span className="text-[10px] font-normal">kg</span></div>
          {is_best_co2 && <div className="text-[9px] font-bold text-green-600 mt-0.5 uppercase tracking-wider">Lowest</div>}
        </div>
        
        <div className={`flex flex-col items-center justify-center p-2 rounded-xl border ${is_best_time ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-100'}`}>
          <div className="mb-0.5">Time</div>
          <div className={`font-bold text-sm ${is_best_time ? 'text-blue-700' : 'text-slate-700'}`}>{time_min} <span className="text-[10px] font-normal">min</span></div>
          {is_best_time && <div className="text-[9px] font-bold text-blue-600 mt-0.5 uppercase tracking-wider">Fastest</div>}
        </div>
        
        <div className={`flex flex-col items-center justify-center p-2 rounded-xl border ${is_best_cost ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-100'}`}>
          <div className="mb-0.5">Cost</div>
          <div className={`font-bold text-sm ${is_best_cost ? 'text-amber-700' : 'text-slate-700'}`}>₹{cost_inr}</div>
          {is_best_cost && <div className="text-[9px] font-bold text-amber-600 mt-0.5 uppercase tracking-wider">Cheapest</div>}
        </div>
      </div>

      {/* Eco Score Bar */}
      <div className="mb-5 mt-auto">
        <div className="flex justify-between items-end text-xs mb-1.5">
          <span className="text-slate-500 font-semibold uppercase tracking-wide text-[10px]">Eco Score</span>
          <span className="text-green-600 font-bold text-sm">{eco_score} <span className="text-slate-400 font-normal text-xs">/ 100</span></span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${is_best_choice ? 'bg-green-500' : 'bg-green-400'}`}
            style={{ width: `${eco_score}%` }}
          />
        </div>
      </div>

      {/* Select Button */}
      <button
        onClick={() => onSelect(option)}
        disabled={isSelected}
        className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
          isSelected
            ? 'bg-green-100 text-green-700 border border-green-300 cursor-default'
            : is_best_choice
            ? 'bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5'
            : 'bg-slate-800 hover:bg-slate-700 text-white shadow-sm hover:shadow-md'
        }`}
      >
        {isSelected ? '✓ Trip Selected' : 'Select This Trip'}
      </button>
    </div>
  )
}
