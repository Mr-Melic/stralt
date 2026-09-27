# Mechanic interaction matrix — 2026-09-27

**Auditor:** Mechanic Interaction Matrix Auditor  
**HEAD:** `0f5363f` (unchanged since #332 / 09-21…09-26 matrices)  
**Gameplay code:** not modified.

Pairs are scored only when current source shows a real join. “Watch enemy cast → unlock spell” still does not exist (`ownedSpells` = starter ∪ backend catalog). Attack Nearest origin is **player tile** on purpose (`attackNearestLiveCasterPos`). Time Warp **is** wired (15s). Blood Moon 1.25× and Mirror Field 20% reflect **are** wired in `resolvePlayerCast`. Shell Armor / Reflect Shield vs DoT-summon bypass is **not** filed: kit `new Map()` (09-22-001) never lets larvae/shell latch on this HEAD.

## Priority surfaces (this run)

HEAD has not moved since 09-21. Focus was consume joins that prior matrices named as examples (summon spawn, death-timer world actions, Shield Charm vs environmental HP, feat counters vs pickup persist) but never scored as pairs.

| Surface | Why it matters for pairs |
| :--- | :--- |
| `spawnSummonUnit` / ground targeting | `isCellFree` has no hazard axis; lava is legal ground |
| Shield Charm `shieldHpRef` | Absorb is only in `playerTakesDamage` / melee / boss `damageToPlayer` |
| Death Realm 1.5s after recap dismiss | Portals + encounters gated; canvas walks are not |
| `loot_10_doka` | Counter ticks on claim; world check runs only when `mapsVisited` changes |
| In-flight Death Realm / destack / Haste / MIMA PRs | Do not clone (#554 #596–#608 / **#617** cluster) |

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
| MIMA-2026-09-26-001…004 | Chaos `turnOrderRef`; one-shot / victory `applyRewards` × unpaid death; ice Frozen MP | Still open (**#617**) |

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
| Summon spawn (player + hostile) × lava/spikes/ice | Avoid or land | `isCellFree` + ground targeting; 0 HP | [001](./ACTION_IDS_MIMA_2026-09-27.md) |
| Shield Charm × lava/spikes/Thorned/rift/Mirror Field | Absorb incoming HP | Spell/DoT/melee only | [002](./ACTION_IDS_MIMA_2026-09-27.md) |
| Death Realm 1.5s × shrine/ground Doka/lava after recap dismiss | Block world actions or re-arm death | Portals + encounters only | [003](./ACTION_IDS_MIMA_2026-09-27.md) |
| `loot_10_doka` × ground pickup persist | Count committed pickups; fire on 10th | Claim-time counter; world check on map visit | [004](./ACTION_IDS_MIMA_2026-09-27.md) |
| Swap × hazards | Same as walk | Still no | 08-31-001 |
| Destack / unseal × lava | Avoid or land | `isCellFree` only | 09-02-002 |
| Summon AI / control walk × lava | Same as enemy walk | Enemy landing only | 09-01-006 / 08-31-002 |
| Shield Charm × spell / DoT / melee | Absorb | Yes (`playerTakesDamage` / melee) | closed |
| Recap visible × world clicks | Block | Yes | closed |
| Victory persist-pending × lava / encounter | Block | Yes | closed |
| Death Realm pending × portal / new encounter | Block | Yes | closed (portals/encounters) |
| Summons × portals (occupy / path / cleanup) | Impassable; reset roster | Yes | closed |
| DoT / plague × last-hostile victory | Victory or death, not both | Yes + tests | closed |
| Achievement × spell observation | — | No observe path | not invented |
| Shell Armor × DoT / summon melee | — | Larvae never latch (09-22-001) | do not invent |
| Blood Moon / Mirror Field × player cast | Wired | `spellEngine` 895–907 | not invented |
| Push/pull × hazards | If shipped | Unwired | 08-31-005 |

## Missing tests (actionable)

1. Ground summon onto a lava cell ⇒ spawn cell is not lava **or** landing applies 8–15 + Burning (001). Hostile `spawnEnemySummonUnit` on lava same.
2. Shield Charm 20 + lava 10 ⇒ HP unchanged, shield 10; Thorned path 4 + shield 20 ⇒ HP −0 shield 5 leftover; Mirror Field reflect deducted from shield first (002).
3. `isDeathRealmTransitionPending(true, true)` blocks canvas walk / shrine / ground Doka the same way it blocks portals (003). Recap dismiss (`battleRecapOpen=false`) must not reopen those.
4. Tenth ground pickup fires `loot_10_doka` without a `mapsVisited` change; `settle.kind === "release"` does not increment the counter (004).
5. Still missing from prior OPEN IDs: Swap lava; destack/unseal lava; summon AI dest === lava; Chaos wrap ref sync; Surge `applyApCost(0) === 0`; feat claim + pending death.

Actionable records: [`ACTION_IDS_MIMA_2026-09-27.md`](./ACTION_IDS_MIMA_2026-09-27.md).
