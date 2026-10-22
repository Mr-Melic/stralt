/**
 * Pack ENEMY_KITS assign vs live backend-only spell pool.
 * Bishop / queen / king must receive Frost Bolt; Motoko defaults do not.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { starterSpells } from "../data/spellData.ts";
import type { SpellConfig } from "../types/gameTypes.ts";
import { buildEnemyKit } from "./enemyAI.ts";
import {
  MOTOKO_DEFAULT_SPELL_IDS,
  PACK_ENEMY_KIT_RETIRED_IDS,
  assignPackEnemyKitSpells,
  isPackEnemyKitRetiredId,
  liveAssignPackEnemyKitFromCatalogOnly,
  normalizeSpellPoolForPackAssign,
  packEnemyKitAssignedIds,
  packEnemyKitAvailableSpells,
  packEnemyKitHasDamageCast,
  shouldAssignPackEnemyKitSpells,
} from "./packEnemyKitAssign.ts";

const here = dirname(fileURLToPath(import.meta.url));

function mustSpell(id: string): SpellConfig {
  const spell = starterSpells.find((s) => s.id === id);
  assert.ok(spell, id);
  return spell;
}

function motokoCatalog(): SpellConfig[] {
  return MOTOKO_DEFAULT_SPELL_IDS.map((id) => ({
    ...mustSpell("starter-frost"),
    id,
    name: id,
    usableByEnemy: true,
  }));
}

describe("live pack kit assign vs Motoko default catalog", () => {
  const catalog = motokoCatalog();
  const frost = mustSpell("starter-frost");

  it("Motoko default ids contain none of the pack kit ids", () => {
    const kitIds = new Set([
      ...buildEnemyKit("bishop", 0),
      ...buildEnemyKit("queen", 0),
      ...buildEnemyKit("king", 0),
      ...buildEnemyKit("pawn", 0),
      ...buildEnemyKit("rook", 1),
      ...buildEnemyKit("bishop", 1),
    ]);
    for (const id of kitIds) {
      assert.equal(
        (MOTOKO_DEFAULT_SPELL_IDS as readonly string[]).includes(id),
        false,
        id,
      );
    }
    assert.equal(isPackEnemyKitRetiredId("physical_attack"), true);
    assert.equal(PACK_ENEMY_KIT_RETIRED_IDS.has("starter-frost"), false);
  });

  it("live catalog-only assign leaves bishop / queen / king empty", () => {
    for (const piece of ["bishop", "queen", "king"] as const) {
      const live = liveAssignPackEnemyKitFromCatalogOnly(piece, 0, catalog);
      assert.deepEqual(live, []);
      assert.deepEqual(packEnemyKitAvailableSpells(live), []);
      assert.equal(packEnemyKitHasDamageCast(live), false);
    }
  });

  it("assigns starter Frost Bolt when the catalog misses the kit id", () => {
    const assigned = assignPackEnemyKitSpells({
      pieceType: "bishop",
      levelZone: 0,
      catalogPool: catalog,
      starterRegistry: starterSpells,
    });
    assert.deepEqual(packEnemyKitAssignedIds(assigned), ["starter-frost"]);
    assert.equal(assigned[0]?.usableByEnemy, true);
    assert.equal(Number(assigned[0]?.damage), 20);
    assert.equal(Number(assigned[0]?.range), 4);
    assert.equal(assigned[0]?.debuffStat, "mp");
    assert.deepEqual(
      packEnemyKitAssignedIds(packEnemyKitAvailableSpells(assigned)),
      ["starter-frost"],
    );
    assert.equal(packEnemyKitHasDamageCast(assigned), true);
    assert.equal(frost.usableByEnemy, undefined);
  });

  it("queen and king zone-0 also receive Frost Bolt", () => {
    for (const piece of ["queen", "king"] as const) {
      const assigned = shouldAssignPackEnemyKitSpells({
        pieceType: piece,
        levelZone: 0,
        catalogPool: catalog,
        starterRegistry: starterSpells,
      });
      assert.deepEqual(packEnemyKitAssignedIds(assigned), ["starter-frost"]);
    }
  });

  it("does not revive retired Strike; pawn / knight stay Crush", () => {
    for (const piece of ["pawn", "knight"] as const) {
      assert.deepEqual(buildEnemyKit(piece, 0), ["physical_attack"]);
      const assigned = assignPackEnemyKitSpells({
        pieceType: piece,
        levelZone: 0,
        catalogPool: catalog,
        starterRegistry: starterSpells,
      });
      assert.deepEqual(assigned, []);
    }
  });
});

describe("normalize usableByEnemy default vs apply filter", () => {
  it("drops unset Frost Bolt after WX normalize; assign falls back to starter", () => {
    const frost = mustSpell("starter-frost");
    const normalized = normalizeSpellPoolForPackAssign([frost]);
    assert.equal(normalized[0]?.usableByEnemy, false);
    const live = liveAssignPackEnemyKitFromCatalogOnly("bishop", 0, normalized);
    assert.deepEqual(packEnemyKitAssignedIds(live), ["starter-frost"]);
    assert.deepEqual(
      packEnemyKitAvailableSpells(live),
      [],
      "apply usableByEnemy !== false drops the normalized default",
    );
    const assigned = assignPackEnemyKitSpells({
      pieceType: "bishop",
      levelZone: 0,
      catalogPool: normalized,
      starterRegistry: starterSpells,
    });
    assert.equal(assigned[0]?.usableByEnemy, true);
    assert.equal(assigned[0]?.id, "starter-frost");
    assert.deepEqual(
      packEnemyKitAssignedIds(packEnemyKitAvailableSpells(assigned)),
      ["starter-frost"],
      "normalized catalog false falls back to starter Frost Bolt",
    );
  });

  it("honours a catalog Frost Bolt override; catalog false falls back to starter", () => {
    const catalogFrost = {
      ...mustSpell("starter-frost"),
      damage: 33n,
      usableByEnemy: true,
    };
    const assigned = assignPackEnemyKitSpells({
      pieceType: "bishop",
      levelZone: 0,
      catalogPool: [catalogFrost],
      starterRegistry: starterSpells,
    });
    assert.equal(Number(assigned[0]?.damage), 33);
    const normalizedFalse = assignPackEnemyKitSpells({
      pieceType: "bishop",
      levelZone: 0,
      catalogPool: [{ ...catalogFrost, usableByEnemy: false }],
      starterRegistry: starterSpells,
    });
    assert.equal(
      Number(normalizedFalse[0]?.damage),
      20,
      "catalog false falls back to starter Frost Bolt (20), not the override",
    );
  });

  it("zone-1 bishop fills Poison from starter; Rallying Cry stays skipped", () => {
    const bishop = assignPackEnemyKitSpells({
      pieceType: "bishop",
      levelZone: 1,
      catalogPool: motokoCatalog(),
      starterRegistry: starterSpells,
    });
    assert.deepEqual(packEnemyKitAssignedIds(bishop), [
      "starter-frost",
      "starter-poison",
    ]);
    assert.equal(mustSpell("spell-rallying-cry").usableByEnemy, false);
    const king = assignPackEnemyKitSpells({
      pieceType: "king",
      levelZone: 1,
      catalogPool: motokoCatalog(),
      starterRegistry: starterSpells,
    });
    assert.deepEqual(packEnemyKitAssignedIds(king), ["starter-frost"]);
  });

  it("drops a kit row that is still on cooldown", () => {
    const assigned = assignPackEnemyKitSpells({
      pieceType: "bishop",
      levelZone: 0,
      catalogPool: motokoCatalog(),
      starterRegistry: starterSpells,
    });
    const cd = new Map<string, number>([["starter-frost", 1]]);
    assert.deepEqual(packEnemyKitAvailableSpells(assigned, cd), []);
  });
});

describe("does not steal boss / summon / player Frost PRs", () => {
  it("does not treat Swap, Mark, Slow, or summon-archer as pack kit ids", () => {
    const zone0 = [
      ...buildEnemyKit("bishop", 0),
      ...buildEnemyKit("queen", 0),
      ...buildEnemyKit("king", 0),
      ...buildEnemyKit("pawn", 0),
      ...buildEnemyKit("knight", 0),
      ...buildEnemyKit("rook", 0),
    ];
    assert.equal(zone0.includes("spell-swap"), false);
    assert.equal(zone0.includes("spell-mark"), false);
    assert.equal(zone0.includes("spell-slow"), false);
    assert.equal(zone0.includes("summon-archer"), false);
    assert.equal(zone0.includes("spell-mirror"), false);
  });
});

describe("live WX / Motoko still miss pack kit ids", () => {
  it("WorldExploration assignEnemySpells still finds only the backend pool", () => {
    const wx = readFileSync(
      join(here, "../components/WorldExploration.tsx"),
      "utf8",
    );
    assert.match(wx, /const kitIds = buildEnemyKit/);
    assert.match(wx, /normalizedSpellPool\.find\(\(s\) => s\.id === id\)/);
    assert.equal(wx.includes("assignPackEnemyKitSpells"), false);
    assert.match(wx, /usableByEnemy: false,\s*\n\s*\.\.\.s,/);
  });

  it("AdminLib.defaultSpells never seeds starter-frost", () => {
    const admin = readFileSync(
      join(here, "../../../backend/lib/admin.mo"),
      "utf8",
    );
    const block = admin.slice(
      admin.indexOf("public func defaultSpells"),
      admin.indexOf("public func defaultGameConfig"),
    );
    for (const id of MOTOKO_DEFAULT_SPELL_IDS) {
      assert.match(block, new RegExp(`id = "${id}"`));
    }
    assert.equal(block.includes('id = "starter-frost"'), false);
    assert.equal(block.includes('id = "physical_attack"'), false);
  });
});
