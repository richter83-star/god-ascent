export class Believer {
  constructor(scene, tileKey, type = 'love') {
    this.scene = scene;
    this.type = type;
    this.frame = 0;
    this.animTimer = null;
    this.sprite = scene.add.sprite(0, 0, `believer_${type}`);
    this.sprite.setScale(0.5);
    this.sprite.setDepth(10);
    this.sprite.setData('believer', this);
    this.setPosition(tileKey);
    this.state = 'idle';
  }

  setPosition(tileKey) {
    const [q, r] = tileKey.split('_').map(Number);
    const hexSize = 30;
    const x = hexSize * 1.5 * (q + r / 2) + (Math.random() - 0.5) * 20;
    const y = hexSize * Math.sqrt(3) * (r + 0.5) + (Math.random() - 0.5) * 20;
    this.sprite.setPosition(x, y);
  }

  animate(state) {
    this.state = state;
    this.frame = 0;
    if (this.animTimer) this.animTimer.remove();

    this.animTimer = this.scene.time.addEvent({
      delay: 100,
      callback: () => {
        this.frame = (this.frame + 1) % 4;
        const frameName = `${this.state}_${this.frame}`;
        this.sprite.setTexture('believer_sheet', frameName);
        if (this.frame === 0) this.onAnimComplete(state);
      },
      loop: true
    });

    switch (state) {
      case 'pray':
        this.scene.tweens.add({
          targets: this.sprite,
          y: '+=5',
          duration: 800,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });
        break;
      case 'cower':
        this.sprite.setTint(0x888888);
        this.scene.tweens.add({
          targets: this.sprite,
          scale: 0.7,
          duration: 400,
          yoyo: true,
          repeat: -1
        });
        break;
      case 'riot':
        this.scene.tweens.add({
          targets: this.sprite,
          rotation: '+=0.5',
          duration: 200,
          yoyo: true,
          repeat: -1
        });
        break;
    }
  }

  onAnimComplete(state) {
    if (state === 'pray') {
      this.scene.add.particles(0, 0, 'glow', {
        x: this.sprite.x,
        y: this.sprite.y - 20,
        speed: { min: -20, max: 20 },
        lifespan: 500,
        quantity: 3,
        scale: 0.5,
        blendMode: 'ADD'
      }).explode();
    }
  }

  destroy() {
    if (this.animTimer) this.animTimer.remove();
    this.sprite.destroy();
  }
}