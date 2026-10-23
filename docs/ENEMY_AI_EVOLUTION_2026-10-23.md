# Advanced Enemy AI Evolution — 2026-10-23 increment

**Status:** PROPOSED (design only; no production code in this change)  
**Date:** 2026-10-23  
**Parent catalog:** [`ENEMY_AI_EVOLUTION.md`](./ENEMY_AI_EVOLUTION.md) (T0–T5)  
**Prior increments:** [`ENEMY_AI_EVOLUTION_2026-09-01.md`](./ENEMY_AI_EVOLUTION_2026-09-01.md) · [`ENEMY_AI_EVOLUTION_2026-09-02.md`](./ENEMY_AI_EVOLUTION_2026-09-02.md) · [`ENEMY_AI_EVOLUTION_2026-09-21.md`](./ENEMY_AI_EVOLUTION_2026-09-21.md) (open PR #351; SYS-22…32, FUT-36…47 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-22.md`](./ENEMY_AI_EVOLUTION_2026-09-22.md) (open PR #416; SYS-33…35, FUT-48…53 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-23.md`](./ENEMY_AI_EVOLUTION_2026-09-23.md) (open PR #458; SYS-36…41, FUT-54…59 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-24.md`](./ENEMY_AI_EVOLUTION_2026-09-24.md) (open PR #506; SYS-42…47, FUT-60…65 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-25.md`](./ENEMY_AI_EVOLUTION_2026-09-25.md) (open PR #565; SYS-48…53, FUT-66…71 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-26.md`](./ENEMY_AI_EVOLUTION_2026-09-26.md) (open PR #633; SYS-54…59, FUT-72…77 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-27.md`](./ENEMY_AI_EVOLUTION_2026-09-27.md) (open PR #689; SYS-60…65, FUT-78…83 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-28.md`](./ENEMY_AI_EVOLUTION_2026-09-28.md) (open PR #723; SYS-66…71, FUT-84…89 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-29.md`](./ENEMY_AI_EVOLUTION_2026-09-29.md) (open PR #804; SYS-72…77, FUT-90…95 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-10-21.md`](./ENEMY_AI_EVOLUTION_2026-10-21.md) (open PR #821; SYS-78…83, FUT-96…101 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-10-22.md`](./ENEMY_AI_EVOLUTION_2026-10-22.md) (open PR #874; SYS-84…89, FUT-102…107 — **do not re-number**)  
**Implementer ledger:** [`automation/ACTION_IDS_AEE_2026-10-23.md`](./automation/ACTION_IDS_AEE_2026-10-23.md)

This increment re-reads the live engine one day after the 2026-10-22 catalog (#874). SYS-01…89 and FUT-01…107 stay **PROPOSED** on their own files; they are **not** re-filed here. New work is: pack kit ids resolve only against the Motoko catalog so bishops ship `spells: []` (open #911); Blood Mend / Rallying Cry are `targetType: "self"` range-0 but healer decide targets other allies and never the acting unit; approach walkers never call `filterHazardCandidates`; caster retreat steps away from `opponents[0]` (store order / harass prepend), not the nearest threat; archer kite uses a magic `MIN_KITE_RANGE = 3` instead of the assigned spell’s range (poison is 4); range-0 heal apply drops the advertised `buffStat` CHC (open #924).

Stralt has **no character level cap**. Nothing here maps `if (level >= X) sophistication = Y`. Tiers remain conceptual. Eligibility remains the parent §4 sigmoid (`peer = log2(enemy.level / player.level)` plus pack/boss/modifier terms). A year-later peer fight at any absolute level can attach a new module without raising a cap. Empty Motoko-only kits and a self-heal that never fires are **honesty**, not a last band.

**Hard rules (unchanged):** no cheat, no hidden player information, no ignored LoS/range/AP/MP, no unbounded search, no kit-less Fire Bolt, no `instantKill`, no betrayal-as-difficulty, no name-based spell heuristics, no production AI in this change. Do not fill an empty pack kit with Motoko `shadow_strike` / `void_collapse` just because those ids are `usableByEnemy: true` — SYS-13 still lacks `minRange` / `linear` / `diagonal` / `freeCells`.

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
| [#874](https://github.com/Mr-Melic/stralt/pull/874) (draft) | SYS-84…89 / FUT-102…107 | Yesterday’s design increment. Unique files only. |
| [#911](https://github.com/Mr-Melic/stralt/pull/911) (draft) | AI-SYS-90 (kit resolve) | Pack kits when Motoko catalog misses starter ids. **Do not re-implement.** |
| [#924](https://github.com/Mr-Melic/stralt/pull/924) (draft) | AI-SYS-95 (heal `buffStat`) | Share WX enemy heal execute with advertised CHC. **Do not re-implement.** Sidecar only — do not restack WX / `enemyAI.ts`. |

This docs PR does **not** edit [`ENEMY_AI_EVOLUTION.md`](./ENEMY_AI_EVOLUTION.md) (open PR #351 unions that header). Unique files only.

---

## 1. Re-read (2026-10-23) — what moved

All line numbers are from this checkout. Re-read them before implementing.

### 1.1 Combat-parity still is not sophistication

Unchanged from 2026-09-21…10-22: `enemyCastGeometryOk` (`targeting.ts` 166–177), `aiCanCast` (`enemyAI.ts` 320–332), Frozen walk *rate* (`enemyWalkMp.ts` 21–29), `playerCastPlan.ts` (player only), summon leftover-AP `reevaluate` (`summonExecutor.ts` 249–254). These are **not** SYS-05 / SYS-13 / SYS-01.

`aiCanCast` is still unused by healer (1099–1100) and guardian (2131–2133). That remains **AI-SYS-23** on the 09-21 increment. Caster in-range uses it (953); lookahead/spill after that line does **not** (SYS-85 / #874).

`enemyAI.ts` still has **zero** reads of `currentAp`, `currentMp`, or `apCost`. Pack walk budget is still `ENEMY_REACHABLE_STEP_BUDGET = 3` (`gameConstants.ts` 166; `computeReachable` 377–378). `getEffectiveStat` is declared on `DecideEnemyContext` (275–276) and **never read** by `estimateDamage` / `scoreTargets` / any `decide*`.

Do **not** feed `spellRangeBase` into AI (`targeting.ts` 191–209 / `groundTileInRange`). That fork is honesty: player upgrade `maxRange` is not an enemy kit field. Do **not** treat `enemyCastGeometryOk` as SYS-13 complete.

`starter-frost` live range is **`BigInt(4)`** (`spellData.ts` **131**). `starter-heal` / Blood Mend is **`targetType: "self"`**, **`range: BigInt(0)`** (`spellData.ts` **85–101**). `starter-poison` range is **4** (`spellData.ts` **56**). Open #821 TS-MTC used frost 3. SYS-79 still holds: Chebyshev 6 is out of current-origin range 4.

### 1.2 Line numbers vs 2026-10-22 (P0 sites did not move)

| Fact | 2026-10-22 | Live (2026-10-23) |
| :--- | :--- | :--- |
| `computeAITier` | `combatMath.ts` 36–52 | **unchanged** |
| `pickEnemyLevelFromTiers` `maxTier = floor(999 / ts)` | `combatMath.ts` 54–58 | **unchanged** (SYS-73) |
| `calcScaledDamage` ignores caster level | `combatMath.ts` 130–137 | **unchanged** (SYS-72) |
| Spawn `aiTier` | WX 5823 | **5823** |
| Family second `computeAITier` | WX 5865 | **5865** |
| Kit `levelZone` object | WX 11920 | **11920** — resolve still `normalizedSpellPool.find` (**11921–11923**) (this file’s SYS-90) |
| `spellPool` Motoko-or-starter | (not called out) | WX **2688–2701** (SYS-90) |
| Summoner chance unbounded | WX 11932–11943 | **11932–11943** (FUT-23; skip-brain is SYS-89) |
| `isSummoner` short-circuit | WX 16375–16384 | **16375–16384** (SYS-86 / SYS-89) |
| Player-summon empty occupied | WX 15156 | **15156** (SYS-14) |
| Summon player `maxHp` HUD | WX 15150 | **15150** (SYS-78) |
| Pack player `maxHp` leftover | WX 16300 | **16300** (SYS-76 / SYS-78 / SYS-84) |
| `aiTier >= 5` erratic | WX 15508 | **15507–15591** (`(enemy.aiTier ?? 1) >= 5`) |
| `aiTier >= 10` betrayal | WX 15595 | **15594–15600** (`(enemy.aiTier ?? 1) >= 10`) |
| Dest-commit clamp | WX 16416–16423 | **16416–16423** (SYS-58) |
| Apply `targetCell` render `playerPosition` | WX 16436–16438 | **16436–16438** (SYS-34 / #495) |
| Apply Chebyshev only | WX 16450–16456 | **16450–16456** |
| Apply crit `enemy.chc ?? 2` | WX 16470–16472 | **16470–16472** (SYS-82) |
| Self-heal `range === 0` | WX 16648 | **16648–16670** — HP only, no `buffStat` (SYS-95 / #924) |
| Fire Bolt `e-firebolt` | WX 16712 | **16712** |
| `decideEnemyAction` | 1662–1707 | **1662–1707** |
| `scoreTargets` `effectiveHp ?? hp` | 341–342, 540 | **unchanged** (SYS-84) |
| `decideHealer` ally Chebyshev | 1092–1112 | **1092–1112**; allies exclude self **1674–1676** (SYS-91) |
| `filterHazardCandidates` | 425–441 | **425–441**; **only `stepAway` calls it** (SYS-92) |
| Caster retreat `opponents[0]` | (not called out) | **928–944** (SYS-93) |
| Archer `MIN_KITE_RANGE` | (not called out) | **2324–2331** (SYS-94) |
| Pack healer `allies.find(!isSummon)` | FUT-83 | **1142** — **do not re-file**; still unimplemented |
| `pickBossKitSpell` `new Map()` | `useBossAI.ts` 169–173 | **169–173** (`new Map<string, number>()`) |
| `ENEMY_AI_TIER_GATES` | unread | still unread (`enemyAI.ts` comment only at **1422–1423**) |

P0 remains **AEE-2026-08-31-002** (Fire Bolt / apply honesty) then **AEE-2026-08-31-001** (`computeAITier`). Then 09-21…10-22 honesty. Then this file’s SYS-90…95. Do not start FUT-108+ first. Empty kits make Fire Bolt the *only* bishop action — SYS-90 is on the P0 path, not a T6 extra.

### 1.3 Still true — do not re-file (parent / 09-21…10-22)

- Zone-0 kits forever (`Math.floor(levelZone)` on an object). SYS-09. SYS-90 is the **id resolve** after that floor, not the NaN.
- `scoreTargets` ignores `focusTargetId`. SYS-08 / AI-SYS-30 (prepend also destroyed by sort). SYS-93 is retreat’s use of the unsorted list, not focus.
- `estimateDamage` returns 0 when `spell.damage <= 0`. SYS-02 / SYS-39.
- Heal-first `inferArchetype` (447–452). SYS-04 / SYS-41.
- Pack healer idle ward `allies.find(!isSummon)` (1142). **FUT-83** (09-27). Summon `pickBestAlly` (2120) already exists. SYS-91 is self-spell vs ally list, not the idle ward.
- Hazard avoid only below 50% HP; ice/lava/spikes only (425–441). POS-04 / FUT-09 / FUT-59 / FUT-93. SYS-92 is that **approach never calls the filter**.
- Retreat / `reposition-los` `kind: "skip"` while dest-commit still moves. POS-02 / FUT-41 / SYS-58.
- Summoner chance hits 1.0 at player level 44. FUT-23. Skip-brain is SYS-89.
- `ENEMY_AI_TIER_GATES` unread. SYS-01.
- Summon executor Chebyshev teleport MP. SYS-15 / 09-21 SYS-25.
- Family overlay second `computeAITier`. AI-SYS-29.
- `findKitSpell` assigned fallback (1737–1745). AI-SYS-32.
- Strip / `resolveEnemyApMp` uses `enemy.level` for AP/MP. SYS-54.
- Hostile summons skip the paid executor. SYS-55. **#842 routes decide; it still does not send hostiles through `executeSummonAction`.**
- Boss occupancy list empty. SYS-56.
- Erratic dest ignores portal/void/barrier. SYS-57. Live filter (WX **15531–15550**) is wall + other bodies + player tile only.
- Dest-commit clamp-only. SYS-58. `enemyDestToCommit` (`battleSetup.ts` **394–406**) still returns `{x,y}` whenever dest ≠ origin.
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
- Paper Windstorm 30% player / 50% pack. SYS-70. FUT-21 / FUT-88.
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
- `hasBresenhamLoS` still ignores combatant bodies. Do not propose an AI-only body-block LoS module.
- `engine/summonAI.ts` `runSummonAI` remains unused.
- Diagonal `stepToward` candidate (`enemyAI.ts` **595–596**) still must be in `reachable` (SYS-15). Do not re-file as a new walker.

### 1.4 New honesty gaps (this increment)

1. **Pack kit resolve misses every starter id when Motoko is live.** Battle start still comments “10 random spells” (WX **11915**) then `buildEnemyKit(pieceType, currentMap.levelZone)` (**11920**). Ids are looked up only in `normalizedSpellPool` (**11921–11923**). That pool is `filteredBackendSpells` when the catalog is non-empty, else `starterSpells` (WX **2688–2701**). Motoko `AdminLib.defaultSpells()` (`src/backend/lib/admin.mo` **168–191**) is `shadow_strike` / `soul_rend` / `vampire_bite` / `reflect_barrier` / `thunder_clap` / `void_collapse` — none of `physical_attack`, `starter-frost`, `starter-heal`, `spell-inferno`. Bishop / queen / king therefore get `spells: []`. `inferArchetype` becomes generic; `pickBestDamageSpell` is null; apply `!didAct` + Chebyshev 1 Fire-Bolts (WX **16704–16715**). SYS-09 is the NaN zone floor (still one *intended* frost). This is the **id not in the pool**. Open **#911** attaches a starter fallback on its branch — catalog the gap; do not copy that PR. Do **not** “fix” by emitting Motoko `shadow_strike` (`diagonal: true`, `lineOfSight: false`, `minRange: 1`) until SYS-13 scores those flags. SYS-90.

2. **Healer decide never casts Blood Mend.** `starter-heal` is `targetType: "self"`, `range: 0`, heal 12 + `buffStat: "chc"` (`spellData.ts` **85–101**). `decideEnemyAction` builds `allies` as `side === "enemy" && id !== enemy.id` (**1674–1676**) — the acting unit is absent. `decideHealer` (**1092–1112**) picks the most-wounded *ally* and requires Chebyshev ≤ range 0, which is only the same tile. Queen with Blood Mend (heal-first SYS-04) therefore never self-heals at 20% HP; she approaches an ally she cannot occupy, then `decideCaster` (**1166–1168**). Wisp `decideSummonHealer` (**2481–2519**) does the same with the same self spell — player wisp also never Blood-Mends. Rallying Cry is also `targetType: "self"` range 0 (`spellData.ts` **417–435**) and `usableByEnemy: false` (SYS-41). Apply would only self-heal if decide targeted self (WX **16648**). Spell-awareness: the AI does not understand the spell assigned to it. FUT-55 is idle-vs-caster; FUT-83 is the idle *ward*. This is the **self kit**. SYS-91.

3. **Approach walkers ignore the hazard filter.** `filterHazardCandidates` (**425–441**) still only runs when `hpFrac < 0.5` and only for ice/lava/spikes. The sole caller is `stepAway` (**630**). `stepToward` (**579–611**), `stepFlank` (**643–679**), `findNearestLegalCastTile` (**787–824**), and `repositionForLOS` (**749–768**) never call it. A 10% HP bishop `closes-in` (**1005–1047**) will dest-commit onto lava. SYS-43 is apply paying dest hazards; POS-04 / FUT-93 is the 50% gate and the “only lava tile” EV. This is that **approach never consults the filter**. SYS-92.

4. **Caster retreat is not away from the threat that can hit it.** `decideCaster` below `ENEMY_RETREAT_HP_PCT` 0.3 (**928–944**) sets `nearest = opponents[0]` *before* `scoreTargets`. `opponents` is snapshot order: player-side summons from `prevEnemies` first, player pushed last (WX **16274–16302**). Without a wisp, `opponents[0]` is often a summon, not the player. With a wisp and `!focusAlreadySet`, SYS-30 prepends the healer summon (**1682–1690**) — then retreat steps away from the wisp while the player is adjacent. `stepAway` from the wrong cell can walk *onto* the player (SYS-05 Fire Bolt if dest-commit lands Chebyshev 1). SYS-93.

5. **Archer kite band is a magic 3.** `decideSummonArcher` (**2324–2331**) uses `MIN_KITE_RANGE = 3` for “too close,” and `Number(preferred?.range ?? 3)` only for “too far.” Preferred is poison ?? slow. Live poison range is **4** (`spellData.ts` **56**); slow is **3** (`spellData.ts` **360**). The too-close band does not read `enemySpellRange` / `minRange`. A year-later kiter spell with `minRange: 2` / `range: 6` still flees at dist 2 and holds at 3. Spell-awareness: kite is a function of the assigned spell, not a constant, and not `if (level >= X) kiteRange = 4`. FUT-54 is perpendicular strafe; FUT-100 is Attack-Nearest threat. SYS-94.

6. **Range-0 heal apply writes HP and drops the advertised CHC buff.** Blood Mend and Rallying Cry advertise `buffStat: "chc"`, `buffModifier: 0.15`, `buffDuration: 2`. WX **16648–16670** `hpAfterHeal` then returns — no `buffStat` arm. Scoring that treats the spell as “heal 12” is incomplete vs the card; scoring that assumes CHC already lands is a lie until apply writes it. Open **#924** shares a sidecar execute with advertised CHC — catalog the gap; do not copy that PR; do not restack WX. SYS-95.

### 1.5 Tests

`enemyAI.charger.test.ts`, `enemyAI.geometry.test.ts`, `enemyAI.walkMp.test.ts` exist. Honesty for empty Motoko kits, self-target Blood Mend, approach-onto-lava, retreat-from-`opponents[0]`, kite-from-`spell.range`, and heal `buffStat` still has no decide/apply-layer tests. Do not treat geometry/walkMp as SYS-90…95. Open #911 adds `packEnemyKitAssign*.ts` on **its** branch; open #924 adds `wxEnemyHealBuffExecute*.ts` — do not duplicate here.

### 1.6 What this increment does **not** change

Do not implement FUT-108+ before P0 honesty + 09-21…10-22 SYS slices. Do not touch RAF, map generation, turn order, or damage formulas (`calcScaledDamage` stays a **read** for scoring; do not add `enemy.level` into it as a stealth stat stick). Do not copy #495 / #498 / #644…#659 / #700 / #709 / **#842** / **#861** / **#911** / **#924** into this docs-only change. Do not edit the parent catalog. Do not “fix late game” by keeping Fire Bolt or by stuffing Motoko `void_collapse` into bishop kits. Do not re-file FUT-83 (pack healer `pickBestAlly`). Do not turn FUT-23’s chance table into `if (player.level >= 44) isSummoner = true`. Do not give enemies `shadow_strike` until SYS-13 understands `diagonal` + `minRange` + `lineOfSight: false`.

---

## 2. Design additions (normative)

1. **Do not recycle 09-21…10-22 ids.** This file starts at SYS-90 / FUT-108.
2. **Kit resolve is starter-id ∪ catalog, not catalog-only.** `buildEnemyKit` emits authored starter / kit ids. The lookup pool must contain those ids even when Motoko `defaultSpells` is non-empty. Motoko extras stay out of the pack kit until a `SpellScoreProfile` **and** SYS-13 legality exist for `minRange` / `linear` / `diagonal` / `freeCells` / `lineOfSight`. SYS-90. Open #911 is the writer.
3. **Self spells target self.** `targetType: "self"` (and range 0) is legal only on the acting unit. Healer decide must include the caster in the heal candidate set (or a dedicated self branch) and must not spend the turn approaching an ally the spell cannot hit. Ally-heal ids (when they exist) stay FUT-83 / SYS-05. SYS-91.
4. **Every walker scores public dest hazards.** `filterHazardCandidates` (or the enumerator equivalent) runs on `stepToward` / `stepFlank` / legal-cast dests, not only `stepAway`. The 50% HP gate is still too weak (POS-04); lifting it is not a cheat. SYS-92.
5. **Retreat is from the nearest living opponent that can currently hit, else the highest-threat in Chebyshev order.** Snapshot insertion order and SYS-30 prepend are not a threat axis. SYS-93.
6. **Kite band is spell metadata.** Too-close = `dist < max(1, minRange ?? 1)` or role floor from `enemySpellRange`; too-far = `dist > enemySpellRange(preferred)`. No integer `MIN_KITE_RANGE`. SYS-94.
7. **Heal profiles include advertised buffs.** Once apply writes `buffStat` (#924 / SYS-95), EV adds the public CHC duration; until then, do not pretend the buff landed. Duplicate self-CHC recast is FUT-64 once SYS-10 snapshots effects.
8. **T6+ still stacks** on the parent enumerator. No integer tier table. No `if (aiTier >= 8)`. No `if (level >= X)`.

---

## 3. System proposals (2026-10-23)

### AI-SYS-90

**AI_ID:** AI-SYS-90  
**NAME:** Pack kit ids must resolve when Motoko `defaultSpells` is the live pool  
**ROLE:** system  
**SOPHISTICATION:** T0+ / honesty for SYS-02 / SYS-09 / SYS-05  
**DECISION_RULES:** Live `assignEnemySpells` (WX **11919–11923**) maps `buildEnemyKit` ids through `normalizedSpellPool.find`. When `filteredBackendSpells.length > 0` (WX **2688–2690**) that pool is Motoko `defaultSpells` (`admin.mo` **168–191**): `shadow_strike`, `soul_rend`, `vampire_bite`, `reflect_barrier`, `thunder_clap`, `void_collapse`. Kit ids `starter-frost` / `physical_attack` / `starter-heal` / `spell-inferno` are missing → `spells: []`. Empty kit ⇒ generic decide ⇒ `!didAct` Fire Bolt (WX **16712**). After this module: resolve kit ids from an authored starter/kit registry **union** the live catalog. Missing catalog row must not drop the kit id. Do **not** substitute Motoko `shadow_strike` (`diagonal: true`, `lineOfSight: false`, `minRange: 1`) for frost — SYS-13 cannot score those flags yet (`enemyCastGeometryOk` is Chebyshev + LoS-default-on only, `targeting.ts` **166–177**). Open **#911** already does the starter fallback on its branch — **do not re-implement in a docs PR or a competing assign patch.** `#861` is player auto-summon empty kit. SYS-09 NaN zone floor still needs its own slice so zone-1 Blood Mend exists to resolve.  
**SCORING_MODEL:** N/A (authoring). Empty kit ⇒ no legal cast ⇒ SYS-05 melee/skip, never `e-firebolt`.  
**SPELL_REQUIREMENTS:** Profiled kit ids already in `ENEMY_KITS` (`enemyAI.ts` **163–185**). Motoko extras stay out until profiled.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always (honesty). A player-400 remnant still needs frost if the kit says frost — not a last Motoko band.  
**ENEMY_ARCHETYPES:** All pack pieces (bishop/queen/king empty today).  
**PLAYER_COUNTERPLAY:** N/A (honesty). After resolve, frost is readable range 4, not a hidden bolt.  
**EDGE_CASES:** Backend empty → starter pool already works (do not break that). `usableByEnemy: false` default on the normalize spread (WX **2695–2700**) is overwritten by `...s`; Motoko rows set `usableByEnemy = true` — that must not leak them into `ENEMY_KITS`.  
**IMPLEMENTATION_COMPLEXITY:** None in this PR (docs). Low on #911’s branch.  
**TEST_SCENARIOS:** Non-empty Motoko catalog, bishop zone-0 → `spells` contains `starter-frost`. Grep assign path for `normalizedSpellPool.find` as the *only* lookup → gone after SYS-90 / #911. Adjacent empty-kit bishop → Crush or skip, never `e-firebolt`.  
**STATUS:** PROPOSED

### AI-SYS-91

**AI_ID:** AI-SYS-91  
**NAME:** `targetType: "self"` heals target the acting unit, not an ally at range 0  
**ROLE:** system  
**SOPHISTICATION:** T1+ / honesty for ROL-04 / SYS-04 / SYS-05 / SYS-13  
**DECISION_RULES:** `starter-heal` is self / range 0 (`spellData.ts` **85–101**). `decideHealer` (**1092–1112**) scores *other* allies (`id !== enemy.id`, **1674–1676**) and requires `chebyshev <= 0`. Impossible unless two units share a tile. Queen inferred healer (SYS-04) never Blood-Mends; 20% HP falls through to `decideCaster` (**1166–1168**). Wisp `decideSummonHealer` (**2481–2519**) is the same self spell on allies — player wisp never heals. After this module: (1) self spells enumerate the caster as the only legal target (SYS-13 `targetType`); (2) if own `hpFrac` is below `ENEMY_HEAL_ALLY_THRESHOLD_PCT` (or a self-heal threshold), cast on self; (3) ally-heal ids (when profiled, range > 0, `targetType: "ally"`) still use FUT-83 / `pickBestAlly`; (4) apply already self-heals range 0 (WX **16648**) — decide must emit `targetId` = caster / `"player"`-side equivalent, not a rook id (SYS-42 Crush-the-ward). Do not treat Rallying Cry (`usableByEnemy: false`, **432**) as pack ally heal (SYS-41). Do not Fire-Bolt a failed ally dest (SYS-05).  
**SCORING_MODEL:** Illegal ally dest for a self spell ⇒ −∞. Self EV = healAmount × (1 − ownHpFrac) plus advertised buff once SYS-95 writes it.  
**SPELL_REQUIREMENTS:** `starter-heal` profile: category heal, `targetType: "self"`, range 0. No ally-heal starter exists today — do not invent one by ignoring range.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always when a self-heal id is in the kit. T0 may still skip. Not `if (level >= 10) selfHeal`.  
**ENEMY_ARCHETYPES:** healer (queen today, wrongly); wisp summon healer.  
**PLAYER_COUNTERPLAY:** Chip a queen to 40% HP; she must Blood-Mend instead of frost if the self spell is ready and she is not a SYS-04 artillery role. After SYS-04, artillery queens frost even with Blood Mend in kit.  
**EDGE_CASES:** Full-HP self → do not waste AP (RES-06). `kind: "cast"` self while adjacent to the player must not fall through to Fire Bolt (SYS-05 / SYS-42). Healer Chebyshev-without-LoS stays SYS-23.  
**IMPLEMENTATION_COMPLEXITY:** Low (candidate set + targetType gate).  
**TEST_SCENARIOS:** Queen 20/80, Blood Mend ready, ally rook 10/40 at dist 2 → `targetId` is the queen, dest origin, kind cast. Wisp, player 20/100 at dist 2, starter-heal only → approach or skip, **not** `cast` on the player with range 0.  
**STATUS:** PROPOSED

### AI-SYS-92

**AI_ID:** AI-SYS-92  
**NAME:** `stepToward` / `stepFlank` / legal-cast dests must run the public hazard filter  
**ROLE:** system  
**SOPHISTICATION:** T1+ / honesty for POS-04 / SYS-43  
**DECISION_RULES:** `filterHazardCandidates` (**425–441**) is called only from `stepAway` (**630**). Approach (`stepToward` **579–611**), flank (**643–679**), `findNearestLegalCastTile` (**787–824**), and `repositionForLOS` (**749–768**) will dest-commit onto lava/spikes/ice. Caster `closes-in` (**1005–1047**) is the live move-then-cast path (SYS-79). After this module: every dest the enumerator (SYS-03) or these walkers emit is filtered with the same public hazard map `ctx.hazardTiles`. Prefer a non-hazard reachable tile. If every tile is hazardous, take the cheapest (POS-04 / FUT-93) — do not teleport over the lava (SYS-43 still bills the landed tile). Do not ignore LoS to “sidestep” onto spikes. Unknown keys (thorned / void rift) stay FUT-09, not a silent `return true` forever.  
**SCORING_MODEL:** Hazard dest −`wLava`/`wSpike`/`wIce` even at full HP (POS-04 lift). Illegal if SYS-58 occupancy fails.  
**SPELL_REQUIREMENTS:** None (movement). Closes-in still needs a profiled frost (SYS-79 / SYS-90).  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always for any enemy that walks. T0 may still step onto lava; T1+ must not unless EV to kill beats the public tick (FUT-93). Not `aiTier >= 3`.  
**ENEMY_ARCHETYPES:** caster, charger, flanker, generic, hunter, archer, bomber, healer approach.  
**PLAYER_COUNTERPLAY:** Stand so the only frost tile is lava; T1+ holds or takes the tick (FUT-93), T0 may still close in.  
**EDGE_CASES:** `kind: "skip"` retreat dest is already `stepAway` (filtered). SYS-05: landing Chebyshev 1 on lava must not Fire-Bolt. Berserker may accept lava if killableNow (role invert, FUT-107).  
**IMPLEMENTATION_COMPLEXITY:** Low (reuse helper on the other walkers).  
**TEST_SCENARIOS:** Bishop 10% HP, frost needs dest (1,0) which is lava, dest (0,1) floor in reachable → dest (0,1). Full-HP bishop, same tiles → still prefer floor (POS-04 lift) once this slice ships.  
**STATUS:** PROPOSED

### AI-SYS-93

**AI_ID:** AI-SYS-93  
**NAME:** Caster retreat steps away from the nearest living threat, not `opponents[0]`  
**ROLE:** system  
**SOPHISTICATION:** T1+ / honesty for POS-02 / SYS-30  
**DECISION_RULES:** `decideCaster` (**928–944**) uses `opponents[0]` before `scoreTargets`. Pack snapshot pushes player-side summons first and the player last (WX **16274–16302**). SYS-30 prepends a wisp when focus is unset (**1682–1690**). Retreat then `stepAway` from a backline summon while the player is Chebyshev 1. After this module: the retreat threat is the living opponent with minimum Chebyshev to the caster (tie: highest `threatValue` / focus id if SYS-08 is wired). Do not use snapshot insertion order. Do not use the SYS-30 prepend list. `kind` is `move` (POS-02), dest-commit paid (SYS-25), no Fire Bolt (SYS-05). Flanker/generic retreat already uses `scoreTargets()[0]` (**1314–1320**, **1509–1516**) — still not nearest-in-melee; fold them onto the same nearest-threat helper so a 1 HP wisp at dist 6 does not beat an adjacent player for *retreat*. Lookahead kill remains SYS-85.  
**SCORING_MODEL:** Retreat dest maximizes Chebyshev to the chosen threat among reachable non-hazard tiles (SYS-92).  
**SPELL_REQUIREMENTS:** None (move). Self-heal SYS-91 may outrank retreat if Blood Mend is ready and own HP is the problem.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always for T1+ kiter/caster/healer retreat. T0 may skip. Not `if (aiTier >= 3)`.  
**ENEMY_ARCHETYPES:** caster, generic, flanker (retreat branch).  
**PLAYER_COUNTERPLAY:** Stand adjacent; they must step away from *you*, not from a wisp two tiles behind. Occupy escape tiles (POS-08).  
**EDGE_CASES:** No opponents → hold. All exits occupied → accept melee, no bolt. Harass prepend must not reappear as a retreat axis after SYS-30 deletes it from targeting.  
**IMPLEMENTATION_COMPLEXITY:** Low (shared nearest-threat helper).  
**TEST_SCENARIOS:** Bishop 20% HP at (2,2), player (2,3), wisp (0,0) prepended → dest steps away from (2,3), not from (0,0). No wisp, player last in snapshot, summon at (5,5) first → still away from the player if the player is closer.  
**STATUS:** PROPOSED

### AI-SYS-94

**AI_ID:** AI-SYS-94  
**NAME:** Archer kite band is `enemySpellRange` / `minRange`, not `MIN_KITE_RANGE = 3`  
**ROLE:** system  
**SOPHISTICATION:** T1+ / honesty for POS-01 / ROL-08 (kiter)  
**DECISION_RULES:** `decideSummonArcher` (**2324–2331**) hardcodes `const MIN_KITE_RANGE = 3` for too-close, and only reads `preferred?.range` for too-far. `starter-poison` range is 4 (`spellData.ts` **56**); `spell-slow` range is 3 (**360**). `enemyCastGeometryOk` already uses `enemySpellRange` (`targeting.ts` **133–137**, **166–177**). After this module: too-close iff `dist < max(1, Number(spell.minRange ?? 1))` when `minRange` is present, else iff `dist < 2` for a range≥3 kiter (stay out of melee) — **derived from the assigned spell**, not a literal 3. Too-far iff `dist > enemySpellRange(preferred)`. Preferred remains poison ?? slow but each check uses *that spell’s* metadata (SYS-02). Do not key kite on `aiTier` or absolute level. Do not peek the player’s selected spell. FUT-54 (strafe) and FUT-100 (Attack-Nearest) stack after this.  
**SCORING_MODEL:** `U(dest) += wRange` if `minRange ≤ dist ≤ maxRange`; `−wMelee` if `dist ≤ 1`.  
**SPELL_REQUIREMENTS:** Profiled kiter id (`starter-poison` DoT EV still SYS-39; slow is debuff). Do not emit Inferno as a kiter spell.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always for archer/kiter role. A remnant kiter at any absolute level uses the same band.  
**ENEMY_ARCHETYPES:** archer, kiter.  
**PLAYER_COUNTERPLAY:** Close to Chebyshev 1; they must spend MP stepping away if a floor tile exists (SYS-92). Bring a minRange-2 spell of your own — they do not copy it.  
**EDGE_CASES:** `preferred` null → hold / advance, no magic 3. `Number(bigint range)` is 4 for poison — do not `Number(undefined)`. Pack apply of poison still SYS-39 (damage 0).  
**IMPLEMENTATION_COMPLEXITY:** Low (delete the constant; read the spell).  
**TEST_SCENARIOS:** Poison preferred, dist 3 → hold (in range 4, not melee). Dist 2 → stepAway. Dist 5 → stepToward. Slow-only, dist 3 → hold. Dist 4 → stepToward (slow range 3).  
**STATUS:** PROPOSED

### AI-SYS-95

**AI_ID:** AI-SYS-95  
**NAME:** Range-0 heal apply must write advertised `buffStat` (Blood Mend / Rally CHC)  
**ROLE:** system  
**SOPHISTICATION:** T1+ / honesty for SYS-05 / SYS-02 / FUT-64  
**DECISION_RULES:** Blood Mend (`spellData.ts` **96–98**) and Rallying Cry (**428–430**) advertise `buffStat: "chc"`, `buffModifier: 0.15`, duration 2. WX **16648–16670** heals HP via `hpAfterHeal` and returns — no buff arm. `decideHealer` never even reaches this for Blood Mend today (SYS-91). After this module: when apply accepts a range-0 self heal, also apply the public buff the card shows, using the same `applyActiveEffect` path other enemy buffs will use. Until the write exists, scoring must not add CHC EV (hidden information). Open **#924** extracts a sidecar `wxEnemyHealBuffExecute` and does **not** restack WX / `enemyAI.ts` — **do not re-implement; do not merge that sidecar by hand in a competing PR.** `#857` / `#862` / `#692` own modifier 0.15 vs 1.15 conversion — do not fork. Rallying Cry stays `usableByEnemy: false` until SYS-41.  
**SCORING_MODEL:** After the write: `U(selfHeal) += healAmount*(1-hpFrac) + wBuff*chcGap*duration` if the caster lacks the buff (FUT-64 / SYS-10). Before the write: healAmount term only.  
**SPELL_REQUIREMENTS:** Self-heal profiles that declare `buffStat`. Do not invent a CHC buff the card does not list.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always when the apply path runs a range-0 heal. Not a level gate.  
**ENEMY_ARCHETYPES:** healer (queen self-heal after SYS-91); king only after Rally is enemy-legal.  
**PLAYER_COUNTERPLAY:** The CHC icon must appear on the enemy after Blood Mend, same as the player card. You can wait the 2 turns.  
**EDGE_CASES:** Heal miss / Windstorm does not apply to range-0 self (SYS-70 is ranged). Do not roll SYS-82 crit on a heal. `#924` title says “advertised CHC” — that is the buffStat write, not a chance-to-heal crit.  
**IMPLEMENTATION_COMPLEXITY:** None in this PR (docs). Low on #924’s branch.  
**TEST_SCENARIOS:** Queen casts Blood Mend → HP +12 and a public CHC buff 2 turns after SYS-91+#924. Apply without buffStat → test fails.  
**STATUS:** PROPOSED

---

## 4. T6+ reusable modules (2026-10-23)

Attach via parent §4 sigmoid. Stack; do not replace T0–T5 or FUT-01…107. Do not re-file FUT-83 (pack healer ward), FUT-23 (chance formula), FUT-93 (only-lava EV), FUT-54 (strafe), or FUT-64 (buff recast hygiene).

### AI-FUT-108

**AI_ID:** AI-FUT-108  
**NAME:** Self-heal / self-buff when the acting unit is the wounded one  
**ROLE:** healer / resource  
**SOPHISTICATION:** T6 (ROL-04 / RES-04 / ADV-07; SYS-91 / SYS-95 / SYS-04)  
**DECISION_RULES:** After SYS-91 legality and SYS-04 role: a T2+ **healer role** (explicit, not heal-first inference) casts the self profile when `ownHpFrac` is below the heal threshold and the spell is SYS-13 legal this turn. Artillery queens with Blood Mend in kit still frost (SYS-04). After SYS-95, the CHC term is public. On CD / full HP, fall through to frost/guard — do not idle (FUT-55). Do not ally-cast a self spell. Overlay attach remains §4 sigmoid, not `if (enemy.level >= 20) bloodMend`.  
**SCORING_MODEL:** `U(selfHeal) = wHeal*(1-ownHpFrac)*healAmount + wBuff*publicChc`; `U(frost)` is SYS-80 kit EV. Pick max among legal actions.  
**SPELL_REQUIREMENTS:** Profiled `starter-heal`. Rallying Cry only after `usableByEnemy` + SYS-41.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.2` for explicit healer role. Remnant healers at any absolute level may attach; T0 skips.  
**ENEMY_ARCHETYPES:** healer, support.  
**PLAYER_COUNTERPLAY:** Burst through the heal; Null Field does not skip Blood Mend (SYS-65).  
**EDGE_CASES:** Adjacent player + self-heal ready + killableNow on the player → assassin/charger invert (FUT-107) may strike; healer role still prefers the mend.  
**IMPLEMENTATION_COMPLEXITY:** Low after SYS-91.  
**TEST_SCENARIOS:** Explicit healer queen 20% HP, Blood Mend ready, player 80% → kind cast self. Same queen role artillery → frost. Player 400 vs remnant healer `peer < 0` → module may be off, but SYS-91 still forbids ally-range-0.  
**STATUS:** PROPOSED

### AI-FUT-109

**AI_ID:** AI-FUT-109  
**NAME:** Kit union stays starter-profiled as relative difficulty rises  
**ROLE:** system / spell-awareness  
**SOPHISTICATION:** T6 (SYS-02 / SYS-09 / SYS-90)  
**DECISION_RULES:** After SYS-90 / #911, T2+ kits may *add* a second profiled id from the **authored** kit table as `peer` rises (bishop: frost then poison — already `ENEMY_KITS` zone≥1). Additions still require a profile + apply branch. Motoko `shadow_strike` / `void_collapse` / `thunder_clap` stay out until SYS-13 + a profile exist (`diagonal`, `minRange`, `aoe`, attract). Do not replace frost with a Motoko id because the catalog is “higher level.” Unbounded: a year-later kit row is a new id + profile, not `if (level >= 900) void_collapse`.  
**SCORING_MODEL:** Parent `U` per profile. Missing profile ⇒ illegal.  
**SPELL_REQUIREMENTS:** One profile per emitted id.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Zone width is SYS-09 relative difficulty, not Motoko `minLevel = 30` on Void Collapse as an AI gate.  
**ENEMY_ARCHETYPES:** All pack pieces.  
**PLAYER_COUNTERPLAY:** Read the kit on the initiative strip (SYS-69 dummy stats are not the kit).  
**EDGE_CASES:** Empty Motoko-only pool after a failed #911 merge → SYS-90 still required. Do not emit `spell-inferno` (`damage: 0`) from zone≥2 queens until SYS-39.  
**IMPLEMENTATION_COMPLEXITY:** Low after SYS-90 + SYS-09.  
**TEST_SCENARIOS:** Motoko catalog live, bishop → frost present. Peer high, SYS-09 fixed → frost+poison, never `shadow_strike`.  
**STATUS:** PROPOSED

### AI-FUT-110

**AI_ID:** AI-FUT-110  
**NAME:** Approach path scores per-tile public hazards  
**ROLE:** positioning  
**SOPHISTICATION:** T6 (POS-04 / POS-05; SYS-92 / SYS-43 / FUT-93)  
**DECISION_RULES:** After SYS-92, T2+ walkers add the public per-tile cost of the **path** (4-dir, SYS-15), not only the dest. Lava/spikes on an intermediate tile that dest-commit would skip (SYS-43 bills dest today) still penalize choosing that dest until dest-commit walks the chain. T0 may still jump. Do not path through portals (SYS-48 / SYS-58). FUT-93 remains the “only lava *cast* tile” EV — this module is the walk.  
**SCORING_MODEL:** `U(dest) -= Σ publicHazard(tile) for tiles on the 4-dir path`. Illegal occupancy −∞.  
**SPELL_REQUIREMENTS:** None.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.15`. Remnants may omit; peer casters attach.  
**ENEMY_ARCHETYPES:** caster, kiter, healer, flanker; berserker off unless killableNow.  
**PLAYER_COUNTERPLAY:** Paint the frost approach with lava; they take the long floor path or hold.  
**EDGE_CASES:** Frozen/Slime already double step cost (`enemyWalkMp.ts` **21–29**) — do not double-count as a hazard tick. Thorned ground stays FUT-09 until the tile key is on `hazardTiles`.  
**IMPLEMENTATION_COMPLEXITY:** Medium (path recover from BFS parents; dest-commit still SYS-43/58).  
**TEST_SCENARIOS:** Origin (0,0), dest (2,0) reachable via (1,0) lava and via (0,1)-(1,1)-(2,1) floor → T2+ prefers the floor path’s dest, not (2,0) if that BFS parent is lava.  
**STATUS:** PROPOSED

### AI-FUT-111

**AI_ID:** AI-FUT-111  
**NAME:** Retreat / kite away from the nearest hit-threat, then toward support  
**ROLE:** positioning / team  
**SOPHISTICATION:** T6 (POS-02 / TEM-07 / ADV-08; SYS-93 / FUT-107)  
**DECISION_RULES:** After SYS-93, T3+ casters/kiters/healers pick the retreat dest that increases Chebyshev to the nearest threat **and** reduces Chebyshev to a living allied healer/protector if one exists (TEM-07). T1 may only step away (SYS-93). Do not retreat through the player. Do not use `allyCount` raw (SYS-83) — filter `side === "enemy" && !isSummon` or explicit protector role. Pack healer ward scoring stays FUT-83.  
**SCORING_MODEL:** `U(dest) = wLeaveMelee*(distThreatAfter-distThreatBefore) + wSupport*(1-distWard/max)`.  
**SPELL_REQUIREMENTS:** None, or leftover self-heal (FUT-108) if already in range 0.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.45` when living allied support ≥ 1. Solo remnants skip the support term.  
**ENEMY_ARCHETYPES:** kiter, caster, artillery, healer.  
**PLAYER_COUNTERPLAY:** Kill the pack healer first; they then only kite from you. Body-block the ward.  
**EDGE_CASES:** Ward is the acting unit → support term 0. SYS-91 self-heal can outrank the walk.  
**IMPLEMENTATION_COMPLEXITY:** Low after SYS-93.  
**TEST_SCENARIOS:** Bishop 20% HP, player adjacent south, allied healer north 3 tiles, both dests free → dest north. No ally → dest north or east away from player, not toward the distant wisp.  
**STATUS:** PROPOSED

### AI-FUT-112

**AI_ID:** AI-FUT-112  
**NAME:** Kiter holds the assigned spell’s `[minRange, range]` band  
**ROLE:** positioning / artillery  
**SOPHISTICATION:** T6 (POS-01 / ROL-08; SYS-94 / FUT-54 / FUT-100)  
**DECISION_RULES:** After SYS-94, T2+ kiters/artillery score dests inside the **profiled** band of the spell they would cast this turn (poison 4, slow 3, future minRange-2 artillery 6). Perpendicular strafe (FUT-54) prefers a same-band dest that is not Chebyshev 1. Attack-Nearest punish (FUT-100) stacks when the player’s public AP can strike. T0 may still `MIN_KITE`-style clump. Do not read leftover strip AP (SYS-54).  
**SCORING_MODEL:** Parent range term from SYS-94; `+wStrafe` if dest is perpendicular and in band.  
**SPELL_REQUIREMENTS:** Profiled kiter/artillery id. Bishop frost 4 uses the same band helper (POS-01) — do not keep a second magic 3.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.35` for kiter/artillery roles. Unbounded: new spells bring new `range`/`minRange`, not a new integer tier.  
**ENEMY_ARCHETYPES:** kiter, artillery, archer, caster.  
**PLAYER_COUNTERPLAY:** Walk to dist 1; they spend MP. Break LoS (SYS-23 / reposition).  
**EDGE_CASES:** Paper Windstorm does not shrink AI range (SYS-70). `starter-frost` is 4, not 3.  
**IMPLEMENTATION_COMPLEXITY:** Low after SYS-94.  
**TEST_SCENARIOS:** Archer poison, dist 4 → hold and cast if LoS (SYS-39 EV still required). Dist 1 → stepAway to 2+. Bishop frost, dist 4 → hold, not step to 3.  
**STATUS:** PROPOSED

### AI-FUT-113

**AI_ID:** AI-FUT-113  
**NAME:** Self-heal EV includes the public CHC buff once apply writes it  
**ROLE:** resource / advanced  
**SOPHISTICATION:** T6 (RES-04 / ADV-06; SYS-95 / SYS-91 / FUT-64 / SYS-10)  
**DECISION_RULES:** After SYS-95 / #924 and SYS-10 snapshot of public effects: T3+ healers add the advertised CHC duration to self-heal EV **only if** the caster does not already have that buff (FUT-64). Before the apply write, this term is 0 (do not cheat a hidden buff). Crit EV on *damage* stays SYS-82 / FUT-101 — do not bake heal-crit. Unbounded: a later self-heal that buffs RES uses the same profile shape (`buffStat` + duration + “already has”).  
**SCORING_MODEL:** `U += wBuff * visibleStatGap(buffStat) * remainingDuration` if `!hasPublicBuff`.  
**SPELL_REQUIREMENTS:** Self-heal profile with `buffStat`.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.5` once SYS-95 exists. Remnants may heal without the buff term.  
**ENEMY_ARCHETYPES:** healer, support.  
**PLAYER_COUNTERPLAY:** Dispel / wait out the 2-turn CHC. Do not assume they recast every turn (FUT-64).  
**EDGE_CASES:** `#924` sidecar vs inline WX — tests must hit the path apply actually runs. Modifier 0.15 vs 1.15 is #692, not this module.  
**IMPLEMENTATION_COMPLEXITY:** Low after SYS-95 + SYS-10.  
**TEST_SCENARIOS:** Queen 80% HP, no CHC buff, Blood Mend ready → may still cast for the buff at T3+ if frost EV is low. Queen already has CHC 2 turns → frost/hold, no recast.  
**STATUS:** PROPOSED

---

## 5. Spell-awareness contract (reminder)

Unchanged: no profile + apply ⇒ not in kit, not in elite extras, `usableByEnemy` treated as false in the enumerator.

Still `usableByEnemy: true` without a working decide+apply pair (do not give these to AI until FUT-22 / FUT-25 / FUT-31 / apply):

`spell-swap`, `spell-mark`, `spell-sacrifice`, `spell-lifesteal-nova`, `spell-enrage`, `spell-haste`, `spell-weaken`, `spell-expose`, `spell-drain-courage`, `spell-cursed-wound`, `spell-shadow-veil`, `spell-frost-nova`, `spell-inferno` (DoT `damage: 0`), `starter-poison` / `spell-venom-strike`, `starter-shield` / `spell-iron-skin`.

Keep `usableByEnemy: false` until profiled: barrier, mirror, timestep, rallying-cry, sentinel/bomber/wisp summons.

`starter-heal` is self-only (`range: 0`, `targetType: "self"`). It cannot satisfy ROL-04 ally heal. SYS-91 is the profile: target the caster. SYS-13 must keep range-0 **self** legal.

Motoko `defaultSpells` (`shadow_strike`, `soul_rend`, `vampire_bite`, `reflect_barrier`, `thunder_clap`, `void_collapse`) are `usableByEnemy: true` but have `minRange` / `diagonal` / `lineOfSight: false` / attract AoE that `enemyCastGeometryOk` does not implement. SYS-90 forbids using them as frost substitutes. Do not assign them until a profile exists.

`summon-dire-wolf` / `summon-archer` are `usableByEnemy: true` with range 2. SYS-86 is the profile: ground dest in range. Do not treat midpoint spawn as “understanding” the spell.

Apply now has a pack DoT writer (WX **16609–16625**) and a no-damage debuff writer (**16671–16700**). That does **not** authorize Inferno/poison/slow in kits. Decide still scores `damage <= 0` as 0 (SYS-02 / SYS-39). Open #842’s DoT-before-melee gate is apply honesty for *hostile kits after they exist*, not a reason to emit Inferno from `buildEnemyKit`.

Kit frost staying at spellbook damage (SYS-72) is **not** a reason to assign Inferno. SYS-79’s kit-pick still requires `damage > 0`. Frost range is 4 (`spellData.ts` 131). Poison range is 4 (`spellData.ts` 56).

---

## 6. Implementation order (this increment)

Do not start FUT-108+ first. Do not start T6+ from earlier increments before P0 honesty.

1. SYS-05 (Fire Bolt WX **16712**, AP/MP debit, ally heal WX **16648**) — still P0. This also removes the `level/5` bolt cheat (SYS-72). Empty-kit bishops (SYS-90) currently *only* Fire-Bolt.  
2. SYS-01 — replace `computeAITier` (`combatMath.ts` 36–52) and the `aiTier >= 5/10` gates (WX **15507** / **15594**).  
3. SYS-73 — drop the 999 spawn ceiling so SYS-01 `peer` still works at high player level.  
4. **SYS-90** — prefer merge/follow **#911**; do not double-patch assign. Then SYS-09 zone key. Do not emit Motoko extras.  
5. SYS-13 + SYS-06 + SYS-11 + SYS-20 — side-aware legality. `enemyCastGeometryOk` is not sufficient.  
6. SYS-78 then SYS-84 + FUT-102 — HUD max on the row **and** the scorer reads it.  
7. **SYS-91** + FUT-108 — self-spell Blood Mend; then SYS-04 so queens are not forced healers.  
8. **SYS-95** — prefer merge/follow **#924** for the heal `buffStat` write; then FUT-113.  
9. SYS-79 + FUT-96 — kit-pick without origin-range; move-then-cast works.  
10. **SYS-92** + FUT-110 — approach hazards.  
11. **SYS-93** + FUT-111 — retreat from the real threat, then toward support.  
12. **SYS-94** + FUT-112 — kite from spell metadata.  
13. SYS-86 / SYS-89 + FUT-104 — legal summon dest + kit fallthrough (still #874).  
14. Parent T2–T5 roles / team / adaptive; remaining FUT-01…107.

Each slice: `engine/enemyAI*.test.ts`, zero WX drive-by, no RAF / map gen / turn order / damage-formula edits unless a **named** follow-up. Scoring **reads** RES/SR/CHC; it does not change `calcScaledDamage`.

---

## 7. Extra test scenarios

| ID | Setup | Expect |
| :--- | :--- | :--- |
| TS-KITPOOL | Motoko `defaultSpells` non-empty, bishop `buildEnemyKit` | `spells` contains `starter-frost`, not `[]` (SYS-90 / #911). |
| TS-KITBOLT | Empty kit, Chebyshev 1 | Crush or skip; never `e-firebolt` (SYS-05 / SYS-90). |
| TS-SELFHEAL | Queen 20/80, Blood Mend, rook 10/40 dist 2 | Cast on queen, not rook (SYS-91). |
| TS-WISPSELF | Wisp, player 20/100 dist 2, starter-heal only | No range-0 cast on the player (SYS-91). |
| TS-HVAPPR | Bishop 10% HP, lava on stepToward dest, floor alt | Dest is the floor tile (SYS-92). |
| TS-RETNEAR | Bishop 20% HP, player adjacent, wisp prepended at dist 6 | `stepAway` from the player (SYS-93). |
| TS-KITE4 | Archer poison range 4, dist 3 | Hold (in band), not stepAway because `MIN_KITE_RANGE === 3` (SYS-94). |
| TS-KITE2 | Archer poison, dist 2 | stepAway (SYS-94). |
| TS-HEALCHC | Blood Mend apply after SYS-91 | HP + advertised CHC buff (SYS-95 / #924). |
| TS-SHADOW | Motoko catalog live | Bishop kit does **not** contain `shadow_strike` (SYS-90 / FUT-109). |
| TS-BOLT3 | Failed frost, Chebyshev 1 | Crush or skip; never `e-firebolt` (WX 16712). |
| TS-PEER3K | Player 3000, enemy 3000 | Not forced T5; remnant 400 stays low tier (FUT-92). |

Parent and 2026-09-01…10-22 TS-* rows still apply (line numbers in §1.2). Frost examples use live range **4**. Poison kite examples use live range **4**.

---

## 8. Mapping (new gaps → ids)

| Request / gap | Primary AI_ID |
| :--- | :--- |
| Motoko catalog drops starter kit ids (open #911) | AI-SYS-90 / AI-FUT-109 |
| Blood Mend / Rally are self range 0; healer targets allies | AI-SYS-91 / AI-FUT-108 |
| `stepToward` never calls `filterHazardCandidates` | AI-SYS-92 / AI-FUT-110 |
| Caster retreat uses `opponents[0]` / harass prepend | AI-SYS-93 / AI-FUT-111 |
| Archer `MIN_KITE_RANGE = 3` vs poison range 4 | AI-SYS-94 / AI-FUT-112 |
| Range-0 heal drops advertised `buffStat` CHC (open #924) | AI-SYS-95 / AI-FUT-113 |

T0–T5 requested list (positioning, targeting, resources, roles, team, adaptive) remains parent §19. Nothing in that list is implemented. Higher-level enemies still get harder from **modules on the sigmoid** and from **honest relative spawn** (SYS-73 / FUT-92 / SYS-89), not from `computeAITier(enemyLevel)`, not from a kit-less bolt, not from an empty Motoko kit, and not from a healer who cannot cast the self spell on the card.

Requested capability → already-catalogued parent id (unchanged; still **PROPOSED**):

| Request | Parent id |
| :--- | :--- |
| maintain optimal range / retreat / approach vulnerable / avoid hazards / exploit terrain / avoid AoE clustering / protect allies / escape routes | POS-01…08 (approach hazards = SYS-92; kite band = SYS-94) |
| low-HP / high-threat / support / summons / resistance / kill / strategic | TGT-01…07 (bar = SYS-84) |
| AP combinations / move-then-attack / attack-then-retreat / sequencing / cooldown / waste | RES-01…06 (self-heal spend = FUT-108) |
| tank … protector | ROL-01…10 (healer self = SYS-91; summoner = SYS-86/89) |
| focus fire / protect support / exploit debuffs / avoid duplicate debuffs / coordinated AoE / formations / retreat toward support | TEM-01…07 (retreat-to-support = FUT-111) |
| estimate threat / punish positioning / adapt HP / adapt AP-MP / summons / status / own HP / survival vs aggression | ADV-01…08 (own HP heal = FUT-108; CHC buff = FUT-113) |

Every row above is **STATUS: PROPOSED**. No production AI in this change.
