import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ownerNameAddControlLabel,
  ownerNameInitControlLabel,
  ownerNameIsDuplicate,
  shouldBlockOwnerNameMutate,
  shouldSubmitOwnerNameAdd,
  shouldSubmitOwnerNameInit,
} from "./adminOwnerUx.namesBusy.ts";

describe("owner name-pool busy lock", () => {
  it("blocks Add / Enter / Load Defaults while a mutate is pending", () => {
    assert.equal(shouldBlockOwnerNameMutate(true), true);
    assert.equal(shouldBlockOwnerNameMutate(false), false);
    assert.equal(
      shouldSubmitOwnerNameAdd({
        pending: true,
        name: "Ashen",
        existing: [],
      }),
      false,
    );
    assert.equal(
      shouldSubmitOwnerNameInit({ pending: true, poolEmpty: true }),
      false,
    );
  });

  it("rejects empty and duplicate names before the actor write", () => {
    assert.equal(ownerNameIsDuplicate("Ashen", ["ashen", "Vesper"]), true);
    assert.equal(ownerNameIsDuplicate("  Ashen  ", ["Ashen"]), true);
    assert.equal(ownerNameIsDuplicate("Nyx", ["Ashen"]), false);
    assert.equal(ownerNameIsDuplicate("   ", ["Ashen"]), false);
    assert.equal(
      shouldSubmitOwnerNameAdd({
        pending: false,
        name: "   ",
        existing: [],
      }),
      false,
    );
    assert.equal(
      shouldSubmitOwnerNameAdd({
        pending: false,
        name: "Ashen",
        existing: ["Ashen"],
      }),
      false,
    );
    assert.equal(
      shouldSubmitOwnerNameAdd({
        pending: false,
        name: "Nyx",
        existing: ["Ashen"],
      }),
      true,
    );
  });

  it("only offers Load Defaults on an empty idle pool", () => {
    assert.equal(
      shouldSubmitOwnerNameInit({ pending: false, poolEmpty: true }),
      true,
    );
    assert.equal(
      shouldSubmitOwnerNameInit({ pending: false, poolEmpty: false }),
      false,
    );
  });

  it("uses busy labels while pending", () => {
    assert.equal(ownerNameAddControlLabel(true), "Adding…");
    assert.equal(ownerNameAddControlLabel(false), "+ Add Name");
    assert.equal(ownerNameInitControlLabel(true), "Loading defaults…");
    assert.equal(ownerNameInitControlLabel(false), "Load Defaults");
  });
});
