# ACTION_IDs — 2026-10-28 Performance Auditor (canvas / RAF / particles)

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
pause (001 / 049).

No SAFE disjoint implementation this increment: remaining player-visible canvas
fixes sit on WorldExploration / effects.ts (#1122) / LandingPage / pieceArt.ts
(#1059 / #966) / barrierRender.ts / occupancy.ts — all already in the
oldest-first stack. Prefer landing already-open SAFE PRs #350, #392/#412, #429,
#447, #511, #594, #643, #687, #745, #797, #841, #889, #966, #1059, #1122.

## Residual on HEAD (already ledgered; still open)

| ID | Still on HEAD | Where it lives |
|---|---|---|
| 005 / 036 / 037 / 038 | Live floor/wall/hazard/AO/shimmer grain every RAF | WX stack |
| 174 | Triple full-surface clear/fill every frame | #1009 |
| 179 / 035 | Per-entity radial drop shadow | WX stack |
| 183 | Idle EffectsManager tick skip | #1122 |
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
RECOMMENDED_ACTION: Land after / union with #1122 (`effects.ts`). Pure zero-path early return is SAFE once that file is free. Do not change JUICE timing constants.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Shake during hit-stop / kill must still jitter; disabled-shake path must stay at 0,0.
VALIDATION_REQUIRED: Overworld idle; land a crit (shake visible); juice idle skip (#1122) still avoids tick work.
STATUS: NEW

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
