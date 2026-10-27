/**
 * Combat action parity: Chaos Initiative advertised per-round reshuffle
 * commits onto the live turn-order ref. Live WX shuffles React state
 * after index-0 dispatch; `liveTurnOrder` then discards it.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import type { CombatantEntry } from "../components/InitiativeStrip";
import {
  CHAOS_INITIATIVE_MODIFIER_ID,
  canExecuteChaosInitiativeTurnOrder,
  chaosInitiativeHighlightedReshuffleIsExecutable,
  executeChaosInitiativeTurnOrder,
  isChaosInitiativeModifier,
  liveTurnOrderDiscardsReactShuffle,
  liveWxChaosInitiativeReshuffleCommits,
  shouldDecideChaosInitiativeTurnOrder,
  wxChaosInitiativeShufflesBeforeDispatch,
  wxChaosInitiativeWritesTurnOrderRef,
} from "./chaosInitiativeTurnOrder.ts";
import { MAP_MODIFIERS, mapModifierRegistry } from "./mapModifiers.ts";
import { liveTurnOrder } from "./turnQueue.ts";

function wxSource(): string {
  return readFileSync(
    join(
      dirname(fileURLToPath(import.meta.url)),
      "../components/WorldExploration.tsx",
    ),
    "utf8",
  );
}

function wxChaosShuffleBlock(): string {
  const wx = wxSource();
  const call = wx.indexOf("return mapModifierRegistry.applyTurnOrderSort(");
  assert.ok(call >= 0, "live applyTurnOrderSort call is present");
  const setTurn = wx.lastIndexOf("setTurnOrder((reactPrevOrder) => {", call);
  assert.ok(setTurn >= 0, "shuffle still lives inside setTurnOrder");
  const after = wx.indexOf("}); // end flushSync", call);
  assert.ok(after > call, "flushSync still closes after the shuffle return");
  return wx.slice(setTurn, after);
}

function entry(
  id: string,
  extra: Partial<CombatantEntry> = {},
): CombatantEntry {
  return {
    id,
    type: id === "player" ? "player" : "enemy",
    initiative: 1,
    name: id,
    pieceIcon: "P",
    hp: 10,
    maxHp: 10,
    level: 1,
    ...extra,
  };
}

describe("Chaos Initiative advertised reshuffle vs liveTurnOrder discard", () => {
  it("catalog announce matches and the registry hook shuffles owners", () => {
    assert.equal(isChaosInitiativeModifier(CHAOS_INITIATIVE_MODIFIER_ID), true);
    assert.equal(isChaosInitiativeModifier("glass_realm"), false);
    assert.equal(isChaosInitiativeModifier("vampiric_ground"), false);
    const def = MAP_MODIFIERS.find(
      (m) => m.id === CHAOS_INITIATIVE_MODIFIER_ID,
    );
    assert.ok(def);
    assert.equal(
      def?.announceText,
      "Chaos Initiative: turn order reshuffles each round.",
    );
    const player = entry("player");
    const wolf = entry("wolf", {
      isSummon: true,
      ownerId: "player",
      type: "summon",
    });
    const rat = entry("rat");
    const crow = entry("crow");
    const prev = [player, wolf, rat, crow];
    const shuffled = mapModifierRegistry.applyTurnOrderSort(
      prev,
      new Set([CHAOS_INITIATIVE_MODIFIER_ID]),
    );
    assert.equal(shuffled.length, 4);
    assert.deepEqual(
      [...shuffled.map((c) => c.id)].sort(),
      ["crow", "player", "rat", "wolf"].sort(),
      "shuffle must keep every owner and the owned summon",
    );
    const playerIdx = shuffled.findIndex((c) => c.id === "player");
    assert.equal(
      shuffled[playerIdx + 1]?.id,
      "wolf",
      "owned summon must stay immediately after its summoner",
    );
    assert.equal(
      prev.map((c) => c.id).join(","),
      "player,wolf,rat,crow",
      "registry shuffle must not reorder prevOrder in place",
    );
  });

  it("live WX shuffles after dispatch and never writes turnOrderRef", () => {
    assert.equal(wxChaosInitiativeWritesTurnOrderRef(), false);
    assert.equal(wxChaosInitiativeShufflesBeforeDispatch(), false);
    assert.equal(liveWxChaosInitiativeReshuffleCommits(), false);

    const block = wxChaosShuffleBlock();
    assert.ok(
      block.includes("liveTurnOrder(reactPrevOrder, turnOrderRef.current)"),
    );
    assert.ok(block.includes("setCurrentTurnIndex((_prevIdx) => {"));
    const dispatch = block.indexOf("setCurrentTurnIndex((_prevIdx) => {");
    const shuffleIf = block.indexOf("if (currentTurnIndexRef.current === 0)");
    assert.ok(
      dispatch >= 0 && shuffleIf > dispatch,
      "shuffle still runs after the index-0 combatant has already been dispatched",
    );
    const afterShuffleIf = block.slice(shuffleIf);
    assert.ok(
      afterShuffleIf.includes("mapModifierRegistry.applyTurnOrderSort("),
    );
    assert.equal(
      afterShuffleIf.includes("turnOrderRef.current ="),
      false,
      "shuffle return still never assigns the live ref (#390 liveTurnOrder then discards it)",
    );

    const wx = wxSource();
    assert.ok(wx.includes('activeMapModifierTypes.has("plague_zone")'));
    assert.ok(wx.includes('activeMapModifierTypes.has("void_rift")'));
    assert.equal(
      wx.includes("isChaosInitiative"),
      false,
      "WX still has no isChaosInitiative flag next to the other modifier flags",
    );
    assert.equal(
      wx.includes("chaos_initiative"),
      false,
      "WX still never mentions chaos_initiative; it only calls applyTurnOrderSort",
    );
  });

  it("End Turn liveTurnOrder discards a React-only shuffle (fix A caused bug B)", () => {
    const player = entry("player");
    const rat = entry("rat");
    const crow = entry("crow");
    const liveRef = [player, rat, crow];
    const reactShuffled = [crow, player, rat];
    assert.equal(liveTurnOrder(reactShuffled, liveRef), liveRef);
    assert.equal(
      liveTurnOrderDiscardsReactShuffle(reactShuffled, liveRef),
      true,
    );
    assert.equal(
      liveTurnOrderDiscardsReactShuffle(reactShuffled, []),
      false,
      "empty ref must fall back to React so a missing queue cannot mint a turn",
    );
  });

  it("executes wrap-to-0 as a live-ref write and keeps the wolf after the player", () => {
    const player = entry("player");
    const wolf = entry("wolf", {
      isSummon: true,
      ownerId: "player",
      type: "summon",
    });
    const rat = entry("rat");
    const crow = entry("crow");
    const prev = [player, wolf, rat, crow];

    const decided = shouldDecideChaosInitiativeTurnOrder({
      modifierActive: true,
      wrappedToIndexZero: true,
      orderLength: prev.length,
    });
    const executable = canExecuteChaosInitiativeTurnOrder({
      modifierActive: true,
      wrappedToIndexZero: true,
      orderLength: prev.length,
    });
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(
      chaosInitiativeHighlightedReshuffleIsExecutable({ decided, executable }),
      true,
    );

    const committed = executeChaosInitiativeTurnOrder({
      modifierActive: true,
      wrappedToIndexZero: true,
      prevOrder: prev,
    });
    assert.ok(committed);
    assert.equal(
      committed.writeLiveRef,
      true,
      "restack must write turnOrderRef so liveTurnOrder cannot discard the shuffle",
    );
    assert.equal(committed.order.length, 4);
    const playerIdx = committed.order.findIndex((c) => c.id === "player");
    assert.equal(committed.order[playerIdx + 1]?.id, "wolf");
    assert.deepEqual(
      [...committed.order.map((c) => c.id)].sort(),
      ["crow", "player", "rat", "wolf"].sort(),
    );
    assert.equal(
      liveTurnOrderDiscardsReactShuffle(committed.order, prev),
      true,
      "without the writeLiveRef wire, the next End Turn still prefers the unshuffled ref",
    );
  });

  it("cannot execute Glass Realm, Vampiric heal, or a mid-round wrap as this shuffle", () => {
    const prev = [entry("player"), entry("rat")];
    assert.equal(
      canExecuteChaosInitiativeTurnOrder({
        modifierActive: false,
        wrappedToIndexZero: true,
        orderLength: prev.length,
      }),
      false,
    );
    assert.equal(
      executeChaosInitiativeTurnOrder({
        modifierActive: true,
        wrappedToIndexZero: false,
        prevOrder: prev,
      }),
      null,
      "mid-round must not reshuffle (matches WX wrap-to-0 guard)",
    );
    assert.equal(
      executeChaosInitiativeTurnOrder({
        modifierActive: true,
        wrappedToIndexZero: true,
        prevOrder: [],
      }),
      null,
      "empty queue must not mint a turn",
    );
    const crit = executeChaosInitiativeTurnOrder({
      modifierActive: true,
      wrappedToIndexZero: true,
      prevOrder: prev,
    });
    assert.equal(
      crit != null && "heal" in crit,
      false,
      "#1148 owns Vampiric Ground attacker HP",
    );
    assert.equal(
      crit != null && "hpAfter" in crit,
      false,
      "#1160 owns Glass Realm Strike / incoming ×2",
    );
    assert.equal(
      crit != null && "res" in crit,
      false,
      "player Iron Curse RES ×1.3 is a sibling of applyBattleStart",
    );
    assert.equal(
      crit != null && "roll" in crit,
      false,
      "Titan 1–5× is a sibling skip of Strike / incoming",
    );
    assert.equal(
      chaosInitiativeHighlightedReshuffleIsExecutable({
        decided: false,
        executable: false,
      }),
      false,
    );
  });

  it("keys off modifier id metadata, not the announce copy", () => {
    assert.equal(isChaosInitiativeModifier("Chaos Initiative"), false);
    assert.equal(isChaosInitiativeModifier("time_warp"), false);
    assert.equal(
      shouldDecideChaosInitiativeTurnOrder({
        modifierActive: true,
        wrappedToIndexZero: true,
        orderLength: 2,
      }),
      canExecuteChaosInitiativeTurnOrder({
        modifierActive: true,
        wrappedToIndexZero: true,
        orderLength: 2,
      }),
    );
  });
});
