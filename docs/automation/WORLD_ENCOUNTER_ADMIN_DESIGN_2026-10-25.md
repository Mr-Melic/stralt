# World, Dungeon & Encounter Admin Designer — 2026-10-25

**Source automation:** World, Dungeon & Encounter Admin Designer (`1592c6c0-a499-11f1-a7d1-d6b4613131ce`)  
**This run:** `bc-0a610bef-7b5e-4e67-bb14-1dd90f0869ea`  
**HEAD inspected:** `0f5363f` (`main` after #332 — **same HEAD as the 2026-09-21 through 2026-10-24 briefs**)  
**Constraint:** design only. No production code, no RAF / mapGen / turn / damage-math edits.  
**Player rule:** Stralt has **no player level cap**. Every owner control must stay valid at hypothetical levels of 1, 50, 500, 5_000, 50_000, and 100_000. Never recommend a hard maximum player or enemy level.

Prior briefs (still the content-model contract):

- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-08-31.md`](./WORLD_ENCOUNTER_ADMIN_DESIGN_2026-08-31.md) — pack, relative spawn, Simulation Lab, DRAFT → SIMULATE → VALIDATE → ACTIVATE (`WDEAD-2026-08-31-001` … `015`)
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-01.md`](./WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-01.md) — lying knobs, `longHorizonSim` isolation, one roll budget, payable rewards (`WDEAD-2026-09-01-001` … `010`)
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-02.md`](./WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-02.md) — closed-interval 9999, unused `_rewardMultiplier`, wave-2 mix, AdminGuard 99/999, GameKey isolation, destack×formations, dungeon Doka curve (`WDEAD-2026-09-02-001` … `008`)
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-21.md`](https://github.com/Mr-Melic/stralt/pull/337) … [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-10-23.md`](https://github.com/Mr-Melic/stralt/pull/932) — queued, not on `main`.
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-10-24.md`](https://github.com/Mr-Melic/stralt/pull/1015) — WDD waves 15–16, FSN drops 15–16, elite 15–16 / `nine_prelate` / `dec_prelate`, Rush Tables N–O, adjacent-minion / BOARD_CLAIM / Void Rift / generate-time hazard compose, spend-keep death-cut + shop/heal throw Doka + throw heal double-charge + rename after throw / victory / one-shot / feat / spend keep spy (`WDEAD-2026-10-24-001` … `006`). **Queued, not on `main`.** Explicitly deferred WDD wave 17, FSN drop 17, elite wave 17, and Rush Table P.

This run’s IDs: [`ACTION_IDS_WDEAD_2026-10-25.md`](./ACTION_IDS_WDEAD_2026-10-25.md).

Do **not** re-issue `WDEAD-2026-08-31-*`, `WDEAD-2026-09-01-*`, `WDEAD-2026-09-02-*`, `WDEAD-2026-09-21-*`, `WDEAD-2026-09-22-*`, `WDEAD-2026-09-23-*`, `WDEAD-2026-09-24-*`, `WDEAD-2026-09-25-*`, `WDEAD-2026-09-26-*`, `WDEAD-2026-09-27-*`, `WDEAD-2026-09-28-*`, `WDEAD-2026-09-29-*`, `WDEAD-2026-10-21-*`, `WDEAD-2026-10-22-*`, `WDEAD-2026-10-23-*`, `WDEAD-2026-10-24-*`, `WDD-*`, `EBA-*`, `EED-*` / `ENC-*`, `FSN-*`, `AFDA-*`, `LHIPS-*`, `EBMA-*`, `MIMA-*`, `TBC-*`, `SDE-*`, `CRC-*`, `AEE-*`, or `AUX-*` (admin UX #564).

Live spawn/admin code has not moved since 09-21 (`0f5363f`). New IDs exist because **queued occupancy and remount rails after #1015 froze** (walk-blocker / Creeping Ash / Ember Vein / Hunting Lantern unseals; GameKey / Boss Rush remount rename; feat/GameKey additive after throw / spend / Rush / victory / one-shot / GameKey / feat keeps; leftover-XP feat/GameKey + rename after leftover / portal-XP keep; victory-XP-throw leftover wipe) would be forked if the owner pack were implemented from 10-24 alone.

Do **not** invent WDD wave 17, FSN drop 17, elite wave 17, or Rush Table P. No readable WDD wave-17 sibling as of this freeze (GitHub search `created:>=2026-10-25` returned zero PRs; newest catalog siblings remain #993 / #1005 / #997 / #1004 / #1006). `CatalogWave` on `main` is still `1 | 2 | 3` until #344 / #399 / #454 / #503 / #578 / #613 / #680 / #719 / #786 / #848 / #902 / **#949** / **#993** land. **#680** / **#719** / **#786** / **#848** / **#902** / **#949** / **#993** restack `worldFeatures.ts` — consume the **readable wave-10 … wave-16 ids**, do not overlay from Admin, do not restack that file in this program.

---

## 0. What this cron is for

The owner pack, relative spawn knobs, Simulation Laboratory, and DRAFT → SIMULATE → VALIDATE → ACTIVATE **still do not exist**. Admin is still the 15-tab CRUD list (`gameTypes.ts` 482–498; `TABS` 5610–5626). Save is still live.

Required owner surfaces (still missing; contract lives in the 08-31 brief):

| Surface | Owner must manage | Live today |
| :--- | :--- | :--- |
| Encounters | enemy pools, formations, relative difficulty, rarity, objectives, rewards, hazards, rules | Scatter 1..8 + depth extras; no formation / rarity / rule / encounter-bound objective |
| Dungeons | room pools, sequencing, special rooms, rest rooms, branching, bosses, modifiers, rewards | Depth extras freeze at 5; rest is a world portal, not a room |
| Boss Rush | boss pools, relative scaling, progression, reward multipliers, room sequencing | 10 hardcoded pairs; `_rewardMultiplier` unused; canister `roomIndex > 9` rejects |
| World events | eligibility, rarity, hazards, elites, rare spell-bearing enemies, rewards, modifiers | Dual-roll 22 modifiers; `worldFeatures` not imported by WX |
| Spawn | relative enemy-level distribution, equal/above/elite/variant probabilities, encounter size, family weighting, advanced-spell / AI sophistication probability | Four unlabeled tier buckets; 30% equal-weight seven families; no `isElite` |
| Simulation Lab | hypothetical player level, many generated encounters, relative-level / family / variant / elite / AI / rare-spell / formation / difficulty report; never writes player / reward / progression / economy | No tab. Do not promote `longHorizonSim` or `mapGen.simulate` |

Preferred lifecycle is unchanged:

**DRAFT → SIMULATE → VALIDATE → ACTIVATE**

Admin / debug / simulation stay **dev-gated**. Simulation must never call `applyRewards`, `saveBattleStats`, `upgradeSpell`, `claimAchievementReward`, `processPendingPurchases`, `redeemGameKey`, persist-lock `commit`, one-shot Doka claim/settle, achievement unlock writers, Boss Rush persist writers (`completeBossRushRoom`, `setBossRushProgress`, `resetBossRush`, `abortBossRush`), write `pbv_pending_death_penalty_*` / arm `deathTriggered`, replay death-cut `saveBattleStats` after a later confirmed credit, honour remount unpaid-death XP from Play-entry, wipe after a portal +10 XP keep remount, wipe after a keep remount of victory Doka / one-shot Doka / victory XP / leftover XP / GameKey / feat claim, wipe remount HP after death / heal / throw-after-accept, wipe remount death after Boss Rush Doka / victory Doka / one-shot Doka / GameKey / feat / portal-XP / victory-XP / leftover-XP / spend keep, stamp a rename/upgrade spend keep then honour a pre-debit wallet, double-charge a Doka-heal whose replica HP already landed (parsed success **or** throw-after-accept), honour Play-entry Doka after a shop/heal `saveBattleStats` throw-after-accept, debit rename/upgrade from Play-entry after a shop/heal throw keep, a victory Doka keep, a GameKey Doka keep, a Boss Rush Doka keep, or a spend keep, add feat / GameKey onto Play-entry Doka after those keeps, or write Play-entry leftover XP after a leftover-XP / portal-XP keep then feat / GameKey / rename.

Oldest-first queued siblings this brief consumes (do not duplicate their IDs):

| PR | Role vs this pack |
| :--- | :--- |
| #337 / #394 / #451 / #534 / #593 / #615 / #684 / #739 / #769 / #829 / #908 / #932 / **#1015** WDEAD | Prior designer IDs. Stay `NEW`. |
| #344 / #399 / #454 / #503 / #578 / #613 / #680 / #719 / #786 / #848 / #902 / #949 / **#993** WDD | Waves 4–**16** `WF-*`. On `main` `CatalogWave` is still `1\|2\|3` (`worldFeatures.ts` 64, 115). Do not invent wave 17. Do not restack `worldFeatures.ts`. |
| #348 / #401 / #459 / #537 / #575 / #612 / #669 / #727 / #794 / #825 / #897 / #956 / **#1005** FSN | Drops 4–**16**. Do not invent drop 17. |
| #347 / #396 / #479 / #519 / #574 / #635 / #672 / #737 / #771 / #826 / #885 / #957 / **#1006** EED | Tide…Gaunt/Even/Brick/Orth. Do not invent a 10-25 encounter catalog. |
| #349 / #405 / #452 / #535 / #558 / #625 / #686 / #752 / #796 / #840 / #899 / #941 / **#997** elite | Waves 4–**16**. Second roll. Never concatenate `FAMILY_TYPES`. Do not invent elite 17. |
| #367 / #406 / #474 / #518 / #572 / #638 / #663 / #753 / #808 / #836 / #903 / #951 / **#1004** boss bible | Tables C–**O**. Jackpot `complete(9)` stays mandatory (`#536` / `#803`). Do not invent Table P. |
| #846 / #855 / #859 / #867 / #858 / #863 / #896 occupancy | Spike / lava / greedy `moveToward` / king-step / board-transform landing tax / erratic hop / `SHOCK_TILES`. **10-22-005 already owns these.** |
| #914 / #920 / #925 occupancy | ILLUSION_SPLIT / LARVAE_SPAWN / INK_VEIL. **10-23-001 already owns these.** |
| #933 / #965 / #970 / #976 occupancy | Adjacent minion / BOARD_CLAIM / Void Rift / generate-time eligibleHazard. **10-24-005 already owns these.** |
| **#1013** walk-blocker / **#1023** Creeping Ash / **#1030** Ember Vein / **#1038** Hunting Lantern | **New occupancy epoch after eligible-hazard.** Unique-corridor / destacked-player / occupied fight-graph dests stay (walkable tax) except walk-blockers, which snap **off** unique corridors. |
| #847 / #854 / #860 remount HP keep | **10-22-006 already owns the spy.** |
| #864 / #866 Boss Rush Doka keep | **10-22-006 already owns the spy.** |
| #869 / #877 / #900 remount death-cut after Doka keep | **10-22-006 already owns the spy.** |
| #909 / #912 / #918 / #919 remount death-cut after feat / portal-XP / victory-XP / leftover-XP keep | **10-23-002 already owns the spy.** |
| #926 spend keep (shop honour) / #927 parsed-success Doka-heal | **10-23-002 already owns the spy.** |
| #938 / #964 / #969 / #971 / #977 / #979 / #986 / #992 / #1002 | Spend-keep death-cut, shop/heal throw Doka + death-cut, throw heal double-charge, rename after throw / victory / one-shot / feat / spend keep. **10-24-006 already owns the spy.** #987 is a duplicate of #986 — consume, do not fork. |
| **#1019** GameKey remount rename / **#1020** Boss Rush remount rename | Reads `#811` / `#864`. Distinct from `#900` / `#866` death and `#811` / `#864` heal/shop. Distinct from `#979` / `#986` / `#992` / `#1002` (different stamps). **New lab spy.** |
| **#1021** / **#1024** / **#1025** / **#1028** / **#1029** / **#1031** / **#1032** feat/GameKey additive after keeps | Shop/heal throw, spend keep, Boss Rush Doka, victory Doka, one-shot Doka, GameKey Doka, feat Doka. Distinct from those stamps’ heal/shop, death, and rename. **New lab spy.** |
| **#1036** leftover-XP feat/GameKey / **#1037** portal-XP feat/GameKey leftover wipe / **#1041** leftover-XP rename / **#1043** victory-XP throw feat/GameKey leftover wipe | Reads `#813` `pbv_xp_credit_keep_remount_slotN`, `#767` `pbv_portal_xp_keep_remount_slotN`, or `#807` `pbv_victory_xp_keep_remount_slotN`. Distinct from those stamps’ heal/shop and `#919` / `#912` / `#918` death. Distinct from Doka-axis additive (#1021…). **New lab spy.** |
| #334 / #415 / #585 / #741 / #934 / #996 AFDA | Honesty copy. Do not re-issue 09-02-002. |
| #670 / #637 / #748 / #819 / #898 / #960 / **#1016** LHIPS | Do not promote to Admin Simulation. |
| #746 / #792 / #817 / #876 / #929 / #980 EBA | Consume, do not duplicate `EBA-*`. |
| #999 AEE | Consume, do not duplicate `AEE-*`. |
| #991 Expansion Director | Consume. Not a WDEAD overlay. |
| #1042 Paper Windstorm miss | Combat honesty. Consume. Not occupancy. |

---

## 1. Re-audit: prior WDEAD IDs (all still `NEW` except 013 PARTIAL)

Live evidence is the 09-21 … 10-24 tables at the same HEAD. Line numbers re-checked this run.

| Cluster | Still true? | This-run note |
| :--- | :--- | :--- |
| `WDEAD-2026-08-31-001`…`015` | Yes (013 PARTIAL) | Picker `floor(999 / ts)` (`combatMath.ts` 58). `computeAITier` stops at 900 → tier 10; 30% uniform 1–10 (36–51). Dungeon extras still `DUNGEON_SPAWN_DEPTH_CAP = 5` (`spawnPolicy.ts` 29). Death Realm fallbacks `maxLevel: 5` vs entry `9999`. No Simulation / Drafts / Encounters / Dungeons / World Events / Spawn tabs. Admin is still 15 tabs (`AdminDashboard.tsx` 5610–5626). |
| `WDEAD-2026-09-01-001`…`010` | Yes | Tiers unlabeled; preview still `[1, 10, 25, 50, 100, 200, 500]` (`AdminDashboard.tsx` 3877). Dual-roll 22 modifiers still the WDD placement contract. `WorldFeatureRunMode` is still `exploration \| dungeon \| bossRush` (`worldFeatures.ts` 67). Rest is not an enum value. |
| `WDEAD-2026-09-02-001`…`008` | Yes | Closed 9999 still a reject (`DEFAULT_ELIGIBILITY_LEVEL_MAX` 138). `_rewardMultiplier` still unused (`useBossRush.ts` 209). CatalogNote still claims it is read (`AdminDashboard.tsx` 7141–7146). `completeBossRushRoom` still `(0, 0)` and `roomIndex > 9` (`main.mo` 3317). |
| `WDEAD-2026-09-21-001`…`007` | Yes (queued #337) | Wave 3 is on `main` (52 `WF-*`, `LATEST_CATALOG_WAVE = 3`). `spawnPolicy.ts` is live defaults. |
| `WDEAD-2026-09-22-001`…`007` | Yes (queued #394) | Family HP still discarded at battle start. Do not re-issue 09-22-002. |
| `WDEAD-2026-09-23-001`…`007` through `WDEAD-2026-10-23-001`…`002` | Yes (queued) | Do not re-issue. Do not re-issue 10-23-001 if ILLUSION_SPLIT / LARVAE_SPAWN / INK_VEIL compose is still missing. Do not re-issue 10-23-002 if feat / portal-XP / victory-XP / leftover-XP death-cut / spend keep / Doka-heal double-charge is still unspied. |
| `WDEAD-2026-10-24-001`…`006` | Yes (queued #1015) | Waves 15–16 / drops 15–16 / elite 15–16 / Table N–O / adjacent-minion / BOARD_CLAIM / Void Rift / eligible-hazard / spend-keep death-cut + throw Doka + throw heal + rename after throw / victory / one-shot / feat / spend keep stay those IDs. Do not re-issue 10-24-001 if `enabledWaves` still cannot name 15 or 16. Do not re-issue 10-24-002 if FSN drops 15–16 / ENC-DRY-02 / ENC-LEAN-01 / ENC-ODD-02 / ENC-GAUNT-01 / ENC-EVEN-02 still uningested. Do not re-issue 10-24-003 if `FAMILY_TYPES` is still seven / nine and dec still illegal at cap 2. Do not re-issue 10-24-004 if N or O still cannot exist without `roomIndex > 9`. Do not re-issue 10-24-005 if adjacent-minion / BOARD_CLAIM / Void Rift / generate-time hazard compose is still missing. Do not re-issue 10-24-006 if spend-keep death-cut / shop-heal throw Doka / throw heal double-charge / rename-after-throw / rename-after-victory / one-shot / feat / spend-keep is still unspied. |

Missing tabs (unchanged): Encounters, Dungeons, World Events, Spawn (beyond coarse tiers), Simulation, Drafts.

`generateEnemies` still scatters `rollOverworldEnemyCount` (1..8 + depth extras), random chess piece, quadrant + Chebyshev ≥ 4. Family overlay is still 30% equal-weight over seven `FAMILY_TYPES` (`spawnPolicy.ts` 35, 49–57; `spawnPolicy.test.ts` 239, 276–287). Engine still has **zero** `enemyConfigs` reads in WorldExploration. WX still does not import `worldFeatures`. `MAX_ENEMIES = 20` (`gameConstants.ts` 10). `ENEMY_SUMMON_CAP = 2` (`gameConstants.ts` 300).

---

## 2. No new catalog wave — do not invent 17

`WDEAD-2026-10-24` ingested waves 15–16 because #949 and #993 were readable. This freeze has **no** readable WDD wave-17 / FSN drop-17 / elite-17 / Rush Table P sibling. Same-day catalog automations had not opened PRs as of `2026-10-25T00:01Z`. Do not mint `WF-*` / `FSN-*` / `ENC-*` / `FAMILY_TYPES` / `P0`–`P3` rows here. Owner `enabledWaves` still cannot name 10–16 on `main`; that stays `WDEAD-2026-10-24-001` (and the earlier 10/11/12/13/14 IDs). Skip `/OCT` / `/NINE` / `nine_prelate` / `dec_prelate` at cap 2 stays `WDEAD-2026-10-24-002` / `003`. Extra Rush tables N–O without `roomIndex > 9` stay `WDEAD-2026-10-24-004`.

---

## 3. New occupancy epoch after eligible-hazard — walk-blockers / Creeping Ash / Ember Vein / Hunting Lantern

`WDEAD-2026-10-24-005` named adjacent-minion / BOARD_CLAIM / Void Rift / generate-time `eligibleHazard`. #1013 opened four minutes before #1015 and was **not** ingested (10-24 freeze listed occupancy through #976). After #1015:

- Queued **#1013** snaps catalog `blocksWalk` world features (`occupancyWalkBlockerUnseal.ts`): `WF-TER-CRUMBLE_PILLAR`, `WF-OBS-FALLEN_GATE`, `WF-TER-CINDER_BARREL`, `WF-OBS-TIDE_DOOR`, `WF-OBS-SPENT_BRIDGE`. One impassable floor cell from a `"floor"` raster; skip portals and Chebyshev ≤ 3 from the **legalized spawn** (`SPAWN_SAFE_RADIUS`, not grid center). Occupancy 1+1 unseal cannot lift a pillar on the only player→exit corridor. Unique vs `#765` `VOID_TILES` (Manhattan-2 cardinals) and vs `#976` eligibleHazard (same floor raster, but **walkable** tax: unique-corridor stays). **Unique-corridor dests snap off.** Drop leftover-island dests rather than punch.
- Queued **#1023** snaps Creeping Ash (`WF-HAZ-CREEP_MIST`, `occupancyCreepingAshUnseal.ts`). Contiguous **3-tile orthogonal lane** (`extraHazardCount` min = max = 3) that then **shifts by its heading**. Walkable HP tax, not occupancy, not `hazardTiles` scatter. Unique vs `#965` BOARD_CLAIM (static 2×2 AP tax), `#970` Void Rift (one floor cell/turn), `#976` independent dests, `#1013` impassable unique-corridor snap-off. Unique-corridor / destacked-player / occupied dests **stay**. Advance onto portal / void / leftover crumb **drops the step**.
- Queued **#1030** snaps Ember Vein (`WF-HAZ-EMBER_VEIN`, `occupancyEmberVeinUnseal.ts`). **Independent** 3–6 walkable HP-tax dests. Unique vs `#1023` contiguous lane, `#976` (skip is grid center; count 1–3 / 3–8), `#1013` impassable. Unique-corridor / destacked-player / occupied dests stay. Snap off spawn±3.
- Queued **#1038** snaps Hunting Lantern (`WF-HAZ-HUNT_LANTERN`, `occupancyHuntingLanternUnseal.ts`). One walkable HP-tax orb then one orthogonal chase step toward the last MP spender. Unique vs `#1030` independent static dests, `#1023` 3-tile painted lane, `#859` greedy `moveToward` (snaps the **unit**). Drop a chase step that would hop a portal, void, spawn±3, or far crumb. Unique-corridor / destacked-player / occupied fight-graph cells stay.

None of these helpers is wired from WorldExploration / `worldFeatures.ts` / `useBossSystem` / `simulate.ts`. Live `generateEnemies` still scatters. Ember Vein, Creeping Ash, and the five `blocksWalk` ids already exist on `main` `WORLD_FEATURES` (wave 1–3); Hunting Lantern is wave 2 on `main`. The owner pack must compose authored formations / WF extras with these unseals **before** overlay, or a VALIDATE of waves 1–3 already punches unique corridors.

VALIDATE epoch after 10-24-005 eligible-hazard: **walk-blocker unseal → creeping-ash unseal → ember-vein unseal → hunting-lantern unseal**. Report those columns rather than treating punched / snapped extras as authored COURT art. Drop a slot that cannot destack; do not punch walls; do not hop a portal cut; do not disable #1013 / #1023 / #1030 / #1038 to keep keep-clear art.

---

## 4. New remount spies — GameKey / Boss Rush rename, feat/GameKey additive after keeps, leftover-XP feat/GameKey + rename

`WDEAD-2026-10-24-006` named spend-keep death-cut, shop/heal throw Doka keep + death-cut, throw heal double-charge, and rename after throw / victory / one-shot / feat / spend keep. It did **not** name GameKey / Boss Rush remount rename, feat/GameKey **additive** after those Doka keeps, leftover-XP feat/GameKey honour, portal-XP feat/GameKey leftover wipe, leftover-XP remount rename, or victory-XP-throw leftover wipe:

| PR | Sidecar | Stamp key | Polarity |
| :--- | :--- | :--- | :--- |
| **#1019** | `gameKeyDokaKeepRemountRenameSpendWriteSkip.ts` | reads `#811` `pbv_gamekey_doka_keep_remount_slotN` | Rename/upgrade debit base is replica **risen** GameKey wallet (1200 − 100 = 1100), not Play-entry 200 → 100. Distinct from `#811` heal/shop and `#900` death. Distinct from `#979` victory / `#986` one-shot / `#992` feat. |
| **#1020** | `bossRushDokaKeepRemountRenameSpendWriteSkip.ts` | reads `#864` `pbv_boss_rush_doka_keep_remount_slotN` | Rename/upgrade debit base is replica **risen** room-clear wallet (700 − 100 = 600). Distinct from `#864` heal/shop, `#866` death, `#1019` GameKey stamp. Explicit `applyRewards failed` never stamps. |
| **#1021** | `absoluteDokaThrowKeepRemountAdditiveCreditWriteSkip.ts` | reads `#964` `pbv_absolute_doka_throw_keep_remount_slotN` | Feat / GameKey additive base is replica **dropped** shop/heal wallet (183 + 100 = 283), not Play-entry 300. Distinct from `#964` heal/shop, `#969` death, `#977` rename. |
| **#1024** | `spendKeepRemountAdditiveCreditWriteSkip.ts` | reads `#926` `pbv_spend_keep_remount_slotN` | Feat / GameKey additive base is replica **dropped** rename/upgrade wallet. Distinct from `#926` heal/shop, `#938` death, `#1002` rename. |
| **#1025** | `bossRushDokaKeepRemountAdditiveCreditWriteSkip.ts` | reads `#864` | Feat / GameKey additive base is replica **risen** Rush wallet. Distinct from `#1020` rename of the same stamp. |
| **#1028** | `victoryDokaKeepRemountAdditiveCreditWriteSkip.ts` | reads `#774` `pbv_victory_doka_keep_remount_slotN` | Feat / GameKey additive base is replica **risen** victory wallet. Distinct from `#979` rename. |
| **#1029** | `oneShotDokaKeepRemountAdditiveCreditWriteSkip.ts` | reads `#800` `pbv_oneshot_doka_keep_remount_slotN` | Feat / GameKey additive base is replica **risen** pickup. Distinct from `#986` rename. |
| **#1031** | `gameKeyDokaKeepRemountAdditiveCreditWriteSkip.ts` | reads `#811` | Feat / GameKey additive base is replica **risen** GameKey wallet. Distinct from `#1019` rename of the same stamp. A second redeem after keep still adds onto replica, not Play-entry. |
| **#1032** | `featDokaKeepRemountAdditiveCreditWriteSkip.ts` | reads `#812` `pbv_feat_doka_keep_remount_slotN` | Feat / GameKey additive base is replica **risen** feat grant. Distinct from `#992` rename. |
| **#1036** | `xpCreditKeepRemountAdditiveCreditWriteSkip.ts` | reads `#813` `pbv_xp_credit_keep_remount_slotN` | Feat / GameKey honour replica **leftover XP** (110) onto the remount lock before Doka add so leftover shop cannot write Play-entry 100 over canister 110. Distinct from `#813` heal/shop and `#919` death. XP axis, not Doka. |
| **#1037** | `portalXpKeepRemountAdditiveCreditWriteSkip.ts` | reads `#767` `pbv_portal_xp_keep_remount_slotN` | Same leftover-XP honour after a **portal throw-after-add** (canister 110, lock 100). Distinct from `#1036` (parsed leftover, different key) and from `#912` death. |
| **#1041** | `xpCreditKeepRemountRenameSpendWriteSkip.ts` | reads `#813` `pbv_xp_credit_keep_remount_slotN` | Rename/upgrade honour replica leftover XP before Doka debit so leftover shop writes 110, not 100. Distinct from `#1036` (feat/GameKey add Doka; rename subtracts) and from `#1019` / `#1020` (Doka stamps). |
| **#1043** | `victoryXpKeepRemountAdditiveCreditWriteSkip.ts` | reads `#807` `pbv_victory_xp_keep_remount_slotN` | Feat / GameKey honour replica leftover XP after a **victory throw-after-add** (canister 180, lock 100). Distinct from `#807` heal/shop, `#918` death, `#1036` parsed leftover, and `#1037` portal throw. |

Lab occupancy replay stays generate → destack → … → eligible-hazard (10-24-005) then **walk-blocker → creeping-ash → ember-vein → hunting-lantern**, all React-free. Reports add `walkBlockerUnseal` / `creepingAshUnseal` / `emberVeinUnseal` / `huntingLanternUnseal` / `gameKeyDokaKeepRenameSpend` / `bossRushDokaKeepRenameSpend` / `absoluteDokaThrowAdditive` / `spendKeepAdditive` / `bossRushDokaKeepAdditive` / `victoryDokaKeepAdditive` / `oneShotDokaKeepAdditive` / `gameKeyDokaKeepAdditive` / `featDokaKeepAdditive` / `xpCreditKeepAdditive` / `portalXpKeepAdditive` / `xpCreditKeepRenameSpend` / `victoryXpKeepAdditive`. Spy allow-list still fails on `applyRewards`, `saveBattleStats`, `upgradeSpell`, `claimAchievementReward`, `processPendingPurchases`, `redeemGameKey`, persist `commit` (including every keep/remount writer listed in 10-24-006 **plus** #1019 / #1020 / #1021 / #1024 / #1025 / #1028 / #1029 / #1031 / #1032 / #1036 / #1037 / #1041 / #1043), `pbv_*` / inventory / unpaid-death keys, Rush persist writers, Play-entry Doka honour after GameKey / Boss Rush keep rename, Play-entry Doka add after feat/GameKey on a keep stamp, and Play-entry leftover XP after leftover / portal-XP / victory-XP-throw keep.

Hypothetical presets remain 1 / 10 / 100 / 1_000 / 10_000 / 50_000 / 100_000 (unbounded input, not a cap). Do not treat `longHorizonSim` (#1016) or `mapGen.simulate` as the lab.

---

## 5. Owner control reminder (unchanged contract)

Every knob stays **relative** to the hypothetical player: offsets and probabilities, never stored absolute 99 / 999 / 9999 / 100000 as a reject. Extreme hypothetical levels must roll. Simulation must never modify player state, rewards, progression, or economy. Prefer **DRAFT → SIMULATE → VALIDATE → ACTIVATE**. Until VALIDATE, waves 10–16 / drops 10–16 / elite 10–16 / Tables J–O / occupancy unseals stay data. Do not overlay from Admin. Do not concatenate `FAMILY_TYPES` / ENC / FSN catalogs. Do not retune Crush (LHIPS). Do not restack `worldFeatures.ts`. Do not invent WDD wave 17 / FSN drop 17 / elite 17 / Table P.

---

## 6. ACTION_ID index (this run only)

| ID | Title | Priority |
| :--- | :--- | :--- |
| WDEAD-2026-10-25-001 | Encounter formations must compose with walk-blocker / Creeping Ash / Ember Vein / Hunting Lantern unseals after the eligible-hazard epoch | P1 |
| WDEAD-2026-10-25-002 | Simulation Laboratory spies GameKey / Boss Rush remount rename, feat/GameKey additive after keep stamps, leftover-XP feat/GameKey + rename after leftover / portal-XP keep, and victory-XP-throw leftover wipe — still non-RAF | P1 |

Full records: [`ACTION_IDS_WDEAD_2026-10-25.md`](./ACTION_IDS_WDEAD_2026-10-25.md).
