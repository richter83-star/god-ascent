export const eventTemplates = [
  {
    id: 1, name: 'Plague Outbreak', desc: 'A sickness ravages your villages. Mortals cry for aid.', trigger: { minVillages: 3, fearThreshold: 0.6 }, coas: [
      { id: 1, name: 'Cure with Mercy (Love-Aligned)', ethics: 'love', risk: 'high', delta: { love: 30, fear: -15 } },
      { id: 2, name: 'Quarantine Harshly (Neutral)', ethics: 'neutral', risk: 'medium', delta: { love: -15, fear: 40 } },
      { id: 3, name: 'Demand Offerings (Fear-Aligned)', ethics: 'fear', risk: 'low', delta: { love: 0, fear: 10 } }
    ], animTriggers: { love: 'pray', neutral: 'idle', fear: 'cower' }, followUps: { love: 'Pilgrim Surge', fear: 'Hidden Resentment' }
  },
  {
    id: 2, name: 'Rebellion Stirrings', desc: 'Whispers of revolt echo in fear-torn lands.', trigger: { tyrannyThreshold: 0.7 }, coas: [
      { id: 1, name: 'Offer Concessions', ethics: 'love', risk: 'medium', delta: { love: 15, fear: -10 } },
      { id: 2, name: 'Crush with Wrath', ethics: 'fear', risk: 'high', delta: { love: -5, fear: 25 } },
      { id: 3, name: 'Ignore and Observe', ethics: 'neutral', risk: 'low', delta: { love: 5, fear: 5 } }
    ], animTriggers: { love: 'idle', neutral: 'idle', fear: 'riot' }, followUps: { fear: 'Full Uprising', love: 'Loyalty Boost' }
  },
  {
    id: 3, name: 'Harvest Festival', desc: 'Bountiful season—mortals celebrate, seeking your blessing.', trigger: { charismaThreshold: 0.5, randomChance: 0.3 }, coas: [
      { id: 1, name: 'Join the Revels', ethics: 'love', risk: 'low', delta: { love: 25, fear: 0 } },
      { id: 2, name: 'Tax the Joy', ethics: 'fear', risk: 'medium', delta: { love: -5, fear: 20 } },
      { id: 3, name: 'Absentmindedly Forget', ethics: 'neutral', risk: 'high', delta: { love: 10, fear: -5 } }
    ], animTriggers: { love: 'pray', neutral: 'idle', fear: 'cower' }
  },
  {
    id: 4, name: 'Oracle Vision', desc: 'A seer glimpses your future—act on the prophecy?', trigger: { absentmindedThreshold: 0.4, randomChance: 0.2 }, coas: [
      { id: 1, name: 'Heed and Adapt', ethics: 'love', risk: 'medium', delta: { love: 15, fear: 5 } },
      { id: 2, name: 'Dismiss as Nonsense', ethics: 'neutral', risk: 'low', delta: { love: -5, fear: 0 } },
      { id: 3, name: 'Twist for Power', ethics: 'fear', risk: 'high', delta: { love: -10, fear: 20 } }
    ], animTriggers: { love: 'pray', neutral: 'idle', fear: 'riot' }
  },
  {
    id: 5, name: 'Rival Incursion', desc: 'A stronger deity eyes your lands—defend or ally?', trigger: { believersThreshold: 100 }, coas: [
      { id: 1, name: 'Forge Alliance', ethics: 'love', risk: 'high', delta: { love: 20, fear: -10 } },
      { id: 2, name: 'Fight Back Fiercely', ethics: 'fear', risk: 'medium', delta: { love: -5, fear: 25 } },
      { id: 3, name: 'Evade Slyly', ethics: 'neutral', risk: 'low', delta: { love: 5, fear: 5 } }
    ], animTriggers: { love: 'idle', neutral: 'idle', fear: 'riot' }
  }
];