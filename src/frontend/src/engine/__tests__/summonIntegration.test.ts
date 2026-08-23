import { describe, expect, it } from "vitest";
import { SUMMON_BASE_LIFESPAN } from "../../data/gameConstants";
import {
  decrementSummonLifespan,
  getPlayerSideTargets,
  resolveEnemyApMp,
  syncExpiredSummonsFromTurnQueue,
} from "../summonIntegration";
import { makeEnemy, makeTurnEntry } from "./fixtures";

function makeSummon(
  overrides: Partial<ReturnType<typeof makeEnemy>> & {
    id: string;
    name?: string;
  },
) {
  const { name, ...rest } = overrides;
  return {
    ...makeEnemy({
      isSummon: true,
      hp: 40,
      maxHp: 40,
      turnsRemaining: SUMMON_BASE_LIFESPAN,
      ...rest,
    }),
    name: name ?? overrides.id,
  };
}

describe("decrementSummonLifespan", () => {
  it("decrements only the summon whose own turn is starting", () => {
    const active = makeSummon({ id: "wolf", turnsRemaining: 4 });
    const sibling = makeSummon({ id: "hawk", turnsRemaining: 3 });
    const foe = makeEnemy({ id: "rat", hp: 20 });
    const logs: string[] = [];

    const result = decrementSummonLifespan(
      [active, sibling, foe],
      (msg) => logs.push(msg),
      "wolf",
    );

    expect(active.turnsRemaining).toBe(3);
    expect(sibling.turnsRemaining).toBe(3);
    expect(result.expiredIds).toEqual([]);
    expect(result.enemies.map((e) => e.id)).toEqual(["wolf", "hawk", "rat"]);
    expect(logs).toEqual([]);
  });

  it("is cleanup-only when activeSummonId is omitted — no summon is decremented", () => {
    const wolf = makeSummon({ id: "wolf", turnsRemaining: 4 });
    const hawk = makeSummon({ id: "hawk", turnsRemaining: 2 });

    const omitted = decrementSummonLifespan([wolf, hawk], () => undefined);
    expect(wolf.turnsRemaining).toBe(4);
    expect(hawk.turnsRemaining).toBe(2);
    expect(omitted.expiredIds).toEqual([]);

    const explicitNull = decrementSummonLifespan(
      [wolf, hawk],
      () => undefined,
      null,
    );
    expect(wolf.turnsRemaining).toBe(4);
    expect(hawk.turnsRemaining).toBe(2);
    expect(explicitNull.expiredIds).toEqual([]);
  });

  it("restores the base-4 lifespan when turnsRemaining is missing instead of instant-despawning", () => {
    const wolf = makeSummon({ id: "wolf" });
    wolf.turnsRemaining = undefined;

    const result = decrementSummonLifespan([wolf], () => undefined, "wolf");

    expect(wolf.turnsRemaining).toBe(SUMMON_BASE_LIFESPAN - 1);
    expect(wolf.hp).toBe(40);
    expect(result.expiredIds).toEqual([]);
    expect(result.enemies).toHaveLength(1);
  });

  it("expires the active summon when the decrement hits 0 and filters it from the roster", () => {
    const wolf = makeSummon({
      id: "wolf",
      name: "Dire Wolf",
      turnsRemaining: 1,
    });
    const logs: Array<{ msg: string; color?: string; isSummon?: boolean }> = [];

    const result = decrementSummonLifespan(
      [wolf],
      (msg, color, isSummon) => logs.push({ msg, color, isSummon }),
      "wolf",
    );

    expect(wolf.turnsRemaining).toBe(0);
    expect(wolf.hp).toBe(0);
    expect(result.expiredIds).toEqual(["wolf"]);
    expect(result.enemies).toEqual([]);
    expect(logs).toEqual([
      { msg: "Dire Wolf fades away...", color: "#a78bfa", isSummon: true },
    ]);
  });

  it("on a cleanup pass, expires summons already at 0 without decrementing living ones", () => {
    const fading = makeSummon({
      id: "fading",
      name: "Shade",
      turnsRemaining: 0,
    });
    const living = makeSummon({ id: "living", turnsRemaining: 3 });
    const logs: string[] = [];

    const result = decrementSummonLifespan(
      [fading, living],
      (msg) => logs.push(msg),
      null,
    );

    expect(living.turnsRemaining).toBe(3);
    expect(result.expiredIds).toEqual(["fading"]);
    expect(result.enemies.map((e) => e.id)).toEqual(["living"]);
    expect(logs).toEqual(["Shade fades away..."]);
  });

  it("does not expire a sibling already at 0 while another summon's turn is decrementing", () => {
    const active = makeSummon({ id: "wolf", turnsRemaining: 2 });
    const leftover = makeSummon({
      id: "leftover",
      turnsRemaining: 0,
      hp: 10,
    });

    const result = decrementSummonLifespan(
      [active, leftover],
      () => undefined,
      "wolf",
    );

    expect(active.turnsRemaining).toBe(1);
    expect(leftover.hp).toBe(10);
    expect(result.expiredIds).toEqual([]);
    expect(result.enemies.map((e) => e.id)).toEqual(["wolf", "leftover"]);
  });

  it("filters hp<=0 units from the roster without treating combat deaths as fade expiries", () => {
    const corpse = makeEnemy({ id: "corpse", hp: 0 });
    const deadSummon = makeSummon({
      id: "dead-summon",
      hp: 0,
      turnsRemaining: 2,
    });
    const living = makeEnemy({ id: "rat", hp: 12 });

    const result = decrementSummonLifespan(
      [corpse, deadSummon, living],
      () => undefined,
      "wolf",
    );

    expect(result.expiredIds).toEqual([]);
    expect(result.enemies.map((e) => e.id)).toEqual(["rat"]);
  });
});

describe("syncExpiredSummonsFromTurnQueue", () => {
  it("removes a summon that expires on its own turn and points the index at the predecessor", () => {
    const wolf = makeSummon({ id: "wolf", turnsRemaining: 1 });
    const rat = makeEnemy({ id: "rat" });
    const order = [
      makeTurnEntry({ id: "player", type: "player" }),
      makeTurnEntry({ id: "wolf", type: "summon", isSummon: true }),
      makeTurnEntry({ id: "rat", type: "enemy" }),
    ];
    const turnOrderRef = { current: [...order] };
    const currentTurnIndexRef = { current: 1 };
    let lastEnemies: { id: string }[] = [];
    const logs: string[] = [];

    syncExpiredSummonsFromTurnQueue(
      [wolf, rat],
      order,
      turnOrderRef,
      currentTurnIndexRef,
      (updater) => {
        turnOrderRef.current = updater(turnOrderRef.current);
      },
      (enemies) => {
        lastEnemies = enemies;
      },
      (msg) => logs.push(msg),
      "wolf",
    );

    expect(turnOrderRef.current.map((c) => c.id)).toEqual(["player", "rat"]);
    expect(currentTurnIndexRef.current).toBe(0);
    const nextIdx =
      (currentTurnIndexRef.current + 1) % turnOrderRef.current.length;
    expect(turnOrderRef.current[nextIdx].id).toBe("rat");
    expect(lastEnemies.map((e) => e.id)).toEqual(["rat"]);
    expect(logs).toEqual(["wolf fades away..."]);
  });

  it("leaves the queue untouched on a cleanup pass when no summon is at 0", () => {
    const wolf = makeSummon({ id: "wolf", turnsRemaining: 4 });
    const order = [
      makeTurnEntry({ id: "player", type: "player" }),
      makeTurnEntry({ id: "wolf", type: "summon", isSummon: true }),
    ];
    const turnOrderRef = { current: [...order] };
    const currentTurnIndexRef = { current: 0 };

    syncExpiredSummonsFromTurnQueue(
      [wolf],
      order,
      turnOrderRef,
      currentTurnIndexRef,
      () => {
        throw new Error("setTurnOrder should not run when nothing expired");
      },
      () => undefined,
      () => undefined,
      null,
    );

    expect(wolf.turnsRemaining).toBe(4);
    expect(turnOrderRef.current.map((c) => c.id)).toEqual(["player", "wolf"]);
    expect(currentTurnIndexRef.current).toBe(0);
  });
});

describe("resolveEnemyApMp", () => {
  it("falls back to level AP and 1 MP when the enemy record is missing", () => {
    expect(resolveEnemyApMp(undefined, 7)).toEqual({ ap: 7, mp: 1 });
  });

  it("uses a summon's current AP/MP budget, with level-derived fallbacks", () => {
    expect(
      resolveEnemyApMp(
        makeSummon({ id: "wolf", currentAp: 2, currentMp: 3, level: 4 }),
        9,
      ),
    ).toEqual({ ap: 2, mp: 3 });

    expect(resolveEnemyApMp(makeSummon({ id: "wolf", level: 5 }), 9)).toEqual({
      ap: 5,
      mp: 2,
    });
  });

  it("derives regular-enemy AP from level and MP as floor(level/2) with a 1-floor", () => {
    expect(resolveEnemyApMp(makeEnemy({ id: "rat", level: 1 }), 9)).toEqual({
      ap: 1,
      mp: 1,
    });
    expect(resolveEnemyApMp(makeEnemy({ id: "ogre", level: 4 }), 9)).toEqual({
      ap: 4,
      mp: 2,
    });
  });
});

describe("getPlayerSideTargets", () => {
  it("keeps player-side and isPlayer units, dropping enemy-side combatants", () => {
    const ids = getPlayerSideTargets([
      { id: "wolf", side: "player" },
      { id: "hero", isPlayer: true },
      { id: "rat", side: "enemy" },
    ]).map((e) => e.id);
    expect(ids).toEqual(["wolf", "hero"]);
  });
});
