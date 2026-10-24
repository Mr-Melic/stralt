# Advanced Enemy AI Evolution — 2026-10-24 increment

**Status:** PROPOSED (design only; no production code in this change)  
**Date:** 2026-10-24  
**Parent catalog:** [`ENEMY_AI_EVOLUTION.md`](./ENEMY_AI_EVOLUTION.md) (T0–T5)  
**Prior increments:** [`ENEMY_AI_EVOLUTION_2026-09-01.md`](./ENEMY_AI_EVOLUTION_2026-09-01.md) · [`ENEMY_AI_EVOLUTION_2026-09-02.md`](./ENEMY_AI_EVOLUTION_2026-09-02.md) · [`ENEMY_AI_EVOLUTION_2026-09-21.md`](./ENEMY_AI_EVOLUTION_2026-09-21.md) (open PR #351; SYS-22…32, FUT-36…47 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-22.md`](./ENEMY_AI_EVOLUTION_2026-09-22.md) (open PR #416; SYS-33…35, FUT-48…53 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-23.md`](./ENEMY_AI_EVOLUTION_2026-09-23.md) (open PR #458; SYS-36…41, FUT-54…59 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-24.md`](./ENEMY_AI_EVOLUTION_2026-09-24.md) (open PR #506; SYS-42…47, FUT-60…65 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-25.md`](./ENEMY_AI_EVOLUTION_2026-09-25.md) (open PR #565; SYS-48…53, FUT-66…71 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-26.md`](./ENEMY_AI_EVOLUTION_2026-09-26.md) (open PR #633; SYS-54…59, FUT-72…77 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-27.md`](./ENEMY_AI_EVOLUTION_2026-09-27.md) (open PR #689; SYS-60…65, FUT-78…83 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-28.md`](./ENEMY_AI_EVOLUTION_2026-09-28.md) (open PR #723; SYS-66…71, FUT-84…89 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-29.md`](./ENEMY_AI_EVOLUTION_2026-09-29.md) (open PR #804; SYS-72…77, FUT-90…95 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-10-21.md`](./ENEMY_AI_EVOLUTION_2026-10-21.md) (open PR #821; SYS-78…83, FUT-96…101 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-10-22.md`](./ENEMY_AI_EVOLUTION_2026-10-22.md) (open PR #874; SYS-84…89, FUT-102…107 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-10-23.md`](./ENEMY_AI_EVOLUTION_2026-10-23.md) (open PR #958; SYS-90…95, FUT-108…113 — **do not re-number**)  
**Implementer ledger:** [`automation/ACTION_IDS_AEE_2026-10-24.md`](./automation/ACTION_IDS_AEE_2026-10-24.md)

This increment re-reads the live engine one day after the 2026-10-23 catalog (#958). SYS-01…95 and FUT-01…113 stay **PROPOSED** on their own files; they are **not** re-filed here. New work is: pack apply’s DoT writer is nested under `Number(spell.damage) > 0`, so poison / venom / Inferno that hunter / archer / bomber actually emit never tick and adjacent `!didAct` Fire-Bolts; `stepToward`’s last-resort walk is “first key in the reachable Set” and can step *away* from the intent target; guardian Iron Skin self-casts every turn before the golem can walk to its ward; wisp Rallying Cry is `targetType: "self"` range 0 and `usableByEnemy: false` but decide aims it at an ally; healer / guardian / wisp *interpose* still uses `opponents[0]` (SYS-93 was caster *retreat* only); `inferArchetype` counts any `enemySpellRange > 1` id as a ranged attack, so a rook with Iron Skin becomes a caster who cannot score the buff.

Stralt has **no character level cap**. Nothing here maps `if (level >= X) sophistication = Y`. Tiers remain conceptual. Eligibility remains the parent §4 sigmoid (`peer = log2(enemy.level / player.level)` plus pack/boss/modifier terms). A year-later peer fight at any absolute level can attach a new module without raising a cap. A DoT the card advertises that apply never writes, and a tank that routes as a caster because a buff has range 3, are **honesty**, not a last band.

**Hard rules (unchanged):** no cheat, no hidden player information, no ignored LoS/range/AP/MP, no unbounded search, no kit-less Fire Bolt, no `instantKill`, no betrayal-as-difficulty, no name-based spell heuristics, no production AI in this change. Do not “fix” poison by giving the pack a hidden splash. Do not “fix” Iron Skin by ignoring `targetType`. Do not copy Motoko `thunder_clap` / `void_collapse` into bomber kits.

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
| [#924](https://github.com/Mr-Melic/stralt/pull/924) (draft) | AI-SYS-95 (heal `buffStat`) | Share WX enemy heal execute with advertised CHC. **Do not re-implement.** Sidecar only — do not restack WX / `enemyAI.ts`. |
| [#958](https://github.com/Mr-Melic/stralt/pull/958) (draft) | SYS-90…95 / FUT-108…113 | Yesterday’s design increment. Unique files only. |

This docs PR does **not** edit [`ENEMY_AI_EVOLUTION.md`](./ENEMY_AI_EVOLUTION.md) (open PR #351 unions that header). Unique files only.

---

## 1. Re-read (2026-10-24) — what moved

All line numbers are from this checkout. Re-read them before implementing.

### 1.1 Combat-parity still is not sophistication

Unchanged from 2026-09-21…10-23: `enemyCastGeometryOk` (`targeting.ts` 166–177), `aiCanCast` (`enemyAI.ts` 320–332), Frozen walk *rate* (`enemyWalkMp.ts` 21–29), `playerCastPlan.ts` (player only), summon leftover-AP `reevaluate` (`summonExecutor.ts` 249–254). These are **not** SYS-05 / SYS-13 / SYS-01. 10-23 already said `reevaluate` is not a new SYS — do not re-file it.

`aiCanCast` is still unused by healer (1099–1100) and guardian (2131–2133). That remains **AI-SYS-23** on the 09-21 increment. Caster in-range uses it (953); lookahead/spill after that line does **not** (SYS-85 / #874). Hunter venom uses it (1941); then `applyLethalLookahead` may retarget without a second `aiCanCast` (SYS-85).

`enemyAI.ts` still has **zero** reads of `currentAp`, `currentMp`, or `apCost`. Pack walk budget is still `ENEMY_REACHABLE_STEP_BUDGET = 3` (`gameConstants.ts` 166; `computeReachable` 377–378). `getEffectiveStat` is declared on `DecideEnemyContext` (275–276) and **never read** by `estimateDamage` / `scoreTargets` / any `decide*`.

Do **not** feed `spellRangeBase` into AI (`targeting.ts` 191–209 / `groundTileInRange`). That fork is honesty: player upgrade `maxRange` is not an enemy kit field. Do **not** treat `enemyCastGeometryOk` as SYS-13 complete.

`starter-frost` live range is **`BigInt(4)`** (`spellData.ts` **131**). `starter-heal` / Blood Mend is **`targetType: "self"`**, **`range: BigInt(0)`** (`spellData.ts` **85–101**). `starter-poison` range is **4**, **`damage: BigInt(0)`**, `dotDamagePerTurn: 4` (`spellData.ts` **49–66**). `spell-venom-strike` range is **2**, **`damage: BigInt(0)`** (`spellData.ts` **394–409**). `spell-inferno` range is **3**, **`damage: BigInt(0)`**, `areaRadius: 0` (`spellData.ts` **502–522**). `spell-rallying-cry` is **`targetType: "self"`**, range 0, **`usableByEnemy: false`** (`spellData.ts` **417–435**). `spell-iron-skin` is **`targetType: "ally"`**, range 3, **`damage: BigInt(0)`**, `buffStat: "res"` (`spellData.ts` **294–311**). `spell-slow` has `debuffStat: "mp"` and `damage: 0` (`spellData.ts` **354–368**) — that one *can* hit the pack no-damage debuff writer.

### 1.2 Line numbers vs 2026-10-23 (P0 sites did not move)

| Fact | 2026-10-23 | Live (2026-10-24) |
| :--- | :--- | :--- |
| `computeAITier` | `combatMath.ts` 36–52 | **unchanged** |
| `pickEnemyLevelFromTiers` `maxTier = floor(999 / ts)` | `combatMath.ts` 54–58 | **unchanged** (SYS-73) |
| `calcScaledDamage` ignores caster level | `combatMath.ts` 130–137 | **unchanged** (SYS-72) |
| Spawn `aiTier` | WX 5823 | **5823** |
| Family second `computeAITier` | WX 5865 | **5865** |
| Kit `levelZone` object | WX 11920 | **11920** — resolve still `normalizedSpellPool.find` (**11921–11923**) (SYS-90 / #911) |
| `spellPool` Motoko-or-starter | WX 2688–2701 | **2688–2701** |
| Summoner chance unbounded | WX 11932–11943 | **11932–11943** (FUT-23; skip-brain is SYS-89) |
| `isSummoner` short-circuit | WX 16375–16384 | **16375–16384** (SYS-86 / SYS-89) |
| Player-summon empty occupied | WX 15156 | **15156** (SYS-14) |
| Pack player `maxHp` leftover | WX 16300 | **16300** (`maxHp ?? hp`; SYS-76 / SYS-78 / SYS-84) |
| `aiTier >= 5` erratic | WX 15507–15591 | **unchanged** |
| `aiTier >= 10` betrayal | WX 15594–15600 | **unchanged** |
| Dest-commit clamp | WX 16416–16423 | **16416–16423** (SYS-58) |
| Apply `targetCell` render `playerPosition` | WX 16436–16438 | **16436–16438** (SYS-34 / #495) |
| Apply Chebyshev only | WX 16450–16456 | **16450–16456** |
| Damage/drain gate `spellDmg > 0` | (DoT writer cited as 16609–16625) | **16459–16462** wraps the DoT writer at **16610–16625** (this file’s SYS-96) |
| No-damage `debuffStat` writer | WX 16671–16700 | **16671–16700** (Slow can land; poison cannot) |
| Self-heal `range === 0` | WX 16648–16670 | **unchanged** — HP only, no `buffStat` (SYS-95 / #924) |
| Fire Bolt `e-firebolt` | WX 16712 | **16712** |
| `decideEnemyAction` | 1662–1707 | **1662–1707** |
| `stepToward` fallback | (not called out) | **604–609** (this file’s SYS-97) |
| Guardian Iron Skin before approach | (not called out) | **2148–2166** (this file’s SYS-98) |
| Wisp Rallying Cry on ward | (not called out) | **2521–2543** (this file’s SYS-99) |
| Backline `opponents[0]` | SYS-93 = caster retreat 928–944 | healer **1143**, guardian **2169**, wisp **2547** (this file’s SYS-100) |
| `inferArchetype` range>1 → caster | SYS-04 = heal-first 447–452 | **453–461** counts Iron Skin / venom as ranged (this file’s SYS-101) |
| `pickBossKitSpell` `new Map()` | `useBossAI.ts` 169–173 | **169–173** |
| `ENEMY_AI_TIER_GATES` | unread | still unread (`enemyAI.ts` comment only at **1422–1423**) |
| Hostile `summonAI = pieceType` | `summonSpawn.ts` 275 | **275** (SYS-88 / #842) |

P0 remains **AEE-2026-08-31-002** (Fire Bolt / apply honesty) then **AEE-2026-08-31-001** (`computeAITier`). Then 09-21…10-23 honesty. Then this file’s SYS-96…101. Do not start FUT-114+ first. Hunter / archer / bomber already *emit* damage-0 DoTs — SYS-96 is on the P0 Fire-Bolt path, not a T6 extra.

### 1.3 Still true — do not re-file (parent / 09-21…10-23)

- Zone-0 kits forever (`Math.floor(levelZone)` on an object). SYS-09. SYS-90 is the **id resolve** after that floor, not the NaN.
- `scoreTargets` ignores `focusTargetId`. SYS-08 / AI-SYS-30 (prepend also destroyed by sort). SYS-93 is caster *retreat* from `opponents[0]`. This file’s SYS-100 is *interpose* from the same list, not a re-file of 93.
- `estimateDamage` returns 0 when `spell.damage <= 0`. SYS-02 / SYS-39. SYS-96 is that **apply** also drops those ids, which 10-23 §5 called “a pack DoT writer” without noticing the `spellDmg > 0` nest.
- Heal-first `inferArchetype` (447–452). SYS-04 / SYS-41. SYS-101 is the **next** branch (range>1 buff/DoT → caster), not heal-first.
- Pack healer idle ward `allies.find(!isSummon)` (1142). **FUT-83** (09-27). Do not re-file. SYS-100 is the *threat* next to that ward, not the ward picker.
- Hazard avoid only below 50% HP; ice/lava/spikes only (425–441). POS-04 / FUT-09 / FUT-59 / FUT-93. SYS-92 is that **approach never calls the filter**. SYS-97 is that the *fallback* walk can go the wrong way even on floor.
- Retreat / `reposition-los` `kind: "skip"` while dest-commit still moves. POS-02 / FUT-41 / SYS-58.
- Summoner chance hits 1.0 at player level 44. FUT-23. Skip-brain is SYS-89.
- `ENEMY_AI_TIER_GATES` unread. SYS-01.
- Summon executor Chebyshev teleport MP. SYS-15 / 09-21 SYS-25.
- Family overlay second `computeAITier`. AI-SYS-29.
- `findKitSpell` assigned fallback (1737–1745). AI-SYS-32. Wisp Rallying Cry can still be found on `assignedSpells` even though `usableByEnemy: false` (SYS-99).
- Strip / `resolveEnemyApMp` uses `enemy.level` for AP/MP. SYS-54.
- Hostile summons skip the paid executor. SYS-55. **#842 routes decide; it still does not send hostiles through `executeSummonAction`.** Pack hunter/archer/bomber therefore hit WX apply (SYS-96), not `applyEffect`.
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
- Pack kit ids miss Motoko `defaultSpells`. SYS-90 / #911.
- Blood Mend is self range 0; healer decide targets other allies. SYS-91.
- `stepToward` / flank / legal-cast dests skip `filterHazardCandidates`. SYS-92.
- Caster *retreat* uses `opponents[0]`. SYS-93. SYS-100 is interpose.
- Archer `MIN_KITE_RANGE = 3` vs poison range 4. SYS-94.
- Range-0 heal drops advertised CHC. SYS-95 / #924.
- Pack healer `pickBestAlly` still `allies.find(!isSummon)` at **1142**. **FUT-83** — do not re-file.
- `hasBresenhamLoS` still ignores combatant bodies. Do not propose an AI-only body-block LoS module.
- `engine/summonAI.ts` `runSummonAI` remains unused.
- Diagonal `stepToward` candidate (`enemyAI.ts` **595–596**) still must be in `reachable` (SYS-15). Do not re-file as a new walker. SYS-97 is the **Set-iteration fallback after those candidates miss**, not the diagonal.

### 1.4 New honesty gaps (this increment)

1. **Pack apply never writes a `damage === 0` DoT, then Fire-Bolts.** 10-23 §5 said WX **16609–16625** is “a pack DoT writer” that still does not authorize Inferno/poison in *kits*. Hunter / archer / bomber **already emit** those ids via `findKitSpell` (`decideSummonHunter` **1934–1957**, `decideSummonArcher` **2245–2269**, `decideSummonBomber` **2362–2425**) — they do not go through `pickBestDamageSpell` (SYS-39). The DoT arm sits *inside* `spellType ∈ {damage,drain} && Number(damage) > 0` (WX **16459–16462**). `starter-poison` / `spell-venom-strike` / `spell-inferno` all have `damage: BigInt(0)` and `dotDamagePerTurn` set. They miss the writer. The later no-damage arm (WX **16671–16700**) requires `debuffStat` — Slow can land, poison cannot. `!didAct` + dest-commit Chebyshev ≤ 1 → `e-firebolt` (WX **16703–16715**). Player-side summons that *do* hit `executeSummonAction` (`summonExecutor.ts` **183–208**) fall through to `applyEffect` type `"dot"`; hostile / pack units skip that executor (SYS-55). Bomber “detonate” also uses `AI_KAMIKAZE_BLAST_RADIUS = 2` because Inferno’s `areaRadius` is 0 (`enemyAI.ts` **2387–2393**); even a working DoT writer would be single-target, and `hp = 0` on bomber is inside the `damage > 0` branch of the executor (**177–180**) so the kamikaze does not die. SYS-96.

2. **`stepToward` can walk away from the tile it was asked to approach.** Preferred axis / orthogonal / diagonal candidates are checked against `reachable` (**590–603**). If all of those miss, the fallback is `for (const k of reachable)` skipping only the origin (**604–609**). `computeReachable` inserts 4-dir neighbors in order `+x, −x, +y, −y` (**369–374**). A bishop blocked on the west axis therefore often dest-commits **east** — still logged as `closes-in`. SYS-92 filters hazards on `stepAway` only; this is a **direction** bug on floor tiles. SYS-15 already forbids treating the dead diagonal candidate as a walk; do not merge that with this fallback. SYS-97.

3. **Guardian Iron Skin is not a fallback — it is a trap.** `decideSummonGuardian` casts Shield when the ward is in Chebyshev range (**2128–2146**). The next block (**2148–2166**) fires Iron Skin on `summon.id` whenever `findKitSpell("spell-iron-skin")` is non-null, **before** `backlineGuardCell` / `stepToward` the ward (**2167–2205**). Out-of-range Shield therefore never produces an approach. Iron Skin is `targetType: "ally"` range 3 (`spellData.ts` **294–311**) with copy that says “Buff **own** RES”; there is no effects snapshot (SYS-10), so a ready CD is treated as “unshielded” every turn (FUT-15 / FUT-64 hygiene is the recast; this is that **approach is unreachable**). Pack apply has no ally-buff arm — a hostile golem that somehow emits Iron Skin still Fire-Bolts (SYS-55 / SYS-96 class). SYS-98.

4. **Wisp Rallying Cry is a self spell aimed at an ally.** `SUMMON_KIT.healer` is `["starter-heal", "spell-rallying-cry"]` (**146**). `spell-rallying-cry` is `targetType: "self"`, range 0, `usableByEnemy: false`, heal 20 + CHC (`spellData.ts` **417–435**). `decideSummonHealer` after the Blood-Mend block picks `pickBestAlly(..., "rally")` and casts when `dist <= enemySpellRange` (**2521–2543**). Range 0 means that only succeeds if the wisp occupies the ward’s tile (occupancy forbids it). `findKitSpell` can still return the id from `assignedSpells` (SYS-32) even though pack `availableSpells` drops `usableByEnemy === false`. SYS-91 is Blood Mend / pack healer *heal* targeting other units. SYS-41 is “do not treat Rally as pack ally heal.” This is the **wisp decide** that still emits Rally at a ward. Apply would self-heal only if `targetId` were the caster and range 0 (WX **16648**); targeting the player with range 0 fails, then Fire Bolt if dest-commit is Chebyshev 1 (SYS-05). SYS-99.

5. **Interpose still uses snapshot-order `opponents[0]`, not the attacker that can hit the ward.** SYS-93 fixed (as design) caster *retreat* at **928–944**. The remaining `opponents[0]` sites are pack healer backline (**1143**), guardian (**2169**), and wisp (**2547**). Pack snapshot pushes player-side summons first and the player last (WX **16274–16302**). Healers skip the SYS-30 wisp prepend (`archetype !== "healer"`, **1683**), so `opponents[0]` is often a backline summon, not the adjacent player. `backlineGuardCell` then steps from the ward toward that summon (**835–861**). Flanker/generic *retreat* uses `scoreTargets()[0]` (SYS-93 already noted that is still not nearest-in-melee). SYS-100.

6. **`inferArchetype` treats any range>1 kit id as a ranged attack.** After heal-first (SYS-04), the caster test is `ranged.length >= melee.length` where ranged means `enemySpellRange(s) > 1` (**453–461**). `spell-iron-skin` range 3 and `spell-venom-strike` range 2 have `damage: 0`. Rook zone≥1 kit is Strike + Iron Skin (`ENEMY_KITS.rook` **173–174**) → 1 ranged + 1 melee → **caster**. Pawn zone≥1 is Strike + venom (**165–166**) → **caster**. `pickBestDamageSpell` then drops both ids (SYS-02 / SYS-39). The piece closes-in as a caster with no scored spell; adjacent `!didAct` Fire-Bolts (SYS-05). Explicit `Enemy.role` (parent principle 5) still does not exist. SYS-101.

### 1.5 Tests

`enemyAI.charger.test.ts`, `enemyAI.geometry.test.ts`, `enemyAI.walkMp.test.ts` exist. Honesty for damage-0 DoT apply, `stepToward` Set-order fallback, Iron Skin-before-approach, Rally `targetType`, backline `opponents[0]`, and range>1 buff → caster still has no decide/apply-layer tests. Do not treat geometry/walkMp as SYS-96…101. Open #911 / #924 / #842 add sidecars on **their** branches — do not duplicate here.

### 1.6 What this increment does **not** change

Do not implement FUT-114+ before P0 honesty + 09-21…10-23 SYS slices. Do not touch RAF, map generation, turn order, or damage formulas (`calcScaledDamage` stays a **read** for scoring; do not add `enemy.level` into it as a stealth stat stick). Do not copy #495 / #498 / #644…#659 / #700 / #709 / **#842** / **#861** / **#911** / **#924** / **#958** into this docs-only change. Do not edit the parent catalog. Do not “fix late game” by keeping Fire Bolt, by giving bombers `thunder_clap` / `void_collapse`, or by making Iron Skin ignore `targetType`. Do not re-file FUT-83, SYS-04, SYS-39, SYS-91, SYS-93, or the leftover-AP `reevaluate`. Do not turn FUT-23’s chance table into `if (player.level >= 44) isSummoner = true`.

---

## 2. Design additions (normative)

1. **Do not recycle 09-21…10-23 ids.** This file starts at SYS-96 / FUT-114.
2. **DoT apply is metadata, not `damage > 0`.** If decide emits a profiled `isDotSpell` / `dotDamagePerTurn` id, apply must write that public DoT (or reject the action as illegal — never Fire-Bolt). Slow’s `debuffStat` arm is not a substitute for poison. Kamikaze splash is a *different* profile (`hitsMultiple` / `areaRadius` / a named bomber ability), not Inferno’s single-target DoT. SYS-96.
3. **Walk dests must reduce (approach) or increase (retreat) Chebyshev to the intent cell among reachable tiles.** “First key in a Set” is not a path. SYS-97.
4. **Self-buff is not approach.** Iron Skin on self is legal only when Shield-on-ward is illegal *and* a protector module prefers the self RES to walking. Default: walk. SYS-98.
5. **`targetType: "self"` spells target the caster.** Rallying Cry is not an ally rally until the card says `ally` and `usableByEnemy` is true. SYS-99. Complements SYS-91 (heal) without replacing it.
6. **Interpose threat = nearest living opponent that can currently hit the ward (else min Chebyshev).** Snapshot insertion order is not a threat axis. SYS-100. Complements SYS-93 (retreat) without replacing it.
7. **Role is authored metadata, not `range > 1`.** Buffs, DoTs, and summons do not count as ranged *attacks* for `inferArchetype`. SYS-101. Complements SYS-04 (heal-first) without replacing it.
8. **T6+ still stacks** on the parent enumerator. No integer tier table. No `if (aiTier >= 8)`. No `if (level >= X)`.

---

## 3. System proposals (2026-10-24)

### AI-SYS-96

**AI_ID:** AI-SYS-96  
**NAME:** Pack apply must write profiled DoTs when `damage === 0`, never Fire-Bolt them  
**ROLE:** system  
**SOPHISTICATION:** T1+ / honesty for SYS-02 / SYS-05 / SYS-39 / SYS-55  
**DECISION_RULES:** WX **16459–16462** requires `Number(chosenSpell.damage) > 0` before the DoT writer at **16610–16625**. Hunter venom (`spellData.ts` **394–409**, `decideSummonHunter` **1940–1957**), archer poison (`spellData.ts` **49–66**, `decideSummonArcher` **2253–2269**), and bomber Inferno (`spellData.ts` **502–522**, `decideSummonBomber` **2410–2425**) all have `damage: 0` and `dotDamagePerTurn` set. They miss both the damage arm and the `debuffStat` arm (**16671–16700**). `!didAct` + Chebyshev 1 → `e-firebolt` (**16712**). After this module: (1) a profiled `isDotSpell` / `dotDamagePerTurn` cast that is in range writes the public DoT the card shows, **or** is rejected (skip/melee) — never a kit-less bolt; (2) player-summon `executeSummonAction` `applyEffect` (**191–208**) stays the honesty template for *paid* summons; hostile units still need SYS-55 before they share it; (3) bomber splash / self-kill is **not** this slice — Inferno `areaRadius` is 0 and executor `hp = 0` is inside `damage > 0` (**177–180**). Do not invent hidden AoE. SYS-39 remains the *scorer* (`estimateDamage` 0). This id is the *apply nest*. Open #842’s DoT-before-melee gate is apply honesty for hostile kits after they exist — **do not copy that PR.**  
**SCORING_MODEL:** Until the write exists, DoT EV in decide must stay 0 (no hidden ticks). After the write: SYS-02 / FUT-114 public duration EV. Illegal dest ⇒ −∞, not bolt.  
**SPELL_REQUIREMENTS:** `starter-poison`, `spell-venom-strike`, `spell-inferno` profiles: category DoT, `damage` may be 0, `dotDamagePerTurn` / `dotDuration` required. Slow stays on the `debuffStat` arm.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always (honesty). A remnant wolf at any absolute level must not Fire-Bolt a failed venom.  
**ENEMY_ARCHETYPES:** hunter, archer, bomber; pack pieces that somehow hold those ids.  
**PLAYER_COUNTERPLAY:** Poison icon on the target, same as a player Poison Arrow. No surprise bolt from range 3.  
**EDGE_CASES:** `kind: "cast"` poison while Chebyshev 1 must not fall through to Fire Bolt even if the DoT writer is still missing — skip or Strike (SYS-05). Duplicate poison recast is FUT-64 / FUT-114, not this slice. Paper Windstorm is ranged (SYS-70) and must not apply to a rejected DoT.  
**IMPLEMENTATION_COMPLEXITY:** Low (lift the DoT arm out of `spellDmg > 0`; tests). Do not restack all of WX — follow the sidecar pattern of #924 if a competing apply PR is open.  
**TEST_SCENARIOS:** Archer, poison ready, dist 3, LoS → public poison DoT, no `e-firebolt`. Hunter venom dist 2 → venom DoT. Bomber Inferno dist 2, `damage: 0` → single-target burn DoT or skip, never bolt, never hidden radius-2 splash. Adjacent failed DoT → Crush/Strike or skip.  
**STATUS:** PROPOSED

### AI-SYS-97

**AI_ID:** AI-SYS-97  
**NAME:** `stepToward` fallback must pick a reachable tile that reduces Chebyshev to the intent cell  
**ROLE:** system  
**SOPHISTICATION:** T1+ / honesty for POS-01 / SYS-15 / SYS-92  
**DECISION_RULES:** `stepToward` (**579–611**) tries signed-axis, orthogonal, then diagonal candidates, then **`for (const k of reachable)`** (**604–609**). `computeReachable` first-inserts `origin+(1,0)` (**369–390**). A west approach with the west tile occupied therefore dest-commits east and still logs `closes-in` / `advance` / `rage-forward`. After this module: if preferred candidates miss, choose `arg min Chebyshev(dest, target)` among reachable free non-origin tiles (tie: lower path cost from the BFS parent map — SYS-15). If every reachable tile *increases* distance, hold (origin). Do not iterate Set insertion order. Do not take a diagonal unless it is in `reachable` (SYS-15). SYS-92 still filters public hazards on that shortlist. `stepAway` already has an axis preference; it returns origin when none are legal — keep that.  
**SCORING_MODEL:** Approach dest: `U += wClose * (distBefore − distAfter)`. Dest with `distAfter > distBefore` is illegal for an approach intent (dropped), not a “close-in”.  
**SPELL_REQUIREMENTS:** None (movement). Closes-in still needs a profiled frost (SYS-79 / SYS-90).  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always for any enemy that walks. T0 may still pick a random legal step; T1+ must not walk away under an approach intent. Not `aiTier >= 3`.  
**ENEMY_ARCHETYPES:** caster, charger, flanker, generic, berserker, hunter, archer (too-far), bomber, healer approach.  
**PLAYER_COUNTERPLAY:** Body-block the on-axis tile; they sidestep closer or hold, they do not teleport past you the other way.  
**EDGE_CASES:** Only reachable tile is farther → hold, no bolt (SYS-05). Flanker `stepFlank` fallback already calls `stepToward` (**679**) and inherits this. SYS-87 tackle zone can force that fallback.  
**IMPLEMENTATION_COMPLEXITY:** Low (min-distance among reachable).  
**TEST_SCENARIOS:** Origin (4,4), target (2,4), (3,4) occupied, (5,4) free in reachable → dest is not (5,4). Prefer (4,3) or (4,5) if those reduce Chebyshev. All sides increase distance → origin.  
**STATUS:** PROPOSED

### AI-SYS-98

**AI_ID:** AI-SYS-98  
**NAME:** Guardian Iron Skin must not preempt Shield-on-ward approach  
**ROLE:** system  
**SOPHISTICATION:** T1+ / honesty for ROL-01 / ROL-10 / SYS-10 / FUT-64  
**DECISION_RULES:** `decideSummonGuardian` (**2148–2166**) self-casts Iron Skin whenever the kit id is ready, immediately after an in-range Shield attempt, **before** interpose / `stepToward` the ward (**2167–2205**). A ward at dist 4 therefore never gets a walk; the golem spends AP on self RES every turn CD allows. After this module: (1) if Shield is ready and the ward is in `enemySpellRange`, Shield (existing); (2) if Shield is ready and the ward is out of range, **walk** (`backlineGuardCell` / `stepToward`) — do not Iron Skin; (3) Iron Skin on `summon.id` only when Shield is on CD *or* no ward exists, and only if SYS-13 accepts `targetType: "ally"` on self (or the card is rewritten to `self`); (4) if a public RES buff is already on the caster (SYS-10), skip (FUT-64 / FUT-15). Pack apply still has no ally-buff writer — do not emit Iron Skin on a hostile golem until that writer exists (SYS-55 / parent §2.7). Do not name-match `"Iron Skin"`.  
**SCORING_MODEL:** `U(shieldWard) > U(approach) > U(selfIron)` when a living ward exists and Shield is ready. Self Iron at −∞ if it blocks the only walk that can make Shield legal next turn.  
**SPELL_REQUIREMENTS:** `starter-shield` (ally, range 3), `spell-iron-skin` (ally, range 3, RES%). Copy says “own RES” — SYS-13 must not invent a different `targetType`.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always for guardian/protector. T0 may self-buff; T1+ must walk first. Not `if (level >= 20) ironSkin`.  
**ENEMY_ARCHETYPES:** guardian, protector, tank.  
**PLAYER_COUNTERPLAY:** Kite the golem off the ward; it must chase, not stand still stacking RES. Dispel / wait the 3-turn RES if it *did* self-buff legally.  
**EDGE_CASES:** No ward → Iron Skin self is acceptable if apply can write it. Shield and Iron Skin are last-writer RES% (content audits) — do not stack as sophistication. Hostile guardian without executor (SYS-55) must not Fire-Bolt a failed buff (SYS-05).  
**IMPLEMENTATION_COMPLEXITY:** Low (reorder branches).  
**TEST_SCENARIOS:** Golem (0,0), player ward (4,0), Shield ready, Iron Skin ready → `kind: "move"` toward ward, spell null. Dist 3, Shield ready → Shield on ward. No ward, Iron Skin ready, apply writer exists → self Iron Skin. Dist 4, Shield on CD, Iron Skin ready → self Iron Skin *or* interpose, not a bolt.  
**STATUS:** PROPOSED

### AI-SYS-99

**AI_ID:** AI-SYS-99  
**NAME:** Wisp Rallying Cry is `targetType: "self"` range 0 — do not aim it at a ward  
**ROLE:** system  
**SOPHISTICATION:** T1+ / honesty for SYS-13 / SYS-32 / SYS-41 / SYS-91  
**DECISION_RULES:** `decideSummonHealer` (**2521–2543**) casts `spell-rallying-cry` on `pickBestAlly` when `dist <= enemySpellRange`. The card is self / range 0 / `usableByEnemy: false` (`spellData.ts` **417–435**). Range 0 vs another unit is illegal (occupancy also forbids sharing a tile). `findKitSpell` assigned fallback (SYS-32) can still return the id. After this module: (1) self spells enumerate the caster only (same rule as SYS-91 for Blood Mend); (2) Rally stays out of enemy/wisp *decide* until `usableByEnemy` is true **and** the card is either self (cast on caster) or ally (range > 0); (3) pack `availableSpells` already drops `usableByEnemy === false` (WX **16268–16271**) — summon ctx does **not** (`availableSpells: summonEnemy.spells ?? []`, WX **15172–15173**, SYS-14); (4) do not treat Rally as an ally group buff because the function is named `rally`. SYS-91 remains Blood Mend. SYS-41 remains pack king Rally. This id is the **wisp second kit spell**.  
**SCORING_MODEL:** Ally dest for a self spell ⇒ −∞. Self EV = heal 20 × (1 − ownHpFrac) plus CHC once SYS-95 writes it.  
**SPELL_REQUIREMENTS:** `spell-rallying-cry` profile: self, range 0, or a future ally rewrite with range > 0. Do not widen range 0 to allies (rebalance vs player Rally).  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always when the id is in the wisp kit. T0 may skip. Not `if (aiTier >= 4) rally`.  
**ENEMY_ARCHETYPES:** wisp healer summon.  
**PLAYER_COUNTERPLAY:** A player wisp must Blood-Mend / hold, not “rally” the hero from dist 2 with a range-0 self card.  
**EDGE_CASES:** Dist 0 on a ward is occupancy-illegal. Failed Rally must not Fire-Bolt (SYS-05). `usableByEnemy: false` + assigned fallback is SYS-32 — delete that fallback rather than special-case Rally.  
**IMPLEMENTATION_COMPLEXITY:** Low (targetType gate + do not `findKitSpell` a false usableByEnemy id).  
**TEST_SCENARIOS:** Wisp, player 40% HP at dist 2, Rally assigned, Blood Mend on CD → move/hold/self, **not** `cast` Rally on the player. Wisp 20% HP, Rally legal self after SYS-41 flips usable → `targetId` is the wisp.  
**STATUS:** PROPOSED

### AI-SYS-100

**AI_ID:** AI-SYS-100  
**NAME:** Backline interpose steps toward the nearest attacker of the ward, not `opponents[0]`  
**ROLE:** system  
**SOPHISTICATION:** T1+ / honesty for POS-07 / TEM-02 / SYS-93  
**DECISION_RULES:** Remaining `opponents[0]` sites after SYS-93: pack healer **1143**, guardian **2169**, wisp **2547**. Pack snapshot order is summons then player (WX **16274–16302**). `backlineGuardCell` (**835–861**) steps from the ward toward that threat by `AI_BACKLINE_GUARD_DISTANCE` (1). After this module: the interpose threat is the living opponent with minimum Chebyshev to the *ward* (tie: can currently hit the ward with a public melee/spell range, then highest `threatValue`). Do not use snapshot insertion order. Do not reuse SYS-30 prepend. Pack healer still skips harass prepend (**1683**) — good; do not add it here. Ward picker stays FUT-83 (`allies.find(!isSummon)` at **1142**). `kind` is `move` (POS-02). No Fire Bolt (SYS-05). Flanker/generic retreat’s `scoreTargets()[0]` is still not nearest-in-melee — fold *retreat* onto SYS-93’s helper; this id is *interpose*.  
**SCORING_MODEL:** Guard dest on the ward→threat line among reachable non-hazard tiles (SYS-92).  
**SPELL_REQUIREMENTS:** None (move). Shield/heal in range still outranks interpose (SYS-98 / SYS-91).  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always for T1+ protector/healer/guardian idle. T0 may skip. Not `if (aiTier >= 4)`.  
**ENEMY_ARCHETYPES:** healer, guardian, protector, wisp.  
**PLAYER_COUNTERPLAY:** Stand adjacent to the ward; they must body-block *you*, not a distant summon. Occupy the guard tile (POS-08).  
**EDGE_CASES:** No opponents → hold. Guard cell not in reachable (budget 3 from a far healer) → hold or approach ward (FUT-83), not `decideCaster` Fire-Bolt. Comment at **1142** says “prefer the player” on an *enemy* ally list — that is FUT-83, not this id.  
**IMPLEMENTATION_COMPLEXITY:** Low (shared nearest-threat helper with SYS-93; argument is the ward cell).  
**TEST_SCENARIOS:** Queen idle, rook ward at (2,2), player (2,3), player-summon (0,0) first in snapshot → guard is between rook and player, not toward (0,0). Golem, same geometry → same.  
**STATUS:** PROPOSED

### AI-SYS-101

**AI_ID:** AI-SYS-101  
**NAME:** `inferArchetype` must not treat range>1 buffs / DoTs as ranged attacks  
**ROLE:** system  
**SOPHISTICATION:** T1+ / honesty for SYS-04 / parent principle 5 (explicit roles)  
**DECISION_RULES:** After heal-first (SYS-04, **447–452**), caster inference is `ranged.length >= melee.length && ranged.some(LoS)` with `ranged = enemySpellRange > 1` (**453–461**). `spell-iron-skin` range 3 and `spell-venom-strike` range 2 therefore flip rook zone≥1 (`ENEMY_KITS` **173–174**) and pawn zone≥1 (**165–166**) to **caster**. `pickBestDamageSpell` requires `damage > 0` (**561–568**) so those ids never cast; the piece `closes-in` and adjacent Fire-Bolts (SYS-05). After this module: “ranged attack” means a profiled damage/drain/DoT-*as-weapon* id, not `range > 1`. Buff / heal / summon / mark / swap ids do not count. Prefer authored `Enemy.role` / spawn metadata when present (parent principle 5). Heal-first remains SYS-04 (delete it separately so queens with Blood Mend can be artillery). Knight `pieceType` → flanker stays. Do not infer caster from Motoko `shadow_strike` either until SYS-13 scores `diagonal` / `minRange`.  
**SCORING_MODEL:** N/A (routing). Wrong branch ⇒ the rest of the enumerator never sees the kit.  
**SPELL_REQUIREMENTS:** Kit ids already in `ENEMY_KITS`. Iron Skin stays unemitted on pack until an ally-buff apply exists. Venom stays unemitted as a *caster* nuke until SYS-96.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always (honesty). A remnant rook at any absolute level is still a tank, not a frostless caster.  
**ENEMY_ARCHETYPES:** tank/rook, pawn/charger; prevents false caster.  
**PLAYER_COUNTERPLAY:** Read the piece: a rook walks up and Strikes (or Iron Skins, once apply exists). It does not pretend to kite.  
**EDGE_CASES:** Bishop frost range 4 is a real ranged attack — still caster. Queen Blood Mend still SYS-04 until that id is deleted. Empty Motoko kit (SYS-90) stays generic, not this branch.  
**IMPLEMENTATION_COMPLEXITY:** Low (filter `spellType` / profile category before the range count).  
**TEST_SCENARIOS:** Rook assigned `[physical_attack, spell-iron-skin]` → archetype charger or tank, not caster. Pawn `[physical_attack, spell-venom-strike]` → charger (venom is a melee-range DoT), not caster. Bishop `[starter-frost]` → caster.  
**STATUS:** PROPOSED

---

## 4. T6+ reusable modules (2026-10-24)

Attach via parent §4 sigmoid. Stack; do not replace T0–T5 or FUT-01…113. Do not re-file FUT-83 (pack healer ward), FUT-23 (chance formula), FUT-64 (buff recast hygiene), FUT-15 (shield recast), FUT-108 (self-heal), or FUT-111 (retreat toward support).

### AI-FUT-114

**AI_ID:** AI-FUT-114  
**NAME:** DoT expected-value + duplicate-tick hygiene  
**ROLE:** targeting / resource  
**SOPHISTICATION:** T6 (TGT-05 / TGT-06 / TEM-04; SYS-96 / SYS-02 / SYS-39 / SYS-10)  
**DECISION_RULES:** After SYS-96 writes public DoT ticks: T2+ hunters/archers/bombers score `dotDamagePerTurn * remainingDuration` against visible HP (after visible RES if SYS-10 exists), and skip a second poison/venom/burn of the **same `dotType`** on a target that already has that public effect (TEM-04). T0 may still recast. Bomber cluster count stays a *separate* profile — do not treat Inferno’s `areaRadius: 0` as splash just because `AI_KAMIKAZE_BLAST_RADIUS` is 2. Unbounded: a year-later `dotType: "rot"` uses the same scorer, not `if (level >= 80) inferno`.  
**SCORING_MODEL:** `U(dot) = wTick * ppt * duration * (1 if hp > ppt else hp/ppt) − wDup if hasPublicDot(dotType)`. KillableNow from leftover HP after ticks still uses visible information only.  
**SPELL_REQUIREMENTS:** Profiled `isDotSpell` ids. Slow stays debuff EV, not DoT EV.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.25` for hunter/archer. Remnants may melee. Peer kiters attach.  
**ENEMY_ARCHETYPES:** hunter, archer, bomber, assassin.  
**PLAYER_COUNTERPLAY:** Cleanse / wait the 3 ticks. Do not stand in a fake blast radius Inferno does not have.  
**EDGE_CASES:** Before SYS-96, this term is 0 (do not cheat hidden ticks). Null Field vs non-DoT is SYS-65.  
**IMPLEMENTATION_COMPLEXITY:** Low after SYS-96 + SYS-10.  
**TEST_SCENARIOS:** Target already has poison 2 turns, archer poison ready, Strike in range → melee or Slow, not a second poison. Fresh target, poison ready, dist 4 → poison.  
**STATUS:** PROPOSED

### AI-FUT-115

**AI_ID:** AI-FUT-115  
**NAME:** Intent-aligned walk among reachable tiles  
**ROLE:** positioning  
**SOPHISTICATION:** T6 (POS-01 / POS-02 / POS-08; SYS-97 / SYS-92 / SYS-15)  
**DECISION_RULES:** After SYS-97, T2+ walkers score every reachable dest for the *intent* (approach / retreat / kite-band / interpose) instead of greedy one-step axis. Approach: min Chebyshev to target with public hazard path cost (FUT-110). Retreat: max Chebyshev to nearest threat, then toward support (FUT-111). Kite: SYS-94 band. Enumerator node cap remains parent SYS-03 (16×16, one turn). T0 may keep one-step axis. Do not BFS the player’s future click.  
**SCORING_MODEL:** Parent `U(dest)` + SYS-97 distance term + SYS-92 hazard.  
**SPELL_REQUIREMENTS:** None.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.2`. Peer walkers attach; remnants may keep one-step.  
**ENEMY_ARCHETYPES:** all walkers.  
**PLAYER_COUNTERPLAY:** Cut the only reducing tile; they hold. Paint the min-dist dest with lava (FUT-110).  
**EDGE_CASES:** `kind: "skip"` retreat dest-commit still SYS-58 / POS-02. Diagonal not in reachable stays illegal (SYS-15).  
**IMPLEMENTATION_COMPLEXITY:** Low after SYS-97 (already a min over reachable).  
**TEST_SCENARIOS:** Same as SYS-97 plus two reducing tiles, one lava → T2+ takes the floor (SYS-92 / FUT-110).  
**STATUS:** PROPOSED

### AI-FUT-116

**AI_ID:** AI-FUT-116  
**NAME:** Protector buff sequence — ward first, self RES second  
**ROLE:** protector / tank  
**SOPHISTICATION:** T6 (ROL-01 / ROL-10 / RES-04; SYS-98 / FUT-64 / SYS-10)  
**DECISION_RULES:** After SYS-98: T2+ guardians/protectors score Shield-on-ward, walk-to-ward, self Iron Skin, and interpose on one enumerator. Shield wins if legal. Walk wins if Shield will be legal after ≤ budget steps. Self Iron Skin wins only if no ward, or ward already has public RES and the caster does not (FUT-64). T5 bosses may invert when the protector *is* the remaining HP pool (ADV-08). Unbounded: a later absorb-buffer id uses the same sequence shape, not a new integer tier.  
**SCORING_MODEL:** `U(shieldWard) = wProtect * wardThreat`; `U(walk) = wProtect * (1 − distWard/range)`; `U(selfIron) = wSelfRes * (1 if !hasPublicRes)`.  
**SPELL_REQUIREMENTS:** Profiled Shield / Iron Skin + apply writers. Do not emit on pack until apply exists.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.3` for guardian/protector roles.  
**ENEMY_ARCHETYPES:** guardian, protector, tank.  
**PLAYER_COUNTERPLAY:** Peel the ward; the golem must choose chase vs self-buff in a readable way.  
**EDGE_CASES:** Last-writer RES% — do not score Shield+Iron as multiplicative sophistication.  
**IMPLEMENTATION_COMPLEXITY:** Low after SYS-98 + SYS-10.  
**TEST_SCENARIOS:** Ward unshielded dist 4, both spells ready → walk. Ward shielded, caster unshielded, dist 1 → optional self Iron. Both already RES → interpose (SYS-100).  
**STATUS:** PROPOSED

### AI-FUT-117

**AI_ID:** AI-FUT-117  
**NAME:** `targetType` self vs ally vs enemy as a reusable scorer  
**ROLE:** spell-awareness  
**SOPHISTICATION:** T6 (SYS-13 / SYS-91 / SYS-99; ROL-04 / ROL-05)  
**DECISION_RULES:** After SYS-91 and SYS-99: every profiled spell contributes a legality feature `targetType ∈ {self, ally, enemy, ground, area}` that the enumerator uses without per-id branches. Self → caster tile only. Ally → same-side living (SYS-13), not `side === "player"` hardcode. Enemy → opponents. Ground → empty legal cell (SYS-86). New mechanics (future ally Rally rewrite, absorb-buffer, taunt) attach by filling the profile, not by adding `if (spell.id === ...)`. T0 may still special-case one heal. Do not name-match `"Rally"`.  
**SCORING_MODEL:** Illegal `targetType` ⇒ −∞. Legal self/ally/enemy EV from the profile category (heal / buff / damage / DoT).  
**SPELL_REQUIREMENTS:** Every `usableByEnemy` id has a profile with `targetType`. Rally stays false until rewritten.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always once SYS-13 exists; T6 is *reusing* the feature for new spells as relative difficulty adds kit rows (FUT-109).  
**ENEMY_ARCHETYPES:** all casters, healers, supports, summoners.  
**PLAYER_COUNTERPLAY:** Stand off the only ally tile; occupy ground cells.  
**EDGE_CASES:** Iron Skin copy vs `targetType: "ally"` (SYS-98). Blood Mend self (SYS-91). Motoko `reflect_barrier` `minRange`/`maxRange` 0 — do not assign until SYS-13.  
**IMPLEMENTATION_COMPLEXITY:** Medium (one helper; delete per-id branches).  
**TEST_SCENARIOS:** Self spell + ally dest → dropped. Ally spell + caster dest legal only if `targetType` allows caster tile. Enemy spell + ally dest → dropped.  
**STATUS:** PROPOSED

### AI-FUT-118

**AI_ID:** AI-FUT-118  
**NAME:** Pack interpose vs the attacker that can currently hit the ward  
**ROLE:** team / positioning  
**SOPHISTICATION:** T6 (POS-07 / TEM-02 / TEM-06; SYS-100 / SYS-93 / FUT-111)  
**DECISION_RULES:** After SYS-100: T3+ protectors score guard dests that break LoS or occupy the only melee tile the nearest attacker would use next (visible occupancy only — no hidden player click). Formations (parent TEM-06) may offset a second protector to the orthogonal guard tile. T1 may only stand on the ward→threat line. Retreat-toward-support remains FUT-111 (the *ward* walking, not the protector). Do not use raw `allyCount` (SYS-83).  
**SCORING_MODEL:** `U(guard) += wBlock if dest ∈ meleeTiles(attacker, ward)` + `wLosBreak` if attacker requires LoS and dest is on the Bresenham line (walls only; no body-block LoS cheat).  
**SPELL_REQUIREMENTS:** None, or Shield after arriving (FUT-116).  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.4` when living protector + ward ≥ 1. Solo remnants skip.  
**ENEMY_ARCHETYPES:** protector, tank, guardian, healer idle.  
**PLAYER_COUNTERPLAY:** Walk around the body-block; they spend MP to re-interpose. Kill the protector first.  
**EDGE_CASES:** Attacker is a range-4 frost bishop → occupying melee tiles does nothing; prefer LoS break / hold. Do not invent body-block LoS.  
**IMPLEMENTATION_COMPLEXITY:** Medium after SYS-100.  
**TEST_SCENARIOS:** Player melee at (2,3), ward (2,2), two guard tiles → T3+ occupies (2,3) if free, else (1,2)/(3,2). Caster threat at dist 4 with wall alternative → dest on the wall-break side.  
**STATUS:** PROPOSED

### AI-FUT-119

**AI_ID:** AI-FUT-119  
**NAME:** Authored role survives kit width as relative difficulty rises  
**ROLE:** role / system  
**SOPHISTICATION:** T6 (ROL-01…10; SYS-101 / SYS-04 / FUT-109)  
**DECISION_RULES:** After SYS-101 and SYS-04: spawn writes `Enemy.role` (tank, assassin, kiter, healer, support, summoner, controller, artillery, disruptor, protector) from the family table / boss sheet — **not** from `range > 1` and **not** from `healAmount > 0`. Kit width growing with relative difficulty (SYS-09 / FUT-109) may *add* a profiled id (rook + Iron Skin, pawn + venom) without changing the role. A year-later protector that also knows a range-3 taunt stays protector. Overlay attach remains §4 sigmoid, not `if (enemy.level >= 100) role = "elite"`. T0 may keep the heuristic as a debug fallback only when `role` is missing.  
**SCORING_MODEL:** `roleWeights[role][k]` from parent §5. Wrong inference today zeroes those weights.  
**SPELL_REQUIREMENTS:** Role table lists which profiles that role may emit. No profile → not in kit.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Role is authored at all absolute levels. Module attach probability still uses `peer`, not a level table.  
**ENEMY_ARCHETYPES:** all ten requested roles.  
**PLAYER_COUNTERPLAY:** The initiative strip / intent log shows the role. A tank with Iron Skin still walks up.  
**EDGE_CASES:** Queen + Blood Mend = artillery unless the family table says healer (SYS-04). King + Rally stays leader/support only after SYS-41. Summoner overlay remains SYS-89 / FUT-23 — do not key it on player level 44.  
**IMPLEMENTATION_COMPLEXITY:** Medium (spawn metadata + delete heuristic branches).  
**TEST_SCENARIOS:** Family table `role: "tank"`, kit Strike+Iron Skin → `decideCharger` / protector, not `decideCaster`. Family `role: "artillery"`, kit frost+Blood Mend → frost, not `decideHealer` (SYS-04 gone). Player 4000 vs remnant tank → still tank, T0–T1 modules only.  
**STATUS:** PROPOSED

---

## 5. Spell-awareness contract (reminder)

Unchanged: no profile + apply ⇒ not in kit, not in elite extras, `usableByEnemy` treated as false in the enumerator.

Still `usableByEnemy: true` without a working decide+apply pair (do not give these to pack AI until FUT-22 / FUT-25 / FUT-31 / SYS-96 apply):

`spell-swap`, `spell-mark`, `spell-sacrifice`, `spell-lifesteal-nova`, `spell-enrage`, `spell-haste`, `spell-weaken`, `spell-expose`, `spell-drain-courage`, `spell-cursed-wound`, `spell-shadow-veil`, `spell-frost-nova`, `spell-inferno` (DoT `damage: 0`, `areaRadius: 0`), `starter-poison` / `spell-venom-strike` (hunter/archer *already emit* — SYS-96 must land before those kits are honest), `starter-shield` / `spell-iron-skin` (guardian already emits — SYS-98 / pack apply still missing).

Keep `usableByEnemy: false` until profiled: barrier, mirror, timestep, rallying-cry, sentinel/bomber/wisp summons.

`starter-heal` is self-only (`range: 0`, `targetType: "self"`). SYS-91 is the pack healer profile. `spell-rallying-cry` is the same shape and is **not** an ally rally (SYS-99).

Motoko `defaultSpells` (`shadow_strike`, `soul_rend`, `vampire_bite`, `reflect_barrier`, `thunder_clap`, `void_collapse`) are `usableByEnemy: true` but have `minRange` / `diagonal` / `lineOfSight: false` / attract AoE that `enemyCastGeometryOk` does not implement. SYS-90 forbids using them as frost substitutes. Do not assign `thunder_clap` as a bomber “real AoE” until SYS-13 + a profile exist.

`summon-dire-wolf` / `summon-archer` are `usableByEnemy: true` with range 2. SYS-86 is the profile: ground dest in range.

Kit frost staying at spellbook damage (SYS-72) is **not** a reason to assign Inferno. SYS-79’s kit-pick still requires `damage > 0`. Frost range is 4 (`spellData.ts` 131). Poison range is 4 (`spellData.ts` 56). Venom range is 2 (`spellData.ts` 401).

---

## 6. Implementation order (this increment)

Do not start FUT-114+ first. Do not start T6+ from earlier increments before P0 honesty.

1. SYS-05 (Fire Bolt WX **16712**, AP/MP debit, ally heal WX **16648**) — still P0. This also removes the `level/5` bolt cheat (SYS-72). Empty-kit bishops (SYS-90) and failed DoTs (SYS-96) currently *only* Fire-Bolt.  
2. SYS-01 — replace `computeAITier` (`combatMath.ts` 36–52) and the `aiTier >= 5/10` gates (WX **15507** / **15594**).  
3. SYS-73 — drop the 999 spawn ceiling so SYS-01 `peer` still works at high player level.  
4. SYS-90 — prefer merge/follow **#911**; do not double-patch assign. Then SYS-09 zone key.  
5. **SYS-96** — lift the DoT writer out of `spellDmg > 0`. Then FUT-114.  
6. SYS-13 + SYS-06 + SYS-11 + SYS-20 — side-aware legality. `enemyCastGeometryOk` is not sufficient.  
7. SYS-91 + SYS-99 + FUT-117 — `targetType` self vs ally. Prefer #924 for SYS-95.  
8. SYS-04 then **SYS-101** + FUT-119 — authored roles; stop heal-first and range>1-buff-first.  
9. **SYS-97** + FUT-115 — intent-aligned walk. SYS-92 approach hazards still 10-23.  
10. **SYS-98** + FUT-116 — protector sequence.  
11. **SYS-100** + FUT-118 — interpose vs nearest attacker. SYS-93 retreat still 10-23.  
12. SYS-86 / SYS-89 + FUT-104 — legal summon dest + kit fallthrough (still #874).  
13. Parent T2–T5 roles / team / adaptive; remaining FUT-01…113.

Each slice: `engine/enemyAI*.test.ts`, zero WX drive-by, no RAF / map gen / turn order / damage-formula edits unless a **named** follow-up. Scoring **reads** RES/SR/CHC; it does not change `calcScaledDamage`.

---

## 7. Extra test scenarios

| ID | Setup | Expect |
| :--- | :--- | :--- |
| TS-DOT0 | Archer poison ready, dist 3, LoS | Public poison DoT; never `e-firebolt` (SYS-96). |
| TS-VEN0 | Hunter venom ready, dist 2 | Public venom DoT; never bolt (SYS-96). |
| TS-INF0 | Bomber Inferno ready, dist 2, `areaRadius: 0` | Single-target burn or skip; no radius-2 splash; no bolt (SYS-96). |
| TS-WALKAWAY | Origin (4,4), target (2,4), (3,4) occupied, (5,4) free | Dest ≠ (5,4) (SYS-97). |
| TS-IRONPRE | Golem (0,0), ward (4,0), Shield+Iron ready | `kind: "move"` toward ward, not Iron Skin (SYS-98). |
| TS-RALLYSELF | Wisp, player dist 2, Rally assigned, Blood Mend on CD | No Rally cast on the player (SYS-99). |
| TS-GUARDNEAR | Ward (2,2), player (2,3), summon (0,0) first in list | Guard between ward and player (SYS-100). |
| TS-ROOKROLE | Rook kit Strike+Iron Skin | Archetype not caster (SYS-101). |
| TS-PAWNROLE | Pawn kit Strike+venom | Archetype charger, not caster (SYS-101). |
| TS-BOLT3 | Failed frost / failed DoT, Chebyshev 1 | Crush or skip; never `e-firebolt` (WX 16712). |
| TS-PEER3K | Player 3000, enemy 3000 | Not forced T5; remnant 400 stays low tier (FUT-92). |

Parent and 2026-09-01…10-23 TS-* rows still apply (line numbers in §1.2). Frost examples use live range **4**. Poison kite examples use live range **4**. Venom range is **2**.

---

## 8. Mapping (new gaps → ids)

| Request / gap | Primary AI_ID |
| :--- | :--- |
| Pack DoT writer nested under `damage > 0`; hunter/archer/bomber emit poison/venom/Inferno then Fire-Bolt | AI-SYS-96 / AI-FUT-114 |
| `stepToward` Set-order fallback walks away | AI-SYS-97 / AI-FUT-115 |
| Guardian Iron Skin preempts Shield-on-ward approach | AI-SYS-98 / AI-FUT-116 |
| Wisp Rallying Cry is self range 0 / `usableByEnemy: false` aimed at a ward | AI-SYS-99 / AI-FUT-117 |
| Healer/guardian/wisp interpose uses `opponents[0]` | AI-SYS-100 / AI-FUT-118 |
| `inferArchetype` counts range>1 buffs/DoTs as ranged attacks | AI-SYS-101 / AI-FUT-119 |

T0–T5 requested list (positioning, targeting, resources, roles, team, adaptive) remains parent §19. Nothing in that list is implemented. Higher-level enemies still get harder from **modules on the sigmoid** and from **honest relative spawn** (SYS-73 / FUT-92 / SYS-89), not from `computeAITier(enemyLevel)`, not from a kit-less bolt, not from a failed poison, and not from a rook that routes as a frostless caster.

Requested capability → already-catalogued parent id (unchanged; still **PROPOSED**), plus this increment’s honesty slices:

| Request | Parent id | This increment |
| :--- | :--- | :--- |
| maintain optimal range / retreat / approach vulnerable / avoid hazards / exploit terrain / avoid AoE clustering / protect allies / escape routes | POS-01…08 | approach walk = SYS-97 / FUT-115; protect = SYS-100 / FUT-118 |
| low-HP / high-threat / support / summons / resistance / kill / strategic | TGT-01…07 | DoT EV = FUT-114 |
| AP combinations / move-then-attack / attack-then-retreat / sequencing / cooldown / waste | RES-01…06 | protector sequence = FUT-116 |
| tank … protector | ROL-01…10 | authored role = SYS-101 / FUT-119; guardian = SYS-98 |
| focus fire / protect support / exploit debuffs / avoid duplicate debuffs / coordinated AoE / formations / retreat toward support | TEM-01…07 | duplicate DoT = FUT-114; interpose formation = FUT-118 |
| estimate threat / punish positioning / adapt HP / adapt AP-MP / summons / status / own HP / survival vs aggression | ADV-01…08 | `targetType` = FUT-117 |

Every row above is **STATUS: PROPOSED**. No production AI in this change.
