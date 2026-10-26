# ACTION_IDs — 2026-10-26 Performance Auditor

Did **not** change WorldExploration, the world RAF schedule, or gameplay timing.
Did **not** re-file PERF-2026-08-31-001..010, 09-01-011..036, 09-02-037..060,
09-21-061..070, 09-22-071..085, 09-23-086..101, 09-24-102..107, 09-25-108..113,
09-26-114..118, 09-27-119..125, 09-28-126..132, 09-29-133..136, 10-21-137..142,
10-22-143..147, 10-23-148..172, 10-24-173..176, 10-25-177..182.

Implemented this increment: PERF-2026-10-26-183 (`effectsTickActivity.ts` +
idle skip in `effects.ts`). Distinct from PERF-132 (in-place compact of *live*
juice remains REPORT_ONLY).

Did **not** restack WorldExploration / occupancy.ts / ChatPanel / soundEngine /
App.tsx / vite.config.js / LandingPage / DraggablePanel / canvasLoopActivity /
pieceArt.ts. Prefer landing already-open SAFE PRs #350, #392/#412, #429, #447,
#511, #594, #643, #687, #745, #797, #841, #889, #966, #1059.

## Residual on HEAD (already ledgered; still open in older PRs)

| ID | Still on HEAD | Where it lives |
|---|---|---|
| 061 | Catalog `refetchOnWindowFocus` default true | #350 |
| 062 | `playNoise` still allocates a buffer per hit | #350 |
| 009 / 070 | `callerDokaBalance` staleTime 0; global QC default | HUMAN |
| 148 | Context restore stamps `Date.now` so watchdog never restarts RAF | WX stack |
| 177 | Chat 2s `getMessages` during overworld, including folded | ChatPanel stack |
| 178 | Summon owner-tint `shadowBlur` | #1059 |
| 179 | Per-entity radialGradient + moving `shadowBlur` | WX stack |
| 180 | Production `console.log` on click/victory/map gen | WX stack |
| 181 | Wander A* + `setEnemies` from RAF | WX stack |
| 182 | Debug-context roster map on `turnOrder` | WX stack |
| 173–176 | unique-bridge floods, triple canvas fill, `isOccupied` `.some`, tileCornerCache resize | #1009 |
| 005 / 036 | Static tile + hazard grain still live every RAF | WX stack |
| 132 | In-place compact of live juice arrays | REPORT_ONLY |
| 101 | query `withTimeout` dangling 10s timers | #889 |
| 137 | production clickTrace stub | #841 |
| 133 | unused Share Tech Mono + fonts preconnect | #797 |

---

ACTION_ID: PERF-2026-10-26-183
TITLE: Skip EffectsManager simulation while overworld juice is idle
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/engine/effectsTickActivity.ts; src/frontend/src/engine/effects.ts
CURRENT_BEHAVIOUR: World RAF calls `effectsManager.tick(16)` every frame. Even with zero floaters, shake, hit-flash, or hit-stop, tick allocated a `survivors` array and `filter()`ed four typed mirrors. Idle explore (the majority of play) paid that GC under the isometric pass. Distinct from PERF-132 (compact *live* arrays in place) and from PERF-047 (the 16ms juice argument).
DESIRED_BEHAVIOUR: Return immediately when shake < 0.01, hit-flash map is empty, hit-stop is not armed, and every live array is empty. Residual shake / flash / hit-stop / floaters still run the existing tick body. TTL and motion unchanged.
EVIDENCE: effects.ts tick always built `const survivors: Effect[] = []` then four `.filter()` assignments; animate() ~8764 calls tick(16) every frame; MAX_LIVE_EFFECTS = 100.
RECOMMENDED_ACTION: Keep `shouldSkipEffectsSimulation`. Do not in-place compact live juice here (132). Do not change the 16ms argument.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Hit-stop restore and shake decay must still run when armed; a too-broad skip would freeze hit-stop at timeScale 0. Predicate requires hitStopActive / shake / flash to stay on the live path.
VALIDATION_REQUIRED: `node --experimental-strip-types --test src/frontend/src/engine/effectsTickActivity.test.ts`; damage/doka/death/float text still appear and expire; idle overworld does not grow `activeEffects`.
STATUS: IMPLEMENTED

---

ACTION_ID: PERF-2026-10-26-184
TITLE: Each living combatant fillRect-paints every pixel of its pattern every RAF
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (drawPixelPattern ~3841–3886); src/frontend/src/data/pieceArt.ts (drawPatternInline)
CURRENT_BEHAVIOUR: Unified entity draw walks the 8×8 (or larger) pattern and `fillRect`s every non-zero cell, resetting `fillStyle` per pixel, for every living unit every frame. Ten combatants is hundreds of 2D rects on top of the isometric floor pass. Distinct from PERF-005 (static *map* tile/hazard cache) and from PERF-178 (summon owner-tint stroke).
DESIRED_BEHAVIOUR: Bake each (pattern × palette × scale) to an OffscreenCanvas / ImageBitmap and blit. Recache on view/palette/scale change only. Hit-test rects stay independent (169).
EVIDENCE: WorldExploration.tsx drawPixelPattern nested row/col loop with fillRect; pieceArt.ts drawPatternInline is the same loop; drawCombatant uses it for every enemy/summon/boss.
RECOMMENDED_ACTION: Visual-approved sprite atlas. WorldExploration and pieceArt.ts (#1059) are stacked — do not land in this increment. Do not fold into RAF scheduling.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Subpixel centering (`Math.round`) and per-pixel scale.ceil can shift 1px vs live fillRect; hit-test sprites sit above the tile via CHARACTER_Y_OFFSET.
VALIDATION_REQUIRED: Desktop and mobile screenshots of player, enemy, boss, and both summon sides; walk animation view changes still swap patterns; Attack Nearest / sprite-click hit boxes still match bodies.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-26-185
TITLE: Barrier towers rebuild six iso layers of paths every RAF
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/engine/barrierRender.ts; src/frontend/src/components/WorldExploration.tsx (~8000)
CURRENT_BEHAVIOUR: Each spell-placed barrier calls `drawBarrierTower`, which draws 6 layers × (right face + left face + top diamond) with save/beginPath/fill/stroke/restore every frame while the barrier lives (up to 3 turns). Distinct from PERF-005 (generated walls) and from occupancy (passability unchanged).
DESIRED_BEHAVIOUR: Bake one tower sprite per (tileW, tileH) and blit. Rebuild on zoom/resize. 3-turn expiry and LoS stay in WorldExploration.
EVIDENCE: barrierRender.ts BARRIER_LAYERS = 6, BARRIER_LAYER_HEIGHT = 28; WX depth pass calls drawBarrierTower per barrier tile.
RECOMMENDED_ACTION: Cache inside barrierRender so WX call sites stay. Visual-approved blit offset. Do not restack occupancy.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Blit origin can detach the tower from the iso diamond by 1px; painter's order vs units walking behind the tower must stay.
VALIDATION_REQUIRED: Cast a barrier; tower still reads as 6-high purple-gray; walk behind it; expire after 3 turns; zoom/resize.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-26-186
TITLE: SpellbookModal mounts the full catalog as a non-virtualized DOM grid
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/SpellbookModal.tsx (~821); src/frontend/src/components/WorldExploration.tsx (static import)
CURRENT_BEHAVIOUR: Opening the spellbook maps `allSpells` into a CSS grid of cards (upgrade math, effect colors, expanded row). Admin catalogs are tens of spells; each open/re-render rebuilds the whole list while the world RAF keeps running underneath. Distinct from PERF-019 (virtualize the 500-row battle log) and PERF-057 (BuffShop hooks while closed).
DESIRED_BEHAVIOUR: Virtualize the catalog list, or build range-preview geometry only for the selected/expanded card. `computeTargetableTiles` unification for the 9×9 preview must stay.
EVIDENCE: SpellbookModal.tsx `allSpells.map` at the grid; WorldExploration static-imports SpellbookModal into the world chunk.
RECOMMENDED_ACTION: Product-approved virtualizer. SpellbookModal may overlap older combat PRs — restack. Do not change `onSetActiveSpells` / `upgradeSpell` debit.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Kit-spell order, active-bar highlight, and 9×9 preview geometry can drift if cards are windowed incorrectly.
VALIDATION_REQUIRED: Open spellbook with a large catalog; scroll; set active bar; upgrade a spell; 9×9 preview matches canvas range.
STATUS: NEW
