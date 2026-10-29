import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  summonExpiredActorLabel,
  summonExpiredLog,
} from "./summonExpiredCopy.ts";

const worldSource = readFileSync(
  fileURLToPath(new URL("../components/WorldExploration.tsx", import.meta.url)),
  "utf8",
);

describe("summonExpiredCopy", () => {
  it("names the unit fading, never expired or pieceType", () => {
    assert.equal(
      summonExpiredActorLabel({ name: "Dire Wolf", assignedName: "wolf" }),
      "Dire Wolf",
    );
    assert.equal(
      summonExpiredLog("Dire Wolf"),
      "Dire Wolf fades from the field.",
    );
    assert.equal(/expired/i.test(summonExpiredLog("Dire Wolf")), false);
    assert.equal(/pieceType/.test(summonExpiredLog("Dire Wolf")), false);
  });

  it("is not wired — WorldExploration still logs pieceType expired", () => {
    assert.match(
      worldSource,
      /\$\{nextCombatant\.pieceType \?\? "Summon"\} expired/,
    );
    assert.equal(worldSource.includes("summonExpiredCopy"), false);
  });
});
