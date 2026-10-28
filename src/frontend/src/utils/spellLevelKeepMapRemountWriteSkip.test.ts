import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { DeathPenaltyStorage } from "./deathPenalty.ts";
import { createProgressPersist } from "./progressPersist.ts";
import {
  SPELL_LEVEL_KEEP_MAP_UNCONFIRMED,
  clearSpellLevelKeepMapRemount,
  clearSpellLevelKeepMapRemountSpell,
  hasSpellLevelKeepMapRemount,
  honourSpellLevelKeepMapRemountBeforeUpgrade,
  honourSpellLevelKeepMapRemountHydrate,
  leftoverHydratedSpellLevelAfterSpellLevelKeepMapRemount,
  leftoverUpgradeCallsAfterSpellLevelKeepMapRemount,
  mergeSpellLevelKeepMapRemountHydrate,
  noteSpellLevelKeepMapRemount,
  persistSpellUpgradeThroughSpellLevelKeepMapRemount,
  playEntrySpellLevelsFromCharacter,
  readSpellLevelKeepMapRemount,
  replicaSpellLevelFromRecord,
  shouldDebitSpellUpgradeAfterSpellLevelKeepMap,
  shouldHonourSpellLevelKeepMapRemountHydrate,
  shouldNoteSpellLevelKeepMapRemount,
  shouldRefuseSpellLevelKeepMapRemountStaleReplica,
  shouldSkipSpellLevelKeepMapRemountUpgrade,
  spellLevelKeepMapRemountKey,
  spellLevelsFromCharacterRecord,
} from "./spellLevelKeepMapRemountWriteSkip.ts";
import {
  persistSpellUpgrade,
  spellUpgradeCanisterSpend,
} from "./spellUpgrade.ts";

const PLAY_ENTRY_FIREBALL = 1;
const CANISTER_FIREBALL = 2;
const DOUBLE_UPGRADE_FIREBALL = 3;
const PLAY_ENTRY_HEAL = 0;
const CANISTER_HEAL = 1;
const SLOT = 1;
const FIREBALL = "fireball";
const HEAL = "heal";

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

function characterRecord(levels: Record<string, number>): {
  spellLevelKeys: string[];
  spellLevelValues: bigint[];
} {
  const spellLevelKeys = Object.keys(levels);
  return {
    spellLevelKeys,
    spellLevelValues: spellLevelKeys.map((id) => BigInt(levels[id] ?? 0)),
  };
}

describe("spellLevelKeepMapRemountKey", () => {
  it("uses a new map stamp origin, not #1215's single-spell key", () => {
    assert.equal(
      spellLevelKeepMapRemountKey(1),
      "pbv_spell_level_keep_map_remount_slot1",
    );
    assert.equal(
      spellLevelKeepMapRemountKey(3),
      "pbv_spell_level_keep_map_remount_slot3",
    );
    assert.notEqual(
      spellLevelKeepMapRemountKey(1),
      "pbv_spell_level_keep_remount_slot1",
    );
    assert.notEqual(
      spellLevelKeepMapRemountKey(1),
      "pbv_spend_keep_remount_slot1",
    );
    assert.notEqual(
      spellLevelKeepMapRemountKey(1),
      "pbv_portal_xp_keep_remount_slot1",
    );
    assert.notEqual(
      spellLevelKeepMapRemountKey(1),
      "pbv_victory_xp_keep_remount_slot1",
    );
    assert.notEqual(
      spellLevelKeepMapRemountKey(1),
      "pbv_xp_credit_keep_remount_slot1",
    );
    assert.notEqual(
      spellLevelKeepMapRemountKey(1),
      "pbv_victory_doka_keep_remount_slot1",
    );
    assert.notEqual(
      spellLevelKeepMapRemountKey(1),
      "pbv_oneshot_doka_keep_remount_slot1",
    );
    assert.notEqual(
      spellLevelKeepMapRemountKey(1),
      "pbv_gamekey_doka_keep_remount_slot1",
    );
    assert.notEqual(
      spellLevelKeepMapRemountKey(1),
      "pbv_feat_doka_keep_remount_slot1",
    );
    assert.notEqual(
      spellLevelKeepMapRemountKey(1),
      "pbv_boss_rush_doka_keep_remount_slot1",
    );
    assert.notEqual(
      spellLevelKeepMapRemountKey(1),
      "pbv_absolute_doka_throw_keep_remount_slot1",
    );
  });
});

describe("shouldNoteSpellLevelKeepMapRemount", () => {
  it("notes parsed success when the canister level rose", () => {
    assert.equal(
      shouldNoteSpellLevelKeepMapRemount({
        spellId: FIREBALL,
        preLevel: PLAY_ENTRY_FIREBALL,
        newLevel: CANISTER_FIREBALL,
      }),
      true,
    );
  });

  it("notes transport throw after the replica may already have written", () => {
    assert.equal(
      shouldNoteSpellLevelKeepMapRemount({
        spellId: FIREBALL,
        preLevel: PLAY_ENTRY_FIREBALL,
        error: new Error("replica went away"),
      }),
      true,
    );
  });

  it("does not note explicit upgradeSpell failed", () => {
    assert.equal(
      shouldNoteSpellLevelKeepMapRemount({
        spellId: FIREBALL,
        preLevel: PLAY_ENTRY_FIREBALL,
        error: new Error("upgradeSpell failed: Not enough Doka"),
      }),
      false,
    );
    assert.equal(
      shouldNoteSpellLevelKeepMapRemount({
        spellId: FIREBALL,
        preLevel: PLAY_ENTRY_FIREBALL,
        error: new Error("upgradeSpell failed: Account banned"),
      }),
      false,
    );
  });

  it("does not note a no-op or empty spellId", () => {
    assert.equal(
      shouldNoteSpellLevelKeepMapRemount({
        spellId: FIREBALL,
        preLevel: PLAY_ENTRY_FIREBALL,
        newLevel: PLAY_ENTRY_FIREBALL,
      }),
      false,
    );
    assert.equal(
      shouldNoteSpellLevelKeepMapRemount({
        spellId: "",
        preLevel: PLAY_ENTRY_FIREBALL,
        newLevel: CANISTER_FIREBALL,
      }),
      false,
    );
  });
});

describe("note / read / clear SpellLevelKeepMapRemount", () => {
  it("merges a later spell without clobbering the first keep", () => {
    const storage = memStorage();
    assert.equal(hasSpellLevelKeepMapRemount(storage, SLOT), false);
    noteSpellLevelKeepMapRemount(storage, SLOT, {
      spellId: FIREBALL,
      preLevel: PLAY_ENTRY_FIREBALL,
      newLevel: CANISTER_FIREBALL,
    });
    noteSpellLevelKeepMapRemount(storage, SLOT, {
      spellId: HEAL,
      preLevel: PLAY_ENTRY_HEAL,
      newLevel: CANISTER_HEAL,
    });
    assert.deepEqual(readSpellLevelKeepMapRemount(storage, SLOT), {
      levels: { [FIREBALL]: PLAY_ENTRY_FIREBALL, [HEAL]: PLAY_ENTRY_HEAL },
    });
    clearSpellLevelKeepMapRemountSpell(storage, SLOT, HEAL);
    assert.deepEqual(readSpellLevelKeepMapRemount(storage, SLOT), {
      levels: { [FIREBALL]: PLAY_ENTRY_FIREBALL },
    });
    clearSpellLevelKeepMapRemount(storage, SLOT);
    assert.equal(readSpellLevelKeepMapRemount(storage, SLOT), null);
  });

  it("isolates character slots", () => {
    const storage = memStorage();
    noteSpellLevelKeepMapRemount(storage, 1, {
      spellId: FIREBALL,
      preLevel: PLAY_ENTRY_FIREBALL,
      newLevel: CANISTER_FIREBALL,
    });
    noteSpellLevelKeepMapRemount(storage, 2, {
      spellId: HEAL,
      preLevel: PLAY_ENTRY_HEAL,
      newLevel: CANISTER_HEAL,
    });
    assert.deepEqual(readSpellLevelKeepMapRemount(storage, 1), {
      levels: { [FIREBALL]: PLAY_ENTRY_FIREBALL },
    });
    assert.deepEqual(readSpellLevelKeepMapRemount(storage, 2), {
      levels: { [HEAL]: PLAY_ENTRY_HEAL },
    });
    clearSpellLevelKeepMapRemount(storage, 1);
    assert.equal(readSpellLevelKeepMapRemount(storage, 1), null);
    assert.equal(hasSpellLevelKeepMapRemount(storage, 2), true);
  });

  it("does not stamp explicit upgradeSpell failed", () => {
    const storage = memStorage();
    noteSpellLevelKeepMapRemount(storage, SLOT, {
      spellId: FIREBALL,
      preLevel: PLAY_ENTRY_FIREBALL,
      error: new Error("upgradeSpell failed: Spell is retired"),
    });
    assert.equal(hasSpellLevelKeepMapRemount(storage, SLOT), false);
  });
});

describe("spellLevelsFromCharacterRecord", () => {
  it("reads keys/values, bigint, and { ok } bindgen", () => {
    assert.deepEqual(
      spellLevelsFromCharacterRecord(
        characterRecord({ [FIREBALL]: CANISTER_FIREBALL }),
      ),
      { [FIREBALL]: CANISTER_FIREBALL },
    );
    assert.deepEqual(
      spellLevelsFromCharacterRecord({
        ok: characterRecord({ [FIREBALL]: CANISTER_FIREBALL }),
      }),
      { [FIREBALL]: CANISTER_FIREBALL },
    );
    assert.deepEqual(
      spellLevelsFromCharacterRecord({
        _ok: characterRecord({ [FIREBALL]: DOUBLE_UPGRADE_FIREBALL }),
      }),
      { [FIREBALL]: DOUBLE_UPGRADE_FIREBALL },
    );
  });

  it("returns null for missing / non-character payloads", () => {
    assert.equal(spellLevelsFromCharacterRecord(null), null);
    assert.equal(spellLevelsFromCharacterRecord({}), null);
    assert.equal(spellLevelsFromCharacterRecord("nope"), null);
  });

  it("Play-entry hydrate matches WX keys-first leftover", () => {
    assert.deepEqual(
      playEntrySpellLevelsFromCharacter(
        characterRecord({ [FIREBALL]: PLAY_ENTRY_FIREBALL }),
      ),
      { [FIREBALL]: PLAY_ENTRY_FIREBALL },
    );
    assert.equal(
      replicaSpellLevelFromRecord(
        characterRecord({
          [FIREBALL]: CANISTER_FIREBALL,
          [HEAL]: CANISTER_HEAL,
        }),
        FIREBALL,
      ),
      CANISTER_FIREBALL,
    );
    assert.equal(replicaSpellLevelFromRecord(null, FIREBALL), null);
  });
});

describe("shouldSkipSpellLevelKeepMapRemountUpgrade", () => {
  it("skips remount fireball retry when replica already rose past Play-entry", () => {
    assert.equal(
      shouldSkipSpellLevelKeepMapRemountUpgrade({
        keep: true,
        spellId: FIREBALL,
        stampedPreLevel: PLAY_ENTRY_FIREBALL,
        localLevel: PLAY_ENTRY_FIREBALL,
        replicaLevel: CANISTER_FIREBALL,
      }),
      true,
    );
  });

  it("does not skip a same-session second upgrade (local matches replica)", () => {
    assert.equal(
      shouldSkipSpellLevelKeepMapRemountUpgrade({
        keep: true,
        spellId: FIREBALL,
        stampedPreLevel: PLAY_ENTRY_FIREBALL,
        localLevel: CANISTER_FIREBALL,
        replicaLevel: CANISTER_FIREBALL,
      }),
      false,
    );
  });

  it("does not skip a spellId absent from the map", () => {
    assert.equal(
      shouldSkipSpellLevelKeepMapRemountUpgrade({
        keep: true,
        spellId: HEAL,
        stampedPreLevel: null,
        localLevel: PLAY_ENTRY_HEAL,
        replicaLevel: PLAY_ENTRY_HEAL,
      }),
      false,
    );
  });

  it("does not skip without a keep stamp", () => {
    assert.equal(
      shouldSkipSpellLevelKeepMapRemountUpgrade({
        keep: false,
        spellId: FIREBALL,
        stampedPreLevel: PLAY_ENTRY_FIREBALL,
        localLevel: PLAY_ENTRY_FIREBALL,
        replicaLevel: CANISTER_FIREBALL,
      }),
      false,
    );
  });

  it("does not skip when replica still equals Play-entry (throw before apply)", () => {
    assert.equal(
      shouldSkipSpellLevelKeepMapRemountUpgrade({
        keep: true,
        spellId: FIREBALL,
        stampedPreLevel: PLAY_ENTRY_FIREBALL,
        localLevel: PLAY_ENTRY_FIREBALL,
        replicaLevel: PLAY_ENTRY_FIREBALL,
      }),
      false,
    );
  });
});

describe("shouldRefuseSpellLevelKeepMapRemountStaleReplica", () => {
  it("fail-closes a keep-map stamp whose replica fetch missed", () => {
    assert.equal(
      shouldRefuseSpellLevelKeepMapRemountStaleReplica({
        keep: true,
        spellId: FIREBALL,
        stampedPreLevel: PLAY_ENTRY_FIREBALL,
        replicaLevel: null,
      }),
      true,
    );
  });

  it("does not refuse a live replica or an unstamped spell", () => {
    assert.equal(
      shouldRefuseSpellLevelKeepMapRemountStaleReplica({
        keep: true,
        spellId: FIREBALL,
        stampedPreLevel: PLAY_ENTRY_FIREBALL,
        replicaLevel: CANISTER_FIREBALL,
      }),
      false,
    );
    assert.equal(
      shouldRefuseSpellLevelKeepMapRemountStaleReplica({
        keep: true,
        spellId: HEAL,
        stampedPreLevel: null,
        replicaLevel: null,
      }),
      false,
    );
  });
});

describe("shouldDebitSpellUpgradeAfterSpellLevelKeepMap", () => {
  it("does not debit the lock after a skipped retry", () => {
    assert.equal(
      shouldDebitSpellUpgradeAfterSpellLevelKeepMap({ skipped: true }),
      false,
    );
    assert.equal(
      shouldDebitSpellUpgradeAfterSpellLevelKeepMap({ skipped: false }),
      true,
    );
  });
});

describe("leftoverUpgradeCallsAfterSpellLevelKeepMapRemount", () => {
  it("#1215 single-stamp clobber leaves fireball ungated; map skip is 0", () => {
    assert.equal(
      leftoverUpgradeCallsAfterSpellLevelKeepMapRemount({
        keep: false,
        spellId: FIREBALL,
        stampedPreLevel: null,
        localLevel: PLAY_ENTRY_FIREBALL,
        replicaLevel: CANISTER_FIREBALL,
        ungatedCalls: 1,
      }),
      1,
    );
    assert.equal(
      leftoverUpgradeCallsAfterSpellLevelKeepMapRemount({
        keep: true,
        spellId: FIREBALL,
        stampedPreLevel: PLAY_ENTRY_FIREBALL,
        localLevel: PLAY_ENTRY_FIREBALL,
        replicaLevel: CANISTER_FIREBALL,
        ungatedCalls: 1,
      }),
      0,
    );
  });
});

describe("hydrate honour of the map stamp", () => {
  it("Play-entry HUD stays 1 without honour; replica 2 with honour", () => {
    assert.equal(
      leftoverHydratedSpellLevelAfterSpellLevelKeepMapRemount({
        keep: false,
        spellId: FIREBALL,
        playEntryLevel: PLAY_ENTRY_FIREBALL,
        replicaLevel: CANISTER_FIREBALL,
      }),
      PLAY_ENTRY_FIREBALL,
    );
    assert.equal(
      leftoverHydratedSpellLevelAfterSpellLevelKeepMapRemount({
        keep: true,
        spellId: FIREBALL,
        playEntryLevel: PLAY_ENTRY_FIREBALL,
        replicaLevel: CANISTER_FIREBALL,
      }),
      CANISTER_FIREBALL,
    );
    assert.equal(
      shouldHonourSpellLevelKeepMapRemountHydrate({
        keep: true,
        spellId: FIREBALL,
        playEntryLevel: PLAY_ENTRY_FIREBALL,
        replicaLevel: PLAY_ENTRY_FIREBALL,
      }),
      false,
    );
  });

  it("merges every stamped replica level and leaves unstamped spells", () => {
    const playEntry = { [FIREBALL]: PLAY_ENTRY_FIREBALL };
    const replica = {
      [FIREBALL]: CANISTER_FIREBALL,
      [HEAL]: CANISTER_HEAL,
      ignite: 4,
    };
    assert.deepEqual(
      mergeSpellLevelKeepMapRemountHydrate(playEntry, null, replica),
      playEntry,
    );
    assert.deepEqual(
      mergeSpellLevelKeepMapRemountHydrate(
        playEntry,
        {
          levels: { [FIREBALL]: PLAY_ENTRY_FIREBALL, [HEAL]: PLAY_ENTRY_HEAL },
        },
        replica,
      ),
      { [FIREBALL]: CANISTER_FIREBALL, [HEAL]: CANISTER_HEAL },
    );
  });

  it("advertised remount cost is the Play-entry 10, not the replica 20", () => {
    assert.equal(spellUpgradeCanisterSpend(10), 10);
    assert.equal(spellUpgradeCanisterSpend(20), 20);
  });
});

describe("ungated remount retry double-charges the clobbered first spell", () => {
  it("Play-entry keys after fireball then heal make a fireball retry 1→2 into 2→3", async () => {
    const stored: Record<string, number> = { [FIREBALL]: PLAY_ENTRY_FIREBALL };
    let upgrades = 0;
    const actor = {
      upgradeSpell: async (_slot: bigint, spellId: string) => {
        upgrades += 1;
        stored[spellId] = (stored[spellId] ?? 0) + 1;
        return { ok: BigInt(stored[spellId] ?? 0) };
      },
    };
    const first = await persistSpellUpgrade(actor, SLOT, FIREBALL);
    assert.equal(first.newLevel, CANISTER_FIREBALL);
    const second = await persistSpellUpgrade(actor, SLOT, HEAL);
    assert.equal(second.newLevel, CANISTER_HEAL);
    assert.equal(upgrades, 2);

    // Remount hydrates Play-entry fireball 1. #1215 stamp is heal-only.
    // Ungated leftover fireball click:
    const retry = await persistSpellUpgrade(actor, SLOT, FIREBALL);
    assert.equal(retry.newLevel, DOUBLE_UPGRADE_FIREBALL);
    assert.equal(upgrades, 3);
    assert.equal(stored[FIREBALL], DOUBLE_UPGRADE_FIREBALL);
  });
});

describe("persistSpellUpgradeThroughSpellLevelKeepMapRemount", () => {
  it("keeps fireball after a later heal note and skips the remount fireball retry", async () => {
    const storage = memStorage();
    const stored: Record<string, number> = { [FIREBALL]: PLAY_ENTRY_FIREBALL };
    let upgrades = 0;
    const actor = {
      upgradeSpell: async (_slot: bigint, spellId: string) => {
        upgrades += 1;
        stored[spellId] = (stored[spellId] ?? 0) + 1;
        return { ok: BigInt(stored[spellId] ?? 0) };
      },
      getCharacter: async () => characterRecord(stored),
    };

    const fireball = await persistSpellUpgradeThroughSpellLevelKeepMapRemount({
      persist: remountLock(),
      storage,
      slot: SLOT,
      spellId: FIREBALL,
      localLevel: PLAY_ENTRY_FIREBALL,
      actor,
    });
    assert.equal(fireball.newLevel, CANISTER_FIREBALL);
    assert.equal(fireball.skipped, undefined);

    const heal = await persistSpellUpgradeThroughSpellLevelKeepMapRemount({
      persist: remountLock(),
      storage,
      slot: SLOT,
      spellId: HEAL,
      localLevel: PLAY_ENTRY_HEAL,
      actor,
    });
    assert.equal(heal.newLevel, CANISTER_HEAL);
    assert.deepEqual(readSpellLevelKeepMapRemount(storage, SLOT), {
      levels: { [FIREBALL]: PLAY_ENTRY_FIREBALL, [HEAL]: PLAY_ENTRY_HEAL },
    });
    assert.equal(upgrades, 2);

    const remountFireball =
      await persistSpellUpgradeThroughSpellLevelKeepMapRemount({
        persist: remountLock(),
        storage,
        slot: SLOT,
        spellId: FIREBALL,
        localLevel: PLAY_ENTRY_FIREBALL,
        actor,
      });
    assert.equal(remountFireball.newLevel, CANISTER_FIREBALL);
    assert.equal(remountFireball.skipped, true);
    assert.equal(upgrades, 2);
    assert.equal(stored[FIREBALL], CANISTER_FIREBALL);
    assert.deepEqual(readSpellLevelKeepMapRemount(storage, SLOT), {
      levels: { [HEAL]: PLAY_ENTRY_HEAL },
    });
    assert.equal(
      shouldDebitSpellUpgradeAfterSpellLevelKeepMap({
        skipped: remountFireball.skipped === true,
      }),
      false,
    );

    const remountHeal =
      await persistSpellUpgradeThroughSpellLevelKeepMapRemount({
        persist: remountLock(),
        storage,
        slot: SLOT,
        spellId: HEAL,
        localLevel: PLAY_ENTRY_HEAL,
        actor,
      });
    assert.equal(remountHeal.skipped, true);
    assert.equal(remountHeal.newLevel, CANISTER_HEAL);
    assert.equal(upgrades, 2);
    assert.equal(hasSpellLevelKeepMapRemount(storage, SLOT), false);
  });

  it("stamps transport throw and skips the remount retry", async () => {
    const storage = memStorage();
    let storedLevel = PLAY_ENTRY_FIREBALL;
    let upgrades = 0;
    const actor = {
      upgradeSpell: async () => {
        upgrades += 1;
        storedLevel += 1;
        throw new Error("replica went away");
      },
      getCharacter: async () => characterRecord({ [FIREBALL]: storedLevel }),
    };

    await assert.rejects(
      () =>
        persistSpellUpgradeThroughSpellLevelKeepMapRemount({
          persist: remountLock(),
          storage,
          slot: SLOT,
          spellId: FIREBALL,
          localLevel: PLAY_ENTRY_FIREBALL,
          actor,
        }),
      /replica went away/,
    );
    assert.equal(upgrades, 1);
    assert.equal(hasSpellLevelKeepMapRemount(storage, SLOT), true);

    const remount = await persistSpellUpgradeThroughSpellLevelKeepMapRemount({
      persist: remountLock(),
      storage,
      slot: SLOT,
      spellId: FIREBALL,
      localLevel: PLAY_ENTRY_FIREBALL,
      actor,
    });
    assert.equal(remount.skipped, true);
    assert.equal(remount.newLevel, CANISTER_FIREBALL);
    assert.equal(upgrades, 1);
  });

  it("does not skip an unstamped different spell", async () => {
    const storage = memStorage();
    noteSpellLevelKeepMapRemount(storage, SLOT, {
      spellId: FIREBALL,
      preLevel: PLAY_ENTRY_FIREBALL,
      newLevel: CANISTER_FIREBALL,
    });
    let upgrades = 0;
    const actor = {
      upgradeSpell: async (_slot: bigint, spellId: string) => {
        upgrades += 1;
        assert.equal(spellId, HEAL);
        return { ok: 1n };
      },
      getCharacter: async () =>
        characterRecord({ [FIREBALL]: CANISTER_FIREBALL }),
    };
    const result = await persistSpellUpgradeThroughSpellLevelKeepMapRemount({
      persist: remountLock(),
      storage,
      slot: SLOT,
      spellId: HEAL,
      localLevel: PLAY_ENTRY_HEAL,
      actor,
    });
    assert.equal(result.newLevel, 1);
    assert.equal(result.skipped, undefined);
    assert.equal(upgrades, 1);
    assert.deepEqual(readSpellLevelKeepMapRemount(storage, SLOT), {
      levels: { [FIREBALL]: PLAY_ENTRY_FIREBALL, [HEAL]: PLAY_ENTRY_HEAL },
    });
  });

  it("does not skip a same-session second upgrade once HUD matches replica", async () => {
    const storage = memStorage();
    noteSpellLevelKeepMapRemount(storage, SLOT, {
      spellId: FIREBALL,
      preLevel: PLAY_ENTRY_FIREBALL,
      newLevel: CANISTER_FIREBALL,
    });
    let storedLevel = CANISTER_FIREBALL;
    let upgrades = 0;
    const actor = {
      upgradeSpell: async () => {
        upgrades += 1;
        storedLevel += 1;
        return { ok: BigInt(storedLevel) };
      },
      getCharacter: async () => characterRecord({ [FIREBALL]: storedLevel }),
    };
    const result = await persistSpellUpgradeThroughSpellLevelKeepMapRemount({
      persist: remountLock(),
      storage,
      slot: SLOT,
      spellId: FIREBALL,
      localLevel: CANISTER_FIREBALL,
      actor,
    });
    assert.equal(result.newLevel, DOUBLE_UPGRADE_FIREBALL);
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
      getCharacter: async () =>
        characterRecord({ [FIREBALL]: PLAY_ENTRY_FIREBALL }),
    };
    await assert.rejects(
      () =>
        persistSpellUpgradeThroughSpellLevelKeepMapRemount({
          persist: remountLock(),
          storage,
          slot: SLOT,
          spellId: FIREBALL,
          localLevel: PLAY_ENTRY_FIREBALL,
          actor,
        }),
      /upgradeSpell failed/,
    );
    assert.equal(hasSpellLevelKeepMapRemount(storage, SLOT), false);
    assert.equal(upgrades, 1);
  });

  it("fail-closes a keep-map stamp when getCharacter misses", async () => {
    const storage = memStorage();
    noteSpellLevelKeepMapRemount(storage, SLOT, {
      spellId: FIREBALL,
      preLevel: PLAY_ENTRY_FIREBALL,
      newLevel: CANISTER_FIREBALL,
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
        persistSpellUpgradeThroughSpellLevelKeepMapRemount({
          persist: remountLock(),
          storage,
          slot: SLOT,
          spellId: FIREBALL,
          localLevel: PLAY_ENTRY_FIREBALL,
          actor,
        }),
      (err: unknown) =>
        err instanceof Error &&
        err.message === SPELL_LEVEL_KEEP_MAP_UNCONFIRMED,
    );
    assert.equal(upgrades, 0);
    assert.equal(hasSpellLevelKeepMapRemount(storage, SLOT), true);
  });

  it("pickup-only remount without a stamp still upgrades", async () => {
    const storage = memStorage();
    let upgrades = 0;
    const actor = {
      upgradeSpell: async () => {
        upgrades += 1;
        return { ok: 2n };
      },
      getCharacter: async () => characterRecord({ [FIREBALL]: 1 }),
    };
    const result = await persistSpellUpgradeThroughSpellLevelKeepMapRemount({
      persist: remountLock(),
      storage,
      slot: SLOT,
      spellId: FIREBALL,
      localLevel: PLAY_ENTRY_FIREBALL,
      actor,
    });
    assert.equal(result.newLevel, 2);
    assert.equal(upgrades, 1);
  });
});

describe("honourSpellLevelKeepMapRemountBeforeUpgrade", () => {
  it("is safe to call inside an existing persist enqueue", async () => {
    const storage = memStorage();
    noteSpellLevelKeepMapRemount(storage, SLOT, {
      spellId: FIREBALL,
      preLevel: PLAY_ENTRY_FIREBALL,
      newLevel: CANISTER_FIREBALL,
    });
    noteSpellLevelKeepMapRemount(storage, SLOT, {
      spellId: HEAL,
      preLevel: PLAY_ENTRY_HEAL,
      newLevel: CANISTER_HEAL,
    });
    const lock = remountLock();
    const honoured = await lock.enqueue(() =>
      honourSpellLevelKeepMapRemountBeforeUpgrade({
        storage,
        slot: SLOT,
        spellId: FIREBALL,
        localLevel: PLAY_ENTRY_FIREBALL,
        fetchCharacter: async () =>
          characterRecord({
            [FIREBALL]: CANISTER_FIREBALL,
            [HEAL]: CANISTER_HEAL,
          }),
      }),
    );
    assert.deepEqual(honoured, {
      skip: true,
      replicaLevel: CANISTER_FIREBALL,
    });
    assert.deepEqual(readSpellLevelKeepMapRemount(storage, SLOT), {
      levels: { [HEAL]: PLAY_ENTRY_HEAL },
    });
  });

  it("does not skip when replica still equals Play-entry", async () => {
    const storage = memStorage();
    noteSpellLevelKeepMapRemount(storage, SLOT, {
      spellId: FIREBALL,
      preLevel: PLAY_ENTRY_FIREBALL,
      error: new Error("replica went away"),
    });
    const honoured = await honourSpellLevelKeepMapRemountBeforeUpgrade({
      storage,
      slot: SLOT,
      spellId: FIREBALL,
      localLevel: PLAY_ENTRY_FIREBALL,
      fetchCharacter: async () =>
        characterRecord({ [FIREBALL]: PLAY_ENTRY_FIREBALL }),
    });
    assert.deepEqual(honoured, { skip: false });
    assert.equal(hasSpellLevelKeepMapRemount(storage, SLOT), true);
  });
});

describe("honourSpellLevelKeepMapRemountHydrate", () => {
  it("merges stamped replica levels onto Play-entry and keeps the map", async () => {
    const storage = memStorage();
    noteSpellLevelKeepMapRemount(storage, SLOT, {
      spellId: FIREBALL,
      preLevel: PLAY_ENTRY_FIREBALL,
      newLevel: CANISTER_FIREBALL,
    });
    noteSpellLevelKeepMapRemount(storage, SLOT, {
      spellId: HEAL,
      preLevel: PLAY_ENTRY_HEAL,
      newLevel: CANISTER_HEAL,
    });
    const honoured = await honourSpellLevelKeepMapRemountHydrate({
      storage,
      slot: SLOT,
      playEntryLevels: { [FIREBALL]: PLAY_ENTRY_FIREBALL },
      fetchCharacter: async () =>
        characterRecord({
          [FIREBALL]: CANISTER_FIREBALL,
          [HEAL]: CANISTER_HEAL,
        }),
    });
    assert.deepEqual(honoured, {
      [FIREBALL]: CANISTER_FIREBALL,
      [HEAL]: CANISTER_HEAL,
    });
    assert.deepEqual(readSpellLevelKeepMapRemount(storage, SLOT), {
      levels: { [FIREBALL]: PLAY_ENTRY_FIREBALL, [HEAL]: PLAY_ENTRY_HEAL },
    });
  });

  it("fetch miss fail-closes to Play-entry and keeps the map", async () => {
    const storage = memStorage();
    noteSpellLevelKeepMapRemount(storage, SLOT, {
      spellId: FIREBALL,
      preLevel: PLAY_ENTRY_FIREBALL,
      newLevel: CANISTER_FIREBALL,
    });
    const honoured = await honourSpellLevelKeepMapRemountHydrate({
      storage,
      slot: SLOT,
      playEntryLevels: { [FIREBALL]: PLAY_ENTRY_FIREBALL },
      fetchCharacter: async () => {
        throw new Error("query replica unavailable");
      },
    });
    assert.deepEqual(honoured, { [FIREBALL]: PLAY_ENTRY_FIREBALL });
    assert.equal(hasSpellLevelKeepMapRemount(storage, SLOT), true);
  });

  it("does not merge replica without a keep-map stamp", async () => {
    const storage = memStorage();
    const honoured = await honourSpellLevelKeepMapRemountHydrate({
      storage,
      slot: SLOT,
      playEntryLevels: { [FIREBALL]: PLAY_ENTRY_FIREBALL },
      fetchCharacter: async () =>
        characterRecord({ [FIREBALL]: CANISTER_FIREBALL }),
    });
    assert.deepEqual(honoured, { [FIREBALL]: PLAY_ENTRY_FIREBALL });
  });
});
