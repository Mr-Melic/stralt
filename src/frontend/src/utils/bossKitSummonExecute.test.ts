import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { physicalAttackSpell, starterSpells } from "../data/spellData.ts";
import {
  bossKitSummonChebyshev,
  bossKitSummonHighlightedIsExecutable,
  bossKitSummonInRange,
  bossKitSummonManhattan,
  canExecuteBossKitSummon,
  isBossKitSummonDestOccupied,
  isBossKitSummonSpell,
  liveBossKitSummonApplies,
  shouldDecideBossKitSummon,
} from "./bossKitSummonExecute.ts";

/** Avoid importing bossKits.ts (bossTypes has no .js specifier under node --test). */
function phase1FirstId(bossId: string): string | null {
  const src = readFileSync(
    new URL("../data/bossKits.ts", import.meta.url),
    "utf8",
  );
  const block = src.split(`${bossId}:`)[1] ?? "";
  const match = block.match(/phase1SpellIds:\s*\[([^\]]+)\]/);
  if (!match) return null;
  const first = match[1].match(/"([^"]+)"/);
  return first?.[1] ?? null;
}

function mustSpell(id: string) {
  const spell = starterSpells.find((s) => s.id === id);
  assert.ok(spell, id);
  return spell;
}

const archer = mustSpell("summon-archer");
const wolf = mustSpell("summon-dire-wolf");
const strike = physicalAttackSpell;
const inferno = mustSpell("spell-inferno");
const blast = mustSpell("starter-blast");
const swap = mustSpell("spell-swap");
const rally = mustSpell("spell-rallying-cry");
const drain = mustSpell("starter-drain");
const venom = mustSpell("spell-venom-strike");

const boss = { x: 4, y: 4 };
const manhattan1 = { x: 5, y: 4 };
const manhattan2 = { x: 6, y: 4 };
const manhattan3 = { x: 7, y: 4 };
const chebyshev2Diagonal = { x: 6, y: 6 };
const farPlayer = { x: 10, y: 10 };

describe("first-id kit always decides Broodmother summon", () => {
  it("Broodmother Rook phase-1 first id is Summon Archer", () => {
    assert.equal(phase1FirstId("broodmother_rook"), "summon-archer");
    assert.equal(Number(archer.range), 2);
    assert.equal(archer.isSummon, true);
    assert.equal(archer.targetType, "ground");
    assert.equal(archer.diagonal ?? false, false);
  });

  it("does not steal Pale Archivist / Enthroned Void / Final Pawn first-ids", () => {
    assert.equal(phase1FirstId("pale_archivist"), "spell-cursed-wound");
    assert.equal(phase1FirstId("enthroned_void"), "spell-swap");
    assert.equal(phase1FirstId("final_pawn"), "physical_attack");
  });
});

describe("isBossKitSummonSpell", () => {
  it("treats catalog Archer / Dire Wolf as summons", () => {
    assert.equal(isBossKitSummonSpell(archer), true);
    assert.equal(isBossKitSummonSpell(wolf), true);
  });

  it("does not steal Strike, Inferno, Chain Lightning, Swap, Rallying Cry, Drain, or Venom", () => {
    assert.equal(isBossKitSummonSpell(strike), false);
    assert.equal(isBossKitSummonSpell(inferno), false);
    assert.equal(isBossKitSummonSpell(blast), false);
    assert.equal(isBossKitSummonSpell(swap), false);
    assert.equal(isBossKitSummonSpell(rally), false);
    assert.equal(isBossKitSummonSpell(drain), false);
    assert.equal(isBossKitSummonSpell(venom), false);
    assert.equal(isBossKitSummonSpell(null), false);
  });

  it("keys off metadata, not the display name", () => {
    assert.equal(
      isBossKitSummonSpell({
        id: "custom-hatch",
        isSummon: true,
        spellType: "summon",
        targetType: "ground",
        range: 2,
        summonUnitDef: { pieceType: "archer" },
      }),
      true,
    );
    assert.equal(
      isBossKitSummonSpell({
        id: "named-summon-but-damage",
        spellType: "damage",
        range: 2,
      }),
      false,
    );
  });
});

describe("canExecuteBossKitSummon vs live WX apply", () => {
  it("executes empty ground at Manhattan 2 <= range 2", () => {
    assert.equal(bossKitSummonManhattan(boss, manhattan2), 2);
    const occupied = [boss];
    assert.equal(
      canExecuteBossKitSummon({
        spell: archer,
        from: boss,
        to: manhattan2,
        occupied,
      }),
      true,
    );
    assert.equal(
      shouldDecideBossKitSummon({
        spell: archer,
        from: boss,
        to: manhattan2,
        occupied,
      }),
      true,
    );
    assert.equal(
      bossKitSummonHighlightedIsExecutable({
        decided: true,
        executable: true,
      }),
      true,
    );
  });

  it("does not execute the player dest even when Manhattan 2 (occupied ground)", () => {
    const player = manhattan2;
    const occupied = [boss, player];
    assert.equal(isBossKitSummonDestOccupied(player, occupied), true);
    const decided = shouldDecideBossKitSummon({
      spell: archer,
      from: boss,
      to: player,
      occupied,
    });
    const executable = canExecuteBossKitSummon({
      spell: archer,
      from: boss,
      to: player,
      occupied,
    });
    assert.equal(decided, false);
    assert.equal(executable, false);
    assert.equal(
      bossKitSummonHighlightedIsExecutable({ decided, executable }),
      false,
    );
    assert.equal(
      liveBossKitSummonApplies(archer),
      true,
      "live WX still spawns at the player dest",
    );
  });

  it("does not execute a far player dest (Manhattan 12 > range 2)", () => {
    assert.equal(bossKitSummonManhattan(boss, farPlayer), 12);
    assert.equal(
      canExecuteBossKitSummon({
        spell: archer,
        from: boss,
        to: farPlayer,
        occupied: [boss, farPlayer],
      }),
      false,
    );
    assert.equal(
      liveBossKitSummonApplies(archer),
      true,
      "live occupancy snap still places the archer near the player",
    );
  });

  it("does not execute empty ground at Manhattan 3 > range 2", () => {
    assert.equal(bossKitSummonManhattan(boss, manhattan3), 3);
    assert.equal(
      canExecuteBossKitSummon({
        spell: archer,
        from: boss,
        to: manhattan3,
        occupied: [boss],
      }),
      false,
    );
    assert.equal(
      bossKitSummonInRange({
        spell: archer,
        from: boss,
        to: manhattan1,
      }),
      true,
    );
  });

  it("does not treat Chebyshev 2 diagonal as in-range (player ground is Manhattan)", () => {
    assert.equal(bossKitSummonChebyshev(boss, chebyshev2Diagonal), 2);
    assert.equal(bossKitSummonManhattan(boss, chebyshev2Diagonal), 4);
    assert.equal(
      canExecuteBossKitSummon({
        spell: archer,
        from: boss,
        to: chebyshev2Diagonal,
        occupied: [boss],
      }),
      false,
      "unique vs #888 Chebyshev ranged-primary gate",
    );
  });

  it("still executes a wall-blocked in-range empty tile (kit summon skips LoS)", () => {
    assert.equal(
      canExecuteBossKitSummon({
        spell: archer,
        from: boss,
        to: manhattan2,
        occupied: [boss],
      }),
      true,
      "do not merge player !!lineOfSight; catalog Archer has none",
    );
  });

  it("cannot execute Strike / Inferno / Chain Lightning / Swap as a summon", () => {
    for (const spell of [strike, inferno, blast, swap]) {
      assert.equal(
        canExecuteBossKitSummon({
          spell,
          from: boss,
          to: manhattan1,
          occupied: [boss],
        }),
        false,
      );
    }
  });

  it("does not execute onto the boss tile (caster is occupied ground)", () => {
    assert.equal(
      canExecuteBossKitSummon({
        spell: archer,
        from: boss,
        to: boss,
        occupied: [boss],
      }),
      false,
    );
  });
});
