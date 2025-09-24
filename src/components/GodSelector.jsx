import React, { useState, useEffect } from 'react';
import { generateGod } from './GodSelector.js';

const GodSelector = ({ onSelect }) => {
  const [selectedId, setSelectedId] = useState(null);
  const [gods, setGods] = useState([]);

  // This hook runs once when the component is first rendered.
  // It generates 3 unique gods for the player to choose from.
  useEffect(() => {
    setGods([generateGod(), generateGod(), generateGod()]);
  }, []);

  const handleSelect = (god) => {
    setSelectedId(god.id);
    onSelect(god);
  };

  const handleRandom = () => {
    const randomGod = generateGod();
    // Also add this new random god to the list to show it's selected
    setGods([...gods, randomGod]); 
    handleSelect(randomGod);
  };

  const renderAttrBar = (value, label) => (
    <div className="w-full">
      <span className="text-xs text-gray-600 block mb-1">{label}</span>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${value * 100}%` }} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 flex flex-col items-center justify-center p-4 text-white">
      <h1 className="text-3xl font-bold mb-8 text-center">Awaken, Forgotten One</h1>
      <p className="text-lg mb-8 text-center max-w-md">Your nature is chaos, your name unwritten. Choose a form to manifest.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl mb-8">
        {gods.map((god) => (
          <div
            key={god.id}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selectedId === god.id ? 'border-yellow-400 bg-yellow-400/10 scale-105' : 'border-gray-600 hover:border-blue-400 hover:bg-blue-500/10'
            }`}
            onClick={() => handleSelect(god)}
          >
            <h2 className="text-xl font-semibold mb-2">{god.name}</h2>
            <p className="text-sm mb-4 italic text-gray-300">{god.desc}</p>
            <div className="space-y-2">
              {Object.entries(god.attrs).map(([key, value]) => renderAttrBar(value, key.charAt(0).toUpperCase() + key.slice(1)))}
            </div>
          </div>
        ))}
      </div>
      <button onClick={handleRandom} className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-full font-bold text-lg transition-colors">
        Manifest Randomly
      </button>
    </div>
  );
};

export default GodSelector;
