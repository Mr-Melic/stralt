# Advanced Enemy AI Evolution — 2026-10-29 increment

**Status:** PROPOSED (design only; no production code in this change)  
**Date:** 2026-10-29  
**Parent catalog:** [`ENEMY_AI_EVOLUTION.md`](./ENEMY_AI_EVOLUTION.md) (T0–T5)  
**Prior increments:** [`ENEMY_AI_EVOLUTION_2026-09-01.md`](./ENEMY_AI_EVOLUTION_2026-09-01.md) · [`ENEMY_AI_EVOLUTION_2026-09-02.md`](./ENEMY_AI_EVOLUTION_2026-09-02.md) · [`ENEMY_AI_EVOLUTION_2026-09-21.md`](./ENEMY_AI_EVOLUTION_2026-09-21.md) (open PR #351; SYS-22…32, FUT-36…47 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-22.md`](./ENEMY_AI_EVOLUTION_2026-09-22.md) (open PR #416; SYS-33…35, FUT-48…53) · [`ENEMY_AI_EVOLUTION_2026-09-23.md`](./ENEMY_AI_EVOLUTION_2026-09-23.md) (open PR #458; SYS-36…41, FUT-54…59) · [`ENEMY_AI_EVOLUTION_2026-09-24.md`](./ENEMY_AI_EVOLUTION_2026-09-24.md) (open PR #506; SYS-42…47, FUT-60…65) · [`ENEMY_AI_EVOLUTION_2026-09-25.md`](./ENEMY_AI_EVOLUTION_2026-09-25.md) (open PR #565; SYS-48…53, FUT-66…71) · [`ENEMY_AI_EVOLUTION_2026-09-26.md`](./ENEMY_AI_EVOLUTION_2026-09-26.md) (open PR #633; SYS-54…59, FUT-72…77) · [`ENEMY_AI_EVOLUTION_2026-09-27.md`](./ENEMY_AI_EVOLUTION_2026-09-27.md) (open PR #689; SYS-60…65, FUT-78…83) · [`ENEMY_AI_EVOLUTION_2026-09-28.md`](./ENEMY_AI_EVOLUTION_2026-09-28.md) (open PR #723; SYS-66…71, FUT-84…89) · [`ENEMY_AI_EVOLUTION_2026-09-29.md`](./ENEMY_AI_EVOLUTION_2026-09-29.md) (open PR #804; SYS-72…77, FUT-90…95) · [`ENEMY_AI_EVOLUTION_2026-10-21.md`](./ENEMY_AI_EVOLUTION_2026-10-21.md) (open PR #821; SYS-78…83, FUT-96…101) · [`ENEMY_AI_EVOLUTION_2026-10-22.md`](./ENEMY_AI_EVOLUTION_2026-10-22.md) (open PR #874; SYS-84…89, FUT-102…107) · [`ENEMY_AI_EVOLUTION_2026-10-23.md`](./ENEMY_AI_EVOLUTION_2026-10-23.md) (open PR #958; SYS-90…95, FUT-108…113) · [`ENEMY_AI_EVOLUTION_2026-10-24.md`](./ENEMY_AI_EVOLUTION_2026-10-24.md) (open PR #999; SYS-96…101, FUT-114…119) · [`ENEMY_AI_EVOLUTION_2026-10-25.md`](./ENEMY_AI_EVOLUTION_2026-10-25.md) (open PR #1072; SYS-102…107, FUT-120…125) · [`ENEMY_AI_EVOLUTION_2026-10-26.md`](./ENEMY_AI_EVOLUTION_2026-10-26.md) (open PR #1135; SYS-108…113, FUT-126…131) · [`ENEMY_AI_EVOLUTION_2026-10-27.md`](./ENEMY_AI_EVOLUTION_2026-10-27.md) (open PR #1192; SYS-114…119, FUT-132…137) · [`ENEMY_AI_EVOLUTION_2026-10-28.md`](./ENEMY_AI_EVOLUTION_2026-10-28.md) (open PR #1240; SYS-120…125, FUT-138…143 — **do not re-number**)  
**Implementer ledger:** [`automation/ACTION_IDS_AEE_2026-10-29.md`](./automation/ACTION_IDS_AEE_2026-10-29.md)

This increment re-reads the live engine one day after the 2026-10-28 catalog (#1240). SYS-01…125 and FUT-01…143 stay **PROPOSED** on their own files; they are **not** re-filed here. New work is: public **ember_knight / tide_shade** family hooks fire only on the pack melee **fallback** (so kit Strike as `kind: "cast"` never burns or shreds MP); boss kit apply **skips Paper Windstorm and player Mirror**; boss kit **`isSummon` short-circuit** has no range / LoS / AP and dest-commits onto the player tile; pack kit-cast **and** melee vs player-side summons **pre-multiply RES then `enemyTakesDamage` applies RES again**; `getEffectiveStat` on the decide ctx is **`getStatModifier` (a multiplier / AP-MP additive delta), not an absolute**; boss Blood Mend **heal arm drops advertised `buffStat` CHC**.

Stralt has **no character level cap**. Nothing here maps `if (level >= X) sophistication = Y`. Tiers remain conceptual. Eligibility remains the parent §4 sigmoid (`peer = log2(enemy.level / player.level)` plus pack/boss/modifier terms). A year-later peer fight at any absolute level can attach a new module without raising a cap. An ember knight that only ignites when the Fire Bolt fallback wins the coin flip, a boss wolf that lands on the player’s tile, and a double-RES hit on a wisp are **honesty**, not a last band.

**Hard rules (unchanged):** no cheat, no hidden player information, no ignored LoS/range/AP/MP, no unbounded search, no kit-less Fire Bolt, no `instantKill`, no betrayal-as-difficulty, no name-based spell heuristics, no production AI in this change. Do not “fix” ember by deleting pack Strike to force the fallback. Do not “fix” double RES by deleting summon RES. Do not “fix” Windstorm by making bosses immune. Do not spawn on the player to “guarantee” a wolf. Do not treat `getStatModifier` 0.8 as RES 80. Do not revive `engine/summonAI.ts` (`runSummonAI` is unused; it is a Manhattan second brain). Do not copy Motoko `thunder_clap` / `void_collapse` into bomber kits. Do not copy #1026’s no-LoS/no-AP leftover detector. Do not copy #1240 / #1192 / #1158 / #1150 / #1104 / #1123 / #924.

Open production PRs that already slice honesty (do **not** re-file the ids, do **not** copy the patches into this docs PR):

| Open PR | Catalog id | What it changes |
| :--- | :--- | :--- |
| [#495](https://github.com/Mr-Melic/stralt/pull/495) (draft) | AI-SYS-34 | Apply `targetCell` from `playerPositionRef`. Live apply still uses render `playerPosition` (WX **16436–16438**). |
| [#498](https://github.com/Mr-Melic/stralt/pull/498) (draft) | AI-SYS-45 | Boss kit-spell apply must not commit `targetX/Y` as a walk dest. Live still does (WX **16005–16008**). SYS-128’s summon arm currently *also* dest-commits onto the player. |
| [#842](https://github.com/Mr-Melic/stralt/pull/842) (draft) | AI-SYS-88 / SYS-55 | Hostile minion `summonKit` + `decideSummonAction`. **Do not re-implement.** |
| [#911](https://github.com/Mr-Melic/stralt/pull/911) (draft) | AI-SYS-90 | Pack kits when Motoko catalog misses starter ids. **Do not re-implement.** |
| [#924](https://github.com/Mr-Melic/stralt/pull/924) (draft) | AI-SYS-95 | WX **pack** enemy heal execute advertised CHC. SYS-131 is the **boss** heal arm. **Do not copy as the whole slice.** |
| [#985](https://github.com/Mr-Melic/stralt/pull/985) (draft) | AI-SYS-107 | Pack-enemy heal decide when **no** wounded ally exists. |
| [#1026](https://github.com/Mr-Melic/stralt/pull/1026) (draft) | AI-SYS-102 | Pack-enemy healer **approach** vs advertised Frost. Sidecar only — **do not copy.** |
| [#1033](https://github.com/Mr-Melic/stralt/pull/1033) (draft) | AI-SYS-103 | Healer approach vs Inferno leftover. |
| [#1034](https://github.com/Mr-Melic/stralt/pull/1034) (draft) | AI-SYS-104 | Healer backline-guard vs Frost leftover. |
| [#1039](https://github.com/Mr-Melic/stralt/pull/1039) (draft) | AI-SYS-105 | Healer backline-guard vs Inferno leftover. |
| [#1104](https://github.com/Mr-Melic/stralt/pull/1104) (draft) | (boss kit CHC) | Share boss kit **damage** execute with advertised CHC. Complements SYS-115; does **not** add Windstorm/Mirror (SYS-127), summon legality (SYS-128), or heal `buffStat` (SYS-131). **Do not copy as the whole slice.** |
| [#1123](https://github.com/Mr-Melic/stralt/pull/1123) (draft) | AI-SYS-111 | Summon-hunter LoS-blocked Venom with stalk fallback. **Do not re-implement.** |
| [#1135](https://github.com/Mr-Melic/stralt/pull/1135) (draft) | SYS-108…113 / FUT-126…131 | 2026-10-26 design increment. Unique files only. SYS-108 is kit Strike as `kind: "cast"` (formula). SYS-126 is the **family hooks that arm never reaches**. |
| [#1150](https://github.com/Mr-Melic/stralt/pull/1150) (draft) | (bomber Inferno CD) | Share summon-bomber Inferno cooldown with `findKitSpell` available. Complements SYS-114. **Do not copy.** |
| [#1158](https://github.com/Mr-Melic/stralt/pull/1158) (draft) | AI-SYS-114 | Share WX summon `availableSpells` with pack CD filter. **Do not re-implement.** |
| [#1192](https://github.com/Mr-Melic/stralt/pull/1192) | SYS-114…119 / FUT-132…137 | 2026-10-27 design increment. Unique files only. SYS-115 is the **damage/drain** arm only. |
| [#1240](https://github.com/Mr-Melic/stralt/pull/1240) | SYS-120…125 / FUT-138…143 | Yesterday’s design increment. Unique files only. SYS-120 is heal/debuff/DoT/buff **geometry**. SYS-131 is heal **`buffStat`**. SYS-121 is ability HP. |

This docs PR does **not** edit [`ENEMY_AI_EVOLUTION.md`](./ENEMY_AI_EVOLUTION.md) (open PR #351 unions that header). Unique files only.

---

## 1. Re-read (2026-10-29) — what moved

All line numbers are from this checkout. Re-read them before implementing.

### 1.1 Combat-parity still is not sophistication

Unchanged from 2026-09-21…10-28: `enemyCastGeometryOk` (`targeting.ts` 166–177), `aiCanCast` (`enemyAI.ts` 320–332), Frozen walk *rate* (`enemyWalkMp.ts` 21–29; WX pack **16345** and summon **15181** *do* pass `isFrozenTerrain`), `playerCastPlan.ts` (player only), summon leftover-AP `reevaluate` (`summonExecutor.ts` 249–254). These are **not** SYS-05 / SYS-13 / SYS-01. Do **not** re-file `reevaluate`. SYS-112 is the **applyCast gate**, not the follow-up call. SYS-123 is the **pack fused `closes-in`**, which has no leftover sequence at all.

`aiCanCast` is still unused by healer (1099–1100) and guardian (2131–2133). That remains **AI-SYS-23**. Caster in-range uses it (953); hunter venom uses it (1941) then does **not** sidestep when it fails (**SYS-111** / open #1123). Archer still repositions (2271–2292) then kites with `stepAway(..., 1)` (2328) — **SYS-122**. Bomber detonate still uses `dist <= enemySpellRange` with **no** `aiCanCast` (2410–2411); that stays under SYS-23 / SYS-106, do **not** re-file.

`enemyAI.ts` still has **zero** reads of `currentAp`, `currentMp`, or `apCost`. Pack walk budget is still `ENEMY_REACHABLE_STEP_BUDGET = 3` (`gameConstants.ts` 166; `computeReachable` 377–378). `getEffectiveStat` is declared on `DecideEnemyContext` (275–276), wired at WX **16347–16348** to `getStatModifier` (`statusEffects.ts` **45–63** — AP/MP additive delta, every other stat a **multiplier** with no-match `1`), and **never read** by `estimateDamage` / `scoreTargets` / any `decide*`. This file’s SYS-130 is that **wrong shape**, not the unread-ness alone (SYS-10 / SYS-83 still own missing snapshot fields / unread `allyCount`). `allyCount` / `enemyCount` are declared (259–261) and **never read** (SYS-83).

Do **not** feed `spellRangeBase` into AI (`targeting.ts` 111–115 / `enemySpellRange` 133–137). Do **not** treat `enemyCastGeometryOk` as SYS-13 complete. Do **not** re-enable `engine/summonAI.ts` (Manhattan `distance` at **59–61**, 20-tile scan at **68–80**).

`physical_attack` / Strike is **`isPhysical: true`**, damage 10, range 1 (`spellData.ts` **9–25**). Pack kit-cast apply (**16459–16537**) never reads `isPhysical` (SYS-108). Pack melee fallback (**16722–16728**) is RES-only (SYS-68). `playerTakesDamage` applies **RES only** (WX **3427–3432**). Pack kit-cast pre-multiplies SP×RES then calls `playerTakesDamage` (SYS-66 double RES **on the player**). This file’s SYS-129 is the **same pre-multiply against a player-side summon**, then `enemyTakesDamage` (**3489–3498**) applies RES **again**. Boss kit-cast **damage/drain** still passes raw `Number(bossSpell.damage)` (SYS-115) and still skips Windstorm/Mirror (SYS-127). Boss kit **DoT/heal/debuff/buff** never enter the damage arm (SYS-120). Boss `abilityResult.damageToPlayer` writes HP with `setCharacterStats` (SYS-121).

`starter-heal` remains self / range 0 (`spellData.ts` **85–101**) and advertises `buffStat: "chc"` (**96–98**). Pack heal execute is SYS-95 / #924. Boss heal execute is this file’s SYS-131. `spell-rallying-cry` is the same shape, **`usableByEnemy: false`** (`spellData.ts` **417–435**). `summon-dire-wolf` / `summon-archer` are `usableByEnemy: true`, range **2**, `targetType: "ground"` (`spellData.ts` **547–631**). Inferno is `damage: 0`, `areaRadius: 0`, `cooldown: 3`, `dotDamagePerTurn: 8` (`spellData.ts` **502–522**). Frost Bolt is damage 20, range **4** (`spellData.ts` **124–140**).

### 1.2 Line numbers vs 2026-10-28 (P0 sites did not move)

| Fact | 2026-10-28 | Live (2026-10-29) |
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
| Dest-commit clamp | WX 16416–16423 | **16416–16423** (SYS-58 / SYS-123) |
| Apply Chebyshev only | WX 16450–16456 | **16450–16456** |
| Damage/drain gate `spellDmg > 0` | WX 16459–16462 | **unchanged** (SYS-96) — **no `isPhysical`** (SYS-108) |
| Paper Windstorm + Mirror (pack kit-cast) | 16491–16530 | **16491–16530**. Boss kit has **neither** (this file’s SYS-127). |
| Fire Bolt `e-firebolt` | WX 16712 | **16712** |
| `ember_knight` / `tide_shade` family hooks | (not called out; live only on melee fallback) | WX **16789–16820**, inside the pack melee→**player** else. Kit Strike as cast never reaches them (this file’s SYS-126). |
| `aiTier >= 5` / `>= 10` | WX 15508 / 15595 | **15508** / **15595** |
| `decideEnemyAction` | 1662–1707 | **1662–1707** |
| `scoreTargets(..., null)` | caster 947 / charger 1177 / … | **unchanged** (SYS-125) |
| Archer kite `stepAway(..., 1)` | 2328 | **2328** (SYS-122) |
| Charger `canReach` Chebyshev ≤ budget+1 | 1195–1196 | **1195–1196** (SYS-116) |
| `decideSummonerAction` midpoint | 1890–1905 | **1890–1905** (SYS-117) |
| `pickBossKitSpell` `new Map()` | `useBossAI.ts` 169–173 | **169–173** and every sibling (AEE-2026-09-01-008) |
| Boss kit apply lookup | WX 15814–15816 | **15814–15816** `starterSpells.find` (SYS-119) |
| Boss kit **damage** | WX 15860–15886 | **15860–15886** raw damage (SYS-115). No Windstorm, no Mirror (SYS-127). Then SYS-45 teleport **16005–16008**. |
| Boss kit **`isSummon`** | (folded into SYS-120’s “other arms”) | WX **15828–15857** — **no** range/LoS/AP, CD always written, dest = `targetX/Y` (player) (this file’s SYS-128). |
| Boss kit **heal / debuff / DoT / buff** | Heal 15889–15905, … | **unchanged** geometry (SYS-120). Heal still **HP only** — `buffStat` is on the **non-heal** arm at **15949** (this file’s SYS-131). |
| Boss `attackPlayer` / `moveToward` | `useBossAI.ts` 90–119 | **90–119** (SYS-118) |
| Boss `abilityResult.damageToPlayer` | WX 16025–16039 | **16025–16039** (SYS-121) |
| Final Pawn kit-less projectile | `useBossAI.ts` 992–1001 | **992–1001** (SYS-16). Currently a SYS-118 no-op. Do not re-file. |
| `applyBattleWalkHazards` | WX 9906–9932 | **9906–9932** player-only (SYS-124) |
| `getEffectiveStat` wiring | (noted unread / wrong shape, no id) | WX **16347–16348** → `getStatModifier` (this file’s SYS-130) |
| Pack kit-cast vs summon RES | (SYS-66 is pack→**player**) | WX **16475–16537** then `enemyTakesDamage` **3489–3498** (this file’s SYS-129) |
| Bomber `AI_KAMIKAZE_BLAST_RADIUS` | 2387–2393 | **2387–2393** (SYS-106) |
| `ENEMY_AI_TIER_GATES` | unread | still unread (`enemyAI.ts` comment only at **1422–1423**) |
| Hostile `summonAI = pieceType` | `summonSpawn.ts` 275 | **275** (SYS-88 / #842) |
| FUT-83 pack healer ward | 1142 | **1142** `allies.find(!isSummon)` — still unimplemented. Do not re-file. |

P0 remains **AEE-2026-08-31-002** (Fire Bolt / apply honesty) then **AEE-2026-08-31-001** (`computeAITier`). Then 09-21…10-28 honesty. Then this file’s SYS-126…131. Do not start FUT-144+ first. An ember knight that only burns after a Crush/Fire Bolt coin flip (SYS-126) currently *also* Fire Bolts on failed kit-cast (P0). That is on the P0 honesty path, not a T6 extra.

### 1.3 Still true — do not re-file (parent / 09-21…10-28)

- Zone-0 kits forever (`Math.floor(levelZone)` on an object). SYS-09. SYS-90 is the **id resolve** after that floor, not the NaN.
- `_enemyUsableSpells` unused; Rallying Cry `usableByEnemy: false` still assigned via `normalizedSpellPool.find`. SYS-41 / SYS-90.
- `estimateDamage` returns 0 when `spell.damage <= 0`. SYS-02 / SYS-39. SYS-125 is the **null-spell crush** path, not this.
- Heal-first `inferArchetype` (447–452). SYS-04 / SYS-41. SYS-101 is range>1 buff/DoT → caster.
- Pack healer idle ward `allies.find(!isSummon)` (1142). **FUT-83**. Do not re-file.
- Focus setter unread by `scoreTargets`. AEE-2026-09-01-005 / TEM-01. Wisp-harass list promotion (1678–1690) is also unread after `scoreTargets` re-sorts — still TEM-01, not a new id.
- `stepToward` / flank / legal-cast dests skip `filterHazardCandidates`. SYS-92. SYS-122 is kite **`stepAway` with hpFrac 1**.
- `stepToward` Set-order fallback walks away. SYS-97.
- Caster *retreat* uses `opponents[0]`. SYS-93.
- Pack apply DoT nested under `damage > 0`. SYS-96. Boss DoT is a **separate** un-gated arm (SYS-120).
- Wisp Rallying Cry is self range 0 aimed at a ward. SYS-99.
- `allies` exclude self. SYS-107 (pack) / SYS-110 (wisp).
- Kit Strike as `kind: "cast"` → SP×RES. SYS-108. Charger adjacent test still expects `kind: "cast"` (`enemyAI.charger.test.ts` **124–130**). SYS-126 is the **family hooks that path never reaches**.
- `scoreAlly` raw table vs `threatValue()`. SYS-109.
- Hunter venom no `repositionForLOS`. SYS-111 / #1123.
- Summon `applyCast` no geometry. SYS-112.
- `decideHealer` `healAmount > 0` drain-as-heal. SYS-113.
- Bomber private radius-2 + `hp = 0` inside `damage > 0`. SYS-106.
- Hostile summons skip executor. SYS-55. #842 routes decide only.
- `findKitSpell` assigned fallback (1737–1745). AEE-2026-09-21-004.
- Boss kit `new Map()` cooldown. AEE-2026-09-01-008.
- Boss kit dest-commit onto `targetX/Y`. SYS-45 / #498. SYS-128 is the **summon** arm that uses that dest as a **spawn tile**.
- Summon occupied empty. SYS-14. SYS-114 is the **spell list**, not occupancy.
- Minion AP/MP 0. SYS-21.
- `pickBestDamageSpell` origin-range. SYS-79.
- `wLowHp` `effectiveHp ?? hp`. SYS-84.
- Lookahead/spill skip `aiCanCast`. SYS-85.
- `isSummoner` skip eats the piece kit. SYS-89.
- Player-summon raw kit. SYS-114 / #1158.
- Boss kit damage sniper. SYS-115 / #1104 CHC only. SYS-127 is Windstorm/Mirror on that same arm.
- Charger Chebyshev `canReach`. SYS-116.
- Summoner midpoint dest. SYS-117. SYS-128 is **boss kit** summon, not pack `decideSummonerAction`.
- Boss `type: "attack"` / `"move"` no-op. SYS-118.
- Boss `starterSpells.find`. SYS-119.
- Boss kit heal/debuff/DoT/buff un-gated. SYS-120. SYS-131 is heal **`buffStat`**, not geometry.
- Boss ability HP `setCharacterStats`. SYS-121.
- Archer kite `hpFrac = 1`. SYS-122.
- Pack fused `closes-in`. SYS-123.
- Pack/boss walks skip thorned_ground / void_rift. SYS-124.
- `scoreTargets(..., null)` crush killableNow. SYS-125.
- Strip / `resolveEnemyApMp` AP=`level` (WX **17402–17411**). AEE-2026-09-26-001.
- Ally `targetId` fallback Crush/Fire Bolt (WX **16704–16715**). AEE-2026-09-24-001.
- Pack→player double RES (SP×RES then `playerTakesDamage`). SYS-66. SYS-129 is pack→**summon**.

---

## 2. New honesty (why these six)

1. **Family hooks only on the Fire Bolt/Crush fallback.** `ember_knight` writes a 3/turn burn and `tide_shade` writes MP −1 only inside the pack melee→**player** else (WX **16789–16820**). Kit Strike is `kind: "cast"` when `pickBestDamageSpell` returns `physical_attack` (charger adjacent **1197–1213**; test **124–130** still expects `kind: "cast"`). That arm is WX **16459–16537** and has **zero** family reads. Melee vs a player-side summon takes the other branch (**16734–16747**) and also skips the hooks. SYS-108 is the **formula** (SP×RES vs RES-only). FUT-08 is **scoring** vs void_mirror. This id is the **apply contract** of a public family. SYS-126.

2. **Boss kit skips public miss and Mirror.** Pack kit-cast rolls Paper Windstorm at **16491–16496** and `consumePlayerMirror` at **16497–16530**. Boss kit damage (**15860–15867**) is `playerTakesDamage(raw Number(bossSpell.damage))` with neither check. SYS-115 is raw HP / no SP / no geometry. SYS-70 is pack Windstorm. FUT-21 is **scoring** public miss. Open #1104 is CHC on the damage arm only. SYS-127.

3. **Boss kit `isSummon` is an ungated third arm.** After lookup, WX **15828–15857** short-circuits `bossSpell.isSummon` through `spawnEnemySummonRef` at `bossSpellDest` (`targetX/Y`, which `pickBossKitSpell` callers set to **the player cell**, `useBossAI.ts` **175–180**). No Chebyshev, no Manhattan ground (player live gate), no LoS, no `apCost`. CD is written even if spawn fails. Wolf/archer ids are `usableByEnemy: true`, range **2**, `targetType: "ground"` (`spellData.ts` **547–631**). SYS-117 is pack `decideSummonerAction` midpoint. SYS-45 is dest-commit after a **spell**. This id is **spawn-on-player**. SYS-128.

4. **Pack→summon double RES.** Pack kit-cast vs a player-side summon sets `plSpEff = 0` and `plResEff = resolvedTarget.res` (**16475–16490**), builds `dmg = dmgAC * (1 - res/100)` (**16532–16537**), then `enemyTakesDamage` (**16551–16553**) applies RES **again** (`statusEffects` product × `enemy.res`, **3489–3498**). Pack melee vs summon does the same: **16722–16742** then `enemyTakesDamage`. SYS-66 is pack→**player** (pre-multiply then `playerTakesDamage` **3427–3432**). This id is pack→**summon**. SYS-129.

5. **`getEffectiveStat` is not a stat.** WX **16347–16348** wires `getEffectiveStat: (cid, stat) => getStatModifier(...)`. `getStatModifier` (`statusEffects.ts` **45–63**) returns `1` with no matching effect for RES/SR/CHC, a **product** of buff modifiers (Iron Skin `1.3` → `1.3`, not `res+30`), and an **additive delta** for AP/MP (no-match `0`). `estimateDamage` never reads it today. TGT-05 / ADV-04 / SYS-10 must not treat that callback as HUD RES 40. SYS-130.

6. **Boss Blood Mend drops advertised CHC.** `starter-heal` is `spellType: "heal"` plus `buffStat: "chc"` (`spellData.ts` **93–98**). Boss heal arm (**15889–15905**) writes HP only. The buff arm (**15949–15972**) requires `bossSpellType !== "heal"`, so Blood Mend never reaches it. Pack heal CHC is SYS-95 / #924. SYS-120 is heal **geometry**. This id is heal **`buffStat`**. SYS-131.

---

## 3. System proposals

### AI-SYS-126

**AI_ID:** AI-SYS-126  
**NAME:** Public family hooks must fire on the legal hit path, not only the melee fallback  
**ROLE:** system  
**SOPHISTICATION:** all (honesty for FUT-08 / SYS-05 / SYS-108)  
**DECISION_RULES:** Today WX **16789–16820** applies `ember_knight` burn (3 dmg/turn × 3) and `tide_shade` MP −1 only after the Crush/Fire Bolt fallback hits the **player**. Kit Strike as `kind: "cast"` (charger **1197–1213**, SYS-108) goes through **16459–16537** and never reads `enemy.family`. Melee vs a player-side summon (**16734–16747**) also skips the hooks. After this module: the **same** public family table FUT-08 scores (`ENEMY_ELITE_EVOLUTION` / spawnPolicy families that actually apply) runs once on every legal pack hit that would have reached the player or a player-side summon — kit-cast, honest melee, not Fire Bolt. Do not add a second hidden burn on the spell arm **and** keep the fallback one. Void-mirror 25% bounce stays player→enemy (`castHelpers.ts` **336–346**); do not invent a pack→player void_mirror. SYS-108 still owns Strike `isPhysical` / SP. Do not delete kit Strike to “restore” the fallback burn.  
**SCORING_MODEL:** FUT-08 / FUT-144 may weight physical vs reflect; this slice is apply.  
**SPELL_REQUIREMENTS:** None (family metadata on the combatant). Kit Strike remains `physical_attack`.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always when the acting enemy’s public `family` is ember_knight or tide_shade. Not `if (level >= X)`.  
**ENEMY_ARCHETYPES:** charger, generic, knight/pawn kits; any pack actor with those families.  
**PLAYER_COUNTERPLAY:** Don’t stand adjacent to an ember knight — the burn must land on the Strike that actually hit, not only on a random Fire Bolt.  
**EDGE_CASES:** Fire Bolt fallback must still be deleted (P0) rather than used as the only burn path. Boss kit / ability HP stay SYS-115 / SYS-121 — do not copy ember onto a tagged BossAbility. `family === "ember_knight"` is a string equality on the combatant, not `name.includes`.  
**IMPLEMENTATION_COMPLEXITY:** Low (shared apply helper; one call from kit-cast and honest melee).  
**TEST_SCENARIOS:** TS-EMBERCAST, TS-TIDECAST, TS-BOLT3.  
**STATUS:** PROPOSED

### AI-SYS-127

**AI_ID:** AI-SYS-127  
**NAME:** Boss kit damage must honor Paper Windstorm and player Mirror  
**ROLE:** system  
**SOPHISTICATION:** all (honesty for SYS-05 / SYS-70 / SYS-115)  
**DECISION_RULES:** Pack kit-cast gates ranged hits behind `isPaperWindstorm && spellRange > 1 && Math.random() < 0.5` (WX **16491–16496**) and `consumePlayerMirror` (**16497–16530**). Boss kit damage (**15860–15867**) calls `playerTakesDamage(raw)` with neither. After this module: the **same** public miss and Mirror consume the pack uses on kit-cast run on boss kit **damage/drain** before HP is written. Geometry/AP remain SYS-115 / SYS-120. CHC remains #1104. Ability HP remains SYS-121 (do not silently miss tagged ability damage). Windstorm off → 1.0. Mirror already consumed this turn → no second bounce. Never bolt. Never skip LoS to “make up” a missed Inferno.  
**SCORING_MODEL:** FUT-21 / FUT-145 may multiply EV by public miss; this slice is apply.  
**SPELL_REQUIREMENTS:** Ranged boss kit ids (`range > 1`). Adjacent Strike if a boss kit ever emits it is not Windstorm.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always when the map modifier / Mirror unit is public. Not a level band.  
**ENEMY_ARCHETYPES:** elite / boss.  
**PLAYER_COUNTERPLAY:** Fight in Paper Windstorm; keep Mirror up — a Pale Archbishop frost must be able to miss or bounce.  
**EDGE_CASES:** `player?.x ?? 0` must not become a (0,0) snipe that also ignores Windstorm. Self-heal is SYS-120 / SYS-131, not this miss roll. Do not apply Windstorm to melee Crush.  
**IMPLEMENTATION_COMPLEXITY:** Low (copy the two pack gates onto the boss damage arm; share a helper).  
**TEST_SCENARIOS:** TS-BOSSWIND, TS-BOSSMIRROR, TS-BOLT3.  
**STATUS:** PROPOSED

### AI-SYS-128

**AI_ID:** AI-SYS-128  
**NAME:** Boss kit `isSummon` must be a legal ground spawn, not a player-tile teleport  
**ROLE:** system / summoner  
**SOPHISTICATION:** T2+ (honesty for SYS-05 / SYS-13 / ROL-06 / SYS-117)  
**DECISION_RULES:** Today WX **15828–15857** spawns at `bossSpellDest` (`targetX/Y` = player cell from `useBossAI.ts` **175–180**) with **no** range, **no** LoS, **no** `apCost`, and writes CD even if `spawnEnemySummonRef` no-ops. Wolf/archer are `targetType: "ground"`, range **2** (`spellData.ts` **547–631**). Player live ground is Manhattan (`targeting.ts` `groundTileInRange`). After this module: a boss kit summon is illegal unless SYS-13 ground legality from the **boss tile**, `apCost` payable, dest `isCellFree` (not the player, not occupied, not void). Failed legality → next pool id or named ability, **never** Fire Bolt, **never** spawn-on-player. SYS-45 dest-commit onto `targetX/Y` after a non-summon spell stays a separate teleport; this arm must not walk the boss onto the player either. Pack `decideSummonerAction` midpoint remains SYS-117. Empty `new Map()` remains AEE-2026-09-01-008.  
**SCORING_MODEL:** ROL-06 / FUT-04 / FUT-146 placement EV only on legal dests.  
**SPELL_REQUIREMENTS:** `isSummon` + `usableByEnemy` (wolf/archer today). Sentinel/bomber/wisp stay false until profiled.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `isBoss` pack term in SYS-01. Spawn chance is not `player.level * k` (FUT-23).  
**ENEMY_ARCHETYPES:** elite / boss whose phase pool includes a summon id.  
**PLAYER_COUNTERPLAY:** Stand on the only legal ground tile; sit outside range 2.  
**EDGE_CASES:** Occupied player cell is never a legal ground dest. Cap/CD still skip summon then fall through (FUT-23), not skip the whole boss turn into a kit-less bolt. Manhattan 2 vs Chebyshev 2 mismatch is SYS-13, not a longer range.  
**IMPLEMENTATION_COMPLEXITY:** Medium (shared ground legality + spawn helper).  
**TEST_SCENARIOS:** TS-BOSSSUMMON, TS-BOLT3.  
**STATUS:** PROPOSED

### AI-SYS-129

**AI_ID:** AI-SYS-129  
**NAME:** Pack hits on player-side summons must apply RES once  
**ROLE:** system  
**SOPHISTICATION:** all (honesty for SYS-05 / SYS-66 / SYS-68)  
**DECISION_RULES:** Pack kit-cast vs a summon pre-multiplies `resolvedTarget.res` (**16483–16537**) then `enemyTakesDamage` applies RES again (**3489–3498**, `Math.max(1, …)`). Pack melee vs a summon does the same (**16722–16742**). SYS-66 is pack→**player** (SP×RES then `playerTakesDamage`). SYS-68 is pack melee→**player** RES-only `setCharacterStats`. After this module: one helper, RES once, no SP on `isPhysical` Strike (SYS-108), no SP on summons that have no SP bar. Do not delete summon RES to “match” the pre-multiply. Do not route summon HP through `playerTakesDamage`. Never bolt.  
**SCORING_MODEL:** TGT-05 may estimate post-mitigation; estimate must match this helper, not crush (SYS-125).  
**SPELL_REQUIREMENTS:** Damage / drain kit ids.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always when a player-side summon is the `targetId`.  
**ENEMY_ARCHETYPES:** All pack damage roles.  
**PLAYER_COUNTERPLAY:** Stack RES on the wisp; a frost must shrink once, not twice.  
**EDGE_CASES:** `incomingDamage` 0 must stay 0 (no `Math.max(1, …)` sniper on a 0). Shield-on-summon if that HP is public. Map-modifier `applyDamageDealt` inside `enemyTakesDamage` stays once. Paper Windstorm still uses pack range (SYS-70) before this helper.  
**IMPLEMENTATION_COMPLEXITY:** Low (stop pre-multiplying when the apply helper already mitigates).  
**TEST_SCENARIOS:** TS-SUMRES, TS-BOLT3.  
**STATUS:** PROPOSED

### AI-SYS-130

**AI_ID:** AI-SYS-130  
**NAME:** Decide `getEffectiveStat` must be an absolute public snapshot, not `getStatModifier`  
**ROLE:** system  
**SOPHISTICATION:** T1+ (required for T4 / TGT-05 / ADV-04 / SYS-10)  
**DECISION_RULES:** Today WX **16347–16348** (pack) and **15183–15184** (player-summon) pass `getStatModifier`. That function returns `1` with no RES effect, `1.3` after Iron Skin, and `0` with no AP effect (`statusEffects.ts` **45–63**). `estimateDamage` / `scoreTargets` do not read it yet. After this module: either (a) stop wiring the callback until SYS-10 copies HUD `res` / `sr` / `currentAp` / `currentMp` onto `AICombatant`, or (b) wrap it as `base * modifier` for percent stats and `base + delta` for AP/MP using the **same numbers the strip shows**. Missing HUD field → module off (FUT-32). Do not treat charger-test `getEffectiveStat: () => 0` (`enemyAI.charger.test.ts` **92**) as production RES 0. Do not invent hidden ATK.  
**SCORING_MODEL:** Enables TGT-05 / ADV-04 without a 0.8-as-80 bug.  
**SPELL_REQUIREMENTS:** None.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always (snapshot honesty).  
**ENEMY_ARCHETYPES:** All deciding combatants.  
**PLAYER_COUNTERPLAY:** Hidden book stays hidden; only the bar / strip is visible.  
**EDGE_CASES:** AP/MP additive `0` means “no buff”, not “this unit has 0 AP.” Unset MP still means no walk (SYS-07 / SYS-21), not budget 3.  
**IMPLEMENTATION_COMPLEXITY:** Low–medium (type + wiring; no damage-formula change).  
**TEST_SCENARIOS:** TS-STATSHAPE, TS-BOLT3.  
**STATUS:** PROPOSED

### AI-SYS-131

**AI_ID:** AI-SYS-131  
**NAME:** Boss heal must apply advertised `buffStat` (Blood Mend CHC)  
**ROLE:** system  
**SOPHISTICATION:** all (honesty for SYS-05 / SYS-95 / SYS-120)  
**DECISION_RULES:** `starter-heal` advertises heal 12 **and** `buffStat: "chc"` for 2 turns (`spellData.ts` **85–101**). Boss heal arm (**15889–15905**) writes HP only. Buff arm (**15949–15972**) is skipped for `spellType === "heal"`. Pack heal CHC is SYS-95 / open #924 — keep that writer; do not copy it as this slice. SYS-120 is heal **range/LoS/AP**. After this module: a legal boss self-heal applies both HP and the public `buffStat` using the same effect writer as pack. Failed geometry → no HP and no CHC, never bolt. Do not invent a hidden ATK buff via `debuffStat ?? "atk"` (**15963**) on a heal.  
**SCORING_MODEL:** N/A (apply correctness). Heal EV still SYS-02 / ROL-04.  
**SPELL_REQUIREMENTS:** Heal ids that also carry `buffStat` (Blood Mend today). Rallying Cry stays `usableByEnemy: false` until SYS-90 / SYS-99.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always for bosses that can legally self-heal.  
**ENEMY_ARCHETYPES:** elite / boss with Blood Mend in a phase pool.  
**PLAYER_COUNTERPLAY:** The CHC buff is visible; purge it; the heal still required a legal dest.  
**EDGE_CASES:** Full-HP heal EV ≈ 0 (RES-06) but if the decide still emits it, apply must not skip CHC while writing HP, or skip both. `targetType: "self"` / range 0 stays legal on the boss tile (SYS-13 / SYS-20).  
**IMPLEMENTATION_COMPLEXITY:** Low (one extra `applyActiveEffect` on the heal arm).  
**TEST_SCENARIOS:** TS-BOSSCHC, TS-BOLT3.  
**STATUS:** PROPOSED

---

## 4. Tier 6+ modules (2026-10-29)

Attach via SYS-01. Higher `mu` than T4/T5 unless noted. Stack on FUT-01…FUT-143. Still one-turn (or depth-2 with the 256-node cap from SYS-03).

### AI-FUT-144

**AI_ID:** AI-FUT-144  
**NAME:** Family-hook expected value on the legal hit  
**ROLE:** advanced / spell contract  
**SOPHISTICATION:** T6  
**DECISION_RULES:** Once SYS-126 applies ember/tide on the legal hit, score the **extra** public ticks (ember 3×3) or MP shred (tide −1 for 2) in EV. Prefer Strike over frost vs a player who is already burning only if the extra stack beats a frost kill (FUT-25). Void-mirror 25% bounce remains FUT-08 (player→enemy). Pack must not replay Mirror Sovereign combo (FUT-34).  
**SCORING_MODEL:** `EV += publicFamilyOnHit` after mitigation (SYS-129 / SYS-66 once).  
**SPELL_REQUIREMENTS:** A legal damage/melee profile in kit.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 1.0` when `family` is ember_knight or tide_shade.  
**ENEMY_ARCHETYPES:** charger, assassin, generic with those families.  
**PLAYER_COUNTERPLAY:** Cleanse burn; don’t end adjacent.  
**EDGE_CASES:** Family lore without an apply hook (SYS-18) → term 0.  
**IMPLEMENTATION_COMPLEXITY:** Low once SYS-126 exists.  
**TEST_SCENARIOS:** Ember Strike EV > frost when both legal and frost does not kill.  
**STATUS:** PROPOSED

### AI-FUT-145

**AI_ID:** AI-FUT-145  
**NAME:** Boss public miss / Mirror in the enumerator  
**ROLE:** resource / elite  
**SOPHISTICATION:** T6  
**DECISION_RULES:** Overlay FUT-21 on boss kit ids after SYS-127: `EV *= (1 - pMiss)` when Paper Windstorm is public; `EV` of a mirrored hit is −outgoing on self if Mirror is public and the spell is not physical. `pickBossKitSpell` first-id remains AEE-2026-09-01-008 until FUT-20. Do not skip LoS because miss chance is high.  
**SCORING_MODEL:** Parent §6 × public miss; FUT-08 reflect term when Mirror is up.  
**SPELL_REQUIREMENTS:** Ranged boss kit profiles.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.9` when Windstorm or Mirror is public.  
**ENEMY_ARCHETYPES:** elite / boss.  
**PLAYER_COUNTERPLAY:** Windstorm + Mirror; close to melee.  
**EDGE_CASES:** Modifier off → 1.0. Ability HP is SYS-121, not this miss.  
**IMPLEMENTATION_COMPLEXITY:** Medium (depends on SYS-127 + FUT-20).  
**TEST_SCENARIOS:** Windstorm on, frost vs adjacent tagged melee ability → melee can outscore frost.  
**STATUS:** PROPOSED

### AI-FUT-146

**AI_ID:** AI-FUT-146  
**NAME:** Boss summon screen on a legal ground tile  
**ROLE:** summoner / elite  
**SOPHISTICATION:** T6  
**DECISION_RULES:** After SYS-128, boss wolf/archer placement is FUT-04: first `isCellFree` tile on the player’s last **public** approach vector, inside summon range, not a hazard, not the player cell. Ring scan if blocked. Cap/CD → kit fallback (FUT-23), not skip-into-bolt.  
**SCORING_MODEL:** Summon EV `+wScreen` if dest is on the player→boss line.  
**SPELL_REQUIREMENTS:** `isSummon` + `usableByEnemy`.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 1.0`; `isBoss` and a summon id in the phase pool.  
**ENEMY_ARCHETYPES:** summoner-boss overlays.  
**PLAYER_COUNTERPLAY:** Sit on the spawn tile; kill the summoner.  
**EDGE_CASES:** No history → SYS-128 ring around the boss, not the player.  
**IMPLEMENTATION_COMPLEXITY:** Medium.  
**TEST_SCENARIOS:** Player walked +x two turns → wolf on that +x cell if free and in range 2.  
**STATUS:** PROPOSED

### AI-FUT-147

**AI_ID:** AI-FUT-147  
**NAME:** Resistance-aware pack→summon scoring  
**ROLE:** target  
**SOPHISTICATION:** T6 (T2 TGT-05 may attach once SYS-129 exists)  
**DECISION_RULES:** `killableNow` vs a wisp/hunter must use **post-mitigation once** (SYS-129), not crush (SYS-125) and not double-RES. High-RES guardian summon loses to a low-RES wisp for the same frost.  
**SCORING_MODEL:** TGT-05 `estimateDamageAfterMitigation` with SYS-130 absolute RES.  
**SPELL_REQUIREMENTS:** Damage/drain/DoT profiles.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.0` once SYS-129/130 exist (cheap honesty).  
**ENEMY_ARCHETYPES:** All damage roles.  
**PLAYER_COUNTERPLAY:** Stack RES on the focused summon.  
**EDGE_CASES:** Summons with no SP bar: `isPhysical` still skips SP (SYS-108).  
**IMPLEMENTATION_COMPLEXITY:** Low once the helper exists.  
**TEST_SCENARIOS:** RES 50 wisp vs RES 0 hunter, same frost — hunter wins if neither is killable.  
**STATUS:** PROPOSED

### AI-FUT-148

**AI_ID:** AI-FUT-148  
**NAME:** Absolute snapshot as the only T4 feature source  
**ROLE:** advanced / authoring  
**SOPHISTICATION:** T6  
**DECISION_RULES:** ADV-04 / FUT-06 / FUT-18 / FUT-32 read AP/MP/RES only from SYS-10 fields that SYS-130 made absolute. If a future reader still calls `ctx.getEffectiveStat("player", "res")` and gets `1`, the module is **off**, not “RES 1%.”  
**SCORING_MODEL:** Unchanged ADV-04; source of the feature is the snapshot.  
**SPELL_REQUIREMENTS:** None.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Same as ADV-04 (`mu ≈ 0.8`).  
**ENEMY_ARCHETYPES:** T4+ / T6.  
**PLAYER_COUNTERPLAY:** End turn with leftover AP visible on the strip.  
**EDGE_CASES:** Fixture without AP field → ADV-04 disabled.  
**IMPLEMENTATION_COMPLEXITY:** Low once SYS-130 exists.  
**TEST_SCENARIOS:** `getEffectiveStat` fixture returning `1` must not rank as RES 1.  
**STATUS:** PROPOSED

### AI-FUT-149

**AI_ID:** AI-FUT-149  
**NAME:** Heal+buff sequencing on legal self-heal  
**ROLE:** resource / elite  
**SOPHISTICATION:** T6  
**DECISION_RULES:** After SYS-131, a boss (or pack, SYS-95) may **hold** Blood Mend when HP is high and CHC is already public (FUT-15), and may **spend** it when HP is low **or** CHC is missing and a follow-up nuke is next on the public initiative list (FUT-06). Do not self-heal at 90% just for CHC if a frost kills (RES-06 / ADV-03).  
**SCORING_MODEL:** Heal EV + buff EV; `U(heal)` loses to `U(frost)` when `killableNow`.  
**SPELL_REQUIREMENTS:** Heal profile that carries `buffStat`.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 1.1`; role artillery/boss. Queen default remains artillery (ROL-08) — this does not revive heal-first (SYS-04).  
**ENEMY_ARCHETYPES:** artillery, elite / boss.  
**PLAYER_COUNTERPLAY:** Stay in the kill band so they never “setup heal.”  
**EDGE_CASES:** Rallying Cry still `usableByEnemy: false`.  
**IMPLEMENTATION_COMPLEXITY:** Medium (depends on SYS-131 + enumerator).  
**TEST_SCENARIOS:** Boss 90% HP, frost kills → frost. Boss 20% HP, frost does not kill → Blood Mend applies HP **and** CHC.  
**STATUS:** PROPOSED

---

## 5. Spell-awareness contract (reminder)

Unchanged: no profile + apply ⇒ not in kit, not in elite extras, `usableByEnemy` treated as false in the enumerator.

Still `usableByEnemy: true` without a working decide+apply pair (do not give these to AI until FUT-22 / FUT-25 / FUT-31 / apply):

`spell-swap`, `spell-mark`, `spell-sacrifice`, `spell-lifesteal-nova`, `spell-enrage`, `spell-haste`, `spell-weaken`, `spell-expose`, `spell-drain-courage`, `spell-cursed-wound`, `spell-shadow-veil`, `spell-frost-nova`, `spell-inferno` (DoT `damage: 0`), `starter-poison` / `spell-venom-strike`, `starter-shield` / `spell-iron-skin`.

Keep `usableByEnemy: false` until profiled: barrier, mirror, timestep, rallying-cry, sentinel/bomber/wisp summons.

`starter-heal` is self-only (`range: 0`). It cannot satisfy ROL-04 ally heal. SYS-13 must keep that legal for **self**. SYS-131 applies its **CHC** only on that legal self dest.

Wolf/archer `isSummon` + `targetType: "ground"` stay illegal on the **player cell** (SYS-128).

---

## 6. Implementation order (this increment)

Do not start FUT-144+ first. Do not start T6+ from 2026-09-01…10-28 before P0 honesty.

1. SYS-05 (Fire Bolt WX **16712**, AP/MP debit, ally heal WX **16648**) — still P0. Family hooks (SYS-126) must ride the **honest** hit path, not the Bolt coin flip.  
2. SYS-126 — move ember/tide onto kit-cast + honest melee; then delete the fallback-only copies with P0.  
3. SYS-129 — pack→summon RES once (sibling of SYS-66).  
4. SYS-127 — Windstorm/Mirror on boss kit damage (after SYS-115 geometry).  
5. SYS-128 — boss kit summon legality (after SYS-13 ground + SYS-45 dest).  
6. SYS-131 — boss heal `buffStat` (after SYS-120 geometry; do not steal #924).  
7. SYS-130 — absolute snapshot wrapper (before any T4 reader).  
8. Parent T2–T5 roles / team / adaptive.  
9. FUT-144…FUT-149 as apply lands.

Each slice: `engine/enemyAI*.test.ts`, zero WX drive-by, no RAF / map gen / turn order / damage-formula edits. Scoring **reads** RES/SR; it does not change `calcScaledDamage`. Do not add `enemy.level` into `calcScaledDamage` as an AI slice.

---

## 7. Extra test scenarios

| ID | Setup | Expect |
| :--- | :--- | :--- |
| TS-EMBERCAST | `family: "ember_knight"`, charger adjacent, Strike in kit | Burn 3/turn is applied on the Strike arm; **no** Fire Bolt required. |
| TS-TIDECAST | `family: "tide_shade"`, adjacent Strike | MP −1 on the player; Strike arm, not fallback. |
| TS-BOSSWIND | Paper Windstorm on, boss frost `range > 1` | 50% miss log; no HP on miss; no bolt. |
| TS-BOSSMIRROR | Player Mirror up, boss single-target frost | Bounce onto the boss; no player HP; no bolt. |
| TS-BOSSSUMMON | Boss kit first id `summon-dire-wolf`, dest = player cell | No spawn on the player; legal ground dest or skip-to-ability. |
| TS-SUMRES | Pack frost vs wisp `res: 50` | RES applied **once**; HP drop matches one `(1-0.5)` not `(1-0.5)²`. |
| TS-STATSHAPE | `getEffectiveStat` returns `1` (no RES buff) | TGT-05 / ADV-04 disabled or treat as “no modifier”, **not** RES 1. |
| TS-BOSSCHC | Boss Blood Mend, legal self dest | HP up **and** CHC buff present. |
| TS-BOLT3 | Any failed boss/pack arm in this file | Adjacent Crush or skip; never `e-firebolt`. |

Parent and 2026-09-01…10-28 TS-* rows still apply (with **this checkout’s** WX line numbers from §1.2).

---

## 8. Mapping (new gaps → ids)

| Request / gap | Primary AI_ID |
| :--- | :--- |
| ember_knight / tide_shade only on melee fallback | AI-SYS-126 |
| Boss kit skips Windstorm / Mirror | AI-SYS-127 |
| Boss kit summon on the player tile | AI-SYS-128 |
| Pack→summon double RES | AI-SYS-129 |
| `getEffectiveStat` is `getStatModifier` | AI-SYS-130 |
| Boss Blood Mend drops CHC `buffStat` | AI-SYS-131 |
| Family-hook EV on the legal hit | AI-FUT-144 |
| Boss public miss / Mirror in the enumerator | AI-FUT-145 |
| Boss summon screen on legal ground | AI-FUT-146 |
| RES-once scoring vs summons | AI-FUT-147 |
| Absolute snapshot as T4 source | AI-FUT-148 |
| Heal+buff sequencing | AI-FUT-149 |

T0–T5 requested list (positioning, targeting, resources, roles, team, adaptive) remains parent §19. Nothing in that list is implemented. Higher-level enemies still get harder from **modules on the sigmoid**, not from `computeAITier(enemyLevel)`.
