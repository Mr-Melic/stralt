# ACTION_IDs — 2026-09-22 World, Dungeon & Encounter Admin Designer

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: World, Dungeon & Encounter Admin Designer.  
Design contract: [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-22.md`](./WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-22.md).  
Prior IDs (still `NEW`, do not re-issue): `WDEAD-2026-08-31-001` … `015` (013 PARTIAL — `dungeonDokaMultiplierFor` unified, depth-5 freeze remains), `WDEAD-2026-09-01-001` … `010`, `WDEAD-2026-09-02-001` … `008`, `WDEAD-2026-09-21-001` … `007` (queued [PR #337](https://github.com/Mr-Melic/stralt/pull/337)).  
Siblings to consume, not duplicate: `WDD-2026-08-31-001`, `WDD-2026-09-01-001`, `WDD-2026-09-02-001`, `WDD-2026-09-21-001`, `EED-2026-09-21-001`, `FSN-*` drop 4, elite wave 4 (#349), Rush Table C (#367), `LHIPS-*`, `EBA-*`, `AFDA-*`.

This run ships **docs only**. Do not implement production, RAF, map generation, turn, or damage-math code from this file unless a later human or orchestrator picks an ID.

HEAD audited: `0f5363f` (unchanged since 2026-09-21). Live spawn/admin gaps from 09-21 still hold. New IDs cover queued catalogs and the family-HP wipe 09-21 did not file.

Queued older siblings (do not duplicate): #334 `AFDA-2026-09-21-026` (Tiers leftover / unused Rush multiplier **copy**). #337 09-21 WDEAD IDs.

---

ACTION_ID: WDEAD-2026-09-22-001  
SOURCE_AUTOMATION: World, Dungeon & Encounter Admin Designer  
TITLE: Owner enabledWaves must include wave 4; one roll budget — do not ship WDD dual-roll as admin policy  
CATEGORY: world-events  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: On main, `CatalogWave = 1 | 2 | 3` and `LATEST_CATALOG_WAVE = 3` (`worldFeatures.ts` 64, 115). Catalog is 52 `WF-*` ids. `pickWeightedFeatures` mixes all waves into `MAX_ROLLED_FEATURES = 3`. WX does not import `worldFeatures`. `docs/WORLD_DYNAMICS.md` still requires the 22 live modifiers (`EXISTING_MAP_MODIFIER_IDS`, `worldFeatures.ts` 1890–1913) to roll on their own two-roll. Queued #344 (`WDD-2026-09-21-001`) extends the **same** array to wave 4 (`CatalogWave` `1|2|3|4`, `LATEST_CATALOG_WAVE = 4`, 16 new ids including `WF-PRT-WAGER_GATE`, `WF-INV-PHALANX_LINE`, `WF-SPL-ECHO_SCRIBE`). `WDEAD-2026-09-21-001` asked for owner waves `{1,2,3}` when wave 4 did not exist. Do not fork a fifth array.  
SYSTEMS_AFFECTED: `worldFeatures.ts` picker inputs; Admin World Events; future pack; live `mapModifiers.ts` two-roll. Not `mapGen.ts`.  
RECOMMENDED_ACTION: Pack fields `enabledWaves` (any non-empty subset of `{1,2,3,4}` after #344 lands) and a single `worldEventCatalog` that includes `WF-*` and the 22 modifier ids. Owner sets rarity, eligibility, slot, and whether a wave is in the mix. One roll budget per map after ACTIVATE. Until then, do not overlay wave 4. Sim reports `catalogWave` histogram including 4. Death Realm default remains []. Rest / deathRealm enum stays `WDEAD-2026-09-01-010`. Wager Gate / Latch Gate / Flicker / Echo / Pilgrim stay exploration-only. Placement remains post-`finalizePlayableLayout` (WDD). Prefer DRAFT → SIMULATE → VALIDATE → ACTIVATE.  
AUTONOMY: HUMAN_APPROVE — live modifier odds are player-facing.  
DEPENDENCIES: WDEAD-2026-09-21-001; WDEAD-2026-09-02-003; WDEAD-2026-09-01-003; WDEAD-2026-08-31-004; WDEAD-2026-08-31-009; WDD-2026-09-21-001; WDD-2026-09-02-001  
REGRESSION_RISK: HIGH if both rolls stay independent after “wiring wave 4.” HIGH if enabling only wave 4 silently drops the 22 live modifiers or waves 1–3.  
VALIDATION_REQUIRED: Sim with waves 1+2+3+4 and maxRolled=3 shows mix ≠ 100% wave 4. Single histogram (no Crosswind + `paper_windstorm` unless both are in one budget). Wager Gate never rolls in dungeon / rush / deathRealm. `worldFeatures.test.ts` stays green. No `mapGen.ts` hunk. Wallet unchanged.  
STATUS: NEW  

---

ACTION_ID: WDEAD-2026-09-22-002  
SOURCE_AUTOMATION: World, Dungeon & Encounter Admin Designer  
TITLE: Family variant knobs lie until battle-start HP / RES / SP overwrite is owned  
CATEGORY: spawn-admin  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `applyFamilyVariantsToRoster` runs at generate time (WX 5862–5866) and `applyEnemyFamilyStats` writes hp / maxHp / damage / res / sp (`spawnPolicy.ts` 261–272). Battle start then overwrites res / sp / sr / init / chc from `computeEnemyStats` (WX 11892–11903). Combatant HP is then `calcEnemyMaxHp(e.level)` (WX 11970–11974 and 11991–11997) — family HP is discarded. Queued #349 (elite wave 4) documents the same wipe. `FAMILY_STAT_MULTS` uses 0.05–0.75 fractions vs percent rolls in `getEnemyBaseStats`. Catalog ap / mp still unused. `spawnPolicy.test.ts` locks `FAMILY_VARIANT_CHANCE === 0.3`. `WDEAD-2026-09-21-002` wraps those constants as draft defaults; it does not say which family stats survive into combat. An Admin Spawn “variant %” that implied combat HP/RES would be a CatalogNote lie (`WDEAD-2026-09-01-001` class). Ember / tide / void still key off the kept `family` string (WX 16789+, `castHelpers.ts` reflect).  
SYSTEMS_AFFECTED: pack `spawnPolicy.family`; Admin Spawn honesty; Simulation `familyHpOverwritten` / `familyResOverwritten`. Live WX battle-start snapshot stays until a later human pick. Not RAF, not `calcScaledDamage`.  
RECOMMENDED_ACTION: Pack family fields declare which of HP / damage / RES / SP survive the battle-start snapshot. Until VALIDATE, label combat HP/RES/SP as unused / overwritten. Prefer re-applying family **after** `calcEnemyMaxHp` over disabling destack. Do not present the 30% roll as already owner-configurable combat difficulty. Sim reports `familyRolled`, `familyTagKept`, overwrite flags. Prefer DRAFT → SIMULATE → VALIDATE → ACTIVATE. Do not concatenate Wave 1–4 elite sheets here (`WDEAD-2026-09-22-007`).  
AUTONOMY: IMPLEMENT_WHEN_PICKED for honesty labels. HUMAN_APPROVE to keep family HP into combat (touches battle start).  
DEPENDENCIES: WDEAD-2026-09-21-002; WDEAD-2026-08-31-011; WDEAD-2026-09-01-001; elite wave 4 (#349) consume  
REGRESSION_RISK: HIGH if family HP is restored without unique occupancy (stacking). HIGH if RES scale 0.75 is treated as 75% without a unit conversion. MEDIUM if ember/tide/void hooks lose the `family` tag.  
VALIDATION_REQUIRED: Sim at 10_000 rolls: overwrite flags match live WX unless a draft explicitly re-applies after snapshot. Changing only a draft variant % does not change live 30% until ACTIVATE. Existing destack / battleStartPlacement tests stay green. No `mapGen.ts` hunk. `pnpm typecheck`; `pnpm check`.  
STATUS: NEW  

---

ACTION_ID: WDEAD-2026-09-22-003  
SOURCE_AUTOMATION: World, Dungeon & Encounter Admin Designer  
TITLE: Ingest EED day-4 rooms and FSN drop-4 formations as encounter data — do not fork a third array  
CATEGORY: encounters  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Live `generateEnemies` still scatters 1..8 + depth extras, random chess piece, Chebyshev ≥ 4, then 30% family (WX 5711–5869). No formation / objective / encounter-bound rule. Queued #347 (`EED-2026-09-21-001`) adds Tide / File / Clock rooms (ENC-TEACH-04, ENC-FILE-01, ENC-CART-01, ENC-RUSH-11…14, rest / branch / oath, …). Queued #348 adds drop-4 `FSN-*` (Wick Court, Ice File, Smoke Hunt, Plus Battery, Tempo Choir, Absolve Race, Rescue Line, Bastion Gate, Twin Plate, Finish Line, Fog Fuse, teaching PAIRs `FSN-WICK-STEP` / `FSN-RIME-RANK` / `FSN-SMOKE-GLASS`, …). `WDEAD-2026-08-31-005` owns the Encounters tab; `WDEAD-2026-09-21-004` owns occupancy × fight-graph destack. Rest is still a world 10% portal, not a dungeon room (WX 4914–4919). `MAX_ENEMIES = 20` (`gameConstants.ts` 10). Phalanx Line wants +3 elites (`WF-INV-PHALANX_LINE`).  
SYSTEMS_AFFECTED: proposed Admin Encounters / Dungeons tabs; `engine/encounterFormations.ts`; Simulation `destackRelocations` / `skippedForBudget`. Live `occupancy.ts` / `battleStartPlacement.ts` / `mapGen.ts` destack stay.  
RECOMMENDED_ACTION: Owner room pools and formation pickers **reference** `ENC-*` and `FSN-*` ids from those catalogs. VALIDATE rejects unknown `formationId`. Union overlapping helpers — one `export function` per name (restack union ≠ concatenate). Formations are role offsets on walkable unique cells via `occupancy.isCellFree`, then destack may slide onto the origin fight graph; drop a slot that cannot destack. Rest-as-room / branching remain `WDEAD-2026-08-31-007`. Do not overlay ENC rooms from Admin “to try Tide.” Prefer DRAFT → SIMULATE → VALIDATE → ACTIVATE.  
AUTONOMY: HUMAN_APPROVE before changing live occupancy or dungeon sequencing. Catalog ingest + sim reporting is IMPLEMENT_WHEN_PICKED with the lab.  
DEPENDENCIES: WDEAD-2026-08-31-005; WDEAD-2026-08-31-007; WDEAD-2026-09-21-004; WDEAD-2026-09-22-001; EED-2026-09-21-001; FSN drop 4 (#348)  
REGRESSION_RISK: HIGH if destack is disabled to keep formation art. HIGH if two copies of the same helper land in one TS file (esbuild). HIGH if extras land past a portal cut.  
VALIDATION_REQUIRED: Existing destack / leftover-island / battleStartPlacement tests stay green. Sim at size=20 + Phalanx Line / drop-4 COURT shows skip or relocation, not overlap, not a far-island hop. No `mapGen.ts` hunk. `pnpm typecheck`.  
STATUS: NEW  

---

ACTION_ID: WDEAD-2026-09-22-004  
SOURCE_AUTOMATION: World, Dungeon & Encounter Admin Designer  
TITLE: Expand grantClass with copyLastCast; Iron Lent / Seeping Tithe / Heavy Incant / Stagnant Haze / Flint Dust / Veil Font only via mapModifierRegistry  
CATEGORY: world-events  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Queued wave-4 `WF-SPL-ECHO_SCRIBE` copies the last spell id the enemy **cast** this fight as one remaining use this map; Attack Nearest yields no grant; “do not call upgradeSpell.” That is not Grimoire `oneCast` (kill for a catalog extra) and not Loaner `loanOneCast` (adjacent 1 AP, no kill). `WF-EVT-IRON_LENT` flags next `applyRewards` if current HP never **increased**. `WF-RSK-SEEPING_TITHE` is a repeating % max-HP tax plus extreme multiplier. `WF-MOD-HEAVY_INCANT` reads `SpellConfig.apCost >= 3` then spends 1 MP if available. `WF-ENV-STAGNANT_HAZE` taxes 0-MP turns. `WF-HAZ-FLINT_DUST` taxes AP spend while occupying. `WF-ZON-VEIL_FONT` reads `linear` only. `WDEAD-2026-09-21-003` covered `loanOneCast` + Short Fuse / Harvest / Isolation / Stillness only. AGENTS.md: no damage-math edits, no name heuristics, `upgradeSpell` sole spell-level writer, hazard HP via challenge recorders.  
SYSTEMS_AFFECTED: pack `grantClass` / `combatHookId` / `rewardCurve`; `mapModifiers.ts` registry; never WX `if (feature.id)` and never `upgradeSpell`.  
RECOMMENDED_ACTION: `grantClass: none | mapAttune | oneCast | loanOneCast | copyLastCast | observe`. `copyLastCast` is in-memory, this map only, last **cast** metadata id, does not persist spell-level arrays. `observe` reserved. Iron Lent / Tithe payable preview still `WDEAD-2026-09-01-005` (clamp 100_000 / 500_000). Flint / Haze / Tithe HP through `recordChallengeDamageTaken` / `recordInBattleChallengeDamage`. Heavy Incant and Veil Font read `apCost` / `linear` only. Wager Gate eligibility stays exploration-only (`WDEAD-2026-09-22-001`). Fix NaN `levelZone` under `WDEAD-2026-08-31-012`, not by granting from EnemyConfig.  
AUTONOMY: HUMAN_APPROVE — combat-sensitive.  
DEPENDENCIES: WDEAD-2026-09-21-003; WDEAD-2026-09-02-004; WDEAD-2026-09-01-005; WDEAD-2026-09-01-006; WDEAD-2026-09-01-007; WDEAD-2026-09-22-001; WDEAD-2026-08-31-012  
REGRESSION_RISK: HIGH if copyLastCast writes spellLevel arrays. HIGH if Flint / Heavy Incant uses spell **name**. HIGH if Haze / Tithe invent a second HP writer. MEDIUM if Iron Lent / Tithe mint outside `applyRewards`.  
VALIDATION_REQUIRED: Simulated scribe kill/copy leaves canister spell upgrades unchanged. No `calcScaledDamage` hunk. Payable Tithe / Iron Lent / Wager bonus ≤ official `applyRewards` maxima. Flint / Haze spy: only challenge HP recorders. `pnpm typecheck`.  
STATUS: NEW  

---

ACTION_ID: WDEAD-2026-09-22-005  
SOURCE_AUTOMATION: World, Dungeon & Encounter Admin Designer  
TITLE: Boss Rush owner sequencing uses namespaces 0–9 / B0–B3 / C0–C3 — Table C is additive  
CATEGORY: boss-rush  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Live `BOSS_RUSH_ROOMS` is 10 hardcoded pairs (`useBossRush.ts` 24–135). Admin enable + per-room `x` do not skip rooms. `_rewardMultiplier` is set (`useBossRush.ts` 209, 243) with zero readers. `persistBossRushRoomClear` still `completeBossRushRoom(..., 0, 0)`. Room 9 `boss2Id: "weeping_pawn_2"` is still not a `BossId`. Queued encounter catalog already named Table B `B0`–`B3` after a 0–9 clear. Queued #367 adds **Table C** `C0`–`C3` after a Table B clear (`ram_castellan`+`hexed_marker`, …) and forbids rewriting 0–9 or B0–B3. `WDEAD-2026-08-31-008` owns Rush policy; `WDEAD-2026-09-01-009` owns multipliers → `applyRewards`; `WDEAD-2026-09-02-002` owns the CatalogNote lie (copy queued in #334). Relative boss HP still static (`LHIPS-2026-08-31-010`).  
SYSTEMS_AFFECTED: Admin Boss Rush tab; pack `bossRushPolicy` tables; official credit stays `applyRewards` after `currentRoom` advances. Not a second wallet write.  
RECOMMENDED_ACTION: Owner sequencing is three namespaces: live 0–9, post-clear B0–B3, post-B C0–C3. Do not overwrite `BOSS_RUSH_ROOMS` to “add Table C.” Room-9 remap to `second_lament` stays boss-design slice I. Relative scale is offset + curve versus the player (never `levelMax`). Evaluated multipliers enter `computeRewardDeltas` only after VALIDATE (`WDEAD-2026-09-01-009`); keep `completeBossRushRoom` at `(0, 0)`. CatalogNote must not claim Table C or `rewardMultiplier` is live until ACTIVATE. Prefer DRAFT → SIMULATE → VALIDATE → ACTIVATE.  
AUTONOMY: IMPLEMENT_WHEN_PICKED for copy / namespace fields. HUMAN_APPROVE to bind scale or multipliers into live Rush.  
DEPENDENCIES: WDEAD-2026-08-31-008; WDEAD-2026-09-01-009; WDEAD-2026-09-02-002; WDEAD-2026-09-01-005; EED-2026-09-21-001; #367 Table C  
REGRESSION_RISK: HIGH if jackpot room remains resumable after a new credit. HIGH if canister client `dokaReward`/`xpReward` are revived. HIGH if Table C reuses roomIndex 0–9.  
VALIDATION_REQUIRED: Changing Admin “x” does not change `completeBossRushRoom` args. Table C ids do not collide 0–9 or B0–B3. Relative scale at hypothetical 50_000 does not require a stored enemy `levelMax`. Existing `bossRushProgress.test.ts` stays green.  
STATUS: NEW  

---

ACTION_ID: WDEAD-2026-09-22-006  
SOURCE_AUTOMATION: World, Dungeon & Encounter Admin Designer  
TITLE: Owner Simulation Lab reports family overwrite and INIT first-turn share; 100k is a hypothetical — not LHIPS  
CATEGORY: simulation-lab  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: No Admin Simulation tab (`gameTypes.ts` 482–498; `TABS` 5610–5626). Tiers preview still `SAMPLE_LEVELS = [1, 10, 25, 50, 100, 200, 500]` (`AdminDashboard.tsx` 3877). `longHorizonSim.ts` on main samples 10_000 / 50_000; queued #357 adds **100_000**, `monteCarloPlayerWinsInitiative`, and CHC breakpoints. Create INIT is frozen at 10; `saveBattleStats` cannot raise it (LHIPS-2026-09-21-001). `WDEAD-2026-09-21-005` / `007` already isolate LHIPS / `mapGen.simulate` and say 10k/50k samples do not close the owner lab — do not re-issue. Family HP wipe (`WDEAD-2026-09-22-002`) and wave-4 mix (`WDEAD-2026-09-22-001`) are new report columns.  
SYSTEMS_AFFECTED: proposed `engine/encounterSim.ts`; Admin Simulation tab; Tiers/Spawn preview. `longHorizonSim.ts` stays LHIPS.  
RECOMMENDED_ACTION: Owner lab presets include 1 / 10 / 100 / 1_000 / 10_000 / 50_000 / **100_000** as unbounded hypotheticals (not a career cap). Reports add `familyHpOverwritten` / `familyResOverwritten`, `pPlayerWinsInitiative`, `catalogWave` mix including 4, plus the 08-31-003 set (relative-level, below/equal/above, families, variants, elites, AI, rare spells, discovery, formations, estimated difficulty). Do not mint INIT or call `saveBattleStats` from the lab. Spy allow-list stays 09-21-005 (`applyRewards`, `saveBattleStats`, `upgradeSpell`, `claimAchievementReward`, `processPendingPurchases`, `redeemGameKey`, persist `commit`, feat unlocks, one-shot Doka, Rush persist, `pbv_*`). Bundle must not import `longHorizonSim.ts` or `mapGen.simulate.ts`.  
AUTONOMY: IMPLEMENT_WHEN_PICKED with the lab (`WDEAD-2026-08-31-003`).  
DEPENDENCIES: WDEAD-2026-08-31-003; WDEAD-2026-09-21-005; WDEAD-2026-09-21-007; WDEAD-2026-09-22-001; WDEAD-2026-09-22-002; do not duplicate LHIPS-2026-09-21-001 (report-only INIT)  
REGRESSION_RISK: HIGH if Admin Simulation imports `runLongHorizonSim` or `redeemGameKeyThroughPersist`. HIGH if lab raises stored INIT. LOW for live play (lab-only).  
VALIDATION_REQUIRED: 10_000 lab rolls: zero actor credit methods, zero GameKey redeem, zero inventory writes, zero achievement unlocks, zero one-shot claims, zero Rush persist, zero INIT writes. Hypothetical 100_000 accepted without showing `floor(999 / ts)` as the distribution. `pnpm typecheck`.  
STATUS: NEW  

---

ACTION_ID: WDEAD-2026-09-22-007  
SOURCE_AUTOMATION: World, Dungeon & Encounter Admin Designer  
TITLE: Elite rarity is a second roll — do not concatenate Wave 4 family sheets onto live FAMILY_TYPES  
CATEGORY: spawn-admin  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Live elite flag does not exist. Variant path is equal-weight `FAMILY_TYPES` (seven ids, `spawnPolicy.ts` 49–57) at 30% (`FAMILY_VARIANT_CHANCE`). Queued #349 (Wave 4 elite evolution) specifies a **second** rarity roll after level pick (BASE / VETERAN / ELITE / CHAMPION weights vs relative band + dungeon depth) and many proposed family ids that are **not** in `EnemyFamily` (`gameTypes.ts`). Wave 1–3 elite sheets are still PROPOSED. Restack rule: union overlapping files keep **one** `export function` / `FAMILY_TYPES` implementation per name — concatenating two copies fails Caffeine `vite build`. `WDEAD-2026-08-31-011` asked for elite % knobs; it did not name four waves of unused sheets. `isElite` still absent.  
SYSTEMS_AFFECTED: pack `spawnPolicy.eliteRarity`; Admin Spawn; `EnemyFamily` type. Live seven-id overlay stays until VALIDATE.  
RECOMMENDED_ACTION: Owner elite % is a second roll, not a longer `FAMILY_TYPES` array. Ingest Wave 1–4 family **sheets** as data behind the pack; do not append ids onto the live enum in the same change as Admin. Champion / elite floors sit on `computeAITier` only after ACTIVATE (`WDEAD-2026-08-31-011` / `012`). Rewards 1.00 / 1.15 / 1.35 / 1.60× stay theoretical until payable clamp (`WDEAD-2026-09-01-005`). Prefer DRAFT → SIMULATE → VALIDATE → ACTIVATE.  
AUTONOMY: HUMAN_APPROVE — live roster composition.  
DEPENDENCIES: WDEAD-2026-08-31-011; WDEAD-2026-09-22-002; WDEAD-2026-09-21-002; elite waves 1–4 consume; open-PR stack union rule  
REGRESSION_RISK: HIGH if `FAMILY_TYPES` is concatenated with a second copy of the same helper. HIGH if Wave 4 families ship without `isElite` and without surviving battle-start HP (`WDEAD-2026-09-22-002`).  
VALIDATION_REQUIRED: `python3 scripts/check-duplicate-exports.py src/frontend/src` stays clean. Sim elite histogram is 0% until ACTIVATE. Live ember/tide/void hooks still see the seven-id tag. `pnpm typecheck`; `pnpm check`.  
STATUS: NEW  
