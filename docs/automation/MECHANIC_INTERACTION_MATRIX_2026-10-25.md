# Mechanic interaction matrix — 2026-10-25

**Auditor:** Mechanic Interaction Matrix Auditor  
**HEAD:** `0f5363f` (unchanged since #332 / 09-21…10-24)  
**Gameplay code:** not modified.

Pairs are scored only when current source shows a real join. “Watch enemy cast → unlock spell” still does not exist. Push/pull remain unwired (08-31-005). Blood Moon and Mirror Field **are** wired in `resolvePlayerCast` (Sacrifice skip is 10-21-009; player DoT skip is 10-22-001; Swap skip is 10-23-003; summon kit skip is 10-24-001).

## Priority surfaces on this HEAD

Main has not moved since #332. This hunt targeted leftover **live** splits that 10-24 did not score: the Mirror **activate** writer vs a live consume path, `healRecv` consumers vs kit Cursed Wound, Mark vs summon `enemyTakesDamage`, and two boss-phase flags that persist (or would persist after 09-22-001) with no combat reader. In-flight **#1040** / **#1042** / **#1035** own curse-`all`, Windstorm melee, and Exsanguinated’s wrong stat key — not cloned.

## New ACTION_IDs

`docs/automation/ACTION_IDS_MIMA_2026-10-25.md` 001–005.

| Pair | Should | Do | Deterministic | Contradict | Bypass | Feedback | Tests |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Mirror spell × Void Mirror consume | activate `"player"` token | self-cast never enters `isMirror` | missing | vs enemy-kit consume | **Y** (4 AP no-op) | no “Mirror active” | token key only |
| Attack Nearest × Mirror (self defense) | caster tile | hostile search, range 0 abort | **Y** | vs Blood Mend AN | cannot activate | no-target flash | none |
| Boss kit Mirror × activate | boss-side or player token | 0-dmg `spellType: damage` skip | missing | vs kit copy | wasted turn | kit log none | none |
| Cursed Wound `healRecv` × potion/Drain/Wisp | all player heals ×0.5 | Blood Mend only | missing | vs kit log | **Y** | “−50% HEALRECV” | none |
| Mark × summon kit / `enemyTakesDamage` | next player-side hit ×2 | player `calculatePlayerDamage` only | missing | vs Mark copy | summon 1×, mark stays | mark still painted | none |
| INVINCIBLE_PHASE × incoming HP | 0 dmg while flag > 0 | flag + skip log only | missing | vs Shell/Reflect readers | **Y** | “impervious” | none |
| INK_VEIL glyphs × attack/walk/summon | GLYPH_TRAP 15 | state merge, no consume | missing | vs guide | **Y** | glyphs invisible | none |

## Rejected almost-findings

| Candidate | Why |
| :--- | :--- |
| Paper Windstorm × melee Strike | **#1042** sidecar (unwired). PXA still owns announce vs 30%/50% / unused range-halve |
| `CURSE_ON_HIT` `stat: "all"` | **#1040** |
| Exsanguinated `stat: "healing"` | **#1035** |
| Player Cursed Wound never applying `healRecv` outbound | **EBMA-004** (`resolvePlayerCast` drop of `debuffStat`) |
| Iron Curse heal ×0.5 | **09-23-004** |
| Mending Mist HP copy | **09-24-001** / 09-21 player turn-start exclusion — not a `healRecv` miss |
| Kit `new Map()` starving phase abilities | **09-22-001** (004/005 depend on it for *reachability*, not the consume hole) |
| WX drop of `damageToTargets` / shock / larvae / illusions | **09-22-004** |
| Mark skip on Poison Arrow / Sacrifice / Swap | **09-29-001** |
| Mark consume-before-HP recalc | **10-21-007** |
| Boss kit skip of Windstorm / Mirror **consume** | **10-24-002** (activate writer is 001) |
| Slow/Weaken × summon budget | **10-24-004** |
| Push/pull × hazard | **08-31-005** REPORT_ONLY |
| Spell observe → unlock | No path (non-finding) |
| White / rest **entry** × `mapsVisited` | Correctly skipped (10-24-006 is BR rooms + rest-**exit**) |

## Missing tests (actionable)

1. `resolvePlayerCast` Mirror on the player tile ⇒ `activateMirror` / `"player"` token, AP spent (001).
2. Attack Nearest with Mirror selected ⇒ caster tile, token set (001).
3. Midnight Bishop kit Mirror ⇒ token or explicit no-op log, not a silent turn (001).
4. `healRecv` 0.5 × Health Potion / Life Drain / Wisp ⇒ half restore; Blood Mend still half (002).
5. Marked tile + controlled/AI kit hit ⇒ 2× and key cleared; DoT tick does not clear (003).
6. `invincibleTurnsLeft > 0` + Strike on Final Pawn ⇒ HP unchanged (004).
7. Seeded `glyphedTiles` cell + player Strike / wolf melee ⇒ 15 HP and glyph removed (005).

Actionable records: [`ACTION_IDS_MIMA_2026-10-25.md`](./ACTION_IDS_MIMA_2026-10-25.md).
