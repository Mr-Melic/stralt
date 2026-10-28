import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ownerGameKeyStatusCopy } from "./adminOwnerUx.ownerStatus.ts";
import { playerGameKeyStatusCopy } from "./dokaGameKey.ts";

describe("ownerGameKeyStatusCopy", () => {
  it("does not tell the operator the player already has email", () => {
    assert.equal(
      ownerGameKeyStatusCopy("approved", false),
      "Approved — awaiting email",
    );
    assert.equal(
      ownerGameKeyStatusCopy("approved", true),
      "Approved — marked emailed",
    );
    assert.equal(
      /check email/i.test(ownerGameKeyStatusCopy("approved", false)),
      false,
    );
    assert.equal(
      /your GameKey/i.test(ownerGameKeyStatusCopy("approved", true)),
      false,
    );
  });

  it("keeps pending / redeemed / rejected as owner vocabulary", () => {
    assert.equal(ownerGameKeyStatusCopy("pending", false), "Pending approval");
    assert.equal(ownerGameKeyStatusCopy("redeemed", true), "Redeemed");
    assert.equal(ownerGameKeyStatusCopy("rejected", false), "Rejected");
    assert.equal(
      /cancelled/i.test(ownerGameKeyStatusCopy("rejected", false)),
      false,
    );
  });

  it("stays distinct from the player Buy Doka string used on main", () => {
    assert.match(playerGameKeyStatusCopy("approved"), /check email/i);
    assert.notEqual(
      ownerGameKeyStatusCopy("approved", false),
      playerGameKeyStatusCopy("approved"),
    );
    assert.notEqual(
      ownerGameKeyStatusCopy("pending", false),
      playerGameKeyStatusCopy("pending"),
    );
  });
});
