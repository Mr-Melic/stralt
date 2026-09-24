import assert from "node:assert/strict";
import {
  adminAdClearFailedCopy,
  adminAdSaveFailedCopy,
  adminBossRushPublishConfirmBody,
  adminNamePoolInitConfirmBody,
  adminPaletteResetConfirmBody,
} from "./adminOwnerUx.ts";

const names = adminNamePoolInitConfirmBody();
assert.equal(names.includes("live canister"), true);
assert.equal(names.includes("cannot undo"), true);
assert.equal(names.includes("browser draft"), false);

const rush = adminBossRushPublishConfirmBody();
assert.equal(rush.includes("canister immediately"), true);
assert.equal(rush.includes("not a browser draft"), true);

const palette = adminPaletteResetConfirmBody();
assert.equal(palette.includes("local palette cache"), true);
assert.equal(palette.includes("Save Palette"), true);
assert.equal(palette.includes("immediately live"), false);

assert.equal(adminAdSaveFailedCopy().includes("Failed to save"), true);
assert.equal(adminAdClearFailedCopy().includes("Failed to clear"), true);
