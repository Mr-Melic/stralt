import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { pendingDeathPenaltyStorageKey } from "./deathPenalty.ts";
import {
  clearSlotReuseBrowserCaches,
  covenantBuffLocalStorageKey,
  deleteCharacterClearsAchievementProgress,
  deleteCharacterClearsBossRushForSlot,
  deleteCharacterClearsBuffInventories,
  deleteCharacterClearsDungeonRecords,
  deleteCharacterClearsPrincipalDoka,
  groundDokaPickupLocalStorageKey,
  mapsVisitedLocalStorageKey,
  officialDeleteClearsPendingDeathBrowserMarker,
  unpaidDeathPendingKeyIncludesCharacterIdentity,
  unpaidDeathWouldCutFreshOccupantWallet,
} from "./slotReusePersistEvolve.ts";

function memStorage(): {
  store: Map<string, string>;
  api: {
    getItem: (k: string) => string | null;
    setItem: (k: string, v: string) => void;
    removeItem: (k: string) => void;
  };
} {
  const store = new Map<string, string>();
  return {
    store,
    api: {
      getItem: (k) => store.get(k) ?? null,
      setItem: (k, v) => {
        store.set(k, v);
      },
      removeItem: (k) => {
        store.delete(k);
      },
    },
  };
}

describe("slotReusePersistEvolve", () => {
  it("documents create/delete Boss Rush clear vs leftover dungeon/buffs/wallet/feats", () => {
    assert.equal(deleteCharacterClearsBossRushForSlot(), true);
    assert.equal(deleteCharacterClearsDungeonRecords(), false);
    assert.equal(deleteCharacterClearsBuffInventories(), false);
    assert.equal(deleteCharacterClearsAchievementProgress(), false);
    assert.equal(deleteCharacterClearsPrincipalDoka(), false);
    assert.equal(unpaidDeathPendingKeyIncludesCharacterIdentity(), false);
    assert.equal(officialDeleteClearsPendingDeathBrowserMarker(), true);
  });

  it("would cut a fresh occupant's unchanged principal Doka from leftover unpaid death", () => {
    assert.equal(
      unpaidDeathWouldCutFreshOccupantWallet({
        freshXp: 0,
        freshDoka: 200,
        pending: {
          slot: 1,
          preXp: 100,
          preDoka: 200,
          afterXp: 80,
          afterDoka: 120,
        },
      }),
      true,
    );
    assert.equal(
      unpaidDeathWouldCutFreshOccupantWallet({
        freshXp: 80,
        freshDoka: 120,
        pending: {
          slot: 1,
          preXp: 100,
          preDoka: 200,
          afterXp: 80,
          afterDoka: 120,
        },
      }),
      false,
    );
  });

  it("clears slot death-pending and optional userId feat caches", () => {
    const primary = memStorage();
    const extra = memStorage();
    primary.api.setItem(
      pendingDeathPenaltyStorageKey(1),
      JSON.stringify({
        slot: 1,
        preXp: 100,
        preDoka: 200,
        afterXp: 80,
        afterDoka: 120,
      }),
    );
    extra.api.setItem(mapsVisitedLocalStorageKey("aaaaa-aa", 1), "25");
    extra.api.setItem(groundDokaPickupLocalStorageKey("aaaaa-aa", 1), "10");
    extra.api.setItem(covenantBuffLocalStorageKey("aaaaa-aa", 1), "dawn");

    clearSlotReuseBrowserCaches(1, {
      userId: "aaaaa-aa",
      primary: primary.api,
      extraStorage: extra.api,
    });

    assert.equal(primary.api.getItem(pendingDeathPenaltyStorageKey(1)), null);
    assert.equal(
      extra.api.getItem(mapsVisitedLocalStorageKey("aaaaa-aa", 1)),
      null,
    );
    assert.equal(
      extra.api.getItem(groundDokaPickupLocalStorageKey("aaaaa-aa", 1)),
      null,
    );
    assert.equal(
      extra.api.getItem(covenantBuffLocalStorageKey("aaaaa-aa", 1)),
      null,
    );
  });
});
