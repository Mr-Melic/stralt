# ACTION_IDS — Save / Data Evolution Guardian — 2026-10-24

HEAD: `0f5363f`. Helper-only recommendations. Do **not** edit WorldExploration / main.mo / BuffShop / versionGate / deathPenalty / App / AchievementsPanel / combatMath. Do **not** clone open vehicles listed in memories.

---

ACTION_ID: SDEG-2026-10-24-001  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: readApplyRewardsOk Number() cuts leftover XP/Doka on the credit write-path  
CATEGORY: precision / stale-overwrite  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `readApplyRewardsOk` (`applyRewardsResult.ts` 27–31) does `Number(ok.newDoka|newXp|newLevel)`. `resolveBattleRewards` (`rewardResolver.ts` 215–218) Numbers again into the recap. WX victory enqueue commits that payload (`WorldExploration.tsx` 12540–12545 — cite only; do not edit). Motoko `applyRewards` returns exact Nat leftover (`main.mo` 2140–2151). `saveBattleStats` allows lowering XP/Doka (`main.mo` 2088–2089). At leftover/threshold above `MAX_SAFE_INTEGER` (HUD sat from level 48, `xpCurve.ts` 32–35 / `longHorizonSim.test.ts` 40–42), the lock stores a rounded-down value; the next heal/death absolute write permanently cuts canister leftover. Distinct from known `deepNormalizeBigInts` on `getCharacterSlots` (`useCharacterQueries.ts` 75).  
SYSTEMS_AFFECTED: applyRewards credit path; progressPersist lock; saveBattleStats  
RECOMMENDED_ACTION: New helper only — e.g. `readApplyRewardsOkSafe` / `committedProgressFromApplyRewardsOk` that keeps bigint (or string Nat) through commit, and `clampAbsoluteProgressWriteBigInt` for absolute writes. Wire later outside forbidden files. Do not change Motoko curve.  
AUTONOMY: HELPER  
DEPENDENCIES: None  
MIGRATION_REQUIREMENT: None  
REGRESSION_RISK: HIGH if Number path remains the sole commit source at L48+  
VALIDATION_REQUIRED: Fixture leftover `2^53+1` Nat → commit → saveBattleStats does not lower canister XP.  
STATUS: NEW  

---

ACTION_ID: SDEG-2026-10-24-002  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Principal-scoped Doka death 40% taxes every slot; unpaid marker is slot-only  
CATEGORY: wallet / multi-character  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `dokaBalances` is per-principal (`main.mo` 1025–1026, 1883–1884, 2083–2108, 2148–2150, 3060). Death 20/40 uses that wallet via `saveBattleStats` (`deathPenalty.ts` 47–60; WX persist path commits shared Doka). Unpaid marker key is `pbv_pending_death_penalty_slot${slot}` only (`deathPenalty.ts` 309–311) — no principal, no character name. Slot-2 death cuts slot-1 earnings; another II on the same browser can flush/clear the wrong pending. Extends #385/#667 identity gap; not in the exclusion list as “shared wallet cross-slot tax.”  
SYSTEMS_AFFECTED: death penalty; dokaBalances; multi-slot; shared browser  
RECOMMENDED_ACTION: Helper `pendingDeathPenaltyStorageKey(principal, slot, characterId)` + `shouldApplyDeathDokaPenaltyToPrincipalWallet`. Union with #385/#508; do not edit deathPenalty.ts / App while those queue.  
AUTONOMY: HELPER (after #385)  
DEPENDENCIES: #385 #508 #667  
MIGRATION_REQUIREMENT: None (localStorage key shape); document principal wallet as shared  
REGRESSION_RISK: HIGH if alt death silently drains main  
VALIDATION_REQUIRED: Two slots, earn on 1, die on 2 → wallet −40%; pending key includes principal; other account cannot clear.  
STATUS: NEW  

---

ACTION_ID: SDEG-2026-10-24-003  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: mapsVisited / ground-doka counters are localStorage-only; wipe resets; delete inherits  
CATEGORY: achievement progress / slot reuse  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Counters at `${userId}_slot${slot}_pbv_maps_visited_count` / `_pbv_ground_doka_pickups` (`WorldExploration.tsx` 2193–2200, 6471–6477, 11402–11403 — cite only). `versionGate.shouldPreserveVersionGateKey` keeps only tier/levelup/inventory (`versionGate.ts` 7–12) — APP_VERSION wipe drops map counts (sibling of unpaid-death wipe, different keys). `useDeleteCharacter` / canister `deleteCharacter` (`main.mo` 450–492) clear boss rush only — not these keys. New occupant inherits explore_25 progress; version bump can lose it before unlock. Parallel to known achievementProgress / buffInventories slot reuse, but frontend-only.  
SYSTEMS_AFFECTED: explore_25_maps; version gate; slot reuse  
RECOMMENDED_ACTION: Helpers `mapsVisitedStorageKey`, `shouldPreserveMapsVisitedOnVersionGate`, `clearSlotLocalProgressOnDelete(principal, slot)`. Preserve keys via versionGate vehicle #508/#577 union — do not edit versionGate.ts / App on this branch.  
AUTONOMY: HELPER  
DEPENDENCIES: #508 #577 #667  
MIGRATION_REQUIREMENT: None unless moving counts to canister (then later migration after 20260901)  
REGRESSION_RISK: MEDIUM feat false unlock / lost progress  
VALIDATION_REQUIRED: Delete+recreate slot does not keep 24 maps; APP_VERSION bump preserves or migrates count intentionally.  
STATUS: NEW  

---

ACTION_ID: SDEG-2026-10-24-004  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: applyRewards level-up never mutates CharacterStats HP/AP/MP  
CATEGORY: long-horizon vitals  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `applyRewards` writes only `experience` + `level` on the character (`main.mo` 2140); Doka goes to `dokaBalances`. No HP/AP/MP growth. `saveBattleStats` is the vitals writer (2032–2067) and never raises atk/res/init (known). A six-month player who levels via victories without heal/death keeps create-era `stats.hp` on the canister until an absolute write. Compounds with known frozen atk/res/init/evasion/sp/sr/resilience/chc.  
SYSTEMS_AFFECTED: applyRewards; CharacterStats; hydrate  
RECOMMENDED_ACTION: Helper `vitalsAfterLevelUp(stored, newLevel, levelUpConfig)` for a future sole writer — do not grow compounding combat HP into persist. Prefer linear `maxPersistedHp`. No main.mo edit while persist PRs queue.  
AUTONOMY: HELPER / HUMAN  
DEPENDENCIES: levelUpConfig fetch vehicle; do not persist getPlayerBaseStats compounding HP (SDEG-2026-10-23-002)  
MIGRATION_REQUIREMENT: None for helper; YES if backfilling stored HP by level  
REGRESSION_RISK: MEDIUM if compounding HP is persisted  
VALIDATION_REQUIRED: After applyRewards L1→L10 with no saveBattleStats, stored hp unchanged; after official heal, hp ≤ linear cap.  
STATUS: NEW  

---

ACTION_ID: SDEG-2026-10-24-005  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Starter create ap≤10/mp≤5 exceeds PLAYER_BASE 8/4 battle+persist formula  
CATEGORY: create vs formula divergence  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `_starterStatsRejected` allows `ap > 10` / `mp > 5` reject only (`main.mo` 185–186). `startingChampionStats` writes ap=10, mp=5 (`startingChampionStats.ts` 10–11). Persist formula uses `PLAYER_BASE_AP=8` / `PLAYER_BASE_MP=4` (`adminGuard.mo` 16–17; `gameConstants.ts` 131–132). Battle init uses `getPlayerBaseStats` (formula wins). `persistApWriteCap` grandfathers stored 10 so absolute writes keep create AP. Yesterday’s champion stores 10 AP forever while combat spends 8. Related to but not the same as MAX_PERSISTED_20 or “AP writes incoming.”  
SYSTEMS_AFFECTED: createCharacter; saveBattleStats AP/MP; battle init  
RECOMMENDED_ACTION: Helper `starterPersistApMp()` returning `{ap:8,mp:4}` aligned with PLAYER_BASE; use from forge payload builder outside WX. Do not lower grandfathered stored rows without an explicit migration policy.  
AUTONOMY: HELPER  
DEPENDENCIES: None  
MIGRATION_REQUIREMENT: None for new creates; optional one-shot clamp for stored>formula at low level  
REGRESSION_RISK: LOW if only new creates change  
VALIDATION_REQUIRED: New create stores ap=8/mp=4; L1 battle AP=8; grandfathered ap=10 not cut.  
STATUS: NEW  

---

ACTION_ID: SDEG-2026-10-24-006  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: gameTypes.Character.dokaBalance false SoT; forge still sends stripped field  
CATEGORY: type / stale-client  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `gameTypes.ts` 37–38 still says dokaBalance is “Single source of truth”; index signature allows extras (50). Bindgen `Character` (`backend.ts` 85–102) has no dokaBalance — wallet is `dokaBalances` (`main.mo` 1987–1988, 3060). `CharacterCreation.tsx` 271 still sets `dokaBalance: existingCharacter?.dokaBalance ?? BigInt(0)`. Candid encode drops unknown fields today; a pre-C1 client or mistaken writer could treat Character.dokaBalance as wallet.  
SYSTEMS_AFFECTED: create/update forge payload; agent/docs drift  
RECOMMENDED_ACTION: Helper type `ForgeCharacterPayload` without dokaBalance; `assertNoCharacterWalletField`. Deprecate gameTypes dokaBalance comment. Do not reintroduce Character wallet.  
AUTONOMY: HELPER  
DEPENDENCIES: None  
MIGRATION_REQUIREMENT: None  
REGRESSION_RISK: LOW now; HIGH if Character wallet returns  
VALIDATION_REQUIRED: create/update payloads typecheck without dokaBalance; getCallerDokaBalance remains wallet SoT.  
STATUS: NEW  

---

ACTION_ID: SDEG-2026-10-24-007  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: saveCallerUserProfile silent void return disguises rejected writes  
CATEGORY: profile overwrite / UX  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `saveCallerUserProfile` (`main.mo` 69–84) returns `()` and silently `return`s on anonymous, banned, name>50, uiLayout>65_536 — no `#err`. Full-replace on success is known (SDEG-2026-09-29-003). A stale or raw client sending oversized uiLayout thinks save succeeded while the prior profile remains; combined with ProfileSetup `uiLayout:""` on “new” path, retries can still wipe when validation passes.  
SYSTEMS_AFFECTED: userProfiles; HUD layout; display name  
RECOMMENDED_ACTION: Helper `readSaveCallerUserProfileResult` cannot fix void Candid; document + client preflight `validateUserProfileWrite`. Result-typed API needs later Motoko (forbidden this run) after 20260901 if signature changes. Prefer `saveUserUiLayout` merge path for layout.  
AUTONOMY: HELPER / HUMAN  
DEPENDENCIES: Do not edit main.mo while persist queue open  
MIGRATION_REQUIREMENT: YES only if changing Candid to Result  
REGRESSION_RISK: MEDIUM silent no-op vs wipe  
VALIDATION_REQUIRED: Oversized uiLayout does not report success in official client; empty uiLayout still blocked when existing layout present (merge helper).  
STATUS: NEW  
