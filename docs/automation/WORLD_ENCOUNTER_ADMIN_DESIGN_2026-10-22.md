# World, Dungeon & Encounter Admin Designer — 2026-10-22

**Source automation:** World, Dungeon & Encounter Admin Designer (`1592c6c0-a499-11f1-a7d1-d6b4613131ce`)  
**This run:** `bc-e9a4ec86-273f-4e1d-8b09-5dab7560e518`  
**HEAD inspected:** `0f5363f` (`main` after #332 — **same HEAD as the 2026-09-21 through 2026-10-21 briefs**)  
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
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-29.md`](https://github.com/Mr-Melic/stralt/pull/769) — EED Pace/Nail/Flush + FSN drop 11, elite wave 11 / `penta_prelate`, Rush Table J, twin-flank/midpoint/VOID + landing tax, portal-XP-keep remount spy (`WDEAD-2026-09-29-001` … `005`). **Queued, not on `main`.**
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-10-21.md`](https://github.com/Mr-Melic/stralt/pull/829) — WDD wave 12, EED Bash/Dry/Hood + FSN drop 12, elite wave 12 / `sept_prelate`, Rush Table K, Enthroned Void ANCHOR_TILES, keep-remount heal-wipe spy (`WDEAD-2026-10-21-001` … `006`). **Queued, not on `main`.** Explicitly deferred WDD wave 13, FSN drop 13, elite wave 13, and Rush Table L until those catalogs were readable.

This run’s IDs: [`ACTION_IDS_WDEAD_2026-10-22.md`](./ACTION_IDS_WDEAD_2026-10-22.md).

Do **not** re-issue `WDEAD-2026-08-31-*`, `WDEAD-2026-09-01-*`, `WDEAD-2026-09-02-*`, `WDEAD-2026-09-21-*`, `WDEAD-2026-09-22-*`, `WDEAD-2026-09-23-*`, `WDEAD-2026-09-24-*`, `WDEAD-2026-09-25-*`, `WDEAD-2026-09-26-*`, `WDEAD-2026-09-27-*`, `WDEAD-2026-09-28-*`, `WDEAD-2026-09-29-*`, `WDEAD-2026-10-21-*`, `WDD-*`, `EBA-*`, `EED-*` / `ENC-*`, `FSN-*`, `AFDA-*`, `LHIPS-*`, `EBMA-*`, `MIMA-*`, `TBC-*`, `SDE-*`, `CRC-*`, `AEE-*`, or `AUX-*` (admin UX #564).

Live spawn/admin code has not moved since 09-21 (`0f5363f`). New IDs exist because **queued catalogs and occupancy/persist rails after #829** (WDD waves 13–14, EED Both/Stride/Near + Heave/Dual/Mid, FSN drops 13–14, elite waves 13–14, Rush Tables L–M, spike/lava/moveToward/king/erratic/shock unseals + Chessboard Lich board-transform landing tax, HP/Rush/one-shot/GameKey remount death-cut spies) would be forked if the owner pack were implemented from 10-21 alone.

Do **not** invent WDD wave 15, FSN drop 15, elite wave 15, or Rush Table N. No same-day WDD / FSN / elite / Rush sibling exists after #902 / #897 / #899 / #903. `CatalogWave` on `main` is still `1 | 2 | 3` until #344 / #399 / #454 / #503 / #578 / #613 / #680 / #719 / #786 / **#848** / **#902** land. **#680** / **#719** / **#786** / **#848** / **#902** restack `worldFeatures.ts` (`mergeable_state: unstable`) — consume the **readable wave-10 … wave-14 ids**, do not overlay from Admin, do not restack that file in this program.

---

## 0. What this cron is for

The owner pack, relative spawn knobs, Simulation Laboratory, and DRAFT → SIMULATE → VALIDATE → ACTIVATE **still do not exist**. Admin is still the 15-tab CRUD list (`gameTypes.ts` 482–498; `TABS` 5610–5626). Save is still live.

Preferred lifecycle is unchanged:

**DRAFT → SIMULATE → VALIDATE → ACTIVATE**

Admin / debug / simulation stay **dev-gated**. Simulation must never call `applyRewards`, `saveBattleStats`, `upgradeSpell`, `claimAchievementReward`, `processPendingPurchases`, `redeemGameKey`, persist-lock `commit`, one-shot Doka claim/settle, achievement unlock writers, Boss Rush persist writers (`completeBossRushRoom`, `setBossRushProgress`, `resetBossRush`, `abortBossRush`), write `pbv_pending_death_penalty_*` / arm `deathTriggered`, replay death-cut `saveBattleStats` after a later confirmed credit, honour remount unpaid-death XP from Play-entry, wipe after a portal +10 XP keep remount, wipe after a keep remount of victory Doka / one-shot Doka / victory XP / GameKey / feat claim / leftover XP, wipe remount HP after death / heal / throw-after-accept, or wipe remount death after Boss Rush Doka / victory Doka / one-shot Doka / GameKey keep.

Oldest-first queued siblings this brief consumes (do not duplicate their IDs):

| PR | Role vs this pack |
| :--- | :--- |
| #337 / #394 / #451 / #534 / #593 / #615 / #684 / #739 / #769 / **#829** WDEAD | Prior designer IDs. Stay `NEW`. |
| #344 / #399 / #454 / #503 / #578 / #613 / #680 / #719 / #786 / **#848** / **#902** WDD | Waves 4–**14** `WF-*` on the **same** `WORLD_FEATURES` array. On `main` `CatalogWave` is still `1\|2\|3` (`worldFeatures.ts` 64, 115). Do not invent wave 15. Do not restack `worldFeatures.ts`. |
| #348 / #401 / #459 / #537 / #575 / #612 / #669 / #727 / #794 / **#825** / **#897** FSN | Drops 4–**14**. #825 packs Wave **12** families (`FSN-HEAVE-LEND` … `FSN-DRIFT-COURT`). #897 packs Wave **13** families (`FSN-DRY-STEP` … `FSN-LEAN-HOLD`). Do not invent drop 15. |
| #347 / #396 / #479 / #519 / #574 / #635 / #672 / #737 / #771 / **#826** / **#885** EED | Tide…Bash plus **Both / Stride / Near** (`ENC-TEACH-13` … `ENC-RUSH-50`) and **Heave / Dual / Mid** (`ENC-TEACH-14` … `ENC-RUSH-54`). Unique files `docs/encounters/ENCOUNTER_EVOLUTION_2026-10-21.md` / `…2026-10-22.md`. #826 does **not** consume Wave 13 families / FSN drop 13 / WDD wave 13. #885 spends leftover drop-13 packs + Wave 13 WFs and does **not** consume Wave 14 families / FSN drop 14 / WDD wave 14. |
| #349 / #405 / #452 / #535 / #558 / #625 / #686 / #752 / #796 / **#840** / **#899** elite | Waves 4–**14** family sheets. Second roll. Never concatenate `FAMILY_TYPES`. Skip `six_prelate` while remaining cap &lt; 6. Skip `oct_prelate` while remaining cap &lt; 8. Skip `sept_prelate` while remaining cap &lt; 7 (10-21-003). |
| #367 / #406 / #474 / #518 / #572 / #638 / #663 / #753 / #808 / **#836** / **#903** boss bible | Tables C–**M**. Jackpot `complete(9)` stays mandatory (`#536`). Table L is `L0`–`L3` (`effigy_clerk`+`lock_marshal` … `quiet_chorister`+`bone_cavalier`). Table M is `M0`–`M3` (`jostle_subdeacon`+`counter_chaplain` … `hood_recluse`+`hexed_marker`). |
| **#803** Rush persist | Keep `complete(9)` ahead of `resetBossRush`. Consume into Table L / Table M / jackpot IDs — do not re-issue 09-25-008. |
| #430 / #436 / #444 / #484 / #494 / #500 / #538 / #542 / #548 / #553 map | Far-island → white-split. **09-25-006 already owns these.** |
| #589 / #600 / #603 destack dump | **09-26-001 already owns these.** |
| #591 / #608 wander dump | **09-26-001 / 09-26-004 already own these.** |
| #628 / #648 / #651 / #656 | Dump floor 2 / choke / joint. **09-27-005 already owns these.** |
| #688 / #697 / #704 / #711 | Knockback / swap / ignore-walls / ghost-raster. **09-28-003 already owns these.** |
| #755 Twin Bishop flank / #760 summoner midpoint / #765 VOID_TILES | **09-29-004 already owns these.** |
| #754 / #763 landing tax | **09-29-004 already owns these.** |
| **#770** Enthroned Void anchors | **10-21-005 already owns ANCHOR_TILES.** |
| **#846** SPIKE_ON_LAND / **#855** LAVA_TRAIL / **#859** greedy `moveToward` / **#867** Chebyshev king-step / **#858** Chessboard Lich board-transform landing tax / **#863** leader-death erratic hop / **#896** `SHOCK_TILES` | **New occupancy epoch after ANCHOR.** Unique-corridor walkable spikes / lava / shock stay legal (unlike VOID). |
| #576 / #595 / #602 / #604 Death Realm pending | **09-26-002 already owns eligibility.** |
| #605 / #626 / #650 / #703 modifier pool | **09-26-003 / 09-27-006 / 09-28-004 already own these.** |
| #674 / #716 registry docs | **09-28-005 already owns this.** |
| #698 / #705 / #710 death-cut persist | **09-28-006 already owns the spy.** |
| #742 / #756 / #759 / #764 / #767 portal-XP-keep remount | **09-29-005 already owns the spy.** |
| #774 / #800 / #807 / #811 / #812 / #813 keep remount heal-wipe | **10-21-006 already owns the spy.** |
| **#847 / #854 / #860** remount HP keep | Skip remount shop wipe after death respawn HP / heal-or-damage HP persist / throw-after-accept HP persist. **New lab spy.** Distinct from keep-remount heal-wipe. |
| **#864 / #866** Boss Rush Doka keep | Shop honour (`#864`) + death-cut honour (`#866`, same `pbv_boss_rush_doka_keep_remount_slotN` key). **New lab spy.** |
| **#869 / #877 / #900** remount death-cut after keep | Victory Doka (`#869`), one-shot Doka (`#877`, reads `#800` `pbv_oneshot_doka_keep_remount_slotN`), GameKey (`#900`, reads `#811` `pbv_gamekey_doka_keep_remount_slotN`). Distinct from `#811` GameKey heal honour. |
| #657 persist | Keep-then-additive. **09-27-007 already owns the spy.** |
| #564 admin UX | Do not re-issue `AUX-*` or `WDEAD-2026-09-25-002`. |
| #334 / #415 / #585 / #741 AFDA | Honesty copy. Not owner knobs. Do not re-issue 09-02-002. |
| #670 / #637 / #748 / **#819** / **#898** LHIPS | Do not promote to Admin Simulation. |
| #689 / **#821** / **#874** AEE | Relative peer sophistication. Spawn AI knob stays 08-31-011. |
| #707 CRC | Unpublished catalogs stay design-only. |
| #746 / #792 / **#817** / **#876** EBA | Enemy/boss admin re-audit. Consume, do not duplicate `EBA-*`. |
| #683 ground Doka extract | Lab must not import the extracted spawner to mint. |
| **#901** portal whirlpool extract | Consume. Not a new occupancy epoch and not a WDEAD overlay. |
| **#890** Wave 14 tactical spells | Wait for Wave 15 family CORE. Do not invent elite wave 15. |
| **#903** Rush Table M | Ingest `M0`–`M3`. Never `roomIndex > 9`. Do not invent Table N. |
| **#904** Boss Rush recap wallet/level feats | Consume. Lab must not attach recap unlocks. Do not re-issue feat-defer IDs. |
| **#905** Frost Bolt MP share | Combat honesty. Not a WDEAD overlay. |
| **#906** Wave-14 spell discovery | Wait for Wave 15 family CORE. Do not invent elite wave 15. |
| **#907** PX coherence | Consume. Not a WDEAD overlay. |

---

## 1. Re-audit: prior WDEAD IDs (all still `NEW` except 013 PARTIAL)

Live evidence is the 09-21 … 10-21 tables at the same HEAD. Line numbers re-checked this run.

| Cluster | Still true? | This-run note |
| :--- | :--- | :--- |
| `WDEAD-2026-08-31-001`…`015` | Yes (013 PARTIAL) | Picker `floor(999 / ts)` (`combatMath.ts` 58). `computeAITier` stops at 900 → tier 10; 30% uniform 1–10 (36–51). Dungeon extras/Doka still `min(depth, 5)` (`spawnPolicy.ts` 29, 144; `portalRules.ts` 161). Tests lock `dungeonSpawnExtras(99) === extras(5)` (`spawnPolicy.test.ts` 84). Death Realm fallbacks `maxLevel: 5` (WX 13514, 13646) vs entry `9999` (5439). Rest `maxLevel: 9999` (5517). Region match is still a closed interval. No Simulation / Drafts / Encounters / Dungeons / World Events / Spawn tabs. Admin is still 15 tabs (`AdminDashboard.tsx` 5610–5626). |
| `WDEAD-2026-09-01-001`…`010` | Yes | Tiers unlabeled; preview still `[1, 10, 25, 50, 100, 200, 500]` (`AdminDashboard.tsx` 3877). Dual-roll 22 modifiers still the WDD placement contract. `WorldFeatureRunMode` is still `exploration \| dungeon \| bossRush` (`worldFeatures.ts` 67). `isFeatureAllowedInContext` hard-returns false for `deathRealm` (1769). Rest is not an enum value. |
| `WDEAD-2026-09-02-001`…`008` | Yes | Closed 9999 still a reject (`DEFAULT_ELIGIBILITY_LEVEL_MAX` 138). `_rewardMultiplier` still unused (`useBossRush.ts` 209). CatalogNote still claims it is read (`AdminDashboard.tsx` 7141–7146). AdminGuard `minLevel > 999` / `summonUnitDef.level > 99`. `completeBossRushRoom` still `(0, 0)` and `roomIndex > 9` (`main.mo` 3317). |
| `WDEAD-2026-09-21-001`…`007` | Yes (queued #337) | Wave 3 is on `main` (52 `WF-*`, `LATEST_CATALOG_WAVE = 3`). `spawnPolicy.ts` is live defaults. |
| `WDEAD-2026-09-22-001`…`007` | Yes (queued #394) | Family HP still discarded at battle start (`WX` 11970–11974). Do not re-issue 09-22-002. |
| `WDEAD-2026-09-23-001`…`007` | Yes (queued #451) | Stay `NEW`. |
| `WDEAD-2026-09-24-001`…`007` | Yes (queued #534) | `DEFAULT_CHALLENGES` still absolute. Do not re-issue 09-24-007. |
| `WDEAD-2026-09-25-001`…`008` | Yes (queued #593) | `WorldFeatureRunMode` still lacks `whiteSanctuary`. Do not re-issue 09-25-001 / 09-25-006 / 09-25-008. |
| `WDEAD-2026-09-26-001`…`004` | Yes (queued #615) | Do not re-issue. |
| `WDEAD-2026-09-27-001`…`007` | Yes (queued #684) | Do not re-issue. |
| `WDEAD-2026-09-28-001`…`007` | Yes (queued #739) | `enabledWaves` still cannot name 10 or 11 on `main`. FAMILY_TYPES is still seven. Do not re-issue 09-28-001…007. |
| `WDEAD-2026-09-29-001`…`005` | Yes (queued #769) | FSN drop 11 / elite 11 / Table J / twin-flank / midpoint / VOID / portal-keep remount stay those IDs. Do not re-issue. |
| `WDEAD-2026-10-21-001`…`006` | Yes (queued #829) | Wave 12 / drop 12 / elite 12 / Table K / ANCHOR / keep-remount heal-wipe stay those IDs. Waves 13–14 / drops 13–14 / elite 13–14 / Table L / post-anchor occupancy / remount HP + Rush/one-shot/GameKey death-cut are **this** run. Do not re-issue 10-21-001 if enabledWaves still cannot name 12. Do not re-issue 10-21-002 if FSN drop 12 / ENC-BASH-01 still uningested. Do not re-issue 10-21-003 if FAMILY_TYPES is still seven / sept still illegal at cap 2. Do not re-issue 10-21-004 if K still cannot exist without `roomIndex > 9`. Do not re-issue 10-21-005 if Enthroned Void anchor compose is still missing. Do not re-issue 10-21-006 if keep-remount heal-wipe is still unspied. |

Missing tabs (unchanged): Encounters, Dungeons, World Events, Spawn (beyond coarse tiers), Simulation, Drafts.

`generateEnemies` still scatters `rollOverworldEnemyCount` (1..8 + depth extras), random chess piece, quadrant + Chebyshev ≥ 4 (`WX` 5711–5743; `spawnPolicy.ts` 31–57). Family overlay is still 30% equal-weight over seven `FAMILY_TYPES` (`spawnPolicy.test.ts` 239 locks `FAMILY_VARIANT_CHANCE = 0.3`). Engine still has **zero** `enemyConfigs` reads in WorldExploration. WX still does not import `worldFeatures`. `MAX_ENEMIES = 20` (`gameConstants.ts` 10). `ENEMY_SUMMON_CAP = 2` (`gameConstants.ts` 300).

---

## 2. WDD waves 13–14 exist now — owner `enabledWaves` must name 13 and 14

`WDEAD-2026-10-21` **refused to invent WDD wave 13**. Queued **#848** (`WDD-2026-10-21-001`) now adds sixteen overlay ids on the **same** `WORLD_FEATURES` array (unions waves 4–12, then wave 13). Unique wave-13 ids:

| Id | Owner note |
| :--- | :--- |
| `WF-HAZ-ODD_SEAM` | Odd-round step tax (not Ember always / Gutter even-vent / Late first-step / Bond first-summon) |
| `WF-HAZ-STILL_CINDER` | Orb hunts 0-MP spenders (inverse Hunt toward / Shy away) |
| `WF-TRP-SPENT_PLATE` | First-action (0 AP spent) plate (not Glyph first-step / Idle end-turn / Side-claimed) |
| `WF-TER-FOLD_WALL` | 1 AP fold / 2 AP smash wall (not Crumble smash-only or Tide auto) |
| `WF-OBS-KILL_SILL` | Kill-to-unlatch sill (not Heal/Spell/Coin/Tithe/Stride/Latch) |
| `WF-ZON-RIVAL_FONT` | Heal only if a living enemy is Chebyshev ≤ 2 (not Shrine unconditional or Isolation tax) |
| `WF-TEL-WOUND_STEP` | Below-50% HP pads (not Clear empty-dest or High Picket ≥80%) |
| `WF-PRT-MARK_GATE` | Hit-a-hostile extra portal. **Exploration-only** |
| `WF-INV-PAIRED_FILE` | Two bonded elites −20% incoming while both live. Counts toward map-clear in dungeon / Rush |
| `WF-ELT-FAR_PICKET` | Elite stands at Chebyshev ≥ 6 (inverse Near Picket). Stands from map start in dungeon / Rush |
| `WF-TRS-TURN_CACHE` | Even-round chest (not Watch far-hostiles / Hire summon-adjacent) |
| `WF-SPL-RANGE_TUTOR` | Range-4 live teach one-cast (`grantClass: oneCast` — 09-02-004, do not re-issue) |
| `WF-RSK-CAST_OATH` | Voluntary must-cast wager (not Kindled map-wide or Spare leftover AP) |
| `WF-MOD-ONE_STRIDE` | At most 1 MP walk per turn (not Orth diagonal 2) |
| `WF-EVT-SUMMON_BELL` | Living-summon-at-credit event (inverse Vacant Hour). Not listed exploration-only |
| `WF-ENV-OPEN_DRAFT` | Open-center end-turn tax (inverse Corner alcove) |

Queued **#902** (`WDD-2026-10-22-001`) then adds sixteen wave-14 ids on the same array. Unique wave-14 ids:

| Id | Owner note |
| :--- | :--- |
| `WF-HAZ-EVEN_SEAM` | Even-round step tax (inverse Odd Seam) |
| `WF-HAZ-HURT_CINDER` | Orb hunts wounded bodies (not Still 0-MP / Shy away / Hunt toward) |
| `WF-TRP-ECHO_PLATE` | Echo of the last plate tax (not Spent first-action) |
| `WF-TER-SLIDE_SCREEN` | Slide-then-smash screen (not Fold 1-AP fold) |
| `WF-OBS-RETREAT_SILL` | Unlatch on a recorded retreat step |
| `WF-ZON-ALONE_FONT` | Heal only if no living enemy is Chebyshev ≤ 2 (inverse Rival Font) |
| `WF-TEL-FULL_STEP` | Pad only if leftover MP is 0 after the step |
| `WF-PRT-INCANT_GATE` | Spell-spent extra portal. **Exploration-only** (with Flicker / Echo / Gambit / Pilgrim / Latch / Wager / Pact / Twilight / Ash / Hearth / Wane / Clean / Still / Tally / Mercy / Mark) |
| `WF-INV-GAP_FILE` | Soft-threat pair (`extraEnemyCount` 2). Counts toward map-clear in dungeon / Rush |
| `WF-ELT-MID_PICKET` | Elite stands at Chebyshev exactly 3. Stands from map start in dungeon / Rush (`extraEnemyCount` 1) |
| `WF-TRS-CLASH_CACHE` | Chest that pays after a recorded Strike |
| `WF-SPL-CLOSE_TUTOR` | Chebyshev-1 live teach one-cast (`grantClass: oneCast`) |
| `WF-RSK-SCAR_OATH` | Voluntary missing-HP wager |
| `WF-MOD-FILE_WALK` | File-only walk (not One Stride 1-MP cap / Orth diagonal 2) |
| `WF-EVT-FAR_HOUR` | Leave-the-map-from-range event. Not listed exploration-only |
| `WF-ENV-HUNT_DRAFT` | End-turn tax while a living hostile is in Chebyshev 1. **Skip when the map has zero enemies** |

`#848` / `#902` restack `worldFeatures.ts` the same way `#680` / `#719` / `#786` do. Owner `enabledWaves` on `main` still cannot name 10, 11, 12, **13, or 14**. Consume the readable ids. One roll budget still includes the 22 live modifiers (`WDEAD-2026-09-01-003` / `09-02-003`). Death Realm stays `[]`. Do not overlay from Admin. Do not invent wave 15.

---

## 3. EED Both/Heave and FSN drops 13–14 exist now — ingest by id union

`WDEAD-2026-10-21-002` ingested Bash/Dry/Hood and FSN drop 12 and **refused to invent drop 13**. Queued **#826** (`docs/encounters/ENCOUNTER_EVOLUTION_2026-10-21.md`) adds Both / Stride / Near rooms. Primer ids include `ENC-TEACH-13`, `ENC-HAZ-25`/`26`, `ENC-SPELL-25`/`26`, `ENC-BOTH-01`, `ENC-DAMP-01`, `ENC-NEAR-01`, `ENC-PAINT-01`, `ENC-WAVE-14`, `ENC-AMBUSH-13`, `ENC-REINF-13`, `ENC-ALLY-02`, `ENC-CLASH-01`, `ENC-SKIP-01`, `ENC-BRICK-01`, `ENC-PACE-02`, `ENC-TRIM-01`, `ENC-QUIET-01`, `ENC-SIDE-01`, `ENC-CLEAR-01`, `ENC-MOVE-24`/`25`, `ENC-SURV-25`/`26`, `ENC-ELITE-24`/`25`, `ENC-PROT-13`, `ENC-PRIO-15`, `ENC-URN-01`, `ENC-ORTH-01`, `ENC-HIGH-01`, `ENC-TREAS-13`, `ENC-HIRE-01`, `ENC-BAND-01`, `ENC-MERCY-02`, `ENC-LABOR-01`, `ENC-TALLY-01`, `ENC-RARE-13`, plus `ENC-REST-13` / `ENC-BRANCH-13` / `ENC-MAST-13` / `ENC-MINI-14` / `ENC-BOSS-13` / `ENC-RUSH-47`…`50`. `#826` spends leftover **drop-12** packs and **Wave 12** world features (`WF-HAZ-BOND_SEAM` … `WF-ENV-EXIT_DRAFT`). It does **not** consume same-day Wave 13 families / FSN drop 13 / WDD wave 13.

`ENC-RUSH-47`…`50` teach Table K verbs (psalter / ambo / aumbry / coffer) and must not call `completeBossRushRoom` with `roomIndex > 9`. Honesty fallbacks stay those named in #826 (PACE / DRY / HOOD / BASH / FANG / SLIP / WIPE / EXIT / STRETCH / HOLD / MARK / AMBUSH-12) when `forcedMovedThisTurn` / leftover-MP bank / `struckThisTurn` / `lastResolvedSpellId` / Near Hood consume writers are missing.

Queued **#885** (`docs/encounters/ENCOUNTER_EVOLUTION_2026-10-22.md`) adds Heave / Dual / Mid rooms. Primer ids include `ENC-TEACH-14`, `ENC-HAZ-27`/`28`, `ENC-SPELL-27`/`28`, `ENC-HEAVE-01`, `ENC-READY-01`, `ENC-MID-01`, `ENC-CINDER-01`, `ENC-DRIFT-01`, `ENC-SPIKE-01`, `ENC-INCH-01`, `ENC-OFF-01`, `ENC-HALVE-01`, `ENC-RITE-01`, `ENC-PIN-02`, `ENC-FOLD-01`, `ENC-SPENT-01`, `ENC-KILL-01`, `ENC-WOUND-01`, `ENC-PROT-14`, `ENC-PRIO-16`, `ENC-AMBUSH-14`, `ENC-SURV-27`/`28`, `ENC-PAIR-02`, `ENC-WAVE-15`, `ENC-REST-14` / `ENC-BRANCH-14` / `ENC-TREAS-14` / `ENC-CAST-01` / `ENC-TURN-01` / `ENC-SUMMON-01`, `ENC-ELITE-26`/`27`, `ENC-RARE-14`, `ENC-MAST-14`, `ENC-MINI-15`, `ENC-BOSS-14`, `ENC-JOIN-01`, `ENC-RUSH-51`…`54`. `#885` spends leftover **drop-13** packs and **Wave 13** world features. It does **not** consume same-day Wave 14 families / FSN drop 14 / WDD wave 14.

`ENC-RUSH-51`…`54` teach Table L verbs (mannequin / narthex / pyx / muffler) and must not call `completeBossRushRoom` with `roomIndex > 9`. Honesty fallbacks stay those named in #885 (BASH / DAMP / NEAR / PAINT / DUMMY / SKIP / BRICK / TRIM / HOLD / SIDE / CLEAR / PROT-13 / PRIO-15 / AMBUSH-13 / SURV-25) when `forcedMovedThisTurn` / leftover-AP+MP bank / `lastForcedMoveDir` / `lastResolvedSpellId` writers are missing.

Queued **#825** (`docs/design/ENEMY_FORMATIONS_2026-10-21.md`) packs Wave **12** families as sixteen `FSN-*` sheets. Unique file. Do not restack drop 12 (#794).

Drop 13 ids:

| Id | Grade | Owner note |
| :--- | :--- | :--- |
| `FSN-HEAVE-LEND` | PAIR | Dual-force heal + force-moved ally +AP. Band 0 → show `FSN-BOTH-SPEND` |
| `FSN-DUAL-READY` | PAIR | Leftover-AP **and** leftover-MP bank + leftover-pair poke |
| `FSN-MID-DRIFT` | PAIR | Exactly-2 miss + remaining walks follow `lastForcedMoveDir` |
| `FSN-CINDER-MARK` | PAIR | Pull toward hazard + cell-enter detonate |
| `FSN-DRIFT-GATE` | CELL | Relocate-landing detonate + relocate-dest refuse. `summonAI: "driftpost"` |
| `FSN-SPIKE-TAP` | CELL | 1-tile spike as floor + leftover-AP-0 +RES |
| `FSN-OFF-FEE` | CELL | Off-turn miss + overwatch snap +1 AP tax |
| `FSN-INCH-OATH` | CELL | One next walk Chebyshev ≤ 1 + next spell range ≥ 3 |
| `FSN-HEAVE-CHOIR` | BRIGADE | Fund two force-moves, then cash the dual-force 8 |
| `FSN-DUAL-BANK` | BRIGADE | Bank leftover AP+MP, poke the pair, steal leftover AP iff forced |
| `FSN-MID-STEP` | BRIGADE | Force remaining walks along last shove, then snipe from 3 |
| `FSN-HEAVE-QUIET` | BRIGADE | Join a force-moved ally, then dual-force heal |
| `FSN-HALVE-PACE` | CADRE | `floor(remaining/2)` + last-id illegal until they walk |
| `FSN-RITE-LONG` | CADRE | Cannot Strike until they spell + next spell range ≥ 3 |
| `FSN-BAR-PIN` | CADRE | Spell-resolved heal + freeze-one cadence |
| `FSN-DRIFT-COURT` | COURT | Cannot walk until force-moved, tile forbids relocate dest, unit forbids tools until Strike. Skip `FSN-DRIFT-COURT/SEPT` until remaining `ENEMY_SUMMON_CAP ≥ 7`. Live cap is **2**. |

Queued **#897** (`docs/design/ENEMY_FORMATIONS_2026-10-22.md`) packs Wave **13** families as sixteen `FSN-*` sheets. Unique file. Do not restack drop 13 (#825).

Drop 14 ids:

| Id | Grade | Owner note |
| :--- | :--- | :--- |
| `FSN-DRY-STEP` | PAIR | Leftover-MP=0 heal (`spell-dry-gait`, **not** `spell-parched-mend`) + leftover-MP=0 joiner. Band 0 → show `FSN-DUAL-READY` |
| `FSN-LEAN-SIP` | PAIR | Leftover AP=0 **and** leftover MP≥1 poke + leftover-AP=0 MP steal |
| `FSN-ODD-MUST` | PAIR | Odd-Chebyshev miss + tools illegal until leftover MP=0 |
| `FSN-VOID-DWELL` | PAIR | Pull toward void/portal + end-turn occupy paint |
| `FSN-DRY-GATE` | CELL | Leftover-AP=0 post + tile forbids walk MP. `summonAI: "leanpost"` |
| `FSN-DIAG-OATH` | CELL | Next walk diagonal-only + next spell exact Chebyshev 2 |
| `FSN-CINDER-FULL` | CELL | 1-tile cinder as floor + leftover-AP≥3 +RES |
| `FSN-OWN-WATCH` | CELL | Own-turn miss + overwatch snap grants watcher AP |
| `FSN-IMPRINT-CHOIR` | BRIGADE | Copy matching CDs + last-id illegal until leftover MP=0 |
| `FSN-LEAN-COURT` | BRIGADE | Lean sting + parched sip + dry hold |
| `FSN-PARCHED-QUIET` | BRIGADE | Parched step + dry gait + cover |
| `FSN-STILL-REST` | BRIGADE | Camped heal + own remaining CDs skip tick |
| `FSN-FOE-ESCORT` | CADRE | Adj-hostile bite + handler-with-pet cut |
| `FSN-SPENT-CRACK` | CADRE | Walked-last-turn +1 AP + remove adjacent barrier |
| `FSN-PAIR-DRY` | CADRE | Leftover-AP exactly 2 poke + leftover-AP=0 heal |
| `FSN-LEAN-HOLD` | COURT | Strike illegal until leftover MP=0 + tools illegal until leftover MP=0. Skip `FSN-LEAN-HOLD/SIX` until remaining `ENEMY_SUMMON_CAP ≥ 6`. Live cap is **2**. Also skip `FSN-CAST-QUIET/PENTA` until remaining cap ≥ 5 (10-21-002). |

Owner Encounter / Dungeon tabs ingest #826 / #885 / #825 / #897 by **id union**. Duplicate `export function` copies of the same helper fail Caffeine `vite build`. Do not concatenate drop 14 onto drop 13. Do not invent drop 15. Sequencing / special / rest / branch remain pack fields (`WDEAD-2026-08-31-007`); rest-as-room and `whiteSanctuary` stay prior IDs.

---

## 4. Elite waves 13–14 are ingest, not concatenate — Six / Oct stay illegal at cap 2

`WDEAD-2026-10-21-003` named elite wave 12 and **refused to invent wave 13**. Queued **#840** proposes 32 world-pack families: `dry_gaiter`, `cadence_imprinter`, `six_prelate`, `odd_hooder`, `lean_stinger`, `parched_stepper`, `parched_siller`, `dry_holder`, `lean_lender`, `parched_sipper`, `lean_prelate`, `parched_bouncer`, `must_leaner`, `verse_leaner`, `lean_holder`, `diag_warder`, `mid_oather`, `void_reeler`, `foe_biter`, `dwell_marker`, `own_plater`, `cinder_skipper`, `full_plater`, `summon_toller`, `still_mender`, `cadence_rester`, `spent_taxer`, `brick_cracker`, `watch_lender`, `pair_purser`, `escort_cutter`, `dry_mender`. Extra doors (`imprint_precentor`, `span_six`, `diag_gallery`, `mid_nave`, `void_aisle`, `dwell_pulpit`, `crack_nave`, …) stay elite extras, not `FAMILY_TYPES`. Court Imprint / Pack Long / Adj Fold stay boss/closed/`ENEMY_ONLY`. **Dry Gait is `spell-dry-gait` (SDE #802 won leftover-MP=0 heal).** Do **not** ship `spell-parched-mend`. Extra door `parched_cantor` is **not** Dry Gait’s door.

Queued **#899** proposes **31** Wave-14 world-pack families: `gaunt_mender`, `cadence_lagger`, `oct_prelate`, `even_hooder`, `gaunt_stinger`, `gaunt_stepper`, `gaunt_siller`, `odd_holder`, `gaunt_lender`, `bare_sipper`, `gaunt_prelate`, `gaunt_bouncer`, `must_gaunter`, `verse_gaunter`, `gaunt_holder`, `orth_warder`, `tri_oather`, `brick_reeler`, `lone_biter`, `wake_marker`, `gait_plater`, `glyph_skipper`, `full_gaiter`, `summon_gaiter`, `still_gifter`, `cadence_gracer`, `debt_caster`, `brick_orbiter`, `watch_almer`, `pair_gaiter`, `axis_cutter`. Extra doors (`gaunt_cantor`, `lag_precentor`, `span_oct`, `orth_gallery`, `tri_nave`, `brick_aisle`, `wake_pulpit`, `orbit_nave`) stay extras. Pack Cap / Reach Fold / Court Lag stay kit-only. Wave 14 adds **zero** force-gated / facing / Struck CORE.

Live elite presentation is still “family variant” at 30% equal weight over seven `FAMILY_TYPES` (`spawnPolicy.ts` 49–57, `FAMILY_VARIANT_CHANCE = 0.3`; test lock 239). There is no `isElite` flag. Family HP is still discarded at battle start (`WDEAD-2026-09-22-002` — do not re-issue). `ENEMY_SUMMON_CAP` is still **2**. **Six Span (`six_prelate`) counts as 6** — skip until remaining cap ≥ 6. **Oct Span (`oct_prelate`) counts as 8** — skip until remaining cap ≥ 8 (same class as Sept / Penta / Quad while cap is 2). Dummy / Drift / Lean / Gaunt Post count as **1**. `inferSummonArchetype` still has **no** `octspan` / `gauntpost` / `sixspan` / `leanpost` / `septspan` / `pentaspan` / `quadspan` / `driftpost` key (`enemyAI.ts` 202–225).

SPELL_PROPOSALS Wave 13 (`#849`) wait for Wave 14 family CORE (now #899). SPELL_PROPOSALS Wave 14 (`#890`) and SDE Wave 13 unique CORE (`#837`) wait for Wave 15. Do not invent elite wave 15. Owner elite probability stays a **second roll** after the family roll (`WDEAD-2026-09-28-002` / `09-29-002` / `10-21-003`). Do not concatenate the 32+31 names onto `FAMILY_TYPES`.

New fail-closed writers Wave 13–14 add: leftover AP **and** leftover walk MP after this spell’s AP is paid (`walkMpSpentThisTurn`); `walkMpSpentLastTurn` for Spent Tax; `lastResolvedSpellId` for Verse Lean / Verse Gaunt. Force-move / walk-spend / last-id / leftover-MP bank stay Wave 10–12 prerequisites. Wave 14 adds **zero** new force writers.

---

## 5. Rush Tables L and M exist now — never canister `roomIndex > 9`

`WDEAD-2026-10-21-004` named K0–K3 and **refused to invent Table L**. Queued **#836** adds Wave 14 sheets (`effigy_clerk`, `enter_deacon`, `split_acolyte`, `quiet_chorister`) and **Table L** `L0`–`L3` additive after K:

| Room | Pair | Owner note |
| :--- | :--- | :--- |
| L0 | `effigy_clerk` + `lock_marshal` | Compass / dummy dest never occupies the **Mannequin**. Off-axis walks already reject. Post is not a Rank Lock target |
| L1 | `enter_deacon` + `stride_censor` | Ledger never occupies the **Narthex**. Forced-move enter is free of walk MP (Stride does not tax it) and **does** consume the pad |
| L2 | `split_acolyte` + `cord_familiar` | Cord’s summon-gate never occupies the **Pyx**. Familiar death ≠ victory. Dummy Post extras are not preferred neighbors |
| L3 | `quiet_chorister` + `bone_cavalier` | Spike-on-land dest never occupies the **Muffler**. Quiet never paints the knight-landing telegraph. Compose with #846 `SPIKE_ON_LAND` unseal |

Neither rewrites rooms 0–9 nor Tables B–K. Neither is in live `BOSS_IDS`. Queued **#903** then adds Wave 15 sheets (`jostle_subdeacon`, `peel_friar`, `dilate_organist`, `hood_recluse`) and **Table M** `M0`–`M3` additive after L:

| Room | Pair | Owner note |
| :--- | :--- | :--- |
| M0 | `jostle_subdeacon` + `counter_chaplain` | Abacus dest never occupies the **Stole**. Counter does **not** arm his extra (`forcedMovedThisTurn` is boss-side only from *his* shove). Never shoves the player (MIMA-005) |
| M1 | `peel_friar` + `cinder_lance` | Exit sting never occupies a telegraphed lance tile. Stoup and Brazier are both objects |
| M2 | `dilate_organist` + `levy_rector` | Tithe-box never occupies the **Antiphoner**. Strike stays legal at remaining 0 |
| M3 | `hood_recluse` + `hexed_marker` | Hex never occupies the **Capuche**. Hood min stays Chebyshev **3**. **Not** Bone Cavalier (already L3) |

Neither rewrites rooms 0–9 nor Tables B–L. Neither is in live `BOSS_IDS`. `completeBossRushRoom` still `#err`s `roomIndex > 9` (`main.mo` 3317). Jackpot `complete(9)` stays mandatory (`#536`). Queued **#803** keeps `complete(9)` ahead of `resetBossRush` — consume, do not re-issue 09-25-008. `_rewardMultiplier` is still loaded then discarded (`WDEAD-2026-09-02-002` — do not re-issue). Do not invent Table N. #563 stub `dummy_castellan` is **not** remapped to `effigy_clerk`. #636 stubs `shove_cantor` / `stretch_precentor` are **not** remapped to `jostle_subdeacon` / `dilate_organist`.

---

## 6. New occupancy epoch after Enthroned Void ANCHOR_TILES

`WDEAD-2026-10-21-005` named Enthroned Void ANCHOR_TILES unseal. After #829, map integrity opened one more epoch that formations (drop-13 COURT / drop-14 COURT / Table L3 / `WF-TER-FOLD_WALL` / Lord of Static shock) must compose with:

1. **#846** — snap `SPIKE_ON_LAND` off portal walls and leftover crumbs (`occupancySpikeUnseal.ts`). Unique vs VOID: unique-corridor spikes stay legal — they are walkable.
2. **#855** — snap `LAVA_TRAIL` off portal and leftover crumbs (`occupancyLavaUnseal.ts`). Unique vs spike: trail origin is the **boss cell before** `moveToward` (`hazardTiles` type lava). Unique-corridor lava stays legal.
3. **#859** — snap greedy boss `moveToward` off portal far crumbs (`occupancyMoveTowardUnseal.ts`). Closest orthogonal `floor\|\|portal` neighbor (N→S→W→E reduce).
4. **#867** — snap Chebyshev king-step off leftover crumbs (`occupancyKingUnseal.ts`). Unique vs #859: the dest is a king corner, not an orthogonal hop.
5. **#858** — Chessboard Lich **board-transform** landing tax (`boardTransformLandingHazard.ts`). Unique vs swap/boss landing tax (09-29-004): this taxes the cell after a full-board rewrite, not a unit swap or a boss spawn raster.
6. **#863** — leader-death **erratic** hop off portal far crumbs (`occupancyErraticUnseal.ts`). Unique vs #859: random orthogonal `!== "wall"` neighbor in W→E→N→S order, not greedy N→S→W→E.
7. **#896** — snap Lord of Static `SHOCK_TILES` off portal and leftover crumbs (`occupancyShockUnseal.ts`). Unique vs lava: writes `activeShockTiles` (phase-2 `CHAIN_LIGHTNING` origin), never `hazardTiles`. Unique-corridor shock stays legal.

VALIDATE epochs are now: generate → destack → destack-dump → destack-occupied-floor-2 → choke-pocket snap → (overworld) wander-dump → wander-floor-2 → joint-cut unseal → knockback unseal → swap unseal → ignore-walls unseal → boss-spawn raster snap → twin-flank snap → midpoint snap → void-tile snap → anchor-tile snap → swap landing tax → boss landing tax → **spike unseal** → **lava unseal** → **moveToward unseal** → **king-step unseal** → **board-transform landing tax** → **erratic hop unseal** → **shock unseal**. Drop a slot that cannot destack. Do not punch walls; do not hop a portal cut; do not disable those PRs to keep formation art. Do not edit `mapGen.ts` or the RAF loop from this program. These helpers are not wired from WorldExploration. #901 whirlpool extract is not this epoch.

---

## 7. Simulation Laboratory — still missing; remount HP / Rush Doka / death-cut spies and new columns

No Admin Simulation tab. Tiers preview still caps samples at 500. `longHorizonSim.ts` on `main` samples 10_000 / 50_000 — **do not promote it** (including queued LHIPS #748 / #819 / #898). Crush vs the 999-capped pack stays `WDEAD-2026-09-23-007`. Wander epoch stays a React-free replay (`WDEAD-2026-09-26-004`). Keep-then-additive spy stays `WDEAD-2026-09-27-007`. Death-cut confirmed-credit remount spy stays `WDEAD-2026-09-28-006`. Portal-XP-keep remount spy stays `WDEAD-2026-09-29-005`. Keep-remount heal-wipe spy stays `WDEAD-2026-10-21-006`.

New report columns (in addition to 10-21): **`spikeUnseal`**, **`lavaUnseal`**, **`moveTowardUnseal`**, **`kingUnseal`**, **`erraticUnseal`**, **`shockUnseal`**, **`boardTransformLanding`**, **`catalogWddWave13`**, **`catalogWddWave14`**, **`catalogFsnDrop13`**, **`catalogFsnDrop14`**, **`catalogEliteWave13`**, **`catalogEliteWave14`**, **`catalogEedBothStrideNear`**, **`catalogEedHeaveDualMid`**, **`catalogRushTableL`**, **`catalogRushTableM`**, **`keepRemountHpSkip`**, **`bossRushDokaKeep`**, **`oneShotDokaKeepDeathCut`**, **`gameKeyDokaKeepDeathCut`**.

New spies (in addition to 10-21-006):

- **#847** skip remount shop wipe after successful death respawn HP (`deathHpKeepRemountWriteSkip.ts`, `pbv_death_hp_keep_remount_slotN`).
- **#854** skip remount shop wipe after successful heal or damage HP persist (`absoluteHpKeepRemountWriteSkip.ts`, `pbv_absolute_hp_keep_remount_slotN`).
- **#860** skip remount shop wipe after shop/heal `saveBattleStats` throw-after-accept (`absoluteHpThrowKeepRemountWriteSkip.ts`, `pbv_absolute_hp_throw_keep_remount_slotN`).
- **#864** skip remount shop wipe after Boss Rush Doka keep without unpaid death (`bossRushDokaKeepRemountWriteSkip.ts`, `pbv_boss_rush_doka_keep_remount_slotN`).
- **#866** skip remount **death** wipe after Boss Rush Doka keep (reads the **same** #864 key).
- **#869** skip remount death wipe after victory Doka keep (`victoryDokaKeepRemountDeathCutWriteSkip.ts`, `pbv_victory_doka_keep_remount_slotN`). Distinct from #774 victory heal honour of that key.
- **#877** skip remount death wipe after one-shot Doka keep (`oneShotDokaKeepRemountDeathCutWriteSkip.ts`, reads #800 `pbv_oneshot_doka_keep_remount_slotN`). Distinct from #800 one-shot heal honour.
- **#900** skip remount death wipe after GameKey keep (`gameKeyDokaKeepRemountDeathCutWriteSkip.ts`, reads #811 `pbv_gamekey_doka_keep_remount_slotN`). Distinct from #811 GameKey heal honour.

The lab must not call those writers “to preview a keep.” Do not import `#683` ground Doka spawn. Hypothetical 100_000 remains a preset, not a career cap.

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
                 · spike · lava · moveToward · king-step
                 · board-transform-landing · erratic · shock
  Dungeons       rooms · sequence · special (incl. white sanctuary) · rest · branch
                 · bosses · modifiers · rewards
  Boss Rush      pool · scale · progression · multipliers · sequence
                 (namespaces 0–9 / B0–B3 / … / K0–K3 / L0–L3 / M0–M3)
                 jackpot complete(9) is mandatory before extra tables
                 Twin Bishop (room 7) compose with twin-flank unseal
                 Void Grandmaster (room 4) compose with void-tile unseal
                 Enthroned Void extras compose with anchor-tile unseal
                 Chessboard Lich extras compose with board-transform landing tax
                 Bone Cavalier extras (Table L3) compose with spike unseal
                 Lord of Static extras compose with shock unseal
  World Events   eligibility (rest / deathRealm / deathRealmPending / whiteSanctuary)
                 · rarity · hazards · elites · grants (incl. repeatLoanWhileAlive / markLoanOneCast / oneCast)
                 · hooks (liveWxFlag | liveRegistry | announceOnly | unused)
                 · catalogWave 1–14 · modifier id === type · seeded pool non-empty
                 · last-live chance > 0
  Spawn          relative level · equal · above · elite · variant · size · family
                 · spells (relative caster offset, not summonUnitDef.level 99) · AI
                 (sophistication stays relative peer — never if (level >= X))
  Simulation     hypothetical level (unbounded, incl. 100_000) · N · seed · reports
                 · wander epoch (non-RAF) · keep-then-additive spy
                 · death-cut remount spy · portal-XP-keep remount spy
                 · keep-remount heal-wipe spy · remount HP keep spy
                 · Boss Rush Doka keep spy · one-shot / GameKey death-cut spy
LIFECYCLE
  Drafts         diff vs active · simulate · validate · activate
LEGACY (label unused knobs until migrate)
  Enemies / Regions / Tiers / Modifiers / Bosses / Names
```

Enemy Register chrome is flavor lore — not an encounter catalog and not `getEnemyConfigs` (engine still has **zero** `enemyConfigs` reads).

### Validate gates (08-31 §6 + later runs + this run)

95. Owner `enabledWaves` can name 13 and 14. Mark Gate and Incant Gate stay exploration-only. Far Picket / Mid Picket stand from map start in dungeon / Rush. Paired File / Gap File count as hostiles for map-clear. Hunt Draft skips when the map has zero enemies. Do not concatenate copies. Do not invent wave 15. Do not restack `worldFeatures.ts`.
96. Owner Encounter / Dungeon pools can name EED Both/Stride/Near + Heave/Dual/Mid and FSN drops 13–14 by id union. Skip `FSN-DRIFT-COURT/SEPT` while remaining summon cap &lt; 7. Skip `FSN-LEAN-HOLD/SIX` while remaining cap &lt; 6. Skip `FSN-CAST-QUIET/PENTA` while remaining cap &lt; 5. `ENC-RUSH-47`…`54` never emit canister `roomIndex > 9`. Do not concatenate copies. Do not invent drop 15.
97. Elite waves 13–14 are a second roll. Extra doors are not family ids. Skip `six_prelate` while remaining summon cap &lt; 6. Skip `oct_prelate` while remaining cap &lt; 8. Skip `sept_prelate` while remaining cap &lt; 7 (10-21-003). Dry Gait is `spell-dry-gait`, never `spell-parched-mend`. Do not concatenate `FAMILY_TYPES`. Do not invent elite wave 15. Dual Keep / Must Drift / Dry Gait / Gaunt* leftover-MP gates fail closed without leftover-AP+MP bank / `lastForcedMoveDir` / `walkMpSpentThisTurn`.
98. Owner Rush namespaces include `L0`–`L3` and `M0`–`M3`. Extra tables must not call `completeBossRushRoom` with `roomIndex > 9`. Jackpot `complete(9)` stays mandatory before L/M payouts and ahead of `resetBossRush` (#803). Dummy dest never occupies Mannequin; Ledger never occupies Narthex; Cord summon-gate never occupies Pyx; spike dest never occupies Muffler; Abacus dest never occupies Stole; exit sting never occupies a lance glow; Tithe-box never occupies Antiphoner; Hex never occupies Capuche. Do not invent Table N.
99. Formations compose with spike / lava / moveToward / king / erratic / shock unseals and Chessboard Lich board-transform landing tax after ANCHOR. Sim reports those columns. ANCHOR stays 10-21-005. Twin-flank / midpoint / VOID / landing-tax stay 09-29-004. No `mapGen.ts` / RAF hunk.
100. Lab spy includes #847 / #854 / #860 remount HP keep, #864 / #866 Boss Rush Doka keep, #869 / #877 / #900 remount death-cut after keep. Keep-remount heal-wipe stays 10-21-006. Portal-XP-keep stays 09-29-005. Do not import `WorldExploration`, `#591` live wander, `longHorizonSim`, `mapGen.simulate.ts`, `#683` ground Doka spawn, or LHIPS #748 / #819 / #898.
101. Unpublished wave-13 / wave-14 / drop-13 / drop-14 / elite-13 / elite-14 / Table L / Table M / EED Both+Heave catalogs stay data until ACTIVATE. VALIDATE refuses deleting live families, the 22-id modifier set, or Rush rooms 0–9 to “make room.”

---

## 9. What this program must not do

- Do not implement the pack, the lab, or the tabs in this run.
- Do not edit `WorldExploration.tsx` to overlay waves, dump helpers, family HP, or occupancy unseals.
- Do not edit RAF, `mapGen.ts`, turn order, or `calcScaledDamage`.
- Do not add `levelMax` “for safety” or raise 9999 / 99 / 999 / 100000 as a substitute for relative eligibility.
- Do not invent WDD wave 15, FSN drop 15, elite wave 15, or Rush Table N.
- Do not restack `#680` / `#719` / `#786` / `#848` / `#902` `worldFeatures.ts` onto `#613`.
- Do not promote `longHorizonSim` / `mapGen.simulate.ts` / LHIPS #748 / #819 / #898 to Admin.
- Do not open a second reward or spell-level writer (including GameKey, feat claim, death-cut remount `saveBattleStats`, portal-keep remount honour, keep-remount heal wipe, remount HP keep, or Rush/one-shot/GameKey death-cut from the lab).
- Do not re-issue prior WDEAD / WDD / EBA / EED / FSN / AFDA / LHIPS / AUX / TBC / SDE / CRC / AEE IDs.
- Do not retune `100 * 2^(N-1)` or Crush.
- Do not mint INIT from Simulation or `saveBattleStats`.
- Do not concatenate sibling catalogs.
- Do not re-issue 09-22-002 (family HP wipe), 09-24-007 (absolute challenges), 09-25-001 (whiteSanctuary), 09-28-001 (wave 10), 09-28-002 (elite 10 / FAMILY_TYPES seven), 09-28-003 (knockback/swap/Lich/ghost), 09-28-004 (last-live chance-0), 09-28-005 (liveWxFlag), 09-28-006 (death-cut remount spy), 09-28-007 (wave 11), 09-29-001 (FSN drop 11 / EED Pace), 09-29-002 (elite 11 / penta), 09-29-003 (Table J), 09-29-004 (twin-flank/midpoint/VOID), 09-29-005 (portal-XP-keep remount spy), 10-21-001 (wave 12), 10-21-002 (FSN drop 12 / EED Bash), 10-21-003 (elite 12 / sept), 10-21-004 (Table K), 10-21-005 (ANCHOR_TILES), or 10-21-006 (keep-remount heal-wipe spy).

Extract path (unchanged): wrap `engine/spawnPolicy.ts`; add `engine/encounterFormations.ts`, `engine/encounterSim.ts`, `engine/dungeonPolicy.ts`. Occupancy stays `engine/occupancy.ts` + `engine/battleStartPlacement.ts` plus the queued dump / snap / unseal helpers, including **`occupancySpikeUnseal.ts`**, **`occupancyLavaUnseal.ts`**, **`occupancyMoveTowardUnseal.ts`**, **`occupancyKingUnseal.ts`**, **`occupancyErraticUnseal.ts`**, **`occupancyShockUnseal.ts`**, **`boardTransformLandingHazard.ts`**. World-event weights load from the **active** pack (`worldFeatures.ts` is the WDD catalog).

---

## 10. ACTION_ID index (this run only)

| ID | Title | Priority |
| :--- | :--- | :--- |
| WDEAD-2026-10-22-001 | Owner `enabledWaves` can name catalogWave 13 and 14 — ingest WDD waves 13–14 by id union; Mark Gate / Incant Gate stay exploration-only | P0 |
| WDEAD-2026-10-22-002 | Encounter and dungeon room pools ingest EED Both/Stride/Near + Heave/Dual/Mid and FSN drops 13–14 by id union — skip SEPT / SIX / PENTA while summon cap is 2 | P1 |
| WDEAD-2026-10-22-003 | Elite waves 13–14 remain a second roll after FAMILY_TYPES — skip six_prelate / oct_prelate while summon cap is 2; never concatenate | P1 |
| WDEAD-2026-10-22-004 | Boss Rush extra tables include L0–L3 and M0–M3 — never canister roomIndex > 9; jackpot complete(9) stays mandatory | P0 |
| WDEAD-2026-10-22-005 | Encounter formations must compose with spike / lava / moveToward / king / erratic / shock unseals and Chessboard Lich board-transform landing tax | P1 |
| WDEAD-2026-10-22-006 | Simulation Laboratory spies remount HP keep, Boss Rush Doka keep, and one-shot / GameKey death-cut, and reports wave-13/14 / drop-13/14 / elite-13/14 / Table L/M / occupancy columns — still non-RAF | P1 |

Full records: [`ACTION_IDS_WDEAD_2026-10-22.md`](./ACTION_IDS_WDEAD_2026-10-22.md).
