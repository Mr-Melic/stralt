# Advanced Enemy AI Evolution — 2026-10-27 increment

**Status:** PROPOSED (design only; no production code in this change)  
**Date:** 2026-10-27  
**Parent catalog:** [`ENEMY_AI_EVOLUTION.md`](./ENEMY_AI_EVOLUTION.md) (T0–T5)  
**Prior increments:** [`ENEMY_AI_EVOLUTION_2026-09-01.md`](./ENEMY_AI_EVOLUTION_2026-09-01.md) · [`ENEMY_AI_EVOLUTION_2026-09-02.md`](./ENEMY_AI_EVOLUTION_2026-09-02.md) · [`ENEMY_AI_EVOLUTION_2026-09-21.md`](./ENEMY_AI_EVOLUTION_2026-09-21.md) (open PR #351; SYS-22…32, FUT-36…47 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-22.md`](./ENEMY_AI_EVOLUTION_2026-09-22.md) (open PR #416; SYS-33…35, FUT-48…53) · [`ENEMY_AI_EVOLUTION_2026-09-23.md`](./ENEMY_AI_EVOLUTION_2026-09-23.md) (open PR #458; SYS-36…41, FUT-54…59) · [`ENEMY_AI_EVOLUTION_2026-09-24.md`](./ENEMY_AI_EVOLUTION_2026-09-24.md) (open PR #506; SYS-42…47, FUT-60…65) · [`ENEMY_AI_EVOLUTION_2026-09-25.md`](./ENEMY_AI_EVOLUTION_2026-09-25.md) (open PR #565; SYS-48…53, FUT-66…71) · [`ENEMY_AI_EVOLUTION_2026-09-26.md`](./ENEMY_AI_EVOLUTION_2026-09-26.md) (open PR #633; SYS-54…59, FUT-72…77) · [`ENEMY_AI_EVOLUTION_2026-09-27.md`](./ENEMY_AI_EVOLUTION_2026-09-27.md) (open PR #689; SYS-60…65, FUT-78…83) · [`ENEMY_AI_EVOLUTION_2026-09-28.md`](./ENEMY_AI_EVOLUTION_2026-09-28.md) (open PR #723; SYS-66…71, FUT-84…89) · [`ENEMY_AI_EVOLUTION_2026-09-29.md`](./ENEMY_AI_EVOLUTION_2026-09-29.md) (open PR #804; SYS-72…77, FUT-90…95) · [`ENEMY_AI_EVOLUTION_2026-10-21.md`](./ENEMY_AI_EVOLUTION_2026-10-21.md) (open PR #821; SYS-78…83, FUT-96…101) · [`ENEMY_AI_EVOLUTION_2026-10-22.md`](./ENEMY_AI_EVOLUTION_2026-10-22.md) (open PR #874; SYS-84…89, FUT-102…107) · [`ENEMY_AI_EVOLUTION_2026-10-23.md`](./ENEMY_AI_EVOLUTION_2026-10-23.md) (open PR #958; SYS-90…95, FUT-108…113) · [`ENEMY_AI_EVOLUTION_2026-10-24.md`](./ENEMY_AI_EVOLUTION_2026-10-24.md) (open PR #999; SYS-96…101, FUT-114…119) · [`ENEMY_AI_EVOLUTION_2026-10-25.md`](./ENEMY_AI_EVOLUTION_2026-10-25.md) (open PR #1072; SYS-102…107, FUT-120…125) · [`ENEMY_AI_EVOLUTION_2026-10-26.md`](./ENEMY_AI_EVOLUTION_2026-10-26.md) (open PR #1135; SYS-108…113, FUT-126…131 — **do not re-number**)  
**Implementer ledger:** [`automation/ACTION_IDS_AEE_2026-10-27.md`](./automation/ACTION_IDS_AEE_2026-10-27.md)

This increment re-reads the live engine one day after the 2026-10-26 catalog (#1135). SYS-01…113 and FUT-01…131 stay **PROPOSED** on their own files; they are **not** re-filed here. New work is: player-summon `availableSpells` is the raw kit with **no cooldown filter** while pack enemies filter CD + `usableByEnemy`; boss kit-spell apply hits the player for raw `spell.damage` with **no range, LoS, AP, or SP**; charger `canReach` is Chebyshev ≤ `budget+1` rather than membership in the 4-dir `reachable` set; `decideSummonerAction` emits the player/ally **midpoint** with no occupancy/range/LoS; boss `type: "attack"` / `type: "move"` without `abilityResult` apply **no melee and no walk**; boss kit lookup is `starterSpells.find` only.

Stralt has **no character level cap**. Nothing here maps `if (level >= X) sophistication = Y`. Tiers remain conceptual. Eligibility remains the parent §4 sigmoid (`peer = log2(enemy.level / player.level)` plus pack/boss/modifier terms). A year-later peer fight at any absolute level can attach a new module without raising a cap. A wisp that recasts Inferno on cooldown, a boss that snipes Frost from 16 tiles with no SP, and a summoner that “casts” onto a wall are **honesty**, not a last band.

**Hard rules (unchanged):** no cheat, no hidden player information, no ignored LoS/range/AP/MP, no unbounded search, no kit-less Fire Bolt, no `instantKill`, no betrayal-as-difficulty, no name-based spell heuristics, no production AI in this change. Do not “fix” boss kit damage by deleting SP from **pack Frost**. Do not “fix” summoner placement by ignoring occupancy. Do not “fix” charger commit by walking through walls. Do not revive `engine/summonAI.ts` (`runSummonAI` is unused; it is a Manhattan second brain). Do not copy Motoko `thunder_clap` / `void_collapse` into bomber kits. Do not copy #1026’s no-LoS/no-AP leftover detector. Do not copy #1158 / #1150 / #1104 / #1123.

Open production PRs that already slice honesty (do **not** re-file the ids, do **not** copy the patches into this docs PR):

| Open PR | Catalog id | What it changes |
| :--- | :--- | :--- |
| [#495](https://github.com/Mr-Melic/stralt/pull/495) (draft) | AI-SYS-34 | Apply `targetCell` from `playerPositionRef`. Live apply still uses render `playerPosition` (WX **16436–16438**). |
| [#498](https://github.com/Mr-Melic/stralt/pull/498) (draft) | AI-SYS-45 | Boss kit-spell apply must not commit `targetX/Y` as a walk dest. Live still does (WX **16005–16008**). SYS-118 is the **non-spell** move/attack path, not this teleport. |
| [#842](https://github.com/Mr-Melic/stralt/pull/842) (draft) | AI-SYS-88 / SYS-55 | Hostile minion `summonKit` + `decideSummonAction`. **Do not re-implement.** Hostiles still skip `executeSummonAction`. |
| [#911](https://github.com/Mr-Melic/stralt/pull/911) (draft) | AI-SYS-90 | Pack kits when Motoko catalog misses starter ids. **Do not re-implement.** SYS-119 is the **boss** `starterSpells.find` twin. |
| [#924](https://github.com/Mr-Melic/stralt/pull/924) (draft) | AI-SYS-95 | WX enemy heal execute advertised CHC. |
| [#985](https://github.com/Mr-Melic/stralt/pull/985) (draft) | AI-SYS-107 | Pack-enemy heal decide when **no** wounded ally exists. |
| [#1026](https://github.com/Mr-Melic/stralt/pull/1026) (draft) | AI-SYS-102 | Pack-enemy healer **approach** vs advertised Frost. Sidecar only — **do not copy.** |
| [#1033](https://github.com/Mr-Melic/stralt/pull/1033) (draft) | AI-SYS-103 | Healer approach vs Inferno leftover. |
| [#1034](https://github.com/Mr-Melic/stralt/pull/1034) (draft) | AI-SYS-104 | Healer backline-guard vs Frost leftover. |
| [#1039](https://github.com/Mr-Melic/stralt/pull/1039) (draft) | AI-SYS-105 | Healer backline-guard vs Inferno leftover. |
| [#1072](https://github.com/Mr-Melic/stralt/pull/1072) (draft) | SYS-102…107 / FUT-120…125 | 2026-10-25 design increment. Unique files only. |
| [#1104](https://github.com/Mr-Melic/stralt/pull/1104) (draft) | (boss kit CHC) | Share boss kit **damage** execute with advertised CHC. Complements SYS-115; does **not** add range/LoS/AP/SP. **Do not copy as the whole slice.** |
| [#1123](https://github.com/Mr-Melic/stralt/pull/1123) (draft) | AI-SYS-111 | Summon-hunter LoS-blocked Venom with stalk fallback. **Do not re-implement.** |
| [#1135](https://github.com/Mr-Melic/stralt/pull/1135) (draft) | SYS-108…113 / FUT-126…131 | Yesterday’s design increment. Unique files only. |
| [#1150](https://github.com/Mr-Melic/stralt/pull/1150) (draft) | (bomber Inferno CD) | Share summon-bomber Inferno cooldown with `findKitSpell` available. Complements SYS-114; does not replace the WX wiring. **Do not copy.** |
| [#1158](https://github.com/Mr-Melic/stralt/pull/1158) (draft) | AI-SYS-114 | Share WX summon `availableSpells` with pack CD filter. **Do not re-implement.** This file is the design id; #1158 is the sidecar writer. |

This docs PR does **not** edit [`ENEMY_AI_EVOLUTION.md`](./ENEMY_AI_EVOLUTION.md) (open PR #351 unions that header). Unique files only.

---

## 1. Re-read (2026-10-27) — what moved

All line numbers are from this checkout. Re-read them before implementing.

### 1.1 Combat-parity still is not sophistication

Unchanged from 2026-09-21…10-26: `enemyCastGeometryOk` (`targeting.ts` 166–177), `aiCanCast` (`enemyAI.ts` 320–332), Frozen walk *rate* (`enemyWalkMp.ts` 21–29; WX pack **16345** and summon **15181** / **15227** *do* pass `isFrozenTerrain`), `playerCastPlan.ts` (player only), summon leftover-AP `reevaluate` (`summonExecutor.ts` 249–254). These are **not** SYS-05 / SYS-13 / SYS-01. Do **not** re-file `reevaluate`. SYS-112 is the **applyCast gate**, not the follow-up call.

`aiCanCast` is still unused by healer (1099–1100) and guardian (2131–2133). That remains **AI-SYS-23**. Caster in-range uses it (953); hunter venom uses it (1941) then does **not** sidestep when it fails (**SYS-111** / open #1123). Archer still repositions (2271–2292).

`enemyAI.ts` still has **zero** reads of `currentAp`, `currentMp`, or `apCost`. Pack walk budget is still `ENEMY_REACHABLE_STEP_BUDGET = 3` (`gameConstants.ts` 166; `computeReachable` 377–378). `getEffectiveStat` is declared on `DecideEnemyContext` (275–276) and **never read** by `estimateDamage` / `scoreTargets` / any `decide*`. WX wires it to `getStatModifier` (a **multiplier**, `statusEffects.ts` 45–63), not an absolute stat — even a future reader would be the wrong shape. `allyCount` / `enemyCount` are declared (259–261) and **never read** (SYS-83).

Do **not** feed `spellRangeBase` into AI (`targeting.ts` 111–115 / `enemySpellRange` 133–137). Do **not** treat `enemyCastGeometryOk` as SYS-13 complete. Do **not** re-enable `engine/summonAI.ts` (Manhattan `distance` at **59–61**, 20-tile scan at **68–80**).

`physical_attack` / Strike is **`isPhysical: true`**, damage 10, range 1 (`spellData.ts` **9–25**). Pack kit-cast apply (**16459–16537**) never reads `isPhysical` (SYS-108). Pack melee fallback (**16722–16728**) is RES only (SYS-68). `playerTakesDamage` applies **RES only** (WX **3424–3432**). Pack kit-cast pre-multiplies SP×RES then calls `playerTakesDamage` (SYS-66 double RES). Boss kit-cast passes **raw** `Number(bossSpell.damage)` into `playerTakesDamage` (this file’s SYS-115) — RES lands inside the helper, **SP never does**, and there is **no range/LoS/AP gate**.

`starter-heal` remains self / range 0 (`spellData.ts` **85–101**). `spell-rallying-cry` is the same shape, **`usableByEnemy: false`** (`spellData.ts` **417–435**). `summon-dire-wolf` / `summon-archer` are `usableByEnemy: true`, range **2**, `targetType: "ground"` (`spellData.ts` **547–631**). Inferno is `damage: 0`, `areaRadius: 0`, `cooldown: 3` (`spellData.ts` **502–522**).

### 1.2 Line numbers vs 2026-10-26 (P0 sites did not move)

| Fact | 2026-10-26 | Live (2026-10-27) |
| :--- | :--- | :--- |
| `computeAITier` | `combatMath.ts` 36–52 | **unchanged** |
| `pickEnemyLevelFromTiers` `maxTier = floor(999 / ts)` | `combatMath.ts` 54–58 | **unchanged** (SYS-73) |
| `calcScaledDamage` ignores caster level | `combatMath.ts` 130–137 | **unchanged** (SYS-72) |
| Spawn `aiTier` | WX 5823 | **5823** |
| Kit `levelZone` object | WX 11920 | **11920** — `_enemyUsableSpells` still computed at **11916–11918** and **never read**; assign is `normalizedSpellPool.find` (**11921–11923**) (SYS-90 / SYS-41) |
| Stale comment “10 random spells” | WX 11915 | **11915** |
| Summoner chance unbounded | WX 11932–11943 | **11932–11943** (FUT-23; skip-brain is SYS-89) |
| Player-summon empty occupied | WX 15156 | **15156** (SYS-14) |
| Player-summon `availableSpells` | (not called out) | **15172** raw `summonEnemy.spells ?? []` — **no CD filter** (this file’s SYS-114). Pack filter **16268–16270**. |
| Pack `isSummoner` short-circuit | WX 16375–16384 | **16375–16384** (SYS-86 / SYS-89) |
| Summoner dest + cooldown even if spawn fails | (SYS-86 dest) | **16389–16404** (this file’s SYS-117 records CD unconditionally) |
| Dest-commit clamp | WX 16416–16423 | **16416–16423** (SYS-58) |
| Apply Chebyshev only | WX 16450–16456 | **16450–16456** |
| Damage/drain gate `spellDmg > 0` | WX 16459–16462 | **unchanged** (SYS-96) — **no `isPhysical`** (SYS-108) |
| Fire Bolt `e-firebolt` | WX 16712 | **16712** |
| `decideEnemyAction` | 1662–1707 | **1662–1707** |
| Charger `canReach` Chebyshev ≤ budget+1 | (POS-03 cited the rule) | **1195–1196** (this file’s SYS-116). Test locks Chebyshev 6 wait / Chebyshev 4 advance (`enemyAI.charger.test.ts` **104–121**) and adjacent **`kind: "cast"`** (**124–130**, SYS-108). |
| `decideSummonerAction` midpoint | (not called out as occupancy) | **1890–1905** (this file’s SYS-117) |
| `pickBossKitSpell` `new Map()` | `useBossAI.ts` 169–173 | **169–173** and every sibling (AEE-2026-09-01-008) |
| Boss kit apply lookup | (not called out) | WX **15814–15816** `starterSpells.find` (this file’s SYS-119) |
| Boss kit damage | (CHC sidecar #1104) | WX **15860–15886** raw damage, no range/LoS/AP/SP (this file’s SYS-115). Then SYS-45 teleport **16005–16008**. |
| Boss `attackPlayer` / `moveToward` | (SYS-45 is spell dest) | `useBossAI.ts` **108–119** / **90–106**. WX apply reads `abilityResult` only (**16013–16026**). No `type === "attack"` / `"move"` arm (this file’s SYS-118). |
| Boss `isAdjacent` Manhattan | (not called out) | `useBossAI.ts` **83–87**, **121–126**. Pack melee is Chebyshev (`enemyAI.ts` 1197). Folded into SYS-118 / FUT-136. |
| Bomber `AI_KAMIKAZE_BLAST_RADIUS` | 2387–2393 | **2387–2393** (SYS-106) |
| `ENEMY_AI_TIER_GATES` | unread | still unread (`enemyAI.ts` comment only at **1422–1423**) |
| Hostile `summonAI = pieceType` | `summonSpawn.ts` 275 | **275** (SYS-88 / #842) |

P0 remains **AEE-2026-08-31-002** (Fire Bolt / apply honesty) then **AEE-2026-08-31-001** (`computeAITier`). Then 09-21…10-26 honesty. Then this file’s SYS-114…119. Do not start FUT-132+ first. A boss that always returns the first kit id (008) currently *does* land that id from any tile (SYS-115) and then teleports onto the player (SYS-45). That is on the P0 honesty path, not a T6 extra.

### 1.3 Still true — do not re-file (parent / 09-21…10-26)

- Zone-0 kits forever (`Math.floor(levelZone)` on an object). SYS-09. SYS-90 is the **id resolve** after that floor, not the NaN.
- `_enemyUsableSpells` unused; Rallying Cry `usableByEnemy: false` still assigned via `normalizedSpellPool.find`. SYS-41 / SYS-90.
- `estimateDamage` returns 0 when `spell.damage <= 0`. SYS-02 / SYS-39.
- Heal-first `inferArchetype` (447–452). SYS-04 / SYS-41. SYS-101 is range>1 buff/DoT → caster.
- Pack healer idle ward `allies.find(!isSummon)` (1142). **FUT-83**. Do not re-file.
- Focus setter unread by `scoreTargets`. AEE-2026-09-01-005 / TEM-01.
- `stepToward` / flank / legal-cast dests skip `filterHazardCandidates`. SYS-92.
- `stepToward` Set-order fallback walks away. SYS-97. Diagonal candidate still must be in `reachable` (SYS-15).
- Caster *retreat* uses `opponents[0]`. SYS-93.
- Pack apply DoT nested under `damage > 0`. SYS-96.
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
- Boss kit `new Map()` cooldown. AEE-2026-09-01-008. SYS-115 is the **apply** cheat that fires because 008 always picks an id.
- Boss kit dest-commit onto `targetX/Y`. SYS-45 / #498. SYS-118 is `type: "attack"` / `"move"` **without** that spell arm.
- Summon occupied empty. SYS-14. SYS-114 is the **spell list**, not occupancy.
- Minion AP/MP 0. SYS-21.
- `pickBestDamageSpell` origin-range. SYS-79.
- `wLowHp` `effectiveHp ?? hp`. SYS-84.
- Lookahead/spill skip `aiCanCast`. SYS-85.
- `isSummoner` skip eats the piece kit. SYS-89.

---

## 2. New honesty (why these six)

1. **Player summons ignore cooldown.** Pack `availableSpells` is `assignedSpells.filter(CD <= 0 && usableByEnemy !== false)` (WX **16268–16270**). The summon ctx sets `availableSpells: summonEnemy.spells ?? []` (WX **15172**) and `assignedSpells` to the same array (**15173**). `findKitSpell` therefore always hits “available” first (**1741–1742**) and never needs the assigned fallback. Inferno `cooldown: 3` (`spellData.ts` **518**) is ornamental for a player bomber. Open #1158 is the sidecar. Open #1150 is bomber-only `findKitSpell`. SYS-114.

2. **Boss kit spells snipe without geometry or SP.** Every boss decide returns the first pool id with `new Map()` (AEE-2026-09-01-008). Apply looks the id up in `starterSpells` (WX **15814–15816**), then for `spellType` damage/drain with `damage > 0` calls `playerTakesDamage(Math.max(1, round(bSpellDmg)))` (**15860–15867**) with **no** Chebyshev, **no** `hasBresenhamLoS`, **no** `apCost`, **no** SP. RES still lands inside `playerTakesDamage` (**3427–3432**). Pack Frost at least range-checks (WX **16450–16456**) and pre-applies SP (SYS-66). A 16-tile Frost from a boss is a cheat. Open #1104 adds CHC only. SYS-115.

3. **Charger “can I commit?” is Chebyshev, pathing is 4-dir BFS.** `canReach = dist <= ENEMY_REACHABLE_STEP_BUDGET + 1` (**1195–1196**) uses Chebyshev. `computeReachable` is cardinal BFS with budget 3 (354–393). A target at (origin+3, origin+3) is Chebyshev 3 ≤ 4 so the charger does **not** wait, then `stepToward` cannot take the diagonal (SYS-15) and falls through to Set-order (SYS-97). The charger test locks Chebyshev 6 → wait and Chebyshev 4 cardinal → advance — replace that assertion with `reachable.has`, do not delete the wait. SYS-116.

4. **Summoner dest is a midpoint, not a legal ground tile.** `decideSummonerAction` sets `destination` to `round((player+ally)/2)` or the caster tile (**1894–1905**) with `targetId: null`. Wolf/archer range is **2**. WX short-circuits any summon `kind: "cast"` with a dest (**16389–16404**) and **always** writes `enemySummonCooldownRef` even when `spawnEnemySummonUnit` returns null. No occupancy, no `isCellFree`, no `enemyCastRangeOk`. SYS-86 is the **profile**; this id is the live emitter. SYS-117.

5. **Boss melee and walks are log-only.** `attackPlayer` returns `{ type: "attack", targetId, targetX, targetY, logMessage }` (`useBossAI.ts` **108–119**). `moveToward` returns `{ type: "move", targetX, targetY }` (**90–106**). WX, after the spell arm, reads `bossAIAction.abilityResult` (**16013**) for damage and `res?.newBossPosition` (**16022–16023**) for dest. There is no `type === "attack"` or `type === "move"` branch. `isAdjacent` is Manhattan (**121–126**) while pack melee is Chebyshev — latent while 008 always returns a spell, live when the pool is empty. SYS-118.

6. **Boss kit ids that are not in the static starter array silently vanish.** Apply resolve is `starterSpells.find` (WX **15814–15816**), not the live `normalizedSpellPool` / Motoko catalog used for pack (SYS-90 / #911). Failed lookup falls through to `abilityResult` (**16011–16013**), which a `{ type: "spell", spellId }` action does not have — combined with SYS-118 that is a no-op turn. SYS-119.

---

## 3. System proposals

### AI-SYS-114

**AI_ID:** AI-SYS-114  
**NAME:** Summon `availableSpells` must share the pack cooldown + usability filter  
**ROLE:** system  
**SOPHISTICATION:** all (honesty for RES-05)  
**DECISION_RULES:** WX summon ctx (**15172–15173**) copies `summonEnemy.spells` into both `availableSpells` and `assignedSpells`. Pack ctx filters CD + `usableByEnemy !== false` (**16268–16270**). After this module: summon `availableSpells` is the same filter (CD remaining ≤ 0; `usableByEnemy !== false` for hostile minions; player summons keep `usableByPlayer` ids even when `usableByEnemy` is false — Rallying Cry on a **player** wisp is SYS-99 dest, not a CD issue). `findKitSpell` may then keep “available first” (**1741–1742**) **only if** available is filtered; delete the assigned fallback (AEE-2026-09-21-004) in the same slice or Inferno on CD still resolves. Do not recast Inferno (`cooldown: 3`) on turn 2. Failed / skipped cast must not Fire-Bolt (SYS-05). Open #1158 is the sidecar — **do not copy**. Open #1150 is bomber-only.  
**SCORING_MODEL:** Enumerator only; illegal-on-CD dests drop.  
**SPELL_REQUIREMENTS:** Any kit id with `cooldown > 0` (Inferno).  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always (kit honesty). Not a level table.  
**ENEMY_ARCHETYPES:** hunter, guardian, archer, bomber, wisp (player-side). Hostile minions still SYS-55 for apply.  
**PLAYER_COUNTERPLAY:** Inferno’s advertised 3-turn CD is real; bait the detonate then walk out.  
**EDGE_CASES:** `usableByEnemy: false` Rallying Cry must remain available to **player** wisps (SYS-99). Hostile wisps are not spawned (`summon-wisp` `usableByEnemy: false`). Empty kit stays empty (SYS-90). Occupied-empty remains SYS-14.  
**IMPLEMENTATION_COMPLEXITY:** Low (one filter at the summon ctx; optionally delete assigned fallback).  
**TEST_SCENARIOS:** TS-SUMCD, TS-BOLT3.  
**STATUS:** PROPOSED

### AI-SYS-115

**AI_ID:** AI-SYS-115  
**NAME:** Boss kit-spell apply must use pack geometry + advertised mitigation  
**ROLE:** system  
**SOPHISTICATION:** all (honesty for SYS-05 / SYS-13 / SYS-66; T5 still no cheat)  
**DECISION_RULES:** Today WX **15860–15886** applies `playerTakesDamage(raw spell.damage)` for the first pool id with no Chebyshev, no LoS, no AP, no SP. `playerTakesDamage` still applies RES (**3427–3432**). After this module: a boss kit cast is legal iff SYS-13 / `enemyCastGeometryOk` (range + LoS) **and** `apCost` is payable **and** dest `targetType` matches. Mitigation: non-physical uses the pack SP×RES arm (SYS-66) **or** a single shared helper that applies SP then RES **once** — do not add a third formula, and do not “fix” SYS-66 by deleting SP from Frost. Physical kit ids use SYS-68 / SYS-108. `damage: 0` Inferno still needs SYS-96 to write ticks; until then skip, never bolt, never a map-wide sniper DoT. Open #1104 may add CHC — keep it, do not treat CHC as this slice. Empty `new Map()` remains AEE-2026-09-01-008 (decide). SYS-45 still owns dest-commit onto `targetX/Y` (**16005–16008**) — legality here must not teleport the boss onto the player.  
**SCORING_MODEL:** N/A (apply correctness). Decide still first-id until 008.  
**SPELL_REQUIREMENTS:** Every id in `phase1.spellPoolIds` / `phase2.spellPoolIds`.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always for bosses. Relative sigmoid may attach T5 combo search **after** this gate.  
**ENEMY_ARCHETYPES:** elite / boss.  
**PLAYER_COUNTERPLAY:** Break LoS; stand outside Frost range 4; stack SP against non-physical kit ids.  
**EDGE_CASES:** `player?.x ?? 0` (**175–180** in `useBossAI.ts`) must not become a (0,0) snipe when player is missing. Drain still heals the **boss** after a legal **player** hit (WX **15873–15885**), never an ally. Paper Windstorm is ranged (SYS-70).  
**IMPLEMENTATION_COMPLEXITY:** Medium (boss apply currently a parallel WX arm).  
**TEST_SCENARIOS:** TS-BOSSRANGE, TS-BOSSSP, TS-BOLT3.  
**STATUS:** PROPOSED

### AI-SYS-116

**AI_ID:** AI-SYS-116  
**NAME:** Charger commit uses the reachable set, not Chebyshev ≤ budget+1  
**ROLE:** system / charger  
**SOPHISTICATION:** T1+ (honesty for POS-03 / SYS-03)  
**DECISION_RULES:** `canReach = dist <= ENEMY_REACHABLE_STEP_BUDGET + 1` (**1195–1196**) treats a Chebyshev-4 tile as committable. Cardinal (0,4) is 4 BFS steps; budget 3 cannot land adjacent this turn. Diagonal (3,3) is Chebyshev 3 but 6 cardinal steps — `stepToward` then SYS-97. After this module: wait unless some tile in `reachable` is Chebyshev ≤ 1 from the target **or** a legal-cast tile exists for a profiled ranged id (`findNearestLegalCastTile`). Frozen/Slime `enemyWalkCostPerTile` already doubles BFS cost — membership inherits that. Do not walk through occupied/void. Adjacent Strike remains SYS-108 (`kind` melee vs cast); do not retune the charger test to bless `kind: "cast"` as sophistication.  
**SCORING_MODEL:** Wait if no adjacent-from-reachable dest; else POS-03 approach.  
**SPELL_REQUIREMENTS:** Melee Strike and/or a profiled ranged id.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always for charger/berserker/generic melee. Remnants may keep the Chebyshev wait **only if** it is a subset of reachable (never a superset).  
**ENEMY_ARCHETYPES:** charger, berserker, pawn.  
**PLAYER_COUNTERPLAY:** Stand on a diagonal offset so the 4-dir budget cannot land a tackle this turn.  
**EDGE_CASES:** Chebyshev 4 cardinal: live test expects **advance** (`enemyAI.charger.test.ts` **115–121**) — after this module that is still a 3-step walk toward, not a wait, because a closer tile **is** reachable. Chebyshev 6 wait stays. Dist 1 remains adjacent commit.  
**IMPLEMENTATION_COMPLEXITY:** Low (`reachable` already computed in `decideEnemyAction`).  
**TEST_SCENARIOS:** TS-CHARGEBFS, TS-CHARGEWAIT, TS-BOLT3.  
**STATUS:** PROPOSED

### AI-SYS-117

**AI_ID:** AI-SYS-117  
**NAME:** Summoner placement is a legal ground dest in range, or skip  
**ROLE:** system / summoner  
**SOPHISTICATION:** all (honesty for SYS-86 / SYS-13)  
**DECISION_RULES:** `decideSummonerAction` (**1890–1905**) emits `destination = round((player+ally)/2)` (else caster tile) with `targetId: null`. Wolf/archer `range: 2`, `targetType: "ground"` (`spellData.ts` **547–631**). WX **16389–16404** always calls `spawnEnemySummonRef` and always sets cooldown. After this module: dest must pass `isCellFree` / occupancy (SYS-14 for player summons is a different call site), `enemyCastRangeOk` from the caster, not a portal/void/hazard unless a profile says so, and Chebyshev ≤ spell range. If none, `kind: "skip"` and **do not** write `enemySummonCooldownRef`. Cap + turn cadence stays (**1854–1887**). SYS-89 still owns “skip eats the piece kit” — after a failed placement the pack kit (Frost/Strike) must run, not a bolt. Do not spawn on the player tile. SYS-88 stamp (`summonAI: pieceType`) is unchanged.  
**SCORING_MODEL:** Among legal ground tiles, prefer midpoint-between-ward-and-threat as a **score**, not as an untested dest.  
**SPELL_REQUIREMENTS:** Profiled `isSummon` id (wolf/archer). Sentinel/bomber/wisp stay `usableByEnemy: false`.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always when `isSummoner`. FUT-23 chance table is separate and must not become `if (player.level >= 44)`.  
**ENEMY_ARCHETYPES:** summoner.  
**PLAYER_COUNTERPLAY:** Occupy the only in-range ground tiles; the summoner skips instead of clipping a wall.  
**EDGE_CASES:** No ally → live uses caster tile (**1894–1895**), which may be occupied by the caster — SYS-13 ground dest cannot be the caster unless `targetType` allows it (it does not). Midpoint on a wall. Midpoint Chebyshev 8.  
**IMPLEMENTATION_COMPLEXITY:** Medium (decide + WX short-circuit must agree on failure).  
**TEST_SCENARIOS:** TS-SUMMONCELL, TS-SUMMONCD, TS-BOLT3.  
**STATUS:** PROPOSED

### AI-SYS-118

**AI_ID:** AI-SYS-118  
**NAME:** Boss `type: "attack"` / `type: "move"` must apply melee and dest  
**ROLE:** system  
**SOPHISTICATION:** all (honesty for SYS-05 / SYS-45 / SYS-58)  
**DECISION_RULES:** `attackPlayer` / `moveToward` (`useBossAI.ts` **90–119**) do not set `abilityResult`. WX apply after the spell arm only reads `abilityResult.damageToPlayer` / `newBossPosition` (**16013–16026**, **16226–16229**). Log may still print `logMessage` (**16015–16016**) — “attacks!” with 0 damage. After this module: `type: "attack"` is adjacent **Chebyshev** melee through SYS-68 (RES-only, no kit-less bolt, no SP). `type: "move"` commits `targetX/Y` via `enemyDestToCommit` (SYS-58) onto a walkable non-occupied tile, billing MP if SYS-03 exists, else one cardinal step as `getWalkableMoves` already enumerates (**58–81**). Unify `isAdjacent` / `dist` onto Chebyshev (FUT-136) so a diagonal neighbor is a legal tackle like a pack pawn. Do not treat SYS-45’s spell-dest teleport as this walk. Ability-wrapped moves (Countess lava trail **264–277**) keep `abilityResult` **and** a dest. Empty kit pool is when this path is live; 008 currently hides it.  
**SCORING_MODEL:** N/A (apply correctness).  
**SPELL_REQUIREMENTS:** None (melee / walk). Kit ids still SYS-115.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always for bosses.  
**ENEMY_ARCHETYPES:** elite / boss.  
**PLAYER_COUNTERPLAY:** Diagonal approach is a real tackle; walk away through a hazard the boss still avoids only if POS-04 is on.  
**EDGE_CASES:** `getWalkableMoves` ignores hazards/Frozen/Slime (POS-04 / SYS-31) — do not walk onto lava as a “fix.” `type: "ability"` / `"summon"` keep `abilityResult`. Generation-stale `executeBossDecision` already returns null (**1630–1631**).  
**IMPLEMENTATION_COMPLEXITY:** Medium (WX boss apply).  
**TEST_SCENARIOS:** TS-BOSSMELEE, TS-BOSSWALK, TS-BOLT3.  
**STATUS:** PROPOSED

### AI-SYS-119

**AI_ID:** AI-SYS-119  
**NAME:** Boss kit resolve uses the live catalog, not only `starterSpells`  
**ROLE:** system  
**SOPHISTICATION:** all (honesty for SYS-90 / SYS-02)  
**DECISION_RULES:** WX **15814–15816** is `starterSpells.find(sp => sp.id === bossAIAction.spellId)`. Pack assign uses `normalizedSpellPool.find` (**11921–11923**). Admin / Motoko pool ids that are not in the static starter array fall through to SYS-118’s empty `abilityResult`. After this module: resolve from the same pool pack uses (live catalog + starter fallback like #911). Missing profile or missing apply branch → do not cast, do not bolt, do not teleport (SYS-45). Do not treat Motoko `thunder_clap` / `void_collapse` as auto-legal because they exist on the canister. SYS-115 still gates geometry.  
**SCORING_MODEL:** N/A.  
**SPELL_REQUIREMENTS:** Profiled ids only (SYS-02).  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always for bosses.  
**ENEMY_ARCHETYPES:** elite / boss.  
**PLAYER_COUNTERPLAY:** The kit bar matches what can actually fire.  
**EDGE_CASES:** Pool id present in Motoko, absent in `starterSpells`, no apply profile → skip. Duplicate starter+catalog rows: prefer catalog (SYS-90).  
**IMPLEMENTATION_COMPLEXITY:** Low (one lookup).  
**TEST_SCENARIOS:** TS-BOSSCATALOG, TS-BOLT3.  
**STATUS:** PROPOSED

---

## 4. T6+ modules (this increment)

These attach via the parent §4 sigmoid. They are **not** `if (level >= N)`.

### AI-FUT-132

**AI_ID:** AI-FUT-132  
**NAME:** Cooldown-aware summon kit sequencer  
**ROLE:** resource / summon  
**SOPHISTICATION:** T6 (RES-05 / RES-04; SYS-114 / SYS-106 / FUT-123)  
**DECISION_RULES:** After SYS-114: T2+ summons score `{ready kit ids}` only. T3+ bombers hold when Inferno is on CD instead of walking into a cluster they cannot detonate (SYS-106 still forbids a fake radius-2 blast). T0 may skip the second kit id. Unbounded: a later 4-CD spear reuses the same available filter, not `if (level >= 55) respectCD`. Do not use the assigned fallback to “be smart.”  
**SCORING_MODEL:** On-CD dest −∞. `U(hold)` > `U(approach-cluster)` when the only blast id is cooling.  
**SPELL_REQUIREMENTS:** Profiled kit ids with `cooldown`.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.2` for bomber/archer. Remnant wolves may ignore a 0-CD kit.  
**ENEMY_ARCHETYPES:** bomber, archer, hunter, guardian, wisp.  
**PLAYER_COUNTERPLAY:** Force the detonate, then stand in the cluster for three turns.  
**EDGE_CASES:** #1150 / #1158 sidecars must not skip LoS (SYS-111 / SYS-112).  
**IMPLEMENTATION_COMPLEXITY:** Low after SYS-114.  
**TEST_SCENARIOS:** TS-SUMCD plus a T3 bomber on CD holding vs T0 walking.  
**STATUS:** PROPOSED

### AI-FUT-133

**AI_ID:** AI-FUT-133  
**NAME:** Boss kit as a T5 enumerator, not first-id sniper  
**ROLE:** elite / spell-awareness  
**SOPHISTICATION:** T6 (T5 parent; SYS-115 / SYS-119 / AEE-2026-09-01-008 / SYS-03)  
**DECISION_RULES:** After SYS-115 + 008: T5+ bosses score legal pool ids with the parent enumerator cap (64 dest × 8 spells × 12 targets, abort > 256). T1 may keep first-off-CD **only among legal dests**. T0 may skip the kit and melee (SYS-118). Unbounded: a later phase-3 pool row is another id in the same enum, not `if (level >= 200) phase3`. Never ignore LoS to “feel like a boss.”  
**SCORING_MODEL:** Parent `U` + phase weight. Illegal dest −∞.  
**SPELL_REQUIREMENTS:** Profiled pool ids resolved by SYS-119.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.8` for `isBoss`; remnants with a leftover pool skip.  
**ENEMY_ARCHETYPES:** elite / boss.  
**PLAYER_COUNTERPLAY:** Hug a wall; they spend the turn repositioning (POS-01) instead of a map-wide Frost.  
**EDGE_CASES:** SYS-45 teleport must not be the dest that made the spell legal.  
**IMPLEMENTATION_COMPLEXITY:** Medium after SYS-115 / 008.  
**TEST_SCENARIOS:** Two pool ids, only the second in range → T5 casts the second; T0 may skip. Dist 16 Frost never lands.  
**STATUS:** PROPOSED

### AI-FUT-134

**AI_ID:** AI-FUT-134  
**NAME:** Charger commit / wait as a reusable assassin module  
**ROLE:** assassin / charger / positioning  
**SOPHISTICATION:** T6 (POS-03 / ROL-02; SYS-116 / SYS-03)  
**DECISION_RULES:** After SYS-116: T2+ chargers wait unless a tackle tile is in `reachable` **or** a profiled gap-closer exists. T4+ also wait when the only tackle tile is a hazard (POS-04) unless berserker. T0 may keep “walk anyway” **inside** reachable, never via SYS-97 fallback. Unbounded: a later dash spell is a profiled dest in the same commit check, not `if (level >= 80) leap`.  
**SCORING_MODEL:** `U(wait)` > `U(advance)` when no adjacent-from-reachable tile. Hazard tackle −wLava.  
**SPELL_REQUIREMENTS:** Optional gap-closer profile.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.15` for charger/assassin. Remnant pawns may still walk a reachable cardinal.  
**ENEMY_ARCHETYPES:** charger, assassin, berserker (hazard override).  
**PLAYER_COUNTERPLAY:** Stand diagonal behind a lava tile.  
**EDGE_CASES:** Frozen 2× cost can empty `reachable` at budget 3 (SYS-31) → wait, not a cheat step.  
**IMPLEMENTATION_COMPLEXITY:** Low after SYS-116.  
**TEST_SCENARIOS:** TS-CHARGEBFS at T2 wait vs T0 walk-within-reachable.  
**STATUS:** PROPOSED

### AI-FUT-135

**AI_ID:** AI-FUT-135  
**NAME:** Summoner placement EV — body-block, kite screen, not midpoint  
**ROLE:** summoner / team  
**SOPHISTICATION:** T6 (ROL-06 / TEM-06; SYS-117 / SYS-86 / FUT-23)  
**DECISION_RULES:** After SYS-117: T3+ summoners score legal ground tiles for (a) body-block on the ward→player line (POS-07), (b) kite screen at Chebyshev 2 from the player, (c) not clustering with existing summons (POS-06). T1 may pick the nearest legal tile to the midpoint **among legal dests**. T0 skips if none. Unbounded: a later turret summonAI is a table row (FUT-127), not a new brain. Cap still `ENEMY_SUMMON_CAP`.  
**SCORING_MODEL:** `U(tile) = wBlock * onAxis + wScreen * distToPlayerGap + (−wCluster)`. Illegal −∞.  
**SPELL_REQUIREMENTS:** Profiled wolf/archer (or future profiled sentinel).  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.35` when `isSummoner` and relative peer ≥ 0. Remnant summoners skip.  
**ENEMY_ARCHETYPES:** summoner.  
**PLAYER_COUNTERPLAY:** Stand so every range-2 ground tile is occupied or lava.  
**EDGE_CASES:** SYS-88 `pieceType` stamp must still map to hunter/archer after spawn (#842). Do not emit bomber/wisp until `usableByEnemy` + profile.  
**IMPLEMENTATION_COMPLEXITY:** Medium after SYS-117.  
**TEST_SCENARIOS:** Legal tiles at midpoint-wall vs adjacent-to-player screen → T3 picks the screen.  
**STATUS:** PROPOSED

### AI-FUT-136

**AI_ID:** AI-FUT-136  
**NAME:** One adjacency metric — Chebyshev — for pack and boss  
**ROLE:** system / positioning  
**SOPHISTICATION:** T6 (SYS-118 / POS-01)  
**DECISION_RULES:** After SYS-118: boss `dist` / `isAdjacent` / `getWalkableMoves` scoring use Chebyshev like pack `chebyshevOnBoard`. Diagonal neighbor is a tackle for T1+ bosses the same way it is for a pawn. T0 bosses may keep cardinal-only **walks** (4-dir BFS is already pack policy) but must still **melee** on Chebyshev 1 so they do not cheat *or* get cheated. Unbounded: a later king-move boss (2 Chebyshev) is a profiled `movementRange`, not `if (level >= 120) kingMove`. Do not import `summonAI.ts` Manhattan scan.  
**SCORING_MODEL:** Tackle iff Chebyshev ≤ 1. Walk candidates remain 4-dir.  
**SPELL_REQUIREMENTS:** None.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always once SYS-118 lands.  
**ENEMY_ARCHETYPES:** elite / boss + pack melee.  
**PLAYER_COUNTERPLAY:** Diagonal is no longer a free boss-safe tile.  
**EDGE_CASES:** Countess lava trail dest must be a 4-dir step, not a diagonal teleport.  
**IMPLEMENTATION_COMPLEXITY:** Low after SYS-118.  
**TEST_SCENARIOS:** Boss (4,4), player (5,5), empty pool → melee (SYS-118) not a cardinal walk.  
**STATUS:** PROPOSED

### AI-FUT-137

**AI_ID:** AI-FUT-137  
**NAME:** Boss pool authoring contract — catalog id ⇒ profile ⇒ apply  
**ROLE:** system / spell-awareness  
**SOPHISTICATION:** T6 (SYS-02 / SYS-119 / FUT-133)  
**DECISION_RULES:** After SYS-119: admin/Motoko pool rows that lack a `SpellScoreProfile` or an apply branch are stripped at spawn, same as pack SYS-02. T5 enumerator (FUT-133) never sees them. Unbounded new boss mechanics add a profile, not a `useBossAI.ts` special case per `BossId`. Tagged `BossAbility` walls/jumps stay SYS-16 and are **not** kit spells.  
**SCORING_MODEL:** Missing profile → not in legal set.  
**SPELL_REQUIREMENTS:** One profile per pool id.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always for bosses.  
**ENEMY_ARCHETYPES:** elite / boss.  
**PLAYER_COUNTERPLAY:** The phase kit on the recap is the kit that can fire.  
**EDGE_CASES:** `starterSpells` subset vs catalog superset: catalog wins. Do not substitute `thunder_clap` for Inferno.  
**IMPLEMENTATION_COMPLEXITY:** Low after SYS-119 + SYS-02.  
**TEST_SCENARIOS:** TS-BOSSCATALOG with a Motoko-only id and no profile → skip, not a fallthrough no-op that looks like a freeze.  
**STATUS:** PROPOSED

---

## 5. Spell-awareness contract (reminder)

Unchanged: no profile + apply ⇒ not in kit, not in elite extras, `usableByEnemy` treated as false in the enumerator.

Still `usableByEnemy: true` without a working decide+apply pair (do not give these to pack AI until the named SYS/FUT apply):

`spell-swap`, `spell-mark`, `spell-sacrifice`, `spell-lifesteal-nova`, `spell-enrage`, `spell-haste`, `spell-weaken`, `spell-expose`, `spell-drain-courage` (SYS-113 before any kit row), `spell-cursed-wound`, `spell-shadow-veil`, `spell-frost-nova`, `spell-inferno` (SYS-96 / SYS-103 / SYS-106 / SYS-114 CD), `starter-poison` / `spell-venom-strike` (SYS-96 / SYS-111), `starter-shield` / `spell-iron-skin` (SYS-98 / SYS-112), `starter-drain`.

Keep `usableByEnemy: false` until profiled: barrier, mirror, timestep, rallying-cry, sentinel/bomber/wisp summons.

`summon-dire-wolf` / `summon-archer` are `usableByEnemy: true` with range 2. SYS-86 is the profile. SYS-117 is the live midpoint emitter.

Boss pool ids must pass SYS-119 + SYS-115 before they are sophistication.

Motoko `defaultSpells` (`shadow_strike`, `soul_rend`, `vampire_bite`, `reflect_barrier`, `thunder_clap`, `void_collapse`) stay forbidden as frost substitutes (SYS-90).

---

## 6. Implementation order (this increment)

Do not start FUT-132+ first. Do not start T6+ from earlier increments before P0 honesty.

1. SYS-05 (Fire Bolt WX **16712**, AP/MP debit, ally heal WX **16648**) — still P0. Failed summon CD, failed boss geometry, failed charger wait, failed summoner dest, failed boss melee currently *also* hit leftover paths.  
2. SYS-01 — replace `computeAITier` (`combatMath.ts` 36–52) and the `aiTier >= 5/10` gates (WX **15507** / **15594**).  
3. SYS-73 — drop the 999 spawn ceiling.  
4. SYS-108…113 — yesterday’s increment (#1135). Prefer merge/follow #1123 (SYS-111), #1026 / #1033 / #1034 / #1039, #985.  
5. **SYS-114** + FUT-132 — summon CD filter. Prefer merge/follow **#1158** / **#1150**. Then delete `findKitSpell` assigned fallback.  
6. **SYS-119** then **SYS-115** + FUT-133 / FUT-137 — boss catalog + geometry. Prefer **#1104** for CHC only. Then AEE-2026-09-01-008 (pass the real cooldown map). SYS-45 / #498 for dest-commit.  
7. **SYS-118** + FUT-136 — boss melee/walk apply + Chebyshev adjacency.  
8. **SYS-116** + FUT-134 — charger reachable commit. Replace charger test Chebyshev 4 assertion with reachable membership; keep Chebyshev 6 wait. Do not flip adjacent `kind: "cast"` here (SYS-108).  
9. **SYS-117** + FUT-135 — summoner legal dest. Then SYS-89 so a failed placement still uses the piece kit.  
10. Parent T2–T5 roles / team / adaptive; remaining FUT-01…131.

Each slice: `engine/enemyAI*.test.ts` or a **sidecar** test file (open #1026 pattern), zero WX drive-by, no RAF / map gen / turn order / damage-formula edits unless a **named** follow-up. Scoring **reads** RES/SR/CHC; it does not change `calcScaledDamage`. Do not add `enemy.level` into `calcScaledDamage` as an AI slice.

---

## 7. Extra test scenarios

| ID | Setup | Expect |
| :--- | :--- | :--- |
| TS-SUMCD | Player bomber, Inferno just cast, `cooldown: 3` remaining 3 | `availableSpells` omits Inferno; decide does not emit `spell-inferno`; no `e-firebolt` (SYS-114). |
| TS-BOSSRANGE | Boss at (0,0), player at (15,15), pool `[starter-frost]` | No damage (out of range 4); no teleport onto the player (SYS-115 / SYS-45). |
| TS-BOSSSP | Boss Frost dist 3, player SP 50 / RES 0 | SP reduces incoming; RES still via `playerTakesDamage`; not raw 20 (SYS-115). Do not change pack Frost. |
| TS-CHARGEBFS | Pawn (2,2), player (5,5), open grid, budget 3 | Wait or walk a **reachable** cardinal; do not treat Chebyshev 3 as a tackle this turn (SYS-116). No bolt. |
| TS-CHARGEWAIT | Pawn (2,2), player (2,8) Chebyshev 6 | Still `kind: "skip"` / wait (`enemyAI.charger.test.ts` 104–113). |
| TS-SUMMONCELL | Summoner (8,8), player (0,0), ally (15,15), wolf ready | Midpoint (~8,8) only if legal **and** range 2 — here skip, no CD write (SYS-117). |
| TS-SUMMONCD | Same as TS-SUMMONCELL after a failed spawn | `enemySummonCooldownRef` unset so the next turn may retry or use the piece kit (SYS-117 / SYS-89). |
| TS-BOSSMELEE | Boss (4,4), player (5,5), empty spell pool | Chebyshev-1 melee RES-only damage > 0; log matches HP (SYS-118). No `e-firebolt`. |
| TS-BOSSWALK | Boss (4,4), player (4,8), empty pool, open grid | Position commits at least one cardinal step toward the player (SYS-118). |
| TS-BOSSCATALOG | Pool id `admin-custom-frost` in live catalog, absent from `starterSpells`, profiled | Cast uses catalog row (SYS-119). Same id with **no** profile → skip. |
| TS-BOLT3 | Any failed cast/move in this file, Chebyshev 1 | Crush or skip; never `e-firebolt` (WX 16712). |
| TS-PEER3K | Player 3000, enemy 3000 | Not forced T5; remnant 400 stays low tier (FUT-92). |

Parent and 2026-09-01…10-26 TS-* rows still apply (line numbers in §1.2). Frost examples use live range **4**. Inferno examples use live range **3** and CD **3**. Wolf/archer summon range is **2**. Strike range is **1**.

---

## 8. Mapping (new gaps → ids)

| Request / gap | Primary AI_ID |
| :--- | :--- |
| Player-summon kit ignores cooldown | AI-SYS-114 / AI-FUT-132 |
| Boss kit apply ignores range, LoS, AP, SP | AI-SYS-115 / AI-FUT-133 |
| Charger `canReach` Chebyshev vs 4-dir `reachable` | AI-SYS-116 / AI-FUT-134 |
| Summoner midpoint dest is not a legal ground tile | AI-SYS-117 / AI-FUT-135 |
| Boss `attack` / `move` without `abilityResult` no-ops | AI-SYS-118 / AI-FUT-136 |
| Boss kit lookup is `starterSpells.find` only | AI-SYS-119 / AI-FUT-137 |

T0–T5 requested list (positioning, targeting, resources, roles, team, adaptive) remains parent §19. Nothing in that list is implemented. Higher-level enemies still get harder from **modules on the sigmoid** and from **honest relative spawn** (SYS-73 / FUT-92 / SYS-89), not from `computeAITier(enemyLevel)`, not from a kit-less bolt, not from a boss Frost across the map, and not from a summoner clipping a wall.

Requested capability → already-catalogued parent id (unchanged; still **PROPOSED**), plus this increment’s honesty slices:

| Request | Parent id | This increment |
| :--- | :--- | :--- |
| maintain optimal range / retreat / approach vulnerable / avoid hazards / exploit terrain / avoid AoE clustering / protect allies / escape routes | POS-01…08 | charger commit = SYS-116 / FUT-134; boss Chebyshev tackle = FUT-136; summoner body-block dest = FUT-135 |
| low-HP / high-threat / support / summons / resistance / kill / strategic | TGT-01…07 | boss SP/RES = SYS-115; summoner legal body = SYS-117 |
| AP combinations / move-then-attack / attack-then-retreat / sequencing / cooldown / waste | RES-01…06 | summon CD = SYS-114 / FUT-132; boss AP = SYS-115 |
| tank … protector | ROL-01…10 | charger/assassin wait = FUT-134; summoner = FUT-135; boss elite enum = FUT-133 |
| focus fire / protect support / exploit debuffs / avoid duplicate debuffs / coordinated AoE / formations / retreat toward support | TEM-01…07 | summoner screen/formation dest = FUT-135 |
| estimate threat / punish positioning / adapt HP / adapt AP-MP / summons / status / own HP / survival vs aggression | ADV-01…08 | punish diagonal / wall vs honest boss = SYS-115 / FUT-133; punish charger overcommit = SYS-116 |

Every row above is **STATUS: PROPOSED**. No production AI in this change.
