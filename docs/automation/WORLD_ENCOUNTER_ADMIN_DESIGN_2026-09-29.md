# World, Dungeon & Encounter Admin Designer — 2026-09-29

**Source automation:** World, Dungeon & Encounter Admin Designer (`1592c6c0-a499-11f1-a7d1-d6b4613131ce`)  
**This run:** `bc-4b3f215e-8ad5-40c7-b7bd-793b0b7865ce`  
**HEAD inspected:** `0f5363f` (`main` after #332 — **same HEAD as the 2026-09-21 through 2026-09-28 briefs**)  
**Constraint:** design only. No production code, no RAF / mapGen / turn / damage-math edits.  
**Player rule:** Stralt has **no player level cap**. Every owner control must stay valid at hypothetical levels of 1, 50, 500, 5_000, 50_000, and 100_000. Never recommend a hard maximum player or enemy level.

Prior briefs (still the content-model contract):

- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-08-31.md`](./WORLD_ENCOUNTER_ADMIN_DESIGN_2026-08-31.md) — pack, relative spawn, Simulation Lab, DRAFT → SIMULATE → VALIDATE → ACTIVATE (`WDEAD-2026-08-31-001` … `015`)
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-01.md`](./WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-01.md) — lying knobs, `longHorizonSim` isolation, one roll budget, payable rewards (`WDEAD-2026-09-01-001` … `010`)
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-02.md`](./WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-02.md) — closed-interval 9999, unused `_rewardMultiplier`, wave-2 mix, AdminGuard 99/999, GameKey isolation, destack×formations, dungeon Doka curve (`WDEAD-2026-09-02-001` … `008`)
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-21.md`](https://github.com/Mr-Melic/stralt/pull/337) — wave-3 mix, wrap `spawnPolicy.ts`, `loanOneCast`, occupancy destack, lab spy (`WDEAD-2026-09-21-001` … `007`). **Queued, not on `main`.**
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-22.md`](https://github.com/Mr-Melic/stralt/pull/394) — wave-4 mix, family HP wipe, EED + FSN ingest, Rush Table C (`WDEAD-2026-09-22-001` … `007`). **Queued, not on `main`.**
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-23.md`](https://github.com/Mr-Melic/stralt/pull/451) — wave-5 mix, `bindWhileAlive`, Rush Table D (`WDEAD-2026-09-23-001` … `007`). **Queued, not on `main`.**
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-24.md`](https://github.com/Mr-Melic/stralt/pull/534) — waves 6–7, relative encounter objectives (`WDEAD-2026-09-24-001` … `007`). **Queued, not on `main`.**
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-25.md`](https://github.com/Mr-Melic/stralt/pull/593) — `whiteSanctuary`, Rush Table G + jackpot `complete(9)` (`WDEAD-2026-09-25-001` … `008`). **Queued, not on `main`.**
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-26.md`](https://github.com/Mr-Melic/stralt/pull/615) — destack/wander dump compose, Death Realm pending, modifier identity (`WDEAD-2026-09-26-001` … `004`). **Queued, not on `main`.**
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-27.md`](https://github.com/Mr-Melic/stralt/pull/684) — wave 9 mix, FSN 9–10 / EED ingest, Rush H/I, dump-floor-2 / choke / joint (`WDEAD-2026-09-27-001` … `007`). **Queued, not on `main`.**
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-28.md`](https://github.com/Mr-Melic/stralt/pull/739) — waves 10–11 mix, elite wave 10, knockback/swap/Lich/ghost compose, last-live chance-0, liveWxFlag honesty, death-cut remount spy (`WDEAD-2026-09-28-001` … `007`). **Queued, not on `main`.** Explicitly deferred FSN drop 11, elite wave 11, and Rush Table J until those catalogs were readable.

This run’s IDs: [`ACTION_IDS_WDEAD_2026-09-29.md`](./ACTION_IDS_WDEAD_2026-09-29.md).

Do **not** re-issue `WDEAD-2026-08-31-*`, `WDEAD-2026-09-01-*`, `WDEAD-2026-09-02-*`, `WDEAD-2026-09-21-*`, `WDEAD-2026-09-22-*`, `WDEAD-2026-09-23-*`, `WDEAD-2026-09-24-*`, `WDEAD-2026-09-25-*`, `WDEAD-2026-09-26-*`, `WDEAD-2026-09-27-*`, `WDEAD-2026-09-28-*`, `WDD-*`, `EBA-*`, `EED-*` / `ENC-*`, `FSN-*`, `AFDA-*`, `LHIPS-*`, `EBMA-*`, `MIMA-*`, `TBC-*`, `SDE-*`, `CRC-*`, `AEE-*`, or `AUX-*` (admin UX #564).

Live spawn/admin code has not moved since 09-21 (`0f5363f`). New IDs exist because **queued catalogs and occupancy/persist rails after #739** (FSN drop 11, EED Pace/Nail/Flush, elite wave 11, Rush Table J, Twin Bishop / summoner-midpoint / VOID unseals, swap/boss landing tax, portal-XP-keep remount skip) would be forked if the owner pack were implemented from 09-28 alone.

Do **not** invent WDD wave 12, FSN drop 12, elite wave 12, or Rush Table K. No same-day WDD / FSN / elite sibling exists after #719 / #727 / #752. `CatalogWave` on `main` is still `1 | 2 | 3` until #344 / #399 / #454 / #503 / #578 / #613 / #680 / #719 land. **#680** / **#719** restack `worldFeatures.ts` (`mergeable_state: unstable`) — consume the **readable wave-10 / wave-11 ids**, do not overlay from Admin, do not restack that file in this program.

---

## 0. What this cron is for

The owner pack, relative spawn knobs, Simulation Laboratory, and DRAFT → SIMULATE → VALIDATE → ACTIVATE **still do not exist**. Admin is still the 15-tab CRUD list (`gameTypes.ts` 483–498; `TABS` 5610–5626). Save is still live.

Preferred lifecycle is unchanged:

**DRAFT → SIMULATE → VALIDATE → ACTIVATE**

Admin / debug / simulation stay **dev-gated**. Simulation must never call `applyRewards`, `saveBattleStats`, `upgradeSpell`, `claimAchievementReward`, `processPendingPurchases`, `redeemGameKey`, persist-lock `commit`, one-shot Doka claim/settle, achievement unlock writers, Boss Rush persist writers (`completeBossRushRoom`, `setBossRushProgress`, `resetBossRush`, `abortBossRush`), write `pbv_pending_death_penalty_*` / arm `deathTriggered`, replay death-cut `saveBattleStats` after a later confirmed credit, honour remount unpaid-death XP from Play-entry, or wipe after a portal +10 XP keep remount.

Oldest-first queued siblings this brief consumes (do not duplicate their IDs):

| PR | Role vs this pack |
| :--- | :--- |
| #337 / #394 / #451 / #534 / #593 / #615 / #684 / **#739** WDEAD | Prior designer IDs. Stay `NEW`. |
| #344 / #399 / #454 / #503 / #578 / #613 / #680 / **#719** WDD | Waves 4–**11** `WF-*` on the **same** `WORLD_FEATURES` array. On `main` `CatalogWave` is still `1\|2\|3` (`worldFeatures.ts` 64, 115). Do not invent wave 12. Do not restack `worldFeatures.ts`. |
| #348 / #401 / #459 / #537 / #575 / #612 / #669 / **#727** FSN | Drops 4–**11**. #727 packs Wave **10** families (`FSN-SHOVE-BASH` … `FSN-HOLD-VERSE`). Do not invent drop 12. |
| #347 / #396 / #479 / #519 / #574 / #635 / #672 / **#737** EED | Tide…Gait plus **Pace / Nail / Flush** (`ENC-PACE-01` … `ENC-RUSH-42`). Unique file `docs/encounters/ENCOUNTER_EVOLUTION_2026-09-28.md`. |
| #349 / #405 / #452 / #535 / #558 / #625 / #686 / **#752** elite | Waves 4–**11** family sheets. Second roll. Never concatenate `FAMILY_TYPES`. Skip `quad_prelate` while remaining cap &lt; 4. Skip `penta_prelate` while remaining cap &lt; 5. |
| #367 / #406 / #474 / #518 / #572 / #638 / #663 / **#753** boss bible | Tables C–**J**. Jackpot `complete(9)` stays mandatory (`#536`). Table J is `J0`–`J3` (`infirm_chanter` + `levy_rector`, …). |
| #430 / #436 / #444 / #484 / #494 / #500 / #538 / #542 / #548 / #553 map | Far-island → white-split. **09-25-006 already owns these.** |
| #589 / #600 / #603 destack dump | **09-26-001 already owns these.** |
| #591 / #608 wander dump | **09-26-001 / 09-26-004 already own these.** |
| #628 / #648 / #651 / #656 | Dump floor 2 / choke / joint. **09-27-005 already owns these.** |
| #688 / #697 / #704 / #711 | Knockback / swap / ignore-walls / ghost-raster. **09-28-003 already owns these.** |
| **#755** Twin Bishop flank | Snap `TWIN_FLANK` reflection off portal far crumbs (`occupancyTwinFlankUnseal.ts`). Rush midnight-bishop room 7. Not wired from WX. |
| **#760** summoner midpoint | Snap `decideSummonerAction` midpoint spawn off portal far crumbs (`occupancyMidpointUnseal.ts`). Not wired. |
| **#765** VOID_TILES | Snap Void Grandmaster cardinal voids off portal / unique corridor (`occupancyVoidUnseal.ts`). Rush room 4. Not wired. |
| **#754** / **#763** landing tax | Swap landings tax like walk (`swapLandingHazards.ts`). Boss teleport / advance / knight-jump tax (`bossAbilityLandingHazard.ts`). React-free tests; WX 3-way on #754. |
| #576 / #595 / #602 / #604 Death Realm pending | **09-26-002 already owns eligibility.** |
| #605 / #626 / #650 / **#703** modifier pool | Identity + seeded hard-delete + last-row retire + chance-0. **09-26-003 / 09-27-006 / 09-28-004 already own these.** |
| #674 / #716 registry docs | Blood Moon / Mirror Field are `liveWxFlag`. **09-28-005 already owns this.** |
| #698 / #705 / #710 death-cut persist | Skip `saveBattleStats` after death-cut then confirmed credit. **09-28-006 already owns the spy.** |
| **#742 / #756 / #759 / #764 / #767** portal-XP-keep remount | Lock-reset skip, replica-leftover XP honour, refuse Play-entry honour after portal keep, skip death-replay wipe after portal keep, skip heal wipe after portal keep without unpaid death. **New lab spy.** |
| #657 persist | Keep-then-additive. **09-27-007 already owns the spy.** |
| #564 admin UX | Do not re-issue `AUX-*` or `WDEAD-2026-09-25-002`. |
| #334 / #415 / #585 / **#741** AFDA | Honesty copy. Not owner knobs. Do not re-issue 09-02-002. |
| #670 / #637 / **#748** LHIPS | Do not promote to Admin Simulation. |
| #689 AEE | Relative peer sophistication. Spawn AI knob stays 08-31-011. |
| #707 CRC | Unpublished catalogs stay design-only. |
| #746 EBA | Enemy/boss admin re-audit. Consume, do not duplicate `EBA-*`. |
| #683 ground Doka extract | Lab must not import the extracted spawner to mint. |

---

## 1. Re-audit: prior WDEAD IDs (all still `NEW` except 013 PARTIAL)

Live evidence is the 09-21 … 09-28 tables at the same HEAD. Line numbers re-checked this run.

| Cluster | Still true? | This-run note |
| :--- | :--- | :--- |
| `WDEAD-2026-08-31-001`…`015` | Yes (013 PARTIAL) | Picker `floor(999 / ts)` (`combatMath.ts` 58). `computeAITier` stops at 900 → tier 10; 30% uniform 1–10 (36–51). Dungeon extras/Doka still `min(depth, 5)` (`spawnPolicy.ts` 29, 144; `portalRules.ts` 161). Tests lock `dungeonSpawnExtras(99) === extras(5)` (`spawnPolicy.test.ts` 84). Death Realm fallbacks `maxLevel: 5` (WX 13514, 13646) vs entry `9999` (5439). Rest `maxLevel: 9999` (5517). Region match is still a closed interval (`WorldExploration.tsx` 3702). No Simulation / Drafts / Encounters / Dungeons / World Events / Spawn tabs. Admin is still 15 tabs (`AdminDashboard.tsx` 5610–5626). |
| `WDEAD-2026-09-01-001`…`010` | Yes | Tiers unlabeled; preview still `[1, 10, 25, 50, 100, 200, 500]` (`AdminDashboard.tsx` 3877). Dual-roll 22 modifiers still the WDD placement contract (`EXISTING_MAP_MODIFIER_IDS` 1890–1913). `WorldFeatureRunMode` is still `exploration \| dungeon \| bossRush` (`worldFeatures.ts` 67). `isFeatureAllowedInContext` hard-returns false for `deathRealm` (1768–1769). Rest is not an enum value. |
| `WDEAD-2026-09-02-001`…`008` | Yes | Closed 9999 still a reject. `_rewardMultiplier` still unused (`useBossRush.ts` 209). CatalogNote still claims it is read (`AdminDashboard.tsx` 7141–7146). AdminGuard `minLevel > 999` / `summonUnitDef.level > 99` (`adminGuard.mo` 411, 441). `completeBossRushRoom` still `(0, 0)` and `roomIndex > 9` (`main.mo` 3317). |
| `WDEAD-2026-09-21-001`…`007` | Yes (queued #337) | Wave 3 is on `main` (52 `WF-*`, `LATEST_CATALOG_WAVE = 3`). `spawnPolicy.ts` is live defaults. |
| `WDEAD-2026-09-22-001`…`007` | Yes (queued #394) | Family HP still discarded at battle start (`WX` 11970–11974 `calcEnemyMaxHp(e.level)`). Do not re-issue 09-22-002. |
| `WDEAD-2026-09-23-001`…`007` | Yes (queued #451) | Stay `NEW`. |
| `WDEAD-2026-09-24-001`…`007` | Yes (queued #534) | `DEFAULT_CHALLENGES` still absolute (`under_15_turns`, … — `challengeCompletion.ts` 44–56). Do not re-issue 09-24-007. |
| `WDEAD-2026-09-25-001`…`008` | Yes (queued #593) | `WorldFeatureRunMode` still lacks `whiteSanctuary`. Do not re-issue 09-25-001 / 09-25-006 / 09-25-008. |
| `WDEAD-2026-09-26-001`…`004` | Yes (queued #615) | Do not re-issue. |
| `WDEAD-2026-09-27-001`…`007` | Yes (queued #684) | Do not re-issue. Wave 10 was deferred then named on 09-28. |
| `WDEAD-2026-09-28-001`…`007` | Yes (queued #739) | `enabledWaves` still cannot name 10 or 11 on `main`. FAMILY_TYPES is still seven. Knockback/swap/Lich/ghost compose is still missing from live WX. Last-live chance-0 is still unguarded on `main` (#703 queued). hookStatus still treats Blood Moon as unused chrome on empty-registry docs until #716. Do not re-issue 09-28-001…007. FSN drop 11 / elite 11 / Table J / twin-flank / midpoint / VOID / portal-keep remount are **this** run. |

Missing tabs (unchanged): Encounters, Dungeons, World Events, Spawn (beyond coarse tiers), Simulation, Drafts.

`generateEnemies` still scatters `rollOverworldEnemyCount` (1..8 + depth extras), random chess piece, quadrant + Chebyshev ≥ 4 (`WX` 5711–5743; `spawnPolicy.ts` 31–57). Family overlay is still 30% equal-weight over seven `FAMILY_TYPES`. Engine still has **zero** `enemyConfigs` reads in WorldExploration. WX still does not import `worldFeatures`. `MAX_ENEMIES = 20` (`gameConstants.ts` 10). `ENEMY_SUMMON_CAP = 2` (`gameConstants.ts` 300).

---

## 2. FSN drop 11 and EED Pace/Nail/Flush exist now — ingest by id union

`WDEAD-2026-09-28-002` named elite wave 10 and **refused to invent FSN drop 11**. Queued **#727** (`docs/design/ENEMY_FORMATIONS_2026-09-28.md`) now packs Wave **10** families as sixteen `FSN-*` sheets. Unique file. Do not restack drop 10 (#669).

Drop 11 ids:

| Id | Grade | Owner note |
| :--- | :--- | :--- |
| `FSN-SHOVE-BASH` | PAIR | Shove Mend + bash. Fail closed until `forcedMovedThisTurn` writers exist. Until then show `FSN-WARD-MEND` / `FSN-HOOK-SLAM`. |
| `FSN-DRY-TAX` | PAIR | Dry Keep leftover-0 damage vs plate |
| `FSN-WICK-HOOD` | PAIR | Gait Wick + Far Hood |
| `FSN-TICK-RAT` | PAIR | Tick Plate + rat |
| `FSN-HOME-SILL` | PAIR | Home Step onto Quiet Sill |
| `FSN-EXIT-PAIR` | PAIR | Exit Sting + Pair Slide |
| `FSN-FOE-FANG` | PAIR | Foe Reel + fang |
| `FSN-FIELD-WIPE` | PAIR | Field Bite + Echo Wipe |
| `FSN-SHOVE-CHOIR` | BRIGADE | Three-body shove lesson |
| `FSN-WICK-SPAN` | BRIGADE | Odd Rebate / Wick Span — never a two-MP-tax PAIR |
| `FSN-DRY-KEEP` | BRIGADE | Dry + Keep |
| `FSN-BOOT-CHASE` | BRIGADE | Boot Lend + Chase Mend. Fail closed until `walkMpSpentThisTurn` |
| `FSN-STRETCH-MUTE` | CADRE | Stretch + Last Mute. Fail closed until `lastResolvedSpellId` |
| `FSN-HOME-QUIET` | CADRE | Home + Quiet |
| `FSN-FOE-WOUND` | CADRE | Foe Reel + Wound Mark |
| `FSN-HOLD-VERSE` | COURT | Three-lock including **Quad Span**. Skip `FSN-HOLD-VERSE/QUAD` until remaining `ENEMY_SUMMON_CAP ≥ 4`. Live cap is **2**. |

Queued **#737** (`EED-2026-09-28-001`) adds Pace / Nail / Flush rooms. Unique file `docs/encounters/ENCOUNTER_EVOLUTION_2026-09-28.md`. Day-11 primer ids include `ENC-PACE-01`, `ENC-LONE-01`, `ENC-FLUSH-01`, `ENC-TEACH-11`, `ENC-CLEAN-01` (Clean Gate spend — exploration-only), `ENC-TUTOR-01` (Live Tutor spend — `repeatLoanWhileAlive`), `ENC-MOVE-20` (Far Swap occupancy), `ENC-RUSH-39`…`42` (Table I taught dungeon verbs — **not** canister `roomIndex > 9`).

Owner Encounter / Dungeon tabs ingest #727 / #737 by **id union**. Duplicate `export function` copies of the same helper fail Caffeine `vite build`. Do not concatenate drop 11 onto drop 10. Do not invent drop 12. Sequencing / special / rest / branch remain pack fields (`WDEAD-2026-08-31-007`); rest-as-room and `whiteSanctuary` stay prior IDs.

---

## 3. Elite wave 11 is ingest, not concatenate — Penta Span stays illegal at cap 2

Queued **#752** (Wave 11 enemy/elite evolution) proposes 32 world-pack families: `both_mender`, `stride_keeper`, `penta_prelate`, `cadence_trimmer`, `near_hooder`, `gait_sipper`, `cast_siller`, `shove_stinger`, `must_stepper`, `ally_stepper`, `damp_stinger`, `pair_pacer`, `verse_taxer`, `tool_holder`, `spent_lender`, `pair_strider`, `boot_holder`, `near_oather`, `paint_reeler`, `nook_biter`, `stride_marker`, `foe_plater`, `lava_skipper`, `still_plater`, `body_siller`, `clash_mender`, `cadence_shaver`, `gait_taxer`, `brick_wiper`, `watch_muter`, `full_purser`, `pet_cutter`. Extra doors (`both_cantor`, `stride_bursar`, `span_penta`, `trim_precentor`, `pair_gallery`, `hold_nave`, `nook_court`, `stride_pulpit`, `shave_nave`, `court_keep_regent`, `stride_precentor`, `knight_fold_regent`) stay elite extras, not `FAMILY_TYPES`. Court Keep / Pack Stride / Knight Fold stay boss/closed/`ENEMY_ONLY`.

Live elite presentation is still “family variant” at 30% equal weight over seven `FAMILY_TYPES` (`spawnPolicy.ts` 49–57, `FAMILY_VARIANT_CHANCE = 0.3`; test lock 286). There is no `isElite` flag. Family HP is still discarded at battle start (`WDEAD-2026-09-22-002` — do not re-issue). `ENEMY_SUMMON_CAP` is still **2**. **Penta Span (`penta_prelate`) counts as 5** — skip until remaining cap ≥ 5 (same class as Quad Span while cap is 2). `inferSummonArchetype` still has **no** `pentaspan` / `quadspan` key (`enemyAI.ts` 202–225).

Sept Span (`spell-sept-span`, #726) waits for Wave 12. Do not invent elite wave 12. Owner elite probability stays a **second roll** after the family roll (`WDEAD-2026-09-28-002`). Do not concatenate the 32 names onto `FAMILY_TYPES`.

New fail-closed writers Wave 11 adds: `struckThisTurn` (Clash Mend), leftover-MP bank snapshot (Stride Keep). Walk-spend / force-move / last-id stay Wave 10 prerequisites.

---

## 4. Rush Table J exists now — never canister `roomIndex > 9`

`WDEAD-2026-09-27-004` named H0–I3 and **refused to invent Table J**. Queued **#753** adds Wave 12 sheets (`infirm_chanter`, `yoke_subchanter`, `salve_wicker`, `brand_curate`) and **Table J** `J0`–`J3` additive after I:

| Room | Pair | Owner note |
| :--- | :--- | :--- |
| J0 | `infirm_chanter` + `levy_rector` | Tithe-box never occupies the Infirmary |
| J1 | `yoke_subchanter` + `veil_verger` | Pair dests never occupy the Cowl. Occupancy dests, **not** `swapPositions` — compose with #697 **and** #754 landing tax |
| J2 | `salve_wicker` + `bait_vicar` | Bait intercept never occupies the pad. Sentinel + Wisp share remaining cap |
| J3 | `brand_curate` + `oath_dean` | Oath telegraph never occupies the Stylus |

Neither rewrites rooms 0–9. Neither is in live `BOSS_IDS`. `completeBossRushRoom` still `#err`s `roomIndex > 9` (`main.mo` 3317). Jackpot `complete(9)` stays mandatory (`#536`). `_rewardMultiplier` is still loaded then discarded (`WDEAD-2026-09-02-002` — do not re-issue). Do not invent Table K.

---

## 5. New occupancy epochs after knockback / swap / ignore-walls / ghost-raster

`WDEAD-2026-09-28-003` named knockback unseal, swap unseal, ignore-walls Lich, and ghost/minion raster snap. After #739, map integrity opened three more epochs that formations (drop-11 COURT / Face Court / `WF-INV-RETREAT_COLUMN` / Far Swap / Init Swap / Twin Bishop / Void Grandmaster / summoner extras) must compose with:

1. **#755** — snap Twin Bishop `TWIN_FLANK` point-reflection off portal far crumbs (`occupancyTwinFlankUnseal.ts`, `resolveTwinFlankLanding`). Unique-bridge set is empty on dual-path cuts; reflection is unbounded and only clamps 0..15.
2. **#760** — snap summoner `Math.round((player+ally)/2)` minion spawn off portal far crumbs (`occupancyMidpointUnseal.ts`, `resolveMidpointLanding`). Not Twin Bishop reflection; not ghost raster.
3. **#765** — snap Void Grandmaster `VOID_TILES` cardinal range-2 voids off the gate and the only player→exit corridor (`occupancyVoidUnseal.ts`, `resolveVoidTiles`). Drops a void that would seal rather than punching a leftover-island join.

Landing tax (not an occupancy snap, still a VALIDATE epoch after the body lands):

4. **#754** — Swap / Far Swap / Init Swap landings pay the same lava/spikes tax as walk (`swapLandingHazards.ts`).
5. **#763** — Boss teleport / ADVANCE_PER_TURN / knight-jump landings pay the same tax (`bossAbilityLandingHazard.ts`). Chessboard Lich / Twin Bishop / Void extras must report this column.

VALIDATE epochs are now: generate → destack → destack-dump → destack-occupied-floor-2 → choke-pocket snap → (overworld) wander-dump → wander-floor-2 → joint-cut unseal → knockback unseal → swap unseal → ignore-walls unseal → boss-spawn raster snap → **twin-flank snap → midpoint snap → void-tile snap → swap landing tax → boss landing tax**. Drop a slot that cannot destack. Do not punch walls; do not hop a portal cut; do not disable those PRs to keep formation art. Do not edit `mapGen.ts` or the RAF loop from this program. None of #755 / #760 / #765 are wired from WorldExploration.

---

## 6. Simulation Laboratory — still missing; portal-XP-keep remount spy and new columns

No Admin Simulation tab. Tiers preview still caps samples at 500. `longHorizonSim.ts` on `main` samples 10_000 / 50_000 — **do not promote it** (including queued LHIPS #748). Crush vs the 999-capped pack stays `WDEAD-2026-09-23-007`. Wander epoch stays a React-free replay (`WDEAD-2026-09-26-004`). Keep-then-additive spy stays `WDEAD-2026-09-27-007`. Death-cut confirmed-credit remount spy stays `WDEAD-2026-09-28-006` (#698 / #705 / #710).

New report columns (in addition to 09-28): **`twinFlankUnseal`**, **`midpointUnseal`**, **`voidTileUnseal`**, **`swapLandingTax`**, **`bossLandingTax`**, **`catalogFsnDrop11`**, **`catalogEliteWave11`**, **`catalogRushTableJ`**, **`portalXpKeepRemountWriteSkipped`**, **`portalXpKeepRemountXpHonourReplica`**, **`portalXpKeepRemountPlayEntryRefused`**.

New spy (in addition to 09-28-006): queued **#742 / #756 / #759 / #764 / #767** skip or refuse `saveBattleStats` after a **portal +10 XP keep** remount — lock-reset skip (`deathCutConfirmedCreditReplayRemountWriteSkip.ts`), honour unpaid-death XP from **replica leftover** not Play-entry (`…XpHonour.ts`), refuse stale Play-entry honour after portal keep (`…XpKeep.ts`), skip death-replay wipe after portal keep (`…XpKeepReplay.ts`), skip heal wipe after portal keep without unpaid death (`portalXpKeepRemountWriteSkip.ts`). The lab must not call those writers “to preview portal XP.” Do not import `#683` ground Doka spawn.

Hypothetical 100_000 remains a preset, not a career cap.

---

## 7. Owner console IA (unchanged, still missing)

Carved-stone, dark slate, crimson (`#13161f`, `#d8463f`, `#f0c44a`).

```
CONTENT
  Encounters     pools · formations · rarity · objectives · rewards · hazards · rules
                 (ids from EED / FSN catalogs — union, never concatenate copies)
                 VALIDATE epochs: generate · destack · destack-dump · destack-occupied-floor-2
                 · choke-pocket · wander-dump · wander-floor-2 · joint-cut
                 · knockback · swap · ignore-walls · boss-spawn-raster
                 · twin-flank · midpoint · void-tile · swap-landing-tax · boss-landing-tax
  Dungeons       rooms · sequence · special (incl. white sanctuary) · rest · branch
                 · bosses · modifiers · rewards
  Boss Rush      pool · scale · progression · multipliers · sequence
                 (namespaces 0–9 / B0–B3 / … / I0–I3 / J0–J3)
                 jackpot complete(9) is mandatory before extra tables
                 Twin Bishop (room 7) compose with twin-flank unseal
                 Void Grandmaster (room 4) compose with void-tile unseal
  World Events   eligibility (rest / deathRealm / deathRealmPending / whiteSanctuary)
                 · rarity · hazards · elites · grants (incl. repeatLoanWhileAlive / markLoanOneCast)
                 · hooks (liveWxFlag | liveRegistry | announceOnly | unused)
                 · catalogWave 1–11 · modifier id === type · seeded pool non-empty
                 · last-live chance > 0
  Spawn          relative level · equal · above · elite · variant · size · family
                 · spells (relative caster offset, not summonUnitDef.level 99) · AI
                 (sophistication stays relative peer — never if (level >= X))
  Simulation     hypothetical level (unbounded, incl. 100_000) · N · seed · reports
                 · wander epoch (non-RAF) · keep-then-additive spy
                 · death-cut remount spy · portal-XP-keep remount spy
LIFECYCLE
  Drafts         diff vs active · simulate · validate · activate
LEGACY (label unused knobs until migrate)
  Enemies / Regions / Tiers / Modifiers / Bosses / Names
```

Enemy Register chrome is flavor lore — not an encounter catalog and not `getEnemyConfigs` (engine still has **zero** `enemyConfigs` reads).

### Validate gates (08-31 §6 + later runs + this run)

81. Owner Encounter / Dungeon pools can name FSN drop 11 and EED Pace/Nail/Flush by id union. Skip `FSN-HOLD-VERSE/QUAD` while remaining summon cap &lt; 4. `ENC-CLEAN-01` stays exploration-only. `ENC-TUTOR-01` is `grantClass: repeatLoanWhileAlive`. Do not concatenate copies. Do not invent drop 12.
82. Elite wave 11 is a second roll. Extra doors are not family ids. Skip `penta_prelate` while remaining summon cap &lt; 5. Do not concatenate `FAMILY_TYPES`. Do not invent elite wave 12. Clash Mend / Stride Keep fail closed without `struckThisTurn` / leftover-MP bank.
83. Owner Rush namespaces include `J0`–`J3`. Extra tables must not call `completeBossRushRoom` with `roomIndex > 9`. Jackpot `complete(9)` stays mandatory before J payouts. Do not invent Table K.
84. Formations compose with twin-flank unseal, summoner-midpoint unseal, VOID_TILES unseal, swap landing tax, and boss landing tax. Sim reports those columns. Knockback / swap / Lich / ghost stay 09-28-003. No `mapGen.ts` / RAF hunk.
85. Lab spy includes #742 / #756 / #759 / #764 / #767 portal-XP-keep remount skip / honour / refuse. Do not import `WorldExploration`, `#591` live wander, `longHorizonSim`, `mapGen.simulate.ts`, or `#683` ground Doka spawn.
86. Unpublished drop-11 / elite-11 / Table J / EED Pace catalogs stay data until ACTIVATE. VALIDATE refuses deleting live families, the 22-id modifier set, or Rush rooms 0–9 to “make room.”
87. Owner `enabledWaves` still cannot name 12. Do not invent WDD wave 12. Waves 10–11 stay 09-28-001 / 007.

---

## 8. What this program must not do

- Do not implement the pack, the lab, or the tabs in this run.
- Do not edit `WorldExploration.tsx` to overlay waves, dump helpers, family HP, or occupancy unseals.
- Do not edit RAF, `mapGen.ts`, turn order, or `calcScaledDamage`.
- Do not add `levelMax` “for safety” or raise 9999 / 99 / 999 / 100000 as a substitute for relative eligibility.
- Do not invent WDD wave 12, FSN drop 12, elite wave 12, or Rush Table K.
- Do not restack `#680` / `#719` `worldFeatures.ts` onto `#613`.
- Do not promote `longHorizonSim` / `mapGen.simulate.ts` / LHIPS #748 to Admin.
- Do not open a second reward or spell-level writer (including GameKey, feat claim, death-cut remount `saveBattleStats`, or portal-keep remount honour from the lab).
- Do not re-issue prior WDEAD / WDD / EBA / EED / FSN / AFDA / LHIPS / AUX / TBC / SDE / CRC / AEE IDs.
- Do not retune `100 * 2^(N-1)` or Crush.
- Do not mint INIT from Simulation or `saveBattleStats`.
- Do not concatenate sibling catalogs.
- Do not re-issue 09-22-002 (family HP wipe), 09-24-007 (absolute challenges), 09-25-001 (whiteSanctuary), 09-28-001 (wave 10), 09-28-002 (elite 10 / FAMILY_TYPES seven), 09-28-003 (knockback/swap/Lich/ghost), 09-28-004 (last-live chance-0), 09-28-005 (liveWxFlag), 09-28-006 (death-cut remount spy), or 09-28-007 (wave 11).

Extract path (unchanged): wrap `engine/spawnPolicy.ts`; add `engine/encounterFormations.ts`, `engine/encounterSim.ts`, `engine/dungeonPolicy.ts`. Occupancy stays `engine/occupancy.ts` + `engine/battleStartPlacement.ts` plus the queued dump / snap / unseal helpers, including **`occupancyTwinFlankUnseal.ts`**, **`occupancyMidpointUnseal.ts`**, **`occupancyVoidUnseal.ts`**, **`swapLandingHazards.ts`**, **`bossAbilityLandingHazard.ts`**. World-event weights load from the **active** pack (`worldFeatures.ts` is the WDD catalog).

---

## 9. ACTION_ID index (this run only)

| ID | Title | Priority |
| :--- | :--- | :--- |
| WDEAD-2026-09-29-001 | Encounter and dungeon room pools ingest EED Pace/Nail/Flush and FSN drop 11 by id union — skip HOLD-VERSE/QUAD while summon cap is 2 | P1 |
| WDEAD-2026-09-29-002 | Elite wave 11 remains a second roll after FAMILY_TYPES — skip penta_prelate while summon cap is 2; never concatenate | P1 |
| WDEAD-2026-09-29-003 | Boss Rush extra tables include J0–J3 — never canister roomIndex > 9; jackpot complete(9) stays mandatory | P0 |
| WDEAD-2026-09-29-004 | Encounter formations must compose with twin-flank, summoner-midpoint, and VOID_TILES unseals plus swap/boss landing tax | P1 |
| WDEAD-2026-09-29-005 | Simulation Laboratory spies portal-XP-keep remount skip/honour/refuse and reports the new occupancy / tax / catalog columns — still non-RAF | P1 |

Full records: [`ACTION_IDS_WDEAD_2026-09-29.md`](./ACTION_IDS_WDEAD_2026-09-29.md).
