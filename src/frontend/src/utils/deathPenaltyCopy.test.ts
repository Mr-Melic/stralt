import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DEATH_LEVEL_KEPT,
  DEFEAT_XP_BASIS,
  FLEE_CONFIRM,
  FLEE_TITLE,
  deathDokaLostLine,
  deathXpLostLine,
} from "./deathPenaltyCopy.ts";

describe("deathPenaltyCopy", () => {
  it("names leftover XP on flee surfaces", () => {
    assert.match(FLEE_TITLE, /leftover XP/i);
    assert.match(FLEE_TITLE, /40% Doka/);
    assert.match(FLEE_CONFIRM, /leftover XP/i);
    assert.equal(/lose 20% XP[^l]/i.test(FLEE_CONFIRM), false);
  });

  it("formats Game Over amount lines with leftover / percent", () => {
    assert.equal(deathXpLostLine(12), "−12 leftover XP (20% of this level)");
    assert.equal(deathDokaLostLine(40), "−40 Doka (40% penalty)");
    assert.match(DEFEAT_XP_BASIS, /leftover XP this level/i);
    assert.match(DEATH_LEVEL_KEPT, /level is kept/i);
  });
});
