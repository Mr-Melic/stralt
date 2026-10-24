import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { physicalAttackSpell } from "../data/spellData.ts";
import { countsTowardKillRewards, shouldAwardVictory } from "./battleSetup.ts";
import {
  type BossQueenRayTargetActionLike,
  QUEEN_RAY_ATK_SCALE,
  QUEEN_RAY_EMPTY_LOG,
  QUEEN_RAY_TARGET_ABILITY,
  type QueenRayOccupant,
  type QueenRayTargetCombatant,
  bossQueenRayTargetHpFromAction,
  queenRayDamageFromAtk,
  queenRayDamageToTargets,
  queenRayFirstOccupants,
  queenRayTargetStillHostile,
  resolveBossQueenRayTargetHpCommit,
  shouldCreditQueenRayTargetKill,
  wxBossQueenRayCommitWithoutTargetHp,
  wxBossQueenRayDroppedTargetHp,
} from "./bossQueenRayTargetHpCommit.ts";

/** Production `applyAttackAllLines` example at atk 8 (minion spawn atk). */
const SAMPLE_ATK = 8;
const QUEEN_RAY_DAMAGE = queenRayDamageFromAtk(SAMPLE_ATK);
const PLAYER_STRIKE_DAMAGE = Number(physicalAttackSpell.damage);
const VAMPIRIC_AOE_TARGET_DRAIN = 10;
const CHAIN_LIGHTNING_DAMAGE = 8;
const DAWN_NEGATIVE_DAMAGE_TO_PLAYER = -10;
const WEEPING_PAWN_ATK = 25;
const STARBORN_QUEEN_ATK = 38;

function openBoard(): boolean[][] {
  return Array.from({ length: 16 }, () =>
    Array.from({ length: 16 }, () => true),
  );
}

function queenRayAction(
  damageToTargets: Record<string, number> = {},
  damageToPlayer = QUEEN_RAY_DAMAGE,
): BossQueenRayTargetActionLike {
  return {
    type: "ability",
    ability: QUEEN_RAY_TARGET_ABILITY,
    abilityResult: {
      damageToPlayer,
      damageToTargets,
      logMessages: [
        `The Weeping Queen blasts pawn in all lines for ${QUEEN_RAY_DAMAGE} damage!`,
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
}): QueenRayTargetCombatant {
  return {
    id: args.id,
    hp: args.hp,
    x: args.x,
    y: args.y,
    side: args.side,
    isSummon: args.isSummon,
  };
}

function roster(minionHp: number): QueenRayTargetCombatant[] {
  return [
    unit({ id: "boss-queen", hp: 10, x: 8, y: 8 }),
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
  combatants: readonly QueenRayTargetCombatant[],
): number {
  return combatants.filter((c) => {
    if (c.id === "boss-queen") {
      return c.hp - PLAYER_STRIKE_DAMAGE > 0;
    }
    return queenRayTargetStillHostile(c);
  }).length;
}

describe("queenRayDamageFromAtk (production scale)", () => {
  it("matches applyAttackAllLines floor(atk * 0.8)", () => {
    assert.equal(QUEEN_RAY_ATK_SCALE, 0.8);
    assert.equal(QUEEN_RAY_DAMAGE, 6);
    assert.equal(queenRayDamageFromAtk(WEEPING_PAWN_ATK), 20);
    assert.equal(queenRayDamageFromAtk(STARBORN_QUEEN_ATK), 30);
    assert.equal(queenRayDamageFromAtk(0), 0);
    assert.equal(queenRayDamageFromAtk(Number.NaN), 0);
  });
});

describe("queenRayFirstOccupants (live getQueenRayTargets)", () => {
  it("hits the first body on rank/file/diagonal and stops", () => {
    const boss: QueenRayOccupant = { id: "boss-queen", x: 8, y: 8 };
    const near: QueenRayOccupant = { id: "minion-a", x: 10, y: 8 };
    const behind: QueenRayOccupant = { id: "minion-behind", x: 12, y: 8 };
    const diag: QueenRayOccupant = { id: "minion-diag", x: 10, y: 10 };
    const off: QueenRayOccupant = { id: "minion-knight", x: 10, y: 9 };
    const hits = queenRayFirstOccupants({
      boss,
      allTiles: openBoard(),
      combatants: [near, behind, diag, off],
    });
    assert.deepEqual(hits.map((h) => h.id).sort(), ["minion-a", "minion-diag"]);
  });

  it("a wall stops the ray before a minion behind it", () => {
    const tiles = openBoard();
    tiles[8][9] = false;
    const boss: QueenRayOccupant = { id: "boss-queen", x: 8, y: 8 };
    const behind: QueenRayOccupant = { id: "minion-a", x: 10, y: 8 };
    const hits = queenRayFirstOccupants({
      boss,
      allTiles: tiles,
      combatants: [behind],
    });
    assert.equal(hits.length, 0);
  });
});

describe("wxBossQueenRayCommitWithoutTargetHp (live leftover)", () => {
  it("6 HP queen-line minion stays 6 after the blast log", () => {
    const action = queenRayAction({ "minion-a": QUEEN_RAY_DAMAGE });
    const live = wxBossQueenRayCommitWithoutTargetHp({
      combatants: roster(QUEEN_RAY_DAMAGE),
      action,
    });
    assert.equal(live.combatants[0]?.hp, 10, "boss HP is not this file");
    assert.equal(live.combatants[1]?.hp, QUEEN_RAY_DAMAGE);
    assert.equal(live.hostilesRemaining, 2);
    assert.equal(live.lethalIds.length, 0);
    assert.equal(
      wxBossQueenRayDroppedTargetHp({
        combatants: roster(QUEEN_RAY_DAMAGE),
        action,
      }),
      true,
      "live WX drops advertised minion HP",
    );
  });

  it("Strike 10 kills the 10 HP boss but leftover minion blocks victory persist", () => {
    assert.equal(PLAYER_STRIKE_DAMAGE, 10);
    const live = wxBossQueenRayCommitWithoutTargetHp({
      combatants: roster(QUEEN_RAY_DAMAGE),
      action: queenRayAction({ "minion-a": QUEEN_RAY_DAMAGE }),
    });
    const hostiles = hostilesAfterStrikeOnBoss(live.combatants);
    assert.equal(hostiles, 1);
    assert.equal(victoryAfterStrike(hostiles), false);
  });
});

describe("resolveBossQueenRayTargetHpCommit", () => {
  it("6 HP queen-line minion dies so Strike 10 on the boss awards victory", () => {
    const action = queenRayAction({ "minion-a": QUEEN_RAY_DAMAGE });
    const next = resolveBossQueenRayTargetHpCommit({
      combatants: roster(QUEEN_RAY_DAMAGE),
      action,
    });
    assert.deepEqual(bossQueenRayTargetHpFromAction(action), {
      "minion-a": QUEEN_RAY_DAMAGE,
    });
    assert.equal(next.combatants[0]?.hp, 10, "must not heal the boss");
    assert.equal(next.combatants[1]?.hp, 0);
    assert.equal(next.hostilesRemaining, 1);
    assert.deepEqual(next.lethalIds, ["minion-a"]);
    const hostiles = hostilesAfterStrikeOnBoss(next.combatants);
    assert.equal(hostiles, 0);
    assert.equal(victoryAfterStrike(hostiles), true);
  });

  it("7 HP queen-line minion survives at 1 and still blocks victory after Strike", () => {
    const next = resolveBossQueenRayTargetHpCommit({
      combatants: roster(QUEEN_RAY_DAMAGE + 1),
      action: queenRayAction({ "minion-a": QUEEN_RAY_DAMAGE }),
    });
    assert.equal(next.combatants[1]?.hp, 1);
    assert.equal(next.lethalIds.length, 0);
    const hostiles = hostilesAfterStrikeOnBoss(next.combatants);
    assert.equal(hostiles, 1);
    assert.equal(victoryAfterStrike(hostiles), false);
  });

  it("two first-occupant minions on separate rays both take floor(atk*0.8)", () => {
    const boss: QueenRayOccupant = { id: "boss-queen", x: 8, y: 8 };
    const damageToTargets = queenRayDamageToTargets({
      boss,
      allTiles: openBoard(),
      others: [
        { id: "minion-a", x: 10, y: 8 },
        { id: "minion-b", x: 8, y: 10 },
      ],
      atk: SAMPLE_ATK,
    });
    assert.deepEqual(damageToTargets, {
      "minion-a": QUEEN_RAY_DAMAGE,
      "minion-b": QUEEN_RAY_DAMAGE,
    });
    const next = resolveBossQueenRayTargetHpCommit({
      combatants: [
        unit({ id: "boss-queen", hp: 10, x: 8, y: 8 }),
        unit({ id: "minion-a", hp: QUEEN_RAY_DAMAGE, x: 10, y: 8 }),
        unit({ id: "minion-b", hp: QUEEN_RAY_DAMAGE, x: 8, y: 10 }),
      ],
      action: queenRayAction(damageToTargets),
    });
    assert.equal(next.combatants[0]?.hp, 10);
    assert.equal(next.combatants[1]?.hp, 0);
    assert.equal(next.combatants[2]?.hp, 0);
    assert.equal(next.hostilesRemaining, 1);
    assert.equal(next.lethalIds.length, 2);
  });

  it("a minion behind the first occupant is not blasted (ray stops)", () => {
    const boss: QueenRayOccupant = { id: "boss-queen", x: 8, y: 8 };
    const damageToTargets = queenRayDamageToTargets({
      boss,
      allTiles: openBoard(),
      others: [
        { id: "minion-a", x: 10, y: 8 },
        { id: "minion-behind", x: 12, y: 8 },
      ],
      atk: SAMPLE_ATK,
    });
    assert.equal(damageToTargets["minion-behind"], undefined);
    assert.equal(damageToTargets["minion-a"], QUEEN_RAY_DAMAGE);
    const next = resolveBossQueenRayTargetHpCommit({
      combatants: [
        unit({ id: "boss-queen", hp: 10, x: 8, y: 8 }),
        unit({ id: "minion-a", hp: QUEEN_RAY_DAMAGE, x: 10, y: 8 }),
        unit({ id: "minion-behind", hp: QUEEN_RAY_DAMAGE, x: 12, y: 8 }),
      ],
      action: queenRayAction(damageToTargets),
    });
    assert.equal(next.combatants[1]?.hp, 0);
    assert.equal(next.combatants[2]?.hp, QUEEN_RAY_DAMAGE);
    assert.equal(next.hostilesRemaining, 2);
  });

  it("a knight-offset minion is not on any queen line", () => {
    const boss: QueenRayOccupant = { id: "boss-queen", x: 8, y: 8 };
    const off = { id: "minion-knight", x: 10, y: 9 };
    const damageToTargets = queenRayDamageToTargets({
      boss,
      allTiles: openBoard(),
      others: [off],
      atk: SAMPLE_ATK,
    });
    assert.equal(damageToTargets["minion-knight"], undefined);
    const next = resolveBossQueenRayTargetHpCommit({
      combatants: [
        unit({ id: "boss-queen", hp: 10, x: 8, y: 8 }),
        unit({ id: "minion-knight", hp: QUEEN_RAY_DAMAGE, x: 10, y: 9 }),
      ],
      action: queenRayAction(damageToTargets),
    });
    assert.equal(next.combatants[1]?.hp, QUEEN_RAY_DAMAGE);
    assert.equal(next.hostilesRemaining, 2);
  });

  it("does not change player HP — live WX already applied damageToPlayer", () => {
    const player = {
      id: "player",
      x: 8,
      y: 6,
      isPlayer: true as const,
    };
    const damageToTargets = queenRayDamageToTargets({
      boss: { id: "boss-queen", x: 8, y: 8 },
      allTiles: openBoard(),
      others: [player, { id: "minion-a", x: 10, y: 8 }],
      atk: SAMPLE_ATK,
    });
    assert.equal(damageToTargets.player, undefined);
    const next = resolveBossQueenRayTargetHpCommit({
      combatants: roster(QUEEN_RAY_DAMAGE),
      action: queenRayAction(damageToTargets),
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
    assert.equal(shouldCreditQueenRayTargetKill(minion), false);
  });

  it("player-side summon blast does not count as a remaining hostile", () => {
    const wolf = unit({
      id: "wolf-1",
      hp: QUEEN_RAY_DAMAGE,
      x: 10,
      y: 8,
      side: "player",
      isSummon: true,
    });
    const next = resolveBossQueenRayTargetHpCommit({
      combatants: [unit({ id: "boss-queen", hp: 10, x: 8, y: 8 }), wolf],
      action: queenRayAction({ "wolf-1": QUEEN_RAY_DAMAGE }),
    });
    assert.equal(next.combatants[1]?.hp, 0);
    assert.equal(next.hostilesRemaining, 1);
    assert.equal(shouldCreditQueenRayTargetKill(wolf), false);
  });

  it("empty-line log does not invent minion HP", () => {
    const action: BossQueenRayTargetActionLike = {
      type: "ability",
      ability: QUEEN_RAY_TARGET_ABILITY,
      abilityResult: {
        damageToPlayer: 0,
        damageToTargets: {},
        logMessages: [`The Weeping Queen ${QUEEN_RAY_EMPTY_LOG}`],
      },
    };
    assert.equal(bossQueenRayTargetHpFromAction(action), null);
    const next = resolveBossQueenRayTargetHpCommit({
      combatants: roster(QUEEN_RAY_DAMAGE),
      action,
    });
    assert.equal(next.combatants[1]?.hp, QUEEN_RAY_DAMAGE);
    assert.equal(next.lethalIds.length, 0);
  });

  it("VAMPIRIC_AOE damageToTargets is not this blast (unique leftover of #984)", () => {
    const vamp: BossQueenRayTargetActionLike = {
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
    assert.equal(bossQueenRayTargetHpFromAction(vamp), null);
    const next = resolveBossQueenRayTargetHpCommit({
      combatants: roster(VAMPIRIC_AOE_TARGET_DRAIN),
      action: vamp,
    });
    assert.equal(next.combatants[1]?.hp, VAMPIRIC_AOE_TARGET_DRAIN);
  });

  it("chain lightning damageToTargets is not this blast", () => {
    const chain: BossQueenRayTargetActionLike = {
      type: "ability",
      ability: "CHAIN_LIGHTNING",
      abilityResult: {
        damageToPlayer: CHAIN_LIGHTNING_DAMAGE,
        damageToTargets: { "minion-a": CHAIN_LIGHTNING_DAMAGE },
        logMessages: ["Chain lightning hits pawn for 8!"],
      },
    };
    assert.equal(bossQueenRayTargetHpFromAction(chain), null);
    const next = resolveBossQueenRayTargetHpCommit({
      combatants: roster(CHAIN_LIGHTNING_DAMAGE),
      action: chain,
    });
    assert.equal(next.combatants[1]?.hp, CHAIN_LIGHTNING_DAMAGE);
  });

  it("Dawn damageToPlayer: -10 is not this blast (#948)", () => {
    const dawn: BossQueenRayTargetActionLike = {
      type: "ability",
      ability: QUEEN_RAY_TARGET_ABILITY,
      abilityResult: {
        damageToPlayer: DAWN_NEGATIVE_DAMAGE_TO_PLAYER,
        damageToTargets: { "minion-a": QUEEN_RAY_DAMAGE },
      },
    };
    assert.equal(bossQueenRayTargetHpFromAction(dawn), null);
  });

  it("type:attack / type:spell / type:move do not enter the queen-ray arm", () => {
    for (const type of ["attack", "spell", "move"] as const) {
      const action: BossQueenRayTargetActionLike = {
        type,
        ability: QUEEN_RAY_TARGET_ABILITY,
        abilityResult: {
          damageToTargets: { "minion-a": QUEEN_RAY_DAMAGE },
        },
      };
      assert.equal(bossQueenRayTargetHpFromAction(action), null, type);
    }
  });

  it("Starborn Queen atk 38 writes 30, not the sample-8 drain of 6", () => {
    const damageToTargets = queenRayDamageToTargets({
      boss: { id: "boss-queen", x: 8, y: 8 },
      allTiles: openBoard(),
      others: [{ id: "minion-a", x: 10, y: 8 }],
      atk: STARBORN_QUEEN_ATK,
    });
    assert.equal(damageToTargets["minion-a"], 30);
    assert.notEqual(damageToTargets["minion-a"], QUEEN_RAY_DAMAGE);
    const next = resolveBossQueenRayTargetHpCommit({
      combatants: roster(30),
      action: queenRayAction(damageToTargets, 30),
    });
    assert.equal(next.combatants[1]?.hp, 0);
  });
});
