# Mechanic interaction matrix — 2026-09-22

**Auditor:** Mechanic Interaction Matrix Auditor  
**HEAD:** `0f5363f` (same as the 09-21 matrix / #332). No gameplay merge since then.  
**Gameplay code:** not modified.

Pairs are scored only when current source shows a real join. “Watch enemy cast → unlock spell” still does not exist (`ownedSpells` = starter ∪ backend catalog). Gravity Well / Fog of War / Blood Moon / Mirror Field remain announce-only registry placeholders. Drain × `no_healing` stays closed. Paper Windstorm rate vs announce stays PXA-owned. Push/pull stay unwired (08-31-005 REPORT_ONLY). Do not clone in-flight **#327** / **#370**, **#331** / **#373**, **#336**, **#376**, **#379**, **#380**, **#382**, **#386**, **#389**, **#391**.

## Priority surfaces (this run)

HEAD did not move. Re-audit focused on boss kit × phase abilities, which the 09-21 pass treated as reachable consume bugs (Dawn, VOID_TILES) without checking whether `decide*Action` can return those abilities.

| Surface | Why it matters for pairs |
| :--- | :--- |
| `pickBossKitSpell(..., new Map())` | Every boss decision prefers the first phase kit id and never reaches special abilities |
| WX kit execute | Live path: no range / LoS; summon dest = player tile |
| WX ability consume | Still drops `newPositions` / `damageToTargets` / illusions / larvae / shock tiles (dead until 001) |
| Player turn-start AP/MP restore | Overwrites `playerApModifier` (Dawn / BOARD_CLAIM / AP drain) |
| Registry player exclusion | Still 09-21-001 (do not re-file) |
| Attack Nearest origin | Execute = player; preview = summon (09-21-004, #336) |

## Still OPEN from prior matrices (do not re-file)

| ID | Pair | Status on `0f5363f` |
| :--- | :--- | :--- |
| MIMA-2026-08-31-001 | Swap × lava/ice/rift/thorns | `swapPositions` copies coords only |
| MIMA-2026-08-31-002 | Controlled-summon walk × **hazards** | Dest occupancy closed. Instant teleport; no landing |
| MIMA-2026-08-31-005 | Push/pull × hazards | Resolvers + occupancy tests; **zero** `resolvePlayerCast` sites. REPORT_ONLY |
| MIMA-2026-08-31-008 | AI/summon × Void Rift **walk** tile | Walk extra still player-only |
| MIMA-2026-09-01-002 | Occupants × player walk **path** | Dest occupancy checked; `findPath` intermediates ignore living combatants |
| MIMA-2026-09-01-006 | Summon AI walk × lava/ice/spikes | `executeSummonAction.applyMovement` is `isCellFree` only |
| MIMA-2026-09-02-002 | Destack / unseal / spawn slide × lava | `findNearestFreeCell` / `findBattleStartCell` hazard-blind |
| MIMA-2026-09-02-003 | GameKey × unpaid death 20/40 | Raw `#ok` commit — **#391** in flight |
| MIMA-2026-09-02-004 | Boss VOID_TILES × walk | Type `"void"` stored; landing ignores it (also unreachable until 09-22-001) |
| MIMA-2026-09-02-005 | Pacifist × summon damage | `dealDamage` never flips the ref |
| MIMA-2026-09-02-006 | Dawn +10 HP | `damageToPlayer > 0` gate (unreachable until 09-22-001) |
| MIMA-2026-09-21-001 | Registry HP/MP hooks × player | `playerTurnStartModifierTarget` misses the player |
| MIMA-2026-09-21-002 | Dawn +1 MP applied as AP | **#376** copy-only; still `playerApModifier` |
| MIMA-2026-09-21-003 | Striker × summon **AI** kit | Control path records; executor does not — **#327** / **#370** adjacent |
| MIMA-2026-09-21-004 | Control preview × player execute origin | Blue ring still summon-origin |

## Closed / in-flight (do not re-open or clone)

| Pair | Status |
| :--- | :--- |
| Frozen × player/AI/summon MP | Closed (`battleWalkMpCost` / `enemyWalkCostPerTile`) |
| Wisp / Drain × `healUsed` | Closed on main; **#380** is a leftover PR |
| Pacifist × Strike highlight | Closed |
| Recap / persist-pending × world input | Closed |
| Attack Nearest **execute** origin | Closed (`attackNearestLiveCasterPos`) |
| Victory HP floor > persist max | **#386** in flight |
| Shell Armor × spell-kill death | **#382** in flight |
| Timestep spent / living occupancy / spellbook range | **#389** in flight |
| Walk occupancy + summon AP share | **#379** in flight |

## Matrix (evidence-backed)

| Pair | Should | Do (on `main`) | Gap |
| :--- | :--- | :--- | :--- |
| Boss kit cooldown × phase abilities | Share the turn | Empty map ⇒ first kit id forever | [001](./ACTION_IDS_MIMA_2026-09-22.md) |
| Boss kit × range / LoS | Same metadata as player/enemy casts | Always player tile; no range/LoS | [002](./ACTION_IDS_MIMA_2026-09-22.md) |
| Dawn / BOARD_CLAIM / AP drain × turn-start restore | Next player pool includes the mod | Restore ignores `prev` | [003](./ACTION_IDS_MIMA_2026-09-22.md) |
| MAP_ROTATE / MIRROR_INVERT / TWIN_FLANK × teleport | Move everyone announced | `newPositions` unused | [004](./ACTION_IDS_MIMA_2026-09-22.md) |
| Queen ray / chain lightning × player-side summons | Same HP as player | `damageToTargets` unused | [004](./ACTION_IDS_MIMA_2026-09-22.md) |
| ILLUSION_SPLIT / LARVAE_SPAWN × occupancy | Targetable occupants | `bossState` only; Shell can latch | [004](./ACTION_IDS_MIMA_2026-09-22.md) |
| SHOCK_TILES × walk | Painted or damaging | State coords only | [004](./ACTION_IDS_MIMA_2026-09-22.md) |
| Swap × hazards | Same as walk | Still no | 08-31-001 |
| Destack × lava | Avoid or land | Still no | 09-02-002 |
| GameKey × unpaid death | Honour 20/40 | Still raw; **#391** | 09-02-003 |
| Pacifist × wolf melee | Fail feat | Still true | 09-02-005 |
| Void Rift tick × player HP | Commit | Registry misses player | 09-21-001 |
| Striker × summon AI | Fail beyond 2 | Control only | 09-21-003 |
| Push/pull × hazards | If shipped | Unwired | 08-31-005 |
| Achievement × spell observation | — | No observe path | not invented |
| Recap / persist-pending × lava | Block | Yes | closed |
| Frozen × MP | 2× | Yes | closed |

## Non-findings (do not invent)

- No enemy-cast observation → `ownedSpells` unlock.
- `worldFeatures.ts` teleport pads / conveyor catalog is data + tests only; WX does not consume it.
- Timestep is AP/MP restore, not a teleport; it does not skip hazard landing.
- Ice tile (−2 MP active effect) + Frozen Terrain (2× walk cost) compound through the existing restore + `battleWalkMpCost` paths.
- Death persist does not pay challenge rewards (`handleBossRushRoomClear` early-returns on `deathTriggered`).
- DoT × last hostile still goes through `shouldContinuePlayerTurnAfterHazard` / victory tests.

## Missing tests (actionable)

1. `pickBossKitSpell` with a live cooldown map and a non-empty pool still allows `DAWN_BUFF` / `MAP_ROTATE` / `LARVAE_SPAWN` on the reserved turn (001).
2. Kit execute: Cursed Wound from Chebyshev 6 does not call `playerTakesDamage` (002).
3. Kit summon dest is a free cell within the spell’s range of the **boss** (002).
4. Dawn `playerApModifier: 2` survives the next player-turn restore (003).
5. MAP_ROTATE `newPositions` moves the player (004).
6. ATTACK_ALL_LINES `damageToTargets` reduces a player-side summon’s store HP (004).
7. Still missing from prior ledgers: Swap lava; destack lava; GameKey pending death; VOID_TILES land; wolf melee × pacifist; summon AI lava landing; findPath ∩ occupants === ∅; Void Rift player tick; Striker × AI archer; control preview origin.

Actionable records: [`ACTION_IDS_MIMA_2026-09-22.md`](./ACTION_IDS_MIMA_2026-09-22.md).
