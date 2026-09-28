import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ownerBossRowLifecycle,
  ownerLifecycleFromFlags,
  ownerSaveButtonLabel,
  ownerSaveSuccessCopy,
} from "./adminOwnerUx.lifecycle.ts";

describe("ownerLifecycleFromFlags", () => {
  it("never treats a saved local draft as live", () => {
    const view = ownerLifecycleFromFlags({
      localDraftOnly: true,
      publishedLive: true,
      active: true,
    });
    assert.equal(view.state, "DRAFT");
    assert.equal(view.appearsLive, false);
    assert.match(view.detail, /not live/i);
  });

  it("marks unpublished ready configs as READY TO ACTIVATE, not ACTIVE", () => {
    const view = ownerLifecycleFromFlags({
      publishedLive: false,
      readyToActivate: true,
      active: true,
    });
    assert.equal(view.state, "READY_TO_ACTIVATE");
    assert.equal(view.appearsLive, false);
  });

  it("keeps canister-inactive rows from looking live", () => {
    const view = ownerLifecycleFromFlags({
      publishedLive: true,
      active: false,
    });
    assert.equal(view.state, "INACTIVE");
    assert.equal(view.appearsLive, false);
  });

  it("uses VALIDATION FAILED before any live badge", () => {
    const view = ownerLifecycleFromFlags({
      publishedLive: true,
      active: true,
      validationError: "range exceeds maxRange",
    });
    assert.equal(view.state, "VALIDATION_FAILED");
    assert.equal(view.appearsLive, false);
    assert.equal(view.detail, "range exceeds maxRange");
  });

  it("labels retired catalog rows LEGACY", () => {
    const view = ownerLifecycleFromFlags({
      publishedLive: true,
      retired: true,
      active: true,
    });
    assert.equal(view.state, "LEGACY");
    assert.equal(view.appearsLive, false);
  });

  it("only reports ACTIVE when published live and not inactive", () => {
    const view = ownerLifecycleFromFlags({
      publishedLive: true,
      active: true,
    });
    assert.equal(view.state, "ACTIVE");
    assert.equal(view.appearsLive, true);
  });
});

describe("owner save vocabulary", () => {
  it("separates draft save from live publish", () => {
    assert.equal(
      ownerSaveButtonLabel({ localDraftOnly: true }),
      "Save browser draft",
    );
    assert.equal(ownerSaveButtonLabel({}), "Publish live");
    assert.match(ownerSaveSuccessCopy({ localDraftOnly: true }), /not live/i);
    assert.equal(ownerSaveSuccessCopy({}), "Published (live)");
  });
});

describe("ownerBossRowLifecycle", () => {
  it("always reports DRAFT for pbv_boss_configs rows", () => {
    const unsaved = ownerBossRowLifecycle(false);
    const saved = ownerBossRowLifecycle(true);
    assert.equal(unsaved.state, "DRAFT");
    assert.equal(saved.state, "DRAFT");
    assert.equal(unsaved.appearsLive, false);
    assert.equal(saved.appearsLive, false);
  });
});
