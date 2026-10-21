# Advanced Enemy AI Evolution — 2026-10-21 increment

**Status:** PROPOSED (design only; no production code in this change)  
**Date:** 2026-10-21  
**Parent catalog:** [`ENEMY_AI_EVOLUTION.md`](./ENEMY_AI_EVOLUTION.md) (T0–T5)  
**Prior increments:** [`ENEMY_AI_EVOLUTION_2026-09-01.md`](./ENEMY_AI_EVOLUTION_2026-09-01.md) · [`ENEMY_AI_EVOLUTION_2026-09-02.md`](./ENEMY_AI_EVOLUTION_2026-09-02.md) · [`ENEMY_AI_EVOLUTION_2026-09-21.md`](./ENEMY_AI_EVOLUTION_2026-09-21.md) (open PR #351; SYS-22…32, FUT-36…47 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-22.md`](./ENEMY_AI_EVOLUTION_2026-09-22.md) (open PR #416; SYS-33…35, FUT-48…53 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-23.md`](./ENEMY_AI_EVOLUTION_2026-09-23.md) (open PR #458; SYS-36…41, FUT-54…59 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-24.md`](./ENEMY_AI_EVOLUTION_2026-09-24.md) (open PR #506; SYS-42…47, FUT-60…65 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-25.md`](./ENEMY_AI_EVOLUTION_2026-09-25.md) (open PR #565; SYS-48…53, FUT-66…71 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-26.md`](./ENEMY_AI_EVOLUTION_2026-09-26.md) (open PR #633; SYS-54…59, FUT-72…77 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-27.md`](./ENEMY_AI_EVOLUTION_2026-09-27.md) (open PR #689; SYS-60…65, FUT-78…83 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-28.md`](./ENEMY_AI_EVOLUTION_2026-09-28.md) (open PR #723; SYS-66…71, FUT-84…89 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-29.md`](./ENEMY_AI_EVOLUTION_2026-09-29.md) (open PR #804; SYS-72…77, FUT-90…95 — **do not re-number**)  
**Implementer ledger:** [`automation/ACTION_IDS_AEE_2026-10-21.md`](./automation/ACTION_IDS_AEE_2026-10-21.md)

This increment re-reads the live engine after a 22-day gap (last AEE increment 2026-09-29 / #804). SYS-01…77 and FUT-01…95 stay **PROPOSED** on their own files; they are **not** re-filed here. New work is: two player-`maxHp` snapshots (HUD on summon decide, leftover stamp on pack decide); `pickBestDamageSpell`’s current-origin range gate that makes documented move-then-cast dead; pack `scoreTargets(..., null)` ranking with Crush `level/5`; overkill spill trusting that Crush `killableNow` stamp; apply crit from spawn `enemy.chc` while the strip overwrites `chc: 2`; unused `allyCount`/`enemyCount` counting every store combatant including player summons.

Stralt has **no character level cap**. Nothing here maps `if (level >= X) sophistication = Y`. Tiers remain conceptual. Eligibility remains the parent §4 sigmoid (`peer = log2(enemy.level / player.level)` plus pack/boss/modifier terms). A year-later peer fight at any absolute level can attach a new module without raising a cap. SYS-73 (drop the spawn `999` ceiling) and FUT-92 (unbounded peer composition) stay the spawn-side half of that rule.

**Hard rules (unchanged):** no cheat, no hidden player information, no ignored LoS/range/AP/MP, no unbounded search, no kit-less Fire Bolt, no `instantKill`, no betrayal-as-difficulty, no name-based spell heuristics, no production AI in this change.

Open production PRs that already slice honesty (do **not** re-file the ids). GitHub shows **no** new combat-AI PRs after 2026-09-29; the 09-29 list still stands:

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

This docs PR does **not** edit [`ENEMY_AI_EVOLUTION.md`](./ENEMY_AI_EVOLUTION.md) (open PR #351 unions that header). Unique files only.

---

## 1. Re-read (2026-10-21) — what moved

All line numbers are from this checkout. Re-read them before implementing.

### 1.1 Combat-parity still is not sophistication

Unchanged from 2026-09-21…29: `enemyCastGeometryOk` (`targeting.ts` 166–177), `aiCanCast` (`enemyAI.ts` 320–332), Frozen walk *rate* (`enemyWalkMp.ts` 21–29), `playerCastPlan.ts` (player only), summon leftover-AP `reevaluate` (`summonExecutor.ts` 249–254). These are **not** SYS-05 / SYS-13 / SYS-01.

`aiCanCast` is still unused by healer (1099–1100) and guardian (2131–2133). That remains **AI-SYS-23** on the 09-21 increment.

`enemyAI.ts` still has **zero** reads of `currentAp`, `currentMp`, or `apCost`. Pack walk budget is still `ENEMY_REACHABLE_STEP_BUDGET = 3` (`gameConstants.ts` 166; `computeReachable` 377–378). `getEffectiveStat` is declared on `DecideEnemyContext` (275–276) and **never read** by `estimateDamage` / `scoreTargets` / any `decide*`.

Do **not** feed `spellRangeBase` into AI (`targeting.ts` 191–209 / `groundTileInRange`). That fork is honesty: player upgrade `maxRange` is not an enemy kit field. Do **not** treat `enemyCastGeometryOk` as SYS-13 complete (Chebyshev + default-on LoS only; player live gate still has `minRange`, `linear`, `diagonal`, `freeCells`, Manhattan ground, player-only `ally`).

### 1.2 Line numbers vs 2026-09-29 (P0 sites did not move)

| Fact | 2026-09-29 | Live (2026-10-21) |
| :--- | :--- | :--- |
| `computeAITier` | `combatMath.ts` 36–52 | **unchanged** |
| `pickEnemyLevelFromTiers` `maxTier = floor(999 / ts)` | `combatMath.ts` 54–58 | **unchanged** (SYS-73) |
| `calcScaledDamage` ignores caster level | `combatMath.ts` 130–137 | **unchanged** (SYS-72) |
| Spawn `aiTier` | WX 5823 | **5823** |
| Family second `computeAITier` | WX 5865 | **5865** |
| Kit `levelZone` object | WX 11920 | **11920** |
| Stale “10 random spells” comment | (implied) | WX **11915–11918** then kit assign |
| Summoner chance unbounded | WX 11932–11943 | **11932–11943** |
| Player-summon empty occupied | WX 15156 | **15156** (SYS-14) |
| Summon player `maxHp` | (not called out) | WX **15150** uses HUD `maxHp` (SYS-78) |
| Pack player `maxHp` leftover | WX 16299–16300 | **16300** `characterStats.maxHp ?? characterStats.hp` (SYS-76 / SYS-78) |
| HUD `maxHp` | WX 3400–3406 | **3400–3406** |
| `characterStats.maxHp` init | WX 3234 | **3234** |
| `aiTier >= 5` erratic | WX 15508 | **15508** |
| `aiTier >= 10` betrayal | WX 15595 | **15595**; `aliveAllies` = `getLiveCombatants` minus self (**15593**) |
| Dest-commit clamp | WX 16416–16423 | **16416–16423**; helper `enemyDestToCommit` (`battleSetup.ts` **394–405**) still occupancy-blind (SYS-58) |
| Apply `targetCell` render `playerPosition` | (SYS-34 / #495) | WX **16436–16438** |
| Apply Chebyshev only | WX 16450–16456 | **16450–16456** |
| Apply crit `enemy.chc ?? 2` | (not called out) | WX **16470–16472** (SYS-82) |
| Mirror reflect | WX 16496–16528 | **unchanged** (SYS-74) |
| Windstorm miss then CD + `didAct` | 16491 / 16640 / 16647 | **unchanged** (SYS-75) |
| Self-heal `range === 0` | WX 16648 | **16648** |
| Fire Bolt `e-firebolt` | WX 16712 | **16712** |
| Pack melee private HP write | WX 16763–16766 | still in the melee `else` after **16748** |
| Strip AP=`level` + dummy ATK/RES/SP/`chc: 2` | WX 17402–17411 | **17402–17411** (`chc: 2` at **17408**) |
| `playerSpellTypeHistoryRef` | declared 1839; write 17014–17019 | declared **1840**; write **17014–17019**; still unread by decide (SYS-77) |
| `decideEnemyAction` | 1662–1707 | **1662–1707** |
| `pickBestDamageSpell` origin-range filter | (not called out) | **555–573** (SYS-79) |
| Pack `scoreTargets(..., null)` | (not called out) | caster **947**, charger **1177**, flanker **1296**, berserker **1404**, generic **1493** (SYS-80) |
| `applyOverkillSpread` uses stamped `killableNow` | (SYS-19 retarget) | **707–709** (SYS-81) |
| `ctx.allyCount` / `enemyCount` | unused | still unused; pack fill **16338–16342** counts every living store row except self (SYS-83) |
| `pickBossKitSpell` `new Map()` | `useBossAI.ts` 169–173 | **169–173** |
| `ENEMY_AI_TIER_GATES` | unread | still unread (`enemyAI.ts` comment only at **1422–1423**) |

P0 remains **AEE-2026-08-31-002** (Fire Bolt / apply honesty) then **AEE-2026-08-31-001** (`computeAITier`). Then 09-21…09-29 honesty. Then this file’s SYS-78…83. Do not start FUT-96+ first.

### 1.3 Still true — do not re-file (parent / 09-21…09-29)

- Zone-0 kits forever (`Math.floor(levelZone)` on an object). SYS-09.
- `scoreTargets` ignores `focusTargetId`. SYS-08 / AI-SYS-30.
- `estimateDamage` returns 0 when `spell.damage <= 0`. SYS-02 / SYS-39.
- Heal-first `inferArchetype` (447–452). SYS-04 / SYS-41.
- Hazard avoid only below 50% HP; ice/lava/spikes only (425–441). POS-04 / FUT-09 / FUT-59 / FUT-93.
- Retreat / `reposition-los` `kind: "skip"` while dest-commit still moves. POS-02 / FUT-41 / SYS-58.
- Summoner chance hits 1.0 at player level 44. FUT-23.
- `ENEMY_AI_TIER_GATES` unread. SYS-01.
- Summon executor Chebyshev teleport MP. SYS-15 / 09-21 SYS-25.
- Family overlay second `computeAITier`. AI-SYS-29.
- `findKitSpell` assigned fallback (1737–1745). AI-SYS-32.
- Strip / `resolveEnemyApMp` uses `enemy.level` for AP/MP (`summonIntegration.ts` 195–209; WX 17404). SYS-54. Dummy combat stats SYS-69.
- Hostile summons skip the paid executor. SYS-55.
- Boss occupancy list empty. SYS-56.
- Erratic dest ignores portal/void/barrier. SYS-57.
- Dest-commit clamp-only (`enemyDestToCommit` is still just a grid clamp). SYS-58.
- Pack/summon Plague+Void store ticks. SYS-60. Do not implement SYS-59’s “pack immunity.”
- Pack→player skips `applyDamageDealt`. SYS-61.
- Pack dest-commit vs reserved. SYS-62.
- Shield Charm remaining is public. SYS-63 snapshot; spell-path soak is SYS-66.
- Enumerator `applyApCost`. SYS-64.
- Null Field vs non-DoT. SYS-65.
- Double RES on pack→player spells. SYS-66.
- `enemyTakesDamage` returns pre-mod `dmg`. SYS-67.
- Pack melee private write. SYS-68.
- Hidden crit *roll*. FUT-57. **Apply CHC source vs strip is SYS-82** (this file).
- Paper Windstorm 30% player / 50% pack. SYS-70. FUT-21 / FUT-88.
- Fury / Blood Moon / Titan's path-specific. SYS-71 / FUT-89.
- Adjacent frost vs Crush pipeline pick. FUT-86 — **do not re-file**.
- Kit frost ignores `enemy.level`; Fire Bolt uses `level/5`. SYS-72 / FUT-91.
- Spawn `maxTier` from 999. SYS-73 / FUT-92.
- Mirror reflect fourth HP pipeline. SYS-74.
- Windstorm miss writes CD + `didAct`. SYS-75 / FUT-94.
- Pack snapshot leftover `maxHp`. SYS-76 / FUT-95. **The summon/pack fork is SYS-78.**
- Adaptive Resistance private ref. SYS-77 / FUT-90.
- `hasBresenhamLoS` still ignores combatant bodies. Do not propose an AI-only body-block LoS module.
- `engine/summonAI.ts` `runSummonAI` remains unused.

### 1.4 New honesty gaps (this increment)

1. **Two brains, two player max-HP numbers.** Summon decide snapshots `maxHp: maxHp` — the HUD `useMemo` at WX **3400–3406** (WX **15150**). Pack decide still snapshots `characterStats.maxHp ?? characterStats.hp` (**16300**). SYS-76 already requires HUD cap for pack `scoreTargets`. Until both paths share one vitals builder, TGT-01 / FUT-95 are true for wolves and false for bishops in the same fight. SYS-78.

2. **Documented move-then-cast cannot pick a spell that is out of range.** `pickBestDamageSpell` (**555–568**) keeps only kits with `enemySpellRange(s) >= chebyshev(origin, target)`. `findNearestLegalCastTile` (**787–824**) is the helper that is supposed to walk MP toward a legal frost tile when the origin is short. Caster (**1005**), charger (**1233**), and generic (**1603**) call `pickBestDamageSpell` *first*. Dist 5 + frost range 3 → `null` → the closes-in+cast block never runs; they `stepToward` without a spell. The comment at **772–777** describes the out-of-range case. That case is dead. Parent RES-02 (“movement before attack”) is unimplemented *and* the existing hook is wired shut. SYS-79.

3. **Pack target ranking uses Crush EV, not kit frost.** Every pack `decide*` except healer calls `scoreTargets(opponents, ctx, null)` (caster **947**, charger **1177**, flanker **1296**, berserker **1404**, generic **1493**). `estimateDamage(null)` is `12 * max(1, level/5)` (**495–499**). `wKillable` (weight 100) therefore ranks as if the bishop were about to Crush. Hunter/archer summons already pass the real kit id (**1935**, **2249**). SYS-72 split the two formulas; it did not name this **null call site**. A level-50 bishop stamps `killableNow` on an 80-HP player (Crush ~120) and then casts frost 8. SYS-80.

4. **Overkill spill reads the Crush stamp.** `applyOverkillSpread` (**707–709**) requires `primary.killableNow` from that scored list, then computes `overkill` with `estimateDamage(spell)` (the real kit). Lookahead (**727–736**) *re-checks* HP vs kit dmg and can recover the *chosen* id. Spill cannot: a Crush-stamped kill + small frost leftover can retarget away from a real frost kill, or refuse to retarget when Crush said “not killable” and frost actually is. SYS-19 forbids hidden splash; this is the **stamp**, not a second damage event. SYS-81.

5. **Apply crit chance is not the strip value.** Pack apply crits when `Math.random() * 100 < (enemy.chc ?? 2)` plus +10 if enraged (WX **16470–16472**). Battle-start copies catalog `chc` onto the enemy (**11902**). The initiative strip then overwrites every non-player row with `chc: 2` (**17408**) via `resolveEnemyApMp` (**17404**). The number the player can read is 2. The roll can be the spawn catalog. FUT-57 already forbids peeking the *roll*. This is the **hidden CHC field**. Decide has no CHC on `AICombatant`. SYS-82.

6. **`allyCount` / `enemyCount` are not pack size.** Pack ctx sets them from `prevEnemies = getLiveCombatants` minus self / living (**16338–16342**). That array includes player-side summons (`combatantStore.ts` **568–569**). Decide never reads the fields (`enemyAI.ts` 259–261 are declared only). Do not attach TEM-01 / TEM-06 / FUT-94 to `allyCount >= 1` as written — a lone bishop plus the player’s wolf would look like a 2-enemy pack. SYS-18 already bans dormant `intelligence` as a tier. This is the same class for these two ints. SYS-83.

### 1.5 Tests

`enemyAI.charger.test.ts`, `enemyAI.geometry.test.ts`, `enemyAI.walkMp.test.ts` exist. Honesty for Fire Bolt, dual maxHp, origin-range `pickBestDamageSpell`, Crush-ranked `scoreTargets`, overkill stamp, strip vs apply CHC, and `allyCount` still has no decide/apply-layer tests. Do not treat geometry/walkMp as SYS-78…83.

### 1.6 What this increment does **not** change

Do not implement FUT-96+ before P0 honesty + 09-21…09-29 SYS slices. Do not touch RAF, map generation, turn order, or damage formulas (`calcScaledDamage` stays a **read** for scoring; do not add `enemy.level` into it as a stealth stat stick). Do not copy #495 / #498 / #644…#659 / #700 / #709 into this docs-only change. Do not edit the parent catalog. Do not “fix late game” by keeping Fire Bolt. Do not wire Adaptive Resistance to `playerSpellTypeHistoryRef`. Do not turn betrayal into a tactic because `aliveAllies` now comes from the store.

---

## 2. Design additions (normative)

1. **Do not recycle 09-21…09-29 ids.** This file starts at SYS-78 / FUT-96.
2. **One player-vitals snapshot.** HUD `maxHp`, leftover current HP, and public strip AP/MP are built once and handed to pack, summon, and (later) boss-minion decide. Two builders is how TGT-01 silently dies for bishops.
3. **Kit pick and range check are different functions.** `pickBestDamageSpell` (or its replacement) returns the highest-EV *profiled* damage id the actor owns this turn, **ignoring current-origin range**. `findNearestLegalCastTile` / SYS-13 decide whether a dest makes that id legal. Combining them in one filter deletes RES-02.
4. **`scoreTargets` receives the spell that apply would fire**, or it does not stamp `killableNow`. Crush `level/5` is only for true melee (no legal kit damage, adjacent) after SYS-05.
5. **Spill and lookahead share one killable predicate** — kit pipeline (SYS-66/67/68/74), not the Crush stamp.
6. **Public strip CHC is 2.** Crit EV is 0 (FUT-57) until the strip shows the same number apply uses. Do not pass spawn `enemy.chc` into `DecideEnemyContext`.
7. **`allyCount` / `enemyCount` stay unused** until they are side-filtered living hostiles / living allies. Prefer `ctx.combatants.filter(side)` over those ints.
8. **T6+ still stacks** on the parent enumerator. No integer tier table. No `if (aiTier >= 8)`. No `if (level >= X)`.

---

## 3. System proposals (2026-10-21)

### AI-SYS-78

**AI_ID:** AI-SYS-78  
**NAME:** Pack and summon decide must share one player-vitals snapshot  
**ROLE:** system  
**SOPHISTICATION:** T1+ / honesty for SYS-76 / TGT-01  
**DECISION_RULES:** Summon ctx already copies HUD `maxHp` (WX **15150**, same `useMemo` as **3400–3406** / `vitalsOrbCaps`). Pack ctx still copies `characterStats.maxHp ?? characterStats.hp` (**16300**), which init stamps from leftover `s.hp` (**3234**) because canister `CharacterStats` has no max field. After this module: one helper builds the player `AICombatant` (current HP, HUD max, public strip AP/MP once SYS-10 exists). Pack, summon, and boss-minion decide call it. Do not keep a second leftover fallback “for pack only.” Do not invent a hidden true-max the HUD does not show. Occupancy/CD filters stay SYS-14 (summon `occupied` is still `new Set()` at **15156**).  
**SCORING_MODEL:** `lowHp = 1 - hp / hudMaxHp` for the player on **both** brains.  
**SPELL_REQUIREMENTS:** None.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always (honesty).  
**ENEMY_ARCHETYPES:** All pack `scoreTargets` callers; hunter/archer summons already score with a real kit id.  
**PLAYER_COUNTERPLAY:** Enter wounded (40/120). Wolves and bishops must both see a wounded player.  
**EDGE_CASES:** After a mid-fight heal to the useMemo cap, leftover stamp `maxHp` can be 40 while `hp` is 80 → pack `hpFrac` clamps to 1 (`enemyAI.ts` 335–337) and hides the wound. Summon decide would not.  
**IMPLEMENTATION_COMPLEXITY:** Low (extract snapshot; pack call site).  
**TEST_SCENARIOS:** HUD max 120, stamp maxHp 40, hp 40 → pack player `maxHp === 120` and summon player `maxHp === 120`. Full 120/120 → `lowHp` 0 on both.  
**STATUS:** PROPOSED

### AI-SYS-79

**AI_ID:** AI-SYS-79  
**NAME:** `pickBestDamageSpell` must not require current-origin range  
**ROLE:** system  
**SOPHISTICATION:** T1+ / honesty for RES-02  
**DECISION_RULES:** `pickBestDamageSpell` (**555–568**) filters `enemySpellRange(s) >= chebyshev(origin, target)`. Caster closes-in (**1005–1047**), charger (**1233–1258**), and generic (**1603–1628**) use that result as the spell for `findNearestLegalCastTile`. When the target is outside current range the helper returns `null` and move-then-cast is skipped. After this module: (1) a **kit-pick** function returns the best *profiled* damage/drain id in `availableSpells` with `damage > 0` (SYS-02 still excludes DoT-only); (2) range / LoS / minRange / linear / diagonal / freeCells / AP are applied by SYS-13 + `findNearestLegalCastTile` + SYS-64; (3) if no reachable legal-cast tile exists this turn, `stepToward` / hold — never Fire Bolt (SYS-05). Do not “fix” by giving AI a private longer range.  
**SCORING_MODEL:** Spell identity first; legality of dest is −∞ if SYS-13 rejects.  
**SPELL_REQUIREMENTS:** Damage/drain profiles with `damage > 0`. Inferno/poison stay SYS-39 until DoT EV exists.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always (correctness of the existing hook).  
**ENEMY_ARCHETYPES:** caster, generic, charger-with-ranged-kit.  
**PLAYER_COUNTERPLAY:** Stand at dist 5 vs frost 3. T1+ should walk a legal tile and cast if MP reaches it; T0 may still stepToward without casting. They must not Fire Bolt from dist 3.  
**EDGE_CASES:** `pickBestDamageSpell` is still valid as an *in-range-now* helper for adjacent melee preference. Split the names so the closes-in path cannot call the gated one. Healer must not use this to pick Blood Mend (SYS-04).  
**IMPLEMENTATION_COMPLEXITY:** Low (split helper; three call sites).  
**TEST_SCENARIOS:** Bishop origin (0,0), player (5,0), frost range 3, MP budget reaches (2,0) → kind `cast`, dest (2,0), spell frost. Same but MP 0 → no walk (SYS-07), no Fire Bolt.  
**STATUS:** PROPOSED

### AI-SYS-80

**AI_ID:** AI-SYS-80  
**NAME:** Pack `scoreTargets` must not rank with Crush when the actor will frost  
**ROLE:** system  
**SOPHISTICATION:** T1+ / honesty for TGT-06 / SYS-72  
**DECISION_RULES:** Pack `decideCaster` / `decideCharger` / `decideFlanker` / `decideBerserker` / `decideGeneric` pass `null` into `scoreTargets` (**947**, **1177**, **1296**, **1404**, **1493**). `estimateDamage(null)` is Crush `12 * max(1, level/5)` (**495–499**). `wKillable = 100` (`gameConstants.ts` 181) therefore dominates with a formula apply will not use for a kit frost (`calcScaledDamage` + upgrade 0, SYS-72). After this module: pass the kit id that SYS-79 would fire (or `null` only when the legal set is true melee). `killableNow` uses that id’s pipeline (SYS-66/67/68/74), never Crush, unless SYS-05’s adjacent Crush is the actual apply. Hunter/archer already pass venom/preferred (**1935**, **2249**) — keep that.  
**SCORING_MODEL:** `killableNow = target.hp <= kitRecv(pipeline)`. Crush `level/5` is tagged illegal for kit ids.  
**SPELL_REQUIREMENTS:** Same as SYS-72 / SYS-79.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always (honesty).  
**ENEMY_ARCHETYPES:** caster, charger, flanker, berserker, generic.  
**PLAYER_COUNTERPLAY:** A wounded wisp at frost range must outrank a full-HP player when frost cannot kill the player. Today Crush `killableNow` on the player can hide the wisp.  
**EDGE_CASES:** Enrage 6× multiplies kit scaled damage (WX 16467), not a second `level/5`. `applyLethalLookahead` (**733–735**) already re-checks kit dmg — do not treat that as a fix for the *ranking* list.  
**IMPLEMENTATION_COMPLEXITY:** Low after SYS-79 (pass the picked id).  
**TEST_SCENARIOS:** Level 50 bishop, frost 8, player 80/120, wisp 6/10 in range → wisp outscores player on `wKillable`. Today player can stamp killable via Crush ~120.  
**STATUS:** PROPOSED

### AI-SYS-81

**AI_ID:** AI-SYS-81  
**NAME:** Overkill spill may not read Crush-stamped `killableNow`  
**ROLE:** system  
**SOPHISTICATION:** T1+ / honesty for SYS-19 / TGT-06  
**DECISION_RULES:** `applyOverkillSpread` (**707–709**) gates on `primary.killableNow` from the scored list, then `overkill = estimateDamage(spell) - primary.hp`. After SYS-80 the stamp matches the spell. Until then, Crush-true + frost-small can retarget off a real frost kill when leftover `> AI_OVERKILL_SPILL_FRACTION * maxHp` (0.5, `gameConstants.ts` 237), or refuse to retarget when Crush-false and frost-true. After this module: recompute `killableNow` with the **same** `spell` argument inside the helper (mirror lookahead **733–735**). Apply still deals **one** hit (SYS-19). No hidden splash. Do not enable spill from `AI_OVERKILL_SPILL_ENABLED` as a relative-tier module — the toggle is global on; eligibility is SYS-01 later.  
**SCORING_MODEL:** `kitKill = hp <= kitRecv`; spill only if `kitKill && (kitRecv - hp) > fraction * maxHp` and a second id is also `kitKill` or a legal chip — never a second apply event.  
**SPELL_REQUIREMENTS:** Single-target damage. Multi-hit is FUT-19.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always (correctness).  
**ENEMY_ARCHETYPES:** caster / generic (the only callers of spill today).  
**PLAYER_COUNTERPLAY:** Frost that barely kills you stays on you; they do not “spill” to your wisp because Crush said you were dead.  
**EDGE_CASES:** `AI_OVERKILL_SPILL_ENABLED` comment at **226–228** still talks like leftover HP is dealt to a second target. Apply never does that. Do not implement the comment.  
**IMPLEMENTATION_COMPLEXITY:** Low (recompute inside the helper).  
**TEST_SCENARIOS:** Frost 8, player 5/120, wisp 10/10, Crush stamp killable on player → after this module, frost kills player (no retarget). Frost 8, player 80/80, Crush stamp killable → no spill (frost does not kill).  
**STATUS:** PROPOSED

### AI-SYS-82

**AI_ID:** AI-SYS-82  
**NAME:** Pack crit chance is not the initiative-strip `chc: 2`  
**ROLE:** system  
**SOPHISTICATION:** T1+ / honesty for FUT-57 / SYS-69  
**DECISION_RULES:** Apply crits with `(enemy.chc ?? 2) + (enraged ? 10 : 0)` (WX **16470–16472**). Spawn copies catalog `chc` (**11902**). Strip display forces `chc: 2` on every non-player row (**17408**) after `resolveEnemyApMp` (**17404**). Parent principle 6: no hidden player *or* hidden enemy combat numbers the HUD does not show. After this module: (1) default killableNow / EV stay **non-crit** (FUT-57); (2) decide must **not** read spawn `enemy.chc` as a sophistication input; (3) if a later T5 module wants crit EV it may use only the **public** strip number (2 today) or a HUD chip that matches apply; (4) unifying apply to strip `2` or unifying the strip to catalog CHC is a combat-UI PR, not an AI cheat. Enrage +10 is also unlabelled on the strip — do not score it until the enraged badge is public (it is: `enraged` at **17410**). Still do not peek `Math.random`.  
**SCORING_MODEL:** Crit term 0. Enrage 6× damage (WX 16467) is public via the badge / 6× HP write (SYS-12 spectacle path) and may multiply kitRecv. Hidden CHC multiplier may not.  
**SPELL_REQUIREMENTS:** Damage/drain.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always (honesty).  
**ENEMY_ARCHETYPES:** All pack casters / melee.  
**PLAYER_COUNTERPLAY:** You see CHC 2. A catalog-30 bishop must not “get smarter” by planning around a 30% crit you cannot see.  
**EDGE_CASES:** Player strip uses `characterStats.chc` (**17398**) — that *is* public for ADV-01 threat. Do not copy player CHC onto enemy EV. Fire Bolt crit is SYS-05 (delete the bolt).  
**IMPLEMENTATION_COMPLEXITY:** None until a crit-EV module exists (do-not-wire).  
**TEST_SCENARIOS:** Grep `decideEnemyAction` for `chc` / `enemy.chc` → zero. Fixture spawn chc 30, strip 2, frost 8, player 10 HP → killableNow false for a single frost (8 < 10), not true via 30% crit.  
**STATUS:** PROPOSED

### AI-SYS-83

**AI_ID:** AI-SYS-83  
**NAME:** `allyCount` / `enemyCount` are not living-hostile counts  
**ROLE:** system  
**SOPHISTICATION:** meta / authoring  
**DECISION_RULES:** `DecideEnemyContext.allyCount` / `enemyCount` (**259–261**) are filled from `getLiveCombatants` minus self / `hp > 0` (WX **16338–16342**). The store list includes player-side summons (`combatantStore.ts` **568–569**; `combatantTurnEntryType` **132–138** tags those `"summon"`). Decide never reads the ints. After this module: do not attach TEM / FUT pack-size gates to these fields. Legal pack size is `combatants.filter(c => c.side === "enemy")`. Legal opponent count is `side === "player"`. If a later module needs the ints, recompute them that way in the snapshot helper (SYS-78). Summon ctx already side-filters (**15175–15178**) — do not “unify” by copying the pack formula. Betrayal `aliveAllies` (**15593**) is the same store list; that remains spectacle (SYS-12), not a tactic, even if it can pick a player wolf.  
**SCORING_MODEL:** N/A (do-not-read).  
**SPELL_REQUIREMENTS:** None.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** N/A (authoring).  
**ENEMY_ARCHETYPES:** All.  
**PLAYER_COUNTERPLAY:** N/A.  
**EDGE_CASES:** `focusAlreadySet` / `allyCount` must not become `if (aiTier >= 4 && allyCount >= 2)` — that is SYS-01 plus this bug.  
**IMPLEMENTATION_COMPLEXITY:** None (do-not-implement).  
**TEST_SCENARIOS:** Grep `decideEnemyAction` / `decideSummonAction` / `decideSummonerAction` for `allyCount` / `enemyCount` as branch conditions → zero until a side-filtered rewrite lands with tests.  
**STATUS:** PROPOSED

---

## 4. T6+ reusable modules (2026-10-21)

Attach via parent §4 sigmoid. Stack; do not replace T0–T5 or FUT-01…95. Do not re-file FUT-86 (adjacent melee vs frost **pipeline**) or FUT-91 (kit vs Crush **formula**).

### AI-FUT-96

**AI_ID:** AI-FUT-96  
**NAME:** Movement-before-attack uses kit-pick, then legal-cast dest  
**ROLE:** resource / positioning  
**SOPHISTICATION:** T6 (RES-02; SYS-79)  
**DECISION_RULES:** After SYS-79, T1+ casters enumerate: for the kit-picked frost (or other profiled damage id), `findNearestLegalCastTile` inside the MP-reachable set (slime/frozen cost, occupancy). If that dest is not origin, dest-commit + cast from there in one turn **only if** SYS-05/SYS-64 can pay walk MP *and* cast AP. If the tile is legal but AP would not remain (once AP is real), walk without casting — do not Fire Bolt the difference. T0 may still `stepToward` the target cell. Do not path through walls (`computeReachable` already uses `isCellFree`).  
**SCORING_MODEL:** `U(move+cast) = U(kitRecv) - mpWaste - hazardPenalty`; illegal dest −∞.  
**SPELL_REQUIREMENTS:** Profiled damage/drain with `damage > 0`.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.35` once SYS-79 tests exist. Not `if (level >= 20)`.  
**ENEMY_ARCHETYPES:** caster, artillery, generic; charger only if a ranged kit id exists.  
**PLAYER_COUNTERPLAY:** Occupy the only frost tile; body-block the MP path; stand behind a wall so legal-cast is empty.  
**EDGE_CASES:** Diagonal `stepToward` candidate (**595–596**) still must be in `reachable` (SYS-15). Dest-commit does not re-check occupancy (SYS-58) — enumerator must not emit an occupied dest.  
**IMPLEMENTATION_COMPLEXITY:** Low after SYS-79.  
**TEST_SCENARIOS:** Dist 5, frost 3, dest (2,0) free → cast from (2,0). (2,0) occupied → next legal tile or stepToward, no bolt.  
**STATUS:** PROPOSED

### AI-FUT-97

**AI_ID:** AI-FUT-97  
**NAME:** Rank opponents with the kit id apply will fire  
**ROLE:** target  
**SOPHISTICATION:** T6 (TGT-01 / TGT-06; SYS-80 / SYS-72 / FUT-91)  
**DECISION_RULES:** `scoreTargets` receives the SYS-79 kit id (or melee-null only for true Crush). `wKillable` / `wLowHp` / `wThreat` / `wProximity` stay the parent weights. `wLowHp` uses SYS-78 HUD max for the player (FUT-95). Resistance term stays TGT-05 / SYS-10 (do not read strip dummy RES 0, SYS-69). Do not mix Crush `level/5` into frost ranking at any absolute enemy level.  
**SCORING_MODEL:** Parent `U`; `killableNow` from kit pipeline only.  
**SPELL_REQUIREMENTS:** Same as SYS-80.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.3` (default once SYS-80 exists). Not a level gate.  
**ENEMY_ARCHETYPES:** All pack `scoreTargets` callers.  
**PLAYER_COUNTERPLAY:** Hide the wisp at frost range-1 behind a wall; they should not still “know” Crush would kill you at dist 3.  
**EDGE_CASES:** Healer fallback `decideCaster` (**1166–1168**) inherits this. Do not let heal-first queens (SYS-04) skip the kit id and rank as Crush.  
**IMPLEMENTATION_COMPLEXITY:** Low after SYS-80.  
**TEST_SCENARIOS:** Same as SYS-80 TS; plus healer-fallback queen with frost+heal still ranks frost EV when role is artillery (SYS-04).  
**STATUS:** PROPOSED

### AI-FUT-98

**AI_ID:** AI-FUT-98  
**NAME:** Overkill retarget only after kit-pipeline killableNow  
**ROLE:** target / team  
**SOPHISTICATION:** T6 (TGT-06 / TEM-01; SYS-81 / SYS-19)  
**DECISION_RULES:** Spill may change `targetId` when kitRecv would kill the primary *and* leftover exceeds the public fraction *and* a second living opponent is a legal SYS-13 dest for the **same** spell this turn. Apply still one hit. Focus id (SYS-08) updates to the new id so the next pack member can read it. Do not splash. Do not use Crush leftover.  
**SCORING_MODEL:** SYS-81 predicate; optional `+wFocus` on the new id.  
**SPELL_REQUIREMENTS:** Single-target damage.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.6` when `opponentCount >= 2`. Not `aiTier >= 4`.  
**ENEMY_ARCHETYPES:** synergistic T3+ casters.  
**PLAYER_COUNTERPLAY:** Keep the second body out of frost range / LoS so spill has no legal dest.  
**EDGE_CASES:** Windstorm miss still spends the id (SYS-75) — spill does not get a second roll. Mirror consume (SYS-74) is not spill.  
**IMPLEMENTATION_COMPLEXITY:** Low after SYS-81 + SYS-08 reader.  
**TEST_SCENARIOS:** Frost 40, player 10, wisp 10 in range, leftover 30 > 0.5*playerMax → retarget wisp only if player would actually die to *frost* 40, not Crush.  
**STATUS:** PROPOSED

### AI-FUT-99

**AI_ID:** AI-FUT-99  
**NAME:** Shared vitals snapshot is the only player AP/MP/HP source  
**ROLE:** system / advanced  
**SOPHISTICATION:** T6 (ADV-03 / ADV-04; SYS-78 / SYS-10)  
**DECISION_RULES:** After SYS-78 + SYS-10, pack/summon/boss-minion read player current HP, HUD max, and the **initiative-strip** AP/MP (`currentBattleAp` / `currentBattleMp` at WX **17390–17394**) from the shared snapshot. Do not read leftover `characterStats.ap` (canister / create payload) as battle AP. Do not treat End-Turn leftover `0` as “they cannot punish you next turn” — player turn-start restore is public (`setCurrentBattleApSynced(_baseAp)` at battle start **12115**; the same restore pattern runs at player-turn entry). Legal adaptive uses: (a) HUD **caps** (`vitalsOrbCaps`, **3408–3416**), (b) last **logged** spend this round, (c) leftover AP only while the strip still shows it *and* a player-side actor can still spend it this round (controlled summon). Hidden `currentBattleApRef` is not a decide input until it equals the strip.  
**SCORING_MODEL:** `playerApFrac = stripAp / hudMaxAp` when the strip is the live public number; else term 0.  
**SPELL_REQUIREMENTS:** None.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.8` when the strip is visible (always in battle).  
**ENEMY_ARCHETYPES:** kiter, caster, assassin.  
**PLAYER_COUNTERPLAY:** End Turn with leftover AP on a summon you still control; they may respect that. After your turn fully ends, they must not assume you are empty next turn.  
**EDGE_CASES:** Challenge AP trackers are not pack inputs. Strip dummy enemy AP=`level` (SYS-54) is not *their* budget.  
**IMPLEMENTATION_COMPLEXITY:** Medium (SYS-10 fields + one builder).  
**TEST_SCENARIOS:** Strip AP 0 after End Turn, maxAp 6 → kiter does not score “player cannot Attack Nearest next turn.” Strip AP 2 on a living player summon → pack may treat that summon as a spend threat.  
**STATUS:** PROPOSED

### AI-FUT-100

**AI_ID:** AI-FUT-100  
**NAME:** Kite / hold from public Attack-Nearest threat, not leftover 0  
**ROLE:** advanced / positioning  
**SOPHISTICATION:** T6 (ADV-04 / POS-01 / POS-02; FUT-99)  
**DECISION_RULES:** Attack Nearest is a public player verb (HUD / challenge). Its live range is the **player** tile, Chebyshev, documented in AGENTS.md. After FUT-99, a T4+ kiter/caster may step to `enemySpellRange` and **not** end adjacent if the public player AP *cap* is enough for Attack Nearest *and* they are in that range now. Do not use End-Turn leftover 0. Do not peek selected spell. Do not ignore LoS or MP. Berserker inverts (still presses).  
**SCORING_MODEL:** `U(stayAdj) -= wPunish * 1[in AN range] * 1[hudMaxAp >= AN cost]`; retreat/stepAway if U + kitRecv < U(safe tile).  
**SPELL_REQUIREMENTS:** Any legal ranged kit id, or hold.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.9` when a ranged kit id exists. Never `if (player.level >= 40)`.  
**ENEMY_ARCHETYPES:** kiter, caster, artillery; berserker off.  
**PLAYER_COUNTERPLAY:** Walk them into a corner; occupy escape tiles (POS-08); bait with a summon so they “kite” the wrong body.  
**EDGE_CASES:** Striker challenge range 2 is a *player* gate, not extra enemy range. Do not copy it as AI reach.  
**IMPLEMENTATION_COMPLEXITY:** Medium (needs enumerator + FUT-99).  
**TEST_SCENARIOS:** Bishop adjacent, frost 3, player maxAp 6, FUT-100 on → step to dist 2–3 if MP allows. Same, T0 / module off → may stay and frost. Leftover AP 0 after End Turn → still kites (cap, not leftover).  
**STATUS:** PROPOSED

### AI-FUT-101

**AI_ID:** AI-FUT-101  
**NAME:** Crit EV only from a public CHC that matches apply  
**ROLE:** advanced / target  
**SOPHISTICATION:** T6 (ADV-01 / TGT-06; SYS-82 / FUT-57)  
**DECISION_RULES:** Default remains non-crit killableNow. A T5+ module may add `pCrit * kitRecv` **only if** apply and the strip (or a HUD chip) show the same CHC. Today they do not (strip 2 vs spawn `enemy.chc`). Until a combat-UI unify PR, this module stays off even on bosses. Enrage +10 crit is scorable only when the enraged badge is up **and** apply still adds +10 (WX 16472). Do not read `playerSpellTypeHistoryRef` (SYS-77). Do not peek the roll.  
**SCORING_MODEL:** `E[recv] = (1-p) * kitRecv + p * 2 * kitRecv` with public `p`; else `kitRecv`.  
**SPELL_REQUIREMENTS:** Damage/drain with crit eligible (same as apply: the `damage > 0` branch).  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 1.2` **and** `publicChc == applyChc`. The second conjunct is a data condition, not a level.  
**ENEMY_ARCHETYPES:** elite/boss T5 once the strip is honest.  
**PLAYER_COUNTERPLAY:** If the strip says 2%, plan around 2%, not a hidden 30%.  
**EDGE_CASES:** Windstorm miss (SYS-70) is a separate public roll; do not fold into pCrit. Mirror reflect uses `dmgAC` post-crit (SYS-74) — if this module is on, “they die to Mirror” must use the same public p or stay non-crit.  
**IMPLEMENTATION_COMPLEXITY:** None until strip/apply unify; then low.  
**TEST_SCENARIOS:** Strip chc 2, spawn 30, module attached → still non-crit EV. After unify at 15% both sides → EV may use 0.15.  
**STATUS:** PROPOSED

---

## 5. Spell-awareness contract (reminder)

Unchanged: no profile + apply ⇒ not in kit, not in elite extras, `usableByEnemy` treated as false in the enumerator.

Still `usableByEnemy: true` without a working decide+apply pair (do not give these to AI until FUT-22 / FUT-25 / FUT-31 / apply):

`spell-swap`, `spell-mark`, `spell-sacrifice`, `spell-lifesteal-nova`, `spell-enrage`, `spell-haste`, `spell-weaken`, `spell-expose`, `spell-drain-courage`, `spell-cursed-wound`, `spell-shadow-veil`, `spell-frost-nova`, `spell-inferno` (DoT `damage: 0`), `starter-poison` / `spell-venom-strike`, `starter-shield` / `spell-iron-skin`.

Keep `usableByEnemy: false` until profiled: barrier, mirror, timestep, rallying-cry, sentinel/bomber/wisp summons.

`starter-heal` is self-only (`range: 0`). It cannot satisfy ROL-04 ally heal. SYS-13 must keep that legal for **self**.

Apply now has a pack DoT writer (WX **16609–16625**) and a no-damage debuff writer (**16671–16700**). That does **not** authorize Inferno/poison/slow in kits. Decide still scores `damage <= 0` as 0 (SYS-02 / SYS-39). Profile + SYS-13 legality first.

Kit frost staying at spellbook damage (SYS-72) is **not** a reason to assign Inferno. SYS-79’s kit-pick still requires `damage > 0`.

---

## 6. Implementation order (this increment)

Do not start FUT-96+ first. Do not start T6+ from earlier increments before P0 honesty.

1. SYS-05 (Fire Bolt WX **16712**, AP/MP debit, ally heal WX **16648**) — still P0. This also removes the `level/5` bolt cheat (SYS-72).  
2. SYS-01 — replace `computeAITier` (`combatMath.ts` 36–52) and the `aiTier >= 5/10` gates (WX **15508** / **15595**).  
3. SYS-73 — drop the 999 spawn ceiling so SYS-01 `peer` still works at high player level.  
4. SYS-13 + SYS-06 + SYS-11 + SYS-20 — side-aware legality. `enemyCastGeometryOk` is not sufficient.  
5. SYS-78 — one player-vitals snapshot (closes SYS-76 for pack; summon already HUD).  
6. SYS-79 + FUT-96 — kit-pick without origin-range; move-then-cast works.  
7. SYS-80 + FUT-97 — rank with the kit id. SYS-72 / FUT-91 stay the formula split.  
8. SYS-81 + FUT-98 — spill stamp.  
9. SYS-82 then FUT-101 — public CHC only (default off).  
10. SYS-83 — do not read raw `allyCount`.  
11. FUT-99 + FUT-100 — public AP/MP kite.  
12. Parent T2–T5 roles / team / adaptive; remaining FUT-01…95.

Each slice: `engine/enemyAI*.test.ts`, zero WX drive-by, no RAF / map gen / turn order / damage-formula edits unless a **named** follow-up. Scoring **reads** RES/SR/CHC; it does not change `calcScaledDamage`.

---

## 7. Extra test scenarios

| ID | Setup | Expect |
| :--- | :--- | :--- |
| TS-VITALS | HUD max 120, stamp 40, hp 40 | Pack **and** summon player `maxHp === 120`. |
| TS-MTC | Bishop (0,0), player (5,0), frost 3, (2,0) free | `kind: "cast"`, dest (2,0), frost. |
| TS-MTC0 | Same, MP 0 | No walk, no `e-firebolt`. |
| TS-CRUSHRNK | Level 50 frost 8, player 80/120, wisp 6/10 | Wisp preferred; player not Crush-killable. |
| TS-SPILLST | Frost 8, player 5/120, Crush stamp killable | Stay on player; no retarget. |
| TS-CHCHID | Spawn chc 30, strip 2, frost 8 vs 10 HP | `killableNow` false; no `enemy.chc` in decide. |
| TS-ALLYINT | One bishop + player wolf in store | Do not treat `allyCount` as 2 hostiles. |
| TS-KITEAP | Adjacent caster, FUT-100 on, maxAp 6 | Steps to frost range; leftover 0 after End Turn does not disable kite. |
| TS-BOLT3 | Failed frost, Chebyshev 1 | Crush or skip; never `e-firebolt` (WX 16712). |
| TS-PEER3K | Player 3000, enemy 3000 | Not forced T5; remnant 400 stays low tier (FUT-92). |

Parent and 2026-09-01…29 TS-* rows still apply (line numbers in §1.2).

---

## 8. Mapping (new gaps → ids)

| Request / gap | Primary AI_ID |
| :--- | :--- |
| Summon HUD `maxHp` vs pack leftover stamp | AI-SYS-78 / AI-FUT-99 |
| `pickBestDamageSpell` origin-range kills move-then-cast | AI-SYS-79 / AI-FUT-96 |
| Pack `scoreTargets(..., null)` Crush ranking | AI-SYS-80 / AI-FUT-97 |
| Overkill spill reads Crush `killableNow` | AI-SYS-81 / AI-FUT-98 |
| Apply `enemy.chc` vs strip `chc: 2` | AI-SYS-82 / AI-FUT-101 |
| `allyCount`/`enemyCount` include player summons | AI-SYS-83 |
| Kite from public Attack-Nearest threat | AI-FUT-100 |

T0–T5 requested list (positioning, targeting, resources, roles, team, adaptive) remains parent §19. Nothing in that list is implemented. Higher-level enemies still get harder from **modules on the sigmoid** and from **honest relative spawn** (SYS-73 / FUT-92), not from `computeAITier(enemyLevel)`, not from a kit-less bolt that scales while frost does not, and not from Crush-ranked targeting that pretends every bishop is about to melee.
