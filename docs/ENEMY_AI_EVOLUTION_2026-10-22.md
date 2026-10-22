# Advanced Enemy AI Evolution — 2026-10-22 increment

**Status:** PROPOSED (design only; no production code in this change)  
**Date:** 2026-10-22  
**Parent catalog:** [`ENEMY_AI_EVOLUTION.md`](./ENEMY_AI_EVOLUTION.md) (T0–T5)  
**Prior increments:** [`ENEMY_AI_EVOLUTION_2026-09-01.md`](./ENEMY_AI_EVOLUTION_2026-09-01.md) · [`ENEMY_AI_EVOLUTION_2026-09-02.md`](./ENEMY_AI_EVOLUTION_2026-09-02.md) · [`ENEMY_AI_EVOLUTION_2026-09-21.md`](./ENEMY_AI_EVOLUTION_2026-09-21.md) (open PR #351; SYS-22…32, FUT-36…47 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-22.md`](./ENEMY_AI_EVOLUTION_2026-09-22.md) (open PR #416; SYS-33…35, FUT-48…53 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-23.md`](./ENEMY_AI_EVOLUTION_2026-09-23.md) (open PR #458; SYS-36…41, FUT-54…59 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-24.md`](./ENEMY_AI_EVOLUTION_2026-09-24.md) (open PR #506; SYS-42…47, FUT-60…65 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-25.md`](./ENEMY_AI_EVOLUTION_2026-09-25.md) (open PR #565; SYS-48…53, FUT-66…71 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-26.md`](./ENEMY_AI_EVOLUTION_2026-09-26.md) (open PR #633; SYS-54…59, FUT-72…77 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-27.md`](./ENEMY_AI_EVOLUTION_2026-09-27.md) (open PR #689; SYS-60…65, FUT-78…83 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-28.md`](./ENEMY_AI_EVOLUTION_2026-09-28.md) (open PR #723; SYS-66…71, FUT-84…89 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-29.md`](./ENEMY_AI_EVOLUTION_2026-09-29.md) (open PR #804; SYS-72…77, FUT-90…95 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-10-21.md`](./ENEMY_AI_EVOLUTION_2026-10-21.md) (open PR #821; SYS-78…83, FUT-96…101 — **do not re-number**)  
**Implementer ledger:** [`automation/ACTION_IDS_AEE_2026-10-22.md`](./automation/ACTION_IDS_AEE_2026-10-22.md)

This increment re-reads the live engine one day after the 2026-10-21 catalog (#821). SYS-01…83 and FUT-01…101 stay **PROPOSED** on their own files; they are **not** re-filed here. New work is: `scoreTargets` never reads `maxHp` so `wLowHp` is identically 0 even after SYS-78; lookahead/spill retarget ignores `aiCanCast`; summoner arithmetic midpoint bypasses range-2 wolf placement; `stepFlank` treats every adjacent tile as a tackle zone; hostile spawn stamps `summonAI = pieceType`; `isSummoner` eats the piece kit on skip so FUT-23’s p=1 overlay idles late-game packs.

Stralt has **no character level cap**. Nothing here maps `if (level >= X) sophistication = Y`. Tiers remain conceptual. Eligibility remains the parent §4 sigmoid (`peer = log2(enemy.level / player.level)` plus pack/boss/modifier terms). A year-later peer fight at any absolute level can attach a new module without raising a cap. SYS-73 (drop the spawn `999` ceiling), FUT-92 (unbounded peer), and this file’s SYS-89 (summoner overlay must not become a last band) are the spawn-side half of that rule.

**Hard rules (unchanged):** no cheat, no hidden player information, no ignored LoS/range/AP/MP, no unbounded search, no kit-less Fire Bolt, no `instantKill`, no betrayal-as-difficulty, no name-based spell heuristics, no production AI in this change.

Open production PRs that already slice honesty (do **not** re-file the ids). 10-21 said no combat-AI PRs after 2026-09-29; **#842 exists** (2026-10-21) and owns the hostile-kit spawn stamp this file names as SYS-88:

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
| [#821](https://github.com/Mr-Melic/stralt/pull/821) (draft) | SYS-78…83 / FUT-96…101 | Yesterday’s design increment. Unique files only. |
| [#842](https://github.com/Mr-Melic/stralt/pull/842) (draft) | AI-SYS-88 (spawn stamp) / SYS-55 (routing) | Hostile minion `summonKit` + `decideSummonAction`. **Do not re-implement here.** |
| [#861](https://github.com/Mr-Melic/stralt/pull/861) (draft) | (player auto-summon empty kit) | Player-side catalog resolve. Not pack SYS-88. |

This docs PR does **not** edit [`ENEMY_AI_EVOLUTION.md`](./ENEMY_AI_EVOLUTION.md) (open PR #351 unions that header). Unique files only.

---

## 1. Re-read (2026-10-22) — what moved

All line numbers are from this checkout. Re-read them before implementing.

### 1.1 Combat-parity still is not sophistication

Unchanged from 2026-09-21…10-21: `enemyCastGeometryOk` (`targeting.ts` 166–177), `aiCanCast` (`enemyAI.ts` 320–332), Frozen walk *rate* (`enemyWalkMp.ts` 21–29), `playerCastPlan.ts` (player only), summon leftover-AP `reevaluate` (`summonExecutor.ts` 249–254). These are **not** SYS-05 / SYS-13 / SYS-01.

`aiCanCast` is still unused by healer (1099–1100) and guardian (2131–2133). That remains **AI-SYS-23** on the 09-21 increment. Caster in-range uses it (953); lookahead/spill after that line does **not** (this file’s SYS-85).

`enemyAI.ts` still has **zero** reads of `currentAp`, `currentMp`, or `apCost`. Pack walk budget is still `ENEMY_REACHABLE_STEP_BUDGET = 3` (`gameConstants.ts` 166; `computeReachable` 377–378). `getEffectiveStat` is declared on `DecideEnemyContext` (275–276) and **never read** by `estimateDamage` / `scoreTargets` / any `decide*`.

Do **not** feed `spellRangeBase` into AI (`targeting.ts` 191–209 / `groundTileInRange`). That fork is honesty: player upgrade `maxRange` is not an enemy kit field. Do **not** treat `enemyCastGeometryOk` as SYS-13 complete.

`starter-frost` live range is **`BigInt(4)`** (`spellData.ts` **131**). Open #821 TS-MTC used frost 3. SYS-79 still holds: Chebyshev 6 is out of current-origin range 4.

### 1.2 Line numbers vs 2026-10-21 (P0 sites did not move)

| Fact | 2026-10-21 | Live (2026-10-22) |
| :--- | :--- | :--- |
| `computeAITier` | `combatMath.ts` 36–52 | **unchanged** |
| `pickEnemyLevelFromTiers` `maxTier = floor(999 / ts)` | `combatMath.ts` 54–58 | **unchanged** (SYS-73) |
| `calcScaledDamage` ignores caster level | `combatMath.ts` 130–137 | **unchanged** (SYS-72) |
| Spawn `aiTier` | WX 5823 | **5823** |
| Family second `computeAITier` | WX 5865 | **5865** |
| Kit `levelZone` object | WX 11920 | **11920** |
| Summoner chance unbounded | WX 11932–11943 | **11932–11943** (FUT-23; this file’s SYS-89 is the skip-brain) |
| `isSummoner` short-circuit | (not called out as skip-brain) | WX **16375–16384** then spawn **16389–16404** (SYS-86 / SYS-89) |
| Player-summon empty occupied | WX 15156 | **15156** (SYS-14) |
| Summon player `maxHp` HUD | WX 15150 | **15150** (SYS-78) |
| Pack player `maxHp` leftover | WX 16300 | **16300** (SYS-76 / SYS-78) |
| `aiTier >= 5` erratic | WX 15508 | **15508** |
| `aiTier >= 10` betrayal | WX 15595 | **15595** |
| Dest-commit clamp | WX 16416–16423 | **16416–16423** (SYS-58) |
| Apply `targetCell` render `playerPosition` | WX 16436–16438 | **16436–16438** (SYS-34 / #495) |
| Apply Chebyshev only | WX 16450–16456 | **16450–16456** |
| Apply crit `enemy.chc ?? 2` | WX 16470–16472 | **16470–16472** (SYS-82) |
| Self-heal `range === 0` | WX 16648 | **16648** |
| Fire Bolt `e-firebolt` | WX 16712 | **16712** |
| Strip `chc: 2` | WX 17408 | **17408** |
| `decideEnemyAction` | 1662–1707 | **1662–1707** |
| `scoreTargets` `effectiveHp ?? hp` | (not called out; SYS-76 blamed leftover maxHp) | **341–342**, **540** (SYS-84) |
| `applyLethalLookahead` / spill | 727–735 / 707–709 | **727–735** / **695–718**; caster wires both at **953–956** (SYS-85) |
| `decideSummonerAction` midpoint | 1894–1895 | **1894–1906**; wolf range **2** (`spellData.ts` **554**) (SYS-86) |
| `stepFlank` tackle | (not called out) | **662–676** (SYS-87) |
| Hostile `summonAI: unitDef.pieceType` | (not called out) | `summonSpawn.ts` **275**; fallback `name.includes` **218–223** (SYS-88 / #842) |
| Pack healer `allies.find(!isSummon)` | FUT-83 | **1142** — **do not re-file**; still unimplemented |
| `pickBossKitSpell` `new Map()` | `useBossAI.ts` 169–173 | **169–173** |
| `ENEMY_AI_TIER_GATES` | unread | still unread (`enemyAI.ts` comment only at **1422–1423**) |

P0 remains **AEE-2026-08-31-002** (Fire Bolt / apply honesty) then **AEE-2026-08-31-001** (`computeAITier`). Then 09-21…10-21 honesty. Then this file’s SYS-84…89. Do not start FUT-102+ first.

### 1.3 Still true — do not re-file (parent / 09-21…10-21)

- Zone-0 kits forever (`Math.floor(levelZone)` on an object). SYS-09.
- `scoreTargets` ignores `focusTargetId`. SYS-08 / AI-SYS-30 (prepend also destroyed by sort).
- `estimateDamage` returns 0 when `spell.damage <= 0`. SYS-02 / SYS-39.
- Heal-first `inferArchetype` (447–452). SYS-04 / SYS-41.
- Pack healer idle ward `allies.find(!isSummon)` (1142). **FUT-83** (09-27). Summon `pickBestAlly` (2120) already exists.
- Hazard avoid only below 50% HP; ice/lava/spikes only (425–441). POS-04 / FUT-09 / FUT-59 / FUT-93.
- Retreat / `reposition-los` `kind: "skip"` while dest-commit still moves. POS-02 / FUT-41 / SYS-58.
- Summoner chance hits 1.0 at player level 44. FUT-23. **The idle-on-skip brain is SYS-89.**
- `ENEMY_AI_TIER_GATES` unread. SYS-01.
- Summon executor Chebyshev teleport MP. SYS-15 / 09-21 SYS-25.
- Family overlay second `computeAITier`. AI-SYS-29.
- `findKitSpell` assigned fallback (1737–1745). AI-SYS-32.
- Strip / `resolveEnemyApMp` uses `enemy.level` for AP/MP. SYS-54. Dummy combat stats SYS-69.
- Hostile summons skip the paid executor. SYS-55. **#842 routes decide; it still does not send hostiles through `executeSummonAction`.**
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
- Pack snapshot leftover `maxHp`. SYS-76 / FUT-95. Summon/pack fork is SYS-78. **The scorer still ignores `maxHp` (SYS-84).**
- Adaptive Resistance private ref. SYS-77 / FUT-90.
- `pickBestDamageSpell` origin-range. SYS-79 / FUT-96.
- Pack `scoreTargets(..., null)` Crush ranking. SYS-80 / FUT-97.
- Overkill spill Crush stamp. SYS-81 / FUT-98.
- `allyCount` / `enemyCount` include player summons. SYS-83.
- `hasBresenhamLoS` still ignores combatant bodies. Do not propose an AI-only body-block LoS module.
- `engine/summonAI.ts` `runSummonAI` remains unused.

### 1.4 New honesty gaps (this increment)

1. **`wLowHp` cannot fire.** `scoreTargets` (**536–548**) sets `lowHp = 1 - c.hp / max(1, effectiveHp(c))`. `effectiveHp` (**341–342**) is `c.effectiveHp ?? c.hp`. No pack or summon snapshot sets `effectiveHp` (WX **16279–16302**, **15125–15151**). The ratio is always `hp/hp`. `ENEMY_UTILITY_WEIGHTS.wLowHp = 30` (`gameConstants.ts` 182) is dead. SYS-76 / SYS-78 fix the **player `maxHp` field**. They do not change this helper. Summon `scoreAlly` already uses `hpFrac` (**2029–2030** = `hp/maxHp`). TGT-01 is implemented for ally heals and **not** for damage ranking. SYS-84.

2. **Lookahead / spill retarget skips geometry.** Caster finds a legal `aiCanCast` on `t` (**953**), then `applyLethalLookahead` (**727–735**) picks any scored id with `hp <= estimateDamage(spell)` and `applyOverkillSpread` (**695–718**) may switch again. Neither helper calls `aiCanCast`. Flanker / berserker / charger adjacent (**1336–1356**, **1427–1447**, **1197–1210**) can melee a non-adjacent lookahead id. Apply then uses Chebyshev only (WX **16450–16456**): a wall-hidden wisp can be hit, or a far retarget fails and SYS-05 Fire-Bolts if the *new* cell is Chebyshev 1. SYS-81 is the Crush **stamp**. This is the **dest**. SYS-85.

3. **Summoner placement is a teleport.** `decideSummonerAction` (**1894–1906**) sets dest to the integer midpoint of player and a non-summon ally, or the summoner’s own tile. `summon-dire-wolf` / `summon-archer` range is **2** (`spellData.ts` **554**, **583**). WX **16389–16404** short-circuits *before* the Chebyshev apply gate, so a Chebyshev-6 midpoint still spawns. `spawnSummonUnit` may snap via `findNearestFreeCell` (`summonSpawn.ts` **114–135**) to a **different** cell than decide logged. Player summons pay range through the spell engine. SYS-86.

4. **`stepFlank` never occupies the strike tile.** Comment at **661** says “tiles adjacent to the target that are occupied.” The loop at **664–671** adds **every** 4-dir neighbor of the target, occupied or not. Candidates on those keys are skipped (**673**). The only way a knight enters Chebyshev 1 is the `stepToward` fallback (**679**). POS-01 / ROL-03 “flank then strike” is a straight-line charge with extra rejected side-steps. SYS-87.

5. **Hostile spawn writes chess `pieceType` into `summonAI`.** `spawnEnemySummonUnit` (`summonSpawn.ts` **275**) sets `summonAI: unitDef.pieceType` (`"wolf"` / `"golem"`). `inferSummonArchetype` then misses the hunter/guardian keys (**208–216**) and uses `name.includes("wolf")` (**218–219**). SYS-17 forbade that fallback; this is the **writer** that forces it. Spells stay empty on this checkout, so hunter venom is missing and SYS-55 pack-fallthrough Crush/Bolts. Open **#842** attaches `summonKit` and routes `decideSummonAction` — catalog the gap; do not copy that PR. SYS-88.

6. **`isSummoner` replaces the piece brain, including on skip.** WX **16375–16384** calls *only* `decideSummonerAction` when `enemy.isSummoner`. Cap / cooldown / missing spell returns `kind: "skip"` at origin (**1857–1887**). There is no fallthrough to `decideEnemyAction`. Overlay chance is `0.12 + player.level * 0.02` (constants **298–299**; WX **11932–11943**) → 1.0 at player **44** (FUT-23). Past that band every overworld enemy is a wolf-dropper who **idles** every other turn and never frosts. That is relative-difficulty termination by overlay, the same class as SYS-73’s 999 spawn ceiling. SYS-89.

### 1.5 Tests

`enemyAI.charger.test.ts`, `enemyAI.geometry.test.ts`, `enemyAI.walkMp.test.ts` exist. Honesty for `wLowHp`, lookahead geometry, summoner range-2 dest, flank tackle, hostile `summonAI`, and summoner skip-fallthrough still has no decide/apply-layer tests. Do not treat geometry/walkMp as SYS-84…89. Open #842 adds `enemySummonKit.test.ts` on **its** branch — do not duplicate here.

### 1.6 What this increment does **not** change

Do not implement FUT-102+ before P0 honesty + 09-21…10-21 SYS slices. Do not touch RAF, map generation, turn order, or damage formulas (`calcScaledDamage` stays a **read** for scoring; do not add `enemy.level` into it as a stealth stat stick). Do not copy #495 / #498 / #644…#659 / #700 / #709 / **#842** / **#861** into this docs-only change. Do not edit the parent catalog. Do not “fix late game” by keeping Fire Bolt. Do not re-file FUT-83 (pack healer `pickBestAlly`). Do not turn FUT-23’s chance table into `if (player.level >= 44) isSummoner = true` as a sophistication module.

---

## 2. Design additions (normative)

1. **Do not recycle 09-21…10-21 ids.** This file starts at SYS-84 / FUT-102.
2. **`wLowHp` uses the same fraction as self-retreat.** `hpFrac` (`hp / max(1, maxHp)`) already drives caster/flanker/generic retreat and summon `scoreAlly`. Damage ranking must use that (or `effectiveHp ?? maxHp`), never `effectiveHp ?? hp`. SYS-78 still has to put HUD max on the player row; this helper must *read* it.
3. **Retarget is a new legality check.** Lookahead and spill may change `targetId` only when SYS-13 / `aiCanCast` would accept the **new** id from the same origin (or the same legal-cast dest). Illegal ⇒ keep the original id. Apply still one hit (SYS-19).
4. **Summon dest is a ground-target spell.** Range, occupancy, reserved, and LoS-if-required from the summoner’s origin. Snap is apply honesty, not a tactic: decide must enumerate the **landed** cell or skip. Short-circuit may stay for spawn bookkeeping; it must not skip the legality gate.
5. **Tackle zone = allied bodies on adjacent tiles**, not empty strike cells. Flank then occupy Chebyshev 1 is the knight’s job.
6. **`summonAI` is a kit key** (`hunter` / `guardian` / `archer` / `bomber` / `healer`), never `pieceType`. SYS-17 fallback stays deleted after the writer is fixed (#842).
7. **Summoner is a role module, not a brain replacement.** On cap/CD/illegal dest, fall through to the piece kit (`decideEnemyAction`). Overlay attach stays parent §4 sigmoid, not `player.level * 0.02`.
8. **T6+ still stacks** on the parent enumerator. No integer tier table. No `if (aiTier >= 8)`. No `if (level >= X)`.

---

## 3. System proposals (2026-10-22)

### AI-SYS-84

**AI_ID:** AI-SYS-84  
**NAME:** `scoreTargets` `wLowHp` must use `maxHp`, not `effectiveHp ?? hp`  
**ROLE:** system  
**SOPHISTICATION:** T1+ / honesty for TGT-01 / SYS-76 / SYS-78  
**DECISION_RULES:** Live `lowHp = 1 - hp / (effectiveHp ?? hp)` (`enemyAI.ts` **540**, helper **341–342**). Snapshots never set `effectiveHp`, so the term is 0 for every opponent, including a 40/120 player after SYS-78 writes HUD `maxHp`. After this module: `denom = combatant.effectiveHp ?? combatant.maxHp` (HUD max for the player; summon/enemy `maxHp` from the store). `hpFrac` already does this (**335–337**) and `scoreAlly` already uses it (**2029–2030**). Do not invent a hidden true-max. Do not use leftover stamp max (SYS-76) as the denom. `wKillable` stays SYS-80 (kit pipeline, not Crush).  
**SCORING_MODEL:** `lowHp = 1 - hp / max(1, hudOrStoreMaxHp)` ∈ [0,1], times `wLowHp` (30). Full HP → 0. Missing maxHp → treat as current hp and **disable** the term (do not rank 0/0 as wounded).  
**SPELL_REQUIREMENTS:** None.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always (honesty). TGT-01 attach weights stay FUT-102.  
**ENEMY_ARCHETYPES:** All pack `scoreTargets` callers; hunter/archer already call `scoreTargets` with a kit id (SYS-80) but still hit this helper.  
**PLAYER_COUNTERPLAY:** Enter 40/120. Bishops must prefer you over a full-HP wisp on the low-HP term (threat may still win — that is TEM-01 / SYS-30, not this).  
**EDGE_CASES:** `effectiveHp` overlay, if a later SYS-10 shield/RES pool exists, may replace maxHp as the denom for *killable* but must not zero the bar-fraction term. Do not mix Crush `level/5` into this (SYS-80).  
**IMPLEMENTATION_COMPLEXITY:** Low (one helper; tests).  
**TEST_SCENARIOS:** Player 40/120, wisp 10/10, no killableNow → player `lowHp` 0.667, not 0. Same with leftover stamp 40/40 still on the row → after SYS-78 the denom is 120.  
**STATUS:** PROPOSED

### AI-SYS-85

**AI_ID:** AI-SYS-85  
**NAME:** Lookahead and overkill spill must re-check `aiCanCast` on the new id  
**ROLE:** system  
**SOPHISTICATION:** T1+ / honesty for SYS-13 / SYS-19 / SYS-81  
**DECISION_RULES:** `applyLethalLookahead` (**727–735**) and `applyOverkillSpread` (**695–718**) score HP vs `estimateDamage` only. Caster (**953–956**) already proved geometry for `t`, then may fire at `final.combatant` with no second `aiCanCast`. Adjacent flanker/berserker/charger (**1336–1356**, **1427–1447**, **1197–1210**) may `kind: "melee"` a non-adjacent lookahead id. After this module: a candidate is legal only if (a) kit/melee geometry from the **same origin or dest the action will use** would pass SYS-13 / `aiCanCast` (Chebyshev 1 for true melee), and (b) SYS-81’s kit killable predicate holds. Illegal ⇒ keep the original id. Apply still one hit. Do not “fix” by turning AI LoS off. Do not Fire-Bolt the failed retarget (SYS-05).  
**SCORING_MODEL:** Illegal retarget ⇒ dropped. EV stays non-crit (SYS-82).  
**SPELL_REQUIREMENTS:** Same spell object already chosen. No kit-less bolt.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always (correctness). T6 spill as a *module* stays FUT-98 / this file’s FUT-103.  
**ENEMY_ARCHETYPES:** caster, generic (spill); charger, flanker, berserker (adjacent lookahead).  
**PLAYER_COUNTERPLAY:** Park the wounded wisp behind a wall. They may still frost *you* if that is legal; they must not frost the wisp through the wall.  
**EDGE_CASES:** `AI_LETHAL_LOOKAHEAD_ENABLED` / `AI_OVERKILL_SPILL_ENABLED` are global on (SYS-01). This slice is legality, not eligibility. Hunter lookahead (**1942**) is the same helper — cover it.  
**IMPLEMENTATION_COMPLEXITY:** Low (filter inside the two helpers; pass origin + spell).  
**TEST_SCENARIOS:** Origin (0,0), player (2,0) in frost range with LoS, wisp (2,2) 1 HP behind a wall → stay on player. Adjacent knight, player 80 HP, wisp 4 tiles away 1 HP → melee the player, not skip.  
**STATUS:** PROPOSED

### AI-SYS-86

**AI_ID:** AI-SYS-86  
**NAME:** Summoner dest is a range-2 ground spell, not an arithmetic midpoint  
**ROLE:** system  
**SOPHISTICATION:** T1+ / honesty for ROL-06 / SYS-13  
**DECISION_RULES:** `decideSummonerAction` (**1894–1906**) writes `midX/midY = round((player + ally) / 2)` without range, occupancy, reserved, or LoS. Wolf/archer summon `range` is 2 (`spellData.ts` **554**). WX **16389–16404** spawns and returns before apply’s Chebyshev gate (**16450**). `spawnSummonUnit` (**114–135**) may snap to `findNearestFreeCell` so the logged dest is not the landed cell. After this module: enumerate free ground tiles with Chebyshev ≤ `enemySpellRange(summonSpell)` from origin, `isCellFree` + reserved (SYS-62), not on the player. Pick the tile that best matches the role (FUT-104). If empty ⇒ skip the *summon*, do not teleport. Short-circuit may still call `spawnEnemySummonRef` **after** legality. Do not ignore LoS if the spell requires it. Do not use `assignedSpells` to bypass the cooldown-filtered `availableSpells` list (SYS-32 class).  
**SCORING_MODEL:** Illegal dest ⇒ −∞ (no spawn). Snap-without-enumerate is not a scorer.  
**SPELL_REQUIREMENTS:** Profiled `isSummon` ids already in the overlay (`summon-dire-wolf`, `summon-archer`). Sentinel/bomber/wisp stay `usableByEnemy: false` until profiled.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always when a summoner acts. Overlay *attach* is SYS-01 / FUT-23, not this.  
**ENEMY_ARCHETYPES:** summoner.  
**PLAYER_COUNTERPLAY:** Stand so every range-2 ground tile is occupied or reserved; they must not drop a wolf on your backline from dist 6.  
**EDGE_CASES:** No ally ⇒ live dest is the summoner’s own tile (**1894–1895**), which is occupied by self — spawn snaps. Enumerate neighbors instead. Cap (`ENEMY_SUMMON_CAP` 2) still skips spawn (1857).  
**IMPLEMENTATION_COMPLEXITY:** Medium (enumerator + keep short-circuit bookkeeping).  
**TEST_SCENARIOS:** Summoner (0,0), player (6,0), ally (6,6), wolf range 2 → dest Chebyshev ≤ 2 from origin, not (6,3). Occupied (2,0) → next free in range or skip, no snap-as-tactic.  
**STATUS:** PROPOSED

### AI-SYS-87

**AI_ID:** AI-SYS-87  
**NAME:** `stepFlank` tackle zone is every adjacent tile, not occupied allies  
**ROLE:** system  
**SOPHISTICATION:** T1+ / honesty for POS-01 / ROL-03  
**DECISION_RULES:** `stepFlank` (**643–679**) builds `tackleZone` from all four neighbors of the target (**664–671**) and refuses those keys (**673**). The comment at **661** claims “occupied.” Empty strike cells are therefore illegal for the flank picker; only `stepToward` fallback (**679**) can enter Chebyshev 1. After this module: tackle keys are adjacent tiles whose occupant is an **ally** (same `side === "enemy"` body). Empty adjacent is a legal dest if `reachable` and `isCellFree`. Player / player-summon tiles stay occupied (cannot stand on them). Do not path through walls. Do not give knights a private diagonal step outside `computeReachable` (SYS-15).  
**SCORING_MODEL:** Empty adjacent dest is legal; ally-occupied adjacent is −∞ for this walker.  
**SPELL_REQUIREMENTS:** None (movement). Adjacent strike still SYS-05 Crush or kit.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always for flanker piece routing. T6 “rear bonus” is FUT-105.  
**ENEMY_ARCHETYPES:** flanker (knight).  
**PLAYER_COUNTERPLAY:** Body-block the two side tiles with summons; they may still `stepToward` the front.  
**EDGE_CASES:** All four adjacent occupied → fallback `stepToward` / hold. `kind: "skip"` retreat still must not Fire-Bolt (SYS-05).  
**IMPLEMENTATION_COMPLEXITY:** Low (filter occupants).  
**TEST_SCENARIOS:** Knight (2,2), player (2,4), (2,3) free and reachable → dest may be (2,3) or a side tile, not forced away from (2,3). Ally already on (3,4) → (3,4) rejected.  
**STATUS:** PROPOSED

### AI-SYS-88

**AI_ID:** AI-SYS-88  
**NAME:** Hostile spawn must not stamp `summonAI` with chess `pieceType`  
**ROLE:** system  
**SOPHISTICATION:** meta / authoring (SYS-17 writer)  
**DECISION_RULES:** `spawnEnemySummonUnit` (`summonSpawn.ts` **275**) sets `summonAI: unitDef.pieceType` (`"wolf"`). `inferSummonArchetype` (**203–224**) only accepts hunter/guardian/archer/bomber/healer (plus kiter/kamikaze aliases), then `name.includes("wolf")`. SYS-17 forbade the name heuristic; this stamp forces it. Empty `spells` plus SYS-55 pack-fallthrough is Crush/Fire Bolt. After this module: write the catalog key (`spell.summonAI` / `unitDef` kit role: `"hunter"` for dire wolf). Keep `pieceType` for art. Open **#842** already does kit-copy + `decideSummonAction` routing on its branch — **do not re-implement in a docs PR or a competing spawn patch.** If #842 merges first, this id is satisfied by that writer; still delete the `name.includes` fallback (SYS-17) in a follow-up.  
**SCORING_MODEL:** N/A (authoring). Wrong key ⇒ hunter kit never selected even after SYS-55.  
**SPELL_REQUIREMENTS:** `summonKit` on `summonUnitDef` (wolf: `physical_attack`, `spell-venom-strike`). Venom EV still SYS-39.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always for `side === "enemy"` summons.  
**ENEMY_ARCHETYPES:** hunter / archer hostile minions.  
**PLAYER_COUNTERPLAY:** N/A (honesty). After kits work, venom is readable, not a hidden bolt.  
**EDGE_CASES:** `pieceType === "archer"` accidentally matches the archer key; `pieceType === "wolf"` does not match hunter. Do not treat that coincidence as a design. `#861` is player auto-summon empty kit — different writer.  
**IMPLEMENTATION_COMPLEXITY:** None in this PR (docs). Low on #842’s branch.  
**TEST_SCENARIOS:** Spawn wolf → `summonAI === "hunter"` and `spells` contain venom. Grep `inferSummonArchetype` for `includes(` → zero after SYS-17.  
**STATUS:** PROPOSED

### AI-SYS-89

**AI_ID:** AI-SYS-89  
**NAME:** Summoner overlay must not replace the piece kit on skip  
**ROLE:** system  
**SOPHISTICATION:** meta (unbounded overlay) / honesty for ROL-06 / FUT-23  
**DECISION_RULES:** WX **16375–16384** dispatches *only* `decideSummonerAction` when `isSummoner`. Cap, `ENEMY_SUMMON_COOLDOWN_TURNS` (2), or missing summon spell returns `kind: "skip"` at origin (**1857–1887**) and the piece frost/melee never runs. Overlay chance is `ENEMY_SUMMONER_CHANCE_BASE + characterStats.level * ENEMY_SUMMONER_CHANCE_PER_LEVEL_ZONE` (**298–299**) → 1.0 at player 44 (FUT-23). There is no last player level, so from 44 through 50000 every overworld enemy is a skip-summoner every other turn. After this module: (1) overlay attach uses parent §4 `peer` (not `player.level * 0.02`); (2) when summon is illegal or on CD, **fall through** to `decideEnemyAction` with the piece kit; (3) a successful legal spawn still short-circuits to `spawnEnemySummonRef` (SYS-86 dest). Do not keep Fire Bolt as the skip filler. Do not `if (player.level >= 44) isSummoner = true`.  
**SCORING_MODEL:** Skip-summon is not an action. Piece-kit EV applies on fallthrough.  
**SPELL_REQUIREMENTS:** Overlay summon ids *and* the piece kit (frost / Crush). Queen heal-first still SYS-04.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Overlay module `mu ≈ 0.5` when `peer + pack` says summoner; remnants at any absolute level may roll 0.  
**ENEMY_ARCHETYPES:** summoner + the underlying piece (caster/charger/…).  
**PLAYER_COUNTERPLAY:** Kill the wolf; on the cooldown turn they still frost you if the kit can. Today they idle.  
**EDGE_CASES:** Cap 2 reached and CD ready → fallthrough, do not skip the turn. `isSummoner` on a healer-inferred queen (SYS-04) still must not Blood-Mend-as-brain.  
**IMPLEMENTATION_COMPLEXITY:** Low (dispatch) + FUT-23 chance rewrite.  
**TEST_SCENARIOS:** Player 44, bishop overlay, lastSummonTurn this turn → `decideEnemyAction` frost/move, not skip. Player 400 vs remnant 40 (`peer < 0`) → overlay probability not 1.0.  
**STATUS:** PROPOSED

---

## 4. T6+ reusable modules (2026-10-22)

Attach via parent §4 sigmoid. Stack; do not replace T0–T5 or FUT-01…101. Do not re-file FUT-83 (pack healer ward) or FUT-23 (chance formula — SYS-89 is the skip-brain).

### AI-FUT-102

**AI_ID:** AI-FUT-102  
**NAME:** Damage ranking uses the same HP bar the player can see  
**ROLE:** target  
**SOPHISTICATION:** T6 (TGT-01 / TGT-02; SYS-84 / SYS-78 / FUT-95)  
**DECISION_RULES:** After SYS-84 + SYS-78, `wLowHp` uses HUD max for the player and store max for summons. `wThreat` / `wKillable` / `wProximity` stay parent weights. KillableNow stays the kit pipeline (SYS-80 / SYS-81), not Crush and not crit (SYS-82). A year-later peer fight uses the same bar math; there is no “high-level low-HP table.” Do not read leftover `characterStats.maxHp`.  
**SCORING_MODEL:** Parent `U` with live `hpFrac`.  
**SPELL_REQUIREMENTS:** Same as SYS-80.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.25` (default once SYS-84 exists). Not a level gate.  
**ENEMY_ARCHETYPES:** All pack `scoreTargets` callers.  
**PLAYER_COUNTERPLAY:** Heal to the orb cap; the low-HP term must drop. Hide a wounded wisp behind LoS (SYS-85).  
**EDGE_CASES:** Healer fallback `decideCaster` (**1166–1168**) inherits this. Queen-with-heal still SYS-04.  
**IMPLEMENTATION_COMPLEXITY:** Low after SYS-84.  
**TEST_SCENARIOS:** 40/120 player vs 10/10 wisp, frost cannot kill either → wisp may still win on threat; player must not have `lowHp` 0.  
**STATUS:** PROPOSED

### AI-FUT-103

**AI_ID:** AI-FUT-103  
**NAME:** Pack focus retarget only onto a legal dest  
**ROLE:** target / team  
**SOPHISTICATION:** T6 (TGT-06 / TEM-01; SYS-85 / SYS-81 / FUT-98)  
**DECISION_RULES:** After SYS-85, T3+ casters may spill / lookahead onto a second id that is SYS-13 legal this turn for the **same** spell and origin/dest. Focus id (SYS-08) updates so the next pack member can read it. Apply one hit. Do not splash. Do not use Crush leftover (SYS-81). Eligibility is relative pack size (`combatants.filter(side)` — SYS-83), not `allyCount` raw and not `aiTier >= 4`.  
**SCORING_MODEL:** SYS-85 predicate; optional `+wFocus` on the new id.  
**SPELL_REQUIREMENTS:** Single-target damage. Multi-hit is FUT-19.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.6` when living opponents ≥ 2.  
**ENEMY_ARCHETYPES:** synergistic T3+ casters.  
**PLAYER_COUNTERPLAY:** Second body out of frost range / LoS → no legal spill.  
**EDGE_CASES:** Windstorm miss still spends the id (SYS-75). Mirror consume (SYS-74) is not spill.  
**IMPLEMENTATION_COMPLEXITY:** Low after SYS-85 + SYS-08 reader.  
**TEST_SCENARIOS:** Frost 40, player 10 in range, wisp 10 in range behind a wall → stay on player. Both in range with LoS, leftover > fraction → may retarget wisp.  
**STATUS:** PROPOSED

### AI-FUT-104

**AI_ID:** AI-FUT-104  
**NAME:** Summoner places the minion on a scored legal tile, then uses the piece kit  
**ROLE:** summoner / resource  
**SOPHISTICATION:** T6 (ROL-06 / RES-04; SYS-86 / SYS-89)  
**DECISION_RULES:** After SYS-86 legality and SYS-89 fallthrough: when a summon id is legal, score ground tiles in range (between pack and player, not on reserved, not clustered on an existing wolf — POS-06). Spawn once. On CD/cap/no tile, `decideEnemyAction` with the piece kit (move-then-cast SYS-79 / FUT-96). Do not idle. Do not teleport. Overlay attach remains §4 sigmoid (rewrite FUT-23).  
**SCORING_MODEL:** `U(tile) = +wBetween*1[on pack–player axis] - wHazard - wCluster`; illegal −∞. Fallthrough uses piece-kit `U`.  
**SPELL_REQUIREMENTS:** Profiled summon id + piece damage id.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.55` for the overlay; fallthrough always when overlay is on and spawn is illegal. Never `if (player.level >= 44)`.  
**ENEMY_ARCHETYPES:** summoner + caster/charger piece.  
**PLAYER_COUNTERPLAY:** Occupy range-2 tiles; they frost instead of skipping.  
**EDGE_CASES:** Two wolves already out (cap) → frost this turn. Midpoint illegal but (1,0) legal → spawn (1,0), not snap from (6,3).  
**IMPLEMENTATION_COMPLEXITY:** Medium after SYS-86 / SYS-89.  
**TEST_SCENARIOS:** CD on, bishop overlay, player in frost 4 → kind `cast` frost. Legal (1,0) vs illegal midpoint → dest (1,0).  
**STATUS:** PROPOSED

### AI-FUT-105

**AI_ID:** AI-FUT-105  
**NAME:** Flanker occupies an empty adjacent strike tile  
**ROLE:** positioning / assassin  
**SOPHISTICATION:** T6 (POS-01 / ROL-03; SYS-87)  
**DECISION_RULES:** After SYS-87, T2+ knights prefer a reachable empty side/rear adjacent tile over a frontal `stepToward`. Rear = opposite the majority of living allies (cheap pack axis, not a search tree). Then adjacent melee / kit (SYS-05). T0 may still `stepToward`. Do not walk onto lava to “get the rear” unless POS-04 says so. Do not ignore occupancy.  
**SCORING_MODEL:** `U(sideAdj) > U(frontAdj) > U(farFlank)`; ally-occupied adjacent −∞.  
**SPELL_REQUIREMENTS:** Melee / `physical_attack`.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.4` for explicit flanker role (knight). Not `aiTier >= 3`.  
**ENEMY_ARCHETYPES:** flanker, assassin.  
**PLAYER_COUNTERPLAY:** Face them into a corner; occupy both side tiles.  
**EDGE_CASES:** Diagonal candidate still must be in 4-dir `reachable` (SYS-15). Lookahead after occupying adjacent is SYS-85.  
**IMPLEMENTATION_COMPLEXITY:** Low after SYS-87.  
**TEST_SCENARIOS:** Knight south of player, east tile free, west occupied by rook → dest east adjacent, then next turn melee.  
**STATUS:** PROPOSED

### AI-FUT-106

**AI_ID:** AI-FUT-106  
**NAME:** Pack spacing vs player AoE (no duplicate clustering)  
**ROLE:** team / positioning  
**SOPHISTICATION:** T6 (POS-06 / TEM-06; SYS-83)  
**DECISION_RULES:** Player Nova / Inferno / Lifesteal Nova are public kit ids when shown on the HUD/strip. T3+ pack members (not berserker) add a penalty when Chebyshev to the nearest *allied* body is ≤ the public blast radius (frost-nova `areaRadius` 2, `spellData.ts` **543–544**). Use `combatants.filter(side === "enemy")` (SYS-83), not `allyCount`. Do not peek selected spell. Missing public AoE in the player kit ⇒ term 0 (do not assume Nova). T0 packs may clump.  
**SCORING_MODEL:** `U(dest) -= wCluster * 1[minAllyChebyshev <= publicRadius]`.  
**SPELL_REQUIREMENTS:** None on the enemy; player AoE metadata only.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.7` when the player’s assigned spells include a `hitsMultiple` / `aoe` / `areaRadius >= 1` id. Unbounded: tighter `wCluster` on higher `peer`, not a new integer tier.  
**ENEMY_ARCHETYPES:** caster, artillery, healer, protector; berserker off.  
**PLAYER_COUNTERPLAY:** Bring Nova; they spread. Leave Nova at home; they may clump.  
**EDGE_CASES:** Two-tile corridor may force clump — occupancy −∞ beats spacing. Do not walk onto a portal to spread (SYS-48 / SYS-58).  
**IMPLEMENTATION_COMPLEXITY:** Medium (enumerator + public player-kit read, SYS-10).  
**TEST_SCENARIOS:** Player has frost-nova radius 2, two bishops adjacent → second bishop dest Chebyshev ≥ 3 from the first if a tile exists. Player kit has only Strike → term 0.  
**STATUS:** PROPOSED

### AI-FUT-107

**AI_ID:** AI-FUT-107  
**NAME:** Survival vs aggression from the visible HP bar, not a level table  
**ROLE:** advanced  
**SOPHISTICATION:** T6 (ADV-07 / ADV-08; SYS-84 / POS-02)  
**DECISION_RULES:** Self-retreat already uses `hpFrac` vs `ENEMY_RETREAT_HP_PCT` 0.3 (caster **928–944**). That gate is global, not a module, and `kind: "skip"` still dest-commits (POS-02). After SYS-84, a T4+ module may **reweight** the same public fraction: kiter/caster raise retreat / kite (FUT-100) as own `hpFrac` falls; charger/berserker invert (still press, sacrifice log is not `spell-sacrifice` — FUT-29). Do not key this on `aiTier` or absolute level. Do not peek player click. Player HP term is FUT-102’s bar, not leftover stamp.  
**SCORING_MODEL:** `U(survive) += wOwn*(1 - ownHpFrac)` for kiter; charger uses `-wOwn*(1 - ownHpFrac)` (press). Illegal dest −∞.  
**SPELL_REQUIREMENTS:** Legal kit id or hold. No Fire Bolt.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.85`. A remnant at any absolute level may omit it; a peer elite may attach it.  
**ENEMY_ARCHETYPES:** kiter, caster, artillery (respect); charger, berserker, assassin (invert).  
**PLAYER_COUNTERPLAY:** Chip a kiter to 25%; they give ground. Chip a berserker; they do not.  
**EDGE_CASES:** `kind: "skip"` retreat must not adjacent-Bolt (SYS-05). Enrage 6× (spectacle SYS-12) is not this module.  
**IMPLEMENTATION_COMPLEXITY:** Low after POS-02 kind fix + SYS-84.  
**TEST_SCENARIOS:** Bishop 20% HP, FUT-107 on, player not adjacent → dest steps away, no `e-firebolt`. Same bishop T0 / module off → may still frost. Player 400, remnant 20% HP peer-ratio low → module may be off.  
**STATUS:** PROPOSED

---

## 5. Spell-awareness contract (reminder)

Unchanged: no profile + apply ⇒ not in kit, not in elite extras, `usableByEnemy` treated as false in the enumerator.

Still `usableByEnemy: true` without a working decide+apply pair (do not give these to AI until FUT-22 / FUT-25 / FUT-31 / apply):

`spell-swap`, `spell-mark`, `spell-sacrifice`, `spell-lifesteal-nova`, `spell-enrage`, `spell-haste`, `spell-weaken`, `spell-expose`, `spell-drain-courage`, `spell-cursed-wound`, `spell-shadow-veil`, `spell-frost-nova`, `spell-inferno` (DoT `damage: 0`), `starter-poison` / `spell-venom-strike`, `starter-shield` / `spell-iron-skin`.

Keep `usableByEnemy: false` until profiled: barrier, mirror, timestep, rallying-cry, sentinel/bomber/wisp summons.

`starter-heal` is self-only (`range: 0`). It cannot satisfy ROL-04 ally heal. SYS-13 must keep that legal for **self**.

`summon-dire-wolf` / `summon-archer` are `usableByEnemy: true` with range 2. SYS-86 is the profile: ground dest in range. Do not treat midpoint spawn as “understanding” the spell.

Apply now has a pack DoT writer (WX **16609–16625**) and a no-damage debuff writer (**16671–16700**). That does **not** authorize Inferno/poison/slow in kits. Decide still scores `damage <= 0` as 0 (SYS-02 / SYS-39). Open #842’s DoT-before-melee gate is apply honesty for *hostile kits after they exist*, not a reason to emit Inferno from `buildEnemyKit`.

Kit frost staying at spellbook damage (SYS-72) is **not** a reason to assign Inferno. SYS-79’s kit-pick still requires `damage > 0`. Frost range is 4 (`spellData.ts` 131).

---

## 6. Implementation order (this increment)

Do not start FUT-102+ first. Do not start T6+ from earlier increments before P0 honesty.

1. SYS-05 (Fire Bolt WX **16712**, AP/MP debit, ally heal WX **16648**) — still P0. This also removes the `level/5` bolt cheat (SYS-72).  
2. SYS-01 — replace `computeAITier` (`combatMath.ts` 36–52) and the `aiTier >= 5/10` gates (WX **15508** / **15595**).  
3. SYS-73 — drop the 999 spawn ceiling so SYS-01 `peer` still works at high player level.  
4. SYS-13 + SYS-06 + SYS-11 + SYS-20 — side-aware legality. `enemyCastGeometryOk` is not sufficient.  
5. SYS-78 then **SYS-84** + FUT-102 — HUD max on the row **and** the scorer reads it.  
6. SYS-79 + FUT-96 — kit-pick without origin-range; move-then-cast works.  
7. SYS-80 + FUT-97 — rank with the kit id.  
8. SYS-81 then **SYS-85** + FUT-103 — stamp **and** geometry on retarget.  
9. **SYS-86** + **SYS-89** + FUT-104 — legal summon dest + kit fallthrough; rewrite FUT-23 chance.  
10. **SYS-87** + FUT-105 — flank strike tiles.  
11. **SYS-88** — prefer merge/follow **#842**; do not double-patch spawn. Then SYS-17 delete `name.includes`.  
12. FUT-106 (AoE spacing) + FUT-107 (survival weights).  
13. Parent T2–T5 roles / team / adaptive; remaining FUT-01…101.

Each slice: `engine/enemyAI*.test.ts`, zero WX drive-by, no RAF / map gen / turn order / damage-formula edits unless a **named** follow-up. Scoring **reads** RES/SR/CHC; it does not change `calcScaledDamage`.

---

## 7. Extra test scenarios

| ID | Setup | Expect |
| :--- | :--- | :--- |
| TS-LOWHP | Player 40/120, `effectiveHp` unset | `scoreTargets` `lowHp === 2/3`, not 0 (SYS-84). |
| TS-LOWHP0 | Full 120/120 | `lowHp === 0`. |
| TS-LOOKLOS | Frost legal on player, 1 HP wisp behind wall | Stay on player (SYS-85). |
| TS-LOOKMELEE | Knight adjacent to player, wisp 4 tiles 1 HP | Melee player, not skip (SYS-85). |
| TS-SUMRNG | Summoner (0,0), midpoint (6,3), wolf range 2 | Dest Chebyshev ≤ 2 or skip; no spawn at (6,3) (SYS-86). |
| TS-FLANKADJ | Knight, empty adjacent side tile reachable | Dest may occupy it (SYS-87). |
| TS-HOSTAI | `spawnEnemySummonUnit` wolf | `summonAI === "hunter"` after SYS-88 / #842; not `"wolf"`. |
| TS-SUMFALL | Overlay on CD, bishop kit frost in range | `decideEnemyAction` cast, not skip (SYS-89). |
| TS-PEER44 | Player 44 vs remnant `peer < 0` | Overlay not forced 1.0 (SYS-89 / FUT-23 rewrite). |
| TS-CLUSTER | Player has frost-nova r=2, two bishops | Second dest Chebyshev ≥ 3 if a tile exists (FUT-106). |
| TS-BOLT3 | Failed frost, Chebyshev 1 | Crush or skip; never `e-firebolt` (WX 16712). |
| TS-PEER3K | Player 3000, enemy 3000 | Not forced T5; remnant 400 stays low tier (FUT-92). |

Parent and 2026-09-01…10-21 TS-* rows still apply (line numbers in §1.2). Frost examples use live range **4**.

---

## 8. Mapping (new gaps → ids)

| Request / gap | Primary AI_ID |
| :--- | :--- |
| `wLowHp` dead (`effectiveHp ?? hp`) | AI-SYS-84 / AI-FUT-102 |
| Lookahead/spill retarget without `aiCanCast` | AI-SYS-85 / AI-FUT-103 |
| Summoner midpoint teleport (wolf range 2) | AI-SYS-86 / AI-FUT-104 |
| `stepFlank` tackle = all adjacent tiles | AI-SYS-87 / AI-FUT-105 |
| Hostile `summonAI = pieceType` (open #842) | AI-SYS-88 |
| `isSummoner` skip eats the piece kit (FUT-23 p=1) | AI-SYS-89 / AI-FUT-104 |
| Pack spacing vs public player AoE | AI-FUT-106 |
| Survival vs aggression from visible `hpFrac` | AI-FUT-107 |

T0–T5 requested list (positioning, targeting, resources, roles, team, adaptive) remains parent §19. Nothing in that list is implemented. Higher-level enemies still get harder from **modules on the sigmoid** and from **honest relative spawn** (SYS-73 / FUT-92 / SYS-89), not from `computeAITier(enemyLevel)`, not from a kit-less bolt, not from a low-HP term that is always zero, and not from a summoner overlay that idles every pack after player 44.

Requested capability → already-catalogued parent id (unchanged; still **PROPOSED**):

| Request | Parent id |
| :--- | :--- |
| maintain optimal range / retreat / approach vulnerable / avoid hazards / exploit terrain / avoid AoE clustering / protect allies / escape routes | POS-01…08 (spacing = FUT-106) |
| low-HP / high-threat / support / summons / resistance / kill / strategic | TGT-01…07 (bar = SYS-84) |
| AP combinations / move-then-attack / attack-then-retreat / sequencing / cooldown / waste | RES-01…06 |
| tank … protector | ROL-01…10 (summoner = SYS-86/89) |
| focus fire / protect support / exploit debuffs / avoid duplicate debuffs / coordinated AoE / formations / retreat toward support | TEM-01…07 (legal retarget = SYS-85) |
| estimate threat / punish positioning / adapt HP / adapt AP-MP / summons / status / own HP / survival vs aggression | ADV-01…08 (FUT-107) |

Every row above is **STATUS: PROPOSED**. No production AI in this change.
