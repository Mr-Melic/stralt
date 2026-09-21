# ACTION_IDs — 2026-09-21 World, Dungeon & Encounter Admin Designer

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: World, Dungeon & Encounter Admin Designer.  
Design contract: [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-21.md`](./WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-21.md).  
Prior IDs (still `NEW`, do not re-issue): `WDEAD-2026-08-31-001` … `015` (013 PARTIAL — `dungeonDokaMultiplierFor` unified, depth-5 freeze remains), `WDEAD-2026-09-01-001` … `010`, `WDEAD-2026-09-02-001` … `008`.  
Siblings to consume, not duplicate: `WDD-2026-08-31-001`, `WDD-2026-09-01-001`, `WDD-2026-09-02-001`, `LHIPS-*`, `EBA-*`, `EED-*` / `ENC-*`, `FSN-*`, `AFDA-*`.

This run ships **docs only**. Do not implement production, RAF, map generation, turn, or damage-math code from this file unless a later human or orchestrator picks an ID.

HEAD audited: `0f5363f`.

Queued older siblings (do not duplicate): #334 `AFDA-2026-09-21-026` (Tiers leftover / unused Rush multiplier **copy**). That honesty does not implement relative spawn knobs, the Simulation Lab, or wave-3 owner mix.

---

ACTION_ID: WDEAD-2026-09-21-001  
SOURCE_AUTOMATION: World, Dungeon & Encounter Admin Designer  
TITLE: Owner enabledWaves must include wave 3; one roll budget — do not ship WDD dual-roll as admin policy  
CATEGORY: world-events  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Catalog is 52 `WF-*` ids (`worldFeatures.ts` 165–1694): wave 1 omits `catalogWave`; wave 2 sets `catalogWave: 2` (16 ids); wave 3 sets `catalogWave: 3` (16 ids, tests at `worldFeatures.test.ts` 154–157). `LATEST_CATALOG_WAVE = 3` (`worldFeatures.ts` 115). `featuresInCatalogWave` exists (1711–1713) but `pickWeightedFeatures` (1853–1871) / slot filter mix all waves into `MAX_ROLLED_FEATURES = 3` (32). `docs/WORLD_DYNAMICS.md` still requires the 22 live modifiers to roll on their own two-roll. WX does not import `worldFeatures`. `WDEAD-2026-09-02-003` asked for owner `catalogWave` when the catalog was 36 ids; wave 3 landed more hardcoded rows (`WDD-2026-09-02-001` DESIGNED) and reaffirmed dual-roll. Do not fork a fourth array.  
SYSTEMS_AFFECTED: `worldFeatures.ts` picker inputs; Admin World Events; future pack; live `mapModifiers.ts` two-roll. Not `mapGen.ts`.  
RECOMMENDED_ACTION: Pack fields `enabledWaves` (any non-empty subset of `{1,2,3}`) and a single `worldEventCatalog` that includes `WF-*` and the 22 modifier ids. Owner sets rarity, eligibility, slot, and whether a wave is in the mix. One roll budget per map after ACTIVATE. Until then, do not overlay wave 3. Sim reports `catalogWave` histogram so dilution is visible. Death Realm default remains []. Rest / deathRealm enum stays `WDEAD-2026-09-01-010`. Latch Gate stays exploration-only. Placement remains post-`finalizePlayableLayout` (WDD). Prefer DRAFT → SIMULATE → VALIDATE → ACTIVATE.  
AUTONOMY: HUMAN_APPROVE — live modifier odds are player-facing.  
DEPENDENCIES: WDEAD-2026-09-02-003; WDEAD-2026-09-01-003; WDEAD-2026-08-31-004; WDEAD-2026-08-31-009; WDD-2026-08-31-001; WDD-2026-09-01-001; WDD-2026-09-02-001  
REGRESSION_RISK: HIGH if both rolls stay independent after “wiring wave 3.” HIGH if enabling only wave 3 silently drops the 22 live modifiers or waves 1–2.  
VALIDATION_REQUIRED: Sim with waves 1+2+3 and maxRolled=3 shows mix ≠ 100% wave 3. Single histogram (no Crosswind + `paper_windstorm` unless both are in one budget). `worldFeatures.test.ts` stays green. No `mapGen.ts` hunk. Wallet unchanged.  
STATUS: NEW  

---

ACTION_ID: WDEAD-2026-09-21-002  
SOURCE_AUTOMATION: World, Dungeon & Encounter Admin Designer  
TITLE: Wrap live spawnPolicy.ts as draft defaults — tests currently lock depth-5 / 30% family / 1–8 size ceilings  
CATEGORY: spawn-admin  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `WDEAD-2026-08-31-001` asked implementers to extract pickers to `engine/spawnPolicy.ts`. That extract landed (`7fd4013`). WX `generateEnemies` (5711–5869) now calls `dungeonSpawnExtras`, `rollOverworldEnemyCount`, `collectValidEnemySpawnCells`, `dungeonScaledEnemyLevel`, `applyFamilyVariantsToRoster`. The module is live policy, not owner knobs: `DUNGEON_SPAWN_DEPTH_CAP = 5` (`spawnPolicy.ts` 26–29), `OVERWORLD_ENEMY_COUNT_SPAN = 8` (32), `FAMILY_VARIANT_CHANCE = 0.3` (35), equal-weight `FAMILY_TYPES` (49–57). `spawnPolicy.test.ts` 63–84 requires `dungeonSpawnExtras(99) === dungeonSpawnExtras(5)`. `spawnPolicy.test.ts` 239 locks `FAMILY_VARIANT_CHANCE === 0.3`. Tiers tab still four buckets (`AdminDashboard.tsx` 3809+). `pickEnemyLevelFromTiers` still `maxTier = floor(999 / ts)` (`combatMath.ts` 58). No equal/above first-class fields. Queued #334 adds a Tiers CatalogNote that **names** the leftover ±3+ and 999 clamp — honesty, not owner knobs (`AFDA-2026-09-21-026`).  
SYSTEMS_AFFECTED: `engine/spawnPolicy.ts` (wrap as draft defaults); Admin Spawn tab; future pack `spawnPolicy`. Live WX generate stays until VALIDATE. Not RAF, not damage math.  
RECOMMENDED_ACTION: Treat current `spawnPolicy.ts` exports as the **draft default** snapshot. Owner fields from `WDEAD-2026-08-31-002` / `011` (equal-level, above-level, open tail, elite %, variant %, size `{min,max,depthCurve}`, family weights, advanced-spell %, AI-sophistication %) overlay those defaults after ACTIVATE. Do not fork a second extras / family table in WX or Admin. Do not present the extracted constants as already owner-configurable. Prefer DRAFT → SIMULATE → VALIDATE → ACTIVATE so a save cannot imply activate. Board-safety `SPAWN_MIN_CHEBYSHEV = 4` / portal Manhattan ≤ 2 / spawn Chebyshev ≤ 3 stay named constants (do not merge metrics).  
AUTONOMY: HUMAN_APPROVE — live spawn. Copy-only “these constants are live defaults, not knobs” is IMPLEMENT_WHEN_PICKED.  
DEPENDENCIES: WDEAD-2026-08-31-001; WDEAD-2026-08-31-002; WDEAD-2026-08-31-011; WDEAD-2026-08-31-004; WDEAD-2026-09-21-006  
REGRESSION_RISK: HIGH if Admin writes a parallel extras table and WX keeps calling the frozen helper. HIGH if `dungeonSpawnExtras(99) === extras(5)` is left green after an unbounded curve activates.  
VALIDATION_REQUIRED: Draft sim at hypothetical level 50_000 uses wrapped pickers, not `maxTier = floor(999 / ts)`. Changing only a draft variant % does not change live 30% until ACTIVATE. Existing destack / leftover-island tests stay green. `pnpm typecheck`; `pnpm check`.  
STATUS: NEW  

---

ACTION_ID: WDEAD-2026-09-21-003  
SOURCE_AUTOMATION: World, Dungeon & Encounter Admin Designer  
TITLE: Expand grantClass with loanOneCast; Short Fuse / Harvest Moon / Isolation Chill / Stillness Oath only via mapModifierRegistry  
CATEGORY: world-events  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `WF-SPL-LOANER_MAGE` (`worldFeatures.ts` 1550–1578) specifies adjacent 1 AP to loan one remaining cast this map without a kill; killing grants the same one-cast and does not stack; “do not call upgradeSpell.” That is not Grimoire Stalker’s kill-for-oneCast (`WF-SPL-GRIMOIRE_STALKER` 1071+) and not Rune Bearer’s full-map attune. `WF-MOD-SHORT_FUSE` (1610–1624) locks `SpellConfig.cooldown > 0` on round 1 — metadata only. `WF-EVT-HARVEST_MOON` (1639–1664) flags next `applyRewards` if current/max HP never dropped below 70%. `WF-RSK-STILLNESS_OATH` (1581–1607) flags next hard multiplier unless an MP spend clears it. `WF-ENV-ISOLATION_CHILL` (1667+) is a Chebyshev-3 % max-HP tax. `WDEAD-2026-09-02-004` covered `oneCast` + Scourge/Echo only. No live `observeSpell` path exists. AGENTS.md: no damage-math edits, no name heuristics, `upgradeSpell` sole spell-level writer, hazard HP via challenge recorders.  
SYSTEMS_AFFECTED: pack `grantClass` / `combatHookId` / `rewardCurve`; `mapModifiers.ts` registry; never WX `if (feature.id)` and never `upgradeSpell`.  
RECOMMENDED_ACTION: `grantClass: none | mapAttune | oneCast | loanOneCast | observe`. `loanOneCast` is in-memory, this map only, 1 AP adjacent, does not persist spell-level arrays, does not stack with a later kill-grant of the same id. `observe` reserved. Short Fuse reads `cooldown` only. Isolation Chill taxes through `recordChallengeDamageTaken` / `recordInBattleChallengeDamage`. Harvest Moon / Stillness Oath payable preview still `WDEAD-2026-09-01-005` (clamp 100_000 / 500_000). Fix NaN `levelZone` under `WDEAD-2026-08-31-012`, not by granting from EnemyConfig.  
AUTONOMY: HUMAN_APPROVE — combat-sensitive.  
DEPENDENCIES: WDEAD-2026-09-02-004; WDEAD-2026-09-01-006; WDEAD-2026-09-01-007; WDEAD-2026-09-01-005; WDEAD-2026-09-21-001; WDEAD-2026-08-31-012  
REGRESSION_RISK: HIGH if loanOneCast writes spellLevel arrays. HIGH if Short Fuse uses spell **name**. HIGH if Isolation Chill invents a second HP writer. MEDIUM if Harvest Moon / Stillness Oath mint outside `applyRewards`.  
VALIDATION_REQUIRED: Simulated loaner kill/loan leaves canister spell upgrades unchanged. No `calcScaledDamage` hunk. Payable Harvest/Stillness bonus ≤ official `applyRewards` maxima. Isolation Chill spy: only challenge HP recorders. `pnpm typecheck`.  
STATUS: NEW  

---

ACTION_ID: WDEAD-2026-09-21-004  
SOURCE_AUTOMATION: World, Dungeon & Encounter Admin Designer  
TITLE: Encounter formations and WF extra enemies must compose with occupancy.ts and fight-graph destack  
CATEGORY: encounters  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: After `WDEAD-2026-09-02-007`, occupancy was extracted to `engine/occupancy.ts` (header: single `isCellFree` source) and battle-start unique cells to `engine/battleStartPlacement.ts`. WX `checkBattleTrigger` calls `findBattleStartCell` for the player (≥3) then each enemy (≥2), adding each result to `placed` (WX 11858–11890) so stacking is impossible. `mapGen.destackSpawns` (741+) still relocates bodies onto the origin reachable component; later commits keep hostiles on the player’s side of a portal and corridor dump cells on the fight graph. `generateEnemies` still scatters with Chebyshev ≥ 4 then 30% family (`spawnPolicy.ts`). Scripted formations (`FSN-*`) and `WF-INV-WARBAND` / `WF-INV-SLEEPING_VANGUARD` (+2 cots) assume authored cells. Destack can erase formation geometry and skip extras at `MAX_ENEMIES`. AGENTS.md: do not edit mapGen / RAF to implement this program.  
SYSTEMS_AFFECTED: proposed `engine/encounterFormations.ts`; WF extra-enemy placement; Simulation `destackRelocations` report. Live `occupancy.ts` / `battleStartPlacement.ts` / `mapGen.ts` destack stay.  
RECOMMENDED_ACTION: Formations are role offsets applied to **walkable unique** cells via `occupancy.isCellFree`, then battle-start destack may slide a slot to the nearest legal cell on the **origin fight graph**; if a slot cannot destack, drop that slot (do not punch walls, do not hop a portal cut). Sim reports `destackRelocations` per formation id / WF id. Validate solvability after destack. Do not grow a third occupancy helper. Do not revert destack tests. Consume `FSN-*` / `EED-*` room sheets as data, do not duplicate catalogs.  
AUTONOMY: HUMAN_APPROVE before changing live occupancy. Reporting may ship with the lab.  
DEPENDENCIES: WDEAD-2026-09-02-007; WDEAD-2026-08-31-005; WDEAD-2026-09-01-004; FSN-* / EED-* (consume); do not combine with a mapGen specialist PR (#331 destack)  
REGRESSION_RISK: HIGH if destack is disabled to “keep formation art.” HIGH if Warband / Sleeping Vanguard ignores unique occupancy and stacks. HIGH if extras land on the far side of a portal cut.  
VALIDATION_REQUIRED: Existing destack / leftover-island / battleStartPlacement tests stay green. Sim at size=20 + Warband / Vanguard shows skip or relocation, not overlapping cells, not a far-island hop. No `mapGen.ts` hunk from this ID. `pnpm typecheck`.  
STATUS: NEW  

---

ACTION_ID: WDEAD-2026-09-21-005  
SOURCE_AUTOMATION: World, Dungeon & Encounter Admin Designer  
TITLE: Simulation Laboratory isolation — do not import LHIPS or mapGen.simulate; spy feats, one-shot Doka, GameKey, Rush persist  
CATEGORY: simulation-lab  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `longHorizonSim.ts` is still the LHIPS CLI (header 1–6). `STRESS_LEVELS` now includes 10_000 / 50_000 (82–85) and still reports `dungeonMultiplierAtDepth5` (561). `mapGen.simulate.ts` header (1–5) is a seeded replica of WX `generateRandomMap` / `generateEnemies` for solvability tests — more tempting to “reuse for science” than it was when it was map-only. Neither is the owner lab (`WDEAD-2026-08-31-003`, `WDEAD-2026-09-01-002`). Since 09-02, Boss Rush room-clear fires victory feats, one-shot Doka uses claim/settle, and GameKey `redeemGameKey` is an official persist credit. `WDEAD-2026-09-02-006` named GameKey only. A lab that remounts shop, recap, or one-shot helpers can mint or unlock.  
SYSTEMS_AFFECTED: proposed `engine/encounterSim.ts`; Admin Simulation tab; must not import `longHorizonSim.ts`, `mapGen.simulate.ts`, `shopPurchase.ts` credit helpers, or WX `generateEnemies`.  
RECOMMENDED_ACTION: Spy allow-list fails on `applyRewards`, `saveBattleStats`, `upgradeSpell`, `claimAchievementReward`, `processPendingPurchases`, `redeemGameKey`, persist `commit`, `markAchievementUnlocked` / recap unlock attach, one-shot Doka claim / `settleOneShotAfterCredit`, `completeBossRushRoom` / `setBossRushProgress` / `resetBossRush`, and `pbv_*` / inventory keys. Lab may **display** theoretical vs payable encounter rewards (`WDEAD-2026-09-01-005`) without calling those methods. Do not import `runLongHorizonSim`, `ensureLocalStorage`, or `mapGen.simulate`. Operator GameKey approval stays on the Purchases tab.  
AUTONOMY: IMPLEMENT_WHEN_PICKED with the lab (`WDEAD-2026-08-31-003`).  
DEPENDENCIES: WDEAD-2026-08-31-003; WDEAD-2026-09-01-002; WDEAD-2026-09-02-006; WDEAD-2026-09-21-007  
REGRESSION_RISK: HIGH if Admin Simulation imports `mapGen.simulate.ts` (live generateEnemies replica) or `redeemGameKeyThroughPersist`. HIGH if feat unlocks fire from simulated Rush clears. LOW for live play (lab-only).  
VALIDATION_REQUIRED: 10_000 lab rolls: zero actor credit methods, zero GameKey redeem, zero inventory writes, zero achievement unlocks, zero one-shot claims, zero Rush persist. Hypothetical level 50_000 accepted. Admin Simulation bundle does not import `longHorizonSim.ts` or `mapGen.simulate.ts`. `pnpm typecheck`.  
STATUS: NEW  

---

ACTION_ID: WDEAD-2026-09-21-006  
SOURCE_AUTOMATION: World, Dungeon & Encounter Admin Designer  
TITLE: One owner dungeon curve for extras and Doka — two depth-5 freezes cannot diverge  
CATEGORY: dungeons  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `dungeonDokaMultiplierFor` (`portalRules.ts` 148–161) still `Math.min(safeDepth, 5)` → 4.0× (tested `portalRules.test.ts` 113). Spawn extras now live in `spawnPolicy.dungeonSpawnExtras` (`spawnPolicy.ts` 26–29, 141–148) with `DUNGEON_SPAWN_DEPTH_CAP = 5` and test `dungeonSpawnExtras(99) === dungeonSpawnExtras(5)` (`spawnPolicy.test.ts` 84). WX `generateEnemies` uses the extras helper (5720–5722) while HUD / dungeon state / LHIPS use the Doka helper. `WDEAD-2026-09-02-008` unlocked the Doka editor on the unified Doka table only. Chain length is still 3–5 (WX 6232, 6324). If only Doka is unbounded, depth 6+ pays more on the same roster.  
SYSTEMS_AFFECTED: `portalRules.ts` multiplier helper; `spawnPolicy.ts` extras/boost table; Admin Dungeons tab; Simulation dungeon report. Not a second `applyRewards`.  
RECOMMENDED_ACTION: Pack `dungeonPolicy` holds one unbounded curve (or two named curves on the same pack: `dokaMultiplierCurve` and `spawnExtrasCurve`) that **both** helpers read after ACTIVATE. Owner preview shows theoretical vs payable (`WDEAD-2026-09-01-005`). Activating the curve rewrites both freeze tests. Do not add a third copy in WX. Do not treat LHIPS `dungeonMultiplierAtDepth5` as the owner default. Rest-as-room and branching remain `WDEAD-2026-08-31-007`. Keep `snapshotDungeonChain` before `cleanupMap`.  
AUTONOMY: HUMAN_APPROVE — economy + live roster size.  
DEPENDENCIES: WDEAD-2026-09-02-008; WDEAD-2026-08-31-013 (unify done — consume); WDEAD-2026-08-31-007; WDEAD-2026-09-21-002; WDEAD-2026-09-01-005; WDEAD-2026-08-31-004  
REGRESSION_RISK: HIGH if HUD Doka, persist Doka, extras, and boost diverge. HIGH if sim credits dungeon bonus. HIGH if extras(99) test is left asserting clamp after activate.  
VALIDATION_REQUIRED: Depth 6+ in sim is not clamped to the depth-5 extras cell **or** the depth-5 Doka cell. Official dungeon-complete bonus still claims a one-shot id then `applyRewards`. Lab spy: zero credits. `pnpm typecheck`.  
STATUS: NEW  

---

ACTION_ID: WDEAD-2026-09-21-007  
SOURCE_AUTOMATION: World, Dungeon & Encounter Admin Designer  
TITLE: LHIPS 10k/50k samples do not close the owner Simulation Lab overflow contract  
CATEGORY: simulation-lab  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `WDEAD-2026-09-01-008` required unbounded hypothetical level on the **owner** lab and Tiers preview, including 50_000. After 09-02, LHIPS `STRESS_LEVELS` gained `10_000, 50_000` (`longHorizonSim.ts` 82–85) and still reuses live capped pickers (`pickEnemyLevelFromTiers` / `computeAITier` still 999 / tier-10). Tiers preview is still `SAMPLE_LEVELS = [1, 10, 25, 50, 100, 200, 500]` (`AdminDashboard.tsx` 3877). `tierSize` input `max={100}` (3959). Admin has no Simulation tab (`gameTypes.ts` 482–498; `TABS` 5610–5626). An implementer reading LHIPS logs can mark 008 done. `longHorizonSim.test.ts` 51 also locks `summonerChance(44) >= 1` — 100% summoner packs as “correct” at modest levels.  
SYSTEMS_AFFECTED: Admin Simulation tab / Tiers preview (owner overflow); `longHorizonSim.ts` stays LHIPS. Not live spawn until VALIDATE.  
RECOMMENDED_ACTION: Keep LHIPS as an engineer CLI. Owner lab presets include 1 / 10 / 100 / 1_000 / 10_000 / 50_000 and must not clamp to `floor(999 / tierSize)`. Tiers (or Spawn) preview accepts an arbitrary hypothetical level. Do not treat `summonerChance(44) >= 1` as the owner AI policy — owner sophistication is a probability (`WDEAD-2026-08-31-011` / `012`), not an unclamped linear that saturates. File header / Admin copy: “LHIPS is not the owner Simulation Lab.”  
AUTONOMY: IMPLEMENT_WHEN_PICKED with the lab and Tiers preview. Labeling of `longHorizonSim` is IMPLEMENT_WHEN_PICKED.  
DEPENDENCIES: WDEAD-2026-09-01-008; WDEAD-2026-09-01-002; WDEAD-2026-08-31-003; WDEAD-2026-09-21-005; WDEAD-2026-08-31-012  
REGRESSION_RISK: MEDIUM if Tiers preview at 50_000 is wired to live `pickEnemyLevelFromTiers` and silently shows the 999 cap as the distribution. HIGH if Admin calls `runLongHorizonSim` in a player session.  
VALIDATION_REQUIRED: Owner preview/sim at 50_000 does not clamp the hypothetical input. LHIPS tests may keep 10k/50k samples without counting as this gate. Admin Simulation bundle still does not import `longHorizonSim.ts`. `pnpm typecheck`.  
STATUS: NEW  
