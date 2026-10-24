import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { physicalAttackSpell, starterSpells } from "../data/spellData.ts";
import { countsTowardKillRewards, shouldAwardVictory } from "./battleSetup.ts";
import {
  type BossChainLightningTargetActionLike,
  CHAIN_LIGHTNING_EMPTY_LOG,
  CHAIN_LIGHTNING_HIT_LOG,
  CHAIN_LIGHTNING_TARGET_ABILITY,
  CHAIN_LIGHTNING_TARGET_DAMAGE,
  type ChainLightningOccupant,
  type ChainLightningTargetCombatant,
  bossChainLightningTargetHpFromAction,
  chainLightningAdjacentTiles,
  chainLightningDamageToTargets,
  chainLightningTargetStillHostile,
  resolveBossChainLightningTargetHpCommit,
  shouldCreditChainLightningTargetKill,
  wxBossChainLightningCommitWithoutTargetHp,
  wxBossChainLightningDroppedTargetHp,
} from "./bossChainLightningTargetHpCommit.ts";

const PLAYER_STRIKE_DAMAGE = Number(physicalAttackSpell.damage);
const VAMPIRIC_AOE_TARGET_DRAIN = 10;
const QUEEN_RAY_DAMAGE = Math.floor(8 * 0.8);
const DAWN_NEGATIVE_DAMAGE_TO_PLAYER = -10;
const KIT_BLAST_DAMAGE = 20;

function openBoard(): boolean[][] {
  return Array.from({ length: 16 }, () =>
    Array.from({ length: 16 }, () => true),
  );
}

function chainAction(
  damageToTargets: Record<string, number> = {},
  damageToPlayer = CHAIN_LIGHTNING_TARGET_DAMAGE,
): BossChainLightningTargetActionLike {
  return {
    type: "ability",
    ability: CHAIN_LIGHTNING_TARGET_ABILITY,
    abilityResult: {
      damageToPlayer,
      damageToTargets,
      logMessages: [
        `${CHAIN_LIGHTNING_HIT_LOG} pawn for ${CHAIN_LIGHTNING_TARGET_DAMAGE}!`,
      ],
    },
  };
}

function unit(args: {
  id: string;
  hp: number;
  x?: number;
  y?: number;
  side?: "player" | "enemy";
  isSummon?: boolean;
}): ChainLightningTargetCombatant {
  return {
    id: args.id,
    hp: args.hp,
    x: args.x,
    y: args.y,
    side: args.side,
    isSummon: args.isSummon,
  };
}

function roster(minionHp: number): ChainLightningTargetCombatant[] {
  return [
    unit({ id: "boss-static", hp: 10, x: 8, y: 8 }),
    unit({ id: "minion-a", hp: minionHp, x: 10, y: 8 }),
  ];
}

function victoryAfterStrike(hostilesRemaining: number): boolean {
  return shouldAwardVictory({
    inBattle: true,
    deathTriggered: false,
    battleStartIdsSize: 2,
    hostilesRemaining,
  });
}

function hostilesAfterStrikeOnBoss(
  combatants: readonly ChainLightningTargetCombatant[],
): number {
  return combatants.filter((c) => {
    if (c.id === "boss-static") {
      return c.hp - PLAYER_STRIKE_DAMAGE > 0;
    }
    return chainLightningTargetStillHostile(c);
  }).length;
}

function mustSpell(id: string) {
  const spell = starterSpells.find((s) => s.id === id);
  assert.ok(spell, id);
  return spell;
}

describe("chainLightningAdjacentTiles (production getAdjacentTiles)", () => {
  it("returns the four orthogonal floor neighbors, not the shock cell", () => {
    const adj = chainLightningAdjacentTiles({
      tile: { x: 8, y: 8 },
      allTiles: openBoard(),
    });
    assert.deepEqual(adj.map((c) => `${c.x},${c.y}`).sort(), [
      "7,8",
      "8,7",
      "8,9",
      "9,8",
    ]);
    assert.equal(
      adj.some((c) => c.x === 8 && c.y === 8),
      false,
    );
  });

  it("a wall neighbor is dropped; a diagonal is never a neighbor", () => {
    const tiles = openBoard();
    tiles[8][9] = false;
    const adj = chainLightningAdjacentTiles({
      tile: { x: 8, y: 8 },
      allTiles: tiles,
    });
    assert.equal(
      adj.some((c) => c.x === 9 && c.y === 8),
      false,
    );
    assert.equal(
      adj.some((c) => c.x === 9 && c.y === 9),
      false,
    );
  });
});

describe("wxBossChainLightningCommitWithoutTargetHp (live leftover)", () => {
  it("8 HP shock-adjacent minion stays 8 after the blast log", () => {
    const action = chainAction({
      "minion-a": CHAIN_LIGHTNING_TARGET_DAMAGE,
    });
    const live = wxBossChainLightningCommitWithoutTargetHp({
      combatants: roster(CHAIN_LIGHTNING_TARGET_DAMAGE),
      action,
    });
    assert.equal(live.combatants[0]?.hp, 10, "boss HP is not this file");
    assert.equal(live.combatants[1]?.hp, CHAIN_LIGHTNING_TARGET_DAMAGE);
    assert.equal(live.hostilesRemaining, 2);
    assert.equal(live.lethalIds.length, 0);
    assert.equal(
      wxBossChainLightningDroppedTargetHp({
        combatants: roster(CHAIN_LIGHTNING_TARGET_DAMAGE),
        action,
      }),
      true,
      "live WX drops advertised minion HP",
    );
  });

  it("Strike 10 kills the 10 HP boss but leftover minion blocks victory persist", () => {
    assert.equal(PLAYER_STRIKE_DAMAGE, 10);
    const live = wxBossChainLightningCommitWithoutTargetHp({
      combatants: roster(CHAIN_LIGHTNING_TARGET_DAMAGE),
      action: chainAction({ "minion-a": CHAIN_LIGHTNING_TARGET_DAMAGE }),
    });
    const hostiles = hostilesAfterStrikeOnBoss(live.combatants);
    assert.equal(hostiles, 1);
    assert.equal(victoryAfterStrike(hostiles), false);
  });
});

describe("resolveBossChainLightningTargetHpCommit", () => {
  it("8 HP shock-adjacent minion dies so Strike 10 on the boss awards victory", () => {
    const action = chainAction({
      "minion-a": CHAIN_LIGHTNING_TARGET_DAMAGE,
    });
    const next = resolveBossChainLightningTargetHpCommit({
      combatants: roster(CHAIN_LIGHTNING_TARGET_DAMAGE),
      action,
    });
    assert.deepEqual(bossChainLightningTargetHpFromAction(action), {
      "minion-a": CHAIN_LIGHTNING_TARGET_DAMAGE,
    });
    assert.equal(next.combatants[0]?.hp, 10, "must not heal the boss");
    assert.equal(next.combatants[1]?.hp, 0);
    assert.equal(next.hostilesRemaining, 1);
    assert.deepEqual(next.lethalIds, ["minion-a"]);
    const hostiles = hostilesAfterStrikeOnBoss(next.combatants);
    assert.equal(hostiles, 0);
    assert.equal(victoryAfterStrike(hostiles), true);
  });

  it("9 HP shock-adjacent minion survives at 1 and still blocks victory after Strike", () => {
    const next = resolveBossChainLightningTargetHpCommit({
      combatants: roster(CHAIN_LIGHTNING_TARGET_DAMAGE + 1),
      action: chainAction({ "minion-a": CHAIN_LIGHTNING_TARGET_DAMAGE }),
    });
    assert.equal(next.combatants[1]?.hp, 1);
    assert.equal(next.lethalIds.length, 0);
    const hostiles = hostilesAfterStrikeOnBoss(next.combatants);
    assert.equal(hostiles, 1);
    assert.equal(victoryAfterStrike(hostiles), false);
  });

  it("two shock tiles stack 8+8 onto the same orthogonal neighbor", () => {
    const tiles = openBoard();
    const others: ChainLightningOccupant[] = [{ id: "minion-a", x: 9, y: 8 }];
    const damageToTargets = chainLightningDamageToTargets({
      bossId: "boss-static",
      shockTiles: [
        { x: 8, y: 8 },
        { x: 10, y: 8 },
      ],
      allTiles: tiles,
      others,
    });
    assert.equal(
      damageToTargets["minion-a"],
      CHAIN_LIGHTNING_TARGET_DAMAGE * 2,
    );
    const next = resolveBossChainLightningTargetHpCommit({
      combatants: [
        unit({ id: "boss-static", hp: 10, x: 8, y: 7 }),
        unit({ id: "minion-a", hp: 16, x: 9, y: 8 }),
      ],
      action: chainAction(damageToTargets, 0),
    });
    assert.equal(next.combatants[1]?.hp, 0);
    assert.deepEqual(next.lethalIds, ["minion-a"]);
  });

  it("an occupant sitting on the shock tile is not blasted", () => {
    const damageToTargets = chainLightningDamageToTargets({
      bossId: "boss-static",
      shockTiles: [{ x: 10, y: 8 }],
      allTiles: openBoard(),
      others: [{ id: "minion-a", x: 10, y: 8 }],
    });
    assert.equal(damageToTargets["minion-a"], undefined);
    const next = resolveBossChainLightningTargetHpCommit({
      combatants: roster(CHAIN_LIGHTNING_TARGET_DAMAGE),
      action: chainAction(damageToTargets, 0),
    });
    assert.equal(next.combatants[1]?.hp, CHAIN_LIGHTNING_TARGET_DAMAGE);
    assert.equal(next.lethalIds.length, 0);
  });

  it("a diagonal neighbor of a shock tile is not blasted", () => {
    const damageToTargets = chainLightningDamageToTargets({
      bossId: "boss-static",
      shockTiles: [{ x: 8, y: 8 }],
      allTiles: openBoard(),
      others: [{ id: "minion-diag", x: 9, y: 9 }],
    });
    assert.equal(damageToTargets["minion-diag"], undefined);
    const next = resolveBossChainLightningTargetHpCommit({
      combatants: [
        unit({ id: "boss-static", hp: 10, x: 8, y: 8 }),
        unit({ id: "minion-diag", hp: 8, x: 9, y: 9 }),
      ],
      action: chainAction(damageToTargets, 0),
    });
    assert.equal(next.combatants[1]?.hp, 8);
  });

  it("two orthogonal neighbors of one tile both take 8", () => {
    const damageToTargets = chainLightningDamageToTargets({
      bossId: "boss-static",
      shockTiles: [{ x: 8, y: 8 }],
      allTiles: openBoard(),
      others: [
        { id: "minion-a", x: 9, y: 8 },
        { id: "minion-b", x: 8, y: 9 },
      ],
    });
    assert.deepEqual(damageToTargets, {
      "minion-a": CHAIN_LIGHTNING_TARGET_DAMAGE,
      "minion-b": CHAIN_LIGHTNING_TARGET_DAMAGE,
    });
    const next = resolveBossChainLightningTargetHpCommit({
      combatants: [
        unit({ id: "boss-static", hp: 10, x: 8, y: 8 }),
        unit({ id: "minion-a", hp: 8, x: 9, y: 8 }),
        unit({ id: "minion-b", hp: 8, x: 8, y: 9 }),
      ],
      action: chainAction(damageToTargets),
    });
    assert.equal(next.combatants[0]?.hp, 10);
    assert.equal(next.combatants[1]?.hp, 0);
    assert.equal(next.combatants[2]?.hp, 0);
    assert.equal(next.hostilesRemaining, 1);
    assert.equal(next.lethalIds.length, 2);
  });

  it("does not change player HP — live WX already applied damageToPlayer", () => {
    const player = {
      id: "player",
      x: 8,
      y: 7,
      isPlayer: true as const,
    };
    const damageToTargets = chainLightningDamageToTargets({
      bossId: "boss-static",
      shockTiles: [{ x: 8, y: 8 }],
      allTiles: openBoard(),
      others: [player, { id: "minion-a", x: 9, y: 8 }],
    });
    assert.equal(damageToTargets.player, undefined);
    assert.equal(damageToTargets["minion-a"], CHAIN_LIGHTNING_TARGET_DAMAGE);
    const next = resolveBossChainLightningTargetHpCommit({
      combatants: roster(CHAIN_LIGHTNING_TARGET_DAMAGE),
      action: chainAction(damageToTargets),
    });
    assert.equal(
      next.combatants.some((c) => c.id === "player"),
      false,
    );
    assert.equal(next.combatants[0]?.hp, 10);
  });

  it("boss-ability minion death must not mint applyRewards XP/Doka", () => {
    const minion = unit({ id: "minion-a", hp: 0 });
    assert.equal(
      countsTowardKillRewards(minion),
      true,
      "legacy enemy-side minion would otherwise enter the kill roster",
    );
    assert.equal(shouldCreditChainLightningTargetKill(minion), false);
  });

  it("player-side summon blast does not count as a remaining hostile", () => {
    const wolf = unit({
      id: "wolf-1",
      hp: CHAIN_LIGHTNING_TARGET_DAMAGE,
      x: 9,
      y: 8,
      side: "player",
      isSummon: true,
    });
    const next = resolveBossChainLightningTargetHpCommit({
      combatants: [unit({ id: "boss-static", hp: 10, x: 8, y: 8 }), wolf],
      action: chainAction({ "wolf-1": CHAIN_LIGHTNING_TARGET_DAMAGE }),
    });
    assert.equal(next.combatants[1]?.hp, 0);
    assert.equal(next.hostilesRemaining, 1);
    assert.equal(shouldCreditChainLightningTargetKill(wolf), false);
  });

  it("empty-crack log does not invent minion HP", () => {
    const action: BossChainLightningTargetActionLike = {
      type: "ability",
      ability: CHAIN_LIGHTNING_TARGET_ABILITY,
      abilityResult: {
        damageToPlayer: 0,
        damageToTargets: {},
        logMessages: [`The Lord of Static's ${CHAIN_LIGHTNING_EMPTY_LOG}`],
      },
    };
    assert.equal(bossChainLightningTargetHpFromAction(action), null);
    const next = resolveBossChainLightningTargetHpCommit({
      combatants: roster(CHAIN_LIGHTNING_TARGET_DAMAGE),
      action,
    });
    assert.equal(next.combatants[1]?.hp, CHAIN_LIGHTNING_TARGET_DAMAGE);
    assert.equal(next.lethalIds.length, 0);
  });

  it("VAMPIRIC_AOE damageToTargets is not this blast (unique leftover of #984)", () => {
    const vamp: BossChainLightningTargetActionLike = {
      type: "ability",
      ability: "VAMPIRIC_AOE",
      abilityResult: {
        damageToPlayer: VAMPIRIC_AOE_TARGET_DRAIN,
        damageToTargets: { "minion-a": VAMPIRIC_AOE_TARGET_DRAIN },
        logMessages: [
          "The Starved Vampire Pawn unleashes a vampiric AoE drain in 3-tile radius!",
        ],
      },
    };
    assert.equal(bossChainLightningTargetHpFromAction(vamp), null);
    const next = resolveBossChainLightningTargetHpCommit({
      combatants: roster(VAMPIRIC_AOE_TARGET_DRAIN),
      action: vamp,
    });
    assert.equal(next.combatants[1]?.hp, VAMPIRIC_AOE_TARGET_DRAIN);
  });

  it("queen-ray damageToTargets is not this blast (unique leftover of #1022)", () => {
    assert.equal(QUEEN_RAY_DAMAGE, 6);
    const ray: BossChainLightningTargetActionLike = {
      type: "ability",
      ability: "ATTACK_ALL_LINES",
      abilityResult: {
        damageToPlayer: QUEEN_RAY_DAMAGE,
        damageToTargets: { "minion-a": QUEEN_RAY_DAMAGE },
        logMessages: [
          `The Weeping Queen blasts pawn in all lines for ${QUEEN_RAY_DAMAGE} damage!`,
        ],
      },
    };
    assert.equal(bossChainLightningTargetHpFromAction(ray), null);
    const next = resolveBossChainLightningTargetHpCommit({
      combatants: roster(QUEEN_RAY_DAMAGE),
      action: ray,
    });
    assert.equal(next.combatants[1]?.hp, QUEEN_RAY_DAMAGE);
  });

  it("kit starter-blast bounce is not this ability (#868)", () => {
    const blast = mustSpell("starter-blast");
    assert.equal(blast.hitsMultiple, true);
    assert.equal(Number(blast.bounces), 2);
    assert.equal(Number(blast.damage), KIT_BLAST_DAMAGE);
    const kit: BossChainLightningTargetActionLike = {
      type: "spell",
      abilityResult: {
        damageToPlayer: KIT_BLAST_DAMAGE,
        damageToTargets: { "minion-a": 10 },
      },
    };
    assert.equal(bossChainLightningTargetHpFromAction(kit), null);
    assert.equal(
      resolveBossChainLightningTargetHpCommit({
        combatants: roster(10),
        action: kit,
      }).combatants[1]?.hp,
      10,
    );
  });

  it("Dawn damageToPlayer: -10 is not this blast (#948)", () => {
    const dawn: BossChainLightningTargetActionLike = {
      type: "ability",
      ability: CHAIN_LIGHTNING_TARGET_ABILITY,
      abilityResult: {
        damageToPlayer: DAWN_NEGATIVE_DAMAGE_TO_PLAYER,
        damageToTargets: { "minion-a": CHAIN_LIGHTNING_TARGET_DAMAGE },
      },
    };
    assert.equal(bossChainLightningTargetHpFromAction(dawn), null);
  });

  it("type:attack / type:spell / type:move do not enter the chain-lightning arm", () => {
    for (const type of ["attack", "spell", "move"] as const) {
      const action: BossChainLightningTargetActionLike = {
        type,
        ability: CHAIN_LIGHTNING_TARGET_ABILITY,
        abilityResult: {
          damageToTargets: { "minion-a": CHAIN_LIGHTNING_TARGET_DAMAGE },
        },
      };
      assert.equal(bossChainLightningTargetHpFromAction(action), null, type);
    }
  });

  it("CHAIN_LIGHTNING ability id is the production enum string", () => {
    assert.equal(CHAIN_LIGHTNING_TARGET_ABILITY, "CHAIN_LIGHTNING");
    assert.equal(CHAIN_LIGHTNING_TARGET_DAMAGE, 8);
  });

  it("already-dead minion stays 0 and is not re-listed as lethal", () => {
    const next = resolveBossChainLightningTargetHpCommit({
      combatants: roster(0),
      action: chainAction({ "minion-a": CHAIN_LIGHTNING_TARGET_DAMAGE }),
    });
    assert.equal(next.combatants[1]?.hp, 0);
    assert.deepEqual(next.lethalIds, []);
  });

  it("non-finite damageToTargets entries are not a blast", () => {
    const action = chainAction({ "minion-a": Number.NaN });
    assert.equal(bossChainLightningTargetHpFromAction(action), null);
    assert.equal(
      resolveBossChainLightningTargetHpCommit({
        combatants: roster(8),
        action,
      }).combatants[1]?.hp,
      8,
    );
  });
});
