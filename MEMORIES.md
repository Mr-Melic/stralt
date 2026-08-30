# Bug-hunt memory

Open or rejected only. Delete an entry when its PR merges or the bug is gone.

- `advanceTurn` last-hostile summon lifespan fade still dispatched the player inside the same `flushSync` (player DoT set `deathTriggered`, `shouldAwardVictory` refused, `persistDeathPenalty` instead of `applyRewards`). PR: https://github.com/Mr-Melic/stralt/pull/89. Status: open (stale duplicate of merged #88; dirty vs `main`). Recorded: 2026-08-30.

- Death-realm 1.5s `armDeathGuards` clears `deathTriggered` while `applyRewards` is still in flight, so `shouldApplyVictoryLiveHydrate` refunds the 20%/40% penalty. Same PR also: dungeon-chain React state kept the 1.5–4× Doka multiplier after death/flee; lava/spike hazard HP read stale `enemyHpMap` after Mirror reflect and healed the attacker; `isTileCastableLive` used raw `maxRange` / player tile so highlighted outer-ring and summon-control casts fizzled. PR: pending. Status: open. Recorded: 2026-08-30.
