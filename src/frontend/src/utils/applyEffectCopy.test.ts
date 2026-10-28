import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { applyEffectLog, applyEffectTargetLabel } from "./applyEffectCopy.ts";

const worldSource = readFileSync(
  fileURLToPath(new URL("../components/WorldExploration.tsx", import.meta.url)),
  "utf8",
);

describe("applyEffectCopy", () => {
  it("names you / the unit, never a raw targetId", () => {
    assert.equal(applyEffectTargetLabel("player"), "you");
    assert.equal(
      applyEffectTargetLabel("e-3", "Wraith Bishop"),
      "Wraith Bishop",
    );
    assert.equal(applyEffectTargetLabel("e-3"), "an enemy");
    assert.equal(
      applyEffectLog({
        effectName: "Fury",
        targetLabel: "you",
        duration: 3,
        isDot: false,
        signedMag: "+2",
        stat: "ap",
      }),
      "Fury: +2 AP on you (3 turns).",
    );
    assert.equal(
      applyEffectLog({
        effectName: "Poison",
        targetLabel: "Wraith Bishop",
        duration: 2,
        isDot: true,
        dmgPerTurn: 3,
      }),
      "Poison: 3 damage per turn on Wraith Bishop (2 turns).",
    );
    assert.equal(
      /e-\d/.test(applyEffectTargetLabel("e-3", "Wraith Bishop")),
      false,
    );
  });

  it("is not wired — WorldExploration still interpolates effect.targetId", () => {
    assert.match(
      worldSource,
      /effect\.targetId === "player" \? "you" : effect\.targetId/,
    );
    assert.equal(worldSource.includes("applyEffectCopy"), false);
  });
});
