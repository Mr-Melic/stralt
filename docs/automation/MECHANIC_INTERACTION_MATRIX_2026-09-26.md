# Mechanic interaction matrix — 2026-09-26

**Auditor:** Mechanic Interaction Matrix Auditor  
**HEAD:** `0f5363f` (unchanged since #332 / 09-21…09-25 matrices)  
**Gameplay code:** not modified.

Pairs are scored only when current source shows a real join. “Watch enemy cast → unlock spell” still does not exist (`ownedSpells` = starter ∪ backend catalog). Attack Nearest origin is **player tile** on purpose (`attackNearestLiveCasterPos`); do not treat that as summon-control drift. Time Warp **is** wired (15s). Blood Moon 1.25× and Mirror Field 20% reflect **are** wired in `resolvePlayerCast`.

## Priority surfaces (this run)

HEAD has not moved since 09-21. Focus was leftover consume joins that prior matrices named as examples but never filed: Chaos Initiative authority, unpaid-death honour on remaining `applyRewards` credits, and ice Frozen MP on non-player units.

| Surface | Why it matters for pairs |
| :--- | :--- |
| `chaos_initiative` `onTurnOrderSort` | Hook runs at wrap-to-0; `liveTurnOrder` prefers `turnOrderRef` |
| World one-shot Doka (`persistDokaCreditResult`) | #256 closed remint; unpaid 20/40 still only on absolute writes |
| Victory / portal `applyRewards` | Same honour gap on the battle and portal funnels |
| Ice Frozen −2 MP | Player restore consumes it; summon/enemy budgets do not |
| In-flight Death Realm / destack / Haste PRs | Do not clone (#554 #596–#608 cluster) |

## Still OPEN from prior matrices (do not re-file)

| ID | Pair | Status on `0f5363f` |
| :--- | :--- | :--- |
| MIMA-2026-08-31-001 | Swap × lava/ice/rift/thorns | `swapPositions` still copies coords only (`spellEngine.ts` 768) |
| MIMA-2026-08-31-002 | Controlled-summon walk × **hazards** | Occupancy closed; landing still missing |
| MIMA-2026-08-31-005 | Push/pull × hazards | Resolvers + occupancy tests; **zero** `resolvePlayerCast` call sites. REPORT_ONLY |
| MIMA-2026-08-31-008 | AI/summon × Void Rift **walk** tile | Walk-on extra is still player-walk-only |
| MIMA-2026-09-01-002 | Barrier / occupants × player walk path | Dest highlight yes; A* walls/void/portals only |
| MIMA-2026-09-01-006 | Summon AI walk × lava/ice/spikes | Enemy landing only |
| MIMA-2026-09-02-002 | Destack / unseal × lava | `isCellFree` has no hazard axis |
| MIMA-2026-09-02-003 | GameKey × unpaid death | Shop commit is raw canister Doka (**#391**) |
| MIMA-2026-09-02-004 | Boss VOID_TILES | `newVoidTiles` unused; type `"void"` ignored |
| MIMA-2026-09-02-005 | Pacifist × player-side summon damage | Ref stays true |
| MIMA-2026-09-02-006 | Dawn +10 HP | Log only (`damageToPlayer > 0`) |
| MIMA-2026-09-21-001…004 | Player modifier ticks; Dawn MP-as-AP; Striker × summon AI; control preview origin | Still open / **#443** / **#376** / **#327** |
| MIMA-2026-09-22-001…004 | Boss kit `new Map()`; kit range/LoS; `playerApModifier` wipe; dropped ability fields | Still open |
| MIMA-2026-09-23-001…004 | Glass/Titans hook miss; Fever HP / Titans snapshot; Overflow fizzle; Iron Curse heal | Still open |
| MIMA-2026-09-24-001…004 | Mist/Winds copy; Null Field ice vs lava; boss teleport × lava; Fever 2× kill-only | Still open |
| MIMA-2026-09-25-001…004 | Surge 0-AP Timestep floor; Surge skip summon kits; Thorned player-only; feat claim × unpaid death | Still open (**#566**) |

## Closed since last merged matrix (09-02) — do not re-open

| ID | Pair | Closed by |
| :--- | :--- | :--- |
| 09-02-001 | Frozen × enemy/summon AI reach | `enemyWalkCostPerTile` / `09acff2` |
| 09-01-001 | Frozen/Slime player execute 2× | `battleWalkMpCost` / `054e38b` |
| 09-01-005 | no_healing × Wisp / Drain | Wisp + `9f36239` |
| Pacifist preview | Range paint no longer fails the feat | #232 |
| Recap persist-pending | Overlay + `victoryPersistPending` | #211 / #243 |
| Challenge HUD after first action | `3e95eab` | |
| Boss Rush victory feats | `451d2ed` | |
| Attack Nearest origin | Player tile (`67dd095`) | |

## Matrix (evidence-backed, this run)

| Pair | Should | Do (on `main`) | Gap |
| :--- | :--- | :--- | :--- |
| Chaos Initiative × turn-queue authority | Same shuffle on strip + dispatch | Hook at wrap; `liveTurnOrder` keeps ref | [001](./ACTION_IDS_MIMA_2026-09-26.md) |
| Shrine / ground / dungeon-complete × unpaid death | Honour 20/40 on credit | Raw `creditLiveDoka` | [002](./ACTION_IDS_MIMA_2026-09-26.md) |
| Ice Frozen −2 MP × summon / enemy budget | Cut next-turn MP for holder | Player restore only | [003](./ACTION_IDS_MIMA_2026-09-26.md) |
| Victory / portal / challenge `applyRewards` × unpaid death | Honour 20/40 on commit | Raw `newDoka` / `newXp` | [004](./ACTION_IDS_MIMA_2026-09-26.md) |
| Summons × portals (occupy / path / cleanup) | Impassable; reset roster | Yes | closed |
| DoT / plague × last-hostile victory | Victory or death, not both | Yes + tests | closed |
| Death × leftover summons / challenge pay | Fail, no pay | `deathTriggered` early-return | closed |
| Boss phase × summon death | Boss HP only | `checkPhaseTransition` | closed |
| Time Warp × turn timer | 15s | Wired | closed |
| Portal +10 XP × HUD | After commit | Yes (honour is 004) | closed (HUD) |
| Achievement × spell observation | — | No observe path | not invented |
| Vampiric × healUsed | — | 09-21-001 | do not re-file |
| Blood Moon / Mirror Field × player cast | Wired | `spellEngine` 895–907 | not invented |
| Push/pull × hazards | If shipped | Unwired | 08-31-005 |

## Missing tests (actionable)

1. Chaos wrap: `turnOrderRef` ids equal React order and differ from pre-wrap (seeded RNG) (001).
2. Pending 80 Doka loss + ground 30 ⇒ lock honours −80 on post-credit total; remint keep/release unchanged (002).
3. Frozen on wolf id ⇒ `summonTurnBudget` MP is maxMp−2; player Frozen still −2 (003).
4. Pending 80 Doka / 20 XP + victory 100/50 ⇒ lock honours the cut; portal +10 with pending XP loss honours; `cutConfirmed` does not recut (004).
5. Still missing from prior OPEN IDs: Swap lava; destack/unseal lava; summon AI dest === lava; Fever HP snapshot; Surge `applyApCost(0) === 0`; Thorned enemy path 4 ⇒ HP −15; feat claim + pending death.

Actionable records: [`ACTION_IDS_MIMA_2026-09-26.md`](./ACTION_IDS_MIMA_2026-09-26.md).
