import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ownerConfigFormIsLive,
  ownerConfigHydrateHonestyCopy,
  ownerConfigSurfaceHydratesOnMain,
  ownerPaletteResetHonestyCopy,
  ownerPaletteResetIsLiveRevert,
} from "./adminOwnerUx.configHydrate.ts";

describe("owner config hydrate honesty", () => {
  it("does not treat a localStorage-only Tiers / Visuals form as live", () => {
    assert.equal(
      ownerConfigFormIsLive({
        calledCanisterRead: false,
        readSucceeded: false,
      }),
      false,
    );
    const copy = ownerConfigHydrateHonestyCopy({
      calledCanisterRead: false,
      readSucceeded: false,
      seededFromLocalStorage: true,
    });
    assert.match(copy, /Browser cache only/);
    assert.match(copy, /not the live canister/);
    assert.equal(/showing live/i.test(copy), false);
  });

  it("treats a successful canister read as live even if localStorage seeded first", () => {
    assert.equal(
      ownerConfigFormIsLive({
        calledCanisterRead: true,
        readSucceeded: true,
      }),
      true,
    );
    const copy = ownerConfigHydrateHonestyCopy({
      calledCanisterRead: true,
      readSucceeded: true,
      seededFromLocalStorage: true,
    });
    assert.match(copy, /live canister/);
    assert.match(copy, /seed only/i);
  });

  it("keeps a failed hydrate as a local draft", () => {
    assert.equal(
      ownerConfigFormIsLive({
        calledCanisterRead: true,
        readSucceeded: false,
      }),
      false,
    );
    assert.match(
      ownerConfigHydrateHonestyCopy({
        calledCanisterRead: true,
        readSucceeded: false,
        seededFromLocalStorage: true,
      }),
      /local draft/i,
    );
  });

  it("does not call a localStorage palette Reset a live revert", () => {
    assert.equal(
      ownerPaletteResetIsLiveRevert({
        clearedLocalStorage: true,
        calledAdminRollback: false,
      }),
      false,
    );
    const copy = ownerPaletteResetHonestyCopy({
      calledAdminRollback: false,
    });
    assert.match(copy, /Live palette is unchanged/);
    assert.equal(/rolled back/i.test(copy), false);
  });

  it("documents which main surfaces actually hydrate", () => {
    assert.equal(ownerConfigSurfaceHydratesOnMain("tiers"), false);
    assert.equal(ownerConfigSurfaceHydratesOnMain("palette"), false);
    assert.equal(ownerConfigSurfaceHydratesOnMain("levelUp"), true);
    assert.equal(ownerConfigSurfaceHydratesOnMain("bossRush"), true);
    assert.equal(ownerConfigSurfaceHydratesOnMain("gameConfig"), true);
  });
});
