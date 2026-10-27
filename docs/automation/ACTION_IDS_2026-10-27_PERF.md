# ACTION_IDs — 2026-10-27 Performance Auditor

Did **not** change WorldExploration, the world RAF schedule, or gameplay timing.
Did **not** re-file PERF-2026-08-31-001..010, 09-01-011..036, 09-02-037..060,
09-21-061..070, 09-22-071..085, 09-23-086..101, 09-24-102..107, 09-25-108..113,
09-26-114..118, 09-27-119..125, 09-28-126..132, 09-29-133..136, 10-21-137..142,
10-22-143..147, 10-23-148..172, 10-24-173..176, 10-25-177..182, 10-26-183..186.

No SAFE disjoint implementation this increment: remaining player-visible
fixes sit on WorldExploration / occupancy.ts / ChatPanel / soundEngine /
App.tsx / vite.config.js / LandingPage / DraggablePanel / canvasLoopActivity /
pieceArt.ts / effects.ts (#1122), all already in the oldest-first stack.
`occupancy.ts` is in #383 and #486. Prefer landing already-open SAFE PRs
#350, #392/#412, #429, #447, #511, #594, #643, #687, #745, #797, #841, #889,
#966, #1059, #1122.

Did **not** re-land loadTierConfig caching (older #438 deletes the unused
module cache on the same function). Did **not** implement barrier-tower blit
(098 / 185, `barrierRender.ts` is unclaimed but visual). Did **not** change
QueryClient defaults (070 / 131, `main.tsx` is in #745).

## Residual on HEAD (already ledgered; still open in older PRs)

| ID | Still on HEAD | Where it lives |
|---|---|---|
| 061 | Catalog `refetchOnWindowFocus` default true | #350 |
| 062 | `playNoise` still allocates a buffer per hit | #350 |
| 009 / 070 | `callerDokaBalance` staleTime 0; global QC default | HUMAN |
| 177 | Chat 2s `getMessages` during overworld, including folded | ChatPanel stack |
| 178 | Summon owner-tint `shadowBlur` | #1059 |
| 183 | Idle EffectsManager tick skip | #1122 |
| 184 | Combatant per-pixel `fillRect` every RAF | WX / pieceArt stack |
| 185 | Barrier 6-layer live paths | HUMAN (`barrierRender.ts`) |
| 186 | SpellbookModal full catalog DOM | HUMAN |
| 173–176 | unique-bridge floods, triple canvas fill, `isOccupied` `.some`, tileCornerCache resize | #1009 |
| 101 | query `withTimeout` dangling 10s timers | #889 |
| 137 | production clickTrace stub | #841 |
| 133 | unused Share Tech Mono + fonts preconnect | #797 |

---

ACTION_ID: PERF-2026-10-27-187
TITLE: World render reassigns canvas.width every frame on fractional devicePixelRatio
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (render ~7252–7262; applySize ~13950–13968)
CURRENT_BEHAVIOUR: ResizeObserver `applySize` sets `canvas.width = Math.floor(cssW * dpr)` and stores `canvasSize.width = Math.floor(cssW)`. Every RAF then compares `canvas.width` to `Math.floor(canvasSize.width * dpr)`. Those two floors diverge on fractional DPR (iPhone 3× on a 390.6 CSS-px layout: 1171 vs 1170). Assigning `canvas.width` clears the 2D backing store. The same comment at applySize already warns that a mid-frame width assignment produces a black frame. Distinct from PERF-144 (uncapped DPR buffer *size*) and PERF-147 (ResizeObserver React `setCanvasSize` identity).
DESIRED_BEHAVIOUR: Compare against the physical size applySize last wrote (a ref), or drop the in-render assignment and let applySize / context-restore own the backing store. Do not change the RAF schedule or combat dt.
EVIDENCE: render() `if (canvas.width !== Math.floor(w * dpr)) canvas.width = …` after canvasSize was floored independently; applySize uses `Math.floor(cssW * dpr)` vs `Math.floor(cssW)`. `floor(x * dpr) !== floor(floor(x) * dpr)` for x=390.6, dpr=3.
RECOMMENDED_ACTION: WorldExploration is stacked — do not land here. Fix rounding in applySize and render together. Do not fold into RAF timing.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: A too-aggressive skip of the in-render resize can leave a black canvas after React resets the element or after GPU context restore (148). The recovery path must still run when the element is actually 0×0 or restored.
VALIDATION_REQUIRED: Mobile / DPR 2.625–3 viewport: walk, rotate, pinch-zoom chrome; no per-frame black clear; desktop integer DPR unchanged; context-restore still restarts the loop.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-27-188
TITLE: Game Over early-return unmounts the world canvas, RAF, and HUD tree
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (`setShowGameOver(true)` ~13310; early return ~17425–17438; RAF mount effect ~13770)
CURRENT_BEHAVIOUR: `_handlePlayerDeath` sets `showGameOver`. The inner component then returns only `GameOverModal`, unmounting the canvas, 1 Hz watchdog, catalog query subscriptions, BuffShop/Achievements/Settings panels, and the starfield-pause effect. Respawn (`setShowGameOver(false)` ~13591) remounts the ~19k-line tree and restarts RAF. Distinct from PERF-027 (island split) and PERF-143 (hidden-tab RAF).
DESIRED_BEHAVIOUR: Keep the canvas mounted; overlay Game Over on top (same pattern as other modals). Death persist, 1.5s Death Realm timer, and `cleanupBattle` stay on the existing authoritative path.
EVIDENCE: `if (showGameOver) { return ( <GameOverModal …/> ); }` sits after hooks and before the canvas JSX. The RAF `useEffect` cleanup cancels `requestAnimationFrame` and `setStarfieldPaused(false)` on that unmount.
RECOMMENDED_ACTION: Overlay, do not unmount. WorldExploration is stacked; death persist / portal guards are easy to desync. Do not change the 20/40 penalty or Death Realm delay.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Leaving RAF running under Game Over can let a leftover enemy-turn timeout or DoT tick race `applyRewards` after `battleEndedRef` (the death path already arms that). Overlay must keep `cleanupBattle` / `deathTriggeredRef` as they are.
VALIDATION_REQUIRED: Die in battle; overlay shows 20/40; Respawn enters Death Realm with 1.5s portal lock; no second victory recap; starfield stays paused until leave-world.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-27-189
TITLE: Occupancy BFS uses Array.shift and scans the full grid through linear isOccupied
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/engine/occupancy.ts (`floodPassable` ~140–176; `collectOccupiedCells` ~275–285; `collectMandatoryProgressionCells` ~190)
CURRENT_BEHAVIOUR: Unique-bridge / unseal work (PERF-173) still pays two extra costs inside occupancy.ts: (1) `floodPassable` is a BFS that `q.shift()`s every cell (O(n) per pop → quadratic on the open set); (2) `collectOccupiedCells` walks every grid cell and calls `ctx.isOccupied`, which callers implement as `.some()` over the live roster (PERF-175). A 16×16 fight with a summon relocate is hundreds of occupancy probes on the main thread during the spawn/turn. Distinct from 173 (how many floods) and 175 (neighbour probes during A*).
DESIRED_BEHAVIOUR: Queue with an index (or typed ring); build occupied cells from the combatant list (O(units)), not O(width×height×units). Passability rules unchanged.
EVIDENCE: `const cur = q.shift()!` in floodPassable; collectOccupiedCells nested `for y / for x` + `ctx.isOccupied({x,y})`; unsealProgressionOccupants calls collectOccupiedCells then occupantsSealProgression.
RECOMMENDED_ACTION: occupancy.ts is in #383 and #486 — do not restack. Index-queue + occupant list is SAFE once those land. Do not change unique-bridge semantics.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: A wrong occupant source can miss a corpse/summon and seal the portal, or relocate a unit onto the only remaining bridge.
VALIDATION_REQUIRED: `occupancy.mandatory.test.ts` / `occupancy.passability.test.ts`; spawn two summons on a 1-wide corridor; leftover corpse dump still on the fight graph.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-27-190
TITLE: Unfolded ChatPanel forces layout via scrollHeight on every log/effects length change
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/ChatPanel.tsx (scroll effect ~959–968)
CURRENT_BEHAVIOUR: While the chat panel is unfolded, an effect reads `listRef.current.scrollHeight` and writes `scrollTop` whenever `messages.length`, `battleLogEntries.length`, or `activeEffects.length` changes. That is a forced layout under the live world canvas on every battle-log line (capped at 500) and every DoT apply. Distinct from PERF-019 (virtualize the 500 DOM nodes) and PERF-081 (folded channel JSX still evaluated).
DESIRED_BEHAVIOUR: Stick-to-bottom without reading layout every line (e.g. only if already near bottom, or `scrollTop = large constant`). Keep unread badges and Clear log.
EVIDENCE: ChatPanel.tsx effect depends on `messages.length`, `battleLogEntries.length`, `activeEffects.length`, `isFolded`, `activeChannel`; body assigns `scrollTop = scrollHeight` when `!isFolded`.
RECOMMENDED_ACTION: ChatPanel is stacked (#350 / #392 / #447). Land after those. Do not change the 2s `getMessages` poll here (177).
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Auto-scroll must still follow new Battle Log / Summons / Status lines when the player is at the bottom; must not yank them if they scrolled up.
VALIDATION_REQUIRED: Long fight with Battle Log open at bottom; scroll up mid-fight (must not jump); folded unread still increments; Clear log resets.
STATUS: NEW
