import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { physicalAttackSpell } from "../data/spellData.ts";
import {
  BOOT_PURGED_SPELL_IDS,
  LIVE_STARTER_ID_PURGED_FROM_CANISTER_CATALOG,
  motokoBossKitIdsPurgedFromSpellConfigs,
  motokoBossKitIdsStillInSpellConfigs,
} from "./kitSpellIdEvolve.ts";

describe("Motoko boss kit ids vs boot spellConfigs purge", () => {
  it("still deletes physical_attack while kits and the starter book use it", () => {
    assert.equal(physicalAttackSpell.id, "physical_attack");
    assert.equal(
      LIVE_STARTER_ID_PURGED_FROM_CANISTER_CATALOG,
      physicalAttackSpell.id,
    );
    assert.ok(
      (BOOT_PURGED_SPELL_IDS as readonly string[]).includes("physical_attack"),
    );
    assert.ok(
      motokoBossKitIdsPurgedFromSpellConfigs().includes("physical_attack"),
    );
  });

  it("lists every Motoko seed kit id that the boot purge removes", () => {
    assert.deepEqual(motokoBossKitIdsPurgedFromSpellConfigs(), [
      "blood_nova",
      "cursed_gust",
      "drain_life",
      "entangle",
      "fireball",
      "frost_nova",
      "ice_shard",
      "inferno",
      "meteor_strike",
      "mist_form",
      "obliterate",
      "physical_attack",
      "plague_wave",
      "poison_dart",
    ]);
  });

  it("keeps live catalog ids that default bosses still seed", () => {
    assert.deepEqual(motokoBossKitIdsStillInSpellConfigs(), [
      "reflect_barrier",
      "shadow_strike",
      "soul_rend",
      "thunder_clap",
      "void_collapse",
    ]);
  });
});
