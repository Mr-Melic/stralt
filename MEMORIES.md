# Bug-hunt memory

Open or rejected only. Delete an entry when its PR merges or the bug is gone.

- Death-realm 1.5s `armDeathGuards` clears `deathTriggered` while `applyRewards` is still in flight, so `shouldApplyVictoryLiveHydrate` refunds the 20%/40% penalty. Same change also: dungeon-chain React state kept the 1.5–4× Doka multiplier after death/flee; lava/spike hazard HP read stale `enemyHpMap` after Mirror reflect and healed the attacker; `isTileCastableLive` used raw `maxRange` / player tile so highlighted outer-ring and summon-control casts fizzled. PR: https://github.com/Mr-Melic/stralt/pull/93. Status: open. Recorded: 2026-08-30.
