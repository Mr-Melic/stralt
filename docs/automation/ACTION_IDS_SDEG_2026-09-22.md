# ACTION_IDs — 2026-09-22 Save / Data Evolution Guardian

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Save/Data Evolution Guardian.  
Audit: [`DATA_EVOLUTION_AUDIT_2026-09-22.md`](./DATA_EVOLUTION_AUDIT_2026-09-22.md).  
Prior: `ACTION_IDS_SDEG_2026-09-21.md` (#362, still open — do not clone).  
Do not edit shipped `20260831` / `20260901` NewActor. New stables → `20260902+` with `OldActor = {}`.  
Do not edit `WorldExploration.tsx` while #327 / #331 are still open.  
Do not edit `main.mo` while older persist PRs (#356, #362, #375, #377, #385, #387, #391, …) are queued.

---

## Closed / landed on main since 2026-09-02 (not this run)

ACTION_ID: SDEG-2026-09-01-005  
STATUS: IMPLEMENTED  
EVIDENCE: `src/backend/migrations/20260901_000000.mo` GameKey empty maps; frozen `20260831` has no GameKey; `.old` = Caffeine Aug-31 import.

ACTION_ID: SDEG-2026-09-02-002  
STATUS: IMPLEMENTED  
EVIDENCE: Same as 09-01-005.

ACTION_ID: SDEG-2026-09-02-003  
STATUS: IMPLEMENTED  
EVIDENCE: `persistHpWriteCap` + `persistApWriteCap` / `persistMpWriteCap` in `adminGuard.mo`.

---

## Closed / landed this run (helpers only; Motoko still open)

ACTION_ID: SDEG-2026-09-22-002  
STATUS: IMPLEMENTED (TS contract). Motoko wire remains OPEN — see carry-forward note on this id.  
EVIDENCE: `filterSpellBarForPersist` / `filterSpellBarKeysOnly` in `spellCatalogEvolve.ts`; tests prove today’s `contains()` drops the official first-bar save when `spellLevelKeys` is `[]`.

ACTION_ID: SDEG-2026-09-21-002 (partial)  
STATUS: IMPLEMENTED (TS contract). WX wire remains OPEN.  
EVIDENCE: `shouldHidePurgedCatalogRow` ignores display name; `spell-inferno` / Inferno is not hidden.

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
EVIDENCE: `main.mo` 689–697 still `spellConfigs.remove`s `physical_attack` on every start. `LIVE_STARTER_IDS_IN_BOOT_PURGE` locks that hazard. WX 2356–2393 still hides by id **and name**.  
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
RECOMMENDED_ACTION: Stored ownership set with empty-keys = starters ∪ upgraded, not catalog-all. Do not add required fields until a later chain file. Use `filterSpellBarForPersist` when Motoko is free.  
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
EVIDENCE: `dungeonRecords` is Principal-keyed (`main.mo` 2894–2924). `updateDungeonProgress` always `totalMapsCompleted + 1`. Official frontend has **zero** call sites (bindgen/mocks only). Rush half landed.  
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
EVIDENCE: Soft-retire landed. `claimAchievementReward` still pays **current** `config.dokaReward` (`main.mo` 2549).  
SYSTEMS_AFFECTED: `achievementProgress`; `claimAchievementReward`  
RECOMMENDED_ACTION: Optional `dokaRewardAtUnlock : ?Nat`. Renames keep `id`.  
AUTONOMY: HUMAN  
DEPENDENCIES: None  
MIGRATION_REQUIREMENT: Optional field only (later chain file if stored on a new stable)  
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
EVIDENCE: `applyRewards` 2119–2120 still rejects `> 100_000` / `> 500_000`. `clampApplyRewardsDeltas` still truncates.  
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
EVIDENCE: On **main**, `victoryResourceFloor` is still `50 + level*10` (`deathPenalty.ts` 151). Linear persist max at 5% is `100 + (level-1)*5`. At level 10: 150 vs 145. Vehicle **#386** caps the floor.  
SYSTEMS_AFFECTED: `saveBattleStats`; post-battle hydrate; `deathPenalty.ts`  
RECOMMENDED_ACTION: Merge **#386** (union with #385 owner-key helpers). Do not clone. Do not raise the raw-client cap to `level*200+100` again.  
AUTONOMY: HUMAN (#386)  
DEPENDENCIES: #385 file union on `deathPenalty.ts`  
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
EVIDENCE: `initiatePurchase` still `#err`. `processPendingPurchases` returns 0 (`main.mo` 1338).  
SYSTEMS_AFFECTED: `purchaseRecords`; admin Doka grant; Buy Doka UI  
RECOMMENDED_ACTION: Admin cohort: pending rows → grant via `adminAddDokaToUser` or mark rejected. Do not re-enable 60s auto-complete. Do not delete the map without a later migration file.  
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
EVIDENCE: `main.mo` 1439–1442 still wraps `> 999_999_999` to 1 then `add`s. Vehicle **#362**.  
SYSTEMS_AFFECTED: `gameKeyRequests`; `nextGameKeyRequestId`  
RECOMMENDED_ACTION: Merge **#362**. Do not clone.  
AUTONOMY: HUMAN (#362)  
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
EVIDENCE: `redeemGameKey` still credits **caller**, not `userPrincipal` on the request (`main.mo` 1468–1516).  
SYSTEMS_AFFECTED: `redeemGameKey`; `dokaBalances`; `gameKeyLedger`  
RECOMMENDED_ACTION: Human confirms gift-vs-payer. If payer-only: require `caller == rec.userPrincipal`. Do not change without product sign-off.  
AUTONOMY: HUMAN  
DEPENDENCIES: None  
MIGRATION_REQUIREMENT: None  
REGRESSION_RISK: MEDIUM if gifts are intended  
VALIDATION_REQUIRED: Payer redeems → payer Doka += amount; second redeem `#err`.  
STATUS: OPEN  

---

ACTION_ID: SDEG-2026-09-21-001  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Ignore stale saveActiveSpells Nat indices; spellBarOrder remains the loadout  
CATEGORY: stale-client  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Official WX comment ~2830: `saveActiveSpells(BigInt[])` removed. Endpoint still writes `activeSpells : ?[Nat]` (`main.mo` 3172–3206). Vehicle **#362** keep-stores.  
SYSTEMS_AFFECTED: `saveActiveSpells`; `Character.activeSpells`; `setSpellBarOrder`  
RECOMMENDED_ACTION: Merge **#362**. Do not delete the optional field (M0169) without a later consumer.  
AUTONOMY: HUMAN (#362)  
DEPENDENCIES: None  
MIGRATION_REQUIREMENT: None (behavior-only; leftover optional field kept)  
REGRESSION_RISK: LOW — official client does not call this method  
VALIDATION_REQUIRED: `pnpm typecheck` / `pnpm check`; Motoko `mops check`  
STATUS: OPEN  

---

ACTION_ID: SDEG-2026-09-21-002  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Stop hiding live spells by display name in OLD_SPELL_NAMES_SET  
CATEGORY: content-id-stability  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `WorldExploration.tsx` 2356–2393 filters with `OLD_SPELL_NAMES_SET.has(s.name)`. Live `spell-inferno` name is `Inferno` (`spellData.ts` 502–503). Helper `shouldHidePurgedCatalogRow` landed this run (id only).  
SYSTEMS_AFFECTED: `WorldExploration.tsx` ownedSpells / spellPool; future catalog  
RECOMMENDED_ACTION: After #327/#331, filter purged **ids** only via `shouldHidePurgedCatalogRow`. Do not match display names.  
AUTONOMY: HUMAN  
DEPENDENCIES: #327; #331  
MIGRATION_REQUIREMENT: None  
REGRESSION_RISK: LOW if Motoko boot purge already removed old ids; MEDIUM if a stale canister still has `inferno` as a backend row that should stay hidden  
VALIDATION_REQUIRED: Backend spell named Inferno with id `spell-inferno` remains in the library; `fireball` id still hidden.  
STATUS: OPEN  

---

ACTION_ID: SDEG-2026-09-21-003  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Persist AP/MP hard-cap of 20 silently freezes growth for high-level players  
CATEGORY: unbounded-progression  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `AdminGuard.MAX_PERSISTED_AP` / `MAX_PERSISTED_MP` = 20 (`adminGuard.mo` 18–19, 649–665). Official formula is `PLAYER_BASE_AP + floor(level / threshold)`.  
SYSTEMS_AFFECTED: `saveBattleStats`; `persistApWriteCap`; HUD AP/MP  
RECOMMENDED_ACTION: Human picks: raise/remove the persist cap (keep anti-mint vs starter 10 / old flat-20), or accept AP/MP freeze as content. Do not clip grandfathered rows.  
AUTONOMY: HUMAN  
DEPENDENCIES: None  
MIGRATION_REQUIREMENT: None if cap is raised; stored values already grandfather  
REGRESSION_RISK: MEDIUM if the cap is removed without another raw-client bound  
VALIDATION_REQUIRED: Level 400 persist AP follows the formula; level-1 raw 20 still cannot mint on a new row with stored 8.  
STATUS: OPEN  

---

ACTION_ID: SDEG-2026-09-21-004  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: applyRewards pow2(level) is O(level) and can instruction-limit-trap extreme Nat levels  
CATEGORY: unbounded-progression  
PRIORITY: P2  
CONFIDENCE: MEDIUM  
EVIDENCE: `applyRewards` computes `100 * 2^(level-1)` with a `while` multiply (`main.mo` 2129) on **every** credit. Helper `leftoverXpCannotAffordNextLevel` landed this run. Motoko still always builds the power.  
SYSTEMS_AFFECTED: `applyRewards`  
RECOMMENDED_ACTION: Short-circuit when leftover XP is below 100 (`leftoverXpCannotAffordNextLevel`), or abort doubling once `need > newXp`. Do not change the curve. Do not edit `main.mo` until older persist PRs merge.  
AUTONOMY: HUMAN  
DEPENDENCIES: None  
MIGRATION_REQUIREMENT: None  
REGRESSION_RISK: HIGH if the short-circuit mis-compares and skips a real level-up  
VALIDATION_REQUIRED: Level 1 + 500_000 XP still levels the same number of times; level 1000 + 0 XP returns immediately.  
STATUS: OPEN  

---

## New (2026-09-22)

ACTION_ID: SDEG-2026-09-22-001  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Battle-init compounding HP exceeds linear persist cap from level 10  
CATEGORY: unbounded-progression  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `getPlayerBaseStats` uses `Math.round(100 * (1 + growth/100)^(level-1))` (`progression.ts` 77–80), wired in WorldExploration battle init. Persist `maxPersistedHp` is `100 + (level-1)*growth` (`adminGuard.mo` 631–634). HUD `maxHp` useMemo in WX 3400–3405 uses the **linear** form. At 5% / level 10: compounding **155** vs persist **145**. `compoundingHpExceedsPersistCap(10, 5) === true` (`spellCatalogEvolve.test.ts`). Distinct from victory-floor 150 vs 145 (09-02-001 / #386).  
SYSTEMS_AFFECTED: `engine/progression.ts`; WX battle init vs `saveBattleStats`; `maxPersistedHp`  
RECOMMENDED_ACTION: Human picks one HP curve. Do not silently clip battle-init HP on persist. Do not raise the persist cap to compounding without an anti-mint bound. Do not change combat math in an SDEG PR.  
AUTONOMY: HUMAN  
DEPENDENCIES: None (do not edit WX while #327/#331 are open)  
MIGRATION_REQUIREMENT: None if battle-init is lowered to linear; YES if stored HP must be rewritten to compounding  
REGRESSION_RISK: HIGH if compounding is persisted without a raw-client bound (old `level*200+100` class)  
VALIDATION_REQUIRED: Level-10 battle max HP equals persist write cap; level-1 raw 300 still cannot mint on a new row.  
STATUS: NEW  

---

ACTION_ID: SDEG-2026-09-22-002  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Empty spellLevelKeys must not drop starter ids from setSpellBarOrder  
CATEGORY: spell-discovery  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `_starterCharacter` writes `spellLevelKeys = []` (`main.mo` 225–226). `setSpellBarOrder` filters with `character.spellLevelKeys.contains(id)` (`main.mo` 1945–1947). Official first-bar save of starters therefore persists `[]`. WX re-derives from catalog-all `ownedSpells` each session (`WorldExploration.tsx` 2580–2628). `filterSpellBarKeysOnly(first8, []) === []`; `filterSpellBarForPersist(first8, [], starters) === first8`. Future `ownedSpellIds` cannot use an empty persisted bar as “player chose nothing”.  
SYSTEMS_AFFECTED: `setSpellBarOrder`; Character create; future discovery  
RECOMMENDED_ACTION: When Motoko is free, keep official starters when keys are empty (`filterSpellBarForPersist`). Do not treat empty keys as “owns the whole catalog”. Do not add required fields.  
AUTONOMY: IMPLEMENT (TS contract this run) / HUMAN (Motoko wire)  
DEPENDENCIES: Do not edit `main.mo` until older persist PRs merge  
MIGRATION_REQUIREMENT: None if Motoko filter grows to allow starters; empty bars already stored stay empty until the client saves again  
REGRESSION_RISK: LOW for starter keep; MEDIUM if empty keys start allowing arbitrary catalog ids  
VALIDATION_REQUIRED: Create character, first bar save, `getCharacter.spellBarOrder` includes `physical_attack`; `void_collapse` still dropped until paid.  
STATUS: NEW  

---

ACTION_ID: SDEG-2026-09-22-003  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Do not hydrate combat spell levels from localStorage when canister arrays are empty  
CATEGORY: stale-client  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: WX `useState` initializer (`WorldExploration.tsx` 3105–3132): empty `spellLevelKeys` falls through to `{userId}_slotN_pbv_spell_levels` and leftover `pbv_spell_levels`. Create and delete+recreate on the same slot have empty arrays. `saveBattleStats` ignores the arrays, so the ghost never lands on the canister, but `calcScaledDamage` uses 1.03^N. Vehicle **#388** (`spellLevelsFromCharacterRecord`).  
SYSTEMS_AFFECTED: WX spellLevels state; `upgradeSpell` cost display vs canister  
RECOMMENDED_ACTION: Merge **#388**. Do not clone. Do not edit WX while #327/#331 are queued unless unioned.  
AUTONOMY: HUMAN (#388)  
DEPENDENCIES: #327; #331 (WX overlap)  
MIGRATION_REQUIREMENT: None  
REGRESSION_RISK: LOW — official paid levels remain on canister arrays  
VALIDATION_REQUIRED: Empty keys → `{}` levels; keys `["starter-heal"]` / values `[5n]` → `{ "starter-heal": 5 }`; slot recreate does not inherit the previous occupant’s cache.  
STATUS: NEW  

---

ACTION_ID: SDEG-2026-09-22-004  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Persisted atk/res/sp/sr/init/chc/evasion/resilience never grow with level  
CATEGORY: unbounded-progression  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `saveBattleStats` writes HP/AP/MP (capped) and `min`s incoming atk/res/init against **stored** (`main.mo` 2059–2067). It does not accept evasion/sp/sr/chc/resilience at all. `updateCharacter` keep-stores `ec.stats`. `applyRewards` only touches XP/level/Doka. Combat uses `characterStats.sp` / `res` / `chc` / `init` (WX 3320, 3429, 9158, 11948). Enemies scale with `getEnemyHPForLevel`; these player axes stay at create (starter atk 15, sp 8, …). This is not a stored max **level**, but it is a silent max **combat stat**.  
SYSTEMS_AFFECTED: CharacterStats persist; combat modifiers; long-horizon players  
RECOMMENDED_ACTION: Human picks: formula-on-read for those axes (like HP), or a dedicated grow writer. Do not let `saveBattleStats` mint them from a raw client. Do not change damage math in an SDEG PR.  
AUTONOMY: HUMAN  
DEPENDENCIES: None  
MIGRATION_REQUIREMENT: None if formula-on-read; YES if stored values must be rewritten  
REGRESSION_RISK: HIGH if a grow writer accepts client atk without a cap  
VALIDATION_REQUIRED: Level 40 official combat SP/RES match the chosen formula; level-1 raw atk 999 still cannot persist.  
STATUS: NEW  

---

ACTION_ID: SDEG-2026-09-22-005  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Unpaid death 20/40 localStorage is slot-only and can tax a later principal  
CATEGORY: stale-client  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `pbv_pending_death_penalty_slotN` is not principal-scoped on **main**. After a failed `saveBattleStats`, replay compares canister XP and can cut a richer wallet on the same browser (`AGENTS.md` unpaid death). Vehicle **#385** (unioned into **#386**).  
SYSTEMS_AFFECTED: `deathPenalty.ts`; App identity change; `saveBattleStats`  
RECOMMENDED_ACTION: Merge **#385** / **#386**. Do not clone.  
AUTONOMY: HUMAN (#385)  
DEPENDENCIES: #386 file union on `deathPenalty.ts`  
MIGRATION_REQUIREMENT: None (cache key rename; leftover slot-only keys must be cleared on logout)  
REGRESSION_RISK: MEDIUM if legacy slot-only keys still replay after logout  
VALIDATION_REQUIRED: Principal A pending, logout, principal B same slot is not cut; A reload still replays.  
STATUS: NEW  
