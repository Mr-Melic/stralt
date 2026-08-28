import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  applySpendToCommitted,
  createProgressPersist,
  spendFromUiBalance,
} from "./progressPersist.ts";
import {
  RENAME_DOKA_COST,
  readRenameCharacterResult,
  shouldDebitRenameDoka,
} from "./renameCharacter.ts";

describe("readRenameCharacterResult", () => {
  it("accepts ok / _ok / __kind__ payloads", () => {
    assert.deepEqual(readRenameCharacterResult({ __kind__: "ok", ok: null }), {
      ok: true,
    });
    assert.deepEqual(readRenameCharacterResult({ ok: null }), { ok: true });
    assert.deepEqual(readRenameCharacterResult({ _ok: null }), { ok: true });
  });

  it("rejects canister errors so the UI cannot debit", () => {
    const taken = readRenameCharacterResult({
      __kind__: "err",
      err: "Name already in use",
    });
    assert.deepEqual(taken, { err: "Name already in use" });
    assert.equal(shouldDebitRenameDoka(taken), false);

    const short = readRenameCharacterResult({
      err: "Not enough Doka. Need 100, have 40",
    });
    assert.equal(shouldDebitRenameDoka(short), false);
    assert.equal(readRenameCharacterResult(undefined).err != null, true);
  });

  it("does not treat a rejected rename as a persist spend", () => {
    const parsed = readRenameCharacterResult({
      __kind__: "err",
      err: "Name already in use",
    });
    assert.equal(shouldDebitRenameDoka(parsed), false);

    const lock = createProgressPersist({ doka: 200, xp: 0, level: 1 });
    // Correct path: leave the live wallet alone so idle hydrate keeps 200.
    assert.equal(lock.hydrateWhenIdle({ doka: 200, xp: 0, level: 1 }), true);
    const healWrite = applySpendToCommitted(
      lock.snapshot().doka,
      spendFromUiBalance(200, 170),
    );
    assert.equal(healWrite, 170);
  });

  it("documents the data-loss if the UI debit is applied on err", () => {
    const lock = createProgressPersist({ doka: 200, xp: 0, level: 1 });
    // Bug: handler deducted UI to 100, then hydrateWhenIdle copied it in.
    lock.hydrateWhenIdle({
      doka: 200 - RENAME_DOKA_COST,
      xp: 0,
      level: 1,
    });
    const healWrite = applySpendToCommitted(
      lock.snapshot().doka,
      spendFromUiBalance(100, 70),
    );
    // Canister was 200; a 30 Doka heal should leave 170. The phantom
    // rename spend ate 100 and the next saveBattleStats writes 70.
    assert.equal(healWrite, 70);
  });
});
