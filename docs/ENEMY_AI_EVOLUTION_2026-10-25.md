# Advanced Enemy AI Evolution — 2026-10-25 increment

**Status:** PROPOSED (design only; no production code in this change)  
**Date:** 2026-10-25  
**Parent catalog:** [`ENEMY_AI_EVOLUTION.md`](./ENEMY_AI_EVOLUTION.md) (T0–T5)  
**Prior increments:** [`ENEMY_AI_EVOLUTION_2026-09-01.md`](./ENEMY_AI_EVOLUTION_2026-09-01.md) · [`ENEMY_AI_EVOLUTION_2026-09-02.md`](./ENEMY_AI_EVOLUTION_2026-09-02.md) · [`ENEMY_AI_EVOLUTION_2026-09-21.md`](./ENEMY_AI_EVOLUTION_2026-09-21.md) (open PR #351; SYS-22…32, FUT-36…47 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-22.md`](./ENEMY_AI_EVOLUTION_2026-09-22.md) (open PR #416; SYS-33…35, FUT-48…53 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-23.md`](./ENEMY_AI_EVOLUTION_2026-09-23.md) (open PR #458; SYS-36…41, FUT-54…59 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-24.md`](./ENEMY_AI_EVOLUTION_2026-09-24.md) (open PR #506; SYS-42…47, FUT-60…65 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-25.md`](./ENEMY_AI_EVOLUTION_2026-09-25.md) (open PR #565; SYS-48…53, FUT-66…71 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-26.md`](./ENEMY_AI_EVOLUTION_2026-09-26.md) (open PR #633; SYS-54…59, FUT-72…77 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-27.md`](./ENEMY_AI_EVOLUTION_2026-09-27.md) (open PR #689; SYS-60…65, FUT-78…83 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-28.md`](./ENEMY_AI_EVOLUTION_2026-09-28.md) (open PR #723; SYS-66…71, FUT-84…89 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-29.md`](./ENEMY_AI_EVOLUTION_2026-09-29.md) (open PR #804; SYS-72…77, FUT-90…95 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-10-21.md`](./ENEMY_AI_EVOLUTION_2026-10-21.md) (open PR #821; SYS-78…83, FUT-96…101 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-10-22.md`](./ENEMY_AI_EVOLUTION_2026-10-22.md) (open PR #874; SYS-84…89, FUT-102…107 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-10-23.md`](./ENEMY_AI_EVOLUTION_2026-10-23.md) (open PR #958; SYS-90…95, FUT-108…113 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-10-24.md`](./ENEMY_AI_EVOLUTION_2026-10-24.md) (open PR #999; SYS-96…101, FUT-114…119 — **do not re-number**)  
**Implementer ledger:** [`automation/ACTION_IDS_AEE_2026-10-25.md`](./automation/ACTION_IDS_AEE_2026-10-25.md)

This increment re-reads the live engine one day after the 2026-10-24 catalog (#999). SYS-01…101 and FUT-01…119 stay **PROPOSED** on their own files; they are **not** re-filed here. New work is: `inferArchetype` heal-first (SYS-04) plus Blood Mend `range: 0` (SYS-91) make `decideHealer` **approach-ally** (1114–1132) or **backline-guard** (1134–1164) *before* the `decideCaster` fallback (1165–1168), so a queen’s in-range Frost / Inferno never fires; `allies` exclude self (1674–1676) so a wounded queen never Blood-Mends the only legal dest; bomber “detonate” still scores a **private** Chebyshev-2 cluster (`AI_KAMIKAZE_BLAST_RADIUS`) against Inferno’s `areaRadius: 0`, and the paid executor’s `hp = 0` sits inside `damage > 0` so Inferno never kills the bomber.

Stralt has **no character level cap**. Nothing here maps `if (level >= X) sophistication = Y`. Tiers remain conceptual. Eligibility remains the parent §4 sigmoid (`peer = log2(enemy.level / player.level)` plus pack/boss/modifier terms). A year-later peer fight at any absolute level can attach a new module without raising a cap. A dual-kit queen that walks toward an unhealable ally while Frost is legal, and a bomber that logs a blast the card does not have, are **honesty**, not a last band.

**Hard rules (unchanged):** no cheat, no hidden player information, no ignored LoS/range/AP/MP, no unbounded search, no kit-less Fire Bolt, no `instantKill`, no betrayal-as-difficulty, no name-based spell heuristics, no production AI in this change. Do not “fix” approach-ally by skipping LoS or AP (open #1026’s sidecar currently documents that live WX skips both — that is a leftover detector, not the long-term module). Do not “fix” Inferno by giving it radius-2 splash. Do not copy Motoko `thunder_clap` / `void_collapse` into bomber kits.

Open production PRs that already slice honesty (do **not** re-file the ids, do **not** copy the patches into this docs PR):

| Open PR | Catalog id | What it changes |
| :--- | :--- | :--- |
| [#495](https://github.com/Mr-Melic/stralt/pull/495) (draft) | AI-SYS-34 | Apply `targetCell` from `playerPositionRef`. Live apply still uses render `playerPosition` (WX **16436–16438**). |
| [#498](https://github.com/Mr-Melic/stralt/pull/498) (draft) | AI-SYS-45 | Boss kit-spell apply must not commit `targetX/Y` as a walk dest. |
| [#487](https://github.com/Mr-Melic/stralt/pull/487) (draft) | (not a tactic) | Betrayal kills enter the death pipeline. Spectacle remains forbidden as sophistication. |
| [#644](https://github.com/Mr-Melic/stralt/pull/644) (draft) | (player drain) | Catalog `spellType` drain as player lifesteal. Not pack SYS-38. |
| [#647](https://github.com/Mr-Melic/stralt/pull/647) (draft) | (Soul Rend apply) | Do not emit Soul Rend in kits until apply lands real damage. |
| [#649](https://github.com/Mr-Melic/stralt/pull/649) (draft) | (Trap tiles) | Ground trap legality is player-side until a profile + SYS-13 exist. |
| [#654](https://github.com/Mr-Melic/stralt/pull/654) (draft) | (void holes) | Occupancy already refuses `voidTiles` in `isCellFree`. |
| [#658](https://github.com/Mr-Melic/stralt/pull/658) (draft) | (RES/SP shreds) | Scoring may read `getStatModifier` after it ships; do not change `calcScaledDamage`. |
| [#659](https://github.com/Mr-Melic/stralt/pull/659) (draft) | (Shield RES melee) | Distinct from SYS-63 / SYS-66 / SYS-68. |
| [#700](https://github.com/Mr-Melic/stralt/pull/700) (draft) | (player auto-summon kit) | Player-side. Not pack decide. |
| [#709](https://github.com/Mr-Melic/stralt/pull/709) (draft) | (Sentinel Shield on ally) | Player click-heal. Not pack healer apply (SYS-05). |
| [#821](https://github.com/Mr-Melic/stralt/pull/821) (draft) | SYS-78…83 / FUT-96…101 | 2026-10-21 design increment. Unique files only. |
| [#842](https://github.com/Mr-Melic/stralt/pull/842) (draft) | AI-SYS-88 (spawn stamp) / SYS-55 (routing) | Hostile minion `summonKit` + `decideSummonAction`. **Do not re-implement.** |
| [#861](https://github.com/Mr-Melic/stralt/pull/861) (draft) | (player auto-summon empty kit) | Player-side catalog resolve. Not pack SYS-90. |
| [#874](https://github.com/Mr-Melic/stralt/pull/874) (draft) | SYS-84…89 / FUT-102…107 | 2026-10-22 design increment. Unique files only. |
| [#911](https://github.com/Mr-Melic/stralt/pull/911) (draft) | AI-SYS-90 (kit resolve) | Pack kits when Motoko catalog misses starter ids. **Do not re-implement.** |
| [#924](https://github.com/Mr-Melic/stralt/pull/924) (draft) | AI-SYS-95 (heal `buffStat`) | Share WX enemy heal execute with advertised CHC. **Do not re-implement.** Sidecar only. |
| [#947](https://github.com/Mr-Melic/stralt/pull/947) (draft) | (DoT execute ticks) | WX enemy DoT execute advertised ticks. Complements SYS-96; **do not copy.** |
| [#967](https://github.com/Mr-Melic/stralt/pull/967) (draft) | (pack DoT decide) | Share pack-enemy DoT decide with `pickBestDamageSpell`. Not this file’s SYS-103 (healer *approach* leftover). |
| [#972](https://github.com/Mr-Melic/stralt/pull/972) (draft) | (Inferno CD) | Arm pack-enemy Inferno cooldown outside `damage > 0`. Complements SYS-96. |
| [#974](https://github.com/Mr-Melic/stralt/pull/974) (draft) | (buff execute) | Share pack-enemy buff execute with advertised `buffStat`. Not SYS-98. |
| [#978](https://github.com/Mr-Melic/stralt/pull/978) (draft) | (buff decide) | Share pack-enemy buff decide with `pickBestDamageSpell`. Iron Skin leftover — do not steal as Frost/Inferno. |
| [#985](https://github.com/Mr-Melic/stralt/pull/985) (draft) | AI-SYS-107 (self-heal list) | Share pack-enemy heal decide with `decideHealer` when **no** wounded ally exists. **Do not re-implement.** |
| [#989](https://github.com/Mr-Melic/stralt/pull/989) (draft) | (empty-damage heal picker) | Share pack-enemy heal decide with `pickBestDamageSpell` once `decideCaster` is reached. Not SYS-102 (approach never reaches that picker). |
| [#999](https://github.com/Mr-Melic/stralt/pull/999) (draft) | SYS-96…101 / FUT-114…119 | Yesterday’s design increment. Unique files only. |
| [#1026](https://github.com/Mr-Melic/stralt/pull/1026) (draft) | AI-SYS-102 | Pack-enemy healer **approach** vs advertised Frost. Sidecar only — **do not copy / do not restack `enemyAI.ts`.** |
| [#1033](https://github.com/Mr-Melic/stralt/pull/1033) (draft) | AI-SYS-103 | Pack-enemy healer **approach** vs Inferno leftover. Sidecar only. |
| [#1034](https://github.com/Mr-Melic/stralt/pull/1034) (draft) | AI-SYS-104 | Pack-enemy healer **backline-guard** vs Frost leftover. Sidecar only. |
| [#1039](https://github.com/Mr-Melic/stralt/pull/1039) (draft) | AI-SYS-105 | Pack-enemy healer **backline-guard** vs Inferno leftover. Sidecar only. |

This docs PR does **not** edit [`ENEMY_AI_EVOLUTION.md`](./ENEMY_AI_EVOLUTION.md) (open PR #351 unions that header). Unique files only.

---

## 1. Re-read (2026-10-25) — what moved

All line numbers are from this checkout. Re-read them before implementing.

### 1.1 Combat-parity still is not sophistication

Unchanged from 2026-09-21…10-24: `enemyCastGeometryOk` (`targeting.ts` 166–177), `aiCanCast` (`enemyAI.ts` 320–332), Frozen walk *rate* (`enemyWalkMp.ts` 21–29), `playerCastPlan.ts` (player only), summon leftover-AP `reevaluate` (`summonExecutor.ts` 249–254). These are **not** SYS-05 / SYS-13 / SYS-01. Do not re-file `reevaluate`.

`aiCanCast` is still unused by healer (1099–1100) and guardian (2131–2133). That remains **AI-SYS-23** on the 09-21 increment. Caster in-range uses it (953); lookahead/spill after that line does **not** (SYS-85 / #874). Healer *approach* and *backline-guard* also skip it — they never reach a nuke, so SYS-102…105 must restore `aiCanCast` when they emit Frost, not copy #1026’s “no LoS” detector.

`enemyAI.ts` still has **zero** reads of `currentAp`, `currentMp`, or `apCost`. Pack walk budget is still `ENEMY_REACHABLE_STEP_BUDGET = 3` (`gameConstants.ts` 166; `computeReachable` 377–378). `getEffectiveStat` is declared on `DecideEnemyContext` and **never read** by `estimateDamage` / `scoreTargets` / any `decide*`.

Do **not** feed `spellRangeBase` into AI (`targeting.ts` 191–209 / `groundTileInRange`). Player upgrade `maxRange` is not an enemy kit field. Do **not** treat `enemyCastGeometryOk` as SYS-13 complete. `enemyCastRangeOk` (`targeting.ts` 158–164) is the Chebyshev half healer / guardian / bomber still use without LoS — SYS-23.

`starter-frost` live range is **`BigInt(4)`**, `damage: BigInt(20)`, `debuffStat: "mp"` (`spellData.ts` **124–140**). `starter-heal` / Blood Mend is **`targetType: "self"`**, **`range: BigInt(0)`**, heal 12 + CHC (`spellData.ts` **85–101**). `spell-inferno` range is **3**, **`damage: BigInt(0)`**, `areaRadius: 0`, `dotDamagePerTurn: 8` (`spellData.ts` **502–522**). `spell-rallying-cry` is **`targetType: "self"`**, range 0, **`usableByEnemy: false`** (`spellData.ts` **417–435**). Queen `buildEnemyKit` z≥1 is Frost + Blood Mend; z≥2 is Inferno + Blood Mend (`enemyAI.ts` **176–179**). King z≥1 is Frost + Rallying Cry (**181–184**).

### 1.2 Line numbers vs 2026-10-24 (P0 sites did not move)

| Fact | 2026-10-24 | Live (2026-10-25) |
| :--- | :--- | :--- |
| `computeAITier` | `combatMath.ts` 36–52 | **unchanged** |
| `pickEnemyLevelFromTiers` `maxTier = floor(999 / ts)` | `combatMath.ts` 54–58 | **unchanged** (SYS-73) |
| `calcScaledDamage` ignores caster level | `combatMath.ts` 130–137 | **unchanged** (SYS-72) |
| Spawn `aiTier` | WX 5823 | **5823** |
| Family second `computeAITier` | WX 5865 | **5865** |
| Kit `levelZone` object | WX 11920 | **11920** — resolve still `normalizedSpellPool.find` (**11921–11923**) (SYS-90 / #911) |
| Stale comment “10 random spells” | WX 11915 | **11915** |
| Summoner chance unbounded | WX 11932–11943 | **11932–11943** (FUT-23; skip-brain is SYS-89) |
| `isSummoner` short-circuit | WX 16375–16384 | **16375–16384** (SYS-86 / SYS-89) |
| Player-summon empty occupied | WX 15156 | **15156** (SYS-14) |
| Pack player `maxHp` leftover | WX 16300 | **16300** (`maxHp ?? hp`; SYS-76 / SYS-78 / SYS-84) |
| `aiTier >= 5` erratic | WX 15507–15591 | **unchanged** |
| `aiTier >= 10` betrayal | WX 15594–15600 | **unchanged** |
| Dest-commit clamp | WX 16416–16423 | **16416–16423** (SYS-58) |
| Apply `targetCell` render `playerPosition` | WX 16436–16438 | **16436–16438** (SYS-34 / #495) |
| Apply Chebyshev only | WX 16450–16456 | **16450–16456** |
| Damage/drain gate `spellDmg > 0` | WX 16459–16462 wraps DoT **16610–16625** | **unchanged** (SYS-96) |
| No-damage `debuffStat` writer | WX 16671–16700 | **unchanged** (Slow can land; poison cannot) |
| Self-heal `range === 0` | WX 16648–16670 | **unchanged** — HP only, no `buffStat` (SYS-95 / #924) |
| Fire Bolt `e-firebolt` | WX 16712 | **16712** |
| `decideEnemyAction` | 1662–1707 | **1662–1707** |
| `allies` exclude self | 1674–1676 | **1674–1676** (this file’s SYS-107) |
| `decideHealer` approach-ally | (fallback cited, not the block) | **1114–1132** (SYS-102 / SYS-103) |
| `decideHealer` backline-guard | SYS-100 = `opponents[0]` at **1143** | **1134–1164** still *before* `decideCaster` (SYS-104 / SYS-105) |
| `decideHealer` → `decideCaster` | 1165–1168 | **1165–1168** — idle artillery path; approach/guard preempt it |
| `stepToward` Set-order fallback | 604–609 | **604–609** (SYS-97) |
| Guardian Iron Skin before approach | 2148–2166 | **2148–2166** (SYS-98) |
| Wisp Rallying Cry on ward | 2521–2543 | **2521–2543** (SYS-99) |
| `inferArchetype` heal-first then range>1 | 447–461 | **447–461** (SYS-04 / SYS-101) |
| Bomber `AI_KAMIKAZE_BLAST_RADIUS` | 2387–2393 | **2387–2393** (this file’s SYS-106; 10-24 deferred it from SYS-96) |
| Executor bomber `hp = 0` inside `damage > 0` | `summonExecutor.ts` 164–180 | **164–180** (SYS-106) |
| `pickBossKitSpell` `new Map()` | `useBossAI.ts` 169–173 | **169–173** |
| `ENEMY_AI_TIER_GATES` | unread | still unread (`enemyAI.ts` comment only at **1422–1423**) |
| Hostile `summonAI = pieceType` | `summonSpawn.ts` 275 | **275** (SYS-88 / #842) |

P0 remains **AEE-2026-08-31-002** (Fire Bolt / apply honesty) then **AEE-2026-08-31-001** (`computeAITier`). Then 09-21…10-24 honesty. Then this file’s SYS-102…107. Do not start FUT-120+ first. Queen approach-ally currently *only* Fire-Bolts if dest-commit lands Chebyshev 1 (WX **16703–16715**) — SYS-102 is on the P0 Fire-Bolt path, not a T6 extra.

### 1.3 Still true — do not re-file (parent / 09-21…10-24)

- Zone-0 kits forever (`Math.floor(levelZone)` on an object). SYS-09. SYS-90 is the **id resolve** after that floor, not the NaN.
- `scoreTargets` ignores `focusTargetId`. SYS-08 / AI-SYS-30.
- `estimateDamage` returns 0 when `spell.damage <= 0`. SYS-02 / SYS-39. SYS-96 is the **apply nest**. SYS-103 is that healer *approach* never even asks the scorer to look at Inferno.
- Heal-first `inferArchetype` (447–452). SYS-04 / SYS-41. SYS-101 is the **next** branch (range>1 buff/DoT → caster). This file does not delete heal-first; it stops the healer branch from swallowing the dual-kit nuke.
- Pack healer idle ward `allies.find(!isSummon)` (1142). **FUT-83** (09-27). Do not re-file. SYS-100 is the *threat* next to that ward. SYS-104/105 is that the guard *branch* preempts `decideCaster`.
- Hazard avoid only below 50% HP; ice/lava/spikes only (425–441). POS-04 / FUT-09 / FUT-59 / FUT-93. SYS-92 is that **approach never calls the filter**. SYS-97 is the *fallback* walk direction.
- Retreat / `reposition-los` `kind: "skip"` while dest-commit still moves. POS-02 / FUT-41 / SYS-58.
- Summoner chance hits 1.0 at player level 44. FUT-23. Skip-brain is SYS-89.
- `ENEMY_AI_TIER_GATES` unread. SYS-01.
- Summon executor Chebyshev teleport MP. SYS-15 / 09-21 SYS-25.
- Family overlay second `computeAITier`. AI-SYS-29.
- `findKitSpell` assigned fallback (1737–1745). AI-SYS-32.
- Strip / `resolveEnemyApMp` uses `enemy.level` for AP/MP. SYS-54.
- Hostile summons skip the paid executor. SYS-55. **#842 routes decide; it still does not send hostiles through `executeSummonAction`.** Pack hunter/archer/bomber therefore hit WX apply (SYS-96 / SYS-106), not `applyEffect`.
- Boss occupancy list empty. SYS-56.
- Erratic dest ignores portal/void/barrier. SYS-57.
- Dest-commit clamp-only. SYS-58.
- Pack/summon Plague+Void store ticks. SYS-60. Do not implement SYS-59’s “pack immunity.”
- Pack→player skips `applyDamageDealt`. SYS-61.
- Pack dest-commit vs reserved. SYS-62.
- Shield Charm remaining is public. SYS-63 snapshot; spell-path soak is SYS-66.
- Enumerator `applyApCost`. SYS-64.
- Null Field vs non-DoT. SYS-65.
- Double RES on pack→player spells. SYS-66.
- `enemyTakesDamage` returns pre-mod `dmg`. SYS-67.
- Pack melee private write. SYS-68.
- Hidden crit *roll*. FUT-57. Apply CHC source vs strip is SYS-82.
- Paper Windstorm 30% player / 50% pack. SYS-70. FUT-21 / FUT-88. Kit-less Fire Bolt is range 3 so Windstorm can “miss” a cheat.
- Fury / Blood Moon / Titan's path-specific. SYS-71 / FUT-89.
- Kit frost ignores `enemy.level`; Fire Bolt uses `level/5`. SYS-72 / FUT-91.
- Spawn `maxTier` from 999. SYS-73 / FUT-92.
- Mirror reflect fourth HP pipeline. SYS-74.
- Windstorm miss writes CD + `didAct`. SYS-75 / FUT-94.
- Pack snapshot leftover `maxHp`. SYS-76 / FUT-95. Summon/pack fork is SYS-78. Scorer still ignores maxHp (SYS-84).
- Adaptive Resistance private ref. SYS-77 / FUT-90.
- `pickBestDamageSpell` origin-range. SYS-79 / FUT-96.
- Pack `scoreTargets(..., null)` Crush ranking. SYS-80 / FUT-97.
- Overkill spill Crush stamp. SYS-81 / FUT-98. Geometry of retarget is SYS-85.
- `allyCount` / `enemyCount` include player summons. SYS-83.
- `wLowHp` `effectiveHp ?? hp`. SYS-84 / FUT-102.
- Lookahead/spill skip `aiCanCast`. SYS-85 / FUT-103.
- Summoner midpoint teleport. SYS-86 / FUT-104.
- `stepFlank` tackle = all adjacent. SYS-87 / FUT-105.
- Hostile `summonAI = pieceType`. SYS-88 / #842.
- `isSummoner` skip eats the piece kit. SYS-89.
- Pack kit ids miss Motoko `defaultSpells`. SYS-90 / #911.
- Blood Mend is self range 0; healer decide targets other allies. SYS-91. SYS-102 is that this also **blocks Frost**. SYS-107 is that **self is not in `allies`**.
- `stepToward` / flank / legal-cast dests skip `filterHazardCandidates`. SYS-92.
- Caster *retreat* uses `opponents[0]`. SYS-93. SYS-100 is interpose.
- Archer `MIN_KITE_RANGE = 3` vs poison range 4. SYS-94.
- Range-0 heal drops advertised CHC. SYS-95 / #924.
- Pack apply DoT nested under `damage > 0`. SYS-96. SYS-103/105/106 need that write *and* a legal decide.
- `stepToward` Set-order fallback walks away. SYS-97.
- Guardian Iron Skin preempts Shield-on-ward approach. SYS-98.
- Wisp Rallying Cry is self range 0 aimed at a ward. SYS-99.
- Healer/guardian/wisp interpose uses `opponents[0]`. SYS-100. SYS-104 is the *branch order* (guard vs nuke), not the threat picker.
- `inferArchetype` counts range>1 buffs/DoTs as ranged attacks. SYS-101. Queen is healer from Blood Mend (SYS-04), not from this branch.
- Pack healer `pickBestAlly` still `allies.find(!isSummon)` at **1142**. **FUT-83** — do not re-file.
- `hasBresenhamLoS` still ignores combatant bodies. Do not propose an AI-only body-block LoS module.
- `engine/summonAI.ts` `runSummonAI` remains unused.
- Diagonal `stepToward` candidate (`enemyAI.ts` **595–596**) still must be in `reachable` (SYS-15).

### 1.4 New honesty gaps (this increment)

1. **Heal-first queens walk toward an unhealable ally while Frost is legal.** `inferArchetype` returns `"healer"` on any `healAmount > 0` id (SYS-04, **447–452**). Queen z≥1 kit is `[starter-frost, starter-heal]` (**176–179**). `decideHealer` picks the most-wounded *other* ally below `ENEMY_HEAL_ALLY_THRESHOLD_PCT` (0.5) (**1092–1097**), then heals only if Chebyshev ≤ `enemySpellRange` (**1099–1100**). Blood Mend is `range: 0` / `targetType: "self"` (`spellData.ts` **85–101**), so a distinct ally is always out of range. The next block (**1114–1132**) returns `kind: "move"` / `intent: "approach-ally"` **unconditionally** (even when `stepToward` dest === origin) and never reaches `decideCaster` (**1165–1168**). Frost at Chebyshev ≤ 4 with `damage: 20` would win `pickBestDamageSpell`. Live therefore walks (SYS-97 / SYS-92) and, if dest-commit is Chebyshev 1, Fire-Bolts (SYS-05 / WX **16712**). SYS-91 is the in-range heal targeting others. This id is the **out-of-range approach that swallows the nuke**. Open #1026 is the leftover detector (currently no LoS / no AP) — **do not copy it**; restack `decideHealer` onto it after older PRs and require `aiCanCast` + SYS-05 debit. SYS-102.

2. **Same approach swallows queen z≥2 Inferno, which `pickBestDamageSpell` cannot see anyway.** Queen z≥2 kit is `[spell-inferno, starter-heal]`. Inferno is `damage: 0` / `isDotSpell` / `areaRadius: 0` (`spellData.ts` **502–522**). Even if approach were deleted, `decideCaster` → `pickBestDamageSpell` (**561–568**) drops it (SYS-02 / SYS-39), then `closes-in` and adjacent Fire-Bolts (SYS-96). Open #1033 owns this leftover vs #1026’s Frost (Frost *would* score). Do not invent radius-2 splash. Do not steal #967’s pack DoT *decide* for hunter/archer. SYS-103.

3. **Idle backline-guard runs before `decideCaster`, so a healthy pack still does not Frost.** When no wounded ally / no healSpell, `decideHealer` tries `backlineGuardCell` (**1134–1164**) using `allies.find(!isSummon)` (FUT-83) and `opponents[0]` (SYS-100). A legal guard dest returns `kind: "move"` / `intent: "backline-guard"` and **skips** the fallback. King z≥1 often has Rallying Cry filtered from `availableSpells` (`usableByEnemy: false`, SYS-41) so `healSpell` is missing; assigned Rally still flips healer (SYS-04); they idle-guard instead of Frost. Open #1034. SYS-104.

4. **Idle backline-guard vs Inferno is the damage-0 twin.** Same branch order; nuke is Inferno. Guard dest + `spell: null` → dest-commit → Fire Bolt if adjacent (SYS-05 / SYS-96). Open #1039. Complements SYS-103 (approach) and SYS-104 (Frost guard). SYS-105.

5. **Bomber detonate is a private blast the card does not have, and the bomber does not die.** `decideSummonBomber` scores clusters with `AI_KAMIKAZE_BLAST_RADIUS = 2` because Inferno’s `areaRadius` is 0 (**2387–2393**, `gameConstants.ts` **285**), then emits `spell-inferno` at a single `targetId` (**2410–2425**). Pack apply writes at most a single-target DoT *if* SYS-96 lifts the `damage > 0` nest; it never splashes and never sets bomber HP to 0. Paid `executeSummonAction` sets `hp = 0` only inside `damage > 0` (`summonExecutor.ts` **164–180**) — Inferno misses that arm, falls through to `applyEffect` type `"dot"` (**191–208**), bomber lives. 10-24 SYS-96 explicitly deferred splash / self-kill. This id is that deferred honesty. Do not copy Motoko `thunder_clap`. SYS-106.

6. **`allies` exclude self, so Blood Mend never sees the only legal dest.** `decideEnemyAction` builds `allies` as `side === "enemy" && id !== enemy.id` (**1674–1676**). `decideHealer` wounded list is those allies (**1092–1094**). The queen’s own HP never qualifies. When **no** other ally is below 50%, live skips the heal branch and goes guard / `decideCaster` — still no self-cast. When another ally **is** below 50%, SYS-102 walks toward them. SYS-91 is targeting others *when a heal is emitted*. Open #985 is the sidecar for the **no-wounded-ally** self-heal leftover. This id is the list construction. SYS-107.

### 1.5 Tests

`enemyAI.charger.test.ts`, `enemyAI.geometry.test.ts`, `enemyAI.walkMp.test.ts` exist. Honesty for healer approach vs Frost/Inferno, backline-guard vs Frost/Inferno, bomber fake radius / no self-kill, and self-not-in-allies still has no decide/apply-layer tests on **this** branch. Open #1026 / #1033 / #1034 / #1039 / #985 add sidecars on **their** branches — do not duplicate here. Do not treat geometry/walkMp as SYS-102…107.

### 1.6 What this increment does **not** change

Do not implement FUT-120+ before P0 honesty + 09-21…10-24 SYS slices. Do not touch RAF, map generation, turn order, or damage formulas (`calcScaledDamage` stays a **read** for scoring; do not add `enemy.level` into it as a stealth stat stick). Do not copy #495 / #498 / #644…#659 / #700 / #709 / **#842** / **#861** / **#911** / **#924** / **#947** / **#967** / **#972** / **#974** / **#978** / **#985** / **#989** / **#999** / **#1026** / **#1033** / **#1034** / **#1039** into this docs-only change. Do not edit the parent catalog. Do not “fix late game” by keeping Fire Bolt, by giving bombers hidden splash, or by making Blood Mend ignore `targetType` / `range`. Do not re-file FUT-83, SYS-04, SYS-39, SYS-91, SYS-93, SYS-96, SYS-100, or SYS-101. Do not turn FUT-23’s chance table into `if (player.level >= 44) isSummoner = true`. Do not bless #1026’s “no LoS / no AP” as the shipped decide.

---

## 2. Design additions (normative)

1. **Do not recycle 09-21…10-24 ids.** This file starts at SYS-102 / FUT-120.
2. **Dual-kit heal-first must not delete the nuke.** If a profiled heal cannot legally hit its dest this turn (SYS-13 `targetType` + range + LoS + AP), the enumerator continues to a profiled damage/DoT id. Walking toward an unhealable dest is illegal for Blood Mend-on-ally. SYS-102 / SYS-103.
3. **Idle guard is not higher priority than a legal nuke.** Backline-guard (POS-07 / SYS-100) scores *after* a legal Frost/Inferno, or as a dest among the same enumerator — it does not `return` first. SYS-104 / SYS-105.
4. **Kamikaze is a profile, not a constant.** Blast radius, self-destruct, and min-targets come from the spell / a tagged `BossAbility`-style bomber ability. Inferno stays single-target DoT until a different id is authored. SYS-106.
5. **Self is a legal heal dest.** Range-0 `targetType: "self"` enumerates the caster tile (SYS-91 / SYS-99 / FUT-117). The wounded list must include the acting combatant. SYS-107.
6. **Sidecar leftovers are detectors, not policy.** Follow/merge #1026 / #1033 / #1034 / #1039 / #985. When restacking `decideHealer`, require `aiCanCast` (pack LoS `!== false`) and SYS-05 AP/MP. Do not ship “no LoS / no AP” Frost as sophistication.
7. **T6+ still stacks** on the parent enumerator. No integer tier table. No `if (aiTier >= 8)`. No `if (level >= X)`.

---

## 3. System proposals (2026-10-25)

### AI-SYS-102

**AI_ID:** AI-SYS-102  
**NAME:** Pack healer approach-ally must not swallow in-range Frost  
**ROLE:** system  
**SOPHISTICATION:** T1+ / honesty for SYS-04 / SYS-05 / SYS-91 / ROL-04 / ROL-08  
**DECISION_RULES:** `decideHealer` (**1114–1132**) returns `kind: "move"` / `intent: "approach-ally"` whenever a wounded *other* ally exists and Chebyshev > `enemySpellRange(healSpell)`. Blood Mend range is 0 (`spellData.ts` **85–101**), so that is every distinct ally. Queen z≥1 still holds `starter-frost` (`damage: 20`, range 4, `debuffStat: "mp"`, `spellData.ts` **124–140**). `decideCaster` is never reached. After this module: (1) a self/ally heal is emitted only if SYS-13 would accept dest + `targetType` (Blood Mend → caster tile only — SYS-91 / SYS-107); (2) if that heal is illegal this turn, enumerate a profiled `damage > 0` nuke with `aiCanCast` (range + LoS) and SYS-05 AP/MP — Frost is legal at Chebyshev ≤ 4 with LoS; (3) walk toward an ally **only** if a profiled heal will be legal after ≤ `ENEMY_REACHABLE_STEP_BUDGET` steps (Blood Mend-on-ally never will — do not walk); (4) failed / skipped cast must not Fire-Bolt (SYS-05). Open #1026 detects this leftover and currently skips LoS/AP to match live WX — **do not copy that policy**. Do not steal Inferno (#1033 / SYS-103), Iron Skin (#978), Slow, Drain, or in-range Blood Mend (#989 / SYS-91).  
**SCORING_MODEL:** Illegal heal dest ⇒ −∞ (dropped). Legal Frost EV = SYS-02 `estimateDamage` (20, not `level/5` bolt). Approach EV for an unhealable dest = −∞.  
**SPELL_REQUIREMENTS:** `starter-heal` profile: self, range 0. `starter-frost` profile: enemy, damage>0, range 4, MP debuff. Both already `usableByEnemy !== false`.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always (honesty). A remnant queen at any absolute level must not walk past a legal Frost. Not `if (aiTier >= 3) frost`.  
**ENEMY_ARCHETYPES:** healer dual-kit (queen z≥1); any pack piece SYS-04 routed to healer that still holds a damage>0 nuke.  
**PLAYER_COUNTERPLAY:** Break LoS; stand outside Frost range 4; cleanse MP. No surprise Fire Bolt from a “heal approach.”  
**EDGE_CASES:** `stepToward` dest === origin still returns `kind: "move"` today (**1115–1132**) — adjacent `!didAct` Fire-Bolts (WX **16712**). Wounded ally on the caster tile is occupancy-illegal. King Rallying Cry is `usableByEnemy: false` — not this Frost leftover (SYS-41 / SYS-99). #989 owns the empty-damage heal picker *after* `decideCaster` is reached.  
**IMPLEMENTATION_COMPLEXITY:** Low (reorder `decideHealer` vs `pickBestDamageSpell` + `aiCanCast`). Prefer restack onto #1026 after older PRs; sidecar only until then.  
**TEST_SCENARIOS:** Queen (4,4), pawn ally 20/100 HP at (6,4), player at (7,4), Frost+Blood Mend ready → `kind: "cast"` Frost on player, not `approach-ally`. Same, player at (9,4) (Frost range 4 miss) → hold/skip, not bolt, not walk-to-ally. Blood Mend on CD, Frost legal → Frost.  
**STATUS:** PROPOSED

### AI-SYS-103

**AI_ID:** AI-SYS-103  
**NAME:** Pack healer approach-ally must not swallow Inferno into a Fire Bolt  
**ROLE:** system  
**SOPHISTICATION:** T1+ / honesty for SYS-02 / SYS-05 / SYS-39 / SYS-96 / SYS-102  
**DECISION_RULES:** Queen z≥2 kit is `[spell-inferno, starter-heal]` (**176–179**). Inferno `damage: 0` so `pickBestDamageSpell` would drop it even after SYS-102 deletes approach. Live approach (**1114–1132**) never asks. Adjacent dest-commit Fire-Bolts. After this module: (1) SYS-102’s “heal illegal ⇒ continue enumerator” still runs; (2) the next id is a profiled DoT (`isDotSpell` / `dotDamagePerTurn`) **once SYS-96 writes it** — until then, reject/skip, never bolt; (3) do not treat Inferno as Frost (no `debuffStat: "mp"`, no `damage > 0`); (4) do not use `AI_KAMIKAZE_BLAST_RADIUS` (SYS-106). Open #1033 is the sidecar detector — **do not copy**. Open #967 is hunter/archer DoT *decide*, not healer approach.  
**SCORING_MODEL:** Until SYS-96, Inferno EV = 0 (no hidden ticks). After: FUT-114 / FUT-121 public duration EV. Illegal dest ⇒ −∞, not bolt.  
**SPELL_REQUIREMENTS:** `spell-inferno` profile: enemy, DoT burn, range 3, `areaRadius: 0`, cooldown 3.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always when Inferno is in the kit. Peer queens attach the DoT; remnants may skip. Not `if (level >= 2) inferno` — kit width is SYS-09 relative difficulty, not this id.  
**ENEMY_ARCHETYPES:** healer dual-kit (queen z≥2).  
**PLAYER_COUNTERPLAY:** Cleanse burn; stand outside range 3; do not eat a fake blast.  
**EDGE_CASES:** Frost+Inferno+heal in one available list → SYS-102 owns Frost if `damage > 0` is legal; this id owns Inferno-only kits. Paper Windstorm is ranged (SYS-70) and must not apply to a rejected DoT.  
**IMPLEMENTATION_COMPLEXITY:** Low after SYS-96 + SYS-102.  
**TEST_SCENARIOS:** Queen Inferno+Blood Mend, wounded ally dist 2, player dist 2, LoS → public burn DoT or skip; never `e-firebolt`; never radius-2 splash. Inferno on CD → skip/hold, not approach-ally.  
**STATUS:** PROPOSED

### AI-SYS-104

**AI_ID:** AI-SYS-104  
**NAME:** Pack healer backline-guard must not preempt in-range Frost  
**ROLE:** system  
**SOPHISTICATION:** T1+ / honesty for POS-07 / SYS-100 / SYS-102 / ROL-08  
**DECISION_RULES:** When the heal branch does not fire, `decideHealer` tries `backlineGuardCell` (**1134–1164**) **before** `decideCaster` (**1165–1168**). A reachable guard dest returns `kind: "move"` and the queen/king never Frosts. After this module: a legal Frost (`aiCanCast` + SYS-05) outranks idle interpose. Guard dests remain available as enumerator options when no nuke is legal (SYS-100 threat picker still applies). `kind` of a guard is `move` (POS-02). Open #1034 is the sidecar — **do not copy**. Do not re-file FUT-83 (ward picker at **1142**) or SYS-100 (`opponents[0]`). King with Rally filtered from `availableSpells` still routes healer from `assignedSpells` (SYS-04 / SYS-41) and hits this branch.  
**SCORING_MODEL:** `U(frost) > U(guard)` when Frost is legal. Guard EV stays POS-07 / FUT-118 once the nuke is illegal.  
**SPELL_REQUIREMENTS:** Same Frost profile as SYS-102.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always for dual-kit healer/artillery. T0 may idle. Not `if (aiTier >= 4) skipGuard`.  
**ENEMY_ARCHETYPES:** healer, artillery dual-kit (queen, king).  
**PLAYER_COUNTERPLAY:** Force a guard by standing in melee on the ward while Frost LoS is blocked.  
**EDGE_CASES:** No legal guard cell already falls through to `decideCaster` — do not double-cast. Approach leftover is SYS-102 (wounded ally present). This id is **no** wounded ally / no healSpell.  
**IMPLEMENTATION_COMPLEXITY:** Low (swap branch order or score both).  
**TEST_SCENARIOS:** Queen, all allies ≥ 50% HP, player in Frost range 4 with LoS, guard cell free → Frost, not `backline-guard`. Frost LoS blocked, guard cell free → `kind: "move"` guard (SYS-100), not bolt.  
**STATUS:** PROPOSED

### AI-SYS-105

**AI_ID:** AI-SYS-105  
**NAME:** Pack healer backline-guard must not preempt Inferno into a Fire Bolt  
**ROLE:** system  
**SOPHISTICATION:** T1+ / honesty for SYS-96 / SYS-103 / SYS-104  
**DECISION_RULES:** Same branch order as SYS-104; kit nuke is Inferno (`damage: 0`). Guard dest + `spell: null` → dest-commit → Fire Bolt if Chebyshev 1. After this module: legal profiled Inferno (SYS-96 write + SYS-13) outranks idle guard; otherwise skip/hold, never bolt. Open #1039 is the sidecar — **do not copy**. Do not splash.  
**SCORING_MODEL:** Until SYS-96, Inferno EV = 0 so guard may still win among *legal* actions — Fire Bolt is never legal. After SYS-96: same as SYS-104 with DoT EV (FUT-121).  
**SPELL_REQUIREMENTS:** Inferno profile as SYS-103.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always when Inferno is in the healer kit.  
**ENEMY_ARCHETYPES:** healer dual-kit (queen z≥2).  
**PLAYER_COUNTERPLAY:** Block Inferno range 3; occupy the guard tile (POS-08).  
**EDGE_CASES:** Inferno cooldown 3 (`spellData.ts` **518**) — on CD, guard is legal. Do not skip CD (SYS-14 / SYS-75).  
**IMPLEMENTATION_COMPLEXITY:** Low after SYS-96 + SYS-104.  
**TEST_SCENARIOS:** Queen Inferno+heal, healthy allies, player dist 2, Inferno ready → burn DoT or skip, not guard-then-bolt. Inferno on CD, guard cell free → guard move.  
**STATUS:** PROPOSED

### AI-SYS-106

**AI_ID:** AI-SYS-106  
**NAME:** Bomber detonate must match the Inferno card — no private radius-2, no fake suicide  
**ROLE:** system  
**SOPHISTICATION:** T1+ / honesty for SYS-19 / SYS-55 / SYS-96 / ROL-07  
**DECISION_RULES:** `decideSummonBomber` (**2355–2458**) uses `AI_KAMIKAZE_BLAST_RADIUS = 2` (`gameConstants.ts` **285**) because Inferno `areaRadius` is 0, then emits a single-target Inferno. `countTargetsInBlast` (**869–878**) therefore gates on a blast apply will not deal. Paid executor sets `hp = 0` only when `damage > 0` (`summonExecutor.ts` **177–180**); Inferno misses and the bomber lives. Hostile/pack units skip the executor (SYS-55) so WX never suicides them either. After this module: (1) cluster count uses the **profiled** `areaRadius` / `hitsMultiple` (0 today ⇒ count the single dest only, `AI_KAMIKAZE_MIN_TARGETS` cannot require 2 for Inferno); (2) self-destruct is a profiled flag or a tagged bomber ability with UI copy — not a hidden `hp = 0` inside a damage arm; (3) until a real AoE id is authored, detonate = SYS-96 single-target burn or skip, never bolt, never splash; (4) do not assign Motoko `thunder_clap` / `void_collapse` as a “real blast.” 10-24 SYS-96 deferred this on purpose.  
**SCORING_MODEL:** `U(detonate) = wHit * profiledTargets` where profiledTargets ≤ 1 for Inferno. Fake radius-2 count is illegal (dropped).  
**SPELL_REQUIREMENTS:** Inferno as SYS-103. A future kamikaze id needs `areaRadius` or `hitsMultiple` plus an explicit self-destruct field.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always for bomber. T6+ FUT-123 attaches a later blast id via sigmoid, not `if (level >= 80) radius = 2`.  
**ENEMY_ARCHETYPES:** bomber / kamikaze.  
**PLAYER_COUNTERPLAY:** One body is the Inferno dest. Spread out does nothing extra until a real AoE exists.  
**EDGE_CASES:** `AI_KAMIKAZE_LOW_HP_PCT` (0.3) may still prefer detonate-on-self-low-HP — that is a *when*, not a hidden splash. Executor `hp = 0` must move out of `damage > 0` if self-destruct stays on Inferno (it should not).  
**IMPLEMENTATION_COMPLEXITY:** Medium (decide radius + executor suicide arm + pack apply). Sidecar if WX/executor are contested.  
**TEST_SCENARIOS:** Bomber, two foes Chebyshev 2 apart, Inferno ready, dist 2 to one → single-target burn or skip; the other foe takes 0; bomber HP unchanged unless a profiled self-destruct exists. One foe in range, `MIN_TARGETS = 2` → hold or approach, not a fake 2-count detonate.  
**STATUS:** PROPOSED

### AI-SYS-107

**AI_ID:** AI-SYS-107  
**NAME:** Pack healer wounded list must include self so Blood Mend can legally fire  
**ROLE:** system  
**SOPHISTICATION:** T1+ / honesty for SYS-91 / SYS-95 / SYS-99 / ADV-08  
**DECISION_RULES:** `allies` omit the acting enemy (**1674–1676**). `decideHealer` wounded filter therefore never sees the queen’s own HP (**1092–1094**). Blood Mend is self / range 0. When **no** other ally is below 50%, live skips heal and goes SYS-104/105 / `decideCaster`. When another ally **is** below 50%, SYS-102 walks. After this module: the heal enumerator includes the caster when `targetType === "self"` (and ally+self if a later card allows both). Emit Blood Mend on `enemy.id` when own `hpFrac < ENEMY_HEAL_ALLY_THRESHOLD_PCT` (or a scored self-heal EV wins — FUT-125) **and** SYS-13 accepts the caster tile. Apply already has a range-0 self-heal arm (WX **16648–16670**) — SYS-95 still must write advertised CHC (#924). Open #985 is the sidecar for the **no-other-wounded-ally** case — **do not copy / do not restack**. SYS-91 remains “do not target a distinct ally.” SYS-99 remains wisp Rally.  
**SCORING_MODEL:** Self dest for a self spell is legal. Ally dest for a self spell ⇒ −∞. `U(selfHeal) = wHeal * (1 - ownHpFrac)` plus CHC once SYS-95 writes it.  
**SPELL_REQUIREMENTS:** `starter-heal` as SYS-91 / SYS-102.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always when a self-heal is in the kit. T0 may skip. Not `if (hp < 30) panicHeal` as a level table.  
**ENEMY_ARCHETYPES:** healer, queen dual-kit.  
**PLAYER_COUNTERPLAY:** Pressure the queen below 50% and watch Blood Mend on **her**, not a pawn. Dispel CHC (once SYS-95).  
**EDGE_CASES:** Queen 20% HP *and* pawn 20% HP → self Blood Mend (legal) outranks approach-ally (illegal) and still loses to a lethal Frost on the player if ADV-08 / FUT-120 says so — default honesty is: legal self-heal before illegal walk; legal Frost vs legal self-heal is FUT-120, not this id. `healSpell` first-find vs Rally (SYS-41) must not pick `usableByEnemy: false`.  
**IMPLEMENTATION_COMPLEXITY:** Low (include self in the heal candidate set; dest = caster). Prefer follow #985.  
**TEST_SCENARIOS:** Queen 20/100 HP, pawn 80/100, Frost+Blood Mend, player dist 4 → Blood Mend `targetId` is the queen (or Frost if FUT-120 is on — default this slice: self-heal is at least *enumerated*). Queen 80/100, pawn 20/100 → not this id (SYS-102). Queen 20/100, no allies → self-heal, not guard-then-bolt.  
**STATUS:** PROPOSED

---

## 4. T6+ reusable modules (2026-10-25)

Attach via parent §4 sigmoid. Stack; do not replace T0–T5 or FUT-01…119. Do not re-file FUT-83, FUT-114…119, FUT-23, FUT-64, FUT-117, or FUT-119.

### AI-FUT-120

**AI_ID:** AI-FUT-120  
**NAME:** Dual-kit healer/artillery sequence — legal heal, then legal nuke, then walk  
**ROLE:** healer / artillery / resource  
**SOPHISTICATION:** T6 (ROL-04 / ROL-08 / RES-04 / SYS-102 / SYS-104 / SYS-107)  
**DECISION_RULES:** After SYS-102/104/107: T2+ dual-kit pieces score `{self-heal, ally-heal if profiled, Frost, guard, hold}` on one enumerator (parent SYS-03 cap). Default order when all are legal: lethal nuke (SYS-85, visible HP only) > self-heal below threshold > Frost > guard. Walk toward an ally only if a profiled *ally* heal becomes legal within budget (Blood Mend never). T0 may keep one branch. Unbounded: a year-later artillery id with a small self-hot uses the same sequence shape, not `if (level >= 80) queenBrain`.  
**SCORING_MODEL:** Parent `U(action)` + SYS-102 illegal-heal −∞ + SYS-02 Frost EV + SYS-107 self-heal EV.  
**SPELL_REQUIREMENTS:** Profiled self-heal + damage>0 nuke. Inferno stays FUT-121.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.25` for dual-kit healer/artillery. Remnant queens may Frost-only.  
**ENEMY_ARCHETYPES:** healer, artillery, queen, king.  
**PLAYER_COUNTERPLAY:** Hold the queen just above the heal threshold and break Frost LoS so she wastes the turn on a guard.  
**EDGE_CASES:** Do not let T6 skip LoS to “snipe.” ADV-08 invert (suicide Frost while dying) is a later weight, not a cheat.  
**IMPLEMENTATION_COMPLEXITY:** Low after SYS-102/104/107.  
**TEST_SCENARIOS:** Queen 20% HP, player 5 HP in Frost range → T2+ Frost (killableNow). Queen 20% HP, player 80% HP in range → Blood Mend. Healthy queen, player in range → Frost not guard.  
**STATUS:** PROPOSED

### AI-FUT-121

**AI_ID:** AI-FUT-121  
**NAME:** Dual-kit Inferno as profiled DoT fallback, not a bolt and not a blast  
**ROLE:** artillery / targeting  
**SOPHISTICATION:** T6 (TGT-05 / TEM-04 / SYS-96 / SYS-103 / SYS-105 / FUT-114)  
**DECISION_RULES:** After SYS-96 writes public burn ticks and SYS-103/105 let healer kits *choose* Inferno: T2+ queens score Inferno EV (`dotDamagePerTurn * remainingDuration` vs visible HP) against Frost if both are present, skip a second burn of the same `dotType` (FUT-114 / TEM-04), and honor cooldown 3. T0 may skip DoTs. Unbounded: a later `dotType: "rot"` uses the same scorer. Do not attach `AI_KAMIKAZE_BLAST_RADIUS`.  
**SCORING_MODEL:** FUT-114 DoT EV. Frost still SYS-02. Duplicate burn ⇒ −∞.  
**SPELL_REQUIREMENTS:** Profiled Inferno.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.3` when Inferno is in the kit (SYS-09 width, not a level table).  
**ENEMY_ARCHETYPES:** artillery, healer dual-kit, bomber (single-target until SYS-106 authors AoE).  
**PLAYER_COUNTERPLAY:** Cleanse; bait Inferno CD then close.  
**EDGE_CASES:** Before SYS-96 this term is 0. Null Field vs non-DoT is SYS-65.  
**IMPLEMENTATION_COMPLEXITY:** Low after SYS-96 + SYS-103.  
**TEST_SCENARIOS:** Queen, player already burning 2 turns, Inferno ready, Frost ready → Frost or Strike, not a second Inferno. Fresh target dist 3 → Inferno.  
**STATUS:** PROPOSED

### AI-FUT-122

**AI_ID:** AI-FUT-122  
**NAME:** Interpose vs artillery — guard dests compete with nukes, they do not `return` first  
**ROLE:** team / positioning  
**SOPHISTICATION:** T6 (POS-07 / TEM-02 / TEM-06 / SYS-104 / SYS-100 / FUT-118)  
**DECISION_RULES:** After SYS-104/105: T3+ dual-kit pieces put guard dests on the same enumerator as Frost/Inferno. Formations (parent TEM-06) may assign a *non-artillery* protector to the guard tile while the queen shoots. T1 may still idle-guard when no nuke is legal. Retreat-toward-support remains FUT-111. Do not use raw `allyCount` (SYS-83).  
**SCORING_MODEL:** `U(guard)` from FUT-118; compared with nuke EV, not a hard `return`.  
**SPELL_REQUIREMENTS:** None extra.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.4` when living protector + dual-kit artillery ≥ 1. Solo remnant queens skip formations.  
**ENEMY_ARCHETYPES:** artillery + protector packs.  
**PLAYER_COUNTERPLAY:** Peel the protector; the queen must then choose guard vs shot.  
**EDGE_CASES:** No protector → queen shoots (SYS-104), she does not body-block first.  
**IMPLEMENTATION_COMPLEXITY:** Medium after SYS-104 + SYS-100.  
**TEST_SCENARIOS:** Queen + rook, player in Frost range → queen Frosts, rook guards (FUT-118). Queen alone, Frost legal → Frost. Queen alone, Frost illegal, guard cell free → guard.  
**STATUS:** PROPOSED

### AI-FUT-123

**AI_ID:** AI-FUT-123  
**NAME:** Kamikaze as a reusable profile — radius, self-destruct, min-targets from metadata  
**ROLE:** bomber / summoner  
**SOPHISTICATION:** T6 (ROL-07 / TEM-05 / SYS-106 / SYS-19 / FUT-19)  
**DECISION_RULES:** After SYS-106: T2+ bombers score a tagged kamikaze id whose profile carries `areaRadius` / `hitsMultiple`, `selfDestruct: true`, and `minTargets`. Inferno is **not** that id. A year-later elite bomber (relative difficulty, not `level >= 100`) attaches the same profile to a new authored spell. T5 bosses may use a named `BossAbility` with UI copy (SYS-16) instead of hiding `hp = 0` in the executor. Do not splash leftover overkill (SYS-19).  
**SCORING_MODEL:** `U = wHits * nProfiledTargets - wSelf * remainingHpValue` gated on `n >= minTargets` unless own HP < public low-HP flag.  
**SPELL_REQUIREMENTS:** New profiled id; Inferno stays single-target DoT.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.35` for bomber role. Remnant bombers keep SYS-106 Inferno honesty (no fake blast).  
**ENEMY_ARCHETYPES:** bomber, kamikaze, elite suicide-support.  
**PLAYER_COUNTERPLAY:** Spread beyond the **advertised** radius; kill the bomber before min-targets.  
**EDGE_CASES:** `minTargets = 2` with `areaRadius = 0` is authoring-illegal (SYS-02 gate).  
**IMPLEMENTATION_COMPLEXITY:** Medium (new profile + apply splash + suicide).  
**TEST_SCENARIOS:** Profiled blast radius 1, two foes adjacent → detonate, bomber dies, both take card damage. Inferno-only kit → SYS-106 tests still pass.  
**STATUS:** PROPOSED

### AI-FUT-124

**AI_ID:** AI-FUT-124  
**NAME:** Authored queen role survives Blood Mend kit rows as relative difficulty rises  
**ROLE:** role / system  
**SOPHISTICATION:** T6 (ROL-04 / ROL-08 / SYS-04 / SYS-101 / FUT-119 / SYS-102)  
**DECISION_RULES:** After SYS-101 / FUT-119: spawn writes `Enemy.role` (`artillery` for queen, `support`/`leader` for king, `healer` only when the family table says so). Adding Blood Mend as kit width (SYS-09 / FUT-109) must **not** flip the role via heal-first (SYS-04). T0 may keep the heuristic only when `role` is missing. Overlay attach remains §4 sigmoid. A year-later artillery piece that also knows a range-3 ward heal stays artillery.  
**SCORING_MODEL:** `roleWeights[role][k]` from parent §5. Heal-first today zeroes artillery weights.  
**SPELL_REQUIREMENTS:** Role table lists which profiles that role may emit. Blood Mend on an artillery row is a self-hot, not a re-route to `decideHealer`.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Role is authored at all absolute levels. Module attach still uses `peer`.  
**ENEMY_ARCHETYPES:** artillery, healer, support, protector.  
**PLAYER_COUNTERPLAY:** Initiative strip / intent log shows artillery; she shoots.  
**EDGE_CASES:** Family table `role: "healer"` + Frost is a true healer (SYS-102 still forbids illegal ally Blood Mend). King + Rally stays SYS-41 until `usableByEnemy` and `targetType` match.  
**IMPLEMENTATION_COMPLEXITY:** Medium (spawn metadata + stop routing queens through `decideHealer`).  
**TEST_SCENARIOS:** Family `role: "artillery"`, kit Frost+Blood Mend → `decideCaster` / FUT-120, not approach-ally. Player 4000 vs remnant artillery → still artillery, T0–T1 modules only.  
**STATUS:** PROPOSED

### AI-FUT-125

**AI_ID:** AI-FUT-125  
**NAME:** Public self-HP vs aggression — Blood Mend EV when the caster is the wounded one  
**ROLE:** adaptive / healer  
**SOPHISTICATION:** T6 (ADV-03 / ADV-08 / SYS-107 / FUT-120)  
**DECISION_RULES:** After SYS-107: T3+ dual-kit pieces score self-heal against a legal nuke using **public** own HP / maxHp (pack snapshot leftover maxHp is SYS-76 / SYS-84 — do not cheat a hidden max). Low own HP raises heal EV; killableNow on the player raises nuke EV. T5 bosses may invert (ADV-08) when they are the remaining HP pool. T0 may always shoot. Do not read hidden player AP/MP for this term (ADV-04 is a *later* public-strip module).  
**SCORING_MODEL:** `U(selfHeal) = wSurvive * (1 - hpFrac)` vs `U(nuke) = wKill * killableNow + SYS-02 dmg`.  
**SPELL_REQUIREMENTS:** Profiled self-heal + nuke.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.35` for dual-kit. Remnants may always Frost.  
**ENEMY_ARCHETYPES:** healer, artillery, protector (self Iron Skin is FUT-116, not this id).  
**PLAYER_COUNTERPLAY:** Leave her just above threshold so she keeps shooting; spike her below it to buy a Mend turn.  
**EDGE_CASES:** `effectiveHp ?? hp` (SYS-84) must not make a leftover-maxHp queen look healthier than she is.  
**IMPLEMENTATION_COMPLEXITY:** Low after SYS-107 + FUT-120.  
**TEST_SCENARIOS:** Queen 15% HP, player 90% HP in Frost range → Blood Mend. Queen 15% HP, player 5% HP → Frost.  
**STATUS:** PROPOSED

---

## 5. Spell-awareness contract (reminder)

Unchanged: no profile + apply ⇒ not in kit, not in elite extras, `usableByEnemy` treated as false in the enumerator.

Still `usableByEnemy: true` without a working decide+apply pair (do not give these to pack AI until FUT-22 / FUT-25 / FUT-31 / SYS-96 apply):

`spell-swap`, `spell-mark`, `spell-sacrifice`, `spell-lifesteal-nova`, `spell-enrage`, `spell-haste`, `spell-weaken`, `spell-expose`, `spell-drain-courage`, `spell-cursed-wound`, `spell-shadow-veil`, `spell-frost-nova`, `spell-inferno` (DoT `damage: 0`, `areaRadius: 0` — queen z≥2 and bomber *already emit or would* — SYS-96 / SYS-103 / SYS-106 must land first), `starter-poison` / `spell-venom-strike` (hunter/archer already emit — SYS-96), `starter-shield` / `spell-iron-skin` (guardian already emits — SYS-98 / pack apply still missing).

Keep `usableByEnemy: false` until profiled: barrier, mirror, timestep, rallying-cry, sentinel/bomber/wisp summons.

`starter-heal` is self-only (`range: 0`, `targetType: "self"`). SYS-91 is the pack healer *wrong dest*. SYS-102 is that the wrong dest **walk** blocks Frost. SYS-107 is that self is missing from the candidate list. `spell-rallying-cry` is the same shape and is **not** an ally rally (SYS-99).

Motoko `defaultSpells` (`shadow_strike`, `soul_rend`, `vampire_bite`, `reflect_barrier`, `thunder_clap`, `void_collapse`) are `usableByEnemy: true` but have `minRange` / `diagonal` / `lineOfSight: false` / attract AoE that `enemyCastGeometryOk` does not implement. SYS-90 forbids using them as frost substitutes. Do not assign `thunder_clap` as a bomber “real AoE” until SYS-13 + SYS-106 + a profile exist.

`summon-dire-wolf` / `summon-archer` are `usableByEnemy: true` with range 2. SYS-86 is the profile: ground dest in range.

Kit frost staying at spellbook damage (SYS-72) is **not** a reason to assign Inferno. SYS-79’s kit-pick still requires `damage > 0`. Frost range is 4 (`spellData.ts` 131). Inferno range is 3 (`spellData.ts` 509). Poison range is 4 (`spellData.ts` 56). Venom range is 2 (`spellData.ts` 401).

---

## 6. Implementation order (this increment)

Do not start FUT-120+ first. Do not start T6+ from earlier increments before P0 honesty.

1. SYS-05 (Fire Bolt WX **16712**, AP/MP debit, ally heal WX **16648**) — still P0. Empty-kit bishops (SYS-90), failed DoTs (SYS-96), healer approach (SYS-102), idle guard (SYS-104), and failed Inferno (SYS-103 / SYS-105) currently *only* Fire-Bolt.  
2. SYS-01 — replace `computeAITier` (`combatMath.ts` 36–52) and the `aiTier >= 5/10` gates (WX **15507** / **15594**).  
3. SYS-73 — drop the 999 spawn ceiling so SYS-01 `peer` still works at high player level.  
4. SYS-90 — prefer merge/follow **#911**; do not double-patch assign. Then SYS-09 zone key.  
5. SYS-04 then SYS-101 + FUT-119 / **FUT-124** — authored roles; stop routing artillery through `decideHealer`.  
6. SYS-91 + **SYS-107** + SYS-99 + FUT-117 — `targetType` self vs ally. Prefer **#985** for SYS-107 and **#924** for SYS-95.  
7. **SYS-102** + **SYS-104** + FUT-120 / FUT-122 — nuke vs approach vs guard. Prefer merge/follow **#1026** / **#1034**; restack `decideHealer` with `aiCanCast` + SYS-05, do not ship their no-LoS/no-AP detector as policy.  
8. SYS-96 then **SYS-103** / **SYS-105** + FUT-121. Prefer **#1033** / **#1039** / **#947** / **#972** as apply/CD sidecars.  
9. **SYS-106** + FUT-123 — bomber honesty then profiled kamikaze.  
10. SYS-13 + SYS-06 + SYS-11 + SYS-20 — side-aware legality. `enemyCastGeometryOk` is not sufficient.  
11. SYS-97 + FUT-115 — intent-aligned walk (approach leftover still inherits SYS-97).  
12. SYS-98 + FUT-116 — protector sequence (still #999).  
13. SYS-100 + FUT-118 — interpose vs nearest attacker (still #999). SYS-104 uses that helper; it does not replace it.  
14. Parent T2–T5 roles / team / adaptive; remaining FUT-01…119; **FUT-125**.

Each slice: `engine/enemyAI*.test.ts` or a **sidecar** test file (open #1026 pattern), zero WX drive-by, no RAF / map gen / turn order / damage-formula edits unless a **named** follow-up. Scoring **reads** RES/SR/CHC; it does not change `calcScaledDamage`.

---

## 7. Extra test scenarios

| ID | Setup | Expect |
| :--- | :--- | :--- |
| TS-HEALFROST | Queen (4,4), ally 20/100 at (6,4), player (7,4), Frost+Blood Mend | Frost on player; not `approach-ally`; never `e-firebolt` (SYS-102). |
| TS-HEALINF | Queen Inferno+Blood Mend, wounded ally dist 2, player dist 2 | Burn DoT or skip; no splash; no bolt (SYS-103 / SYS-96). |
| TS-GUARDFROST | Queen, allies healthy, player in Frost range 4 + LoS, guard cell free | Frost, not `backline-guard` (SYS-104). |
| TS-GUARDINF | Queen Inferno, allies healthy, player dist 2, Inferno ready | Burn or skip, not guard-then-bolt (SYS-105). |
| TS-KAMI0 | Bomber, two foes radius-2 cluster, Inferno `areaRadius: 0` | Single-target burn or skip; other foe 0; bomber alive (SYS-106). |
| TS-SELFHEAL | Queen 20/100, pawn 80/100, Blood Mend ready | Heal dest is the queen, not the pawn (SYS-107). |
| TS-WALKALLY | Blood Mend range 0, wounded ally dist 2, Frost out of range / no LoS | Hold/skip, not walk-to-ally, not bolt (SYS-102). |
| TS-BOLT3 | Failed frost / failed DoT / failed heal, Chebyshev 1 | Crush or skip; never `e-firebolt` (WX 16712). |
| TS-PEER3K | Player 3000, enemy 3000 | Not forced T5; remnant 400 stays low tier (FUT-92). |
| TS-KINGRALLY | King assigned Rally+Frost, Rally not in `availableSpells` | Not approach-ally; Frost if legal else guard/skip (SYS-41 / SYS-104). |

Parent and 2026-09-01…10-24 TS-* rows still apply (line numbers in §1.2). Frost examples use live range **4**. Inferno examples use live range **3**. Poison kite examples use live range **4**.

---

## 8. Mapping (new gaps → ids)

| Request / gap | Primary AI_ID |
| :--- | :--- |
| Heal-first queen approaches an unhealable ally while Frost is legal | AI-SYS-102 / AI-FUT-120 |
| Same approach swallows Inferno into a Fire Bolt | AI-SYS-103 / AI-FUT-121 |
| Idle backline-guard preempts Frost | AI-SYS-104 / AI-FUT-122 |
| Idle backline-guard preempts Inferno into a Fire Bolt | AI-SYS-105 / AI-FUT-121 |
| Bomber private radius-2 + suicide inside `damage > 0` | AI-SYS-106 / AI-FUT-123 |
| `allies` exclude self so Blood Mend never sees the caster | AI-SYS-107 / AI-FUT-125 |
| Authored queen stays artillery as kit width grows | AI-FUT-124 (after SYS-04 / SYS-101 / FUT-119) |

T0–T5 requested list (positioning, targeting, resources, roles, team, adaptive) remains parent §19. Nothing in that list is implemented. Higher-level enemies still get harder from **modules on the sigmoid** and from **honest relative spawn** (SYS-73 / FUT-92 / SYS-89), not from `computeAITier(enemyLevel)`, not from a kit-less bolt, not from a queen that walks instead of Frosting, and not from a bomber that pretends Inferno is a radius-2 suicide.

Requested capability → already-catalogued parent id (unchanged; still **PROPOSED**), plus this increment’s honesty slices:

| Request | Parent id | This increment |
| :--- | :--- | :--- |
| maintain optimal range / retreat / approach vulnerable / avoid hazards / exploit terrain / avoid AoE clustering / protect allies / escape routes | POS-01…08 | illegal ally-approach = SYS-102; guard vs nuke = SYS-104 / FUT-122; fake AoE cluster = SYS-106 |
| low-HP / high-threat / support / summons / resistance / kill / strategic | TGT-01…07 | Inferno DoT EV = FUT-121; killableNow vs self-heal = FUT-120 / FUT-125 |
| AP combinations / move-then-attack / attack-then-retreat / sequencing / cooldown / waste | RES-01…06 | dual-kit sequence = FUT-120; Inferno CD = SYS-105 |
| tank … protector | ROL-01…10 | authored artillery vs healer = FUT-124; bomber = SYS-106 / FUT-123; healer = SYS-107 |
| focus fire / protect support / exploit debuffs / avoid duplicate debuffs / coordinated AoE / formations / retreat toward support | TEM-01…07 | duplicate burn = FUT-121; formations = FUT-122; coordinated AoE = FUT-123 (profiled only) |
| estimate threat / punish positioning / adapt HP / adapt AP-MP / summons / status / own HP / survival vs aggression | ADV-01…08 | own HP = SYS-107 / FUT-125 |

Every row above is **STATUS: PROPOSED**. No production AI in this change.
