import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  FRONTEND_ONLY_SUMMON_UNIT_DEF_FIELDS,
  MOTOKO_SUMMON_UNIT_DEF_FIELDS,
  frontendOnlySummonFieldsPresent,
  summonKitLostOnBackendRoundTrip,
  toPersistedSummonUnitDef,
} from "./summonUnitDefPersist.ts";

describe("summonUnitDefPersist", () => {
  it("persists only the four Motoko SummonUnitDef fields", () => {
    assert.deepEqual(
      [...MOTOKO_SUMMON_UNIT_DEF_FIELDS],
      ["pieceType", "level", "hpScale", "damageScale"],
    );
    const wire = toPersistedSummonUnitDef({
      pieceType: "wolf",
      level: 1,
      hpScale: 1,
      damageScale: 1,
      summonKit: ["physical_attack", "spell-venom-strike"],
      ap: 2,
      mp: 3,
    });
    assert.deepEqual(wire, {
      pieceType: "wolf",
      level: 1,
      hpScale: 1,
      damageScale: 1,
    });
    assert.equal("summonKit" in wire, false);
  });

  it("flags kit/ap/mp loss on backend round-trip", () => {
    assert.equal(
      summonKitLostOnBackendRoundTrip({
        pieceType: "archer",
        summonKit: ["starter-poison", "spell-slow"],
      }),
      true,
    );
    assert.equal(summonKitLostOnBackendRoundTrip({ pieceType: "wolf" }), false);
    assert.deepEqual(
      frontendOnlySummonFieldsPresent({
        pieceType: "wisp",
        summonKit: ["starter-heal"],
        ap: 2,
        mp: 0,
      }),
      ["summonKit", "ap"],
    );
    assert.deepEqual(
      [...FRONTEND_ONLY_SUMMON_UNIT_DEF_FIELDS],
      ["summonKit", "ap", "mp"],
    );
  });
});
