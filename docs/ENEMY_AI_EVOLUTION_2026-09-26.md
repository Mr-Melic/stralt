# Advanced Enemy AI Evolution — 2026-09-26 increment

**Status:** PROPOSED (design only; no production code in this change)  
**Date:** 2026-09-26  
**Parent catalog:** [`ENEMY_AI_EVOLUTION.md`](./ENEMY_AI_EVOLUTION.md) (T0–T5)  
**Prior increments:** [`ENEMY_AI_EVOLUTION_2026-09-01.md`](./ENEMY_AI_EVOLUTION_2026-09-01.md) · [`ENEMY_AI_EVOLUTION_2026-09-02.md`](./ENEMY_AI_EVOLUTION_2026-09-02.md) · [`ENEMY_AI_EVOLUTION_2026-09-21.md`](./ENEMY_AI_EVOLUTION_2026-09-21.md) (open PR #351; SYS-22…32, FUT-36…47 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-22.md`](./ENEMY_AI_EVOLUTION_2026-09-22.md) (open PR #416; SYS-33…35, FUT-48…53 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-23.md`](./ENEMY_AI_EVOLUTION_2026-09-23.md) (open PR #458; SYS-36…41, FUT-54…59 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-24.md`](./ENEMY_AI_EVOLUTION_2026-09-24.md) (open PR #506; SYS-42…47, FUT-60…65 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-25.md`](./ENEMY_AI_EVOLUTION_2026-09-25.md) (open PR #565; SYS-48…53, FUT-66…71 — **do not re-number**)  
**Implementer ledger:** [`automation/ACTION_IDS_AEE_2026-09-26.md`](./automation/ACTION_IDS_AEE_2026-09-26.md)

This increment re-reads the live engine one day after the 2026-09-25 catalog. SYS-01…53 and FUT-01…71 stay **PROPOSED** on their own files; they are **not** re-filed here. New work is: initiative-strip dummy stats versus unbounded level, enemy-side summons skipping the paid executor, boss occupancy that ignores every body except the player, erratic/dest-commit passability, Plague Zone player-only apply, and T6+ scorers that keep attaching as relative difficulty rises.

Stralt has **no character level cap**. Nothing here maps `if (level >= X) sophistication = Y`. Tiers remain conceptual. Eligibility remains the parent §4 sigmoid (`peer = log2(enemy.level / player.level)` plus pack/boss/modifier terms). A year-later peer fight at any absolute level can attach a new module without raising a cap. `resolveEnemyApMp` using `enemy.level` as AP is the opposite of that rule.

**Hard rules (unchanged):** no cheat, no hidden player information, no ignored LoS/range/AP/MP, no unbounded search, no kit-less Fire Bolt, no `instantKill`, no betrayal-as-difficulty, no name-based spell heuristics, no production AI in this change.

Open production PRs that already slice honesty this catalog filed earlier (do **not** re-file the ids):

| Open PR | Catalog id | What it changes |
| :--- | :--- | :--- |
| [#495](https://github.com/Mr-Melic/stralt/pull/495) (draft) | AI-SYS-34 | Apply `targetCell` from `playerPositionRef` via `enemyApplyTargetCell`. Not on this checkout. |
| [#498](https://github.com/Mr-Melic/stralt/pull/498) (draft) | AI-SYS-45 | Boss kit-spell apply must not commit `targetX/Y` as a walk dest. Not on this checkout. |
| [#487](https://github.com/Mr-Melic/stralt/pull/487) (draft) | (not a tactic) | Betrayal kills enter the death pipeline. Spectacle remains forbidden as sophistication. |

This docs PR does **not** edit [`ENEMY_AI_EVOLUTION.md`](./ENEMY_AI_EVOLUTION.md) (open PR #351 unions that header). Unique files only.

---

## 1. Re-read (2026-09-26)

All line numbers are from this checkout. Re-read them before implementing.

### 1.1 Combat-parity still is not sophistication

Unchanged from 2026-09-21…25: `enemyCastGeometryOk` (`targeting.ts` 166–177), `aiCanCast` (`enemyAI.ts` 320–332), Frozen walk *rate* (`enemyWalkMp.ts` 21–29), `playerCastPlan.ts` (player only), summon leftover-AP `reevaluate` (WX 15257–15276). These are **not** SYS-05 / SYS-13 / SYS-01.

`aiCanCast` is still unused by healer (1099–1100) and guardian (2131–2133). That remains **AI-SYS-23** on the 09-21 increment.

`enemyAI.ts` still has **zero** reads of `currentAp`, `currentMp`, or `apCost` (confirmed 2026-09-26 grep of `decideEnemyAction` and helpers). Pack walk budget is still `ENEMY_REACHABLE_STEP_BUDGET = 3` (`gameConstants.ts` 166; `computeReachable` 377–378).

Pack `prevEnemies` is still `getLiveCombatants(combatantStoreCtx)` (WX **15481**) at the start of each enemy turn. Dest-commit still does not pay walk hazards (SYS-43) and still does not call `isCellFree` (this file’s SYS-58).

### 1.2 Line numbers vs 2026-09-25 (WX did not move on the P0 sites)

| Fact | 2026-09-25 | Live (2026-09-26) |
| :--- | :--- | :--- |
| `computeAITier` | `combatMath.ts` 36–52 | **unchanged** |
| Spawn `aiTier` | WX 5823 | **5823** |
| Family second `computeAITier` | WX 5865 | **5865** (`spawnPolicy.ts` 7 still documents the re-roll) |
| Kit `levelZone` object | WX 11920 | **11920** |
| Summoner chance unbounded | WX 11932–11943 | **11932–11943** |
| Player-summon empty occupied | WX 15156 | **15156** |
| Player-summon `allyCount` hardcoded player | WX 15175–15176 | **15175–15176** |
| `getCombatantAt` `"__player__"` | WX 15119 / 9334 | **15119** / **9334** (SYS-53) |
| Shared `focusTargetRef` | summon 15190; pack 16352 | **unchanged** (SYS-44) |
| Erratic `aiTier >= 5` | WX 15508–15591 | **15508–15591**; dest `updateCombatant` **15590**; adj filter **15537–15549** (SYS-57) |
| Betrayal `aiTier >= 10` | WX 15595 | **15594–15609+** |
| Boss dummy peer AP/MP/RES | WX 15444–15448 | **15444–15448** (SYS-46); peer `atk: 10` still **15446** |
| Boss player `atk: 10` | WX 15417 | **15417** (SYS-51) |
| Boss tiles `floor \|\| portal` | WX 15457–15460 | **15457–15460** (SYS-48) |
| Boss `enemiesForBossAI` | (not called out) | WX **15430–15456** `getPlayerSideTargets` then `type === "enemy"` (SYS-56) |
| `getWalkableMoves` bounds | `useBossAI.ts` 75–77 | **unchanged** literal 16 (SYS-52) |
| Pack snapshot | WX 16273–16302 | **16273–16302** |
| Dest-commit clamp only | WX 16416–16423 | **16416–16423**; `battleSetup.ts` **394–406** (SYS-58) |
| Apply Chebyshev only | WX 16450–16456 | **16450–16456** (SYS-47) |
| `consumePlayerMirror` | WX 16496–16528 | **16496–16528** (SYS-50) |
| Self-heal `range === 0` | WX 16648 | **16648** |
| Fire Bolt `e-firebolt` | WX 16710–16715 | **16710–16715** (`e-firebolt` object at **16712**) |
| `decideEnemyAction` | 1662–1707 | **1662–1707** |
| Player-summon executor gate | WX 14980 | **14980** `isSummon && side === "player"` (SYS-55) |
| `spawnEnemySummonUnit` | (SYS-17 name) | `summonSpawn.ts` **254–284**; `summonAI: unitDef.pieceType` **275**; `summonLifespan: 0` **274** (FUT-77) |
| Initiative strip AP/ATK/RES | (FUT-32 source) | WX **17390–17411**; `resolveEnemyApMp` `summonIntegration.ts` **195–209** (SYS-54) |
| Plague Zone tick | (not called out) | WX **14309–14324** comment “all units”; apply player-only (SYS-59) |
| Choke/bottleneck refs | WX 6417–6463 | **6417–6463** keys `${_ri},${_ci}` = **y,x** (SYS-49) |
| `isTileCastableLive` ally = player summon | `targeting.ts` 527–544 | **527–544** |
| `WORLD_GRID_SIZE` | 16 | `gameConstants.ts` **8** = 16 |
| `pickBossKitSpell` `new Map()` | `useBossAI.ts` 34–36 / 169–173 | **unchanged** |

P0 remains **AEE-2026-08-31-002** (Fire Bolt / apply honesty) then **AEE-2026-08-31-001** (`computeAITier`). Next 09-21 honesty: **AEE-2026-09-21-002** / **004**. Next 09-22: **AEE-2026-09-22-002** / **003**. Next 09-23: **AEE-2026-09-23-001…005**. Next 09-24: **AEE-2026-09-24-001…006**. Next 09-25: **AEE-2026-09-25-001…006**. Then this file’s SYS-54…59. Do not start FUT-72+ first.

### 1.3 Still true — do not re-file (parent / 09-21 / 09-22 / 09-23 / 09-24 / 09-25)

- Zone-0 kits forever (`Math.floor(levelZone)` on an object). SYS-09.
- `scoreTargets` ignores `focusTargetId`. SYS-08 / AI-SYS-30.
- `estimateDamage` returns 0 when `spell.damage <= 0`. SYS-02 / SYS-39.
- Heal-first `inferArchetype` (447–452). SYS-04 / SYS-41.
- Hazard avoid only below 50% HP (425–441). POS-04 / FUT-09 / FUT-59.
- Retreat / `reposition-los` `kind: "skip"` while moving (caster 929–944; generic 1570–1578). POS-02 / FUT-41.
- Summoner chance hits 1.0 at player level 44. FUT-23.
- `ENEMY_AI_TIER_GATES` unread (`gameConstants.ts` 200–209). SYS-01 / FUT-65 / FUT-68.
- Summon executor Chebyshev teleport MP. SYS-15 / 09-21 SYS-25.
- Family overlay second `computeAITier`. AI-SYS-29.
- `findKitSpell` assigned fallback (1741–1745). AI-SYS-32.
- `getEffectiveStat` is `getStatModifier`. AI-SYS-37.
- Summon / pack `allyCount` wrong. AI-SYS-33 / AI-SYS-36.
- Apply `playerPosition` not ref. AI-SYS-34 (open #495).
- Drain-as-heal picker. AI-SYS-38.
- Inferno DoT nested under `damage > 0`. AI-SYS-39.
- Summoner spawn short-circuit. AI-SYS-40.
- Failed ally `targetId` Fire-Bolts the ward. AI-SYS-42.
- Dest-commit skips lava/ice/spikes/thorn **HP**. AI-SYS-43 (this file’s SYS-58 is **passability**, not HP).
- Shared `focusTargetRef`. AI-SYS-44.
- Boss kit aim as walk dest. AI-SYS-45 (open #498).
- Boss peer dummy `ap: 3`. AI-SYS-46.
- Apply Chebyshev-only after dest-commit. AI-SYS-47.
- Boss portal-as-floor. AI-SYS-48.
- Choke keys y,x. AI-SYS-49.
- Mirror token invisible to decide. AI-SYS-50.
- Boss player `atk: 10`. AI-SYS-51.
- `getWalkableMoves` literal 16. AI-SYS-52.
- `"__player__"` vs `"player"`. AI-SYS-53.
- Hidden crit in EV. AI-FUT-57.
- Parent FUT-21 (Paper Windstorm expected miss) is still a one-line stub; live apply is 50% at WX **16491**. Do not allocate FUT-72 to it.
- Family catalog `ap`/`mp` unused on purpose. AI-SYS-28 — do not “fix” SYS-54 by copying `FAMILY_STAT_MULTS`.

`engine/summonAI.ts` `runSummonAI` remains unused. Live player-summon decide is `decideSummonAction` (1760+); enemy-side summons still go through pack `decideEnemyAction` (WX **14980** gates the executor on `side === "player"`). That gate is this file’s SYS-55, not a restatement of SYS-14 (empty occupied on the **player**-summon path).

`hasBresenhamLoS` (`targeting.ts` 250–252) blocks walls and barriers only. Combatant bodies do **not** block LoS for the player or the AI. Do not propose an AI-only body-block LoS module (that would be a cheat). Protector “body-block” remains a **walk occupancy** term (POS-07 / this file’s FUT-74).

### 1.4 New honesty gaps (this increment)

1. **Initiative strip and `resolveEnemyApMp` treat pack AP as `enemy.level`.** `resolveEnemyApMp` (`summonIntegration.ts` 195–209) returns `{ ap: enemy.level, mp: max(1, floor(level/2)) }` for non-summons. The battle HUD maps that onto every enemy row (WX **17402–17411**) and also hardcodes `atk: e.level * 2`, `res: 0`, `sp: 0`, `chc: 2`. The player row sets `atk: 0` (17396) while live ATK lives on `characterStats`. Parent FUT-32 told ADV-04 to read the **public strip**. After SYS-07, copying this helper into decide would give a level-400 peer **400 AP** — a level cap on the resource axis this catalog exists to avoid. SYS-07 is “budget is currentMp, not constant 3.” SYS-21 is minion spawn `ap: 0`. SYS-28 forbids family-catalog AP. SYS-46/51 are boss `CombatantEntryLike` dummies. This is the **HUD / strip** lie the later enumerator must not ingest. SYS-54.

2. **Enemy-side summons skip the paid executor.** WX **14980** runs `executeSummonAction` only when `isSummon && side === "player"`. `spawnEnemySummonUnit` (`summonSpawn.ts` 254–284) always passes `side: "enemy"`, so the unit’s turn-order `type` is `"enemy"` (199–200) and the enemy-AI effect runs. `spawnSummonUnit` still seeds `currentAp`/`currentMp` (181–184). Pack `decideEnemyAction` never reads those fields; dest-commit walks for free; failed casts Fire-Bolt (SYS-05). Player summons are the honesty template (debit + one leftover-AP `reevaluate`). SYS-14 is the player-summon **empty occupied** snapshot. SYS-55 is the **routing** hole: hostile minions never enter that template.

3. **Boss `enemiesForBossAI` is an empty occupancy list.** WX 15430–15435 builds the list from `getPlayerSideTargets(turnOrder)` (`summonIntegration.ts` 184–186: `side === "player" || isPlayer`) **then** keeps `type === "enemy"`. Player is `type: "player"`. Player summons are `type: "summon"`. Pack minions are not player-side. The intersection is empty. `moveToward` (`useBossAI.ts` 96–100) occupies `allEnemies` plus the player tile — so the boss pathing grid contains **only the player**. Allied minions and the wisp are air. SYS-46 dummy stats on those rows never run because the rows are missing. SYS-48 is portal-as-floor. This is **who is a body**. SYS-56.

4. **Erratic dest ignores portal / void / barrier occupancy.** After `aiTier >= 5` and leader death, WX 15531–15549 keeps adjacent cells that are in-bounds, not a wall, not another enemy body, not the player. No `aiPortals`, `aiVoid`, `aiBarriers`, `hazardTiles`, or `isCellFree`. Then `updateCombatant` commits (15590). SYS-12 isolates erratic as spectacle, not a tactic. SYS-43 bills lava **HP** on dest-commit. SYS-48 stops bosses treating portal as floor. Erratic can still **camp the gateway**. SYS-57.

5. **`enemyDestToCommit` is clamp-only.** `battleSetup.ts` 394–406 returns `{x,y}` if the dest differs from origin and sits on the board. WX 16421–16423 writes it. Pack `computeReachable` already uses `isCellFree` (portals, void, barriers, occupied). Apply does not re-check. A skip-with-move dest, a bug, or a future enumerator that emits an illegal cell will stack two bodies or stand on a portal. SYS-27 was **reserved** cells in decide. SYS-43 was **hazard HP**. This is the apply-side occupancy gate. SYS-58.

6. **Plague Zone comment says “all units”; apply hits only the player.** WX 14309–14324 runs at **player** turn start, damages `characterStats.hp` by `PLAGUE_ZONE_TICK`, records challenge damage, and can kill the player. Pack / summons / bosses are not ticked. An ADV-06/07 module that “spreads off plague because everyone burns” would be scoring a rule that does not exist. SYS-59.

### 1.5 Tests

`enemyAI.charger.test.ts`, `enemyAI.geometry.test.ts`, `enemyAI.walkMp.test.ts` exist. Honesty (Fire Bolt, ally-heal fallback, dest-commit lava, dest-commit occupancy, shared focus, boss dummy AP, boss empty occupancy, enemy-summon executor skip, strip AP=`level`, apply LoS, portal walk, choke keys, Mirror snapshot) still has no decide/apply-layer tests. Do not treat geometry/walkMp as SYS-05 or SYS-54…59.

### 1.6 What this increment does **not** change

Do not implement FUT-72+ before P0 honesty + 09-21 SYS-22…32 + 09-22 SYS-33…35 + 09-23 SYS-36…41 + 09-24 SYS-42…47 + 09-25 SYS-48…53. Do not start T6 strip-ATK / last-turn summon / boss interpose before SYS-05 / SYS-07 / SYS-54 / SYS-55 / SYS-56.

Do not touch RAF, map generation, turn order, or damage formulas to “make AI feel harder.” Do not copy #495 / #498 helpers into this docs-only change. Do not edit the parent catalog. Do not give AI exclusive body-block LoS (`hasBresenhamLoS` is shared and ignores combatants).

---

## 2. Design additions (normative)

1. **Do not recycle 09-21…09-25 ids.** SYS-22…32 / FUT-36…47 belong to PR #351. SYS-33…35 / FUT-48…53 belong to PR #416. SYS-36…41 / FUT-54…59 belong to PR #458. SYS-42…47 / FUT-60…65 belong to PR #506. SYS-48…53 / FUT-66…71 belong to PR #565. This file starts at SYS-54 / FUT-72.
2. **Public strip stats are not a seed for unbounded AP.** After SYS-07, enumerator MP/AP come from seeded `currentAp`/`currentMp` on a **piece / summon / minion table**, never `enemy.level` and never the HUD dummy `res: 0` / `atk: level*2`. FUT-32 may read leftover **player** AP/MP from the strip (those rows copy `currentBattleAp` / `currentBattleMp`). Enemy rows on the strip are not SYS-10.
3. **Hostile summons use the same paid executor as player summons.** Routing is `isSummon`, not `side === "player"`. Decide still uses `decideSummonAction` + occupancy (SYS-14) keyed by `summon.side` (SYS-33).
4. **Boss occupancy is every living body except self.** Pack minions, player summons, and the player tile. `getPlayerSideTargets` is a damage-target helper, not an occupancy query.
5. **Spectacle walks still cannot ignore occupancy.** Erratic / betrayal remain SYS-12 (not tactics). Their dests still pass `isCellFree`.
6. **Dest-commit is a walk.** Clamp, then `isCellFree`, then public hazards (SYS-43). Illegal dest ⇒ origin, no Fire Bolt.
7. **Score the Plague Zone that apply actually runs.** Player-only tick until apply changes; do not invent pack ticks to feel hard.
8. **T6+ still stacks** on the parent enumerator. No integer tier table. No `if (aiTier >= 8)`. No `ap = enemy.level`.

---

## 3. System proposals (2026-09-26)

### AI-SYS-54

**AI_ID:** AI-SYS-54  
**NAME:** Initiative-strip AP/ATK/RES are not live combatant stats  
**ROLE:** system  
**SOPHISTICATION:** T1+ / honesty for SYS-07 / FUT-32  
**DECISION_RULES:** `resolveEnemyApMp` (`summonIntegration.ts` 195–209) currently returns `{ ap: enemy.level ?? fallbackLevel, mp: max(1, floor(level/2)) }` for non-summons, and HUD mapping (WX 17402–17411) overwrites `atk: e.level * 2`, `res: 0`, `sp: 0`, `chc: 2`. The player row sets `atk: 0` (17396). Do **not** feed these fields into `DecideEnemyContext`, boss `CombatantEntryLike`, killable-now, or ADV-01 threat. SYS-07 seeds `currentAp`/`currentMp` from an explicit piece / summon / minion table (SYS-21 / SYS-28). SYS-10 snapshots numeric RES/SP/SR from `characterStats` / the combatant, not from this strip. FUT-32 may keep reading **player** leftover AP/MP from the strip because those two fields are live (`currentBattleAp` / `currentBattleMp` at 17393–17394). Enemy `ap = level` is forbidden: it is a hidden level cap on the resource axis.  
**SCORING_MODEL:** Enumerator AP/MP = seeded current values. Missing ⇒ 0 walk/cast (SYS-07), not `enemy.level`. Strip dummy RES 0 is not TGT-05.  
**SPELL_REQUIREMENTS:** None.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always. Ratio-based modules must not unlock “more AP” via absolute level.  
**ENEMY_ARCHETYPES:** All pack actors; HUD consumers.  
**PLAYER_COUNTERPLAY:** The strip must not advertise 400 AP on a level-400 remnant if the piece table is 3 MP.  
**EDGE_CASES:** Summon branch of `resolveEnemyApMp` already prefers `currentAp`/`currentMp` (200–204) — keep that, and stop using `enemy.level` as a fallback once SYS-07 seeds them. Player `atk: 0` on the strip must not make ADV-01 treat the player as harmless (FUT-72). Do not copy `FAMILY_STAT_MULTS.ap` (SYS-28).  
**IMPLEMENTATION_COMPLEXITY:** Medium (HUD honesty + decide seed; two call sites).  
**TEST_SCENARIOS:** Pack pawn `level === 80`, piece-table MP 3 → enumerator reachable uses 3, not 80. Strip display may stay flavour until a HUD PR; decide must not read it. Player `characterStats.atk === 40` → ADV-01 uses 40, not strip 0.  
**STATUS:** PROPOSED

### AI-SYS-55

**AI_ID:** AI-SYS-55  
**NAME:** Enemy-side summons use the paid summon executor  
**ROLE:** system  
**SOPHISTICATION:** T1+ (SYS-05 / SYS-25 companion)  
**DECISION_RULES:** WX 14980 currently enters `executeSummonAction` only for `summonEnemy?.isSummon && summonEnemy.side === "player"`. Hostile minions from `spawnEnemySummonUnit` (`summonSpawn.ts` 246–277, `side: "enemy"`) have turn-order `type: "enemy"` so the enemy-AI effect runs, then fall through to pack dest-commit (16416–16423) and Fire Bolt. After this module: any `isSummon` combatant uses `decideSummonAction` + `executeSummonAction` (occupancy, AP/MP debit, one leftover-AP `reevaluate`). Pack `decideEnemyAction` stays for non-summon hostiles. SYS-14 fills occupied / CD on the **player**-summon snapshot; copy that snapshot for enemy-side summons with `allyCount` from SYS-33. Do not grow `runSummonAI`.  
**SCORING_MODEL:** Walk dests whose path cost > remaining MP are not enumerated. AP 0 cannot cast.  
**SPELL_REQUIREMENTS:** Existing `SUMMON_KIT` ids; still no profiled Inferno blast on pack queens (FUT-58).  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always when `isSummon`.  
**ENEMY_ARCHETYPES:** hunter / guardian / archer / bomber / healer summons, including enemy-side wolves from ROL-06.  
**PLAYER_COUNTERPLAY:** Drain a hostile wolf’s MP; it cannot dest-commit three tiles for free.  
**EDGE_CASES:** `type: "enemy"` on the turn-order entry must remain so the AI effect fires — only the **apply** path changes. Boss-tagged summons that are not `isSummon` stay on the pack/boss brain. Missing `currentMp` ⇒ 0 walk (SYS-07), not budget 3.  
**IMPLEMENTATION_COMPLEXITY:** Medium (WX gate + snapshot parity; executor already exists).  
**TEST_SCENARIOS:** Enemy wolf `side: "enemy"`, `currentMp: 1`, dest Chebyshev 2 / 4-dir cost 2 → blocked or 1-step, no Fire Bolt. Player wisp still uses the executor.  
**STATUS:** PROPOSED

### AI-SYS-56

**AI_ID:** AI-SYS-56  
**NAME:** Boss occupancy is every living body except self  
**ROLE:** system  
**SOPHISTICATION:** T5 / honesty for the second brain  
**DECISION_RULES:** WX 15430–15435 currently maps `getPlayerSideTargets(turnOrder)` (player-side only) then keeps `c.type === "enemy"`. That intersection is empty on live turn-order shapes (`player` / `summon` / pack `enemy` with `side !== "player"`). `moveToward` (`useBossAI.ts` 96–105) therefore occupies only the player tile. After this module, `allEnemies` (or a dedicated occupied list) is every living combatant except the boss: pack minions, player-side summons, and any other hostiles. Stats on those rows remain SYS-46 (live AP/MP/RES/SP, not `ap: 3`). Portal cells remain SYS-48. Do not use `getPlayerSideTargets` as occupancy.  
**SCORING_MODEL:** Occupied dest ⇒ −∞. Walking through a wisp or allied rook is illegal.  
**SPELL_REQUIREMENTS:** None.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always when boss AI runs.  
**ENEMY_ARCHETYPES:** All `useBossAI` walkers.  
**PLAYER_COUNTERPLAY:** Park a summon on the only step to the boss; the boss cannot phase through it.  
**EDGE_CASES:** `KNIGHT_JUMP_IGNORE_WALLS` may land on a tagged dest with UI copy; it still must not land on a living body unless the ability says so. Empty list today is a cheat, not “open-field pathing.”  
**IMPLEMENTATION_COMPLEXITY:** Low (list construction + tests).  
**TEST_SCENARIOS:** Minion at (4,4), boss at (4,3), player at (4,8) → `moveToward` dest ≠ (4,4). Wisp at (5,5) is occupied. `getPlayerSideTargets` still used for damage targeting if a separate list is needed.  
**STATUS:** PROPOSED

### AI-SYS-57

**AI_ID:** AI-SYS-57  
**NAME:** Erratic dest uses `isCellFree`  
**ROLE:** system  
**SOPHISTICATION:** T1+ (SYS-12 companion; not a tactic)  
**DECISION_RULES:** WX 15531–15549 currently allows any in-bounds non-wall cell that is not another enemy body and not the player. After this module, the same `OccupancyContext` pack decide uses (barriers, portals, void, occupied, reserved — SYS-27) filters erratic candidates. SYS-43 still bills landing HP. SYS-12 still forbids treating erratic as T5 sophistication; this row only stops gateway camping. Wild-cast remains log-only (15559–15564). Never `if (aiTier >= 5)` as a module attach — SYS-01 deletes that gate; until then occupancy still applies.  
**SCORING_MODEL:** Illegal dest ⇒ stay on origin (spectacle skip).  
**SPELL_REQUIREMENTS:** None.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always when the erratic branch runs.  
**ENEMY_ARCHETYPES:** All pack actors under the leftover `aiTier >= 5` gate.  
**PLAYER_COUNTERPLAY:** The white sanctuary portal stays a keep-clear cell, even during leader-death chaos.  
**EDGE_CASES:** No legal adjacent cell → origin. Do not let erratic ignore walls “to feel random.” Betrayal HP (15594+) stays spectacle and is not this dest.  
**IMPLEMENTATION_COMPLEXITY:** Low.  
**TEST_SCENARIOS:** Portal at (8,8), enemy at (8,7), only adjacent floor is the portal → dest stays (8,7). Barrier-adjacent cell is rejected.  
**STATUS:** PROPOSED

### AI-SYS-58

**AI_ID:** AI-SYS-58  
**NAME:** Dest-commit re-checks `isCellFree`  
**ROLE:** system  
**SOPHISTICATION:** T1+ (apply occupancy)  
**DECISION_RULES:** `enemyDestToCommit` (`battleSetup.ts` 394–406) currently clamps to `gridSize` and returns a patch whenever dest ≠ origin. WX 16421–16423 writes it. After this module, a dest is committed only if `isCellFree` on the same occupancy snapshot decide used (plus the acting unit’s origin as free). Illegal dest ⇒ no patch (sprite stays), no Fire Bolt from a “new” origin that never happened (SYS-42 / SYS-47 measure from the real origin). SYS-27 reserved cells are occupied here too. SYS-43 then bills hazards on a dest that actually landed.  
**SCORING_MODEL:** N/A (apply reject).  
**SPELL_REQUIREMENTS:** None.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always.  
**ENEMY_ARCHETYPES:** All pack walkers.  
**PLAYER_COUNTERPLAY:** Body-block the BFS dest; they do not stack on you.  
**EDGE_CASES:** `kind: "skip"` with a retreat dest (POS-02) still must be free. Boss apply walks stay SYS-45 (aim ≠ dest). Erratic commits go through SYS-57 **and** this helper if they share it.  
**IMPLEMENTATION_COMPLEXITY:** Low (one predicate in the helper or at the WX call).  
**TEST_SCENARIOS:** Dest equals player tile → no `updateCombatant` patch. Dest is a portal key → no patch. Legal dest one step north → patch.  
**STATUS:** PROPOSED

### AI-SYS-59

**AI_ID:** AI-SYS-59  
**NAME:** Plague Zone scoring matches player-only apply  
**ROLE:** system  
**SOPHISTICATION:** T4 honesty (ADV-06 / ADV-07)  
**DECISION_RULES:** WX 14309 comment says “all units lose 2 HP at start of each turn.” Apply 14313–14324 damages only `characterStats` at **player** turn start (plus challenge debit / death). Pack, summons, and bosses are not ticked. Decide modules must treat Plague Zone as a **public player-HP** pressure (FUT-76), not as a map that burns the pack for standing still. Do not add hidden enemy ticks to “make late-game plague harder.” If a later apply PR actually ticks all living units, this module’s snapshot flag flips and FUT-76 inverts (self-HP cost). Until then, pack standing on “plague flavour” tiles is not a cost.  
**SCORING_MODEL:** `playerHpFrac` may include the next public player tick when the modifier is on. Enemy self-HP term from plague = 0 today.  
**SPELL_REQUIREMENTS:** None.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always (honesty of information). Scoring attach is FUT-76.  
**ENEMY_ARCHETYPES:** All.  
**PLAYER_COUNTERPLAY:** You burn; they do not — unless a future apply change is shipped and documented.  
**EDGE_CASES:** Do not confuse Plague Zone with Inferno DoT (SYS-39) or lava dest-commit (SYS-43). Do not read unowned book ids.  
**IMPLEMENTATION_COMPLEXITY:** Low (document + ctx boolean `plagueZonePlayerOnly`).  
**TEST_SCENARIOS:** Modifier on, bishop on a flavour tile, player 10 HP → pack EV does not subtract 2 from the bishop. Player killable-now may include the next tick if FUT-76 is attached.  
**STATUS:** PROPOSED

---

## 4. T6+ reusable modules (2026-09-26)

Attach via parent §4 sigmoid. Stack; do not replace T0–T5 or FUT-01…71.

### AI-FUT-72

**AI_ID:** AI-FUT-72  
**NAME:** Visible player ATK from HUD, never strip `atk: 0`  
**ROLE:** adaptive  
**SOPHISTICATION:** T6 (ADV-01)  
**DECISION_RULES:** Parent ADV-01 estimates player threat from public HP/ATK. The initiative strip currently publishes `atk: 0` for the player (WX 17396) and `atk: e.level * 2` for enemies (17405). After SYS-54, this module reads **HUD / `characterStats.atk`** (the same number SYS-51 copies into the boss player row). Missing ⇒ module off, not 0-threat. Do not read queued click damage. Do not use `enemy.level * 2` as “the player hits this hard.”  
**SCORING_MODEL:** `threatAtk = visPlayerAtk` (post-buff modifier if SYS-10 has it). Adjacent-step EV uses that ATK vs own RES, non-crit (FUT-57).  
**SPELL_REQUIREMENTS:** None.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.8` when player ATK is public on the HUD. Never `if (level >= 50)`.  
**ENEMY_ARCHETYPES:** tank, kiter, charger (invert: may still walk in).  
**PLAYER_COUNTERPLAY:** Buff ATK; kiters respect the strip-that-is-not-the-strip.  
**EDGE_CASES:** Strip still showing 0 is not the source. Boss dummy 10 is SYS-51, not this reader.  
**IMPLEMENTATION_COMPLEXITY:** Low after SYS-10 / SYS-54.  
**TEST_SCENARIOS:** HUD ATK 40, strip 0 → kiter does not treat melee as free. HUD ATK missing → term 0.  
**STATUS:** PROPOSED

### AI-FUT-73

**AI_ID:** AI-FUT-73  
**NAME:** Public summon `turnsRemaining` last-turn pressure  
**ROLE:** role / adaptive  
**SOPHISTICATION:** T6 (ADV-07 / bomber)  
**DECISION_RULES:** Initiative pips already show summon lifespan (`InitiativeStrip` / WX 8144–8145). Unused `runSummonAI` detonates when `turnsRemaining <= 1` (`summonAI.ts` 365). Live `decideSummonBomber` uses HP% and cluster count (`AI_KAMIKAZE_LOW_HP_PCT`). When SYS-55 routes hostile summons through `decideSummonAction`, a T6 bomber/hunter with **public** `turnsRemaining === 1` may prefer detonate / melee over reposition. Player-side bombers the pack can **see** are FUT-60 spread, not this. Do not read hidden remaining if the pip is absent.  
**SCORING_MODEL:** `+wLastTurn` on kamikaze/hunter EV when `turnsRemaining === 1` and at least `AI_KAMIKAZE_MIN_TARGETS` (bomber) or a legal melee (hunter).  
**SPELL_REQUIREMENTS:** Bomber Inferno stays the tagged blast (FUT-58); hunter venom/physical.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 1.0` when a pip is public.  
**ENEMY_ARCHETYPES:** bomber, hunter summons.  
**PLAYER_COUNTERPLAY:** Peel the last-turn wolf; the pip is the tell.  
**EDGE_CASES:** `spawnEnemySummonUnit` `summonLifespan: 0` is falsy and falls back to `getSummonBaseStats` (`summonSpawn.ts` 154–161) — not an instant expire. Do not treat 0 as last-turn.  
**IMPLEMENTATION_COMPLEXITY:** Low after SYS-55 / SYS-10.  
**TEST_SCENARIOS:** Enemy bomber, pip 1, two player-side bodies in radius → detonate. Pip 4 → hold for cluster.  
**STATUS:** PROPOSED

### AI-FUT-74

**AI_ID:** AI-FUT-74  
**NAME:** Protector interposes on a public boss step  
**ROLE:** protector / tank  
**SOPHISTICATION:** T6 (POS-07; needs SYS-56)  
**DECISION_RULES:** Once boss `moveToward` occupies living bodies (SYS-56), a pack protector/tank with POS-07 may occupy the **4-dir step** the boss would take toward the player (Manhattan `dist` in `useBossAI.ts` 83–88 is the boss metric — do not convert it to Chebyshev for this dest). Always SYS-07 MP, SYS-48 no portal, SYS-58 free cell. Artillery never interposes. This is occupancy, not LoS (bodies do not block Bresenham).  
**SCORING_MODEL:** `+wInterpose` if dest is the boss’s greedy 4-dir step toward the player and role ∈ {tank, protector} and own HP fraction > retreat line (unless berserker).  
**SPELL_REQUIREMENTS:** None.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 1.1` when a boss is on the board. Ratio-based.  
**ENEMY_ARCHETYPES:** tank, protector; berserker invert.  
**PLAYER_COUNTERPLAY:** Attract the interposer; walk around the 4-dir step.  
**EDGE_CASES:** Before SYS-56 the boss walks through the tank anyway — module off. Cavalier jump is a tagged dest, not `moveToward`.  
**IMPLEMENTATION_COMPLEXITY:** Medium (depends on SYS-56 + POS-07).  
**TEST_SCENARIOS:** Boss (4,4), player (4,8), protector MP 2 → dest (4,5) if that cell is the greedy step. Bishop with POS-01 prefers range, not (4,5).  
**STATUS:** PROPOSED

### AI-FUT-75

**AI_ID:** AI-FUT-75  
**NAME:** Piece-table AP/MP as relative difficulty, never `level`  
**ROLE:** resource / meta  
**SOPHISTICATION:** T6 (RES-01; SYS-07 attach)  
**DECISION_RULES:** Parent RES-01 wants efficient AP combinations. Live pack decide uses constant budget 3. SYS-07 replaces that with `currentMp`. This module is the **eligibility** half: higher `peer` (log2 level ratio) / boss / map-mod may attach extra **seeded** MP/AP from the piece table (or a second explicit column), not `+1 AP per 10 absolute levels`. A level-400 remnant vs a level-400 player (`peer ≈ 0`) does not get 400 AP. A double-level elite (`peer ≈ 1`) may roll the extra column. SYS-54 forbids reading the strip. SYS-28 forbids family catalog AP.  
**SCORING_MODEL:** Enumerator node cap still SYS-03 (64 dests / 256 nodes). Extra MP is more dests, not a deeper tree.  
**SPELL_REQUIREMENTS:** None.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Extra-column attach `mu ≈ 0.5` on the parent sigmoid. Never `if (enemy.level >= 100)`.  
**ENEMY_ARCHETYPES:** All walkers once SYS-07 exists.  
**PLAYER_COUNTERPLAY:** Fight below-peer remnants; they keep the small table.  
**EDGE_CASES:** Boss `baseStats.ap/mp` already exist on `bossCELike` (WX 15384–15385) — that is authored, not `level`. Minion `ap: 0` stays SYS-21.  
**IMPLEMENTATION_COMPLEXITY:** Medium (table + SYS-01 roll).  
**TEST_SCENARIOS:** Same absolute enemy level 50 vs player 50 and vs player 5 → extra-column attach rates differ. Neither case seeds AP=50.  
**STATUS:** PROPOSED

### AI-FUT-76

**AI_ID:** AI-FUT-76  
**NAME:** Plague Zone as public player-HP pressure  
**ROLE:** adaptive  
**SOPHISTICATION:** T6 (ADV-03; SYS-59)  
**DECISION_RULES:** When SYS-59’s flag says the modifier is on and apply is player-only, chargers/assassins may raise approach weight because the **player** will lose `PLAGUE_ZONE_TICK` at the start of their next turn (public). Kiters do not step as if they themselves burn. If apply later ticks all units, invert: POS-04-style self-HP cost, no extra approach. Do not roll the tick at decide time.  
**SCORING_MODEL:** `playerHpFrac` uses `hp - PLAGUE_ZONE_TICK` for killable-now **only** if that tick is guaranteed before the player acts again (initiative-public). Own HP unchanged today.  
**SPELL_REQUIREMENTS:** Damage profiles for the killable-now term.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 1.0` when the modifier is public.  
**ENEMY_ARCHETYPES:** charger, assassin, kiter (invert).  
**PLAYER_COUNTERPLAY:** Heal before End Turn if you do not want them to collapse in on a 2-HP forecast.  
**EDGE_CASES:** Opening player turn before the first tick → term 0. Lethal tick is SYS-59’s apply, not an AI execute.  
**IMPLEMENTATION_COMPLEXITY:** Low after SYS-59.  
**TEST_SCENARIOS:** Player 3 HP, tick 2, charger in range → killable-now may wait for the public tick only if the player has already acted this round. Bishop does not leave a tile “to avoid plague.”  
**STATUS:** PROPOSED

### AI-FUT-77

**AI_ID:** AI-FUT-77  
**NAME:** Hostile summon `summonAI` is metadata, not `pieceType`  
**ROLE:** system / spell awareness  
**SOPHISTICATION:** T1+ (SYS-17 spawn companion)  
**DECISION_RULES:** `spawnEnemySummonUnit` writes `summonAI: unitDef.pieceType` (`summonSpawn.ts` 275). `spawnSummonUnit` then keeps `spell.summonAI || "hunter"` (139). `inferSummonArchetype` (203–224) accepts hunter/guardian/archer/bomber/healer and legacy kiter/kamikaze; `"wolf"` falls through to `name.includes("wolf")` (SYS-17 to delete). After SYS-17, a wolf whose `pieceType` is an admin id without those substrings becomes hunter-by-default even if `unitDef` had a healer kit. Author `summonAI` from `unitDef.summonAI` (or the kit’s typed field), never `pieceType`, never `name`.  
**SCORING_MODEL:** N/A (routing).  
**SPELL_REQUIREMENTS:** `summonAI` on the unit def.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always (authoring).  
**ENEMY_ARCHETYPES:** All hostile summons.  
**PLAYER_COUNTERPLAY:** N/A.  
**EDGE_CASES:** `summonLifespan: 0` is already a falsy fallback to `getSummonBaseStats` (154–161) — do not treat it as “no lifespan.” Player `spawnUnit` at WX 15048 also passes `summonAI: unitDef.pieceType` — same lock, player-side.  
**IMPLEMENTATION_COMPLEXITY:** Low.  
**TEST_SCENARIOS:** `pieceType: "hex_chorister"`, `summonAI: "healer"` → healer. `pieceType: "wolf"`, `summonAI` missing → hunter default, not name search.  
**STATUS:** PROPOSED

---

## 5. Spell-awareness contract (reminder)

Unchanged: no profile + apply ⇒ not in kit. Do not feed `spellRangeBase` into AI (`targeting.ts` 128–137). `starter-heal` is self-only (`range: 0`). Ally heal needs a ranged heal id **and** apply `targetId` (SYS-05) **and** SYS-42 so a failed heal cannot Crush the ward. Heal pickers must not use `healAmount` (SYS-38). Inferno needs SYS-39 before any kit emits it. Mirror stays `usableByEnemy: false` until a profile **and** SYS-50 exist.

Still `usableByEnemy: true` without a working decide+apply pair (do not give these to AI until profiled):

`spell-swap`, `spell-mark`, `spell-sacrifice`, `spell-lifesteal-nova`, `spell-enrage`, `spell-haste`, `spell-weaken`, `spell-expose`, `spell-drain-courage`, `spell-cursed-wound`, `spell-shadow-veil`, `spell-frost-nova`, `spell-inferno` (DoT `damage: 0`), `starter-poison` / `spell-venom-strike`, `starter-shield` / `spell-iron-skin`, `starter-drain` (as a **heal**).

Keep `usableByEnemy: false` until profiled: barrier, mirror, timestep, rallying-cry, sentinel/bomber/wisp summons.

New mechanics still define a `SpellScoreProfile` before `usableByEnemy` flips true.

Hostile summon kits still must not run on pack dest-commit (SYS-55) even when the ids are profiled.

---

## 6. Implementation order (this increment)

1. P0 **AEE-2026-08-31-002** (Fire Bolt WX **16710–16715**, AP/MP debit, ally heal WX **16648**, FUT-41 pairing, **SYS-42** so failed heals cannot bolt the ward).  
2. 09-21 SYS-22…32 (healer LoS, kit CD, summon occupied, resource plan, family `aiTier`, focus prepend).  
3. 09-22 SYS-33…35 (summon side counts, live player tile / #495, SP in EV).  
4. 09-23 SYS-36…41 (pack side counts, numeric RES, drain-as-heal, Inferno apply, summon dest, rally role).  
5. 09-24 SYS-42…47 (opponent-only fallback, dest-commit hazards, per-side focus, boss aim, boss peer stats, apply LoS).  
6. 09-25 SYS-48…53 (boss portal floor, choke keys, Mirror snapshot, boss player ATK, grid constant, player id).  
7. SYS-54, SYS-55, SYS-56, SYS-57, SYS-58, SYS-59 (this file).  
8. Parent T2–T5 roles / team / adaptive. FUT-72 with SYS-54; FUT-73 with SYS-55; FUT-74 with SYS-56; FUT-75 with SYS-07 / SYS-54; FUT-76 with SYS-59; FUT-77 with SYS-17.

Each slice: `engine/enemyAI*.test.ts`, zero WX drive-by, no RAF / map gen / turn order / damage-formula edits.

---

## 7. Extra test scenarios

| ID | Setup | Expect |
| :--- | :--- | :--- |
| TS-STRIPAP | Pack pawn level 80, piece-table MP 3 | Enumerator MP 3, not 80 (SYS-54). |
| TS-STRIPATK | Player HUD ATK 40, strip 0 | ADV-01 uses 40 (FUT-72). |
| TS-HOSTEXEC | Enemy wolf `side: "enemy"`, MP 1, 2-step dest | Executor blocks or 1-step; no dest-commit Fire Bolt (SYS-55). |
| TS-BOSSOCC | Minion (4,4), boss (4,3) | Boss dest ≠ minion tile (SYS-56). |
| TS-ERRPORT | Erratic, only adjacent is portal | Dest stays origin (SYS-57). |
| TS-DESTFREE | Dest-commit onto player tile | No patch (SYS-58). |
| TS-PLAGUE | Plague Zone on, bishop flavour tile | Bishop HP unchanged this tick (SYS-59). |
| TS-LASTPIP | Enemy bomber pip 1, 2 bodies in radius | Detonate (FUT-73). |
| TS-INTERP | Boss greedy step (4,5) | Protector dest (4,5) (FUT-74). |
| TS-PEERAP | Enemy 50 vs player 50 vs player 5 | Extra AP column attach rates differ; neither seeds AP=50 (FUT-75). |
| TS-PLAGUEP | Player 3 HP, public tick 2 | Approach weight up; bishop does not self-flee plague (FUT-76). |
| TS-SUMAI | `pieceType: "hex_chorister"`, `summonAI: "healer"` | Healer, not hunter (FUT-77). |

09-21…09-25 TS-* rows still apply. Geometry tests cover caster LoS only.

---

## 8. Mapping (new gaps → ids)

| Request / gap | Primary AI_ID |
| :--- | :--- |
| Strip / `resolveEnemyApMp` uses `enemy.level` as AP; dummy RES/ATK | AI-SYS-54 |
| Enemy-side summons skip paid executor | AI-SYS-55 |
| Boss occupancy = `getPlayerSideTargets` ∩ `type === "enemy"` (empty) | AI-SYS-56 |
| Erratic dest ignores portal/void/barrier | AI-SYS-57 |
| Dest-commit clamp-only, no `isCellFree` | AI-SYS-58 |
| Plague Zone comment “all units”; apply player-only | AI-SYS-59 |
| Visible player ATK from HUD, never strip 0 | AI-FUT-72 |
| Public summon lifespan last-turn pressure | AI-FUT-73 |
| Protector interposes on a public boss step | AI-FUT-74 |
| Piece-table AP/MP as relative difficulty | AI-FUT-75 |
| Plague Zone as player-HP pressure only | AI-FUT-76 |
| Hostile `summonAI` from metadata, not `pieceType` | AI-FUT-77 |

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

This increment adds strip/executor/second-brain/occupancy honesty (SYS-54…59) so those modules cannot cheat when they attach — especially as absolute levels grow without a cap — plus T6 scorers (FUT-72…77) that keep appearing as relative difficulty rises.

Every row above is **STATUS: PROPOSED**. No production AI in this change.
