// This line now imports directly from a CDN, no 'npm install' needed!
import { createNoise2D } from 'https://cdn.skypack.dev/simplex-noise';

export class HexWorld {
  constructor(size = 5) {
    this.size = size;
    // We pass a random function to the noise creator to ensure
    // that every new game gets a unique, non-repeating world seed.
    this.noise2D = createNoise2D(Math.random);
    this.tiles = this.generate();
    this.believerDensity = {};
  }

  generate() {
    const tiles = new Map();
    // The 'scale' variable controls the "zoom" level of our noise map.
    // A smaller number means larger, broader continents.
    // A larger number means smaller, more frequent islands.
    const scale = 10; 

    for (let q = -this.size; q <= this.size; q++) {
      for (let r = Math.max(-this.size, -q - this.size); r <= Math.min(this.size, -q + this.size); r++) {
        const key = `${q}_${r}`;
        
        // Get the noise value for this coordinate. It will be between -1 and 1.
        const noiseValue = this.noise2D(q / scale, r / scale);

        let tileType;
        // Use the noise value to determine the tile type.
        // This creates logical clusters of tile types.
        if (noiseValue > 0.6) {
          tileType = 'temple'; // High peaks
        } else if (noiseValue > 0.1) {
          tileType = 'village'; // Grassy plains
        } else {
          tileType = 'wilds'; // Untamed wilderness
        }

        tiles.set(key, {
          type: tileType,
          believers: { love: Math.random() * 10, fear: Math.random() * 5 },
          coords: { q, r }
        });
      }
    }
    return tiles;
  }

  updateBelievers(delta) {
    const totalTiles = this.tiles.size;
    for (const [key, tile] of this.tiles) {
      tile.believers.love += delta.love / totalTiles;
      tile.believers.fear += delta.fear / totalTiles;
      this.believerDensity[key] = (tile.believers.love / (tile.believers.love + tile.believers.fear)) * 100;
    }
  }

  expand() {
    this.size += 1;
    this.tiles = this.generate(); 
  }

  getNeighbors(q, r) {
    const dirs = [[1,0],[1,-1],[0,-1],[-1,0],[-1,1],[0,1]];
    return dirs.map(([dq, dr]) => ({ q: q + dq, r: r + dr }));
  }
}
