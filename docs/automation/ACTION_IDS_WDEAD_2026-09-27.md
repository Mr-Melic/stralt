# ACTION_IDs — 2026-09-27 World, Dungeon & Encounter Admin Designer

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: World, Dungeon & Encounter Admin Designer.  
Design contract: [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-27.md`](./WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-27.md).  
Prior IDs (still `NEW`, do not re-issue): `WDEAD-2026-08-31-001` … `015` (013 PARTIAL — `dungeonDokaMultiplierFor` unified, depth-5 freeze remains), `WDEAD-2026-09-01-001` … `010`, `WDEAD-2026-09-02-001` … `008`, `WDEAD-2026-09-21-001` … `007` (queued [PR #337](https://github.com/Mr-Melic/stralt/pull/337)), `WDEAD-2026-09-22-001` … `007` (queued [PR #394](https://github.com/Mr-Melic/stralt/pull/394)), `WDEAD-2026-09-23-001` … `007` (queued [PR #451](https://github.com/Mr-Melic/stralt/pull/451)), `WDEAD-2026-09-24-001` … `007` (queued [PR #534](https://github.com/Mr-Melic/stralt/pull/534)), `WDEAD-2026-09-25-001` … `008` (queued [PR #593](https://github.com/Mr-Melic/stralt/pull/593)), `WDEAD-2026-09-26-001` … `004` (queued [PR #615](https://github.com/Mr-Melic/stralt/pull/615)).  
Siblings to consume, not duplicate: `WDD-2026-09-21-001`…`WDD-2026-09-26-001` (waves 4–9, [#344](https://github.com/Mr-Melic/stralt/pull/344) / [#399](https://github.com/Mr-Melic/stralt/pull/399) / [#454](https://github.com/Mr-Melic/stralt/pull/454) / [#503](https://github.com/Mr-Melic/stralt/pull/503) / [#578](https://github.com/Mr-Melic/stralt/pull/578) / [#613](https://github.com/Mr-Melic/stralt/pull/613)), FSN drops 7–10 ([#537](https://github.com/Mr-Melic/stralt/pull/537) / [#575](https://github.com/Mr-Melic/stralt/pull/575) / [#612](https://github.com/Mr-Melic/stralt/pull/612) / [#669](https://github.com/Mr-Melic/stralt/pull/669)), EED rooms ([#479](https://github.com/Mr-Melic/stralt/pull/479) / [#519](https://github.com/Mr-Melic/stralt/pull/519) / [#574](https://github.com/Mr-Melic/stralt/pull/574) / [#635](https://github.com/Mr-Melic/stralt/pull/635) / [#672](https://github.com/Mr-Melic/stralt/pull/672)), elite waves 7–9 ([#535](https://github.com/Mr-Melic/stralt/pull/535) / [#558](https://github.com/Mr-Melic/stralt/pull/558) / [#625](https://github.com/Mr-Melic/stralt/pull/625)), Rush Tables E–I ([#474](https://github.com/Mr-Melic/stralt/pull/474) / [#518](https://github.com/Mr-Melic/stralt/pull/518) / [#572](https://github.com/Mr-Melic/stralt/pull/572) / [#638](https://github.com/Mr-Melic/stralt/pull/638) / [#663](https://github.com/Mr-Melic/stralt/pull/663)), jackpot complete(9) ([#536](https://github.com/Mr-Melic/stralt/pull/536)), map white-split / destack / generate dump ([#538](https://github.com/Mr-Melic/stralt/pull/538) / [#542](https://github.com/Mr-Melic/stralt/pull/542) / [#548](https://github.com/Mr-Melic/stralt/pull/548) / [#553](https://github.com/Mr-Melic/stralt/pull/553)), destack dump ([#589](https://github.com/Mr-Melic/stralt/pull/589) / [#600](https://github.com/Mr-Melic/stralt/pull/600) / [#603](https://github.com/Mr-Melic/stralt/pull/603)), wander dump ([#591](https://github.com/Mr-Melic/stralt/pull/591) / [#608](https://github.com/Mr-Melic/stralt/pull/608)), wander dump floor 2 ([#628](https://github.com/Mr-Melic/stralt/pull/628)), destack occupied dump floor 2 ([#648](https://github.com/Mr-Melic/stralt/pull/648)), choke-pocket snap ([#651](https://github.com/Mr-Melic/stralt/pull/651)), joint 2+2 unseal ([#656](https://github.com/Mr-Melic/stralt/pull/656)), Death Realm pending credits ([#576](https://github.com/Mr-Melic/stralt/pull/576) / [#595](https://github.com/Mr-Melic/stralt/pull/595) / [#602](https://github.com/Mr-Melic/stralt/pull/602) / [#604](https://github.com/Mr-Melic/stralt/pull/604)), modifier identity ([#605](https://github.com/Mr-Melic/stralt/pull/605)), seeded modifier pool ([#626](https://github.com/Mr-Melic/stralt/pull/626) / [#650](https://github.com/Mr-Melic/stralt/pull/650)), keep-then-additive persist ([#657](https://github.com/Mr-Melic/stralt/pull/657)), SpellSummonFields ([#564](https://github.com/Mr-Melic/stralt/pull/564) — do not re-issue `AUX-*`), `EBA-*`, `AFDA-*`, `TBC-*`, `SDE-*`.

This run ships **docs only**. Do not implement production, RAF, map generation, turn, or damage-math code from this file unless a later human or orchestrator picks an ID.

HEAD audited: `0f5363f` (unchanged since 2026-09-21). Live spawn/admin gaps from 09-26 still hold. New IDs cover catalogs and occupancy/admin rails that did not exist when #615 filed. Same-day #669 (FSN drop 10) and #672 (EED Purse/Hinge/Gait) are consumed, not invented. Do not invent WDD wave 10 or Rush Table J.

Queued older siblings (do not duplicate): #334/#415/#585 AFDA honesty copy. #337 / #394 / #451 / #534 / #593 / #615 prior WDEAD IDs.

---

ACTION_ID: WDEAD-2026-09-27-001  
SOURCE_AUTOMATION: World, Dungeon & Encounter Admin Designer  
TITLE: Owner enabledWaves includes WDD wave 9 — Wane Gate stays exploration-only; Grave Scribe is grantClass glyphPickup  
CATEGORY: world-events  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `WDEAD-2026-09-25-008` named wave 8 (`#578`). `WDEAD-2026-09-26` refused to invent wave 9 (newest same-day sibling then was telemetry #609). Queued #613 (`WDD-2026-09-26-001`) adds 16 overlay ids and types `CatalogWave = 1…9` / `LATEST_CATALOG_WAVE = 9` on the same `WORLD_FEATURES` array. On `main` `CatalogWave` is still `1 | 2 | 3` and `LATEST_CATALOG_WAVE = 3` (`worldFeatures.ts` 64, 115). `pickWeightedFeatures` does not take a wave (1853–1869). `MAX_ROLLED_FEATURES = 3` (37). Wave 9: Lectern Ash, Skipping Cinder, Camp Plate, Tilt Screen, Tithe Sill, Root Circle, Flank Step, **Wane Gate** (`WF-PRT-WANE_GATE`, `EXPLORATION_ONLY`, `rewardPath: applyRewards`, ≤30% HP extra portal — inverse of Hearth Gate), **Heir Cordon** (`WF-INV-HEIR_CORDON`, `extraEnemyCount` 3; dungeon/Rush minions do not vanish), **Near Picket** (`WF-ELT-NEAR_PICKET`, present within Chebyshev 3; dungeon/Rush required), Stride Cache, **Grave Scribe** (`WF-SPL-GRAVE_SCRIBE` — kill writes a one-cast glyph; adjacent 1 AP pickup; not Grimoire auto-grant), Stride Oath, Far Cast, Long Watch, Sight Burn. Dual-roll 22 live modifiers still the WDD placement contract (`EXISTING_MAP_MODIFIER_IDS` 1890–1913). WX still does not import `worldFeatures`.  
SYSTEMS_AFFECTED: pack `enabledWaves` / `worldEventCatalog` / `grantClass`; Admin World Events; Simulation `catalogWave` histogram. Live two/three-roll stays until VALIDATE. Not `mapGen.ts`.  
RECOMMENDED_ACTION: `enabledWaves` can name 1–9. Owner mix is explicit; omitted waves stay data. Wane Gate stays exploration-only. Heir Cordon / Near Picket count as hostiles for dungeon / Rush map-clear and toward `MAX_ENEMIES` (20). `grantClass` adds `glyphPickup` (in-memory, this map, one remaining use after the 1 AP glyph tap — never `upgradeSpell`, never spell-level arrays). Credits stay on `applyRewards`. Hazard HP stays on challenge recorders. Dual-roll (22 live + overlay) remains a VALIDATE fail. Death Realm default []. Rest / `whiteSanctuary` / `deathRealmPending` stay prior IDs. Until ACTIVATE, do not overlay wave 9 from Admin. Do not invent wave 10. Prefer DRAFT → SIMULATE → VALIDATE → ACTIVATE.  
AUTONOMY: HUMAN_APPROVE — live modifier and portal odds are player-facing. Honesty copy that wave 9 is data until VALIDATE is IMPLEMENT_WHEN_PICKED.  
DEPENDENCIES: WDEAD-2026-09-25-008; WDEAD-2026-09-01-003; WDEAD-2026-09-02-003; WDEAD-2026-09-02-004; WDEAD-2026-08-31-009; WDD-2026-09-26-001; #613 consume  
REGRESSION_RISK: HIGH if both rolls stay independent after “wiring wave 9.” HIGH if enabling only wave 9 silently drops the 22 live modifiers. HIGH if Grave Scribe pickup writes `upgradeSpell`. HIGH if Wane Gate rolls in dungeon / Rush / Death Realm.  
VALIDATION_REQUIRED: Sim with waves 1–9 and maxRolled=3 shows mix ≠ 100% wave 9. Wane Gate histogram is 0 on dungeon / Rush / deathRealm / deathRealmPending. Grave Scribe sim kill leaves canister spell upgrades unchanged; glyph tap does not persist spell levels. Heir Cordon on a dungeon map reports 3 hostiles required for clear. Payable bonuses ≤ official `applyRewards` maxima. `worldFeatures.test.ts` stays green. No `mapGen.ts` hunk. Wallet unchanged by the lab.  
STATUS: NEW  

---

ACTION_ID: WDEAD-2026-09-27-002  
SOURCE_AUTOMATION: World, Dungeon & Encounter Admin Designer  
TITLE: Encounter and dungeon room pools ingest EED Hug/Boot/Write/Dull / Purse/Hinge/Gait and FSN drops 9–10 by id union — never concatenate copies  
CATEGORY: encounters  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Live `generateEnemies` still scatters 1..8 + depth extras, random chess piece, quadrant + Chebyshev ≥ 4, then 30% equal-weight family (`WorldExploration.tsx` 5711–5864; `spawnPolicy.ts` 31–57, `FAMILY_VARIANT_CHANCE = 0.3`). No formation / rarity / rule / encounter-bound objective. Queued #635 (`EED-2026-09-26-001`) adds Hug / Boot / Write / Dull rooms (`ENC-HUG-01`, `ENC-BOOT-01`, `ENC-FACE-01`, `ENC-DULL-01`); unique file `docs/encounters/ENCOUNTER_EVOLUTION_2026-09-26.md`. Same-day #672 (`EED-2026-09-27-001`) adds Purse / Hinge / Gait rooms (`ENC-PURSE-01`, `ENC-HINGE-01`, `ENC-GAIT-01`, `ENC-DUMMY-01`, Rush `ENC-RUSH-35`…`38` on Table H); unique file `docs/encounters/ENCOUNTER_EVOLUTION_2026-09-27.md`. Queued #612 (FSN drop 9) packs Wave **8** families as sixteen `FSN-*` sheets (Wall File / Boot Spare / Face Glance / Slip Pit / Pivot Wick / Triple Plug / Crack Verse / Hood Choir / Share Goad / Boon Boot / Dull Sill / Wick Face / Brand Reel / Spare Slip / Sill Brood); unique file `docs/design/ENEMY_FORMATIONS_2026-09-26.md`. Same-day #669 (FSN drop 10) packs Wave **9** families as sixteen more `FSN-*` ids (GAIT-PACE / LONE-NAIL / FLUSH-DUMP / MORROW-POST / PAIR-PEEL / WICK-SEAL / SPLIT-PAD / GAIT-CHOIR / FLUSH-LEND / SEAL-FILE / DIAG-BRICK / BODY-CAST / HOLD-RANGE / ALLY-WICK / BLINK-RANK / PEEL-COURT); unique file `docs/design/ENEMY_FORMATIONS_2026-09-27.md`. Hold `FSN-TRIPLE-PLUG` while live summon cap is 2. Do not invent drop 11. Live 19 `BOSS_IDS` stay dungeon fallbacks. Duplicate `export function` copies fail Caffeine `vite build`.  
SYSTEMS_AFFECTED: proposed `engine/encounterFormations.ts` / `engine/dungeonPolicy.ts`; Admin Encounters / Dungeons. Not `FAMILY_TYPES`. Not `mapGen.ts`.  
RECOMMENDED_ACTION: Owner pools reference EED / FSN ids by union. One implementation per helper name. Sequencing / special / rest / branch remain pack fields (`WDEAD-2026-08-31-007`); rest-as-room and `whiteSanctuary` stay prior IDs. Skip Triple Plug until `ENEMY_SUMMON_CAP ≥ 3`. Do not invent drop 11. Prefer DRAFT → SIMULATE → VALIDATE → ACTIVATE.  
AUTONOMY: IMPLEMENT_WHEN_PICKED for catalog ingest + honesty copy. HUMAN_APPROVE to wire a formation into live `generateEnemies`.  
DEPENDENCIES: WDEAD-2026-09-25-003; WDEAD-2026-09-24-002; WDEAD-2026-08-31-005; WDEAD-2026-08-31-007; EED-2026-09-26-001; EED-2026-09-27-001; FSN drops 9–10; #612 / #635 / #669 / #672 consume  
REGRESSION_RISK: HIGH if two copies of the same `export function` land in one TS file. HIGH if Triple Plug ships while cap is 2. HIGH if Wave 9 families are concatenated onto drop 9 instead of occupying drop 10.  
VALIDATION_REQUIRED: Sim roster ids ⊆ live `FAMILY_TYPES` ∪ ingested FSN/EED ids with no duplicate helper names. `python3 scripts/check-duplicate-exports.py src/frontend/src`. Triple Plug skip when remaining cap < 3. No `mapGen.ts` hunk. `pnpm typecheck`.  
STATUS: NEW  

---

ACTION_ID: WDEAD-2026-09-27-003  
SOURCE_AUTOMATION: World, Dungeon & Encounter Admin Designer  
TITLE: Elite wave 9 remains a second roll after FAMILY_TYPES — never concatenate the 32 proposed families  
CATEGORY: spawn-admin  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Live elite presentation is still “family variant” at 30% equal weight over seven `FAMILY_TYPES` (`spawnPolicy.ts` 49–57, `FAMILY_VARIANT_CHANCE = 0.3`). There is no `isElite` flag. Queued #625 (Wave 9 enemy/elite evolution) proposes 32 world-pack families (`gait_mender`, `pair_porter`, `cadence_flusher`, `lone_stinger`, `morrow_warden`, `gait_sealer`, `diag_locksmith`, `brick_shifter`, `wick_mender`, `return_stinger`, `leftover_lender`, `dummy_prelate`, `enter_mender`, `body_marker`, `split_cantor`, `even_warder`, `hold_knight`, `ground_oather`, `walk_toller`, `purse_locker`, `ally_reeler`, `echo_painter`, `blink_sealer`, `gift_siller`, `split_fanger`, `wall_biter`, `cast_marker`, `still_leasher`, `verse_thief`, `ghost_stepper`, `thin_warder`, `clean_cantor`) plus extra doors `gait_cantor` / `pair_usher` / `flush_precentor` / `dummy_castellan` / `court_hinge_regent`. Court Hinge / Pack Still / File Fold stay boss/closed/ENEMY_ONLY. `WDEAD-2026-09-22-007` / `WDEAD-2026-09-25-005` already forbade concatenating earlier elite waves onto `FAMILY_TYPES`. Family HP is still discarded at battle start (`WDEAD-2026-09-22-002` — do not re-issue).  
SYSTEMS_AFFECTED: pack elite second-roll weights; Admin Spawn / Encounters. Live `FAMILY_TYPES` stay seven until VALIDATE. Not RAF. Not damage math.  
RECOMMENDED_ACTION: Owner elite probability is a second roll after the family roll, with per-sheet rarity. Extra doors are elite extras, not family ids. Do not concatenate the 32 names onto `FAMILY_TYPES`. Do not apply unused family `ap`/`mp` catalog fields (`spawnPolicy.ts` 14–16). Relative threat vs same-tier baseline; no level gates. Prefer DRAFT → SIMULATE → VALIDATE → ACTIVATE.  
AUTONOMY: HUMAN_APPROVE before changing live spawn odds. Reporting may ship with the lab.  
DEPENDENCIES: WDEAD-2026-09-25-005; WDEAD-2026-09-22-007; WDEAD-2026-08-31-011; #625 consume; do not combine with a family-HP overlay  
REGRESSION_RISK: HIGH if `FAMILY_TYPES` grows by concatenation (esbuild duplicate + spawn table explosion). HIGH if elite HP is wiped at battle start. MEDIUM if extra doors enter the equal-weight 30% family roll.  
VALIDATION_REQUIRED: Sim at hypothetical level 100_000 still rolls the seven live families plus a second-roll elite histogram. Concatenating 32 ids onto `FAMILY_TYPES` fails review. Family `ap`/`mp` remain unused. `pnpm typecheck`.  
STATUS: NEW  

---

ACTION_ID: WDEAD-2026-09-27-004  
SOURCE_AUTOMATION: World, Dungeon & Encounter Admin Designer  
TITLE: Boss Rush extra tables include H0–H3 and I0–I3 — never canister roomIndex > 9; jackpot complete(9) stays mandatory  
CATEGORY: boss-rush  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Live `BOSS_RUSH_ROOMS` is still 10 hardcoded pairs (`useBossRush.ts` 24–135). Admin enable / per-room `x` still do not skip rooms. `_rewardMultiplier` is loaded then discarded (`useBossRush.ts` 209; CatalogNote `AdminDashboard.tsx` 7143 still claims it is read — `WDEAD-2026-09-02-002`). `completeBossRushRoom` still `#err`s `roomIndex > 9` (`main.mo` 3317) and ignores client Doka/XP (official client passes 0, 0). Jackpot `complete(9)` is mandatory (`#536`). `WDEAD-2026-09-25-004` named Table G. `WDEAD-2026-09-26` refused to invent Table H. Queued #638 adds Wave 10 sheets (`crypt_sexton`, `march_prefect`, `aisle_canon`, `orbit_succentor`) and **Table H** `H0`–`H3` additive after G. Queued #663 adds Wave 11 sheets (`sole_thurifer`, `bias_prebendary`, `brick_cellarer`, `rebound_almoner`) and **Table I** `I0`–`I3` additive after H. Neither rewrites rooms 0–9. Neither is in `BOSS_IDS`.  
SYSTEMS_AFFECTED: pack Boss Rush sequencing / relative scale / reward multipliers; Admin Boss Rush. Official credit path stays `applyRewards` after `currentRoom` actually advances. Canister progress writer stays `(0, 0)`.  
RECOMMENDED_ACTION: Owner namespaces are `0–9` / `B0–B3` / `C0–C3` / `D0–D3` / `E0–E3` / `F0–F3` / `G0–G3` / `H0–H3` / `I0–I3`. Extra tables must not call `completeBossRushRoom` with `roomIndex > 9`. Jackpot `complete(9)` stays mandatory before H/I payouts. Relative scaling is offset + multiplier vs the player — never a stored absolute 99 / 9999. Payable preview still `WDEAD-2026-09-01-005` / `009`. Do not invent Table J. Prefer DRAFT → SIMULATE → VALIDATE → ACTIVATE.  
AUTONOMY: HUMAN_APPROVE — Rush persist and economy. Honesty copy that H/I are data until VALIDATE is IMPLEMENT_WHEN_PICKED.  
DEPENDENCIES: WDEAD-2026-09-25-004; WDEAD-2026-09-02-002; WDEAD-2026-09-01-009; WDEAD-2026-08-31-008; #536 / #638 / #663 consume  
REGRESSION_RISK: HIGH if H/I rooms call `completeBossRushRoom(10+)`. HIGH if jackpot room remains resumable after a new credit. HIGH if client `dokaReward`/`xpReward` are revived. HIGH if `_rewardMultiplier` is bound as a second wallet write.  
VALIDATION_REQUIRED: Sim H0–I3 never emits canister `roomIndex > 9`. Clearing room 9 still calls `complete(9)` before any extra-table credit. Changing Admin “x” does not change `completeBossRushRoom` args. Payable H/I bonuses ≤ official `applyRewards` maxima. Wallet unchanged by the lab. `pnpm typecheck`.  
STATUS: NEW  

---

ACTION_ID: WDEAD-2026-09-27-005  
SOURCE_AUTOMATION: World, Dungeon & Encounter Admin Designer  
TITLE: Encounter formations must compose with wander dump floor 2, destack occupied dump floor 2, choke-pocket snap, and joint 2+2 unseal  
CATEGORY: encounters  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `WDEAD-2026-09-26-001` named destack-occupied **free** dump (#589 / #600 / #603) and wander-occupied **free** dump (#608). After #615: queued #628 punches until **free** dump ≥ 2 when wander occupies one of two generate-time alcoves (`enemyWanderDumpFloor.ts` — `#494` / `#608` no-op because unique bridges still report dump ≥ 2); queued #648 punches until **free** dump ≥ 2 when destack occupies one of two alcoves (`battleStartOccupiedDumpFloor.ts` — `#600` is occupancy-unaware dump ≥ 2); queued #651 snaps destack origin off a choke pocket whose unique-bridge set is non-empty (`battleStartChokePocket.ts` — dump stays high so dump punches no-op; four corpses on the neck still seal); queued #656 peels dual-path 2+2 joint cuts greedy occupancy misses (`occupancyJointUnseal.ts` — dump punches no-op when mandatory=0 because every floor already counts as dump). Drop-9 COURT / Face Court / `WF-INV-HEIR_CORDON` assume authored cells after generate. Live `generateEnemies` still scatters (WX 5711–5864).  
SYSTEMS_AFFECTED: proposed `engine/encounterFormations.ts`; Simulation `wanderDumpFloor2` / `destackOccupiedDumpFloor2` / `chokePocketSnap` / `jointCutUnseal`. Live destack / occupancy / queued helpers stay. Not `mapGen.ts`. Not RAF.  
RECOMMENDED_ACTION: Formations apply role offsets to walkable unique fight-graph cells via `occupancy.isCellFree`. VALIDATE epochs: generate → destack → destack-dump → destack-occupied-floor-2 → choke-pocket snap → (overworld) wander-dump → wander-floor-2 → joint-cut unseal. Report the four new columns rather than treating punched floor as authored COURT art. Drop a slot that cannot destack; do not punch walls; do not hop a portal cut; do not disable #628/#648/#651/#656 to keep keep-clear art. White-split destack on the white portal still no-ops (mandatory 0). Free-dump compose stays `WDEAD-2026-09-26-001`. Prefer DRAFT → SIMULATE → VALIDATE → ACTIVATE.  
AUTONOMY: HUMAN_APPROVE before changing live occupancy. Reporting may ship with the lab.  
DEPENDENCIES: WDEAD-2026-09-26-001; WDEAD-2026-09-25-006; WDEAD-2026-09-27-007; #628 / #648 / #651 / #656 consume; do not combine with a mapGen specialist PR  
REGRESSION_RISK: HIGH if dump-floor-2, choke snap, or joint unseal is disabled to keep formation art. HIGH if extras land on a punched dump cell, the white gateway tile, a choke neck, or a far island. HIGH if two copies of the same dump helper land in one TS file (esbuild).  
VALIDATION_REQUIRED: Existing destack / leftover-island / keep-clear / white-split / occupied-dump tests stay green when those PRs land. Sim at size=20 after destack-onto-one-alcove, wander-onto-one-alcove, choke-pocket origin, and 2+2 joint cut shows skip or relocation, free dump ≥ 2 where those helpers apply, unique-bridge set empty after choke snap, and an open player→exit after joint unseal. No leftover-island join. No `mapGen.ts` hunk. `pnpm typecheck`.  
STATUS: NEW  

---

ACTION_ID: WDEAD-2026-09-27-006  
SOURCE_AUTOMATION: World, Dungeon & Encounter Admin Designer  
TITLE: One world-event catalog VALIDATE refuses emptying or hard-deleting the seeded live map-modifier pool  
CATEGORY: world-events  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `WDEAD-2026-09-26-003` named id/type identity (`#605`): official Add Modifier sets `id=mod_<timestamp>` while hooks key `config.id ∩ MODIFIER_BY_ID` (`mapModifiers.ts` 667). That rail does not keep the pool non-empty. Live `rollActiveModifiers` keeps `active && MODIFIER_BY_ID.has(id)` with weight > 0. Seed only runs when the map is empty. Queued #626 refuses hard-delete of seeded `slime_flood` / `paper_windstorm` (`AdminGuard.mapModifierHardDeleteRejected`) — deleting one seeded row while the other remains never restores it. Queued #650 refuses emptying the last live built-in row via `active=false` or `triggerChance=0` (`AdminGuard.mapModifierLastLiveRejected`). Custom / `gravity_well` rows may still retire. `EXISTING_MAP_MODIFIER_IDS` is the 22 live ids (`worldFeatures.ts` 1890–1913). Map modifiers have no last-good rollback.  
SYSTEMS_AFFECTED: pack `worldEventCatalog`; Admin Map Modifiers / future World Events tab; Simulation `seededModifierPoolEmpty`. Live two/three-roll stays until VALIDATE. Not `mapGen.ts`.  
RECOMMENDED_ACTION: VALIDATE fails if the catalog would leave zero live built-in hook rows (`slime_flood` / `paper_windstorm` today; the 22-id set after ACTIVATE merges). Seeded ids cannot be hard-deleted. Retire with `active=false` only while another built-in row stays live with weight > 0. Identity mismatch still fails (`WDEAD-2026-09-26-003`). Dual-roll still fails (`WDEAD-2026-09-01-003`). CatalogNote must not claim a last-row retire is live because Save succeeded. Until ACTIVATE, do not overlay wave 9 or merge catalogs from Admin. Prefer DRAFT → SIMULATE → VALIDATE → ACTIVATE.  
AUTONOMY: IMPLEMENT_WHEN_PICKED for VALIDATE pool + honesty copy. HUMAN_APPROVE to merge the 22 live modifiers into the owner roll budget.  
DEPENDENCIES: WDEAD-2026-09-26-003; WDEAD-2026-09-01-003; WDEAD-2026-09-25-008; WDEAD-2026-08-31-009; #626 / #650 consume  
REGRESSION_RISK: HIGH if both rolls stay independent after “wiring the pool rail.” HIGH if enabling only wave 9 silently drops the 22 live modifiers. HIGH if the last seeded row can be retired and the overworld never rolls a modifier again.  
VALIDATION_REQUIRED: Sim reports `seededModifierPoolEmpty` for delete-both and for last-row `active=false` / `triggerChance=0`. A drafted catalog that keeps one seeded row live with weight > 0 validates. Single histogram after ACTIVATE. `worldFeatures.test.ts` stays green. No `mapGen.ts` hunk. Wallet unchanged.  
STATUS: NEW  

---

ACTION_ID: WDEAD-2026-09-27-007  
SOURCE_AUTOMATION: World, Dungeon & Encounter Admin Designer  
TITLE: Simulation Laboratory spies keep-then-additive feat/GameKey commits and reports dump-floor-2 / choke / joint-cut columns — still non-RAF  
CATEGORY: simulation-lab  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: No Admin Simulation tab (`gameTypes.ts` 483–498; `TABS` 5610–5626). Tiers preview still `[1, 10, 25, 50, 100, 200, 500]` (`AdminDashboard.tsx` 3877). `WDEAD-2026-09-26-004` forbade importing `WorldExploration` / `#591` live wander / `longHorizonSim` / `mapGen.simulate.ts` for the wander epoch. It did not name keep-then-additive persist or the floor-2 / choke / joint-cut columns. Queued #657 `gateAdditiveCommitWhileUnconfirmed` skips feat `claimAchievementReward` / `redeemGameKey` additive `commit({ doka })` while an unconfirmed one-shot keep is outstanding (`unconfirmedKeepAdditiveCommit.ts`) — leftover `commit({ doka: lock+grant })` clears unconfirmed and a later recap heal `saveBattleStats` wipes the kept pickup. Absolute `applyRewards` `newDoka` still uses the raw lock in live play. Occupancy helpers from #628 / #648 / #651 / #656 are proven by React-free test simulators, not wired into WX.  
SYSTEMS_AFFECTED: proposed `engine/encounterSim.ts`; Admin Simulation tab. Must not import `WorldExploration.tsx`, `longHorizonSim.ts`, `mapGen.simulate.ts`, `#591` live wander, or shop/feat credit helpers.  
RECOMMENDED_ACTION: Lab occupancy replay is generate → destack → destack-dump → destack-occupied-floor-2 → choke-pocket → N wander ticks → wander-dump → wander-floor-2 → joint-cut, all React-free. Reports include 08-31-003 plus later columns plus `wanderDumpFloor2` / `destackOccupiedDumpFloor2` / `chokePocketSnap` / `jointCutUnseal` / `seededModifierPoolEmpty` / `keepThenAdditiveBlocked` / `deathRealmPendingBlocks` / `modifierIdTypeMismatch`. Spy allow-list fails on `applyRewards`, `saveBattleStats`, `upgradeSpell`, `claimAchievementReward`, `processPendingPurchases`, `redeemGameKey`, persist `commit` (including #657 additive), `pbv_*` / inventory / unpaid-death keys, Rush persist writers, and queued keep paths (#540 / #545 / #552 / #580 / #599 / #657). Hypothetical presets: 1 / 10 / 100 / 1_000 / 10_000 / 50_000 / 100_000 (unbounded input, not a cap). Prefer DRAFT → SIMULATE → VALIDATE → ACTIVATE.  
AUTONOMY: IMPLEMENT_WHEN_PICKED with the lab (`WDEAD-2026-08-31-003` / `WDEAD-2026-09-26-004`).  
DEPENDENCIES: WDEAD-2026-08-31-003; WDEAD-2026-09-26-004; WDEAD-2026-09-21-005; WDEAD-2026-09-27-005; WDEAD-2026-09-27-006; #657 consume (spy only); #628 / #648 / #651 / #656 consume (test helpers only)  
REGRESSION_RISK: HIGH if Admin Simulation imports `WorldExploration` or `#591` live wander. HIGH if the lab calls feat/GameKey `commit` “to preview a keep.” HIGH if wander ticks write wallet / unpaid-death keys. LOW for live play (lab-only) if isolation holds.  
VALIDATION_REQUIRED: 10_000 lab rolls including wander epoch and a keep-then-additive scenario: zero actor credit methods, zero GameKey redeem, zero inventory / unpaid-death writes, zero RAF imports, `keepThenAdditiveBlocked` increments without writing the lock. Hypothetical level 100_000 accepted. New occupancy columns increment. `pnpm typecheck`.  
STATUS: NEW  
