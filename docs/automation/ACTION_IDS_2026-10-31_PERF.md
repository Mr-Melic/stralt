# ACTION_IDs — 2026-10-31 Performance Auditor

## React / subscriptions (earlier on this branch)

Reported: PERF-2026-10-31-215, 216. Report-only; no patches landed.
Do not re-file PERF-001–214 unless reverted.

---

ACTION_ID: PERF-2026-10-31-215
TITLE: ChatPanel input focus effect re-arms on every battle log / message identity change
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/ChatPanel.tsx (~972-999)
CURRENT_BEHAVIOUR: While `!isFolded`, an effect depends on `messages`, `battleLogEntries`, `summonLogEntries`, and `activeEffects.length`. Each new battle-log line (capped 500) schedules `setTimeout(() => inputRef.current?.focus(), 80)` with no cleanup. Competing with canvas / spell targeting focus; uncleared timers after fold/unmount.
DESIRED_BEHAVIOUR: Focus only when `isFolded` flips to false or `activeChannel` changes. Clear the timeout on cleanup / re-run.
EVIDENCE: Effect body gates on `!isFolded` then always schedules focus; deps include full `battleLogEntries` and `messages` arrays.
RECOMMENDED_ACTION: Narrow deps to `[isFolded, activeChannel]`; store timeout id; clear in effect cleanup. Keep unread-clear logic in a separate effect if needed.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Opening chat / switching channel must still focus the input once.
VALIDATION_REQUIRED: Unfold chat; type during battle with battle-log updates — caret stays; no focus steal while targeting.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-31-216
TITLE: Chat poll Promise.race reject timeout is never cleared on success
CATEGORY: runtime-performance
PRIORITY: low
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/ChatPanel.tsx (~878-924)
CURRENT_BEHAVIOUR: `fetchMessages` races `getMessages()` against an anonymous `setTimeout(..., 5000)` rejector. Only the separate `timeoutId` (didTimeout flag) is cleared. Every successful 2s poll leaves a 5s timer until it fires a no-op reject on a settled race.
DESIRED_BEHAVIOUR: Clear both timer ids in `finally` / success and error paths.
EVIDENCE: `clearTimeout(timeoutId)` only; race reject timeout has no handle.
RECOMMENDED_ACTION: `const rejectId = setTimeout(...);` clear both in finally.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Timeout still must abort slow replica calls.
VALIDATION_REQUIRED: Explore 30s with chat open; no growing pending timers (devtools); poll still recovers after a forced timeout.
STATUS: NEW

---

## Canvas / engine (this increment)

Reported this increment: PERF-2026-10-31-217 through 224.
Already ledgered (do not re-file): PERF-2026-08-31-001..010,
PERF-2026-09-01-011..036, PERF-2026-09-02-037..060, and later 071–214
(including Oct 27–29 canvas/React IDs through 214), plus 215–216 above.

Did not re-file still-open big hitters that remain true on `main@0f5363f`:
static tile cache (005), walk BFS every RAF (006/194), portal whirlpools (191),
idle shake alloc (192 — not merged to this tip), AO/shimmer (037/038),
emoji status icons (211), walk diamonds (212), AI boolean[][] remap (213),
null `getContext` width=0 wipe (214).

Constraints honored: no RAF-loop schedule change, no combat-math change,
no indiscriminate memo.

---

ACTION_ID: PERF-2026-10-31-217
TITLE: contextlost cancels RAF; contextrestored never restarts it
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (~13814–13844)
CURRENT_BEHAVIOUR: `handleContextLost` cancels `animationFrameRef` and sets it to `undefined`. `handleContextRestored` resizes the canvas and logs “restarting render loop”, but the comment explicitly skips a manual restart. The canvas stays black until the 1 Hz watchdog notices >2s staleness (PERF-010).
DESIRED_BEHAVIOUR: On restore, after re-applying DPR size, schedule `requestAnimationFrame(animateRef.current)` once. Do not change frame timing or combat tick.
EVIDENCE: Lost path cancels RAF; restore only sets `lastFrameTimeRef` and returns.
RECOMMENDED_ACTION: One-line restart in restore. Distinct from PERF-214 (null getContext wipe) and PERF-044 (dual getContext).
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Double-scheduling if lost never actually cancelled; guard with `animationFrameRef.current == null`.
VALIDATION_REQUIRED: Force context loss/restore (or stub handlers); canvas paints within one frame without waiting for watchdog.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-31-218
TITLE: Full-canvas clearRect plus two opaque fills every RAF
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (~7269–7275)
CURRENT_BEHAVIOUR: Every frame `clearRect` then fills `#0a0c18` then a second full-viewport `rgba(8,10,22,0.55)` overlay. The first fill is already opaque; clearRect is redundant and the dual fill doubles bandwidth.
DESIRED_BEHAVIOUR: Single opaque fill (or one pre-multiplied color). Keep the carved-stone dark slate look.
EVIDENCE: render() immediately after shake translate.
RECOMMENDED_ACTION: Visual-approved single fill. Do not touch RAF scheduling.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Slight mood shift if the 0.55 overlay was intentional vs starfield bleed (starfield is paused in-world via PERF-001/049).
VALIDATION_REQUIRED: Desktop/mobile screenshot of explore and battle backgrounds.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-31-219
TITLE: Per-entity options bag and scale object allocated every RAF
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (~8063–8075, ~8320–8325); src/frontend/src/data/pieceArt.ts (~846–849)
CURRENT_BEHAVIOUR: Each living combatant builds a new `drawCombatant` options object (stable function refs) and `drawCombatant` always allocates `scale = { x, y }` even when both axes are 1. Player path also allocates a fresh colors literal.
DESIRED_BEHAVIOUR: Module/ref-stable options constant; reuse a shared `{x:1,y:1}` when unscaled; reuse player palette object.
EVIDENCE: Entity pass in the unified depth-sorted draw; pieceArt scale literal.
RECOMMENDED_ACTION: Stable options + ZERO_SCALE. Do not change sprite art or y-offset.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Entities with non-1 `scaleX`/`scaleY` must still get a unique scale object.
VALIDATION_REQUIRED: Boss/family/summon/player sprites match; scaled elites still enlarge.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-31-220
TITLE: playNoise builds a fresh Math.random AudioBuffer per SFX
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/engine/soundEngine.ts (~205–225, map_transition ~297–299)
CURRENT_BEHAVIOUR: Every noise voice allocates `createBuffer(sampleRate * duration)` and fills it with `Math.random` in a tight loop. `map_transition` uses 0.6s (~28k samples at 48 kHz) on every portal; multi-note events call `playNoise` more than once.
DESIRED_BEHAVIOUR: Shared reusable noise buffer (or Offline-rendered once); gain/filter envelopes stay per-event.
EVIDENCE: `playNoise` loop writes `data[i] = Math.random() * 2 - 1` before `playEvent("map_transition")`.
RECOMMENDED_ACTION: Cache one long noise buffer; slice via offset/duration. Do not change envelopes or VOICE_CAP.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Identical noise seed across events is fine for SFX; volume/mute prefs unchanged.
VALIDATION_REQUIRED: Portal whoosh, spell_hit, critical_hit still audible; rapid portals do not hitch main thread.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-31-221
TITLE: Walk BFS reallocates dirs[] inside the while loop every node
CATEGORY: runtime-performance
PRIORITY: low
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (~7058–7067)
CURRENT_BEHAVIOUR: `getMpReachableTiles` still runs every walk-mode RAF (PERF-006/194). Inside that BFS, each dequeued node allocates a fresh 4-entry `dirs` array of objects. Distinct from `Array.shift` (194/210).
DESIRED_BEHAVIOUR: Hoist a module-level dirs constant (enemyAI already keeps dirs outside its loop).
EVIDENCE: `const dirs = [{x:1,y:0}, …]` inside `while (queue.length > 0)`.
RECOMMENDED_ACTION: Hoist only. Do not change walk cost or occupancy.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: None if dirs stay cardinal-only.
VALIDATION_REQUIRED: Walk highlight still matches clickable tiles under slime/ice.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-31-222
TITLE: effects.draw litter-allocates a camera object every frame
CATEGORY: runtime-performance
PRIORITY: low
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (~8690); src/frontend/src/engine/effects.ts (~239)
CURRENT_BEHAVIOUR: `effectsManagerRef.current.draw(ctx, { x: 0, y: 0 })` allocates a throwaway camera every RAF. `draw` ignores camera (`_camera`). Distinct from animate’s `cameraRef.current = {x,y}` (191–198 camera alloc).
DESIRED_BEHAVIOUR: Pass a module-level `ZERO_CAMERA` or drop the unused arg.
EVIDENCE: End of render(); EffectsManager.draw signature.
RECOMMENDED_ACTION: Constant. Do not change juice draw order or TTL.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: None — camera is unused in draw.
VALIDATION_REQUIRED: Damage/doka/float text still appear.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-31-223
TITLE: spriteRects rebuild nested drawAnchor/drawSize objects every living sprite
CATEGORY: runtime-performance
PRIORITY: low
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (~8088–8104, ~8337–8353)
CURRENT_BEHAVIOUR: Every living combatant (and the player) writes a new rect plus nested `{x,y}` and `{w,h}` into `spriteRectsRef` after `clear()`. Needed for hit-testing, but nested literals are pure GC.
DESIRED_BEHAVIOUR: Reuse per-id rect records; mutate fields in place; avoid nested allocs.
EVIDENCE: `spriteRectsRef.current.set(enemy.id, { … drawAnchor: {x,y}, drawSize: {w,h} })`.
RECOMMENDED_ACTION: Pool by id. Do not change hit-test padding or drawOrder rules.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Stale rect after death/despawn if pool entries are not cleared.
VALIDATION_REQUIRED: Sprite-first click hits body above tile; summons/player still win overlap ties.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-31-224
TITLE: Overworld wander A* uses openSet.splice and path.unshift
CATEGORY: runtime-performance
PRIORITY: low
CONFIDENCE: medium
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (~4487–4507, ~6945–6956)
CURRENT_BEHAVIOUR: When a wandering enemy starts a move, `findPath` scans openSet for lowest f then `splice`s, and reconstructs with `path.unshift` (O(n²)). Called from `updateEnemyMovement` on the RAF path while not in battle.
DESIRED_BEHAVIOUR: Binary heap or swap-remove; reconstruct with push+reverse. Do not change passability.
EVIDENCE: findPath while-loop; updateEnemyMovement calls findPath when `nextMoveTime` fires.
RECOMMENDED_ACTION: Optional. Not battle AI (enemyAI BFS is PERF-210).
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: Wrong wander paths if heap comparator flips.
VALIDATION_REQUIRED: Overworld wander still reaches walkable tiles; battle pathing unchanged.
STATUS: NEW

---

## Still open on this SHA (already numbered; re-verified)

- PERF-2026-08-31-005 — static isometric tile / hazard pixel cache (dominant canvas CPU)
- PERF-2026-08-31-006 / walk BFS every RAF + applyMpCost(Math.random)
- PERF-2026-08-31-009 — `useGetCallerDokaBalance` `staleTime: 0`; default `refetchOnWindowFocus`
- PERF-2026-09-02-057 / 10-28-204 — closed BuffShop still `loadInventory` / `saveInventory`
- PERF-2026-09-02-060 / 10-28-203 — closed AchievementsPanel still dual-subscribes feats queries
- PERF-2026-10-28-192 — idle `getShakeOffset` ZERO reuse (absent on this tip)
- PERF-2026-10-28-201 — chat poll during Game Over (landed on other branches; re-verify tip)
- PERF-2026-10-28-202 — DraggablePanel drag still `offsetWidth`/`offsetHeight` every mousemove
- PERF-2026-10-28-206 — Chat `isFolded` vs DraggablePanel restored `folded` desync
- PERF-2026-10-29-210..214 — enemyAI shift; emoji status; walk diamonds; AI remap; width=0 wipe
