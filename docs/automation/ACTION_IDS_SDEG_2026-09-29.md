# ACTION_IDs — 2026-09-29 Save / Data Evolution Guardian

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Save/Data Evolution Guardian.  
Audit: [`DATA_EVOLUTION_AUDIT_2026-09-29.md`](./DATA_EVOLUTION_AUDIT_2026-09-29.md).  
Prior: `ACTION_IDS_SDEG_2026-09-28.md` (#731).  
Do not edit shipped `20260831` / `20260901` NewActor. Do not edit `WorldExploration.tsx` / `main.mo` / `BuffShop.tsx` / `deathPenalty.ts` / `versionGate.ts` / `App.tsx` while older persist PRs are queued. Do not clone #362 / #385 / #386 / #388 / #400 / #408 / #437 / #466 / #490 / #508 / #577 / #622 / #667 / #731 helpers.

---

## Carry-forward (still OPEN — do not re-mint)

All SDEG-2026-08-31 through SDEG-2026-09-28 items remain as previously ledgered. Vehicles: #362, #385, #386, #388, #400, #408, #437, #466, #490, #508, #577, #622, #667, #731.

HEAD is still `0f5363f`. No persist schema landed on main since 2026-09-21. This run does **not** approve any new required persist field.

---

## New (2026-09-29)

ACTION_ID: SDEG-2026-09-29-001
SOURCE_AUTOMATION: Save/Data Evolution Guardian
TITLE: Persist AP/MP hard cap 20 is a silent action-economy max; do not assume unbounded pools
CATEGORY: unbounded-progression
PRIORITY: P1
CONFIDENCE: HIGH
EVIDENCE: `AdminGuard.MAX_PERSISTED_AP` / `MAX_PERSISTED_MP` = 20 (`adminGuard.mo` **18–19**; `adminSafety.ts` **260–261**). Formula is `PLAYER_BASE + floor(level / apMpLevelThreshold)` then min 20 (`maxPersistedAp` **263–266**). `validateLevelUpConfig` allows threshold **1–100** (`adminSafety.ts` **494–495**). At threshold 1, persist AP hits 20 at level 12 (`firstLevelWherePersistApHitsHardCap(1) === 12`); uncapped L13 is 21 (`persistApHardCapIsSilentMax(13, 1)`). Default threshold 25 hits the cap at level 300 and is silent-max from 325. Motoko `applyRewards` level is unbounded Nat. Distinct from 09-21-003 (do not mint 20 at L1) and 09-28-003 (incoming AP/MP not keep-stored).
SYSTEMS_AFFECTED: `saveBattleStats`; `persistApWriteCap` / `persistMpWriteCap`; LevelUpConfig.apMpLevelThreshold; high-level HUD pools
RECOMMENDED_ACTION: Treat 20 as a documented content bound, not a forgotten max-level. If pools must grow without a ceiling, replace the hard cap with the formula only after a mint guard (write generation or keep-store vs stored). Do not lower the live threshold to 1 without converting already-capped rows. Do not edit `main.mo` / `adminGuard.mo` while older persist PRs queue.
AUTONOMY: IMPLEMENT (contract helper this run); HUMAN (Motoko cap after `main.mo` queue)
DEPENDENCIES: SDEG-2026-09-28-003 complementary; do not clone #731 AP helpers
MIGRATION_REQUIREMENT: None if the cap stays as content. YES if stored AP/MP must be rewritten after a cap/threshold change — idempotent generation; replay must not re-cut.
REGRESSION_RISK: HIGH if the cap is removed without another mint guard; MEDIUM if admin publishes threshold 1 onto a high-level cohort
VALIDATION_REQUIRED: L13 / threshold 1 persist AP stays 20 while uncapped is 21; L1 incoming 20 still cannot mint past grandfather/formula. `node --experimental-strip-types --test src/frontend/src/utils/persistApHardCapUnbounded.test.ts`
STATUS: NEW

---

ACTION_ID: SDEG-2026-09-29-002
SOURCE_AUTOMATION: Save/Data Evolution Guardian
TITLE: Treat official killCount=0 as valid history; do not wire additive saveKillCount without a generation
CATEGORY: persist-schema
PRIORITY: P1
CONFIDENCE: HIGH
EVIDENCE: `saveKillCount` (`main.mo` **3078–3114**) does `killCount + kills` and rejects `kills > 64`. Create requires `killCount == 0` (**195**). `useSaveKillCount` (`useLeaderboardQueries.ts` **43–48**) has **zero** component callers. `getLeaderboard` (**3390–3424**) copies `killCount` from the highest-level slot only (`c.level > bestLevel`, not `>=`). GameFlow leaderboard UI shows that field (**674**). Yesterday / six-month / pre-leaderboard rows are all 0. Distinct from MTD-005 “wire or drop”: SDEG forbids treating 0 as incomplete data and forbids an additive writer without SDEG-006.
SYSTEMS_AFFECTED: `CharacterStats.killCount`; `saveKillCount`; `getLeaderboard`; `useSaveKillCount`
RECOMMENDED_ACTION: Leave 0 in place. If official play must persist kills, use a keep-store or per-battle idempotency key (or writeGeneration). Do not backfill. Do not call the existing hook from victory without that guard. Leaderboard should read the played slot or the max kills, not only the highest-level slot. Do not edit `main.mo` while older persist PRs queue.
AUTONOMY: IMPLEMENT (contract helper this run); HUMAN (Motoko / battle caller after queue)
DEPENDENCIES: SDEG-2026-08-31-006 if a writer is added; do not clone MTD wiring
MIGRATION_REQUIREMENT: None while 0 remains the official value. YES if historical kills are reconstructed — one-shot generation; replay must not add again.
REGRESSION_RISK: HIGH if the unused hook is wired raw (retry mints +64); LOW if 0 stays
VALIDATION_REQUIRED: No TSX caller of `useSaveKillCount` on this HEAD; fixture killCount 0 still leaderboards; double `saveKillCount(5)` would be 10. `node --experimental-strip-types --test src/frontend/src/utils/saveKillCountEvolution.test.ts`
STATUS: NEW

---

ACTION_ID: SDEG-2026-09-29-003
SOURCE_AUTOMATION: Save/Data Evolution Guardian
TITLE: saveCallerUserProfile must not clobber a newer uiLayout with the create default
CATEGORY: stale-client
PRIORITY: P1
CONFIDENCE: HIGH
EVIDENCE: `saveCallerUserProfile` (`main.mo` **69–85**) does `userProfiles.add(caller, profile)` with no merge. `saveUserUiLayout` (**91–109**) reads existing and writes `{ existing with uiLayout }`. ProfileSetup (**45–51**) must send `uiLayout: ""` for Candid on first login. A stale or future rename client that reuses that payload overwrites a HUD blob already stored via `saveUserUiLayout`. Empty string is the create default, not “keep existing”. Distinct from SDEG-006 (Character generation) and from #429 (single getUserUiLayout fetch).
SYSTEMS_AFFECTED: `userProfiles`; `saveCallerUserProfile`; `saveUserUiLayout`; ProfileSetup; HUD layout
RECOMMENDED_ACTION: Keep ProfileSetup `uiLayout: ""` for **new** profiles only. Any later profile write must send the stored blob or call `saveUserUiLayout`. Prefer merge-on-name-change in Motoko (`{ existing with name }`) so an old frontend cannot blank layout. Do not add a required schemaVersion on UserProfile until a later chain file after `20260901`. Do not edit `main.mo` while older persist PRs queue.
AUTONOMY: IMPLEMENT (contract helper this run); HUMAN (Motoko merge after queue)
DEPENDENCIES: None for the contract; Motoko merge waits on the `main.mo` queue
MIGRATION_REQUIREMENT: None (behavior-only merge). Do not add required fields. Replay of create `""` must not wipe after the merge exists.
REGRESSION_RISK: LOW for merge-on-update (name still changes); HIGH if create stops sending `uiLayout` (Candid fail)
VALIDATION_REQUIRED: New profile `""` still creates; stored layout + incoming `""` is flagged as a wipe on this HEAD. `node --experimental-strip-types --test src/frontend/src/utils/userProfileReplacePersist.test.ts`
STATUS: NEW
