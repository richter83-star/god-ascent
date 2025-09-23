import React, { useState, useEffect, useRef } from 'react';
import GodSelector from './components/GodSelector';
import HexMap from './components/HexMap';
import DecisionMatrix from './components/DecisionMatrix';
import StatsDashboard from './components/StatsDashboard';
import WinScreen from './components/WinScreen';
import { HexWorld } from './systems/HexWorld';
import { EventsQueue } from './systems/EventsQueue';
import { SaveLoadManager } from './systems/SaveLoadManager';
import audioManager from './systems/AudioManager';

function App() {
  const [god, setGod] = useState(null);
  const [world, setWorld] = useState(null);
  const [queue, setQueue] = useState(null);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [showWin, setShowWin] = useState(false);
  const [gameRef, setGameRef] = useState(null);
  const zeusGoal = 1000000;

  useEffect(() => {
    const loaded = SaveLoadManager.load();
    if (loaded) {
      setGod(loaded.god);
      setWorld(loaded.world);
      setQueue(loaded.queue);
    }
  }, []);

  useEffect(() => {
    if (god && world && queue) {
      audioManager.bg.play();
      if (god.believers.total >= zeusGoal) {
        setShowWin(true);
        audioManager.play('win_fanfare');
        audioManager.bg.stop();
        const scene = gameRef?.scene?.scenes[0];
        if (scene) {
          scene.events.emit('eventTriggered', { event: { name: 'Victory!' }, animTriggers: { love: 'pray', fear: 'pray' } });
          if (scene.particles) {
            scene.particles.setTint(0xfbbf24);
            scene.particles.setEmitting(true);
            scene.time.delayedCall(3000, () => scene.particles.setEmitting(false));
          }
        }
      }
    }
  }, [god?.believers.total]);

  useEffect(() => {
    if (gameRef && queue) queue.scene = gameRef.scene.scenes[0];
  }, [gameRef, queue]);

  useEffect(() => {
    if (god) {
      const interval = setInterval(() => {
        queue.advanceTurn();
        if (Math.random() > 0.5 && !currentEvent) {
          const nextEvent = queue.getNextEvent();
          audioManager.onEventTriggered(nextEvent.name);
          setCurrentEvent(nextEvent);
        }
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [god, queue, currentEvent]);

  const handleDecision = (outcome, selectedCoa) => {
    const newBelievers = { ...god.believers, ...outcome };
    const newGod = { ...god, believers: newBelievers };
    setGod(newGod);
    world.updateBelievers(outcome);
    setWorld(world);
    queue.advanceTurn();
    setQueue(queue);
    queue.addFollowUp(currentEvent.id, selectedCoa.ethics);
    SaveLoadManager.save({ god: newGod, world, queue });
    const sfx = selectedCoa.ethics === 'love' ? 'decision_love' : 'decision_fear';
    audioManager.play(sfx, { moodShift: selectedCoa.ethics });
    const scene = gameRef?.scene?.scenes[0];
    if (scene) scene.refreshBelievers();
    if (outcome.love > 10) {
      scene.events.emit('eventTriggered', { event: { name: 'Love Surge' }, animTriggers: { love: 'pray', fear: 'idle' } });
    }
    const fearPct = newBelievers.fear / newBelievers.total;
    if (fearPct > 0.7 && Math.random() < 0.2) {
      const loss = newBelievers.total * 0.1;
      newBelievers.fear -= loss * 0.6;
      newBelievers.love -= loss * 0.4;
      newBelievers.total -= loss;
      alert('Rebellion! Lost 10% believers.');
    }
    setCurrentEvent(null);
  };

  const handleSave = () => SaveLoadManager.save({ god, world, queue });
  const handleLoad = () => {
    const loaded = SaveLoadManager.load();
    if (loaded) {
      setGod(loaded.god);
      setWorld(loaded.world);
      setQueue(loaded.queue);
    }
  };
  const handleClear = () => {
    SaveLoadManager.clear();
    setGod(null);
    setWorld(null);
    setQueue(null);
  };

  if (!god) {
    return <GodSelector onSelect={(newGod) => {
      const fullGod = { ...newGod, believers: { love: 10, fear: 5, total: 15 } };
      setGod(fullGod);
    }} />;
  }

  return (
    <div className="h-screen flex flex-col relative">
      <StatsDashboard god={god} queue={queue} zeusGoal={zeusGoal} onSave={handleSave} onLoad={handleLoad} onClear={handleClear} />
      <HexMap god={god} world={world} onTileSelect={(tile) => {
        if (Math.random() > 0.8 && queue.queue.length > 0) {
          const nextEvent = queue.getNextEvent();
          audioManager.onEventTriggered(nextEvent.name);
          setCurrentEvent(nextEvent);
        }
      }} setGameRef={setGameRef} />
      {currentEvent && (
        <DecisionMatrix god={god} event={currentEvent} onDecisionMade={(outcome, selectedCoa) => handleDecision(outcome, selectedCoa)} />
      )}
      {showWin && <WinScreen onReplay={() => { setGod(null); setShowWin(false); }} />}
    </div>
  );
}

export default App;