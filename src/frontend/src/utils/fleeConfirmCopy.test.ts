import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  FLEE_BUTTON_TITLE,
  FLEE_CONFIRM_BODY,
  fleeRunConfirmBody,
} from "./fleeConfirmCopy.ts";

const battleSource = readFileSync(
  fileURLToPath(new URL("../components/BattleUIPanel.tsx", import.meta.url)),
  "utf8",
);
const worldSource = readFileSync(
  fileURLToPath(new URL("../components/WorldExploration.tsx", import.meta.url)),
  "utf8",
);

describe("fleeConfirmCopy", () => {
  it("names leftover XP, Doka, and the Death Realm", () => {
    assert.match(FLEE_BUTTON_TITLE, /20% leftover XP/);
    assert.match(FLEE_BUTTON_TITLE, /40% Doka/);
    assert.match(FLEE_BUTTON_TITLE, /Death Realm/);
    assert.match(FLEE_CONFIRM_BODY, /20% leftover XP/);
    assert.match(FLEE_CONFIRM_BODY, /40% Doka/);
    assert.match(fleeRunConfirmBody("Boss Rush"), /Boss Rush/);
    assert.match(fleeRunConfirmBody("Dungeon Chain"), /Dungeon Chain/);
    assert.match(fleeRunConfirmBody("Boss Rush"), /leftover XP/);
  });

  it("hosts still use native window.confirm", () => {
    assert.match(battleSource, /window\.confirm/);
    assert.match(worldSource, /window\.confirm/);
    assert.match(worldSource, /Fleeing ends your/);
  });
});
