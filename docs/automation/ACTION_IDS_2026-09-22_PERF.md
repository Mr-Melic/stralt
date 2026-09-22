# ACTION_IDs — 2026-09-22 Performance Auditor

Implemented this increment: PERF-2026-09-22-073, 074, 080, 083, 084, 085.
Reported only: 071, 072, 075–079, 081, 082.
Did not touch `WorldExploration.tsx` (open #327 / #331 stack) or the world RAF loop.

Two inspection passes on this date:
- **071–079:** canvas / RAF / particle / memory
- **080–085:** React / subscriptions / ChatPanel / DraggablePanel / hooks

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
STATUS: IMPLEMENTED

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
STATUS: IMPLEMENTED

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

---

# React / subscriptions pass (GameFlow, App, ChatPanel, BattleUIPanel, hooks)

Focus: setInterval/setTimeout/addEventListener/subscribe/rAF/JSON.parse/QueryClient/polling in GameFlow, App, main, ChatPanel, BattleUIPanel, InitiativeStrip (unused mount), Leaderboard, Admin, Debug overlay, PostBattleRecap, SettingsPanel, SpellBar/Spellbook, useActor, useInternetIdentity, hooks/*.
Skipped already-reported: tile/MP cache, turn timer island, starfield shadowBlur, Doka/QC focus, RAF watchdog, walk setState, activeEffects lift, battle log virtualize, chat cap, Sets/Maps reuse, summon kit memo, BattleUIPanel unitStats, WE island split, HP regen, mobile tile cache, hover computeDamage, effects-by-targetId, entity shadows, vignette/portals, floor shimmer, AO bake, depth-sort, dust, BloodParticles per slot, landing cube shadowBlur, doka loot glow, getContext twice, EffectsManager dual arrays, enemy labels, tick(16), leader-death particles, doka HUD island, BuffShop/Achievements/Challenge/BattleUI always mounted, bake pixels, summon shadowBlur, chat width localStorage on rAF, global QC focus; plus 061–070 and 071–079 above.

---

ACTION_ID: PERF-2026-09-22-080
TITLE: ChatPanel re-focuses the text input on every poll / battle-log update while open
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/ChatPanel.tsx (~L972–999)
CURRENT_BEHAVIOUR: While `!isFolded`, a useEffect depends on `messages`, `battleLogEntries`, and `summonLogEntries` (full array identities). Every successful 2s `getMessages` poll that returns a new array, and every battle-log append, clears unread then `setTimeout(() => inputRef.current?.focus(), 80)`. Chat defaults to unfolded (`defaultFolded={false}`, `isFolded` starts false).
DESIRED_BEHAVIOUR: Focus the input only on fold→unfold or channel switch to General (or first mount of the input), not on every message identity change.
EVIDENCE: Effect body at ChatPanel.tsx L972–990; deps include `messages` / `battleLogEntries` / `summonLogEntries` at L992–998. Distinct from PERF-063 (poll interval identity) and PERF-019 (virtualize list).
RECOMMENDED_ACTION: Gate focus on `isFolded` / `activeChannel` transitions via refs; keep unread-clear side effects.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Players who rely on the input staying focused after sending must still get focus after Send / channel switch.
VALIDATION_REQUIRED: Open chat; leave focus on the canvas or Items button; wait for a poll or battle action; input must not steal focus. Unfold chat / switch to General still focuses the field. Mobile: soft keyboard must not flash every 2s.
STATUS: IMPLEMENTED

---

ACTION_ID: PERF-2026-09-22-081
TITLE: ChatPanel builds full channel React trees even when the panel is folded
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/ChatPanel.tsx (~L1113–2070); src/frontend/src/components/DraggablePanel.tsx (~L934–943)
CURRENT_BEHAVIOUR: `DraggablePanel` only mounts `{!folded && children}`, but `ChatPanel` still evaluates the entire message / battle-log / summons / status / debug JSX (including `messages.map`, `battleLogEntries.map` up to 500, `filteredDebugEntries.map` up to 2000) on every ChatPanel render before passing children. Battle log and active-effects updates from GameFlow still re-render memoized ChatPanel while folded.
DESIRED_BEHAVIOUR: Short-circuit inside ChatPanel: when `isFolded`, render DraggablePanel chrome/title only (or `children={null}`) so large `.map` trees are not allocated.
EVIDENCE: ChatPanel return always nests the full body under `<DraggablePanel>`; fold gate is only inside DraggablePanel. Distinct from PERF-019 (virtualize when open) and PERF-064 (width drag).
RECOMMENDED_ACTION: ` {!isFolded ? <body…/> : null} ` as DraggablePanel children; keep tab unread badges on the folded title path if needed.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Unfold must still show the active channel scrolled to bottom; unread badges while folded must keep working (effects already use lengths, not DOM).
VALIDATION_REQUIRED: Fold chat during a busy battle; React profiler / CPU should drop ChatPanel render cost; unfold restores the list; unread increments while folded.
STATUS: NEW

---

ACTION_ID: PERF-2026-09-22-082
TITLE: Each DraggablePanel independently fetches getUserUiLayout on mount
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/DraggablePanel.tsx (~L449–530)
CURRENT_BEHAVIOUR: Every mounted panel’s mount effect calls `actor.getUserUiLayout()`, JSON.parses the full blob, and may rewrite localStorage. World entry mounts at least chat-panel, battle-ui-panel, map-modifiers, settings, and stats-panel → five parallel identical canister queries plus five parse/setState cycles under Starfield/canvas startup.
DESIRED_BEHAVIOUR: One shared in-flight / cached layout promise per userId (module or context); panels await the same result. localStorage paint-first path unchanged.
EVIDENCE: DraggablePanel.tsx L469–471 `void (actor as UiLayoutActor).getUserUiLayout()`. Panel ids in ChatPanel, BattleUIPanel, MapModifiersPanel, SettingsPanel, WorldExploration stats-panel. Distinct from PERF-011/012 (drag listeners / rAF). Helper can live outside WorldExploration.
RECOMMENDED_ACTION: Extract `loadUserUiLayoutOnce(actor, userId)` with promise dedupe; do not change snap math.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Race if one panel saves while others are still applying the shared fetch; LEAK-15 instance guards must still drop stale applies.
VALIDATION_REQUIRED: Enter world once; network tab shows a single getUserUiLayout; drag/fold one panel still persists; relogin restores positions.
STATUS: NEW

---

ACTION_ID: PERF-2026-09-22-083
TITLE: Feat unlock/claim mutations still console.log in production
CATEGORY: runtime-performance
PRIORITY: low
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/hooks/useAdminQueries.ts (useMarkAchievementUnlocked ~L358; useClaimAchievementReward ~L382–391)
CURRENT_BEHAVIOUR: LIST logging was DEV-gated (PERF-050), but UNLOCK / CLAIM / CREDIT still call `console.log` with response objects on every feat persist. Mid-combat unlocks hit the console on the main thread; with DevTools open this is a visible hitch.
DESIRED_BEHAVIOUR: Same `import.meta.env.DEV` gate as LIST.
EVIDENCE: useAdminQueries.ts L358–361, L382–391 unconditional console.log. Distinct from PERF-050 (query staleTime / LIST gate only) and from 077 (debug ring buffer).
RECOMMENDED_ACTION: Wrap the three logs in DEV checks. Do not change invalidateQueries paths.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: None for players; debug of feat credit needs DEV build or structured debugLogger.
VALIDATION_REQUIRED: Typecheck; unlock/claim a feat still invalidates playerAchievements / callerDokaBalance; production build has no [FEATS] console noise.
STATUS: IMPLEMENTED

---

ACTION_ID: PERF-2026-09-22-084
TITLE: Debug tab re-snaps click-trace state on every debug log line
CATEGORY: runtime-performance
PRIORITY: low
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/ChatPanel.tsx (~L736–748)
CURRENT_BEHAVIOUR: While `activeChannel === "debug"`, an effect depends on `debugEntries` and calls `setClickTraceEntries(getClickTraceBuffer())` on every structured log line. Combat/AI logging then causes two React commits per line (debugEntries + clickTraceEntries) even when the Clicks sub-view is not visible.
DESIRED_BEHAVIOUR: Refresh click traces only when `debugSubView === "clicks"`, or on a slower interval / explicit refresh, not on every log append.
EVIDENCE: Comment at L736–743 admits debugEntries is a deliberate tick; effect at L745–748. Subscribe path at L709–718 already gates React mirror on the Debug channel. Distinct from 003 (subscriber gate) and 077 (prod buffer writes).
RECOMMENDED_ACTION: Gate the effect on `debugSubView === "clicks"` (and channel). Do not change clickTrace buffer capacity.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Clicks sub-view may lag one log tick behind new click outcomes until the next click or sub-view toggle — acceptable if toggle re-snaps.
VALIDATION_REQUIRED: Open Debug → Log during battle; React commit count should be ~1 per log. Switch to Clicks; traces still appear after a map click.
STATUS: IMPLEMENTED

---

ACTION_ID: PERF-2026-09-22-085
TITLE: Leaderboard query keeps default window-focus refetch while the modal is open
CATEGORY: runtime-performance
PRIORITY: low
CONFIDENCE: medium
FILES_OR_SYSTEMS: src/frontend/src/hooks/useLeaderboardQueries.ts (~L15–40); src/frontend/src/components/GameFlow.tsx (LeaderboardModal ~L482)
CURRENT_BEHAVIOUR: `useGetLeaderboard` sets `staleTime: 30_000` but not `refetchOnWindowFocus: false`. The modal mounts the hook only while open; alt-tabbing with Board open re-hits `getLeaderboard`, remaps bigint fields, and re-renders the 50-row table under the live world tree.
DESIRED_BEHAVIOUR: `refetchOnWindowFocus: false` (mutations / explicit reopen can still refresh). Aligns with catalog gating (PERF-061) without changing the global QueryClient (PERF-070).
EVIDENCE: useLeaderboardQueries.ts L38–39; GameFlow LeaderboardModal calls useGetLeaderboard only when `showLeaderboard`. Distinct from PERF-009/070 (Doka / global default).
RECOMMENDED_ACTION: Add refetchOnWindowFocus false on this query only.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Rankings from another tab lag until close/reopen or staleTime expiry on remount.
VALIDATION_REQUIRED: Open Board; alt-tab after 30s; no extra getLeaderboard; reopen still loads.
STATUS: IMPLEMENTED
