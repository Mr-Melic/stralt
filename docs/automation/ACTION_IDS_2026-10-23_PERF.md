# ACTION_IDs — 2026-10-23 Performance Auditor

Audit of `src/frontend` at HEAD `0f5363f` (PR #332 era). No WorldExploration RAF scheduling changes proposed.

Already ledgered (do not re-file): PERF-2026-08-31-001..010, PERF-2026-09-01-011..036,
PERF-2026-09-02-037..060, and memory chain PERF-061..147 (including 101 withTimeout,
126 hidden CSS, 127 AudioContext, 128 HP regen, 129 attack mousemove, 130 volume LS,
131 refetchOnReconnect, 132 EffectsManager, 133–142 bundle/fonts/clickTrace,
143 world RAF while hidden REPORT_ONLY, 144 uncapped DPR, 145 advanceTurn flushSync,
146 characterSlots staleTime 0, 147 setCanvasSize identity).

Earlier same-day report-only pass: PERF-2026-10-23-148 .. 162.
This pass implemented PERF-2026-10-23-163 and reported NEW 164 .. 174.

---

ACTION_ID: PERF-2026-10-23-148
TITLE: Context-lost cancels RAF but context-restored never restarts it
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (~13814–13843, watchdog ~13778–13791)
CURRENT_BEHAVIOUR: `handleContextLost` cancels `animationFrameRef`. `handleContextRestored` resizes/scales the canvas then comments that the loop continues — but nothing schedules the next frame. The 1 Hz watchdog only restarts after >2s staleness.
DESIRED_BEHAVIOUR: On restore, schedule `requestAnimationFrame(animateRef.current)` immediately (still no gameplay-timing change).
EVIDENCE: cancel in lost handler; restored path has no RAF schedule.
RECOMMENDED_ACTION: One-line restart after setTransform/scale. Do not change tick math.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Double-start if a frame was already queued; guard with null check.
VALIDATION_REQUIRED: Simulate contextlost/restored; canvas recovers without a 2s black gap.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-23-149
TITLE: Landing chessDrift CSS keeps running while document.hidden
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/LandingPage.tsx (~354–367, @keyframes chessDrift)
CURRENT_BEHAVIOUR: Logo canvas RAF pauses on hide (058), but six FloatingPiece elements use inline `animationIterationCount: "infinite"` with no hidden pause. Distinct from class-based HUD pause (126).
DESIRED_BEHAVIOUR: Pause/remove chessDrift while hidden (document class or style).
EVIDENCE: Inline infinite animation on landing pieces.
RECOMMENDED_ACTION: Toggle a `document.documentElement` class or set `animationPlayState` on visibilitychange.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Pieces must resume on return to tab.
VALIDATION_REQUIRED: Landing open → background tab → compositor idle; return → drift resumes.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-23-150
TITLE: ChatPanel getMessages Promise.race timeout is never cleared
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/ChatPanel.tsx (~886–891)
CURRENT_BEHAVIOUR: Race uses an anonymous `setTimeout` rejector that is never cleared on success. A separate `timeoutId` only flips `didTimeout`. Every 2s poll that finishes early leaves a 5s timer alive. Distinct from hook `withTimeout` (101).
DESIRED_BEHAVIOUR: Single timer cleared in `finally` (shared helper OK).
EVIDENCE: Promise.race setTimeout with no clearTimeout on the rejector.
RECOMMENDED_ACTION: Clear rejector timer on settle; optional share with hook helper.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Timeout must still abort hung polls.
VALIDATION_REQUIRED: Poll under load; timer count stays flat.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-23-151
TITLE: Chat poll interval tears down when fold/channel changes
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/ChatPanel.tsx (~925, ~942–957)
CURRENT_BEHAVIOUR: `fetchMessages` closes over `isFolded`/`activeChannel`, so those deps recreate the callback; the interval effect depends on `fetchMessages` and clears/restarts the 2s poll (plus immediate fetch) on every channel or fold toggle.
DESIRED_BEHAVIOUR: Read fold/channel from refs inside fetch; keep interval stable on actor/isPaused only.
EVIDENCE: useCallback deps include isFolded, activeChannel; interval effect deps include fetchMessages.
RECOMMENDED_ACTION: Refs for fold/channel; drop them from fetchMessages deps.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Unread badges must still update when folded.
VALIDATION_REQUIRED: Flip channels rapidly; no poll burst; unread still increments.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-23-152
TITLE: Ungated SPELLBAR-BISECT console.log on every battle start
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (~12070–12073)
CURRENT_BEHAVIOUR: A DEV-gated bisect exists above, but an unconditional `console.log("[SPELLBAR-BISECT]", …)` still runs inside battle-init before flushSync. Allocates log objects on every encounter in production.
DESIRED_BEHAVIOUR: DEV-only or remove.
EVIDENCE: console.log outside `process.env.NODE_ENV === "development"` guard at 12070.
RECOMMENDED_ACTION: Gate or delete the second bisect log.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: None for players.
VALIDATION_REQUIRED: Start battle in prod build; no SPELLBAR-BISECT in console.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-23-153
TITLE: Ungated CLICK-ENEMY console.log on sprite-cast path
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (~10222–10230)
CURRENT_BEHAVIOUR: Every successful sprite-enemy cast path logs a structured object (eslint-disable no-console). Combat click latency pays console serialization when DevTools is open; noise in prod.
DESIRED_BEHAVIOUR: DEV-only via logDebugInfo or import.meta.env.DEV.
EVIDENCE: console.log("[CLICK-ENEMY]") with no env gate.
RECOMMENDED_ACTION: Gate behind DEV.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Debug export must still capture click traces via clickTrace module.
VALIDATION_REQUIRED: Cast on enemy sprite in prod; no CLICK-ENEMY spam.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-23-154
TITLE: VICTORY-GATE console.log allocates roster arrays in production
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (~13888–13898)
CURRENT_BEHAVIOUR: On victory gate, always `console.log` with `combatantsRef.current.map` and `[...battleStartIds]`. Comment says intentional always-on; still player-visible hitch risk when DevTools open at kill.
DESIRED_BEHAVIOUR: DEV-only dump; keep dumpStateSync DEV-gated path for bisect.
EVIDENCE: Ungated console.log + map/spread at victory.
RECOMMENDED_ACTION: Wrap in DEV; retain structured debug logger if needed.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Field debugging of victory-gate bugs harder without the always-on log.
VALIDATION_REQUIRED: Last-enemy kill; no VICTORY-GATE console work in prod.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-23-155
TITLE: ChallengePanel progress prop is a new object every WorldExploration render
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (~19192–19199); ChallengePanel.tsx
CURRENT_BEHAVIOUR: Always-mounted ChallengePanel receives `progress={{ turnCount, totalDamage, … }}` inline. Any WX setState (HP regen, timer, walk) rebuilds the prop and re-renders the panel tree even when HUD is hidden.
DESIRED_BEHAVIOUR: Stable memoized progress when values unchanged, or mount only when visible.
EVIDENCE: Inline object at ChallengePanel call site; panel early-returns after hooks.
RECOMMENDED_ACTION: useMemo on progress fields; optional conditional mount.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Progress meters must still update during an accepted challenge.
VALIDATION_REQUIRED: Accept challenge; meters move; idle explore does not re-render panel body.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-23-156
TITLE: Attack Nearest hotkey rebinds window keydown on spell/modifier churn
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (~17356–17375)
CURRENT_BEHAVIOUR: `useEffect` adds/removes `window` keydown whenever `attackNearestEnemy` identity changes. That callback depends on `activeSpells`, `activeMapModifierTypes`, `getEffectiveSpellRange`, etc., so loadout and modifier updates rebind the global listener.
DESIRED_BEHAVIOUR: Stable effect with refs to latest attackNearestEnemy.
EVIDENCE: effect deps `[attackNearestEnemy]`; callback deps include activeSpells/modifiers.
RECOMMENDED_ACTION: attackNearestRef pattern; empty or stable effect deps.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Hotkey must still cast the currently selected spell.
VALIDATION_REQUIRED: Change spells mid-battle; hotkey still works; listener not thrashing.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-23-157
TITLE: Starfield ResizeObserver assigns canvas.width without size equality check
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/StarfieldBackground.tsx (~212–219)
CURRENT_BEHAVIOUR: Any ResizeObserver callback with positive client size writes `canvas.width/height`, clearing the 2D buffer even when dimensions are unchanged (mobile browser chrome show/hide thrash).
DESIRED_BEHAVIOUR: Skip assign when width/height unchanged.
EVIDENCE: Direct width assign with no previous-size compare.
RECOMMENDED_ACTION: Compare before assign; keep pause_release_gpu path.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Must still resize on real orientation change.
VALIDATION_REQUIRED: Landing starfield; fling mobile URL bar; no flicker/clear storm.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-23-158
TITLE: Every DraggablePanel registers its own window resize/orientation listeners
CATEGORY: runtime-performance
PRIORITY: low
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/DraggablePanel.tsx (~592–612); world mounts chat/settings/map-modifiers/battle-ui/initiative/stats
CURRENT_BEHAVIOUR: Each panel instance adds `resize` + `orientationchange` listeners. World play mounts ~6 panels → 12 handlers clamping layout on every resize.
DESIRED_BEHAVIOUR: Shared singleton resize bus, or one listener in a layout owner.
EVIDENCE: Per-instance addEventListener in DraggablePanel; multiple panelIds mounted in world.
RECOMMENDED_ACTION: Module-level subscribeResize(cb) with one window listener.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Panels must still clamp on rotate.
VALIDATION_REQUIRED: Rotate device; all panels stay on-screen; only one native listener.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-23-159
TITLE: InitiativeStrip timer uses inline infinite CSS pulse while tab may be hidden
CATEGORY: runtime-performance
PRIORITY: low
CONFIDENCE: medium
FILES_OR_SYSTEMS: src/frontend/src/components/InitiativeStrip.tsx (~235–236); index.css .stone-battle-caret bounceCaret
CURRENT_BEHAVIOUR: When `localTimeLeft <= 7`, inline `animation: pulse … infinite`. Battle caret uses class `bounceCaret` infinite. No document.hidden pause (inline path not covered by class-only 126).
DESIRED_BEHAVIOUR: Pause infinite HUD animations while hidden.
EVIDENCE: Inline infinite pulse on timer chip.
RECOMMENDED_ACTION: Prefer class + hidden documentElement rule, or animationPlayState.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Urgency pulse must return with the tab.
VALIDATION_REQUIRED: Battle with ≤7s left; background tab; animations stop.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-23-160
TITLE: Wall tiles re-parse palette hex and allocate rgb() strings every frame
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (drawIsometricTile ~4096–4123)
CURRENT_BEHAVIOUR: Per wall tile per RAF: seededRng, optional parseInt hex substrings, four `rgb(...)` template strings. Complements static texture cache (005) but is a concrete remaining hot alloc.
DESIRED_BEHAVIOUR: Bake wall face colors into the static layer / cache by map id.
EVIDENCE: parseInt + rgb templates inside drawIsometricTile wall branch.
RECOMMENDED_ACTION: Pair with PERF-005 bake; do not change wall geometry.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Wall palette look drift.
VALIDATION_REQUIRED: Screenshot corridors before/after.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-23-161
TITLE: noTargetFlash setTimeout is not cleared on unmount or re-entry
CATEGORY: runtime-performance
PRIORITY: low
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (~17300–17301, ~17317–17318)
CURRENT_BEHAVIOUR: Attack Nearest miss path `setTimeout(() => setNoTargetFlash(false), 1200)` with no stored id/cleanup. Rapid misses stack timers; leave world during flash → setState on unmounted tree.
DESIRED_BEHAVIOUR: Single timeout ref cleared on unmount and before re-arm.
EVIDENCE: Bare setTimeout in attackNearestEnemy.
RECOMMENDED_ACTION: timeout ref + effect cleanup.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Flash duration must stay ~1.2s.
VALIDATION_REQUIRED: Spam Attack Nearest with no target; one flash; leave world cleanly.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-23-162
TITLE: Hook withTimeout Promise.race timers still uncleared at this HEAD
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
FILES_OR_SYSTEMS: useAdminQueries.ts / useCharacterQueries.ts / useShopQueries.ts / useSpellQueries.ts (~withTimeout)
CURRENT_BEHAVIOUR: Memory claimed PERF-101 landed a shared clearing helper, but this #332-era tree still has four local `Promise.race` + uncleared `setTimeout` rejectors on every query. Frequent Doka/spell/character fetches leave 10s timers.
DESIRED_BEHAVIOUR: Shared `withTimeout` that clears in `finally` (re-land 101 if missing).
EVIDENCE: Local withTimeout without clearTimeout; no `utils/withTimeout.ts`.
RECOMMENDED_ACTION: Re-apply 101 helper; do not change query keys.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Timeout errors must still surface.
VALIDATION_REQUIRED: Hydrate world; timer count does not climb by 4 per focus refetch.
STATUS: NEW

---

---

ACTION_ID: PERF-2026-10-23-163
TITLE: loadTierConfig never populated its cache and re-JSON.parsed on every spawn call
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
EXISTS_ON_THIS_BRANCH: yes (fixed in this PR)
FILES_OR_SYSTEMS: src/frontend/src/engine/combatMath.ts (`loadTierConfig`, `pickEnemyLevelFromTiers`); WorldExploration map-gen spawn path
CURRENT_BEHAVIOUR: `_cachedBackendTierConfig` was declared but never assigned. Every `loadTierConfig()` / `pickEnemyLevelFromTiers()` call re-read localStorage and `JSON.parse`d the tier blob on the main thread during portal map generation (once per enemy).
DESIRED_BEHAVIOUR: Cache the parsed object keyed by the raw localStorage string; re-parse only when the blob changes.
EVIDENCE: Parse branch returned without assigning; no `_cachedBackendTierConfig =` write site existed. WX calls `pickEnemyLevelFromTiers` inside generateEnemies.
RECOMMENDED_ACTION: Keep raw-string cache. Writers that `setItem` a new JSON string invalidate automatically.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Admin/WX must still see updated tierSize after writing a new blob (raw inequality). Defaults path unchanged.
VALIDATION_REQUIRED: `node --experimental-strip-types --test src/frontend/src/engine/combatMath.tierConfig.test.ts`; portal into a populated map; spawn levels still respect admin tier percents.
STATUS: IMPLEMENTED

---

ACTION_ID: PERF-2026-10-23-164
TITLE: Canvas mousemove calls getBoundingClientRect on every pointer event
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
EXISTS_ON_THIS_BRANCH: yes
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (`clientToGrid` ~8925; `handleCanvasMouseMove` ~10661)
CURRENT_BEHAVIOUR: Hover path calls `clientToGrid` → `canvas.getBoundingClientRect()` on every mousemove, forcing layout while the world RAF paints. Distinct from PERF-129 (combatant scan) and PERF-002 (hover on refs).
DESIRED_BEHAVIOUR: Cache the rect; invalidate on ResizeObserver / scroll / visualViewport resize.
EVIDENCE: `clientToGrid` reads `getBoundingClientRect` unconditionally; mouse move always invokes it over the canvas.
RECOMMENDED_ACTION: Rect cache next to `canvasSize`. Do not reintroduce hover React state.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Stale rect after CSS size change mis-maps clicks/hover diamonds.
VALIDATION_REQUIRED: Resize window and a snapped panel; hover and click still hit the intended tile on desktop and mobile zoom.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-23-165
TITLE: drawPortalWhirlpool allocates a portalColors Record every portal every frame
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
EXISTS_ON_THIS_BRANCH: yes
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (`drawPortalWhirlpool` ~3889–3915)
CURRENT_BEHAVIOUR: Each animated portal rebuilds a 12-key `portalColors` object literal and runs ellipse/arc loops every RAF. Distinct from PERF-036 (vignette/hazard pixels) and PERF-142 (map-gen CA hitch).
DESIRED_BEHAVIOUR: Hoist the color table to module scope; keep animation math.
EVIDENCE: `const portalColors: Record<PortalColor, string[]> = { ... }` inside the callback body.
RECOMMENDED_ACTION: Module-level const. Optional: skip off-screen portals (pairs with PERF-005).
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Portal palette typos if a key is dropped while hoisting.
VALIDATION_REQUIRED: Visual check of rest/boss/dungeon/white portal animations in explore and in-battle teal cube mode.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-23-166
TITLE: A* findPath uses linear openSet scan + splice and allocates per expansion
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
EXISTS_ON_THIS_BRANCH: yes
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (`findPath` ~4466–4572)
CURRENT_BEHAVIOUR: Click-to-walk, summon walk, and overworld wander each run A* that builds a fresh portal `Set`, scans the entire `openSet` for min-f, `splice`s, and allocates a 4-neighbor array every expansion. Hover does not call findPath. Distinct from PERF-006 (MP BFS every RAF).
DESIRED_BEHAVIOUR: Binary heap / bucket open set; reuse neighbor buffers; cache portal keys per map id.
EVIDENCE: Linear min-f scan + `openSet.splice`; `const neighbors = [...]` inside the loop.
RECOMMENDED_ACTION: Extract a pathfinding helper with fixtures. Do not change walk MP rules.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Wrong paths around barriers/portals/void tiles break combat and portal reachability.
VALIDATION_REQUIRED: Walk fixtures through barriers, portals-in-battle blocked, slime cost maps; summon control walk; overworld wander.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-23-167
TITLE: Landing SkateStyleTitle runs getImageData + nested edge scan on mount
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
EXISTS_ON_THIS_BRANCH: yes
FILES_OR_SYSTEMS: src/frontend/src/components/LandingPage.tsx (`SkateStyleTitle` ~63–137)
CURRENT_BEHAVIOUR: Before the logo RAF starts, each letter builds a temp canvas, `getImageData`, then nested radius-4 neighborhood scans to place cubes — main-thread hitch under Starfield. Distinct from PERF-149 (chessDrift CSS while hidden), PERF-054/042 (shadowBlur), PERF-058/075 (hidden RAF / strokeText).
DESIRED_BEHAVIOUR: Prebake cube layouts (or ImageBitmap) once; keep cube brightness animation.
EVIDENCE: `tempCtx.getImageData` + `checkRadius = 4` double loop per opaque sample.
RECOMMENDED_ACTION: Bake offline or cache by title/fontSize.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Cube density/shape of ÆSTRALTØ logo can drift.
VALIDATION_REQUIRED: Side-by-side landing screenshot; main-thread before/after on cold load.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-23-168
TITLE: CharacterSelection duplicates the full CHESS_PIECE_PATTERNS table
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
EXISTS_ON_THIS_BRANCH: yes
FILES_OR_SYSTEMS: src/frontend/src/components/CharacterSelection.tsx (~44–300); contrast `src/frontend/src/data/pieceArt.ts`
CURRENT_BEHAVIOUR: Character select ships a second full 6-piece × 4-view pattern table instead of importing `chessPiecePatterns` from pieceArt. Inflates the authenticated lobby chunk alongside eager WX parse (PERF-135/139). Distinct from PERF-078 (strokeRect per preview pixel).
DESIRED_BEHAVIOUR: Import from pieceArt; delete the local copy.
EVIDENCE: Local `CHESS_PIECE_PATTERNS` const ~250 lines; pieceArt exports the same shapes.
RECOMMENDED_ACTION: Switch import; keep CharacterPreview draw path.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Pattern cell mismatch if the local table diverged from pieceArt.
VALIDATION_REQUIRED: Character select previews for all six piece types match play; `pnpm build` chunk size drops.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-23-169
TITLE: spriteRectsRef allocates a new rect object for every living entity every frame
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
EXISTS_ON_THIS_BRANCH: yes
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (~8088–8104, ~8337)
CURRENT_BEHAVIOUR: Each RAF clears `spriteRectsRef` and `set`s a fresh object (with nested `drawAnchor` / `drawSize`) per enemy/summon/player for click hit-testing. Steady GC under multi-summon battles alongside fillRect sprites (PERF-066).
DESIRED_BEHAVIOUR: Reuse pooled rect records; mutate fields in place.
EVIDENCE: `spriteRectsRef.current.set(enemy.id, { … drawAnchor: {…}, drawSize: {…} })` in the depth-sorted draw loop.
RECOMMENDED_ACTION: Small pool keyed by id. Hit-test must still see this frame’s geometry.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Stale pooled rects can mis-hit sprites after death/despawn if ids are reused carelessly.
VALIDATION_REQUIRED: Sprite-click cast/inspect/self-cast; touch after mouse; summon control clicks.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-23-170
TITLE: Decorative canvas loops ignore prefers-reduced-motion
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
EXISTS_ON_THIS_BRANCH: yes
FILES_OR_SYSTEMS: StarfieldBackground.tsx; BloodParticles.tsx; LandingPage.tsx; `engine/canvasLoopActivity.ts` / `starfieldActivity.ts`
CURRENT_BEHAVIOUR: Starfield, BloodParticles, and landing logo stop on `document.hidden` but never consult `prefers-reduced-motion`. No `matchMedia` usage exists under `src/frontend`. Distinct from PERF-001/053/058 (hidden-tab pause) and PERF-149 (chessDrift CSS hidden).
DESIRED_BEHAVIOUR: Treat reduced-motion like hidden for decorative loops (static frame or no RAF); do not gate the world game canvas without design sign-off.
EVIDENCE: `rg prefers-reduced-motion` → no hits in src/frontend.
RECOMMENDED_ACTION: Extend `shouldRunDecorativeCanvasLoop` / `planStarfieldLoop`. Do not touch WorldExploration animate.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Reduced-motion users see a static starfield/logo; Sign In / Play must still work.
VALIDATION_REQUIRED: Emulate reduced-motion in DevTools; landing + character select static; world play RAF unchanged.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-23-171
TITLE: App + GameFlow + WorldExploration + useIsMobile each own a window.resize listener
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
EXISTS_ON_THIS_BRANCH: yes
FILES_OR_SYSTEMS: App.tsx ~348; GameFlow.tsx ~186; WorldExploration.tsx ~880 and ~8872; hooks/use-mobile.tsx ~22
CURRENT_BEHAVIOUR: A live world mounts four separate non-panel window.resize handlers (small-screen, top-bar registry, isDesktop, tileCornerCache) plus `useIsMobile`, in addition to canvas ResizeObserver. Distinct from PERF-158 (per-DraggablePanel resize/orientation) and from single-site equality filings PERF-092/094/115/147.
DESIRED_BEHAVIOUR: One shared viewport bus with equality-guarded subscribers for these chrome/canvas helpers.
EVIDENCE: `rg addEventListener\('resize'` in the listed files; all active during `currentStage === "world"`.
RECOMMENDED_ACTION: Shared `subscribeViewport` helper. Pair with existing equality fixes.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Missing a subscriber can leave HUD/canvas wrong after rotate.
VALIDATION_REQUIRED: Rotate phone; canvas size; small-screen guard; desktop camera static flag; top-bar snap width.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-23-172
TITLE: Boss portal entry JSON.parses pbv_boss_configs on the main thread mid-transition
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
EXISTS_ON_THIS_BRANCH: yes
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (~6486–6489)
CURRENT_BEHAVIOUR: Stepping a boss portal `JSON.parse`s the full admin boss-config array from localStorage during the portal transition (same window as map cleanup/gen). Distinct from PERF-116 (double config fetch on world entry), PERF-142 (CA map-gen), and PERF-163 (tier config).
DESIRED_BEHAVIOUR: Parse once on mount / admin save; keep a module or ref cache keyed by raw string (same pattern as 163).
EVIDENCE: `JSON.parse(bossConfigsRaw) as BossConfig[]` inside `isBossPortalEntry` handling.
RECOMMENDED_ACTION: Shared boss-config cache next to DEFAULT_BOSS_CONFIGS.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Stale boss sheet after admin edit in another tab until invalidate.
VALIDATION_REQUIRED: Enter a boss portal after admin save; banner name/stats match; non-boss portals unchanged.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-23-173
TITLE: GameFlow top bar registers ResizeObserver and window.resize for the same update
CATEGORY: runtime-performance
PRIORITY: low
CONFIDENCE: high
EXISTS_ON_THIS_BRANCH: yes
FILES_OR_SYSTEMS: src/frontend/src/components/GameFlow.tsx (~171–191)
CURRENT_BEHAVIOUR: In world mode, `panelRegistry[TOP_BAR_PANEL_ID]` is refreshed by both a ResizeObserver on the bar and a window `resize` listener calling the identical `update`. Distinct from PERF-158 (panel listeners) and PERF-171 (multi-owner fan-out).
DESIRED_BEHAVIOUR: Keep ResizeObserver only (bar size is element-local); drop the redundant window listener.
EVIDENCE: `ro.observe(el)` and `window.addEventListener("resize", update)` in the same effect.
RECOMMENDED_ACTION: Prefer RO-only. Verify panel snap to top bar after window resize.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: If bar width is viewport-driven without a RO content-box change, snap edges could lag.
VALIDATION_REQUIRED: Enter world; resize window; drag chat to top-bar snap; registry width matches `innerWidth`.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-23-174
TITLE: BloodParticles uses ellipse + atan2 per particle per frame on character select
CATEGORY: runtime-performance
PRIORITY: low
CONFIDENCE: medium
EXISTS_ON_THIS_BRANCH: yes
FILES_OR_SYSTEMS: src/frontend/src/components/BloodParticles.tsx (~174–187)
CURRENT_BEHAVIOUR: Each active drip (up to 30, burst 80) computes `Math.atan2`, builds an `ellipse` path, and fills — under root Starfield and often one instance per filled slot (PERF-041). Hidden-tab stop exists (059); GPU release is open PR #412.
DESIRED_BEHAVIOUR: Axis-aligned `fillRect` / small sprite blit; keep drip motion. Optional: single shared BloodParticles layer (041).
EVIDENCE: `ctx.ellipse(..., Math.atan2(p.vy, p.vx) + Math.PI / 2, ...)`.
RECOMMENDED_ACTION: Cheap teardrop substitute. Visual approve on character select.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Drip silhouette changes.
VALIDATION_REQUIRED: Character select screenshot; burst intensity still readable; no leaked RAF after leaving select.
STATUS: NEW

---

## REPORT_ONLY (already filed — still present)

- PERF-143: WorldExploration animate() never checks document.hidden (do not change RAF loop in this automation).
- PERF-144: devicePixelRatio uncapped in applySize / context-restored.
- PERF-145: advanceTurn / enemy AI wrapped in flushSync.
- PERF-146: characterSlots staleTime: 0.
- PERF-009 / Doka: callerDokaBalance staleTime: 0 + default QueryClient focus refetch.
- PERF-127: AudioContext never suspends on visibilitychange.
- PERF-019/020: Chat battle log / general messages .map without virtualization.
