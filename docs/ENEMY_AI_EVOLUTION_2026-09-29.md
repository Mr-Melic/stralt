# Advanced Enemy AI Evolution — 2026-09-29 increment

**Status:** PROPOSED (design only; no production code in this change)  
**Date:** 2026-09-29  
**Parent catalog:** [`ENEMY_AI_EVOLUTION.md`](./ENEMY_AI_EVOLUTION.md) (T0–T5)  
**Prior increments:** [`ENEMY_AI_EVOLUTION_2026-09-01.md`](./ENEMY_AI_EVOLUTION_2026-09-01.md) · [`ENEMY_AI_EVOLUTION_2026-09-02.md`](./ENEMY_AI_EVOLUTION_2026-09-02.md) · [`ENEMY_AI_EVOLUTION_2026-09-21.md`](./ENEMY_AI_EVOLUTION_2026-09-21.md) (open PR #351; SYS-22…32, FUT-36…47 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-22.md`](./ENEMY_AI_EVOLUTION_2026-09-22.md) (open PR #416; SYS-33…35, FUT-48…53 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-23.md`](./ENEMY_AI_EVOLUTION_2026-09-23.md) (open PR #458; SYS-36…41, FUT-54…59 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-24.md`](./ENEMY_AI_EVOLUTION_2026-09-24.md) (open PR #506; SYS-42…47, FUT-60…65 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-25.md`](./ENEMY_AI_EVOLUTION_2026-09-25.md) (open PR #565; SYS-48…53, FUT-66…71 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-26.md`](./ENEMY_AI_EVOLUTION_2026-09-26.md) (open PR #633; SYS-54…59, FUT-72…77 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-27.md`](./ENEMY_AI_EVOLUTION_2026-09-27.md) (open PR #689; SYS-60…65, FUT-78…83 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-28.md`](./ENEMY_AI_EVOLUTION_2026-09-28.md) (open PR #723; SYS-66…71, FUT-84…89 — **do not re-number**)  
**Implementer ledger:** [`automation/ACTION_IDS_AEE_2026-09-29.md`](./automation/ACTION_IDS_AEE_2026-09-29.md)

This increment re-reads the live engine one day after the 2026-09-28 catalog. SYS-01…71 and FUT-01…89 stay **PROPOSED** on their own files; they are **not** re-filed here. New work is: kit-spell damage that does **not** scale with `enemy.level` while the kit-less Crush/Fire Bolt fallback **does**; the spawn table’s absolute 999 ceiling (relative difficulty terminates); Mirror reflect as a fourth HP pipeline; Windstorm miss still arming kit cooldown; player `maxHp` stamped from leftover HP; Adaptive Resistance’s private last-cast buffer.

Stralt has **no character level cap**. Nothing here maps `if (level >= X) sophistication = Y`. Tiers remain conceptual. Eligibility remains the parent §4 sigmoid (`peer = log2(enemy.level / player.level)` plus pack/boss/modifier terms). A year-later peer fight at any absolute level can attach a new module without raising a cap. **SYS-73 is the spawn-side version of that rule:** `pickEnemyLevelFromTiers` must not invent a last band.

**Hard rules (unchanged):** no cheat, no hidden player information, no ignored LoS/range/AP/MP, no unbounded search, no kit-less Fire Bolt, no `instantKill`, no betrayal-as-difficulty, no name-based spell heuristics, no production AI in this change.

Open production PRs that already slice honesty (do **not** re-file the ids):

| Open PR | Catalog id | What it changes |
| :--- | :--- | :--- |
| [#495](https://github.com/Mr-Melic/stralt/pull/495) (draft) | AI-SYS-34 | Apply `targetCell` from `playerPositionRef`. |
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

This docs PR does **not** edit [`ENEMY_AI_EVOLUTION.md`](./ENEMY_AI_EVOLUTION.md) (open PR #351 unions that header). Unique files only.

---

## 1. Re-read (2026-09-29)

All line numbers are from this checkout. Re-read them before implementing.

### 1.1 Combat-parity still is not sophistication

Unchanged from 2026-09-21…28: `enemyCastGeometryOk` (`targeting.ts` 166–177), `aiCanCast` (`enemyAI.ts` 320–332), Frozen walk *rate* (`enemyWalkMp.ts`), `playerCastPlan.ts` (player only), summon leftover-AP `reevaluate` (WX 15257+). These are **not** SYS-05 / SYS-13 / SYS-01.

`aiCanCast` is still unused by healer (1099–1100) and guardian (2131–2133). That remains **AI-SYS-23** on the 09-21 increment.

`enemyAI.ts` still has **zero** reads of `currentAp`, `currentMp`, or `apCost`. Pack walk budget is still `ENEMY_REACHABLE_STEP_BUDGET = 3` (`gameConstants.ts` 166; `computeReachable` 377–378). `getEffectiveStat` is declared on `DecideEnemyContext` (275–276) and **never read** by `estimateDamage` / `scoreTargets` / any `decide*`.

Do **not** feed `spellRangeBase` into AI (`targeting.ts` 128–137). That fork is honesty: player upgrade `maxRange` is not an enemy kit field. Do **not** treat `enemyCastGeometryOk` as SYS-13 complete (Chebyshev + default-on LoS only; player live gate still has `minRange`, `linear`, `diagonal`, `freeCells`, Manhattan ground, player-only `ally`).

### 1.2 Line numbers vs 2026-09-28 (P0 sites did not move)

| Fact | 2026-09-28 | Live (2026-09-29) |
| :--- | :--- | :--- |
| `computeAITier` | `combatMath.ts` 36–52 | **unchanged** |
| `pickEnemyLevelFromTiers` `maxTier = floor(999 / ts)` | (not called out) | `combatMath.ts` **54–58** (SYS-73) |
| `calcScaledDamage` ignores caster level | (not called out) | `combatMath.ts` **130–137** (`_casterLevel` unused) (SYS-72) |
| Spawn `aiTier` | WX 5823 | **5823** |
| Family second `computeAITier` | WX 5865 | **5865** |
| Kit `levelZone` object | WX 11920 | **11920** |
| Summoner chance unbounded | WX 11932–11943 | **11932–11943** |
| Player-summon empty occupied | WX 15156 | **15156** |
| Executor gate `side === "player"` | WX 14980 | **14980** |
| `aiTier >= 5` erratic | WX 15508 | **15508** |
| `aiTier >= 10` betrayal | WX 15595 | **15595** |
| Dest-commit clamp | WX 16416–16423 | **16416–16423** |
| Apply Chebyshev only | WX 16450–16456 | **16450–16456** |
| Pack→player SP×RES then `playerTakesDamage` | WX 16475–16537, 16566 | **unchanged** (SYS-66) |
| Mirror reflect HP write | (SYS-50 token only) | WX **16496–16528**; `enemyHpMap` **16511**; `activeEffects` not ref **16507** (SYS-74) |
| Windstorm miss then CD + `didAct` | miss 16491 | miss **16491**; cooldown **16640–16646**; `didAct = true` **16647** (SYS-75) |
| Self-heal `range === 0` | WX 16648 | **16648** |
| Fire Bolt `e-firebolt` | WX 16712 | **16712** |
| Pack melee private HP write | WX 16763–16766 | **16763–16766** |
| Strip AP=`level` + dummy ATK/RES/SP/CHC | WX 17402–17411 | **17402–17411** |
| Pack snapshot player `maxHp` | 16293–16301 | **`characterStats.maxHp ?? characterStats.hp`** (SYS-76) |
| HUD `maxHp` | (not called out) | WX **3400–3406** `useMemo` from level growth (not that snapshot) |
| `characterStats.maxHp` init | (not called out) | WX **3234** stamps `maxHp` from leftover `stats.hp` |
| `playerSpellTypeHistoryRef` | (not called out) | declared **1839**; written **17014–17019**; **unread by decide** (SYS-77) |
| `decideEnemyAction` | 1662–1707 | **1662–1707** |
| `pickBossKitSpell` `new Map()` | `useBossAI.ts` 169–173 | **unchanged** |
| `ENEMY_AI_TIER_GATES` | unread | still unread (`enemyAI.ts` comment only at **1422–1423**) |

P0 remains **AEE-2026-08-31-002** (Fire Bolt / apply honesty) then **AEE-2026-08-31-001** (`computeAITier`). Then 09-21…09-28 honesty. Then this file’s SYS-72…77. Do not start FUT-90+ first.

### 1.3 Still true — do not re-file (parent / 09-21…09-28)

- Zone-0 kits forever (`Math.floor(levelZone)` on an object). SYS-09.
- `scoreTargets` ignores `focusTargetId`. SYS-08 / AI-SYS-30.
- `estimateDamage` returns 0 when `spell.damage <= 0`. SYS-02 / SYS-39.
- Heal-first `inferArchetype` (447–452). SYS-04 / SYS-41.
- Hazard avoid only below 50% HP; ice/lava/spikes only (425–441). POS-04 / FUT-09 / FUT-59.
- Retreat / `reposition-los` `kind: "skip"` while dest-commit still moves. POS-02 / FUT-41 / SYS-58.
- Summoner chance hits 1.0 at player level 44. FUT-23.
- `ENEMY_AI_TIER_GATES` unread. SYS-01.
- Summon executor Chebyshev teleport MP. SYS-15 / 09-21 SYS-25.
- Family overlay second `computeAITier`. AI-SYS-29.
- `findKitSpell` assigned fallback (1737–1745). AI-SYS-32.
- Strip / `resolveEnemyApMp` uses `enemy.level` for AP/MP. SYS-54. Dummy combat stats SYS-69.
- Hostile summons skip the paid executor. SYS-55.
- Boss occupancy list empty. SYS-56.
- Erratic dest ignores portal/void/barrier. SYS-57.
- Dest-commit clamp-only. SYS-58.
- Pack/summon Plague+Void store ticks. SYS-60. Do not implement SYS-59’s “pack immunity.”
- Pack→player skips `applyDamageDealt`. SYS-61. Pack→summon does not (SYS-67).
- Pack dest-commit vs reserved. SYS-62.
- Shield Charm remaining is public. SYS-63 snapshot; spell-path soak is SYS-66.
- Enumerator `applyApCost`. SYS-64.
- Null Field vs non-DoT. SYS-65.
- Double RES on pack→player spells. SYS-66.
- `enemyTakesDamage` returns pre-mod `dmg`. SYS-67.
- Pack melee private write. SYS-68.
- Hidden crit. FUT-57.
- Paper Windstorm 30% player / 50% pack. SYS-70. FUT-21 / FUT-88.
- Fury / Blood Moon / Titan's path-specific. SYS-71 / FUT-89.
- Adjacent frost vs Crush pipeline pick. FUT-86 — **do not re-file**.
- `hasBresenhamLoS` still ignores combatant bodies. Do not propose an AI-only body-block LoS module.
- `engine/summonAI.ts` `runSummonAI` remains unused.

### 1.4 New honesty gaps (this increment)

1. **Kit-spell apply does not use `enemy.level`; the kit-less fallback does.** `calcScaledDamage` (`combatMath.ts` 130–137) takes `_casterLevel` and **never reads it** — only `1.03 ** spellUpgradeLevel`, and pack apply passes upgrade `0` (WX **16464–16468**). `estimateDamage` for a spell with `damage > 0` uses that helper (`enemyAI.ts` 501–508). Melee-null estimate uses `12 * max(1, level/5)` (**495–499**). The Fire Bolt / Crush fallback uses `fb.damage * max(1, enemy.level / 5)` (WX **16716–16720**). Late-game bishops therefore do **not** hit harder with frost as their level rises; they hit harder by falling into the **cheat bolt**. Sophistication must not be “keep Fire Bolt so damage scales.” SYS-72.

2. **Spawn difficulty has a last band.** `pickEnemyLevelFromTiers` sets `maxTier = Math.floor(999 / ts)` (`combatMath.ts` 54–58). With default `tierSize` 10 that is tier 99, levels ~991–1000. A player at 2000 still rolls enemies around 1000. Parent §4 `peer = log2(enemy.level / player.level)` then goes **negative**, so SYS-01 would attach T0 modules to “late game” packs even though the player has no cap. This is relative-difficulty termination by another name. Not `if (level >= X) tier = Y`, but it has the same end-state. SYS-73.

3. **Mirror reflect is a fourth HP pipeline.** SYS-66 (spell→player), SYS-67 (→summon via `enemyTakesDamage`), SYS-68 (melee→player). Consume-once Mirror (WX **16496–16528**) reflects `dmgAC` (pre-SP/RES packet, post-crit) through **only attacker RES** (`Number(enemy.res) * getStatModifier(enemy.id, "res", activeEffects)` — render `activeEffects`, **not** `activeEffectsRef.current` used at **16475–16490**). HP comes from `enemyHpMap[enemyId] ?? currentCombatant.hp` (**16511**), then `updateCombatant`. It does **not** call `enemyTakesDamage`, so Glass / Vampiric / Titan's (SYS-67) do not run. Later lava uses `liveCombatantHp` (**16879**), which was added because this stale-map write plus hazard used to revive the attacker (`battleSetup.ts` 227–231). Killable-now that assumes “if they frost me they die to Mirror” must use **this** formula, not SYS-67. SYS-74.

4. **Paper Windstorm miss still spends the kit.** Inside the `inRange && damage && spellDmg > 0` branch, a 50% miss logs and skips the hit (**16491–16495**) then **still** writes cooldown (**16640–16646**) and `didAct = true` (**16647**). The enemy will not Fire-Bolt that turn (good vs SYS-42) and will not retry the same id next turn. Decide does not know: `availableSpells` was filtered **before** this roll, and there is no AP debit (SYS-05). A T3 cooldown blackboard that treats “I still have frost” after a public miss line is a cheat. SYS-75.

5. **Pack snapshot player `maxHp` is not the HUD orb.** Battle-start `playerEntry.maxHp` uses the level-growth `useMemo` (WX **3400–3406**, assigned **11952**). Decide’s player combatant uses `characterStats.maxHp ?? characterStats.hp` (**16299–16300**). `characterStats.maxHp` is initialized from leftover `stats.hp` (**3234**) because backend `CharacterStats` has no max-HP field (`backend.d.ts` 201–214). Enter wounded → `maxHp === hp` → `scoreTargets` `lowHp` term is 0 for the player for the whole fight (until something else writes the field). TGT-01 is then blind. SYS-76.

6. **Adaptive Resistance is a hidden 5-deep buffer.** Comment at WX **1839** / **17014**: “Track player spell type for Adaptive Resistance AI.” `recordPlayerSpellType` appends `effectType` (**17016–17019**). `decideEnemyAction` never reads the ref. Using it as-is is **hidden information** (parent principle 6). Pacifist-run also flips from this writer — that is a challenge flag, not a pack scorer. SYS-77.

### 1.5 Tests

`enemyAI.charger.test.ts`, `enemyAI.geometry.test.ts`, `enemyAI.walkMp.test.ts` exist. Honesty (Fire Bolt, `calcScaledDamage` vs `level/5`, 999 spawn cap, Mirror `enemyHpMap`, Windstorm CD-on-miss, snapshot maxHp vs HUD, unread history ref) still has no decide/apply-layer tests. Do not treat geometry/walkMp as SYS-72…77.

### 1.6 What this increment does **not** change

Do not implement FUT-90+ before P0 honesty + 09-21…09-28 SYS slices. Do not touch RAF, map generation, turn order, or damage formulas (`calcScaledDamage` stays a **read** for scoring until a dedicated balance PR; this catalog does not ask to add `enemy.level` into it as a stealth stat stick). Do not copy #495 / #498 / #644…#659 / #700 / #709 into this docs-only change. Do not edit the parent catalog. Do not “fix late game” by keeping Fire Bolt. Do not attach Adaptive Resistance to the private ref.

---

## 2. Design additions (normative)

1. **Do not recycle 09-21…09-28 ids.** This file starts at SYS-72 / FUT-90.
2. **Kit EV and fallback EV are different functions.** Frost uses `calcScaledDamage(base, _, 0)`. Crush/Fire Bolt uses `damage * level/5`. Never one formula for both. Deleting Fire Bolt (SYS-05) removes the scaling cheat; it does **not** require changing `calcScaledDamage` in the same PR.
3. **Relative difficulty is unbounded on both sides.** SYS-01 sigmoid has no last tier. Spawn tables must not invent one (`maxTier` from 999). Kit width stays SYS-09 (relative, not `levelZone` object, not `player.level * k` capping at 1.0).
4. **Four pack→HP pipelines** (until apply is unified): SYS-66 spell→player, SYS-67 →summon, SYS-68 melee→player, SYS-74 Mirror self-hit. FUT-86 stays melee-vs-spell for **adjacent** choice; this file’s FUT-91 is kit-vs-fallback **formula**, not that choice.
5. **Public miss is a spent action.** After SYS-75, the kit id is on CD when the battle log shows Windstorm miss. TEM-05 / FUT-94 may read the **log**, not the private cooldown Map (still hidden).
6. **TGT-01 max HP is the HUD orb cap**, not leftover current HP.
7. **Last-cast adaptation is HUD-or-log only.** Private `playerSpellTypeHistoryRef` is off-limits until it is rendered.
8. **T6+ still stacks** on the parent enumerator. No integer tier table. No `if (aiTier >= 8)`.

---

## 3. System proposals (2026-09-29)

### AI-SYS-72

**AI_ID:** AI-SYS-72  
**NAME:** Kit-spell scaled damage ignores caster level; Crush/Fire Bolt fallback does not  
**ROLE:** system  
**SOPHISTICATION:** T1+ / honesty for TGT-06 / SYS-05  
**DECISION_RULES:** `calcScaledDamage` (`combatMath.ts` 130–137) is `max(1, floor(base * 1.03 ** upgrade))`. Pack apply calls it with upgrade `0` (WX **16464–16468**). `estimateDamage` for `spell.damage > 0` matches that (**501–508**). Null-spell melee estimate is `12 * max(1, level/5)` (**495–499**). Fallback Crush/Fire Bolt is `fb.damage * max(1, enemy.level/5)` (**16716–16720**). After this module: (1) killable-now for a kit frost uses `calcScaledDamage`, never `level/5`; (2) SYS-05 deletes `e-firebolt` so late-game damage cannot leak through a kit-less bolt; (3) do **not** add `enemy.level` into `calcScaledDamage` in an AI PR — that is a combat-math change and a stat stick, not a tactic. Physical kit `physical_attack` still has `damage > 0` and follows (1), not the Crush formula, until apply actually uses Crush for that id.  
**SCORING_MODEL:** `kitRecv = pipeline(calcScaledDamage(spell.damage, *, 0))`. `fallbackRecv` exists only while SYS-05 is unshipped and must be tagged illegal.  
**SPELL_REQUIREMENTS:** Damage/drain profiles with `damage > 0`. DoT-only stays SYS-02 / SYS-39.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always (honesty).  
**ENEMY_ARCHETYPES:** caster, artillery, generic; charger melee estimate is the null-spell branch.  
**PLAYER_COUNTERPLAY:** A level-200 bishop’s frost is still the spellbook number, not 200/5. If they Fire Bolt you, that is a cheat, not “elite AI.”  
**EDGE_CASES:** Enrage 6× still multiplies the scaled kit hit (WX 16467). Crit is FUT-57 (non-crit EV). Player `spellEngine` uses `ctx.spellLevels[spell.id]` as upgrade — enemies pass 0; do not copy player upgrade into pack EV.  
**IMPLEMENTATION_COMPLEXITY:** Low (split EV; delete bolt in SYS-05).  
**TEST_SCENARIOS:** Bishop level 50, frost `damage` 8, upgrade 0 → estimate 8 (or 1 after floor rules), not `8*(50/5)`. Same enemy, failed frost, `e-firebolt` still must not apply (SYS-05).  
**STATUS:** PROPOSED

### AI-SYS-73

**AI_ID:** AI-SYS-73  
**NAME:** Spawn table must not terminate at absolute level 999  
**ROLE:** system  
**SOPHISTICATION:** T0 authoring / SYS-01 companion  
**DECISION_RULES:** `pickEnemyLevelFromTiers` (`combatMath.ts` 54–58) computes `maxTier = Math.floor(999 / ts)` then clamps `chosenTier`. Comment at **102** (“no upper cap for last tier”) is false: the last tier is bounded. Player level is unbounded. After this module: enemy level is drawn from a **ratio / tier offset around the current player**, with no absolute ceiling. Variance (`levelVarianceChance`) stays a ±tier jitter, not a cap. Do not replace 999 with another constant (2000, 9999). Do not encode `if (playerLevel >= 900) aiTier = 10` as a workaround — `computeAITier` already does that (SYS-01) and must die. Admin `tierSize` remains legal.  
**SCORING_MODEL:** N/A (spawn). SYS-01 `relative = enemy.level / max(1, player.level)` only works if `enemy.level` can keep pace.  
**SPELL_REQUIREMENTS:** None.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always (authoring).  
**ENEMY_ARCHETYPES:** All overworld / dungeon packs using this picker. Bosses that use catalog `baseStats` are out of scope.  
**PLAYER_COUNTERPLAY:** A level-2000 player should still meet peer packs, not only 1000-stat remnants with tutorial modules.  
**EDGE_CASES:** `ts < 1` already becomes 1 (**56**). Seeded tests must not assume `level <= 1000`. Do not raise `calcEnemyMaxHp` in this slice.  
**IMPLEMENTATION_COMPLEXITY:** Low (drop `maxTier` clamp; keep weighted ±tier).  
**TEST_SCENARIOS:** `playerLevel = 2500`, `tierSize = 10` → returned enemy level is near 2500 ± configured tier offsets, not forced ≤ 1000. `playerLevel = 5` still can roll adjacent-tier 1–20.  
**STATUS:** PROPOSED

### AI-SYS-74

**AI_ID:** AI-SYS-74  
**NAME:** Mirror reflect is its own HP pipeline (`dmgAC`, attacker RES, `enemyHpMap`)  
**ROLE:** system  
**SOPHISTICATION:** T1+ / honesty for SYS-50 / SYS-66 / SYS-67  
**DECISION_RULES:** When `consumePlayerMirror` succeeds (WX **16496–16500**), apply uses `mirrorDmg = max(1, round(dmgAC * (1 - enemy.res * getStatModifier(id,"res", activeEffects)/100)))` (**16501–16510**). `dmgAC` is post-crit raw, **before** player SP×RES. Modifier list is render `activeEffects`, not `activeEffectsRef.current` (pack SP/RES at **16478–16490** uses the ref). Store HP starts from `enemyHpMap` (**16511**), not `liveCombatantHp`. `enemyTakesDamage` is skipped → no Glass/Titan's on the reflected packet (SYS-67 does not apply). After this module: (1) EV for “they die if they frost a live Mirror” uses this formula; (2) do not score Glass ×2 on the reflect; (3) unifying into `enemyTakesDamage` must then follow SYS-67 and **delete** the `enemyHpMap` write; (4) RES shreds that exist only on the ref may not apply today — do not score them until apply reads the ref (open #658). SYS-50 (token invisible to decide) stays; this is the **apply math**.  
**SCORING_MODEL:** `reflectRecv = max(1, round(critRaw * (1 - visEnemyRes/100)))` with visEnemyRes from the combatant, not strip 0 (SYS-69). Default killableNow uses non-crit (FUT-57).  
**SPELL_REQUIREMENTS:** Single-target non-AoE (the consume guard).  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always when the public Mirror token is up.  
**ENEMY_ARCHETYPES:** caster, artillery.  
**PLAYER_COUNTERPLAY:** Mirror still dumps their crit packet into them with one RES pass, not your double-RES frost.  
**EDGE_CASES:** AoE / `hitsMultiple` skip consume (**16497–16498**). Pack melee does not consume Mirror (SYS-68 path). Hazard after dest uses `liveCombatantHp` (**16879**) — already the post-reflect store if `updateCombatant` ran.  
**IMPLEMENTATION_COMPLEXITY:** Low (document + tests; do not change reflect math in this catalog).  
**TEST_SCENARIOS:** Mirror up, frost scaled 40, no crit, enemy RES 50 → reflect 20, not SYS-66’s 10 (double player RES) and not Glass ×2. `activeEffects` empty, ref has RES shred → today’s apply ignores shred (do not score it).  
**STATUS:** PROPOSED

### AI-SYS-75

**AI_ID:** AI-SYS-75  
**NAME:** Windstorm miss still writes kit cooldown and `didAct`  
**ROLE:** system  
**SOPHISTICATION:** T1+ / honesty for SYS-70 / RES-05  
**DECISION_RULES:** Pack miss (WX **16491–16495**) does not return from the `damage > 0` branch. Cooldown is set if `chosenSpell.cooldown > 0` (**16640–16646**). `didAct = true` (**16647**) so SYS-42 fallback Crush/Fire Bolt does not run. After this module: enumerator next turn must treat that id as on CD **iff** apply would have written it (same as a hit). Decide today cannot see the upcoming roll (FUT-57 class — do not assume miss). After a **public** miss log line, pack mates and the same actor next turn must not plan as if the id were ready. Do not skip writing CD “so they can retry” — that would be a cheat relative to live apply. AP is still not spent (SYS-05 / SYS-64); do not invent an AP debit in a Windstorm-only patch.  
**SCORING_MODEL:** This turn: killableNow non-miss (SYS-70 / FUT-88). Next turn: id absent from `availableSpells` after a miss **or** a hit.  
**SPELL_REQUIREMENTS:** Ranged kit ids with `cooldown > 0`. `cooldown` 0/undefined → miss still sets `didAct` but no Map write.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always when Windstorm is announced; CD-on-miss is also true if a future miss source is added.  
**ENEMY_ARCHETYPES:** caster, artillery.  
**PLAYER_COUNTERPLAY:** Their frost can miss and still leave them without that spell next turn.  
**EDGE_CASES:** Mirror consume is `else if` after miss — a miss does **not** also reflect. Fire Bolt miss (**16729**) is a different branch (no kit CD).  
**IMPLEMENTATION_COMPLEXITY:** Low (document apply; wire CD into the next snapshot — already how hits work).  
**TEST_SCENARIOS:** Frost `cooldown: 2`, Windstorm miss → next decide `availableSpells` lacks frost. Miss + `didAct` → no `e-firebolt` that turn.  
**STATUS:** PROPOSED

### AI-SYS-76

**AI_ID:** AI-SYS-76  
**NAME:** Player max HP for scoring is the HUD orb cap, not leftover `stats.hp`  
**ROLE:** system  
**SOPHISTICATION:** T1+ / honesty for TGT-01 / TGT-06  
**DECISION_RULES:** HUD / heals / battle-start `playerEntry` use `maxHp` from `100 * (1 + (level-1)*growth)` (WX **3400–3406**, **11952**). Pack decide snapshots `maxHp: characterStats.maxHp ?? characterStats.hp` (**16299–16300**). Init stamps `maxHp` from leftover `s.hp` (**3234**) because canister `CharacterStats` has no max field. After this module: the player `AICombatant.maxHp` is the same number `vitalsOrbCaps` / the top bar use. `hpFrac` / `lowHp` / `killableNow` use that cap. Do not read a hidden true-max that the HUD does not show. Do not use `characterStats.hp` as max when wounded. Summon `maxHp` stays the combatant field (already seeded).  
**SCORING_MODEL:** `lowHp = 1 - hp / hudMaxHp`. KillableNow vs player HP unchanged (current HP is public).  
**SPELL_REQUIREMENTS:** None.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always.  
**ENEMY_ARCHETYPES:** All that call `scoreTargets`.  
**PLAYER_COUNTERPLAY:** Enter a fight at 40/120 HP; bishops should see a wounded player, not a “full” 40/40.  
**EDGE_CASES:** `?? characterStats.hp` makes missing max look full. After a mid-fight heal to the useMemo cap, `hp` can exceed stamped `maxHp` → `hpFrac` clamps to 1 (`enemyAI.ts` 335–337) and **hides** remaining wound relative to HUD if stamp is low, or looks overfull.  
**IMPLEMENTATION_COMPLEXITY:** Low (snapshot field).  
**TEST_SCENARIOS:** Fixture HUD max 120, leftover stamp maxHp 40, hp 40 → lowHp > 0. Fixture full 120/120 → lowHp 0.  
**STATUS:** PROPOSED

### AI-SYS-77

**AI_ID:** AI-SYS-77  
**NAME:** `playerSpellTypeHistoryRef` is not a legal Adaptive Resistance input  
**ROLE:** system  
**SOPHISTICATION:** T4 authoring / ADV-01 honesty  
**DECISION_RULES:** WX **17014–17019** keeps the last five `effectType` strings for “Adaptive Resistance AI.” Decide never reads it. Parent principle 6: no hidden player information. After this module: pack/boss must **not** consume this ref. Legal sources: (a) the last spell name/type already printed on the battle log, (b) a HUD widget that shows the same last-N list the ref holds. Until (b) exists, last-cast modules (FUT-90) may use **one** public log line, not a five-deep private ring. Pacifist-run may keep reading the writer — that is a challenge flag on **player** actions, not enemy sophistication. Do not invent SR-bias from `effectType === "damage"` on a buffer the player cannot inspect.  
**SCORING_MODEL:** Hidden buffer ⇒ term 0. Public last type ⇒ FUT-90.  
**SPELL_REQUIREMENTS:** None until a profiled SR/physical kit exists (FUT-08).  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always (honesty). Attach FUT-90 via SYS-01 when a public source exists.  
**ENEMY_ARCHETYPES:** T4+ casters that would bias SR vs RES.  
**PLAYER_COUNTERPLAY:** If Adaptive Resistance is on the bar, you can dummy a heal (FUT-07). If it is only a ref, they must not adapt.  
**EDGE_CASES:** Preview / highlight must not append (already `targeting.ts` 10). Attack Nearest that records a type is a public execute, not a hover.  
**IMPLEMENTATION_COMPLEXITY:** None until FUT-90 (do-not-wire).  
**TEST_SCENARIOS:** Grep `decideEnemyAction` / `decideSummonAction` / `useBossAI` for `playerSpellTypeHistoryRef` → zero reads. Fixture five-deep “damage” in the ref, no HUD → no SR bias.  
**STATUS:** PROPOSED

---

## 4. T6+ reusable modules (2026-09-29)

Attach via parent §4 sigmoid. Stack; do not replace T0–T5 or FUT-01…89. Do not re-file FUT-86 (adjacent melee vs frost **pipeline**).

### AI-FUT-90

**AI_ID:** AI-FUT-90  
**NAME:** Adaptive resistance from public last-cast type only  
**ROLE:** advanced  
**SOPHISTICATION:** T6 (ADV-01 / TGT-05; SYS-77)  
**DECISION_RULES:** When the battle log or a HUD chip shows the player’s last resolved `effectType` / damage school, pack casters may bias **visible** SR vs RES / physical vs magic using SYS-10 fields (not strip dummy, SYS-69). One public event, not a five-deep private ring (SYS-77). No pending click. No preview. If the last public cast was a heal/buff, do not assume the next click is frost (FUT-07 dummy). Needs a physical or SR-aware profile in kit (FUT-08) or the bias is a dest/hold, not a spell swap.  
**SCORING_MODEL:** `+wSchool` on the legal dest/spell that the public last type is weak to; 0 if no public source.  
**SPELL_REQUIREMENTS:** Optional physical / magic pair in kit; otherwise positioning only.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 1.0` when a public last-cast surface exists. Never `if (level >= 80)`.  
**ENEMY_ARCHETYPES:** caster, artillery, disruptor.  
**PLAYER_COUNTERPLAY:** Show a dummy heal on the log; stand off-axis if they only reposition.  
**EDGE_CASES:** Pacifist-run using the same writer is not this module. Boss Mirror Sovereign combo replay stays FUT-34 / tagged ability.  
**IMPLEMENTATION_COMPLEXITY:** Low once HUD/log is the source; do not pass the ref into ctx.  
**TEST_SCENARIOS:** Public last type “damage”, kit frost + strike, SYS-10 SR 40 → prefer strike if both legal. Ref filled, HUD empty → no bias.  
**STATUS:** PROPOSED

### AI-FUT-91

**AI_ID:** AI-FUT-91  
**NAME:** Kit EV never uses Crush `level/5`  
**ROLE:** target / spell contract  
**SOPHISTICATION:** T6 (TGT-06; SYS-72)  
**DECISION_RULES:** `pickBestDamageSpell` / `killableNow` for a kit id with `damage > 0` uses `calcScaledDamage` only. The null-spell melee formula stays for **true melee** (no legal kit damage, adjacent). Do not mix: a bishop at dist 3 must not score frost as `8*(level/5)`. After SYS-05, the fallback formula is dead code and must not remain in EV. Enrage multiplies the kit scaled hit, not a second `level/5`.  
**SCORING_MODEL:** SYS-72 kitRecv then SYS-66/67/68/74 mitigation for that apply site.  
**SPELL_REQUIREMENTS:** Damage > 0 kit ids.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.3` (cheap; should be default once SYS-72 tests exist). Not a level gate.  
**ENEMY_ARCHETYPES:** caster, artillery, generic.  
**PLAYER_COUNTERPLAY:** High-level frost still the spellbook; their threat is dest + LoS + pack modules, not a hidden level multiplier.  
**EDGE_CASES:** `physical_attack` in a pawn kit is a kit id (SYS-72), not Crush, until apply uses the fallback pool for that kind.  
**IMPLEMENTATION_COMPLEXITY:** Low after SYS-72.  
**TEST_SCENARIOS:** Level 80 bishop, frost 8, dist 3 → killableNow vs HP uses ~8 then SYS-66, not 128.  
**STATUS:** PROPOSED

### AI-FUT-92

**AI_ID:** AI-FUT-92  
**NAME:** Unbounded peer spawn keeps module eligibility alive  
**ROLE:** system / authoring  
**SOPHISTICATION:** T6 (SYS-01 / SYS-73 / SYS-09)  
**DECISION_RULES:** After SYS-73, `relative` in parent §4 can stay near 0 at any absolute player level. Kit width (SYS-09) uses that relative score, not `levelZone` object NaN and not `0.12 + player.level * 0.02` (FUT-23). This module is the **composition rule**: a peer pack at level 10 and a peer pack at level 10_000 draw from the same sigmoid; extra T6+ modules stack by `mu`/`sigma`, never by a new integer cap.  
**SCORING_MODEL:** Parent §4 `P(attach M)` unchanged; spawn must feed honest `enemy.level`.  
**SPELL_REQUIREMENTS:** None.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always once SYS-73 ships.  
**ENEMY_ARCHETYPES:** All.  
**PLAYER_COUNTERPLAY:** Weak remnants still roll low `relative` and stay T0–T1 at any player level.  
**EDGE_CASES:** Boss `pack` term still +2. Do not attach T5 to trash because the player is “high level.”  
**IMPLEMENTATION_COMPLEXITY:** None beyond SYS-73 + SYS-01.  
**TEST_SCENARIOS:** Player 3000, enemy 3000, not boss → peer ~0, T2–T3 possible, T5 not forced. Player 3000, enemy 400 → peer negative, T0–T1.  
**STATUS:** PROPOSED

### AI-FUT-93

**AI_ID:** AI-FUT-93  
**NAME:** Survival vs aggression on the only legal lava cast tile  
**ROLE:** advanced / positioning  
**SOPHISTICATION:** T6 (ADV-08; POS-04 lift)  
**DECISION_RULES:** Dest-commit always ticks lava `8 + rng(0..7)` plus a 3-turn burn (WX **16874–16912**) even when HP > 50% (decide `filterHazardCandidates` only below 50%, **425–441**). When the **only** legal frost tile is lava, T4+ may compare (a) skip/hold, (b) walk lava then cast, (c) walk a safe tile and not cast. Use **visible** current HP vs expected lava + burn, not a hidden true-max. Kamikaze-on-detonate is exempt (existing). Do not peek the lava roll (FUT-57 class: use the public 8–15 band mean or the min 8 for killableNow-self).  
**SCORING_MODEL:** `U(lavaCast) = U(frost) - wSelf * E[lava+burn]`; hold if U < 0 and ADV-08 is attached. Default T0–T1 still walks.  
**SPELL_REQUIREMENTS:** Any legal cast from that tile.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.9` when a lava/spike key is on the map. Not `aiTier >= 6`.  
**ENEMY_ARCHETYPES:** caster, kiter, healer; berserker inverts (still presses).  
**PLAYER_COUNTERPLAY:** Stand so their only LoS tile is lava; T0 still walks, T6 may hold.  
**EDGE_CASES:** Ice landing applies MP-2 (**16913–16928**) that pack decide does not spend (SYS-07) — do not treat ice as lethal. Spikes 5–10 (**16929+**).  
**IMPLEMENTATION_COMPLEXITY:** Medium (needs enumerator of legal-cast tiles).  
**TEST_SCENARIOS:** Only LoS tile lava, caster 9 HP, E[lava] ≥ 8 → hold if module on. HP 80 → may walk. Berserker with module off/inverted → walks.  
**STATUS:** PROPOSED

### AI-FUT-94

**AI_ID:** AI-FUT-94  
**NAME:** Public Windstorm miss is a pack cooldown signal  
**ROLE:** team  
**SOPHISTICATION:** T6 (TEM-05; SYS-75)  
**DECISION_RULES:** After a battle-log “Paper Windstorm! … missed”, that actor’s kit id is on CD if SYS-75 would have written it. The next pack member this round (and that actor next turn) must not plan a TEM-01 focus that **requires** that frost. They may still melee, move, or use a different legal kit id. Do not read `enemyCooldownsRef` from another actor’s decide as hidden extra — either pass a **public** blackboard of last-missed ids (intent log already exists) or wait for the next snapshot filter (SYS-14/pack availableSpells).  
**SCORING_MODEL:** Missing id ⇒ not in the legal set. Focus target unchanged unless the only kill was that frost.  
**SPELL_REQUIREMENTS:** Cooldown-bearing ranged kit.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.7` when Windstorm is announced and allyCount ≥ 1.  
**ENEMY_ARCHETYPES:** synergistic T3+ packs.  
**PLAYER_COUNTERPLAY:** After their miss, you get a turn without that frost even if decide was written before the roll.  
**EDGE_CASES:** `cooldown` 0 → miss still `didAct` but id may be legal next turn. Do not share CD across different enemies’ same spell id unless apply actually shares the Map (it is per `enemyId`).  
**IMPLEMENTATION_COMPLEXITY:** Low after SYS-75 (next snapshot) / medium for same-round blackboard.  
**TEST_SCENARIOS:** Bishop A misses frost CD 2; Bishop B same round must not assume A’s frost is coming. A next turn: frost not in `availableSpells`.  
**STATUS:** PROPOSED

### AI-FUT-95

**AI_ID:** AI-FUT-95  
**NAME:** Low-HP target term uses HUD max, then pipeline killableNow  
**ROLE:** target  
**SOPHISTICATION:** T6 (TGT-01 / TGT-06; SYS-76)  
**DECISION_RULES:** `scoreTargets` `wLowHp` uses SYS-76 `hudMaxHp` for the player. KillableNow still uses **current** public HP and the correct pipeline (SYS-66/67/68/74, FUT-84/86). Do not treat 40/40 stamped leftover as full if the orb shows 40/120. Do not use strip dummy (SYS-69). Summons use their own `maxHp`.  
**SCORING_MODEL:** Parent weights; only the max-HP source changes.  
**SPELL_REQUIREMENTS:** None.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.4` (should be default with SYS-76).  
**ENEMY_ARCHETYPES:** All `scoreTargets` callers.  
**PLAYER_COUNTERPLAY:** Wounded entry actually draws harassment.  
**EDGE_CASES:** Effective HP overlay (`effectiveHp`) still optional; if missing, current hp vs HUD max.  
**IMPLEMENTATION_COMPLEXITY:** Low after SYS-76.  
**TEST_SCENARIOS:** HUD max 120, hp 40, stamp maxHp 40 → player outscores a 10/10 wisp on lowHp than today (today lowHp player = 0).  
**STATUS:** PROPOSED

---

## 5. Spell-awareness contract (reminder)

Unchanged: no profile + apply ⇒ not in kit, not in elite extras, `usableByEnemy` treated as false in the enumerator.

Still `usableByEnemy: true` without a working decide+apply pair (do not give these to AI until FUT-22 / FUT-25 / FUT-31 / apply):

`spell-swap`, `spell-mark`, `spell-sacrifice`, `spell-lifesteal-nova`, `spell-enrage`, `spell-haste`, `spell-weaken`, `spell-expose`, `spell-drain-courage`, `spell-cursed-wound`, `spell-shadow-veil`, `spell-frost-nova`, `spell-inferno` (DoT `damage: 0`), `starter-poison` / `spell-venom-strike`, `starter-shield` / `spell-iron-skin`.

Keep `usableByEnemy: false` until profiled: barrier, mirror, timestep, rallying-cry, sentinel/bomber/wisp summons.

`starter-heal` is self-only (`range: 0`). It cannot satisfy ROL-04 ally heal. SYS-13 must keep that legal for **self**.

Kit frost staying at spellbook damage (SYS-72) is **not** a reason to assign Inferno. Inferno still needs DoT EV + apply (SYS-39 / FUT-25).

---

## 6. Implementation order (this increment)

Do not start FUT-90+ first. Do not start T6+ from earlier increments before P0 honesty.

1. SYS-05 (Fire Bolt WX **16712**, AP/MP debit, ally heal WX **16648**) — still P0. This also removes the `level/5` bolt cheat (SYS-72).  
2. SYS-01 — replace `computeAITier` (`combatMath.ts` 36–52) and the `aiTier >= 5/10` gates (WX **15508** / **15595**).  
3. SYS-73 — drop the 999 spawn ceiling so SYS-01 `peer` still works at high player level.  
4. SYS-13 + SYS-06 + SYS-11 + SYS-20 — side-aware legality. `enemyCastGeometryOk` is not sufficient.  
5. SYS-72 + FUT-91 — split kit EV from melee `level/5`.  
6. SYS-66…71 as 09-28 (double RES, registry return, melee fork, strip dummy, Windstorm rates, Fury site).  
7. SYS-74 — Mirror pipeline; then FUT-66 (do not frost into public token) can use the right self-HP formula.  
8. SYS-75 + FUT-94 — CD-on-miss.  
9. SYS-76 + FUT-95 — HUD max HP.  
10. SYS-77 then FUT-90 — public last-cast only.  
11. FUT-92 (composition), FUT-93 (lava survival).  
12. Parent T2–T5 roles / team / adaptive; remaining FUT-01…89.

Each slice: `engine/enemyAI*.test.ts`, zero WX drive-by, no RAF / map gen / turn order / damage-formula edits unless a **named** follow-up (SYS-73 spawn clamp is spawn, not `calcScaledDamage`). Scoring **reads** RES/SR; it does not change `calcScaledDamage`.

---

## 7. Extra test scenarios

| ID | Setup | Expect |
| :--- | :--- | :--- |
| TS-KITLVL | Level 50 frost `damage` 8, upgrade 0 | EV 8 via `calcScaledDamage`, not 80. |
| TS-BOLT3 | Failed frost, Chebyshev 1 | Crush or skip; never `e-firebolt` (WX 16712). |
| TS-SPAWN999 | Player 2500, `tierSize` 10 | Enemy level near 2500, not ≤ 1000. |
| TS-MIRRORHP | Mirror up, frost 40, enemy RES 50, no crit | Reflect 20 from `dmgAC`; no Glass ×2. |
| TS-MIRREF | RES shred on ref only, `activeEffects` [] | Today’s reflect ignores shred; EV must match. |
| TS-WINDCD | Frost CD 2, Windstorm miss | Next `availableSpells` lacks frost; no Fire Bolt that turn. |
| TS-HUDMAX | HUD max 120, stamp maxHp 40, hp 40 | `lowHp` > 0. |
| TS-ADAPTREF | History ref five “damage”, no HUD | No SR bias in decide. |
| TS-LAVACAST | Only LoS tile lava, HP 9, FUT-93 on | Hold. |
| TS-PEER3K | Player 3000, enemy 3000 | Not forced T5; remnant enemy 400 stays low tier. |

Parent and 2026-09-01…28 TS-* rows still apply (line numbers in §1.2).

---

## 8. Mapping (new gaps → ids)

| Request / gap | Primary AI_ID |
| :--- | :--- |
| Kit frost ignores level; Fire Bolt uses `level/5` | AI-SYS-72 / AI-FUT-91 |
| `pickEnemyLevelFromTiers` 999 ceiling | AI-SYS-73 / AI-FUT-92 |
| Mirror reflect vs `enemyTakesDamage` | AI-SYS-74 |
| Windstorm miss writes CD + `didAct` | AI-SYS-75 / AI-FUT-94 |
| Snapshot `maxHp` from leftover HP | AI-SYS-76 / AI-FUT-95 |
| Hidden Adaptive Resistance buffer | AI-SYS-77 / AI-FUT-90 |
| Lava-only legal cast tile | AI-FUT-93 |

T0–T5 requested list (positioning, targeting, resources, roles, team, adaptive) remains parent §19. Nothing in that list is implemented. Higher-level enemies still get harder from **modules on the sigmoid** and from **honest relative spawn**, not from `computeAITier(enemyLevel)` and not from a kit-less bolt that scales while frost does not.
