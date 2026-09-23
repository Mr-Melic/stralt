# World, Dungeon & Encounter Admin Designer — 2026-09-23

**Source automation:** World, Dungeon & Encounter Admin Designer (`1592c6c0-a499-11f1-a7d1-d6b4613131ce`)  
**This run:** `bc-444c106e-6b88-4dc4-8793-6849d77769d4`  
**HEAD inspected:** `0f5363f` (`main` after #332 — **same HEAD as the 2026-09-21 and 2026-09-22 briefs**)  
**Constraint:** design only. No production code, no RAF / mapGen / turn / damage-math edits.  
**Player rule:** Stralt has **no player level cap**. Every owner control must stay valid at hypothetical levels of 1, 50, 500, 5_000, 50_000, and 100_000. Never recommend a hard maximum player or enemy level.

Prior briefs (still the content-model contract):

- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-08-31.md`](./WORLD_ENCOUNTER_ADMIN_DESIGN_2026-08-31.md) — pack, relative spawn, Simulation Lab, DRAFT → SIMULATE → VALIDATE → ACTIVATE (`WDEAD-2026-08-31-001` … `015`)
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-01.md`](./WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-01.md) — lying knobs, `longHorizonSim` isolation, one roll budget, payable rewards (`WDEAD-2026-09-01-001` … `010`)
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-02.md`](./WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-02.md) — closed-interval 9999, unused `_rewardMultiplier`, wave-2 mix, AdminGuard 99/999, GameKey isolation, destack×formations, dungeon Doka curve (`WDEAD-2026-09-02-001` … `008`)
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-21.md`](https://github.com/Mr-Melic/stralt/pull/337) — wave-3 mix, wrap `spawnPolicy.ts`, `loanOneCast`, occupancy destack, lab spy, dual depth-5 freeze (`WDEAD-2026-09-21-001` … `007`). **Queued, not on `main`.**
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-22.md`](https://github.com/Mr-Melic/stralt/pull/394) — wave-4 mix, family HP wipe, EED day-4 + FSN drop-4 ingest, `copyLastCast`, Rush Table C, lab 100k, elite second-roll (`WDEAD-2026-09-22-001` … `007`). **Queued, not on `main`.**

This run’s IDs: [`ACTION_IDS_WDEAD_2026-09-23.md`](./ACTION_IDS_WDEAD_2026-09-23.md).

Do **not** re-issue `WDEAD-2026-08-31-*`, `WDEAD-2026-09-01-*`, `WDEAD-2026-09-02-*`, `WDEAD-2026-09-21-*`, `WDEAD-2026-09-22-*`, `WDD-*`, `EBA-*`, `EED-*` / `ENC-*`, `FSN-*`, `AFDA-*`, `LHIPS-*`, `EBMA-*`, or `MIMA-*`.

Live spawn/admin code has not moved since 09-21 (`0f5363f`). New IDs exist because **queued sibling catalogs from later on 2026-09-22** (wave 5 `WF-*`, Wick/Rime/Smoke/Plus rooms, FSN drop 5, elite wave 5, Rush Table D, LHIPS Crush measurement, portal-ring last-resort spawn) would be forked if the owner pack were implemented from 09-22 alone.

---

## 0. What this cron is for

The owner pack, relative spawn knobs, Simulation Laboratory, and DRAFT → SIMULATE → VALIDATE → ACTIVATE **still do not exist**. Admin is still the 15-tab CRUD list. Save is still live.

Preferred lifecycle is unchanged:

**DRAFT → SIMULATE → VALIDATE → ACTIVATE**

Admin / debug / simulation stay **dev-gated**. Simulation must never call `applyRewards`, `saveBattleStats`, `upgradeSpell`, `claimAchievementReward`, `processPendingPurchases`, `redeemGameKey`, persist-lock `commit`, one-shot Doka claim/settle, achievement unlock writers, or Boss Rush persist writers.

Oldest-first queued siblings this brief consumes (do not duplicate their IDs):

| PR | Role vs this pack |
| :--- | :--- |
| #334 / #415 AFDA | Honesty copy: Tiers leftover / unused Rush multiplier. Not owner knobs. Do not re-issue `WDEAD-2026-09-02-002`. |
| #337 WDEAD 09-21 | Prior designer IDs `001`…`007`. Stay `NEW`. |
| #344 WDD 09-21 | Wave-4 `WF-*`. `CatalogWave` becomes `1\|2\|3\|4`. |
| #347 / #396 EED | Tide/File/Clock rooms, then Wick/Rime/Smoke/Plus (`EED-2026-09-22-001`). |
| #348 / #401 FSN | Drop 4, then drop 5 (Ley Court / Fan File / …). |
| #349 / #405 elite | Wave 4 then Wave 5 family sheets + `wRare` skin. |
| #357 / #407 LHIPS | 100_000 stress; Crush one-shot vs 999-capped pack (`LHIPS-2026-09-22-001`). Observation harness, not the owner lab. |
| #367 / #406 boss bible | Table C then **Table D** (`D0`–`D3`) after Table C. |
| #394 WDEAD 09-22 | Prior designer IDs `001`…`007`. Stay `NEW`. |
| #399 WDD 09-22 | Wave-5 `WF-*` (`WDD-2026-09-22-001` DESIGNED). Restacked on #344. |
| #430 / #436 / #444 map | Far-island skip, keep-clear on the **live** spawn cell, portal-ring last-resort so dungeon rooms cannot place 0 hostiles. |

---

## 1. Re-audit: prior WDEAD IDs (all still `NEW` except 013 PARTIAL)

Live evidence is the 09-21 / 09-22 tables at the same HEAD. Line numbers below re-checked this run.

| Cluster | Still true? | This-run note |
| :--- | :--- | :--- |
| `WDEAD-2026-08-31-001`…`015` | Yes (013 PARTIAL) | Picker `floor(999 / ts)` (`combatMath.ts` 58). Dungeon extras/Doka still `min(depth, 5)` (`spawnPolicy.ts` 29, 144; `portalRules.ts` 161). Chain 3–5 (WX 6232, 6324). Death Realm fallbacks `maxLevel: 5` (WX 13514, 13646) vs entry `9999` (5439). No Simulation / Drafts / Encounters / Dungeons / World Events / Spawn tabs (`gameTypes.ts` 482–498; `TABS` 5610–5626). |
| `WDEAD-2026-09-01-001`…`010` | Yes | Tiers unlabeled on HEAD (honesty queued in #334/#415). `threeOrMorePercent` unread (`combatMath.ts` 72–75). Dual-roll 22 modifiers still the WDD placement contract (`docs/WORLD_DYNAMICS.md` 44). Rest / deathRealm still missing from `WorldFeatureRunMode` (`worldFeatures.ts` 67). |
| `WDEAD-2026-09-02-001`…`008` | Yes | Closed 9999 still a reject (WX 3702). `_rewardMultiplier` still unused (`useBossRush.ts` 209, 243). CatalogNote still claims it is read (`AdminDashboard.tsx` 7141–7146). AdminGuard `minLevel > 999` / `summonUnitDef.level > 99` (`adminGuard.mo` 411, 441). |
| `WDEAD-2026-09-21-001`…`007` | Yes (queued #337) | Wave 3 is on `main` (`LATEST_CATALOG_WAVE = 3`, 52 `WF-*`). `spawnPolicy.ts` is live defaults, not knobs. Tests still lock `dungeonSpawnExtras(99) === extras(5)` (`spawnPolicy.test.ts` 84) and `FAMILY_VARIANT_CHANCE === 0.3`. |
| `WDEAD-2026-09-22-001`…`007` | Yes (queued #394) | Family HP still discarded at `calcEnemyMaxHp` (WX 11970–11974). Wave 4 is still queued, not on `main`. Do not re-issue the family-HP wipe. |

Missing tabs (unchanged): Encounters, Dungeons, World Events, Spawn (beyond coarse tiers), Simulation, Drafts.

---

## 2. Wave 5 is not an owner control

On `main`, `CatalogWave = 1 | 2 | 3` and `LATEST_CATALOG_WAVE = 3` (`worldFeatures.ts` 64, 115). Catalog is 52 `WF-*` ids. `pickWeightedFeatures` (1853–1871) still mixes every wave into `MAX_ROLLED_FEATURES = 3`. WX still does not import `worldFeatures`. Live events are still the 22-id two-roll (`EXISTING_MAP_MODIFIER_IDS` 1890–1913).

Queued #344 extends the **same array** to wave 4. Queued #399 (`WDD-2026-09-22-001`) restacks on that and adds wave **5** (16 ids, one per category). Do not fork a sixth array.

| Id | Owner field this pack must name |
| :--- | :--- |
| `WF-HAZ-GLASS_SHARD` | walk-or-shove hazard; challenge HP; never a wall |
| `WF-HAZ-RATCHET_COG` | moving hazard; occupy the cell it left |
| `WF-TRP-SECOND_FOOT` | 2-print occupancy trap |
| `WF-TER-SANDBAG` | `blocksWalk` cover that can dump; open LoS |
| `WF-OBS-SHIFT_SLAB` | time-open lane; solvability as if already wall |
| `WF-ZON-KEEN_EDGE` | `combatHookId` on **Attack Nearest** post-formula +15%; not a spell |
| `WF-TEL-RECALL_PIN` | 1 AP mark / 1 MP return; occupancy, not `effectCategory` teleport |
| `WF-PRT-PACT_GATE` | exploration-only extra portal; hard `applyRewards` if a living allied summon is Chebyshev ≤ 2; never dungeon / rush / deathRealm |
| `WF-INV-MIRROR_HOST` | +1 elite; mirrors player HP %; exploration skip; run map-clear hostile |
| `WF-ELT-DRIFT_SENTINEL` | odd-round wander / even-round stand; run required-hostile |
| `WF-TRS-BLOOD_LOCK` | 1 AP + 5% max HP; sure hard purse; one-shot id; challenge HP |
| `WF-SPL-OATH_CANTOR` | `grantClass: bindWhileAlive` (1 AP adjacent bind of their extra `usableByEnemy` row; bind **ends on death**; no leftover cast; no `upgradeSpell`) |
| `WF-RSK-OPEN_VEIN` | 10% max HP flag; hard `rewardCurve` only if a fight starts; challenge recorders |
| `WF-MOD-THIN_AIR` | `SpellConfig.apCost === 1` costs 2 AP; never the spell name; Attack Nearest / summons unchanged |
| `WF-EVT-FIRST_BLOOD` | first HP debit this map on an **enemy** → hard `applyRewards`; player-side first hit → unchanged |
| `WF-ENV-CROWD_PRESS` | end-of-turn 3% if two other living units Chebyshev ≤ 2; challenge recorders; inverse of Isolation Chill |

`WDEAD-2026-09-22-001` stops at wave **4**. Owner `enabledWaves` after #399 must be any non-empty subset of `{1,2,3,4,5}`. Until VALIDATE, do not overlay wave 5. Dual-roll with the 22 live modifiers remains a VALIDATE fail (`WDEAD-2026-09-01-003`). Pact Gate joins Flicker / Echo / Latch / Wager / Gambit / Pilgrim as exploration-only.

---

## 3. Encounter / formation catalogs are still data, not a second Admin array

`WDEAD-2026-09-22-003` ingested Tide/File/Clock + FSN drop 4. Later the same day:

- #396 (`EED-2026-09-22-001`) adds Wick / Rime / Smoke / Plus rooms (`ENC-TEACH-05`, `ENC-WICK-01`, `ENC-RIME-01`, `ENC-COUP-01`, `ENC-PLUS-01`, `ENC-LEASH-01`, `ENC-FONT-01`, `ENC-TITHE-01`, `ENC-RUSH-15`…`18` as Table C, …).
- #401 adds FSN **drop 5** (Ley Court / Fan File / Trade Trap / Recoil Hunt / Gate Court / Font Gate / Lens Battery — Wave 4 family combinations).

Owner room pools still **reference** `ENC-*` / `FSN-*` ids. VALIDATE rejects unknown `formationId`. Union overlapping helpers — one `export function` per name. Do not concatenate drop-4 and drop-5 into two copies of the same sheet helper.

Rest is still a **world** 10% portal, not a dungeon room. `MAX_ENEMIES = 20`. Mirror Host / Drift Sentinel extras report `skippedForBudget`.

---

## 4. Portal-ring last-resort is a new occupancy compose rule

`WDEAD-2026-09-21-004` / `09-22-003` already require formations to compose with `occupancy.isCellFree` + fight-graph destack (no far-island hop). Queued map PRs after that:

1. #430 — skip far-island enemy seeds behind a portal choke.
2. #436 — keep-clear follows the **legalized live spawn cell**, not a hardcoded `(8,8)` diamond (`spawnPolicy.ts` `MAP_SPAWN_CELL` is still that diamond on `main`).
3. #444 — when every near-side floor sits inside portal Manhattan ≤ 2, last-resort spawn is the **near-side portal ring** (never the portal tile, never the far island) so `generateEnemies` cannot return `[]` and skip a dungeon room.

Owner VALIDATE:

- A dungeon room still places ≥ 1 hostile after last-resort. Formations that cannot fit drop **slots**, they do not skip the room.
- Authored COURT / plus-arm / wick-file geometry must not treat portal-ring last-resort as the intended art. Sim reports `portalRingLastResort`, `keepClearFollowsLiveSpawn`, `farIslandSkipped`.
- Do not disable #444 to “keep keep-clear art.” Do not edit `mapGen.ts` from this program.

On `main`, `collectValidEnemySpawnCells` still uses the hardcoded spawn diamond (`spawnPolicy.ts` 41–44, 183–188) and `generateEnemies` still scatters Chebyshev ≥ 4 then 30% family (WX 5711–5869).

---

## 5. Boss Rush tables are four namespaces, not a rewrite of 10 rooms

Live: `BOSS_RUSH_ROOMS` is 10 hardcoded pairs (`useBossRush.ts` 24–135). Admin enable + per-room `x` still do not skip rooms. `_rewardMultiplier` has zero readers. `completeBossRushRoom` stays `(0, 0)`. Room 9 `boss2Id: "weeping_pawn_2"` is still not a `BossId`.

Queued bible:

- Table B `B0`–`B3` after one clear of 0–9.
- Table C `C0`–`C3` after one clear of Table B (`WDEAD-2026-09-22-005`).
- **Table D** `D0`–`D3` after one clear of Table C (`#406`): lock+wick, bait+conductor, font+cord, surplus+pendulum. Additive. Do not overwrite 0–9 / B / C. Wave-6 ids (`lock_marshal`, `bait_vicar`, `font_abbess`, `surplus_auditor`) stay out of live `BOSS_IDS` until a human pick.

Until VALIDATE, CatalogNote must not claim Table D or `rewardMultiplier` is live. Do not bind `_rewardMultiplier` as a second wallet write. Relative scale is still offset + curve versus the player (`LHIPS-2026-08-31-010` — static ~350 Pale Archbishop). Never a stored `levelMax`.

---

## 6. Elite wave 5 is still a second roll

Live: seven `EnemyFamily` ids (`gameTypes.ts` 12–20), 30% equal overlay (`spawnPolicy.ts` 49–57, 35), no `isElite`. Family HP/RES/SP still die at battle start (`WDEAD-2026-09-22-002` — do not re-issue).

Queued #405 adds fifteen **PROPOSED** Wave 5 families (Wave 4 SPELL_PROPOSALS as CORE, plus Stolen Verse / Misstep / Bitter Cup) and a **2% `wRare` skin** on the BASE → VETERAN → ELITE → CHAMPION second roll.

Owner elite % remains that second roll. Do not append Wave 5 ids onto live `FAMILY_TYPES`. Restack union ≠ concatenate. Champion floors sit on `computeAITier` only after ACTIVATE. Rewards stay theoretical until payable clamp (`WDEAD-2026-09-01-005`).

---

## 7. Simulation Laboratory — Crush vs the 999 pack is not “the lab exists”

No Admin Simulation tab. Tiers preview still `[1, 10, 25, 50, 100, 200, 500]` (`AdminDashboard.tsx` 3877). `longHorizonSim.ts` on `main` samples 10_000 / 50_000 (`STRESS_LEVELS` 82–85). Queued #357/#407 add **100_000** plus Crush helpers.

`WDEAD-2026-09-22-006` already said 100k is a hypothetical, not LHIPS. Do not re-issue it. This run only:

- Owner estimated difficulty includes `crushOneShotAtMaxEnemy` / `crushRecvAtSpawnCap` against linear player HP (live fallback Crush 12 × `max(1, L/5)`, WX 16710–16728). LHIPS measured one-shots at player 1 from enemy **52** and player 10 from **75**, then Crush at the 1020 spawn cap cannot threaten linear HP after ~378 (`LHIPS-2026-09-22-001` — **report only**, do not retune Crush here).
- Do **not** “fix” that by raising `floor(999 / ts)` or teaching 100_000 as a career cap.
- Wave-mix histogram includes **5** after #399.
- Spy list unchanged from 09-21-005. Bundle must not import `longHorizonSim.ts` or `mapGen.simulate.ts`.

---

## 8. Owner console IA (unchanged, still missing)

Carved-stone, dark slate, crimson (`#13161f`, `#d8463f`, `#f0c44a`).

```
CONTENT
  Encounters     pools · formations · rarity · objectives · rewards · hazards · rules
                 (ids from EED / FSN catalogs — union, never concatenate copies)
  Dungeons       rooms · sequence · special · rest · branch · bosses · modifiers · rewards
  Boss Rush      pool · scale · progression · multipliers · sequence
                 (namespaces 0–9 / B0–B3 / C0–C3 / D0–D3)
  World Events   eligibility (incl. rest / deathRealm) · rarity · hazards · elites
                 · grants · hooks · catalogWave 1–5
  Spawn          relative level · equal · above · elite · variant · size · family · spells · AI
                 (wraps spawnPolicy.ts; family stats declare battle-start survival)
  Simulation     hypothetical level (unbounded, incl. 100_000) · N · seed · reports
LIFECYCLE
  Drafts         diff vs active · simulate · validate · activate
LEGACY (label unused knobs until migrate)
  Enemies / Regions / Tiers / Modifiers / Bosses / Names
```

Enemy Register chrome is flavor lore (`enemyRegisterCopy.ts`) — not an encounter catalog and not `getEnemyConfigs` (WX still has zero reads).

### Validate gates (08-31 §6 + later runs + this run)

41. `enabledWaves` may include **5**; `CatalogWave` is `1|2|3|4|5` after #399 lands. Sim mix ≠ 100% newest wave at `maxRolled=3`. Pact Gate never rolls in dungeon / rush / deathRealm.
42. `grantClass` includes `bindWhileAlive` (Oath Cantor). Zero `upgradeSpell`. Thin Air / Keen Edge read `apCost` / Attack Nearest metadata only.
43. Encounter / formation ids resolve to EED day-5 and FSN drop-5 as well as earlier sheets. Unknown `formationId` fails VALIDATE.
44. Rush sequencing distinguishes rooms 0–9, `B0`–`B3`, `C0`–`C3`, `D0`–`D3`. Activating Table D does not rewrite 0–9 / B / C.
45. Elite rarity is still a **second** roll (plus optional `wRare` %). Do not append Wave 5 family ids onto live `FAMILY_TYPES`.
46. Sim reports `portalRingLastResort` / `keepClearFollowsLiveSpawn`. Dungeon rooms still have ≥ 1 hostile. No `mapGen.ts` hunk.
47. Lab reports Crush vs the live 999-capped pack without raising 999 or calling LHIPS. Hypothetical 100_000 accepted.

---

## 9. What this program must not do

- Do not implement the pack, the lab, or the tabs in this run.
- Do not edit `WorldExploration.tsx` to overlay wave 5 or to “fix” family HP or Crush.
- Do not edit RAF, `mapGen.ts`, turn order, or `calcScaledDamage`.
- Do not add `levelMax` “for safety” or raise 9999 / 99 / 999 / 100000 as a substitute for relative eligibility.
- Do not promote `longHorizonSim` or `mapGen.simulate.ts` to Admin.
- Do not open a second reward or spell-level writer.
- Do not re-issue prior WDEAD / WDD / EBA / EED / FSN / AFDA / LHIPS IDs.
- Do not retune `100 * 2^(N-1)` (`LHIPS-001`) or Crush (`LHIPS-2026-09-22-001`).
- Do not mint INIT from Simulation or `saveBattleStats`.
- Do not concatenate sibling catalogs.

Extract path (unchanged): wrap `engine/spawnPolicy.ts`; add `engine/encounterFormations.ts`, `engine/encounterSim.ts`, `engine/dungeonPolicy.ts`. Occupancy stays `engine/occupancy.ts` + `engine/battleStartPlacement.ts`. World-event weights load from the **active** pack (`worldFeatures.ts` is the WDD catalog).

---

## 10. ACTION_ID index (this run only)

| ID | Title | Priority |
| :--- | :--- | :--- |
| WDEAD-2026-09-23-001 | Owner `enabledWaves` includes wave 5; one roll budget | P0 |
| WDEAD-2026-09-23-002 | `grantClass: bindWhileAlive`; Thin Air / Keen Edge / First Blood / Blood Lock / Open Vein / Crowd Press via registry | P1 |
| WDEAD-2026-09-23-003 | Ingest EED day-5 + FSN drop-5 as encounter data — do not fork arrays | P1 |
| WDEAD-2026-09-23-004 | Rush sequencing namespaces add `D0`–`D3` — Table D is additive | P1 |
| WDEAD-2026-09-23-005 | Elite wave 5 + `wRare` is still a second roll — never concatenate `FAMILY_TYPES` | P1 |
| WDEAD-2026-09-23-006 | Formations compose with portal-ring last-resort and live-spawn keep-clear | P1 |
| WDEAD-2026-09-23-007 | Owner lab reports Crush vs the 999-capped pack — do not raise 999 | P1 |

Full records: [`ACTION_IDS_WDEAD_2026-09-23.md`](./ACTION_IDS_WDEAD_2026-09-23.md).
