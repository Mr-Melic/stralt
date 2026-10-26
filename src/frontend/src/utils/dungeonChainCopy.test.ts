import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { dungeonDokaMultiplierFor } from "../engine/portalRules.ts";
import {
  DUNGEON_CHAIN_ENTER_LABEL,
  dungeonChainContinueLabel,
  dungeonChainHudLabel,
  formatDungeonDokaTimes,
} from "./dungeonChainCopy.ts";

const worldSource = readFileSync(
  fileURLToPath(new URL("../components/WorldExploration.tsx", import.meta.url)),
  "utf8",
);

describe("dungeonChainCopy", () => {
  it("formats the persist table without trailing .0", () => {
    assert.equal(
      formatDungeonDokaTimes(dungeonDokaMultiplierFor(true, 1)),
      "×1.5",
    );
    assert.equal(
      formatDungeonDokaTimes(dungeonDokaMultiplierFor(true, 2)),
      "×2",
    );
    assert.equal(
      formatDungeonDokaTimes(dungeonDokaMultiplierFor(true, 5)),
      "×4",
    );
  });

  it("names Doka on the HUD and continue label", () => {
    assert.equal(dungeonChainHudLabel(1, 5), "⚔️ Dungeon 1/5 — Doka ×1.5");
    assert.equal(
      dungeonChainContinueLabel(3, 5),
      "⚔️ Continue Chain (3/5) — Doka ×2.5",
    );
    assert.match(DUNGEON_CHAIN_ENTER_LABEL, /Enter Dungeon Chain/);
    assert.match(DUNGEON_CHAIN_ENTER_LABEL, /Doka/i);
    assert.equal(/multiplier/i.test(dungeonChainHudLabel(2, 5)), false);
  });

  it("is not wired — HUD and nearby labels still omit Doka ×N", () => {
    assert.match(
      worldSource,
      /⚔️ Dungeon \{dungeonChainDepth\}\/\{dungeonChainMaxDepth\}/,
    );
    assert.match(worldSource, /⚔️ Continue Chain \(\$/);
    assert.match(worldSource, /⚔️ Enter Dungeon Chain/);
    assert.equal(worldSource.includes("dungeonChainCopy"), false);
    assert.equal(worldSource.includes("dungeonChainHudLabel"), false);
  });
});
