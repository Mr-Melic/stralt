# ACTION_IDs — 2026-09-22 Performance Auditor (canvas / RAF / particle / memory)

Report-only canvas/RAF/particle/memory audit. No WorldExploration RAF schedule or gameplay-timing changes.

Do not re-file: PERF-2026-08-31-001..010, PERF-2026-09-01-011..036, PERF-2026-09-02-037..060, PERF-2026-09-21-061..070.

Known covered (skipped): Starfield RAF pause + 1×1 buffer; BloodParticles hidden stop; landing logo hidden pause; landing cube shadowBlur (054/042); entity fillRect bake (066); summon shadowBlur (067); dust motes; floor shimmer; AO; vignette; depth sort; getContext twice; EffectsManager dual arrays; leader death particles; pixel pattern table hoist; portalMap/barrier Set rebuild (022); entity foot shadows (035); portal/hazard fillRects (036).

Residual note (not re-filed): memories claim PERF-062 (shared SoundEngine noise buffer) was implemented, but `playNoise` at HEAD still allocates a fresh `AudioBuffer` + `Math.random` fill per call (`soundEngine.ts` 220–225).

---

ACTION_ID: PERF-2026-09-22-071
TITLE: drawPixelPattern pops ctx.restore without a matching save every entity draw
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (drawPixelPattern ~3883); contrast src/frontend/src/data/pieceArt.ts drawPatternInline (explicitly no restore)
CURRENT_BEHAVIOUR: World `drawPixelPattern` ends with `ctx.restore()` after fillRect loops and never calls `ctx.save()`. Every combatant/player blit pops one save level — including the outer frame save (shake translate at ~7265) and the moving-unit `shadowBlur` save (~8058). pieceArt's inline drawer correctly leaves state to the caller.
DESIRED_BEHAVIOUR: Remove the stray restore (or pair with save only if intentional). Keep fillRect bake work under 066.
EVIDENCE: `drawPixelPattern` ~3883 `ctx.restore()`; call sites pass it as `drawPattern` into `drawCombatant` and call it for the player (~8315). Distinct from 066 (bake pixels) and 035 (shadows).
RECOMMENDED_ACTION: Delete the unmatched restore. Visual/shake + moving-glow smoke test.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: If some caller relied on the accidental pop, removing it keeps intended save stacks (shake, moving glow) for the rest of the frame.
VALIDATION_REQUIRED: Typecheck; battle shake still translates juice; moving enemy red glow visible; summons still outline.
STATUS: NEW

---

ACTION_ID: PERF-2026-09-22-072
TITLE: Landing page runs 12 infinite CSS chessDrift transforms under dual canvas RAFs
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/LandingPage.tsx (~339–370 FloatingPiece; ~809–814 @keyframes chessDrift)
CURRENT_BEHAVIOUR: Twelve absolutely positioned glyphs animate `translateY(-110vh) rotate` forever via CSS while Starfield RAF (250+ shadowBlur arcs) and SkateStyleTitle RAF also run. `chessDrift` has no `document.hidden` / `prefers-reduced-motion` pause (logo RAF does via 058).
DESIRED_BEHAVIOUR: Pause or drop CSS animations when the tab is hidden; optionally reduce count on mobile; honor reduced-motion.
EVIDENCE: `animationIterationCount: "infinite"` on each FloatingPiece; style block defines chessDrift. Distinct from 054 (cube shadowBlur) and 058 (logo RAF pause only).
RECOMMENDED_ACTION: CSS `animation-play-state` tied to visibility, or fewer pieces. Do not change Starfield in the same PR.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Landing atmosphere changes if piece count drops.
VALIDATION_REQUIRED: Landing screenshot desktop/mobile; background tab; compositor cost falls.
STATUS: NEW

---

ACTION_ID: PERF-2026-09-22-073
TITLE: ChatPanel debug .txt export creates object URLs without revoke
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/ChatPanel.tsx (~1749–1758)
CURRENT_BEHAVIOUR: Export .txt builds a Blob, `URL.createObjectURL(blob)`, clicks a temporary `<a>`, and never calls `URL.revokeObjectURL`. Each export leaves a retained blob URL until navigation.
DESIRED_BEHAVIOUR: Revoke after click (setTimeout 0 or `a.onclick` cleanup). Only createObjectURL site under `src/frontend/src`.
EVIDENCE: ChatPanel Export .txt handler; ripgrep shows no `revokeObjectURL` in frontend src. Distinct from canvas IDs and from PDF/print Export path.
RECOMMENDED_ACTION: revoke after download. Cap report size separately if needed.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Revoking before the browser starts the download can break the save on slow devices — revoke on next tick.
VALIDATION_REQUIRED: Export .txt twice; download succeeds; no growing blob: URLs in DevTools.
STATUS: NEW

---

ACTION_ID: PERF-2026-09-22-074
TITLE: BloodParticles keeps full-size canvas buffers while the tab is hidden
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/BloodParticles.tsx (~96–109 ResizeObserver; ~120–131 hidden stop)
CURRENT_BEHAVIOUR: PERF-059 stops the RAF chain when `document.hidden`, but the canvas backing store stays at parent clientWidth×clientHeight. Character select can mount one instance per filled slot (041) under Starfield — three full drip canvases stay allocated while backgrounded. Starfield already releases to 1×1 on world pause (049).
DESIRED_BEHAVIOUR: On hidden, shrink to 1×1 (and clear particles); on visible, resize + restart loop.
EVIDENCE: ResizeObserver always assigns full size; hidden path only `stopLoop()`. Distinct from 049 (starfield) and 059 (RAF stop without GPU release).
RECOMMENDED_ACTION: Mirror starfield `releaseGpuBuffer` for decorative drip canvases. Keep ellipse look.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Resume must restore parent size before spawn or drips clip wrong for one frame.
VALIDATION_REQUIRED: 3-slot select; background tab; memory/GPU buffer drops; return; drips resume.
STATUS: NEW

---

ACTION_ID: PERF-2026-09-22-075
TITLE: Landing logo strokeText redraws every static letter outline every frame
CATEGORY: runtime-performance
PRIORITY: low
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/LandingPage.tsx (SkateStyleTitle animate ~156–161)
CURRENT_BEHAVIOUR: Each RAF clears the canvas then `strokeText` for every letter of "ÆSTRALTØ" before updating cubes. The cyan outline never changes; only cube brightness flickers. Runs concurrently with Starfield.
DESIRED_BEHAVIOUR: Bake letter outlines once to an offscreen canvas / ImageBitmap and blit; animate cubes on top. Keep 054's shadowBlur substitute separate.
EVIDENCE: `ctx.strokeText(letter.char, letter.x, 30)` inside the per-frame letter loop. Distinct from 054/042 (shadowBlur on bright cubes) and 058 (hidden pause).
RECOMMENDED_ACTION: One-time outline bake after cube layout. Visual parity check.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Outline alignment vs cubes if bake uses a different font baseline.
VALIDATION_REQUIRED: Side-by-side landing title; mobile width.
STATUS: NEW

---

ACTION_ID: PERF-2026-09-22-076
TITLE: Floor pass allocates `${x},${y}` strings for highlight Set lookups every frame
CATEGORY: runtime-performance
PRIORITY: low
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (~7660 mpTiles.has; ~7687 spellTiles.has; ~7731 barrierTileSnapshot.has)
CURRENT_BEHAVIOUR: For each grid cell in the isometric floor/wall passes, template strings are allocated just to probe Sets/Maps. On a 16×16 map that is hundreds of short-lived strings per RAF even when the Sets are empty.
DESIRED_BEHAVIOUR: Numeric key (`y * GRID + x`) or reuse a scratch key builder; pair with 022's ref-backed collections.
EVIDENCE: `` mpTiles.has(`${x},${y}`) `` / spell / barrier in the hot row loops. Distinct from 022 (constructing the Sets/Maps) and 006 (BFS that fills MP tiles).
RECOMMENDED_ACTION: Switch highlight maps to numeric keys end-to-end, or skip `.has` when the Set size is 0.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Key-format mismatch between producers (getMpReachableTiles) and consumers breaks walk/spell highlights.
VALIDATION_REQUIRED: Walk and attack highlights match clickable tiles; barriers still depth-sort.
STATUS: NEW

---

ACTION_ID: PERF-2026-09-22-077
TITLE: Production debug ring buffer still appends up to 2000 entries with payloads
CATEGORY: runtime-performance
PRIORITY: low
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/debug/debugLogger.ts (~105–111); heavy callers in WorldExploration / enemyAI / spellEngine
CURRENT_BEHAVIOUR: PERF-003 stopped mirroring logs into ChatPanel React state, but `logDebug` still pushes every line into a module ring buffer in production (`DEBUG_BUFFER_CAP = 2000`) including optional `data` objects. Battle/AI paths call it frequently; over-cap uses `slice` (new array).
DESIRED_BEHAVIOUR: Prod no-op buffer unless Debug tab has been opened once, or cap lower / drop `data` in prod.
EVIDENCE: Comment "Always keep the buffer so the overlay can show history even in prod"; IS_DEV only gates console. Distinct from 003 (React subscriber).
RECOMMENDED_ACTION: Gate buffer writes on a "debug session armed" flag. Export still works after the tab is opened.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Opening Debug mid-battle would only show logs from arm time unless a short pre-roll buffer is kept.
VALIDATION_REQUIRED: Prod build memory steady during battle; Debug tab still lists history after arming; Export .txt works.
STATUS: NEW

---

ACTION_ID: PERF-2026-09-22-078
TITLE: Character select/create strokeRect every filled pixel on preview canvases
CATEGORY: runtime-performance
PRIORITY: low
CONFIDENCE: medium
FILES_OR_SYSTEMS: src/frontend/src/components/CharacterSelection.tsx (CharacterPreview ~344–357); src/frontend/src/components/CharacterCreation.tsx (~180–188)
CURRENT_BEHAVIOUR: Preview redraws fillRect + strokeRect per non-zero pattern cell (internal 2× resolution). Not a RAF loop, but remounts / view rotates / color changes pay 2× canvas ops per pixel. Select screen also runs Starfield + per-slot BloodParticles (041).
DESIRED_BEHAVIOUR: Bake to an offscreen canvas once per (piece, view, colors); blit. Or drop per-pixel stroke and use a single outline.
EVIDENCE: CharacterPreview nested loops strokeRect after fillRect. Distinct from 066 (world entity bake) and 041 (BloodParticles count).
RECOMMENDED_ACTION: Cache ImageBitmap / canvas by key. Keep pixelated look.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Preview border darkness can change if stroke is removed.
VALIDATION_REQUIRED: Rotate piece views on select and creation; crisp pixels at 1× CSS size.
STATUS: NEW

---

ACTION_ID: PERF-2026-09-22-079
TITLE: EffectsManager death fragments nest save/restore per fragment
CATEGORY: runtime-performance
PRIORITY: low
CONFIDENCE: medium
FILES_OR_SYSTEMS: src/frontend/src/engine/effects.ts (~282–293)
CURRENT_BEHAVIOUR: Each death effect does outer save + per-fragment save/translate/rotate/fillRect/restore. Fragment count comes from JUICE.death; capped indirectly by MAX_LIVE_EFFECTS.
DESIRED_BEHAVIOUR: One save for the effect; setTransform or translate without nested save, or draw axis-aligned squares without rotate when rotation is unused visually.
EVIDENCE: Nested `ctx.save` inside the fragment loop. Distinct from 045 (dual typed arrays + filter) and 048 (leader-death particles in WorldExploration).
RECOMMENDED_ACTION: Flatten state changes. Do not change death TTL or fragment count in a perf-only PR.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: Fragment spin look changes if rotate path is dropped.
VALIDATION_REQUIRED: Kill an enemy; fragments still arc and fade.
STATUS: NEW
