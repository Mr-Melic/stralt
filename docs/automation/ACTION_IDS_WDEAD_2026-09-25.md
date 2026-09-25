# ACTION_IDs — 2026-09-25 World, Dungeon & Encounter Admin Designer

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: World, Dungeon & Encounter Admin Designer.  
Design contract: [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-25.md`](./WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-25.md).  
Prior IDs (still `NEW`, do not re-issue): `WDEAD-2026-08-31-001` … `015` (013 PARTIAL — `dungeonDokaMultiplierFor` unified, depth-5 freeze remains), `WDEAD-2026-09-01-001` … `010`, `WDEAD-2026-09-02-001` … `008`, `WDEAD-2026-09-21-001` … `007` (queued [PR #337](https://github.com/Mr-Melic/stralt/pull/337)), `WDEAD-2026-09-22-001` … `007` (queued [PR #394](https://github.com/Mr-Melic/stralt/pull/394)), `WDEAD-2026-09-23-001` … `007` (queued [PR #451](https://github.com/Mr-Melic/stralt/pull/451)), `WDEAD-2026-09-24-001` … `007` (queued [PR #534](https://github.com/Mr-Melic/stralt/pull/534)).  
Siblings to consume, not duplicate: `WDD-2026-09-21-001`…`WDD-2026-09-25-001` (waves 4–8, [#344](https://github.com/Mr-Melic/stralt/pull/344) / [#399](https://github.com/Mr-Melic/stralt/pull/399) / [#454](https://github.com/Mr-Melic/stralt/pull/454) / [#503](https://github.com/Mr-Melic/stralt/pull/503) / [#578](https://github.com/Mr-Melic/stralt/pull/578)), FSN drops 7–8 ([#537](https://github.com/Mr-Melic/stralt/pull/537) / [#575](https://github.com/Mr-Melic/stralt/pull/575)), EED Ley/Fan/Pit/Font ([#479](https://github.com/Mr-Melic/stralt/pull/479)), EED Gale/Twin/Pincer ([#519](https://github.com/Mr-Melic/stralt/pull/519)), EED Face/Mute/Span/Brand ([#574](https://github.com/Mr-Melic/stralt/pull/574)), elite waves 7–8 ([#535](https://github.com/Mr-Melic/stralt/pull/535) / [#558](https://github.com/Mr-Melic/stralt/pull/558)), Rush Tables E–G ([#474](https://github.com/Mr-Melic/stralt/pull/474) / [#518](https://github.com/Mr-Melic/stralt/pull/518) / [#572](https://github.com/Mr-Melic/stralt/pull/572)), jackpot complete(9) ([#536](https://github.com/Mr-Melic/stralt/pull/536)), map white-split / destack / dump ([#538](https://github.com/Mr-Melic/stralt/pull/538) / [#542](https://github.com/Mr-Melic/stralt/pull/542) / [#548](https://github.com/Mr-Melic/stralt/pull/548) / [#553](https://github.com/Mr-Melic/stralt/pull/553)), SpellSummonFields ([#564](https://github.com/Mr-Melic/stralt/pull/564) — do not re-issue `AUX-*`), `EBA-*`, `AFDA-*`.

This run ships **docs only**. Do not implement production, RAF, map generation, turn, or damage-math code from this file unless a later human or orchestrator picks an ID.

HEAD audited: `0f5363f` (unchanged since 2026-09-21). Live spawn/admin gaps from 09-24 still hold. New IDs cover catalogs and occupancy rules that did not exist when #534 filed, including same-window #572 Table G, #574/#575 encounter/formation sheets, and #578 wave 8.

Queued older siblings (do not duplicate): #334/#415 AFDA honesty copy. #337 / #394 / #451 / #534 prior WDEAD IDs.

---

ACTION_ID: WDEAD-2026-09-25-001  
SOURCE_AUTOMATION: World, Dungeon & Encounter Admin Designer  
TITLE: Owner dungeon special-room catalog and WorldFeatureRunMode must include whiteSanctuary — not exploration and not a dungeon-chain floor  
CATEGORY: dungeons  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `WorldFeatureRunMode` is `exploration | dungeon | bossRush` (`worldFeatures.ts` 67). Context may pass `deathRealm` (148); `isFeatureAllowedInContext` returns false (1768–1769). Rest is still a world 10% portal (WX 4914–4934), not an enum value (`WDEAD-2026-09-01-010`). White sanctuary / dungeon-complete gateway colocates with spawn (`placeWhitePortalAtSpawn`, `portalRules.ts` 285–290) **after** `generateEnemies` + `applyFinalizedLayout` (WX 6406–6407; `mapGen.ts` 1815–1834). Queued #548 re-legalizes after the stamp so small-side hostiles stay engageable (gateway is a new battle cut-vertex). Queued #553 destacks battle-start off a portal-seeded origin because flood from the gateway tile is empty. `WDEAD-2026-09-01-010` named rest / deathRealm only. On `main`, 52 `WF-*` ids share `ALL_RUNS` or `EXPLORATION_ONLY` — none name white.  
SYSTEMS_AFFECTED: pack `dungeonPolicy.specialRooms`; `WorldFeatureRunMode`; Admin Dungeons / World Events eligibility; Simulation `whiteSanctuary` histogram. Live `placeWhitePortalAtSpawn` / destack stay. Not `mapGen.ts`.  
RECOMMENDED_ACTION: Add `whiteSanctuary` as a dungeon special-room type and a run-mode eligibility (default: no `WF-*` extras, no rest-shop, no Death Realm modifiers, no exploration-only gates). Do not treat white as `exploration` (Flicker / Twilight / Ash / Pact / Pilgrim) or as dungeon-chain depth (extras / `dungeonDokaMultiplierFor`). Rest-as-room / branching remain `WDEAD-2026-08-31-007`. Death Realm default remains []. Until VALIDATE, do not overlay features onto white maps from Admin. Prefer DRAFT → SIMULATE → VALIDATE → ACTIVATE.  
AUTONOMY: HUMAN_APPROVE — white maps are player-facing progression exits.  
DEPENDENCIES: WDEAD-2026-09-01-010; WDEAD-2026-08-31-007; WDEAD-2026-09-24-006; WDEAD-2026-09-25-006; #548 / #553 consume  
REGRESSION_RISK: HIGH if white rolls Flicker / Ash / Twilight extra portals. HIGH if dungeon depth extras / Doka table apply on sanctuary. HIGH if destack is disabled so the player stays on the gateway tile.  
VALIDATION_REQUIRED: Sim with `runMode=whiteSanctuary` rolls 0 exploration-only gates and 0 dungeon extras. Small-side hostiles remain on the fight graph after #548. Portal-seeded destack reports a relocation, not a stuck origin (#553). `worldFeatures.test.ts` stays green. No `mapGen.ts` hunk. Wallet unchanged.  
STATUS: NEW  

---

ACTION_ID: WDEAD-2026-09-25-002  
SOURCE_AUTOMATION: World, Dungeon & Encounter Admin Designer  
TITLE: SpellSummonFields absolute summonUnitDef.level is catalog-only — owner spawn and encounter summon templates use relative caster offset  
CATEGORY: spawn-admin  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Queued #564 adds owner spell-editor summon controls (AI, lifespan, piece, **level**, hpScale, damageScale) with live-catalog copy — Save is not a draft. AdminGuard still rejects `summonUnitDef.level > 99` (`adminGuard.mo` 441) and `minLevel > 999` (411). Lifespan 20 and hpScale/damageScale 0–10 are board-safety / Inf rails (`adminGuard.mo` 438–450). `WDEAD-2026-09-02-005` named those career caps; it did not name a visible owner field that teaches “summons cap at 99.” Owner mandate includes spawn “advanced spell probability.” Live summoner chance is still linear unclamped `0.12 + level * 0.02` (WX 11932–11934; `gameConstants.ts` 298–299) — `WDEAD-2026-08-31-012`. Do not re-issue `AUX-*` (editor chrome).  
SYSTEMS_AFFECTED: pack `spawnPolicy.advancedSpell` / encounter summon extras; Admin Spells summon section labeling; Simulation `summonerFrequency`. Not RAF / damage math. Not a second `upgradeSpell`.  
RECOMMENDED_ACTION: Pack summon templates are `{ relativeOffset, hpScale, damageScale, ai, lifespan }` versus the **caster**. SpellSummonFields absolute `level` stays labeled unused-as-career-cap until VALIDATE migrates it to that offset. Do not raise 99 / 999. Keep lifespan 20 and finite 0–10 scales. Lab presets include 1 / 50_000 / 100_000 and report summonerFrequency without writing spell-level arrays. Prefer DRAFT → SIMULATE → VALIDATE → ACTIVATE so a relative summon kit cannot mint.  
AUTONOMY: IMPLEMENT_WHEN_PICKED for honesty copy on #564’s section. HUMAN_APPROVE to bind relative summon scale into live kits.  
DEPENDENCIES: WDEAD-2026-09-02-005; WDEAD-2026-08-31-012; WDEAD-2026-08-31-011; WDEAD-2026-09-01-001; #564 consume (do not re-issue AUX)  
REGRESSION_RISK: HIGH if Admin “level 99” is documented as a player cap. HIGH if VALIDATE writes `upgradeSpell` from a simulated summon kit. MEDIUM if hpScale 10 + relative offset produces Inf HP (keep the 0–10 Inf reject).  
VALIDATION_REQUIRED: Changing a draft relative offset does not change live `summonUnitDef.level` until ACTIVATE. Simulated kits at hypothetical 50_000 do not call `upgradeSpell` or persist spell-level arrays. AdminGuard lifespan 20 / Inf-scale tests stay green. `pnpm typecheck`.  
STATUS: NEW  

---

ACTION_ID: WDEAD-2026-09-25-003  
SOURCE_AUTOMATION: World, Dungeon & Encounter Admin Designer  
TITLE: Ingest EED Ley/Gale/Face rooms plus FSN drops 7–8 as encounter data — do not fork a third array  
CATEGORY: encounters  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Live `generateEnemies` still scatters 1..8 + depth extras, random chess piece, Chebyshev ≥ 4, then 30% family (WX 5711–5869). No formation / objective / encounter-bound rule. `WDEAD-2026-09-24-003` ingested FSN drop 6 only and bounded rooms as day-1…5 / drop-1…6. Queued #479 adds Ley / Fan / Pit / Font `ENC-*` (filed after #451). Queued #519 adds Gale / Twin / Pincer **room** sheets. Queued #537 (FSN drop 7) packs **Wave 6** families. Same-window #574 adds Face / Mute / Span / Brand rooms (`ENC-TEACH-08`, `ENC-FACE-01`, `ENC-MUTE-01`, `ENC-SPAN-01`, `ENC-BRAND-01`, `ENC-RUSH-27`…`30` as Table F remixes — not live 0–9). Same-window #575 (FSN drop 8) adds `FSN-CAMP-TITHE`, `FSN-PURSE-MUTE`, `FSN-HINGE-GLANCE`, `FSN-VEIL-GOAD`, `FSN-POST-TITHE`, `FSN-PURSE-COURT`, `FSN-CORNER-FOG`, `FSN-REEL-TITHE`, `FSN-HINGE-COVER`, `FSN-TWIN-PLUG`, `FSN-VEIL-CORNER`, `FSN-BREAK-CHOIR`, `FSN-CAP-VEIL`, `FSN-REEL-CORNER` packing **Wave 7** families (#535). Wave 8 families (#558) are deferred to drop 9. Rest is still a world 10% portal. `MAX_ENEMIES = 20`.  
SYSTEMS_AFFECTED: proposed Admin Encounters / Dungeons tabs; `engine/encounterFormations.ts`; Simulation `destackRelocations` / `skippedForBudget` / `smallSideHostiles`. Live `occupancy.ts` / `battleStartPlacement.ts` / `mapGen.ts` destack stay.  
RECOMMENDED_ACTION: Owner room pools and formation pickers **reference** `ENC-*` and `FSN-*` ids from those catalogs (day-1…8 / drop-1…8). VALIDATE rejects unknown `formationId`. Union overlapping helpers — one `export function` per name (restack union ≠ concatenate). Do not concatenate Wave 8 family ids onto drop-8 sheets. Formations are role offsets on walkable unique cells via `occupancy.isCellFree`, then destack may slide; drop a slot that cannot destack. Rest-as-room / branching remain `WDEAD-2026-08-31-007`. Do not overlay ENC rooms from Admin “to try Face Court.” Prefer DRAFT → SIMULATE → VALIDATE → ACTIVATE.  
AUTONOMY: HUMAN_APPROVE before changing live occupancy or dungeon sequencing. Catalog ingest + sim reporting is IMPLEMENT_WHEN_PICKED with the lab.  
DEPENDENCIES: WDEAD-2026-08-31-005; WDEAD-2026-08-31-007; WDEAD-2026-09-24-003; WDEAD-2026-09-25-006; WDEAD-2026-09-25-007; EED #479; EED #519; EED #574; FSN drop 7 (#537); FSN drop 8 (#575)  
REGRESSION_RISK: HIGH if destack / white-split re-legalize is disabled to keep formation art. HIGH if two copies of the same helper land in one TS file (esbuild). HIGH if extras land past a portal cut or on the white gateway tile.  
VALIDATION_REQUIRED: Existing destack / leftover-island / battleStartPlacement / white-split tests stay green. Sim at size=20 + drop-8 COURT / Split Banner / Face Court shows skip or relocation, not overlap, not a far-island hop. No `mapGen.ts` hunk. `pnpm typecheck`.  
STATUS: NEW  

---

ACTION_ID: WDEAD-2026-09-25-004  
SOURCE_AUTOMATION: World, Dungeon & Encounter Admin Designer  
TITLE: Boss Rush extra-table ACTIVATE includes G0–G3 and must still complete jackpot room 9 before reset — never canister roomIndex greater than 9  
CATEGORY: boss-rush  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Live `BOSS_RUSH_ROOMS` is 10 hardcoded pairs (`useBossRush.ts` 24–135). Admin enable + per-room `x` do not skip rooms. `_rewardMultiplier` is set (`useBossRush.ts` 209, 243) with zero readers. CatalogNote still claims it is read (`AdminDashboard.tsx` 7141–7146). `persistBossRushRoomClear` still `completeBossRushRoom(..., 0, 0)` (`bossRushProgress.ts` 186–191). Canister `completeBossRushRoom` returns `#err` when `roomIndex > 9` (`main.mo` 3317). Queued #536: clearing room 9 called `completeRun` → `resetRunState` → `abortBossRush` **before** `complete(9)`, so master complete / run count / `highestRoomCompleted=10` never landed. Queued #572 adds **Table G** `G0`–`G3` after Table F (toll+cinder, hinge+palisade, veil+wick, oath+ram). `WDEAD-2026-09-24-004` named E/F only. Wave-9 ids (`toll_ostiary`, `hinge_precentor`, `veil_verger`, `oath_dean`) stay out of live `BOSS_IDS`.  
SYSTEMS_AFFECTED: Admin Boss Rush tab; pack `bossRushPolicy` tables; official credit stays `applyRewards` after `currentRoom` advances. Not a second wallet write. Not `setBossRushProgress` with roomIndex 10–21.  
RECOMMENDED_ACTION: Owner sequencing is seven namespaces: live 0–9, then B, C, D, E, F, G. VALIDATE fails if activating E/F/G skips or rewrites jackpot `complete(9)`, or if a drafted 18-room rush calls `completeBossRushRoom` with roomIndex 17. Do not overwrite `BOSS_RUSH_ROOMS` to “add Table G.” Relative scale is offset + curve versus the player (never `levelMax`). Evaluated multipliers enter `computeRewardDeltas` only after VALIDATE (`WDEAD-2026-09-01-009`); keep `completeBossRushRoom` at `(0, 0)`. CatalogNote must not claim Table E/F/G or `rewardMultiplier` is live until ACTIVATE. Prefer DRAFT → SIMULATE → VALIDATE → ACTIVATE.  
AUTONOMY: IMPLEMENT_WHEN_PICKED for copy / namespace fields. HUMAN_APPROVE to bind scale or multipliers into live Rush, or to change the Motoko roomIndex rail.  
DEPENDENCIES: WDEAD-2026-09-24-004; WDEAD-2026-09-23-004; WDEAD-2026-09-22-005; WDEAD-2026-08-31-008; WDEAD-2026-09-01-009; WDEAD-2026-09-02-002; #536 consume; #474 Table E; #518 Table F; #572 Table G  
REGRESSION_RISK: HIGH if jackpot room remains resumable after a new credit. HIGH if canister client `dokaReward`/`xpReward` are revived. HIGH if extra tables reuse roomIndex 0–9 or skip `complete(9)`. HIGH if Motoko `roomIndex > 9` is raised as a “fix” without a namespaced progress key.  
VALIDATION_REQUIRED: Changing Admin “x” does not change `completeBossRushRoom` args. Sim of a drafted 18-room rush never calls roomIndex 17. Jackpot path still `complete(9)` then reset (`#536`). Relative scale at hypothetical 50_000 does not require a stored enemy `levelMax`. Existing `bossRushProgress.test.ts` stays green. Lab never calls Rush persist writers.  
STATUS: NEW  

---

ACTION_ID: WDEAD-2026-09-25-005  
SOURCE_AUTOMATION: World, Dungeon & Encounter Admin Designer  
TITLE: Elite rarity is a second roll — do not concatenate Wave 7 or Wave 8 family sheets onto live FAMILY_TYPES  
CATEGORY: spawn-admin  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Live elite flag does not exist. Variant path is equal-weight `FAMILY_TYPES` (seven ids, `spawnPolicy.ts` 49–57) at 30% (`FAMILY_VARIANT_CHANCE`). Queued #535 (Wave 7) specifies fourteen PROPOSED families (`post_stinger`, `purse_scribe`, `corner_bishop`, `hinge_squire`, `file_reeler`, `twin_span`, `veil_cantor`, `cadence_breaker`, `cadence_lender`, `purse_splitter`, `tithe_mason`, `hinge_mason`, `spark_chanter`, `cap_warder`). Queued #558 (Wave 8) specifies seventeen PROPOSED families (`wall_stinger`, `file_brander`, `boot_stinger`, `face_shover`, `slip_squire`, `pivot_ward`, `triple_span`, `cadence_cracker`, `once_cantor`, …). Those ids are **not** in `EnemyFamily`. FSN drop 7 (`#537`) packs Wave **6** families. FSN drop 8 (`#575`) packs Wave **7** families and defers Wave 8 to drop 9. `WDEAD-2026-09-24-005` named Wave 6 only. Family HP/RES/SP still die at battle start (`WDEAD-2026-09-22-002` — do not re-issue). `isElite` still absent. Restack rule: union overlapping files keep **one** `FAMILY_TYPES` implementation per name.  
SYSTEMS_AFFECTED: pack `spawnPolicy.eliteRarity` / `wRarePercent`; Admin Spawn; `EnemyFamily` type. Live seven-id overlay stays until VALIDATE.  
RECOMMENDED_ACTION: Owner elite % is a second roll, not a longer `FAMILY_TYPES` array. Optional `wRare` stays a skin weight on that roll. Ingest Wave 1–8 family **sheets** as data behind the pack; do not append ids onto the live enum in the same change as Admin. Do not smuggle Wave 8 families into FSN drop-8 helpers. Champion / elite floors sit on `computeAITier` only after ACTIVATE. Rewards stay theoretical until payable clamp (`WDEAD-2026-09-01-005`). Prefer DRAFT → SIMULATE → VALIDATE → ACTIVATE.  
AUTONOMY: HUMAN_APPROVE — live roster composition.  
DEPENDENCIES: WDEAD-2026-09-24-005; WDEAD-2026-09-23-005; WDEAD-2026-09-22-007; WDEAD-2026-09-22-002; WDEAD-2026-08-31-011; elite waves 1–8 consume; open-PR stack union rule  
REGRESSION_RISK: HIGH if `FAMILY_TYPES` is concatenated with a second copy of the same helper. HIGH if Wave 7/8 families ship without `isElite` and without surviving battle-start HP (`WDEAD-2026-09-22-002`).  
VALIDATION_REQUIRED: `python3 scripts/check-duplicate-exports.py src/frontend/src` stays clean. Sim elite histogram is 0% until ACTIVATE. Live ember/tide/void hooks still see the seven-id tag. `pnpm typecheck`; `pnpm check`.  
STATUS: NEW  

---

ACTION_ID: WDEAD-2026-09-25-006  
SOURCE_AUTOMATION: World, Dungeon & Encounter Admin Designer  
TITLE: Encounter formations must compose with white-gateway re-legalize, portal-seeded destack, and occupied-alcove dump punch  
CATEGORY: encounters  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: On main, `collectValidEnemySpawnCells` uses hardcoded `MAP_SPAWN_CELL` (8,8) Chebyshev ≤ 3 and portal Manhattan ≤ 2 (`spawnPolicy.ts` 41–47, 183–188). `generateEnemies` can still return `[]` if `allValid` is empty (WX 5737–5861). `WDEAD-2026-09-24-006` named preferred-room snap (#484), dump cells (#494), leftover portal floor (#500). After #534: queued #538 punches a free dump cell when hostiles occupy every alcove; #542 locks WX punch-then-finalize; #548 re-legalizes after white gateway so small-side hostiles stay engageable; #553 destacks battle-start off a portal-seeded origin (largest adjacent floor island; 2-tile crumb cannot win). Drop-7 Face Court / Span Gate packs assume authored cells.  
SYSTEMS_AFFECTED: proposed `engine/encounterFormations.ts`; Simulation `whiteSplitRelegalize` / `portalSeededDestack` / `occupiedAlcoveDumpPunch` / `preferredRoomSnap` / `leftoverPortalFloored`. Live destack / occupancy stay. Not `mapGen.ts`.  
RECOMMENDED_ACTION: Formations apply role offsets to walkable unique fight-graph cells via `occupancy.isCellFree`. White-gateway stamp may cut the graph — report `whiteSplitRelegalize` rather than treating the new small side as authored COURT art. Portal-seeded destack may move the player off the gateway tile — report `portalSeededDestack`. Occupied-alcove dump punch stays; do not disable #538/#548/#553 to keep keep-clear art. Punch-then-finalize stays (#542). Drop a slot that cannot destack; do not punch walls; do not hop a portal cut. VALIDATE fails if a dungeon room or white small-side places 0 enemies. Prefer DRAFT → SIMULATE → VALIDATE → ACTIVATE.  
AUTONOMY: HUMAN_APPROVE before changing live occupancy. Reporting may ship with the lab.  
DEPENDENCIES: WDEAD-2026-09-25-001; WDEAD-2026-09-25-003; WDEAD-2026-09-24-006; WDEAD-2026-09-02-007; #538 / #542 / #548 / #553 consume; do not combine with a mapGen specialist PR  
REGRESSION_RISK: HIGH if destack, white-split re-legalize, or occupied-alcove dump is disabled to keep formation art. HIGH if extras land on the white gateway tile or the far island. HIGH if last-resort is used to skip dungeon rooms again.  
VALIDATION_REQUIRED: Existing destack / leftover-island / keep-clear / portal-ring / preferred-room / white-split / occupied-dump tests stay green when those PRs land. Sim at size=20 on a white-gateway seed shows ≥ 1 hostile on the engageable small side and reports re-legalize instead of overlap. No `mapGen.ts` hunk. `pnpm typecheck`.  
STATUS: NEW  

---

ACTION_ID: WDEAD-2026-09-25-007  
SOURCE_AUTOMATION: World, Dungeon & Encounter Admin Designer  
TITLE: Owner encounter size is relative and must VALIDATE against the white-split small side — MAX_ENEMIES is a roster rail, not a level cap  
CATEGORY: encounters  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Overworld roll is 1..8 plus dungeon extras with **no** `MAX_ENEMIES` cap (`spawnPolicy.ts` 151–159; `rollOverworldEnemyCount` test at extras=5 yields 13). World-feature extras skip at `MAX_ENEMIES = 20` (`gameConstants.ts` 10; `canAddEnemies` `worldFeatures.ts` 1782–1785). Dungeon extras freeze at depth 5 (`spawnPolicy.ts` 29, 144; test 84). Owner mandate includes encounter size. `WDEAD-2026-08-31-011` named size as a missing spawn knob; it did not name white-split small-side VALIDATE after #548. Drop-7 Face Court / Span Gate and `WF-INV-SPLIT_BANNER` (+2 elites) assume authored counts. A 4-tile small side cannot host an 8-body COURT. Raising `MAX_ENEMIES` or depth-5 freeze as a “high-level” fix would be a career cap.  
SYSTEMS_AFFECTED: pack `spawnPolicy.encounterSize` / dungeon extras curve; Admin Encounters / Spawn; Simulation `smallSideHostiles` / `skippedForBudget`. Live 1..8 + extras stay until VALIDATE. Not RAF.  
RECOMMENDED_ACTION: Owner encounter size is a relative curve (roster vs player level offset, dungeon extras unbounded — no `min(depth, 5)`). On white-split / cramped graphs, skip-for-budget rather than punch walls. VALIDATE fails if the engageable component has 0 hostiles after #548 re-legalize. Do not raise `MAX_ENEMIES` as a substitute for skip. Do not treat 20 as a player-level max. Lab reports size histogram at hypothetical 1 and 50_000 without writing wallet. Prefer DRAFT → SIMULATE → VALIDATE → ACTIVATE.  
AUTONOMY: HUMAN_APPROVE — live roster size. Honesty copy that 1..8 + depth freeze are not owner knobs is IMPLEMENT_WHEN_PICKED.  
DEPENDENCIES: WDEAD-2026-08-31-011; WDEAD-2026-09-21-002; WDEAD-2026-09-02-008; WDEAD-2026-09-25-001; WDEAD-2026-09-25-003; WDEAD-2026-09-25-006; #548 consume  
REGRESSION_RISK: HIGH if extras land past a portal cut to “fit 8.” HIGH if `MAX_ENEMIES` is raised and world-feature extras start sealing dumps. MEDIUM if skip-for-budget makes dungeon rooms empty (VALIDATE must fail those drafts).  
VALIDATION_REQUIRED: Sim at hypothetical 1 and 50_000 reports size + `smallSideHostiles` without calling `applyRewards` or persist. A drafted Face Court on a 4-tile small side skips or fails VALIDATE rather than overlapping. `spawnPolicy.test.ts` depth-5 freeze stays until ACTIVATE replaces it. `pnpm typecheck`.  
STATUS: NEW  

---

ACTION_ID: WDEAD-2026-09-25-008  
SOURCE_AUTOMATION: World, Dungeon & Encounter Admin Designer  
TITLE: Owner enabledWaves must include wave 8; grantClass vowSilence; Hearth Gate exploration-only — do not ship WDD dual-roll as admin policy  
CATEGORY: world-events  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: On main, `CatalogWave = 1 | 2 | 3` and `LATEST_CATALOG_WAVE = 3` (`worldFeatures.ts` 64, 115). Catalog is 52 `WF-*` ids. `pickWeightedFeatures` (1853–1871) mixes all waves into `MAX_ROLLED_FEATURES = 3` (32). WX does not import `worldFeatures`. `docs/WORLD_DYNAMICS.md` line 44 still requires the 22 live modifiers to roll on their own two-roll; `mapModifierRegistry.rollActiveModifiers` is a documented three-roll (`mapModifiers.ts` 646–694). Queued #578 (`WDD-2026-09-25-001`) extends the **same** array with 16 wave-8 ids (`WF-PRT-HEARTH_GATE`, `WF-SPL-VOW_KEEPER`, `WF-RSK-BOND_OATH`, `WF-ZON-TRUE_STRIKE`, `WF-MOD-CLOSE_QUARTERS`, `WF-EVT-KINDLED_HOUR`, `WF-ELT-ODD_PICKET`, `WF-INV-HORN_RELAY`, `WF-ENV-GALE_BITE`, …). `WDEAD-2026-09-24-001` asked for owner waves `{1,2,3,4,5,6,7}` when wave 8 did not exist. Vow Keeper silences that extra `usableByEnemy` id **without granting it** (not `hushOnKill`, not `stealAndDisarm`). Bond Oath is keep-a-summon (inverse Solo Oath). Kindled Hour is paid-AP-spell (inverse Steel Hour). Close Quarters is map-wide linear −1. True Strike is standing linear +15%. Hearth Gate is a full-HP extra portal, exploration-only.  
SYSTEMS_AFFECTED: `worldFeatures.ts` picker inputs; Admin World Events; future pack `grantClass` / `combatHookId`; live `mapModifiers.ts` two/three-roll. Not `mapGen.ts`.  
RECOMMENDED_ACTION: Pack fields `enabledWaves` (any non-empty subset of `{1,2,3,4,5,6,7,8}` after #578 lands) and a single `worldEventCatalog` that includes `WF-*` and the 22 modifier ids. `grantClass` adds `vowSilence` (in-memory deny, this map only, no player kit, no `upgradeSpell`). True Strike / Close Quarters / Kindled Hour / Bond Oath / Gale Bite / Weary Plate / Bog Silt only via `mapModifierRegistry` / challenge HP recorders — never WX `if (feature.id)` and never `calcScaledDamage`. One roll budget per map after ACTIVATE. Until then, do not overlay wave 8. Sim reports `catalogWave` histogram including 8. Hearth Gate stays exploration-only; whiteSanctuary / deathRealm / dungeon / rush stay quiet for it (`WDEAD-2026-09-25-001`). Placement remains post-`finalizePlayableLayout` (WDD). Prefer DRAFT → SIMULATE → VALIDATE → ACTIVATE.  
AUTONOMY: HUMAN_APPROVE — live modifier odds are player-facing.  
DEPENDENCIES: WDEAD-2026-09-24-001; WDEAD-2026-09-24-002; WDEAD-2026-09-01-003; WDEAD-2026-09-02-003; WDEAD-2026-08-31-009; WDEAD-2026-09-25-001; WDD-2026-09-25-001  
REGRESSION_RISK: HIGH if both rolls stay independent after “wiring wave 8.” HIGH if enabling only wave 8 silently drops the 22 live modifiers or waves 1–7. HIGH if vowSilence writes spell-level arrays or grants a kit.  
VALIDATION_REQUIRED: Sim with waves 1–8 and maxRolled=3 shows mix ≠ 100% wave 8. Hearth Gate never rolls in dungeon / rush / deathRealm / whiteSanctuary. Simulated vow silence leaves canister spell upgrades unchanged. Single histogram (no Crosswind + `paper_windstorm` unless both are in one budget). `worldFeatures.test.ts` stays green. No `mapGen.ts` hunk. Wallet unchanged.  
STATUS: NEW  
