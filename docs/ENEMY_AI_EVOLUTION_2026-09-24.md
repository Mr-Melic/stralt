# Advanced Enemy AI Evolution — 2026-09-24 increment

**Status:** PROPOSED (design only; no production code in this change)  
**Date:** 2026-09-24  
**Parent catalog:** [`ENEMY_AI_EVOLUTION.md`](./ENEMY_AI_EVOLUTION.md) (T0–T5)  
**Prior increments:** [`ENEMY_AI_EVOLUTION_2026-09-01.md`](./ENEMY_AI_EVOLUTION_2026-09-01.md) · [`ENEMY_AI_EVOLUTION_2026-09-02.md`](./ENEMY_AI_EVOLUTION_2026-09-02.md) · [`ENEMY_AI_EVOLUTION_2026-09-21.md`](./ENEMY_AI_EVOLUTION_2026-09-21.md) (open PR #351; SYS-22…32, FUT-36…47 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-22.md`](./ENEMY_AI_EVOLUTION_2026-09-22.md) (open PR #416; SYS-33…35, FUT-48…53 — **do not re-number**) · [`ENEMY_AI_EVOLUTION_2026-09-23.md`](./ENEMY_AI_EVOLUTION_2026-09-23.md) (open PR #458; SYS-36…41, FUT-54…59 — **do not re-number**)  
**Implementer ledger:** [`automation/ACTION_IDS_AEE_2026-09-24.md`](./automation/ACTION_IDS_AEE_2026-09-24.md)

This increment re-reads the live engine one day after the 2026-09-23 catalog. SYS-01…41 and FUT-01…59 stay **PROPOSED** on their own files; they are **not** re-filed here. New work is: apply-layer ally-fire, dest-commit hazard skip, shared focus ref, boss dummy snapshot, apply LoS after dest-commit, and T6+ scorers that keep attaching as relative difficulty rises.

Stralt has **no character level cap**. Nothing here maps `if (level >= X) sophistication = Y`. Tiers remain conceptual. Eligibility remains the parent §4 sigmoid (`peer = log2(enemy.level / player.level)` plus pack/boss/modifier terms). A year-later peer fight at any absolute level can attach a new module without raising a cap.

**Hard rules (unchanged):** no cheat, no hidden player information, no ignored LoS/range/AP/MP, no unbounded search, no kit-less Fire Bolt, no `instantKill`, no betrayal-as-difficulty, no name-based spell heuristics, no production AI in this change.

Open production PRs that already slice honesty this catalog filed earlier (do **not** re-file the ids):

| Open PR | Catalog id | What it changes |
| :--- | :--- | :--- |
| [#495](https://github.com/Mr-Melic/stralt/pull/495) (draft) | AI-SYS-34 | Apply `targetCell` from `playerPositionRef` via `enemyApplyTargetCell`. Not on this checkout. |
| [#498](https://github.com/Mr-Melic/stralt/pull/498) (draft) | AI-SYS-45 (this file) | Boss kit-spell apply must not commit `targetX/Y` as a walk dest. Not on this checkout. |

---

## 1. Re-read (2026-09-24)

All line numbers are from this checkout. Re-read them before implementing.

### 1.1 Combat-parity still is not sophistication

Unchanged from 2026-09-21…23: `enemyCastGeometryOk` (`targeting.ts` 166–177), `aiCanCast` (`enemyAI.ts` 320–332), Frozen walk *rate* (`enemyWalkMp.ts` 21–29), `playerCastPlan.ts` (player only), summon leftover-AP `reevaluate` (WX 15257–15276). These are **not** SYS-05 / SYS-13 / SYS-01.

`aiCanCast` is still unused by healer (1099–1100) and guardian (2131–2133). That remains **AI-SYS-23** on the 09-21 increment.

`enemyAI.ts` still has **zero** reads of `currentAp`, `currentMp`, or `apCost` (confirmed 2026-09-24 grep).

Pack `prevEnemies` is `getLiveCombatants(combatantStoreCtx)` (WX **15481**) at the start of each enemy turn, so a prior dest-commit is visible to the **next** actor. That is not a new occupancy bug. Dest-commit still does not pay walk hazards (SYS-43).

### 1.2 Line numbers vs 2026-09-23 (WX barely moved)

| Fact | 2026-09-23 | Live (2026-09-24) |
| :--- | :--- | :--- |
| `computeAITier` | `combatMath.ts` 36–52 | **unchanged** |
| Spawn `aiTier` | WX 5823 | **5823** |
| Family second `computeAITier` | WX 5864–5866 | **5865** |
| Kit `levelZone` object | WX 11920 | **11920** |
| Summoner chance unbounded | WX 11932–11943 | **11932–11943** |
| Summon empty occupied | WX 15156 | **15156** |
| Summon `allyCount` hardcoded player | WX 15175–15176 | **15175–15176** |
| Summon `reevaluate` | WX 15257–15276 | **15257–15276** |
| Shared `focusTargetRef` | (not called out) | summon **15190–15196**; pack **16352–16358** (SYS-44) |
| Erratic `aiTier >= 5` | WX 15507 | **15507–15591** |
| Betrayal `aiTier >= 10` | WX 15594 | **15594–15609+** |
| Boss dummy AP/MP/RES | (not called out) | WX **15444–15448** `ap: 3, mp: 3, res: 0` (SYS-46) |
| Pack snapshot | WX 16273–16302 | **16273–16302** |
| Pack `allyCount` | WX 16338–16342 | **16338–16342** |
| Dest-commit clamp only | WX 16416–16423 | **16416–16423**; helper `battleSetup.ts` **394–406** |
| Apply Chebyshev only (no LoS) | WX 16450–16456 | **16450–16456** (SYS-47) |
| `resolvedTarget` / `isSummonTarget` | WX 16432–16439 | **16432–16439** (SYS-42) |
| Apply SP then RES | WX 16475–16537 | **16475–16537** |
| Paper Windstorm 50% miss | (parent FUT-21) | **16491–16495** kit; **16729–16732** Fire Bolt |
| Self-heal `range === 0` | WX 16648 | **16648** |
| Fire Bolt `e-firebolt` | WX 16710–16715 | **16710–16715** |
| `decideEnemyAction` | 1662–1707 | **1662–1707** |
| `pickBossKitSpell` `new Map()` | `useBossAI.ts` 169–173 | **unchanged**; comment 34–36 still says empty Map on purpose |
| Player lava / ice / spikes on walk | (not called out) | WX **11424–11483** — enemy dest-commit never calls this (SYS-43) |
| `isTileCastableLive` ally = player summon | `targeting.ts` 527–544 | **527–544** |

P0 remains **AEE-2026-08-31-002** (Fire Bolt / apply honesty) then **AEE-2026-08-31-001** (`computeAITier`). Next 09-21 honesty: **AEE-2026-09-21-002** / **004**. Next 09-22: **AEE-2026-09-22-002** / **003**. Next 09-23: **AEE-2026-09-23-001…005**. Then this file’s SYS-42…47. Do not start FUT-60+ first.

### 1.3 Still true — do not re-file (parent / 09-21 / 09-22 / 09-23)

- Zone-0 kits forever (`Math.floor(levelZone)` on an object). SYS-09.
- `scoreTargets` ignores `focusTargetId`. SYS-08 / AI-SYS-30.
- `estimateDamage` returns 0 when `spell.damage <= 0`. SYS-02 / SYS-39.
- Heal-first `inferArchetype` (447–452). SYS-04 / SYS-41.
- Hazard avoid only below 50% HP (425–441). POS-04 / FUT-09 / FUT-59.
- Retreat `kind: "skip"` while moving. POS-02 / FUT-41.
- Summoner chance hits 1.0 at player level 44. FUT-23.
- `ENEMY_AI_TIER_GATES` unread. SYS-01.
- Summon executor Chebyshev teleport MP. SYS-15 / 09-21 SYS-25.
- Family overlay second `computeAITier`. AI-SYS-29.
- `findKitSpell` assigned fallback (1741–1745). AI-SYS-32.
- `getEffectiveStat` is `getStatModifier`. AI-SYS-37.
- Summon / pack `allyCount` wrong. AI-SYS-33 / AI-SYS-36.
- Apply `playerPosition` not ref. AI-SYS-34 (open #495).
- Drain-as-heal picker. AI-SYS-38.
- Inferno DoT nested under `damage > 0`. AI-SYS-39.
- Summoner spawn short-circuit. AI-SYS-40.
- Hidden crit in EV. AI-FUT-57.
- Parent FUT-21 (Paper Windstorm expected miss) is still a one-line stub; live apply is 50% at WX **16491**. Do not allocate FUT-60 to it — complete FUT-21 after SYS-05.

`engine/summonAI.ts` `runSummonAI` remains unused.

### 1.4 New honesty gaps (this increment)

1. **Failed ally `targetId` falls through to Crush / Fire Bolt the ward.** `decideHealer` (1103–1112) emits `kind: "cast"`, `targetId: wounded.id` (an enemy-side ally). Apply resolves any non-`"player"` id through `prevEnemies.find` (16432–16438) and sets `isSummonTarget = !!resolvedTarget` (16439). Ally heal only applies when `spellType === "heal" && spellRange === 0` (16648) — `starter-heal` is self-only, so an ally-targeted heal **misses**. Then `if (action.kind === "melee" || !didAct)` (16704) with `nd <= 1` rolls Crush **or** kit-less Fire Bolt (16710–16715) via `enemyTakesDamage` on that ally. Guardian shield (2136–2144) has the same `targetId` shape and no pack buff apply branch. SYS-38 stops drain-as-heal; it does not stop a *failed real heal/buff* from executing the ward. SYS-42.

2. **Dest-commit is clamp-only; enemies skip public walk hazards.** `enemyDestToCommit` (`battleSetup.ts` 394–406) returns `{x,y}` or null. WX 16421–16423 `updateCombatant`s the sprite. Player walks pay thorn/rift via `battleWalkHazardDamages` (`battleSetup.ts` 317–329, WX 9906–9932) and lava 8–15 / ice Frozen / spikes 5–10 at WX **11424–11483**. `computeReachable` does **not** exclude lava/spikes; `filterHazardCandidates` only runs on retreat when HP < 50%. A full-HP bishop can dest-commit onto lava for **0** HP. That is a cheat, not a tactic. Decide EV (POS-04 / FUT-59) is separate: apply must still roll the public effect. SYS-43. Erratic `updateCombatant` at 15590 has the same hole.

3. **`focusTargetRef` is shared across sides.** Player-summon ctx (15190–15196) and pack ctx (16352–16358) read and write the same ref. `findHealerSummon` (897–905) prepends a player wisp for pack (1682–1690). When SYS-08 starts *reading* `focusTargetId`, a player-controlled hunter that `setFocusTargetId`s an enemy id makes the pack “focus” an ally; a pack setter makes a player wisp focus the player. TEM-01 requires a **per-side** blackboard. SYS-44.

4. **Boss kit `targetX/Y` is the aim tile, then apply walks there.** `useBossAI.ts` kit casts set `targetX: player?.x` (e.g. 179, 257, 329). WX boss apply treats that as a dest (same pattern #498 describes): the boss teleports onto the player (same-cell occupancy, free melee). `pickBossKitSpell` still receives `new Map()` (comment 34–36). SYS-16 was kit legality / Final Pawn bolt / wall-jump tagging. This is a distinct apply contract: aim ≠ walk. Open #498 is the apply lock (`bossKitSpellPositionToCommit` returns no dest). Catalog it so later T5 modules do not “sophisticate” by walking onto the player. SYS-45.

5. **Boss `CombatantEntryLike` snapshot is dummy stats.** WX 15444–15448: `ap: 3, mp: 3, atk: 10, res: 0, sp: 0` for every non-self enemy row fed to boss AI. Live AP/MP/RES/SP on those combatants are ignored. After SYS-07 / SYS-10, a boss that plans around “everyone has 3 MP and 0 RES” is either a cheat walk or a wasted reposition. SYS-21 was minion spawn `ap: 0`. This is the boss brain’s peer snapshot. SYS-46.

6. **Apply never re-checks LoS from the dest-commit origin.** Decide caster/generic use `aiCanCast` / `findNearestLegalCastTile`. Apply range is Chebyshev `distAM <= Number(chosenSpell.range)` only (16450–16456). `closes-in` (1618–1626) returns `kind: "cast"` from a dest tile; apply measures from `newX/newY` without `enemyCastGeometryOk`. A dest that lost LoS (barrier placed, or SYS-34 stale player tile) still deals damage, or fails and Fire-Bolts (FUT-41). SYS-13 was the helper; this is the apply call site. SYS-47.

### 1.5 Tests

`enemyAI.charger.test.ts`, `enemyAI.geometry.test.ts`, `enemyAI.walkMp.test.ts` exist. Honesty (Fire Bolt, ally-heal fallback, dest-commit lava, shared focus, boss dummy AP, apply LoS) still has no decide/apply-layer tests. Do not treat geometry/walkMp as SYS-05 or SYS-42.

### 1.6 What this increment does **not** change

Do not implement FUT-60+ before P0 honesty + 09-21 SYS-22…32 + 09-22 SYS-33…35 + 09-23 SYS-36…41. Do not start T6 spread/choke before SYS-05 / SYS-23 / SYS-42 / SYS-43 / SYS-47.

Do not touch RAF, map generation, turn order, or damage formulas to “make AI feel harder.” Do not copy #495 / #498 helpers into this docs-only change.

---

## 2. Design additions (normative)

1. **Do not recycle 09-21…09-23 ids.** SYS-22…32 / FUT-36…47 belong to PR #351. SYS-33…35 / FUT-48…53 belong to PR #416. SYS-36…41 / FUT-54…59 belong to PR #458. This file starts at SYS-42 / FUT-60.
2. **Fallback melee / kit-less bolt is opponent-only.** `resolvedTarget` is an opponent (player or player-side summon) or the action is not a fallback. Same-side ids never enter `enemyTakesDamage` except the existing betrayal spectacle (not a tactic).
3. **Dest-commit is a walk.** It pays the same public thorn/rift/lava/ice/spikes the player walk pays, using the shared helpers (`battleWalkHazardDamages` + the lava/ice/spikes block). Expected EV at decide time must not read the HP roll.
4. **Focus blackboard is per side.** Player-summon decide and pack decide do not share `focusTargetRef`.
5. **Boss kit aim is not locomotion.** `targetX/Y` on a kit cast is the spell dest. Walk dest is `newBossPosition` from a tagged ability only.
6. **Boss (and pack) snapshots use live visible stats.** Dummy `ap: 3` is SYS-07’s silent budget-3 cheat in a second brain.
7. **Apply re-checks the acting side’s geometry from the committed origin.** Illegal ⇒ no damage and no Fire Bolt.
8. **T6+ still stacks** on the parent enumerator. No integer tier table.

---

## 3. System proposals (2026-09-24)

### AI-SYS-42

**AI_ID:** AI-SYS-42  
**NAME:** Fallback strike is opponent-only  
**ROLE:** system  
**SOPHISTICATION:** all (SYS-05 / FUT-41 companion)  
**DECISION_RULES:** WX 16704–16715 currently runs Crush / `e-firebolt` whenever `kind === "melee" || !didAct` and Chebyshev `nd <= 1` to `targetCell`. `targetCell` is `resolvedTarget.{x,y}` when `action.targetId !== "player"` (16432–16438), including **allied** pieces chosen by `decideHealer` (1107) or guardian shield (2142). After this module: (1) if `kind === "cast"` failed, do not invent `e-firebolt`; (2) leftover melee is legal only when the resolved id is an opponent (`side === "player"`); (3) same-side `targetId` + failed heal/buff ⇒ `kind: "skip"` with destination = origin (FUT-55), never `enemyTakesDamage` the ward. SYS-38 remains the picker rule (`spellType === "heal"`).  
**SCORING_MODEL:** Friendly-fire fallback ⇒ −∞ (dropped).  
**SPELL_REQUIREMENTS:** None for the forbid; heal/buff still need SYS-05 apply `targetId`.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always.  
**ENEMY_ARCHETYPES:** healer, guardian, any kit that can set an ally `targetId`.  
**PLAYER_COUNTERPLAY:** Stand next to a wisp without eating a kit-less bolt that was aimed at the rook.  
**EDGE_CASES:** Player-side summon `targetId` is an opponent for pack AI — fallback melee vs a wisp stays legal if adjacent and the kit has `physical_attack`. Betrayal (`aiTier >= 10`, 15594+) stays spectacle; do not reuse this path.  
**IMPLEMENTATION_COMPLEXITY:** Low (apply branch + tests).  
**TEST_SCENARIOS:** Healer, wounded rook adjacent, `starter-heal` range 0 → no Crush/Fire Bolt on the rook. Guardian shield, no buff apply → no bolt on the ward.  
**STATUS:** PROPOSED

### AI-SYS-43

**AI_ID:** AI-SYS-43  
**NAME:** Dest-commit pays public walk hazards  
**ROLE:** system  
**SOPHISTICATION:** T1+ (POS-04 apply honesty)  
**DECISION_RULES:** After `enemyDestToCommit` (`battleSetup.ts` 394–406) returns a dest, apply the same public walk effects the player already pays: `battleWalkHazardDamages` for thorn/rift (path length = 4-dir cost from SYS-15, not Chebyshev teleport); lava / ice Frozen / spikes from the WX **11424–11483** rules on the **landing** cell (FUT-59 slip dest if ice slides). Erratic dest at 15590 uses the same helper. Decide still may refuse the dest (POS-04) using **expected** cost — lava’s 8–15 and spikes’ 5–10 rolls are not known at decide time (same class as FUT-57 crit). Missing HP field ⇒ 0 walk this turn (SYS-07), not a free lava stride.  
**SCORING_MODEL:** Landing on lava/spikes/thorn is a cost term; illegal/void landing is dropped.  
**SPELL_REQUIREMENTS:** None.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always.  
**ENEMY_ARCHETYPES:** All walkers.  
**PLAYER_COUNTERPLAY:** Kite across lava; they burn too.  
**EDGE_CASES:** Ice Frozen is `modifier: -2` MP on the **player** today (11457–11466). Enemy landing must apply the same public ice effect to **that combatant**, not to the player. Do not invent a longer slide than the player helper. Berserker may accept the cost (POS-04 override).  
**IMPLEMENTATION_COMPLEXITY:** Medium (extract a side-parameterised walk-hazard helper; do not fork the 8–15 formula).  
**TEST_SCENARIOS:** Bishop dest-commit onto lava → HP drops in the public range; no Fire Bolt from the failed cast. Ice landing applies Frozen to the bishop.  
**STATUS:** PROPOSED

### AI-SYS-44

**AI_ID:** AI-SYS-44  
**NAME:** Per-side focus blackboard  
**ROLE:** system  
**SOPHISTICATION:** T3 (TEM-01 honesty)  
**DECISION_RULES:** WX summon ctx (15190–15196) and pack ctx (16352–16358) currently share `focusTargetRef` / `focusTurnRef`. Split into `packFocusTargetRef` and `playerSummonFocusTargetRef` (or a `Map<side, id>`). Pack `setFocusTargetId` only writes pack focus; summon decide only writes its side. `scoreTargets` consumption remains SYS-08 / SYS-30. `findHealerSummon` prepend (1682–1690) is not a reader of focus — do not treat prepend as TEM-01.  
**SCORING_MODEL:** Pack `wFocus` only when `c.id === packFocus`. Player-summon `wFocus` only when `c.id === playerSummonFocus`.  
**SPELL_REQUIREMENTS:** Damage / DoT / drain profiles.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Same as TEM-01 (`mu ≈ 0.3`). Split is always-on honesty.  
**ENEMY_ARCHETYPES:** All non-healer-primary pack actors; player-side hunter/archer.  
**PLAYER_COUNTERPLAY:** Peel the pack’s focus; your wisp’s hunt target is independent.  
**EDGE_CASES:** Focus dies → clear that side only. Do not read hidden click-intent.  
**IMPLEMENTATION_COMPLEXITY:** Low.  
**TEST_SCENARIOS:** Pack charger sets focus `player`; player hunter `setFocusTargetId(enemyRook)` → pack still focuses `player`.  
**STATUS:** PROPOSED

### AI-SYS-45

**AI_ID:** AI-SYS-45  
**NAME:** Boss kit aim is not a walk dest  
**ROLE:** system  
**SOPHISTICATION:** T5 (SYS-16 companion)  
**DECISION_RULES:** Kit-cast `targetX/Y` (`useBossAI.ts` 179, 257, 329, …) is the **spell aim**. Apply must not `updateCombatant` the boss onto that tile. Walk dest is only `abilityResult.newBossPosition` from a tagged `BossAbility` (Cavalier jump, teleport). Open PR #498 is the apply-side lock; this catalog row is the decide contract so T5 enumerator overlay (FUT-20) cannot emit “walk to player tile” as kit sophistication. `pickBossKitSpell` still needs the live cooldown map (AEE-2026-09-01-008). Grid size is `WORLD_GRID_SIZE` (16 today, `gameConstants.ts` 8) — `getWalkableMoves` hardcodes 16 (58–80); if the constant ever changes, share it.  
**SCORING_MODEL:** Aim tile EV is a cast, not a dest. Occupying the player tile ⇒ −∞ unless a tagged ability says so with UI copy.  
**SPELL_REQUIREMENTS:** Boss kit ids already in the phase pool.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always for bosses.  
**ENEMY_ARCHETYPES:** All `useBossAI` kit casters.  
**PLAYER_COUNTERPLAY:** Standing on a tile does not teleport the boss onto you.  
**EDGE_CASES:** `KNIGHT_JUMP_IGNORE_WALLS` stays Cavalier-only. Do not pack-copy wall-ignore.  
**IMPLEMENTATION_COMPLEXITY:** Low (apply lock; #498).  
**TEST_SCENARIOS:** Kit frost, player at (8,8), boss at (4,4) → boss stays (4,4) after the cast. Jump ability still lands on `newBossPosition`.  
**STATUS:** PROPOSED

### AI-SYS-46

**AI_ID:** AI-SYS-46  
**NAME:** Boss peer snapshot is live AP/MP/RES/SP  
**ROLE:** system  
**SOPHISTICATION:** T5 / honesty for all second brains  
**DECISION_RULES:** WX 15444–15448 currently builds `enemiesForBossAI` with `ap: 3, mp: 3, atk: 10, res: 0, sp: 0`. Copy visible fields from `getLiveCombatants` / `characterStats` the same way pack SYS-10 / SYS-37 require. Dummy `3` must not become SYS-07’s silent walk budget. Player row already copies live AP/MP (15415–15416) — enemy rows must match that honesty.  
**SCORING_MODEL:** Boss reposition / kit range uses real remaining MP, not 3.  
**SPELL_REQUIREMENTS:** None.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always when boss AI runs.  
**ENEMY_ARCHETYPES:** Boss + visible minions.  
**PLAYER_COUNTERPLAY:** MP-burn on minions actually shortens the boss’s assumed walks.  
**EDGE_CASES:** Missing field ⇒ 0, not 3 (SYS-07 / SYS-21). Do not read hidden queued player input.  
**IMPLEMENTATION_COMPLEXITY:** Low.  
**TEST_SCENARIOS:** Minion `currentMp === 1` in the store → boss AI reachable for that minion is 1, not 3. Minion RES 40 → EV uses 40, not 0.  
**STATUS:** PROPOSED

### AI-SYS-47

**AI_ID:** AI-SYS-47  
**NAME:** Apply geometry from dest-commit origin  
**ROLE:** system  
**SOPHISTICATION:** T1+ (SYS-13 apply call site)  
**DECISION_RULES:** After dest-commit, a `kind: "cast"` is legal only if `enemyCastGeometryOk` (`targeting.ts` 166–177) accepts `(origin: {newX,newY}, target: live target cell, spell, hasLoS)`. Chebyshev-only `distAM <= Number(range)` (WX 16450–16456) is not enough. Failed geometry ⇒ no damage, no DoT write, no Fire Bolt (SYS-42 / FUT-41). `closes-in` (enemyAI.ts 1618–1626) relies on this re-check. Side policy stays `lineOfSight !== false` for enemies; do not switch to player opt-in LoS.  
**SCORING_MODEL:** Illegal dest ⇒ action dropped at apply (decide should not have emitted it).  
**SPELL_REQUIREMENTS:** Any cast.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Always.  
**ENEMY_ARCHETYPES:** caster, generic, artillery.  
**PLAYER_COUNTERPLAY:** Break LoS after they step; the frost does not ignore the wall.  
**EDGE_CASES:** `lineOfSight === false` kit ids still skip LoS. `minRange` / linear / `freeCells` remain SYS-06 / SYS-13 — this row is the WX call. Target cell is SYS-34 / #495.  
**IMPLEMENTATION_COMPLEXITY:** Low after SYS-13 helper exists.  
**TEST_SCENARIOS:** `closes-in` dest has range but a barrier blocks LoS → no damage, no `e-firebolt`. Frost `lineOfSight === false` still lands.  
**STATUS:** PROPOSED

---

## 4. T6+ reusable modules (2026-09-24)

Attach via parent §4 sigmoid. Stack; do not replace T0–T5 or FUT-01…59.

### AI-FUT-60

**AI_ID:** AI-FUT-60  
**NAME:** Spread vs visible player-side blast radius  
**ROLE:** positioning / team  
**SOPHISTICATION:** T6 (POS-06 vs a public bomber)  
**DECISION_RULES:** When a **player-side** combatant has `summonAI === "bomber"` (or `"kamikaze"` alias) and is alive, pack dests that would sit inside `AI_KAMIKAZE_BLAST_RADIUS` of that unit score `−wCluster`. Uses the tagged bomber radius (FUT-58: do **not** read pack Inferno as blast 2). Nova/`hitsMultiple` only if those ids are profiled and on the **visible** player bar (parent §2: bar, not owned book). No hidden queued player cast.  
**SCORING_MODEL:** `U -= wCluster * count(allies in radius)` if a visible bomber is in range of that cluster.  
**SPELL_REQUIREMENTS:** None for bomber-tag; nova requires `hitsMultiple` / `areaRadius` metadata.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 1.0`, low `pMin`. Ratio-based; never `if (level >= 80)`.  
**ENEMY_ARCHETYPES:** artillery, healer, summoner (backline). Chargers may invert (stay in melee).  
**PLAYER_COUNTERPLAY:** Walk the bomber in; they spread or eat the blast.  
**EDGE_CASES:** No player bomber → term 0. Enemy bomber uses TEM-05 / FUT-58, not this module.  
**IMPLEMENTATION_COMPLEXITY:** Low after POS-06 weights exist.  
**TEST_SCENARIOS:** Player bomber at (5,5), two bishops at (5,6) and (6,5); T6 pack prefers dests outside radius 2.  
**STATUS:** PROPOSED

### AI-FUT-61

**AI_ID:** AI-FUT-61  
**NAME:** Public opponent cooldown window  
**ROLE:** adaptive  
**SOPHISTICATION:** T6 (ADV-04 / ADV-01 companion)  
**DECISION_RULES:** Read remaining CD on spells **showing on the player’s visible battle bar** (the same slots the HUD renders). If the player’s only in-range damage id is on CD, tanks/chargers may approach (ROL-01 / ROL-02). If a visible control id is ready, kiters hold POS-01. Never scan `upgradeSpell` arrays or unowned book ids. Unknown / hidden ⇒ module off (parent ADV-04 edge).  
**SCORING_MODEL:** `+wApproach * (1 - visibleReadyDamage)` for tank; `+wHold` for kiter when a visible frost is ready.  
**SPELL_REQUIREMENTS:** None.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 1.1`.  
**ENEMY_ARCHETYPES:** tank, charger, kiter, controller.  
**PLAYER_COUNTERPLAY:** Keep a second bar slot ready; hide nothing — the bar is public.  
**EDGE_CASES:** Empty bar (tutorial) → term 0. Do not read enemy CD maps as “player CD.”  
**IMPLEMENTATION_COMPLEXITY:** Medium (pass visible slot ids + remaining CD into ctx, not the full pool).  
**TEST_SCENARIOS:** Bar shows frost remaining 2 turns, no other damage slot → charger `canReach` commits. Frost ready → kiter stays at range.  
**STATUS:** PROPOSED

### AI-FUT-62

**AI_ID:** AI-FUT-62  
**NAME:** Leftover public AP aggression  
**ROLE:** adaptive  
**SOPHISTICATION:** T6 (weight on ADV-04)  
**DECISION_RULES:** Initiative strip / last turn-end AP is public (`currentBattleAp` already copied into boss player row at 15415). If the player **ended** the previous player turn with leftover AP > 0 (skip / End Turn), T6 chargers treat them as still dangerous (do **not** walk to dist 1). If leftover AP is 0, tanks may occupy the choke (POS-05). Values are the strip at **turn start**, not predicted spends, not hover.  
**SCORING_MODEL:** `tankApproach *= (1 - playerApFrac)` already ADV-04; this module adds `−wPunishSkip` when leftover AP was 0 and the player skipped, inverted to `+wRespect` when leftover AP > 0.  
**SPELL_REQUIREMENTS:** None.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 1.0`. Honesty of the snapshot is SYS-10.  
**ENEMY_ARCHETYPES:** tank, charger, kiter.  
**PLAYER_COUNTERPLAY:** End Turn with 1 AP showing if you want them to respect the bar.  
**EDGE_CASES:** Opening player turn leftover is still public. Hidden AP ⇒ module off.  
**IMPLEMENTATION_COMPLEXITY:** Low after ADV-04.  
**TEST_SCENARIOS:** Player ended with AP 0 → tank steps to dist 1 if POS-05 allows. Player ended with AP 4 → tank holds.  
**STATUS:** PROPOSED

### AI-FUT-63

**AI_ID:** AI-FUT-63  
**NAME:** Artillery refuses adjacent melee when a legal ranged dest exists  
**ROLE:** positioning / role  
**SOPHISTICATION:** T2 (ROL-08) / T6 under pressure  
**DECISION_RULES:** Parent POS-01 “maintain optimal range.” Live `decideGeneric` (1583–1598) **melees when `dist <= 1`** even if `pickBestDamageSpell` returned a range-3 frost (`kind: "cast"` if spell else `"melee"` — adjacent frost is OK, but charger/generic will also Fire-Bolt on fail). Role artillery/kiter: if `findNearestLegalCastTile` yields a dest that keeps `enemySpellRange(spell)` and is not adjacent, prefer it over standing on dist 1. Berserker / charger invert. Always 4-dir reachable / SYS-07 MP.  
**SCORING_MODEL:** `U(adjacent melee) = −∞` for role artillery when a legal ranged dest is in the reachable set.  
**SPELL_REQUIREMENTS:** Ranged profile `enemySpellRange > 1`.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** Role lock always for SYS-04 artillery. T6 “under melee pressure” `mu ≈ 0.5`.  
**ENEMY_ARCHETYPES:** artillery, kiter, bishop.  
**PLAYER_COUNTERPLAY:** Corner them so the only legal dest is melee.  
**EDGE_CASES:** Zone-0 single-spell kits with only `physical_attack` → term 0 (SYS-09). Adjacent + no legal step away → melee with kit `physical_attack`, not Fire Bolt.  
**IMPLEMENTATION_COMPLEXITY:** Low after SYS-04 / SYS-42.  
**TEST_SCENARIOS:** Bishop, frost range 3, dist 1, dest (backstep) in reachable with LoS → backstep and frost, not Crush.  
**STATUS:** PROPOSED

### AI-FUT-64

**AI_ID:** AI-FUT-64  
**NAME:** Public buff recast hygiene  
**ROLE:** role / team  
**SOPHISTICATION:** T3 (TEM-04 for buffs)  
**DECISION_RULES:** Guardian recasts shield every turn because `AICombatant` has no `activeEffects` (comment 2121–2127). Once SYS-10 snapshots public effects, a second `starter-shield` / `spell-iron-skin` on a ward that already has that buff scores ~0 (match apply stacking; do not invent). First-caster shields; second-caster body-blocks (POS-07) or Iron-Skins self. Requires SYS-39 buff apply (not nested under `damage > 0`).  
**SCORING_MODEL:** `−wDupBuff` if the same `buffStat` / shield flag is already public on the ward.  
**SPELL_REQUIREMENTS:** Shield / iron-skin profiles + apply branch.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.2` (same family as TEM-04 / FUT-51).  
**ENEMY_ARCHETYPES:** guardian, protector, support.  
**PLAYER_COUNTERPLAY:** Dispel once; they will re-apply after it drops.  
**EDGE_CASES:** Different buff ids may stack if apply stacks. No snapshot ⇒ do not guess (today’s recast).  
**IMPLEMENTATION_COMPLEXITY:** Low after SYS-10 / SYS-39.  
**TEST_SCENARIOS:** Ward already shielded, two golems → second does not recast shield.  
**STATUS:** PROPOSED

### AI-FUT-65

**AI_ID:** AI-FUT-65  
**NAME:** Public portal/barrier choke camp  
**ROLE:** positioning  
**SOPHISTICATION:** T6 (POS-05; replaces unread `ENEMY_AI_TIER_GATES.chokepointCamp`)  
**DECISION_RULES:** Prefer dests that sit on the player’s only walkable approach to the pack backline, using **public** occupancy: portals, barriers, void, walls (same `OccupancyContext` as `computeReachable`). `ENEMY_AI_TIER_GATES.chokepointCamp = 3` (`gameConstants.ts` 205) is unread and is an integer level-gate — **do not** `if (aiTier >= 3)`. Attach via parent §4 sigmoid. Tank/protector default; artillery stays POS-01.  
**SCORING_MODEL:** `+wChoke` if after the dest the player’s 4-dir paths to the ward drop from ≥2 to 1.  
**SPELL_REQUIREMENTS:** None.  
**RELATIVE_DIFFICULTY_ELIGIBILITY:** `mu ≈ 0.9` plus a map with a real choke (portals/barriers present).  
**ENEMY_ARCHETYPES:** tank, protector, charger.  
**PLAYER_COUNTERPLAY:** Barrier your own lane; Timestep off the choke.  
**EDGE_CASES:** Open field → term 0. Do not camp reserved portal cells (09-21 SYS-27). Do not ignore occupancy to “hold the choke.”  
**IMPLEMENTATION_COMPLEXITY:** Medium (path-count cap 16).  
**TEST_SCENARIOS:** Corridor width 1 with a portal beside it; tank dest occupies the floor cell, not the portal. Two open approaches → term 0.  
**STATUS:** PROPOSED

---

## 5. Spell-awareness contract (reminder)

Unchanged: no profile + apply ⇒ not in kit. Do not feed `spellRangeBase` into AI (`targeting.ts` 128–137). `starter-heal` is self-only (`range: 0`). Ally heal needs a ranged heal id **and** apply `targetId` (SYS-05) **and** SYS-42 so a failed heal cannot Crush the ward. Heal pickers must not use `healAmount` (SYS-38). Inferno needs SYS-39 before any kit emits it. Buffs need SYS-39 + FUT-64 before guardian kits recast with intent.

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
5. SYS-42, SYS-43, SYS-44, SYS-45 (#498), SYS-46, SYS-47 (this file).  
6. Parent T2–T5 roles / team / adaptive. FUT-63 with ROL-08; FUT-64 with SYS-10; FUT-65 with POS-05. Then T6 FUT-60…62.

Each slice: `engine/enemyAI*.test.ts`, zero WX drive-by, no RAF / map gen / turn order / damage-formula edits.

---

## 7. Extra test scenarios

| ID | Setup | Expect |
| :--- | :--- | :--- |
| TS-ALLYFB | Healer, ally `targetId`, heal apply fails, `nd <= 1` | No Crush / `e-firebolt` on the ally (SYS-42). |
| TS-LAVAWALK | Bishop dest-commit onto lava | Public lava HP applied to the bishop (SYS-43). |
| TS-FOCUSSIDE | Pack focus `player`; player hunter sets enemy id | Pack still focuses `player` (SYS-44). |
| TS-BOSSAIM | Boss kit frost, player (8,8) | Boss sprite does not move to (8,8) (SYS-45). |
| TS-BOSSAP | Minion `currentMp === 1` | Boss snapshot MP is 1, not 3 (SYS-46). |
| TS-APPLYLOS | `closes-in` dest, barrier blocks LoS | No frost damage; no Fire Bolt (SYS-47). |
| TS-BLASTSPREAD | Player bomber radius 2 | Backline dests outside radius (FUT-60). |
| TS-BARCD | Visible frost on CD | Charger commits (FUT-61). |
| TS-LEFTAP | Player ended with AP 4 | Tank does not walk to dist 1 (FUT-62). |
| TS-ARTMELEE | Bishop dist 1, backstep legal | Frost from backstep, not melee (FUT-63). |
| TS-SHIELD2 | Ward already shielded | Second golem does not recast (FUT-64). |
| TS-CHOKE | Width-1 corridor + portal | Tank occupies the floor cell (FUT-65). |

09-21…09-23 TS-* rows still apply. Geometry tests cover caster LoS only.

---

## 8. Mapping (new gaps → ids)

| Request / gap | Primary AI_ID |
| :--- | :--- |
| Failed ally heal/buff → Fire Bolt the ward | AI-SYS-42 |
| Dest-commit skips lava/ice/spikes/thorn | AI-SYS-43 |
| Shared `focusTargetRef` across sides | AI-SYS-44 |
| Boss kit aim teleports onto the player | AI-SYS-45 |
| Boss AI dummy `ap: 3` / `res: 0` snapshot | AI-SYS-46 |
| Apply Chebyshev-only after dest-commit | AI-SYS-47 |
| Spread vs visible player bomber | AI-FUT-60 |
| Visible bar cooldown window | AI-FUT-61 |
| Leftover public AP aggression | AI-FUT-62 |
| Artillery refuses unnecessary melee | AI-FUT-63 |
| Shield recast hygiene | AI-FUT-64 |
| Portal choke camp (not `aiTier >= 3`) | AI-FUT-65 |

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

This increment adds apply-honesty (SYS-42…47) so those modules cannot cheat when they attach, plus T6 scorers (FUT-60…65) that keep appearing as relative difficulty rises.

Every row above is **STATUS: PROPOSED**. No production AI in this change.
