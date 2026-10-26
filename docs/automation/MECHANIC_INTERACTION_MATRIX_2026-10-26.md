# Mechanic interaction matrix — 2026-10-26

**Auditor:** Mechanic Interaction Matrix Auditor  
**HEAD:** `0f5363f` (unchanged since #332 / 09-21…10-25)  
**Gameplay code:** not modified.

Pairs are scored only when current source shows a real join. “Watch enemy cast → unlock spell” still does not exist. Push/pull remain unwired (08-31-005). Blood Moon and Mirror Field **are** wired in `resolvePlayerCast` (Sacrifice skip is 10-21-009; player DoT skip is 10-22-001; Swap skip is 10-23-003; summon kit skip is 10-24-001).

## Priority surfaces on this HEAD

Main has not moved since #332. This hunt targeted leftover **live** splits that 10-25 did not score: the HP phase-2 **reader** vs the guide’s phase-1 field, SPELL_MIRROR’s player-cast buffer, BOARD_CLAIM’s persisted zone vs later AP restore, and Twin death × MONARCH_ABSORB. In-flight **#1062** / **#1012** / **#1035** / **#1040** / **#1042** / **#1058** / **#1094** / **#852** / **#858** are not cloned.

## New ACTION_IDs

`docs/automation/ACTION_IDS_MIMA_2026-10-26.md` 001–004.

| Pair | Should | Do | Deterministic | Contradict | Bypass | Feedback | Tests |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| HP phase-2 × `phase1` vs `phase2.hpThreshold` | mid-fight phase at documented % | reader uses phase2 = **0.0** | **Y** (never) | guide 50% vs admin 0% | **Y** (no phase 2) | guide lies | **none** |
| SPELL_MIRROR × player last spell | 90% return + 3-turn combo | extras default power 0; Pacifist history unused | missing | vs guide | **Y** | “mirrors your spells” | none |
| BOARD_CLAIM zone × later player AP | −2 AP on the 2×2 | same-turn occupancy only | missing | vs restore | **Y** | guide “break by damage” vs comment “AP tax” | none |
| Twin death × MONARCH_ABSORB | survivor phases + DoT/buff | death pipeline ignores twins; AI waits for phase 2 | missing | vs guide | **Y** | absorb log never | none |

## Rejected almost-findings

| Candidate | Why |
| :--- | :--- |
| Enthroned Void DAMAGE_IMMUNE + ANCHOR step | In-flight **#1094** (sidecar). Distinct from 10-25-005 Glyph Trap 15-to-player |
| Midnight Bishop `magicReflectActive` | In-flight **#1058**. Distinct from 10-25-001 / #852 (Mirror *token*) |
| Boss kit Barrier / Swap / Mark 0-dmg skip | Same kit `spellType: "damage"` + `damage: 0` fallthrough as **10-25-001** |
| Enemy kit Swap → Crush | 10-23-001 `didAct` family |
| PAGES_OF_DOOM `stat: "spell_physical"` | #1035 wrong-key class; starved by 001 + 09-22-001 |
| `apDrainLastTurn` never written | Subsumed by #1094 (Void phase 2 never starts without anchors) |
| MAP_ROTATE / MIRROR_INVERT `newPositions` landing | **09-22-004** / **#858** |
| BOARD_CLAIM 2×2 occupancy vs portal crumbs | **#965** (map snap, not AP tax) |
| INVINCIBLE_PHASE incoming | **10-25-004** |
| INK_VEIL → GLYPH_TRAP 15 to player | **10-25-005** |
| Player Mirror activate / healRecv / Mark×summon | **10-25-001…003** |
| Twin Dawn negative `damageToPlayer` heal | **#948** |
| Paper Windstorm × melee Strike | **#1042** |
| `CURSE_ON_HIT` `stat: "all"` | **#1040** |
| Push/pull × hazard | **08-31-005** REPORT_ONLY |
| Spell observe → unlock | No path (non-finding) |
| White / rest **entry** × `mapsVisited` | Correctly skipped (10-24-006 is BR rooms + rest-**exit**) |

## Prior OPEN (re-verified, not re-filed)

08-31-001/002/005/008, 09-01-001/002/005/006, 09-02-001…006, 09-21-001…004, 09-22-001…004, 09-23-001…004, 09-24-001…004, 09-25-001…004, 09-26-001…004, 09-27-001…004, 09-28-001…004, 09-29-001…004, 10-21-001…009, 10-22-001…004, 10-23-001…004, 10-24-001…007, 10-25-001…005. HEAD still `0f5363f`.

## Missing tests (actionable)

1. `checkPhaseTransition` Pale Archbishop HP 0.49 ⇒ `transitioned`; Enthroned Void HP 0.50 ⇒ false (001).
2. Player Inferno then AI SPELL_MIRROR ⇒ ~90% return and history length 1; three turns ⇒ COMBO_REPLAY > 0 (002).
3. `boardClaimZone` (4,4) + player (4,4) at turn start ⇒ AP max−2; (0,0) ⇒ full (003).
4. Dawn dies, Dusk live ⇒ `monarchAbsorbed`, no victory; Dusk dies ⇒ Absorbed Shadow DoT (004).

Actionable records: [`ACTION_IDS_MIMA_2026-10-26.md`](./ACTION_IDS_MIMA_2026-10-26.md).
