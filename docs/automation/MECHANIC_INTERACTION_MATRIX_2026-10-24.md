# Mechanic interaction matrix — 2026-10-24

**Auditor:** Mechanic Interaction Matrix Auditor  
**HEAD:** `0f5363f` (unchanged since #332 / 09-21…10-23)  
**Gameplay code:** not modified.

Pairs are scored only when current source shows a real join. “Watch enemy cast → unlock spell” still does not exist. Push/pull remain unwired (08-31-005). Blood Moon and Mirror Field **are** wired in `resolvePlayerCast` (Sacrifice skip is 10-21-009; player DoT skip is 10-22-001; Swap skip is 10-23-003).

## Priority surfaces on this HEAD

Main has not moved since #332. This hunt targeted leftover **live** splits: summon kits vs the player damage loop, boss kit vs enemy kit incoming, SP vs SR, Slow/Weaken consumers on summons, and feat counters that only the main portal path writes.

## New ACTION_IDs

`docs/automation/ACTION_IDS_MIMA_2026-10-24.md` 001–007.

| Pair | Should | Do | Deterministic | Contradict | Bypass | Feedback | Tests |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Summon kit × Windstorm/Mirror/Blood Moon/crit | Y | **N** | missing | vs player Inferno | **Y** | kit log is full dmg | **none** |
| Boss kit × Windstorm / Void Mirror / scale | Y | **N** | missing | vs enemy kit | **Y** | “casts … for N” | **none** |
| Enemy kit × player SR / RES once / SP outbound | SR×RES once | SP + RES then RES again | **N** | HUD SR vs incoming | SP as armor | `[-SP, -RES]` note | **none** |
| Slow/Weaken × summon budget + DPS | Y | budget ignores; casterId player | **N** | vs player restore | **Y** | Slow icon, full MP | budget floors only |
| AI Archer Slow × `stat`/`modifier` | apply −2 MP | omit fields | missing | vs enemy-kit Slow | cosmetic | “applied effect” | **none** |
| Control kit snapshot × target SR/RES | live SR×RES | `{ res:0, sp:0 }` | missing | vs player bar | SR bypass | full kit dmg | **none** |
| Boss Rush / rest-exit × `mapsVisited` | combat maps count | only WX:6471 | missing | vs dungeon-chain | explore_25 stall | Feats panel stale | victory snap only |
| versionGate × explore_25 / loot_10 counters | preserve or persist | wipe | Y | vs inventory keep | re-farm | silent 0 | inventory only |

## Rejected almost-findings

| Candidate | Why |
| :--- | :--- |
| Attack Nearest × modifiers / Shield / RES / crit | Shares `executeCastAttempt` → `resolvePlayerCast` |
| Enemy kit × map Mirror Field | Player-cast hazard only; Void Mirror **is** on enemy kit (boss skip is 002) |
| Life Drain × modifiers | Damage-loop modifiers apply; `healAmount` vs `drainPercent` is #543 |
| Player-bar Weaken/Slow writer | **EBMA-004** owns restore; enemy-kit Weaken on player is live (004 leak) |
| Blood Mend / Rally CHC `buffStat` | **EBMA-012** |
| Vampiric Ground heal | Subsumed by **09-23-001** `onDamageDealt` |
| Challenge AP vs summon kit spend | Product has not required minion AP = player challenge AP (09-25-002 remains) |
| Status ticks × summons | `processActiveEffects` runs on summon turns |
| Spell observe → unlock | No path (non-finding) |
| White / rest **entry** × mapsVisited | Non-combat; correctly skipped. 006 is Boss Rush + rest-**exit** only |
| Barrier × Windstorm pre-loop | Same skip as Swap — not cloned from 10-23-003 |
| Gravity Well / Fog of War / push-pull | Unused / unwired |

## Missing tests (actionable)

1. Controlled Archer kit + `isPaperWindstorm` ⇒ miss log, no HP (001).
2. AI hunter kit + Blood Moon ⇒ 1.25× vs same kit off Blood Moon (001).
3. Boss kit + active Void Mirror ⇒ `consumePlayerMirror`, no player HP (002).
4. Incoming 100 dmg, RES 20, SR 10, SP 20 ⇒ SR×RES once, SP unused (003).
5. Slow −2 on wolf ⇒ next control turn `currentMp = maxMp - 2` (004).
6. Weaken on wolf cuts kit hit; Weaken on player does not (004).
7. `applyCast` Slow writes `stat: "mp"` / `modifier: -2` (004).
8. Control Strike vs enemy SR 20 / RES 30 matches player Strike mitigation (005).
9. Boss Rush room 0→1 and rest-exit increment `mapsVisited`; Death Realm does not (006).
10. `shouldPreserveVersionGateKey` keeps `*_pbv_maps_visited_count` / `*_pbv_ground_doka_pickups` (007).

Actionable records: [`ACTION_IDS_MIMA_2026-10-24.md`](./ACTION_IDS_MIMA_2026-10-24.md).
