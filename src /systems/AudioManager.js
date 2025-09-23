import { Howl } from 'howler';

class AudioManager {
  constructor() {
    this.sounds = new Map();
    this.bg = null;
    this.muted = false;
    this.init();
  }

  init() {
    this.bg = new Howl({
      src: ['/src/assets/audio/bg_harp.ogg'],
      html5: true,
      loop: true,
      volume: 0.3,
      preload: true
    });

    this.sounds.set('decision_love', new Howl({ src: ['/src/assets/audio/decision_love.mp3'], volume: 0.5 }));
    this.sounds.set('decision_fear', new Howl({ src: ['/src/assets/audio/decision_fear.mp3'], volume: 0.6 }));
    this.sounds.set('event_plague', new Howl({ src: ['/src/assets/audio/event_plague.mp3'], volume: 0.4 }));
    this.sounds.set('event_rebellion', new Howl({ src: ['/src/assets/audio/event_rebellion.mp3'], volume: 0.5 }));
    this.sounds.set('win_fanfare', new Howl({ src: ['/src/assets/audio/win_fanfare.mp3'], volume: 0.7 }));

    this.bg.on('load', () => { if (this.muted) this.bg.mute(true); });
  }

  play(key, { moodShift } = {}) {
    if (this.muted) return;
    const sound = this.sounds.get(key);
    if (sound) sound.play();
    if (moodShift) {
      this.bg.fade(0.5, moodShift === 'love' ? 0.4 : 0.2, 1000);
    }
  }

  stop(key) {
    const sound = this.sounds.get(key);
    if (sound) sound.stop();
  }

  toggleMute() {
    this.muted = !this.muted;
    this.bg.mute(this.muted);
    this.sounds.forEach(sound => sound.mute(this.muted));
  }

  onEventTriggered(eventName) {
    const sfxMap = {
      'Plague Outbreak': 'event_plague',
      'Rebellion Stirrings': 'event_rebellion'
    };
    this.play(sfxMap[eventName] || 'decision_love');
  }
}

export default new AudioManager();