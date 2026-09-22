# World, Dungeon & Encounter Admin Designer — 2026-09-22

**Source automation:** World, Dungeon & Encounter Admin Designer (`1592c6c0-a499-11f1-a7d1-d6b4613131ce`)  
**This run:** `bc-901fc550-7e34-4beb-a3dc-5c0c1bfcb453`  
**HEAD inspected:** `0f5363f` (`main` after #332 — **same HEAD as the 2026-09-21 brief**)  
**Constraint:** design only. No production code, no RAF / mapGen / turn / damage-math edits.  
**Player rule:** Stralt has **no player level cap**. Every owner control must stay valid at hypothetical levels of 1, 50, 500, 5_000, 50_000, and 100_000. Never recommend a hard maximum player or enemy level.

Prior briefs (still the content-model contract):

- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-08-31.md`](./WORLD_ENCOUNTER_ADMIN_DESIGN_2026-08-31.md) — pack, relative spawn, Simulation Lab, DRAFT → SIMULATE → VALIDATE → ACTIVATE (`WDEAD-2026-08-31-001` … `015`)
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-01.md`](./WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-01.md) — lying knobs, `longHorizonSim` isolation, one roll budget, payable rewards (`WDEAD-2026-09-01-001` … `010`)
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-02.md`](./WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-02.md) — closed-interval 9999, unused `_rewardMultiplier`, wave-2 mix, AdminGuard 99/999, GameKey isolation, destack×formations, dungeon Doka curve (`WDEAD-2026-09-02-001` … `008`)
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-21.md`](https://github.com/Mr-Melic/stralt/pull/337) — wave-3 mix, wrap `spawnPolicy.ts`, `loanOneCast`, occupancy destack, lab spy feats/one-shots, dual depth-5 freeze, LHIPS ≠ owner lab (`WDEAD-2026-09-21-001` … `007`). **Queued, not on `main`.**

This run’s IDs: [`ACTION_IDS_WDEAD_2026-09-22.md`](./ACTION_IDS_WDEAD_2026-09-22.md).

Do **not** re-issue `WDEAD-2026-08-31-*`, `WDEAD-2026-09-01-*`, `WDEAD-2026-09-02-*`, `WDEAD-2026-09-21-*`, `WDD-*`, `EBA-*`, `EED-*` / `ENC-*`, `FSN-*`, `AFDA-*`, `LHIPS-*`, `EBMA-*`, or `MIMA-*`.

Live code has not moved since 09-21 (`0f5363f`). New IDs exist because **queued sibling catalogs** (wave 4 `WF-*`, Tide/File/Clock rooms, formation drop 4, elite wave 4, Rush Table C, LHIPS 100k) would be forked if the owner pack were implemented from 09-21 alone — and because battle-start **drops family HP**, which 09-21 named only as a locked 30% constant.

---

## 0. What this cron is for

The owner pack, relative spawn knobs, Simulation Laboratory, and DRAFT → SIMULATE → VALIDATE → ACTIVATE **still do not exist**. Admin is still the 15-tab CRUD list. Save is still live.

Preferred lifecycle is unchanged:

**DRAFT → SIMULATE → VALIDATE → ACTIVATE**

Admin / debug / simulation stay **dev-gated**. Simulation must never call `applyRewards`, `saveBattleStats`, `upgradeSpell`, `claimAchievementReward`, `processPendingPurchases`, `redeemGameKey`, persist-lock `commit`, one-shot Doka claim/settle, achievement unlock writers, or Boss Rush persist writers.

Oldest-first queued siblings this brief consumes (do not duplicate their IDs):

| PR | Role vs this pack |
| :--- | :--- |
| #334 AFDA | Honesty copy: Tiers leftover / unused Rush multiplier. Not owner knobs. Do not re-issue `WDEAD-2026-09-02-002`. |
| #337 WDEAD 09-21 | Prior designer IDs `001`…`007`. Stay `NEW`. |
| #344 WDD 09-21 | Wave-4 `WF-*` (`WDD-2026-09-21-001` DESIGNED). `CatalogWave` becomes `1\|2\|3\|4`. |
| #347 EED 09-21 | Tide / File / Clock rooms (`EED-2026-09-21-001`). |
| #348 FSN drop 4 | Wick Court / Ice File / … formation sheets. |
| #349 elite wave 4 | Family sheets + second rarity roll. Family HP wipe documented. |
| #357 LHIPS 09-21 | Stress includes **100_000**. Observation harness, not the owner lab. |
| #367 boss bible | Rush **Table C** (`C0`–`C3`) after Table B. |

---

## 1. Re-audit: prior WDEAD IDs (all still `NEW` except 013 PARTIAL)

Live evidence is the 09-21 table at the same HEAD. Line numbers below re-checked this run.

| Cluster | Still true? | This-run note |
| :--- | :--- | :--- |
| `WDEAD-2026-08-31-001`…`015` | Yes (013 PARTIAL) | Picker `floor(999 / ts)` (`combatMath.ts` 58). Dungeon extras/Doka still `min(depth, 5)`. Chain 3–5. Death Realm fallbacks `maxLevel: 5` (WX 13514, 13646) vs entry `9999` (5439). No Simulation / Drafts / Encounters / Dungeons / World Events / Spawn tabs (`gameTypes.ts` 482–498; `TABS` 5610–5626). |
| `WDEAD-2026-09-01-001`…`010` | Yes | Tiers unlabeled on HEAD (honesty queued in #334). `threeOrMorePercent` unread. Dual-roll 22 modifiers still the WDD placement contract (`docs/WORLD_DYNAMICS.md`). Rest / deathRealm still missing from `WorldFeatureRunMode`. |
| `WDEAD-2026-09-02-001`…`008` | Yes | Closed 9999 still a reject (WX 3702). `_rewardMultiplier` still unused (`useBossRush.ts` 209, 243). AdminGuard `minLevel > 999` / `summonUnitDef.level > 99` (`adminGuard.mo` 411, 441). |
| `WDEAD-2026-09-21-001`…`007` | Yes (queued #337) | Wave 3 is on `main` (`LATEST_CATALOG_WAVE = 3`, 52 `WF-*`). `spawnPolicy.ts` is live defaults, not knobs. Tests still lock `dungeonSpawnExtras(99) === extras(5)` (`spawnPolicy.test.ts` 84) and `FAMILY_VARIANT_CHANCE === 0.3`. |

Missing tabs (unchanged): Encounters, Dungeons, World Events, Spawn (beyond coarse tiers), Simulation, Drafts.

---

## 2. Wave 4 is not an owner control

On `main`, `CatalogWave = 1 | 2 | 3` and `LATEST_CATALOG_WAVE = 3` (`worldFeatures.ts` 64, 115). `pickWeightedFeatures` still mixes every wave into `MAX_ROLLED_FEATURES = 3`. WX still does not import `worldFeatures`. Live events are still the 22-id two-roll (`EXISTING_MAP_MODIFIER_IDS` 1890–1913).

Queued #344 (`WDD-2026-09-21-001`) extends the **same array** (do not fork):

- Type becomes `1 | 2 | 3 | 4`; `LATEST_CATALOG_WAVE = 4`
- 16 new ids, one per category

| Id | Owner field this pack must name |
| :--- | :--- |
| `WF-HAZ-FLINT_DUST` | `combatHookId` on **AP spend while occupying** (not spell name); challenge HP recorders |
| `WF-HAZ-PENDULUM_CENSER` | moving hazard; round-start step; challenge HP |
| `WF-TRP-DELAY_GNOMON` | 2-round fuse; visible pips |
| `WF-TER-REED_SCREEN` | `blocksWalk` + open LoS; 1 AP cut; inverse of Frost Pane |
| `WF-OBS-HOURGLASS_ARCH` | time-to-wall; solvability as if already wall |
| `WF-ZON-VEIL_FONT` | `SpellConfig.linear` LoS veil only |
| `WF-TEL-SWAP_ANCHOR` | occupancy swap; 1 MP; not `effectCategory` teleport |
| `WF-PRT-WAGER_GATE` | exploration-only extra portal; ≥50% HP → hard `applyRewards`; never dungeon / rush / deathRealm |
| `WF-INV-PHALANX_LINE` | +3 elites in a line; `skippedForBudget` at `MAX_ENEMIES` 20; destack compose |
| `WF-ELT-LEASH_WARDEN` | Chebyshev-3 leash; run required-hostile vs exploration skip |
| `WF-TRS-PATIENCE_CACHE` | payable preview; one-shot id; no double grant |
| `WF-SPL-ECHO_SCRIBE` | `grantClass: copyLastCast` (last **cast** id this fight, this map, no `upgradeSpell`) |
| `WF-RSK-SEEPING_TITHE` | repeating HP tax + extreme `rewardCurve`; challenge recorders |
| `WF-MOD-HEAVY_INCANT` | `SpellConfig.apCost >= 3` also spends 1 MP if available |
| `WF-EVT-IRON_LENT` | no HP **gain** this map → hard multiplier (damage allowed) |
| `WF-ENV-STAGNANT_HAZE` | 0 MP this turn → 3% max HP; challenge recorders |

`WDEAD-2026-09-21-001` stops at wave **3**. Owner `enabledWaves` after #344 must be any non-empty subset of `{1,2,3,4}`. Until VALIDATE, do not overlay wave 4. Dual-roll with the 22 live modifiers remains a VALIDATE fail (`WDEAD-2026-09-01-003`).

---

## 3. Family 30% is a lying spawn knob until battle start is owned

`WDEAD-2026-09-21-002` wraps `spawnPolicy.ts` as draft defaults. That is necessary and **not sufficient**.

Live path:

1. `generateEnemies` calls `applyFamilyVariantsToRoster` (WX 5862–5866) → `applyEnemyFamilyStats` writes `hp` / `maxHp` / `damage` / `res` / `sp` (`spawnPolicy.ts` 261–272). Catalog `ap` / `mp` are still unused.
2. Battle start first overwrites `sp` / `sr` / `init` / `res` / `chc` from `computeEnemyStats` (WX 11892–11903) — family `res` / `sp` die here. `FAMILY_STAT_MULTS` uses 0.05–0.75 fractions; `getEnemyBaseStats` rolls percents. The two scales were never the same unit.
3. Combatant entries then set `hp` / `maxHp` from `calcEnemyMaxHp(e.level)` (WX 11970–11974, again 11991–11997). **Family HP is discarded.** Queued #349 states this explicitly.

What survives into combat: `family` string (ember melee-burn / tide slow / void reflect still key off it) and overworld wander HP until the fight starts. Owner “variant probability” / “family weighting” that claimed to change combat HP or RES would be a CatalogNote lie.

Pack rule: family fields list **which stats survive battle-start snapshot**. Default honesty until VALIDATE: HP/RES/SP are **cosmetic-at-combat** unless a later human pick re-applies family after `calcEnemyMaxHp`. Do not disable destack or occupancy to “keep family art.” Do not concatenate Wave 1–4 elite sheets onto `FAMILY_TYPES` (seven live ids) — union is one `EnemyFamily` implementation per name.

Sim report columns: `familyRolled`, `familyHpOverwritten`, `familyResOverwritten`, `familyTagKept`.

---

## 4. Encounter / formation catalogs are data, not a second Admin array

Queued #347 (`EED-2026-09-21-001`) adds Tide / File / Clock rooms (ENC-TEACH-04, ENC-FILE-01, ENC-RUSH-11…14, rest / branch / oath / cart, …). Queued #348 mint drop-4 `FSN-*` (Wick Court, Ice File, Smoke Hunt, Plus Battery, Tempo Choir, Absolve Race, Rescue Line, Bastion Gate, Twin Plate, Finish Line, Fog Fuse, plus teaching PAIRs).

`WDEAD-2026-08-31-005` still owns the Encounters tab. `WDEAD-2026-09-21-004` still owns occupancy × destack. This run only forbids **forking**:

- Owner room pools reference `ENC-*` / `FSN-*` ids. VALIDATE rejects an unknown `formationId`.
- Rest-as-room, branching, and dungeon sequencing stay `WDEAD-2026-08-31-007` (live rest is still a **world** 10% portal, WX 4914–4919).
- Phalanx Line (+3) and drop-4 COURT packs must report `skippedForBudget` / `destackRelocations`. Drop a slot that cannot destack onto the origin fight graph. Do not punch walls. Do not hop a portal cut.
- Do not edit `mapGen.ts` from this program.

---

## 5. Boss Rush tables are namespaces, not a rewrite of 10 rooms

Live: `BOSS_RUSH_ROOMS` is 10 hardcoded pairs (`useBossRush.ts` 24–135). Admin enable + per-room `x` still do not skip rooms. `_rewardMultiplier` has zero readers. `completeBossRushRoom` stays `(0, 0)`. Room 9 `boss2Id: "weeping_pawn_2"` is still not a `BossId` (boss-design slice I — consume, do not remap here).

Queued bible (#367):

- Table B: `B0`–`B3` after one clear of 0–9 (already in the 09-21 encounter catalog).
- **Table C:** `C0`–`C3` after one clear of Table B (`ram_castellan`+`hexed_marker`, …). Additive. Do not overwrite 0–9 or B0–B3. Do not collide ENC-RUSH remixes.

Owner Boss Rush tab after ACTIVATE: pool + relative scale + progression **which table is next** + evaluated multipliers into `computeRewardDeltas` (`WDEAD-2026-09-01-009`) + sequencing across **three namespaces**. Until VALIDATE, CatalogNote must not claim Table C is live. Do not bind `_rewardMultiplier` as a second wallet write.

Relative scaling still missing: combat boss HP stays static (~350 Pale Archbishop) at every player level (`LHIPS-2026-08-31-010`). Owner scale is offset + curve versus the player, never a stored `levelMax`.

---

## 6. Simulation Laboratory — 100k is still not “the lab exists”

`longHorizonSim.ts` on `main` samples 10_000 / 50_000 (`STRESS_LEVELS` 82–85). Queued #357 adds **100_000** plus INIT / CHC measurements. Tiers preview is still `[1, 10, 25, 50, 100, 200, 500]` (`AdminDashboard.tsx` 3877). No Simulation tab.

`WDEAD-2026-09-21-007` already said LHIPS overflow samples do not close the owner lab. Do not re-issue it. This run only:

- Owner presets include 100_000 as a **hypothetical** (unbounded input, not a career cap).
- Estimated difficulty includes `pPlayerWinsInitiative` against frozen create INIT 10 (`startingChampionStats` — do **not** mint INIT from the lab or via `saveBattleStats`).
- Family overwrite histogram (§3).
- Wave-mix histogram includes **4** after #344.
- Spy list unchanged from 09-21-005, plus fail if the Admin Simulation bundle imports `longHorizonSim.ts` or `mapGen.simulate.ts`.

---

## 7. Owner console IA (unchanged, still missing)

Carved-stone, dark slate, crimson (`#13161f`, `#d8463f`, `#f0c44a`).

```
CONTENT
  Encounters     pools · formations · rarity · objectives · rewards · hazards · rules
                 (ids from EED / FSN catalogs — union, never concatenate copies)
  Dungeons       rooms · sequence · special · rest · branch · bosses · modifiers · rewards
  Boss Rush      pool · scale · progression · multipliers · sequence
                 (namespaces 0–9 / B0–B3 / C0–C3)
  World Events   eligibility (incl. rest / deathRealm) · rarity · hazards · elites
                 · grants · hooks · catalogWave 1–4
  Spawn          relative level · equal · above · elite · variant · size · family · spells · AI
                 (wraps spawnPolicy.ts; family stats declare battle-start survival)
  Simulation     hypothetical level (unbounded, incl. 100_000) · N · seed · reports
LIFECYCLE
  Drafts         diff vs active · simulate · validate · activate
LEGACY (label unused knobs until migrate)
  Enemies / Regions / Tiers / Modifiers / Bosses / Names
```

### Validate gates (08-31 §6 + later runs + this run)

34. `enabledWaves` may include **4**; `CatalogWave` is `1|2|3|4` after #344 lands. Sim mix ≠ 100% newest wave at `maxRolled=3`.
35. Family pack fields name which of HP / RES / SP survive battle-start `calcEnemyMaxHp` / `computeEnemyStats`. Unnamed fields are labeled unused. Sim `familyHpOverwritten` is visible.
36. Encounter / formation ids resolve to EED / FSN catalogs. Unknown `formationId` fails VALIDATE. No second copy of the same `export function` / room helper.
37. `grantClass` includes `copyLastCast` (Echo Scribe). Zero `upgradeSpell` from events. Wager Gate stays exploration-only.
38. Rush sequencing distinguishes rooms 0–9, `B0`–`B3`, `C0`–`C3`. Activating Table C does not rewrite 0–9.
39. Lab accepts hypothetical 100_000 without `floor(999 / tierSize)` as the shown distribution. Bundle does not import LHIPS / `mapGen.simulate`.
40. Elite rarity is a **second** roll (BASE / VETERAN / ELITE / CHAMPION from #349). Do not append Wave 4 family ids onto live `FAMILY_TYPES` as a concatenated duplicate array.

---

## 8. What this program must not do

- Do not implement the pack, the lab, or the tabs in this run.
- Do not edit `WorldExploration.tsx` to overlay wave 4 or to “fix” family HP (that is a later human pick; combat-sensitive).
- Do not edit RAF, `mapGen.ts`, turn order, or `calcScaledDamage`.
- Do not add `levelMax` “for safety” or raise 9999 / 99 / 999 / 100000 as a substitute for relative eligibility.
- Do not promote `longHorizonSim` or `mapGen.simulate.ts` to Admin.
- Do not open a second reward or spell-level writer.
- Do not re-issue prior WDEAD / WDD / EBA / EED / FSN / AFDA / LHIPS IDs.
- Do not retune `100 * 2^(N-1)` (`LHIPS-001`).
- Do not mint INIT from Simulation or `saveBattleStats`.
- Do not concatenate sibling catalogs.

Extract path (unchanged): wrap `engine/spawnPolicy.ts`; add `engine/encounterFormations.ts`, `engine/encounterSim.ts`, `engine/dungeonPolicy.ts`. Occupancy stays `engine/occupancy.ts` + `engine/battleStartPlacement.ts`. World-event weights load from the **active** pack (`worldFeatures.ts` is the WDD catalog).

---

## 9. ACTION_ID index (this run only)

| ID | Title | Priority |
| :--- | :--- | :--- |
| WDEAD-2026-09-22-001 | Owner `enabledWaves` includes wave 4; one roll budget | P0 |
| WDEAD-2026-09-22-002 | Family variant knobs lie until battle-start HP/RES/SP overwrite is owned | P0 |
| WDEAD-2026-09-22-003 | Ingest EED day-4 rooms + FSN drop-4 as encounter data — do not fork arrays | P1 |
| WDEAD-2026-09-22-004 | `grantClass: copyLastCast`; Iron Lent / Tithe / Heavy Incant / Haze / Flint / Veil via registry | P1 |
| WDEAD-2026-09-22-005 | Rush sequencing namespaces 0–9 / B0–B3 / C0–C3 — Table C is additive | P1 |
| WDEAD-2026-09-22-006 | Owner lab reports family overwrite + INIT share; 100k is a hypothetical, not LHIPS | P1 |
| WDEAD-2026-09-22-007 | Elite second-roll vs live 30% `FAMILY_TYPES` — union Wave 4 sheets, never concatenate | P1 |

Full records: [`ACTION_IDS_WDEAD_2026-09-22.md`](./ACTION_IDS_WDEAD_2026-09-22.md).
