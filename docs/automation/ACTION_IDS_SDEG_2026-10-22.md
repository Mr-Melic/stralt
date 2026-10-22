# ACTION_IDs — 2026-10-22 Save / Data Evolution Guardian

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Save/Data Evolution Guardian.  
Audit: [`DATA_EVOLUTION_AUDIT_2026-10-22.md`](./DATA_EVOLUTION_AUDIT_2026-10-22.md).  
Prior committed: `ACTION_IDS_SDEG_2026-09-02.md`.  
HEAD: `0f5363f`. Do not clone #362 / #385 / #386 / #388 / #400 / #408 / #437 / #466 / #490 / #508 / #577 / #622 / #667 / #731 / #778 / #803.

---

## Closed / landed since 2026-09-02 (source)

ACTION_ID: SDEG-2026-09-02-002 / SDEG-2026-09-01-005  
STATUS: IMPLEMENTED (source)  
EVIDENCE: `src/backend/migrations/20260901_000000.mo` is on main (`OldActor = {}`, empty GameKey maps, frozen). `mops.toml` `check-limit = 5`. Live `main.mo` is still `actor {` — SDEG-001 remains OPEN. Do not restuff this NewActor.

ACTION_ID: SDEG-2026-09-02-003  
STATUS: IMPLEMENTED  
EVIDENCE: `persistHpWriteCap` `adminGuard.mo` 640–643; `saveBattleStats` `main.mo` 2035–2041.

ACTION_ID: SDEG-2026-09-01-006  
STATUS: IMPLEMENTED  
EVIDENCE: `getPersistedPiecePattern` `pieceArt.ts` 653–658; WX portrait 3719 + player draw 8289.

ACTION_ID: SDEG-2026-09-01-001 / 002 / SDEG-2026-08-31-009  
STATUS: IMPLEMENTED  
EVIDENCE: `saveBattleStats` ignores client level (`main.mo` 2093); `updateCharacter` keep-store spell arrays (`main.mo` 424–430).

---

## Carry-forward (still OPEN)

ACTION_ID: SDEG-2026-08-31-001  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Wire the live actor to the migration chain before any required-field add  
CATEGORY: persist-schema  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `src/backend/main.mo` line 44 is still `actor {`. mops injects the chain (`check-limit = 5`). GameKey empty defaults are already on `20260901`.  
SYSTEMS_AFFECTED: `src/backend/main.mo`; `src/backend/migrations/*`; `mops.toml`  
RECOMMENDED_ACTION: New later files only (`20260902+`, `OldActor = {}`). First wired module that rewrites player maps must copy every map. Do not deploy `backend_extended`. Never amend shipped NewActor.  
AUTONOMY: HUMAN  
DEPENDENCIES: SDEG-2026-08-31-002  
MIGRATION_REQUIREMENT: YES  
REGRESSION_RISK: HIGH  
VALIDATION_REQUIRED: `mops check` vs `.old` and `snapshots/deployed/*.most`; fixture principal still loads.  
STATUS: OPEN  

---

ACTION_ID: SDEG-2026-08-31-002  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Refresh inlined migration types before a full-chain attach  
CATEGORY: persist-schema  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Frozen files through `20260901` are GameKey-only at the tail. That is not full live-shape parity for a player-map rewrite.  
SYSTEMS_AFFECTED: `src/backend/migrations/*`  
RECOMMENDED_ACTION: Diff every live `let`/`var` against the tail NewActor before attaching `(with migration)` as a player rewrite.  
AUTONOMY: HUMAN  
DEPENDENCIES: SDEG-2026-08-31-001  
MIGRATION_REQUIREMENT: YES  
REGRESSION_RISK: HIGH  
VALIDATION_REQUIRED: Migration compiles; summon spells and GameKey rows round-trip.  
STATUS: OPEN  

---

ACTION_ID: SDEG-2026-08-31-003  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Stop the every-upgrade OLD_SPELL_IDS purge; remap ownership instead  
CATEGORY: content-id-stability  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `main.mo` 689–697 still `spellConfigs.remove`s `physical_attack` on every start. `WorldExploration.tsx` still hides by id **and name**. Vehicle tests: #400.  
SYSTEMS_AFFECTED: `main.mo`; `WorldExploration.tsx`; `upgradeSpell`; `spellLevelKeys`  
RECOMMENDED_ACTION: One-shot `oldSpellIdsPurged` after SDEG-001. Persist `oldId → newId`. Never delete `physical_attack` while it is a starter.  
AUTONOMY: HUMAN  
DEPENDENCIES: SDEG-2026-08-31-001  
MIGRATION_REQUIREMENT: YES — idempotent  
REGRESSION_RISK: HIGH  
VALIDATION_REQUIRED: Fixture `spellLevelKeys = ["fireball","physical_attack"]` survives two upgrades.  
STATUS: OPEN  

---

ACTION_ID: SDEG-2026-08-31-004  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Persist owned spell ids (and discovery) separately from the live catalog  
CATEGORY: spell-discovery  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `shouldIncludeBackendSpellInLibrary` (`adminSafety.ts` 712–718) still true unless retired. `upgradeSpell` still appends any usable catalog id (`main.mo` 1036–1049). `setSpellBarOrder` still filters to `spellLevelKeys` (`main.mo` 1945–1947).  
SYSTEMS_AFFECTED: Character; `upgradeSpell`; starters; future discovery  
RECOMMENDED_ACTION: Stored ownership set with empty-keys = starters ∪ upgraded, not catalog-all. Do not add required fields until SDEG-001.  
AUTONOMY: HUMAN  
DEPENDENCIES: SDEG-2026-08-31-003; SDEG-2026-08-31-001  
MIGRATION_REQUIREMENT: YES  
REGRESSION_RISK: MEDIUM  
VALIDATION_REQUIRED: Old empty-keys still has starters; admin add does not appear in another account’s book.  
STATUS: OPEN  

---

ACTION_ID: SDEG-2026-08-31-005  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Hydrate BuffShop from canister inventory; stop paid items living only in localStorage  
CATEGORY: inventory  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `BuffShop.tsx` 85–97 still `${principalId}_inventory`. Canister `buffInventories` is `caller#slot` (`main.mo` 2791–2807) and unused by that UI. Vehicles: #408 / #490.  
SYSTEMS_AFFECTED: `BuffShop.tsx`; `buffInventories`; `versionGate.ts`  
RECOMMENDED_ACTION: Buy/use through canister APIs on `createProgressPersist`. Copy localStorage into empty canister slots once. Remap frontend ids onto `BUFF_CATALOG` ids in the same pass (see 10-22-004).  
AUTONOMY: HUMAN  
DEPENDENCIES: None  
MIGRATION_REQUIREMENT: YES  
REGRESSION_RISK: MEDIUM  
VALIDATION_REQUIRED: Buy on A, login on B, stacks match.  
STATUS: OPEN  

---

ACTION_ID: SDEG-2026-08-31-006  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Add a Character write generation so stale clients cannot clobber newer XP/Doka  
CATEGORY: stale-client  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `writeGeneration` still grep-empty. `saveBattleStats` still mins incoming Doka/XP (`main.mo` 2087–2088). `deepNormalizeBigInts` Number() then min can cut leftover (09-27-003).  
SYSTEMS_AFFECTED: `saveBattleStats`; `applyRewards`; Character  
RECOMMENDED_ACTION: Optional `writeGeneration : ?Nat` after SDEG-001. Reject older absolute writes except signed death.  
AUTONOMY: HUMAN  
DEPENDENCIES: SDEG-2026-08-31-001  
MIGRATION_REQUIREMENT: YES — optional/defaulted  
REGRESSION_RISK: HIGH if death retries use a stale generation  
VALIDATION_REQUIRED: applyRewards then stale saveBattleStats does not cut leftover.  
STATUS: OPEN  

---

ACTION_ID: SDEG-2026-08-31-007  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Make dungeon progress writes idempotent and slot-scoped  
CATEGORY: progress-idempotency  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `dungeonRecords` is Principal-keyed (`main.mo` 2894, 2905–2924). Official UI never calls `updateDungeonProgress` (10-21-001). Raw client still `totalMapsCompleted + 1` every call.  
SYSTEMS_AFFECTED: `dungeonRecords`; `updateDungeonProgress`  
RECOMMENDED_ACTION: Do not wire official UI to this method until it is `principal#slot` and increments only when depth increases.  
AUTONOMY: HUMAN  
DEPENDENCIES: SDEG-2026-08-31-001  
MIGRATION_REQUIREMENT: YES  
REGRESSION_RISK: MEDIUM  
VALIDATION_REQUIRED: Double updateDungeonProgress(depth=2) → +1 map; two slots keep separate chains.  
STATUS: OPEN  

---

ACTION_ID: SDEG-2026-08-31-008  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Snapshot achievement reward at unlock; keep progress when config is retired  
CATEGORY: achievements  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Soft-retire landed. `claimAchievementReward` still pays **current** `config.dokaReward` (`main.mo` 2549–2550) and does not check `active`. Official panel hides inactive rows (`AchievementsPanel.tsx` 191–194). Vehicle: #437.  
SYSTEMS_AFFECTED: `achievementProgress`; `claimAchievementReward`  
RECOMMENDED_ACTION: Optional `dokaRewardAtUnlock : ?Nat`. Renames keep `id`.  
AUTONOMY: HUMAN  
DEPENDENCIES: None  
MIGRATION_REQUIREMENT: Optional field only  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Unlock, deactivate, claim pays unlock-time amount once.  
STATUS: OPEN  

---

ACTION_ID: SDEG-2026-08-31-011  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Do not deploy dfx.json backend_extended (15-field stats) over the 12-field live actor  
CATEGORY: deploy-hazard  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `dfx.json` line 4 still points at missing `src/backend_extended/main.mo`. Live CharacterStats is 12 fields (`main.mo` 147–160).  
SYSTEMS_AFFECTED: `dfx.json`; `backend_extended/`; bindgen  
RECOMMENDED_ACTION: Point dfx at `src/backend/main.mo` only after a planned upgrade. Never “fix” bindgen to 15 fields.  
AUTONOMY: HUMAN  
DEPENDENCIES: Live canister upgrade plan  
MIGRATION_REQUIREMENT: YES if deployed actor is still 15-field  
REGRESSION_RISK: HIGH  
VALIDATION_REQUIRED: `getCharacter` + `updateCharacter` with 12-field `killCount` succeeds.  
STATUS: OPEN  

---

ACTION_ID: SDEG-2026-09-01-004  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Split applyRewards anti-mint ceilings from official high-level payouts  
CATEGORY: unbounded-progression  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `applyRewards` `main.mo` 2119–2120 still rejects `> 100_000` / `> 500_000`.  
SYSTEMS_AFFECTED: `applyRewards`; recap advertised vs committed  
RECOMMENDED_ACTION: Official payouts must persist in full. Recap must not advertise more than committed.  
AUTONOMY: HUMAN  
DEPENDENCIES: None  
MIGRATION_REQUIREMENT: None  
REGRESSION_RISK: HIGH if the ceiling is removed without another mint guard  
VALIDATION_REQUIRED: High-level jackpot: recap Doka == canister delta.  
STATUS: OPEN  

---

ACTION_ID: SDEG-2026-09-02-001  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Align victory HP floor with persist HP cap so L10+ victories are not clipped  
CATEGORY: unbounded-progression  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `victoryResourceFloor` `deathPenalty.ts` 144–154 is `50 + level*10`. Linear persist max at 5% is `100 + (level-1)*5`. Vehicle: #386.  
SYSTEMS_AFFECTED: `saveBattleStats`; post-battle hydrate; `deathPenalty.ts`  
RECOMMENDED_ACTION: Human picks one formula. Do not silently cut official victory HP.  
AUTONOMY: HUMAN  
DEPENDENCIES: None  
MIGRATION_REQUIREMENT: None if victory floor is lowered  
REGRESSION_RISK: MEDIUM  
VALIDATION_REQUIRED: Level-10 victory persist HP equals the HUD floor; level-1 raw 300 still cannot mint on a new row.  
STATUS: OPEN  

---

ACTION_ID: SDEG-2026-09-02-004  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Credit or close leftover KYC purchaseRecords after GameKey replaced auto-complete  
CATEGORY: inventory  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `processPendingPurchases` is still a no-op returning `0`. Pending KYC rows never auto-complete.  
SYSTEMS_AFFECTED: `purchaseRecords`; admin Doka grant  
RECOMMENDED_ACTION: Admin cohort: pending rows → grant via `adminAddDokaToUser` or mark rejected. Do not re-enable 60s auto-complete.  
AUTONOMY: HUMAN  
DEPENDENCIES: None  
MIGRATION_REQUIREMENT: No schema; operational backfill  
REGRESSION_RISK: MEDIUM if pending rows are double-credited  
VALIDATION_REQUIRED: Fixture pending purchase: wallet increases once; GameKey path unchanged.  
STATUS: OPEN  

---

ACTION_ID: SDEG-2026-09-02-005  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Do not wrap nextGameKeyRequestId onto existing gk_ keys  
CATEGORY: persist-schema  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `main.mo` still wraps `> 999_999_999` then `Map.add` can overwrite `gk_1`. Vehicle: #362.  
SYSTEMS_AFFECTED: `gameKeyRequests`; `nextGameKeyRequestId`  
RECOMMENDED_ACTION: Skip occupied ids (or stop wrapping). Do not reuse a redeemed request id.  
AUTONOMY: HUMAN  
DEPENDENCIES: None  
MIGRATION_REQUIREMENT: None if skip-occupied  
REGRESSION_RISK: LOW until 1e9 requests; HIGH if wrap hits a live row  
VALIDATION_REQUIRED: Seed `gk_1`, set counter to wrap, next request is not `gk_1`.  
STATUS: OPEN  

---

ACTION_ID: SDEG-2026-09-02-006  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Redeem GameKey must not be a confused-deputy credit if requester-only is the product rule  
CATEGORY: inventory  
PRIORITY: P2  
CONFIDENCE: MEDIUM  
EVIDENCE: `redeemGameKey` credits **caller**, not `userPrincipal` on the request.  
SYSTEMS_AFFECTED: `redeemGameKey`; `dokaBalances`; `gameKeyLedger`  
RECOMMENDED_ACTION: Human confirms gift-vs-payer. If payer-only: require `caller == rec.userPrincipal`.  
AUTONOMY: HUMAN  
DEPENDENCIES: None  
MIGRATION_REQUIREMENT: None  
REGRESSION_RISK: MEDIUM if gifts are intended  
VALIDATION_REQUIRED: Payer redeems → payer Doka += amount; second redeem `#err`.  
STATUS: OPEN  

---

ACTION_ID: SDEG-2026-09-25-001  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Version-gate must keep unpaid death, feat counters, shrine, and covenant  
CATEGORY: client-migration  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: HEAD `versionGate.ts` 7–12 keeps only spawn/levelup caches + `*_inventory`. `App.tsx` 297–317 wipe drops `pbv_pending_death_penalty_slotN`, maps-visited, shrine, covenant, spell_levels. Vehicles: #508 then #577.  
SYSTEMS_AFFECTED: `versionGate.ts`; `App.tsx`; death replay; explore/loot feats  
RECOMMENDED_ACTION: Union keep-list after #508. Do not persist those counters onto required Character fields.  
AUTONOMY: HUMAN  
DEPENDENCIES: #508; #577  
MIGRATION_REQUIREMENT: None (client keys)  
REGRESSION_RISK: MEDIUM if inventory is dropped  
VALIDATION_REQUIRED: Bump APP_VERSION with a pending death marker; replay still cuts.  
STATUS: OPEN  

---

ACTION_ID: SDEG-2026-09-26-001  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: isBuiltInSpellId must include live innates  
CATEGORY: content-id-stability  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `adminGuard.mo` 21–24 is six catalog ids only — omits `physical_attack` and `starter-*`. Vehicle: #622.  
SYSTEMS_AFFECTED: `adminGuard.mo`; spell delete/retire  
RECOMMENDED_ACTION: Treat live starters as built-in (retire, never delete).  
AUTONOMY: HUMAN  
DEPENDENCIES: None  
MIGRATION_REQUIREMENT: None  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Admin cannot delete `physical_attack`.  
STATUS: OPEN  

---

ACTION_ID: SDEG-2026-09-26-002  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Leaderboard must count unlocked feats, not only claimed  
CATEGORY: achievements  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `main.mo` 3415 counts `prog.claimed`. Vehicle: #622.  
SYSTEMS_AFFECTED: leaderboard query  
RECOMMENDED_ACTION: Count `unlocked`. Do not Number() hydrate kill/level off the persist path.  
AUTONOMY: HUMAN  
DEPENDENCIES: None  
MIGRATION_REQUIREMENT: None  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Unlock-unclaimed feat increments the board.  
STATUS: OPEN  

---

ACTION_ID: SDEG-2026-09-27-001  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Unpaid-death localStorage key must include principal and character identity  
CATEGORY: stale-client  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `pendingDeathPenaltyStorageKey` `deathPenalty.ts` 309–311 is slot-only. Official delete (`CharacterSelection.tsx` 871–879) does not clear it. Vehicle: #385 + #667.  
SYSTEMS_AFFECTED: `deathPenalty.ts`; delete character  
RECOMMENDED_ACTION: Key by principal + slot + character identity. Clear on official delete. Union both PRs.  
AUTONOMY: HUMAN  
DEPENDENCIES: #385; #667  
MIGRATION_REQUIREMENT: One-shot read of old slot-only key  
REGRESSION_RISK: HIGH if replay misses  
VALIDATION_REQUIRED: Account B cannot inherit account A’s pending cut; delete + recreate does not replay.  
STATUS: OPEN  

---

ACTION_ID: SDEG-2026-09-27-002  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Slot reuse must not inherit dungeonRecords, buffInventories, maps-visited, or spell_levels  
CATEGORY: progress-idempotency  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `deleteCharacter` (`main.mo` 450–492) clears the slot + Boss Rush only. `buffInventories` / `dungeonRecords` / achievementProgress survive. localStorage `${userId}_slotN_pbv_spell_levels` and maps-visited survive.  
SYSTEMS_AFFECTED: delete/create; dungeon; buffs; feats; spell hydrate  
RECOMMENDED_ACTION: Clear principal#slot side tables on delete. Do not read localStorage spell levels when canister keys are empty (10-22-003).  
AUTONOMY: HUMAN  
DEPENDENCIES: SDEG-001 for new maps  
MIGRATION_REQUIREMENT: Optional  
REGRESSION_RISK: MEDIUM  
VALIDATION_REQUIRED: Delete slot 1, create new character, maps-visited 0, no prior potions, no prior spell levels.  
STATUS: OPEN  

---

ACTION_ID: SDEG-2026-09-27-003  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Stop Number() hydrate of leftover XP/Doka before absolute writes  
CATEGORY: unbounded-progression  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `deepNormalizeBigInts` `normalizeBigInts.ts` 6–8. L48+ thresholds exceed `MAX_SAFE_INTEGER`; `saveBattleStats` min then permanently cuts.  
SYSTEMS_AFFECTED: character hydrate; death/heal persist  
RECOMMENDED_ACTION: Keep bigint through persist math. HUD may saturate.  
AUTONOMY: HUMAN  
DEPENDENCIES: None  
MIGRATION_REQUIREMENT: None  
REGRESSION_RISK: HIGH if HUD arithmetic mixes bigint  
VALIDATION_REQUIRED: Fixture leftover above MAX_SAFE_INTEGER round-trips.  
STATUS: OPEN  

---

ACTION_ID: SDEG-2026-09-28-001  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Canister changelog maps are unused; APP_VERSION wipe is the live client migration  
CATEGORY: client-migration  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `App.tsx` 14 / 297–317. `getChangelog` / `markChangelogShown` unused by App.  
SYSTEMS_AFFECTED: `App.tsx`; changelog stables  
RECOMMENDED_ACTION: Either wire changelog or document APP_VERSION as the only client migration and keep the keep-list honest (09-25-001).  
AUTONOMY: HUMAN  
DEPENDENCIES: None  
MIGRATION_REQUIREMENT: Do not delete changelog maps without a later file  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Version bump still re-logins; inventory kept.  
STATUS: OPEN  

---

ACTION_ID: SDEG-2026-09-28-002  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Leftover XP curve 100 * 2^(N-1) is persist semantics  
CATEGORY: unbounded-progression  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `applyRewards` `main.mo` 2126–2138; `xpCurve.ts` 3–5.  
SYSTEMS_AFFECTED: `applyRewards`; HUD  
RECOMMENDED_ACTION: Do not change the curve without a leftover conversion for every stored Character.  
AUTONOMY: HUMAN  
DEPENDENCIES: None  
MIGRATION_REQUIREMENT: YES if the curve changes  
REGRESSION_RISK: HIGH  
VALIDATION_REQUIRED: Level 5 leftover 50 still levels at the same threshold after deploy.  
STATUS: OPEN  

---

ACTION_ID: SDEG-2026-09-29-001  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: MAX_PERSISTED_AP/MP = 20 is a silent action-economy max  
CATEGORY: unbounded-progression  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `adminGuard.mo` 18–19, 649–665. Threshold 1 hits 20 at L12. Vehicle notes: #778.  
SYSTEMS_AFFECTED: `saveBattleStats`; live AP/MP  
RECOMMENDED_ACTION: Human picks a cap policy. Grandfather stored values; do not clip official growth silently.  
AUTONOMY: HUMAN  
DEPENDENCIES: None  
MIGRATION_REQUIREMENT: None if the cap stays; YES if stored AP must be rewritten  
REGRESSION_RISK: HIGH if the cap is removed without a mint guard  
VALIDATION_REQUIRED: L12+ official AP persists; L1 raw 20 cannot mint on a new row.  
STATUS: OPEN  

---

ACTION_ID: SDEG-2026-09-29-002  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Official killCount stays 0; do not wire additive saveKillCount without a generation  
CATEGORY: stale-client  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `saveKillCount` (`main.mo` 3078–3109) adds `kills` (cap 64 per call). `useSaveKillCount` has no component caller. Vehicle: #466 / #778.  
SYSTEMS_AFFECTED: CharacterStats.killCount; leaderboard  
RECOMMENDED_ACTION: Leave unwired, or replace with a generation/absolute writer.  
AUTONOMY: HUMAN  
DEPENDENCIES: SDEG-006 if wired  
MIGRATION_REQUIREMENT: None while unused  
REGRESSION_RISK: HIGH if wired additive  
VALIDATION_REQUIRED: Official play does not increment killCount.  
STATUS: OPEN  

---

ACTION_ID: SDEG-2026-09-29-003  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: saveCallerUserProfile is a full replace; uiLayout:"" wipes a newer HUD blob  
CATEGORY: stale-client  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `main.mo` 69–84 `userProfiles.add(caller, profile)` with no merge. `saveUserUiLayout` does merge (87–109). Vehicle: #778.  
SYSTEMS_AFFECTED: `userProfiles`; ProfileSetup  
RECOMMENDED_ACTION: Merge uiLayout when incoming is empty, or stop sending `""` from profile create.  
AUTONOMY: HUMAN  
DEPENDENCIES: None  
MIGRATION_REQUIREMENT: None  
REGRESSION_RISK: MEDIUM  
VALIDATION_REQUIRED: Rename after HUD save keeps the blob.  
STATUS: OPEN  

---

ACTION_ID: SDEG-2026-10-21-001  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Official dungeon chain is session refs; canister dungeonRecords is unused by live UI  
CATEGORY: progress-idempotency  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: No component calls `updateDungeonProgress` / `getDungeonRecord` outside bindgen/mocks.  
SYSTEMS_AFFECTED: dungeon chain; `dungeonRecords`  
RECOMMENDED_ACTION: Keep session-only until SDEG-007 is fixed. Do not “fix” by wiring the raw +1 method.  
AUTONOMY: HUMAN  
DEPENDENCIES: SDEG-2026-08-31-007  
MIGRATION_REQUIREMENT: YES if official persist is added  
REGRESSION_RISK: HIGH if the unused method is wired as-is  
VALIDATION_REQUIRED: Rest-exit still re-arms depth 1 from session refs.  
STATUS: OPEN  

---

ACTION_ID: SDEG-2026-10-21-002  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: SpellConfig.minLevel is not enforced at hydrate  
CATEGORY: spell-discovery  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `shouldIncludeBackendSpellInLibrary` does not read minLevel. Write-path gap is 10-22-002.  
SYSTEMS_AFFECTED: library hydrate; `void_collapse`  
RECOMMENDED_ACTION: Do not hide owned spells by minLevel. Gate first grant only (upgradeSpell).  
AUTONOMY: HUMAN  
DEPENDENCIES: SDEG-004  
MIGRATION_REQUIREMENT: None if write-path only  
REGRESSION_RISK: MEDIUM if hydrate hides owned ids  
VALIDATION_REQUIRED: L1 with void_collapse already in keys still sees it; L1 cannot newly buy it.  
STATUS: OPEN  

---

ACTION_ID: SDEG-2026-10-21-003  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Stored pixelPattern is catalog JSON, not combat art; sprite URLs stay optional  
CATEGORY: visuals  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Draw uses `pieceType` → `getPersistedPiecePattern`. Pass — keep.  
SYSTEMS_AFFECTED: Character.pixelPattern; playerSpriteConfigs  
RECOMMENDED_ACTION: Never make a URL required. Deleting a sprite config must not delete the Character.  
AUTONOMY: HUMAN  
DEPENDENCIES: None  
MIGRATION_REQUIREMENT: None  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Delete sprite config; existing characters still draw.  
STATUS: OPEN  

---

ACTION_ID: SDEG-2026-10-21-004  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Official Feats panel hides inactive unclaimed rows; claim API still pays current reward  
CATEGORY: achievements  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `AchievementsPanel.tsx` 191–194 filters `cfg.active`. Claim `main.mo` 2549–2550. Vehicle: #437.  
SYSTEMS_AFFECTED: Feats panel; `claimAchievementReward`  
RECOMMENDED_ACTION: Show unlocked-unclaimed retired rows. Snapshot reward at unlock.  
AUTONOMY: HUMAN  
DEPENDENCIES: SDEG-008  
MIGRATION_REQUIREMENT: Optional field  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Unlock, retire, Claim still visible and pays unlock-time amount.  
STATUS: OPEN  

---

## New (2026-10-22)

ACTION_ID: SDEG-2026-10-22-001  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Accept boss_defeated_* as a stable achievement condition prefix  
CATEGORY: achievements  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Victory emits `boss_defeated_${bossId}` via `bossDefeatAchievementCondition` (`victoryAchievements.ts` 43–47; helper `achievementConditionIds.ts`). `KNOWN_ACHIEVEMENT_CONDITIONS` / `adminGuard.knownAchievementCondition` (`adminSafety.ts` 306–327, `adminGuard.mo` 515–531) have no prefix. `defaultAchievements()` (`admin.mo` 309–326) seeds none. `checkAndFireAchievement` no-ops when no active config matches the condition (`WorldExploration.tsx` 2220–2223). Tests in `achievementConditionIds.test.ts` lock the gap.  
SYSTEMS_AFFECTED: Feats; boss ids; admin achievement allowlist  
RECOMMENDED_ACTION: Exact-match catalog plus `boss_defeated_` prefix in **both** `adminSafety.ts` and `adminGuard.mo` (keep `instant_win` rejected). Seed or let admin create per-boss feats. Persist a boss-id alias table before any rename. Do not add a required Character field. A player who already defeated the boss yesterday will not retroactively unlock unless a one-shot backfill runs.  
AUTONOMY: HUMAN  
DEPENDENCIES: None  
MIGRATION_REQUIREMENT: None for the prefix; YES (optional) for a boss-id alias map  
REGRESSION_RISK: MEDIUM if a free-form suffix can be seeded as a mint  
VALIDATION_REQUIRED: Admin creates `boss_defeated_starved_pawn`; next official kill unlocks once; `instant_win` still rejected; rename starved_pawn keeps ownership via alias.  
STATUS: NEW  

---

ACTION_ID: SDEG-2026-10-22-002  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Enforce SpellConfig.minLevel on upgradeSpell grant, not on owned hydrate  
CATEGORY: spell-discovery  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `upgradeSpell` (`main.mo` 1006–1014) checks catalog presence + retired/owned only. `minLevel` is OQL-exposed (`main.mo` 3690) and admin-capped at 999 (`adminGuard.mo` 411). Seed `void_collapse` is `minLevel = 30` (`admin.mo` 190). Distinct from hydrate-only 10-21-002. Vehicle overlap: #466.  
SYSTEMS_AFFECTED: `upgradeSpell`; spell ownership; `void_collapse`  
RECOMMENDED_ACTION: Reject first grant when `character.level < cfg.minLevel`. Already-owned ids must still upgrade if the player predates the minLevel (grandfather). Do not hide owned spells in the library.  
AUTONOMY: HUMAN  
DEPENDENCIES: #466 (union, do not clone)  
MIGRATION_REQUIREMENT: None if write-path only  
REGRESSION_RISK: MEDIUM if hydrate also gates  
VALIDATION_REQUIRED: L1 cannot newly buy void_collapse; L1 with the id already in keys can still upgrade; L30 can grant.  
STATUS: NEW  

---

ACTION_ID: SDEG-2026-10-22-003  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Empty canister spellLevelKeys must not resurrect slot-local spell levels  
CATEGORY: spell-discovery  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: WX `spellLevels` init (`WorldExploration.tsx` 3105–3128) uses canister arrays only when keys **and** values are non-empty, else reads `${userId}_slotN_pbv_spell_levels` (and migrates legacy `pbv_spell_levels`). `saveBattleStats` ignores spell arrays (`main.mo` 2007–2008, 2073–2075). Delete + recreate in the same slot with empty keys shows the previous occupant’s paid levels in UI only. Vehicle overlap: #388.  
SYSTEMS_AFFECTED: WX hydrate; localStorage; `upgradeSpell`  
RECOMMENDED_ACTION: When canister keys are empty, start at `{}` (starters at 0). Do not treat localStorage as authority. Clear the namespaced key on official delete (#667 union).  
AUTONOMY: HUMAN  
DEPENDENCIES: #388 (union; do not edit WorldExploration while combat PRs queue)  
MIGRATION_REQUIREMENT: None  
REGRESSION_RISK: MEDIUM if pre-canister local-only upgrades exist  
VALIDATION_REQUIRED: Upgrade, delete, recreate same slot → UI levels 0 until upgradeSpell; paid Doka not refunded (expected).  
STATUS: NEW  

---

ACTION_ID: SDEG-2026-10-22-004  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Remap BuffShop item ids/costs onto BUFF_CATALOG without dropping paid stacks  
CATEGORY: inventory  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Frontend `BUFF_ITEMS` (`BuffShop.tsx` 31–80): `greater_health_potion`/120, `battle_elixir`/80, `swift_boots`/90, `shield_charm`/100, `fury_potion`/150. Canister `BUFF_CATALOG` (`main.mo` 2772–2778): `greater_potion`/120, `battle_elixir`/200, `swift_boots`/80, `shield_charm`/150, `fury_potion`/100. `purchaseBuff` `#err` on unknown id (`main.mo` 2820–2821). Vehicle: #466.  
SYSTEMS_AFFECTED: BuffShop localStorage; `buffInventories`; consume (`itemShop.ts` `greater_health_potion`)  
RECOMMENDED_ACTION: Persist an alias table. One-shot remap `${principal}_inventory` keys `greater_health_potion` → `greater_potion`. Do not change costs under a player’s feet without a human. Official consume paths must understand both ids until remap completes.  
AUTONOMY: HUMAN  
DEPENDENCIES: SDEG-005; #466  
MIGRATION_REQUIREMENT: YES — idempotent key remap; replay must not drop stacks  
REGRESSION_RISK: HIGH if localStorage keys are renamed without copy  
VALIDATION_REQUIRED: Existing `greater_health_potion: 2` still heals twice after remap; canister purchaseBuff of `greater_potion` hydrates the same stack.  
STATUS: NEW  

---

ACTION_ID: SDEG-2026-10-22-005  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Cap purchaseBuff stacks; official UI still must not grow a parallel canister inventory  
CATEGORY: inventory  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `purchaseBuff` (`main.mo` 2846–2856) increments `Nat` with no max. Frontend `maxStack: 5` is local only. Official BuffShop never calls this method (SDEG-005).  
SYSTEMS_AFFECTED: `buffInventories`  
RECOMMENDED_ACTION: Reject quantity above a documented cap (match UI 5 or a higher raw-client cap). Do not wipe existing oversized stacks — grandfather.  
AUTONOMY: HUMAN  
DEPENDENCIES: SDEG-005 if official is wired  
MIGRATION_REQUIREMENT: None if write-path cap only  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Sixth purchaseBuff returns `#err`; existing qty 99 still usable.  
STATUS: NEW  

---

ACTION_ID: SDEG-2026-10-22-006  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Achievement progress is principal-scoped and survives character delete  
CATEGORY: progress-idempotency  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Progress key is `caller.toText() # "#" # achievementId` (`main.mo` 2495–2508). `deleteCharacter` does not touch `achievementProgress`. Account-level feats (`doka_1000`) should survive; `first_battle_win` / `pacifist_run` then belong to the next occupant of any slot.  
SYSTEMS_AFFECTED: Feats; slot reuse  
RECOMMENDED_ACTION: Human picks account-level vs slot-level. If slot-level: optional later map keyed `principal#slot#id` after SDEG-001, migrate existing rows onto slot 1. Do not wipe claimed flags (double-claim).  
AUTONOMY: HUMAN  
DEPENDENCIES: SDEG-001 if new map  
MIGRATION_REQUIREMENT: YES if key shape changes  
REGRESSION_RISK: HIGH if claimed flags are reset  
VALIDATION_REQUIRED: Delete + recreate still cannot reclaim Doka; first_battle_win policy matches the product choice.  
STATUS: NEW  

---

ACTION_ID: SDEG-2026-10-22-007  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: APP_VERSION wipe on HEAD drops the unpaid-death marker while the canister can stay uncut  
CATEGORY: client-migration  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `shouldPreserveVersionGateKey` does not match `pbv_pending_death_penalty_slotN` (`versionGate.ts` 7–12). Wipe (`App.tsx` 297–317) then reload. Death replay has nothing to apply. Vehicles: #508 (keep) + #385 (principal) + #667 (delete).  
SYSTEMS_AFFECTED: version gate; unpaid death  
RECOMMENDED_ACTION: Preserve the pending-death key across version bumps. Do not edit `versionGate.ts` / `App.tsx` in this PR — union after #508.  
AUTONOMY: HUMAN  
DEPENDENCIES: #508  
MIGRATION_REQUIREMENT: None  
REGRESSION_RISK: HIGH if the keep-list drops inventory  
VALIDATION_REQUIRED: Pending marker + APP_VERSION bump → replay still writes 20/40 once.  
STATUS: NEW  

---

ACTION_ID: SDEG-2026-10-22-008  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Persist path never raises atk/res/init and never writes evasion/sp/sr/resilience/chc after create  
CATEGORY: unbounded-progression  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `applyRewards` writes level/XP/Doka only (`main.mo` 2140–2151). `saveBattleStats` `atk = _minNat(attack, stored)` etc. (`main.mo` 2059–2067). `evasion`/`sp`/`sr`/`resilience`/`chc`/`killCount` are untouched on that path. Official combat uses stored atk for the whole career. Anti-mint is intentional; unbounded progression then silently assumes create-time offense stats.  
SYSTEMS_AFFECTED: CharacterStats; level-up; `saveBattleStats`  
RECOMMENDED_ACTION: Human picks: (a) keep frozen starter offense (document), or (b) grow atk/res/init through a dedicated applyRewards/level-up writer, never through absolute saveBattleStats. Do not let a stale client mint.  
AUTONOMY: HUMAN  
DEPENDENCIES: None  
MIGRATION_REQUIREMENT: YES if stored atk must be backfilled from level  
REGRESSION_RISK: HIGH if saveBattleStats starts taking max(incoming, stored)  
VALIDATION_REQUIRED: L1→L20 official atk either stays at create or grows only on the chosen writer; raw client cannot raise atk.  
STATUS: NEW  

---

ACTION_ID: SDEG-2026-10-22-009  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: getSessionState fabricates bloodBalance = 50 for null (latent)  
CATEGORY: persist-schema  
PRIORITY: P3  
CONFIDENCE: HIGH  
EVIDENCE: Create stores `bloodBalance = null` (`main.mo` 227). Query defaults null → 50 (`main.mo` 3231–3235). Official UI does not call `getSessionState`.  
SYSTEMS_AFFECTED: session API  
RECOMMENDED_ACTION: Default 0 / `""` / `[]` to match “feature never existed”. Do not wire official session writers until defaults are honest. Do not add required fields.  
AUTONOMY: HUMAN  
DEPENDENCIES: None  
MIGRATION_REQUIREMENT: None (query default only)  
REGRESSION_RISK: LOW while unused; MEDIUM if wired as 50-blood  
VALIDATION_REQUIRED: getSessionState on a yesterday character returns 0 blood, empty covenant, 0 shrine.  
STATUS: NEW  

---

ACTION_ID: SDEG-2026-10-22-010  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: upgradeSpell indexes spellLevelValues without a length guard  
CATEGORY: persist-schema  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `main.mo` 998–1001 `currentLevel := character.spellLevelValues[idx]` inside the keys loop. Keys longer than values → Motoko trap. Appearance keep-store prevents official mint of mismatched arrays; a historical raw client could still trap every upgrade.  
SYSTEMS_AFFECTED: `upgradeSpell`  
RECOMMENDED_ACTION: Treat missing values as 0. Do not truncate keys (that drops ownership).  
AUTONOMY: HUMAN  
DEPENDENCIES: None  
MIGRATION_REQUIREMENT: None if read defaults 0  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Fixture keys=["shadow_strike"] values=[] upgrades to level 1 without trap.  
STATUS: NEW  
