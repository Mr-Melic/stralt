# Bug-hunt memory

Open or rejected only. Delete an entry when its PR merges or the bug is gone.

- WorldExploration `attributeKillReward` / `selectDefeatedEnemiesForRewards`: player-summon deaths (bomber, enemy melee, DoT) were appended to the victory roster, so `applyRewards` credited extra XP/Doka. PR: pending. Status: open. Recorded: 2026-08-30.

- `advanceTurn` last-hostile summon lifespan fade still dispatched the player inside the same `flushSync` (player DoT set `deathTriggered`, `shouldAwardVictory` refused, `persistDeathPenalty` instead of `applyRewards`). PR: https://github.com/Mr-Melic/stralt/pull/89. Status: open (stale duplicate of merged #88; dirty vs `main`). Recorded: 2026-08-30.
