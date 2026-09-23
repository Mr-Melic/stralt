# Mechanic interaction matrix — 2026-09-23

**Auditor:** Mechanic Interaction Matrix Auditor  
**HEAD:** `0f5363f` (same as the 09-21 / 09-22 matrices / #332). No gameplay merge since then.  
**Gameplay code:** not modified.

Pairs are scored only when current source shows a real join. “Watch enemy cast → unlock spell” still does not exist (`ownedSpells` = starter ∪ backend catalog). Gravity Well / Fog of War remain announce-only registry placeholders. **Blood Moon** (1.25× in `spellEngine`) and **Mirror Field** (20% reflect) *are* wired — the 09-22 “announce-only” note was wrong for those two. Paper Windstorm rate vs announce stays PXA-owned. Push/pull stay unwired (08-31-005 REPORT_ONLY). Do not clone in-flight **#327** / **#370**, **#331** / **#373**, **#336**, **#376**, **#379**, **#380**, **#382**, **#386**, **#389**, **#391**, **#410**, **#443**, **#467**.

## Priority surfaces (this run)

HEAD did not move. Re-audit focused on map-modifier *consume* joins that 09-21 treated as player-row exclusion (turn-start HP/MP) without checking whether `onDamageDealt` / `onBattleStart` / `onEffectApplication` actually hit the live damage and heal funnels.

| Surface | Why it matters for pairs |
| :--- | :--- |
| `applyDamageToEnemy` vs `enemyTakesDamage` | Primary player-cast HP write never calls `applyDamageDealt`; bounce hops and summon/sacrifice `dealDamage` do |
| Player-incoming HP writes | Melee / Mirror Field reflect / boss `damageToPlayer` / `__player__` sentinel skip `playerTakesDamage` and Glass Realm |
| `applyBattleStart` then `setEnemyHpMap(hpMap)` | Snapshot is built *before* Titans / Doka Fever / Iron Curse mutate the store |
| Doka Fever `isEnemy ?? side === "enemy"` | Overworld `Enemy` records have neither flag |
| Arcane Overflow `onEffectApplication` | Only `applyActiveEffect` calls it; damage/heal/summon casts do not |
| Iron Curse heal ×0.5 | Constant exists; no heal site multiplies |

## Still OPEN from prior matrices (do not re-file)

| ID | Pair | Status on `0f5363f` |
| :--- | :--- | :--- |
| MIMA-2026-08-31-001 | Swap × lava/ice/rift/thorns | `swapPositions` copies coords only (`WorldExploration.tsx` 9389–9401) |
| MIMA-2026-08-31-002 | Controlled-summon walk × **hazards** | Dest occupancy closed. Instant teleport; no landing. **#467** is occupancy-only |
| MIMA-2026-08-31-005 | Push/pull × hazards | Resolvers + occupancy tests; **zero** `resolvePlayerCast` sites. REPORT_ONLY |
| MIMA-2026-08-31-008 | AI/summon × Void Rift **walk** tile | Walk extra still player-only |
| MIMA-2026-09-01-002 | Occupants × player walk **path** | Barriers in `isBattleWalkTileBlocked`. `findPath` intermediates still ignore living combatants |
| MIMA-2026-09-01-006 | Summon AI walk × lava/ice/spikes | `executeSummonAction.applyMovement` is `isCellFree` only |
| MIMA-2026-09-02-002 | Destack / unseal / spawn slide × lava | `findNearestFreeCell` / `findBattleStartCell` hazard-blind |
| MIMA-2026-09-02-003 | GameKey × unpaid death 20/40 | Raw `#ok` commit — **#391** in flight |
| MIMA-2026-09-02-004 | Boss VOID_TILES × walk | Type `"void"` stored; landing ignores it (also unreachable until 09-22-001) |
| MIMA-2026-09-02-005 | Pacifist × summon damage | `dealDamage` never flips the ref |
| MIMA-2026-09-02-006 | Dawn +10 HP | `damageToPlayer > 0` gate (unreachable until 09-22-001) |
| MIMA-2026-09-21-001 | Registry HP/MP hooks × player | Helper **#443**; WX wire still missing |
| MIMA-2026-09-21-002 | Dawn +1 MP applied as AP | **#376** copy-only |
| MIMA-2026-09-21-003 | Striker × summon **AI** kit | Control path records; executor does not — **#327** / **#370** adjacent |
| MIMA-2026-09-21-004 | Control preview × player execute origin | Blue ring still summon-origin |
| MIMA-2026-09-22-001 | Kit `new Map()` × phase abilities | Still first kit id forever |
| MIMA-2026-09-22-002 | Kit execute × range / LoS | Always player tile |
| MIMA-2026-09-22-003 | `playerApModifier` × turn-start restore | Formula restore wins |
| MIMA-2026-09-22-004 | Ability `newPositions` / larvae / shock | WX consume still drops them |

## Closed / in-flight (do not re-open or clone)

| Pair | Status |
| :--- | :--- |
| Frozen × player/AI/summon MP | Closed (`battleWalkMpCost` / `enemyWalkCostPerTile`) |
| Wisp / Drain × `healUsed` | Closed on main; **#380** leftover PR |
| Pacifist × Strike highlight | Closed |
| Recap / persist-pending × world input | Closed |
| Attack Nearest **execute** origin | Closed (`attackNearestLiveCasterPos`) |
| Void Rift / Mist / Swift Winds player tick | **#443** helper; WX deferred |
| GameKey × unpaid death | **#391** in flight |
| Walk occupancy + summon-control Occupied | **#467** in flight |
| Victory HP floor > persist max | **#386** in flight |

## Matrix (evidence-backed)

| Pair | Should | Do (on `main`) | Gap |
| :--- | :--- | :--- | :--- |
| Glass Realm / Titans × player-cast primary hit | Same `onDamageDealt` as bounce | `applyDamageToEnemy` writes HP; bounce uses `enemyTakesDamage` | [001](./ACTION_IDS_MIMA_2026-09-23.md) |
| Glass Realm × player incoming (melee / reflect / boss hit) | “Dealt and taken” ×2 | Incoming paths never call `applyDamageDealt` | [001](./ACTION_IDS_MIMA_2026-09-23.md) |
| Doka Fever × enemy HP | +25% then 2× Doka | Rewards 2×; HP predicate never matches `Enemy` | [002](./ACTION_IDS_MIMA_2026-09-23.md) |
| Titans Vigor +1000 × AI / `enemyHpMap` | One HP | Store mutated; `hpMap` snapshot is pre-hook | [002](./ACTION_IDS_MIMA_2026-09-23.md) |
| Arcane Overflow × spell execute | 10% fizzle on spells | AP −1 yes; fizzle only on buff/debuff `applyActiveEffect` | [003](./ACTION_IDS_MIMA_2026-09-23.md) |
| Iron Curse × healing | ×0.5 at every heal site | Log-only hook; WX heals full | [004](./ACTION_IDS_MIMA_2026-09-23.md) |
| Swap × hazards | Same as walk | Still no | 08-31-001 |
| Destack × lava | Avoid or land | Still no | 09-02-002 |
| GameKey × unpaid death | Honour 20/40 | Still raw; **#391** | 09-02-003 |
| Pacifist × wolf melee | Fail feat | Still true | 09-02-005 |
| Void Rift tick × player HP | Commit | Registry misses player; **#443** | 09-21-001 |
| Boss kit × phase abilities | Share the turn | Empty cooldown map | 09-22-001 |
| Push/pull × hazards | If shipped | Unwired | 08-31-005 |
| Achievement × spell observation | — | No observe path | not invented |
| Recap / persist-pending × lava | Block | Yes | closed |
| Frozen × MP | 2× | Yes | closed |
| Blood Moon × damage | 1.25× | Yes (`spellEngine`) | not a gap |
| Mirror Field × reflect | 20% | Yes (incoming skip is 001) | — |

## Non-findings (do not invent)

- No enemy-cast observation → `ownedSpells` unlock.
- `worldFeatures.ts` teleport pads / conveyor catalog is data + tests only; WX does not consume it.
- Gravity Well / Fog of War remain unused `_is*` flags — already classified as placeholders, not re-filed.
- Timestep is AP/MP restore, not a teleport; extra casts after restore correctly raise `maxApUsedInTurn` (hard_3).
- Ice tile (−2 MP active effect) + Frozen Terrain (2× walk cost) compound through restore + `battleWalkMpCost`.
- Death persist does not pay challenge rewards (`deathTriggered` early-return).
- DoT × last hostile still goes through `shouldContinuePlayerTurnAfterHazard` / victory tests.
- Sacrifice already records challenge self-HP (`recordChallengeSelfHpLoss`).

## Missing tests (actionable)

1. Glass Realm: primary Strike HP drop is 2× the no-modifier case **or** bounce is not 2× while primary is 1× (001).
2. Glass Realm: enemy melee and Mirror Field reflect debit 2× **or** announce drops “taken” (001).
3. Doka Fever: after battle start, store `maxHp` is `floor(base * 1.25)` and `enemyHpMap` matches (002).
4. Titans Vigor: AI `hp` / `maxHp` used for hazard avoid equal the +1000 store row (002).
5. Arcane Overflow: a damage `resolvePlayerCast` can return `"fizzled"` at 10% **or** the announce drops “spells fizzle” (003).
6. Iron Curse: Blood Mend / Drain restore is `floor(heal * 0.5)` and `healUsed` still flips (004).
7. Still missing from prior ledgers: Swap lava; destack lava; GameKey pending death; VOID_TILES land; wolf melee × pacifist; summon AI lava landing; findPath ∩ occupants === ∅; Void Rift player tick; Striker × AI archer; control preview origin; kit cooldown map; kit range; Dawn AP surviving restore; MAP_ROTATE `newPositions`.

Actionable records: [`ACTION_IDS_MIMA_2026-09-23.md`](./ACTION_IDS_MIMA_2026-09-23.md).
