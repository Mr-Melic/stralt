# ACTION_IDs — 2026-10-21 Performance Auditor (canvas / RAF-adjacent / memory)

Audit only. No WorldExploration RAF schedule or gameplay timing changes.

Already ledgered (do not re-file): PERF-001 through PERF-136.
Sibling same-day React/subscription audit (do not collide): PERF-2026-10-21-137 through 145
(including debugLogger prod buffer as 143). This ledger starts at 146.

Implemented this run: none.
Reported NEW: PERF-2026-10-21-146 through 152.

---

ACTION_ID: PERF-2026-10-21-146
TITLE: Portal transition runs CA retry + shift-BFS + N×ensureReachability + choke scan on the main thread
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (generateRandomMap ~4689–5120, portal choke scan ~6413–6463, applyFinalizedLayout ~6597); src/frontend/src/engine/mapGen.ts (finalizePlayableLayout ~1251–1351, ensureReachability ~943–1122, floodFillReachable ~287–314)
CURRENT_BEHAVIOUR: On portal step, WX synchronously (1) regenerates cellular-automata maps up to 50–100 attempts, each with a connectivity flood using `queue.shift()` and `arePortalsReachable` (another shift-BFS); (2) after enemies, `applyFinalizedLayout` / `finalizePlayableLayout` deep-copies tiles and calls `ensureReachability` once per portal (each re-floods via `floodFillReachable`’s `q.shift()`); (3) runs an O(cells×neighbors) choke/bottleneck scan before the portal timers. Dense archetypes amplify retries → main-thread hitch on every map change.
DESIRED_BEHAVIOUR: Index-based BFS queues; cap / early-accept generation; move choke metrics off the critical portal path or reuse flood results from finalize; avoid re-flooding once per extra portal when one punched graph already covers them.
EVIDENCE: `do { … } while (!arePortalsReachable… && attempts < maxAttempts)` with `maxAttempts = 100` when fillDensity ≥ 0.4; `finalizePlayableLayout` loop `for (let i = 1; i < portals.length; i++) { ensureReachability(...) }`; WX choke nested loops after `setCurrentMap`.
RECOMMENDED_ACTION: Engine-only BFS/finalize fixes first. Do not change portal gameplay rules or RAF schedule.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Solvability / portal reachability regressions if finalize is thinned incorrectly.
VALIDATION_REQUIRED: mapGen.solvability tests; dense corridorMaze / fortress portals; dungeon progression exit still reachable.
WHY_NOT_DUPLICATE: Not in 001–136. Distinct from tile-cache PERF-005 and hazard pixel work PERF-036 — generation/finalize hitch on portal, not per-frame draw.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-21-147
TITLE: soundEngine playNoise allocates a fresh AudioBuffer on every noise event
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/engine/soundEngine.ts (playNoise ~205–264; map_transition / spell_hit / critical_hit)
CURRENT_BEHAVIOUR: Each `playNoise` call does `ctx.createBuffer(1, sampleRate * duration, sampleRate)` and fills with `Math.random` samples. `map_transition` alone is 0.6s (~28k floats at 48 kHz) and fires on every portal. Buffers are not pooled; only voice count is capped.
DESIRED_BEHAVIOUR: Prebake or pool short noise buffers per (duration, filter profile); reuse across events.
EVIDENCE: `const buffer = ctx.createBuffer(1, length, ctx.sampleRate);` then per-sample loop inside `playNoise`. Portal path calls `playSound("map_transition")` before `cleanupMap`.
RECOMMENDED_ACTION: Pool buffers. Do not change mix levels or event timings.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Wrong buffer length/sampleRate after context recreate could distort whooshes.
VALIDATION_REQUIRED: Portal whoosh, spell hit, crit double-hit still audible; no growth after 50 portals in a heap snapshot.
WHY_NOT_DUPLICATE: Ledgered “AudioContext” (PERF-127) covered suspend-on-hidden, not per-event AudioBuffer allocation.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-21-148
TITLE: Summon owner-tint outline uses canvas shadowBlur every entity every frame
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/data/pieceArt.ts (strokeOwnerTint ~791–811; drawCombatant summon branch ~897–927)
CURRENT_BEHAVIOUR: Every living summon draws `strokeRect` with `ctx.shadowBlur = 8` via `strokeOwnerTint` from the unified `drawCombatant` path each RAF. shadowBlur is expensive; summon-heavy battles multiply it.
DESIRED_BEHAVIOUR: Cheap outline without shadowBlur; keep green/red owner tint semantics.
EVIDENCE: `ctx.shadowBlur = 8` in `strokeOwnerTint`; summon branch always calls it after `draw(...)`.
RECOMMENDED_ACTION: Visual-approved substitute. Do not change OWNER_TINT colors or summon control logic.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Summon silhouette readability vs enemy units.
VALIDATION_REQUIRED: Player wolf + enemy summon side-by-side; tint still readable without blur.
WHY_NOT_DUPLICATE: PERF-035 covered WX foot radials, moving-unit shadowBlur, and barrierRender towers — not pieceArt summon owner-tint blur.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-21-149
TITLE: EffectsManager.draw does save/translate/rotate/restore per death fragment
CATEGORY: runtime-performance
PRIORITY: low
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/engine/effects.ts (draw death branch ~282–292)
CURRENT_BEHAVIOUR: Each death effect nests `ctx.save/restore` around every fragment’s translate+rotate+fillRect (JUICE.death.fragments = 5). Concurrent deaths stack save churn on the world canvas.
DESIRED_BEHAVIOUR: Single save for the death effect; axis-aligned rects or one transform batch.
EVIDENCE: Inner loop `for (const f of eff.fragments) { ctx.save(); ctx.translate…; ctx.rotate…; ctx.fillRect…; ctx.restore(); }`.
RECOMMENDED_ACTION: Cheap draw path. Do not change death TTL (350ms) or fragment count without art sign-off.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Death puff look (spinning shards).
VALIDATION_REQUIRED: Multi-kill fragments still appear and expire; no juice timing change.
WHY_NOT_DUPLICATE: PERF-045 dual arrays / filter, PERF-047 tick(16), PERF-132 survivors alloc are tick-path; this is draw-path transform cost.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-21-150
TITLE: cleanupMap clears dokaLoot but not claimedGroundLootIdsRef (Set grows across maps)
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (claimedGroundLootIdsRef ~1371; cleanupMap setDokaLoot ~11763–11764; reset only ~6790 / ~6799)
CURRENT_BEHAVIOUR: One-shot ground-Doka claims stay in `claimedGroundLootIdsRef`. `cleanupMap` empties loot UI state but never clears the Set. Rest / white sanctuary / death paths call `cleanupMap` without hitting the portal loot reset. Claimed ids accumulate for the whole WorldExploration session.
DESIRED_BEHAVIOUR: Clear `claimedGroundLootIdsRef` inside `cleanupMap` (or whenever loot is wiped), respecting in-flight credit races.
EVIDENCE: Grep shows Set reset only at loot placement 6790/6799; cleanupMap only `setDokaLoot([])`.
RECOMMENDED_ACTION: Clear the Set in cleanupMap next to setDokaLoot, or only ids not mid-persist. Do not change credit/claim id format.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Clearing mid-flight credit could allow a remint if a persist callback races after map wipe.
VALIDATION_REQUIRED: Pick up coins, portal, rest portal, death realm; Set size stays near zero; no double mint on retry.
WHY_NOT_DUPLICATE: Dust/leader/coin particle clears in cleanupMap are already ledgered; this one-shot claim Set was not.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-21-151
TITLE: updateCombatant onMutation bumps world version and discards spellRangeCache on every HP patch
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/engine/combatantStore.ts (updateCombatant ~408–442); src/frontend/src/components/WorldExploration.tsx (onMutation ~1658–1661; getSpellRangeTiles cache key ~7142)
CURRENT_BEHAVIOUR: Every `updateCombatant` (lava/spikes RAF steps, DoT ticks, heals, reflect) remaps the full combatants/enemies/turnOrder arrays, fires three React setters, then `onMutation` increments `battleWorldVersionRef` and replaces `spellRangeCacheRef` with `new Map()`. Attack-mode frames that call `getSpellRangeTiles()` therefore miss cache after any HP-only patch. Not unbounded store growth, but repeated full-roster copies + cache thrash during battles.
DESIRED_BEHAVIOUR: Version-bump / cache clear only on position, add, remove, or barrier-relevant sync — not pure HP/stat patches.
EVIDENCE: `onMutation = () => { battleWorldVersionRef.current += 1; spellRangeCacheRef.current = new Map(); }`; `updateCombatant` always maps all three arrays.
RECOMMENDED_ACTION: Split structural vs cosmetic mutations. Do not change damage math or victory gates.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Stale spell tiles after a unit moves if structural bumps are missed.
VALIDATION_REQUIRED: Lava walk while attack mode selected; spell highlights stay correct after move/death/summon; HP-only ticks do not clear cache.
WHY_NOT_DUPLICATE: No prior PERF id covered onMutation↔spellRangeCache coupling. Distinct from PERF-006 (MP BFS cache).
STATUS: NEW

---

ACTION_ID: PERF-2026-10-21-152
TITLE: Battle-start occupancy deep-clones the full tile grid to boolean[][]
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (checkBattleTrigger ~11834–11847)
CURRENT_BEHAVIOUR: On every overworld encounter trigger, occupancy context builds `tiles: (currentMap.tiles ?? []).map((row) => (row ?? []).map((t) => t !== "wall"))` — a full 16×16 nested allocation — plus new Sets for barriers/portals. Runs on the same turn as battle placement BFS.
DESIRED_BEHAVIOUR: Pass a walkability predicate / shared mask (reuse a map-id-keyed Uint8Array) instead of cloning the string grid to booleans.
EVIDENCE: Nested `.map` on `currentMap.tiles` inside the collidingEnemy branch before `findBattleStartCell`.
RECOMMENDED_ACTION: Occupancy helper accepting tile lookup. Do not change spacing rules (Chebyshev ≥3 / ≥2).
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Wrong wall/void treatment if the predicate diverges from `t !== "wall"`.
VALIDATION_REQUIRED: Encounter placement still unique and off portals/barriers; cramped maps still place.
WHY_NOT_DUPLICATE: Not in 001–136. Distinct from per-frame portalMap/barrier snapshot PERF-022 (RAF path vs battle-start once).
STATUS: NEW
