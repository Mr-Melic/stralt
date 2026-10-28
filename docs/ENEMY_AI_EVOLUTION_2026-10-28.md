# Advanced Enemy AI Evolution — 2026-10-28 increment

**Status:** PROPOSED (design only; no production code in this change)  
**Date:** 2026-10-28  
**Parent catalog:** [`ENEMY_AI_EVOLUTION.md`](./ENEMY_AI_EVOLUTION.md) (T0–T5)  
**Prior increments:** [`ENEMY_AI_EVOLUTION_2026-09-01.md`](./ENEMY_AI_EVOLUTION_2026-09-01.md) · [`ENEMY_AI_EVOLUTION_2026-09-02.md`](./ENEMY_AI_EVOLUTION_2026-09-02.md) · [`ENEMY_AI_EVOLUTION_2026-09-21.md`](./ENEMY_AI_EVOLUTION_2026-09-21.md) (open PR #351; SYS-22…32, FUT-36…47 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-22.md`](./ENEMY_AI_EVOLUTION_2026-09-22.md) (open PR #416; SYS-33…35, FUT-48…53) · [`ENEMY_AI_EVOLUTION_2026-09-23.md`](./ENEMY_AI_EVOLUTION_2026-09-23.md) (open PR #458; SYS-36…41, FUT-54…59) · [`ENEMY_AI_EVOLUTION_2026-09-24.md`](./ENEMY_AI_EVOLUTION_2026-09-24.md) (open PR #506; SYS-42…47, FUT-60…65) · [`ENEMY_AI_EVOLUTION_2026-09-25.md`](./ENEMY_AI_EVOLUTION_2026-09-25.md) (open PR #565; SYS-48…53, FUT-66…71) · [`ENEMY_AI_EVOLUTION_2026-09-26.md`](./ENEMY_AI_EVOLUTION_2026-09-26.md) (open PR #633; SYS-54…59, FUT-72…77) · [`ENEMY_AI_EVOLUTION_2026-09-27.md`](./ENEMY_AI_EVOLUTION_2026-09-27.md) (open PR #689; SYS-60…65, FUT-78…83) · [`ENEMY_AI_EVOLUTION_2026-09-28.md`](./ENEMY_AI_EVOLUTION_2026-09-28.md) (open PR #723; SYS-66…71, FUT-84…89) · [`ENEMY_AI_EVOLUTION_2026-09-29.md`](./ENEMY_AI_EVOLUTION_2026-09-29.md) (open PR #804; SYS-72…77, FUT-90…95) · [`ENEMY_AI_EVOLUTION_2026-10-21.md`](./ENEMY_AI_EVOLUTION_2026-10-21.md) (open PR #821; SYS-78…83, FUT-96…101) · [`ENEMY_AI_EVOLUTION_2026-10-22.md`](./ENEMY_AI_EVOLUTION_2026-10-22.md) (open PR #874; SYS-84…89, FUT-102…107) · [`ENEMY_AI_EVOLUTION_2026-10-23.md`](./ENEMY_AI_EVOLUTION_2026-10-23.md) (open PR #958; SYS-90…95, FUT-108…113) · [`ENEMY_AI_EVOLUTION_2026-10-24.md`](./ENEMY_AI_EVOLUTION_2026-10-24.md) (open PR #999; SYS-96…101, FUT-114…119) · [`ENEMY_AI_EVOLUTION_2026-10-25.md`](./ENEMY_AI_EVOLUTION_2026-10-25.md) (open PR #1072; SYS-102…107, FUT-120…125) · [`ENEMY_AI_EVOLUTION_2026-10-26.md`](./ENEMY_AI_EVOLUTION_2026-10-26.md) (open PR #1135; SYS-108…113, FUT-126…131) · [`ENEMY_AI_EVOLUTION_2026-10-27.md`](./ENEMY_AI_EVOLUTION_2026-10-27.md) (open PR #1192; SYS-114…119, FUT-132…137 — **do not re-number**)  
**Implementer ledger:** [`automation/ACTION_IDS_AEE_2026-10-28.md`](./automation/ACTION_IDS_AEE_2026-10-28.md)

This increment re-reads the live engine one day after the 2026-10-27 catalog (#1192). SYS-01…119 and FUT-01…137 stay **PROPOSED** on their own files; they are **not** re-filed here. New work is: boss kit **heal / debuff / DoT / buff** arms fire with **no range, LoS, or AP** (Inferno’s `damage: 0` still writes an 8/turn burn from any tile); boss `abilityResult.damageToPlayer` writes HP with **no RES and no SP**; archer kite calls `stepAway` with `hpFrac = 1` so hazard filter never runs; pack `closes-in` is a fused teleport+cast with **no MP debit**; pack and boss walks ignore **thorned_ground / void_rift** HP bills the player pays; `scoreTargets(..., null)` marks killableNow with the melee crush formula, not the kit spell that will actually fire.

Stralt has **no character level cap**. Nothing here maps `if (level >= X) sophistication = Y`. Tiers remain conceptual. Eligibility remains the parent §4 sigmoid (`peer = log2(enemy.level / player.level)` plus pack/boss/modifier terms). A year-later peer fight at any absolute level can attach a new module without raising a cap. A bishop that “knows” a 1-HP target is crush-killable, an archer that kites onto lava at full HP, and a boss Inferno that burns from 16 tiles are **honesty**, not a last band.

**Hard rules (unchanged):** no cheat, no hidden player information, no ignored LoS/range/AP/MP, no unbounded search, no kit-less Fire Bolt, no `instantKill`, no betrayal-as-difficulty, no name-based spell heuristics, no production AI in this change. Do not “fix” boss DoT by deleting the pack DoT writer (SYS-96). Do not “fix” thorned ground by making enemies immune (SYS-59). Do not “fix” kite-into-lava by walking through walls. Do not revive `engine/summonAI.ts` (`runSummonAI` is unused; it is a Manhattan second brain). Do not copy Motoko `thunder_clap` / `void_collapse` into bomber kits. Do not copy #1026’s no-LoS/no-AP leftover detector. Do not copy #1192 / #1158 / #1150 / #1104 / #1123.

Open production PRs that already slice honesty (do **not** re-file the ids, do **not** copy the patches into this docs PR):

| Open PR | Catalog id | What it changes |
| :--- | :--- | :--- |
| [#495](https://github.com/Mr-Melic/stralt/pull/495) (draft) | AI-SYS-34 | Apply `targetCell` from `playerPositionRef`. Live apply still uses render `playerPosition` (WX **16436–16438**). |
| [#498](https://github.com/Mr-Melic/stralt/pull/498) (draft) | AI-SYS-45 | Boss kit-spell apply must not commit `targetX/Y` as a walk dest. Live still does (WX **16005–16008**). SYS-120’s non-damage arms currently *also* teleport. |
| [#842](https://github.com/Mr-Melic/stralt/pull/842) (draft) | AI-SYS-88 / SYS-55 | Hostile minion `summonKit` + `decideSummonAction`. **Do not re-implement.** |
| [#911](https://github.com/Mr-Melic/stralt/pull/911) (draft) | AI-SYS-90 | Pack kits when Motoko catalog misses starter ids. **Do not re-implement.** |
| [#924](https://github.com/Mr-Melic/stralt/pull/924) (draft) | AI-SYS-95 | WX enemy heal execute advertised CHC. |
| [#985](https://github.com/Mr-Melic/stralt/pull/985) (draft) | AI-SYS-107 | Pack-enemy heal decide when **no** wounded ally exists. |
| [#1026](https://github.com/Mr-Melic/stralt/pull/1026) (draft) | AI-SYS-102 | Pack-enemy healer **approach** vs advertised Frost. Sidecar only — **do not copy.** |
| [#1033](https://github.com/Mr-Melic/stralt/pull/1033) (draft) | AI-SYS-103 | Healer approach vs Inferno leftover. |
| [#1034](https://github.com/Mr-Melic/stralt/pull/1034) (draft) | AI-SYS-104 | Healer backline-guard vs Frost leftover. |
| [#1039](https://github.com/Mr-Melic/stralt/pull/1039) (draft) | AI-SYS-105 | Healer backline-guard vs Inferno leftover. |
| [#1104](https://github.com/Mr-Melic/stralt/pull/1104) (draft) | (boss kit CHC) | Share boss kit **damage** execute with advertised CHC. Complements SYS-115; does **not** add range/LoS/AP/SP, and does **not** cover the DoT/heal/buff arms (SYS-120) or ability HP (SYS-121). **Do not copy as the whole slice.** |
| [#1123](https://github.com/Mr-Melic/stralt/pull/1123) (draft) | AI-SYS-111 | Summon-hunter LoS-blocked Venom with stalk fallback. **Do not re-implement.** |
| [#1135](https://github.com/Mr-Melic/stralt/pull/1135) (draft) | SYS-108…113 / FUT-126…131 | 2026-10-26 design increment. Unique files only. |
| [#1150](https://github.com/Mr-Melic/stralt/pull/1150) (draft) | (bomber Inferno CD) | Share summon-bomber Inferno cooldown with `findKitSpell` available. Complements SYS-114. **Do not copy.** |
| [#1158](https://github.com/Mr-Melic/stralt/pull/1158) (draft) | AI-SYS-114 | Share WX summon `availableSpells` with pack CD filter. **Do not re-implement.** |
| [#1192](https://github.com/Mr-Melic/stralt/pull/1192) | SYS-114…119 / FUT-132…137 | Yesterday’s design increment. Unique files only. SYS-115 is the **damage/drain** arm only (WX **15860–15886**). |

This docs PR does **not** edit [`ENEMY_AI_EVOLUTION.md`](./ENEMY_AI_EVOLUTION.md) (open PR #351 unions that header). Unique files only.

---

## 1. Re-read (2026-10-28) — what moved

All line numbers are from this checkout. Re-read them before implementing.

### 1.1 Combat-parity still is not sophistication

Unchanged from 2026-09-21…10-27: `enemyCastGeometryOk` (`targeting.ts` 166–177), `aiCanCast` (`enemyAI.ts` 320–332), Frozen walk *rate* (`enemyWalkMp.ts` 21–29; WX pack **16345** and summon **15181** *do* pass `isFrozenTerrain`), `playerCastPlan.ts` (player only), summon leftover-AP `reevaluate` (`summonExecutor.ts` 249–254). These are **not** SYS-05 / SYS-13 / SYS-01. Do **not** re-file `reevaluate`. SYS-112 is the **applyCast gate**, not the follow-up call. SYS-123 is the **pack fused `closes-in`**, which has no leftover sequence at all.

`aiCanCast` is still unused by healer (1099–1100) and guardian (2131–2133). That remains **AI-SYS-23**. Caster in-range uses it (953); hunter venom uses it (1941) then does **not** sidestep when it fails (**SYS-111** / open #1123). Archer still repositions (2271–2292) then kites with `stepAway(..., 1)` (2328) — this file’s SYS-122. Bomber detonate still uses `dist <= enemySpellRange` with **no** `aiCanCast` (2410–2411); that stays under SYS-23 / SYS-106, do **not** re-file.

`enemyAI.ts` still has **zero** reads of `currentAp`, `currentMp`, or `apCost`. Pack walk budget is still `ENEMY_REACHABLE_STEP_BUDGET = 3` (`gameConstants.ts` 166; `computeReachable` 377–378). `getEffectiveStat` is declared on `DecideEnemyContext` (275–276) and **never read** by `estimateDamage` / `scoreTargets` / any `decide*`. WX wires it to `getStatModifier` (a **multiplier**, `statusEffects.ts` 45–63), not an absolute stat — even a future reader would be the wrong shape. `allyCount` / `enemyCount` are declared (259–261) and **never read** (SYS-83).

Do **not** feed `spellRangeBase` into AI (`targeting.ts` 111–115 / `enemySpellRange` 133–137). Do **not** treat `enemyCastGeometryOk` as SYS-13 complete. Do **not** re-enable `engine/summonAI.ts` (Manhattan `distance` at **59–61**, 20-tile scan at **68–80**).

`physical_attack` / Strike is **`isPhysical: true`**, damage 10, range 1 (`spellData.ts` **9–25**). Pack kit-cast apply (**16459–16537**) never reads `isPhysical` (SYS-108). Pack melee fallback (**16722–16728**) is RES-only (SYS-68). `playerTakesDamage` applies **RES only** (WX **3427–3432**). Pack kit-cast pre-multiplies SP×RES then calls `playerTakesDamage` (SYS-66 double RES). Boss kit-cast **damage/drain** still passes raw `Number(bossSpell.damage)` (SYS-115). Boss kit **DoT/heal/debuff/buff** never enter that arm (this file’s SYS-120). Boss `abilityResult.damageToPlayer` writes HP with `setCharacterStats` (this file’s SYS-121).

`starter-heal` remains self / range 0 (`spellData.ts` **85–101**). `spell-rallying-cry` is the same shape, **`usableByEnemy: false`** (`spellData.ts` **417–435**). `summon-dire-wolf` / `summon-archer` are `usableByEnemy: true`, range **2**, `targetType: "ground"` (`spellData.ts` **547–631**). Inferno is `damage: 0`, `areaRadius: 0`, `cooldown: 3`, `dotDamagePerTurn: 8` (`spellData.ts` **502–522**). Frost Bolt is damage 20, range **4** (`spellData.ts` **124–140**).

### 1.2 Line numbers vs 2026-10-27 (P0 sites did not move)

| Fact | 2026-10-27 | Live (2026-10-28) |
| :--- | :--- | :--- |
| `computeAITier` | `combatMath.ts` 36–52 | **unchanged** |
| `pickEnemyLevelFromTiers` `maxTier = floor(999 / ts)` | `combatMath.ts` 54–58 | **unchanged** (SYS-73) |
| `calcScaledDamage` ignores caster level | `combatMath.ts` 130–137 | **unchanged** (SYS-72) |
| Spawn `aiTier` | WX 5823 | **5823** |
| Family second roll | WX 5865 | **5865** |
| Kit `levelZone` object | WX 11920 | **11920** — `_enemyUsableSpells` still computed at **11916–11918** and **never read**; assign is `normalizedSpellPool.find` (**11921–11923**) (SYS-90 / SYS-41) |
| Stale comment “10 random spells” | WX 11915 | **11915** |
| Summoner chance unbounded | WX 11932–11943 | **11932–11943** (FUT-23; skip-brain is SYS-89) |
| Player-summon empty occupied | WX 15156 | **15156** (SYS-14) |
| Player-summon `availableSpells` | WX 15172 | **15172** raw kit (SYS-114 / #1158) |
| Pack `isSummoner` short-circuit | WX 16375–16384 | **16375–16384** (SYS-86 / SYS-89) |
| Summoner dest + cooldown even if spawn fails | WX 16389–16404 | **16389–16404** (SYS-117) |
| Dest-commit clamp | WX 16416–16423 | **16416–16423** (SYS-58). This file’s SYS-123 is the **fused `kind: "cast"` + dest ≠ origin** that this helper teleports. |
| Apply Chebyshev only | WX 16450–16456 | **16450–16456** |
| Damage/drain gate `spellDmg > 0` | WX 16459–16462 | **unchanged** (SYS-96) — **no `isPhysical`** (SYS-108) |
| Fire Bolt `e-firebolt` | WX 16712 | **16712** |
| `aiTier >= 5` / `>= 10` | WX 15507 / 15594 | **15508** / **15595** (one-line drift; behaviour unchanged) |
| `decideEnemyAction` | 1662–1707 | **1662–1707** |
| `scoreTargets(..., null)` | (not called out) | caster **947**, charger **1177**, flanker **1296**, berserker **1404**, generic **1493** (this file’s SYS-125). Hunter passes venom (**1935**, SYS-02). |
| Archer kite `stepAway(..., 1)` | (not called out) | **2328** (this file’s SYS-122) |
| Charger `canReach` Chebyshev ≤ budget+1 | 1195–1196 | **1195–1196** (SYS-116) |
| `decideSummonerAction` midpoint | 1890–1905 | **1890–1905** (SYS-117) |
| `pickBossKitSpell` `new Map()` | `useBossAI.ts` 169–173 | **169–173** and every sibling (AEE-2026-09-01-008) |
| Boss kit apply lookup | WX 15814–15816 | **15814–15816** `starterSpells.find` (SYS-119) |
| Boss kit **damage** | WX 15860–15886 | **15860–15886** raw damage (SYS-115). Then SYS-45 teleport **16005–16008**. |
| Boss kit **heal / debuff / DoT / buff** | (folded into SYS-115’s damage cite) | Heal **15889–15905**, debuff **15907–15928**, DoT **15930–15945**, buff **15949–15972** — **no** range/LoS/AP, and DoT is **outside** `bSpellDmg > 0` (this file’s SYS-120). |
| Boss `attackPlayer` / `moveToward` | `useBossAI.ts` 90–119 | **90–119**. WX apply reads `abilityResult` only (**16013–16026**) (SYS-118). |
| Boss `abilityResult.damageToPlayer` | (SYS-118 is the missing type arm) | WX **16025–16039** `setCharacterStats` — **no** `playerTakesDamage`, **no** RES, **no** SP (this file’s SYS-121). |
| Final Pawn kit-less projectile | `useBossAI.ts` 992–1001 | **992–1001** (SYS-16). Currently a SYS-118 no-op (`type: "attack"` without `abilityResult`). Do not re-file. |
| `applyBattleWalkHazards` | (player-only; not called out) | WX **9906–9932**. Pack dest-commit never calls it (this file’s SYS-124). |
| Bomber `AI_KAMIKAZE_BLAST_RADIUS` | 2387–2393 | **2387–2393** (SYS-106) |
| `ENEMY_AI_TIER_GATES` | unread | still unread (`enemyAI.ts` comment only at **1422–1423**) |
| Hostile `summonAI = pieceType` | `summonSpawn.ts` 275 | **275** (SYS-88 / #842) |
| FUT-83 pack healer ward | 1142 | **1142** `allies.find(!isSummon)` — still unimplemented. Do not re-file. |

P0 remains **AEE-2026-08-31-002** (Fire Bolt / apply honesty) then **AEE-2026-08-31-001** (`computeAITier`). Then 09-21…10-27 honesty. Then this file’s SYS-120…125. Do not start FUT-138+ first. A boss Inferno that writes 8/turn from any tile (SYS-120) currently *also* teleports onto the player (SYS-45). That is on the P0 honesty path, not a T6 extra.

### 1.3 Still true — do not re-file (parent / 09-21…10-27)

- Zone-0 kits forever (`Math.floor(levelZone)` on an object). SYS-09. SYS-90 is the **id resolve** after that floor, not the NaN.
- `_enemyUsableSpells` unused; Rallying Cry `usableByEnemy: false` still assigned via `normalizedSpellPool.find`. SYS-41 / SYS-90.
- `estimateDamage` returns 0 when `spell.damage <= 0`. SYS-02 / SYS-39. SYS-125 is the **null-spell crush** path, not this.
- Heal-first `inferArchetype` (447–452). SYS-04 / SYS-41. SYS-101 is range>1 buff/DoT → caster.
- Pack healer idle ward `allies.find(!isSummon)` (1142). **FUT-83**. Do not re-file.
- Focus setter unread by `scoreTargets`. AEE-2026-09-01-005 / TEM-01. Wisp-harass list promotion (1678–1690) is also unread after `scoreTargets` re-sorts — still TEM-01, not a new id.
- `stepToward` / flank / legal-cast dests skip `filterHazardCandidates`. SYS-92. SYS-122 is kite **`stepAway` with hpFrac 1**, which *calls* the filter and then skips it.
- `stepToward` Set-order fallback walks away. SYS-97. Diagonal candidate still must be in `reachable` (SYS-15).
- Caster *retreat* uses `opponents[0]`. SYS-93.
- Pack apply DoT nested under `damage > 0`. SYS-96. Boss DoT is a **separate** un-gated arm (SYS-120).
- Wisp Rallying Cry is self range 0 aimed at a ward. SYS-99.
- `allies` exclude self. SYS-107 (pack) / SYS-110 (wisp).
- Kit Strike as `kind: "cast"` → SP×RES. SYS-108. Charger adjacent test still expects `kind: "cast"` (`enemyAI.charger.test.ts` **124–130**).
- `scoreAlly` raw table vs `threatValue()`. SYS-109.
- Hunter venom no `repositionForLOS`. SYS-111 / #1123.
- Summon `applyCast` no geometry. SYS-112.
- `decideHealer` `healAmount > 0` drain-as-heal. SYS-113.
- Bomber private radius-2 + `hp = 0` inside `damage > 0`. SYS-106.
- Hostile summons skip executor. SYS-55. #842 routes decide only.
- `findKitSpell` assigned fallback (1737–1745). AEE-2026-09-21-004. SYS-114 filters **available**; this fallback still bypasses CD until deleted.
- Boss kit `new Map()` cooldown. AEE-2026-09-01-008. SYS-115 is the **damage** apply cheat; SYS-120 is the **other arms**.
- Boss kit dest-commit onto `targetX/Y`. SYS-45 / #498. SYS-118 is `type: "attack"` / `"move"` **without** that spell arm. SYS-121 is ability **HP**, not dest.
- Summon occupied empty. SYS-14. SYS-114 is the **spell list**, not occupancy.
- Minion AP/MP 0. SYS-21.
- `pickBestDamageSpell` origin-range. SYS-79.
- `wLowHp` `effectiveHp ?? hp`. SYS-84.
- Lookahead/spill skip `aiCanCast`. SYS-85.
- `isSummoner` skip eats the piece kit. SYS-89.
- Player-summon raw kit. SYS-114 / #1158.
- Boss kit damage sniper. SYS-115 / #1104 CHC only.
- Charger Chebyshev `canReach`. SYS-116.
- Summoner midpoint dest. SYS-117.
- Boss `type: "attack"` / `"move"` no-op. SYS-118.
- Boss `starterSpells.find`. SYS-119.
- Strip / `resolveEnemyApMp` AP=`level` (WX **17402–17411**). AEE-2026-09-26-001. Display only; decide still does not read it.
- Ally `targetId` fallback Crush/Fire Bolt (WX **16704–16715**). AEE-2026-09-24-001.

---

## 2. New honesty (why these six)

1. **Boss kit non-damage arms ignore geometry.** SYS-115 scoped the **damage/drain** arm (WX **15860–15886**): `playerTakesDamage(raw spell.damage)` when `bSpellDmg > 0`. Heal (**15889**), debuff (**15907**), DoT (**15930**), and self-buff (**15949**) run **unconditionally** after that gate. Inferno is `damage: 0` / `dotDamagePerTurn: 8` (`spellData.ts` **508–516**), so the damage arm no-ops and the DoT arm still writes an 8/turn burn from tile (0,0) onto a player at (15,15), then SYS-45 teleports the boss onto `targetX/Y`. Open #1104 is CHC on the **damage** arm only. SYS-120.

2. **Boss ability HP bypasses `playerTakesDamage`.** After the spell arm, WX reads `res?.damageToPlayer` (**16025–16039**) and writes `setCharacterStats` with shield absorb only. No RES (`playerTakesDamage` **3427–3432**), no SP, no pack SYS-66 pre-multiply. Countess `COMPOUNDING_ROT`, Archbishop `CURSE_ON_HIT` when it carries damage, and any future `abilityResult.damageToPlayer` share this path. SYS-118 is the **missing** `type: "attack"` arm (0 damage today). SYS-68 is **pack melee**. This id is ability HP. SYS-121.

3. **Archer kite never sees hazards.** `filterHazardCandidates` (**430–441**) only runs when `hpFrac < ENEMY_HAZARD_AVOID_HP_PCT` (0.5). Archer maintain-range calls `stepAway(origin, targetCell, ctx, reachable, 1)` (**2328**) — a constant full-HP fraction — so lava / ice / spikes are never dropped. SYS-92 is `stepToward` / flank / legal-cast **skipping the helper**. This id is the helper running and then ignoring every kite step. SYS-122.

4. **Pack `closes-in` is a fused teleport+cast.** Caster (**1014–1029**), charger (**1242–1257**), and generic (**1612–1627**) emit `kind: "cast"` with `destination` = `findNearestLegalCastTile` (a tile in `reachable`, up to budget 3). WX dest-commits that tile (`enemyDestToCommit`, **16416–16423**) then range-checks from `newX/newY` (**16450–16456**) with **no MP debit** and **no** leftover-AP reevaluate. Player walk bills MP then AP as separate actions. Summon leftover (`summonExecutor.ts` **249–254**) at least bills the walk first. SYS-03 is the BFS **budget vs current MP**. SYS-15 is the **Chebyshev vs 4-dir metric**. This id is the **fused apply shape**. SYS-123.

5. **Pack and boss walks ignore thorned_ground / void_rift.** Player `applyBattleWalkHazards` (WX **9906–9932**) bills `thornedGroundWalkDamage` (5 HP per extra tile, `battleSetup.ts` **297–300**) and `VOID_RIFT_TICK = 3` (**288**). Grep shows that helper is **player-only**. Pack dest-commit never calls it. Boss `getWalkableMoves` (`useBossAI.ts` **58–81**) is cardinal tiles vs `allTiles` + occupied; no thorn, no rift, no Frozen, no lava. POS-04 is decide **scoring**. This id is apply **not billing a public HP cost**. Do not “fix” by granting pack immunity (SYS-59). SYS-124.

6. **`killableNow` is crush, not the kit.** `scoreTargets` (**528–551**) calls `estimateDamage(bestSpell, ctx)`. Caster / charger / flanker / berserker / generic pass **`null`** (**947, 1177, 1296, 1404, 1493**), so `estimateDamage` uses melee crush `12 * max(1, level/5)` (**494–499**). `wKillable = 100` (`gameConstants.ts` **181**) then dwarfs threat (50) and low-HP (30). A bishop Frost (20, then SP×RES, SYS-66) can “know” a 1-HP target is crush-killable and `setFocusTargetId` on it. SYS-02 is `damage <= 0` → 0 (Inferno/poison). SYS-72 is `calcScaledDamage` ignoring caster level. This id is the **null spell argument**. SYS-125.

---

## 3. System proposals

### AI-SYS-120

**AI_ID:** AI-SYS-120  
**NAME:** Boss kit heal / debuff / DoT / buff must share the damage-arm geometry gate  
**ROLE:** system  
**SOPHISTICATION:** all (honesty for SYS-05 / SYS-13 / SYS-115 / SYS-96)  
**DECISION_RULES:** Today WX **15889–15972** applies heal, `debuffStat`, `dotDamagePerTurn`, and self/ally buff with **no** Chebyshev, **no** LoS, **no** `apCost`. Inferno (`damage: 0`, `dotDamagePerTurn: 8`) skips SYS-115’s `bSpellDmg > 0` arm (**15862**) and still writes the DoT (**15930–15945**). After this module: every boss kit id — damage, drain, DoT, heal, debuff, buff — is illegal unless SYS-13 / `enemyCastGeometryOk` (range + LoS) **and** `apCost` is payable **and** `targetType` matches. `damage: 0` Inferno writes ticks only from a legal dest (SYS-96 for pack; do not delete that writer to “match” the boss). Failed legality → skip, never bolt, never a map-wide burn. SYS-45 dest-commit onto `targetX/Y` (**16005–16008**) stays a **separate** teleport; legality here must not become that walk. Open #1104 may add CHC on the damage arm — keep it; do not treat CHC as this slice. Empty `new Map()` remains AEE-2026-09-01-008 (decide). SYS-119 still owns catalog vs `starterSpells.find`.  
**SCORING_MODEL:** N/A (apply correctness). Decide still first-id until 008.  
**SPELL_REQUIREMENTS:** Every id in `phase1.spellPoolIds` / `phase2.spellPoolIds`, including Inferno / Blood Mend / Iron Skin.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always for bosses. Relative sigmoid may attach T5 combo search **after** this gate.  
**ENEMY_ARCHETYPES:** elite / boss.  
**PLAYER_COUNTERPLAY:** Break LoS; stand outside Inferno range 3 / Frost range 4; the burn must not land from across the map.  
**EDGE_CASES:** `player?.x ?? 0` (`useBossAI.ts` **175–180**) must not become a (0,0) snipe **or** a (0,0) DoT when player is missing. Self-heal (`starter-heal` range 0) stays legal on the **boss tile**, not a free full-HP from any range via a missing gate. Buff arm uses `debuffStat ?? "atk"` (**15963**) — do not invent a hidden ATK buff as a “fix.” Drain heal still requires a legal **player** hit first (SYS-115).  
**IMPLEMENTATION_COMPLEXITY:** Medium (same WX boss-spell block as SYS-115; one shared legality helper).  
**TEST_SCENARIOS:** TS-BOSSDOT, TS-BOSSHEAL, TS-BOLT3.  
**STATUS:** PROPOSED

### AI-SYS-121

**AI_ID:** AI-SYS-121  
**NAME:** Boss `abilityResult.damageToPlayer` must use pack mitigation  
**ROLE:** system  
**SOPHISTICATION:** all (honesty for SYS-05 / SYS-66 / SYS-68 / SYS-115)  
**DECISION_RULES:** Today WX **16025–16039** applies `res.damageToPlayer` via `setCharacterStats` after a shield absorb. `playerTakesDamage` (**3427–3432**) never runs, so RES is skipped; SP never runs. Pack kit-cast at least pre-multiplies SP×RES (SYS-66) then calls the helper (RES twice — do not delete pack SP to “match”). Pack melee is SYS-68 (RES-only, `setCharacterStats`, no bolt). After this module: ability HP goes through the **same** helper pack melee will use once SYS-68 is honest — RES once, no SP on physical tagged abilities, no kit-less bolt. Challenge debit already records at **16035–16038**; keep it. SYS-118 is the **missing** `type: "attack"` arm (0 damage today); when that arm lands it must share this helper, not Fire Bolt. Do not route tagged `BossAbility` wall-jumps through this HP path.  
**SCORING_MODEL:** N/A (apply correctness).  
**SPELL_REQUIREMENTS:** None (ability HP). Kit ids still SYS-115 / SYS-120.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always for bosses.  
**ENEMY_ARCHETYPES:** elite / boss.  
**PLAYER_COUNTERPLAY:** Stack RES; a Countess rot tick must shrink.  
**EDGE_CASES:** `damageToPlayer` 0 must stay 0 (no `Math.max(1, …)` sniper). Shield absorb order matches `playerTakesDamage` (**3433–3438**). Paper Windstorm is pack ranged (SYS-70); do not silently miss ability HP. Final Pawn feeble projectile (**992–1001**) is SYS-16 — still no kit-less range-3 hit even after this helper exists.  
**IMPLEMENTATION_COMPLEXITY:** Low (one apply arm).  
**TEST_SCENARIOS:** TS-BOSSABILRES, TS-BOLT3.  
**STATUS:** PROPOSED

### AI-SYS-122

**AI_ID:** AI-SYS-122  
**NAME:** Kite `stepAway` must use real HP so hazard filter can fire  
**ROLE:** system / kiter  
**SOPHISTICATION:** T1+ (honesty for POS-04 / SYS-92)  
**DECISION_RULES:** `decideSummonArcher` maintain-range calls `stepAway(origin, targetCell, ctx, reachable, 1)` (**2328**). `filterHazardCandidates` (**430–441**) no-ops unless `enemyHpFrac < 0.5`, so a full-HP archer steps onto lava / ice / spikes while kiting. After this module: pass `hpFrac(summon)` (the same helper bomber already uses at **2364–2373**). T0 may still walk a **reachable** cardinal when every kite tile is a hazard (never SYS-97 Set-order through a wall). SYS-92 remains: `stepToward` / flank / legal-cast dests must **call** the filter. Ice vs lava vs spikes stay typed in FUT-140; this slice only stops the constant `1`. Do not walk through occupied/void to “keep range 3.”  
**SCORING_MODEL:** Hazard dest dropped when a non-hazard kite tile exists in `reachable`.  
**SPELL_REQUIREMENTS:** Archer kit poison / slow (already profiled as decide ids).  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always for archer/kiter. Remnant kiters may walk a reachable non-hazard even at T0.  
**ENEMY_ARCHETYPES:** archer, kiter.  
**PLAYER_COUNTERPLAY:** Stand so the only Chebyshev-3 kite tiles are lava; the archer holds or eats the lava **knowingly**, it does not pretend ice is air.  
**EDGE_CASES:** `hpFrac = 1` was a “never retreat” signal, not a sophistication toggle — do not re-encode it as `if (level >= X) avoidLava`. Berserker override of hazards stays ROL-03 / SYS-04, not this kite path.  
**IMPLEMENTATION_COMPLEXITY:** Low (one argument).  
**TEST_SCENARIOS:** TS-KITEHAZ, TS-BOLT3.  
**STATUS:** PROPOSED

### AI-SYS-123

**AI_ID:** AI-SYS-123  
**NAME:** Pack `closes-in` is move then cast, not a free teleport  
**ROLE:** system / resource  
**SOPHISTICATION:** all (honesty for SYS-03 / SYS-05 / SYS-15 / RES-02)  
**DECISION_RULES:** Caster **1014–1029**, charger **1242–1257**, generic **1612–1627** emit `kind: "cast"` with `destination` = `findNearestLegalCastTile` (787–824). WX dest-commits (**16416–16423**) then range-checks from the new tile (**16450–16456**) with **zero** MP debit and **no** leftover-AP reevaluate. After this module: either (a) emit `kind: "move"` to the legal-cast tile this turn and let a leftover sequencer cast next (summon leftover **249–254** is the honesty template — do not re-file it), or (b) keep a fused action only if SYS-03 bills the **4-dir path cost** from origin→dest against **current MP** **and** `apCost` against **current AP** before the spell arm. Dest not in `reachable` → illegal. Failed bill → skip, never bolt. SYS-58 still clamps dest; a clamped dest that is no longer in range must not Fire Bolt (SYS-05). Thorn/rift HP on that path is SYS-124.  
**SCORING_MODEL:** Enumerator only; unpaid dest −∞.  
**SPELL_REQUIREMENTS:** Profiled ranged ids (Frost range 4). Strike range 1 should not emit `closes-in` from Chebyshev 3 (`pickBestDamageSpell` already drops it — SYS-79).  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always (resource honesty). T2+ may keep same-turn move+cast **after** both bills.  
**ENEMY_ARCHETYPES:** caster, charger (ranged option), generic.  
**PLAYER_COUNTERPLAY:** A bishop three cardinal steps out pays 3 MP to step in, or waits; it does not blink-cast.  
**EDGE_CASES:** Frozen/Slime `enemyWalkCostPerTile` already doubles BFS cost — membership in `reachable` inherits that (SYS-31). Chebyshev-2 dest that is 4-dir cost 3 still costs 3 (SYS-15). `kind: "move"` that lands adjacent must not leftover-Bolt (SYS-05).  
**IMPLEMENTATION_COMPLEXITY:** Medium (decide shape + WX apply; depends on SYS-03 / SYS-07 seeding MP).  
**TEST_SCENARIOS:** TS-CLOSEIN, TS-BOLT3.  
**STATUS:** PROPOSED

### AI-SYS-124

**AI_ID:** AI-SYS-124  
**NAME:** Pack and boss walks bill thorned_ground and void_rift like the player  
**ROLE:** system / positioning  
**SOPHISTICATION:** all (honesty for POS-04; not SYS-59 immunity)  
**DECISION_RULES:** Player `applyBattleWalkHazards` (WX **9906–9932**) bills `thornedGroundWalkDamage(pathLength)` — 5 HP per extra tile after the first (`battleSetup.ts` **297–300**) — and `VOID_RIFT_TICK = 3` when dest is the rift tile (**302–309**). Pack dest-commit never calls it. Boss `getWalkableMoves` (**58–81**) ignores thorns, rift, Frozen, lava, barriers-as-hazards. After this module: every committed enemy/boss dest whose 4-dir path length > 1 on a thorned map pays the same HP helper; landing on the live rift tile pays 3. Decide may score that cost (FUT-142) but must not skip the bill. Do **not** grant pack immunity (SYS-59). Do **not** debit the player when an enemy walks. Frozen remains an MP doubler (SYS-31), not this HP bill. Lava/spikes stay `hazardTiles` (POS-04 / SYS-122).  
**SCORING_MODEL:** N/A for the bill; FUT-142 adds `−wThorn * extraTiles`.  
**SPELL_REQUIREMENTS:** None.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always when those map modifiers are public.  
**ENEMY_ARCHETYPES:** All walkers, including bosses after SYS-118.  
**PLAYER_COUNTERPLAY:** Kite across thorned ground; the pack pays 5 HP per extra tile the same way you do.  
**EDGE_CASES:** `pathLength` for a dest-commit jump is the **4-dir path cost**, not Chebyshev (SYS-15). Path length 1 (adjacent step) stays 0 thorn (`thornedGroundWalkDamage` already). Missing modifier → 0, not a guessed 5. Challenge Untouchable must see this debit (`recordChallengeWalkHazardDamage` exists for the player; enemy self-damage is not a player-challenge event).  
**IMPLEMENTATION_COMPLEXITY:** Medium (WX pack + boss walk apply).  
**TEST_SCENARIOS:** TS-THORN, TS-RIFT, TS-BOLT3.  
**STATUS:** PROPOSED

### AI-SYS-125

**AI_ID:** AI-SYS-125  
**NAME:** `killableNow` uses the spell that will fire, not melee crush  
**ROLE:** system / target-selection  
**SOPHISTICATION:** T1+ (honesty for TGT-01 / TGT-07 / SYS-02)  
**DECISION_RULES:** `scoreTargets` (**536–538**) calls `estimateDamage(bestSpell, ctx)`. Caster **947**, charger **1177**, flanker **1296**, berserker **1404**, and generic **1493** pass `null`, so crush `12 * max(1, level/5)` (**494–499**) drives `wKillable = 100`. After this module: pass the spell `pickBestDamageSpell` would actually emit (or `null` only when the action is true melee). `killableNow` uses that EV after **visible** RES/SR (`isPhysical` → RES only; else SR then RES — parent §5 `resGap`). Do not read hidden player click / future CHC roll. SYS-02 still owns `damage <= 0` Inferno/poison EV (DoT ticks, not crush). SYS-72 still owns `calcScaledDamage` ignoring caster level — do not sneak `enemy.level` into that helper as this slice. SYS-85 still re-checks `aiCanCast` after lookahead retarget. Hunter already passes venom (**1935**); venom `damage: 0` stays SYS-02, not this id.  
**SCORING_MODEL:** `killableNow = (profiled EV >= hp)` after visible mitigation. Illegal dest does not count as killable.  
**SPELL_REQUIREMENTS:** Profiled damage/drain/DoT ids.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always for any unit that calls `scoreTargets`. T0 may keep nearest-target without the crush lie.  
**ENEMY_ARCHETYPES:** caster, charger, flanker, berserker, generic.  
**PLAYER_COUNTERPLAY:** Stack SP against Frost; a 1-HP player with 50 SP is not “crush-killable” to a bishop.  
**EDGE_CASES:** Enrage multiplier in `estimateDamage` (**498, 507**) is public (6× spectacle still SYS-01 / `aiTier >= 10`) — do not feed betrayal 6× into killable scoring as sophistication. `effectiveHp ?? hp` still zeroes `wLowHp` when WX omits the field (SYS-84); this id does not re-file that.  
**IMPLEMENTATION_COMPLEXITY:** Low (pass the spell; stop calling `scoreTargets` before picking it).  
**TEST_SCENARIOS:** TS-KILLCRUSH, TS-BOLT3.  
**STATUS:** PROPOSED

---

## 4. T6+ modules (this increment)

These attach via the parent §4 sigmoid. They are **not** `if (level >= N)`.

### AI-FUT-138

**AI_ID:** AI-FUT-138  
**NAME:** Boss kit enumerator scores DoT / heal / buff as profiled dests  
**ROLE:** elite / spell-awareness  
**SOPHISTICATION:** T6 (T5 parent; SYS-120 / SYS-119 / FUT-133 / SYS-02)  
**DECISION_RULES:** After SYS-120 + 008: T5+ bosses score legal pool ids including Inferno ticks, self-heal at range 0, and profiled buffs, with the parent enumerator cap (64 dest × 8 spells × 12 targets, abort > 256). T1 may keep first-off-CD **only among legal dests**. T0 may skip the kit and melee (SYS-118). Unbounded: a later phase-3 DoT row is another id in the same enum, not `if (level >= 200) phase3`. Never ignore LoS to “feel like a boss.” FUT-133 remains the damage-arm enumerator; this module is the **non-damage** rows.  
**SCORING_MODEL:** Parent `U` + phase weight. DoT EV = `dotDamagePerTurn * remainingDuration` if the target lacks this `dotType` (SYS-02). Illegal dest −∞.  
**SPELL_REQUIREMENTS:** Profiled pool ids resolved by SYS-119.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.8` for `isBoss`; remnants with a leftover pool skip.  
**ENEMY_ARCHETYPES:** elite / boss.  
**PLAYER_COUNTERPLAY:** Hug a wall; they spend the turn repositioning (POS-01) instead of a map-wide Inferno.  
**EDGE_CASES:** SYS-45 teleport must not be the dest that made the DoT legal. Duplicate burn ticks EV ≈ 0.  
**IMPLEMENTATION_COMPLEXITY:** Medium after SYS-120 / 008.  
**TEST_SCENARIOS:** Dist 16 Inferno never writes a DoT. In-range Inferno, target already burning → T5 picks another legal id or skip.  
**STATUS:** PROPOSED

### AI-FUT-139

**AI_ID:** AI-FUT-139  
**NAME:** Tagged boss abilities share the mitigation helper, not a parallel HP writer  
**ROLE:** elite / system  
**SOPHISTICATION:** T6 (SYS-121 / SYS-16 / SYS-118)  
**DECISION_RULES:** After SYS-121: T5+ ability HP (rot, curse-on-hit damage, lava-trail chip if any) uses the same RES-once helper as honest pack melee. T0 bosses may keep a weaker tagged chip **only if** it still pays RES. Unbounded: a later ability row adds a `BossAbility` profile, not a new `setCharacterStats` arm. Wall-ignore / board-rotate / invincible phase stay SYS-16 tagged scripts with UI copy — they are not pack modules and not `aiTier` gates.  
**SCORING_MODEL:** Ability EV after visible RES. Illegal (out of tagged range) −∞.  
**SPELL_REQUIREMENTS:** None (abilities). Kit ids still SYS-115 / SYS-120.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.8` for `isBoss`.  
**ENEMY_ARCHETYPES:** elite / boss.  
**PLAYER_COUNTERPLAY:** RES still matters on rot ticks; invincible phase remains a readable named wait.  
**EDGE_CASES:** Final Pawn feeble projectile stays deleted (SYS-16), not revived as “T5 ranged ability.” Countess lava trail dest is a 4-dir step (FUT-136), not a diagonal teleport.  
**IMPLEMENTATION_COMPLEXITY:** Low after SYS-121.  
**TEST_SCENARIOS:** TS-BOSSABILRES at T5 vs T0; no `e-firebolt`.  
**STATUS:** PROPOSED

### AI-FUT-140

**AI_ID:** AI-FUT-140  
**NAME:** Typed hazard costs — ice skip ≠ lava HP ≠ spike HP  
**ROLE:** positioning / kiter  
**SOPHISTICATION:** T6 (POS-04 / SYS-122 / SYS-92)  
**DECISION_RULES:** After SYS-122: T2+ kiters score ice as a **skip-next-turn** cost, lava/spikes as **HP**, and will stand on ice only when `U(skip)` beats `U(lava-step)` and `U(hold)`. T0 may treat all three as “blocked” once the filter sees real HP. Unbounded: a later acid hazard is another typed key on `hazardTiles`, not `if (level >= 90) avoidAcid`. Do not keep a private boss-only hazard brain (parent §2). Public boss-written `currentMap.hazardTiles` (Countess lava) use the same table.  
**SCORING_MODEL:** `U(tile) -= wLava*isLava + wSpike*isSpike + wIceSkip*isIce`.  
**SPELL_REQUIREMENTS:** None.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.2` for kiter/caster. Remnant kiters may still step ice = lava.  
**ENEMY_ARCHETYPES:** archer, caster, charger (wait vs lava tackle is FUT-134).  
**PLAYER_COUNTERPLAY:** Body-block the only non-ice kite tile.  
**EDGE_CASES:** `filterHazardCandidates` falling back to the original list when `safe.length === 0` (**440**) must not re-admit lava as “the only kite.” Hold instead.  
**IMPLEMENTATION_COMPLEXITY:** Low after SYS-122.  
**TEST_SCENARIOS:** TS-KITEHAZ with ice-only vs lava-only vs mixed.  
**STATUS:** PROPOSED

### AI-FUT-141

**AI_ID:** AI-FUT-141  
**NAME:** Pack leftover-AP sequencer (move, then recast)  
**ROLE:** resource  
**SOPHISTICATION:** T6 (RES-02 / RES-04 / SYS-123 / SYS-03)  
**DECISION_RULES:** After SYS-123: T2+ pack units may spend leftover AP on a **second** legal action the way summon leftover does (`summonExecutor.ts` **249–254**) — one recast/melee, never a second walk, abort if enum > 256. T0 emits move **or** cast, not both, even when both would be legal after billing. Unbounded: a later 2-AP cantrip is another profiled id in the leftover enum, not `if (level >= 70) doubleCast`. Do not recast Inferno on CD (SYS-114). Do not leftover-Bolt (SYS-05).  
**SCORING_MODEL:** `U(move)+U(leftover cast)` vs `U(cast in place)` vs `U(move only)`. Unpaid −∞.  
**SPELL_REQUIREMENTS:** Profiled leftover ids with remaining AP ≥ `apCost`.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.35` for caster/generic. Remnant pawns skip.  
**ENEMY_ARCHETYPES:** caster, generic, charger with a profiled ranged id.  
**PLAYER_COUNTERPLAY:** Leave the bishop 4 tiles out with 1 MP — it walks and cannot leftover-Frost.  
**EDGE_CASES:** Summon leftover stays the template; do not grow a third brain. Pack leftover must re-check LoS from the **new** origin (SYS-13).  
**IMPLEMENTATION_COMPLEXITY:** Medium after SYS-123 / SYS-03.  
**TEST_SCENARIOS:** TS-CLOSEIN at T2 (bill walk, leftover Frost in range) vs T0 (walk only).  
**STATUS:** PROPOSED

### AI-FUT-142

**AI_ID:** AI-FUT-142  
**NAME:** Thorn-aware / rift-aware path scoring  
**ROLE:** positioning  
**SOPHISTICATION:** T6 (POS-04 / POS-08 / SYS-124)  
**DECISION_RULES:** After SYS-124: T2+ walkers prefer the reachable dest that minimises `thornedGroundWalkDamage(pathLength)` and avoid the live rift tile unless that dest is the only tackle. T4+ also keep an escape route that is not thorn-max (POS-08). T0 may still take any reachable dest and **pay** the bill. Unbounded: a later 2×-thorn modifier is another public flag, not `if (level >= 120) respectThorns`. Do not skip the HP bill to “play around thorns.”  
**SCORING_MODEL:** `U(dest) -= wThorn * extraTiles - wRift * landingOnRift`.  
**SPELL_REQUIREMENTS:** None.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.25` when `thorned_ground` or `void_rift` is public. Remnants pay and walk.  
**ENEMY_ARCHETYPES:** All walkers.  
**PLAYER_COUNTERPLAY:** Stand across a long thorn path; peer casters wait, remnants bleed.  
**EDGE_CASES:** Path length 1 = 0 thorn (already). Boss after SYS-118 uses the same score, not a private Countess table.  
**IMPLEMENTATION_COMPLEXITY:** Low after SYS-124.  
**TEST_SCENARIOS:** TS-THORN at T2 preferring a 1-step dest over a 3-step dest.  
**STATUS:** PROPOSED

### AI-FUT-143

**AI_ID:** AI-FUT-143  
**NAME:** Resistance-aware `killableNow` as a reusable TGT module  
**ROLE:** target-selection  
**SOPHISTICATION:** T6 (TGT-05 / TGT-07 / SYS-125 / SYS-02)  
**DECISION_RULES:** After SYS-125: T2+ uses profiled EV after visible RES/SR/CHC **rate** (not a hidden roll). T4+ also prefers the defense the spell actually bypasses (`isPhysical` → RES; else SR then RES). T0 may keep nearest-target. Unbounded: a later shred-RES debuff is a public `getStatModifier` read, not `if (level >= 80) ignoreRES`. Do not put player SP on Strike to “match Frost,” and do not delete SP from Frost to “match Strike.”  
**SCORING_MODEL:** Parent `resGap` + `killableNow`. Duplicate DoT EV ≈ 0 (SYS-02).  
**SPELL_REQUIREMENTS:** Profiled damage/drain/DoT.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.2` for caster/artillery. Remnant pawns may still nearest-target.  
**ENEMY_ARCHETYPES:** caster, artillery, generic.  
**PLAYER_COUNTERPLAY:** Stack the defense the kit actually uses; a Frost bishop stops treating you as crush-killable.  
**EDGE_CASES:** CHC rate is public on the combatant; the roll is not. Lookahead must re-check geometry (SYS-85).  
**IMPLEMENTATION_COMPLEXITY:** Low after SYS-125.  
**TEST_SCENARIOS:** TS-KILLCRUSH at T2 (Frost EV after SP) vs T0 (nearest).  
**STATUS:** PROPOSED

---

## 5. Spell-awareness contract (reminder)

Unchanged: no profile + apply ⇒ not in kit, not in elite extras, `usableByEnemy` treated as false in the enumerator.

Still `usableByEnemy: true` without a working decide+apply pair (do not give these to pack AI until the named SYS/FUT apply):

`spell-swap`, `spell-mark`, `spell-sacrifice`, `spell-lifesteal-nova`, `spell-enrage`, `spell-haste`, `spell-weaken`, `spell-expose`, `spell-drain-courage` (SYS-113 before any kit row), `spell-cursed-wound`, `spell-shadow-veil`, `spell-frost-nova`, `spell-inferno` (SYS-96 / SYS-103 / SYS-106 / SYS-114 CD / **SYS-120 boss DoT arm**), `starter-poison` / `spell-venom-strike` (SYS-96 / SYS-111), `starter-shield` / `spell-iron-skin` (SYS-98 / SYS-112), `starter-drain`.

Keep `usableByEnemy: false` until profiled: barrier, mirror, timestep, rallying-cry, sentinel/bomber/wisp summons.

`summon-dire-wolf` / `summon-archer` are `usableByEnemy: true` with range 2. SYS-86 is the profile. SYS-117 is the live midpoint emitter.

Boss pool ids must pass SYS-119 + SYS-115 + **SYS-120** before they are sophistication.

Motoko `defaultSpells` (`shadow_strike`, `soul_rend`, `vampire_bite`, `reflect_barrier`, `thunder_clap`, `void_collapse`) stay forbidden as frost substitutes (SYS-90).

---

## 6. Implementation order (this increment)

Do not start FUT-138+ first. Do not start T6+ from earlier increments before P0 honesty.

1. SYS-05 (Fire Bolt WX **16712**, AP/MP debit, ally heal WX **16648**) — still P0. Failed `closes-in`, failed kite, failed boss DoT, failed ability HP currently *also* hit leftover paths.  
2. SYS-01 — replace `computeAITier` (`combatMath.ts` 36–52) and the `aiTier >= 5/10` gates (WX **15508** / **15595**).  
3. SYS-73 — drop the 999 spawn ceiling.  
4. SYS-108…119 — 10-26 / 10-27 honesty. Prefer merge/follow #1123 (SYS-111), #1026 / #1033 / #1034 / #1039, #985, #1158 / #1150, #1104, #498.  
5. **SYS-120** + FUT-138 — boss non-damage arms. Same WX block as SYS-115; do not copy #1104 as the whole slice. Then SYS-45 / #498 so a legal Inferno does not teleport.  
6. **SYS-121** + FUT-139 — ability HP through the pack helper. SYS-118 melee/walk still separate. SYS-16 Final Pawn bolt stays deleted.  
7. **SYS-123** + FUT-141 — pack `closes-in` bills MP then leftover AP. Depends on SYS-03 / SYS-07 seeding.  
8. **SYS-124** + FUT-142 — thorn / rift bill. Do not implement SYS-59 immunity.  
9. **SYS-122** + FUT-140 — kite real HP + typed hazards.  
10. **SYS-125** + FUT-143 — `killableNow` uses the kit spell. Then parent TGT-05.  
11. Parent T2–T5 roles / team / adaptive; remaining FUT-01…137.

Each slice: `engine/enemyAI*.test.ts` or a **sidecar** test file (open #1026 pattern), zero WX drive-by, no RAF / map gen / turn order / damage-formula edits unless a **named** follow-up. Scoring **reads** RES/SR/CHC; it does not change `calcScaledDamage`. Do not add `enemy.level` into `calcScaledDamage` as an AI slice.

---

## 7. Extra test scenarios

| ID | Setup | Expect |
| :--- | :--- | :--- |
| TS-BOSSDOT | Boss at (0,0), player at (15,15), pool `[spell-inferno]` | No DoT written (out of range 3); no teleport onto the player (SYS-120 / SYS-45). |
| TS-BOSSHEAL | Boss at (0,0), player at (15,15), pool `[starter-heal]` | Self-heal on the **boss tile** only (range 0); dest stays origin, not (15,15). |
| TS-BOSSABILRES | Countess rot `damageToPlayer = 20`, player RES 50 / SP 0 | Incoming ≈ 10 after RES; not raw 20 (SYS-121). Pack Frost unchanged. |
| TS-KITEHAZ | Archer (4,4) HP full, player (4,7), lava on (4,5) and (4,3) | `stepAway` does not dest-commit a lava tile (SYS-122). No bolt. |
| TS-CLOSEIN | Bishop (2,2), player (2,8), Frost range 4, open grid, MP would be 3 | Either walk this turn without casting, or bill 3 MP **and** 3 AP before Frost; dest is in `reachable`. No blink-cast (SYS-123). No `e-firebolt`. |
| TS-THORN | Pawn dest-commit path length 3, `thorned_ground` on | Pawn HP −10 (2 extra tiles × 5). Player not billed (SYS-124). |
| TS-RIFT | Pawn dest = live void-rift tile | Pawn HP −3 (`VOID_RIFT_TICK`). |
| TS-KILLCRUSH | Bishop level 10, Frost 20, player HP 1 / SP 50 / RES 0 | `killableNow` false after SP; crush `12*(10/5)=24` must **not** win `wKillable` (SYS-125). |
| TS-BOLT3 | Any failed cast/move in this file, Chebyshev 1 | Crush or skip; never `e-firebolt` (WX 16712). |
| TS-PEER3K | Player 3000, enemy 3000 | Not forced T5; remnant 400 stays low tier (FUT-92). |

Parent and 2026-09-01…10-27 TS-* rows still apply (line numbers in §1.2). Frost examples use live range **4**. Inferno examples use live range **3** and CD **3**. Strike range is **1**. Thorn bill is 5 HP per extra tile.

---

## 8. Mapping (new gaps → ids)

| Request / gap | Primary AI_ID |
| :--- | :--- |
| Boss kit Inferno/heal/debuff/buff from any tile | AI-SYS-120 / AI-FUT-138 |
| Boss ability HP ignores RES/SP | AI-SYS-121 / AI-FUT-139 |
| Archer kite walks onto lava at full HP | AI-SYS-122 / AI-FUT-140 |
| Pack `closes-in` teleport+cast unpaid | AI-SYS-123 / AI-FUT-141 |
| Pack/boss walks ignore thorned_ground / void_rift | AI-SYS-124 / AI-FUT-142 |
| `killableNow` uses crush because `scoreTargets` gets `null` | AI-SYS-125 / AI-FUT-143 |

T0–T5 requested list (positioning, targeting, resources, roles, team, adaptive) remains parent §19. Nothing in that list is implemented. Higher-level enemies still get harder from **modules on the sigmoid** and from **honest relative spawn** (SYS-73 / FUT-92 / SYS-89), not from `computeAITier(enemyLevel)`, not from a kit-less bolt, not from a boss Inferno across the map, and not from a bishop that pretends crush is Frost.

Requested capability → already-catalogued parent id (unchanged; still **PROPOSED**), plus this increment’s honesty slices:

| Request | Parent id | This increment |
| :--- | :--- | :--- |
| maintain optimal range / retreat / approach vulnerable / avoid hazards / exploit terrain / avoid AoE clustering / protect allies / escape routes | POS-01…08 | kite hazards = SYS-122 / FUT-140; thorn/rift bill = SYS-124 / FUT-142; `closes-in` unpaid walk = SYS-123 |
| low-HP / high-threat / support / summons / resistance / kill / strategic | TGT-01…07 | crush-killable lie = SYS-125 / FUT-143 |
| AP combinations / move-then-attack / attack-then-retreat / sequencing / cooldown / waste | RES-01…06 | fused `closes-in` = SYS-123 / FUT-141; boss AP on DoT/heal = SYS-120 |
| tank … protector | ROL-01…10 | kiter = SYS-122 / FUT-140; artillery killable = FUT-143 |
| focus fire / protect support / exploit debuffs / avoid duplicate debuffs / coordinated AoE / formations / retreat toward support | TEM-01…07 | `killableNow` feeding focus = SYS-125; Inferno duplicate-burn = FUT-138 |
| estimate threat / punish positioning / adapt HP / adapt AP-MP / summons / status / own HP / survival vs aggression | ADV-01…08 | punish blink-cast = SYS-123; punish lava-kite = SYS-122; punish RES-ignore abilities = SYS-121 |

Every row above is **STATUS: PROPOSED**. No production AI in this change.
