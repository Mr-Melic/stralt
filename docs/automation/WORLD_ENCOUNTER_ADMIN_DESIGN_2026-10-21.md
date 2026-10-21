# World, Dungeon & Encounter Admin Designer — 2026-10-21

**Source automation:** World, Dungeon & Encounter Admin Designer (`1592c6c0-a499-11f1-a7d1-d6b4613131ce`)  
**This run:** `bc-8e59721d-a894-4391-b1a9-a75d5ecee472`  
**HEAD inspected:** `0f5363f` (`main` after #332 — **same HEAD as the 2026-09-21 through 2026-09-29 briefs**)  
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
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-28.md`](https://github.com/Mr-Melic/stralt/pull/739) — waves 10–11 mix, elite wave 10, knockback/swap/Lich/ghost compose, last-live chance-0, liveWxFlag honesty, death-cut remount spy (`WDEAD-2026-09-28-001` … `007`). **Queued, not on `main`.**
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-29.md`](https://github.com/Mr-Melic/stralt/pull/769) — EED Pace/Nail/Flush + FSN drop 11, elite wave 11 / `penta_prelate`, Rush Table J, twin-flank/midpoint/VOID + landing tax, portal-XP-keep remount spy (`WDEAD-2026-09-29-001` … `005`). **Queued, not on `main`.** Explicitly deferred WDD wave 12, FSN drop 12, elite wave 12, and Rush Table K until those catalogs were readable.

This run’s IDs: [`ACTION_IDS_WDEAD_2026-10-21.md`](./ACTION_IDS_WDEAD_2026-10-21.md).

Do **not** re-issue `WDEAD-2026-08-31-*`, `WDEAD-2026-09-01-*`, `WDEAD-2026-09-02-*`, `WDEAD-2026-09-21-*`, `WDEAD-2026-09-22-*`, `WDEAD-2026-09-23-*`, `WDEAD-2026-09-24-*`, `WDEAD-2026-09-25-*`, `WDEAD-2026-09-26-*`, `WDEAD-2026-09-27-*`, `WDEAD-2026-09-28-*`, `WDEAD-2026-09-29-*`, `WDD-*`, `EBA-*`, `EED-*` / `ENC-*`, `FSN-*`, `AFDA-*`, `LHIPS-*`, `EBMA-*`, `MIMA-*`, `TBC-*`, `SDE-*`, `CRC-*`, `AEE-*`, or `AUX-*` (admin UX #564).

Live spawn/admin code has not moved since 09-21 (`0f5363f`). New IDs exist because **queued catalogs and occupancy/persist rails after #769** (WDD wave 12, EED Bash/Dry/Hood, FSN drop 12, elite wave 12, Rush Table K, Enthroned Void anchor unseal, keep-then-remount heal-wipe skip) would be forked if the owner pack were implemented from 09-29 alone.

Do **not** invent WDD wave 13, FSN drop 13, elite wave 13, or Rush Table L. No same-day WDD / FSN / elite sibling exists after #786 / #794 / #796. `CatalogWave` on `main` is still `1 | 2 | 3` until #344 / #399 / #454 / #503 / #578 / #613 / #680 / #719 / **#786** land. **#680** / **#719** / **#786** restack `worldFeatures.ts` (`mergeable_state: unstable`) — consume the **readable wave-10 / wave-11 / wave-12 ids**, do not overlay from Admin, do not restack that file in this program.

---

## 0. What this cron is for

The owner pack, relative spawn knobs, Simulation Laboratory, and DRAFT → SIMULATE → VALIDATE → ACTIVATE **still do not exist**. Admin is still the 15-tab CRUD list (`gameTypes.ts` 482–498; `TABS` 5610–5626). Save is still live.

Preferred lifecycle is unchanged:

**DRAFT → SIMULATE → VALIDATE → ACTIVATE**

Admin / debug / simulation stay **dev-gated**. Simulation must never call `applyRewards`, `saveBattleStats`, `upgradeSpell`, `claimAchievementReward`, `processPendingPurchases`, `redeemGameKey`, persist-lock `commit`, one-shot Doka claim/settle, achievement unlock writers, Boss Rush persist writers (`completeBossRushRoom`, `setBossRushProgress`, `resetBossRush`, `abortBossRush`), write `pbv_pending_death_penalty_*` / arm `deathTriggered`, replay death-cut `saveBattleStats` after a later confirmed credit, honour remount unpaid-death XP from Play-entry, wipe after a portal +10 XP keep remount, or wipe after a keep remount of victory Doka / one-shot Doka / victory XP / GameKey / feat claim / leftover XP.

Oldest-first queued siblings this brief consumes (do not duplicate their IDs):

| PR | Role vs this pack |
| :--- | :--- |
| #337 / #394 / #451 / #534 / #593 / #615 / #684 / #739 / **#769** WDEAD | Prior designer IDs. Stay `NEW`. |
| #344 / #399 / #454 / #503 / #578 / #613 / #680 / #719 / **#786** WDD | Waves 4–**12** `WF-*` on the **same** `WORLD_FEATURES` array. On `main` `CatalogWave` is still `1\|2\|3` (`worldFeatures.ts` 64, 115). Do not invent wave 13. Do not restack `worldFeatures.ts`. |
| #348 / #401 / #459 / #537 / #575 / #612 / #669 / #727 / **#794** FSN | Drops 4–**12**. #794 packs Wave **11** families (`FSN-BOTH-SPEND` … `FSN-CAST-QUIET`). Do not invent drop 13. |
| #347 / #396 / #479 / #519 / #574 / #635 / #672 / #737 / **#771** EED | Tide…Flush plus **Bash / Dry / Hood** (`ENC-TEACH-12` … `ENC-RUSH-46`). Unique file `docs/encounters/ENCOUNTER_EVOLUTION_2026-09-29.md`. Does **not** consume same-day Wave 12 families / FSN drop 12 / WDD wave 12. |
| #349 / #405 / #452 / #535 / #558 / #625 / #686 / #752 / **#796** elite | Waves 4–**12** family sheets. Second roll. Never concatenate `FAMILY_TYPES`. Skip `sept_prelate` while remaining cap &lt; 7. |
| #367 / #406 / #474 / #518 / #572 / #638 / #663 / #753 / **#808** boss bible | Tables C–**K**. Jackpot `complete(9)` stays mandatory (`#536`). Table K is `K0`–`K3` (`flush_psalmist`+`gaze_beadle` …). |
| **#803** Rush persist | Keep `complete(9)` ahead of `resetBossRush`. Consume into Table K / jackpot IDs — do not re-issue 09-25-008. |
| #430 / #436 / #444 / #484 / #494 / #500 / #538 / #542 / #548 / #553 map | Far-island → white-split. **09-25-006 already owns these.** |
| #589 / #600 / #603 destack dump | **09-26-001 already owns these.** |
| #591 / #608 wander dump | **09-26-001 / 09-26-004 already own these.** |
| #628 / #648 / #651 / #656 | Dump floor 2 / choke / joint. **09-27-005 already owns these.** |
| #688 / #697 / #704 / #711 | Knockback / swap / ignore-walls / ghost-raster. **09-28-003 already owns these.** |
| #755 Twin Bishop flank / #760 summoner midpoint / #765 VOID_TILES | **09-29-004 already owns these.** |
| #754 / #763 landing tax | **09-29-004 already owns these.** |
| **#770** Enthroned Void anchors | Snap `ANCHOR_TILES` off portal far crumbs (`occupancyAnchorUnseal.ts`, `resolveAnchorTiles`). Distinct from VOID_TILES. Not wired from WX. |
| #576 / #595 / #602 / #604 Death Realm pending | **09-26-002 already owns eligibility.** |
| #605 / #626 / #650 / #703 modifier pool | **09-26-003 / 09-27-006 / 09-28-004 already own these.** |
| #674 / #716 registry docs | **09-28-005 already owns this.** |
| #698 / #705 / #710 death-cut persist | **09-28-006 already owns the spy.** |
| #742 / #756 / #759 / #764 / #767 portal-XP-keep remount | **09-29-005 already owns the spy.** |
| **#774 / #800 / #807 / #811 / #812 / #813** keep remount heal-wipe | Skip remount heal wipe after victory Doka / one-shot Doka / victory XP / GameKey / feat claim / leftover XP keep without unpaid death. **New lab spy.** Distinct from portal-XP-keep. |
| #657 persist | Keep-then-additive. **09-27-007 already owns the spy.** |
| #564 admin UX | Do not re-issue `AUX-*` or `WDEAD-2026-09-25-002`. |
| #334 / #415 / #585 / #741 AFDA | Honesty copy. Not owner knobs. Do not re-issue 09-02-002. |
| #670 / #637 / #748 LHIPS | Do not promote to Admin Simulation. |
| #689 AEE | Relative peer sophistication. Spawn AI knob stays 08-31-011. |
| #707 CRC | Unpublished catalogs stay design-only. |
| #746 / #792 EBA | Enemy/boss admin re-audit. Consume, do not duplicate `EBA-*`. |
| #683 ground Doka extract | Lab must not import the extracted spawner to mint. |

---

## 1. Re-audit: prior WDEAD IDs (all still `NEW` except 013 PARTIAL)

Live evidence is the 09-21 … 09-29 tables at the same HEAD. Line numbers re-checked this run.

| Cluster | Still true? | This-run note |
| :--- | :--- | :--- |
| `WDEAD-2026-08-31-001`…`015` | Yes (013 PARTIAL) | Picker `floor(999 / ts)` (`combatMath.ts` 58). `computeAITier` stops at 900 → tier 10; 30% uniform 1–10 (36–51). Dungeon extras/Doka still `min(depth, 5)` (`spawnPolicy.ts` 29, 144; `portalRules.ts` 161). Tests lock `dungeonSpawnExtras(99) === extras(5)` (`spawnPolicy.test.ts` 84). Death Realm fallbacks `maxLevel: 5` (WX 13514, 13646) vs entry `9999` (5439). Rest `maxLevel: 9999` (5517). Region match is still a closed interval. No Simulation / Drafts / Encounters / Dungeons / World Events / Spawn tabs. Admin is still 15 tabs (`AdminDashboard.tsx` 5610–5626). |
| `WDEAD-2026-09-01-001`…`010` | Yes | Tiers unlabeled; preview still `[1, 10, 25, 50, 100, 200, 500]` (`AdminDashboard.tsx` 3877). Dual-roll 22 modifiers still the WDD placement contract. `WorldFeatureRunMode` is still `exploration \| dungeon \| bossRush` (`worldFeatures.ts` 67). `isFeatureAllowedInContext` hard-returns false for `deathRealm` (1769). Rest is not an enum value. |
| `WDEAD-2026-09-02-001`…`008` | Yes | Closed 9999 still a reject (`DEFAULT_ELIGIBILITY_LEVEL_MAX` 138). `_rewardMultiplier` still unused (`useBossRush.ts` 209). CatalogNote still claims it is read (`AdminDashboard.tsx` 7141–7146). AdminGuard `minLevel > 999` / `summonUnitDef.level > 99`. `completeBossRushRoom` still `(0, 0)` and `roomIndex > 9` (`main.mo` 3317). |
| `WDEAD-2026-09-21-001`…`007` | Yes (queued #337) | Wave 3 is on `main` (52 `WF-*`, `LATEST_CATALOG_WAVE = 3`). `spawnPolicy.ts` is live defaults. |
| `WDEAD-2026-09-22-001`…`007` | Yes (queued #394) | Family HP still discarded at battle start. Do not re-issue 09-22-002. |
| `WDEAD-2026-09-23-001`…`007` | Yes (queued #451) | Stay `NEW`. |
| `WDEAD-2026-09-24-001`…`007` | Yes (queued #534) | `DEFAULT_CHALLENGES` still absolute. Do not re-issue 09-24-007. |
| `WDEAD-2026-09-25-001`…`008` | Yes (queued #593) | `WorldFeatureRunMode` still lacks `whiteSanctuary`. Do not re-issue 09-25-001 / 09-25-006 / 09-25-008. |
| `WDEAD-2026-09-26-001`…`004` | Yes (queued #615) | Do not re-issue. |
| `WDEAD-2026-09-27-001`…`007` | Yes (queued #684) | Do not re-issue. |
| `WDEAD-2026-09-28-001`…`007` | Yes (queued #739) | `enabledWaves` still cannot name 10 or 11 on `main`. FAMILY_TYPES is still seven. Do not re-issue 09-28-001…007. |
| `WDEAD-2026-09-29-001`…`005` | Yes (queued #769) | FSN drop 11 / elite 11 / Table J / twin-flank / midpoint / VOID / portal-keep remount stay those IDs. Wave 12 / drop 12 / elite 12 / Table K / Enthroned Void anchors / keep-remount heal-wipe are **this** run. Do not re-issue 09-29-001 if FSN drop 11 / ENC-PACE-01 still uningested. Do not re-issue 09-29-002 if FAMILY_TYPES is still seven / penta still illegal at cap 2. Do not re-issue 09-29-003 if J still cannot exist without `roomIndex > 9`. Do not re-issue 09-29-004 if twin-flank/midpoint/VOID compose is still missing. Do not re-issue 09-29-005 if portal-keep remount is still unspied. |

Missing tabs (unchanged): Encounters, Dungeons, World Events, Spawn (beyond coarse tiers), Simulation, Drafts.

`generateEnemies` still scatters `rollOverworldEnemyCount` (1..8 + depth extras), random chess piece, quadrant + Chebyshev ≥ 4 (`WX` 5711–5743; `spawnPolicy.ts` 31–57). Family overlay is still 30% equal-weight over seven `FAMILY_TYPES`. Engine still has **zero** `enemyConfigs` reads in WorldExploration. WX still does not import `worldFeatures`. `MAX_ENEMIES = 20` (`gameConstants.ts` 10). `ENEMY_SUMMON_CAP = 2` (`gameConstants.ts` 300).

---

## 2. WDD wave 12 exists now — owner `enabledWaves` must name 12

`WDEAD-2026-09-29` **refused to invent WDD wave 12**. Queued **#786** (`WDD-2026-09-29-001`) now adds sixteen overlay ids on the **same** `WORLD_FEATURES` array (unions waves 4–11, then wave 12). Unique wave-12 ids:

| Id | Owner note |
| :--- | :--- |
| `WF-HAZ-BOND_SEAM` | Summon-bonded step tax (not Flint AP / Lectern spell / Kin free-trap) |
| `WF-HAZ-SHY_CINDER` | Orb steps **away** from the nearest body (not Hunt toward / rim clockwise) |
| `WF-TRP-SIDE_PLATE` | Side-claimed plate (not first-step Glyph or facing Chevron) |
| `WF-TER-BLAST_URN` | Walkable Chebyshev-1 blast urn (not barrel roll or delayed pyre) |
| `WF-OBS-HEAL_SILL` | Heal-adjacent unlatch sill |
| `WF-ZON-LABOR_FONT` | 2-AP-then-heal font (not unconditional Shrine) |
| `WF-TEL-CLEAR_STEP` | Empty-dest pads with **no swap** (not Mirror/Init/Far) |
| `WF-PRT-TALLY_GATE` | 4-AP-spent extra portal. **Exploration-only** |
| `WF-INV-HOLLOW_FILE` | Soft-threat swarm (4–6 extras). Counts toward map-clear in dungeon / Rush |
| `WF-ELT-HIGH_PICKET` | Elite stands at ≥80% HP (inverse Low Picket). Stands from map start in dungeon / Rush |
| `WF-TRS-HIRE_CACHE` | Summon-adjacent chest (not Kin trap) |
| `WF-SPL-MERCY_SCRIBE` | Wound-to-30%-alive one-cast (`grantClass: oneCast` — 09-02-004, do not re-issue) |
| `WF-RSK-BAND_OATH` | Mid-band 40–70% HP wager |
| `WF-MOD-ORTH_STEP` | Diagonal 2-MP walk (not Crosswind slide) |
| `WF-EVT-MERCY_BELL` | Leave-a-hostile-alive event (inverse Pilgrim). **Exploration-only** |
| `WF-ENV-EXIT_DRAFT` | Portal-ring end-turn tax |

`#786` restacks `worldFeatures.ts` the same way `#680` / `#719` do. Owner `enabledWaves` on `main` still cannot name 10, 11, **or 12**. Consume the readable ids. One roll budget still includes the 22 live modifiers (`WDEAD-2026-09-01-003` / `09-02-003`). Death Realm stays `[]`. Do not overlay from Admin. Do not invent wave 13.

---

## 3. EED Bash/Dry/Hood and FSN drop 12 exist now — ingest by id union

`WDEAD-2026-09-29-001` ingested Pace/Nail/Flush and FSN drop 11 and **refused to invent drop 12**. Queued **#771** (`EED-2026-09-29-001`) adds Bash / Dry / Hood rooms. Unique file `docs/encounters/ENCOUNTER_EVOLUTION_2026-09-29.md`. Primer ids include `ENC-TEACH-12`, `ENC-BASH-01`, `ENC-DRY-01`, `ENC-HOOD-01`, `ENC-TICK-01`, `ENC-HOME-01`, `ENC-EXIT-01`, `ENC-FANG-01`, `ENC-WIPE-01`, `ENC-CHASE-01`, `ENC-KEEP-01`, `ENC-STRETCH-01`, `ENC-HOLD-03`, `ENC-RUSH-43`…`46`. `#771` spends leftover **drop-11** packs and **Wave 11** world features (`WF-HAZ-LATE_SEAM` … `WF-ENV-CORNER_DRAFT`). It does **not** consume same-day Wave 12 families / FSN drop 12 / WDD wave 12.

`ENC-RUSH-43`…`46` teach Table J verbs (infirmary / cowl / pad / stylus) and must not call `completeBossRushRoom` with `roomIndex > 9`. Honesty fallbacks stay those named in #771 (SLAM / PURSE / BOOT / …) when `forcedMovedThisTurn` / leftover-AP / Far Hood writers are missing.

Queued **#794** (`docs/design/ENEMY_FORMATIONS_2026-09-29.md`) now packs Wave **11** families as sixteen `FSN-*` sheets. Unique file. Do not restack drop 11 (#727).

Drop 12 ids:

| Id | Grade | Owner note |
| :--- | :--- | :--- |
| `FSN-BOTH-SPEND` | PAIR | Dual-walk heal + walked-ally MP grant. Band 0 → show `FSN-GAIT-PACE` |
| `FSN-STRIDE-DAMP` | PAIR | Leftover-MP bank + leftover-MP poke |
| `FSN-NEAR-MUST` | PAIR | Melee-band miss + force 1-step |
| `FSN-PAINT-NOOK` | PAIR | Pull toward paint + exactly-one-block |
| `FSN-ALLY-SILL` | CELL | Ally-to-caster relocate + Strike-only tile |
| `FSN-BODY-CLASH` | CELL | Primary cannot leave + Struck heal. Fail closed without `struckThisTurn` |
| `FSN-LAVA-STILL` | CELL | 1-tile lava skip + leftover-MP-0 +RES |
| `FSN-BRICK-WATCH` | CELL | Erase barrier + mute overwatch |
| `FSN-BOTH-CHOIR` | BRIGADE | Fund two walks, then cash the dual-walk 8 |
| `FSN-STRIDE-BANK` | BRIGADE | Bank leftover MP, poke ≥ 2 leftover, steal the step |
| `FSN-NEAR-STEP` | BRIGADE | Force a 1-step into melee miss, then snipe from 3 |
| `FSN-SHOVE-PACE` | BRIGADE | Paint the landing, march the pair onto it. Fail closed without `forcedMovedThisTurn` |
| `FSN-TRIM-TAX` | CADRE | −1 Inferno so they recast into +1 AP. Fail closed without `lastResolvedSpellId` |
| `FSN-STRIDE-PULPIT` | CADRE | Cell-leave paint + one Manhattan-2 |
| `FSN-BOOT-OATH` | CADRE | Nail feet until Strike, then forbid long confirms |
| `FSN-CAST-QUIET` | COURT | Tile forbids tools, tile forbids Strike, unit forbids tools until Strike. Skip `FSN-CAST-QUIET/PENTA` until remaining `ENEMY_SUMMON_CAP ≥ 5`. Live cap is **2**. |

Owner Encounter / Dungeon tabs ingest #771 / #794 by **id union**. Duplicate `export function` copies of the same helper fail Caffeine `vite build`. Do not concatenate drop 12 onto drop 11. Do not invent drop 13. Sequencing / special / rest / branch remain pack fields (`WDEAD-2026-08-31-007`); rest-as-room and `whiteSanctuary` stay prior IDs.

---

## 4. Elite wave 12 is ingest, not concatenate — Sept Span stays illegal at cap 2

`WDEAD-2026-09-29-002` named elite wave 11 and **refused to invent wave 12**. Queued **#796** proposes 32 world-pack families: `heave_mender`, `dual_keeper`, `sept_prelate`, `cadence_halver`, `mid_hooder`, `ready_stinger`, `heave_stepper`, `drift_siller`, `drift_holder`, `drift_lender`, `drift_sipper`, `drift_prelate`, `heave_bouncer`, `must_drifter`, `verse_pacer`, `inch_warder`, `rite_holder`, `long_oather`, `cinder_reeler`, `side_biter`, `ingress_marker`, `off_plater`, `spike_skipper`, `tapped_plater`, `brace_chanter`, `bar_mender`, `cadence_pinner`, `still_taxer`, `brick_sprouter`, `watch_feer`, `lone_purser`, `banner_cutter`. Extra doors (`heave_cantor`, `dual_bursar`, `span_sept`, `halve_precentor`, …) stay elite extras, not `FAMILY_TYPES`. Court Dual / Pack Close / Mid Fold stay boss/closed/`ENEMY_ONLY`.

Live elite presentation is still “family variant” at 30% equal weight over seven `FAMILY_TYPES` (`spawnPolicy.ts` 49–57, `FAMILY_VARIANT_CHANCE = 0.3`; test lock 286). There is no `isElite` flag. Family HP is still discarded at battle start (`WDEAD-2026-09-22-002` — do not re-issue). `ENEMY_SUMMON_CAP` is still **2**. **Sept Span (`sept_prelate`) counts as 7** — skip until remaining cap ≥ 7 (same class as Quad / Penta while cap is 2). `inferSummonArchetype` still has **no** `septspan` / `pentaspan` / `quadspan` / `driftpost` key (`enemyAI.ts` 202–225).

SPELL_PROPOSALS Wave 12 (`#787`, Parched Mend … Court Imprint, including Six Span) waits for Wave 13. Do not invent elite wave 13. Owner elite probability stays a **second roll** after the family roll (`WDEAD-2026-09-28-002` / `09-29-002`). Do not concatenate the 32 names onto `FAMILY_TYPES`.

New fail-closed writers Wave 12 adds: `lastForcedMoveDir` (Must Drift), Dual Keep leftover-AP **and** leftover-MP snapshot. Force-move / walk-spend / last-id / leftover-MP bank stay Wave 10–11 prerequisites.

---

## 5. Rush Table K exists now — never canister `roomIndex > 9`

`WDEAD-2026-09-29-003` named J0–J3 and **refused to invent Table K**. Queued **#808** adds Wave 13 sheets (`flush_psalmist`, `lone_lector`, `plate_bursar`, `lend_proctor`) and **Table K** `K0`–`K3` additive after J:

| Room | Pair | Owner note |
| :--- | :--- | :--- |
| K0 | `flush_psalmist` + `gaze_beadle` | Crosier / facing-pin cell never occupies the Psalter. Missing `currentView` never pins |
| K1 | `lone_lector` + `aisle_canon` | Triple-span posts never occupy the Ambo. Sentinel + Archer + posts share remaining cap |
| K2 | `plate_bursar` + `ram_castellan` | Brace dest never occupies the Aumbry. Compose with #763 boss landing tax |
| K3 | `lend_proctor` + `brick_cellarer` | Mortar dest never occupies the Coffer |

Neither rewrites rooms 0–9 nor Tables B–J. Neither is in live `BOSS_IDS`. `completeBossRushRoom` still `#err`s `roomIndex > 9` (`main.mo` 3317). Jackpot `complete(9)` stays mandatory (`#536`). Queued **#803** keeps `complete(9)` ahead of `resetBossRush` — consume, do not re-issue 09-25-008. `_rewardMultiplier` is still loaded then discarded (`WDEAD-2026-09-02-002` — do not re-issue). Do not invent Table L.

---

## 6. New occupancy epoch after twin-flank / midpoint / VOID / landing tax

`WDEAD-2026-09-29-004` named twin-flank unseal, summoner-midpoint unseal, VOID_TILES unseal, and swap/boss landing tax. After #769, map integrity opened one more epoch that formations (drop-12 COURT / Face Court / Enthroned Void extras / `WF-TER-BLAST_URN`) must compose with:

1. **#770** — snap Enthroned Void `ANCHOR_TILES` off portal far crumbs (`occupancyAnchorUnseal.ts`, `resolveAnchorTiles`). Unique vs VOID_TILES: this plants **required interactable glyphs** via a full-board shuffle (`allTiles` includes portals). Unique-corridor landings stay legal — the player must step on the glyph, unlike a void on the same cell. Occupancy 1+1 cannot move glyph markers. Fight-graph snap onto a steppable cell; drop leftover-island dests rather than punch.

VALIDATE epochs are now: generate → destack → destack-dump → destack-occupied-floor-2 → choke-pocket snap → (overworld) wander-dump → wander-floor-2 → joint-cut unseal → knockback unseal → swap unseal → ignore-walls unseal → boss-spawn raster snap → twin-flank snap → midpoint snap → void-tile snap → **anchor-tile snap** → swap landing tax → boss landing tax. Drop a slot that cannot destack. Do not punch walls; do not hop a portal cut; do not disable those PRs to keep formation art. Do not edit `mapGen.ts` or the RAF loop from this program. #770 is not wired from WorldExploration.

---

## 7. Simulation Laboratory — still missing; keep-remount heal-wipe spy and new columns

No Admin Simulation tab. Tiers preview still caps samples at 500. `longHorizonSim.ts` on `main` samples 10_000 / 50_000 — **do not promote it** (including queued LHIPS #748). Crush vs the 999-capped pack stays `WDEAD-2026-09-23-007`. Wander epoch stays a React-free replay (`WDEAD-2026-09-26-004`). Keep-then-additive spy stays `WDEAD-2026-09-27-007`. Death-cut confirmed-credit remount spy stays `WDEAD-2026-09-28-006`. Portal-XP-keep remount spy stays `WDEAD-2026-09-29-005`.

New report columns (in addition to 09-29): **`anchorUnseal`**, **`catalogWddWave12`**, **`catalogFsnDrop12`**, **`catalogEliteWave12`**, **`catalogEedBashDryHood`**, **`catalogRushTableK`**, **`keepRemountHealWipeSkipped`**.

New spy (in addition to 09-29-005): queued **#774 / #800 / #807 / #811 / #812 / #813** skip remount heal `saveBattleStats` after a **keep** of victory Doka / one-shot Doka / victory XP / GameKey / feat claim / leftover XP when there is no unpaid death (`victoryDokaKeepRemountWriteSkip.ts`, `oneShotDokaKeepRemountWriteSkip.ts`, `victoryXpKeepRemountWriteSkip.ts`, `gameKeyDokaKeepRemountWriteSkip.ts`, `featDokaKeepRemountWriteSkip.ts`, `xpCreditKeepRemountWriteSkip.ts`). Distinct from portal +10 XP keep. The lab must not call those writers “to preview a keep.” Do not import `#683` ground Doka spawn.

Hypothetical 100_000 remains a preset, not a career cap.

---

## 8. Owner console IA (unchanged, still missing)

Carved-stone, dark slate, crimson (`#13161f`, `#d8463f`, `#f0c44a`).

```
CONTENT
  Encounters     pools · formations · rarity · objectives · rewards · hazards · rules
                 (ids from EED / FSN catalogs — union, never concatenate copies)
                 VALIDATE epochs: generate · destack · destack-dump · destack-occupied-floor-2
                 · choke-pocket · wander-dump · wander-floor-2 · joint-cut
                 · knockback · swap · ignore-walls · boss-spawn-raster
                 · twin-flank · midpoint · void-tile · anchor-tile
                 · swap-landing-tax · boss-landing-tax
  Dungeons       rooms · sequence · special (incl. white sanctuary) · rest · branch
                 · bosses · modifiers · rewards
  Boss Rush      pool · scale · progression · multipliers · sequence
                 (namespaces 0–9 / B0–B3 / … / J0–J3 / K0–K3)
                 jackpot complete(9) is mandatory before extra tables
                 Twin Bishop (room 7) compose with twin-flank unseal
                 Void Grandmaster (room 4) compose with void-tile unseal
                 Enthroned Void extras compose with anchor-tile unseal
  World Events   eligibility (rest / deathRealm / deathRealmPending / whiteSanctuary)
                 · rarity · hazards · elites · grants (incl. repeatLoanWhileAlive / markLoanOneCast / oneCast)
                 · hooks (liveWxFlag | liveRegistry | announceOnly | unused)
                 · catalogWave 1–12 · modifier id === type · seeded pool non-empty
                 · last-live chance > 0
  Spawn          relative level · equal · above · elite · variant · size · family
                 · spells (relative caster offset, not summonUnitDef.level 99) · AI
                 (sophistication stays relative peer — never if (level >= X))
  Simulation     hypothetical level (unbounded, incl. 100_000) · N · seed · reports
                 · wander epoch (non-RAF) · keep-then-additive spy
                 · death-cut remount spy · portal-XP-keep remount spy
                 · keep-remount heal-wipe spy
LIFECYCLE
  Drafts         diff vs active · simulate · validate · activate
LEGACY (label unused knobs until migrate)
  Enemies / Regions / Tiers / Modifiers / Bosses / Names
```

Enemy Register chrome is flavor lore — not an encounter catalog and not `getEnemyConfigs` (engine still has **zero** `enemyConfigs` reads).

### Validate gates (08-31 §6 + later runs + this run)

88. Owner `enabledWaves` can name 12. Tally Gate and Mercy Bell stay exploration-only. High Picket stands from map start in dungeon / Rush. Do not concatenate copies. Do not invent wave 13. Do not restack `worldFeatures.ts`.
89. Owner Encounter / Dungeon pools can name EED Bash/Dry/Hood and FSN drop 12 by id union. Skip `FSN-CAST-QUIET/PENTA` while remaining summon cap &lt; 5. `ENC-RUSH-43`…`46` never emit canister `roomIndex > 9`. Do not concatenate copies. Do not invent drop 13.
90. Elite wave 12 is a second roll. Extra doors are not family ids. Skip `sept_prelate` while remaining summon cap &lt; 7. Do not concatenate `FAMILY_TYPES`. Do not invent elite wave 13. Dual Keep / Must Drift fail closed without leftover-AP+MP bank / `lastForcedMoveDir`.
91. Owner Rush namespaces include `K0`–`K3`. Extra tables must not call `completeBossRushRoom` with `roomIndex > 9`. Jackpot `complete(9)` stays mandatory before K payouts and ahead of `resetBossRush` (#803). Do not invent Table L.
92. Formations compose with Enthroned Void anchor unseal. Sim reports `anchorUnseal`. Twin-flank / midpoint / VOID / landing-tax stay 09-29-004. No `mapGen.ts` / RAF hunk.
93. Lab spy includes #774 / #800 / #807 / #811 / #812 / #813 keep-remount heal-wipe skip. Portal-XP-keep stays 09-29-005. Do not import `WorldExploration`, `#591` live wander, `longHorizonSim`, `mapGen.simulate.ts`, or `#683` ground Doka spawn.
94. Unpublished wave-12 / drop-12 / elite-12 / Table K / EED Bash catalogs stay data until ACTIVATE. VALIDATE refuses deleting live families, the 22-id modifier set, or Rush rooms 0–9 to “make room.”

---

## 9. What this program must not do

- Do not implement the pack, the lab, or the tabs in this run.
- Do not edit `WorldExploration.tsx` to overlay waves, dump helpers, family HP, or occupancy unseals.
- Do not edit RAF, `mapGen.ts`, turn order, or `calcScaledDamage`.
- Do not add `levelMax` “for safety” or raise 9999 / 99 / 999 / 100000 as a substitute for relative eligibility.
- Do not invent WDD wave 13, FSN drop 13, elite wave 13, or Rush Table L.
- Do not restack `#680` / `#719` / `#786` `worldFeatures.ts` onto `#613`.
- Do not promote `longHorizonSim` / `mapGen.simulate.ts` / LHIPS #748 to Admin.
- Do not open a second reward or spell-level writer (including GameKey, feat claim, death-cut remount `saveBattleStats`, portal-keep remount honour, or keep-remount heal wipe from the lab).
- Do not re-issue prior WDEAD / WDD / EBA / EED / FSN / AFDA / LHIPS / AUX / TBC / SDE / CRC / AEE IDs.
- Do not retune `100 * 2^(N-1)` or Crush.
- Do not mint INIT from Simulation or `saveBattleStats`.
- Do not concatenate sibling catalogs.
- Do not re-issue 09-22-002 (family HP wipe), 09-24-007 (absolute challenges), 09-25-001 (whiteSanctuary), 09-28-001 (wave 10), 09-28-002 (elite 10 / FAMILY_TYPES seven), 09-28-003 (knockback/swap/Lich/ghost), 09-28-004 (last-live chance-0), 09-28-005 (liveWxFlag), 09-28-006 (death-cut remount spy), 09-28-007 (wave 11), 09-29-001 (FSN drop 11 / EED Pace), 09-29-002 (elite 11 / penta), 09-29-003 (Table J), 09-29-004 (twin-flank/midpoint/VOID), or 09-29-005 (portal-XP-keep remount spy).

Extract path (unchanged): wrap `engine/spawnPolicy.ts`; add `engine/encounterFormations.ts`, `engine/encounterSim.ts`, `engine/dungeonPolicy.ts`. Occupancy stays `engine/occupancy.ts` + `engine/battleStartPlacement.ts` plus the queued dump / snap / unseal helpers, including **`occupancyAnchorUnseal.ts`**. World-event weights load from the **active** pack (`worldFeatures.ts` is the WDD catalog).

---

## 10. ACTION_ID index (this run only)

| ID | Title | Priority |
| :--- | :--- | :--- |
| WDEAD-2026-10-21-001 | Owner `enabledWaves` can name catalogWave 12 — ingest WDD wave 12 by id union; Tally Gate / Mercy Bell stay exploration-only | P0 |
| WDEAD-2026-10-21-002 | Encounter and dungeon room pools ingest EED Bash/Dry/Hood and FSN drop 12 by id union — skip CAST-QUIET/PENTA while summon cap is 2 | P1 |
| WDEAD-2026-10-21-003 | Elite wave 12 remains a second roll after FAMILY_TYPES — skip sept_prelate while summon cap is 2; never concatenate | P1 |
| WDEAD-2026-10-21-004 | Boss Rush extra tables include K0–K3 — never canister roomIndex > 9; jackpot complete(9) stays mandatory | P0 |
| WDEAD-2026-10-21-005 | Encounter formations must compose with Enthroned Void ANCHOR_TILES unseal | P1 |
| WDEAD-2026-10-21-006 | Simulation Laboratory spies keep-remount heal-wipe skip and reports wave-12 / drop-12 / elite-12 / Table K / anchor columns — still non-RAF | P1 |

Full records: [`ACTION_IDS_WDEAD_2026-10-21.md`](./ACTION_IDS_WDEAD_2026-10-21.md).
