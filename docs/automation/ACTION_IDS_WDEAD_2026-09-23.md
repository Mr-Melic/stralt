# ACTION_IDs — 2026-09-23 World, Dungeon & Encounter Admin Designer

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: World, Dungeon & Encounter Admin Designer.  
Design contract: [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-23.md`](./WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-23.md).  
Prior IDs (still `NEW`, do not re-issue): `WDEAD-2026-08-31-001` … `015` (013 PARTIAL — `dungeonDokaMultiplierFor` unified, depth-5 freeze remains), `WDEAD-2026-09-01-001` … `010`, `WDEAD-2026-09-02-001` … `008`, `WDEAD-2026-09-21-001` … `007` (queued [PR #337](https://github.com/Mr-Melic/stralt/pull/337)), `WDEAD-2026-09-22-001` … `007` (queued [PR #394](https://github.com/Mr-Melic/stralt/pull/394)).  
Siblings to consume, not duplicate: `WDD-2026-09-22-001` (wave 5, [#399](https://github.com/Mr-Melic/stralt/pull/399)), `WDD-2026-09-21-001` (wave 4, #344), `EED-2026-09-22-001` (#396), FSN drop 5 (#401), elite wave 5 (#405), Rush Table D (#406), `LHIPS-2026-09-22-001` (#407), map last-resort (#430 / #436 / #444), `EBA-*`, `AFDA-*`.

This run ships **docs only**. Do not implement production, RAF, map generation, turn, or damage-math code from this file unless a later human or orchestrator picks an ID.

HEAD audited: `0f5363f` (unchanged since 2026-09-21). Live spawn/admin gaps from 09-22 still hold. New IDs cover catalogs and occupancy rules that did not exist when #394 filed.

Queued older siblings (do not duplicate): #334/#415 AFDA honesty copy. #337 / #394 prior WDEAD IDs.

---

ACTION_ID: WDEAD-2026-09-23-001  
SOURCE_AUTOMATION: World, Dungeon & Encounter Admin Designer  
TITLE: Owner enabledWaves must include wave 5; one roll budget — do not ship WDD dual-roll as admin policy  
CATEGORY: world-events  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: On main, `CatalogWave = 1 | 2 | 3` and `LATEST_CATALOG_WAVE = 3` (`worldFeatures.ts` 64, 115). Catalog is 52 `WF-*` ids. `pickWeightedFeatures` (1853–1871) mixes all waves into `MAX_ROLLED_FEATURES = 3` (32). WX does not import `worldFeatures`. `docs/WORLD_DYNAMICS.md` line 44 still requires the 22 live modifiers (`EXISTING_MAP_MODIFIER_IDS`, `worldFeatures.ts` 1890–1913) to roll on their own two-roll. Queued #344 extends the same array to wave 4. Queued #399 (`WDD-2026-09-22-001`) restacks on that and adds 16 wave-5 ids (`WF-PRT-PACT_GATE`, `WF-SPL-OATH_CANTOR`, `WF-MOD-THIN_AIR`, `WF-EVT-FIRST_BLOOD`, …) with `catalogWave: 5`. `WDEAD-2026-09-22-001` asked for owner waves `{1,2,3,4}` when wave 5 did not exist. Do not fork a sixth array.  
SYSTEMS_AFFECTED: `worldFeatures.ts` picker inputs; Admin World Events; future pack; live `mapModifiers.ts` two-roll. Not `mapGen.ts`.  
RECOMMENDED_ACTION: Pack fields `enabledWaves` (any non-empty subset of `{1,2,3,4,5}` after #399 lands) and a single `worldEventCatalog` that includes `WF-*` and the 22 modifier ids. Owner sets rarity, eligibility, slot, and whether a wave is in the mix. One roll budget per map after ACTIVATE. Until then, do not overlay wave 5. Sim reports `catalogWave` histogram including 5. Death Realm default remains []. Rest / deathRealm enum stays `WDEAD-2026-09-01-010`. Pact Gate / Wager / Latch / Flicker / Echo / Pilgrim stay exploration-only. Placement remains post-`finalizePlayableLayout` (WDD). Prefer DRAFT → SIMULATE → VALIDATE → ACTIVATE.  
AUTONOMY: HUMAN_APPROVE — live modifier odds are player-facing.  
DEPENDENCIES: WDEAD-2026-09-22-001; WDEAD-2026-09-21-001; WDEAD-2026-09-02-003; WDEAD-2026-09-01-003; WDEAD-2026-08-31-004; WDEAD-2026-08-31-009; WDD-2026-09-22-001; WDD-2026-09-21-001  
REGRESSION_RISK: HIGH if both rolls stay independent after “wiring wave 5.” HIGH if enabling only wave 5 silently drops the 22 live modifiers or waves 1–4.  
VALIDATION_REQUIRED: Sim with waves 1+2+3+4+5 and maxRolled=3 shows mix ≠ 100% wave 5. Single histogram (no Crosswind + `paper_windstorm` unless both are in one budget). Pact Gate never rolls in dungeon / rush / deathRealm. `worldFeatures.test.ts` stays green. No `mapGen.ts` hunk. Wallet unchanged.  
STATUS: NEW  

---

ACTION_ID: WDEAD-2026-09-23-002  
SOURCE_AUTOMATION: World, Dungeon & Encounter Admin Designer  
TITLE: Expand grantClass with bindWhileAlive; Thin Air / Keen Edge / First Blood / Blood Lock / Open Vein / Crowd Press only via mapModifierRegistry  
CATEGORY: world-events  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Queued wave-5 `WF-SPL-OATH_CANTOR` is 1 AP adjacent bind of that enemy’s extra `usableByEnemy` SpellConfig row, usable this map **only while the cantor is still alive**; killing them ends the bind with no leftover cast and does not call `upgradeSpell`. That is not Loaner `loanOneCast` (keep the cast after walking away) and not Echo Scribe `copyLastCast` (last **cast** id). `WF-MOD-THIN_AIR` reads `SpellConfig.apCost === 1` then charges 2 AP (Attack Nearest / summons unchanged). `WF-ZON-KEEN_EDGE` is +15% of the already-computed Attack Nearest hit while occupying. `WF-EVT-FIRST_BLOOD` flags the next `applyRewards` hard only if the first HP debit this map lands on an enemy. `WF-TRS-BLOOD_LOCK` is 1 AP + 5% max HP for a sure hard purse. `WF-RSK-OPEN_VEIN` is a 10% tax that pays only if a fight starts. `WF-ENV-CROWD_PRESS` taxes clumped living units (inverse Isolation Chill). `WDEAD-2026-09-22-004` covered `copyLastCast` + Iron Lent / Tithe / Heavy Incant / Haze / Flint / Veil only. AGENTS.md: no damage-math edits, no name heuristics, `upgradeSpell` sole spell-level writer, hazard HP via challenge recorders.  
SYSTEMS_AFFECTED: pack `grantClass` / `combatHookId` / `rewardCurve`; `mapModifiers.ts` registry; never WX `if (feature.id)` and never `upgradeSpell`.  
RECOMMENDED_ACTION: `grantClass: none | mapAttune | oneCast | loanOneCast | copyLastCast | bindWhileAlive | observe`. `bindWhileAlive` is in-memory, this map only, ends when the bearer dies, does not persist spell-level arrays. `observe` reserved. Thin Air / Keen Edge read `apCost` / Attack Nearest metadata only. First Blood / Blood Lock / Open Vein payable preview still `WDEAD-2026-09-01-005` (clamp 100_000 / 500_000). Blood Lock / Open Vein / Crowd Press / Glass Shard HP through `recordChallengeDamageTaken` / `recordInBattleChallengeDamage`. Pact Gate eligibility stays exploration-only (`WDEAD-2026-09-23-001`). Fix NaN `levelZone` under `WDEAD-2026-08-31-012`, not by granting from EnemyConfig.  
AUTONOMY: HUMAN_APPROVE — combat-sensitive.  
DEPENDENCIES: WDEAD-2026-09-22-004; WDEAD-2026-09-21-003; WDEAD-2026-09-02-004; WDEAD-2026-09-01-005; WDEAD-2026-09-01-006; WDEAD-2026-09-01-007; WDEAD-2026-09-23-001; WDEAD-2026-08-31-012  
REGRESSION_RISK: HIGH if bindWhileAlive writes spellLevel arrays or survives the cantor’s death. HIGH if Thin Air / Keen Edge uses spell **name**. HIGH if Crowd Press / Blood Lock invent a second HP writer. MEDIUM if First Blood / Open Vein mint outside `applyRewards`.  
VALIDATION_REQUIRED: Simulated cantor bind/kill leaves canister spell upgrades unchanged and the bind gone after death. No `calcScaledDamage` hunk. Payable First Blood / Blood Lock / Open Vein / Pact Gate bonus ≤ official `applyRewards` maxima. Crowd Press / Blood Lock spy: only challenge HP recorders. `pnpm typecheck`.  
STATUS: NEW  

---

ACTION_ID: WDEAD-2026-09-23-003  
SOURCE_AUTOMATION: World, Dungeon & Encounter Admin Designer  
TITLE: Ingest EED day-5 Wick/Rime/Smoke/Plus rooms and FSN drop-5 formations as encounter data — do not fork a third array  
CATEGORY: encounters  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Live `generateEnemies` still scatters 1..8 + depth extras, random chess piece, Chebyshev ≥ 4, then 30% family (WX 5711–5869). No formation / objective / encounter-bound rule. Queued #396 (`EED-2026-09-22-001`) adds Wick / Rime / Smoke / Plus rooms (`ENC-TEACH-05`, `ENC-WICK-01`, `ENC-RIME-01`, `ENC-COUP-01`, `ENC-PLUS-01`, `ENC-LEASH-01`, `ENC-FONT-01`, `ENC-TITHE-01`, `ENC-RUSH-15`…`18`, …). Queued #401 adds drop-5 `FSN-*` (Ley Court, Fan File, Trade Trap, Recoil Hunt, Gate Court, Font Gate, Lens Battery — Wave 4 family combinations). `WDEAD-2026-09-22-003` ingested day-4 + drop-4 only. Rest is still a world 10% portal. `MAX_ENEMIES = 20`. Mirror Host wants +1 elite (`WF-INV-MIRROR_HOST`).  
SYSTEMS_AFFECTED: proposed Admin Encounters / Dungeons tabs; `engine/encounterFormations.ts`; Simulation `destackRelocations` / `skippedForBudget`. Live `occupancy.ts` / `battleStartPlacement.ts` / `mapGen.ts` destack stay.  
RECOMMENDED_ACTION: Owner room pools and formation pickers **reference** `ENC-*` and `FSN-*` ids from those catalogs (day-1…5 / drop-1…5). VALIDATE rejects unknown `formationId`. Union overlapping helpers — one `export function` per name (restack union ≠ concatenate). Formations are role offsets on walkable unique cells via `occupancy.isCellFree`, then destack may slide onto the origin fight graph; drop a slot that cannot destack. Rest-as-room / branching remain `WDEAD-2026-08-31-007`. Do not overlay ENC rooms from Admin “to try Wick.” Prefer DRAFT → SIMULATE → VALIDATE → ACTIVATE.  
AUTONOMY: HUMAN_APPROVE before changing live occupancy or dungeon sequencing. Catalog ingest + sim reporting is IMPLEMENT_WHEN_PICKED with the lab.  
DEPENDENCIES: WDEAD-2026-08-31-005; WDEAD-2026-08-31-007; WDEAD-2026-09-22-003; WDEAD-2026-09-21-004; WDEAD-2026-09-23-001; WDEAD-2026-09-23-006; EED-2026-09-22-001; FSN drop 5 (#401)  
REGRESSION_RISK: HIGH if destack is disabled to keep formation art. HIGH if two copies of the same helper land in one TS file (esbuild). HIGH if extras land past a portal cut.  
VALIDATION_REQUIRED: Existing destack / leftover-island / battleStartPlacement tests stay green. Sim at size=20 + Mirror Host / drop-5 COURT shows skip or relocation, not overlap, not a far-island hop. No `mapGen.ts` hunk. `pnpm typecheck`.  
STATUS: NEW  

---

ACTION_ID: WDEAD-2026-09-23-004  
SOURCE_AUTOMATION: World, Dungeon & Encounter Admin Designer  
TITLE: Boss Rush owner sequencing uses namespaces 0–9 / B0–B3 / C0–C3 / D0–D3 — Table D is additive  
CATEGORY: boss-rush  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Live `BOSS_RUSH_ROOMS` is 10 hardcoded pairs (`useBossRush.ts` 24–135). Admin enable + per-room `x` do not skip rooms. `_rewardMultiplier` is set (`useBossRush.ts` 209, 243) with zero readers. CatalogNote still claims it is read (`AdminDashboard.tsx` 7141–7146). `persistBossRushRoomClear` still `completeBossRushRoom(..., 0, 0)`. Room 9 `boss2Id: "weeping_pawn_2"` is still not a `BossId`. Queued #367 Table C `C0`–`C3` is already named by `WDEAD-2026-09-22-005`. Queued #406 adds **Table D** `D0`–`D3` after a Table C clear (lock+wick, bait+conductor, font+cord, surplus+pendulum) and forbids rewriting 0–9 / B / C. Wave-6 ids (`lock_marshal`, `bait_vicar`, `font_abbess`, `surplus_auditor`) stay out of live `BOSS_IDS`. Relative boss HP still static (`LHIPS-2026-08-31-010`).  
SYSTEMS_AFFECTED: Admin Boss Rush tab; pack `bossRushPolicy` tables; official credit stays `applyRewards` after `currentRoom` advances. Not a second wallet write.  
RECOMMENDED_ACTION: Owner sequencing is four namespaces: live 0–9, post-clear B0–B3, post-B C0–C3, post-C D0–D3. Do not overwrite `BOSS_RUSH_ROOMS` to “add Table D.” Room-9 remap to `second_lament` stays boss-design slice I. Relative scale is offset + curve versus the player (never `levelMax`). Evaluated multipliers enter `computeRewardDeltas` only after VALIDATE (`WDEAD-2026-09-01-009`); keep `completeBossRushRoom` at `(0, 0)`. CatalogNote must not claim Table D or `rewardMultiplier` is live until ACTIVATE. Prefer DRAFT → SIMULATE → VALIDATE → ACTIVATE.  
AUTONOMY: IMPLEMENT_WHEN_PICKED for copy / namespace fields. HUMAN_APPROVE to bind scale or multipliers into live Rush.  
DEPENDENCIES: WDEAD-2026-09-22-005; WDEAD-2026-08-31-008; WDEAD-2026-09-01-009; WDEAD-2026-09-02-002; WDEAD-2026-09-01-005; #406 Table D  
REGRESSION_RISK: HIGH if jackpot room remains resumable after a new credit. HIGH if canister client `dokaReward`/`xpReward` are revived. HIGH if Table D reuses roomIndex 0–9 / B / C.  
VALIDATION_REQUIRED: Changing Admin “x” does not change `completeBossRushRoom` args. Table D ids do not collide 0–9, B0–B3, or C0–C3. Relative scale at hypothetical 50_000 does not require a stored enemy `levelMax`. Existing `bossRushProgress.test.ts` stays green.  
STATUS: NEW  

---

ACTION_ID: WDEAD-2026-09-23-005  
SOURCE_AUTOMATION: World, Dungeon & Encounter Admin Designer  
TITLE: Elite rarity is a second roll — do not concatenate Wave 5 family sheets onto live FAMILY_TYPES  
CATEGORY: spawn-admin  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Live elite flag does not exist. Variant path is equal-weight `FAMILY_TYPES` (seven ids, `spawnPolicy.ts` 49–57) at 30% (`FAMILY_VARIANT_CHANCE`). Queued #405 (Wave 5 elite evolution) specifies fifteen PROPOSED families (Wave 4 SPELL_PROPOSALS as CORE plus Stolen Verse / Misstep / Bitter Cup) and a **2% `wRare` skin** on the BASE / VETERAN / ELITE / CHAMPION second roll. Those ids are **not** in `EnemyFamily` (`gameTypes.ts` 12–20). `WDEAD-2026-09-22-007` named Wave 4 sheets only. Restack rule: union overlapping files keep **one** `export function` / `FAMILY_TYPES` implementation per name — concatenating two copies fails Caffeine `vite build`. Family HP/RES/SP still die at battle start (`WDEAD-2026-09-22-002` — do not re-issue). `isElite` still absent.  
SYSTEMS_AFFECTED: pack `spawnPolicy.eliteRarity` / `wRarePercent`; Admin Spawn; `EnemyFamily` type. Live seven-id overlay stays until VALIDATE.  
RECOMMENDED_ACTION: Owner elite % is a second roll, not a longer `FAMILY_TYPES` array. Optional `wRare` is a skin weight on that roll, not a sixth concat. Ingest Wave 1–5 family **sheets** as data behind the pack; do not append ids onto the live enum in the same change as Admin. Champion / elite floors sit on `computeAITier` only after ACTIVATE. Rewards stay theoretical until payable clamp (`WDEAD-2026-09-01-005`). Prefer DRAFT → SIMULATE → VALIDATE → ACTIVATE.  
AUTONOMY: HUMAN_APPROVE — live roster composition.  
DEPENDENCIES: WDEAD-2026-09-22-007; WDEAD-2026-09-22-002; WDEAD-2026-08-31-011; elite waves 1–5 consume; open-PR stack union rule  
REGRESSION_RISK: HIGH if `FAMILY_TYPES` is concatenated with a second copy of the same helper. HIGH if Wave 5 families ship without `isElite` and without surviving battle-start HP (`WDEAD-2026-09-22-002`).  
VALIDATION_REQUIRED: `python3 scripts/check-duplicate-exports.py src/frontend/src` stays clean. Sim elite histogram is 0% until ACTIVATE. Live ember/tide/void hooks still see the seven-id tag. `pnpm typecheck`; `pnpm check`.  
STATUS: NEW  

---

ACTION_ID: WDEAD-2026-09-23-006  
SOURCE_AUTOMATION: World, Dungeon & Encounter Admin Designer  
TITLE: Encounter formations must compose with portal-ring last-resort and live-spawn keep-clear  
CATEGORY: encounters  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: On main, `collectValidEnemySpawnCells` uses hardcoded `MAP_SPAWN_CELL` (8,8) Chebyshev ≤ 3 and portal Manhattan ≤ 2 (`spawnPolicy.ts` 41–47, 183–188). `generateEnemies` can still return `[]` if `allValid` is empty (WX 5737–5861 fallback only tries `shuffled`). Queued #430 skips far-island seeds behind a portal choke. Queued #436 makes keep-clear follow the **legalized live spawn**, not (8,8). Queued #444 last-resorts onto the **near-side portal ring** (never the portal tile, never the far island) so a dungeon room cannot unlock with zero hostiles. `WDEAD-2026-09-21-004` / `09-22-003` covered destack × occupancy; they did not name portal-ring last-resort or live-spawn keep-clear. Drop-5 plus-arm / wick-file packs assume authored cells.  
SYSTEMS_AFFECTED: proposed `engine/encounterFormations.ts`; Simulation `portalRingLastResort` / `keepClearFollowsLiveSpawn` / `farIslandSkipped`. Live destack / occupancy stay. Not `mapGen.ts`.  
RECOMMENDED_ACTION: Formations apply role offsets to walkable unique fight-graph cells via `occupancy.isCellFree`. If keep-clear + not-portal-adjacent is empty, last-resort may use the near-side portal ring so the room still has ≥ 1 hostile — report `portalRingLastResort` rather than treating that ring as authored COURT art. Drop a slot that cannot destack; do not punch walls; do not hop a portal cut. VALIDATE fails if a dungeon room places 0 enemies. Do not disable #444 to keep keep-clear art. Prefer DRAFT → SIMULATE → VALIDATE → ACTIVATE.  
AUTONOMY: HUMAN_APPROVE before changing live occupancy. Reporting may ship with the lab.  
DEPENDENCIES: WDEAD-2026-09-23-003; WDEAD-2026-09-22-003; WDEAD-2026-09-21-004; WDEAD-2026-09-02-007; #430 / #436 / #444 consume; do not combine with a mapGen specialist PR  
REGRESSION_RISK: HIGH if destack or last-resort is disabled to keep formation art. HIGH if extras land on the portal tile or the far island. HIGH if last-resort is used to skip dungeon rooms again.  
VALIDATION_REQUIRED: Existing destack / leftover-island / keep-clear / portal-ring tests stay green when those PRs land. Sim at size=20 on a 7×7 gate room shows ≥ 1 hostile and reports last-resort instead of overlap. No `mapGen.ts` hunk. `pnpm typecheck`.  
STATUS: NEW  

---

ACTION_ID: WDEAD-2026-09-23-007  
SOURCE_AUTOMATION: World, Dungeon & Encounter Admin Designer  
TITLE: Owner Simulation Lab reports Crush vs the 999-capped pack — 100k is a hypothetical, not a reason to raise 999  
CATEGORY: simulation-lab  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: No Admin Simulation tab (`gameTypes.ts` 482–498; `TABS` 5610–5626). Tiers preview still `SAMPLE_LEVELS = [1, 10, 25, 50, 100, 200, 500]` (`AdminDashboard.tsx` 3877). `pickEnemyLevelFromTiers` still `maxTier = Math.floor(999 / ts)` (`combatMath.ts` 58). Live fallback melee is Crush 12 / Fire Bolt 8 × `max(1, enemy.level / 5)` (WX 16710–16728). Queued #407 (`LHIPS-2026-09-22-001`) measured one-shots at player 1 from enemy **52** and player 10 from **75**, then Crush at the 1020 spawn cap (recv 1983) cannot threaten linear player HP after ~378. `WDEAD-2026-09-22-006` added 100k + family overwrite + INIT columns; it did not name Crush vs the cap. Do not treat `longHorizonSim` as the owner lab (`WDEAD-2026-09-21-005` / `007`).  
SYSTEMS_AFFECTED: proposed `engine/encounterSim.ts`; Admin Simulation tab; Tiers/Spawn preview. `longHorizonSim.ts` stays LHIPS. Not Crush / RES / spawn retune (LHIPS owns that report).  
RECOMMENDED_ACTION: Owner lab presets include 1 / 10 / 100 / 1_000 / 10_000 / 50_000 / 100_000 as unbounded hypotheticals (not a career cap). Reports add `crushOneShotAtMaxEnemy`, `crushRecvAtSpawnCap`, `pAboveWouldOneShot`, plus wave-5 mix (`WDEAD-2026-09-23-001`) and the 08-31-003 set. Do **not** raise `floor(999 / ts)` or 9999 to “fix” Crush. Do not mint INIT or call `saveBattleStats` from the lab. Spy allow-list stays 09-21-005. Bundle must not import `longHorizonSim.ts` or `mapGen.simulate.ts`.  
AUTONOMY: IMPLEMENT_WHEN_PICKED with the lab (`WDEAD-2026-08-31-003`).  
DEPENDENCIES: WDEAD-2026-08-31-003; WDEAD-2026-09-22-006; WDEAD-2026-09-21-005; WDEAD-2026-09-21-007; WDEAD-2026-09-23-001; WDEAD-2026-08-31-001; do not duplicate LHIPS-2026-09-22-001 (report-only Crush retune)  
REGRESSION_RISK: HIGH if Admin Simulation imports `runLongHorizonSim` or `redeemGameKeyThroughPersist`. HIGH if 999 is raised as an owner “uncap.” LOW for live play (lab-only).  
VALIDATION_REQUIRED: 10_000 lab rolls: zero actor credit methods, zero GameKey redeem, zero inventory writes, zero achievement unlocks, zero one-shot claims, zero Rush persist, zero INIT writes. Hypothetical 100_000 accepted without showing `floor(999 / ts)` as the intended distribution. Crush columns match LHIPS numbers when using live formulas, without calling LHIPS. `pnpm typecheck`.  
STATUS: NEW  
