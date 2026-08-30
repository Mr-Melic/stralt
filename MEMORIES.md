# Bug-hunt memory

Open or rejected only. Delete an entry when its PR merges or the bug is gone.

- `advanceTurn` last-hostile summon lifespan fade still dispatched the player inside the same `flushSync` (player DoT set `deathTriggered`, `shouldAwardVictory` refused, `persistDeathPenalty` instead of `applyRewards`). PR: https://github.com/Mr-Melic/stralt/pull/89. Status: open (stale duplicate of merged #88; dirty vs `main`). Recorded: 2026-08-30.

- WorldExploration leftover `advanceTurn` after last-hit (End Turn / 30s timer, no expire list); rest-exit skipped `generateEnemies` (empty dungeon floor + unlocked portal); shop/heal double-click spent from the render `dokaBalance` snapshot; boss-rush room-clear wrote unwrapped XP; `getAoETargets` hit player summons; bomber `hp===0` left a corpse in the store. PR: pending (branch `cursor/critical-leftover-fixes-2425`). Status: open. Recorded: 2026-08-30.
