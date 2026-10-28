# ACTION_IDs — 2026-10-28 Performance Auditor

Two passes same day:
1. Canvas / RAF / particles → PERF-191..198 (below).
2. React / subscriptions / modals / timers → PERF-199..204 (appended).

Did **not** change WorldExploration, the world RAF schedule, or gameplay timing.
Did **not** re-file PERF-2026-08-31-001..010, 09-01-011..036, 09-02-037..060,
09-21-061..070, 09-22-071..085, 09-23-086..101, 09-24-102..107, 09-25-108..113,
09-26-114..118, 09-27-119..125, 09-28-126..132, 09-29-133..136, 10-21-137..142,
10-22-143..147, 10-23-148..172, 10-24-173..176, 10-25-177..182, 10-26-183..186,
10-27-187..190.

Explicitly **not** re-reported (user / residual): fractional-DPR `canvas.width`
clear (187), occupancy BFS `shift` + `collectOccupiedCells` (189), combatant
per-pixel `fillRect` (184 / 066), barrier 6-layer live paths (185 / 098), idle
juice skip (183 / #1122), owner-tint `shadowBlur` (178 / #1059 / 067), starfield
pause (001 / 049), Chat scrollHeight (190), Spellbook full grid (186).

Implemented this increment: PERF-2026-10-28-192 (`shakeOffsetActivity.ts` as
the formula spec + inlined idle `getShakeOffset` in `effects.ts` with a
reused `ZERO_SHAKE_OFFSET`). Did **not** union #1122's idle `tick()` skip —
that import/tick hunk conflicts on `effects.ts` in oldest-first stack merge.
Did **not** land 201 (GameFlow / GameOverModal stacked: #335/#421/#435/#490)
or 204 (BuffShop stacked: #372/#408/#490/#526/#595). Prefer landing
already-open SAFE PRs #350, #392/#412, #429, #447, #511, #594, #643, #687,
#745, #797, #841, #889, #966, #1059, #1122, #1185.

## Residual on HEAD (already ledgered; still open)

| ID | Still on HEAD | Where it lives |
|---|---|---|
| 005 / 036 / 037 / 038 | Live floor/wall/hazard/AO/shimmer grain every RAF | WX stack |
| 174 | Triple full-surface clear/fill every frame | #1009 |
| 179 / 035 | Per-entity radial drop shadow | WX stack |
| 183 | Idle EffectsManager tick skip | #1122 (left to that PR; not unioned) |
| 184 | Combatant per-pixel `fillRect` | WX / pieceArt |
| 185 / 098 | Barrier 6-layer live paths | HUMAN (`barrierRender.ts`) |
| 187 | Fractional-DPR `canvas.width` clear every RAF | WX stack |
| 189 | Occupancy BFS `shift` + full-grid collect | occupancy stack |
| 040 / 043 / 046 / 048 | Dust / doka loot / labels / leader particles | WX stack |

---

ACTION_ID: PERF-2026-10-28-191
TITLE: Overworld portal whirlpools tessellate 3×N spiral paths every RAF
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (`drawPortalWhirlpool` ~4023–4051; called from portalDepthItems draw ~7908)
CURRENT_BEHAVIOUR: Each non-rest / non-battle portal stroke-builds 3 layers × up to 6 spirals × ~63 `lineTo` segments (`t += 0.1` over `2π`) every frame. Multi-portal overworld maps pay hundreds of path ops under the live world canvas. Distinct from PERF-036 (battle portal cube fillRects / hazard pixels) and PERF-005 (floor/wall grain).
DESIRED_BEHAVIOUR: Bake a rotating sprite / thinner animated overlay; keep whirlpool timing look. Do not change portal enter rules.
EVIDENCE:
```4023:4051:src/frontend/src/components/WorldExploration.tsx
      // Draw multiple spiral layers
      for (let layer = 0; layer < 3; layer++) {
        const layerRadius = radius - layer * 8;
        const spiralCount = 6 - layer;
        // ...
          ctx.beginPath();
          for (let t = 0; t < Math.PI * 2; t += 0.1) {
            const r = spiralRadius * (1 - t / (Math.PI * 2));
            // ... moveTo / lineTo ...
          }
          ctx.stroke();
```
RECOMMENDED_ACTION: Visual-approved blit. WorldExploration is stacked — do not land here. Do not fold into RAF scheduling.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Dungeon / boss / colour portal recognizability and pulse timing can drift.
VALIDATION_REQUIRED: Side-by-side overworld portals (blue/dungeon/boss/rest); enter still works; mobile frame pacing improves near multi-portal hubs.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-28-192
TITLE: getShakeOffset allocates and rolls Math.random every RAF even at zero intensity
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/engine/effects.ts (`getShakeOffset` ~314–320); src/frontend/src/components/WorldExploration.tsx (render ~7266–7267)
CURRENT_BEHAVIOUR: Every world frame calls `getShakeOffset()`. When shake is enabled (default) it always allocates a fresh `{x,y}` and calls `Math.random()` twice, even while `intensity === 0` (the common overworld / idle-battle case). Distinct from PERF-183 (idle *tick* skip — draw path still queries shake) and PERF-132 (survivors array).
DESIRED_BEHAVIOUR: Return a reused zero vector when intensity &lt; epsilon; only sample RNG while shaking. No change to shake feel or hit-stop length.
EVIDENCE:
```314:320:src/frontend/src/engine/effects.ts
  getShakeOffset(): { x: number; y: number } {
    if (!JUICE.shake.enabled) return { x: 0, y: 0 };
    const i = this.shakeState.intensity;
    return {
      x: (Math.random() - 0.5) * i * 2,
      y: (Math.random() - 0.5) * i * 2,
    };
  }
```
```7266:7267:src/frontend/src/components/WorldExploration.tsx
    const _shake = effectsManagerRef.current.getShakeOffset();
    ctx.translate(_shake.x, _shake.y);
```
RECOMMENDED_ACTION: Inline the idle early-return in `EffectsManager.getShakeOffset` (no new import — #1122 owns the `tick()` skip import). Keep `shakeOffsetActivity.ts` as the formula spec. Do not change JUICE timing constants or the 16ms tick argument.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Shake during hit-stop / kill must still jitter; disabled-shake path must stay at 0,0.
VALIDATION_REQUIRED: `node --experimental-strip-types --test src/frontend/src/engine/shakeOffsetActivity.test.ts`; overworld idle; land a crit (shake visible).
STATUS: IMPLEMENTED

---

ACTION_ID: PERF-2026-10-28-193
TITLE: Walk-mode MP BFS still Array.shift-pops every RAF
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (`getMpReachableTiles` ~7058–7092; render walk branch ~7341–7344)
CURRENT_BEHAVIOUR: While `battleActionModeRef === "walk"`, every RAF runs a full MP BFS that `queue.shift()`s each cell (O(n) per pop → quadratic on the open set) and rebuilds `portalKeys`. Distinct from PERF-006 (cache the reachable *set* until inputs change) and PERF-189 (occupancy `floodPassable` shift). Even a future cache miss / first paint still pays shift-quadratic BFS.
DESIRED_BEHAVIOUR: Index-cursor queue (same class as 189); keep walk legality identical. Pair with 006's version-keyed cache.
EVIDENCE:
```7058:7090:src/frontend/src/components/WorldExploration.tsx
    while (queue.length > 0) {
      const current = queue.shift()!;
      const nextSteps = current.steps + moveCostPerTile;
      // ...
          queue.push({ x: nx, y: ny, steps: nextSteps });
```
RECOMMENDED_ACTION: WorldExploration is stacked. Index-queue helper can land as a NEW file, but wiring still touches WX — treat as HUMAN until the stack clears. Do not change walk MP math.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Wrong reachable ring after Slime/Frozen modifiers or summon-control origin.
VALIDATION_REQUIRED: Walk highlight matches clicks after MP spend, barriers, summon control; no flicker with `applyMpCost` (006).
STATUS: NEW

---

ACTION_ID: PERF-2026-10-28-194
TITLE: animate() reallocates camera {x,y} objects every frame (desktop included)
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (animate camera block ~8768–8784; `updateCameraToFollowPlayer` desktop branch ~5896–5899)
CURRENT_BEHAVIOUR: Every RAF builds a new `cameraRef.current = { x, y }` even when already at target. On desktop, `updateCameraToFollowPlayer` then also assigns two fresh `{ x: 0, y: 0 }` objects every frame. Distinct from PERF-032 (mobile cache/camera correctness) and PERF-014 (enemy movement setState).
DESIRED_BEHAVIOUR: Mutate camera fields in place (or skip write when unchanged). No change to follow smoothing or deadzone.
EVIDENCE:
```8775:8784:src/frontend/src/components/WorldExploration.tsx
        cameraRef.current = {
          x:
            Math.abs(deltaX) > threshold
              ? prev.x + deltaX * smoothingFactor
              : target.x,
          y:
            Math.abs(deltaY) > threshold
              ? prev.y + deltaY * smoothingFactor
              : target.y,
        };
```
```5896:5899:src/frontend/src/components/WorldExploration.tsx
    if (isDesktop) {
      cameraRef.current = { x: 0, y: 0 };
      targetCameraRef.current = { x: 0, y: 0 };
      return;
    }
```
RECOMMENDED_ACTION: In-place mutate. WorldExploration / RAF-adjacent — HUMAN. Do not change follow speed or deadzone constants.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Mobile follow can desync if a shared object is mutated while a stale closure holds it; keep refs as the single owner.
VALIDATION_REQUIRED: Desktop static camera; mobile follow while walking; rest/Death Realm recenter still snaps.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-28-195
TITLE: drawPortalWhirlpool rebuilds the portalColors Record on every portal every frame
CATEGORY: runtime-performance
PRIORITY: low
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (`drawPortalWhirlpool` ~3900–3915)
CURRENT_BEHAVIOUR: Each portal draw allocates a fresh `Record&lt;PortalColor, string[]&gt;` literal (12 colour families) then indexes it. Multi-portal maps allocate that object every RAF per portal. Distinct from 191 (spiral tessellation cost) and PERF-036 (battle cube pixels).
DESIRED_BEHAVIOUR: Module-level const palette table (NEW helper file is enough for the data; WX must import it).
EVIDENCE:
```3900:3915:src/frontend/src/components/WorldExploration.tsx
      const portalColors: Record<PortalColor, string[]> = {
        black: ["#000000", "#333333", "#666666"],
        blue: ["#001133", "#003366", "#0066cc"],
        // ... dungeon / boss / rest / white ...
      };

      const colors = portalColors[color] ?? portalColors.blue;
```
RECOMMENDED_ACTION: Hoist to `portalWhirlpoolPalette.ts`. Wiring edits WorldExploration — stack-aware. No visual change if values stay identical.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Missing a PortalColor key falls back wrong; keep `?? portalColors.blue`.
VALIDATION_REQUIRED: Each portal colour family still matches; typecheck.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-28-196
TITLE: Landing logo builds a new rgb() fillStyle string per cube every frame
CATEGORY: runtime-performance
PRIORITY: low
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/LandingPage.tsx (SkateStyleTitle animate ~170–179)
CURRENT_BEHAVIOUR: Every bright cube formats `rgb(...)` via template string, then may also set `shadowBlur` (054). Distinct from PERF-054/042 (shadowBlur substitute) and PERF-075 (per-letter strokeText) and PERF-167 (mount-time getImageData).
DESIRED_BEHAVIOUR: Quantize brightness to a small prebuilt colour LUT, or reuse last fillStyle when brightness is unchanged. Keep brand flicker.
EVIDENCE:
```170:179:src/frontend/src/components/LandingPage.tsx
          const pinkIntensity = Math.floor(255 * cube.brightness);
          const pink = `rgb(${Math.min(255, pinkIntensity + 120)}, ${Math.floor(pinkIntensity * 0.6)}, ${Math.floor(pinkIntensity * 0.8)})`;

          ctx.fillStyle = pink;
          ctx.fillRect(cube.x, cube.y, cube.size, cube.size);

          if (cube.brightness > 0.5) {
            ctx.shadowColor = pink;
            ctx.shadowBlur = cube.size * 1.5;
```
RECOMMENDED_ACTION: LandingPage is stacked. Colour LUT can be a NEW helper; visual must stay on-brand. Pair with 054 blur substitute when art signs off.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Banding if the LUT is too coarse; shadowBlur path still expensive until 054 lands.
VALIDATION_REQUIRED: Landing title flicker on desktop/mobile; tab-hidden pause (058) still stops RAF.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-28-197
TITLE: Nearby dungeon portal labels measureText + roundRect every RAF
CATEGORY: runtime-performance
PRIORITY: low
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (portalDepthItems dungeon label ~7916–7940)
CURRENT_BEHAVIOUR: While the player is within Chebyshev ≤ 3 of a dungeon / chain portal, every RAF `measureText`s the label, builds a `roundRect`, and stroke/fills text. Distinct from PERF-046 (enemy name/level labels) and PERF-043 (doka loot glow).
DESIRED_BEHAVIOUR: Cache label metrics until depth / chain-active text changes; keep bob-free static badge.
EVIDENCE:
```7916:7939:src/frontend/src/components/WorldExploration.tsx
              if (p.color === "dungeon" || dungeonChainActiveRef.current) {
                const dx = Math.abs(playerPositionRef.current.x - p.x);
                const dy = Math.abs(playerPositionRef.current.y - p.y);
                if (dx <= 3 && dy <= 3) {
                  const labelText = dungeonChainActiveRef.current
                    ? `⚔️ Continue Chain (${dungeonChainDepthRef.current}/${dungeonChainMaxDepthRef.current})`
                    : "⚔️ Enter Dungeon Chain";
                  // ...
                  const lw = ctx.measureText(labelText).width + 10;
                  // ... roundRect + fillText ...
```
RECOMMENDED_ACTION: Ref cache keyed by chain depth + active flag. WorldExploration stacked — HUMAN.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Stale "Continue Chain (n/m)" after depth advances if the key omits depth.
VALIDATION_REQUIRED: Approach dungeon portal; enter chain; label updates at next depth; leave range hides it.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-28-198
TITLE: portalDepthItems allocates a new draw closure per portal every RAF
CATEGORY: runtime-performance
PRIORITY: low
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (portal pass ~7743–7945; depth sort ~7980–7984)
CURRENT_BEHAVIOUR: The row loop pushes `{ depth, draw: () => { ... } }` for every portal every frame, capturing a fresh `_portalSnapshot`. Combined with 191's spiral work and 039's mapped sort copies, this is per-frame GC on the map-render path. Distinct from PERF-039 (wall/portal `.map` copies at sort) and PERF-022 (Set/Map rebuilds for highlights).
DESIRED_BEHAVIOUR: Reuse a typed portal draw buffer; update snapshot fields in place; avoid new function objects unless portal set changes.
EVIDENCE:
```7748:7757:src/frontend/src/components/WorldExploration.tsx
        const _portalSnapshot = {
          portal,
          screenPos,
          inBattle: inBattleRef.current,
          tw2: effectiveTileW,
          th2: effectiveTileH,
        };
        portalDepthItems.push({
          depth: portal.x + portal.y,
          draw: () => {
```
RECOMMENDED_ACTION: Buffer reuse helper possible, but call sites are inside WX render — HUMAN. Do not change painter's-algorithm depth.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Stale `inBattle` / screenPos in a reused closure can draw whirlpools during battle cubes or misplace portals after camera move.
VALIDATION_REQUIRED: Enter battle (teal portal cubes); leave; multi-portal depth sort vs walls/units still correct.
STATUS: NEW

---

# Second pass — React / subscriptions / modals / timers (same day)

Did **not** re-file 001–198 (including the canvas/RAF 191–198 block above).
Focus: App / main / GameFlow / ChatPanel / BattleUI / Spellbook / BuffShop /
Achievements / GameOver / Landing / CharacterSelection / Initiative /
DraggablePanel / hooks / soundEngine. RAF internals skipped except React
setState from RAF (none newly filed here beyond residual 181).

Prefer landing already-open SAFE PRs #350, #392/#412, #429, #447, #511, #594,
#643, #687, #745, #797, #841, #889, #966, #1059, #1122, #1185.

---

ACTION_ID: PERF-2026-10-28-199
TITLE: Canvas ResizeObserver mount effect permanently no-ops while the map is still generating
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (canvasSize init ~1165; RO effect ~13945–14010 deps `[]`; early `!currentMap` return ~17440; `canvasAreaRef` JSX ~17861; map init ~13722)
CURRENT_BEHAVIOUR: `canvasSize` starts at `{ width: 1200, height: 800 }`. The only `setCanvasSize` call is inside the ResizeObserver `applySize` effect, which captures `canvasAreaRef.current` once with `[]` deps. On first paint `currentMap` is still null (tier config async), so the effect sees `area == null` and returns without observing. When the map later mounts the canvas area, the effect does **not** re-run. Drawing and DPR sizing stay locked to the 1200×800 default for the whole session; CSS stretches that buffer to the live viewport. Distinct from PERF-147 (RO identity churn when it *does* fire), PERF-176 (tileCornerCache on window.resize), and PERF-187 (fractional-DPR clear of an already-chosen size).
DESIRED_BEHAVIOUR: Bind (or re-bind) the observer when `canvasAreaRef` actually mounts — e.g. effect deps on `currentMap` / `showGameOver`, or a layout effect that retries until `area` is non-null. Keep the 50ms debounce and mid-frame deferral.
EVIDENCE: `setCanvasSize` appears only at applySize ~13968; RO effect deps are `[]` at ~14010; `currentMap` useState init is `null` at ~1101; first paint hits the Generating-world early return before `ref={canvasAreaRef}` at ~17862.
RECOMMENDED_ACTION: WorldExploration is stacked — do not land here. A tiny `bindCanvasAreaResize` helper is fine once WX can call it from a deps-correct effect. Do not change hit-test geometry in the same PR.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Re-binding on every map change must disconnect the previous observer; a double-observe can fight the debounce and clear the canvas mid-frame (same class as 187).
VALIDATION_REQUIRED: Cold world entry on a phone-width and ultrawide desktop; `canvasSize` matches the canvas CSS box; rotate / URL-bar resize still updates; portal transition does not leave a 0×0 observer.
STATUS: NEW
DISJOINT_SAFE_HELPER: No — observer bind site is inside WorldExploration.tsx (stacked).

---

ACTION_ID: PERF-2026-10-28-200
TITLE: Game Over early-return leaves the 1 Hz watchdog restarting a null-canvas RAF every ~2s
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (animate null-ctx path ~8747–8759; watchdog ~13776–13791; `showGameOver` early return ~17425–17438; death `setInBattle(false)` then `setShowGameOver(true)` ~13307–13310)
CURRENT_BEHAVIOUR: `showGameOver` early-returns **after** hooks, so WorldExplorationInner stays mounted: the RAF mount effect does **not** clean up and starfield stays paused. The canvas node leaves the tree, so the next `animate` frame reads `canvasRef.current == null`, takes the `!_animCtx` branch, and `return`s **without** chaining `requestAnimationFrame`. The 1 Hz watchdog still runs; after `performance.now() - lastFrameTime > 2000` it logs `[GameLoop] Watchdog: loop appears dead` and restarts RAF into the same null-canvas dead-end. During a multi-second death modal this repeats every ~2s. On Respawn the canvas remounts but paint waits for the next watchdog tick (up to ~1s). Distinct from PERF-188 (HUD child remount / overlay desire — its evidence that the RAF *effect* unmounts is incorrect for an after-hooks early return), PERF-010 (hidden-tab watchdog), and PERF-148 (restore clock skew).
DESIRED_BEHAVIOUR: Keep the canvas mounted under Game Over (188), **or** pause the watchdog while `showGameOver` / canvas is detached and explicitly `requestAnimationFrame` on Respawn when the canvas ref is back. Do not change death persist or the 1.5s Death Realm gate.
EVIDENCE: Early return after hooks ~17425; animate null path returns without rAF ~8748–8759; watchdog setInterval 1000 ms restarts animateRef ~13778–13790; death path `setInBattle(false); setShowGameOver(true)` ~13309–13310.
RECOMMENDED_ACTION: Prefer the 188 overlay fix (keeps canvas + loop). If overlay slips, gate the watchdog on `canvasRef.current` / `showGameOver`. WorldExploration is stacked.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Pausing the watchdog without a Respawn kick can leave a black Death Realm until the player portals. Overlay must not let leftover enemy timers race `applyRewards`.
VALIDATION_REQUIRED: Die in battle; death modal open ≥5s with no watchdog spam / no RAF churn; Respawn paints Death Realm within one frame; starfield stays paused until leave-world.
STATUS: NEW
DISJOINT_SAFE_HELPER: No — watchdog / animate live in WorldExploration.tsx (stacked). Overlay (188) is the clean fix.

---

ACTION_ID: PERF-2026-10-28-201
TITLE: Chat getMessages poll resumes during Game Over because death clears inBattle
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/GameFlow.tsx (`isPaused={isInBattle || isTransitioning}` ~277); src/frontend/src/components/ChatPanel.tsx (poll effect ~942–957); src/frontend/src/components/WorldExploration.tsx (death `cleanupBattle` + `setInBattle(false)` + `setShowGameOver(true)` ~13307–13310); src/frontend/src/components/GameOverModal.tsx
CURRENT_BEHAVIOUR: ChatPanel is a GameFlow **sibling** of WorldExploration, so the Game Over early-return does not unmount it. `_handlePlayerDeath` calls `cleanupBattle` and `setInBattle(false)` before showing Game Over, which clears GameFlow `isPaused`. The 2s `getMessages` interval therefore **resumes** for the whole death-modal dwell (canister round-trips under a still-mounted world hook tree). Distinct from PERF-177 (overworld / folded poll — same interval, different life-cycle) and PERF-188 (WX canvas/HUD remount).
DESIRED_BEHAVIOUR: Keep chat paused for the Game Over overlay (treat death overlay like battle/transition). Battle-log unread and Clear log stay as they are.
EVIDENCE: GameFlow passes `isPaused={isInBattle || isTransitioning}` only ~277; ChatPanel starts `setInterval(..., 2000)` when `!isPaused` ~942–955; death path sets `setInBattle(false)` then `setShowGameOver(true)` ~13309–13310.
RECOMMENDED_ACTION: SAFE disjoint path: new `deathOverlayActivity.ts` flag set from `GameOverModal` mount/unmount; GameFlow ORs it into `isPaused`. Does **not** require editing ChatPanel or WorldExploration. Do not change the 2s overworld poll here (177).
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Flag must clear on Respawn and on leave-world so overworld chat returns; a stuck true pauses chat forever.
VALIDATION_REQUIRED: Die in battle; no `getMessages` while the death dialog is open; Respawn / Death Realm chat poll resumes when appropriate; folded unread still works in overworld.
STATUS: NEW
DISJOINT_SAFE_HELPER: Yes — `src/frontend/src/engine/deathOverlayActivity.ts` (+ GameOverModal mount + GameFlow `isPaused` OR). ChatPanel / WorldExploration untouched.

---

ACTION_ID: PERF-2026-10-28-202
TITLE: DraggablePanel drag path forces layout via offsetWidth/offsetHeight on every mousemove
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/DraggablePanel.tsx (onMove ~646–676; clampPosition ~576–588; release snap ~689–697)
CURRENT_BEHAVIOUR: PERF-012 coalesces React `setPosition` / `setSnapPreview` to one rAF, but `onMove` still reads `el.offsetWidth` and `el.offsetHeight` on **every** pointermove before queuing (and again inside `clampPosition` when used). Under the live world canvas, dragging Battle UI / Settings / Map Effects forces synchronous layout at input rate. Distinct from PERF-012 (setState coalesce), PERF-011 (attach-on-start listeners), and PERF-158 (resize/orientation listeners reading offset on window resize).
DESIRED_BEHAVIOUR: Cache panel size at drag-start (and refresh from ResizeObserver); use the cached `w`/`h` for live snap + clamp during the gesture. Release snap may re-measure once.
EVIDENCE: `const w = el.offsetWidth; const h = el.offsetHeight;` inside onMove ~662–663 before `requestAnimationFrame(flushPendingDrag)`; `clampPosition` also reads offsetWidth/Height ~580–581.
RECOMMENDED_ACTION: DraggablePanel is stacked. Land a size-cache after those PRs, or extract `panelDragLayout.ts` once the file is free. Do not change snap distances.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Stale size while content reflows mid-drag (fold toggle mid-gesture is already blocked by drag). Snap ghost must still match the panel box.
VALIDATION_REQUIRED: Drag chat and battle panels quickly on a phone URL-bar resize; snap preview tracks; release edge-snaps; no extra world jank vs baseline.
STATUS: NEW
DISJOINT_SAFE_HELPER: Partial — a `panelDragLayout.ts` helper can own the cache math, but DraggablePanel.tsx (stacked) must call it.

---

ACTION_ID: PERF-2026-10-28-203
TITLE: Always-mounted AchievementsPanel still subscribes to feats queries while closed
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/AchievementsPanel.tsx (hooks ~45–48 before `if (!isOpen) return null` ~196); src/frontend/src/components/WorldExploration.tsx (always mounts `<AchievementsPanel isOpen={achievementsOpen} />` ~17898; WX also calls `useGetAchievementConfigs` / `useGetPlayerAchievements` ~2166–2167)
CURRENT_BEHAVIOUR: PERF-060 filed the always-mounted panel. What remains player-visible on HEAD: the closed panel still runs `useGetAchievementConfigs` + `useGetPlayerAchievements` **before** the early return, creating a second React Query observer on top of WorldExploration’s own subscriptions. Mid-fight unlock / claim invalidations therefore re-render both the ~19k-line world tree **and** the closed AchievementsPanel (hooks + null return). Distinct from PERF-050 (staleTime / focus on the feats query itself) and from PERF-060’s mount-shape note — this is the duplicate-observer cost while `isOpen === false`.
DESIRED_BEHAVIOUR: Mount AchievementsPanel only when open, **or** split a presentational body so hooks run only while `isOpen`. Keep persistClaim on the WorldExploration lock.
EVIDENCE: AchievementsPanel.tsx ~45–48 hooks unconditionally; ~196 `if (!isOpen) return null`; WX ~17898 always renders the component; WX ~2166–2167 already subscribes to the same keys.
RECOMMENDED_ACTION: Conditional mount at the WX call site is smallest but touches WorldExploration (stacked). A body extract behind `isOpen` can live in a new file once WX passes children only when open.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Unmount-on-close must not drop an in-flight `persistClaim`; reopen must show fresh claimed state from the shared query cache.
VALIDATION_REQUIRED: Unlock a feat in battle with Feats closed — world still toasts; open Feats — rows match; claim through persist lock; no double Doka.
STATUS: NEW
DISJOINT_SAFE_HELPER: Partial — body extract is disjoint, but the always-mount call site is WorldExploration.tsx (stacked).

---

ACTION_ID: PERF-2026-10-28-204
TITLE: Always-mounted BuffShop still hydrates and re-persists inventory while closed
CATEGORY: runtime-performance
PRIORITY: low
CONFIDENCE: medium
FILES_OR_SYSTEMS: src/frontend/src/components/BuffShop.tsx (`useState(loadInventory)` ~178–180; persist effect ~205–207; early return ~279); src/frontend/src/components/WorldExploration.tsx (`<BuffShop … isOpen={itemShopOpen} />` ~17908)
CURRENT_BEHAVIOUR: BuffShop stays mounted with `isOpen={false}` (PERF-104 covers closure identity). Separately, on every world entry it `JSON.parse`s `${principal}_inventory` in the state initializer, then the persist `useEffect` writes the same blob back to localStorage on mount — while the modal returns null. Parent WorldExploration re-renders (wander / turn / HP) still execute those hooks. Distinct from PERF-104 (getLiveDoka / onDeductDoka identity) and PERF-130 (volume localStorage).
DESIRED_BEHAVIOUR: Mount BuffShop only when open, or defer `loadInventory` / `saveInventory` until `isOpen` (and keep the in-battle use path working when the shop is open).
EVIDENCE: BuffShop.tsx ~178–180 load on mount; ~205–207 save whenever `inventory` identity is set; ~279 `if (!isBuffShopOpen(isOpen)) return null`; WX always mounts ~17908.
RECOMMENDED_ACTION: Gate the persist effect with `isBuffShopOpen(isOpen)` in BuffShop (BuffShop is **not** on the stacked-file list — SAFE there). Do not move inventory off `${principal}_inventory`.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Gating persist on open must still flush a purchase made while open before close; battle item-use from a closed shop must keep using `inventoryRef` if that path stays mounted.
VALIDATION_REQUIRED: World entry with Items closed — no spurious inventory rewrite storm; buy while open persists; consume in battle; reopen shows stacks.
STATUS: NEW
DISJOINT_SAFE_HELPER: Yes — fix can live entirely in BuffShop.tsx (not stacked) by gating the persist effect / lazy-loading inventory on open; no WX rewrite required for the persist gate.
