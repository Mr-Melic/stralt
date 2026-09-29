/**
 * Combat action parity: bomber kamikaze decide matches execute splash.
 * A highlighted legal cluster victim is executable; an illegal one cannot.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  AI_KAMIKAZE_BLAST_RADIUS,
  AI_KAMIKAZE_LOW_HP_PCT,
  AI_KAMIKAZE_MIN_TARGETS,
} from "../data/gameConstants.ts";
import { starterSpells } from "../data/spellData.ts";
import {
  bomberHighlightedClusterVictimIsExecutable,
  bomberKamikazeBlastRadius,
  bomberKamikazeDetonatesSelf,
  bomberKamikazeExecuteDetonatesOnInferno,
  canExecuteBomberKamikazePrimary,
  canExecuteBomberKamikazeSplash,
  countBomberClusterTargets,
  resolveBomberExecuteBlastRadius,
  shouldDecideBomberClusterVictim,
  shouldDecideBomberDetonate,
} from "./bomberKamikazeBlast.ts";

function mustSpell(id: string) {
  const spell = starterSpells.find((s) => s.id === id);
  assert.ok(spell, id);
  return spell;
}

describe("bomber kamikaze blast vs Inferno areaRadius", () => {
  it("keeps Inferno as a 0-radius DoT and still executes radius-2 splash", () => {
    const inferno = mustSpell("spell-inferno");
    assert.equal(Number(inferno.areaRadius ?? 0), 0);
    assert.equal(Number(inferno.damage), 0);
    assert.equal(bomberKamikazeBlastRadius(), AI_KAMIKAZE_BLAST_RADIUS);
    assert.equal(bomberKamikazeBlastRadius(), 2);
    assert.equal(resolveBomberExecuteBlastRadius(inferno, true), 2);
    assert.equal(
      resolveBomberExecuteBlastRadius(inferno, false),
      0,
      "non-bomber Inferno must not grow a player AoE",
    );
  });

  it("executes a living hostile at Chebyshev 2 and refuses Chebyshev 3", () => {
    const primary = { id: "center", x: 4, y: 4, hp: 12, side: "enemy" };
    const inRing = { id: "near", x: 6, y: 4, hp: 8, side: "enemy" };
    const tooFar = { id: "far", x: 7, y: 4, hp: 8, side: "enemy" };
    const decided = shouldDecideBomberClusterVictim({
      primary,
      victim: inRing,
      casterSide: "player",
    });
    const executable = canExecuteBomberKamikazeSplash({
      primary,
      victim: inRing,
      casterSide: "player",
    });
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(
      bomberHighlightedClusterVictimIsExecutable({ decided, executable }),
      true,
    );
    assert.equal(
      canExecuteBomberKamikazeSplash({
        primary,
        victim: tooFar,
        casterSide: "player",
      }),
      false,
    );
    assert.equal(
      shouldDecideBomberClusterVictim({
        primary,
        victim: tooFar,
        casterSide: "player",
      }),
      false,
    );
    assert.equal(
      bomberHighlightedClusterVictimIsExecutable({
        decided: false,
        executable: false,
      }),
      false,
    );
  });

  it("does not splash the primary, a corpse, or an ally", () => {
    const primary = { id: "center", x: 5, y: 5, hp: 10, side: "enemy" };
    assert.equal(
      canExecuteBomberKamikazeSplash({
        primary,
        victim: primary,
        casterSide: "player",
      }),
      false,
    );
    assert.equal(
      canExecuteBomberKamikazeSplash({
        primary,
        victim: { id: "corpse", x: 6, y: 5, hp: 0, side: "enemy" },
        casterSide: "player",
      }),
      false,
    );
    assert.equal(
      canExecuteBomberKamikazeSplash({
        primary,
        victim: { id: "wolf", x: 6, y: 5, hp: 9, side: "player" },
        casterSide: "player",
      }),
      false,
    );
  });

  it("counts a 2-foe cluster the same way decide detonates", () => {
    const center = { x: 3, y: 3 };
    const foes = [
      { x: 3, y: 3 },
      { x: 5, y: 3 },
      { x: 8, y: 3 },
    ];
    assert.equal(countBomberClusterTargets(center, foes), 2);
    assert.equal(AI_KAMIKAZE_MIN_TARGETS, 2);
    const inferno = mustSpell("spell-inferno");
    const origin = { x: 3, y: 4 };
    const decided = shouldDecideBomberDetonate({
      origin,
      primary: center,
      spell: inferno,
      clusterCount: 2,
      hpFrac: 1,
    });
    const executable = canExecuteBomberKamikazePrimary({
      origin,
      primary: center,
      spell: inferno,
      clusterCount: 2,
      hpFrac: 1,
    });
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(
      canExecuteBomberKamikazePrimary({
        origin,
        primary: center,
        spell: inferno,
        clusterCount: 1,
        hpFrac: 1,
      }),
      false,
      "a lone foe is not a cluster unless HP is critical",
    );
    assert.equal(
      canExecuteBomberKamikazePrimary({
        origin,
        primary: center,
        spell: inferno,
        clusterCount: 1,
        hpFrac: AI_KAMIKAZE_LOW_HP_PCT - 0.01,
      }),
      true,
    );
  });

  it("cannot detonate when the cluster center is beyond Inferno range", () => {
    const inferno = mustSpell("spell-inferno");
    assert.equal(Number(inferno.range), 3);
    assert.equal(
      canExecuteBomberKamikazePrimary({
        origin: { x: 0, y: 0 },
        primary: { x: 4, y: 0 },
        spell: inferno,
        clusterCount: 3,
        hpFrac: 0,
      }),
      false,
    );
  });

  it("detonates the bomber on a spent Inferno even when damage is 0", () => {
    const inferno = mustSpell("spell-inferno");
    assert.equal(bomberKamikazeExecuteDetonatesOnInferno(inferno, true), true);
    assert.equal(
      bomberKamikazeDetonatesSelf({ isBomber: true, spentCast: true }),
      true,
    );
    assert.equal(
      bomberKamikazeDetonatesSelf({ isBomber: true, spentCast: false }),
      false,
    );
    assert.equal(
      bomberKamikazeExecuteDetonatesOnInferno(inferno, false),
      false,
    );
  });

  it("does not steal Frost Nova catalog splash for a non-bomber", () => {
    const nova = mustSpell("spell-frost-nova");
    assert.equal(Number(nova.areaRadius), 2);
    assert.equal(resolveBomberExecuteBlastRadius(nova, false), 2);
    assert.equal(resolveBomberExecuteBlastRadius(nova, true), 2);
  });
});
