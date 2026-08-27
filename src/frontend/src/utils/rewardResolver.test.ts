import { computeVictoryExp } from "./rewardResolver";

function assertEqual(actual: number, expected: number, label: string): void {
  if (actual !== expected) {
    throw new Error(`${label}: expected ${expected}, got ${actual}`);
  }
}

assertEqual(
  computeVictoryExp({
    explicitGrant: 0,
    defeatedEnemies: [
      { name: "a", level: 3 },
      { name: "b", level: 5 },
    ],
    characterLevel: 4,
  }),
  160,
  "derive from kills when explicitGrant is 0",
);
assertEqual(
  computeVictoryExp({
    defeatedEnemies: [{ name: "a", level: 2 }],
    characterLevel: 4,
  }),
  40,
  "derive from kills when explicitGrant is omitted",
);
assertEqual(
  computeVictoryExp({
    explicitGrant: 90,
    defeatedEnemies: [{ name: "a", level: 2 }],
    characterLevel: 4,
  }),
  90,
  "prefer explicit positive grant",
);
assertEqual(
  computeVictoryExp({
    explicitGrant: 0,
    defeatedEnemies: [],
    characterLevel: 7,
  }),
  140,
  "fallback to characterLevel * 20",
);

console.log("computeVictoryExp tests passed");
