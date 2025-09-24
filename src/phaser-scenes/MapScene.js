import Phaser from 'phaser';
import { Believer } from '../entities/Believer.js';

export class MapScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MapScene' });
    this.world = null;
    this.graphics = null;
    this.believers = null;
    this.selectedTile = null;
    this.dragStart = null;
  }

  init(data) {
    this.world = data.world || new HexWorld();
  }

  preload() {
    this.load.atlas('tiles', './assets/images/tile_atlas.png', './assets/images/tile_atlas.json');
    this.load.atlas('believer_sheet', './assets/images/believer_sheet.png', './assets/images/believer_sheet.json');
    this.load.image('glow', './assets/images/glow_particle.png');
  }

  create() {
    this.graphics = this.add.graphics();
    this.cameras.main.setZoom(1);
    this.drawHexes();
    this.believers = this.add.group();
    this.updateBelieversVisuals();

    this.input.on('pointerdown', (pointer) => this.dragStart = { x: pointer.x, y: pointer.y });
    this.input.on('pointerup', (pointer) => {
      if (this.dragStart && Phaser.Math.Distance.Between(this.dragStart.x, this.dragStart.y, pointer.x, pointer.y) < 10) {
        this.handleTileClick(pointer.x, pointer.y);
      }
      this.dragStart = null;
    });
    this.input.on('pointermove', (pointer) => {
      if (this.dragStart) {
        const dx = pointer.x - this.dragStart.x;
        const dy = pointer.y - this.dragStart.y;
        this.cameras.main.scrollX -= dx;
        this.cameras.main.scrollY -= dy;
        this.dragStart = { x: pointer.x, y: pointer.y };
      }
    });

    this.input.on('wheel', (pointer, deltaX, deltaY) => {
      const zoom = deltaY > 0 ? this.cameras.main.zoom * 0.9 : this.cameras.main.zoom * 1.1;
      this.cameras.main.setZoom(Phaser.Math.Clamp(zoom, 0.5, 3));
    });

    this.events.on('eventTriggered', (data) => this.triggerEventAnims(data.event, data.animTriggers));
  }

  drawHexes() {
    this.graphics.clear();
    const hexSize = 40;
    for (const [key, tile] of this.world.tiles) {
      const [q, r] = key.split('_').map(Number);
      const x = hexSize * 1.5 * (q + r / 2) + this.cameras.main.scrollX;
      const y = hexSize * Math.sqrt(3) * (r + 0.5) + this.cameras.main.scrollY;
      const tileImg = this.add.image(x, y, `tile_${tile.type}`);
      tileImg.setScale(0.8);
      tileImg.setDepth(5);
      const density = this.world.believerDensity[key] || 50;
      const hue = 120 - (density / 100) * 120;
      const color = Phaser.Display.Color.HSVToRGB(hue / 360, 1, 0.7).color;
      tileImg.setTint(color);
    }
  }

  updateBelieversVisuals() {
    this.believers.clear(true, true);
    this.world.tiles.forEach((tile, key) => {
      const loveCount = Math.floor(tile.believers.love / 2);
      const fearCount = Math.floor(tile.believers.fear / 2);
      for (let i = 0; i < loveCount; i++) {
        const believer = new Believer(this, key, 'love');
        believer.animate('pray');
        const sprite = believer.sprite;
        sprite.setData('believer', believer);
        this.believers.add(sprite);
      }
      for (let i = 0; i < fearCount; i++) {
        const believer = new Believer(this, key, 'fear');
        believer.animate('cower');
        const sprite = believer.sprite;
        sprite.setData('believer', believer);
        this.believers.add(sprite);
      }
    });

    if (!this.particles) {
      this.particles = this.add.particles(0, 0, 'glow', {
        speed: 20,
        lifespan: 2000,
        quantity: god?.believers.total || 0,
        scale: { start: 1, end: 0 },
        blendMode: 'ADD',
        emitting: false
      });
      this.particles.setDepth(5);
    }
    this.particles.setEmitting(true);
    this.time.delayedCall(1000, () => this.particles.setEmitting(false));
  }

  triggerEventAnims(event, triggers) {
    this.believers.getChildren().forEach((sprite) => {
      const believer = sprite.getData('believer');
      if (believer) {
        const state = triggers[believer.type] || 'idle';
        believer.animate(state);
      }
    });

    const particleKey = 'glow'; // Or event-specific
    if (!this.eventParticles) {
      this.eventParticles = this.add.particles(0, 0, particleKey, {
        speed: { min: -50, max: 50 },
        lifespan: 2000,
        quantity: 20,
        scale: { start: 1, end: 0 },
        blendMode: 'ADD',
        alpha: { start: 1, end: 0 },
        follow: this.cameras.main
      });
    }
    this.eventParticles.setEmitting(true);
    this.eventParticles.setDepth(15);
    this.time.delayedCall(2000, () => this.eventParticles.setEmitting(false));
  }

  handleTileClick(worldX, worldY) {
    let closest = null;
    let minDist = Infinity;
    for (const [key, tile] of this.world.tiles) {
      const [q, r] = key.split('_').map(Number);
      const x = 45 * (q + r / 2) + this.cameras.main.scrollX;
      const y = 39 * Math.sqrt(3) * (r + 0.5) + this.cameras.main.scrollY;
      const dist = Phaser.Math.Distance.Between(worldX, worldY, x, y);
      if (dist < minDist) {
        minDist = dist;
        closest = { key, tile };
      }
    }
    if (minDist < 40) {
      this.selectedTile = closest;
      this.game.events.emit('tileSelected', closest);
    }
    this.drawHexes();
  }

  refreshBelievers() {
    this.updateBelieversVisuals();
  }
}