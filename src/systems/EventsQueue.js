import { eventTemplates } from '../data/events.js';

export class EventsQueue {
  constructor(god, world) {
    this.god = god;
    this.world = world;
    this.queue = [];
    this.turn = 0;
    this.scene = null;
    this.populateQueue();
  }

  populateQueue() {
    this.queue = eventTemplates.filter(template => this.meetsTrigger(template))
      .map(template => ({ ...template, randomSeed: Math.random() }))
      .sort(() => Math.random() - 0.5).slice(0, 5);
  }

  meetsTrigger(template) {
    if (template.trigger?.minVillages && this.world.tiles.size < template.trigger.minVillages) return false;
    if (template.trigger?.fearThreshold && this.avgFear() < template.trigger.fearThreshold) return false;
    if (template.trigger?.tyrannyThreshold && this.god.attrs.tyranny < template.trigger.tyrannyThreshold) return false;
    if (template.trigger?.charismaThreshold && this.god.attrs.charisma < template.trigger.charismaThreshold) return false;
    if (template.trigger?.absentmindedThreshold && this.god.attrs.absentminded < template.trigger.absentmindedThreshold) return false;
    if (template.trigger?.believersThreshold && this.god.believers.total < template.trigger.believersThreshold) return false;
    if (template.trigger?.randomChance && Math.random() > template.trigger.randomChance) return false;
    return true;
  }

  avgFear() {
    let totalFear = 0, totalBelievers = 0;
    this.world.tiles.forEach(tile => {
      const b = tile.believers;
      totalFear += b.fear;
      totalBelievers += b.love + b.fear;
    });
    return totalBelievers > 0 ? totalFear / totalBelievers : 0;
  }

  getNextEvent() {
    if (this.queue.length === 0) this.populateQueue();
    const event = this.queue.shift();
    if (this.scene) {
      this.scene.events.emit('eventTriggered', { event, animTriggers: event.animTriggers });
    }
    return event;
  }

  addFollowUp(eventId, outcomeEthics) {
    const followUpId = eventTemplates.find(e => e.id === eventId)?.followUps?.[outcomeEthics];
    if (followUpId) {
      const followUpTemplate = eventTemplates.find(e => e.name === followUpId);
      if (followUpTemplate) this.queue.unshift({ ...followUpTemplate });
    }
  }

  advanceTurn() {
    this.turn++;
    if (this.turn % 5 === 0) this.populateQueue();
  }
}