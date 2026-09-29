import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buffStackRejected,
  chatTextRejected,
  displayNameRejected,
  mixinRoleAssignRejected,
  spellLevelCapRejected,
} from "./adminSafety.securityAudit.ts";

describe("security audit guards", () => {
  it("rejects chat bidi overrides that spoof the previous speaker", () => {
    assert.equal(chatTextRejected("hello"), null);
    assert.equal(
      chatTextRejected("\u202Eolleh"),
      "Message contains control characters",
    );
    assert.equal(
      chatTextRejected("hi\u0000"),
      "Message contains control characters",
    );
    assert.equal(
      chatTextRejected("line1\nAdmin: forged"),
      "Message contains control characters",
    );
  });

  it("rejects the same controls in display names", () => {
    assert.equal(displayNameRejected("Ada"), null);
    assert.equal(
      displayNameRejected("Ada\u202E"),
      "Name contains control characters",
    );
  });

  it("caps upgradeSpell at 99 so minted Doka cannot grow Nat multipliers", () => {
    assert.equal(spellLevelCapRejected(98), null);
    assert.equal(
      spellLevelCapRejected(99),
      "Spell is already at maximum level",
    );
  });

  it("caps buff stacks at 99", () => {
    assert.equal(buffStackRejected(98), null);
    assert.equal(buffStackRejected(99), "Inventory stack is full");
  });

  it("blocks mixin assignCallerUserRole self-demotion and #guest", () => {
    assert.equal(
      mixinRoleAssignRejected({
        isAdmin: true,
        callerText: "aaaa",
        targetText: "aaaa",
        role: "user",
      }),
      "Refusing self-demotion: another admin must change your role",
    );
    assert.equal(
      mixinRoleAssignRejected({
        isAdmin: true,
        callerText: "aaaa",
        targetText: "bbbb",
        role: "guest",
      }),
      'role must be "admin" or "user"',
    );
    assert.equal(
      mixinRoleAssignRejected({
        isAdmin: true,
        callerText: "aaaa",
        targetText: "bbbb",
        role: "user",
      }),
      null,
    );
  });
});
