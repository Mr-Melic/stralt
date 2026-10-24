# ACTION_IDs — 2026-10-24 Performance Auditor

Did **not** change WorldExploration, the world RAF schedule, or gameplay timing.
Did **not** re-file PERF-2026-08-31-001..010, 09-01-011..036, 09-02-037..060,
09-21-061..070, 09-22-071..085, 09-23-086..101, 09-24-102..107, 09-25-108..113,
09-26-114..118, 09-27-119..125, 09-28-126..132, 09-29-133..136, 10-21-137..142,
10-22-143..147, 10-23-148..172.

No SAFE disjoint implementation this increment: remaining player-visible
fixes sit on WorldExploration / occupancy.ts / ChatPanel / soundEngine /
App.tsx / vite.config.js / LandingPage / DraggablePanel / canvasLoopActivity,
all already in the oldest-first stack (`occupancy.ts` is in #383 and #486).
Prefer landing already-open SAFE PRs #350, #392/#412, #429, #447, #511, #594,
#643, #687, #745, #797, #841, #889.

Did not re-file TARGET-BISECT-on-RAF (111), walk-mode BFS (006), hover
getBoundingClientRect (164), context-restore Date.now (148), or CharacterSelection
inline `chessPiecePatterns` (168 / #966).

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
| 127–132, 134–147, 156–172 | reported on those days | do not re-file |

---

ACTION_ID: PERF-2026-10-24-173
TITLE: Summon spawn/AI rebuilds occupancy and runs O(open-cell) unique-bridge floods on the main thread
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/engine/occupancy.ts (collectMandatoryProgressionCells ~190–213, floodPassable ~140–176); src/frontend/src/components/WorldExploration.tsx (player spawn ~9247–9265, hostile spawn ~14938–14956, summon AI ~15203–15214)
CURRENT_BEHAVIOUR: Every player summon, enemy summon, and player-side summon AI tick maps the string tile grid into a fresh boolean[][] (twice at several sites), then `collectMandatoryProgressionCells` flood-fills from the player and, for every remaining open cell, flood-fills again with that cell blocked. `floodPassable` uses `Array.shift()` (O(n) per dequeue). On a mostly-open 16×16 map that is ~100 BFS passes during a single summon action, on the enemy-turn `setTimeout` that already contends with the canvas RAF.
DESIRED_BEHAVIOUR: Reuse one walkable grid + reserved-bridge set until map / barriers / player-start change. Replace `shift()` with an index pointer (semantics unchanged). Do not skip the unique-bridge rule — summons must still refuse the only player→portal cells.
EVIDENCE: occupancy.ts ~204–211 loops `for (const k of open)` and re-floods; WX spawn/AI sites each allocate `(currentMap.tiles ?? []).map(row => row.map(t => t !== "wall"))` then call collectMandatory. Distinct from PERF-142 (portal CA / map gen hitch).
RECOMMENDED_ACTION: occupancy.ts is in older #383 / #486 — union, do not overwrite their mandatory-progression delta. Do not change spawn fallback or `isCellFree` rules. Prompt forbids map-generation edits; this is combat occupancy, not `mapGen`.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: A stale reserved set after a barrier spawn can park a summon on the last corridor and seal the portal. Returning a cached Set that a caller mutates would poison later spawns.
VALIDATION_REQUIRED: Summon in a 1-wide corridor to a portal (must relocate); summoner-enemy turn with two summons; rest-exit / dungeon portal still reachable; `node --test occupancy.mandatory.test.ts occupancy.passability.test.ts`.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-24-174
TITLE: World canvas still pays three full-surface fills every frame after the starfield GPU buffer is released
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (render ~7269–7275); src/frontend/src/engine/starfieldActivity.ts (pause_release_gpu)
CURRENT_BEHAVIOUR: Every RAF `clearRect`s the backing store, fills opaque `#0a0c18`, then fills `rgba(8,10,22,0.55)` “so tiles read clearly over starfield”. PERF-001/049 already stop the root starfield and shrink it to 1×1 while WorldExploration is mounted, so the overlay no longer composites over stars. On mobile that is three full-viewport 2D fills at 60 fps under the live tile/entity pass.
DESIRED_BEHAVIOUR: One opaque fill per frame. Drop `clearRect` (the opaque fill covers the bitmap). Drop or bake the 55% overlay; it was for a starfield that is no longer visible in-world.
EVIDENCE: render() comments “Subtle overlay so tiles read clearly over starfield”; animate() still calls render every frame; starfieldActivity `worldPaused → pause_release_gpu`. Distinct from PERF-005 (tile texture cache) and PERF-049 (starfield buffer release).
RECOMMENDED_ACTION: WorldExploration restack. Skipping `clearRect` is semantically safe; removing the overlay needs a side-by-side screenshot (darker floors). Do not fold into RAF scheduling.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Floor/wall contrast and hover diamonds can look darker without the overlay. A transparent portal skip-frame currently relies on the last opaque fill remaining on the bitmap.
VALIDATION_REQUIRED: Desktop and mobile explore + battle screenshots vs current; portal transition is not a black flash; starfield still animates on landing after leaving the world.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-24-175
TITLE: Occupancy probes linear-scan the live enemy list on every neighbour during AI pathing
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (`isOccupied` closures ~9267–9269, ~14958–14963, ~15216–15219); src/frontend/src/engine/occupancy.ts (`isCellFree`)
CURRENT_BEHAVIOUR: Spawn and summon-AI occupancy contexts pass `isOccupied: (c) => enemiesRef.current.some(...) || player tile`. `isCellFree` calls that for every in-bounds neighbour of a BFS/ring scan. An enemy walk or summon relocate on a 16×16 map is O(tiles × living combatants) with a fresh `.some` allocation of the callback per cell. Distinct from PERF-173 (unique-bridge floods) and from PERF-034 (activeEffects filter per sprite).
DESIRED_BEHAVIOUR: Build a `Set<"x,y">` of occupied cells once per AI/spawn decision; `isOccupied` is a Set lookup. Rebuild when a unit actually moves.
EVIDENCE: WX hostile-summon and summon-AI `isOccupied` use `enemiesRef.current.some`; occupancy.ts `isCellFree` documents the callback as the occupancy-only check. Player-visible as a hitch on the enemy-turn timeout, not a RAF leak.
RECOMMENDED_ACTION: Same occupancy restack as 173 (#383/#486). Do not change passability (barriers/void/portals still in `isCellFree`).
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: A Set built before a same-turn walk lands two units on one tile. Must include the player tile and exclude the mover’s origin when vacating (`occupancyVacating` already exists).
VALIDATION_REQUIRED: Two enemies cannot stack after an AI walk; summon spawn fallback still finds a free cell; Attack Nearest / player walk occupancy unchanged.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-24-176
TITLE: Tile-corner hit-test cache rebuilds on every raw window.resize while canvas size is already 50ms-debounced
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (rebuildTileCornerCache ~8842–8867; extra window.resize ~8869–8874; canvas ResizeObserver ~13971–13996)
CURRENT_BEHAVIOUR: `rebuildTileCornerCache` allocates a 256-entry `Map` of diamond centers. It already re-runs when `canvasSize` / tile size / `isDesktop` change. A second effect also listens to `window.resize` and rebuilds immediately — no equality guard, no debounce. Mobile URL-bar show/hide therefore: (1) rebuilds the corner map, (2) `setIsDesktop` without equality (PERF-092) re-renders the world tree, (3) 50ms later the canvas observer commits size and rebuilds the corner map again. Hit-testing during that window mixes live camera with a cache that still keys only `gx,gy` (PERF-032).
DESIRED_BEHAVIOUR: Rebuild only from the debounced canvas-size path. Drop the extra window.resize listener. Keep the 50ms mid-frame guard so `canvas.width=` does not clear during `animate()`.
EVIDENCE: Dedicated `window.addEventListener("resize", () => rebuildTileCornerCache())` at ~8871; canvas path already `scheduleApplySize` at 50ms ~13976. Distinct from PERF-147 (canvasSize object identity) and PERF-032 (camera not in the key).
RECOMMENDED_ACTION: WorldExploration restack. Do not change diamond hit geometry. Pair with 032 if camera-follow still writes pixels into a gx,gy cache.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Rotate/resize must still retarget hover diamonds before the next click. Desktop static camera must not start following.
VALIDATION_REQUIRED: Narrow viewport: rotate, URL-bar hide, click a distant tile and an enemy; hover diamond matches the pointer; no black frame during resize.
STATUS: NEW
