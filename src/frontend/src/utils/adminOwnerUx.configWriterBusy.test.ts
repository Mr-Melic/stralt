import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createOwnerConfigWriterLock,
  endOwnerConfigWriter,
  ownerConfigWriterControlLabel,
  shouldBlockOwnerConfigWriter,
  tryBeginOwnerConfigWriter,
} from "./adminOwnerUx.configWriterBusy.ts";

describe("owner config writer busy lock", () => {
  it("lets the first live publish through and blocks a second click", () => {
    const lock = createOwnerConfigWriterLock();
    assert.equal(shouldBlockOwnerConfigWriter(lock), false);
    assert.equal(tryBeginOwnerConfigWriter(lock, "bossRush"), true);
    assert.equal(shouldBlockOwnerConfigWriter(lock), true);
    assert.equal(tryBeginOwnerConfigWriter(lock, "bossRush"), false);
    assert.equal(tryBeginOwnerConfigWriter(lock, "ads"), false);
    assert.equal(
      ownerConfigWriterControlLabel({
        op: "bossRush",
        lock,
        idle: "Publish Boss Rush",
      }),
      "Publishing…",
    );
  });

  it("unlocks after the actor returns so a later writer can run", () => {
    const lock = createOwnerConfigWriterLock();
    assert.equal(tryBeginOwnerConfigWriter(lock, "levelUp"), true);
    endOwnerConfigWriter(lock);
    assert.equal(shouldBlockOwnerConfigWriter(lock), false);
    assert.equal(tryBeginOwnerConfigWriter(lock, "palette"), true);
    assert.equal(
      ownerConfigWriterControlLabel({
        op: "ads",
        lock,
        idle: "Save",
      }),
      "Save",
    );
  });

  it("treats a missing lock as idle", () => {
    assert.equal(shouldBlockOwnerConfigWriter(null), false);
    assert.equal(shouldBlockOwnerConfigWriter(undefined), false);
  });
});
