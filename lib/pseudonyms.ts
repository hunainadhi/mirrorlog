const adjectives = [
  "Swift", "Calm", "Bold", "Bright", "Sharp", "Deep", "Clear",
  "Quiet", "Fierce", "Steady", "Keen", "Wise", "Cool", "Agile",
  "Focused", "Driven", "Silent", "Brave", "Crisp", "Nimble",
  "Rapid", "Solid", "Stark", "Fluid", "Vivid", "Amber"
];

const nouns = [
  "Falcon", "Oak", "River", "Stone", "Wolf", "Eagle", "Fox",
  "Bear", "Hawk", "Cedar", "Pine", "Storm", "Ridge", "Peak",
  "Creek", "Ember", "Dusk", "Dawn", "Frost", "Tide",
  "Spark", "Blaze", "Cliff", "Grove", "Vale", "Crest"
];

export function generatePseudonym(): string {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 99) + 1;
  return `${adj}${noun}${num}`;
}

export async function generateUniquePseudonym(
  db: import("@prisma/client").PrismaClient
): Promise<string> {
  let attempts = 0;
  while (attempts < 10) {
    const pseudonym = generatePseudonym();
    const existing = await db.user.findUnique({ where: { pseudonym } });
    if (!existing) return pseudonym;
    attempts++;
  }
  // Fallback with timestamp to guarantee uniqueness
  return `${generatePseudonym()}${Date.now().toString().slice(-4)}`;
}