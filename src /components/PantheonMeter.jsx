import React from 'react';

const PantheonMeter = ({ total, zeusGoal = 1000000, onWin }) => {
  const progressPct = (total / zeusGoal * 100).toFixed(1);
  const isNearWin = progressPct > 90;
  const hasWon = total >= zeusGoal;

  if (hasWon) {
    onWin();
    return null;
  }

  return (
    <div className={`relative ${isNearWin ? 'animate-pulse' : ''}`}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-bold">Pantheon Climb</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#fbbf24" className="ml-auto">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2l1.5 4h3l-2.5 2 1 4-3.5-1-3.5 1 1-4-2.5-2h3z" fill="currentColor" />
        </svg>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r from-yellow-400 to-orange-500 ${isNearWin ? 'shadow-lg shadow-yellow-500/50' : ''}`}
          style={{ width: `${progressPct}%` }}
        />
      </div>
      <span className="text-xs text-gray-300 block mt-1 text-right">
        {total.toLocaleString()} / {zeusGoal.toLocaleString()} ({progressPct}%)
        {isNearWin && <span className="text-yellow-400 ml-1">— Challenge Zeus!</span>}
      </span>
    </div>
  );
};

export default PantheonMeter;