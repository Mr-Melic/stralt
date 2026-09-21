# Advanced Enemy AI Evolution — 2026-09-21 increment

**Status:** PROPOSED (design only; no production combat/AI code in this change)  
**Date:** 2026-09-21  
**Parent catalog:** [`ENEMY_AI_EVOLUTION.md`](./ENEMY_AI_EVOLUTION.md) (T0–T5)  
**Prior increments:** [`ENEMY_AI_EVOLUTION_2026-09-01.md`](./ENEMY_AI_EVOLUTION_2026-09-01.md) (SYS-06…12, FUT-01…23), [`ENEMY_AI_EVOLUTION_2026-09-02.md`](./ENEMY_AI_EVOLUTION_2026-09-02.md) (SYS-13…21, FUT-24…35)  
**Implementer ledger:** [`automation/ACTION_IDS_AEE_2026-09-21.md`](./automation/ACTION_IDS_AEE_2026-09-21.md)

This increment re-reads the live engine after combat-rule-parity work landed (`enemyCastGeometryOk`, Frozen Terrain walk cost, `playerCastPlan`, summon leftover-AP `reevaluate`). T0–T5 and SYS-01…SYS-21 plus FUT-01…FUT-35 stay **PROPOSED** and are not restated unless a line number or a fact changed. New work is: WX / helper drift, honesty gaps the 2026-09-02 pass could not see, system modules that keep pack / summon / boss on the **same legal enumerator**, and reusable T6+ scorers that can keep attaching as relative difficulty rises.

Stralt has **no character level cap**. Nothing here maps `if (level >= X) sophistication = Y`. Tiers remain conceptual. Eligibility remains the parent §4 sigmoid (`peer = log2(enemy.level / player.level)` plus pack/boss/modifier terms). A year-later peer fight at any absolute level can attach a new module without raising a cap.

**Hard rules (unchanged):** no cheat, no hidden player information, no ignored LoS/range/AP/MP, no unbounded search, no kit-less Fire Bolt, no `instantKill`, no betrayal-as-difficulty, no name-based spell heuristics, no production AI in this change.

---

## 1. Re-read (2026-09-21) — what moved

All line numbers are from this checkout. Re-read them before implementing. The 2026-09-02 WX cites are **stale** (the file grew; apply and kit sites shifted). Combat-parity PRs added helpers; they did **not** close P0 honesty.

### 1.1 Line-number drift (WX / decide)

| Fact | 2026-09-02 cite | Live (2026-09-21) |
| :--- | :--- | :--- |
| `computeAITier` bands + 30% scramble | `combatMath.ts` 36–52 | **unchanged** 36–52 |
| Spawn `aiTier: computeAITier(enemyLevel)` | WX 5823, 5951 | WX **5823**; family variant **re-rolls** at **5863–5866** (second scramble — SYS-29) |
| Stale comment “10 random spells” then kit assign | WX 12030–12038 | WX **11915–11924** (`buildEnemyKit(..., currentMap.levelZone)` still floors an object) |
| Summoner chance `BASE + player.level * PER` | WX 12047–12057 | WX **11932–11934** (`0.12 + level * 0.02`, 1.0 at player level 44) |
| `aiTier >= 5` erratic (log wild-cast, no apply) | WX 15597–15679 | WX **15507–15591** (still log-only; 0 ms timer) |
| `aiTier >= 10` 5% betrayal + 6× enrage | WX 15683+ | WX **15594–15657**; **15% double-betrayal** 15658+ |
| Pack `aiCombatants` snapshot | WX 16362–16391 | WX **16273–16302** (still HP/pos/level only — no AP, MP, RES, effects) |
| Pack occupied fill | WX 16397–16404 | WX **16308–16315** (pack **does** fill; summon path still does not) |
| Pack decide/apply | 16454+ / 16537+ | decide **16375–16384**; dest-commit **16416–16423**; apply range **16450–16456**; self-heal **16648**; Fire Bolt **16710–16715** |
| Summon `aiOccupied = new Set()` | WX 15250 | WX **15156** (still empty); `availableSpells: summonEnemy.spells ?? []` **15172** |
| `decideEnemyAction` | 1649–1693 | **1662–1707** |
| `setFocusTargetId` writers | 940 / 1526 | **957–958** (caster); `scoreTargets` **528–551** still unread |
| Healer-summon list prepend | (not called out) | **1678–1690** — dead: every `decide*` re-sorts via `scoreTargets` (SYS-30) |
| Charger `canReach` Chebyshev `budget+1` | 1178–1179 | **1195–1196** |
| `pickBossKitSpell` + empty `Map` | `useBossAI.ts` 169–173 | **unchanged** (every decide still `new Map()`) |
| Final Pawn kit-less projectile | 992–1001 | **992–1001** |
| Chessboard Lich `currentTurn % 1 === 0` | 1152 | **1152** |
| Boss minion `ap: 0, mp: 0`, `intelligence: 0` | 16243–16248 | **16154–16159** |
| `inferSummonArchetype` `name.includes` | 211–216 | **217–223** |

`ENEMY_AI_TIER_GATES` (`gameConstants.ts` 200–209) is still unread by `enemyAI.ts`. Master toggles (`AI_LETHAL_LOOKAHEAD_ENABLED`, LoS reposition, backline, overkill spill — 224+) are still **global on**, not relative-eligibility modules.

### 1.2 What combat-parity actually landed (do not re-file as “done SYS-13”)

These are real, useful slices. They are **not** the side-aware live gate and **not** apply honesty.

| Landed | Path | What it is | What it is not |
| :--- | :--- | :--- | :--- |
| Enemy LoS/range helpers | `targeting.ts` `enemySpellRange` 133–137, `enemySpellRequiresLos` 143–147, `enemyCastRangeOk` 158–164, `enemyCastGeometryOk` 166–177 | Chebyshev vs authored `range`; LoS default-on | `minRange`, `linear`, `diagonal`, `freeCells`, same-side `ally`, AP/MP |
| `aiCanCast` | `enemyAI.ts` 320–332 | Decide-time geometry for caster / hunter / archer / `findNearestLegalCastTile` | Not used by `pickBestDamageSpell`, `decideHealer`, or WX apply |
| Frozen Terrain walk rate | `enemyWalkMp.ts` 21–29; `computeReachable` 365–368 | Per-tile cost uses `mapModifierRegistry.applyMpCost` | Budget is still `ENEMY_REACHABLE_STEP_BUDGET = 3`, not `currentMp` |
| Summon leftover-AP follow-up | WX `reevaluate` 15257–15277; `summonExecutor.ts` 73–80 | Honest **template** for move-then-cast **after** a debit | Pack dest-commit is still free; summon MP bill is still Chebyshev teleport (125–126) |
| Player execute plan | `playerCastPlan.ts` `planPlayerCastAttempt` 63–80 | Player AP + cooldown + `isTileCastableLive` | No enemy twin. Apply is a third Chebyshev copy |
| Geometry / Frozen tests | `enemyAI.geometry.test.ts`, `enemyAI.walkMp.test.ts` | LoS flag + Frozen 2× cost vs budget 3 | Not Fire Bolt, AP debit, ally heal apply, focus, summon occupied, boss Map |

**SYS-20 update (normative):** combat-parity explicitly forbids feeding `spellRangeBase` into AI (`targeting.ts` 128–137: bishop frost would grow with `maxRange`). Enemy **distance numbers** stay authored `range`. Enemy **shape gates** (`minRange`, `linear`, `diagonal`, `freeCells`, same-side ally, self/range-0) still must match that side’s live policy. Do not “finish SYS-20” by calling `spellRangeBase` in `enemySpellRange`.

### 1.3 Still true (do not re-file as new)

- `buildEnemyKit(..., currentMap.levelZone)` still floors an object → NaN → zone-0 kits (WX 11920, `enemyAI.ts` 199). AI-SYS-09.
- `scoreTargets` still ignores `ctx.focusTargetId` (528–551). AI-SYS-08.
- `estimateDamage` still returns 0 when `spell.damage <= 0` (501–502). Inferno/poison lose `pickBestDamageSpell`.
- `inferArchetype` still heal-first (447–452).
- `filterHazardCandidates` still HP < 50% (424–441); ice/lava/spikes identical.
- Caster retreat still returns `kind: "skip"` while moving (929–944). Apply then dest-commits (16416–16423).
- Summoner overlay still `0.12 + characterStats.level * 0.02` (constants 298–299). Hits 1.0 at player level 44. AI-FUT-23.
- `getEffectiveStat` is **wired** on pack and summon ctx (WX 16347–16348 / 15183–15184) and still **unused** by `estimateDamage` (only the field exists at `enemyAI.ts` 275).
- Pack apply still Chebyshev-only (16450–16456), no LoS re-check, no AP/MP debit.
- Fallback Crush **or Fire Bolt** when `nd <= 1` (16703–16715). `e-firebolt` is not in any kit.
- Ally/self heal apply still `spellType === "heal" && spellRange === 0` (16648). `decideHealer` can target an ally in Chebyshev range (1098–1112); apply ignores it and may Fire-Bolt the player.
- `longHorizonSim.ts` still forks `buildEnemyKit` and still calls `computeAITier` (16–17, 51–54, 363). AI-FUT-33.
- `engine/summonAI.ts` `runSummonAI` remains unused. Live summon decide is `decideSummonAction` (1760+). Do not grow a third brain.

### 1.4 New honesty gaps (this increment)

1. **`pickBestDamageSpell` is not `aiCanCast`.** It keeps `Number(s.damage) > 0` and `enemySpellRange(s) >= dist` (`enemyAI.ts` 554–573). No LoS, no `minRange`, no linear/diagonal. Caster later calls `aiCanCast` (953); healer and charger adjacent do not. SYS-24.
2. **`decideHealer` skips LoS on purpose.** Range is Chebyshev vs `enemySpellRange` only (1099–1100). `targeting.ts` 155–156 documents that healer / guardian / bomber still use `enemyCastRangeOk` (no LoS). A Blood Mend through a wall is a cheat if `lineOfSight !== false`. SYS-23.
3. **Two resource models.** Summons debit MP (Chebyshev × `mpCostPerTile`, now Frozen-aware) and may `reevaluate` leftover AP. Pack `enemyDestToCommit` walks for free, then range-checks from the new tile, then Fire-Bolts if the cast fails. SYS-25 + SYS-05 combo.
4. **Player gained `planPlayerCastAttempt`; enemies did not.** Apply is still a private `distAM <= Number(chosenSpell.range)` (16450–16456). SYS-26.
5. **Summon decide occupancy is still empty; executor occupancy is not.** WX 15156 vs pack 16308–16315. Executor then `resolveProgressionSafeOccupantCell` (summonExecutor 137–146) can **slide** a dest the decide never saw. SYS-14 still open; SYS-27 is the reserved-cell half.
6. **`findKitSpell` falls back to `assignedSpells`.** Available-first (1741–1744) then the full kit, including on-CD ids. Combined with unfiltered summon `availableSpells` (15172), cooldown is cosmetic. Even after SYS-14, the assigned fallback restores CD spells. SYS-32.
7. **Family variant second-scrambles `aiTier`.** Spawn sets `computeAITier` at 5823; `applyFamilyVariantsToRoster` writes it again at 5865. Two independent 30% rolls to 1–10. SYS-29.
8. **Healer-summon prepend is list-order only.** `decideEnemyAction` 1678–1690 promotes a wisp, then every archetype calls `scoreTargets` which re-sorts. Same class as unread `focusTargetId`. SYS-30.
9. **Map-modifier parity is one-sided.** Walk *rate* uses `applyMpCost` (Slime × Frozen can be 4/tile). Walk *budget* is 3 → stacked maps grant **zero** reachable tiles while a player with real MP can still step. `applyApCost` (Arcane Surge, `mapModifiers.ts` 210–217) never runs for enemies. Thorned Ground (`onDamageDealt` + `pathLength`, 175–188) never sees an AI path. SYS-31.
10. **Family catalog `ap`/`mp` are unused on purpose** (`spawnPolicy.ts` 14–16, 64–65). SYS-07 must seed from an explicit piece/minion table, not a sneak of `FAMILY_STAT_MULTS`. SYS-28.
11. **Boss adjacency is Manhattan `dist === 1`** (`useBossAI.ts` 83–88, 121–126). Pack melee is Chebyshev `nd <= 1` (16705–16709), which matches player `targetType: "enemy"`. Do not “unify” these. SYS-16 reminder; FUT-45.

### 1.5 Tests (coverage still not honesty)

| File | Covers | Still missing |
| :--- | :--- | :--- |
| `enemyAI.charger.test.ts` | wait / advance / adjacent melee | path vs Chebyshev commit (FUT-26) |
| `enemyAI.geometry.test.ts` | caster LoS flag vs wall | healer through-wall; apply Fire Bolt |
| `enemyAI.walkMp.test.ts` | Frozen 2× vs budget 3 | stacked Frozen+Slime vs `currentMp`; Chebyshev teleport bill |
| `targeting.parity.test.ts` | player live vs highlight | enemy apply twin |

Any implementation PR must add pure tests next to `engine/enemyAI.ts` before touching WX. Do not treat geometry/walkMp as coverage for SYS-05.

### 1.6 What this increment does **not** change

T0–T5 (POS / TGT / RES / ROL / TEM / ADV) and SYS-01…SYS-21 plus FUT-01…FUT-35 remain the implementation order. This file adds SYS-22…SYS-32 and FUT-36…FUT-47. Do not implement FUT modules before the honesty + enumerator + side-aware legality slices.

Do not touch RAF, map generation, turn order, or damage formulas to “make AI feel harder.”

---

## 2. Design additions (normative)

1. **Legal = that side’s player-legal action.** Pack LoS stays default-on (`lineOfSight !== false`). Player stays opt-in (`!!lineOfSight`). Enemy distance numbers stay authored `range` (not `spellRangeBase`). Shape gates still match the live helper **parameterised by side**.
2. **One occupancy + one bill.** Pack, summon, and boss-minion decide see the same occupied / barrier / void / portal / hazard / **progression-reserved** sets the executor will use. MP spent = slime/frozen-aware 4-dir path cost inside the reachable set. Chebyshev origin→dest is not a walk bill.
3. **One resource model.** After a paid walk, leftover AP may cast if `aiCanCast` from the dest (the summon `reevaluate` pattern). Pack must not dest-commit for free, then Fire-Bolt a failed heal.
4. **One apply plan.** Enemy apply calls the enemy twin of `planPlayerCastAttempt`: AP (after `applyApCost`), cooldown, `enemyCastGeometryOk` from the committed dest. Illegal ⇒ skip or adjacent Crush, never `e-firebolt`.
5. **Boss abilities stay tagged.** Wall-ignore, board rotate, invincible phase, combo replay, Manhattan adjacency are named `BossAbility` / boss-brain values with UI copy. They are not pack modules and not `aiTier` gates.
6. **T6+ still stacks.** A new module is an extra scorer on the same enumerator. It does not replace T0–T5 and does not require a new integer tier or a player-level table.
7. **Global `AI_*_ENABLED` flags are not eligibility.** Lethal lookahead, overkill spill, LoS reposition, and backline guard attach via SYS-01 rolls. A tutorial remnant can have them off; a peer elite can have them on — at any absolute level.
8. **Family catalog stats are not AI sophistication.** `FAMILY_STAT_MULTS.ap` / `.mp` stay unused until a **separate**, explicit spawn-seed change. Do not treat “start using catalog AP” as an AI tier.

---

## 3. System proposals (2026-09-21)

### AI-SYS-22

**AI_ID:** AI-SYS-22  
**NAME:** Authored enemy range; player `spellRangeBase` stays player-only  
**ROLE:** system  
**SOPHISTICATION:** T1+ (required for any caster decide)  
**DECISION_RULES:** Keep `enemySpellRange = Number(spell.range)` (`targeting.ts` 133–137). Do **not** route AI through `spellRangeBase` (`maxRange ?? max(1, range)`, 111–115) — that was a player Attack-Nearest fix and would silently extend bishop frost. Enumerator still drops dests that fail `minRange`, `linear`, `diagonal`, `freeCells`, same-side `ally`, and that side’s LoS policy (SYS-13 + SYS-20 shape half). Self / `range: 0` heals stay legal without `minRange ?? 1`.  
**SCORING_MODEL:** Illegal dest ⇒ −∞. No EV for a tile the player of that side could not click under **that** range policy.  
**SPELL_REQUIREMENTS:** `SpellConfig` metadata only — never `name`.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always.  
**ENEMY_ARCHETYPES:** All casters, healers, artillery.  
**PLAYER_COUNTERPLAY:** Stand at `minRange − 1`; stand off-axis of linear frost.  
**EDGE_CASES:** Finishing SYS-20 by calling `spellRangeBase` in `enemySpellRange` rebalances every starter kit. `maxRange` on an elite extra stays unused until the **profile** opts into player growth — not by sharing the player helper.  
**IMPLEMENTATION_COMPLEXITY:** Low (document + tests). Medium if shape gates are wired into `aiCanCast`.  
**TEST_SCENARIOS:** Bishop frost `range: 4`, no `maxRange`, dest Chebyshev 4 → legal. Same spell if someone sets `maxRange: 6` → dest 6 **illegal** for AI until a profile says otherwise. Linear dest (2,2) from (0,0) → illegal.  
**STATUS:** PROPOSED

### AI-SYS-23

**AI_ID:** AI-SYS-23  
**NAME:** Healer / guardian / bomber LoS is the spell’s LoS, not a role skip  
**ROLE:** system  
**SOPHISTICATION:** T1+  
**DECISION_RULES:** `decideHealer` (1099–1100) and any branch that currently calls `enemyCastRangeOk` without LoS must call `aiCanCast` / `enemyCastGeometryOk` unless `lineOfSight === false` on **that spell**. Role “healer” is not a wallhack. Guardian body-block remains a **move**, not a through-wall shield. Bomber Inferno still needs a legal dest; blast math stays FUT-19.  
**SCORING_MODEL:** Through-wall dest when the spell requires LoS ⇒ dropped.  
**SPELL_REQUIREMENTS:** Heal / shield / inferno profiles; `lineOfSight` metadata.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always (honesty).  
**ENEMY_ARCHETYPES:** healer, protector, kamikaze summons.  
**PLAYER_COUNTERPLAY:** Break LoS with a wall between the wisp and the wounded rook.  
**EDGE_CASES:** `starter-heal` is `range: 0` self — LoS is N/A. Ally heal at Chebyshev 2 with a wall in between is illegal if `lineOfSight !== false`.  
**IMPLEMENTATION_COMPLEXITY:** Low (swap helper; tests).  
**TEST_SCENARIOS:** Wounded ally, wall between, heal `lineOfSight` default → no cast. Same with `lineOfSight: false` → legal if range holds.  
**STATUS:** PROPOSED

### AI-SYS-24

**AI_ID:** AI-SYS-24  
**NAME:** Spell picker uses the same legality as the enumerator  
**ROLE:** system  
**SOPHISTICATION:** T1+  
**DECISION_RULES:** `pickBestDamageSpell` (554–573) may only return a spell for which `aiCanCast(origin, target, spell, ctx)` is true **or** a reachable dest exists via `findNearestLegalCastTile`. Damage-only + Chebyshev range is not a legality check. DoT-only ids still lose this picker until SYS-02 EV (do not “fix” by treating `damage: 0` as 999).  
**SCORING_MODEL:** Candidate with no legal dest this turn is absent, not scored 0.  
**SPELL_REQUIREMENTS:** Damage/drain profiles with `damage > 0` until SYS-02.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always.  
**ENEMY_ARCHETYPES:** caster, charger, generic, hunter.  
**PLAYER_COUNTERPLAY:** Hide behind a wall inside Chebyshev range — the picker must not still “choose frost.”  
**EDGE_CASES:** Caster already re-checks `aiCanCast` (953); charger adjacent (1197–1213) and apply (16450–16456) do not. A through-wall pick that later Fire-Bolts is SYS-05.  
**IMPLEMENTATION_COMPLEXITY:** Low.  
**TEST_SCENARIOS:** Frost range 4, wall, Chebyshev 3 → picker returns null (or a `lineOfSight: false` alternative).  
**STATUS:** PROPOSED

### AI-SYS-25

**AI_ID:** AI-SYS-25  
**NAME:** One resource model — paid walk, then leftover AP  
**ROLE:** system  
**SOPHISTICATION:** T1+ (honesty); leftover-AP follow-up is T2+ RES-02  
**DECISION_RULES:** Pack apply must debit the same 4-dir path cost summons will debit after SYS-15. After the debit, leftover AP may cast if geometry is legal from the dest — copy summon `reevaluate` (WX 15257–15277), one follow-up max, never a second walk. Missing `currentMp` ⇒ 0 walk (SYS-07), not silent budget 3. Dest-commit without a debit is illegal.  
**SCORING_MODEL:** Combo (move + cast) EV only if both legs pay.  
**SPELL_REQUIREMENTS:** None for the debit; follow-up uses SYS-02.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always for the debit. Follow-up attach is T2+ (`mu ≈ 0.2`).  
**ENEMY_ARCHETYPES:** All walkers.  
**PLAYER_COUNTERPLAY:** Drain MP so the close-in + frost combo no longer fits.  
**EDGE_CASES:** Summon Chebyshev teleport underpays a 4-dir path of 3 to a Chebyshev-2 tile — SYS-15 still required. Pack dest-commit + failed heal + Fire Bolt is SYS-05; this module does not keep the bolt.  
**IMPLEMENTATION_COMPLEXITY:** High (WX pack apply + summon executor; depends on SYS-07 / SYS-15).  
**TEST_SCENARIOS:** MP 2 cannot occupy a 3-step dest. MP 3 walk of 2, AP remaining, frost legal from dest → one cast, no second move.  
**STATUS:** PROPOSED

### AI-SYS-26

**AI_ID:** AI-SYS-26  
**NAME:** Enemy apply twin of `planPlayerCastAttempt`  
**ROLE:** system  
**SOPHISTICATION:** T1+  
**DECISION_RULES:** Extract an `planEnemyCastAttempt` (name flexible) that checks, in order: cooldown remaining, `currentAp` vs `applyApCost(apCost)`, then `enemyCastGeometryOk` from the **committed** dest (or origin if no walk). WX apply (16450–16701) calls it. Failure ⇒ no damage, no DoT, no self-heal lie; melee only if Chebyshev `nd <= 1` and the action was melee or a kit `physical_attack`. Never construct `{ id: "e-firebolt" }` (16712). Do **not** pass raw `isTileCastableLive` (ally is player-side only, 527–539).  
**SCORING_MODEL:** Apply does not score; it rejects.  
**SPELL_REQUIREMENTS:** Any id the enumerator can emit.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always.  
**ENEMY_ARCHETYPES:** All.  
**PLAYER_COUNTERPLAY:** The same LoS/range/AP the player already plays under.  
**EDGE_CASES:** Self-heal `range: 0` must pass geometry (SYS-13). Drain + healAmount (16626) only after a legal damage/drain hit. Paper Windstorm miss (16491) only on a **legal** ranged kit id, not on Fire Bolt.  
**IMPLEMENTATION_COMPLEXITY:** Medium (new helper + WX wire; no RAF).  
**TEST_SCENARIOS:** Failed frost, Chebyshev 1 → Crush or skip. Failed frost, Chebyshev 2 → skip, no bolt. Arcane Surge: AP 2, cost 2 → 1 after modifier → legal.  
**STATUS:** PROPOSED

### AI-SYS-27

**AI_ID:** AI-SYS-27  
**NAME:** Progression-reserved occupancy in decide  
**ROLE:** system  
**SOPHISTICATION:** T1+  
**DECISION_RULES:** Summon executor slides dests off sealed cuts via `resolveProgressionSafeOccupantCell` (`summonExecutor.ts` 137–146) using occupancy that includes `collectMandatoryProgressionCells` (WX 15208–15214). Decide ctx `occupied` for summons is still empty (15156) and has no reserved set. Pack dest-commit (16416–16423) does not slide. One occupancy snapshot: living combatants except self + barriers + void + portals + **reserved progression cells**. If the only dest is reserved, the action is skip — do not plan a tile the executor will relocate.  
**SCORING_MODEL:** Reserved dests are not enumerated.  
**SPELL_REQUIREMENTS:** None.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always.  
**ENEMY_ARCHETYPES:** All walkers, especially summons.  
**PLAYER_COUNTERPLAY:** Body-block the only non-reserved step.  
**EDGE_CASES:** Sliding after decide looks like a teleport. Do not “fix” by letting decide ignore reserved cells.  
**IMPLEMENTATION_COMPLEXITY:** Low–medium (WX snapshot + `computeReachable` already uses `occupied`).  
**TEST_SCENARIOS:** Only legal BFS dest is a reserved portal cell → skip. Pack and summon snapshots contain the same reserved keys.  
**STATUS:** PROPOSED

### AI-SYS-28

**AI_ID:** AI-SYS-28  
**NAME:** Family catalog AP/MP are not an AI seed  
**ROLE:** system  
**SOPHISTICATION:** T1+ (spawn honesty)  
**DECISION_RULES:** `spawnPolicy.ts` 14–16 and 64–65: family `ap`/`mp` are catalog-only; WX never wrote them. SYS-07 seed must use an **explicit** piece / boss-minion / summon table (`maxAp` / `maxMp` already on player summons). Do not start copying `FAMILY_STAT_MULTS.mp` as a sophistication side effect — that rebalances overworld HP-adjacent families and is not a module roll.  
**SCORING_MODEL:** N/A (spawn).  
**SPELL_REQUIREMENTS:** None.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always.  
**ENEMY_ARCHETYPES:** Family variants.  
**PLAYER_COUNTERPLAY:** N/A.  
**EDGE_CASES:** `intelligence: 0` minions (WX 16159) plus `ap: 0, mp: 0` (16154–16155) must mean no walk after SYS-07 (SYS-21), not “use catalog mp: 4.”  
**IMPLEMENTATION_COMPLEXITY:** Low (comment + seed table; no family formula change).  
**TEST_SCENARIOS:** Iron golem family variant after SYS-07 has the piece-table MP, not `FAMILY_STAT_MULTS.iron_golem.mp`, unless a **separate** spawn PR explicitly says so.  
**STATUS:** PROPOSED

### AI-SYS-29

**AI_ID:** AI-SYS-29  
**NAME:** Family variant must not second-scramble `computeAITier`  
**ROLE:** system  
**SOPHISTICATION:** meta (eligibility honesty)  
**DECISION_RULES:** Spawn already assigns `aiTier: computeAITier(enemyLevel)` (WX 5823). `applyFamilyVariantsToRoster` writes `en.aiTier = computeAITier(en.level ?? 1)` again (5863–5866). Each call has a 30% chance to scramble 1–10 (`combatMath.ts` 48–50). Two rolls make “tutorial family wraith with elite gates” more likely, not more tactical. Delete the family re-roll. Replace both with SYS-01 `aiModules` when that lands — never a second level table.  
**SCORING_MODEL:** N/A.  
**SPELL_REQUIREMENTS:** None.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Family variants use the **same** sigmoid as the base roster (`peer` + pack + modifier). A 30% family visual is not +1 AI tier.  
**ENEMY_ARCHETYPES:** All family variants.  
**PLAYER_COUNTERPLAY:** A plague-rat skin is readable; it is not a hidden elite brain.  
**EDGE_CASES:** Keeping `computeAITier` at all is still forbidden (SYS-01 / AEE-2026-08-31-001). This slice is: do not add entropy while that function still exists.  
**IMPLEMENTATION_COMPLEXITY:** Low.  
**TEST_SCENARIOS:** Stub `computeAITier` to increment a counter; family variant path must not call it twice per enemy.  
**STATUS:** PROPOSED

### AI-SYS-30

**AI_ID:** AI-SYS-30  
**NAME:** Harassment prepend is not focus fire  
**ROLE:** system  
**SOPHISTICATION:** T3 (TEM-01) once SYS-08 exists; honesty now  
**DECISION_RULES:** `decideEnemyAction` 1678–1690 prepends the player’s healer summon, then every `decide*` calls `scoreTargets`, which re-sorts and ignores order. Either delete the prepend or make `scoreTargets` add `W.wFocus` when `c.id === ctx.focusTargetId` **or** `c.id === findHealerSummon` for the first pack member this turn (SYS-08). List order is not a blackboard.  
**SCORING_MODEL:** Focus / wisp bonus is an additive weight, not array position.  
**SPELL_REQUIREMENTS:** None.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** T3 `groupTactics` module; T0–T1 nearest-target.  
**ENEMY_ARCHETYPES:** charger, caster, flanker (not healer).  
**PLAYER_COUNTERPLAY:** Park the wisp behind LoS; pack should not still “focus” a target it cannot legally hit.  
**EDGE_CASES:** `summonAI === "wisp"` vs `"healer"` (897–905) — SYS-17 forbids `name.includes`; keep metadata keys only.  
**IMPLEMENTATION_COMPLEXITY:** Low (delete or fold into SYS-08).  
**TEST_SCENARIOS:** Wisp at full HP, player at 10% HP, no focus module → player scores higher. With TEM-01 attached, both chargers share the wisp id.  
**STATUS:** PROPOSED

### AI-SYS-31

**AI_ID:** AI-SYS-31  
**NAME:** Public map modifiers apply to AI spends and walks  
**ROLE:** system  
**SOPHISTICATION:** T1+ (honesty); scoring extras are T4+ FUT-39 / FUT-46  
**DECISION_RULES:** Player walks and casts already run `mapModifierRegistry.applyMpCost` / `applyApCost`. Enemy reachable *rate* uses `enemyWalkCostPerTile` (good). Enemy reachable *budget* is still 3, so Slime+Frozen (4/tile) yields **empty** reachable while a player with 4+ MP can step — either a freeze or a later cheat if someone special-cases AI. After SYS-07, budget = `currentMp` after the same `applyMpCost`. Enemy casts run `applyApCost` (Arcane Surge −1 min 1). Thorned Ground extra damage uses public `pathLength`; dest-commit must pass the 4-dir step count into the same hook the player uses. Do not invent an AI-only thorn exemption.  
**SCORING_MODEL:** Illegal because unaffordable ⇒ dropped. Thorned extra is public EV (negative for the walker if it is the enemy).  
**SPELL_REQUIREMENTS:** None.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always (honesty).  
**ENEMY_ARCHETYPES:** All.  
**PLAYER_COUNTERPLAY:** Fight on Frozen+Slime with low enemy MP; kiting works because they cannot pay.  
**EDGE_CASES:** `applyMpCost` stacks in registry order (`mapModifiers.ts` 524–535). Cost 4 vs budget 3 is a lock **today**. Do not raise `ENEMY_REACHABLE_STEP_BUDGET` to “fix” stacked maps — that is a level-free cheat.  
**IMPLEMENTATION_COMPLEXITY:** Medium (SYS-07 + applyApCost + pathLength on dest-commit).  
**TEST_SCENARIOS:** Frozen+Slime, `currentMp: 3` → no dest. `currentMp: 4` → one tile. Arcane Surge, frost `apCost: 2`, `currentAp: 1` → legal. Thorned path length 3 → same extra damage as the player.  
**STATUS:** PROPOSED

### AI-SYS-32

**AI_ID:** AI-SYS-32  
**NAME:** Kit lookup must not fall back to on-cooldown assigned spells  
**ROLE:** system  
**SOPHISTICATION:** T1+  
**DECISION_RULES:** `findKitSpell` (1737–1745) returns `assignedSpells` when the id is missing from `availableSpells`. Pack filters CD (WX 16268–16271); summon ctx does not (15172). After SYS-14 fills summon available, the assigned fallback **re-introduces** CD ids. Lookup is available-only. Missing id ⇒ that kit slot is not ready.  
**SCORING_MODEL:** On-CD spell is absent (RES-05).  
**SPELL_REQUIREMENTS:** `SUMMON_KIT` ids.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always.  
**ENEMY_ARCHETYPES:** hunter, guardian, archer, bomber, healer summons.  
**PLAYER_COUNTERPLAY:** Force a guardian shield, then the next turn is a body-block, not a second shield.  
**EDGE_CASES:** Empty available + assigned frost on CD 2 → no frost. Do not “fix” by reading assigned and then ignoring `cooldown`.  
**IMPLEMENTATION_COMPLEXITY:** Low.  
**TEST_SCENARIOS:** Guardian `starter-shield` remaining CD 2, available filtered empty → no shield cast.  
**STATUS:** PROPOSED

---

## 4. T6+ reusable scorers (2026-09-21)

Attach via parent §4 sigmoid. Stack; do not replace T0–T5. Do not implement before SYS-05, SYS-13, SYS-22…SYS-26, SYS-31.

### AI-FUT-36

**AI_ID:** AI-FUT-36  
**NAME:** Public shield absorb EV  
**ROLE:** adaptive targeting  
**SOPHISTICATION:** T4  
**DECISION_RULES:** Player melee apply already reads `shieldHpRef` (WX 16750–16758). `estimateDamage` does not. When the shield HP is **public** (on-bar / combatant field), expected damage to HP is `max(0, raw − shield)`. Prefer unshielded summons (TGT-04) or a DoT that bypasses the shield **only if** the spell profile says so. Hidden pending shield clicks are not visible.  
**SCORING_MODEL:** `evHp = max(0, estimate − publicShield)`. Kill flag uses `evHp`, not raw.  
**SPELL_REQUIREMENTS:** Damage profiles; DoT profiles if they legitimately ignore shield (today they do not unless apply says so).  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.6`, `sigma ≈ 0.45`, `pMin = 0`, `pMax = 0.7`. Boss/leader `pack` term.  
**ENEMY_ARCHETYPES:** assassin, artillery, charger.  
**PLAYER_COUNTERPLAY:** Pre-cast Iron Skin before the pack’s turn; they should retarget the wolf.  
**EDGE_CASES:** Shield 0 is the current default. Do not read a debug overlay the player cannot see.  
**IMPLEMENTATION_COMPLEXITY:** Low once SYS-10 snapshots shield.  
**TEST_SCENARIOS:** Player shield 20, wolf 10 HP, same raw hit → wolf scores the kill.  
**STATUS:** PROPOSED

### AI-FUT-37

**AI_ID:** AI-FUT-37  
**NAME:** Public mirror — do not shoot  
**ROLE:** adaptive  
**SOPHISTICATION:** T4  
**DECISION_RULES:** Apply already `consumePlayerMirror` on non-AoE hits (WX 16497–16530). If a mirror unit/effect is **public**, damage spells that would reflect score as self-damage EV (or skip). Prefer melee Crush, a `hitsMultiple` profile that apply does not mirror, or a different target. Do not copy Mirror Sovereign `COMBO_REPLAY` (FUT-34).  
**SCORING_MODEL:** `ev = −wSelf * reflectedDamage` for mirrored ids; melee EV unchanged.  
**SPELL_REQUIREMENTS:** Damage ids apply currently mirrors.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.8`, `pMax = 0.65`.  
**ENEMY_ARCHETYPES:** caster, artillery, controller.  
**PLAYER_COUNTERPLAY:** Drop mirror, bait a frost, then drop it.  
**EDGE_CASES:** AoE / `hitsMultiple` already skip consume (16497–16498) — do not invent a new reflect. Family `void_mirror` stays FUT-08.  
**IMPLEMENTATION_COMPLEXITY:** Low.  
**TEST_SCENARIOS:** Public mirror, frost vs Crush in range → Crush or skip. No mirror → frost.  
**STATUS:** PROPOSED

### AI-FUT-38

**AI_ID:** AI-FUT-38  
**NAME:** Pack leftover-AP redecide (summon template)  
**ROLE:** resource  
**SOPHISTICATION:** T2–T3 (RES-02)  
**DECISION_RULES:** After SYS-25 pays the walk, run one `reevaluate` with remaining AP/MP from the dest, same as WX 15257–15277. Only `cast` / `melee`. No second `move`. T0–T1 may walk **or** cast, not both, until this module attaches.  
**SCORING_MODEL:** Parent RES-02 combo EV under SYS-03 node cap.  
**SPELL_REQUIREMENTS:** Profiled kit ids.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.2`, `pMin = 0.15` for peer casters, `pMax = 0.85`.  
**ENEMY_ARCHETYPES:** caster, kiter, artillery.  
**PLAYER_COUNTERPLAY:** End the turn one tile outside frost after their MP is spent.  
**EDGE_CASES:** Re-decide must see updated `occupied` (self vacated — FUT-42) and must not use empty summon occupancy (SYS-14).  
**IMPLEMENTATION_COMPLEXITY:** Medium after SYS-25.  
**TEST_SCENARIOS:** Walk 2, frost legal, AP left → cast. Walk 2, AP 0 → no cast. Re-decide returns `move` → ignored.  
**STATUS:** PROPOSED

### AI-FUT-39

**AI_ID:** AI-FUT-39  
**NAME:** Stacked movement-cost scoring  
**ROLE:** positioning  
**SOPHISTICATION:** T4  
**DECISION_RULES:** After SYS-31, remaining MP after `applyMpCost` is public. Prefer dests that leave an escape tile (POS-08) on Frozen/Slime. Do not raise the constant budget. Ice **hazard tiles** stay FUT-09 (status), distinct from Frozen **modifier** cost.  
**SCORING_MODEL:** `−wTrap` if leftover MP < cost of the only retreat tile.  
**SPELL_REQUIREMENTS:** None.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.4`, map-modifier term already in parent `score`.  
**ENEMY_ARCHETYPES:** kiter, caster, assassin.  
**PLAYER_COUNTERPLAY:** Force them onto Frozen with 4 MP so a 2-step approach cannot also leave.  
**EDGE_CASES:** Budget-3 lock on stacked maps without SYS-07 is a bug, not this module.  
**IMPLEMENTATION_COMPLEXITY:** Low after SYS-07/31.  
**TEST_SCENARIOS:** Frozen only (2/tile), MP 4, two-step approach vs one-step + hold — kiter with module prefers hold if frost already legal.  
**STATUS:** PROPOSED

### AI-FUT-40

**AI_ID:** AI-FUT-40  
**NAME:** Global `AI_*_ENABLED` becomes module attach  
**ROLE:** system / sophistication  
**SOPHISTICATION:** T2–T5 depending on flag  
**DECISION_RULES:** `AI_LETHAL_LOOKAHEAD_ENABLED`, `AI_OVERKILL_SPILL_ENABLED`, `AI_LOS_REPOSITION_ENABLED`, `AI_BACKLINE_PROTECT_ENABLED` (`gameConstants.ts` 224+) are global on. That gives tutorial remnants elite lookahead. Each flag becomes a module id on `aiModules` (SYS-01). Constants may remain as **dev kill-switches** (all off) but spawn must not force all on. Overkill spill remains retarget, not hidden splash (SYS-19).  
**SCORING_MODEL:** Unchanged helpers; gated by membership.  
**SPELL_REQUIREMENTS:** None.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Lethal `mu ≈ 0.5`; overkill `mu ≈ 0.7`; LoS reposition `mu ≈ 0.0` (T1+); backline `mu ≈ 0.3` for healer/protector.  
**ENEMY_ARCHETYPES:** matching roles.  
**PLAYER_COUNTERPLAY:** Weak remnants do not sidestep for LoS.  
**EDGE_CASES:** Dev toggle off still disables even if the module attached (debug). Never `if (aiTier >= 4) lookahead`.  
**IMPLEMENTATION_COMPLEXITY:** Low.  
**TEST_SCENARIOS:** Enemy without `ai-lethal` does not swap to a kill target. With module, it does.  
**STATUS:** PROPOSED

### AI-FUT-41

**AI_ID:** AI-FUT-41  
**NAME:** Dest-commit + failed cast must not become Fire Bolt  
**ROLE:** honesty test / apply  
**SOPHISTICATION:** T1 (SYS-05 companion)  
**DECISION_RULES:** Today dest-commit (16416–16423) runs **before** the cast branch. A `kind: "cast"` heal that fails `spellRange === 0` (16648) falls through to `!didAct` (16704) and, if `nd <= 1`, 50% Fire Bolt (16710–16715). Module for implementers: treat this pairing as one bug. After SYS-05/26, failed cast + adjacent = Crush or skip; failed cast + not adjacent = skip; the walk only stands if MP was paid (SYS-25).  
**SCORING_MODEL:** N/A.  
**SPELL_REQUIREMENTS:** None.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always (remove cheat).  
**ENEMY_ARCHETYPES:** healer, caster.  
**PLAYER_COUNTERPLAY:** Stand adjacent to a would-be healer — you should not eat a kit-less bolt.  
**EDGE_CASES:** Caster `kind: "skip"` retreat that dest-commits (929–944) is a **move**; log it as move, debit MP, no bolt.  
**IMPLEMENTATION_COMPLEXITY:** Low once SYS-05 is in flight.  
**TEST_SCENARIOS:** Queen heal ally at range 2, adjacent to player, heal apply rejected → no `e-firebolt`.  
**STATUS:** PROPOSED

### AI-FUT-42

**AI_ID:** AI-FUT-42  
**NAME:** Enumerator vacates origin on move-then-cast  
**ROLE:** occupancy  
**SOPHISTICATION:** T2+  
**DECISION_RULES:** Combo enum (SYS-03 depth 2 / FUT-38) must treat the origin as free for **other** dests after the walker leaves, matching summon `occupancyVacating` (summonExecutor 137–139). Do not let two pack members path through a cell the first has not vacated **this turn** (still occupied for the next actor). Self-vacate is only for the acting unit’s own combo.  
**SCORING_MODEL:** Dest on a cell still occupied by another living unit ⇒ dropped.  
**SPELL_REQUIREMENTS:** None.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always once combos exist.  
**ENEMY_ARCHETYPES:** All walkers.  
**PLAYER_COUNTERPLAY:** Stand on the only cell they would vacate-into.  
**EDGE_CASES:** Do not vacate before the walk is paid. Do not vacate for a skipped retreat that apply still dest-commits until SYS-25 logs it as move.  
**IMPLEMENTATION_COMPLEXITY:** Low after SYS-03.  
**TEST_SCENARIOS:** Origin (2,2), dest (2,3), frost from dest; a second dest equal to origin is legal for **this** unit’s combo, not for the next enemy.  
**STATUS:** PROPOSED

### AI-FUT-43

**AI_ID:** AI-FUT-43  
**NAME:** `getEffectiveStat` is the TGT-05 source  
**ROLE:** targeting  
**SOPHISTICATION:** T2  
**DECISION_RULES:** Ctx already wires `getEffectiveStat` (WX 16347–16348). `estimateDamage` ignores RES/SR. TGT-05 reads visible RES/SR via that callback (and SYS-10 snapshot fields). Scoring **estimates**; resolution stays the existing apply formula. Do not change `calcScaledDamage`.  
**SCORING_MODEL:** `ev = raw * (1 − visSp/100) * (1 − visRes/100)` matching apply 16532–16536.  
**SPELL_REQUIREMENTS:** Damage/drain.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.0` once SYS-10 exists (cheap); pMax 1.0.  
**ENEMY_ARCHETYPES:** All damage dealers.  
**PLAYER_COUNTERPLAY:** Stack RES; they should prefer the unarmored wolf.  
**EDGE_CASES:** Missing snapshot ⇒ treat RES 0 (today’s behaviour), never invent a hidden RES.  
**IMPLEMENTATION_COMPLEXITY:** Low.  
**TEST_SCENARIOS:** Player RES 50, summon RES 0, same HP → summon preferred.  
**STATUS:** PROPOSED

### AI-FUT-44

**AI_ID:** AI-FUT-44  
**NAME:** Paper Windstorm miss only on legal kit ranged  
**ROLE:** adaptive  
**SOPHISTICATION:** T4 (uses FUT-21)  
**DECISION_RULES:** Apply rolls 50% miss for Paper Windstorm on `spellRange > 1` (16491) **and** on Fire Bolt (16729). After SYS-05 the bolt is gone. FUT-21 scores expected miss on **legal** ranged kit ids. Do not score a miss chance on a cheat projectile.  
**SCORING_MODEL:** `ev *= 0.5` when the public modifier is active and the spell is ranged.  
**SPELL_REQUIREMENTS:** Ranged damage profiles.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Map-modifier term; `mu ≈ 0.3`.  
**ENEMY_ARCHETYPES:** caster, artillery.  
**PLAYER_COUNTERPLAY:** Fight on Paper Windstorm; they should step in for Crush more often.  
**EDGE_CASES:** Melee Crush `range: 1` does not roll miss today — keep that.  
**IMPLEMENTATION_COMPLEXITY:** Low after SYS-05.  
**TEST_SCENARIOS:** Windstorm + frost EV is half of a no-windstorm frost; Crush EV unchanged.  
**STATUS:** PROPOSED

### AI-FUT-45

**AI_ID:** AI-FUT-45  
**NAME:** Boss Manhattan adjacency stays tagged  
**ROLE:** boss / system  
**SOPHISTICATION:** T5 (boss brain only)  
**DECISION_RULES:** `useBossAI.ts` `dist` / `isAdjacent` are Manhattan (83–88, 121–126). Pack melee is Chebyshev (16705–16709), matching player `targetType: "enemy"`. Do not give pack Manhattan (nerfs diagonal Crush). Do not give bosses Chebyshev (buffs diagonal boss hits) unless a **named** ability says so. Final Pawn `d <= 3 && d > 1` (992–1001) is still kit-less — SYS-16.  
**SCORING_MODEL:** N/A for pack.  
**SPELL_REQUIREMENTS:** Boss kit ids via live cooldown Map.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Boss flag only.  
**ENEMY_ARCHETYPES:** bosses.  
**PLAYER_COUNTERPLAY:** Diagonal adjacent to a boss that uses Manhattan is not melee until they step cardinal.  
**EDGE_CASES:** `KNIGHT_JUMP_IGNORE_WALLS` stays Cavalier-only.  
**IMPLEMENTATION_COMPLEXITY:** None for pack; SYS-16 for pawn bolt.  
**TEST_SCENARIOS:** Pack pawn diagonal to player → melee legal. Final Pawn Manhattan 3, empty pool → no projectile.  
**STATUS:** PROPOSED

### AI-FUT-46

**AI_ID:** AI-FUT-46  
**NAME:** Visible Arcane Surge leftover-AP  
**ROLE:** resource  
**SOPHISTICATION:** T4  
**DECISION_RULES:** After SYS-31, `applyApCost` is public. Score a second cheap spell (RES-01) when Surge drops cost by 1. Do not assume Surge without the map announcing it.  
**SCORING_MODEL:** Combo EV with post-modifier costs.  
**SPELL_REQUIREMENTS:** Two profiled ids whose costs fit leftover AP.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Map-modifier term; `mu ≈ 0.5`.  
**ENEMY_ARCHETYPES:** caster, support.  
**PLAYER_COUNTERPLAY:** You also get Surge; they spend the extra point instead of skipping.  
**EDGE_CASES:** Min cost 1 (`mapModifiers.ts` 216) — never free casts.  
**IMPLEMENTATION_COMPLEXITY:** Low after SYS-03/31.  
**TEST_SCENARIOS:** AP 3, frost 2, poison 2; with Surge both 1+1 → combo legal; without Surge only one.  
**STATUS:** PROPOSED

### AI-FUT-47

**AI_ID:** AI-FUT-47  
**NAME:** Summon `reevaluate` uses the post-move snapshot  
**ROLE:** summon honesty  
**SOPHISTICATION:** T1+  
**DECISION_RULES:** WX `reevaluate` (15257–15277) passes the **same** `aiCtx` built with empty `occupied` (15156). Post-move position is on the summon arg; occupancy is still stale. After SYS-14/27, rebuild occupied (self vacated, dest occupied) before the second `decideSummonAction`. Otherwise the follow-up can path through the player again and the executor rejects — a skipped second action, not a cheat walk, but it wastes the honesty template.  
**SCORING_MODEL:** Occupied dests dropped on the follow-up too.  
**SPELL_REQUIREMENTS:** `SUMMON_KIT`.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always (summon honesty).  
**ENEMY_ARCHETYPES:** hunter, archer, bomber.  
**PLAYER_COUNTERPLAY:** Step onto the tile they vacated if you win initiative — they must not re-occupy you.  
**EDGE_CASES:** One re-decide max (already). `kind: "move"` follow-up is already ignored (15274–15276).  
**IMPLEMENTATION_COMPLEXITY:** Low after SYS-14.  
**TEST_SCENARIOS:** Wolf moves to (3,4); player on (3,3); follow-up dest ≠ (3,3).  
**STATUS:** PROPOSED

---

## 5. Spell-awareness contract (reminder)

Unchanged: no profile + apply ⇒ not in kit, not in elite extras, `usableByEnemy` treated as false in the enumerator.

Still `usableByEnemy: true` without a working decide+apply pair (do not give these to AI until FUT-22 / FUT-25 / FUT-31 / apply):

`spell-swap`, `spell-mark`, `spell-sacrifice`, `spell-lifesteal-nova`, `spell-enrage`, `spell-haste`, `spell-weaken`, `spell-expose`, `spell-drain-courage`, `spell-cursed-wound`, `spell-shadow-veil`, `spell-frost-nova`, `spell-inferno` (DoT `damage: 0`), `starter-poison` / `spell-venom-strike`, `starter-shield` / `spell-iron-skin`.

Keep `usableByEnemy: false` until profiled: barrier, mirror, timestep, rallying-cry, sentinel/bomber/wisp summons.

`starter-heal` is self-only (`range: 0`). It cannot satisfy ROL-04 ally heal. SYS-13 must keep that legal for **self**. Queen + `starter-heal` still must not become a healer (SYS-04) when kit width is repaired (SYS-09).

New mechanics still define a `SpellScoreProfile` before `usableByEnemy` flips true. Combat-parity’s `playerCastPlan` is not a profile.

---

## 6. Implementation order (this increment)

Do not start FUT-36+ first. Do not start T6+ from 2026-09-01/02 before P0 honesty.

1. SYS-05 (Fire Bolt WX **16710–16715**, AP/MP debit, ally heal WX **16648**) + FUT-41 (dest-commit + failed heal pairing).  
2. SYS-26 (apply twin) + SYS-13 + SYS-22 + SYS-23 + SYS-24 (legality: side-aware, authored range, healer LoS, picker = `aiCanCast`).  
3. SYS-14 + SYS-32 + SYS-21 + SYS-27 + FUT-47 — summon occupied/CD/reserved; `findKitSpell` available-only; minion seed.  
4. SYS-07 + SYS-15 + SYS-25 + SYS-31 — actual MP, path-cost bill, leftover AP, modifier parity.  
5. SYS-29 + SYS-01 — stop double `computeAITier`; relative `aiModules`. SYS-28 while seeding.  
6. SYS-08 + SYS-30 + SYS-10 — focus actually scored; delete dead prepend; snapshot AP/MP/RES/effects/shield.  
7. SYS-09, SYS-12, SYS-16, SYS-17, SYS-18, SYS-19 — kit width, erratic not a tier, boss Map + pawn bolt, name heuristics, dormant fields, overkill honesty.  
8. Parent T2–T5 roles / team / adaptive. FUT-40 converts global flags.  
9. FUT-36, FUT-37, FUT-43, FUT-38, FUT-42, FUT-39, FUT-44, FUT-46, FUT-45 as apply/snapshot land.  
10. FUT-01…FUT-35 as before.

Each slice: `engine/enemyAI*.test.ts`, zero WX drive-by, no RAF / map gen / turn order / damage-formula edits. Scoring **reads** RES/SR/shield/mirror; it does not change `calcScaledDamage`.

P0 remains **AEE-2026-08-31-002** (Fire Bolt / apply honesty) then **AEE-2026-09-21-001** (apply twin + authored-range legality). T6+ only after honesty + side-aware legality.

---

## 7. Extra test scenarios

| ID | Setup | Expect |
| :--- | :--- | :--- |
| TS-AUTHRANGE | Frost `range: 4`, `maxRange: 6` | Dest 6 illegal for AI; dest 4 legal. |
| TS-HEALLOS | Ally Chebyshev 2, wall, default LoS | No heal cast. |
| TS-PICKLOS | Frost Chebyshev 3 through wall | `pickBestDamageSpell` null. |
| TS-REDECIDE | MP 3 walk 2, AP left, frost legal | One follow-up cast; no second walk. |
| TS-PLAN | Failed frost, `nd == 1` | Crush or skip; never `e-firebolt`. |
| TS-RESERVE | Only BFS dest is reserved portal | Skip. |
| TS-FAMAP | Family variant after SYS-07 | Piece-table MP, not catalog `mp`. |
| TS-TIER2 | Family variant spawn | `computeAITier` once, not twice. |
| TS-PREPEND | Wisp full HP, player 10% HP, no TEM-01 | Player preferred. |
| TS-STACKMP | Frozen+Slime, MP 3 | No dest; MP 4 → one tile. |
| TS-KITCD | Shield CD 2, assigned still has id | `findKitSpell` null. |
| TS-SHIELD | Public shield 20, wolf 10 HP | Wolf is the kill. |
| TS-MIRROR | Public mirror, frost vs Crush | Crush or skip. |
| TS-SURGE | Arcane Surge, AP 1, frost base 2 | Legal after `applyApCost`. |
| TS-BOLT3 | Heal apply rejected, adjacent player | No Fire Bolt (FUT-41). |
| TS-PAWN2 | Final Pawn Manhattan 3 | No kit-less projectile (SYS-16). |

Parent and 2026-09-01/02 TS-* rows still apply (with **new** WX line numbers from §1.1).

---

## 8. Mapping (new gaps → ids)

| Request / gap | Primary AI_ID |
| :--- | :--- |
| `spellRangeBase` must not enter AI | AI-SYS-22 |
| Healer/guardian/bomber LoS skip | AI-SYS-23 |
| `pickBestDamageSpell` vs `aiCanCast` | AI-SYS-24 |
| Pack free dest-commit vs summon pay+redecide | AI-SYS-25 |
| No enemy twin of `planPlayerCastAttempt` | AI-SYS-26 |
| Reserved progression occupancy | AI-SYS-27 |
| Family catalog AP/MP sneak | AI-SYS-28 |
| Family second `computeAITier` scramble | AI-SYS-29 |
| Healer-summon prepend ignored by `scoreTargets` | AI-SYS-30 |
| Modifier AP/MP/thorned pathLength | AI-SYS-31 |
| `findKitSpell` assigned CD fallback | AI-SYS-32 |
| Public shield EV | AI-FUT-36 |
| Public mirror don’t-cast | AI-FUT-37 |
| Pack leftover-AP redecide | AI-FUT-38 |
| Stacked Frozen+Slime scoring | AI-FUT-39 |
| Global `AI_*_ENABLED` → modules | AI-FUT-40 |
| Dest-commit + failed heal → Fire Bolt | AI-FUT-41 |
| Self-vacate in combo enum | AI-FUT-42 |
| Wired `getEffectiveStat` unused | AI-FUT-43 |
| Windstorm miss on legal ranged only | AI-FUT-44 |
| Boss Manhattan vs pack Chebyshev | AI-FUT-45 |
| Visible Arcane Surge leftover AP | AI-FUT-46 |
| Summon redecide stale occupancy | AI-FUT-47 |

T0–T5 requested list (positioning, targeting, resources, roles, team, adaptive) remains parent §19. Nothing in that list is implemented. Higher-level enemies still get harder from **modules on the sigmoid**, not from `computeAITier(enemyLevel)` and not from a second family scramble.

---

## 9. Capability coverage (still proposed)

The 2026-08-31 catalog already maps every requested capability to a POS/TGT/RES/ROL/TEM/ADV id. This increment does not replace those modules. It records why they still cannot ship: the enumerator is not legal, apply can Fire-Bolt, and combat-parity helpers are decide-time only.

| Family | Still blocked by |
| :--- | :--- |
| Positioning | SYS-07/15/25/27/31 (budget 3, free walk, reserved cells, stacked cost) |
| Target selection | SYS-08/10/24/30, FUT-36/37/43 (`scoreTargets` unread focus, no RES/shield) |
| Resource planning | SYS-03/05/25/32, FUT-38/46 (no AP, CD fallback, no combo pay) |
| Role behaviour | SYS-04/09 (heal-first, zone-0 kits) |
| Team behaviour | SYS-08/30 (focus writer without reader) |
| Advanced adaptive | SYS-10, FUT-36/37/39/44 (no public AP/MP/shield/mirror in the snapshot) |
