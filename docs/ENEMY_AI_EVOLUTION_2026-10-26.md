# Advanced Enemy AI Evolution — 2026-10-26 increment

**Status:** PROPOSED (design only; no production code in this change)  
**Date:** 2026-10-26  
**Parent catalog:** [`ENEMY_AI_EVOLUTION.md`](./ENEMY_AI_EVOLUTION.md) (T0–T5)  
**Prior increments:** [`ENEMY_AI_EVOLUTION_2026-09-01.md`](./ENEMY_AI_EVOLUTION_2026-09-01.md) · [`ENEMY_AI_EVOLUTION_2026-09-02.md`](./ENEMY_AI_EVOLUTION_2026-09-02.md) · [`ENEMY_AI_EVOLUTION_2026-09-21.md`](./ENEMY_AI_EVOLUTION_2026-09-21.md) (open PR #351; SYS-22…32, FUT-36…47 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-22.md`](./ENEMY_AI_EVOLUTION_2026-09-22.md) (open PR #416; SYS-33…35, FUT-48…53 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-23.md`](./ENEMY_AI_EVOLUTION_2026-09-23.md) (open PR #458; SYS-36…41, FUT-54…59 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-24.md`](./ENEMY_AI_EVOLUTION_2026-09-24.md) (open PR #506; SYS-42…47, FUT-60…65 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-25.md`](./ENEMY_AI_EVOLUTION_2026-09-25.md) (open PR #565; SYS-48…53, FUT-66…71 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-26.md`](./ENEMY_AI_EVOLUTION_2026-09-26.md) (open PR #633; SYS-54…59, FUT-72…77 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-27.md`](./ENEMY_AI_EVOLUTION_2026-09-27.md) (open PR #689; SYS-60…65, FUT-78…83 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-28.md`](./ENEMY_AI_EVOLUTION_2026-09-28.md) (open PR #723; SYS-66…71, FUT-84…89 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-29.md`](./ENEMY_AI_EVOLUTION_2026-09-29.md) (open PR #804; SYS-72…77, FUT-90…95 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-10-21.md`](./ENEMY_AI_EVOLUTION_2026-10-21.md) (open PR #821; SYS-78…83, FUT-96…101 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-10-22.md`](./ENEMY_AI_EVOLUTION_2026-10-22.md) (open PR #874; SYS-84…89, FUT-102…107 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-10-23.md`](./ENEMY_AI_EVOLUTION_2026-10-23.md) (open PR #958; SYS-90…95, FUT-108…113 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-10-24.md`](./ENEMY_AI_EVOLUTION_2026-10-24.md) (open PR #999; SYS-96…101, FUT-114…119 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-10-25.md`](./ENEMY_AI_EVOLUTION_2026-10-25.md) (open PR #1072; SYS-102…107, FUT-120…125 — **do not re-number**)  
**Implementer ledger:** [`automation/ACTION_IDS_AEE_2026-10-26.md`](./automation/ACTION_IDS_AEE_2026-10-26.md)

This increment re-reads the live engine one day after the 2026-10-25 catalog (#1072). SYS-01…107 and FUT-01…125 stay **PROPOSED** on their own files; they are **not** re-filed here. New work is: adjacent chargers / flankers / berserkers / generic pawns emit kit `physical_attack` as `kind: "cast"`, so Strike takes the pack **spell** SP×RES arm (SYS-66) instead of the melee RES-only write (SYS-68); `scoreAlly` does not call `threatValue()` so a wisp ward is scored as `"healer"` (0.8) not wisp (1.0); wisp `decideSummonHealer` still walks toward an unhealable ally because `starter-heal` is self/range 0 and summon `allies` omit self; hunter venom in Chebyshev range with LoS blocked never `repositionForLOS` (caster and archer do); summon `applyCast` never re-checks range / LoS / `targetType`; `decideHealer`’s `healSpell` is first `healAmount > 0`, so a drain id is aimed at a wounded **ally**.

Stralt has **no character level cap**. Nothing here maps `if (level >= X) sophistication = Y`. Tiers remain conceptual. Eligibility remains the parent §4 sigmoid (`peer = log2(enemy.level / player.level)` plus pack/boss/modifier terms). A year-later peer fight at any absolute level can attach a new module without raising a cap. A pawn that “Strikes” through the player’s SP as if Strike were Frost, and a wisp that walks instead of Blood-Mending itself, are **honesty**, not a last band.

**Hard rules (unchanged):** no cheat, no hidden player information, no ignored LoS/range/AP/MP, no unbounded search, no kit-less Fire Bolt, no `instantKill`, no betrayal-as-difficulty, no name-based spell heuristics, no production AI in this change. Do not “fix” Strike by deleting SP from **Frost**. Do not “fix” drain by letting it heal allies. Do not “fix” summon apply by skipping LoS. Do not copy Motoko `thunder_clap` / `void_collapse` into bomber kits. Do not copy #1026’s no-LoS/no-AP leftover detector.

Open production PRs that already slice honesty (do **not** re-file the ids, do **not** copy the patches into this docs PR):

| Open PR | Catalog id | What it changes |
| :--- | :--- | :--- |
| [#495](https://github.com/Mr-Melic/stralt/pull/495) (draft) | AI-SYS-34 | Apply `targetCell` from `playerPositionRef`. Live apply still uses render `playerPosition` (WX **16436–16438**). |
| [#498](https://github.com/Mr-Melic/stralt/pull/498) (draft) | AI-SYS-45 | Boss kit-spell apply must not commit `targetX/Y` as a walk dest. |
| [#487](https://github.com/Mr-Melic/stralt/pull/487) (draft) | (not a tactic) | Betrayal kills enter the death pipeline. Spectacle remains forbidden as sophistication. |
| [#644](https://github.com/Mr-Melic/stralt/pull/644) (draft) | (player drain) | Catalog `spellType` drain as player lifesteal. Not pack SYS-113. |
| [#647](https://github.com/Mr-Melic/stralt/pull/647) (draft) | (Soul Rend apply) | Do not emit Soul Rend in kits until apply lands real damage. |
| [#649](https://github.com/Mr-Melic/stralt/pull/649) (draft) | (Trap tiles) | Ground trap legality is player-side until a profile + SYS-13 exist. |
| [#654](https://github.com/Mr-Melic/stralt/pull/654) (draft) | (void holes) | Occupancy already refuses `voidTiles` in `isCellFree`. |
| [#658](https://github.com/Mr-Melic/stralt/pull/658) (draft) | (RES/SP shreds) | Scoring may read `getStatModifier` after it ships; do not change `calcScaledDamage`. |
| [#659](https://github.com/Mr-Melic/stralt/pull/659) (draft) | (Shield RES melee) | Distinct from SYS-63 / SYS-66 / SYS-68 / SYS-108. |
| [#700](https://github.com/Mr-Melic/stralt/pull/700) (draft) | (player auto-summon kit) | Player-side. Not pack decide. |
| [#709](https://github.com/Mr-Melic/stralt/pull/709) (draft) | (Sentinel Shield on ally) | Player click-heal. Not pack healer apply (SYS-05). |
| [#821](https://github.com/Mr-Melic/stralt/pull/821) (draft) | SYS-78…83 / FUT-96…101 | 2026-10-21 design increment. Unique files only. |
| [#842](https://github.com/Mr-Melic/stralt/pull/842) (draft) | AI-SYS-88 (spawn stamp) / SYS-55 (routing) | Hostile minion `summonKit` + `decideSummonAction`. **Do not re-implement.** |
| [#861](https://github.com/Mr-Melic/stralt/pull/861) (draft) | (player auto-summon empty kit) | Player-side catalog resolve. Not pack SYS-90. |
| [#874](https://github.com/Mr-Melic/stralt/pull/874) (draft) | SYS-84…89 / FUT-102…107 | 2026-10-22 design increment. Unique files only. |
| [#911](https://github.com/Mr-Melic/stralt/pull/911) (draft) | AI-SYS-90 (kit resolve) | Pack kits when Motoko catalog misses starter ids. **Do not re-implement.** |
| [#924](https://github.com/Mr-Melic/stralt/pull/924) (draft) | AI-SYS-95 (heal `buffStat`) | Share WX enemy heal execute with advertised CHC. **Do not re-implement.** |
| [#947](https://github.com/Mr-Melic/stralt/pull/947) (draft) | (DoT execute ticks) | WX enemy DoT execute advertised ticks. Complements SYS-96. |
| [#967](https://github.com/Mr-Melic/stralt/pull/967) (draft) | (pack DoT decide) | Share pack-enemy DoT decide with `pickBestDamageSpell`. Not SYS-111. |
| [#972](https://github.com/Mr-Melic/stralt/pull/972) (draft) | (Inferno CD) | Arm pack-enemy Inferno cooldown outside `damage > 0`. |
| [#974](https://github.com/Mr-Melic/stralt/pull/974) (draft) | (buff execute) | Share pack-enemy buff execute with advertised `buffStat`. |
| [#978](https://github.com/Mr-Melic/stralt/pull/978) (draft) | (buff decide) | Share pack-enemy buff decide with `pickBestDamageSpell`. |
| [#985](https://github.com/Mr-Melic/stralt/pull/985) (draft) | AI-SYS-107 (self-heal list) | Pack-enemy heal decide when **no** wounded ally exists. **Do not re-implement.** SYS-110 is the **wisp** twin, not this pack list. |
| [#989](https://github.com/Mr-Melic/stralt/pull/989) (draft) | (empty-damage heal picker) | Pack-enemy heal decide once `decideCaster` is reached. Not SYS-113. |
| [#999](https://github.com/Mr-Melic/stralt/pull/999) (draft) | SYS-96…101 / FUT-114…119 | 2026-10-24 design increment. Unique files only. |
| [#1026](https://github.com/Mr-Melic/stralt/pull/1026) (draft) | AI-SYS-102 | Pack-enemy healer **approach** vs advertised Frost. Sidecar only — **do not copy.** |
| [#1033](https://github.com/Mr-Melic/stralt/pull/1033) (draft) | AI-SYS-103 | Pack-enemy healer **approach** vs Inferno leftover. Sidecar only. |
| [#1034](https://github.com/Mr-Melic/stralt/pull/1034) (draft) | AI-SYS-104 | Pack-enemy healer **backline-guard** vs Frost leftover. Sidecar only. |
| [#1039](https://github.com/Mr-Melic/stralt/pull/1039) (draft) | AI-SYS-105 | Pack-enemy healer **backline-guard** vs Inferno leftover. Sidecar only. |
| [#1072](https://github.com/Mr-Melic/stralt/pull/1072) (draft) | SYS-102…107 / FUT-120…125 | Yesterday’s design increment. Unique files only. |

This docs PR does **not** edit [`ENEMY_AI_EVOLUTION.md`](./ENEMY_AI_EVOLUTION.md) (open PR #351 unions that header). Unique files only.

---

## 1. Re-read (2026-10-26) — what moved

All line numbers are from this checkout. Re-read them before implementing.

### 1.1 Combat-parity still is not sophistication

Unchanged from 2026-09-21…10-25: `enemyCastGeometryOk` (`targeting.ts` 166–177), `aiCanCast` (`enemyAI.ts` 320–332), Frozen walk *rate* (`enemyWalkMp.ts` 21–29; WX pack **16345** and summon **15181** / **15227** *do* pass `isFrozenTerrain`), `playerCastPlan.ts` (player only), summon leftover-AP `reevaluate` (`summonExecutor.ts` 249–254). These are **not** SYS-05 / SYS-13 / SYS-01. Do **not** re-file `reevaluate`. SYS-112 is the **applyCast gate**, not the follow-up call.

`aiCanCast` is still unused by healer (1099–1100) and guardian (2131–2133). That remains **AI-SYS-23**. Caster in-range uses it (953); hunter venom uses it (1941) then does **not** sidestep when it fails (this file’s SYS-111). Archer still repositions (2271–2292).

`enemyAI.ts` still has **zero** reads of `currentAp`, `currentMp`, or `apCost`. Pack walk budget is still `ENEMY_REACHABLE_STEP_BUDGET = 3` (`gameConstants.ts` 166; `computeReachable` 377–378). `getEffectiveStat` is declared on `DecideEnemyContext` (275–276) and **never read** by `estimateDamage` / `scoreTargets` / any `decide*`. `allyCount` / `enemyCount` are declared (259–261) and **never read** (SYS-83 still owns the wrong snapshot values).

Do **not** feed `spellRangeBase` into AI (`targeting.ts` 111–115 / `enemySpellRange` 133–137). Do **not** treat `enemyCastGeometryOk` as SYS-13 complete.

`physical_attack` / Strike is **`isPhysical: true`**, damage 10, range 1 (`spellData.ts` **9–25**). Player `computeDamage` uses RES only when `isPhysical` (WX **3351–3354**) and SP/SR when not (3318–3363). Pack kit-cast apply (**16459–16537**) never reads `isPhysical` or SR; it always multiplies player **SP × RES**. Pack melee fallback (**16722–16728**) is RES only (SYS-68). `starter-heal` remains self / range 0 (`spellData.ts` **85–101**). `starter-drain` healAmount 5 (`spellData.ts` **103–122**); `spell-drain-courage` healAmount 9, `targetType: "enemy"`, `usableByEnemy: true` (`spellData.ts` **438–457**).

### 1.2 Line numbers vs 2026-10-25 (P0 sites did not move)

| Fact | 2026-10-25 | Live (2026-10-26) |
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
| Pack snapshot skips acting `enemyId` | (not called out) | **16276** — self is absent from `combatants` (SYS-107 still uses `ctx.enemy`) |
| `aiTier >= 5` erratic | WX 15507–15591 | **unchanged** |
| `aiTier >= 10` betrayal | WX 15594–15600 | **unchanged** |
| Dest-commit clamp | WX 16416–16423 | **16416–16423** (SYS-58) |
| Apply `targetCell` render `playerPosition` | WX 16436–16438 | **16436–16438** (SYS-34 / #495) |
| Apply Chebyshev only | WX 16450–16456 | **16450–16456** |
| Damage/drain gate `spellDmg > 0` | WX 16459–16462 wraps DoT **16610–16625** | **unchanged** (SYS-96) — **no `isPhysical` read** (this file’s SYS-108) |
| Player `computeDamage` RES-only when physical | (not called out) | WX **3351–3354** vs pack kit-cast **16475–16537** |
| Pack melee RES-only private write | SYS-68 | WX **16722–16728** (SYS-68) — hunter adjacent already uses `kind: "melee"` (**1961–1974**) |
| Self-heal `range === 0` | WX 16648–16670 | **unchanged** — HP only, no `buffStat` (SYS-95 / #924) |
| Fire Bolt `e-firebolt` | WX 16712 | **16712** |
| `decideEnemyAction` | 1662–1707 | **1662–1707** |
| `allies` exclude self | 1674–1676 | **1674–1676** (SYS-107). Summon allies **1772–1774** (this file’s SYS-110) |
| `decideHealer` healSpell first `healAmount > 0` | (SYS-04 routing) | **1095–1097** (this file’s SYS-113) |
| `decideHealer` approach-ally | 1114–1132 | **1114–1132** (SYS-102 / SYS-103) |
| `decideHealer` backline-guard | 1134–1164 | **1134–1164** (SYS-104 / SYS-105) |
| Charger adjacent `kind: spell ? "cast" : "melee"` | (not called out) | **1197–1213** (SYS-108) |
| Flanker / berserker / generic same | — | **1337–1356** / **1428–1448** / **1533–1551** |
| `threatValue` wisp/healer | 511–521 | **511–521** |
| `scoreAlly` raw table lookup | (not called out) | **2023–2048** (this file’s SYS-109) |
| Hunter venom LoS, no sidestep | (SYS-23 healer/guardian) | **1939–1975** (this file’s SYS-111) |
| Archer `repositionForLOS` | 2271–2292 | **2271–2292** |
| Wisp heal approach | SYS-99 = Rally 2521–2543 | **2485–2519** approach (SYS-110); Rally still SYS-99 |
| Executor `applyCast` no geometry | (reevaluate not re-filed) | `summonExecutor.ts` **153–209** (this file’s SYS-112) |
| Bomber `AI_KAMIKAZE_BLAST_RADIUS` | 2387–2393 | **2387–2393** (SYS-106) |
| `pickBossKitSpell` `new Map()` | `useBossAI.ts` 169–173 | **169–173** (and every sibling) |
| `ENEMY_AI_TIER_GATES` | unread | still unread (`enemyAI.ts` comment only at **1422–1423**) |
| Hostile `summonAI = pieceType` | `summonSpawn.ts` 275 | **275** (SYS-88 / #842) |

P0 remains **AEE-2026-08-31-002** (Fire Bolt / apply honesty) then **AEE-2026-08-31-001** (`computeAITier`). Then 09-21…10-25 honesty. Then this file’s SYS-108…113. Do not start FUT-126+ first. Adjacent kit Strike currently *only* Fire-Bolts if the spell arm is skipped; live Strike-as-cast **does** land, through the **wrong mitigation**. That is on the P0 honesty path, not a T6 extra.

### 1.3 Still true — do not re-file (parent / 09-21…10-25)

- Zone-0 kits forever (`Math.floor(levelZone)` on an object). SYS-09. SYS-90 is the **id resolve** after that floor, not the NaN.
- `scoreTargets` ignores `focusTargetId`. SYS-08 / AI-SYS-30 (prepend also destroyed by sort). SYS-93 is caster *retreat* from `opponents[0]`. SYS-100 is *interpose*. Do not re-file the Wisp prepend as SYS-108.
- `estimateDamage` returns 0 when `spell.damage <= 0`. SYS-02 / SYS-39. SYS-96 is the **apply nest**.
- Heal-first `inferArchetype` (447–452). SYS-04 / SYS-41. SYS-113 is the **healSpell picker** inside `decideHealer`, not the routing.
- Pack healer idle ward `allies.find(!isSummon)` (1142). **FUT-83** (09-27). Do not re-file.
- Hazard avoid only below 50% HP; ice/lava/spikes only (425–441). POS-04 / FUT-09 / FUT-59 / FUT-93. SYS-92 is that **approach never calls the filter**. SYS-97 is the *fallback* walk direction.
- Retreat / `reposition-los` `kind: "skip"` while dest-commit still moves. POS-02 / FUT-41 / SYS-58.
- Summoner chance hits 1.0 at player level 44. FUT-23. Skip-brain is SYS-89.
- `ENEMY_AI_TIER_GATES` unread. SYS-01.
- Summon executor Chebyshev teleport MP. SYS-15 / 09-21 SYS-25.
- Family overlay second `computeAITier`. AI-SYS-29.
- `findKitSpell` assigned fallback (1737–1745). AI-SYS-32.
- Strip / `resolveEnemyApMp` uses `enemy.level` for AP/MP. SYS-54.
- Hostile summons skip the paid executor. SYS-55. **#842 routes decide; it still does not send hostiles through `executeSummonAction`.** Pack hunter/archer/bomber therefore hit WX apply (SYS-96 / SYS-106 / SYS-108), not `applyEffect`.
- Boss occupancy list empty. SYS-56.
- Erratic dest ignores portal/void/barrier. SYS-57.
- Dest-commit clamp-only. SYS-58.
- Pack/summon Plague+Void store ticks. SYS-60. Do not implement SYS-59’s “pack immunity.”
- Pack→player skips `applyDamageDealt`. SYS-61.
- Pack dest-commit vs reserved. SYS-62.
- Shield Charm remaining is public. SYS-63 snapshot; spell-path soak is SYS-66.
- Enumerator `applyApCost`. SYS-64.
- Null Field vs non-DoT. SYS-65.
- Pack→player spell SP × RES × `playerTakesDamage` RES. SYS-66. SYS-108 is that **Strike** currently uses this arm.
- `enemyTakesDamage` returns pre-mod `dmg`. SYS-67.
- Pack melee private write. SYS-68. SYS-108 is that kit Strike never *reaches* it.
- Initiative strip dummy RES. SYS-69.
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
- `allyCount` / `enemyCount` include player summons. SYS-83. Still unread by decide.
- `wLowHp` `effectiveHp ?? hp`. SYS-84 / FUT-102.
- Lookahead/spill skip `aiCanCast`. SYS-85 / FUT-103.
- Summoner midpoint teleport. SYS-86 / FUT-104.
- `stepFlank` tackle = all adjacent. SYS-87 / FUT-105.
- Hostile `summonAI = pieceType`. SYS-88 / #842.
- `isSummoner` skip eats the piece kit. SYS-89.
- Pack kit ids miss Motoko `defaultSpells`. SYS-90 / #911.
- Blood Mend is self range 0; pack healer decide targets other allies. SYS-91. SYS-102 is that this also **blocks Frost**. SYS-107 is that **pack** self is not in `allies`. SYS-110 is the **wisp** list + approach.
- `stepToward` / flank / legal-cast dests skip `filterHazardCandidates`. SYS-92.
- Caster *retreat* uses `opponents[0]`. SYS-93. SYS-100 is interpose.
- Archer `MIN_KITE_RANGE = 3` vs poison range 4. SYS-94.
- Range-0 heal drops advertised CHC. SYS-95 / #924.
- Pack apply DoT nested under `damage > 0`. SYS-96.
- `stepToward` Set-order fallback walks away. SYS-97.
- Guardian Iron Skin preempts Shield-on-ward approach. SYS-98.
- Wisp Rallying Cry is self range 0 aimed at a ward. SYS-99. SYS-110 is Blood Mend *approach*, not Rally.
- Healer/guardian/wisp interpose uses `opponents[0]`. SYS-100.
- `inferArchetype` counts range>1 buffs/DoTs as ranged attacks. SYS-101.
- Pack healer approach swallows Frost / Inferno. SYS-102 / SYS-103.
- Pack healer backline-guard preempts Frost / Inferno. SYS-104 / SYS-105.
- Bomber private radius-2 + suicide inside `damage > 0`. SYS-106.
- Pack `allies` exclude self. SYS-107 / #985.
- Pack healer `pickBestAlly` still `allies.find(!isSummon)` at **1142**. **FUT-83** — do not re-file.
- `hasBresenhamLoS` still ignores combatant bodies. Do not propose an AI-only body-block LoS module.
- `engine/summonAI.ts` `runSummonAI` remains unused.
- Diagonal `stepToward` candidate (`enemyAI.ts` **595–596**) still must be in `reachable` (SYS-15).

### 1.4 New honesty gaps (this increment)

1. **Kit Strike is applied as a spell, so it pays player SP (and SYS-66’s second RES) instead of melee RES-only.** `physical_attack` is `isPhysical: true`, range 1, damage 10 (`spellData.ts` **9–25**). Player `computeDamage` skips SP and SR when `isPhysical` (WX **3318–3364**). Pack charger / flanker / berserker / generic adjacent pick Strike via `pickBestDamageSpell` and return `kind: "cast"` (**1197–1213**, **1337–1356**, **1428–1448**, **1533–1551**). WX pack apply then takes the `spellType === "damage" && spellDmg > 0` arm (**16459–16537**): `plSpEff` from `characterStats.sp` (**16475–16482**) × RES, then `playerTakesDamage` (SYS-66). SYS-68’s melee arm (**16722–16728**, RES only, no SP) never runs because `didAct` is already true. Hunter adjacent is the honesty template: `kind: "melee"`, `spell: null` (**1961–1974**). Do not “fix” by putting SP on player Strike. Do not delete SP from Frost. SYS-108.

2. **`scoreAlly` does not call `threatValue()`, so wisp/protector wards are mis-weighted.** Section 5 comment (**2004–2008**) claims ally scoring reuses `ENEMY_THREAT_VALUES` / `threatValue`. `threatValue` (**511–521**) maps summon `healer`/`wisp` → `ENEMY_THREAT_VALUES.wisp` (1.0) and other summons → 0.6. `scoreAlly` (**2033–2036**) does `ENEMY_THREAT_VALUES[(ally.summonAI ?? "").toLowerCase() || "default"]`. Live wisp `summonAI` is `"healer"` → **0.8**, not 1.0. `"guardian"` / `"archer"` / `"bomber"` are missing keys → **default 0.3**, same as the player. Pack `decideHealer` still uses `allies.find(!isSummon)` (FUT-83) so this scorer is currently summon-only (guardian Shield / wisp heal / Rally). Wrong weights still pick the wrong ward. Do not name-match `"wisp"`. SYS-109.

3. **Wisp Blood Mend never sees self and walks toward an unhealable ally.** `decideSummonAction` allies omit the acting summon (**1772–1774**). `decideSummonHealer` wounded list is those allies (**2481–2484**); `starter-heal` is self / range 0 (`spellData.ts` **85–101**). Dist to another unit is always > 0, so the in-range heal is dead and **2501–2519** returns `kind: "move"` / `intent: "approach-ally"` unconditionally (even when `stepToward` dest === origin). Rally on a ward remains SYS-99. Pack twins are SYS-102 (approach swallows Frost) and SYS-107 (pack `allies` omit self) — do not re-file those. This id is the **summon** list + approach. Paid executor will not Fire-Bolt (no WX fallback); hostile wisps skip the executor (SYS-55) and *can* Fire-Bolt after dest-commit (SYS-05). Open #985 is pack-only. SYS-110.

4. **Hunter venom in Chebyshev range with LoS blocked walks in instead of sidestepping.** `decideSummonHunter` (**1939–1958**): if venom is ready and `dist <= enemySpellRange` (2), it casts only when `aiCanCast` (range+LoS). There is no `repositionForLOS` branch. Caster has it (**972–995**). Archer has it (**2271–2292**). SYS-23 owns healer/guardian Chebyshev-without-LoS *casts*. This id is hunter’s *missing sidestep* after a LoS fail: fallthrough melee if dist ≤ 1, else `stepToward` (**1976–1993**) into the wall. Do not skip LoS to “land venom.” SYS-111.

5. **Summon `applyCast` never re-checks range, LoS, or `targetType`.** Pack apply at least Chebyshev-checks from the committed dest (WX **16450–16456**). `executeSummonAction` `applyCast` (`summonExecutor.ts` **153–209**) checks AP, then `damage > 0` / `healAmount > 0` / `applyEffect`. No `enemyCastGeometryOk`, no `targetType`, no occupancy of dest. Guardian Shield through a wall (SYS-23) still writes. Wisp Rally on a ward (SYS-99) still writes if decide emitted it. Do **not** re-file leftover-AP `reevaluate` (**249–254**) — 10-23/10-24/10-25 already said it is not a new SYS. This id is the **apply gate** those follow-ups (and the first decide) must pass. Hostile summons never reach it (SYS-55). SYS-112.

6. **`decideHealer` treats any `healAmount > 0` id as the heal spell, including drains aimed at allies.** Picker **1095–1097**: first `spellType === "heal" || (healAmount ?? 0) > 0`. `starter-drain` has healAmount 5 (`spellData.ts` **103–122**). `spell-drain-courage` has healAmount 9, `spellType: "drain"`, `targetType: "enemy"`, `usableByEnemy: true` (`spellData.ts` **438–457**). SYS-04 already routes those kits into `decideHealer`. The picker then aims the drain at the most-wounded **ally**. If Chebyshev ≤ 2, apply’s drain arm (**16459–16462**, **16626–16638**) **damages the ally** and heals the caster. SYS-91 is Blood Mend *self vs ally dest*. SYS-102 is Blood Mend *approach vs Frost*. #989 is the empty-damage picker *after* `decideCaster`. This id is drain-as-heal **before** any of those. Do not wait for Motoko `vampire_bite` — `usableByEnemy: true` is already on the card. SYS-113.

### 1.5 Tests

`enemyAI.charger.test.ts`, `enemyAI.geometry.test.ts`, `enemyAI.walkMp.test.ts` exist. Honesty for Strike-as-cast vs melee RES, `scoreAlly` vs `threatValue`, wisp self-Mend vs approach, hunter LoS sidestep, executor geometry reject, and drain-as-heal-on-ally still have no decide/apply-layer tests on **this** branch. Do not treat geometry/walkMp as SYS-108…113. Open #1026 / #1033 / #1034 / #1039 / #985 add sidecars for **yesterday’s** leftovers — do not duplicate them here.

### 1.6 What this increment does **not** change

Do not implement FUT-126+ before P0 honesty + 09-21…10-25 SYS slices. Do not touch RAF, map generation, turn order, or damage formulas (`calcScaledDamage` stays a **read** for scoring; do not add `enemy.level` into it as a stealth stat stick). Do not copy #495 / #498 / #644…#659 / #700 / #709 / **#842** / **#861** / **#911** / **#924** / **#947** / **#967** / **#972** / **#974** / **#978** / **#985** / **#989** / **#999** / **#1026** / **#1033** / **#1034** / **#1039** / **#1072** into this docs-only change. Do not edit the parent catalog. Do not “fix late game” by keeping Fire Bolt, by feeding player SP into Strike, or by letting drain heal allies. Do not re-file FUT-83, SYS-04, SYS-23, SYS-30, SYS-66, SYS-68, SYS-91, SYS-99, SYS-102, SYS-107. Do not turn FUT-23’s chance table into `if (player.level >= 44) isSummoner = true`. Do not bless #1026’s “no LoS / no AP” as the shipped decide.

---

## 2. Design additions (normative)

1. **Do not recycle 09-21…10-25 ids.** This file starts at SYS-108 / FUT-126.
2. **`isPhysical` is a profile feature, not a name.** Kit Strike / future physical ids use the melee mitigation pipeline (SYS-68) when they are adjacent weapon hits. Magical ids stay on SYS-66. Do not unify by putting SP on Strike or deleting SP from Frost.
3. **One `threatValue` function.** Ally scoring and enemy scoring share it. Missing `summonAI` keys fall through that function’s summon default, not a raw table miss.
4. **Summon self-hots follow SYS-91 / SYS-107.** Range-0 `targetType: "self"` enumerates the caster. Walking toward another unit is illegal for Blood Mend-on-ally (SYS-110).
5. **LoS fail ⇒ sidestep or skip, never a through-wall cast and never a suicide walk as a substitute for the cast.** Hunter uses the same `repositionForLOS` helper as caster/archer (SYS-111).
6. **Summon apply is not decide-trust.** `applyCast` re-checks SYS-13 geometry + `targetType` + AP (SYS-112). Pack already has a (too-weak) Chebyshev gate; do not remove it.
7. **Heal category ≠ `healAmount > 0`.** Drain / lifesteal profiles enumerate enemy dests only (SYS-113). SYS-04 routing remains a separate delete.
8. **T6+ still stacks** on the parent enumerator. No integer tier table. No `if (aiTier >= 8)`. No `if (level >= X)`.

---

## 3. System proposals (2026-10-26)

### AI-SYS-108

**AI_ID:** AI-SYS-108  
**NAME:** Kit Strike (`isPhysical`) must use the melee mitigation pipeline, not the spell SP×RES arm  
**ROLE:** system  
**SOPHISTICATION:** T1+ / honesty for SYS-66 / SYS-68 / TGT-05 / TGT-06  
**DECISION_RULES:** `physical_attack` is `isPhysical: true`, range 1, damage 10 (`spellData.ts` **9–25**). Player `computeDamage` (WX **3318–3364**) applies SP only when `!isPhysical` and SR only when `!isPhysical`; physical is RES only. Pack charger (**1197–1213**), flanker (**1337–1356**), berserker (**1428–1448**), and generic in-range (**1533–1551**) return `kind: "cast"` whenever `pickBestDamageSpell` finds Strike. WX pack apply (**16459–16537**) then uses `characterStats.sp` as `plSpEff` (**16475–16482**) × RES, then `playerTakesDamage` (SYS-66 second RES). SYS-68 melee (**16722–16728**) is RES only and never runs because `didAct` is true. After this module: (1) an `isPhysical` kit id at Chebyshev ≤ 1 is `kind: "melee"` **or** a cast that apply routes through the melee mitigation helper (one RES, shield soak once, no player SP, no SR); (2) magical frost stays on SYS-66; (3) hunter adjacent (`kind: "melee"`, `spell: null`, **1961–1974**) is the template — do not start scoring hunter bites with SP; (4) failed physical still must not Fire-Bolt (SYS-05). Do not read strip dummy RES (SYS-69). Open #659 is player Shield on melee — distinct.  
**SCORING_MODEL:** Physical EV = SYS-68 `max(1, round(scaled * (1 - visRes/100)))` then soak. Magical EV = SYS-66. Mixing them is illegal (dropped), not “smarter.”  
**SPELL_REQUIREMENTS:** `physical_attack` profile: `isPhysical: true`, range 1, `targetType: "enemy"`. Future physical ids attach the same flag.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always (honesty). A remnant pawn at any absolute level must Strike like a weapon, not like Frost. Not `if (aiTier >= 2) melee`.  
**ENEMY_ARCHETYPES:** charger, flanker, berserker, generic, tank/rook (SYS-101 may currently route rook as caster — Strike-as-cast still hits this apply arm when dist ≤ 1).  
**PLAYER_COUNTERPLAY:** Stack RES against pawns; SP/SR against bishops. A pawn must not suddenly care about your SP.  
**EDGE_CASES:** `pickBestDamageSpell` origin-range (SYS-79) still returns Strike at dist 1. SYS-85 lookahead may retarget — geometry of the new dest still melee. Paper Windstorm skips `range <= 1` (SYS-70) — do not make Strike range 3 to “match Frost.” Enrage 6× still multiplies scaled damage, not SP.  
**IMPLEMENTATION_COMPLEXITY:** Low (kind melee, or apply `isPhysical` fork). Prefer a sidecar test file if WX apply is contested.  
**TEST_SCENARIOS:** Pawn, Strike ready, dist 1, player SP 50 / RES 0 / SR 0 → damage ignores SP (SYS-68), not ×0.5 (SYS-66 first pass). Bishop Frost dist 3, same stats → still SYS-66 SP×RES (do not “fix” Frost). Hunter dist 1 → still `kind: "melee"`. Failed Strike dist 1 → Crush or skip, never `e-firebolt`.  
**STATUS:** PROPOSED

### AI-SYS-109

**AI_ID:** AI-SYS-109  
**NAME:** Ally scoring must call `threatValue()`, not a raw `summonAI` table lookup  
**ROLE:** system  
**SOPHISTICATION:** T1+ / honesty for TGT-03 / TEM-02 / FUT-83  
**DECISION_RULES:** `scoreAlly` (**2033–2036**) uses `ENEMY_THREAT_VALUES[summonAI || "default"]`. `threatValue` (**511–521**) already maps `summonAI === "healer"|"wisp"` → wisp 1.0 and other summons → 0.6. Live wisp stamp is `"healer"` → ally scorer gives **0.8**. `"guardian"` is not in the table (`gameConstants.ts` **192–197**) → **0.3**, tied with the player. After this module: `scoreAlly` calls `threatValue(ally)` (or one shared helper). Missing keys do not fall through to player-default. Do not parse `ally.name`. Pack healer ward picker stays FUT-83 (`allies.find(!isSummon)` at **1142**) — this id does not replace it. SYS-17 still forbids name fallback on routing.  
**SCORING_MODEL:** Same weights as enemy `scoreTargets` threat term: wisp 1.0 > healer 0.8 > summon 0.6 > default 0.3, applied to **allies**.  
**SPELL_REQUIREMENTS:** None (scoring). Shield / heal / Rally dests consume the score.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always when `pickBestAlly` runs. T0 may still hard-pin the player (today’s pack healer). Not `if (aiTier >= 3) protectWisp`.  
**ENEMY_ARCHETYPES:** guardian, wisp healer; later pack healer once FUT-83 lands.  
**PLAYER_COUNTERPLAY:** A dying wisp outranks a healthy player for Shield. A full-HP golem does not.  
**EDGE_CASES:** Player `summonAI` undefined → default (correct). Hostile `summonAI = pieceType` (SYS-88) must not become “wisp” via `name.includes`. Empty allies → null (existing).  
**IMPLEMENTATION_COMPLEXITY:** Low (one call).  
**TEST_SCENARIOS:** Wisp `summonAI: "healer"` 40% HP vs player 40% HP → wisp wins Shield/heal score. Golem `summonAI: "guardian"` 40% HP vs player 40% HP → summon weight 0.6, not default 0.3. `summonAI: "wisp"` still 1.0.  
**STATUS:** PROPOSED

### AI-SYS-110

**AI_ID:** AI-SYS-110  
**NAME:** Wisp Blood Mend must enumerate self; do not approach an unhealable ally  
**ROLE:** system  
**SOPHISTICATION:** T1+ / honesty for SYS-91 / SYS-99 / SYS-107 / ROL-04  
**DECISION_RULES:** Summon `allies` omit self (**1772–1774**). `decideSummonHealer` wounded filter (**2481–2484**) therefore never sees the wisp’s own HP. `starter-heal` is self / range 0 (`spellData.ts` **85–101**), so Chebyshev to another unit is never ≤ 0. Approach-ally (**2501–2519**) returns `kind: "move"` even when dest === origin. Rally-on-ward remains SYS-99. Pack SYS-102 / SYS-107 are **not** this id (those queens hold Frost). After this module: (1) the heal enumerator includes the caster when `targetType === "self"`; (2) emit Blood Mend on `summon.id` when own `hpFrac < ENEMY_HEAL_ALLY_THRESHOLD_PCT` and SYS-13 accepts the caster tile; (3) walk toward an ally **only** if a profiled *ally* heal will be legal after ≤ budget steps (Blood Mend-on-ally never will); (4) hostile wisps that skip the executor (SYS-55) must not Fire-Bolt after a failed approach (SYS-05). Do not copy #985 (pack). Do not widen range 0.  
**SCORING_MODEL:** Ally dest for a self spell ⇒ −∞. `U(selfHeal) = wHeal * (1 - ownHpFrac)` plus CHC once SYS-95 writes it.  
**SPELL_REQUIREMENTS:** `starter-heal` profile: self, range 0. Rally stays SYS-99 / SYS-41.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always when Blood Mend is in the wisp kit. T0 may skip. Not `if (hp < 30) panicHeal` as a level table.  
**ENEMY_ARCHETYPES:** wisp / healer summon.  
**PLAYER_COUNTERPLAY:** Pressure the wisp below 50% and watch Blood Mend on **it**, not a walk toward you. Dispel CHC (once SYS-95).  
**EDGE_CASES:** Wisp 20% HP *and* player 20% HP → self Blood Mend (legal) outranks approach (illegal). Wisp 80% HP, player 20% HP → not this id (needs a profiled ally heal — FUT-117). `findKitSpell` assigned fallback (SYS-32) must not revive Rally here.  
**IMPLEMENTATION_COMPLEXITY:** Low (include self; dest = caster; drop illegal approach).  
**TEST_SCENARIOS:** Wisp 20/100, player 80/100, Blood Mend ready → `targetId` is the wisp, not `approach-ally`. Wisp 80/100, player 20/100, only Blood Mend → hold/skip, not walk. Hostile wisp, failed approach, Chebyshev 1 → skip, never `e-firebolt`.  
**STATUS:** PROPOSED

### AI-SYS-111

**AI_ID:** AI-SYS-111  
**NAME:** Hunter LoS-blocked venom must sidestep or skip, not walk through the wall  
**ROLE:** system  
**SOPHISTICATION:** T1+ / honesty for SYS-23 / POS-01 / ROL assassin  
**DECISION_RULES:** `decideSummonHunter` (**1939–1958**) casts venom only when `aiCanCast`. On LoS fail it falls through: dist ≤ 1 melee (**1961–1974**) else `stepToward` (**1976–1993**). Caster (**972–995**) and archer (**2271–2292**) already call `repositionForLOS`. SYS-23 is healer/guardian *casting* without LoS. This id is hunter *not sidestepping* after a legal-range LoS fail. After this module: (1) if venom is ready, dist ≤ range 2, LoS blocked → `repositionForLOS` (budget `AI_LOS_REPOSITION_STEP_BUDGET`) as `kind: "move"` (POS-02); (2) if no LoS tile in budget → skip/hold or melee-if-adjacent, **not** a through-wall cast; (3) do not skip LoS to “snipe venom”; (4) SYS-96 still required to write ticks (damage 0). Hostile hunters skip the executor (SYS-55) — failed venom must not Fire-Bolt (SYS-05).  
**SCORING_MODEL:** Through-wall dest when the spell requires LoS ⇒ dropped. Sidestep EV = venom EV if the dest makes `aiCanCast` true next (or this turn if leftover AP exists — SYS-25).  
**SPELL_REQUIREMENTS:** `spell-venom-strike` profile: enemy, DoT venom, range 2, LoS default on.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always for hunter. T0 may melee. Not `if (aiTier >= 3) sidestep`.  
**ENEMY_ARCHETYPES:** hunter, assassin.  
**PLAYER_COUNTERPLAY:** Break LoS with a wall; the wolf sidesteps or waits, it does not bite through stone.  
**EDGE_CASES:** Dist 3 (out of venom range 2) is approach, not this id (SYS-79 / SYS-97). `lineOfSight === false` on a later id skips LoS (SYS-23). Lookahead retarget (SYS-85) must `aiCanCast` the new dest.  
**IMPLEMENTATION_COMPLEXITY:** Low (copy archer’s reposition branch).  
**TEST_SCENARIOS:** Wolf (0,0), player (2,0), wall (1,0), venom ready → `reposition-los` or hold, not `advance` onto a blocked axis and not a through-wall cast. Same, dist 1 with LoS → melee template. Venom on CD, dist 2 with LoS → approach/melee, not a fake DoT.  
**STATUS:** PROPOSED

### AI-SYS-112

**AI_ID:** AI-SYS-112  
**NAME:** Summon `applyCast` must re-check geometry and `targetType` (pack Chebyshev is not enough, and executor has neither)  
**ROLE:** system  
**SOPHISTICATION:** T1+ / honesty for SYS-13 / SYS-26 / SYS-23 / SYS-99  
**DECISION_RULES:** `executeSummonAction` `applyCast` (`summonExecutor.ts` **153–209**) spends AP whenever `currentAp >= apCost` and then deals / heals / `applyEffect`. No range, no LoS, no `targetType`, no dest occupancy. Pack apply at least Chebyshev-checks (WX **16450–16456**) and still skips LoS (SYS-11). After this module: applyCast calls the same side-aware helper as SYS-13 / SYS-26 (`enemyCastGeometryOk` + `targetType` + AP). Failure ⇒ no HP change, no effect, no bomber `hp = 0` (SYS-106). Do **not** re-file leftover-AP `reevaluate` (**249–254**) — it remains one follow-up max (SYS-25) and must pass this gate. Do not “fix” by trusting decide. Hostile summons still need SYS-55 before they share this executor.  
**SCORING_MODEL:** Apply does not score; it rejects. Decide EV for an illegal dest is already −∞ (SYS-13).  
**SPELL_REQUIREMENTS:** Every id `findKitSpell` can return: Strike, venom, Shield, Iron Skin, poison, Slow, Inferno, Blood Mend, Rally.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always for paid summons.  
**ENEMY_ARCHETYPES:** hunter, guardian, archer, bomber, healer summons.  
**PLAYER_COUNTERPLAY:** The same LoS/range/targetType the player already plays under.  
**EDGE_CASES:** Self range-0 Blood Mend on caster tile must **pass**. Rally on a ward must **fail** until SYS-99 / SYS-41 rewrite. Shield through a wall must **fail** (SYS-23). Inferno `damage: 0` must not die in a `damage > 0` suicide arm (SYS-106).  
**IMPLEMENTATION_COMPLEXITY:** Medium (executor helper + tests). Sidecar if WX/executor are contested.  
**TEST_SCENARIOS:** Golem, Shield ready, ward behind a wall, dist 2 → no RES buff written. Wisp, Rally aimed at player dist 2 → no heal/CHC (SYS-99). Wisp, Blood Mend on self, range 0 → heal writes. Wolf, venom dist 2 no LoS → no DoT.  
**STATUS:** PROPOSED

### AI-SYS-113

**AI_ID:** AI-SYS-113  
**NAME:** Healer `healSpell` picker must not treat drain `healAmount` as an ally heal  
**ROLE:** system  
**SOPHISTICATION:** T1+ / honesty for SYS-04 / SYS-91 / TGT / ROL-04  
**DECISION_RULES:** `decideHealer` picker (**1095–1097**) is first `spellType === "heal" || (healAmount ?? 0) > 0`. `starter-drain` (`spellData.ts` **103–122**) and `spell-drain-courage` (**438–457**, `usableByEnemy: true`, `targetType: "enemy"`, damage 18, healAmount 9) therefore become `healSpell`. SYS-04 already routed the kit into `decideHealer`. The wounded **ally** is the dest (**1092–1112**). If Chebyshev ≤ drain range, apply’s drain arm (**16459–16638**) **damages the ally** and heals the caster. After this module: (1) ally/self heal enumeration requires profile category heal (or `spellType === "heal"`) **and** `targetType` in `{self, ally, all}`; (2) drain / lifesteal profiles enumerate **opponents** only, via `pickBestDamageSpell` / SYS-02 — never `decideHealer`’s wounded list; (3) SYS-04 delete remains separate so queens with Blood Mend can be artillery; (4) failed drain on an ally must not Fire-Bolt (SYS-05). Open #644 is player drain-as-lifesteal — do not copy. #989 is the empty-damage picker *after* `decideCaster`.  
**SCORING_MODEL:** Drain-on-ally dest ⇒ −∞. Drain-on-enemy EV = SYS-02 damage + visible self-heal. Heal-on-enemy dest ⇒ −∞.  
**SPELL_REQUIREMENTS:** Heal profile: `starter-heal`. Drain profiles: `starter-drain`, `spell-drain-courage`. Motoko `vampire_bite` stays unassigned until SYS-13 + this picker (SYS-90).  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always when a drain id is in `availableSpells`. Not `if (level >= 25) drain`. Kit width remains SYS-09.  
**ENEMY_ARCHETYPES:** healer (mis-routed drain kits), assassin (true drain user after SYS-04 is gone).  
**PLAYER_COUNTERPLAY:** A drain bishop hurts **you**, not its pawn. Cleanse AP if Drain Courage lands.  
**EDGE_CASES:** Queen Frost+Blood Mend: picker still finds Blood Mend (`spellType: "heal"`) — SYS-91 / SYS-102 / SYS-107 own dest/approach/self. Drain+Blood Mend in one list: heal category wins on allies; drain still available for `decideCaster` fallback once SYS-102/104 order is fixed. `healAmount` on a true heal stays legal.  
**IMPLEMENTATION_COMPLEXITY:** Low (filter by `spellType` / profile; drains leave the healer picker).  
**TEST_SCENARIOS:** Kit Drain Courage + Strike, wounded ally dist 2, player dist 2 → drain the **player** (or skip), never the ally. Kit Blood Mend only, wounded ally dist 2 → SYS-102 (no drain). Drain on CD, Blood Mend ready, self 20% HP → SYS-107/110, not a drain.  
**STATUS:** PROPOSED

---

## 4. T6+ reusable modules (2026-10-26)

Attach via parent §4 sigmoid. Stack; do not replace T0–T5 or FUT-01…125. Do not re-file FUT-83, FUT-114…125, FUT-23, FUT-64, FUT-117, or FUT-119.

### AI-FUT-126

**AI_ID:** AI-FUT-126  
**NAME:** Physical vs spell mitigation as a reusable scoring feature  
**ROLE:** targeting / resource  
**SOPHISTICATION:** T6 (TGT-05 / TGT-06; SYS-108 / SYS-66 / SYS-68 / SYS-10)  
**DECISION_RULES:** After SYS-108: T2+ pieces score each profiled id with the **apply pipeline it will actually use**. `isPhysical` → SYS-68 (RES, no SP, no SR). Magical damage/drain → SYS-66 (live SP×RES until apply reads SR — do not cheat SR EV before apply does). DoT ticks stay SYS-96 / FUT-114 (RES, no SR). T0 may still use raw `spell.damage`. Unbounded: a year-later `isPhysical: true` spear id reuses this feature, not `if (level >= 80) meleeBrain`. Do not peek crit RNG (FUT-57 / SYS-82).  
**SCORING_MODEL:** `U = wHit * pipelineRecv(visRes, visSp|visSr, visShield)` per profile flag.  
**SPELL_REQUIREMENTS:** Profile carries `isPhysical` / category. Strike already has the flag.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.2` for mixed kits. Remnant pawns may keep SYS-108 honesty without the EV split.  
**ENEMY_ARCHETYPES:** charger, tank, artillery (frost vs strike choice), assassin.  
**PLAYER_COUNTERPLAY:** Stack SP against bishops, RES against pawns. A mixed rook must pick the id that actually hurts.  
**EDGE_CASES:** Before SYS-108, Strike EV must not assume melee RES-only (that would under-rank a hit that currently pays SP). After: do not keep scoring Strike with SP.  
**IMPLEMENTATION_COMPLEXITY:** Low after SYS-108 + SYS-10.  
**TEST_SCENARIOS:** Player SP 50 / RES 0, pawn Strike + bishop Frost both legal on different pieces → pawn EV ignores SP, bishop EV ×0.5. Same piece with both ids (future kit) → pick the pipeline winner, not max `spell.damage`.  
**STATUS:** PROPOSED

### AI-FUT-127

**AI_ID:** AI-FUT-127  
**NAME:** Shared threat table for ally-protect and enemy-harass as roles grow  
**ROLE:** team / targeting  
**SOPHISTICATION:** T6 (TGT-03 / TEM-02 / ROL-10; SYS-109 / SYS-30 / FUT-83)  
**DECISION_RULES:** After SYS-109: T3+ protectors/healers and T3+ harassers read one `threatValue`. Adding a protector / font / turret summonAI later is a **table row**, not a new integer tier and not `name.includes`. T1 may hard-pin the player (FUT-83). Harassment prepend (SYS-30) dies; the weight is additive in `scoreTargets` (SYS-08). Unbounded: a year-later `summonAI: "font"` attaches `threatValue.font = 0.9` via relative difficulty, not `if (level >= 60) focusFont`.  
**SCORING_MODEL:** Parent `U` + `wThreat * threatValue(c)` for both ally and enemy lists.  
**SPELL_REQUIREMENTS:** None.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.3` when living wisp/healer summon ≥ 1 or pack healer ≥ 1. Remnants skip.  
**ENEMY_ARCHETYPES:** protector, healer, charger (harass).  
**PLAYER_COUNTERPLAY:** Park the high-threat summon behind LoS; they must not still “focus” an illegal dest.  
**EDGE_CASES:** SYS-88 `pieceType` stamps must not invent table keys. Default 0.3 is the player, not a missing guardian.  
**IMPLEMENTATION_COMPLEXITY:** Low after SYS-109 + SYS-08.  
**TEST_SCENARIOS:** Two chargers, wisp + player, TEM-01 on → both score the wisp id, not snapshot order. Guardian Shield, wisp 40% vs player 40% → wisp.  
**STATUS:** PROPOSED

### AI-FUT-128

**AI_ID:** AI-FUT-128  
**NAME:** Summon healer sequence — legal self-hot, then legal ally support, then hold  
**ROLE:** healer / resource  
**SOPHISTICATION:** T6 (ROL-04 / RES-04; SYS-110 / SYS-99 / FUT-117 / FUT-120)  
**DECISION_RULES:** After SYS-110: T2+ wisps score `{self Blood Mend, ally heal if profiled, Rally if rewritten, guard, hold}` on one enumerator (parent SYS-03 cap). Default when all are legal: self-hot below threshold > hold > illegal approach (−∞). Rally stays illegal on a ward until SYS-99 / SYS-41. Pack queen sequence remains FUT-120 (nuke vs Mend). Unbounded: a later ally-hot id uses FUT-117 `targetType`, not `if (level >= 40) wispBrain`.  
**SCORING_MODEL:** SYS-110 illegal-approach −∞ + SYS-107/FUT-125 self-heal EV.  
**SPELL_REQUIREMENTS:** Profiled self-heal. Ally heal only if `targetType` allows.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.25` for healer summons. Remnant wisps may skip.  
**ENEMY_ARCHETYPES:** wisp, healer summon.  
**PLAYER_COUNTERPLAY:** Leave the wisp just above 50% so it holds; spike it to buy a Mend turn.  
**EDGE_CASES:** Do not let T6 skip LoS on a future ally heal. Hostile wisp Fire Bolt remains SYS-05.  
**IMPLEMENTATION_COMPLEXITY:** Low after SYS-110 / SYS-99.  
**TEST_SCENARIOS:** Wisp 20% HP, player 20% HP → Blood Mend self. Wisp 80% HP, player 20% HP, only self Mend → hold, not approach. Rally still SYS-99.  
**STATUS:** PROPOSED

### AI-FUT-129

**AI_ID:** AI-FUT-129  
**NAME:** Assassin/kiter LoS sidestep as a reusable module  
**ROLE:** assassin / kiter / positioning  
**SOPHISTICATION:** T6 (POS-01 / POS-05; SYS-111 / SYS-23 / FUT-115)  
**DECISION_RULES:** After SYS-111: T2+ hunters/archers/assassins share `repositionForLOS` with casters. T3+ score sidestep dests that keep the kit’s **min range** (SYS-94 poison band; venom range 2) instead of walking into melee. T0 may melee. Unbounded: a later `linear: true` spear uses SYS-13 shape plus this sidestep, not a new brain. Do not invent body-block LoS.  
**SCORING_MODEL:** `U(sidestep) = U(spell from dest) − wMeleeIfDestAdjacent`. Through-wall dest −∞.  
**SPELL_REQUIREMENTS:** Profiled LoS damage/DoT.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.25` for hunter/archer. Remnant wolves may melee.  
**ENEMY_ARCHETYPES:** hunter, assassin, kiter, archer.  
**PLAYER_COUNTERPLAY:** Hug a wall; they spend MP to peek or they wait.  
**EDGE_CASES:** Frozen+Slime empty reachable (SYS-31) → hold, not a cheat step. SYS-97 still forbids walking away under an approach intent.  
**IMPLEMENTATION_COMPLEXITY:** Low after SYS-111.  
**TEST_SCENARIOS:** Wolf, wall, venom range 2, two sidestep tiles — one adjacent to player, one not → T3+ prefers the non-adjacent peek. T0 may melee if dist 1.  
**STATUS:** PROPOSED

### AI-FUT-130

**AI_ID:** AI-FUT-130  
**NAME:** Shared `planEnemyCastAttempt` for pack apply **and** summon executor  
**ROLE:** system / spell-awareness  
**SOPHISTICATION:** T6 (SYS-26 / SYS-112 / SYS-13 / SYS-05)  
**DECISION_RULES:** After SYS-112 and SYS-26: one helper checks cooldown, `applyApCost`, geometry, `targetType`, occupancy. Pack WX and `applyCast` both call it. T0 may keep the Chebyshev-only pack gate **plus** executor AP-only until this lands — but neither may Fire-Bolt (SYS-05) or write through a wall. Unbounded new mechanics attach flags on the profile (linear, minRange, freeCells), not a third apply brain. `runSummonAI` stays unused.  
**SCORING_MODEL:** Apply rejects; decide already dropped illegal dests.  
**SPELL_REQUIREMENTS:** Every enemy-usable id.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always once both honesty slices exist.  
**ENEMY_ARCHETYPES:** All pack + summon.  
**PLAYER_COUNTERPLAY:** One legality story for “that shot cannot happen.”  
**EDGE_CASES:** Self range 0 must pass. Ground summon dest is SYS-86, not this helper’s combatant dest. Boss tagged wall-jump stays SYS-16.  
**IMPLEMENTATION_COMPLEXITY:** Medium (extract helper; two call sites).  
**TEST_SCENARIOS:** Same illegal dest: pack bishop through wall → no damage; player wisp Shield through wall → no buff. Legal Frost / legal self Mend both write.  
**STATUS:** PROPOSED

### AI-FUT-131

**AI_ID:** AI-FUT-131  
**NAME:** Heal vs drain category picker — drain is an assassination id, not a medic id  
**ROLE:** assassin / healer / spell-awareness  
**SOPHISTICATION:** T6 (ROL-02 / ROL-04 / TGT-01; SYS-113 / SYS-04 / FUT-117 / FUT-119)  
**DECISION_RULES:** After SYS-113 and SYS-04: T2+ pieces with a drain profile score it on **opponents** (low-HP / killableNow / visible AP for Drain Courage’s AP debuff — public strip only, ADV-04 later). Heal profiles score on self/ally. Kit width may add drain to an artillery row without flipping the role to healer (FUT-119 / FUT-124). T0 may omit drain. Unbounded: a later `spellType: "drain"` id reuses this category, not `if (level >= 50) vampire`.  
**SCORING_MODEL:** `U(drain) = SYS-02 dmg + wSelfHot * healAmount` on an enemy dest. Ally dest −∞.  
**SPELL_REQUIREMENTS:** Profiled drain + heal. Motoko `vampire_bite` only after SYS-13.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.3` when a drain id is in the kit (SYS-09 width, not a level table).  
**ENEMY_ARCHETYPES:** assassin, artillery with a drain extra, healer (heal ids only).  
**PLAYER_COUNTERPLAY:** Don’t stand wounded next to a drain assassin; its pawn is safe from that id.  
**EDGE_CASES:** `healAmount` on drain is self-hot after a **legal enemy** hit (WX **16626–16638**), never an ally Mend. Blood Mend remains SYS-91.  
**IMPLEMENTATION_COMPLEXITY:** Low after SYS-113 + SYS-04.  
**TEST_SCENARIOS:** Drain Courage ready, player 20% HP, ally 20% HP → player dest. Blood Mend ready, self 20% HP → self. Family `role: "artillery"` + drain extra → still artillery (FUT-124).  
**STATUS:** PROPOSED

---

## 5. Spell-awareness contract (reminder)

Unchanged: no profile + apply ⇒ not in kit, not in elite extras, `usableByEnemy` treated as false in the enumerator.

Still `usableByEnemy: true` without a working decide+apply pair (do not give these to pack AI until FUT-22 / FUT-25 / FUT-31 / SYS-96 apply / this file’s SYS-113):

`spell-swap`, `spell-mark`, `spell-sacrifice`, `spell-lifesteal-nova`, `spell-enrage`, `spell-haste`, `spell-weaken`, `spell-expose`, `spell-drain-courage` (drain-as-heal on allies today — SYS-113 must land **before** any kit row), `spell-cursed-wound`, `spell-shadow-veil`, `spell-frost-nova`, `spell-inferno` (DoT `damage: 0`, `areaRadius: 0` — SYS-96 / SYS-103 / SYS-106), `starter-poison` / `spell-venom-strike` (hunter/archer already emit — SYS-96 / SYS-111), `starter-shield` / `spell-iron-skin` (guardian already emits — SYS-98 / SYS-112), `starter-drain` (same picker as Drain Courage).

Keep `usableByEnemy: false` until profiled: barrier, mirror, timestep, rallying-cry, sentinel/bomber/wisp summons.

`starter-heal` is self-only (`range: 0`, `targetType: "self"`). SYS-91 is the pack healer *wrong dest*. SYS-102 is that the wrong dest **walk** blocks Frost. SYS-107 is that pack self is missing. SYS-110 is that **wisp** self is missing and the wisp **walks**. `spell-rallying-cry` is the same shape (SYS-99).

`physical_attack` is `isPhysical: true`. SYS-108 is the apply fork. Do not assign a second physical id until this fork exists.

Motoko `defaultSpells` (`shadow_strike`, `soul_rend`, `vampire_bite`, `reflect_barrier`, `thunder_clap`, `void_collapse`) are `usableByEnemy: true` but have `minRange` / `diagonal` / `lineOfSight: false` / attract AoE that `enemyCastGeometryOk` does not implement. SYS-90 forbids using them as frost substitutes. `vampire_bite` is also a SYS-113 drain. Do not assign `thunder_clap` as a bomber “real AoE” until SYS-13 + SYS-106 + a profile exist.

`summon-dire-wolf` / `summon-archer` are `usableByEnemy: true` with range 2. SYS-86 is the profile: ground dest in range.

Kit frost staying at spellbook damage (SYS-72) is **not** a reason to assign Inferno. SYS-79’s kit-pick still requires `damage > 0`. Frost range is 4 (`spellData.ts` 131). Inferno range is 3 (`spellData.ts` 509). Poison range is 4 (`spellData.ts` 56). Venom range is 2 (`spellData.ts` 401). Strike range is 1 (`spellData.ts` 17).

---

## 6. Implementation order (this increment)

Do not start FUT-126+ first. Do not start T6+ from earlier increments before P0 honesty.

1. SYS-05 (Fire Bolt WX **16712**, AP/MP debit, ally heal WX **16648**) — still P0. Failed Strike, failed venom, failed wisp approach, failed drain-on-ally currently *also* hit this path.  
2. SYS-01 — replace `computeAITier` (`combatMath.ts` 36–52) and the `aiTier >= 5/10` gates (WX **15507** / **15594**).  
3. SYS-73 — drop the 999 spawn ceiling so SYS-01 `peer` still works at high player level.  
4. **SYS-108** + FUT-126 — kit Strike uses SYS-68 melee mitigation. Hunter adjacent is the template.  
5. SYS-90 — prefer merge/follow **#911**. Then SYS-09 zone key.  
6. SYS-04 then SYS-101 + FUT-119 / FUT-124 — authored roles. Then **SYS-113** + FUT-131 so drain never medic-routes.  
7. SYS-91 + SYS-107 + **SYS-110** + SYS-99 + FUT-117 / FUT-128 — `targetType` self vs ally. Prefer **#985** for pack SYS-107; wisp is this file.  
8. SYS-102 + SYS-104 + FUT-120 / FUT-122 — nuke vs approach vs guard. Prefer **#1026** / **#1034**; restack with `aiCanCast` + SYS-05.  
9. SYS-96 then SYS-103 / SYS-105 / SYS-106 + FUT-121 / FUT-123.  
10. **SYS-109** + FUT-127 — shared `threatValue`. FUT-83 still pack ward pin.  
11. **SYS-111** + FUT-129 — hunter LoS sidestep.  
12. SYS-13 + SYS-26 + **SYS-112** + FUT-130 — side-aware legality on pack **and** executor. `enemyCastGeometryOk` is not sufficient.  
13. SYS-66 / SYS-68 remain the two mitigation truths until apply is unified on purpose.  
14. Parent T2–T5 roles / team / adaptive; remaining FUT-01…125.

Each slice: `engine/enemyAI*.test.ts` or a **sidecar** test file (open #1026 pattern), zero WX drive-by, no RAF / map gen / turn order / damage-formula edits unless a **named** follow-up. Scoring **reads** RES/SR/CHC; it does not change `calcScaledDamage`.

---

## 7. Extra test scenarios

| ID | Setup | Expect |
| :--- | :--- | :--- |
| TS-STRIKEPHYS | Pawn (4,4), player (4,5), Strike ready, player SP 50 / RES 0 | Strike lands melee RES-only; SP ignored (SYS-108). |
| TS-FROSTSP | Bishop, Frost dist 3, player SP 50 / RES 0 | Still SYS-66 SP×RES; do not “fix” Frost (SYS-108 edge). |
| TS-HUNTMELEE | Hunter dist 1 | `kind: "melee"`, `spell: null` (template). |
| TS-ALLYTHREAT | Wisp `summonAI: "healer"` 40% HP vs player 40% HP | Wisp wins `scoreAlly` (SYS-109). |
| TS-GUARDDEF | Golem `summonAI: "guardian"` 40% vs player 40% | Summon 0.6, not default 0.3 (SYS-109). |
| TS-WISPSELF | Wisp 20/100, player 80/100, Blood Mend ready | Heal dest is the wisp, not `approach-ally` (SYS-110). |
| TS-WISPWALK | Wisp 80/100, player 20/100, only Blood Mend | Hold/skip, not walk-to-player (SYS-110). |
| TS-HUNTLOS | Wolf (0,0), player (2,0), wall (1,0), venom ready | Sidestep or hold; no through-wall DoT; no `e-firebolt` (SYS-111). |
| TS-EXECLOS | Golem Shield, ward behind wall, dist 2 | Executor writes no RES buff (SYS-112). |
| TS-DRAINALLY | Drain Courage + Strike, wounded ally dist 2, player dist 2 | Drain the player or skip; never the ally (SYS-113). |
| TS-BOLT3 | Failed frost / failed Strike / failed venom / failed wisp approach, Chebyshev 1 | Crush or skip; never `e-firebolt` (WX 16712). |
| TS-PEER3K | Player 3000, enemy 3000 | Not forced T5; remnant 400 stays low tier (FUT-92). |

Parent and 2026-09-01…10-25 TS-* rows still apply (line numbers in §1.2). Frost examples use live range **4**. Inferno examples use live range **3**. Poison kite examples use live range **4**. Venom examples use live range **2**. Strike examples use live range **1**.

---

## 8. Mapping (new gaps → ids)

| Request / gap | Primary AI_ID |
| :--- | :--- |
| Adjacent kit Strike applied as a spell (SP×RES) instead of melee RES-only | AI-SYS-108 / AI-FUT-126 |
| `scoreAlly` raw table miss vs `threatValue()` | AI-SYS-109 / AI-FUT-127 |
| Wisp Blood Mend never sees self; approach-ally on a self spell | AI-SYS-110 / AI-FUT-128 |
| Hunter LoS-blocked venom walks in instead of sidestepping | AI-SYS-111 / AI-FUT-129 |
| Summon `applyCast` has no geometry / `targetType` gate | AI-SYS-112 / AI-FUT-130 |
| Healer picker treats drain `healAmount` as an ally heal | AI-SYS-113 / AI-FUT-131 |

T0–T5 requested list (positioning, targeting, resources, roles, team, adaptive) remains parent §19. Nothing in that list is implemented. Higher-level enemies still get harder from **modules on the sigmoid** and from **honest relative spawn** (SYS-73 / FUT-92 / SYS-89), not from `computeAITier(enemyLevel)`, not from a kit-less bolt, not from a pawn that Strikes through SP, and not from a wisp that walks instead of Mending.

Requested capability → already-catalogued parent id (unchanged; still **PROPOSED**), plus this increment’s honesty slices:

| Request | Parent id | This increment |
| :--- | :--- | :--- |
| maintain optimal range / retreat / approach vulnerable / avoid hazards / exploit terrain / avoid AoE clustering / protect allies / escape routes | POS-01…08 | hunter LoS sidestep = SYS-111 / FUT-129; wisp illegal approach = SYS-110 |
| low-HP / high-threat / support / summons / resistance / kill / strategic | TGT-01…07 | `threatValue` shared = SYS-109 / FUT-127; physical vs spell RES = SYS-108 / FUT-126; drain vs low-HP enemy = SYS-113 / FUT-131 |
| AP combinations / move-then-attack / attack-then-retreat / sequencing / cooldown / waste | RES-01…06 | wisp sequence = FUT-128; executor leftover AP still SYS-25, gated by SYS-112 |
| tank … protector | ROL-01…10 | Strike as weapon = SYS-108; assassin drain = FUT-131; wisp healer = SYS-110; hunter assassin = SYS-111 |
| focus fire / protect support / exploit debuffs / avoid duplicate debuffs / coordinated AoE / formations / retreat toward support | TEM-01…07 | protect-wisp weights = FUT-127; drain must not “protect” an ally by hitting it = SYS-113 |
| estimate threat / punish positioning / adapt HP / adapt AP-MP / summons / status / own HP / survival vs aggression | ADV-01…08 | own HP on wisp = SYS-110 / FUT-128; punish wall peek = FUT-129 |

Every row above is **STATUS: PROPOSED**. No production AI in this change.
