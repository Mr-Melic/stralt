import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  OWNER_BOSS_DRAFT_CHIP,
  OWNER_BOSS_DRAFT_STATUS,
  ownerBossCollapsedRowChip,
  ownerBossCollapsedRowLooksLiveOnMain,
  ownerBossCollapsedRowStatus,
} from "./adminOwnerUx.bossDraftChip.ts";

describe("ownerBossCollapsedRowChip", () => {
  it("labels every collapsed boss row as a browser draft, never live", () => {
    const chip = ownerBossCollapsedRowChip();
    assert.equal(chip, OWNER_BOSS_DRAFT_CHIP);
    assert.match(chip, /DRAFT/);
    assert.match(chip, /browser/i);
    assert.equal(/ACTIVE/i.test(chip), false);
    assert.equal(/canister-live/i.test(chip), false);
    assert.equal(ownerBossCollapsedRowLooksLiveOnMain(), true);
  });

  it("status copy does not claim the Motoko writer is live", () => {
    const status = ownerBossCollapsedRowStatus();
    assert.equal(status, OWNER_BOSS_DRAFT_STATUS);
    assert.match(status, /not canister-live/i);
    assert.equal(/published/i.test(status), false);
  });
});
