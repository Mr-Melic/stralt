# ACTION_IDs — 2026-10-25 Performance Auditor

Did **not** change WorldExploration, the world RAF schedule, or gameplay timing.
Did **not** re-file PERF-2026-08-31-001..010, 09-01-011..036, 09-02-037..060,
09-21-061..070, 09-22-071..085, 09-23-086..101, 09-24-102..107, 09-25-108..113,
09-26-114..118, 09-27-119..125, 09-28-126..132, 09-29-133..136, 10-21-137..142,
10-22-143..147, 10-23-148..172, 10-24-173..176.

Implemented this increment: PERF-2026-10-25-178 (`ownerTintStroke.ts` +
`pieceArt.ts` summon owner-tint — no open PR touches those files).
WorldExploration still pays per-entity radialGradient drop shadows and
moving-enemy `shadowBlur` (179).

Did **not** restack WorldExploration / occupancy.ts / ChatPanel / soundEngine /
App.tsx / vite.config.js / LandingPage / DraggablePanel / canvasLoopActivity.
Prefer landing already-open SAFE PRs #350, #392/#412, #429, #447, #511, #594,
#643, #687, #745, #797, #841, #889, #966.

## Residual on HEAD (already ledgered; still open in older PRs)

| ID | Still on HEAD | Where it lives |
|---|---|---|
| 061 | Catalog `refetchOnWindowFocus` default true | #350 |
| 062 | `playNoise` still allocates a buffer per hit | #350 |
| 009 / 070 | `callerDokaBalance` staleTime 0; global QC default | HUMAN |
| 148 | Context restore stamps `Date.now` so watchdog never restarts RAF | WX stack |
| 168 | CharacterSelection still inlines `chessPiecePatterns` | #966 |
| 101 | query `withTimeout` dangling 10s timers | #889 |
| 137 | production clickTrace stub | #841 |
| 133 | unused Share Tech Mono + fonts preconnect | #797 |
| 126 | pause class-based infinite HUD CSS while hidden | #745 |
| 173–176 | unique-bridge floods, triple canvas fill, `isOccupied` `.some`, tileCornerCache resize | #1009 |
| 127–132, 134–147, 156–172 | reported on those days | do not re-file |

---

ACTION_ID: PERF-2026-10-25-177
TITLE: Chat polls getMessages every 2s during overworld, including while folded
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/ChatPanel.tsx (fetchMessages ~878–957)
CURRENT_BEHAVIOUR: ChatPanel is always mounted in the world stage. `isPaused` is only `isInBattle || isTransitioning`. The 2s interval already skips a hidden tab, but overworld exploration (the majority of play) still hits `getMessages`, Candid-decodes the full history, and may `setMessages` even when DraggablePanel has unmounted the list DOM. Distinct from PERF-114 (the inner 5s race timer is never cleared) and PERF-081 (folded ChatPanel still builds the 500-row VDOM).
DESIRED_BEHAVIOUR: Do not poll on the 2s cadence while folded; fetch once on unfold. Keep battle/transition pause and hidden-tab skip. Unread badges can refresh on unfold.
EVIDENCE: `setInterval(..., 2000)` ~951; `if (isPaused) return` ~949; `tabVisibleRef` skip inside the tick; GameFlow `isPaused={isInBattle || isTransitioning}` ~277; `defaultFolded={false}` so first paint also polls.
RECOMMENDED_ACTION: ChatPanel is in older #350 / #392 / #447 — union, do not overwrite. Do not change `sendMessage` or unread math except to snapshot on unfold.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Folded chat will not show a live unread bump until unfold (or a slower folded cadence). Players who keep chat open must still see new general messages within ~2s.
VALIDATION_REQUIRED: Overworld walk with chat folded (no getMessages traffic); unfold once and history appears; in-battle pause still stops polling; send while open still round-trips.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-25-178
TITLE: Summon owner-tint outline used canvas shadowBlur every RAF
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/data/ownerTintStroke.ts; src/frontend/src/data/pieceArt.ts; src/frontend/src/data/ownerTintStroke.test.ts
CURRENT_BEHAVIOUR: Every living summon paid `ctx.shadowBlur = 8` plus `shadowColor` on a `strokeRect` during the unified entity pass. Canvas shadowBlur is a GPU blur of the stroked pixels; two player summons plus an enemy summon did that three times per frame on top of the world isometric pass. Distinct from starfield shadowBlur (PERF-001/008/049) and landing-logo cube blur (PERF-054).
DESIRED_BEHAVIOUR: Keep the 2px side-color stroke (green player / red enemy). Do not blur it. Side identity stays the stroke color.
EVIDENCE: pieceArt.ts `strokeOwnerTint` previously set `shadowBlur = 8` then `strokeRect`; `drawCombatant` summon branch always calls it. `pieceArt.ts` is in no older open PR.
RECOMMENDED_ACTION: Keep the stroke-only tint. Do not restack WorldExploration moving-enemy `shadowBlur` (179) in the same change.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Summon aura is a hard outline instead of a soft glow. Color still marks owner side.
VALIDATION_REQUIRED: `node --experimental-strip-types --test src/frontend/src/data/ownerTintStroke.test.ts`; summon a unit in battle; player vs enemy outline colors still differ; no shadowBlur assignment.
STATUS: IMPLEMENTED

---

ACTION_ID: PERF-2026-10-25-179
TITLE: Each living combatant builds a radial-gradient drop shadow every RAF
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (entity pass ~8033–8076)
CURRENT_BEHAVIOUR: For every enemy/summon/boss the unified pass `createRadialGradient` + `ellipse` + `save`/`restore`, then moving units also set `ctx.shadowBlur = 8` around `drawCombatant`. Combined with name/level `strokeText`/`fillText` and PERF-169 sprite-rect alloc. Distinct from 178 (summon owner-tint, now stroke-only) and from 005 (static floor/wall cache).
DESIRED_BEHAVIOUR: One cheap ellipse fill (or a pooled shadow sprite) per unit. Moving-unit emphasis can be a second fill, not shadowBlur. Hit-test rects stay pooled (169).
EVIDENCE: WorldExploration.tsx ~8040 `createRadialGradient` per enemy; ~8057–8060 `shadowBlur = 8` when `enemy.isMoving`.
RECOMMENDED_ACTION: WorldExploration restack. Visual-approved substitute. Do not fold into RAF scheduling.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Feet shadows and walk-glow are combat-readability cues; a flat ellipse can look harsher on dark floors.
VALIDATION_REQUIRED: Desktop and mobile explore + battle screenshots; moving enemy still reads as moving; summon tint from 178 still visible.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-25-180
TITLE: Production console.log on enemy click, battle start, victory, and map gen
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (~4673, ~5099, ~5868, ~6189–6204, ~10224, ~10367, ~12070, ~13730, ~13888)
CURRENT_BEHAVIOUR: `logDebugInfo` is console-gated in production, but raw `console.log` is not. Sprite-cast `[CLICK-ENEMY]` runs on the input path (object alloc + console I/O before `executeCastAttempt`). Battle start logs `[SPELLBAR-BISECT]` even after a DEV-gated twin. Victory allocates id arrays. Portal/map gen logs fire on the already-heavy hitch (142). Distinct from PERF-137 (clickTrace module parse) and PERF-083 (FEATS logs).
DESIRED_BEHAVIOUR: Gate all of these with `import.meta.env.DEV` (or delete). Input and victory paths stay allocation-light in production.
EVIDENCE: `console.log("[CLICK-ENEMY]"...` ~10224 and ~10367; ungated `[SPELLBAR-BISECT]` ~12070 vs DEV-gated copy ~12046; `[VICTORY-GATE]` ~13888; map-gen strings ~4673/5099/5868.
RECOMMENDED_ACTION: WorldExploration restack. Do not change click routing or victory XP. Pair with 137 so production chunks stay free of bisect payloads.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Production debug export still uses `getDebugLogBuffer` / `logDebugInfo`, not these console lines.
VALIDATION_REQUIRED: Production `vite build` has no `[CLICK-ENEMY]` / `[VICTORY-GATE]` strings; DEV serve still prints them; Attack Nearest / sprite cast / recap XP unchanged.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-25-181
TITLE: Overworld wander runs A* then React-commits the world tree from the RAF thread
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (`updateEnemyMovement` ~6880–6996, `findPath` ~4466–4548); src/frontend/src/engine/enemyWander.ts
CURRENT_BEHAVIOUR: `shouldTickEnemyWander` already skips idle frames. When a wander is due, RAF calls `findPath` (linear min-f scan + `splice` on `openSet`, O(n²) on a 16×16) then `syncCombatants` → `setEnemies`. Each tile step therefore reconciles WorldExplorationInner (~19k lines, `render`/`updateEnemyMovement` closures rebuilt because `enemies` is in their deps). Distinct from PERF-006 (battle walk-highlight BFS), PERF-173 (summon unique-bridge floods), and PERF-120 (enemyHpMap).
DESIRED_BEHAVIOUR: Mutate wander pose on refs (canvas already reads combatantsRef). Lift React `enemies` only for HUD that must show a new tile. Pathfinding off the 16ms juice argument — do not change wander interval constants.
EVIDENCE: animate() always calls `updateEnemyMovementRef.current()` ~8791; wander start `findPath` ~6956; `syncCombatants` ~6987; `findPath` lowest-f loop ~4488–4496.
RECOMMENDED_ACTION: Do not land in a perf-only PR. Prompt forbids RAF timing changes; this is commit/pathing cost on the existing tick. Pair with a wander occupancy fixture so two overworld enemies cannot stack.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: If refs advance without `setEnemies`, a stale React snapshot can miss a battle trigger or inspect panel. Encounter collision must read the live ref (it already does via getLiveCombatants in several paths — audit all).
VALIDATION_REQUIRED: Overworld pack wander; walk into an enemy still starts battle; shop freeze still stops wander; no two units on one tile.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-25-182
TITLE: Debug-context effect maps the live roster on every turnOrder identity change
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (debug context effect ~14816–14879); src/frontend/src/components/GameFlow.tsx (`handleDebugContextChange`)
CURRENT_BEHAVIOUR: Every `turnOrder` / `battlePhase` / `currentTurnIndex` change allocates a mapped combatant snapshot plus a `getGeometrySnapshot` closure and writes GameFlow's ref. ChatPanel only reads that ref on Debug Export. Combined with PERF-145 (`flushSync` on `advanceTurn`) this extra map runs in the same turn-hitch. Distinct from PERF-003 (debug log React mirror).
DESIRED_BEHAVIOUR: Keep a ref-only snapshot builder invoked from Export, or update the ref without mapping until Export. Do not re-render ChatPanel (callback is already stable).
EVIDENCE: `onDebugContextChange({ ... combatants: getLiveCombatants(...).map(...) })` ~14818–14831; deps include `turnOrder` ~14875; GameFlow callback only assigns `debugContextRef.current`.
RECOMMENDED_ACTION: WorldExploration restack. Export report must still include live HP/positions when clicked.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Export taken mid-turn could miss the latest death if the snapshot is only built on click and combatantsRef is not read then (it should be).
VALIDATION_REQUIRED: End Turn; Debug Export still lists combatants and geometry; folded chat does not re-render on turn advance (already memo/ref).
STATUS: NEW
