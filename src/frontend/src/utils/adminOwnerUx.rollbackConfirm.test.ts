import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  OWNER_ROLLBACK_PHRASE,
  OWNER_ROLLBACK_WRITERS,
  ownerRollbackConfirmBody,
  ownerRollbackConfirmReady,
  shouldRunOwnerRollback,
} from "./adminOwnerUx.rollbackConfirm.ts";

describe("owner rollback confirm", () => {
  it("lists the five last-good writers once", () => {
    assert.equal(OWNER_ROLLBACK_WRITERS.length, 5);
    assert.equal(new Set(OWNER_ROLLBACK_WRITERS.map((w) => w.method)).size, 5);
  });

  it("requires typed ROLLBACK and a confirm click", () => {
    assert.equal(ownerRollbackConfirmReady("rollback"), false);
    assert.equal(ownerRollbackConfirmReady(OWNER_ROLLBACK_PHRASE), true);
    assert.equal(
      shouldRunOwnerRollback({
        typed: OWNER_ROLLBACK_PHRASE,
        confirmed: false,
      }),
      false,
    );
    assert.equal(
      shouldRunOwnerRollback({
        typed: OWNER_ROLLBACK_PHRASE,
        confirmed: true,
      }),
      true,
    );
  });

  it("does not describe rollback as a draft", () => {
    const body = ownerRollbackConfirmBody("Level-up config");
    assert.match(body, /last-good Level-up config/);
    assert.match(body, /ROLLBACK/);
    assert.equal(/draft/i.test(body), false);
  });
});
