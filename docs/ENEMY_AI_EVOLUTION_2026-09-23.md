# Advanced Enemy AI Evolution — 2026-09-23 increment

**Status:** PROPOSED (design only; no production code in this change)  
**Date:** 2026-09-23  
**Parent catalog:** [`ENEMY_AI_EVOLUTION.md`](./ENEMY_AI_EVOLUTION.md) (T0–T5)  
**Prior increments:** [`ENEMY_AI_EVOLUTION_2026-09-01.md`](./ENEMY_AI_EVOLUTION_2026-09-01.md) · [`ENEMY_AI_EVOLUTION_2026-09-02.md`](./ENEMY_AI_EVOLUTION_2026-09-02.md) · [`ENEMY_AI_EVOLUTION_2026-09-21.md`](./ENEMY_AI_EVOLUTION_2026-09-21.md) (open PR #351; SYS-22…32, FUT-36…47 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-22.md`](./ENEMY_AI_EVOLUTION_2026-09-22.md) (open PR #416; SYS-33…35, FUT-48…53 — **do not re-number**)  
**Implementer ledger:** [`automation/ACTION_IDS_AEE_2026-09-23.md`](./automation/ACTION_IDS_AEE_2026-09-23.md)

This increment re-reads the live engine one day after the 2026-09-22 catalog. SYS-01…35 and FUT-01…53 stay **PROPOSED** on their own files; they are **not** re-filed here. New work is: WX / helper confirmation, honesty gaps 09-22 missed, and T6+ scorers that keep attaching as relative difficulty rises.

Stralt has **no character level cap**. Nothing here maps `if (level >= X) sophistication = Y`. Tiers remain conceptual. Eligibility remains the parent §4 sigmoid (`peer = log2(enemy.level / player.level)` plus pack/boss/modifier terms). A year-later peer fight at any absolute level can attach a new module without raising a cap.

**Hard rules (unchanged):** no cheat, no hidden player information, no ignored LoS/range/AP/MP, no unbounded search, no kit-less Fire Bolt, no `instantKill`, no betrayal-as-difficulty, no name-based spell heuristics, no production AI in this change.

---

## 1. Re-read (2026-09-23)

All line numbers are from this checkout. Re-read them before implementing.

### 1.1 Combat-parity still is not sophistication

Unchanged from 2026-09-21/22: `enemyCastGeometryOk` (`targeting.ts` 166–177), `aiCanCast` (`enemyAI.ts` 320–332), Frozen walk *rate* (`enemyWalkMp.ts` 21–29), `playerCastPlan.ts` (player only), summon leftover-AP `reevaluate` (WX 15257–15276). These are **not** SYS-05 / SYS-13 / SYS-01.

`aiCanCast` is still unused by healer (1099–1100) and guardian (2131–2133). That remains **AI-SYS-23** on the 09-21 increment (healer/guardian LoS), not a new id.

`enemyAI.ts` still has **zero** reads of `currentAp`, `currentMp`, or `apCost` (confirmed 2026-09-23 grep).

### 1.2 Line numbers vs 2026-09-22 (WX did not move)

| Fact | 2026-09-22 | Live (2026-09-23) |
| :--- | :--- | :--- |
| `computeAITier` | `combatMath.ts` 36–52 | **unchanged** |
| Spawn `aiTier` | WX 5823 | **5823** |
| Family second `computeAITier` | WX 5864–5866 | **5864–5866** |
| Kit `levelZone` object | WX 11920 | **11920** |
| Summoner chance unbounded | WX 11932–11943 | **11932–11943** |
| Summon empty occupied | WX 15156 | **15156** |
| Summon `allyCount` hardcoded player | WX 15175–15176 | **15175–15176** (SYS-33 on 09-22) |
| Summon `reevaluate` | WX 15257–15276 | **15257–15276** |
| Erratic `aiTier >= 5` | WX 15507 | **15507–15591** |
| Betrayal `aiTier >= 10` | WX 15594 | **15594–15609+** |
| Pack snapshot | WX 16273–16302 | **16273–16302** |
| Pack `allyCount` | (not called out) | **16338–16342** — all other `prevEnemies`, including player-side summons (SYS-36) |
| Dest-commit | WX 16416–16423 | **16416–16423** (`enemyDestToCommit` clamp-only, `battleSetup.ts` 394–406) |
| Apply Chebyshev only | WX 16450–16456 | **16450–16456** |
| Apply SP then RES | WX 16475–16537 | **16475–16537** |
| Hidden crit roll | (not called out) | **16470–16473** `Math.random` vs `enemy.chc` (FUT-57) |
| Self-heal `range === 0` | WX 16648 | **16648** |
| Fire Bolt `e-firebolt` | WX 16710–16715 | **16710–16715** |
| `decideEnemyAction` | 1662–1707 | **1662–1707** |
| `pickBossKitSpell` `new Map()` | `useBossAI.ts` 169–173 | **unchanged** |
| `isTileCastableLive` ally = player summon | `targeting.ts` 527–544 | **527–544** |

P0 remains **AEE-2026-08-31-002** (Fire Bolt / apply honesty) then **AEE-2026-08-31-001** (`computeAITier`). Next 09-21 honesty: **AEE-2026-09-21-002** (healer LoS) and **AEE-2026-09-21-004** (summon occupied + available-only kit). Next 09-22: **AEE-2026-09-22-002** / **003** (live player tile; SP in EV). Then this file’s SYS-36…41.

### 1.3 Still true — do not re-file (parent / 09-21 / 09-22)

- Zone-0 kits forever (`Math.floor(levelZone)` on an object). SYS-09.
- `scoreTargets` ignores `focusTargetId`. SYS-08. Prepend 1682–1690 is not a reader — **AI-SYS-30**.
- `estimateDamage` returns 0 when `spell.damage <= 0`. SYS-02. Completing EV still needs SYS-39 (apply nested DoT).
- Heal-first `inferArchetype` (447–452). SYS-04. Completing it still needs SYS-41 (`assignedSpells` including `usableByEnemy: false`).
- Hazard avoid only below 50% HP (425–441). POS-04.
- Retreat `kind: "skip"` while moving (929–944). POS-02 / FUT-41 (skip + dest-commit + adjacent Fire Bolt).
- Summoner chance hits 1.0 at player level 44. FUT-23.
- `ENEMY_AI_TIER_GATES` unread. SYS-01.
- Summon executor Chebyshev teleport MP (`summonExecutor.ts` 125–126). SYS-15 / 09-21 SYS-25.
- Family overlay second `computeAITier`. **AI-SYS-29**.
- `findKitSpell` assigned fallback (1741–1745). **AI-SYS-32**.
- `getEffectiveStat` unused by `estimateDamage`. 09-21 **AI-FUT-43** / 09-22 **AI-SYS-35**. Completing them still needs SYS-36 (callback is a **modifier**, not RES).
- Summon `allyCount` hardcoded player. **AI-SYS-33**.
- Apply `playerPosition` not ref. **AI-SYS-34**.
- Drain self-heal EV / summoner skip / pack-healer ward comment / dup-DoT / bait / rotation. **AI-FUT-48…53**.

`engine/summonAI.ts` `runSummonAI` remains unused.

### 1.4 New honesty gaps (this increment)

1. **Pack `allyCount` / `enemyCount` are not side-split.** WX 16338–16342: `allyCount` is every other living row in `prevEnemies` (player-side summons included). `enemyCount` is every living row. `decideEnemyAction` ignores these fields and filters `side` itself (1671–1676). TEM-02 / TEM-07 / FUT-50 that read `ctx.allyCount` would treat a wisp as an allied count. SYS-33 fixed the **summon** snapshot; the **pack** snapshot is still wrong. SYS-36.

2. **`getEffectiveStat` is `getStatModifier`.** WX 16347–16348 (pack) and 15183–15184 (summon) pass `(cid, stat) => getStatModifier(cid, stat, activeEffects…)`. `getStatModifier` (`statusEffects.ts` 45–63) returns a **multiplier** (default `1`) or an additive AP/MP delta — never `characterStats.res` / `sp` / `sr`. 09-21 FUT-43 told implementers to read RES via this callback. Doing that treats RES as `1` and barely changes EV. 09-22 SYS-35 (SP term) plus this file’s SYS-37 must snapshot **numeric** SP/RES/SR on `AICombatant`.

3. **`decideHealer` picks drain as a heal.** `healSpell` is the first available with `spellType === "heal" || healAmount > 0` (1095–1097). `starter-drain` (`spellData.ts` 104–121) is `spellType: "drain"` with `healAmount: 5` and `usableByEnemy` default-true. If that id is in the kit, the “heal” lands on a wounded **ally**; apply’s drain branch (16459–16462, damage > 0) then calls `enemyTakesDamage` on that ally. SYS-38.

4. **DoT apply is nested under `spellDmg > 0`.** Inferno is `damage: 0`, `isDotSpell: true`, `dotDamagePerTurn: 8` (`spellData.ts` 502–522). The DoT `applyActiveEffect` block sits **inside** the `spellDmg > 0` damage/drain branch (WX 16609–16625). SYS-02 making Inferno win `pickBestDamageSpell` still cannot apply the burn. Slow-only (`damage: 0` + `debuffStat`) can use the later `else if` (16671). Inferno cannot. SYS-39.

5. **Summoner spawn short-circuit skips legality.** WX 16389–16404: `kind === "cast" && spell.isSummon` calls `spawnEnemySummonRef` at `action.destination` and returns — no range, LoS, occupancy, AP, or MP. `decideSummonerAction` (1894–1902) uses the player/ally midpoint, which can be a wall, the player tile, or occupied. Parent ROL-06 and 09-22 FUT-49 cover skip-the-turn fall-through; they do not require the spawn dest to pass SYS-13. SYS-40.

6. **`inferArchetype` reads `assignedSpells`, including unusable heals.** King kit at `z >= 1` includes `spell-rallying-cry` (`enemyAI.ts` 181–184). That id is `usableByEnemy: false` (`spellData.ts` 432) but `assignEnemySpells` (WX 11919–11923) looks up the **full** `normalizedSpellPool`, not `_enemyUsableSpells` (11916–11918). Pack `availableSpells` later filters `usableByEnemy !== false` (16270). Heal-first `inferArchetype` (447–452) still sees Rallying Cry on **assigned** and classifies the king as healer. Latent until SYS-09 repairs kit width. SYS-41.

### 1.5 Tests

`enemyAI.charger.test.ts`, `enemyAI.geometry.test.ts`, `enemyAI.walkMp.test.ts` exist. Honesty (Fire Bolt, AP, ally heal, focus, healer LoS, kit CD, summon occupied, drain-as-heal, Inferno apply, summon dest legality) still has no decide-layer tests. Do not treat geometry/walkMp as SYS-05 or SYS-38.

### 1.6 What this increment does **not** change

Do not implement FUT-54+ before P0 honesty + 09-21 SYS-22…32 + 09-22 SYS-33…35. Do not start T6 strafe/ice-slip before SYS-05 / SYS-23 / SYS-26 / SYS-36 / SYS-37.

Do not touch RAF, map generation, turn order, or damage formulas to “make AI feel harder.”

---

## 2. Design additions (normative)

1. **Do not recycle 09-21 or 09-22 ids.** SYS-22…32 / FUT-36…47 belong to [`ENEMY_AI_EVOLUTION_2026-09-21.md`](./ENEMY_AI_EVOLUTION_2026-09-21.md) (PR #351). SYS-33…35 / FUT-48…53 belong to [`ENEMY_AI_EVOLUTION_2026-09-22.md`](./ENEMY_AI_EVOLUTION_2026-09-22.md) (PR #416). This file starts at SYS-36 / FUT-54.
2. **Snapshot counts match the acting unit’s side** on **both** pack and summon ctx (`allyCount` / `enemyCount`).
3. **Mitigation numbers are combatant fields.** `getStatModifier` stays a buff/debuff multiplier. Scoring reads `combatant.res` / `.sp` / `.sr` (and the multiplier on top). Never treat `1` as “1 RES.”
4. **Heal pickers use `spellType === "heal"` (and `targetType` ally/self), never `healAmount > 0`.** Drain self-heal is FUT-48 on a **damage** action, not ROL-04.
5. **Each `SpellScoreProfile` category has an apply branch that is not nested under `damage > 0`.** DoT, buff, heal, summon, swap are siblings of the damage branch.
6. **Summon placement is a legal dest** under SYS-13 + occupancy, or the action is not `kind: "cast"`.
7. **Role inference does not see `usableByEnemy: false` assigned ids.** Kit emit ∩ profile ∩ `usableByEnemy !== false`.
8. **T6+ still stacks** on the parent enumerator. No integer tier table. Hidden crit is never an EV term.

---

## 3. System proposals (2026-09-23)

### AI-SYS-36

**AI_ID:** AI-SYS-36  
**NAME:** Pack snapshot side counts  
**ROLE:** system  
**SOPHISTICATION:** T1+  
**DECISION_RULES:** WX 16338–16342 currently sets `allyCount` to every other living `prevEnemies` row and `enemyCount` to every living row. Use the acting enemy’s side, matching `decideEnemyAction` (1671–1676): allies = `side === "enemy"` (including enemy-side summons), opponents/enemyCount = player-side living units. Player-controlled summons stay opponents. SYS-33 remains the summon-ctx twin (WX 15175).  
**SCORING_MODEL:** TEM modules that read `allyCount` see same-side living units only.  
**SPELL_REQUIREMENTS:** None.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always.  
**ENEMY_ARCHETYPES:** All pack actors.  
**PLAYER_COUNTERPLAY:** N/A (correctness).  
**EDGE_CASES:** Field unused today — fix before TEM-02/07 attach to pack. Do not count the acting unit in `allyCount`.  
**IMPLEMENTATION_COMPLEXITY:** Low.  
**TEST_SCENARIOS:** Pack rook + enemy wolf + player + wisp → `allyCount` is 1 (wolf), not 3.  
**STATUS:** PROPOSED

### AI-SYS-37

**AI_ID:** AI-SYS-37  
**NAME:** Numeric mitigation snapshot; `getStatModifier` is not RES  
**ROLE:** system  
**SOPHISTICATION:** T1+ (completes SYS-10, 09-21 FUT-43, 09-22 SYS-35)  
**DECISION_RULES:** `AICombatant` carries visible `sp`, `res`, `sr` copied from the combatant / `characterStats` (player) or `resolvedTarget` (summon). `ctx.getEffectiveStat` may still return the **modifier** from `getStatModifier` (`statusEffects.ts` 45–63: default multiplier `1`, or additive AP/MP). `estimateDamage` / killable-now use `baseStat * modifier` the same way apply does (WX 16475–16537: `Math.max(0, characterStats.sp) * getStatModifier(...)`). Do **not** pass `getStatModifier` alone as RES. Do **not** change `calcScaledDamage`. Hidden crit (16470–16473) is not part of this snapshot.  
**SCORING_MODEL:** `received = scaled * (1 − visSp/100) * (1 − visRes/100)` for non-physical; physical uses RES only. Summon SP is 0 (apply 16475–16477).  
**SPELL_REQUIREMENTS:** `isPhysical` / `damage` metadata.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always for damaging decide.  
**ENEMY_ARCHETYPES:** All damage dealers.  
**PLAYER_COUNTERPLAY:** Stack SP/RES; bishops stop treating you as a raw-damage one-shot.  
**EDGE_CASES:** Missing field ⇒ 0 mitigation (today’s behaviour). `getStatModifier` of `1` must not become “1 RES.” Additive frost MP is a different stat.  
**IMPLEMENTATION_COMPLEXITY:** Low after SYS-10.  
**TEST_SCENARIOS:** Callback returns `1`, player RES 50 → EV uses 50, not 1. Frost 8 scaled, SP 50 → received 4.  
**STATUS:** PROPOSED

### AI-SYS-38

**AI_ID:** AI-SYS-38  
**NAME:** Heal picker is `spellType === "heal"`, not `healAmount > 0`  
**ROLE:** system  
**SOPHISTICATION:** T1+ / ROL-04 honesty  
**DECISION_RULES:** `decideHealer` (1095–1097) must not select drain, lifesteal-nova, or any `healAmount > 0` damage spell as the ally heal. Require `spellType === "heal"` (or `effectType === "heal"`) and a legal `targetType` of `ally` or `self`. `starter-heal` is `range: 0` / `targetType: "self"` — it cannot ally-heal (parent ROL-04). Drain self-heal EV stays FUT-48 on a **damage** action against an opponent. Apply must not `enemyTakesDamage` the ward.  
**SCORING_MODEL:** Drain-on-ally ⇒ −∞ (dropped).  
**SPELL_REQUIREMENTS:** Heal profile + apply `targetId` (SYS-05).  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always.  
**ENEMY_ARCHETYPES:** healer (and anything heal-first inference currently steals).  
**PLAYER_COUNTERPLAY:** A wounded rook should be healed, not Life-Drained.  
**EDGE_CASES:** Queen with Blood Mend + frost remains artillery once SYS-04 lands; this module still forbids drain-as-heal if inference is wrong.  
**IMPLEMENTATION_COMPLEXITY:** Low.  
**TEST_SCENARIOS:** Kit `[starter-drain, starter-frost]`, wounded ally in range 2 → frost or approach, never drain-on-ally.  
**STATUS:** PROPOSED

### AI-SYS-39

**AI_ID:** AI-SYS-39  
**NAME:** Category apply is not nested under `damage > 0`  
**ROLE:** system  
**SOPHISTICATION:** all (SYS-05 companion)  
**DECISION_RULES:** WX 16459–16670 applies DoT (16609–16625) only inside `spellDmg > 0`. Inferno (`spell-inferno`, `damage: 0`, `isDotSpell`) therefore never writes `applyActiveEffect`. Debuff-only spells can use the later `else if` (16671). Split apply into category siblings keyed by `SpellScoreProfile.effectCategory` / flags (`isDotSpell`, `spellType === "heal"`, `isSummon`, `isSwap`) — never by `spell.name`. Until this lands, kits must not emit Inferno / poison (SYS-02).  
**SCORING_MODEL:** N/A (correctness). A profiled DoT with EV > 0 is illegal to choose if apply cannot write it.  
**SPELL_REQUIREMENTS:** DoT / heal / buff / summon / swap each need a branch.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always.  
**ENEMY_ARCHETYPES:** artillery (inferno), controller (poison), healer.  
**PLAYER_COUNTERPLAY:** Inferno on a bishop should burn, not silently fail into Fire Bolt (FUT-41).  
**EDGE_CASES:** `hitsMultiple` / `aoe` stay FUT-19. Nested DoT on a `damage > 0` hybrid can still apply in the damage branch **and** must not double-apply.  
**IMPLEMENTATION_COMPLEXITY:** Medium (WX apply extract; prefer a pure helper).  
**TEST_SCENARIOS:** `kind: "cast"` Inferno, in range, `damage: 0` → target gains burn DoT; no `e-firebolt`.  
**STATUS:** PROPOSED

### AI-SYS-40

**AI_ID:** AI-SYS-40  
**NAME:** Summoner spawn dest is SYS-13 legal  
**ROLE:** system  
**SOPHISTICATION:** T2 (ROL-06 honesty)  
**DECISION_RULES:** WX 16389–16404 must not spawn at an unchecked midpoint. Placement dest is a free, in-range, LoS-legal (`lineOfSight !== false` unless the summon spell says otherwise), unoccupied, non-void, non-portal, non-reserved cell. If none exists, do **not** `kind: "cast"` — fall through to kit (09-22 FUT-49). Cap/CD remain skip-summon, not skip-turn. Ring scan is FUT-56.  
**SCORING_MODEL:** Illegal dest ⇒ summon EV = −∞.  
**SPELL_REQUIREMENTS:** `isSummon` + `usableByEnemy` (wolf/archer only today).  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always when `isSummoner`.  
**ENEMY_ARCHETYPES:** summoner.  
**PLAYER_COUNTERPLAY:** Sit on the midpoint; they must ring-scan or fall through, not spawn inside you.  
**EDGE_CASES:** Midpoint on a wall today still fires `spawnEnemySummonRef`. Do not “fix” by ignoring occupancy.  
**IMPLEMENTATION_COMPLEXITY:** Medium (decide dest + WX short-circuit re-check).  
**TEST_SCENARIOS:** Midpoint equals player tile → no spawn. Midpoint is wall → no spawn. Legal adjacent free tile → spawn there only after FUT-56; until then skip-summon + kit.  
**STATUS:** PROPOSED

### AI-SYS-41

**AI_ID:** AI-SYS-41  
**NAME:** Unusable assigned ids do not steal the role  
**ROLE:** system  
**SOPHISTICATION:** T2 (SYS-04 companion)  
**DECISION_RULES:** `inferArchetype` (447–452) currently scans `assignedSpells`. King `z >= 1` kit includes `spell-rallying-cry` (`enemyAI.ts` 181–184), which is `usableByEnemy: false` (`spellData.ts` 432). `assignEnemySpells` (WX 11919–11923) resolves ids from the full pool, not `_enemyUsableSpells`. Result after SYS-09: kings become healers and stop using frost. Role comes from spawn metadata (SYS-04). Fallback inference may only inspect ids that are `usableByEnemy !== false` **and** have a profile **and** an apply branch.  
**SCORING_MODEL:** N/A (routing).  
**SPELL_REQUIREMENTS:** Kit emit ∩ profile ∩ enemy-usable.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always. Latent until SYS-09; still file now so kit-width PRs cannot skip it.  
**ENEMY_ARCHETYPES:** king, queen, any kit that lists a heal.  
**PLAYER_COUNTERPLAY:** Readable king control, not a silent Blood-Mend class.  
**EDGE_CASES:** Queen + `starter-heal` (`usableByEnemy` default-true) is still SYS-04 artillery — heal-in-kit must not override role even when the id is usable.  
**IMPLEMENTATION_COMPLEXITY:** Low (filter + SYS-04 field).  
**TEST_SCENARIOS:** King assigned frost + rallying-cry, role missing → caster/controller, not healer. Queen + Blood Mend, role artillery → frost.  
**STATUS:** PROPOSED

---

## 4. T6+ reusable modules (2026-09-23)

Attach via parent §4 sigmoid. Stack; do not replace T0–T5, 09-21 FUT-36…47, or 09-22 FUT-48…53.

### AI-FUT-54

**AI_ID:** AI-FUT-54  
**NAME:** Perpendicular kiter strafe  
**ROLE:** positioning  
**SOPHISTICATION:** T6  
**DECISION_RULES:** Using the **last committed** player walk vector (public; same history as 09-22 FUT-52 / parent ADV-02), prefer a dest that keeps POS-01 range but moves **perpendicular** to that vector (sidestep), not back onto the vacated tile (that is FUT-52 bait for artillery). Cardinal 4-dir only; dest must be in the MP-reachable set.  
**SCORING_MODEL:** `+wStrafe` if `dot(dest − origin, lastPlayerDelta) ≈ 0` and range still legal. `−wBait` if dest equals the tile the player just left (leave that to FUT-52 casters).  
**SPELL_REQUIREMENTS:** Ranged profile (`range > 1`).  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 1.1`, low `pMin`. Ratio-based; never `if (level >= 80)`.  
**ENEMY_ARCHETYPES:** kiter, bishop, archer summon.  
**PLAYER_COUNTERPLAY:** Juke the strafe; occupy both side tiles.  
**EDGE_CASES:** First turn / no history → term 0. Cornered → POS-02. Hidden hover is not a vector.  
**IMPLEMENTATION_COMPLEXITY:** Medium (one public last-delta on the blackboard).  
**TEST_SCENARIOS:** Player walked (5,5)→(5,6); kiter at (5,3) prefers (4,3) or (6,3) over (5,2) if all keep frost range.  
**STATUS:** PROPOSED

### AI-FUT-55

**AI_ID:** AI-FUT-55  
**NAME:** Healer idle is skip/guard, not caster fallback  
**ROLE:** role  
**SOPHISTICATION:** T2 (ROL-04) / honesty  
**DECISION_RULES:** `decideHealer` 1165–1168 returns `decideCaster` when no wound and no guard cell. That caster action can fail apply and Fire-Bolt the player (FUT-41). Idle healer: POS-07 guard if a ward exists, else `kind: "skip"` with **destination = origin** (no dest-commit). Weak damage only if role is dual-kit **and** SYS-04 assigned artillery/support, not because inference saw a heal.  
**SCORING_MODEL:** Fallback caster EV = −∞ for role healer unless an explicit hybrid flag is set at spawn.  
**SPELL_REQUIREMENTS:** Heal profile; optional ranged damage only when role says so.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always for role healer (honesty). Hybrid attach `mu ≈ 0.4`.  
**ENEMY_ARCHETYPES:** healer, wisp.  
**PLAYER_COUNTERPLAY:** You can stand next to an idle wisp without eating a kit-less bolt.  
**EDGE_CASES:** `starter-heal` self-only at 40% own HP is ADV-07, not caster fallback.  
**IMPLEMENTATION_COMPLEXITY:** Low.  
**TEST_SCENARIOS:** Wisp, all allies > 50% HP, adjacent player → skip or guard; no frost; no `e-firebolt`.  
**STATUS:** PROPOSED

### AI-FUT-56

**AI_ID:** AI-FUT-56  
**NAME:** Summoner placement ring  
**ROLE:** role  
**SOPHISTICATION:** T2 (ROL-06) / T6 screen  
**DECISION_RULES:** After SYS-40 rejects an illegal midpoint, scan Chebyshev rings 1…`enemySpellRange(summonSpell)` for a cell that is free, non-hazard if POS-04 attached, and (T6) on the player’s last approach vector (parent FUT-04). Cap the scan at 16 cells. No dest ⇒ FUT-49 kit fall-through.  
**SCORING_MODEL:** Body-block / kite-screen EV as parent ROL-06.  
**SPELL_REQUIREMENTS:** Profiled summon id.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Ring honesty always-on with SYS-40. Vector bias `mu ≈ 0.6`.  
**ENEMY_ARCHETYPES:** summoner.  
**PLAYER_COUNTERPLAY:** Occupy the ring; force frost fall-through.  
**EDGE_CASES:** Do not spawn on reserved portal cells (09-21 SYS-27).  
**IMPLEMENTATION_COMPLEXITY:** Medium.  
**TEST_SCENARIOS:** Midpoint wall, ring cell (3,4) free and in range → spawn (3,4). All illegal → frost if in kit.  
**STATUS:** PROPOSED

### AI-FUT-57

**AI_ID:** AI-FUT-57  
**NAME:** Do not bake hidden crit into EV  
**ROLE:** scoring honesty  
**SOPHISTICATION:** T1+  
**DECISION_RULES:** Apply rolls crit with `Math.random() * 100 < (enemy.chc ?? 2) + (enraged ? 10 : 0)` (WX 16470–16473) **after** decide. `chc` is public on the combatant, but the **roll** is not known at decide time. Killable-now and lethal lookahead use non-crit expected damage only (or `pCrit * 2 + (1−pCrit) * 1` **only** if the module is attached at T4+ and `chc` is on the snapshot). Default: never assume the 2×. Enrage 6× is public and may multiply the **base**, as today.  
**SCORING_MODEL:** Default `ev = scaledMitigated`. Optional T4 `ev = (1+pCrit)*scaledMitigated` with `pCrit = visibleChc/100`, capped so it cannot flip a non-kill into killableNow (killableNow stays non-crit).  
**SPELL_REQUIREMENTS:** Damage/drain.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Honesty always. Expected-crit term `mu ≈ 0.9`.  
**ENEMY_ARCHETYPES:** All damage dealers.  
**PLAYER_COUNTERPLAY:** You cannot be “definitely one-shot” by a 2% crit the AI treated as certain.  
**EDGE_CASES:** Do not read the RNG stream. Do not use player CHC.  
**IMPLEMENTATION_COMPLEXITY:** Low.  
**TEST_SCENARIOS:** Frost EV equals HP exactly at non-crit; `chc: 100` still does not set killableNow unless the T4 module is attached, and even then lookahead must not require the crit.  
**STATUS:** PROPOSED

### AI-FUT-58

**AI_ID:** AI-FUT-58  
**NAME:** Kamikaze blast radius stays summon-tagged  
**ROLE:** spell awareness  
**SOPHISTICATION:** T2+  
**DECISION_RULES:** Bomber `decideSummonBomber` (2387–2393) uses `AI_KAMIKAZE_BLAST_RADIUS` because `spell-inferno.areaRadius` is 0. That is a **named summon behaviour**, not pack artillery. Queens/kings that receive Inferno after SYS-09/02 score it as single-target DoT (SYS-39). Do not copy radius 2 onto pack `spell-inferno`. TEM-05 coordinated AoE uses profiled `hitsMultiple` / `areaRadius` only (`frost-nova`, `lifesteal-nova`).  
**SCORING_MODEL:** Pack Inferno EV = DoT ticks (SYS-02 / FUT-25), not blast count.  
**SPELL_REQUIREMENTS:** Inferno DoT profile for pack; bomber keeps the tagged blast.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always (authoring).  
**ENEMY_ARCHETYPES:** bomber summon vs artillery.  
**PLAYER_COUNTERPLAY:** Spread vs bombers; SR vs queen Inferno ticks.  
**EDGE_CASES:** Admin kit that puts Inferno on a pawn does not grant kamikaze.  
**IMPLEMENTATION_COMPLEXITY:** Low (do-not-implement / test lock).  
**TEST_SCENARIOS:** Queen Inferno vs two adjacent player-side units → one DoT target, not a radius-2 nuke. Bomber still detonates on `AI_KAMIKAZE_MIN_TARGETS`.  
**STATUS:** PROPOSED

### AI-FUT-59

**AI_ID:** AI-FUT-59  
**NAME:** Ice-slip landing EV  
**ROLE:** positioning  
**SOPHISTICATION:** T6  
**DECISION_RULES:** Parent FUT-09 differentiates ice/lava/spikes **costs**. This module scores the **public slip dest** ice already applies (same rule the player walks): if stepping onto ice would slide into lava, a wall, or a pack cluster, EV is the landing tile’s cost, not the ice tile’s. Uses only public hazard + occupancy. No private physics. Berserker may accept a slip onto the player for a melee.  
**SCORING_MODEL:** `U(step onto ice) = U(landing cell) − wIce`. If landing is illegal/void, dest is dropped.  
**SPELL_REQUIREMENTS:** None.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 1.0` plus map ice present.  
**ENEMY_ARCHETYPES:** kiter, artillery, charger (invert: may ride the slip).  
**PLAYER_COUNTERPLAY:** Bait the slip into lava; stand off the landing.  
**EDGE_CASES:** No ice on map → term 0. Slip rules must match player apply; do not invent a longer slide.  
**IMPLEMENTATION_COMPLEXITY:** Medium (needs the public ice-slide helper, not a second formula).  
**TEST_SCENARIOS:** Ice tile slides into lava → kiter does not step there. Ice slides into melee on the player → charger may.  
**STATUS:** PROPOSED

---

## 5. Spell-awareness contract (reminder)

Unchanged: no profile + apply ⇒ not in kit. Do not feed `spellRangeBase` into AI (`targeting.ts` 128–137). `starter-heal` is self-only (`range: 0`). Ally heal needs a ranged heal id **and** apply `targetId` (SYS-05). Heal pickers must not use `healAmount` (SYS-38). Inferno needs SYS-39 before any kit emits it.

Still `usableByEnemy: true` without a working decide+apply pair (do not give these to AI until FUT-22 / SYS-39 / apply):

`spell-swap`, `spell-mark`, `spell-sacrifice`, `spell-lifesteal-nova`, `spell-enrage`, `spell-haste`, `spell-weaken`, `spell-expose`, `spell-drain-courage`, `spell-cursed-wound`, `spell-shadow-veil`, `spell-frost-nova`, `spell-inferno` (DoT `damage: 0`), `starter-poison` / `spell-venom-strike`, `starter-shield` / `spell-iron-skin`, `starter-drain` (as a **heal**).

Keep `usableByEnemy: false` until profiled: barrier, mirror, timestep, rallying-cry, sentinel/bomber/wisp summons. SYS-41: assigned-but-false must not steal healer.

New mechanics still define a `SpellScoreProfile` before `usableByEnemy` flips true.

---

## 6. Implementation order (this increment)

1. P0 **AEE-2026-08-31-002** (Fire Bolt WX **16710–16715**, AP/MP debit, ally heal WX **16648**, FUT-41 pairing).  
2. 09-21 SYS-22…32 (healer LoS, kit CD, summon occupied, resource plan, family `aiTier`, focus prepend).  
3. 09-22 SYS-33…35 (summon side counts, live player tile, SP in EV).  
4. SYS-36, SYS-37, SYS-38, SYS-39, SYS-40, SYS-41 (this file).  
5. Parent T2–T5 roles / team / adaptive. FUT-55 with ROL-04.  
6. FUT-56 with SYS-40 / FUT-49; FUT-57 with SYS-37; FUT-58 as a lock; then T6 FUT-54 / FUT-59.

Each slice: `engine/enemyAI*.test.ts`, zero WX drive-by, no RAF / map gen / turn order / damage-formula edits.

---

## 7. Extra test scenarios

| ID | Setup | Expect |
| :--- | :--- | :--- |
| TS-PACKSIDE | Pack rook + wolf + player + wisp | `allyCount` is enemy-side only (SYS-36). |
| TS-MODRES | `getStatModifier` returns 1, RES 50 | EV uses 50 (SYS-37). |
| TS-DRAINHEAL | Drain in kit, wounded ally | No drain-on-ally (SYS-38). |
| TS-INFERNO0 | Inferno cast, `damage: 0` | Burn applied; no Fire Bolt (SYS-39). |
| TS-SUMMID | Summon midpoint = player tile | No spawn (SYS-40). |
| TS-RALLYROLE | King assigned rallying-cry + frost | Not healer (SYS-41). |
| TS-STRAFE | Player last delta north | Kiter sidesteps (FUT-54). |
| TS-HEALIDLE | Wisp, full-HP allies, adjacent player | Skip/guard, no bolt (FUT-55). |
| TS-SUMRING | Midpoint wall, ring free | Spawn on ring or kit (FUT-56). |
| TS-NOCRIT | HP equals non-crit frost | not killableNow from chc (FUT-57). |
| TS-NOBLAST | Queen Inferno, two adjacent foes | One DoT, not radius 2 (FUT-58). |
| TS-ICESLIP | Ice slides into lava | Kiter skips that step (FUT-59). |

09-21 and 09-22 TS-* rows still apply. Geometry tests cover caster LoS only.

---

## 8. Mapping (new gaps → ids)

| Request / gap | Primary AI_ID |
| :--- | :--- |
| Pack `allyCount` includes player summons | AI-SYS-36 |
| `getEffectiveStat` is a modifier, not RES | AI-SYS-37 |
| Healer picker matches drain `healAmount` | AI-SYS-38 |
| Inferno DoT nested under `damage > 0` | AI-SYS-39 |
| Summoner spawn short-circuit ignores legality | AI-SYS-40 |
| Unusable assigned heal steals king role | AI-SYS-41 |
| Perpendicular kiter strafe | AI-FUT-54 |
| Healer caster-fallback Fire Bolt | AI-FUT-55 |
| Summoner ring placement | AI-FUT-56 |
| Hidden crit not in EV | AI-FUT-57 |
| Bomber radius must not leak to pack Inferno | AI-FUT-58 |
| Ice-slip landing EV | AI-FUT-59 |

Parent §19 still maps the original capability list onto POS / TGT / RES / ROL / TEM / ADV. 09-21 maps combat-parity holes onto SYS-22…32 / FUT-36…47. 09-22 maps summon-side / SP / drain-EV onto SYS-33…35 / FUT-48…53.

T0–T5 requested list (positioning, targeting, resources, roles, team, adaptive) remains parent §19. Nothing in that list is implemented. Higher-level enemies still get harder from **modules on the sigmoid**, not from `computeAITier(enemyLevel)`.

Every row above is **STATUS: PROPOSED**. No production AI in this change.
