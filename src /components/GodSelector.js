// --- Parts for Name Generation ---
const namePrefixes = ['Aethel', 'Boro', 'Cygn', 'Drae', 'Elar', 'Fyr', 'Grym', 'Hael', 'Igni', 'Jorn'];
const nameSuffixes = ['ius', 'os', 'an', 'eon', 'ak', 'yr', 'em', 'or', 'us', 'ain'];

// --- Parts for Description Generation ---
const domains = ['the forgotten depths', 'the swirling chaos', 'the silent moon', 'the roaring flame', 'the cracked earth', 'the endless sky'];
const concepts = ['lost memories', 'fleeting moments', 'raw power', 'ancient secrets', 'the birth of stars', 'the echo of silence'];

// --- Attribute Generation Logic ---
// This function distributes a total number of points randomly among the attributes.
// This ensures gods are balanced and not all-powerful or all-weak.
function generateBalancedAttributes() {
  let points = 1.0; // Total points to distribute (100%)
  const attrs = {
    charisma: 0,
    tyranny: 0,
    absentminded: 0,
  };
  
  // Assign to charisma
  let value = Math.random() * points;
  attrs.charisma = parseFloat(value.toFixed(2));
  points -= attrs.charisma;

  // Assign to tyranny
  value = Math.random() * points;
  attrs.tyranny = parseFloat(value.toFixed(2));
  points -= attrs.tyranny;
  
  // The rest goes to absentminded
  attrs.absentminded = parseFloat(points.toFixed(2));

  // Shuffle the attributes so the distribution isn't always biased towards charisma
  const keys = Object.keys(attrs);
  for (let i = keys.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [keys[i], keys[j]] = [keys[j], keys[i]];
  }
  
  const shuffledAttrs = {};
  keys.forEach(key => {
    const newKey = Object.keys(shuffledAttrs).length === 0 ? 'charisma' : Object.keys(shuffledAttrs).length === 1 ? 'tyranny' : 'absentminded';
    shuffledAttrs[newKey] = attrs[key];
  });

  return attrs; // Returns the original, unshuffled attributes for now. We can add shuffling later if we want more variety.
}

// --- The Main Generator Function ---
export const generateGod = () => {
  const id = Date.now() + Math.random();
  const name = namePrefixes[Math.floor(Math.random() * namePrefixes.length)] + nameSuffixes[Math.floor(Math.random() * nameSuffixes.length)];
  const desc = `A forgotten deity of ${domains[Math.floor(Math.random() * domains.length)]}, whispered to rule over ${concepts[Math.floor(Math.random() * concepts.length)]}.`;
  const attrs = generateBalancedAttributes();

  return { id, name, desc, attrs };
};
