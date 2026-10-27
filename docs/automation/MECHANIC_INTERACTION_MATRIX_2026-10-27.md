# Mechanic interaction matrix — 2026-10-27

**Auditor:** Mechanic Interaction Matrix Auditor  
**HEAD:** `0f5363f` (unchanged since #332 / 09-21…10-26)  
**Gameplay code:** not modified.

Pairs are scored only when current source shows a real join. “Watch enemy cast → unlock spell” still does not exist. Push/pull remain unwired (08-31-005). Blood Moon and Mirror Field **are** wired in `resolvePlayerCast` (Sacrifice skip is 10-21-009; player DoT skip is 10-22-001; Swap skip is 10-23-003; summon kit skip is 10-24-001).

## Priority surfaces on this HEAD

Main has not moved since #332. This hunt targeted leftover **live** splits that 10-26 did not score: the boss WX consume of `type: "move"` / `"attack"` versus `abilityResult.newBossPosition`, Alabaster’s player-cast resonance buffer, Broodmother explode-on-step versus persisted larva coords, Archbishop reflect duration versus the 3-turn log, and Fetid SPLIT_ROOKS death/revive. In-flight **#1131** / **#1062** / **#1012** / **#1035** / **#1040** / **#1042** / **#1058** / **#1094** / **#1152** / **#852** / **#858** / **#965** / **#948** are not cloned.

## New ACTION_IDs

`docs/automation/ACTION_IDS_MIMA_2026-10-27.md` 001–005.

| Pair | Should | Do | Deterministic | Contradict | Bypass | Feedback | Tests |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Boss `type: move/attack` × WX consume | step / melee HP | only `newBossPosition` / `damageToPlayer` | **Y** (no-op) | log “attacks/rushes” vs 0 | **Y** (statue) | log lies | **none** |
| Player casts × RESONANCE_SHOCKWAVE | 5-cast 20% accum | counter/accum never written; AI waits for ≥5 | missing | vs guide | **Y** | “blast radius” never | none |
| Walk/Swap/destack × LARVAE_EXPLODE | 5×3 DoT on larva cell | no stepper reads `bossState.larvae` | missing | vs AI comment + guide | **Y** | explode log never | none |
| REFLECT_SHIELD × 3-turn duration | expire after 3 | `turnsLeft` written, never decremented | **Y** (forever) | vs “wait to expire” | **Y** | 30% forever | none |
| SPLIT_ROOKS × death/revive | 2 bodies; sibling revive or honest copy | original + 2 minions; death pipeline ignores | missing | log vs guide vs board | **Y** | revive sentence lies | none |

## Rejected almost-findings

| Candidate | Why |
| :--- | :--- |
| ILLUSION_SPLIT × `illusionsRef` targeting | **09-22-004** drops `newIllusions`; persisted `newBossState.illusions` has no extra unique consume beyond that |
| MAP_ROTATE / MIRROR_INVERT `newPositions` | **09-22-004** / **#858** |
| BOARD_CLAIM later AP | **10-26-003** / **#1131** |
| SPELL_MIRROR player buffer | **10-26-002** / **#1131** |
| Twin death × MONARCH_ABSORB | **10-26-004** / **#1131** |
| Generic HP phase-2 reader | **10-26-001** / **#1131** |
| Enthroned Void DAMAGE_IMMUNE + ANCHOR | **#1094** |
| Midnight Bishop `magicReflectActive` | **#1058** |
| Phantom Spawn HP stamp 20 | **#1152** (do not fold into 005) |
| CURSE_ON_HIT `stat: "all"` | **#1040** |
| PAGES_OF_DOOM `spell_physical` + school counts | **#1035**; same player-cast-buffer class as 002, different key |
| INVINCIBLE_PHASE incoming | **10-25-004** (Final Pawn *does* decrement `invincibleTurnsLeft` — contrast for 004) |
| INK_VEIL → GLYPH_TRAP | **10-25-005** |
| Shell Armor / Reflect on summon-kit `dealDamage` | 10-24-001 family (player-cast loop skip) |
| BOARD_SHRINK tiles still walkable | Phase-2 edge 5-dmg is real `damageToPlayer`; “shrink” copy is PXA-adjacent, not a missing consume of a persisted zone (unlike 10-26-003) |
| ADVANCE_PER_TURN onto occupied cells | Subsumed by 001 once `newBossPosition` is the live mover; occupancy avoid is 09-02-002 class |
| Push/pull × hazard | **08-31-005** REPORT_ONLY |
| Spell observe → unlock | No path (non-finding) |
| White / rest **entry** × `mapsVisited` | Correctly skipped (10-24-006 is BR rooms + rest-**exit**) |

## Prior OPEN (re-verified, not re-filed)

08-31-001/002/005/008, 09-01-001/002/005/006, 09-02-001…006, 09-21-001…004, 09-22-001…004, 09-23-001…004, 09-24-001…004, 09-25-001…004, 09-26-001…004, 09-27-001…004, 09-28-001…004, 09-29-001…004, 10-21-001…009, 10-22-001…004, 10-23-001…004, 10-24-001…007, 10-25-001…005, 10-26-001…004. HEAD still `0f5363f`.

## Missing tests (actionable)

1. Boss consume: `moveToward` dest ≠ current cell; `attackPlayer` adjacent ⇒ player HP drops; Countess lava on vacated tile (001).
2. Five player Strikes vs Alabaster then AI shockwave ⇒ `floor(sum * 0.2)`; no casts ⇒ no shock (002).
3. Player step on `bossState.larvae` (4,4) ⇒ DoT 5×3 and larva removed; neighbor floor ⇒ no DoT (003).
4. REFLECT_SHIELD then three Archbishop turns ⇒ flag false; first Strike still reflects 30% (004).
5. After SPLIT_ROOKS, Fetid-side count is 2; kill minion A, sibling live ⇒ revive **or** documented no-revive; wolf death ⇒ no revive (005).

Actionable records: [`ACTION_IDS_MIMA_2026-10-27.md`](./ACTION_IDS_MIMA_2026-10-27.md).
