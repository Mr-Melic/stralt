# Bug-hunt memory

Open or rejected only. Delete an entry when its PR merges or the bug is gone.

- `attackNearestEnemy` read stale React `enemies` instead of the live combatant store, so enemy-side summons (and other store-only hostiles) were not targeted. Sprite-click Strike live-gating already shipped in #93/#95; this PR keeps that `main` path (`getActiveCasterPos`, effective range, `shouldExecuteLiveCast`) and only changes Attack Nearest to `getLiveCombatants` + `isActiveHostile`. PR: https://github.com/Mr-Melic/stralt/pull/102. Status: open. Recorded: 2026-08-30.
