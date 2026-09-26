# ACTION_IDs — 2026-09-26 World, Dungeon & Encounter Admin Designer

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: World, Dungeon & Encounter Admin Designer.  
Design contract: [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-26.md`](./WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-26.md).  
Prior IDs (still `NEW`, do not re-issue): `WDEAD-2026-08-31-001` … `015` (013 PARTIAL — `dungeonDokaMultiplierFor` unified, depth-5 freeze remains), `WDEAD-2026-09-01-001` … `010`, `WDEAD-2026-09-02-001` … `008`, `WDEAD-2026-09-21-001` … `007` (queued [PR #337](https://github.com/Mr-Melic/stralt/pull/337)), `WDEAD-2026-09-22-001` … `007` (queued [PR #394](https://github.com/Mr-Melic/stralt/pull/394)), `WDEAD-2026-09-23-001` … `007` (queued [PR #451](https://github.com/Mr-Melic/stralt/pull/451)), `WDEAD-2026-09-24-001` … `007` (queued [PR #534](https://github.com/Mr-Melic/stralt/pull/534)), `WDEAD-2026-09-25-001` … `008` (queued [PR #593](https://github.com/Mr-Melic/stralt/pull/593)).  
Siblings to consume, not duplicate: `WDD-2026-09-21-001`…`WDD-2026-09-25-001` (waves 4–8, [#344](https://github.com/Mr-Melic/stralt/pull/344) / [#399](https://github.com/Mr-Melic/stralt/pull/399) / [#454](https://github.com/Mr-Melic/stralt/pull/454) / [#503](https://github.com/Mr-Melic/stralt/pull/503) / [#578](https://github.com/Mr-Melic/stralt/pull/578)), FSN drops 7–8 ([#537](https://github.com/Mr-Melic/stralt/pull/537) / [#575](https://github.com/Mr-Melic/stralt/pull/575)), EED rooms ([#479](https://github.com/Mr-Melic/stralt/pull/479) / [#519](https://github.com/Mr-Melic/stralt/pull/519) / [#574](https://github.com/Mr-Melic/stralt/pull/574)), elite waves 7–8 ([#535](https://github.com/Mr-Melic/stralt/pull/535) / [#558](https://github.com/Mr-Melic/stralt/pull/558)), Rush Tables E–G ([#474](https://github.com/Mr-Melic/stralt/pull/474) / [#518](https://github.com/Mr-Melic/stralt/pull/518) / [#572](https://github.com/Mr-Melic/stralt/pull/572)), jackpot complete(9) ([#536](https://github.com/Mr-Melic/stralt/pull/536)), map white-split / destack / generate dump ([#538](https://github.com/Mr-Melic/stralt/pull/538) / [#542](https://github.com/Mr-Melic/stralt/pull/542) / [#548](https://github.com/Mr-Melic/stralt/pull/548) / [#553](https://github.com/Mr-Melic/stralt/pull/553)), destack dump ([#589](https://github.com/Mr-Melic/stralt/pull/589) / [#600](https://github.com/Mr-Melic/stralt/pull/600) / [#603](https://github.com/Mr-Melic/stralt/pull/603)), wander dump ([#591](https://github.com/Mr-Melic/stralt/pull/591) / [#608](https://github.com/Mr-Melic/stralt/pull/608)), Death Realm pending credits ([#576](https://github.com/Mr-Melic/stralt/pull/576) / [#595](https://github.com/Mr-Melic/stralt/pull/595) / [#602](https://github.com/Mr-Melic/stralt/pull/602) / [#604](https://github.com/Mr-Melic/stralt/pull/604)), modifier identity ([#605](https://github.com/Mr-Melic/stralt/pull/605)), SpellSummonFields ([#564](https://github.com/Mr-Melic/stralt/pull/564) — do not re-issue `AUX-*`), `EBA-*`, `AFDA-*`, `TBC-*`.

This run ships **docs only**. Do not implement production, RAF, map generation, turn, or damage-math code from this file unless a later human or orchestrator picks an ID.

HEAD audited: `0f5363f` (unchanged since 2026-09-21). Live spawn/admin gaps from 09-25 still hold. New IDs cover occupancy epochs and persist/admin rails that did not exist when #593 filed. Do not invent WDD wave 9 or Rush Table H.

Queued older siblings (do not duplicate): #334/#415/#585 AFDA honesty copy. #337 / #394 / #451 / #534 / #593 prior WDEAD IDs.

---

ACTION_ID: WDEAD-2026-09-26-001  
SOURCE_AUTOMATION: World, Dungeon & Encounter Admin Designer  
TITLE: Encounter formations must compose with destack-occupied dump punch and wander-occupied dump punch  
CATEGORY: encounters  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `WDEAD-2026-09-25-006` named generate-time occupied-alcove dump (#538), punch-then-finalize (#542), white-gateway re-legalize (#548), and portal-seeded destack (#553). After #593: queued #589 punches a dump alcove after battle-start destack consumes the last free dump (`battleStartDump.ts`); #600 restores dump floor 2 after destack occupies one alcove (`battleStartDumpFloor.ts`); #603 punches when destack occupies every dump cell (`battleStartFreeDump.ts` — #600 no-ops when unique bridges still report dump ≥ 2); #608 punches when **overworld wander** sits hostiles on generate-time dump cells (`enemyWanderDump.ts`). #538 / destack dump helpers do not treat wandered bodies as occupants. #591 extracts `advanceEnemyWander`; #608 is not wired into WX yet. Live `generateEnemies` still scatters 1..8 + depth extras, Chebyshev ≥ 4, then 30% family (WX 5711–5869). Drop-8 COURT / Face Court / `WF-INV-WARBAND` assume authored cells.  
SYSTEMS_AFFECTED: proposed `engine/encounterFormations.ts`; Simulation `destackOccupiedDumpPunch` / `dumpFloor2AfterDestack` / `wanderOccupiedDumpPunch`. Live destack / occupancy / queued dump helpers stay. Not `mapGen.ts`. Not RAF.  
RECOMMENDED_ACTION: Formations apply role offsets to walkable unique fight-graph cells via `occupancy.isCellFree`. VALIDATE epochs are generate → destack → destack-dump → (overworld) wander-dump. Report the three new columns rather than treating punched floor as authored COURT art. Drop a slot that cannot destack; do not punch walls; do not hop a portal cut; do not disable #589/#600/#603/#608 to keep keep-clear art. Punch-then-finalize stays (#542). White-split / portal-seeded destack stay `WDEAD-2026-09-25-006`. Prefer DRAFT → SIMULATE → VALIDATE → ACTIVATE.  
AUTONOMY: HUMAN_APPROVE before changing live occupancy. Reporting may ship with the lab.  
DEPENDENCIES: WDEAD-2026-09-25-006; WDEAD-2026-09-25-003; WDEAD-2026-09-02-007; WDEAD-2026-09-26-004; #589 / #600 / #603 / #608 / #591 consume; do not combine with a mapGen specialist PR  
REGRESSION_RISK: HIGH if destack-dump or wander-dump is disabled to keep formation art. HIGH if extras land on a punched dump cell, the white gateway tile, or a far island. HIGH if two copies of the same dump helper land in one TS file (esbuild).  
VALIDATION_REQUIRED: Existing destack / leftover-island / keep-clear / white-split / occupied-dump tests stay green when those PRs land. Sim at size=20 after destack-onto-dump and wander-onto-dump shows skip or relocation, free dump ≥ 1, and no leftover-island join. No `mapGen.ts` hunk. `pnpm typecheck`.  
STATUS: NEW  

---

ACTION_ID: WDEAD-2026-09-26-002  
SOURCE_AUTOMATION: World, Dungeon & Encounter Admin Designer  
TITLE: Death Realm pending is a persist quarantine — owner rest/shop/feat/GameKey/heal/rename/upgrade events are ineligible until the timer fires  
CATEGORY: world-events  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `WDEAD-2026-09-01-010` / `WDEAD-2026-09-25-001` named `deathRealm` and `whiteSanctuary` as **map** eligibility. Live `pickWeightedFeatures` returns `[]` for `runMode === "deathRealm"` (`worldFeatures.ts` 1858). `isFeatureAllowedInContext` hard-returns false (1768–1769). Portals and encounters already use `isDeathRealmTransitionPending` (`deathGuards.ts` 36–41; `deathGuards.test.ts` 55–58). `persistDeathPenalty` restores respawn HP in the same death tick (31–34), then waits 1.5s (exploration) / 300ms (in-battle lava). App-root recap is `pointer-events: none`, so HUD Trophy / Buy Doka stay clickable. Queued #576 skips Doka-to-HP; #595 skips Items Buy; #602 skips rename / `upgradeSpell`; #604 skips `claimAchievementReward` / `redeemGameKey` (`deathRealmPendingCredit.ts`) because those credits enqueue after the 20/40 snapshot and a later recap heal `saveBattleStats` can persist the untaxed grant through Death Realm load. `WDEAD-2026-09-02-006` / `WDEAD-2026-09-21-005` listed credit spies; they did not name **pending** as an owner eligibility mode.  
SYSTEMS_AFFECTED: pack World Events / rest-room / shop eligibility; Simulation `deathRealmPendingBlocks`; must not write `pbv_pending_death_penalty_*` or arm `deathTriggered`. Live portal/encounter guards stay. Official credit path stays `applyRewards` after victory / `redeemGameKey` after the timer.  
RECOMMENDED_ACTION: Owner eligibility adds `deathRealmPending` (default: no `WF-*`, no rest-shop, no feat claim, no GameKey, no Doka-to-HP, no rename, no `upgradeSpell`, no `applyRewards`). Distinct from Death Realm **map** (already []). Rest-as-room remains `WDEAD-2026-08-31-007`. Lab spy fails on the #604 gates plus `pbv_pending_death_penalty_*`. Do not raise the 1.5s timer as a difficulty knob. Do not treat pending as a player-level cap. Prefer DRAFT → SIMULATE → VALIDATE → ACTIVATE.  
AUTONOMY: HUMAN_APPROVE — persist and economy. Honesty copy that pending is not “Death Realm map” is IMPLEMENT_WHEN_PICKED.  
DEPENDENCIES: WDEAD-2026-09-01-010; WDEAD-2026-09-25-001; WDEAD-2026-09-02-006; WDEAD-2026-09-21-005; WDEAD-2026-09-01-005; #576 / #595 / #602 / #604 consume  
REGRESSION_RISK: HIGH if a drafted rest-shop or `rewardPath: applyRewards` event fires during pending and survives Death Realm load. HIGH if the lab writes unpaid-death keys or calls `redeemGameKey` “to preview.” MEDIUM if pending is folded into `WorldFeatureRunMode` as a fourth live map (it is a timer, not a map).  
VALIDATION_REQUIRED: Sim with `deathRealmPending=true` rolls 0 world events, 0 rest-shop, 0 feat/GameKey/heal/upgrade. 10_000 lab rolls: zero actor credit methods, zero `pbv_pending_death_penalty_*` writes. After the timer fires, live claim/redeem still work (do not keep the skip). Wallet unchanged by the lab. `pnpm typecheck`.  
STATUS: NEW  

---

ACTION_ID: WDEAD-2026-09-26-003  
SOURCE_AUTOMATION: World, Dungeon & Encounter Admin Designer  
TITLE: One world-event catalog VALIDATE rejects map-modifier id/type mismatches — WF-* ids stay WF-*  
CATEGORY: world-events  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Queued #605 adds `mapModifierIdentityRejected` inside `validateMapModifier`. Official Add Modifier sets `id=mod_<timestamp>` and `modifierType=slime_flood`. Live `rollActiveModifiers` keys hooks by `config.id ∩ MODIFIER_BY_ID` (`mapModifiers.ts` 667). HUD `visibleMapModifiers` filters by `modifierType`. Switching the type dropdown to `paper_windstorm` keeps the slime_flood MP hook and hides the overlay. Legacy no-hook ids (`lava_fields`, `custom`) are rejected. Map modifiers have no last-good rollback. `EXISTING_MAP_MODIFIER_IDS` is the 22 live ids (`worldFeatures.ts` 1890–1913). `docs/WORLD_DYNAMICS.md` line 44 still requires those 22 to roll on their own two-roll; the registry is a documented three-roll (`mapModifiers.ts` 646–694). `WDEAD-2026-09-01-003` / `WDEAD-2026-09-25-008` asked for one owner catalog + one roll budget; they did not name the identity rail. On `main`, `CatalogWave` is still `1|2|3`.  
SYSTEMS_AFFECTED: pack `worldEventCatalog`; Admin Map Modifiers / future World Events tab; Simulation `modifierIdTypeMismatch`. Live two/three-roll stays until VALIDATE. Not `mapGen.ts`.  
RECOMMENDED_ACTION: VALIDATE fails unless a live modifier row’s `id` equals `modifierType` and is in `MODIFIER_BY_ID`. `WF-*` ids stay `WF-*` — do not store a wave-8 feature as `id=mod_…` with `modifierType=WF-PRT-HEARTH_GATE`. Reject `lava_fields` / `custom`. Dual-roll (22 live + overlay) remains a VALIDATE fail. CatalogNote must not claim a mismatched row is live because Save succeeded. Until ACTIVATE, do not overlay wave 8 or merge catalogs from Admin. One roll budget per map after ACTIVATE. Prefer DRAFT → SIMULATE → VALIDATE → ACTIVATE.  
AUTONOMY: IMPLEMENT_WHEN_PICKED for VALIDATE identity + honesty copy. HUMAN_APPROVE to merge the 22 live modifiers into the owner roll budget.  
DEPENDENCIES: WDEAD-2026-09-01-003; WDEAD-2026-09-25-008; WDEAD-2026-09-02-003; WDEAD-2026-08-31-009; #605 consume; WDD-2026-09-25-001  
REGRESSION_RISK: HIGH if both rolls stay independent after “wiring identity.” HIGH if enabling only wave 8 silently drops the 22 live modifiers. HIGH if a `mod_<ts>` row is treated as `slime_flood` because the dropdown says so.  
VALIDATION_REQUIRED: Sim reports `modifierIdTypeMismatch` for `id=mod_1` + `modifierType=paper_windstorm`. A drafted `WF-PRT-HEARTH_GATE` with a timestamp id fails VALIDATE. Single histogram after ACTIVATE (no Crosswind + `paper_windstorm` unless both are in one budget). `worldFeatures.test.ts` stays green. No `mapGen.ts` hunk. Wallet unchanged.  
STATUS: NEW  

---

ACTION_ID: WDEAD-2026-09-26-004  
SOURCE_AUTOMATION: World, Dungeon & Encounter Admin Designer  
TITLE: Simulation Laboratory wander epoch is a non-RAF occupancy replay — do not import WorldExploration or longHorizonSim  
CATEGORY: simulation-lab  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: No Admin Simulation tab (`gameTypes.ts` 483–498; `TABS` 5610–5626). Tiers preview still `[1, 10, 25, 50, 100, 200, 500]` (`AdminDashboard.tsx` 3877). `WDEAD-2026-08-31-003` / `WDEAD-2026-09-21-005` forbade importing `longHorizonSim` and `mapGen.simulate.ts`. They did not name a **wander epoch**. Queued #591 extracts `advanceEnemyWander` from WX (RAF-adjacent). Queued #608’s `ensureFreeDumpAfterWander` is proven by `simulateEnemyWanderOnWorld` in tests — not wired into WX. A lab that “replays wander” by importing WX or the #591 extract will touch the RAF loop / persist. Owner mandate includes many generated encounters at extreme hypothetical levels plus formations / destack / dump reports (`WDEAD-2026-09-26-001`).  
SYSTEMS_AFFECTED: proposed `engine/encounterSim.ts`; Admin Simulation tab. Must not import `WorldExploration.tsx`, `longHorizonSim.ts`, `mapGen.simulate.ts`, `#591` live wander, or shop/feat credit helpers.  
RECOMMENDED_ACTION: Lab occupancy replay is generate → destack → destack-dump → N wander ticks → wander-dump, all React-free. Prefer the #608 test simulator class (or a sibling helper in `encounterSim.ts`), not the live extract. Reports include 08-31-003 plus later columns plus `destackOccupiedDumpPunch` / `dumpFloor2AfterDestack` / `wanderOccupiedDumpPunch` / `deathRealmPendingBlocks` / `modifierIdTypeMismatch`. Spy allow-list fails on `applyRewards`, `saveBattleStats`, `upgradeSpell`, `claimAchievementReward`, `processPendingPurchases`, `redeemGameKey`, persist `commit`, `pbv_*` / inventory / unpaid-death keys, Rush persist writers, and queued keep paths (#540 / #545 / #552 / #580 / #599). Hypothetical presets: 1 / 10 / 100 / 1_000 / 10_000 / 50_000 / 100_000 (unbounded input, not a cap). Prefer DRAFT → SIMULATE → VALIDATE → ACTIVATE.  
AUTONOMY: IMPLEMENT_WHEN_PICKED with the lab (`WDEAD-2026-08-31-003`).  
DEPENDENCIES: WDEAD-2026-08-31-003; WDEAD-2026-09-21-005; WDEAD-2026-09-02-006; WDEAD-2026-09-26-001; WDEAD-2026-09-26-002; #608 consume (test helper only)  
REGRESSION_RISK: HIGH if Admin Simulation imports `WorldExploration` or `#591` live wander. HIGH if wander ticks write wallet / unpaid-death keys. LOW for live play (lab-only) if isolation holds.  
VALIDATION_REQUIRED: 10_000 lab rolls including wander epoch: zero actor credit methods, zero GameKey redeem, zero inventory / unpaid-death writes, zero RAF imports. Hypothetical level 100_000 accepted. Destack-onto-dump and wander-onto-dump columns increment. `pnpm typecheck`.  
STATUS: NEW  
