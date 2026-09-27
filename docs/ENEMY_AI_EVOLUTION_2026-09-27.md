# Advanced Enemy AI Evolution — 2026-09-27 increment

**Status:** PROPOSED (design only; no production code in this change)  
**Date:** 2026-09-27  
**Parent catalog:** [`ENEMY_AI_EVOLUTION.md`](./ENEMY_AI_EVOLUTION.md) (T0–T5)  
**Prior increments:** [`ENEMY_AI_EVOLUTION_2026-09-01.md`](./ENEMY_AI_EVOLUTION_2026-09-01.md) · [`ENEMY_AI_EVOLUTION_2026-09-02.md`](./ENEMY_AI_EVOLUTION_2026-09-02.md) · [`ENEMY_AI_EVOLUTION_2026-09-21.md`](./ENEMY_AI_EVOLUTION_2026-09-21.md) (open PR #351; SYS-22…32, FUT-36…47 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-22.md`](./ENEMY_AI_EVOLUTION_2026-09-22.md) (open PR #416; SYS-33…35, FUT-48…53 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-23.md`](./ENEMY_AI_EVOLUTION_2026-09-23.md) (open PR #458; SYS-36…41, FUT-54…59 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-24.md`](./ENEMY_AI_EVOLUTION_2026-09-24.md) (open PR #506; SYS-42…47, FUT-60…65 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-25.md`](./ENEMY_AI_EVOLUTION_2026-09-25.md) (open PR #565; SYS-48…53, FUT-66…71 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-26.md`](./ENEMY_AI_EVOLUTION_2026-09-26.md) (open PR #633; SYS-54…59, FUT-72…77 — **do not re-number**)  
**Implementer ledger:** [`automation/ACTION_IDS_AEE_2026-09-27.md`](./automation/ACTION_IDS_AEE_2026-09-27.md)

This increment re-reads the live engine one day after the 2026-09-26 catalog. SYS-01…59 and FUT-01…77 stay **PROPOSED** on their own files; they are **not** re-filed here except where a 09-26 fact is **wrong** (SYS-59’s “player-only Plague Zone”). New work is: turn-start HP that actually lands on the combatant store vs `applyTurnStart` ghosts, the one-sided damage-modifier registry, pack dest-commit that cannot destack reserved bridges, public Shield Charm soak, player-only `applyApCost`, and Null Field vs decide.

Stralt has **no character level cap**. Nothing here maps `if (level >= X) sophistication = Y`. Tiers remain conceptual. Eligibility remains the parent §4 sigmoid (`peer = log2(enemy.level / player.level)` plus pack/boss/modifier terms). A year-later peer fight at any absolute level can attach a new module without raising a cap.

**Hard rules (unchanged):** no cheat, no hidden player information, no ignored LoS/range/AP/MP, no unbounded search, no kit-less Fire Bolt, no `instantKill`, no betrayal-as-difficulty, no name-based spell heuristics, no production AI in this change.

Open production PRs that already slice honesty (do **not** re-file the ids):

| Open PR | Catalog id | What it changes |
| :--- | :--- | :--- |
| [#495](https://github.com/Mr-Melic/stralt/pull/495) (draft) | AI-SYS-34 | Apply `targetCell` from `playerPositionRef`. Not on this checkout. |
| [#498](https://github.com/Mr-Melic/stralt/pull/498) (draft) | AI-SYS-45 | Boss kit-spell apply must not commit `targetX/Y` as a walk dest. Not on this checkout. |
| [#487](https://github.com/Mr-Melic/stralt/pull/487) (draft) | (not a tactic) | Betrayal kills enter the death pipeline. Spectacle remains forbidden as sophistication. |
| [#644](https://github.com/Mr-Melic/stralt/pull/644) (draft) | (player drain) | Catalog `spellType` drain as player lifesteal. Not live; do not give enemies drain-as-heal until it ships **and** SYS-38 exists. |
| [#647](https://github.com/Mr-Melic/stralt/pull/647) (draft) | (Soul Rend apply) | Do not emit Soul Rend in kits until apply lands real damage (SYS-02 / SYS-39 class). |
| [#649](https://github.com/Mr-Melic/stralt/pull/649) (draft) | (Trap tiles) | Ground trap legality is player-side until a profile + SYS-13 exist. |
| [#654](https://github.com/Mr-Melic/stralt/pull/654) (draft) | (void holes) | Map-gen void vs live gate. Occupancy already refuses `voidTiles` in `isCellFree`. |
| [#658](https://github.com/Mr-Melic/stralt/pull/658) (draft) | (RES/SP shreds) | Catalog shreds in `getStatModifier`. Scoring may read the result after it ships; do not change `calcScaledDamage`. |
| [#659](https://github.com/Mr-Melic/stralt/pull/659) (draft) | (Shield RES melee) | Distinct from this file’s SYS-63 (`shieldHpRef` pool). |

This docs PR does **not** edit [`ENEMY_AI_EVOLUTION.md`](./ENEMY_AI_EVOLUTION.md) (open PR #351 unions that header). Unique files only.

---

## 1. Re-read (2026-09-27)

All line numbers are from this checkout. Re-read them before implementing.

### 1.1 Combat-parity still is not sophistication

Unchanged from 2026-09-21…26: `enemyCastGeometryOk` (`targeting.ts` 166–177), `aiCanCast` (`enemyAI.ts` 320–332), Frozen walk *rate* (`enemyWalkMp.ts` 21–29), `playerCastPlan.ts` (player only; `applyApCost` at WX 10335 / 17129), summon leftover-AP `reevaluate` (WX 15257–15276). These are **not** SYS-05 / SYS-13 / SYS-01.

`aiCanCast` is still unused by healer (1099–1100) and guardian (2131–2133). That remains **AI-SYS-23** on the 09-21 increment.

`enemyAI.ts` still has **zero** reads of `currentAp`, `currentMp`, or `apCost` (confirmed 2026-09-27 grep of the module). Pack walk budget is still `ENEMY_REACHABLE_STEP_BUDGET = 3` (`gameConstants.ts` 166; `computeReachable` 377–378).

Do **not** feed `spellRangeBase` into AI (`targeting.ts` 128–137). That fork is honesty: player upgrade `maxRange` is not an enemy kit field.

### 1.2 Line numbers vs 2026-09-26 (P0 sites did not move)

| Fact | 2026-09-26 | Live (2026-09-27) |
| :--- | :--- | :--- |
| `computeAITier` | `combatMath.ts` 36–52 | **unchanged** |
| Spawn `aiTier` | WX 5823 | **5823** |
| Family second `computeAITier` | WX 5865 | **5865** |
| Kit `levelZone` object | WX 11920 | **11920** |
| Summoner chance unbounded | WX 11932–11943 | **11932–11943** |
| Player-summon empty occupied | WX 15156 | **15156** |
| Executor gate `side === "player"` | WX 14980 | **14980** (SYS-55) |
| `aiTier >= 5` erratic | WX 15508 | **15508** |
| `aiTier >= 10` betrayal | WX 15595 | **15595**; second-ally 15% at **15658** is still spectacle |
| Boss occupancy empty | WX 15430–15435 | **15430–15435** (SYS-56) |
| Dest-commit clamp | WX 16416–16423 | **16416–16423**; `battleSetup.ts` **394–406** (SYS-58) |
| Apply Chebyshev only | WX 16450–16456 | **16450–16456** |
| Self-heal `range === 0` | WX 16648 | **16648** |
| Fire Bolt `e-firebolt` | WX 16710–16715 | **16712** |
| Strip AP=`level` | WX 17402–17411 | **17402–17411** (SYS-54) |
| `decideEnemyAction` | 1662–1707 | **1662–1707** |
| Healer Chebyshev-only | 1099–1100 | **1099–1100** |
| Guardian `pickBestAlly` | (not called out) | **2120–2133** (summon ward scoring; pack healer still `allies.find(!isSummon)` at **1142**) |
| `applyDamageDealt` | (not called out) | WX **3499–3516** only, inside `applyDamageToEnemy` (SYS-61) |
| Pack Plague store tick | SYS-59 said none | WX **14646–14668** (SYS-60) |
| Player-summon Plague | SYS-59 said none | WX **14449–14472** (SYS-60) |
| Hostile-summon Plague | SYS-59 said none | WX **14545–14559** (SYS-60) |
| Player Plague | WX 14313–14324 | **14313–14324** (still real; not exclusive) |
| `applyTurnStart` before pack AI | (not called out) | WX **14635–14642** (SYS-60) |
| Shield Charm melee soak | (not called out) | WX **16750–16761**; boss **16027–16029** (SYS-63) |
| `isCellFree` reserved | SYS-58 assumed occupied | `occupancy.ts` **84–98** does **not** read `reserved` (SYS-62) |
| Summon destack slide | 09-25 SYS-27 half | `summonExecutor.ts` **137–147** (SYS-62 pack sibling) |
| Player `applyApCost` | playerCastPlan | WX **10335**, **17129**; decide never (SYS-64) |
| Null Field | (not called out) | `applyActiveEffect` WX **1873–1886** skips non-DoT when registry returns false (SYS-65) |

P0 remains **AEE-2026-08-31-002** (Fire Bolt / apply honesty) then **AEE-2026-08-31-001** (`computeAITier`). Then 09-21…09-26 honesty. Then this file’s SYS-60…65. Do not start FUT-78+ first.

### 1.3 Still true — do not re-file (parent / 09-21…09-26)

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
- Strip / `resolveEnemyApMp` uses `enemy.level`. SYS-54.
- Hostile summons skip the paid executor. SYS-55.
- Boss occupancy list empty. SYS-56.
- Erratic dest ignores portal/void/barrier. SYS-57.
- Dest-commit clamp-only. SYS-58.
- `engine/summonAI.ts` `runSummonAI` remains unused.

`hasBresenhamLoS` still ignores combatant bodies. Do not propose an AI-only body-block LoS module.

### 1.4 New honesty gaps (this increment)

1. **SYS-59’s “player-only Plague Zone” is false on this checkout.** The comment at WX 14309 still says “all units,” and the **player** tick at 14313–14324 is real. Pack enemies also tick at turn start (**14646–14668**), player-side summons at **14449–14472**, hostile summons at **14545–14559**. `applyTurnStart` (`mapModifiers.ts` 240–245) subtracts an extra **1** from the turn-order entry before those store commits of `PLAGUE_ZONE_TICK` (2). Decide snapshots `enemyHpMap` / `getLiveCombatants` (WX 16277), so EV must use the **store** tick, not registry-1 + store-2. FUT-76 must not treat pack HP as immune. SYS-60.

2. **`mapModifierRegistry.applyDamageDealt` never runs on pack → player hits.** The only call site is WX **3499–3516** inside `applyDamageToEnemy` (player hitting an enemy). Pack spell apply (16532+) and fallback melee (16723+) go through `playerTakesDamage` / `setCharacterStats` / `enemyTakesDamage` with no registry. Glass Realm ×2 and Vampiric Ground 15% lifesteal therefore do **not** apply to those hits today. Scoring 2× killable-now or self-heal on a bishop frost would be a cheat. SYS-61.

3. **Pack dest-commit cannot destack reserved bridges.** `isCellFree` (`occupancy.ts` 84–98) checks grid / barriers / portals / void / occupied — **not** `reserved`. Pack `toOccupancyContext` (`enemyAI.ts` 404–412) never sets `reserved` or `progressStart`. Summon executor builds `collectMandatoryProgressionCells` (WX 15208–15214) and slides (`summonExecutor.ts` 137–147). Player-controlled walks use `resolveControlledSummonMoveDest` (occupancy 373–403). Pack `enemyDestToCommit` (SYS-58) would still write a unique corridor cell and seal the portal. SYS-27 was **summon decide** reserved; this is **pack apply**. SYS-62.

4. **Shield Charm HP is public in the log and invisible to decide.** `shieldHpRef` soaks boss damage (WX 16027–16029) and pack fallback melee (16750–16761). `estimateDamage` / `scoreTargets` do not see it. Killable-now on a 10 HP player with 20 shield is a lie. Distinct from SYS-50 (Mirror token) and from open #659 (RES on melee). SYS-63.

5. **Player casts pay `applyApCost`; pack decide never does.** Arcane Surge / Arcane Overflow (`mapModifiers.ts` 210–217, 324) discount AP by 1 (min 1) through `playerCastPlan` / WX 10335 and 17129. After SYS-07 the enumerator must call the **same** `applyApCost`. Using raw `spell.apCost` would over-charge the AI (too honest) or, if someone copies `enemy.level` AP from SYS-54, under-charge (cheat). SYS-64.

6. **Null Field already suppresses non-DoT apply; decide does not know.** `applyActiveEffect` (WX 1873–1886) returns early when `applyEffectApplication` is false, except DoTs. Iron Skin / frost MP shred / slow still get picked, then silently no-op (or Fire-Bolt via SYS-42). SYS-65.

### 1.5 Tests

`enemyAI.charger.test.ts`, `enemyAI.geometry.test.ts`, `enemyAI.walkMp.test.ts` exist. Honesty (Fire Bolt, ally-heal fallback, dest-commit reserved, applyDamageDealt one-sided, shield soak, plague store tick, Null Field skip, `applyApCost`) still has no decide/apply-layer tests. Do not treat geometry/walkMp as SYS-60…65.

### 1.6 What this increment does **not** change

Do not implement FUT-78+ before P0 honesty + 09-21…09-26 SYS slices. Do not touch RAF, map generation, turn order, or damage formulas. Do not copy #495 / #498 / #644…#659 into this docs-only change. Do not edit the parent catalog. Do not double-count Plague (registry 1 + store 2). Do not give pack Glass Realm ×2 until SYS-61 wires the registry or scoring stays off.

---

## 2. Design additions (normative)

1. **Do not recycle 09-21…09-26 ids.** This file starts at SYS-60 / FUT-78. SYS-59 stays on PR #633 as the comment/player-tick observation; **scoring rules in this file supersede SYS-59’s “pack does not burn.”**
2. **Turn-start HP for decide = combatant store after the WX store commit**, not `applyTurnStart` mutation of the turn-order row. Mending Mist / Swift Winds / Void Rift hooks that only touch that row are invisible until a store copy exists.
3. **Score modifier damage only on the hits that call `applyDamageDealt`.** Today that is player → enemy. Pack → player is raw. If a later PR wires the registry into `playerTakesDamage`, this module’s flag flips.
4. **Reserved progression cells are occupied for pack walks**, same as summon destack / player-controlled summons. Sliding is not a tactic; either reject the dest or score the **landed** cell the player would see.
5. **Public soak (Shield Charm remaining HP) is a SYS-10 field** when the log/HUD shows it. Missing ⇒ killable-now must not assume it is 0 *or* full — module off.
6. **AP cost after SYS-07 is `mapModifierRegistry.applyApCost`**, the player helper, never a private discount and never `enemy.level`.
7. **T6+ still stacks** on the parent enumerator. No integer tier table. No `if (aiTier >= 8)`.

---

## 3. System proposals (2026-09-27)

### AI-SYS-60

**AI_ID:** AI-SYS-60  
**NAME:** Turn-start HP is the store commit, and pack Plague/Void do tick  
**ROLE:** system  
**SOPHISTICATION:** T1+ / honesty for ADV-03 / FUT-76  
**DECISION_RULES:** SYS-59 (09-26) documented WX 14309–14324 as player-only. Live pack AI already runs `applyTurnStart` then a **store** Plague tick (WX **14635–14668**) of `PLAGUE_ZONE_TICK` via `enemyHpAfterHazardDamage` + `updateCombatant`. Player-side summons: **14449–14472**. Hostile summons: **14545–14559**. Player: **14313–14324**. Void Rift has the same store-commit pattern (comments at 14475–14478, 14570, 14671). `plague_zone.onTurnStart` (`mapModifiers.ts` 240–245) also subtracts **1** from the turn-order entry — that value is **not** what `scoreTargets` reads (WX 16277 uses `enemyHpMap`). Decide EV uses the store tick only (2 HP plague, 3 HP void). Do not invent a third tick. Do not keep FUT-76’s “bishop does not burn.” Bosses on the pack/enemy-AI effect take the pack tick; tagged boss scripts that skip this block must document that as a named ability, not sophistication.  
**SCORING_MODEL:** After this actor’s turn-start commit, `hp` is store HP. Next-turn self-tick is public if the modifier is on. Registry −1 is not added on top.  
**SPELL_REQUIREMENTS:** None.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always (honesty). Scoring attach is FUT-78.  
**ENEMY_ARCHETYPES:** All pack / summon actors that enter the enemy-AI or summon-control turn-start block.  
**PLAYER_COUNTERPLAY:** Plague burns you **and** them at each of your turns. Kiters may leave a tile; that is POS-04, not a hidden pack immunity.  
**EDGE_CASES:** `applyTurnStart` Mending Mist / Swift Winds mutate the turn-order row only — SYS-10 must not read that row for HP/MP until a store copy exists (FUT-80). Opening player turn: pack has not ticked yet this round.  
**IMPLEMENTATION_COMPLEXITY:** Low (ctx flags + tests; do not change tick damage).  
**TEST_SCENARIOS:** Plague on, pack bishop 10 HP at start of its turn → store 8 after tick, decide sees 8. Scoring must not subtract another 1 from the registry hook. Player-only fixture that skips 14646 is not live.  
**STATUS:** PROPOSED

### AI-SYS-61

**AI_ID:** AI-SYS-61  
**NAME:** Damage-modifier registry is player→enemy only  
**ROLE:** system  
**SOPHISTICATION:** T1+ / honesty for TGT-06 / Glass / Vampiric  
**DECISION_RULES:** `mapModifierRegistry.applyDamageDealt` (`mapModifiers.ts` 558–571) is invoked once, WX **3499–3516**, on `applyDamageToEnemy`. Pack spell (16532–16569) and fallback melee (16723–16766) do not call it. Glass Realm (`onDamageDealt` ×2, `mapModifiers.ts` 337–347) and Vampiric Ground (15% attacker heal, 406–414) therefore do **not** currently modify pack → player (or pack → player-summon via `enemyTakesDamage` without the helper). Killable-now and self-heal EV must use the **apply path of that hit**. Do not “fix” difficulty by applying Glass ×2 only for the AI. If a later PR routes pack hits through the registry, flip a ctx boolean; until then the term is 0.  
**SCORING_MODEL:** `modDmg = applyDamageDealt` iff that function will run. Else raw post-RES/SP. Vampiric self-heal EV = 0 on pack hits today.  
**SPELL_REQUIREMENTS:** None.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always.  
**ENEMY_ARCHETYPES:** All damage roles.  
**PLAYER_COUNTERPLAY:** Glass Realm currently spikes **your** hits on them, not theirs on you. Play accordingly; AI must not pretend otherwise.  
**EDGE_CASES:** Player-side summon executor `dealDamage` may or may not go through `applyDamageToEnemy` — score that path separately. DoT ticks that skip the registry stay skip. Open #644 drain lifesteal is player-catalog, not this hook.  
**IMPLEMENTATION_COMPLEXITY:** Low (flag per apply site) / medium if someone wires the registry (out of scope here).  
**TEST_SCENARIOS:** Glass on, bishop frost vs player: estimate = non-×2 apply. Player Strike vs bishop: estimate may ×2 if it uses `applyDamageToEnemy`. Vampiric on, pack melee: no self-heal EV.  
**STATUS:** PROPOSED

### AI-SYS-62

**AI_ID:** AI-SYS-62  
**NAME:** Pack walks honor reserved progression cells  
**ROLE:** system  
**SOPHISTICATION:** T1+ (SYS-27 / SYS-58 companion)  
**DECISION_RULES:** SYS-27 reserved cells in **summon decide**. SYS-58 dest-commit `isCellFree`. `isCellFree` (`occupancy.ts` 84–98) does not read `ctx.reserved`. Pack `toOccupancyContext` (`enemyAI.ts` 404–412) omits `reserved` / `progressStart` / `portals` already passed as a Set but not as mandatory-corridor keys. Summon executor occupancy (WX 15208–15214) **does** collect mandatory cells and then `resolveProgressionSafeOccupantCell` (`summonExecutor.ts` 137–147) **slides**. Pack dest-commit (WX 16421–16423) writes the raw dest. After this module: pack decide + dest-commit treat reserved keys as occupied (same snapshot `collectMandatoryProgressionCells` with player start + portals). Prefer **reject** (stay origin) over a hidden slide so the player can read the walk. If apply later destacks like the executor, score the **landed** cell only — sliding is not a T6 sidestep.  
**SCORING_MODEL:** Reserved dest ⇒ −∞ (dropped) unless the public destack dest is enumerated as its own legal cell.  
**SPELL_REQUIREMENTS:** None.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always.  
**ENEMY_ARCHETYPES:** All pack walkers.  
**PLAYER_COUNTERPLAY:** Park on the alcove; they cannot seal the only exit.  
**EDGE_CASES:** Dual-path cuts: occupying one dump cell is legal if a second path remains (map-integrity tests). SYS-58 `isCellFree` alone is not enough. Do not copy destack into erratic as a “random extra step.”  
**IMPLEMENTATION_COMPLEXITY:** Medium (wire reserved into pack occupancy; dest-commit predicate).  
**TEST_SCENARIOS:** Unique corridor cell reserved, charger dest that cell → no `updateCombatant` patch. Summon wolf still slides in the executor until SYS-27 decide avoids it. Open-field dest unchanged.  
**STATUS:** PROPOSED

### AI-SYS-63

**AI_ID:** AI-SYS-63  
**NAME:** Public Shield Charm soak is a snapshot field  
**ROLE:** system  
**SOPHISTICATION:** T2+ / honesty for TGT-06  
**DECISION_RULES:** `shieldHpRef` (WX 1588–1589) absorbs pack fallback melee (16750–16761) and boss `damageToPlayer` (16027–16029). The log prints remaining shield. `AICombatant` has no shield field. `estimateDamage` treats HP as the only pool. After SYS-10, copy **remaining shield HP** when the HUD/log would show it. Killable-now uses `hp + shield` (or damage-after-soak). Missing field ⇒ this module off (do not assume 0 soak and execute, do not assume infinite). Distinct from SYS-50 (Mirror consume) and open #659 (RES on melee). Pack **spell** apply (16532+) does not currently soak shield — score that split: melee/boss soak, spell maybe not. Do not add hidden spell soak to feel hard.  
**SCORING_MODEL:** `incomingAfterSoak = max(0, dmg - visibleShield)` then vs HP.  
**SPELL_REQUIREMENTS:** Damage profiles.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always when shield remaining is public.  
**ENEMY_ARCHETYPES:** All damage roles.  
**PLAYER_COUNTERPLAY:** Pop Shield Charm; chargers wait instead of “lethal” melee.  
**EDGE_CASES:** Shield 0 → term off. Spell path without soak must not subtract shield. Summon-target melee skips shield today (16735 comment) — keep that.  
**IMPLEMENTATION_COMPLEXITY:** Low (snapshot int + estimate).  
**TEST_SCENARIOS:** Player 8 HP, shield 20, melee EV 12 → not killableNow. Player 8 HP, shield 0 → killable if dmg ≥ 8. Frost spell path without soak → ignore shield.  
**STATUS:** PROPOSED

### AI-SYS-64

**AI_ID:** AI-SYS-64  
**NAME:** Enumerator AP cost is `applyApCost`, not raw `apCost`  
**ROLE:** system  
**SOPHISTICATION:** T1+ (SYS-07 companion)  
**DECISION_RULES:** Player preview/execute runs `mapModifierRegistry.applyApCost` (`playerCastPlan.ts`, WX 10335 / 17129). Arcane Surge and Arcane Overflow subtract 1, min 1 (`mapModifiers.ts` 216, 324). Overflow’s 10% fail is an `onEffectApplication` on **player** casts — pack must not roll a private fail. After SYS-07, legal pack/summon casts use `resolveCastApCost(spell.apCost, applyApCost)` with the **same** active modifier set the HUD shows. Raw `Number(spell.apCost)` is illegal once discounts exist. SYS-54 forbids seeding AP from `enemy.level` to “afford” the undiscounted cost.  
**SCORING_MODEL:** Unpayable after discount ⇒ dropped. Leftover-AP waste (RES-01) uses the discounted cost.  
**SPELL_REQUIREMENTS:** Accurate `apCost` metadata.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always when SYS-07 exists.  
**ENEMY_ARCHETYPES:** All casters.  
**PLAYER_COUNTERPLAY:** Surge makes their Inferno cheaper too — that is the public rule.  
**EDGE_CASES:** Min cost 1: a 1 AP Strike stays 1. Missing modifier set ⇒ treat as no discount (do not guess).  
**IMPLEMENTATION_COMPLEXITY:** Low after SYS-07 (one helper).  
**TEST_SCENARIOS:** Surge on, Inferno `apCost` 5, currentAp 4 → legal (pays 4). Surge off, AP 4 → illegal.  
**STATUS:** PROPOSED

### AI-SYS-65

**AI_ID:** AI-SYS-65  
**NAME:** Null Field is a public legality gate for non-DoT  
**ROLE:** system  
**SOPHISTICATION:** T1+ / honesty for TEM-04 / ROL-05  
**DECISION_RULES:** `applyActiveEffect` (WX 1873–1886) skips the write when `mapModifierRegistry.applyEffectApplication` is false, **except** `type === "dot"`. Null Field (`mapModifiers.ts` 419–432) returns false for buff and debuff. Decide still picks Iron Skin, frost MP shred, slow, Rally. Failed apply currently falls through to Fire Bolt (SYS-05 / SYS-42). After this module, if Null Field is public on the modifier bar, non-DoT buff/debuff/cc ids are absent from the legal set. DoTs (Inferno/poison) remain legal if profiled (SYS-39). Iron Curse’s heal-halve hook returns true (389–396) — that is FUT-80’s heal EV, not this skip.  
**SCORING_MODEL:** Suppressed category ⇒ −∞.  
**SPELL_REQUIREMENTS:** `effectType` / `spellType` metadata, never `name`.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always when Null Field is announced.  
**ENEMY_ARCHETYPES:** support, controller, healer (buffs off); artillery DoT still on.  
**PLAYER_COUNTERPLAY:** Bring Null Field maps to shut off shred/slow; they should swap to damage, not bolt you from a failed Iron Skin.  
**EDGE_CASES:** DoT still applies. Heal `spellType === "heal"` is HP, not `applyActiveEffect` — Null Field does not skip Blood Mend; SYS-05 ally-heal apply still required.  
**IMPLEMENTATION_COMPLEXITY:** Low (filter `availableSpells` by modifier).  
**TEST_SCENARIOS:** Null Field on, bishop has frost (damage+debuff): damage legal, extra MP-shred-only id illegal. Iron Skin only kit → skip/melee, never `e-firebolt`.  
**STATUS:** PROPOSED

---

## 4. T6+ reusable modules (2026-09-27)

Attach via parent §4 sigmoid. Stack; do not replace T0–T5 or FUT-01…77.

### AI-FUT-78

**AI_ID:** AI-FUT-78  
**NAME:** Pack Plague/Void as public self-HP pressure  
**ROLE:** adaptive  
**SOPHISTICATION:** T6 (ADV-07 / POS-04; SYS-60)  
**DECISION_RULES:** FUT-76 assumed pack immunity. After SYS-60, chargers still may collapse on a low-HP **player** (player also ticks). Kiters/healers add a self-HP cost equal to the **next store tick** if they will act again under the modifier (public). Berserker inverts (press). Do not roll the tick at decide time. Do not add the registry’s extra −1.  
**SCORING_MODEL:** `selfHpAfter = hp - PLAGUE_ZONE_TICK` (or void 3) for survival vs aggression (ADV-08). Player term remains FUT-76’s player tick.  
**SPELL_REQUIREMENTS:** None.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 1.0` when the modifier is public. Never `if (level >= 40)`.  
**ENEMY_ARCHETYPES:** kiter, healer, artillery (respect); charger/berserker invert.  
**PLAYER_COUNTERPLAY:** Hold End Turn so they tick before they reach you; or finish them before their turn.  
**EDGE_CASES:** Already ticked this turn (store already −2) → do not subtract again this decide. Lethal self-tick is apply, not an AI execute.  
**IMPLEMENTATION_COMPLEXITY:** Low after SYS-60.  
**TEST_SCENARIOS:** Bishop 3 HP, plague on, not yet ticked this turn → prefer retreat over a non-kill frost. Bishop 3 HP after store tick → 3 is current.  
**STATUS:** PROPOSED

### AI-FUT-79

**AI_ID:** AI-FUT-79  
**NAME:** Glass / Vampiric EV follows the live registry path  
**ROLE:** advanced  
**SOPHISTICATION:** T6 (TGT-06 / ADV-08; SYS-61)  
**DECISION_RULES:** When SYS-61’s flag says pack → player skips `applyDamageDealt`, Glass ×2 and Vampiric 15% are **off** for those hits. When the flag says the hit uses the registry (today: player → enemy, which the pack does not throw), do not steal that ×2 onto enemy frost. If apply later unifies, both sides use the same hook. Do not peek RNG.  
**SCORING_MODEL:** `killableNow` uses post-registry dmg only when the apply site will call it.  
**SPELL_REQUIREMENTS:** Damage profiles.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.9` when Glass or Vampiric is announced.  
**ENEMY_ARCHETYPES:** All damage roles.  
**PLAYER_COUNTERPLAY:** Glass currently makes **your** strikes lethal, not theirs.  
**EDGE_CASES:** Mixed: pack hitting a player-summon via `enemyTakesDamage` without registry → no ×2.  
**IMPLEMENTATION_COMPLEXITY:** Low after SYS-61.  
**TEST_SCENARIOS:** Glass on, frost vs player → EV unscaled. Vampiric on, pack melee → no +heal.  
**STATUS:** PROPOSED

### AI-FUT-80

**AI_ID:** AI-FUT-80  
**NAME:** Mending Mist / Swift Winds only after store-visible HP/MP  
**ROLE:** adaptive  
**SOPHISTICATION:** T6 (ADV-03 / RES-02)  
**DECISION_RULES:** `applyTurnStart` Mending Mist (`mapModifiers.ts` 355–364) and Swift Winds (373–375) mutate the turn-order combatant. Pack decide reads store HP (WX 16277) and ignores `currentMp` today (SYS-07). Until those hooks commit like Plague (SYS-60), this module is **off**. After a store copy exists and is HUD-public, healers may skip a full-HP Blood Mend (heal EV 0) and walkers may use +2 MP in `computeReachable`. Iron Curse heal-halve is a separate public multiplier on heal apply (389–396) — include it in heal EV when the heal site actually halves.  
**SCORING_MODEL:** Regen EV = 0 while store-invisible. After commit: `healNeed` uses post-mist HP.  
**SPELL_REQUIREMENTS:** Heal profiles for the skip; none for MP.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.8` when the modifier is public **and** the store shows the buff.  
**ENEMY_ARCHETYPES:** healer, kiter.  
**PLAYER_COUNTERPLAY:** If the HUD does not show enemy regen, they must not play as if they regenerated.  
**EDGE_CASES:** Swift Winds +2 on turn-order `mp` must not stack with SYS-54 `level/2` strip MP.  
**IMPLEMENTATION_COMPLEXITY:** Medium (needs a store commit PR first).  
**TEST_SCENARIOS:** Mist on, store HP unchanged after `applyTurnStart` → healer still treats 50% as 50%. After a future commit +5% → heal EV 0 at full.  
**STATUS:** PROPOSED

### AI-FUT-81

**AI_ID:** AI-FUT-81  
**NAME:** Visible Shield Charm changes lethal melee  
**ROLE:** target / adaptive  
**SOPHISTICATION:** T6 (TGT-06; SYS-63)  
**DECISION_RULES:** When SYS-63 has remaining shield on the snapshot, chargers use attack-before-retreat (RES-03) only if post-soak damage kills or the role is berserker. Kiters do not walk adjacent “because HP looked lethal.” Spell-without-soak (live pack frost) may still ignore shield — that split is SYS-63, not a cheat.  
**SCORING_MODEL:** SYS-63 soak then TGT-06.  
**SPELL_REQUIREMENTS:** Melee / damage.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.7` when shield remaining > 0 is public.  
**ENEMY_ARCHETYPES:** charger, assassin, kiter.  
**PLAYER_COUNTERPLAY:** Charm is the tell; they wait or spell.  
**EDGE_CASES:** Shield drops mid-round from another actor — later actors read the updated public remaining (SYS-10).  
**IMPLEMENTATION_COMPLEXITY:** Low after SYS-63.  
**TEST_SCENARIOS:** Shield 20, charger adjacent, player 8 HP → melee not chosen as lethal; frost may still be if that path skips soak.  
**STATUS:** PROPOSED

### AI-FUT-82

**AI_ID:** AI-FUT-82  
**NAME:** Corridor dump vs unique-bridge body-block  
**ROLE:** positioning  
**SOPHISTICATION:** T6 (POS-05 / POS-07; SYS-62)  
**DECISION_RULES:** After SYS-62, tanks may occupy a **dump** cell that map-integrity tests treat as non-sealing (second path open). They must not occupy a unique reserved bridge. Protectors still use POS-07 on the ward axis if that cell is free and not reserved. This is occupancy, not LoS.  
**SCORING_MODEL:** `+wChoke` on a legal dump/choke; reserved unique bridge ⇒ −∞.  
**SPELL_REQUIREMENTS:** None.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.6` on maps with public portals and a computed reserved set.  
**ENEMY_ARCHETYPES:** tank, protector.  
**PLAYER_COUNTERPLAY:** Attract them onto the dump; keep the bridge.  
**EDGE_CASES:** 1v1 open field → term 0. Transposed choke keys (SYS-49) → module off until keys match `x,y`.  
**IMPLEMENTATION_COMPLEXITY:** Medium (depends on SYS-62 + SYS-49).  
**TEST_SCENARIOS:** Dual-path dump cell → rook may dest there. Unique `2,0` reserved → dest ≠ that cell.  
**STATUS:** PROPOSED

### AI-FUT-83

**AI_ID:** AI-FUT-83  
**NAME:** Pack healer ward scoring (not player-hardcoded)  
**ROLE:** healer / protector  
**SOPHISTICATION:** T6 (ROL-04 / POS-07)  
**DECISION_RULES:** Summon guardian already uses `pickBestAlly` (enemyAI.ts 2120–2133). Pack `decideHealer` still pins the idle ward with `allies.find((a) => !a.isSummon)` (1142) — and `AICombatant` allies on the pack snapshot are other **enemies**, so that find is “prefer a non-summon ally,” not the player. After SYS-10 effects exist so shield/heal are not recast blindly, reuse `pickBestAlly` (or the same weights) for pack healer idle-guard and heal target. Heal-first `inferArchetype` stays SYS-04. Do not infer ward from `name`.  
**SCORING_MODEL:** Existing `scoreAlly` urgency + threat; pack healer consumes it.  
**SPELL_REQUIREMENTS:** Profiled heal / shield + SYS-05 apply `targetId`.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.4` for explicit healer role (SYS-04).  
**ENEMY_ARCHETYPES:** healer, protector.  
**PLAYER_COUNTERPLAY:** Wound the backline summon; they should peel to it.  
**EDGE_CASES:** No allies → caster fallback (already 1166). Queen-with-heal still must not become healer until SYS-04.  
**IMPLEMENTATION_COMPLEXITY:** Low (share `pickBestAlly`).  
**TEST_SCENARIOS:** Wounded allied rook 20% HP, full-HP king → heal rook. Guardian already covered by #306 tests.  
**STATUS:** PROPOSED

---

## 5. Spell-awareness contract (reminder)

Unchanged: no profile + apply ⇒ not in kit. Do not feed `spellRangeBase` into AI. `starter-heal` is self-only (`range: 0`). Ally heal needs a ranged heal id **and** apply `targetId` (SYS-05) **and** SYS-42.

Null Field (SYS-65) does not make a spell “understood”; it removes illegal categories from the set.

Glass / Vampiric / Surge are **map modifiers**, not spells. They still need a scoring flag (SYS-61 / SYS-64) before any module uses them.

Still `usableByEnemy: true` without a working decide+apply pair (do not give these to AI until profiled):

`spell-swap`, `spell-mark`, `spell-sacrifice`, `spell-lifesteal-nova`, `spell-enrage`, `spell-haste`, `spell-weaken`, `spell-expose`, `spell-drain-courage`, `spell-cursed-wound`, `spell-shadow-veil`, `spell-frost-nova`, `spell-inferno` (DoT `damage: 0`), `starter-poison` / `spell-venom-strike`, `starter-shield` / `spell-iron-skin`, `starter-drain` (as a **heal**).

Keep `usableByEnemy: false` until profiled: barrier, mirror, timestep, rallying-cry, sentinel/bomber/wisp summons.

Open #647 Soul Rend / #649 Trap stay out of kits until apply + profile exist.

---

## 6. Implementation order (this increment)

1. P0 **AEE-2026-08-31-002** (Fire Bolt WX **16710–16715**, AP/MP debit, ally heal WX **16648**, SYS-42).  
2. 09-21 SYS-22…32.  
3. 09-22 SYS-33…35 (including open #495).  
4. 09-23 SYS-36…41.  
5. 09-24 SYS-42…47 (including open #498).  
6. 09-25 SYS-48…53.  
7. 09-26 SYS-54…59 (keep SYS-59 as the player-tick comment; **do not implement its “pack immunity” scoring**).  
8. SYS-60, SYS-61, SYS-62, SYS-63, SYS-64, SYS-65 (this file).  
9. Parent T2–T5 roles / team / adaptive. FUT-78 with SYS-60; FUT-79 with SYS-61; FUT-80 after a store commit for mist/winds; FUT-81 with SYS-63; FUT-82 with SYS-62; FUT-83 with SYS-04 / SYS-05.

Each slice: `engine/enemyAI*.test.ts`, zero WX drive-by, no RAF / map gen / turn order / damage-formula edits. Scoring **reads** RES/SR/shield/modifiers; it does not change `calcScaledDamage`.

---

## 7. Extra test scenarios

| ID | Setup | Expect |
| :--- | :--- | :--- |
| TS-PLAGUEPACK | Plague on, pack bishop 10 HP at its turn start | Store 8 after tick; decide HP 8 (SYS-60). Not 9 (registry −1 + ignore store) and not 10 (SYS-59 immunity). |
| TS-PLAGUESUM | Player wisp, Plague on | Wisp store tick at 14449 (SYS-60). |
| TS-GLASSRAW | Glass on, pack frost vs player | EV not ×2 (SYS-61 / FUT-79). |
| TS-VAMPRAW | Vampiric on, pack melee vs player | No self-heal EV (SYS-61). |
| TS-RESERVE | Unique reserved corridor dest | No dest-commit patch (SYS-62). |
| TS-SHIELD | Player 8 HP, shield 20, melee 12 | Not killableNow (SYS-63 / FUT-81). |
| TS-SURGEAP | Surge on, Inferno 5, AP 4 | Legal after SYS-07+SYS-64. |
| TS-NULL | Null Field on, Iron Skin only | Skip/melee, never `e-firebolt` (SYS-65). |
| TS-WARD | Pack healer, wounded rook vs full king | Heal rook (FUT-83). |
| TS-DUMP | Dual-path dump cell | Tank may occupy; unique bridge may not (FUT-82). |

09-21…09-26 TS-* rows still apply. Geometry tests cover caster LoS only.

---

## 8. Mapping (new gaps → ids)

| Request / gap | Primary AI_ID |
| :--- | :--- |
| Pack/summon Plague+Void store ticks; SYS-59 immunity was wrong | AI-SYS-60 |
| `applyDamageDealt` only on player→enemy | AI-SYS-61 |
| Pack dest-commit vs reserved/destack | AI-SYS-62 |
| Shield Charm `shieldHpRef` invisible to estimate | AI-SYS-63 |
| `applyApCost` unused by decide | AI-SYS-64 |
| Null Field suppresses non-DoT apply; decide still picks buffs | AI-SYS-65 |
| Pack self-HP under Plague/Void | AI-FUT-78 |
| Glass/Vampiric EV only on registry path | AI-FUT-79 |
| Mist/Winds after store-visible HP/MP | AI-FUT-80 |
| Shield Charm changes lethal melee | AI-FUT-81 |
| Dump-cell choke vs unique-bridge seal | AI-FUT-82 |
| Pack healer `pickBestAlly` | AI-FUT-83 |

Parent §19 still maps the original capability list onto POS / TGT / RES / ROL / TEM / ADV. Nothing in that list is implemented. Higher-level enemies still get harder from **modules on the sigmoid**, not from `computeAITier(enemyLevel)` and not from `ap = enemy.level`.

Requested capability → already-catalogued parent id (unchanged; still **PROPOSED**):

| Request | Parent id |
| :--- | :--- |
| maintain optimal range / retreat / approach vulnerable / avoid hazards / exploit terrain / avoid AoE clustering / protect allies / escape routes | POS-01…08 |
| low-HP / high-threat / support / summons / resistance / kill / strategic | TGT-01…07 |
| AP combinations / move-then-attack / attack-then-retreat / sequencing / cooldown / waste | RES-01…06 |
| tank … protector | ROL-01…10 |
| focus fire / protect support / exploit debuffs / avoid duplicate debuffs / coordinated AoE / formations / retreat toward support | TEM-01…07 |
| estimate threat / punish positioning / adapt HP / adapt AP-MP / summons / status / own HP / survival vs aggression | ADV-01…08 |

This increment adds turn-start / modifier-registry / reserved-bridge / shield / AP-cost / Null Field honesty (SYS-60…65) so those modules cannot cheat when they attach — especially as absolute levels grow without a cap — plus T6 scorers (FUT-78…83) that keep appearing as relative difficulty rises.

Every row above is **STATUS: PROPOSED**. No production AI in this change.
