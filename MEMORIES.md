# Bug-hunt memory

Open or rejected only. Delete an entry when its PR merges or the bug is gone.

- Death-realm 1.5s `armDeathGuards` clears `deathTriggered` while `applyRewards` is still in flight, so `shouldApplyVictoryLiveHydrate` refunds the 20%/40% penalty. Same change also: lava/spike hazard HP read stale `enemyHpMap` after Mirror reflect and healed the attacker; `isTileCastableLive` used raw `maxRange` / player tile so highlighted outer-ring and summon-control casts fizzled; `saveKillCount` lacked `#user` / ban / 64-kill cap. Dungeon-multiplier leak and `calculateAndAwardDoka` caps shipped in #92. PR: https://github.com/Mr-Melic/stralt/pull/93. Status: open. Recorded: 2026-08-30.
