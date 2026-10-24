# Player data evolution audit — 2026-10-24

**Guardian:** Save / Data Evolution Guardian  
**HEAD:** `0f5363f`  
**Scope:** stale-client overwrite, levels/XP, Doka, CharacterStats, `saveBattleStats`, `applyRewards`, `updateCharacter`, `createCharacter`, `saveCallerUserProfile`, `deepNormalizeBigInts`, `writeGeneration`, APP_VERSION wipe, unpaid death, `versionGate`.  
**Forbidden edits (this run):** `WorldExploration.tsx`, `main.mo`, `BuffShop.tsx`, `versionGate.ts`, `deathPenalty.ts`, `App.tsx`, `AchievementsPanel.tsx`, `combatMath.ts`.  
**Do not clone:** #362 #385 #386 #388 #400 #408 #437 #466 #490 #508 #577 #622 #667 #731 #778 #803 #828 #893.

Excluded known items (not re-reported): CharacterStats 12-field / later migration; `saveBattleStats` never-raise Doka/XP/atk/res/init + ignore spell arrays; no `writeGeneration`; APP_VERSION drops unpaid-death; `deepNormalizeBigInts` Number cut; `saveCallerUserProfile` full-replace / empty `uiLayout`; persist never raises atk/res/init / never writes evasion/sp/sr/resilience/chc after create; `getSessionState` blood=50; WX never `getLevelUpConfig`; `apMpGrowthEveryNLevels` vs `apMpLevelThreshold`; compounding vs linear HP; `MAX_PERSISTED_AP/MP=20`; official `killCount` stays 0; applyRewards 100k/500k; leftover curve `100*2^(N-1)`; death 20/40 via `saveBattleStats`; persist-lock Doka seeding.

## NEW findings

See `ACTION_IDS_SDEG_2026-10-24.md`. Summary:

| ID | Title | Overwrite risk |
| :--- | :--- | :--- |
| SDEG-2026-10-24-001 | `readApplyRewardsOk` Number() write-path cut into persist lock | High at L48+ leftover / huge Nat |
| SDEG-2026-10-24-002 | Principal Doka + slot death 20/40 cross-tax; unpaid key slot-only | High multi-slot / shared browser |
| SDEG-2026-10-24-003 | mapsVisited / ground-doka localStorage: wipe resets; delete inherits | Medium feat progress |
| SDEG-2026-10-24-004 | `applyRewards` never mutates CharacterStats vitals | Medium long-horizon vitals lag |
| SDEG-2026-10-24-005 | Starter ap≤10/mp≤5 above PLAYER_BASE 8/4 | Low–medium formula vs store |
| SDEG-2026-10-24-006 | `gameTypes.Character.dokaBalance` false SoT; forge still sends | Low (stripped) / agent trap |
| SDEG-2026-10-24-007 | `saveCallerUserProfile` silent void on reject | Medium stale HUD / name |

Still open (not NEW; vehicles exist): victory HP floor vs linear cap (#386 / SDEG-2026-09-02-001); unpaid-death owner key (#385/#508/#667).

## MAX_LEVEL / silent caps / Number() on XP·Doka·level

- **No `MAX_LEVEL`.** `applyRewards` levels with unbounded Motoko `Nat` (`main.mo` 2134–2139). Admin UI: “No player level cap.”
- **Silent caps (not level):** `MAX_PERSISTED_AP/MP=20`; `applyRewards` dokaΔ>100_000 / xpΔ>500_000 `#err` (official client clamps); `pickEnemyLevelFromTiers` 999; summon `level>99`; region `levelMax` miss; HUD XP threshold saturates at `Number.MAX_SAFE_INTEGER` from level **48** (`xpForNextLevel`).
- **Number() on XP/Doka/level (persist-adjacent):**
  - `deepNormalizeBigInts` — character slot hydrate (known)
  - `readApplyRewardsOk` 28–30 — credit ok payload (**NEW-001**)
  - `resolveBattleRewards` 215–219 — double Number on recap
  - `progressPersist.toNat` / `CommittedProgress` — IEEE lock
  - `normalizeCallerDokaBalance` — wallet query
  - `deathPenalty` / `experienceFromCharacterRecord` — absolute writes
  - `achievementReward` / `shopPurchase` / `spellUpgrade` / `dokaPersist` — credit/spend paths
  - WX init `Number(character.level|experience|stats.*)` 3227–3243

## Cohort (NEW only)

| Owner | Effect |
| :--- | :--- |
| Yesterday | Shared wallet death tax across slots; mapsVisited local only |
| Six months | Same; high level still safe until leftover Nat exceeds IEEE |
| Pre-feature | Optional Character fields null OK; no writeGeneration |
| Renamed/retired spells | Unchanged (prior SDEG); empty keys still drop bar |
| Slot delete + recreate | Inherits mapsVisited / spell_levels localStorage + canister achievement/buff maps |

## What this run will not do

- Edit forbidden files or clone open helper PRs
- Add required persist fields / migrations
- Wire `writeGeneration` without a later chain file after `20260901`
