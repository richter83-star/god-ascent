import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { MapScene } from '../phaser-scenes/MapScene.js';

const HexMap = ({ god, world, onTileSelect, setGameRef }) => {
  const gameRef = useRef(null);

  useEffect(() => {
    if (gameRef.current) return;

    const config = {
      type: Phaser.AUTO,
      width: '100%',
      height: 400,
      parent: 'phaser-container',
      scene: [MapScene],
      backgroundColor: '#87CEEB'
    };

    const game = new Phaser.Game(config);
    gameRef.current = game;
    setGameRef(game);

    game.scene.scenes[0].init({ world });

    game.events.on('tileSelected', (tile) => onTileSelect(tile));

    return () => {
      game.destroy(true);
    };
  }, [world, onTileSelect, setGameRef]);

  useEffect(() => {
    if (gameRef.current?.scene?.scenes[0]) {
      const scene = gameRef.current.scene.scenes[0];
      scene.world = world;
      scene.drawHexes();
      scene.refreshBelievers();
      if (god.believers.total > 500 && scene.world.size < 7) scene.world.expand();
    }
  }, [god, world]);

  return <div id="phaser-container" className="w-full h-[400px] border rounded" />;
};

export default HexMap;