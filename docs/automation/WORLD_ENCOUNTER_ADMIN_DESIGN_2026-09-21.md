# World, Dungeon & Encounter Admin Designer — 2026-09-21

**Source automation:** World, Dungeon & Encounter Admin Designer (`1592c6c0-a499-11f1-a7d1-d6b4613131ce`)  
**This run:** `bc-e476857f-69aa-4f23-ba92-2af5d6ea6676`  
**HEAD inspected:** `0f5363f` (`main` after #332)  
**Constraint:** design only. No production code, no RAF / mapGen / turn / damage-math edits.  
**Player rule:** Stralt has **no player level cap**. Every owner control must stay valid at hypothetical levels of 1, 50, 500, 5_000, and 50_000. Never recommend a hard maximum player or enemy level.

Prior briefs (still the content-model contract):

- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-08-31.md`](./WORLD_ENCOUNTER_ADMIN_DESIGN_2026-08-31.md) — pack, relative spawn, Simulation Lab, DRAFT → SIMULATE → VALIDATE → ACTIVATE (`WDEAD-2026-08-31-001` … `015`)
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-01.md`](./WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-01.md) — lying knobs, `longHorizonSim` isolation, one roll budget, payable rewards (`WDEAD-2026-09-01-001` … `010`)
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-02.md`](./WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-02.md) — closed-interval 9999, unused `_rewardMultiplier`, wave-2 mix, AdminGuard 99/999, GameKey isolation, destack×formations, dungeon Doka curve (`WDEAD-2026-09-02-001` … `008`)

This run’s IDs: [`ACTION_IDS_WDEAD_2026-09-21.md`](./ACTION_IDS_WDEAD_2026-09-21.md).

Do **not** re-issue `WDEAD-2026-08-31-*`, `WDEAD-2026-09-01-*`, `WDEAD-2026-09-02-*`, `WDD-*`, `EBA-*`, `EED-*` / `ENC-*`, `FSN-*`, `AFDA-*`, `LHIPS-*`, or `EBMA-*`.

Open PRs targeting `main` at audit time (oldest `createdAt` first): #327 (draft, Striker AoE), #331 (draft, portal destack), #333 (docs, telemetry-waiting), #334 (AFDA honesty: Tiers leftover / unused Rush multiplier copy). This run is docs-only and must stay merge-clean vs all four. Do not duplicate `AFDA-2026-09-21-026` (sum-100 gate). #334 is **copy + save-gate**, not the owner pack.

---

## 0. What this cron is for

The owner pack, relative spawn knobs, Simulation Laboratory, and DRAFT → SIMULATE → VALIDATE → ACTIVATE **still do not exist**. This run re-audits live ceilings against `0f5363f` (~157 commits after the 2026-09-02 brief) and only issues **NEW** IDs for gaps that appeared or hardened after that brief.

Preferred lifecycle is unchanged:

**DRAFT → SIMULATE → VALIDATE → ACTIVATE**

Admin / debug / simulation stay **dev-gated**. Simulation must never call `applyRewards`, `saveBattleStats`, `upgradeSpell`, `claimAchievementReward`, `processPendingPurchases`, `redeemGameKey`, persist-lock `commit`, one-shot Doka claim helpers, or achievement unlock writers.

---

## 1. Re-audit: `WDEAD-2026-08-31-001` … `015`

Line numbers below are **this HEAD**. Status stays `NEW` unless noted.

| ID | Still true? | Live evidence @ `0f5363f` |
| :--- | :--- | :--- |
| 001 hard ceilings | Yes | `combatMath.ts` 58 `maxTier = floor(999 / ts)`. `computeAITier` 36–51 stops at 900 → tier 10; 30% uniform 1–10. Admin default `levelMax` is `BigInt(9999)` (`AdminDashboard.tsx` 138–157). Region match is still a **closed interval** `level <= levelMax` (WX 3702). Dungeon extras / boost now live in `spawnPolicy.dungeonSpawnExtras` and still clamp `Math.min(dungeonDepth, 5)` (`spawnPolicy.ts` 26–29, 144; test 84: depth 99 == depth 5). Chain length `3 + floor(random*3)` (WX 6232, 6324). Death Realm fallbacks `maxLevel: 5` (WX 13514, 13646) vs entry `9999` (5439). Rest maps `maxLevel: 9999` (5517). Closed-interval 9999 stay `WDEAD-2026-09-02-001`. Dual depth-5 tables → **09-21-006**. |
| 002 relative spawn knobs | Yes | Tiers tab still four buckets. Preview `SAMPLE_LEVELS = [1, 10, 25, 50, 100, 200, 500]` (3877). `tierSize` `max={100}` (3959) and `validateTierSpawnConfig` `tierSize > 100` (`adminSafety.ts` 567–568). Frontend `TierSpawnConfig` (`gameTypes.ts` 428–434) still omits `levelVarianceChance`. **Queued #334** adds a Tiers `CatalogNote` (leftover ±3+, hardcoded 15% variance, `floor(999 / tierSize)` named as a spawn-band clamp) and stops blocking the 60/20/10/5 95-total canister default — honesty, not relative knobs. Extract path `engine/spawnPolicy.ts` now **exists** as live defaults, not owner knobs → **09-21-002**. |
| 003 Simulation Lab | Yes | No Admin Simulation tab (`gameTypes.ts` 482–498; `TABS` 5610–5626, 15 keys). `mapGen.simulate.ts` is a seeded **solvability** replica of generateRandomMap / generateEnemies (header 1–5), not an encounter lab. `longHorizonSim.ts` is still the LHIPS CLI. **Do not treat either as 003.** Isolation expansion → **09-21-005**. |
| 004 draft lifecycle | Yes | Tiers save writes canister then `localStorage` immediately (3861–3869). Boss Rush save same pattern. No pack status. |
| 005 encounter catalog | Yes | `generateEnemies` (WX 5711–5869) now **calls** `dungeonSpawnExtras` / `rollOverworldEnemyCount` / `collectValidEnemySpawnCells` / `applyFamilyVariantsToRoster` from `spawnPolicy.ts`. Size is still `1..8` + depth table, random chess piece, quadrant + Chebyshev ≥ 4, then 30% equal-weight family (5862–5866). No formation / rarity / rule / encounter-bound objective. Consume `EED-*` / `FSN-*` as data; do not duplicate rooms. |
| 006 dead EnemyConfig | Yes (labels improved) | Enemies tab admits catalog-only (`AdminDashboard.tsx` 2117–2122). Player Enemy Register is **flavor lore** (`enemyRegisterCopy.ts` 11–12, `ENEMY_REGISTER_HONESTY`). WX still has **zero** `enemyConfigs` / `getEnemyConfigs` reads. Do not treat either label as wiring. |
| 007 dungeon policy | Yes | Entry 20% (WX 4855). Rest is a **world** 10% portal (4914–4919), not a dungeon room. Bosses 15% (4887). Continue-in-chain shrine 25% (5020–5023). Chain length still 3–5. No branch graph. |
| 008 Boss Rush policy | Yes | `BOSS_RUSH_ROOMS` still 10 hardcoded pairs (`useBossRush.ts` 24–135). Entry 8% (WX 4937–4942). Admin enable + per-room `x` still do not skip rooms. `_rewardMultiplier` still unused (209, 243). CatalogNote lie stays `WDEAD-2026-09-02-002`. |
| 009 world-event catalog | Partial | Hardcoded catalog is now **52** `WF-*` ids (20 wave 1 + 16 wave 2 + 16 wave 3, `worldFeatures.ts` 165–1694). `LATEST_CATALOG_WAVE = 3` (115). Still not owner-editable, still not imported by WX. Live events are still the 22-modifier two-roll (`docs/WORLD_DYNAMICS.md` “Live modifiers” row). Do not re-issue 009. Wave 3 mix → **09-21-001**. |
| 010 relative rewards | Yes | Rush rooms still flat 500–5000 / 200–2000. Payable clamp still `applyRewards` `#err` above 100_000 Doka / 500_000 XP (`main.mo` 2119–2120). Extreme `REWARD_MULT` 2.5 still clips jackpots. |
| 011 elite / variant / size / family / AI knobs | Yes | Family 30% equal, now a named `FAMILY_VARIANT_CHANCE = 0.3` (`spawnPolicy.ts` 35) locked by test (`spawnPolicy.test.ts` 239). `MAX_ENEMIES = 20`. No `isElite`. AI still 10-bucket + 30% chaos. |
| 012 summoner + NaN kit zone | Yes | `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` (WX 11920) still passes the **zone object** into a `number` parameter (`enemyAI.ts` 194–199 → `Math.floor(levelZone)`). Summoner `ENEMY_SUMMONER_CHANCE_BASE + characterStats.level * PER_LEVEL_ZONE` (WX 11932–11934; constants `gameConstants.ts` 298–299). Linear, unclamped. LHIPS now **locks** `summonerChance(44) >= 1` (`longHorizonSim.test.ts` 51). |
| 013 unify Doka tables | **PARTIAL** | Still one reader `dungeonDokaMultiplierFor` (`portalRules.ts` 148–161) used by WX HUD (1354–1355), `useDungeonState.ts` 14–18, `longHorizonSim.ts` 561. **Freeze `Math.min(safeDepth, 5)` remains.** Owner editor stays `WDEAD-2026-09-02-008`. Dual freeze with spawn extras → **09-21-006**. |
| 014 backend bosses | Yes | Bosses tab still “Browser-local drafts only (`pbv_boss_configs`)” (`AdminDashboard.tsx` 7837–7839). WX boss portal still `localStorage.getItem("pbv_boss_configs")` (6486). |
| 015 dev-gate lab | Yes | Lab does not exist. Admin is still the 15-tab CRUD list (5610–5626), Purchases added, no Simulation / Drafts / Encounters / Dungeons / World Events / Spawn. |

Missing tabs (unchanged): Encounters, Dungeons, World Events, Spawn (beyond coarse tiers), Simulation, Drafts.

---

## 2. Re-audit: `WDEAD-2026-09-01-001` … `010` (all still `NEW`)

| ID | Still true? | Drift since 09-02 |
| :--- | :--- | :--- |
| 001 lying knobs | Yes (labels queued) | Honesty `CatalogNote` on Enemies, Sprites, Shop, Boss Rush. Player Register is flavor lore. **Queued #334** (`AFDA-2026-09-21-026`) labels leftover `threeOrMorePercent` and unused Rush multiplier — do not re-issue 001/09-02-002 for copy. `levelVarianceChance` still engine-only. Relative equal/above knobs still missing (`WDEAD-2026-08-31-002`). |
| 002 isolate `longHorizonSim` | Yes | Still CLI. **`STRESS_LEVELS` now includes 10_000 / 50_000** (`longHorizonSim.ts` 82–85). That is LHIPS overflow sampling, **not** the owner lab. Header still “observation harness.” Do not promote. Isolation expansion (simulate.ts, feats, one-shots) → **09-21-005**. |
| 003 one roll budget | Yes | Wave 3 **reaffirmed** independent two-roll in `docs/WORLD_DYNAMICS.md`. Catalog grew 36 → **52** ids. `pickWeightedFeatures` (1853–1871) still mixes all waves into `MAX_ROLLED_FEATURES = 3` (32). WX still does not import `worldFeatures`. **New owner-wave-3 + contract conflict → 09-21-001.** |
| 004 `skippedForBudget` | Yes | `MAX_ROLLED_FEATURES = 3`. `canAddEnemies` / `canAddHazardTiles` still skip at 20 / 50. Three waves now compete for the same 3 slots. Sleeping Vanguard (+2) and Warband (+3–5) skip harder. |
| 005 payable rewards | Yes | `applyRewards` still `#err` above 100_000 / 500_000 (`main.mo` 2119–2120). Wave-3 Harvest Moon / Stillness Oath / Latch Gate / Scourge Compact all propose hard `REWARD_MULT` 2.5 on the next credit. |
| 006 `grantClass` | Yes | Rune Bearer still `mapAttune`. Grimoire Stalker still `oneCast`. **Loaner Mage** is a new adjacent-1-AP loan of the same one-cast (`WF-SPL-LOANER_MAGE`, `worldFeatures.ts` 1550–1578). Do not re-issue 006; expand → **09-21-003**. |
| 007 combat hooks only | Yes | Eclipse / Low Ceiling / Echo Hall still unwired. Wave 3 **Short Fuse** (cooldown field, round 1), **Isolation Chill** (% max HP by Chebyshev), **Harvest Moon** (70% HP flag) are new hook candidates. Same rule. Expand → **09-21-003**. |
| 008 overflow 50_000 | Yes (LHIPS PARTIAL) | Tiers preview still caps sample at 500 (3877). LHIPS stress **now** includes 10k/50k — do **not** mark 008 done. Owner lab still missing. |
| 009 rush multipliers → `applyRewards` | Yes | `persistBossRushRoomClear` still calls `completeBossRushRoom(..., 0, 0)` (`bossRushProgress.ts` 186–190). `_rewardMultiplier` unused. |
| 010 rest / deathRealm eligibility | Yes | `WorldFeatureRunMode` is still `exploration \| dungeon \| bossRush` (`worldFeatures.ts` 67). `isFeatureAllowedInContext` hard-returns false for `deathRealm` (1764–1770). Wave 3 **Latch Gate** joins Flicker / Echo / Pilgrim as `EXPLORATION_ONLY` (1429–1455). Rest is still not an enum value. |

---

## 3. Re-audit: `WDEAD-2026-09-02-001` … `008` (all still `NEW`)

| ID | Still true? | Drift since 09-02 |
| :--- | :--- | :--- |
| 001 closed 9999 | Yes | Defaults and `ELIGIBILITY_BAND_HINT` unchanged (`AdminDashboard.tsx` 137–249). WX closed interval unchanged (3702). Do not raise 9999. |
| 002 Rush CatalogNote lie | Copy queued in #334 | HEAD still says “only parsed.rewardMultiplier is read” (7141–7146). Setter at `useBossRush.ts` 243; **zero readers**. #334 relabels to unused state. Wiring `rewardMultiplier` into `applyRewards` stays `WDEAD-2026-09-01-009`. Do not re-issue 002. |
| 003 catalogWave + one budget | Yes | Now **worse**: wave 3 landed (`WDD-2026-09-02-001` DESIGNED). `featuresInCatalogWave(3)` is 16 ids (`worldFeatures.test.ts` 154–157). `pickWeightedFeatures` still has no wave filter. Do not re-issue 003; owner `enabledWaves` must include **3** → **09-21-001**. |
| 004 `oneCast` + Scourge/Echo | Yes | Still unwired. Loaner Mage / Short Fuse / Harvest Moon / Stillness Oath are additional classes. Expand → **09-21-003**. |
| 005 AdminGuard 99 / 999 | Yes | `adminGuard.mo` 411 `minLevel > 999`, 438–441 `summonLifespan > 20`, `summonUnitDef.level > 99`. Unchanged. |
| 006 GameKey lab isolation | Yes | `redeemGameKey` is still an official persist credit. Spy list must **grow** for feats + one-shots → **09-21-005**. |
| 007 formations × destack | Yes | Occupancy is now a **shared engine** (`occupancy.ts` header: single source of truth). Battle-start unique cells live in `battleStartPlacement.ts` (extracted; WX 11858–11890). `destackSpawns` still in `mapGen.ts` 741+ and must stay on the origin fight graph / player side of a portal (post-09-02 leftover-island + corridor-dump work). Expand → **09-21-004**. Do not edit `mapGen.ts` from this program. |
| 008 dungeon Doka unbounded | Yes | Helper still `Math.min(safeDepth, 5)` → 4.0× (`portalRules.ts` 161). Tests assert depth 5 = 4 (`portalRules.test.ts` 113). Spawn extras now freeze in a **second** extracted table → **09-21-006**. |

---

## 4. What landed that is not the owner pack

| Artifact | Status | Owner can edit? | Drives live spawn? |
| :--- | :--- | :--- | :--- |
| `engine/spawnPolicy.ts` | Live extract of WX `generateEnemies` keep-clear / extras / 30% family | **No** — constants | **Yes** — WX calls it. Tests lock depth-5 freeze and 0.3 family. |
| `engine/battleStartPlacement.ts` + `occupancy.ts` | Live unique occupancy | **No** | **Yes** — battle start destack. Formations must compose. |
| `engine/mapGen.simulate.ts` | Solvability replay of generateEnemies | **No** | **No** (tests only). Not the owner lab. |
| Wave 3 `WF-*` (16 ids, `catalogWave: 3`) | Designed + unit-tested (`WDD-2026-09-02-001`) | **No** | **No** |
| `LATEST_CATALOG_WAVE = 3` | Catalog pointer | **No** — `pickWeightedFeatures` ignores it | N/A until overlay |
| LHIPS `STRESS_LEVELS` + 10k/50k | Engineer CLI | **No** | **No** |
| Enemy Register flavor lore | Player honesty | N/A | **No** |
| Admin `CatalogNote` + `DEFAULT_ELIGIBILITY_LEVEL_MAX = 9999` | Honesty / AFDA | Band fields yes | Region match yes (closed interval). EnemyConfig rows still unused. |
| Queued #334 Tiers leftover + Rush unused-state copy | Honesty (`AFDA-2026-09-21-026`) | Labels yes | Spawn still four buckets + 999 clamp. Not the owner pack. |
| `dungeonDokaMultiplierFor` | Shared helper | **No** | Yes — freeze at depth 5 |
| GameKey / Mollie shop | Live economy | Approve / grant / ban | Not spawn. **Is** a persist credit. |
| Boss Rush victory feats on room-clear | Live persist | No | Not spawn. **Is** an unlock writer. |
| `AdminGuard` summon `level > 99`, `minLevel > 999` | Input rails | Yes (reject) | Spell catalog writes. Career caps on content. |

**Rule (unchanged):** every owner field must either drive the active pack after VALIDATE or be labeled read-only / unused. A CatalogNote that claims a field is live when the only binding is an unused `_` state is worse than no note. Extracting a constant into `spawnPolicy.ts` and locking it with a test is **not** an owner control.

---

## 5. Wave 3 is not an owner control

`LATEST_CATALOG_WAVE = 3` (`worldFeatures.ts` 115). `featuresInCatalogWave(1|2|3)` exists (1711–1713). Tests assert 16 wave-3 ids, one per category (`worldFeatures.test.ts` 154–157). `pickWeightedFeatures` (1853–1871) filters by slot + run mode only — **all three waves share `MAX_ROLLED_FEATURES = 3`**.

`docs/WORLD_DYNAMICS.md` still says the 22 live modifiers “still roll on their own two-roll; this catalog does not replace them.” That sentence is the WDD placement contract. It is **not** the owner-console contract (`WDEAD-2026-09-01-003`, `WDEAD-2026-09-02-003`). Wave 3 added another 16 hardcoded rows without giving the owner:

- `enabledWaves: 1[] | 2[] | 3[] | combinations`
- per-wave rarity mix
- a single roll budget that includes `MAP_MODIFIERS` ids

Until VALIDATE, `WF-*` stay data. Do not overlay from Admin “to try wave 3.” Sibling `WDD-2026-09-02-001` is DESIGNED — do not fork a fourth array.

Wave-3 ids the owner pack must name (consume, do not rewrite):

| Id | Owner field |
| :--- | :--- |
| `WF-PRT-LATCH_GATE` | eligibility: exploration-only (portalRules filter); rest / deathRealm stay illegal |
| `WF-INV-SLEEPING_VANGUARD` | extras +2; skip if `skippedForBudget`; exploration leave-without-wake vs run map-clear |
| `WF-ELT-CART_GUARD` | exploration departure vs run required elite (same class as Toll Keeper) |
| `WF-SPL-LOANER_MAGE` | `grantClass: loanOneCast` (1 AP adjacent, this map, does not stack with kill-grant) |
| `WF-RSK-STILLNESS_OATH` | `rewardCurve` flag cleared by **MP spend**; next `applyRewards` hard multiplier |
| `WF-MOD-SHORT_FUSE` | `combatHookId` on `SpellConfig.cooldown > 0`, round 1 only — never spell **name** |
| `WF-EVT-HARVEST_MOON` | `rewardCurve` if current/max HP never &lt; 70% this map |
| `WF-ENV-ISOLATION_CHILL` | `combatHookId` % max-HP tax via challenge recorders; Chebyshev 3 |
| `WF-TRS-SPLIT_CACHE` | payable preview; one-shot id before credit |
| `WF-HAZ-NEEDLE_GRASS` / `ORBIT_CINDER` / `CHEVRON_PLATE` / `FROST_PANE` / `SPENT_BRIDGE` / `RALLY_DRUM` / `TRIUNE_PADS` | tile / zone / teleport slots; post-`finalizePlayableLayout` placement (WDD) |

---

## 6. `spawnPolicy.ts` is the extract path — it is not the pack

`WDEAD-2026-08-31-001` told implementers to extract pickers to `engine/spawnPolicy.ts`. That extract **landed** (`7fd4013`) and WX `generateEnemies` now calls it (5720–5740, 5864). The module is React-free and is the right host for **draft defaults**.

It is **not** an owner surface:

```
DUNGEON_SPAWN_DEPTH_CAP = 5          // spawnPolicy.ts 29
DUNGEON_EXTRA_ENEMIES / TIER_BOOST   // freeze past 5 (144, test 84)
OVERWORLD_ENEMY_COUNT_SPAN = 8       // 1..8 (32, 155–159)
FAMILY_VARIANT_CHANCE = 0.3          // equal-weight FAMILY_TYPES (35, 49–57)
SPAWN_MIN_CHEBYSHEV = 4              // board spacing, keep
```

`spawnPolicy.test.ts` 63–84 **requires** `dungeonSpawnExtras(99) === dungeonSpawnExtras(5)`. Activating an unbounded dungeon curve (`WDEAD-2026-09-02-008` + this run’s 006) **must rewrite that test**, not silently fail CI. Do not add a second extras table in WX or Admin.

Owner knobs wrap these constants as the **active pack’s spawnPolicy** after VALIDATE. Live numbers stay the draft defaults until then.

---

## 7. Dual depth-5 freeze (Doka + extras)

Two extracted helpers now freeze the same career:

| Helper | Freeze | Consumers |
| :--- | :--- | :--- |
| `dungeonDokaMultiplierFor` | `Math.min(safeDepth, 5)` → 4.0× | WX HUD, `useDungeonState`, LHIPS |
| `dungeonSpawnExtras` | `Math.min(dungeonDepth, 5)` extras 5 / boost 3 | `generateEnemies` |

`WDEAD-2026-09-02-008` unlocked the Doka editor on the unified helper. If only Doka is unbounded, a depth-6 sim shows a higher purse on the **same** roster. Owner `dungeonPolicy` is **one** unbounded curve (or two named curves on one pack) that both helpers read after ACTIVATE. Chain length 3–5 (WX 6324) stays `WDEAD-2026-08-31-007`. Do not treat LHIPS `dungeonMultiplierAtDepth5` as the owner default.

---

## 8. Occupancy extract and fight-graph destack

Since 09-02:

- `occupancy.ts` is the single `isCellFree` source (header: every position-changing path).
- `battleStartPlacement.findBattleStartCell` owns unique battle-start cells (player ≥3, enemies ≥2, each result added to `placed` — WX 11858–11890).
- `mapGen.destackSpawns` (741+) stays on the origin reachable component; later fixes keep hostiles on the **player’s side of a portal** and corridor dump cells on the fight graph.

Scripted formations (`FSN-*`) and `WF-INV-WARBAND` / `WF-INV-SLEEPING_VANGUARD` extras assume authored cells. Destack can relocate after generate. `WDEAD-2026-09-02-007` still owns the rule; this run names the **extracted** helpers so an implementer does not grow a third occupancy module or disable destack “to keep formation art.”

Validate solvability after destack. Report `destackRelocations`. Drop a slot that cannot destack onto the origin component. Do not edit `mapGen.ts` or the RAF loop from this program.

---

## 9. Simulation Laboratory — isolation after GameKey, feats, and one-shots

Isolation allow-list (spy test, fail on any call):

`applyRewards` · `saveBattleStats` · `upgradeSpell` · `claimAchievementReward` · `processPendingPurchases` · `redeemGameKey` · persist-lock `commit` · `pbv_*` / inventory writes · `ensureLocalStorage` · **`markAchievementUnlocked` / recap unlock attach** · **one-shot Doka `claim` / `settleOneShotAfterCredit`** · `completeBossRushRoom` / `setBossRushProgress` / `resetBossRush`

Do not import:

- `utils/longHorizonSim.ts` (LHIPS CLI; now samples 10k/50k and `dungeonMultiplierAtDepth5`)
- `engine/mapGen.simulate.ts` (solvability replica of **live** generateEnemies)
- `shopPurchase.ts` credit helpers
- WX `generateEnemies`

Hypothetical level remains unbounded. Presets: 1 / 10 / 100 / 1_000 / 10_000 / 50_000. Reports (08-31-003 plus): relative-level histogram, below/equal/above, families, variants, elites, AI, rare spells, discovery opportunities, formations, estimated difficulty, `skippedForBudget`, theoretical vs payable, `destackRelocations`, **`catalogWave` mix including wave 3**, **`summonerRate`** (must not be 100% at level 44+ unless the draft says so).

---

## 10. Owner console IA (unchanged, still missing)

Carved-stone, dark slate, crimson (`#13161f`, `#d8463f`, `#f0c44a`).

```
CONTENT
  Encounters     pools · formations · rarity · objectives · rewards · hazards · rules
  Dungeons       rooms · sequence · special · rest · branch · bosses · modifiers · rewards
  Boss Rush      pool · scale · progression · multipliers · sequence
  World Events   eligibility (incl. rest / deathRealm) · rarity · hazards · elites · grants · hooks · catalogWave
  Spawn          relative level · equal · above · elite · variant · size · family · spells · AI
                 (wraps spawnPolicy.ts defaults; never a required levelMax)
  Simulation     hypothetical level (unbounded) · N · seed · reports · payable vs theoretical
LIFECYCLE
  Drafts         diff vs active · simulate · validate · activate
LEGACY (label unused knobs until migrate)
  Enemies / Regions / Tiers / Modifiers / Bosses / Names
```

### Validate gates (08-31 §6 + 09-01 + 09-02 + this run)

25. Owner spawn knobs wrap `spawnPolicy.ts` defaults. Activating an unbounded dungeon curve rewrites `dungeonSpawnExtras(99) === extras(5)` rather than leaving a second table.
26. `pickWeightedFeatures` (once activated) honors owner `enabledWaves` including **3**; sim reports wave 1/2/3 mix. Dual-roll with the 22 live modifiers is a VALIDATE fail.
27. `grantClass` includes `loanOneCast` (Loaner Mage) distinct from Grimoire `oneCast`. Zero `upgradeSpell` from events.
28. Formations / WF extras call `occupancy.isCellFree` + `findBattleStartCell`; destack stays on the origin fight graph. Sim reports `destackRelocations`.
29. Lab spy includes `redeemGameKey`, one-shot Doka claim/settle, achievement unlock, and Boss Rush persist writers. Bundle does not import `longHorizonSim.ts` or `mapGen.simulate.ts`.
30. Dungeon Doka editor and dungeon extras editor read the **same** pack curve (or two named curves on one pack). Depth 6+ is not clamped to the depth-5 cell.
31. Tiers preview accepts hypothetical 50_000. LHIPS 10k/50k samples do not count as this gate.
32. No CatalogNote that claims a field is consumed when the only binding is an unused `_` state (Boss Rush `rewardMultiplier` still fails this).
33. Eligibility has no required `levelMax` reject (9999 is still a reject).

---

## 11. What this program must not do

- Do not implement the pack, the lab, or the tabs in this run.
- Do not edit `WorldExploration.tsx` to overlay wave 3.
- Do not edit RAF, `mapGen.ts`, turn order, or `calcScaledDamage`.
- Do not add `levelMax` “for safety” or raise 9999 / 99 / 999 as a substitute for relative eligibility.
- Do not promote `longHorizonSim` or `mapGen.simulate.ts` to Admin.
- Do not open a second reward or spell-level writer (including GameKey, one-shot Doka, or feat unlocks from the lab).
- Do not re-issue prior WDEAD / WDD / EBA / EED / FSN / AFDA / LHIPS IDs.
- Do not retune `100 * 2^(N-1)` (`LHIPS-001`).
- Do not disable destack or occupancy to preserve formation art.
- Do not treat `spawnPolicy.ts` constants as already-owner-configurable.

Extract path for implementers: wrap `engine/spawnPolicy.ts` (live defaults), add `engine/encounterFormations.ts`, `engine/encounterSim.ts`, `engine/dungeonPolicy.ts`. Occupancy stays `engine/occupancy.ts` + `engine/battleStartPlacement.ts`. World-event weights stay data loaded from the **active** pack (`worldFeatures.ts` is the WDD catalog, not a second hardcoded array after activate).

---

## 12. ACTION_ID index (this run only)

| ID | Title | Priority |
| :--- | :--- | :--- |
| WDEAD-2026-09-21-001 | Owner `enabledWaves` includes wave 3; one roll budget — do not ship WDD dual-roll as admin policy | P0 |
| WDEAD-2026-09-21-002 | Wrap live `spawnPolicy.ts` as draft defaults — tests currently lock the depth-5 / 30% / 1–8 ceilings | P0 |
| WDEAD-2026-09-21-003 | Expand `grantClass` with `loanOneCast`; Short Fuse / Harvest Moon / Isolation Chill / Stillness Oath only via registry hooks | P1 |
| WDEAD-2026-09-21-004 | Formations and WF extras must compose with `occupancy.ts` + fight-graph destack | P1 |
| WDEAD-2026-09-21-005 | Simulation isolation: do not import LHIPS or `mapGen.simulate`; spy feats, one-shot Doka, GameKey, Rush persist | P1 |
| WDEAD-2026-09-21-006 | One owner dungeon curve for extras **and** Doka — two depth-5 freezes cannot diverge | P1 |
| WDEAD-2026-09-21-007 | LHIPS 10k/50k samples do not close the owner lab overflow contract | P1 |

Full records: [`ACTION_IDS_WDEAD_2026-09-21.md`](./ACTION_IDS_WDEAD_2026-09-21.md).
