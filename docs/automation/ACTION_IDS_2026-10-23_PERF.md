# ACTION_IDs — 2026-10-23 Performance Auditor

Did **not** change WorldExploration, the world RAF schedule, or gameplay timing.
Did **not** re-file PERF-2026-08-31-001..010, 09-01-011..036, 09-02-037..060,
09-21-061..070, 09-22-071..085, 09-23-086..101, 09-24-102..107, 09-25-108..113,
09-26-114..118, 09-27-119..125, 09-28-126..132, 09-29-133..136, 10-21-137..142,
10-22-143..147.

No SAFE disjoint implementation this increment: remaining player-visible
fixes sit on WorldExploration / ChatPanel / soundEngine / App.tsx /
vite.config.js / LandingPage / DraggablePanel / canvasLoopActivity, all
already in the oldest-first stack. Prefer landing already-open SAFE PRs
#350, #392/#412, #429, #447, #511, #594, #643, #687, #745, #797, #841, #889.

Draft IDs that duplicated 063/089/101/102/105/114/121/122/#438 were discarded
(same-day explorers re-filed them as 149–155, 157, 159, 162, 163).
`loadTierConfig` cache was **not** landed: older #438 deletes the unused
module cache on the same function; returning a cached object is also
mutation-risky vs today's `{ ...DEFAULT, ...parse }` copy.

## Residual on HEAD (already ledgered; still open in older PRs)

| ID | Still on HEAD | Where it lives |
|---|---|---|
| 061 | Catalog `refetchOnWindowFocus` default true | #350 |
| 062 | `playNoise` still allocates a buffer per hit | #350 |
| 009 / 070 | `callerDokaBalance` staleTime 0; global QC default | HUMAN |
| 081 | Folded chat still evaluates 500-row JSX | ChatPanel stack |
| 114 | Chat poll 5s race timer never cleared | ChatPanel stack |
| 083 | `[FEATS] UNLOCK/CLAIM` `console.log` | #392 |
| 085 | Leaderboard focus refetch | #392 |
| 094–096 | useIsMobile equality, profile focus, debug mount copy | #447 |
| 102 | Starfield resize rebuild | #511 |
| 108–109 | debug ring overflow; userRole focus | #594 |
| 115 / 118 | App small-screen equality; toaster theme | #643 |
| 121 | landing chessDrift CSS while hidden | #687 |
| 126 | pause class-based infinite HUD CSS while hidden | #745 |
| 133 | unused Share Tech Mono + fonts preconnect | #797 |
| 137 | production clickTrace stub | #841 |
| 101 | query `withTimeout` dangling 10s timers | #889 |
| 127–132, 134–136, 138–147 | reported on those days | do not re-file |

---

ACTION_ID: PERF-2026-10-23-148
TITLE: Context-lost cancels RAF; restore stamps Date.now so the watchdog never restarts
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (context handlers ~13806–13866, watchdog ~13776–13791, animate ~8744)
CURRENT_BEHAVIOUR: `handleContextLost` cancels `animationFrameRef` (sets it undefined). `handleContextRestored` resizes the canvas, then sets `lastFrameTimeRef.current = Date.now()` and comments that the single RAF loop continues — nothing schedules a frame. The 1 Hz watchdog restarts only when `performance.now() - lastFrameTime > 2000`. After restore that subtraction is `performance.now() - Date.now()` (epoch vs navigation clock) and is a huge **negative**, so the watchdog never trips. Player-visible permanent black canvas after GPU reclaim (tab background, mobile). Distinct from PERF-010 (watchdog exists) and PERF-143 (RAF while hidden).
DESIRED_BEHAVIOUR: On restore, stamp `performance.now()` (same clock as animate/watchdog) and `requestAnimationFrame(animateRef.current)` when no frame is queued. Do not change tick math or the 16ms juice argument.
EVIDENCE: lost path cancels RAF ~13819–13821; restore ~13842 `Date.now()`; animate and watchdog use `performance.now()` (~8744, ~13779); initial ref also `Date.now()` ~1805 (overwritten on loop start).
RECOMMENDED_ACTION: Do not land in a perf-only PR. WorldExploration is in the oldest-first combat/map stack. Prompt forbids RAF-loop timing changes; this is a restore correctness hole, not an optimization. Pair with a contextlost/restored fixture.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: Double-start if a frame was already queued; guard on `animationFrameRef.current == null`. Using window size instead of the container rect on restore is a separate mismatch (pairs with PERF-144).
VALIDATION_REQUIRED: Dispatch contextlost then contextrestored; canvas paints the next frame without a black screen; turn timer and walk path still match wall-clock policy.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-23-156
TITLE: Attack Nearest window keydown rebinds whenever activeSpells identity churns
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (attackNearestEnemy deps ~17356; keydown effect ~17356–17375)
CURRENT_BEHAVIOUR: A window `keydown` listener is attached in an effect whose only dep is `attackNearestEnemy`. That callback lists `activeSpells` / `activeMapModifierTypes`. PERF-086 already notes `filteredBackendSpells` is a new array every WorldExploration setState, so `activeSpells` identity changes on the 1 Hz turn timer and 10s HP regen — each time the listener is removed and re-added. Distinct from PERF-087 (canAttackNearest LoS IIFE in JSX) and from PERF-011 (panel drag listeners).
DESIRED_BEHAVIOUR: Keep one window listener for the world session; read spells/modifiers from refs inside the handler (same pattern as hover). Hotkey gating unchanged.
EVIDENCE: `useEffect(() => { window.addEventListener("keydown", onKey); ... }, [attackNearestEnemy])`; `attackNearestEnemy` deps include `activeSpells`.
RECOMMENDED_ACTION: Restack with 086. Do not change Attack Nearest hit rules or the hotkey matcher.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: A stale ref could fire Attack Nearest with a retired spell or ignore Time Warp AP. Listener must still detach on unmount.
VALIDATION_REQUIRED: Press the hotkey after spending AP, after a catalog update, and after End Turn; no doubled casts; unmount leaves no listener.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-23-158
TITLE: Each DraggablePanel registers its own window resize and orientationchange listeners
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/DraggablePanel.tsx (~592–612)
CURRENT_BEHAVIOUR: Every mounted panel (chat, settings, map-modifiers, battle-ui, initiative, stats) adds `resize` + `orientationchange`. The handler short-circuits when clamp is a no-op, but still reads `offsetWidth`/`offsetHeight` per panel — six forced layout reads on a mobile URL-bar resize under the live canvas. Distinct from PERF-011 (drag listeners attach-on-start), PERF-082/#429 (shared getUserUiLayout), and PERF-092/094/115 (other resize equality guards).
DESIRED_BEHAVIOUR: One shared resize multiplexer, or rAF-coalesce clamp across instances. Snap math unchanged.
EVIDENCE: DraggablePanel.tsx `window.addEventListener("resize", onResize)` plus `orientationchange` in a per-instance effect.
RECOMMENDED_ACTION: Do not land here — DraggablePanel is in #429. Union, do not overwrite the layout-fetch hunk.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Panels must still clamp on rotate; folded width changes must still snap.
VALIDATION_REQUIRED: Rotate a phone in-world; drag a panel near the edge; positions stay on-screen; #429 still shares one getUserUiLayout.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-23-161
TITLE: Attack Nearest no-target flash timeouts are never cleared
CATEGORY: runtime-performance
PRIORITY: low
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (~17300–17301, ~17317–17318, ~19015)
CURRENT_BEHAVIOUR: A rejected Attack Nearest calls `setNoTargetFlash(true)` then a bare `setTimeout(..., 1200)` to clear it. Rapid misses stack timers; leaving the world mid-flash can `setState` after unmount. Distinct from PERF-087 (button enable IIFE).
DESIRED_BEHAVIOUR: One timeout ref; clear on a new flash, on unmount, and on battle exit. Flash duration stays 1200ms.
EVIDENCE: Two identical `setTimeout(() => setNoTargetFlash(false), 1200)` sites with no ref/cleanup.
RECOMMENDED_ACTION: WorldExploration restack. Do not change the reject copy or Attack Nearest targeting.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Flash must still last 1.2s after the last miss; unmount must not warn.
VALIDATION_REQUIRED: Spam Attack Nearest with no target; flash does not stick; leave world during flash; no React warning.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-23-164
TITLE: Canvas mousemove forces layout via getBoundingClientRect before the hover tile guard
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (`clientToGrid` ~8921–8925; `handleCanvasMouseMove` ~10661–10693)
CURRENT_BEHAVIOUR: Every canvas `mousemove` calls `clientToGrid`, which always `canvas.getBoundingClientRect()` (layout) then diamond tests. The hover-tile equality guard runs **after** that. Attack-mode then also scans live combatants (PERF-129). Combined input-latency cost on mobile while RAF is painting. Distinct from PERF-002 (hover is already ref-only) and PERF-129 (the occupant `.find`).
DESIRED_BEHAVIOUR: Cache the rect until ResizeObserver/scroll, or skip `clientToGrid` when client pixels have not moved enough to leave the current diamond. Do not change hit-test geometry.
EVIDENCE: `handleCanvasMouseMove` → `clientToGrid(event.clientX, event.clientY)` with no movement threshold; `getBoundingClientRect` at ~8925. Click/touch paths also use `clientToGrid` (acceptable).
RECOMMENDED_ACTION: WorldExploration restack. Pair with 129 so attack-mode occupant scans stay inside the tile-change guard.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: A stale rect after panel snap or URL-bar resize mis-aims the hover diamond vs click. Cache must invalidate on the existing 50ms canvas ResizeObserver.
VALIDATION_REQUIRED: Hover walk/attack diamonds track the cursor after rotate; click-to-walk still matches; profiler shows no layout per mousemove while the pointer stays in one tile.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-23-167
TITLE: Landing title builds cubes with getImageData plus a nested edge walk on mount
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/LandingPage.tsx (SkateStyleTitle ~63–137)
CURRENT_BEHAVIOUR: On mount, each letter of "ÆSTRALTØ" is rasterized to a temp canvas, `getImageData` copied, then sampled at step 3 with a 4px nested inside-edge walk and `Math.random` cube spawn. That is a main-thread hitch on first landing paint, concurrent with Starfield createStars (PERF-102) and 12 chessDrift pieces (PERF-072/121). Distinct from PERF-054/042 (per-frame cube shadowBlur) and PERF-075 (per-frame strokeText of static outlines).
DESIRED_BEHAVIOUR: Bake cube positions once (module constant or ImageBitmap) so login does not re-scan glyphs. Keep flicker RAF (058) and glow look (054).
EVIDENCE: SkateStyleTitle effect: `getImageData` ~75 then nested `checkRadius = 4` loops ~100–122.
RECOMMENDED_ACTION: Visual-approved bake. LandingPage is in #687 (chessDrift pause) — union, do not overwrite.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Cube density and letter silhouettes are brand-defining. A baked table must match current ÆSTRALTØ outlines at 140px Arial.
VALIDATION_REQUIRED: Side-by-side landing screenshot desktop and a narrow viewport; Sign In still works; title RAF still pauses when hidden.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-23-168
TITLE: Character select still inlines a full copy of chessPiecePatterns
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/CharacterSelection.tsx (~44–300); src/frontend/src/data/pieceArt.ts (`chessPiecePatterns`)
CURRENT_BEHAVIOUR: `pieceArt.ts` is documented as the single source of truth; CharacterCreation already imports `chessPiecePatterns`. CharacterSelection still embeds ~256 lines of the same king/pawn/… view tables, so the lobby chunk parses the art twice while Starfield + per-slot BloodParticles (PERF-041) already run. Distinct from PERF-078 (preview strokeRect per pixel) and PERF-139 (GameFlow still parses WorldExploration).
DESIRED_BEHAVIOUR: Import `chessPiecePatterns` from pieceArt (same as creation). Preview draw path unchanged.
EVIDENCE: CharacterSelection.tsx `const CHESS_PIECE_PATTERNS = { king: { front: [...]`; CharacterCreation.tsx `import { chessPiecePatterns } from "../data/pieceArt"`; pieceArt comment says former inline copies in WX and CharacterCreation were removed.
RECOMMENDED_ACTION: Replace the local table with the pieceArt import. CharacterSelection is in older a11y PRs — union. Spot-check that view keys (`front/right/back/left`) match `ChessPieceData`.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: A drifted local table would silently change lobby previews if the files are no longer byte-identical on some piece/view.
VALIDATION_REQUIRED: 1- and 3-slot select; rotate piece views; colors match creation; Play still hydrates.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-23-169
TITLE: Sprite hit-rects allocate a new object per living entity every frame
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (~8088–8104)
CURRENT_BEHAVIOUR: The unified entity pass does `spriteRectsRef.current.set(enemy.id, { x, y, w, h, drawOrder, id, kind, logicalX, logicalY, isAlive, drawAnchor: {x,y}, drawSize: {w,h} })` every RAF for every living combatant. Combat GC on mobile. Distinct from PERF-002 (hover refs) and PERF-039 (depth-sort copies).
DESIRED_BEHAVIOUR: Reuse a pooled rect per id; mutate fields in place; delete entries for dead/despawned ids (cleanupMap already drops the map). Hit-test math unchanged.
EVIDENCE: New object + nested `drawAnchor`/`drawSize` literals inside the per-entity draw block.
RECOMMENDED_ACTION: WorldExploration restack. Do not change sprite-first hit testing (#427 extracts it).
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Stale rects after death/fade can steal clicks. Must delete or mark `isAlive` false when the entity leaves the pass.
VALIDATION_REQUIRED: Click a sprite, a tile behind a sprite, and a corpse; Attack Nearest still uses player tile; summon-control hits the summon body.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-23-172
TITLE: Boss portal entry JSON.parse of pbv_boss_configs on the main thread
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (~6481–6492)
CURRENT_BEHAVIOUR: After map generation (PERF-142 CA/flood hitch), a boss portal additionally `localStorage.getItem("pbv_boss_configs")` + `JSON.parse` of the full admin array, then `.find` by id. Distinct from 142 (map solvability) and from #438/`loadTierConfig` (tier blob, different key).
DESIRED_BEHAVIOUR: Cache parsed configs by raw string (invalidate on admin save). Keep DEFAULT_BOSS_CONFIGS fallback. Do not skip `finalizePlayableLayout`.
EVIDENCE: Portal success path ~6486–6492; parse is inside the already-heavy map-transition task.
RECOMMENDED_ACTION: WorldExploration restack. Do not share a helper with `loadTierConfig` until #438 lands (that PR deletes the unused tier cache).
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Stale boss HP/name if admin save does not change the localStorage string identity (it should). Wrong id match would banner the wrong encounter.
VALIDATION_REQUIRED: Enter a boss portal; banner name matches; admin edit then re-enter sees the new sheet; non-boss portals do not parse.
STATUS: NEW
