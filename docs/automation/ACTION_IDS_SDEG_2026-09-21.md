# ACTION_IDs — 2026-09-21 Save / Data Evolution Guardian

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Save/Data Evolution Guardian.  
Audit: [`DATA_EVOLUTION_AUDIT_2026-09-21.md`](./DATA_EVOLUTION_AUDIT_2026-09-21.md).  
Prior: `ACTION_IDS_SDEG_2026-09-02.md`.  
Do not edit shipped `20260831` / `20260901` NewActor. New stables → `20260902+` with `OldActor = {}`.  
Do not edit `WorldExploration.tsx` while #327 / #331 are still open.

---

## Closed / landed since 2026-09-02

ACTION_ID: SDEG-2026-09-01-005  
STATUS: IMPLEMENTED  
EVIDENCE: `src/backend/migrations/20260901_000000.mo` GameKey empty maps; frozen `20260831` has no GameKey; `.old` = Caffeine Aug-31 import. Merged via the EOP series (#259 shape on main, then #311/#324).

ACTION_ID: SDEG-2026-09-02-002  
STATUS: IMPLEMENTED  
EVIDENCE: Same as 09-01-005. Do not re-file.

ACTION_ID: SDEG-2026-09-02-003  
STATUS: IMPLEMENTED  
EVIDENCE: `persistHpWriteCap` still in `adminGuard.mo` 640–643 and `saveBattleStats` 2041. AP/MP grandfather added later (`persistApWriteCap` 656–670).

ACTION_ID: SDEG-2026-09-02-005  
STATUS: IMPLEMENTED  
EVIDENCE: This run. `requestGameKeyPurchase` `main.mo` 1439–1449; `GameKey.bumpRequestSerial` / `requestId`; `nextGameKeyRequestSerial` tests (`dokaGameKey.security.test.ts` 54–69).

ACTION_ID: SDEG-2026-09-21-001  
STATUS: IMPLEMENTED  
EVIDENCE: This run. `saveActiveSpells` `main.mo` 3176–3208 keep-store.

---

## Carry-forward (still OPEN)

ACTION_ID: SDEG-2026-08-31-001  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Do not add required persist fields without a later chain file after 20260901  
CATEGORY: persist-schema  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `src/backend/main.mo` line 44 is still `actor {`. mops injects the five-file chain (`mops.toml` check-limit 5). GameKey is already on `20260901`. A required Character/stats field still needs `20260902+` with `OldActor = {}`.  
SYSTEMS_AFFECTED: `src/backend/main.mo`; `src/backend/migrations/*`; `mops.toml`  
RECOMMENDED_ACTION: Keep live `actor {`. First wired module that rewrites player maps must copy every map. Do not deploy `backend_extended`.  
AUTONOMY: HUMAN  
DEPENDENCIES: SDEG-2026-08-31-002  
MIGRATION_REQUIREMENT: YES  
REGRESSION_RISK: HIGH  
VALIDATION_REQUIRED: `bash scripts/caffeine-import-gate.sh backend`; fixture principal still loads.  
STATUS: OPEN  

---

ACTION_ID: SDEG-2026-08-31-002  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Diff live stables against frozen NewActor lists before any player-map rewrite  
CATEGORY: persist-schema  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `snapshots/frozen-newactor-fields.json` lists 20260831 (spellConfigs + rollback + audit) and 20260901 (GameKey only). Live actor has those plus the 20260827 pass-through maps.  
SYSTEMS_AFFECTED: `src/backend/migrations/*`  
RECOMMENDED_ACTION: Never edit a shipped NewActor. Next persist field → new later file.  
AUTONOMY: HUMAN  
DEPENDENCIES: SDEG-2026-08-31-001  
MIGRATION_REQUIREMENT: YES  
REGRESSION_RISK: HIGH  
VALIDATION_REQUIRED: `python3 scripts/check-eop-stables.py`; summon spells and GameKey rows round-trip.  
STATUS: OPEN  

---

ACTION_ID: SDEG-2026-08-31-003  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Stop the every-upgrade OLD_SPELL_IDS purge; remap ownership instead  
CATEGORY: content-id-stability  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `main.mo` 689–697 still `spellConfigs.remove`s `physical_attack` on every start. `WorldExploration.tsx` 2356–2393 still hides by id **and name**. Live starter `spell-inferno` is named `Inferno` (`spellData.ts` 502–503).  
SYSTEMS_AFFECTED: `main.mo`; `WorldExploration.tsx`; `upgradeSpell`; `spellLevelKeys`  
RECOMMENDED_ACTION: One-shot `oldSpellIdsPurged` after SDEG-001. Persist `oldId → newId`. Never delete `physical_attack` while it is a starter. Name-filter fix is SDEG-2026-09-21-002 (do not edit WX until #327/#331 merge).  
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
EVIDENCE: `shouldIncludeBackendSpellInLibrary` still true unless retired (`adminSafety.ts` 712–718). `upgradeSpell` still appends any usable catalog id (`main.mo` ~1036–1040). `setSpellBarOrder` still filters to `spellLevelKeys` only. `_starterCharacter` still stores empty keys.  
SYSTEMS_AFFECTED: Character; `upgradeSpell`; starters; future discovery  
RECOMMENDED_ACTION: Stored ownership set with empty-keys = starters ∪ upgraded, not catalog-all. Do not add required fields until a later chain file.  
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
EVIDENCE: `BuffShop.tsx` 85–95 still `${principalId}_inventory`. Canister `buffInventories` / `purchaseBuff` / `useBuffItem` unused by that UI.  
SYSTEMS_AFFECTED: `BuffShop.tsx`; `buffInventories`; `versionGate.ts`  
RECOMMENDED_ACTION: Buy/use through canister APIs on `createProgressPersist`. Copy localStorage into empty canister slots once.  
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
EVIDENCE: `writeGeneration` still grep-empty outside docs. `saveBattleStats` still `min`s incoming Doka/XP so a stale heal after `applyRewards` can cut leftover.  
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
EVIDENCE: `dungeonRecords` is Principal-keyed (`main.mo` 2911–2925). `updateDungeonProgress` always `totalMapsCompleted + 1`. Official frontend has **zero** call sites (bindgen/mocks only). Rush half landed.  
SYSTEMS_AFFECTED: `dungeonRecords`; `updateDungeonProgress`  
RECOMMENDED_ACTION: Key by `principal#slot` (migrate Principal-only onto slot 1). Increment maps only when `depth` increases.  
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
EVIDENCE: Soft-retire landed. `claimAchievementReward` still pays **current** `config.dokaReward` (`main.mo` 2555–2556).  
SYSTEMS_AFFECTED: `achievementProgress`; `claimAchievementReward`  
RECOMMENDED_ACTION: Optional `dokaRewardAtUnlock : ?Nat`. Renames keep `id`.  
AUTONOMY: HUMAN  
DEPENDENCIES: None  
MIGRATION_REQUIREMENT: Optional field only (later chain file if stored on a new stable; Character-adjacent progress map can grow with defaults)  
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
EVIDENCE: `dfx.json` still points at missing/stale `src/backend_extended/main.mo`. Live CharacterStats is 12 fields (`main.mo` 147–160).  
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
EVIDENCE: `applyRewards` 2125–2126 still rejects `> 100_000` / `> 500_000`. `clampApplyRewardsDeltas` still truncates. `longHorizonSim.test.ts` still asserts jackpot / stacked XP overflow.  
SYSTEMS_AFFECTED: `applyRewards`; recap advertised vs committed  
RECOMMENDED_ACTION: Official payouts must persist in full. Recap must not advertise more than committed. Do not lower the victory band without a human.  
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
EVIDENCE: `victoryResourceFloor` / `victoryHpFloor` is `50 + level*10`. Linear persist max at 5% is `100 + (level-1)*5`. At level 10: 150 vs 145. `longHorizonSim.test.ts` 48 still asserts the clash. Grandfather only helps when **stored** already exceeds the cap.  
SYSTEMS_AFFECTED: `saveBattleStats`; post-battle hydrate; `deathPenalty.ts`  
RECOMMENDED_ACTION: Human picks one formula. Do not silently cut official victory HP. Do not raise the raw-client cap to `level*200+100` again.  
AUTONOMY: HUMAN  
DEPENDENCIES: None  
MIGRATION_REQUIREMENT: None if victory floor is lowered; YES if stored HP must be rewritten  
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
EVIDENCE: `initiatePurchase` still `#err`. `processPendingPurchases` returns 0 (`main.mo` 1338). A player with `status=pending` from the KYC flow never receives Doka unless `adminAddDokaToUser`. GameKey path is live.  
SYSTEMS_AFFECTED: `purchaseRecords`; admin Doka grant; Buy Doka UI  
RECOMMENDED_ACTION: Admin cohort: pending rows → grant via `adminAddDokaToUser` or mark rejected. Do not re-enable 60s auto-complete. Do not delete the map without a later migration file.  
AUTONOMY: HUMAN  
DEPENDENCIES: None (GameKey is deployed in source)  
MIGRATION_REQUIREMENT: No schema; operational backfill  
REGRESSION_RISK: MEDIUM if pending rows are double-credited  
VALIDATION_REQUIRED: Fixture pending purchase: wallet increases once; GameKey path unchanged.  
STATUS: OPEN  

---

ACTION_ID: SDEG-2026-09-02-006  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Redeem GameKey must not be a confused-deputy credit if requester-only is the product rule  
CATEGORY: inventory  
PRIORITY: P2  
CONFIDENCE: MEDIUM  
EVIDENCE: `redeemGameKey` still credits **caller**, not `userPrincipal` on the request (`main.mo` ~1474). Ledger marks redeemed.  
SYSTEMS_AFFECTED: `redeemGameKey`; `dokaBalances`; `gameKeyLedger`  
RECOMMENDED_ACTION: Human confirms gift-vs-payer. If payer-only: require `caller == rec.userPrincipal`. Do not change without product sign-off.  
AUTONOMY: HUMAN  
DEPENDENCIES: None  
MIGRATION_REQUIREMENT: None  
REGRESSION_RISK: MEDIUM if gifts are intended  
VALIDATION_REQUIRED: Payer redeems → payer Doka += amount; second redeem `#err`.  
STATUS: OPEN  

---

## New (2026-09-21)

ACTION_ID: SDEG-2026-09-21-001  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Ignore stale saveActiveSpells Nat indices; spellBarOrder remains the loadout  
CATEGORY: stale-client  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Official WX comment ~2830: `saveActiveSpells(BigInt[])` removed from the client. Endpoint still wrote `activeSpells : ?[Nat]` (`main.mo` previously 3172–3207). Catalog order is not a stable spell id. This run keep-stores (auth/slot/size checks, no write). Do **not** delete the optional field (M0169) without a later consumer.  
SYSTEMS_AFFECTED: `saveActiveSpells`; `Character.activeSpells`; `setSpellBarOrder`  
RECOMMENDED_ACTION: Landed this run. Future discovery must key ids as Text.  
AUTONOMY: IMPLEMENT  
DEPENDENCIES: None  
MIGRATION_REQUIREMENT: None (behavior-only; leftover optional field kept)  
REGRESSION_RISK: LOW — official client does not call this method  
VALIDATION_REQUIRED: `pnpm typecheck` / `pnpm check`; Motoko `mops check`  
STATUS: NEW  

---

ACTION_ID: SDEG-2026-09-21-002  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Stop hiding live spells by display name in OLD_SPELL_NAMES_SET  
CATEGORY: content-id-stability  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `WorldExploration.tsx` 2356–2393 filters `backendSpells` and fallback `starterSpells` with `OLD_SPELL_NAMES_SET.has(s.name)`. Live `spell-inferno` name is `Inferno` (`spellData.ts` 502–503). Player library still sees it via `baseSpells`; `filteredBackendSpells` / `spellPool` would drop a backend row with that name. A rename of any current id to `Heal` / `Fireball` / `Inferno` would hide it.  
SYSTEMS_AFFECTED: `WorldExploration.tsx` ownedSpells / spellPool; future catalog  
RECOMMENDED_ACTION: Filter purged **ids** only. Do not match display names. Restack onto #327/#331 (both edit WX); do not land a third WX patch while those are open.  
AUTONOMY: HUMAN  
DEPENDENCIES: #327; #331  
MIGRATION_REQUIREMENT: None  
REGRESSION_RISK: LOW if Motoko boot purge already removed old ids; MEDIUM if a stale canister still has `inferno` as a backend row that should stay hidden  
VALIDATION_REQUIRED: Backend spell named Inferno with id `spell-inferno` remains in the library; `fireball` id still hidden.  
STATUS: NEW  

---

ACTION_ID: SDEG-2026-09-21-003  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Persist AP/MP hard-cap of 20 silently freezes growth for high-level players  
CATEGORY: unbounded-progression  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `AdminGuard.MAX_PERSISTED_AP` / `MAX_PERSISTED_MP` = 20 (`adminGuard.mo` 18–19, 649–665). Official formula is `PLAYER_BASE_AP + floor(level / threshold)`. `longHorizonSim.test.ts` 49: `formulaAp(325) > 20`. Grandfather keeps stored >20; **new** writes cannot grow past 20. This is a silent level ceiling in the persist model.  
SYSTEMS_AFFECTED: `saveBattleStats`; `persistApWriteCap`; HUD AP/MP  
RECOMMENDED_ACTION: Human picks: raise/remove the persist cap (keep anti-mint vs starter 10 / old flat-20), or accept AP/MP freeze as content. Do not clip grandfathered rows.  
AUTONOMY: HUMAN  
DEPENDENCIES: None  
MIGRATION_REQUIREMENT: None if cap is raised; stored values already grandfather  
REGRESSION_RISK: MEDIUM if the cap is removed without another raw-client bound  
VALIDATION_REQUIRED: Level 400 persist AP follows the formula; level-1 raw 20 still cannot mint on a new row with stored 8.  
STATUS: NEW  

---

ACTION_ID: SDEG-2026-09-21-004  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: applyRewards pow2(level) is O(level) and can instruction-limit-trap extreme Nat levels  
CATEGORY: unbounded-progression  
PRIORITY: P2  
CONFIDENCE: MEDIUM  
EVIDENCE: `applyRewards` computes `100 * 2^(level-1)` with a `while` multiply (`main.mo` 2135) on **every** credit, including when leftover XP cannot afford the next level. Frontend `applyXpDelta` caps steps at 100_000. Motoko Nat itself is unbounded.  
SYSTEMS_AFFECTED: `applyRewards`  
RECOMMENDED_ACTION: Short-circuit when leftover XP is below 100, or compare bit-length of `xp/100` to `level-1` before building the full power. Do not change the curve.  
AUTONOMY: HUMAN  
DEPENDENCIES: None  
MIGRATION_REQUIREMENT: None  
REGRESSION_RISK: HIGH if the short-circuit mis-compares and skips a real level-up  
VALIDATION_REQUIRED: Level 1 + 500_000 XP still levels the same number of times; level 1000 + 0 XP returns immediately.  
STATUS: NEW  
