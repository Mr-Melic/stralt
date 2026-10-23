# ACTION_IDs — 2026-10-23 Performance Auditor

Audit of `src/frontend` at HEAD `0f5363f` (PR #332 era). No WorldExploration RAF scheduling changes proposed.

Already ledgered (do not re-file): PERF-2026-08-31-001..010, PERF-2026-09-01-011..036,
PERF-2026-09-02-037..060, and memory chain PERF-061..147 (including 101 withTimeout,
126 hidden CSS, 127 AudioContext, 128 HP regen, 129 attack mousemove, 130 volume LS,
131 refetchOnReconnect, 132 EffectsManager, 133–142 bundle/fonts/clickTrace,
143 world RAF while hidden REPORT_ONLY, 144 uncapped DPR, 145 advanceTurn flushSync,
146 characterSlots staleTime 0, 147 setCanvasSize identity).

Implemented this run: none (report-only).
Reported NEW: PERF-2026-10-23-148 .. 162.

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

## REPORT_ONLY (already filed — still present)

- PERF-143: WorldExploration animate() never checks document.hidden (do not change RAF loop in this automation).
- PERF-144: devicePixelRatio uncapped in applySize / context-restored.
- PERF-145: advanceTurn / enemy AI wrapped in flushSync.
- PERF-146: characterSlots staleTime: 0.
- PERF-009 / Doka: callerDokaBalance staleTime: 0 + default QueryClient focus refetch.
- PERF-127: AudioContext never suspends on visibilitychange.
- PERF-019/020: Chat battle log / general messages .map without virtualization.
