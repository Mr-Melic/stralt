import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { DeathPenaltyStorage } from "./deathPenalty.ts";
import { createProgressPersist } from "./progressPersist.ts";
import {
  SPELL_LEVEL_KEEP_UNCONFIRMED,
  clearSpellLevelKeepRemount,
  hasSpellLevelKeepRemount,
  honourSpellLevelKeepRemountBeforeUpgrade,
  leftoverUpgradeCallsAfterSpellLevelKeepRemount,
  noteSpellLevelKeepRemount,
  persistSpellUpgradeThroughSpellLevelKeepRemount,
  readSpellLevelKeepRemount,
  replicaSpellLevelFromRecord,
  shouldDebitSpellUpgradeAfterSpellLevelKeep,
  shouldNoteSpellLevelKeepRemount,
  shouldRefuseSpellLevelKeepRemountStaleReplica,
  shouldSkipSpellLevelKeepRemountUpgrade,
  spellLevelKeepRemountKey,
  spellLevelsFromCharacterRecord,
} from "./spellLevelKeepRemountWriteSkip.ts";
import { persistSpellUpgrade } from "./spellUpgrade.ts";

const PLAY_ENTRY_LEVEL = 1;
const CANISTER_AFTER_UPGRADE = 2;
const DOUBLE_UPGRADE_LEVEL = 3;
const SLOT = 1;
const SPELL_ID = "fireball";
const OTHER_SPELL = "heal";

function memStorage(): DeathPenaltyStorage {
  const storage = new Map<string, string>();
  return {
    getItem: (k) => storage.get(k) ?? null,
    setItem: (k, v) => {
      storage.set(k, v);
    },
    removeItem: (k) => {
      storage.delete(k);
    },
  };
}

function remountLock() {
  return createProgressPersist({ doka: 200, xp: 100, level: 4 });
}

function characterRecord(level: number, spellId = SPELL_ID) {
  return {
    spellLevelKeys: [spellId],
    spellLevelValues: [BigInt(level)],
  };
}

describe("spellLevelKeepRemountKey", () => {
  it("uses a new stamp origin, not spend-keep or leftover XP/Doka keys", () => {
    assert.equal(
      spellLevelKeepRemountKey(1),
      "pbv_spell_level_keep_remount_slot1",
    );
    assert.equal(
      spellLevelKeepRemountKey(3),
      "pbv_spell_level_keep_remount_slot3",
    );
    assert.notEqual(
      spellLevelKeepRemountKey(1),
      "pbv_spend_keep_remount_slot1",
    );
    assert.notEqual(
      spellLevelKeepRemountKey(1),
      "pbv_portal_xp_keep_remount_slot1",
    );
    assert.notEqual(
      spellLevelKeepRemountKey(1),
      "pbv_victory_xp_keep_remount_slot1",
    );
    assert.notEqual(
      spellLevelKeepRemountKey(1),
      "pbv_xp_credit_keep_remount_slot1",
    );
    assert.notEqual(
      spellLevelKeepRemountKey(1),
      "pbv_victory_doka_keep_remount_slot1",
    );
    assert.notEqual(
      spellLevelKeepRemountKey(1),
      "pbv_oneshot_doka_keep_remount_slot1",
    );
    assert.notEqual(
      spellLevelKeepRemountKey(1),
      "pbv_gamekey_doka_keep_remount_slot1",
    );
    assert.notEqual(
      spellLevelKeepRemountKey(1),
      "pbv_feat_doka_keep_remount_slot1",
    );
    assert.notEqual(
      spellLevelKeepRemountKey(1),
      "pbv_boss_rush_doka_keep_remount_slot1",
    );
    assert.notEqual(
      spellLevelKeepRemountKey(1),
      "pbv_absolute_doka_throw_keep_remount_slot1",
    );
  });
});

describe("shouldNoteSpellLevelKeepRemount", () => {
  it("notes parsed success when the canister level rose", () => {
    assert.equal(
      shouldNoteSpellLevelKeepRemount({
        spellId: SPELL_ID,
        preLevel: PLAY_ENTRY_LEVEL,
        newLevel: CANISTER_AFTER_UPGRADE,
      }),
      true,
    );
  });

  it("notes transport throw after the replica may already have written", () => {
    assert.equal(
      shouldNoteSpellLevelKeepRemount({
        spellId: SPELL_ID,
        preLevel: PLAY_ENTRY_LEVEL,
        error: new Error("replica went away"),
      }),
      true,
    );
  });

  it("does not note explicit upgradeSpell failed", () => {
    assert.equal(
      shouldNoteSpellLevelKeepRemount({
        spellId: SPELL_ID,
        preLevel: PLAY_ENTRY_LEVEL,
        error: new Error("upgradeSpell failed: Not enough Doka"),
      }),
      false,
    );
    assert.equal(
      shouldNoteSpellLevelKeepRemount({
        spellId: SPELL_ID,
        preLevel: PLAY_ENTRY_LEVEL,
        error: new Error("upgradeSpell failed: Account banned"),
      }),
      false,
    );
  });

  it("does not note a no-op or empty spellId", () => {
    assert.equal(
      shouldNoteSpellLevelKeepRemount({
        spellId: SPELL_ID,
        preLevel: PLAY_ENTRY_LEVEL,
        newLevel: PLAY_ENTRY_LEVEL,
      }),
      false,
    );
    assert.equal(
      shouldNoteSpellLevelKeepRemount({
        spellId: "",
        preLevel: PLAY_ENTRY_LEVEL,
        newLevel: CANISTER_AFTER_UPGRADE,
      }),
      false,
    );
  });
});

describe("note / read / clear SpellLevelKeepRemount", () => {
  it("round-trips { spellId, preLevel }", () => {
    const storage = memStorage();
    assert.equal(hasSpellLevelKeepRemount(storage, SLOT), false);
    noteSpellLevelKeepRemount(storage, SLOT, {
      spellId: SPELL_ID,
      preLevel: PLAY_ENTRY_LEVEL,
      newLevel: CANISTER_AFTER_UPGRADE,
    });
    assert.deepEqual(readSpellLevelKeepRemount(storage, SLOT), {
      spellId: SPELL_ID,
      preLevel: PLAY_ENTRY_LEVEL,
    });
    assert.equal(hasSpellLevelKeepRemount(storage, SLOT), true);
    clearSpellLevelKeepRemount(storage, SLOT);
    assert.equal(readSpellLevelKeepRemount(storage, SLOT), null);
  });

  it("isolates character slots", () => {
    const storage = memStorage();
    noteSpellLevelKeepRemount(storage, 1, {
      spellId: SPELL_ID,
      preLevel: PLAY_ENTRY_LEVEL,
      newLevel: CANISTER_AFTER_UPGRADE,
    });
    noteSpellLevelKeepRemount(storage, 2, {
      spellId: OTHER_SPELL,
      preLevel: 0,
      newLevel: 1,
    });
    assert.deepEqual(readSpellLevelKeepRemount(storage, 1), {
      spellId: SPELL_ID,
      preLevel: PLAY_ENTRY_LEVEL,
    });
    assert.deepEqual(readSpellLevelKeepRemount(storage, 2), {
      spellId: OTHER_SPELL,
      preLevel: 0,
    });
    clearSpellLevelKeepRemount(storage, 1);
    assert.equal(readSpellLevelKeepRemount(storage, 1), null);
    assert.equal(hasSpellLevelKeepRemount(storage, 2), true);
  });

  it("does not stamp explicit upgradeSpell failed", () => {
    const storage = memStorage();
    noteSpellLevelKeepRemount(storage, SLOT, {
      spellId: SPELL_ID,
      preLevel: PLAY_ENTRY_LEVEL,
      error: new Error("upgradeSpell failed: Spell is retired"),
    });
    assert.equal(hasSpellLevelKeepRemount(storage, SLOT), false);
  });
});

describe("spellLevelsFromCharacterRecord", () => {
  it("reads keys/values, bigint, and { ok } bindgen", () => {
    assert.deepEqual(spellLevelsFromCharacterRecord(characterRecord(2)), {
      fireball: 2,
    });
    assert.deepEqual(
      spellLevelsFromCharacterRecord({ ok: characterRecord(2) }),
      { fireball: 2 },
    );
    assert.deepEqual(
      spellLevelsFromCharacterRecord({ _ok: characterRecord(3) }),
      { fireball: 3 },
    );
  });

  it("returns null for missing / non-character payloads", () => {
    assert.equal(spellLevelsFromCharacterRecord(null), null);
    assert.equal(spellLevelsFromCharacterRecord({}), null);
    assert.equal(spellLevelsFromCharacterRecord("nope"), null);
  });

  it("reads a replica level for one spellId", () => {
    assert.equal(replicaSpellLevelFromRecord(characterRecord(2), SPELL_ID), 2);
    assert.equal(
      replicaSpellLevelFromRecord(characterRecord(2), OTHER_SPELL),
      0,
    );
    assert.equal(replicaSpellLevelFromRecord(null, SPELL_ID), null);
  });
});

describe("shouldSkipSpellLevelKeepRemountUpgrade", () => {
  it("skips remount retry when replica already rose past Play-entry", () => {
    assert.equal(
      shouldSkipSpellLevelKeepRemountUpgrade({
        keep: true,
        spellId: SPELL_ID,
        stampedSpellId: SPELL_ID,
        localLevel: PLAY_ENTRY_LEVEL,
        replicaLevel: CANISTER_AFTER_UPGRADE,
      }),
      true,
    );
  });

  it("does not skip a same-session second upgrade (local matches replica)", () => {
    assert.equal(
      shouldSkipSpellLevelKeepRemountUpgrade({
        keep: true,
        spellId: SPELL_ID,
        stampedSpellId: SPELL_ID,
        localLevel: CANISTER_AFTER_UPGRADE,
        replicaLevel: CANISTER_AFTER_UPGRADE,
      }),
      false,
    );
  });

  it("does not skip a different spellId", () => {
    assert.equal(
      shouldSkipSpellLevelKeepRemountUpgrade({
        keep: true,
        spellId: OTHER_SPELL,
        stampedSpellId: SPELL_ID,
        localLevel: 0,
        replicaLevel: 0,
      }),
      false,
    );
  });

  it("does not skip without a keep stamp", () => {
    assert.equal(
      shouldSkipSpellLevelKeepRemountUpgrade({
        keep: false,
        spellId: SPELL_ID,
        stampedSpellId: SPELL_ID,
        localLevel: PLAY_ENTRY_LEVEL,
        replicaLevel: CANISTER_AFTER_UPGRADE,
      }),
      false,
    );
  });

  it("does not skip when replica still equals Play-entry (throw before apply)", () => {
    assert.equal(
      shouldSkipSpellLevelKeepRemountUpgrade({
        keep: true,
        spellId: SPELL_ID,
        stampedSpellId: SPELL_ID,
        localLevel: PLAY_ENTRY_LEVEL,
        replicaLevel: PLAY_ENTRY_LEVEL,
      }),
      false,
    );
  });
});

describe("shouldRefuseSpellLevelKeepRemountStaleReplica", () => {
  it("fail-closes a keep stamp whose replica fetch missed", () => {
    assert.equal(
      shouldRefuseSpellLevelKeepRemountStaleReplica({
        keep: true,
        spellId: SPELL_ID,
        stampedSpellId: SPELL_ID,
        replicaLevel: null,
      }),
      true,
    );
  });

  it("does not refuse a live replica or a different spell", () => {
    assert.equal(
      shouldRefuseSpellLevelKeepRemountStaleReplica({
        keep: true,
        spellId: SPELL_ID,
        stampedSpellId: SPELL_ID,
        replicaLevel: CANISTER_AFTER_UPGRADE,
      }),
      false,
    );
    assert.equal(
      shouldRefuseSpellLevelKeepRemountStaleReplica({
        keep: true,
        spellId: OTHER_SPELL,
        stampedSpellId: SPELL_ID,
        replicaLevel: null,
      }),
      false,
    );
  });
});

describe("shouldDebitSpellUpgradeAfterSpellLevelKeep", () => {
  it("does not debit the lock after a skipped retry", () => {
    assert.equal(
      shouldDebitSpellUpgradeAfterSpellLevelKeep({ skipped: true }),
      false,
    );
    assert.equal(
      shouldDebitSpellUpgradeAfterSpellLevelKeep({ skipped: false }),
      true,
    );
  });
});

describe("leftoverUpgradeCallsAfterSpellLevelKeepRemount", () => {
  it("ungated remount retry calls upgradeSpell again; gated skip is 0", () => {
    assert.equal(
      leftoverUpgradeCallsAfterSpellLevelKeepRemount({
        keep: false,
        spellId: SPELL_ID,
        stampedSpellId: SPELL_ID,
        localLevel: PLAY_ENTRY_LEVEL,
        replicaLevel: CANISTER_AFTER_UPGRADE,
        ungatedCalls: 1,
      }),
      1,
    );
    assert.equal(
      leftoverUpgradeCallsAfterSpellLevelKeepRemount({
        keep: true,
        spellId: SPELL_ID,
        stampedSpellId: SPELL_ID,
        localLevel: PLAY_ENTRY_LEVEL,
        replicaLevel: CANISTER_AFTER_UPGRADE,
        ungatedCalls: 1,
      }),
      0,
    );
  });
});

describe("ungated remount retry double-charges", () => {
  it("Play-entry keys after success make a second upgradeSpell 1→2 into 2→3", async () => {
    let storedLevel = PLAY_ENTRY_LEVEL;
    let upgrades = 0;
    const actor = {
      upgradeSpell: async () => {
        upgrades += 1;
        storedLevel += 1;
        return { ok: BigInt(storedLevel) };
      },
    };
    const first = await persistSpellUpgrade(actor, SLOT, SPELL_ID);
    assert.equal(first.newLevel, CANISTER_AFTER_UPGRADE);
    assert.equal(upgrades, 1);

    // Remount hydrates Play-entry 1. Ungated leftover click:
    const second = await persistSpellUpgrade(actor, SLOT, SPELL_ID);
    assert.equal(second.newLevel, DOUBLE_UPGRADE_LEVEL);
    assert.equal(upgrades, 2);
    assert.equal(storedLevel, DOUBLE_UPGRADE_LEVEL);
  });

  it("transport throw after increment still double-charges on remount retry", async () => {
    let storedLevel = PLAY_ENTRY_LEVEL;
    let upgrades = 0;
    const actor = {
      upgradeSpell: async () => {
        upgrades += 1;
        storedLevel += 1;
        throw new Error("replica went away");
      },
    };
    await assert.rejects(
      () => persistSpellUpgrade(actor, SLOT, SPELL_ID),
      /replica went away/,
    );
    assert.equal(storedLevel, CANISTER_AFTER_UPGRADE);
    assert.equal(upgrades, 1);

    await assert.rejects(
      () => persistSpellUpgrade(actor, SLOT, SPELL_ID),
      /replica went away/,
    );
    assert.equal(storedLevel, DOUBLE_UPGRADE_LEVEL);
    assert.equal(upgrades, 2);
  });
});

describe("persistSpellUpgradeThroughSpellLevelKeepRemount", () => {
  it("stamps parsed success and skips the remount retry", async () => {
    const storage = memStorage();
    let storedLevel = PLAY_ENTRY_LEVEL;
    let upgrades = 0;
    const actor = {
      upgradeSpell: async () => {
        upgrades += 1;
        storedLevel += 1;
        return { ok: BigInt(storedLevel) };
      },
      getCharacter: async () => characterRecord(storedLevel),
    };

    const first = await persistSpellUpgradeThroughSpellLevelKeepRemount({
      persist: remountLock(),
      storage,
      slot: SLOT,
      spellId: SPELL_ID,
      localLevel: PLAY_ENTRY_LEVEL,
      actor,
    });
    assert.equal(first.newLevel, CANISTER_AFTER_UPGRADE);
    assert.equal(first.skipped, undefined);
    assert.equal(upgrades, 1);
    assert.deepEqual(readSpellLevelKeepRemount(storage, SLOT), {
      spellId: SPELL_ID,
      preLevel: PLAY_ENTRY_LEVEL,
    });

    const remount = await persistSpellUpgradeThroughSpellLevelKeepRemount({
      persist: remountLock(),
      storage,
      slot: SLOT,
      spellId: SPELL_ID,
      localLevel: PLAY_ENTRY_LEVEL,
      actor,
    });
    assert.equal(remount.newLevel, CANISTER_AFTER_UPGRADE);
    assert.equal(remount.skipped, true);
    assert.equal(upgrades, 1);
    assert.equal(storedLevel, CANISTER_AFTER_UPGRADE);
    assert.equal(hasSpellLevelKeepRemount(storage, SLOT), false);
    assert.equal(
      shouldDebitSpellUpgradeAfterSpellLevelKeep({
        skipped: remount.skipped === true,
      }),
      false,
    );
  });

  it("stamps transport throw and skips the remount retry", async () => {
    const storage = memStorage();
    let storedLevel = PLAY_ENTRY_LEVEL;
    let upgrades = 0;
    const actor = {
      upgradeSpell: async () => {
        upgrades += 1;
        storedLevel += 1;
        throw new Error("replica went away");
      },
      getCharacter: async () => characterRecord(storedLevel),
    };

    await assert.rejects(
      () =>
        persistSpellUpgradeThroughSpellLevelKeepRemount({
          persist: remountLock(),
          storage,
          slot: SLOT,
          spellId: SPELL_ID,
          localLevel: PLAY_ENTRY_LEVEL,
          actor,
        }),
      /replica went away/,
    );
    assert.equal(upgrades, 1);
    assert.equal(hasSpellLevelKeepRemount(storage, SLOT), true);

    const remount = await persistSpellUpgradeThroughSpellLevelKeepRemount({
      persist: remountLock(),
      storage,
      slot: SLOT,
      spellId: SPELL_ID,
      localLevel: PLAY_ENTRY_LEVEL,
      actor,
    });
    assert.equal(remount.skipped, true);
    assert.equal(remount.newLevel, CANISTER_AFTER_UPGRADE);
    assert.equal(upgrades, 1);
  });

  it("does not skip a different spell after a fireball keep stamp", async () => {
    const storage = memStorage();
    noteSpellLevelKeepRemount(storage, SLOT, {
      spellId: SPELL_ID,
      preLevel: PLAY_ENTRY_LEVEL,
      newLevel: CANISTER_AFTER_UPGRADE,
    });
    let upgrades = 0;
    const actor = {
      upgradeSpell: async (_slot: bigint, spellId: string) => {
        upgrades += 1;
        assert.equal(spellId, OTHER_SPELL);
        return { ok: 1n };
      },
      getCharacter: async () => characterRecord(CANISTER_AFTER_UPGRADE),
    };
    const result = await persistSpellUpgradeThroughSpellLevelKeepRemount({
      persist: remountLock(),
      storage,
      slot: SLOT,
      spellId: OTHER_SPELL,
      localLevel: 0,
      actor,
    });
    assert.equal(result.newLevel, 1);
    assert.equal(result.skipped, undefined);
    assert.equal(upgrades, 1);
  });

  it("does not skip a same-session second upgrade once HUD matches replica", async () => {
    const storage = memStorage();
    noteSpellLevelKeepRemount(storage, SLOT, {
      spellId: SPELL_ID,
      preLevel: PLAY_ENTRY_LEVEL,
      newLevel: CANISTER_AFTER_UPGRADE,
    });
    let storedLevel = CANISTER_AFTER_UPGRADE;
    let upgrades = 0;
    const actor = {
      upgradeSpell: async () => {
        upgrades += 1;
        storedLevel += 1;
        return { ok: BigInt(storedLevel) };
      },
      getCharacter: async () => characterRecord(storedLevel),
    };
    const result = await persistSpellUpgradeThroughSpellLevelKeepRemount({
      persist: remountLock(),
      storage,
      slot: SLOT,
      spellId: SPELL_ID,
      localLevel: CANISTER_AFTER_UPGRADE,
      actor,
    });
    assert.equal(result.newLevel, DOUBLE_UPGRADE_LEVEL);
    assert.equal(result.skipped, undefined);
    assert.equal(upgrades, 1);
  });

  it("does not stamp explicit upgradeSpell failed, so remount retry proceeds", async () => {
    const storage = memStorage();
    let upgrades = 0;
    const actor = {
      upgradeSpell: async () => {
        upgrades += 1;
        return { err: "Not enough Doka" };
      },
      getCharacter: async () => characterRecord(PLAY_ENTRY_LEVEL),
    };
    await assert.rejects(
      () =>
        persistSpellUpgradeThroughSpellLevelKeepRemount({
          persist: remountLock(),
          storage,
          slot: SLOT,
          spellId: SPELL_ID,
          localLevel: PLAY_ENTRY_LEVEL,
          actor,
        }),
      /upgradeSpell failed/,
    );
    assert.equal(hasSpellLevelKeepRemount(storage, SLOT), false);
    assert.equal(upgrades, 1);
  });

  it("fail-closes a keep stamp when getCharacter misses", async () => {
    const storage = memStorage();
    noteSpellLevelKeepRemount(storage, SLOT, {
      spellId: SPELL_ID,
      preLevel: PLAY_ENTRY_LEVEL,
      newLevel: CANISTER_AFTER_UPGRADE,
    });
    let upgrades = 0;
    const actor = {
      upgradeSpell: async () => {
        upgrades += 1;
        return { ok: 3n };
      },
      getCharacter: async () => {
        throw new Error("query replica unavailable");
      },
    };
    await assert.rejects(
      () =>
        persistSpellUpgradeThroughSpellLevelKeepRemount({
          persist: remountLock(),
          storage,
          slot: SLOT,
          spellId: SPELL_ID,
          localLevel: PLAY_ENTRY_LEVEL,
          actor,
        }),
      (err: unknown) =>
        err instanceof Error && err.message === SPELL_LEVEL_KEEP_UNCONFIRMED,
    );
    assert.equal(upgrades, 0);
    assert.equal(hasSpellLevelKeepRemount(storage, SLOT), true);
  });

  it("pickup-only remount without a stamp still upgrades", async () => {
    const storage = memStorage();
    let upgrades = 0;
    const actor = {
      upgradeSpell: async () => {
        upgrades += 1;
        return { ok: 2n };
      },
      getCharacter: async () => characterRecord(1),
    };
    const result = await persistSpellUpgradeThroughSpellLevelKeepRemount({
      persist: remountLock(),
      storage,
      slot: SLOT,
      spellId: SPELL_ID,
      localLevel: PLAY_ENTRY_LEVEL,
      actor,
    });
    assert.equal(result.newLevel, 2);
    assert.equal(upgrades, 1);
  });
});

describe("honourSpellLevelKeepRemountBeforeUpgrade", () => {
  it("is safe to call inside an existing persist enqueue", async () => {
    const storage = memStorage();
    noteSpellLevelKeepRemount(storage, SLOT, {
      spellId: SPELL_ID,
      preLevel: PLAY_ENTRY_LEVEL,
      newLevel: CANISTER_AFTER_UPGRADE,
    });
    const lock = remountLock();
    const honoured = await lock.enqueue(() =>
      honourSpellLevelKeepRemountBeforeUpgrade({
        storage,
        slot: SLOT,
        spellId: SPELL_ID,
        localLevel: PLAY_ENTRY_LEVEL,
        fetchCharacter: async () => characterRecord(CANISTER_AFTER_UPGRADE),
      }),
    );
    assert.deepEqual(honoured, {
      skip: true,
      replicaLevel: CANISTER_AFTER_UPGRADE,
    });
    assert.equal(hasSpellLevelKeepRemount(storage, SLOT), false);
  });

  it("does not skip when replica still equals Play-entry", async () => {
    const storage = memStorage();
    noteSpellLevelKeepRemount(storage, SLOT, {
      spellId: SPELL_ID,
      preLevel: PLAY_ENTRY_LEVEL,
      error: new Error("replica went away"),
    });
    const honoured = await honourSpellLevelKeepRemountBeforeUpgrade({
      storage,
      slot: SLOT,
      spellId: SPELL_ID,
      localLevel: PLAY_ENTRY_LEVEL,
      fetchCharacter: async () => characterRecord(PLAY_ENTRY_LEVEL),
    });
    assert.deepEqual(honoured, { skip: false });
    assert.equal(hasSpellLevelKeepRemount(storage, SLOT), true);
  });
});
