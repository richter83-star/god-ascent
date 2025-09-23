export class SaveLoadManager {
  static SAVE_KEY = 'godAscentSave';

  static save({ god, world, queue }) {
    try {
      const saveData = {
        god,
        world: {
          size: world.size,
          tiles: Array.from(world.tiles.entries()).map(([key, tile]) => [key, tile])
        },
        queue: {
          turn: queue.turn,
          queue: queue.queue.map(e => ({ ...e, randomSeed: e.randomSeed }))
        },
        timestamp: Date.now()
      };
      localStorage.setItem(this.SAVE_KEY, JSON.stringify(saveData));
      return true;
    } catch (err) {
      console.error('Save failed:', err);
      return false;
    }
  }

  static load() {
    try {
      const raw = localStorage.getItem(this.SAVE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (Date.now() - data.timestamp > 30 * 24 * 60 * 60 * 1000) {
        localStorage.removeItem(this.SAVE_KEY);
        return null;
      }
      const world = new HexWorld(data.world.size);
      data.world.tiles.forEach(([key, tile]) => world.tiles.set(key, tile));
      const queue = new EventsQueue(data.god, world);
      queue.turn = data.queue.turn;
      queue.queue = data.queue.queue;
      return { god: data.god, world, queue };
    } catch (err) {
      console.error('Load failed:', err);
      localStorage.removeItem(this.SAVE_KEY);
      return null;
    }
  }

  static clear() {
    localStorage.removeItem(this.SAVE_KEY);
  }
}