import React from 'react';

const WinScreen = ({ onReplay }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-8 text-center max-w-md w-full animate-fade-in relative overflow-hidden">
        <div className="confetti absolute inset-0 pointer-events-none">
          <div className="confetti-piece" style={{ left: '10%', animationDelay: '0s', background: '#fbbf24', width: '10px', height: '10px', top: '-10px', animation: 'confetti-fall 3s linear infinite' }}></div>
          <div className="confetti-piece" style={{ left: '20%', animationDelay: '0.1s', background: '#ef4444', width: '10px', height: '10px', top: '-10px', animation: 'confetti-fall 4s linear infinite' }}></div>
          <div className="confetti-piece" style={{ left: '30%', animationDelay: '0.2s', background: '#10b981', width: '10px', height: '10px', top: '-10px', animation: 'confetti-fall 2.5s linear infinite' }}></div>
          {/* Add 10+ more for full effect */}
        </div>
        <h1 className="text-4xl font-bold text-purple-800 mb-4 relative z-10">Pantheon Coup!</h1>
        <p className="text-lg mb-6 relative z-10">You've outshone Zeus—1,000,000 worshippers bow to you alone.</p>
        <button onClick={onReplay} className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-bold relative z-10">
          Ascend Again
        </button>
      </div>
      <style jsx>{`
        @keyframes fade-in { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        @keyframes confetti-fall { 0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } }
        .animate-fade-in { animation: fade-in 0.5s ease-out; }
      `}</style>
    </div>
  );
};

export default WinScreen;