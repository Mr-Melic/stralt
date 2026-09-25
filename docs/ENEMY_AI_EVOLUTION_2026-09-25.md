# Advanced Enemy AI Evolution — 2026-09-25 increment

**Status:** PROPOSED (design only; no production code in this change)  
**Date:** 2026-09-25  
**Parent catalog:** [`ENEMY_AI_EVOLUTION.md`](./ENEMY_AI_EVOLUTION.md) (T0–T5)  
**Prior increments:** [`ENEMY_AI_EVOLUTION_2026-09-01.md`](./ENEMY_AI_EVOLUTION_2026-09-01.md) · [`ENEMY_AI_EVOLUTION_2026-09-02.md`](./ENEMY_AI_EVOLUTION_2026-09-02.md) · [`ENEMY_AI_EVOLUTION_2026-09-21.md`](./ENEMY_AI_EVOLUTION_2026-09-21.md) (open PR #351; SYS-22…32, FUT-36…47 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-22.md`](./ENEMY_AI_EVOLUTION_2026-09-22.md) (open PR #416; SYS-33…35, FUT-48…53 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-23.md`](./ENEMY_AI_EVOLUTION_2026-09-23.md) (open PR #458; SYS-36…41, FUT-54…59 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-24.md`](./ENEMY_AI_EVOLUTION_2026-09-24.md) (open PR #506; SYS-42…47, FUT-60…65 — **do not re-number**)  
**Implementer ledger:** [`automation/ACTION_IDS_AEE_2026-09-25.md`](./automation/ACTION_IDS_AEE_2026-09-25.md)

This increment re-reads the live engine one day after the 2026-09-24 catalog. SYS-01…47 and FUT-01…65 stay **PROPOSED** on their own files; they are **not** re-filed here. New work is: boss portal passability, choke-key space, public Mirror token, boss player ATK dummy, walk-grid size, `"__player__"` vs `"player"` identity, and T6+ scorers that keep attaching as relative difficulty rises.

Stralt has **no character level cap**. Nothing here maps `if (level >= X) sophistication = Y`. Tiers remain conceptual. Eligibility remains the parent §4 sigmoid (`peer = log2(enemy.level / player.level)` plus pack/boss/modifier terms). A year-later peer fight at any absolute level can attach a new module without raising a cap.

**Hard rules (unchanged):** no cheat, no hidden player information, no ignored LoS/range/AP/MP, no unbounded search, no kit-less Fire Bolt, no `instantKill`, no betrayal-as-difficulty, no name-based spell heuristics, no production AI in this change.

Open production PRs that already slice honesty this catalog filed earlier (do **not** re-file the ids):

| Open PR | Catalog id | What it changes |
| :--- | :--- | :--- |
| [#495](https://github.com/Mr-Melic/stralt/pull/495) (draft) | AI-SYS-34 | Apply `targetCell` from `playerPositionRef` via `enemyApplyTargetCell`. Not on this checkout. |
| [#498](https://github.com/Mr-Melic/stralt/pull/498) (draft) | AI-SYS-45 | Boss kit-spell apply must not commit `targetX/Y` as a walk dest. Not on this checkout. |
| [#487](https://github.com/Mr-Melic/stralt/pull/487) (draft) | (not a tactic) | Betrayal kills enter the death pipeline. Spectacle remains forbidden as sophistication. |

This docs PR does **not** edit [`ENEMY_AI_EVOLUTION.md`](./ENEMY_AI_EVOLUTION.md) (open PR #351 unions that header). Unique files only.

---

## 1. Re-read (2026-09-25)

All line numbers are from this checkout. Re-read them before implementing.

### 1.1 Combat-parity still is not sophistication

Unchanged from 2026-09-21…24: `enemyCastGeometryOk` (`targeting.ts` 166–177), `aiCanCast` (`enemyAI.ts` 320–332), Frozen walk *rate* (`enemyWalkMp.ts` 21–29), `playerCastPlan.ts` (player only), summon leftover-AP `reevaluate` (WX 15257–15276). These are **not** SYS-05 / SYS-13 / SYS-01.

`aiCanCast` is still unused by healer (1099–1100) and guardian (2131–2133). That remains **AI-SYS-23** on the 09-21 increment.

`enemyAI.ts` still has **zero** reads of `currentAp`, `currentMp`, or `apCost` (confirmed 2026-09-25 grep).

Pack `prevEnemies` is still `getLiveCombatants(combatantStoreCtx)` (WX **15481**) at the start of each enemy turn. Dest-commit still does not pay walk hazards (SYS-43).

### 1.2 Line numbers vs 2026-09-24 (WX moved one line on the gates)

| Fact | 2026-09-24 | Live (2026-09-25) |
| :--- | :--- | :--- |
| `computeAITier` | `combatMath.ts` 36–52 | **unchanged** |
| Spawn `aiTier` | WX 5823 | **5823** |
| Family second `computeAITier` | WX 5865 | **5865** (`spawnPolicy.ts` 7 still documents the re-roll) |
| Kit `levelZone` object | WX 11920 | **11920** |
| Summoner chance unbounded | WX 11932–11943 | **11932–11943** |
| Player-summon empty occupied | WX 15156 | **15156** |
| Player-summon `allyCount` hardcoded player | WX 15175–15176 | **15175–15176** |
| `getCombatantAt` `"__player__"` | (not called out) | WX **15119** and **9334**; decide ids `"player"` (SYS-53) |
| Shared `focusTargetRef` | summon 15190; pack 16352 | **unchanged** (SYS-44) |
| Erratic `aiTier >= 5` | WX 15507 | **15508–15591** (dest `updateCombatant` **15590**) |
| Betrayal `aiTier >= 10` | WX 15594 | **15595–15609+** |
| Boss dummy peer AP/MP/RES | WX 15444–15448 | **15444–15448** (SYS-46) |
| Boss player `atk: 10` | (not called out) | WX **15417** (SYS-51) |
| Boss tiles `floor \|\| portal` | (not called out) | WX **15457–15460** (SYS-48) |
| `getWalkableMoves` bounds | (SYS-45 edge) | `useBossAI.ts` **75–77** hardcodes **16** (SYS-52) |
| Pack snapshot | WX 16273–16302 | **16273–16302** |
| Dest-commit clamp only | WX 16416–16423 | **16416–16423**; `battleSetup.ts` **394–406** |
| Apply Chebyshev only | WX 16450–16456 | **16450–16456** (SYS-47) |
| `consumePlayerMirror` | (FUT-34 family) | WX **16496–16528**; token is `"player"` (`playerMirror.ts` 10–21) (SYS-50) |
| Self-heal `range === 0` | WX 16648 | **16648** |
| Fire Bolt `e-firebolt` | WX 16710–16715 | **16710–16715** (`e-firebolt` object at **16712**) |
| `decideEnemyAction` | 1662–1707 | **1662–1707** |
| `pickBossKitSpell` `new Map()` | `useBossAI.ts` 34–36 / 169–173 | **unchanged** |
| Choke/bottleneck refs | (FUT-65 occupancy) | WX **6417–6463** keys `${_ri},${_ci}` = **y,x** (SYS-49) |
| Player mark ×2 | (FUT-31 flavour) | WX **3331–3335** `markedTilesRef` `${x},${y}` (FUT-66) |
| `isTileCastableLive` ally = player summon | `targeting.ts` 527–544 | **527–544** |
| `WORLD_GRID_SIZE` | 16 | `gameConstants.ts` **8** = 16 |

P0 remains **AEE-2026-08-31-002** (Fire Bolt / apply honesty) then **AEE-2026-08-31-001** (`computeAITier`). Next 09-21 honesty: **AEE-2026-09-21-002** / **004**. Next 09-22: **AEE-2026-09-22-002** / **003**. Next 09-23: **AEE-2026-09-23-001…005**. Next 09-24: **AEE-2026-09-24-001…006**. Then this file’s SYS-48…53. Do not start FUT-66+ first.

### 1.3 Still true — do not re-file (parent / 09-21 / 09-22 / 09-23 / 09-24)

- Zone-0 kits forever (`Math.floor(levelZone)` on an object). SYS-09.
- `scoreTargets` ignores `focusTargetId`. SYS-08 / AI-SYS-30.
- `estimateDamage` returns 0 when `spell.damage <= 0`. SYS-02 / SYS-39.
- Heal-first `inferArchetype` (447–452). SYS-04 / SYS-41.
- Hazard avoid only below 50% HP (425–441). POS-04 / FUT-09 / FUT-59.
- Retreat / `reposition-los` `kind: "skip"` while moving (caster 929–944; generic 1570–1578). POS-02 / FUT-41.
- Summoner chance hits 1.0 at player level 44. FUT-23.
- `ENEMY_AI_TIER_GATES` unread (`gameConstants.ts` 200–209), including `bottleneckControl: 8` and `chokepointCamp: 3`. SYS-01 / FUT-65; this file’s FUT-68.
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
- Dest-commit skips lava/ice/spikes/thorn. AI-SYS-43.
- Shared `focusTargetRef`. AI-SYS-44.
- Boss kit aim as walk dest. AI-SYS-45 (open #498).
- Boss peer dummy `ap: 3`. AI-SYS-46.
- Apply Chebyshev-only after dest-commit. AI-SYS-47.
- Hidden crit in EV. AI-FUT-57.
- Parent FUT-21 (Paper Windstorm expected miss) is still a one-line stub; live apply is 50% at WX **16491**. Do not allocate FUT-66 to it.

`engine/summonAI.ts` `runSummonAI` remains unused. Live player-summon decide is `decideSummonAction` (1760+); enemy-side summons still go through pack `decideEnemyAction` (WX 14980 gates the executor on `side === "player"`).

### 1.4 New honesty gaps (this increment)

1. **Boss walk grid treats portal cells as floor.** Pack occupancy puts portal keys in `ctx.portals` and `isCellFree` refuses them (`occupancy.ts` + WX 16317–16319). Boss decide builds `tilesForBossAI` as `t === "floor" || t === "portal"` (WX **15457–15460**), then `getWalkableMoves` (`useBossAI.ts` 58–80) steps onto any true cell that is not in the occupied-body list. A boss can camp or traverse a portal tile the pack cannot. SYS-27 was reserved-cell **decide** for summons; this is boss **locomotion** honesty. SYS-48.

2. **Authored choke/bottleneck keys are `y,x`, not occupancy `x,y`.** After `generateRandomMap`, WX 6417–6463 writes `mapChokePointsRef` / `mapBottleneckTilesRef` as `` `${_ri},${_ci}` `` where `_ri` is the row (y) and `_ci` is the column (x). Pack/summon occupancy, barriers, portals, marks, and `computeReachable` all use `` `${x},${y}` ``. Feeding those refs into POS-05 / FUT-65 without rewriting keys camps the transposed cell (often a wall). `ENEMY_AI_TIER_GATES.bottleneckControl = 8` is still unread — do not `if (aiTier >= 8)`. SYS-49.

3. **Public Mirror is a consume-once token, not a combatant field.** Apply reflects single-target non-AoE kit damage when `consumePlayerMirror(mirrorUnitsRef.current)` is true (WX **16496–16528**). The token is the string `"player"` (`playerMirror.ts` 10–21). `AICombatant` has no mirror flag; `DecideEnemyContext` has no `mirrorUnits`. FUT-34 told pack AI to bias physical when a **combatant effect** is public. Live Mirror never wrote that effect — decide cannot legally see it, so a T6 “don’t frost into Mirror” module would have to cheat or no-op. SYS-50.

4. **Boss player row hardcodes `atk: 10`.** SYS-46 fixed dummy `ap: 3` / `res: 0` on **peer** rows (15444–15448). The player snapshot copies live AP/MP/RES/SP (15415–15419) but still sets `atk: 10` (15417). After SYS-07 / SYS-10, a boss that plans around “the player always hits for 10” is either a cheat or a wasted reposition. SYS-51.

5. **`getWalkableMoves` hardcodes grid 16.** `WORLD_GRID_SIZE` is 16 today (`gameConstants.ts` 8). Boss movement clips with `p.x < 16 && p.y < 16` (`useBossAI.ts` 75–77). Pack `computeReachable` uses the constant (enemyAI.ts 383). If the constant ever changes, bosses walk a private board. SYS-45 mentioned this as an edge; it is a distinct honesty slice from aim≠walk. SYS-52.

6. **Player identity is two strings.** Decide / pack snapshot / heal tests use `"player"` (`enemyAI.ts` 1671–1672; WX 16293–16301; `challengeCompletion.ts` 239–240). Live `getCombatantAt` returns `{ id: "__player__", side: "player" }` (WX **9334**, **15119**). `isPlayerHealTargetId` accepts both; `castHelpers` / `spellEngine` branch on `"__player__"`. SYS-13’s side-aware helper must not require the sentinel. A pack healer `targetId: "player"` (it should not — pack allies are enemy-side) or a future ally-of-player lookup that compared ids would miss. SYS-53.

### 1.5 Tests

`enemyAI.charger.test.ts`, `enemyAI.geometry.test.ts`, `enemyAI.walkMp.test.ts` exist. Honesty (Fire Bolt, ally-heal fallback, dest-commit lava, shared focus, boss dummy AP, apply LoS, portal walk, choke keys, Mirror snapshot) still has no decide/apply-layer tests. Do not treat geometry/walkMp as SYS-05 or SYS-48.

### 1.6 What this increment does **not** change

Do not implement FUT-66+ before P0 honesty + 09-21 SYS-22…32 + 09-22 SYS-33…35 + 09-23 SYS-36…41 + 09-24 SYS-42…47. Do not start T6 mark/mirror/bottleneck before SYS-05 / SYS-23 / SYS-42 / SYS-48 / SYS-49 / SYS-50.

Do not touch RAF, map generation, turn order, or damage formulas to “make AI feel harder.” Do not copy #495 / #498 helpers into this docs-only change. Do not edit the parent catalog.

---

## 2. Design additions (normative)

1. **Do not recycle 09-21…09-24 ids.** SYS-22…32 / FUT-36…47 belong to PR #351. SYS-33…35 / FUT-48…53 belong to PR #416. SYS-36…41 / FUT-54…59 belong to PR #458. SYS-42…47 / FUT-60…65 belong to PR #506. This file starts at SYS-48 / FUT-66.
2. **Portal tiles are not floor.** Pack, summon, and boss walkers share `OccupancyContext.portals`. Tagged Cavalier jump may land on a listed dest with UI copy; it does not make portals floor for `getWalkableMoves`.
3. **One key space: `${x},${y}`.** Map-analysis refs must be rewritten before any scorer reads them. Occupancy, marks, barriers, and hazards already use x,y.
4. **Public Mirror is a snapshot flag**, the same way leftover AP is. Decide reads the token **without consuming it**. Apply still consumes once.
5. **Boss (and pack) snapshots use live visible stats**, including player ATK. Dummy `10` is SYS-07’s silent budget in a second field.
6. **Grid size is `WORLD_GRID_SIZE`.** No private `16`.
7. **Player combatant id in decide/apply snapshots is `"player"`.** `"__player__"` stays an engine sentinel inside `castHelpers` / AoE hit lists. Side-aware legality maps the sentinel → `"player"` at the boundary.
8. **T6+ still stacks** on the parent enumerator. No integer tier table. No `if (aiTier >= 8)`.

---

## 3. System proposals (2026-09-25)

### AI-SYS-48

**AI_ID:** AI-SYS-48  
**NAME:** Boss walk grid does not treat portal as floor  
**ROLE:** system  
**SOPHISTICATION:** T1+ / T5 honesty  
**DECISION_RULES:** WX 15457–15460 currently maps `tilesForBossAI[y][x] = (t === "floor" || t === "portal")`. Pack decide passes portals as a separate impassable set (16317–16319) and `computeReachable` refuses them via `isCellFree`. After this module, boss `allTiles` is floor-only (or floor with portals listed in the same occupancy object pack uses). `getWalkableMoves` (`useBossAI.ts` 58–80) must not step onto a portal key unless a **tagged** `BossAbility` names that dest with UI copy (`KNIGHT_JUMP_IGNORE_WALLS` stays Cavalier-only and still must not treat *every* portal as floor). SYS-27 (reserved progression cells in **summon decide**) remains; this is boss locomotion.  
**SCORING_MODEL:** Portal dest ⇒ −∞ unless the tagged ability lists it.  
**SPELL_REQUIREMENTS:** None.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always when boss AI runs.  
**ENEMY_ARCHETYPES:** All `useBossAI` walkers.  
**PLAYER_COUNTERPLAY:** Stand on the portal approach; the boss cannot camp the gateway as if it were floor.  
**EDGE_CASES:** White sanctuary portal colocates with spawn (`placeWhitePortalAtSpawn`) — occupying it is a pack keep-clear rule, not a boss floor tile. Do not pack-copy wall-ignore.  
**IMPLEMENTATION_COMPLEXITY:** Low (tile map + tests).  
**TEST_SCENARIOS:** Portal at (8,8), boss at (8,7), player at (8,9) → `moveToward` dest ≠ (8,8). Cavalier jump tagged dest still applies.  
**STATUS:** PROPOSED

### AI-SYS-49

**AI_ID:** AI-SYS-49  
**NAME:** Choke/bottleneck keys match occupancy `${x},${y}`  
**ROLE:** system  
**SOPHISTICATION:** T1+ (authoring honesty for POS-05 / FUT-65 / FUT-68)  
**DECISION_RULES:** WX 6421–6463 iterates `_ri` as row (y) and `_ci` as column (x) and stores `` `${_ri},${_ci}` ``. Occupancy, `markedTilesRef` (3331), barriers, and `computeReachable` store `` `${x},${y}` ``. Before any module reads `mapChokePointsRef` / `mapBottleneckTilesRef`, rewrite inserts to `` `${_ci},${_ri}` `` (or store `{x,y}` objects). Do not attach FUT-65/FUT-68 to the live refs until the keys match. `ENEMY_AI_TIER_GATES.bottleneckControl` / `chokepointCamp` stay unread as integer gates.  
**SCORING_MODEL:** N/A (key space). Wrong-key dests are not enumerated.  
**SPELL_REQUIREMENTS:** None.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always (correctness).  
**ENEMY_ARCHETYPES:** tank, protector (consumers); all walkers (must not path using transposed walls).  
**PLAYER_COUNTERPLAY:** N/A (correctness).  
**EDGE_CASES:** A 16×16 board maps `(x=3,y=8)` under the bug to the cell the occupancy map calls `(8,3)`. Open-field maps with `_wn >= 6` still produce keys — they are just in the wrong space.  
**IMPLEMENTATION_COMPLEXITY:** Low (one template string + a lock test).  
**TEST_SCENARIOS:** Floor at (3,8) with six wall neighbors → choke set has `"3,8"`, not `"8,3"`. A POS-05 fixture that reads the ref after the fix occupies (3,8).  
**STATUS:** PROPOSED

### AI-SYS-50

**AI_ID:** AI-SYS-50  
**NAME:** Public Mirror token on the decide snapshot  
**ROLE:** system  
**SOPHISTICATION:** T4+ honesty (ADV-06 / FUT-34 companion)  
**DECISION_RULES:** Apply already consumes `mirrorUnitsRef` via `consumePlayerMirror` (WX 16496–16528; `playerMirror.ts` 18–21). Add a **read-only** boolean on `DecideEnemyContext` (e.g. `playerMirrorReady`) copied from `mirrorUnits.has(PLAYER_MIRROR_KEY)` at decide time. Decide must **not** delete the token. Pack and player-summon ctx both see it (public HUD / last-cast Mirror). Missing / hidden ⇒ `false`, module off — do not read unowned book ids. FUT-34’s “combatant effect named mirror” is not the live token; this snapshot is. SYS-10 may later fold it into `activeEffects`; until then the boolean is the legal source.  
**SCORING_MODEL:** FUT-67 uses the flag; without it the term is 0 (today’s behaviour).  
**SPELL_REQUIREMENTS:** None for the snapshot.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always (honesty of information). Scoring attach is FUT-67.  
**ENEMY_ARCHETYPES:** All damaging casters.  
**PLAYER_COUNTERPLAY:** Cast Mirror; they should be able to *see* it the same way the log will.  
**EDGE_CASES:** AoE / `hitsMultiple` already skip consume (16497–16498) — the flag may still be true; FUT-67 must not treat those ids as self-hits. Do not scan `upgradeSpell` for Mirror if it is not on the bar.  
**IMPLEMENTATION_COMPLEXITY:** Low.  
**TEST_SCENARIOS:** Token present → ctx flag true after decide, token still present. Token absent → flag false.  
**STATUS:** PROPOSED

### AI-SYS-51

**AI_ID:** AI-SYS-51  
**NAME:** Boss player snapshot uses live ATK  
**ROLE:** system  
**SOPHISTICATION:** T5 / honesty for the second brain  
**DECISION_RULES:** WX 15417 currently sets `atk: 10` on `playerCELike` while AP/MP/RES/SP copy `currentBattleAp` / `currentBattleMp` / `characterStats`. Copy visible ATK from the same HUD / `characterStats.atk` (or the initiative strip if that is the public surface — FUT-32). Dummy `10` must not become SYS-07’s silent budget. SYS-46 remains the **peer** row (`ap: 3`, `res: 0`, `sp: 0` at 15444–15448).  
**SCORING_MODEL:** Boss “can I survive a melee if I step adjacent?” uses real ATK, not 10.  
**SPELL_REQUIREMENTS:** None.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always when boss AI runs.  
**ENEMY_ARCHETYPES:** Boss walkers / melee phases.  
**PLAYER_COUNTERPLAY:** Buff ATK; the boss should respect the strip.  
**EDGE_CASES:** Missing field ⇒ 0, not 10 (SYS-07). Do not read queued click damage.  
**IMPLEMENTATION_COMPLEXITY:** Low.  
**TEST_SCENARIOS:** `characterStats.atk === 40` → player row ATK is 40. Missing ⇒ 0.  
**STATUS:** PROPOSED

### AI-SYS-52

**AI_ID:** AI-SYS-52  
**NAME:** Boss walk bounds use `WORLD_GRID_SIZE`  
**ROLE:** system  
**SOPHISTICATION:** T1+ / T5 honesty  
**DECISION_RULES:** `getWalkableMoves` (`useBossAI.ts` 74–77) currently clips with literals `16`. Pack `computeReachable` already uses `WORLD_GRID_SIZE` (`enemyAI.ts` 383; constant at `gameConstants.ts` 8, value 16). Share the constant. SYS-45’s aim≠walk contract is unchanged.  
**SCORING_MODEL:** Out-of-board dests are not enumerated.  
**SPELL_REQUIREMENTS:** None.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always.  
**ENEMY_ARCHETYPES:** All `useBossAI` walkers.  
**PLAYER_COUNTERPLAY:** N/A (correctness).  
**EDGE_CASES:** If a future map is not 16×16, bosses must not keep a private board. Occupied filter still uses bodies, not the constant.  
**IMPLEMENTATION_COMPLEXITY:** Low.  
**TEST_SCENARIOS:** Stub `WORLD_GRID_SIZE` conceptually: a dest at (16, 8) is illegal while the constant is 16; the helper must not have a second literal.  
**STATUS:** PROPOSED

### AI-SYS-53

**AI_ID:** AI-SYS-53  
**NAME:** Decide/apply player id is `"player"`; `"__player__"` stays an engine sentinel  
**ROLE:** system  
**SOPHISTICATION:** T1+ (SYS-13 boundary)  
**DECISION_RULES:** Pack snapshot pushes `{ id: "player", … }` (WX 16293–16301). `decideEnemyAction` filters `c.side === "player"` (1671–1672). Live `getCombatantAt` returns `"__player__"` (9334, 15119). `isPlayerHealTargetId` already accepts both (`challengeCompletion.ts` 239–240). Side-aware legality (SYS-13) and any enumerator that reads `getCombatantAt` must map `"__player__"` → `"player"` before scoring, so `targetId` / focus / Mirror token stay one string. Do not teach pack AI to emit `"__player__"`. Do not change `castHelpers` hit lists.  
**SCORING_MODEL:** Focus / Mirror / heal target comparisons use `"player"` only.  
**SPELL_REQUIREMENTS:** None.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always.  
**ENEMY_ARCHETYPES:** All.  
**PLAYER_COUNTERPLAY:** N/A (correctness).  
**EDGE_CASES:** Player-side summons keep their own ids. `hitsAllies` sentinels remain `"__player__"` inside `spellEngine`. Pack healers must not target `"player"` (allies are enemy-side — SYS-36).  
**IMPLEMENTATION_COMPLEXITY:** Low (adapter at the WX/SYS-13 boundary).  
**TEST_SCENARIOS:** Helper seeing `getCombatantAt` → `"__player__"` scores as id `"player"`. Pack `targetId` never equals `"__player__"`.  
**STATUS:** PROPOSED

---

## 4. T6+ reusable modules (2026-09-25)

Attach via parent §4 sigmoid. Stack; do not replace T0–T5 or FUT-01…65.

### AI-FUT-66

**AI_ID:** AI-FUT-66  
**NAME:** Step off a public marked tile  
**ROLE:** positioning  
**SOPHISTICATION:** T6 (POS-04 family; FUT-31 is the mark *spell*)  
**DECISION_RULES:** Player Mark writes `markedTilesRef` as `` `${x},${y}` `` (WX 3331–3335, 9404). The player’s next hit on that tile is ×2. That is **public** (the mark is on the board). Kiters/artillery/healers add `−wMark` to dests whose key is in the public set. Tanks/berserkers may invert (FUT-71 soak). Do not read flavour text; do not emit `spell-mark` (FUT-31 / FUT-22). Keys are occupancy x,y (SYS-49 does not apply to this ref — it is already x,y).  
**SCORING_MODEL:** `U(dest) -= wMark` if `markedTiles.has(key(dest))` and role is backline.  
**SPELL_REQUIREMENTS:** None for avoiding; applying Mark stays FUT-31.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.9` when any marked tile exists this fight. Never `if (level >= 40)`.  
**ENEMY_ARCHETYPES:** kiter, artillery, healer, summoner. Charger/berserker invert or ignore.  
**PLAYER_COUNTERPLAY:** Mark the only frost tile; they step off or eat ×2.  
**EDGE_CASES:** Empty set → term 0. Mark expires (3391–3392) → term 0 next decide. Do not peek the player’s queued click.  
**IMPLEMENTATION_COMPLEXITY:** Low after POS-04 weights exist.  
**TEST_SCENARIOS:** Bishop dest A marked, dest B equal range unmarked → B. Charger with invert may still occupy A.  
**STATUS:** PROPOSED

### AI-FUT-67

**AI_ID:** AI-FUT-67  
**NAME:** Do not suicide-cast into public Mirror  
**ROLE:** adaptive / spell contract  
**SOPHISTICATION:** T6 (ADV-06 / FUT-34 live token)  
**DECISION_RULES:** When SYS-50 `playerMirrorReady` is true, a single-target non-AoE damage/drain profile’s EV is **self-damage** (apply will `consumePlayerMirror` and hit the caster — WX 16496–16528). Prefer a legal physical id (FUT-08), a move, or skip. Do **not** consume the token at decide time. AoE / `hitsMultiple` already skip consume — those ids keep normal EV. Pack must **not** emit `COMBO_REPLAY` (FUT-34).  
**SCORING_MODEL:** `U(single-target spell) = U(self-hit at visRes)` when the flag is on; killableNow against the player is false for that id.  
**SPELL_REQUIREMENTS:** Damage/drain profiles; optional physical kit id.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 1.0` when the flag is on.  
**ENEMY_ARCHETYPES:** caster, artillery, generic. Berserker may accept the self-hit.  
**PLAYER_COUNTERPLAY:** Show Mirror; frost bishops hold or Strike if they have it.  
**EDGE_CASES:** Flag off → term 0. `hitsMultiple` frost-nova stays illegal until FUT-19 apply. Do not read hidden click buffer.  
**IMPLEMENTATION_COMPLEXITY:** Low after SYS-50.  
**TEST_SCENARIOS:** Mirror ready, kit frost + physical_attack, both legal → physical. Mirror ready, frost only, self-hit would drop the caster below 1 → skip/move.  
**STATUS:** PROPOSED

### AI-FUT-68

**AI_ID:** AI-FUT-68  
**NAME:** Public bottleneck camp (not `aiTier >= 8`)  
**ROLE:** positioning  
**SOPHISTICATION:** T6 (POS-05; sibling of FUT-65 portal choke)  
**DECISION_RULES:** After SYS-49, `mapBottleneckTilesRef` keys are occupancy `${x},${y}` for floor cells with exactly two cardinal floor neighbors (WX 6442–6455). Tank/protector dests that sit on such a cell **and** cut the player’s 4-dir paths to the ward from ≥2 to 1 score `+wBottleneck`. `ENEMY_AI_TIER_GATES.bottleneckControl = 8` (`gameConstants.ts` 207) is unread and is an integer gate — **do not** `if (aiTier >= 8)`. Artillery stays POS-01. Open field (`_cf !== 2`) → term 0.  
**SCORING_MODEL:** `+wBottleneck` if after the dest the player’s paths to the ward drop to 1, and dest ∈ bottleneck set.  
**SPELL_REQUIREMENTS:** None.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 1.0` plus a map that actually wrote bottleneck keys. Ratio-based.  
**ENEMY_ARCHETYPES:** tank, protector, charger.  
**PLAYER_COUNTERPLAY:** Attract the camper; Timestep off the two-neighbor cell.  
**EDGE_CASES:** Do not camp reserved portal cells (SYS-27 / SYS-48). Transposed keys before SYS-49 → module off (safer than camping a wall). Path-count cap 16.  
**IMPLEMENTATION_COMPLEXITY:** Medium (depends on SYS-49).  
**TEST_SCENARIOS:** Corridor cell with two cardinal floors; tank dest occupies it. `aiTier === 1` with the module attached still camps (eligibility is the sigmoid, not the integer).  
**STATUS:** PROPOSED

### AI-FUT-69

**AI_ID:** AI-FUT-69  
**NAME:** Visible Shield HP as overkill/spill input  
**ROLE:** target selection  
**SOPHISTICATION:** T6 (TGT-01 / SYS-19 companion)  
**DECISION_RULES:** Player Shield remaining is public (`shieldHpRef`, battle log at WX 16750–16761). Lethal lookahead and overkill spill must add **visible shield HP** to the HP that has to die this turn before `killableNow`. Do not peek shield if the HUD/log would not show it. Apply still absorbs then damages (SYS-19 is retarget, not splash).  
**SCORING_MODEL:** `killableNow = (visHp + visShield) <= mitigated EV` (non-crit, FUT-57). Spill uses the same sum.  
**SPELL_REQUIREMENTS:** Damage/drain.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.8` when shield HP > 0.  
**ENEMY_ARCHETYPES:** All damage roles.  
**PLAYER_COUNTERPLAY:** Keep 1 shield HP so a “kill” frost is not actually a kill.  
**EDGE_CASES:** Summon targets have no `shieldHpRef` (apply 16734–16736) — term 0 for those ids. Hidden shield ⇒ module off.  
**IMPLEMENTATION_COMPLEXITY:** Low after SYS-10.  
**TEST_SCENARIOS:** Player 10 HP, shield 20, frost EV 15 → not killableNow. Shield 0, HP 10, EV 15 → killableNow.  
**STATUS:** PROPOSED

### AI-FUT-70

**AI_ID:** AI-FUT-70  
**NAME:** Visible Frozen / ice on the player as MP  
**ROLE:** adaptive  
**SOPHISTICATION:** T6 (ADV-04 / FUT-59 sibling)  
**DECISION_RULES:** Player ice landing applies Frozen `modifier: -2` MP (WX 11457–11466 — public). ADV-04 / FUT-62 already read leftover AP. This module reads **visible Frozen** (initiative strip / effect icon) and treats player remaining MP as the post-Frozen value. Chargers may approach when visible MP cannot pay a retreat. Kiters hold if the player can still walk 1. Do not roll the ice HP; do not invent a longer freeze than apply. SYS-43 still bills **enemy** ice landings separately.  
**SCORING_MODEL:** `playerMpFrac` uses the public Frozen-modified MP. Unknown ⇒ module off.  
**SPELL_REQUIREMENTS:** None.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 1.0` when the Frozen icon is public.  
**ENEMY_ARCHETYPES:** charger, tank, kiter.  
**PLAYER_COUNTERPLAY:** End Turn on ice with 0 MP showing if you want them to collapse in.  
**EDGE_CASES:** Opening turn without ice → term 0. Do not read `isFrozenTerrain` map flag as “the player is Frozen.”  
**IMPLEMENTATION_COMPLEXITY:** Low after ADV-04 / SYS-10.  
**TEST_SCENARIOS:** Public Frozen, player MP 2 (would have been 4) → charger commit weight up. No icon → ADV-04 uses strip MP only.  
**STATUS:** PROPOSED

### AI-FUT-71

**AI_ID:** AI-FUT-71  
**NAME:** Protector soaks a public marked tile  
**ROLE:** protector / tank  
**SOPHISTICATION:** T6 (POS-07 / FUT-66 invert)  
**DECISION_RULES:** When a public marked tile (FUT-66) sits on the player’s path to the ward, a protector/tank with POS-07 may **occupy** that key so the ×2 hit lands on the tank instead of the ward. Requires SYS-04 role (not heal-first inference). Berserker may occupy without a ward. Artillery never soaks. Always 4-dir reachable / SYS-07 MP / SYS-48 no portal.  
**SCORING_MODEL:** `+wSoak` if dest ∈ marked set AND dest is on the threat→ward line AND role ∈ {tank, protector} AND own HP fraction > retreat line (unless berserker).  
**SPELL_REQUIREMENTS:** None.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 1.1` when a mark exists and a ward exists.  
**ENEMY_ARCHETYPES:** tank, protector; berserker invert without ward.  
**PLAYER_COUNTERPLAY:** Mark the tank’s soak tile; they still take ×2 — or Attract them off it.  
**EDGE_CASES:** Two marked tiles → occupy the one on the path, not both (POS-06 clustering). No ward → term 0 for protector.  
**IMPLEMENTATION_COMPLEXITY:** Medium (depends on FUT-66 + POS-07).  
**TEST_SCENARIOS:** Mark on (5,5) between player and wounded rook; protector dest is (5,5). Bishop with FUT-66 prefers not (5,5).  
**STATUS:** PROPOSED

---

## 5. Spell-awareness contract (reminder)

Unchanged: no profile + apply ⇒ not in kit. Do not feed `spellRangeBase` into AI (`targeting.ts` 128–137). `starter-heal` is self-only (`range: 0`). Ally heal needs a ranged heal id **and** apply `targetId` (SYS-05) **and** SYS-42 so a failed heal cannot Crush the ward. Heal pickers must not use `healAmount` (SYS-38). Inferno needs SYS-39 before any kit emits it. Mirror stays `usableByEnemy: false` until a profile **and** SYS-50 exist — FUT-67 reads the **player** token, it does not give enemies the spell.

Still `usableByEnemy: true` without a working decide+apply pair (do not give these to AI until profiled):

`spell-swap`, `spell-mark`, `spell-sacrifice`, `spell-lifesteal-nova`, `spell-enrage`, `spell-haste`, `spell-weaken`, `spell-expose`, `spell-drain-courage`, `spell-cursed-wound`, `spell-shadow-veil`, `spell-frost-nova`, `spell-inferno` (DoT `damage: 0`), `starter-poison` / `spell-venom-strike`, `starter-shield` / `spell-iron-skin`, `starter-drain` (as a **heal**).

Keep `usableByEnemy: false` until profiled: barrier, mirror, timestep, rallying-cry, sentinel/bomber/wisp summons.

New mechanics still define a `SpellScoreProfile` before `usableByEnemy` flips true.

---

## 6. Implementation order (this increment)

1. P0 **AEE-2026-08-31-002** (Fire Bolt WX **16710–16715**, AP/MP debit, ally heal WX **16648**, FUT-41 pairing, **SYS-42** so failed heals cannot bolt the ward).  
2. 09-21 SYS-22…32 (healer LoS, kit CD, summon occupied, resource plan, family `aiTier`, focus prepend).  
3. 09-22 SYS-33…35 (summon side counts, live player tile / #495, SP in EV).  
4. 09-23 SYS-36…41 (pack side counts, numeric RES, drain-as-heal, Inferno apply, summon dest, rally role).  
5. 09-24 SYS-42…47 (opponent-only fallback, dest-commit hazards, per-side focus, boss aim, boss peer stats, apply LoS).  
6. SYS-48, SYS-49, SYS-50, SYS-51, SYS-52, SYS-53 (this file).  
7. Parent T2–T5 roles / team / adaptive. FUT-66/71 with POS-07; FUT-67 with SYS-50; FUT-68 with SYS-49 / POS-05; FUT-69 with SYS-19; FUT-70 with ADV-04.

Each slice: `engine/enemyAI*.test.ts`, zero WX drive-by, no RAF / map gen / turn order / damage-formula edits.

---

## 7. Extra test scenarios

| ID | Setup | Expect |
| :--- | :--- | :--- |
| TS-BOSSPORT | Portal (8,8), boss (8,7), player (8,9) | Boss dest ≠ portal (SYS-48). |
| TS-CHOKEY | Floor (3,8) six wall neighbors | Choke key `"3,8"` (SYS-49). |
| TS-MIRSNAP | `PLAYER_MIRROR_KEY` in the set | Decide flag true; token still present (SYS-50). |
| TS-BOSSATK | Player ATK 40 | Boss player row ATK 40, not 10 (SYS-51). |
| TS-BOSS16 | `getWalkableMoves` | Bounds read `WORLD_GRID_SIZE` (SYS-52). |
| TS-PID | `getCombatantAt` → `"__player__"` | Enumerator id `"player"` (SYS-53). |
| TS-MARKSTEP | Bishop, dest A marked | Prefers unmarked equal-range dest (FUT-66). |
| TS-NOFROST | Mirror ready, frost only, lethal self-hit | Skip/move (FUT-67). |
| TS-BNCAMP | Two-neighbor corridor cell | Tank occupies it without `aiTier >= 8` (FUT-68). |
| TS-SHIELDK | 10 HP + 20 shield, EV 15 | not killableNow (FUT-69). |
| TS-FROZMP | Public Frozen, strip MP 2 | Charger commit weight up (FUT-70). |
| TS-SOAK | Mark on threat→ward line | Protector dest is the mark (FUT-71). |

09-21…09-24 TS-* rows still apply. Geometry tests cover caster LoS only.

---

## 8. Mapping (new gaps → ids)

| Request / gap | Primary AI_ID |
| :--- | :--- |
| Boss walks portal-as-floor | AI-SYS-48 |
| Choke/bottleneck `${row},${col}` vs occupancy `${x},${y}` | AI-SYS-49 |
| Mirror token invisible to decide | AI-SYS-50 |
| Boss player `atk: 10` dummy | AI-SYS-51 |
| `getWalkableMoves` literal 16 | AI-SYS-52 |
| `"__player__"` vs `"player"` | AI-SYS-53 |
| Step off public Mark | AI-FUT-66 |
| Don’t frost into public Mirror | AI-FUT-67 |
| Bottleneck camp (not `aiTier >= 8`) | AI-FUT-68 |
| Visible Shield HP in killableNow | AI-FUT-69 |
| Visible Frozen as player MP | AI-FUT-70 |
| Protector soaks the marked tile | AI-FUT-71 |

Parent §19 still maps the original capability list onto POS / TGT / RES / ROL / TEM / ADV. Nothing in that list is implemented. Higher-level enemies still get harder from **modules on the sigmoid**, not from `computeAITier(enemyLevel)`.

Requested capability → already-catalogued parent id (unchanged; still **PROPOSED**):

| Request | Parent id |
| :--- | :--- |
| maintain optimal range / retreat / approach vulnerable / avoid hazards / exploit terrain / avoid AoE clustering / protect allies / escape routes | POS-01…08 |
| low-HP / high-threat / support / summons / resistance / kill / strategic | TGT-01…07 |
| AP combinations / move-then-attack / attack-then-retreat / sequencing / cooldown / waste | RES-01…06 |
| tank … protector | ROL-01…10 |
| focus fire / protect support / exploit debuffs / avoid duplicate debuffs / coordinated AoE / formations / retreat toward support | TEM-01…07 |
| estimate threat / punish positioning / adapt HP / adapt AP-MP / summons / status / own HP / survival vs aggression | ADV-01…08 |

This increment adds apply/second-brain honesty (SYS-48…53) so those modules cannot cheat when they attach, plus T6 scorers (FUT-66…71) that keep appearing as relative difficulty rises.

Every row above is **STATUS: PROPOSED**. No production AI in this change.
