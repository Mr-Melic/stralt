# ACTION_IDs — 2026-09-24 World, Dungeon & Encounter Admin Designer

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: World, Dungeon & Encounter Admin Designer.  
Design contract: [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-24.md`](./WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-24.md).  
Prior IDs (still `NEW`, do not re-issue): `WDEAD-2026-08-31-001` … `015` (013 PARTIAL — `dungeonDokaMultiplierFor` unified, depth-5 freeze remains), `WDEAD-2026-09-01-001` … `010`, `WDEAD-2026-09-02-001` … `008`, `WDEAD-2026-09-21-001` … `007` (queued [PR #337](https://github.com/Mr-Melic/stralt/pull/337)), `WDEAD-2026-09-22-001` … `007` (queued [PR #394](https://github.com/Mr-Melic/stralt/pull/394)), `WDEAD-2026-09-23-001` … `007` (queued [PR #451](https://github.com/Mr-Melic/stralt/pull/451)).  
Siblings to consume, not duplicate: `WDD-2026-09-23-001` (wave 6, [#454](https://github.com/Mr-Melic/stralt/pull/454)), `WDD-2026-09-24-001` (wave 7, [#503](https://github.com/Mr-Melic/stralt/pull/503)), FSN drop 6 (#459), elite wave 6 (#452), Rush Table E (#474), Rush Table F (#518), map preferred-room snap (#484) / dump cells (#494) / leftover portal floor (#500), `EBA-*`, `AFDA-*`.

This run ships **docs only**. Do not implement production, RAF, map generation, turn, or damage-math code from this file unless a later human or orchestrator picks an ID.

HEAD audited: `0f5363f` (unchanged since 2026-09-21). Live spawn/admin gaps from 09-23 still hold. New IDs cover catalogs and occupancy rules that did not exist when #451 filed.

Queued older siblings (do not duplicate): #334/#415 AFDA honesty copy. #337 / #394 / #451 prior WDEAD IDs.

---

ACTION_ID: WDEAD-2026-09-24-001  
SOURCE_AUTOMATION: World, Dungeon & Encounter Admin Designer  
TITLE: Owner enabledWaves must include waves 6 and 7; one roll budget — do not ship WDD dual-roll as admin policy  
CATEGORY: world-events  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: On main, `CatalogWave = 1 | 2 | 3` and `LATEST_CATALOG_WAVE = 3` (`worldFeatures.ts` 64, 115). Catalog is 52 `WF-*` ids. `pickWeightedFeatures` (1853–1871) mixes all waves into `MAX_ROLLED_FEATURES = 3` (32). WX does not import `worldFeatures`. `docs/WORLD_DYNAMICS.md` line 44 still requires the 22 live modifiers (`EXISTING_MAP_MODIFIER_IDS`, `worldFeatures.ts` 1890–1913) to roll on their own two-roll; `mapModifierRegistry.rollActiveModifiers` is a documented three-roll (`mapModifiers.ts` 646–694). Queued #344/#399/#454/#503 extend the **same** array: wave 6 (`WF-PRT-TWILIGHT_GATE`, `WF-SPL-HUSH_BEARER`, `WF-INV-SPLIT_BANNER`, …) and wave 7 (`WF-PRT-ASH_GATE`, `WF-SPL-PAGE_THIEF`, `WF-INV-QUIET_CAMP`, `WF-ELT-EVEN_PICKET`, …). `WDEAD-2026-09-23-001` asked for owner waves `{1,2,3,4,5}` when waves 6–7 did not exist. Do not fork an eighth array.  
SYSTEMS_AFFECTED: `worldFeatures.ts` picker inputs; Admin World Events; future pack; live `mapModifiers.ts` two/three-roll. Not `mapGen.ts`.  
RECOMMENDED_ACTION: Pack fields `enabledWaves` (any non-empty subset of `{1,2,3,4,5,6,7}` after #454/#503 land) and a single `worldEventCatalog` that includes `WF-*` and the 22 modifier ids. Owner sets rarity, eligibility, slot, and whether a wave is in the mix. One roll budget per map after ACTIVATE. Until then, do not overlay waves 6–7. Sim reports `catalogWave` histogram including 6 and 7. Death Realm default remains []. Rest / deathRealm enum stays `WDEAD-2026-09-01-010`. Twilight Gate, Ash Gate, Pact Gate, Wager, Latch, Flicker, Echo, Gambit, and Pilgrim stay exploration-only. Placement remains post-`finalizePlayableLayout` (WDD). Prefer DRAFT → SIMULATE → VALIDATE → ACTIVATE.  
AUTONOMY: HUMAN_APPROVE — live modifier odds are player-facing.  
DEPENDENCIES: WDEAD-2026-09-23-001; WDEAD-2026-09-22-001; WDEAD-2026-09-21-001; WDEAD-2026-09-02-003; WDEAD-2026-09-01-003; WDEAD-2026-08-31-004; WDEAD-2026-08-31-009; WDD-2026-09-23-001; WDD-2026-09-24-001  
REGRESSION_RISK: HIGH if both rolls stay independent after “wiring wave 7.” HIGH if enabling only wave 7 silently drops the 22 live modifiers or waves 1–6.  
VALIDATION_REQUIRED: Sim with waves 1–7 and maxRolled=3 shows mix ≠ 100% wave 7. Single histogram (no Crosswind + `paper_windstorm` unless both are in one budget). Twilight Gate and Ash Gate never roll in dungeon / rush / deathRealm. `worldFeatures.test.ts` stays green. No `mapGen.ts` hunk. Wallet unchanged.  
STATUS: NEW  

---

ACTION_ID: WDEAD-2026-09-24-002  
SOURCE_AUTOMATION: World, Dungeon & Encounter Admin Designer  
TITLE: Expand grantClass with hushOnKill and stealAndDisarm; Tight Grip / Iron Pulse / Long Arm / Long Shadow / Steel Hour / Solo Oath / Last Stand / Swift March / Exposed Line / Cramped Stone only via mapModifierRegistry  
CATEGORY: world-events  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Queued wave-6 `WF-SPL-HUSH_BEARER` silences that enemy’s extra `usableByEnemy` SpellConfig id for the rest of the map on kill — inverse of Rune Bearer attune, not a leftover cast, not `upgradeSpell`. Queued wave-7 `WF-SPL-PAGE_THIEF` steals that extra row then disarms the bearer (steal-and-disarm). `WF-MOD-TIGHT_GRIP` reads `SpellConfig.mpCost === 0` then costs 1 MP. `WF-ZON-IRON_PULSE` is −15% of the already-computed incoming hit (not RES). `WF-ZON-LONG_ARM` / `WF-MOD-LONG_SHADOW` are standing / map-wide non-linear +1 (metadata range; inverse Low Ceiling). `WF-EVT-STEEL_HOUR` flags no-paid-AP-spell. `WF-RSK-SOLO_OATH` is a no-living-summon wager. `WF-RSK-LAST_STAND` extreme `applyRewards` only at ≤30% max HP. `WF-EVT-SWIFT_MARCH` hard credit only if a fight never reached round 2. `WF-ENV-EXPOSED_LINE` / `WF-ENV-CRAMPED_STONE` are LoS-to-two / wall-adjacent %maxHP taxes. `WDEAD-2026-09-23-002` covered `bindWhileAlive` + Thin Air / Keen Edge / First Blood / Blood Lock / Open Vein / Crowd Press only. AGENTS.md: no damage-math edits, no name heuristics, `upgradeSpell` sole spell-level writer, hazard HP via challenge recorders.  
SYSTEMS_AFFECTED: pack `grantClass` / `combatHookId` / `rewardCurve`; `mapModifiers.ts` registry; never WX `if (feature.id)` and never `upgradeSpell`.  
RECOMMENDED_ACTION: `grantClass: none | mapAttune | oneCast | loanOneCast | copyLastCast | bindWhileAlive | hushOnKill | stealAndDisarm | observe`. `hushOnKill` / `stealAndDisarm` are in-memory, this map only, do not persist spell-level arrays. `observe` reserved. Tight Grip / Long Arm / Long Shadow read `mpCost` / `linear` / `maxRange` only. Last Stand / Swift March / Solo Oath payable preview still `WDEAD-2026-09-01-005` (clamp 100_000 / 500_000). Exposed Line / Cramped Stone / Iron Pulse HP or post-hit scale through challenge recorders / `onDamageDealt` — never `calcScaledDamage`. Twilight / Ash Gate eligibility stays exploration-only (`WDEAD-2026-09-24-001`). Fix NaN `levelZone` under `WDEAD-2026-08-31-012`, not by granting from EnemyConfig.  
AUTONOMY: HUMAN_APPROVE — combat-sensitive.  
DEPENDENCIES: WDEAD-2026-09-23-002; WDEAD-2026-09-22-004; WDEAD-2026-09-21-003; WDEAD-2026-09-02-004; WDEAD-2026-09-01-005; WDEAD-2026-09-01-006; WDEAD-2026-09-01-007; WDEAD-2026-09-24-001; WDEAD-2026-08-31-012  
REGRESSION_RISK: HIGH if hushOnKill / stealAndDisarm writes spellLevel arrays. HIGH if Tight Grip / Long Shadow uses spell **name**. HIGH if Exposed Line / Cramped Stone invent a second HP writer. MEDIUM if Last Stand / Swift March / Solo Oath mint outside `applyRewards`.  
VALIDATION_REQUIRED: Simulated hush/steal leaves canister spell upgrades unchanged. No `calcScaledDamage` hunk. Payable Last Stand / Swift March / Solo Oath / Ash Gate bonus ≤ official `applyRewards` maxima. Exposed Line / Cramped Stone spy: only challenge HP recorders. `pnpm typecheck`.  
STATUS: NEW  

---

ACTION_ID: WDEAD-2026-09-24-003  
SOURCE_AUTOMATION: World, Dungeon & Encounter Admin Designer  
TITLE: Ingest FSN drop-6 Gale Pit / Twin Kennel / Pincer Gate / Oblique File as encounter data — do not fork a third array  
CATEGORY: encounters  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Live `generateEnemies` still scatters 1..8 + depth extras, random chess piece, Chebyshev ≥ 4, then 30% family (WX 5711–5869). No formation / objective / encounter-bound rule. Queued #459 (FSN drop 6) adds Gale Pit, Twin Kennel, Pincer Gate, Oblique File, and related teaching pairs from Wave 5 family sheets (`docs/design/ENEMY_FORMATIONS_2026-09-23.md`). Wave 6 families (`#452`) are deferred in that drop. `WDEAD-2026-09-23-003` ingested day-5 + drop-5 only. Rest is still a world 10% portal (WX 4914–4934). `MAX_ENEMIES = 20`. Split Banner wants +2 elites (`WF-INV-SPLIT_BANNER`); Quiet Camp / Even Picket count as run hostiles.  
SYSTEMS_AFFECTED: proposed Admin Encounters / Dungeons tabs; `engine/encounterFormations.ts`; Simulation `destackRelocations` / `skippedForBudget`. Live `occupancy.ts` / `battleStartPlacement.ts` / `mapGen.ts` destack stay.  
RECOMMENDED_ACTION: Owner room pools and formation pickers **reference** `ENC-*` and `FSN-*` ids from those catalogs (day-1…5 / drop-1…6). VALIDATE rejects unknown `formationId`. Union overlapping helpers — one `export function` per name (restack union ≠ concatenate). Do not concatenate Wave 6 family ids onto drop-6 sheets in the same change. Formations are role offsets on walkable unique cells via `occupancy.isCellFree`, then destack may slide onto the origin fight graph; drop a slot that cannot destack. Rest-as-room / branching remain `WDEAD-2026-08-31-007`. Do not overlay FSN rooms from Admin “to try Gale Pit.” Prefer DRAFT → SIMULATE → VALIDATE → ACTIVATE.  
AUTONOMY: HUMAN_APPROVE before changing live occupancy or dungeon sequencing. Catalog ingest + sim reporting is IMPLEMENT_WHEN_PICKED with the lab.  
DEPENDENCIES: WDEAD-2026-08-31-005; WDEAD-2026-08-31-007; WDEAD-2026-09-23-003; WDEAD-2026-09-22-003; WDEAD-2026-09-21-004; WDEAD-2026-09-24-001; WDEAD-2026-09-24-006; FSN drop 6 (#459)  
REGRESSION_RISK: HIGH if destack is disabled to keep formation art. HIGH if two copies of the same helper land in one TS file (esbuild). HIGH if extras land past a portal cut.  
VALIDATION_REQUIRED: Existing destack / leftover-island / battleStartPlacement tests stay green. Sim at size=20 + Split Banner / drop-6 GATE shows skip or relocation, not overlap, not a far-island hop. No `mapGen.ts` hunk. `pnpm typecheck`.  
STATUS: NEW  

---

ACTION_ID: WDEAD-2026-09-24-004  
SOURCE_AUTOMATION: World, Dungeon & Encounter Admin Designer  
TITLE: Boss Rush owner sequencing uses namespaces 0–9 / B0–B3 / C0–C3 / D0–D3 / E0–E3 / F0–F3 — never canister roomIndex greater than 9  
CATEGORY: boss-rush  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Live `BOSS_RUSH_ROOMS` is 10 hardcoded pairs (`useBossRush.ts` 24–135). Admin enable + per-room `x` do not skip rooms. `_rewardMultiplier` is set (`useBossRush.ts` 209, 243) with zero readers. CatalogNote still claims it is read (`AdminDashboard.tsx` 7141–7146). `persistBossRushRoomClear` still `completeBossRushRoom(..., 0, 0)` (`bossRushProgress.ts` 186–191). Canister `completeBossRushRoom` returns `#err` when `roomIndex > 9` (`main.mo` 3317). Room 9 `boss2Id: "weeping_pawn_2"` is still not a `BossId`. Queued #474 adds **Table E** `E0`–`E3` after Table D (mill+conductor, counter+ivory, wedge+cinder, levy+fosse). Queued #518 adds **Table F** `F0`–`F3` after Table E (gaze / span / cover / lintel pairings). `WDEAD-2026-09-23-004` named D0–D3 only. Wave-7/8 ids stay out of live `BOSS_IDS`.  
SYSTEMS_AFFECTED: Admin Boss Rush tab; pack `bossRushPolicy` tables; official credit stays `applyRewards` after `currentRoom` advances. Not a second wallet write. Not `setBossRushProgress` with roomIndex 10–17.  
RECOMMENDED_ACTION: Owner sequencing is six namespaces: live 0–9, then B, C, D, E, F. Do not overwrite `BOSS_RUSH_ROOMS` to “add Table F.” Do not encode E/F as canister `roomIndex` 10–17 — that `#err` is a rush-length career cap. Relative scale is offset + curve versus the player (never `levelMax`). Evaluated multipliers enter `computeRewardDeltas` only after VALIDATE (`WDEAD-2026-09-01-009`); keep `completeBossRushRoom` at `(0, 0)`. CatalogNote must not claim Table E/F or `rewardMultiplier` is live until ACTIVATE. Prefer DRAFT → SIMULATE → VALIDATE → ACTIVATE.  
AUTONOMY: IMPLEMENT_WHEN_PICKED for copy / namespace fields. HUMAN_APPROVE to bind scale or multipliers into live Rush, or to change the Motoko roomIndex rail.  
DEPENDENCIES: WDEAD-2026-09-23-004; WDEAD-2026-09-22-005; WDEAD-2026-08-31-008; WDEAD-2026-09-01-009; WDEAD-2026-09-02-002; WDEAD-2026-09-01-005; #474 Table E; #518 Table F  
REGRESSION_RISK: HIGH if jackpot room remains resumable after a new credit. HIGH if canister client `dokaReward`/`xpReward` are revived. HIGH if Table E/F reuse roomIndex 0–9 / B / C / D. HIGH if Motoko `roomIndex > 9` is raised as a “fix” without a namespaced progress key.  
VALIDATION_REQUIRED: Changing Admin “x” does not change `completeBossRushRoom` args. Table E/F ids do not collide 0–9 or B–D. A drafted 14-room rush does not call `completeBossRushRoom` with roomIndex 13. Relative scale at hypothetical 50_000 does not require a stored enemy `levelMax`. Existing `bossRushProgress.test.ts` stays green.  
STATUS: NEW  

---

ACTION_ID: WDEAD-2026-09-24-005  
SOURCE_AUTOMATION: World, Dungeon & Encounter Admin Designer  
TITLE: Elite rarity is a second roll — do not concatenate Wave 6 family sheets onto live FAMILY_TYPES  
CATEGORY: spawn-admin  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Live elite flag does not exist. Variant path is equal-weight `FAMILY_TYPES` (seven ids, `spawnPolicy.ts` 49–57) at 30% (`FAMILY_VARIANT_CHANCE`). Queued #452 (Wave 6 elite evolution) specifies thirteen PROPOSED families consuming SPELL_PROPOSALS Wave 5 verbs (facing, stride mute, ally vault, two-cell span, cadence, cover, HP% lintel, act tax/bell). Those ids are **not** in `EnemyFamily`. FSN drop 6 (`#459`) packs Wave **5** families and defers Wave 6. `WDEAD-2026-09-23-005` named Wave 5 sheets + `wRare` only. Restack rule: union overlapping files keep **one** `export function` / `FAMILY_TYPES` implementation per name — concatenating two copies fails Caffeine `vite build`. Family HP/RES/SP still die at battle start (`WDEAD-2026-09-22-002` — do not re-issue). `isElite` still absent.  
SYSTEMS_AFFECTED: pack `spawnPolicy.eliteRarity` / `wRarePercent`; Admin Spawn; `EnemyFamily` type. Live seven-id overlay stays until VALIDATE.  
RECOMMENDED_ACTION: Owner elite % is a second roll, not a longer `FAMILY_TYPES` array. Optional `wRare` stays a skin weight on that roll. Ingest Wave 1–6 family **sheets** as data behind the pack; do not append ids onto the live enum in the same change as Admin. Do not smuggle Wave 6 families into FSN drop-6 helpers. Champion / elite floors sit on `computeAITier` only after ACTIVATE. Rewards stay theoretical until payable clamp (`WDEAD-2026-09-01-005`). Prefer DRAFT → SIMULATE → VALIDATE → ACTIVATE.  
AUTONOMY: HUMAN_APPROVE — live roster composition.  
DEPENDENCIES: WDEAD-2026-09-23-005; WDEAD-2026-09-22-007; WDEAD-2026-09-22-002; WDEAD-2026-08-31-011; elite waves 1–6 consume; open-PR stack union rule  
REGRESSION_RISK: HIGH if `FAMILY_TYPES` is concatenated with a second copy of the same helper. HIGH if Wave 6 families ship without `isElite` and without surviving battle-start HP (`WDEAD-2026-09-22-002`).  
VALIDATION_REQUIRED: `python3 scripts/check-duplicate-exports.py src/frontend/src` stays clean. Sim elite histogram is 0% until ACTIVATE. Live ember/tide/void hooks still see the seven-id tag. `pnpm typecheck`; `pnpm check`.  
STATUS: NEW  

---

ACTION_ID: WDEAD-2026-09-24-006  
SOURCE_AUTOMATION: World, Dungeon & Encounter Admin Designer  
TITLE: Encounter formations must compose with preferred-room far-island snap and leftover portal floor  
CATEGORY: encounters  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: On main, `collectValidEnemySpawnCells` uses hardcoded `MAP_SPAWN_CELL` (8,8) Chebyshev ≤ 3 and portal Manhattan ≤ 2 (`spawnPolicy.ts` 41–47, 183–188). `generateEnemies` can still return `[]` if `allValid` is empty (WX 5737–5861). `WDEAD-2026-09-23-006` named portal-ring last-resort (#444) and live-spawn keep-clear (#436). After #451: queued #484 snaps leftover far-island **spawn** onto the largest overworld battle component (closer-to-center on ties); #494 punches two fight-graph dump cells so a second summon cannot seal; #500 floors leftover portal tiles after punch so they cannot cut battle walk. Drop-6 Gale Pit / Pincer Gate packs assume authored cells.  
SYSTEMS_AFFECTED: proposed `engine/encounterFormations.ts`; Simulation `preferredRoomSnap` / `leftoverPortalFloored` / `portalRingLastResort` / `keepClearFollowsLiveSpawn`. Live destack / occupancy stay. Not `mapGen.ts`.  
RECOMMENDED_ACTION: Formations apply role offsets to walkable unique fight-graph cells via `occupancy.isCellFree`. Preferred-room snap may move the **player seed** off a leftover pocket — report `preferredRoomSnap` rather than treating the new room as authored COURT art. Dump-cell punches and leftover-portal floors stay; do not disable #484/#494/#500 to keep keep-clear art. Drop a slot that cannot destack; do not punch walls; do not hop a portal cut. VALIDATE fails if a dungeon room places 0 enemies. Prefer DRAFT → SIMULATE → VALIDATE → ACTIVATE.  
AUTONOMY: HUMAN_APPROVE before changing live occupancy. Reporting may ship with the lab.  
DEPENDENCIES: WDEAD-2026-09-24-003; WDEAD-2026-09-23-006; WDEAD-2026-09-22-003; WDEAD-2026-09-21-004; WDEAD-2026-09-02-007; #484 / #494 / #500 consume; do not combine with a mapGen specialist PR  
REGRESSION_RISK: HIGH if destack, preferred-room snap, or leftover-portal floor is disabled to keep formation art. HIGH if extras land on the portal tile or the far island. HIGH if last-resort is used to skip dungeon rooms again.  
VALIDATION_REQUIRED: Existing destack / leftover-island / keep-clear / portal-ring / preferred-room tests stay green when those PRs land. Sim at size=20 on a leftover far-island seed shows ≥ 1 hostile on the preferred room and reports snap instead of overlap. No `mapGen.ts` hunk. `pnpm typecheck`.  
STATUS: NEW  

---

ACTION_ID: WDEAD-2026-09-24-007  
SOURCE_AUTOMATION: World, Dungeon & Encounter Admin Designer  
TITLE: Encounter objectives on the owner pack are relative — DEFAULT_CHALLENGES absolute 50-damage / 15-turn gates are not indefinite-progression policy  
CATEGORY: encounters  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Live battles pick a uniform `DEFAULT_CHALLENGES` row (WX 12210–12218). Easy `under_50_damage` requires `totalDamage < 50`; hard `no_healing_under_30_damage` uses 30; legendary `no_damage_taken` is absolute 0 (`challengeCompletion.ts` 44–109, 115–129). Turn gates are 15 / 10 / 5. AP gate is 8 per turn. Rewards are flat 50–500 Doka / 400–1000 XP (`WDEAD-2026-08-31-010` covered the flat purse, not the condition). Linear max HP is `100 * (1 + (level-1)*0.05)` — at hypothetical level 50_000, 50 damage is a rounding error, so “take less than 50” is free while “no damage” stays binary. Owner mandate includes encounter **objectives**. No prior WDEAD ID named the absolute HP/turn rails. Lab must not credit challenge Doka (`WDEAD-2026-09-21-005`).  
SYSTEMS_AFFECTED: pack `encounterObjectives`; Admin Encounters tab; Simulation objective-pass histogram. Live `DEFAULT_CHALLENGES` stays until VALIDATE. Not RAF, not damage math.  
RECOMMENDED_ACTION: Owner objectives are relative: damage budget as a fraction of **current max HP**, turn budget as a multiple of roster size / AI tier, AP budget as a fraction of the caster’s max AP. Rare/elite/formation tags may bind an objective id. Payable preview still `WDEAD-2026-09-01-005`. Do not retune live `under_50_damage` in this program to “fix” high-level play. Do not present EnemyConfig HP as the objective baseline. Prefer DRAFT → SIMULATE → VALIDATE → ACTIVATE so a relative objective cannot mint.  
AUTONOMY: HUMAN_APPROVE — challenge completion is player-facing. Copy-only “these conditions are absolute, not owner knobs” is IMPLEMENT_WHEN_PICKED.  
DEPENDENCIES: WDEAD-2026-08-31-005; WDEAD-2026-08-31-010; WDEAD-2026-09-01-005; WDEAD-2026-09-21-005; WDEAD-2026-09-24-003  
REGRESSION_RISK: HIGH if live Untouchable / Striker / Blitz conditions are rewritten without a draft activate. HIGH if the lab calls `applyRewards` for a simulated challenge pass. MEDIUM if %maxHP objectives make early-game easy challenges impossible.  
VALIDATION_REQUIRED: Sim at hypothetical 1 and 50_000 reports relative objective pass rates without writing wallet, feats, or `pbv_*`. Changing a draft damage-fraction does not change live `under_50_damage` until ACTIVATE. Existing `challengeCompletion.test.ts` stays green. `pnpm typecheck`.  
STATUS: NEW  
