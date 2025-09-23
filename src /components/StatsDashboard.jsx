import React from 'react';
import PantheonMeter from './PantheonMeter';

const StatsDashboard = ({ god, queue, zeusGoal, onSave, onLoad, onClear }) => {
  if (!god) return null;

  const { believers, attrs } = god;
  const { love, fear, total } = believers;
  const lovePct = total > 0 ? (love / total * 100).toFixed(0) : 0;
  const fearPct = total > 0 ? (fear / total * 100).toFixed(0) : 0;
  const ethicsScore = lovePct - fearPct;

  const renderBar = (value, max, color, label) => (
    <div className="flex-1">
      <span className="text-xs block mb-1">{label}: {value}</span>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className="h-2 rounded-full transition-all" style={{ width: `${(value / max) * 100}%`, backgroundColor: color }} />
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-r from-purple-800 to-indigo-800 text-white p-3 shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-sm">
        <div className="flex flex-col">
          <span className="font-bold mb-1">Believers</span>
          <div className="flex gap-2 mb-2">
            {renderBar(love, total, '#10b981', `Love ${lovePct}%`)}
            {renderBar(fear, total, '#ef4444', `Fear ${fearPct}%`)}
          </div>
          <span className="text-xs text-gray-300">Ethics: {ethicsScore > 0 ? '+' : ''}{ethicsScore}</span>
        </div>
        <div className="flex flex-col">
          <span className="font-bold mb-1">{god.name}'s Traits</span>
          <div className="space-y-1 text-xs">
            {Object.entries(attrs).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span>{key}</span>
                <span>{(value * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-end text-right">
          <span className="font-bold mb-1">Pantheon Climb</span>
          <PantheonMeter total={total} zeusGoal={zeusGoal} onWin={() => {}} />
          <span className="text-xs mt-1">Turn: {queue.turn}</span>
        </div>
        <div className="flex gap-2 ml-auto">
          <button onClick={onSave} className="px-2 py-1 bg-green-600 text-xs rounded">Save</button>
          <button onClick={onLoad} className="px-2 py-1 bg-blue-600 text-xs rounded">Load</button>
          <button onClick={onClear} className="px-2 py-1 bg-red-600 text-xs rounded">Clear</button>
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;