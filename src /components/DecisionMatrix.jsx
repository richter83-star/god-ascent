import React, { useState } from 'react';

const DecisionMatrix = ({ god, event, onDecisionMade }) => {
  const [selected, setSelected] = useState(null);

  const handleSelect = (coa) => {
    setSelected(coa.id);
    const tyrannyPenalty = god.attrs.tyranny * 0.5 + god.attrs.absentminded * 0.4;
    const tyrannyBoost = god.attrs.tyranny * 0.8;
    const biasedDelta = {
      love: coa.delta.love * (1 - tyrannyPenalty),
      fear: coa.delta.fear * (1 + tyrannyBoost),
      totalBelievers: god.believers.total + coa.delta.love + coa.delta.fear
    };
    onDecisionMade(biasedDelta, coa);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="matrix-container p-4 bg-mythic-gray rounded-lg shadow-lg max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-4 text-center">{event.desc}</h2>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 text-left">Action</th>
              <th className="p-2 text-left">Ethics</th>
              <th className="p-2 text-left">Risk</th>
            </tr>
          </thead>
          <tbody>
            {event.coas.map(coa => (
              <tr key={coa.id} className={`border-b cursor-pointer hover:bg-blue-50 ${selected === coa.id ? 'bg-blue-100' : ''}`} onClick={() => handleSelect(coa)}>
                <td className="p-2">{coa.name}</td>
                <td className="p-2">{coa.ethics}</td>
                <td className="p-2">{coa.risk}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {selected && <p className="mt-4 text-center text-green-600">Outcome locked in!</p>}
      </div>
    </div>
  );
};

export default DecisionMatrix;