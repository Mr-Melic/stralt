import assert from "node:assert/strict";
import {
  adminGameConfigSaveConfirmBody,
  adminLevelUpSaveConfirmBody,
  adminPaletteSaveConfirmBody,
  adminTierSaveConfirmBody,
} from "./adminOwnerUx.livePublish.ts";

const paletteSave = adminPaletteSaveConfirmBody();
assert.equal(paletteSave.includes("canister immediately"), true);
assert.equal(paletteSave.includes("not a browser draft"), true);
assert.equal(paletteSave.includes("local palette cache only"), false);

const tier = adminTierSaveConfirmBody();
assert.equal(tier.includes("live enemy-tier spawn mix immediately"), true);
assert.equal(tier.includes("not a browser draft"), true);

const game = adminGameConfigSaveConfirmBody();
assert.equal(game.includes("ground Doka"), true);
assert.equal(game.includes("no staged draft"), true);

const levelUp = adminLevelUpSaveConfirmBody();
assert.equal(levelUp.includes("nine LevelUpConfig"), true);
assert.equal(levelUp.includes("not a browser draft"), true);
