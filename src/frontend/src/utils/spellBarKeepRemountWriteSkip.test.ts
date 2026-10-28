import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { DeathPenaltyStorage } from "./deathPenalty.ts";
import {
  SPELL_BAR_KEEP_UNCONFIRMED,
  clearSpellBarKeepRemount,
  clearSpellBarKeepRemountTimers,
  createSpellBarKeepRemountTimerRegistry,
  hasSpellBarKeepRemount,
  honourSpellBarKeepRemountBeforeFlush,
  honourSpellBarKeepRemountHydrate,
  leftoverHydratedSpellBarAfterKeepRemount,
  leftoverSpellBarFlushCallsAfterKeepRemount,
  mergeSpellBarKeepRemountHydrate,
  normalizeSpellBarOrder,
  noteSpellBarKeepRemount,
  persistSpellBarThroughSpellBarKeepRemount,
  playEntrySpellBarFromCharacter,
  readSetSpellBarOrderResult,
  readSpellBarKeepRemount,
  resolveSpellBarKeepRemountFlushOrder,
  shouldClearSpellBarKeepRemountRetryOnUnmount,
  shouldFlushSpellBarKeepRemountOnUnmount,
  shouldHonourSpellBarKeepRemountHydrate,
  shouldNoteSpellBarKeepRemount,
  shouldRefuseSpellBarKeepRemountStaleReplica,
  shouldSkipSpellBarKeepRemountFlush,
  shouldSkipSpellBarKeepRemountHydrateOverwrite,
  spellBarKeepRemountKey,
  spellBarOrderFromCharacterRecord,
  spellBarOrdersEqual,
} from "./spellBarKeepRemountWriteSkip.ts";

const SLOT = 1;
const PLAY_ENTRY = ["strike", "heal"] as const;
const INTENDED = ["inferno", "strike"] as const;

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

function characterRecord(order: readonly string[]): {
  spellBarOrder: string[];
} {
  return { spellBarOrder: [...order] };
}

describe("spellBarKeepRemountKey", () => {
  it("uses a new bar-order stamp origin, not spell-level or wallet keys", () => {
    assert.equal(spellBarKeepRemountKey(1), "pbv_spell_bar_keep_remount_slot1");
    assert.equal(spellBarKeepRemountKey(3), "pbv_spell_bar_keep_remount_slot3");
    assert.notEqual(
      spellBarKeepRemountKey(1),
      "pbv_spell_level_keep_remount_slot1",
    );
    assert.notEqual(
      spellBarKeepRemountKey(1),
      "pbv_spell_level_keep_map_remount_slot1",
    );
    assert.notEqual(spellBarKeepRemountKey(1), "pbv_spend_keep_remount_slot1");
    assert.notEqual(
      spellBarKeepRemountKey(1),
      "pbv_portal_xp_keep_remount_slot1",
    );
    assert.notEqual(
      spellBarKeepRemountKey(1),
      "pbv_victory_xp_keep_remount_slot1",
    );
    assert.notEqual(
      spellBarKeepRemountKey(1),
      "pbv_xp_credit_keep_remount_slot1",
    );
    assert.notEqual(
      spellBarKeepRemountKey(1),
      "pbv_victory_doka_keep_remount_slot1",
    );
    assert.notEqual(
      spellBarKeepRemountKey(1),
      "pbv_oneshot_doka_keep_remount_slot1",
    );
    assert.notEqual(
      spellBarKeepRemountKey(1),
      "pbv_gamekey_doka_keep_remount_slot1",
    );
    assert.notEqual(
      spellBarKeepRemountKey(1),
      "pbv_feat_doka_keep_remount_slot1",
    );
    assert.notEqual(
      spellBarKeepRemountKey(1),
      "pbv_boss_rush_doka_keep_remount_slot1",
    );
    assert.notEqual(
      spellBarKeepRemountKey(1),
      "pbv_absolute_doka_throw_keep_remount_slot1",
    );
  });
});

describe("normalizeSpellBarOrder / spellBarOrdersEqual", () => {
  it("drops empties and duplicates and caps at 8", () => {
    assert.deepEqual(
      normalizeSpellBarOrder(["strike", "", "strike", "heal", null, "inferno"]),
      ["strike", "heal", "inferno"],
    );
    assert.equal(
      normalizeSpellBarOrder(["a", "b", "c", "d", "e", "f", "g", "h", "i"])
        .length,
      8,
    );
    assert.equal(spellBarOrdersEqual(PLAY_ENTRY, ["strike", "heal"]), true);
    assert.equal(spellBarOrdersEqual(PLAY_ENTRY, INTENDED), false);
  });
});

describe("shouldNoteSpellBarKeepRemount", () => {
  it("notes the optimistic / debounce-schedule order before invoke", () => {
    assert.equal(shouldNoteSpellBarKeepRemount({ order: INTENDED }), true);
  });

  it("notes transport throw after the replica may already have written", () => {
    assert.equal(
      shouldNoteSpellBarKeepRemount({
        order: INTENDED,
        error: new Error("replica went away"),
      }),
      true,
    );
  });

  it("notes explicit setSpellBarOrder failed so remount can retry", () => {
    assert.equal(
      shouldNoteSpellBarKeepRemount({
        order: INTENDED,
        error: new Error("setSpellBarOrder failed: Account banned"),
      }),
      true,
    );
  });

  it("does not note an empty bar", () => {
    assert.equal(shouldNoteSpellBarKeepRemount({ order: [] }), false);
    assert.equal(shouldNoteSpellBarKeepRemount({ order: ["", "  "] }), false);
  });
});

describe("note / read / clear SpellBarKeepRemount", () => {
  it("stamps the intended order and isolates character slots", () => {
    const storage = memStorage();
    assert.equal(hasSpellBarKeepRemount(storage, SLOT), false);
    noteSpellBarKeepRemount(storage, SLOT, { order: INTENDED });
    assert.deepEqual(readSpellBarKeepRemount(storage, SLOT), {
      order: [...INTENDED],
    });
    noteSpellBarKeepRemount(storage, 2, { order: PLAY_ENTRY });
    assert.deepEqual(readSpellBarKeepRemount(storage, SLOT), {
      order: [...INTENDED],
    });
    assert.deepEqual(readSpellBarKeepRemount(storage, 2), {
      order: [...PLAY_ENTRY],
    });
    clearSpellBarKeepRemount(storage, SLOT);
    assert.equal(readSpellBarKeepRemount(storage, SLOT), null);
    assert.equal(hasSpellBarKeepRemount(storage, 2), true);
  });

  it("a later rearrange overwrites the stamp with the newest intended bar", () => {
    const storage = memStorage();
    noteSpellBarKeepRemount(storage, SLOT, { order: PLAY_ENTRY });
    noteSpellBarKeepRemount(storage, SLOT, { order: INTENDED });
    assert.deepEqual(readSpellBarKeepRemount(storage, SLOT), {
      order: [...INTENDED],
    });
  });
});

describe("spellBarOrderFromCharacterRecord", () => {
  it("reads spellBarOrder, padded nulls, and { ok } bindgen", () => {
    assert.deepEqual(
      spellBarOrderFromCharacterRecord(characterRecord(PLAY_ENTRY)),
      [...PLAY_ENTRY],
    );
    assert.deepEqual(
      spellBarOrderFromCharacterRecord({
        ok: characterRecord(INTENDED),
      }),
      [...INTENDED],
    );
    assert.deepEqual(
      spellBarOrderFromCharacterRecord({
        _ok: { spellBarOrder: ["inferno", null, "strike", ""] },
      }),
      ["inferno", "strike"],
    );
    assert.deepEqual(
      spellBarOrderFromCharacterRecord({ spellBarOrder: null }),
      [],
    );
  });

  it("returns null for missing / non-character payloads", () => {
    assert.equal(spellBarOrderFromCharacterRecord(null), null);
    assert.equal(spellBarOrderFromCharacterRecord({}), null);
    assert.equal(spellBarOrderFromCharacterRecord("nope"), null);
  });

  it("Play-entry hydrate matches WX getCharacter leftover", () => {
    assert.deepEqual(
      playEntrySpellBarFromCharacter(characterRecord(PLAY_ENTRY)),
      [...PLAY_ENTRY],
    );
  });
});

describe("readSetSpellBarOrderResult", () => {
  it("accepts #ok / _ok and surfaces #err / _err", () => {
    assert.deepEqual(readSetSpellBarOrderResult({ ok: null }), { ok: true });
    assert.deepEqual(readSetSpellBarOrderResult({ _ok: null }), { ok: true });
    assert.deepEqual(readSetSpellBarOrderResult({ __kind__: "ok" }), {
      ok: true,
    });
    assert.equal(
      "err" in readSetSpellBarOrderResult({ err: "Account banned" }),
      true,
    );
    assert.equal(
      "err" in readSetSpellBarOrderResult({ _err: "Invalid slot number" }),
      true,
    );
  });
});

describe("shouldSkipSpellBarKeepRemountHydrateOverwrite", () => {
  it("skips applying stale getCharacter over the Inferno stamp", () => {
    assert.equal(
      shouldSkipSpellBarKeepRemountHydrateOverwrite({
        keep: true,
        stampedOrder: INTENDED,
        replicaOrder: PLAY_ENTRY,
      }),
      true,
    );
  });

  it("does not skip when replica already matches the stamp", () => {
    assert.equal(
      shouldSkipSpellBarKeepRemountHydrateOverwrite({
        keep: true,
        stampedOrder: INTENDED,
        replicaOrder: INTENDED,
      }),
      false,
    );
  });

  it("fail-closes a keep stamp whose replica fetch missed", () => {
    assert.equal(
      shouldSkipSpellBarKeepRemountHydrateOverwrite({
        keep: true,
        stampedOrder: INTENDED,
        replicaOrder: null,
      }),
      true,
    );
    assert.equal(
      shouldRefuseSpellBarKeepRemountStaleReplica({
        keep: true,
        stampedOrder: INTENDED,
        replicaOrder: null,
      }),
      true,
    );
  });

  it("does not skip without a keep stamp", () => {
    assert.equal(
      shouldSkipSpellBarKeepRemountHydrateOverwrite({
        keep: false,
        stampedOrder: INTENDED,
        replicaOrder: PLAY_ENTRY,
      }),
      false,
    );
  });
});

describe("shouldSkipSpellBarKeepRemountFlush", () => {
  it("skips remount setSpellBarOrder when replica already matches", () => {
    assert.equal(
      shouldSkipSpellBarKeepRemountFlush({
        keep: true,
        stampedOrder: INTENDED,
        replicaOrder: INTENDED,
      }),
      true,
    );
  });

  it("does not skip when replica is still Play-entry (unmount before invoke)", () => {
    assert.equal(
      shouldSkipSpellBarKeepRemountFlush({
        keep: true,
        stampedOrder: INTENDED,
        replicaOrder: PLAY_ENTRY,
      }),
      false,
    );
  });

  it("does not skip without a keep stamp", () => {
    assert.equal(
      shouldSkipSpellBarKeepRemountFlush({
        keep: false,
        stampedOrder: INTENDED,
        replicaOrder: PLAY_ENTRY,
      }),
      false,
    );
  });
});

describe("hydrate honour of the bar stamp", () => {
  it("Play-entry HUD stays Strike without honour; Inferno with honour", () => {
    assert.deepEqual(
      leftoverHydratedSpellBarAfterKeepRemount({
        keep: false,
        playEntryOrder: PLAY_ENTRY,
        stampedOrder: INTENDED,
      }),
      [...PLAY_ENTRY],
    );
    assert.deepEqual(
      leftoverHydratedSpellBarAfterKeepRemount({
        keep: true,
        playEntryOrder: PLAY_ENTRY,
        stampedOrder: INTENDED,
      }),
      [...INTENDED],
    );
    assert.equal(
      shouldHonourSpellBarKeepRemountHydrate({
        keep: true,
        playEntryOrder: INTENDED,
        stampedOrder: INTENDED,
      }),
      false,
    );
  });

  it("merges the stamp over Play-entry and leaves cache-overwrite leftover at 0", () => {
    assert.deepEqual(mergeSpellBarKeepRemountHydrate([...PLAY_ENTRY], null), [
      ...PLAY_ENTRY,
    ]);
    assert.deepEqual(
      mergeSpellBarKeepRemountHydrate([...PLAY_ENTRY], {
        order: [...INTENDED],
      }),
      [...INTENDED],
    );
  });
});

describe("resolveSpellBarKeepRemountFlushOrder", () => {
  it("does not let remount Play-entry overwrite the Inferno stamp", () => {
    assert.deepEqual(
      resolveSpellBarKeepRemountFlushOrder({
        stampedOrder: INTENDED,
        requestedOrder: PLAY_ENTRY,
      }),
      [...INTENDED],
    );
    assert.deepEqual(
      resolveSpellBarKeepRemountFlushOrder({
        stampedOrder: null,
        requestedOrder: INTENDED,
      }),
      [...INTENDED],
    );
  });
});

describe("leftoverSpellBarFlushCallsAfterKeepRemount", () => {
  it("ungated remount load overwrite is 1; keep skip of a matching replica is 0", () => {
    assert.equal(
      leftoverSpellBarFlushCallsAfterKeepRemount({
        keep: false,
        stampedOrder: null,
        replicaOrder: PLAY_ENTRY,
        ungatedCalls: 1,
      }),
      1,
    );
    assert.equal(
      leftoverSpellBarFlushCallsAfterKeepRemount({
        keep: true,
        stampedOrder: INTENDED,
        replicaOrder: INTENDED,
        ungatedCalls: 1,
      }),
      0,
    );
  });
});

describe("unmount flush / leaked retry predicates", () => {
  it("WX unmount currently clears debounce without flush; restack must flush", () => {
    assert.equal(
      shouldFlushSpellBarKeepRemountOnUnmount({
        dirty: true,
        debouncePending: true,
      }),
      true,
    );
    assert.equal(
      shouldFlushSpellBarKeepRemountOnUnmount({
        dirty: true,
        debouncePending: false,
      }),
      true,
    );
    assert.equal(
      shouldFlushSpellBarKeepRemountOnUnmount({
        dirty: false,
        debouncePending: false,
      }),
      false,
    );
  });

  it("leaked #err retry timeout must clear on unmount", () => {
    assert.equal(shouldClearSpellBarKeepRemountRetryOnUnmount(true), true);
    assert.equal(shouldClearSpellBarKeepRemountRetryOnUnmount(false), false);
    const timers = createSpellBarKeepRemountTimerRegistry();
    const cleared: Array<ReturnType<typeof setTimeout>> = [];
    const debounce = 11 as ReturnType<typeof setTimeout>;
    const retry = 22 as ReturnType<typeof setTimeout>;
    timers.debounce = debounce;
    timers.retries.add(retry);
    clearSpellBarKeepRemountTimers(timers, (id) => {
      cleared.push(id);
    });
    assert.deepEqual(cleared, [debounce, retry]);
    assert.equal(timers.debounce, null);
    assert.equal(timers.retries.size, 0);
  });
});

describe("ungated remount load overwrites the optimistic bar", () => {
  it("Play-entry getCharacter after unmount-before-invoke restores Strike", () => {
    const cache = { current: [...INTENDED] };
    const replica = [...PLAY_ENTRY];
    // WX load effect, no keep:
    cache.current = replica;
    assert.deepEqual(cache.current, [...PLAY_ENTRY]);
  });
});

describe("persistSpellBarThroughSpellBarKeepRemount", () => {
  it("stamps at first save and skips the remount retry once replica matches", async () => {
    const storage = memStorage();
    let stored = [...PLAY_ENTRY];
    let writes = 0;
    const actor = {
      setSpellBarOrder: async (_slot: bigint, spellIds: string[]) => {
        writes += 1;
        stored = [...spellIds];
        return { ok: null };
      },
      getCharacter: async () => characterRecord(stored),
    };

    const first = await persistSpellBarThroughSpellBarKeepRemount({
      storage,
      slot: SLOT,
      order: INTENDED,
      actor,
    });
    assert.deepEqual(first.order, [...INTENDED]);
    assert.equal(first.skipped, undefined);
    assert.equal(writes, 1);
    assert.deepEqual(stored, [...INTENDED]);
    assert.equal(hasSpellBarKeepRemount(storage, SLOT), true);

    const remount = await persistSpellBarThroughSpellBarKeepRemount({
      storage,
      slot: SLOT,
      order: PLAY_ENTRY,
      actor,
    });
    assert.equal(remount.skipped, true);
    assert.deepEqual(remount.order, [...INTENDED]);
    assert.equal(writes, 1);
    assert.equal(hasSpellBarKeepRemount(storage, SLOT), false);
  });

  it("retries remount setSpellBarOrder when unmount cleared debounce before invoke", async () => {
    const storage = memStorage();
    noteSpellBarKeepRemount(storage, SLOT, { order: INTENDED });
    let stored = [...PLAY_ENTRY];
    let writes = 0;
    const actor = {
      setSpellBarOrder: async (_slot: bigint, spellIds: string[]) => {
        writes += 1;
        stored = [...spellIds];
        return { ok: null };
      },
      getCharacter: async () => characterRecord(stored),
    };

    const remount = await persistSpellBarThroughSpellBarKeepRemount({
      storage,
      slot: SLOT,
      order: PLAY_ENTRY,
      actor,
    });
    assert.equal(remount.skipped, undefined);
    assert.deepEqual(remount.order, [...INTENDED]);
    assert.equal(writes, 1);
    assert.deepEqual(stored, [...INTENDED]);
  });

  it("stamps transport throw and retries the remount flush", async () => {
    const storage = memStorage();
    let stored = [...PLAY_ENTRY];
    let writes = 0;
    const actor = {
      setSpellBarOrder: async (_slot: bigint, spellIds: string[]) => {
        writes += 1;
        stored = [...spellIds];
        if (writes === 1) throw new Error("replica went away");
        return { ok: null };
      },
      getCharacter: async () => characterRecord(stored),
    };

    await assert.rejects(
      () =>
        persistSpellBarThroughSpellBarKeepRemount({
          storage,
          slot: SLOT,
          order: INTENDED,
          actor,
        }),
      /replica went away/,
    );
    assert.equal(writes, 1);
    assert.equal(hasSpellBarKeepRemount(storage, SLOT), true);
    // Transport after invoke: replica may already hold Inferno.
    const remount = await persistSpellBarThroughSpellBarKeepRemount({
      storage,
      slot: SLOT,
      order: PLAY_ENTRY,
      actor,
    });
    assert.equal(remount.skipped, true);
    assert.deepEqual(remount.order, [...INTENDED]);
    assert.equal(writes, 1);
  });

  it("keeps the stamp on explicit #err so remount can retry", async () => {
    const storage = memStorage();
    let writes = 0;
    const actor = {
      setSpellBarOrder: async () => {
        writes += 1;
        return { err: "Account banned" };
      },
      getCharacter: async () => characterRecord(PLAY_ENTRY),
    };
    await assert.rejects(
      () =>
        persistSpellBarThroughSpellBarKeepRemount({
          storage,
          slot: SLOT,
          order: INTENDED,
          actor,
        }),
      /setSpellBarOrder failed/,
    );
    assert.equal(hasSpellBarKeepRemount(storage, SLOT), true);
    assert.equal(writes, 1);
  });

  it("fail-closes a keep stamp when getCharacter misses", async () => {
    const storage = memStorage();
    noteSpellBarKeepRemount(storage, SLOT, { order: INTENDED });
    let writes = 0;
    const actor = {
      setSpellBarOrder: async () => {
        writes += 1;
        return { ok: null };
      },
      getCharacter: async () => {
        throw new Error("query replica unavailable");
      },
    };
    await assert.rejects(
      () =>
        persistSpellBarThroughSpellBarKeepRemount({
          storage,
          slot: SLOT,
          order: PLAY_ENTRY,
          actor,
        }),
      (err: unknown) =>
        err instanceof Error && err.message === SPELL_BAR_KEEP_UNCONFIRMED,
    );
    assert.equal(writes, 0);
    assert.equal(hasSpellBarKeepRemount(storage, SLOT), true);
  });

  it("pickup-only remount without a stamp still writes the requested bar", async () => {
    const storage = memStorage();
    let writes = 0;
    const actor = {
      setSpellBarOrder: async (_slot: bigint, spellIds: string[]) => {
        writes += 1;
        assert.deepEqual(spellIds, [...INTENDED]);
        return { ok: null };
      },
      getCharacter: async () => characterRecord(PLAY_ENTRY),
    };
    const result = await persistSpellBarThroughSpellBarKeepRemount({
      storage,
      slot: SLOT,
      order: INTENDED,
      actor,
    });
    assert.deepEqual(result.order, [...INTENDED]);
    assert.equal(writes, 1);
  });
});

describe("honourSpellBarKeepRemountBeforeFlush", () => {
  it("skips when replica already matches and clears the stamp", async () => {
    const storage = memStorage();
    noteSpellBarKeepRemount(storage, SLOT, { order: INTENDED });
    const honoured = await honourSpellBarKeepRemountBeforeFlush({
      storage,
      slot: SLOT,
      fetchCharacter: async () => characterRecord(INTENDED),
    });
    assert.deepEqual(honoured, { skip: true, order: [...INTENDED] });
    assert.equal(hasSpellBarKeepRemount(storage, SLOT), false);
  });

  it("does not skip when replica is still Play-entry", async () => {
    const storage = memStorage();
    noteSpellBarKeepRemount(storage, SLOT, { order: INTENDED });
    const honoured = await honourSpellBarKeepRemountBeforeFlush({
      storage,
      slot: SLOT,
      fetchCharacter: async () => characterRecord(PLAY_ENTRY),
    });
    assert.deepEqual(honoured, { skip: false, order: [...INTENDED] });
    assert.equal(hasSpellBarKeepRemount(storage, SLOT), true);
  });
});

describe("honourSpellBarKeepRemountHydrate", () => {
  it("honours Inferno over Play-entry Strike and keeps the stamp", async () => {
    const storage = memStorage();
    noteSpellBarKeepRemount(storage, SLOT, { order: INTENDED });
    const honoured = await honourSpellBarKeepRemountHydrate({
      storage,
      slot: SLOT,
      playEntryOrder: PLAY_ENTRY,
      fetchCharacter: async () => characterRecord(PLAY_ENTRY),
    });
    assert.deepEqual(honoured, [...INTENDED]);
    assert.deepEqual(readSpellBarKeepRemount(storage, SLOT), {
      order: [...INTENDED],
    });
  });

  it("fetch miss fail-closes to the stamp, not Play-entry", async () => {
    const storage = memStorage();
    noteSpellBarKeepRemount(storage, SLOT, { order: INTENDED });
    const honoured = await honourSpellBarKeepRemountHydrate({
      storage,
      slot: SLOT,
      playEntryOrder: PLAY_ENTRY,
      fetchCharacter: async () => {
        throw new Error("query replica unavailable");
      },
    });
    assert.deepEqual(honoured, [...INTENDED]);
    assert.equal(hasSpellBarKeepRemount(storage, SLOT), true);
  });

  it("does not merge replica without a keep stamp", async () => {
    const storage = memStorage();
    const honoured = await honourSpellBarKeepRemountHydrate({
      storage,
      slot: SLOT,
      playEntryOrder: PLAY_ENTRY,
      fetchCharacter: async () => characterRecord(INTENDED),
    });
    assert.deepEqual(honoured, [...PLAY_ENTRY]);
  });
});
