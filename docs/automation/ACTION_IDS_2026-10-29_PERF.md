# ACTION_IDs — 2026-10-29 Performance Auditor (canvas / engine)

Scope: `src/frontend/src/engine/*.ts`, `StarfieldBackground`, `BloodParticles`,
`LandingPage`, `barrierRender`, `effects.ts`, `occupancy.ts`, `pieceArt.ts`,
`soundEngine.ts`, and WorldExploration canvas/RAF-adjacent call sites
(**report only** for WX — do not suggest RAF scheduler or gameplay-timing edits).

Do not re-file PERF-2026-08-31-001 … PERF-2026-10-28-204.

Explicit residuals **not** re-reported: portal whirlpools 191, shake 192
(implemented elsewhere), walk BFS `shift` 193, camera alloc 194, portalColors
195, landing rgb strings 196, portal labels 197, portal draw closures 198,
canvas RO 199, Game Over watchdog 200, floor shimmer/AO/grain 005/036/037/038,
dust/doka/labels/leader particles 040/043/046/048, occupancy BFS 189,
combatant fillRect 184, barrier 6-layer 185, idle juice skip 183, fractional
DPR 187, chat scrollHeight 190, spellbook grid 186.

This run: report NEW PERF-205 … PERF-209 only. No implementation.

---

ACTION_ID: PERF-2026-10-29-205
TITLE: Enemy-AI reachability / cast-tile BFS still Array.shift-pops every enemy turn
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/engine/enemyAI.ts (`computeReachable` ~L375–376; `findNearestLegalCastTile` ~L808–809)
CURRENT_BEHAVIOUR: Both BFSes dequeue with `queue.shift()`. On a full pack turn each living enemy can run `computeReachable` (and often `findNearestLegalCastTile`) over a step-budget frontier; every dequeue copies the remainder of the queue. Distinct from PERF-193 (WorldExploration walk-mode `getMpReachableTiles` shift on the player walk highlight path) and PERF-189 (occupancy `floodPassable` shift).
DESIRED_BEHAVIOUR: Index-cursor or ring buffer dequeue (O(1)); keep reachable / legal-cast semantics identical.
EVIDENCE: `enemyAI.ts` L376 `const cur = queue.shift()!` inside `computeReachable`; L809 same pattern in `findNearestLegalCastTile`. Callers are enemy/summoner decide paths during battle turns.
RECOMMENDED_ACTION: Replace `shift` with a head index in both loops. Add a small unit test that reachable sets match for a fixed grid. Do not change ENEMY_REACHABLE_STEP_BUDGET or LoS rules.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Wrong dequeue order would change move-then-cast tile choice; lock with geometry tests.
VALIDATION_REQUIRED: Pack fight with casters/chargers; move-then-cast still lands in range; `enemyAI.geometry` / walkMp tests pass; typecheck.
DISJOINT_HELPER: Yes — only `enemyAI.ts` (+ tests). Not a stacked WorldExploration edit.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-29-206
TITLE: Battle status icons fillText emoji + roundRect per combatant every RAF
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (enemy icons ~L8240–8281; player icons ~L8356–8397)
CURRENT_BEHAVIOUR: While `inBattleRef`, every drawn combatant with active effects filters `activeEffectsRef`, then for up to 4 effects runs `roundRect` + `fillText(eff.iconEmoji, …)`. Canvas emoji text shaping is expensive and repeats every frame for the whole pack. Distinct from PERF-197 (dungeon portal `measureText` labels) and PERF-046 (floating combat labels).
DESIRED_BEHAVIOUR: Cache pre-rasterized icon bitmaps (or a small atlas) keyed by emoji/type; blit with `drawImage`. Keep pill colour / overflow `+N` behaviour.
EVIDENCE: L8263–8268 enemy `roundRect` + `fillText(eff.iconEmoji)`; L8379–8384 player mirror. Both sit inside the per-frame depth-sorted entity pass.
RECOMMENDED_ACTION: Offscreen atlas helper; WorldExploration only swaps draw calls. Do not change effect apply/tick rules. Report-only for WX stack — do not land RAF edits here.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Icon colour / overflow badge / DoT vs buff palette must stay readable at battle zoom.
VALIDATION_REQUIRED: Apply multi-DoT + buff on player and several enemies; icons stay aligned; no per-frame text thrash in a profile.
DISJOINT_HELPER: Partial — atlas helper can live outside WX; call sites are stacked WorldExploration.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-29-207
TITLE: Walk/spell highlight pass stroke-fills a full iso diamond for every matching tile every RAF
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (MP green ~L7659–7679; spell blue ~L7686–7707; sets computed ~L7341–7350)
CURRENT_BEHAVIOUR: During walk or attack mode the floor pass, for every grid cell, builds `` `${x},${y}` `` and on hit runs `beginPath` + 4 `lineTo` + `fill` + `stroke` (save/restore). A mid-MP walk ring or spell diamond therefore pays dozens of path strokes every frame on top of PERF-193’s BFS cost. Distinct from 193 (queue `shift` inside BFS) and from hover glow (single tile radial).
DESIRED_BEHAVIOUR: Iterate the highlight Set once (or reuse a cached path / fillStyle batch); avoid per-tile string keys and redundant stroke work when the set is unchanged.
EVIDENCE: L7660–7678 green MP diamond; L7687–7706 blue spell diamond; sets refreshed each render at L7341–7350.
RECOMMENDED_ACTION: Draw from the Set’s cells via `gridToScreen` instead of scanning the full grid with string keys; optional Path2D cache keyed by mode+version. Do not change walk/spell legality. WX stacked — report only.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Highlight must still match click gates after MP spend / barriers / summon control.
VALIDATION_REQUIRED: Walk ring and spell range match clicks; summon-control origin still correct; no flicker with slime/frozen cost.
DISJOINT_HELPER: Partial — iso-diamond Path2D helper can be disjoint; WX must call it (stacked).
STATUS: NEW

---

ACTION_ID: PERF-2026-10-29-208
TITLE: Pack-enemy turns remap the full map into a fresh boolean[][] every decideEnemyAction
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (enemy-turn AI setup ~L16304–16307)
CURRENT_BEHAVIOUR: Before each enemy decide, WX does `(currentMap?.tiles ?? []).map((row) => (row ?? []).map((t) => t !== "wall"))`, allocating a full `boolean[][]` plus every row array. A 6–8 enemy pack therefore rebuilds the walkability grid many times per round even though tiles only change on map transition / barrier place. Distinct from PERF-022 (highlight Set/Map rebuilds) and from occupancy’s own grid consumers.
DESIRED_BEHAVIOUR: Cache `aiGrid` until `currentMap` identity / barrier version / void set changes; reuse across enemies in the same round.
EVIDENCE: L16304–16307 builds `aiGrid` immediately before `DecideEnemyContext` assembly inside the per-enemy turn body.
RECOMMENDED_ACTION: Memoize behind a map/barrier version ref; invalidate on barrier place/expire and map swap. Do not change `isCellFree` semantics. WX stacked — report only.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Stale true cells after barrier place would let AI path through walls; invalidation must cover barrier + void + portal edits.
VALIDATION_REQUIRED: Barrier spell mid-fight; AI refuses barrier tiles; portal/void still blocked; multi-enemy round hitch shrinks.
DISJOINT_HELPER: Partial — `buildWalkabilityGrid(tiles)` + versioned cache helper can be disjoint; WX must own invalidation (stacked).
STATUS: NEW

---

ACTION_ID: PERF-2026-10-29-209
TITLE: Null getContext recovery assigns canvas.width = 0 then restores (full buffer wipe)
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: medium
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (`render` null-ctx recovery ~L7219–7229)
CURRENT_BEHAVIOUR: When `canvas.getContext("2d")` returns null under GPU pressure, recovery sets `canvas.width = 0` then restores the previous width. Assigning `width` reallocates / clears the backing store. If null persists across frames, every render attempt pays a full buffer tear-down/rebuild and a black flash — compounding PERF-200’s Game Over null-canvas watchdog path (different site: animate’s `_animCtx` at ~8747 does not wipe). Distinct from PERF-187 (fractional-DPR resize clear on the happy path).
DESIRED_BEHAVIOUR: Rate-limit recovery; prefer `contextlost` / restore handlers; avoid width-thrash every frame while null.
EVIDENCE: L7224–7229 null branch; comment documents GPU-pressure intent. Animate null path at L8747–8759 returns without this wipe.
RECOMMENDED_ACTION: Report only — do not change recovery without a GPU-loss repro. If fixed later: backoff + single restore attempt per lost event.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: Removing the wipe without a real restore path can leave a permanently black canvas after context loss.
VALIDATION_REQUIRED: Forced context loss (devtool / DPR thrash); canvas recovers once without per-frame flicker; normal play unchanged.
DISJOINT_HELPER: No — WorldExploration render recovery only.
STATUS: NEW
