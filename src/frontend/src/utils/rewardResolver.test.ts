import { computeVictoryExp } from "./rewardResolver";

function assertEqual(actual: number, expected: number, label: string): void {
  if (actual !== expected) {
    throw new Error(`${label}: expected ${expected}, got ${actual}`);
  }
}

assertEqual(
  computeVictoryExp(0, [{ level: 3 }, { level: 5 }], 4),
  160,
  "derive from kills when expGained is 0",
);
assertEqual(
  computeVictoryExp(undefined, [{ level: 2 }], 4),
  40,
  "derive from kills when expGained is omitted",
);
assertEqual(
  computeVictoryExp(90, [{ level: 2 }], 4),
  90,
  "prefer explicit positive grant",
);
assertEqual(
  computeVictoryExp(0, [], 7),
  140,
  "fallback to characterLevel * 20",
);
assertEqual(computeVictoryExp(0, [], 0), 20, "fallback level floors at 1");

console.log("computeVictoryExp tests passed");
