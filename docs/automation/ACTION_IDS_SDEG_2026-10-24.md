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

---

ACTION_ID: SDEG-2026-10-24-008  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Live boss configs are pbv_boss_configs localStorage; canister BossConfig unused + schema skew  
CATEGORY: visual / config-ref  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: WX portal entry reads `localStorage pbv_boss_configs` (`WorldExploration.tsx` 6486–6492 — cite only). `useGetAllBossConfigs` / `useSetBossConfig` are localStorage-only (`useBossQueries.ts` 1–30; `useAdminQueries.ts` 508–536). Admin UI copy: “Not canister-live” (`AdminDashboard.tsx` 7837). Motoko `BossConfig` has `defeated` / `adminNotes` (`admin.mo` 317–330); frontend carries `iconEmoji` / `loreText` / `chc` (`useBossQueries.ts` 3–5). `getAllBossConfigs` / `setBossConfig` exist on bindgen but have zero official callers under components. Cross-device / wipe drops admin boss edits; canister seeds are inert for play. Helper: `bossConfigPersist.ts`.  
SYSTEMS_AFFECTED: boss portals; Boss Rush encounter art; admin boss tab  
RECOMMENDED_ACTION: Keep helper lock. Unify schema + wire getAllBossConfigs after EBA vehicle; do not edit WX on this branch.  
AUTONOMY: HELPER  
DEPENDENCIES: EBA boss canister import (design)  
MIGRATION_REQUIREMENT: YES when flipping live read to canister (one-time import of DEFAULT_BOSS_CONFIGS)  
REGRESSION_RISK: MEDIUM if local drafts silently diverge from canister  
VALIDATION_REQUIRED: Official portal ignores Motoko-only edits; localStorage wipe falls back to DEFAULT_BOSS_CONFIGS.  
STATUS: NEW  

---

ACTION_ID: SDEG-2026-10-24-009  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: SummonUnitDef persist drops summonKit/ap/mp on admin round-trip  
CATEGORY: spell / summon persist  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Motoko `SummonUnitDef` is four fields (`admin.mo` 85–90). `toBackendSummonUnitDef` / `fromBackendSpellConfig` strip kit/ap/mp (`adminContract.ts` 283–302, 400–412). Frontend starter summon kits live only on `spellData.ts` 564–680. Summon control resolves kits from `starterSpells` by pieceType (`summonControlCast.ts` 103–118; WX cites starterSpells). Admin-created or overwritten summon ids lose kits after save→hydrate. Distinct from known pixelPattern unused / sprite optional. Helper: `summonUnitDefPersist.ts`.  
SYSTEMS_AFFECTED: admin spell summon editor; player summon control; enemy summon kits  
RECOMMENDED_ACTION: Helper landed. Motoko field add needs later migration after 20260901 — forbidden main.mo this run.  
AUTONOMY: HELPER / HUMAN  
DEPENDENCIES: SDA summonKit Motoko extension  
MIGRATION_REQUIREMENT: YES for new SummonUnitDef fields (later chain file)  
REGRESSION_RISK: HIGH for custom admin summons; LOW for built-in starter ids while WX prefers starterSpells kits  
VALIDATION_REQUIRED: Round-trip adminSetSpellConfig on summon-dire-wolf drops summonKit; helper asserts loss.  
STATUS: NEW  

---

ACTION_ID: SDEG-2026-10-24-010  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Frontend clearBossRushForSlot only resetBossRush; full clear is canister remove  
CATEGORY: Boss Rush / slot reuse  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `_clearBossRushForSlot` removes the map entry (`main.mo` 3257–3260) on create/delete (370, 491). Frontend `clearBossRushForSlot` calls `resetBossRush` only (`bossRushProgress.ts` 89–96), which zeros `currentRoom` and keeps highest/runs (`main.mo` 3372–3387). `useCreateCharacter` / `useDeleteCharacter` call canister first then the helper (`useCharacterQueries.ts` 126–128, 184–186) — official path OK today. Helper docstring claims “Drop slot-scoped progress”; tests lock reset-only (`bossRushProgress.test.ts` 83–95). Latent if a caller uses the helper alone or hits a deploy lag without remove. Helper: `bossRushSlotClear.ts`.  
SYSTEMS_AFFECTED: Boss Rush highestRoomCompleted; totalBossRushRuns; slot recreate  
RECOMMENDED_ACTION: Keep contract helper. Prefer canister remove API exposed to clients before changing bossRushProgress.ts (#803 vehicle).  
AUTONOMY: HELPER  
DEPENDENCIES: #803  
MIGRATION_REQUIREMENT: None  
REGRESSION_RISK: MEDIUM if helper-only clear ships without remove  
VALIDATION_REQUIRED: reset-only leaves highest=10; createCharacter leaves (0,0,0).  
STATUS: NEW  

---

ACTION_ID: SDEG-2026-10-24-011  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: setBossRushProgress +1 walk needs no combat; raw client can mint master  
CATEGORY: Boss Rush integrity  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `setBossRushProgress` only checks login, ban, slot, `currentRoom` 0–9, ±1 advance, no decrease (`main.mo` 3275–3299). No battle proof. `completeBossRushRoom` then accepts roomIndex==current or current-1 (3340–3344); `shouldCountBossRushRun(9,9)` sets master (`adminGuard.mo` 699–700; `main.mo` 3347–3360). Official `persistBossRushRoomClear` is honest; raw walk 0→9 + complete(9) mints `bossRushMasterComplete` / highest=10 / runs++. Not the known complete(9) ordering bug (#803 fixed). Helper: `bossRushSlotClear.rawClientCanWalkBossRushToMasterWithoutCombat`.  
SYSTEMS_AFFECTED: bossRushMasterComplete; leaderboard completion; feats gated on master  
RECOMMENDED_ACTION: Helper documents. Future writeGeneration / server-side room clear authority needs main.mo (forbidden this run).  
AUTONOMY: HELPER / HUMAN  
DEPENDENCIES: SDEG-006 writeGeneration  
MIGRATION_REQUIREMENT: None  
REGRESSION_RISK: HIGH for raw clients; LOW for official UI  
VALIDATION_REQUIRED: Simulated +1 walk to 9 then complete counts a run without combat fixtures.  
STATUS: NEW  

---

ACTION_ID: SDEG-2026-10-24-012  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Legendary challenge badges never enter applyRewards / achievementProgress  
CATEGORY: challenge persist  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `DEFAULT_CHALLENGES` advertise badge Untouchable/Blitz/Striker (`challengeCompletion.ts` 92–107). `CompletedChallengeReward` / `battleChallengePersistEntries` only name + doka/xp (`challengeRewards.ts` 1–25) — no badge field. Victory persist uses name `"Battle Challenge"` (WX cite-only). No canister badge map. Session panel shows Badge: text (`ChallengePanel.tsx` 287–289). Distinct from challenge XP drop (already fixed) and feat allowlist. Helper: `challengeBadgePersist.ts`.  
SYSTEMS_AFFECTED: challenge legendary cosmetics; recap; Feats  
RECOMMENDED_ACTION: Helper landed. If badges become Feats, add allowlisted conditions — do not edit AchievementsPanel (#437).  
AUTONOMY: HELPER  
DEPENDENCIES: None  
MIGRATION_REQUIREMENT: YES only if badges become canister Feats  
REGRESSION_RISK: LOW (cosmetic today)  
VALIDATION_REQUIRED: Completed legendary persist entries have no badge; panel still shows badge copy.  
STATUS: NEW  

---

ACTION_ID: SDEG-2026-10-24-013  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Spell level/bar localStorage keys use display-name userId (nsKey)  
CATEGORY: spell hydrate / ID identity  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `nsKey` = `` `${userId}_slot${slot}_${base}` `` (`WorldExploration.tsx` 864–871). GameFlow `userId` is `userProfile.id ?? name` (`GameFlow.tsx` 256) but Candid `UserProfile` is only name+uiLayout (`main.mo` 48–54) — live key is display name. Writes: `pbv_spell_levels` / `pbv_active_spells` (WX 2715–2721, 3205–3208). Amplifies known empty-keys→localStorage spell-level fallback and empty-keys drop of setSpellBarOrder Text bar. Delete/recreate inherits; two “Bob” accounts share keys. Sibling of 003 (maps/ground doka) on a different surface. Helper: `slotLocalProgressKeys.ts`.  
SYSTEMS_AFFECTED: spell levels cache; spell bar cache; empty-keys hydrate  
RECOMMENDED_ACTION: Helper prefers II principal text. Wire via #490/#400 vehicles — do not edit WX/BuffShop this run.  
AUTONOMY: HELPER  
DEPENDENCIES: #388 #400 #490  
MIGRATION_REQUIREMENT: None (key rename is client migrate)  
REGRESSION_RISK: MEDIUM false owned levels after slot reuse  
VALIDATION_REQUIRED: resolveSlotLocalOwnerKey(principal, name) is principal; display-name flagged unsafe.  
STATUS: NEW  

---

ACTION_ID: SDEG-2026-10-24-014  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: adminDeleteEnemyConfig hard-deletes; no ID alias/remap; ghost spellLevelKeys after catalog purge  
CATEGORY: rename / retired IDs  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `adminDeleteEnemyConfig` is `enemyConfigs.remove` with no reference check (`main.mo` 798–804). Spells/achievements retire when referenced (`main.mo` 882–901, 2389–2409). `OLD_SPELL_IDS` purge removes catalog rows every start (`main.mo` 688–697) but never strips `Character.spellLevelKeys` — ghost ids stay owned for `setSpellBarOrder` filter (1945–1947) and ownedIds; `upgradeSpell` returns “Spell not found” (975–977). No spell/enemy rename alias table (known no remap — this is the character-side leftover). Helper: `catalogDeletePolicy.ts`.  
SYSTEMS_AFFECTED: enemy catalog; spellLevelKeys; bar ownership; region/spawn refs  
RECOMMENDED_ACTION: Helper locks policy. Enemy retire + key-strip need main.mo later; alias map is a new later migration if renames ship.  
AUTONOMY: HELPER / HUMAN  
DEPENDENCIES: Do not edit main.mo while persist queue open  
MIGRATION_REQUIREMENT: YES for key-strip or alias maps  
REGRESSION_RISK: MEDIUM orphan refs / ghost bar ownership  
VALIDATION_REQUIRED: ghostSpellKeyRemainsOwnedAfterCatalogPurge(physical_attack) true when catalog lacks id.  
STATUS: NEW  

---

ACTION_ID: SDEG-2026-10-24-015  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: purchaseBuff does not require an occupied character slot  
CATEGORY: inventory  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `purchaseBuff` checks auth/ban/slot range/catalog/Doka only (`main.mo` 2811–2857) — no `characterSlots` empty-slot reject (contrast `upgradeSpell` 988–992). Stocks `principal#slot` even when slot is null. Official UI never calls purchaseBuff (known localStorage shop); raw client can pre-stock empty slots. Combined with known buffInventories surviving deleteCharacter (no clear at 450–492). Helper: `catalogDeletePolicy.purchaseBuffRequiresOccupiedCharacterSlot`.  
SYSTEMS_AFFECTED: buffInventories; slot reuse; raw-client inventory  
RECOMMENDED_ACTION: Helper documents. Guard needs main.mo; BuffShop wire is #408/#490 — do not edit BuffShop.tsx.  
AUTONOMY: HELPER  
DEPENDENCIES: #408 #490  
MIGRATION_REQUIREMENT: None  
REGRESSION_RISK: LOW official; MEDIUM raw-client pre-stock  
VALIDATION_REQUIRED: Policy helper false; future Motoko rejects empty slot.  
STATUS: NEW  
