import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  emptyKeysDropOfficialSpellBar,
  filterSpellBarToOwnedKeys,
  isNatCatalogIndexLoadout,
  isTextSpellIdLoadout,
  natIndexLoadoutBreaksOnCatalogReorder,
  officialCallsSaveActiveSpells,
} from "./activeSpellsNatLoadout.ts";

describe("activeSpellsNatLoadout", () => {
  it("keeps official bar as text ids; Nat indexes are latent", () => {
    assert.equal(officialCallsSaveActiveSpells(), false);
    assert.equal(isTextSpellIdLoadout(["shadow_strike", "soul_rend"]), true);
    assert.equal(isNatCatalogIndexLoadout([0n, 1n, 2n]), true);
    assert.equal(isNatCatalogIndexLoadout(["shadow_strike"]), false);
    assert.equal(
      natIndexLoadoutBreaksOnCatalogReorder({
        stored: [0, 3],
        catalogOrderChanged: true,
      }),
      true,
    );
  });

  it("empty spellLevelKeys drop a catalog-visible bar on setSpellBarOrder", () => {
    const bar = ["shadow_strike", "physical_attack", "soul_rend"];
    assert.deepEqual(filterSpellBarToOwnedKeys(bar, []), []);
    assert.equal(emptyKeysDropOfficialSpellBar(bar, []), true);
    assert.deepEqual(filterSpellBarToOwnedKeys(bar, ["shadow_strike"]), [
      "shadow_strike",
    ]);
    assert.equal(emptyKeysDropOfficialSpellBar(bar, ["shadow_strike"]), false);
  });
});
