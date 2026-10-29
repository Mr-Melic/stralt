# ACTION_IDs — 2026-10-29 Performance Auditor

Two passes same day:
1. React / subscriptions / HUD / timers → PERF-205..208.
2. Canvas / engine / RAF-adjacent (report only for WorldExploration) → PERF-210..214.

Implemented leftover **PERF-2026-10-28-201** (chat `getMessages` during Game Over)
via `deathOverlayActivity.ts` + GameOverModal mount + GameFlow `isPaused` OR.
Did **not** re-file PERF-2026-08-31-001 … PERF-2026-10-28-204 except marking 201
IMPLEMENTED. Did **not** re-file character-slots `staleTime: 0` (already
PERF-2026-10-22-146 / HUMAN).

Did **not** change WorldExploration, the world RAF schedule, or gameplay timing.

Prefer landing already-open SAFE PRs #350, #392/#412, #429, #447, #511, #594,
#643, #687, #745, #797, #841, #889, #966, #1059, #1122, #1185, #1256.

SAFE leftovers still stacked (do not land here): 204 BuffShop persist-while-closed.

---

ACTION_ID: PERF-2026-10-28-201
TITLE: Chat getMessages poll resumes during Game Over because death clears inBattle
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/engine/deathOverlayActivity.ts; src/frontend/src/components/GameOverModal.tsx; src/frontend/src/components/GameFlow.tsx; src/frontend/src/components/ChatPanel.tsx (untouched)
CURRENT_BEHAVIOUR: `_handlePlayerDeath` calls `setInBattle(false)` then `setShowGameOver(true)`. ChatPanel is a GameFlow sibling, so the Game Over early-return does not unmount it. `isPaused={isInBattle || isTransitioning}` becomes false and the 2s `getMessages` interval resumes for the whole death-modal dwell.
DESIRED_BEHAVIOUR: Treat the death overlay like battle/transition: pause chat until Respawn / leave-world. Battle-log unread and Clear log stay as they are.
EVIDENCE: GameFlow `isPaused` previously ORed only battle + transition; ChatPanel calls `fetchMessages()` immediately then `setInterval(..., 2000)` when `!isPaused`; death path sets `setInBattle(false)` then `setShowGameOver(true)`. GameOverModal uses `useLayoutEffect` so the flag lands before ChatPanel's poll effect.
RECOMMENDED_ACTION: Keep `deathOverlayActivity` + GameOverModal layout mount/unmount + GameFlow subscriber. Do not change the 2s overworld poll (177). Do not edit ChatPanel or WorldExploration.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Flag must clear on Respawn and leave-world so overworld chat returns; a stuck true pauses chat forever.
VALIDATION_REQUIRED: `node --experimental-strip-types --test src/frontend/src/engine/deathOverlayActivity.test.ts`; die in battle — no `getMessages` while the death dialog is open; Respawn / Death Realm poll resumes; folded unread still works in overworld.
STATUS: IMPLEMENTED

---

ACTION_ID: PERF-2026-10-29-205
TITLE: Stats HUD DraggablePanel starts unfolded with the full character-sheet DOM live
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (stats-panel DraggablePanel ~L18061–18072; sheet body ~L18073–18820)
CURRENT_BEHAVIOUR: `panelId="stats-panel"` uses `defaultFolded={false}`. From world entry the portrait, vitals orbs, XP bar, heal controls, and in-battle effect lists are committed DOM. Every WorldExploration setState (1 Hz turn timer, idle HP regen, wander `syncCombatants`, battle AP/MP) re-reconciles that sheet. Same class as Chat/MapModifiers starting unfolded (103 / 113), but the Stats sheet is the largest always-live HUD body and was not previously ledgered.
DESIRED_BEHAVIOUR: Start folded (`defaultFolded={true}`) or mount the heavy sheet body only while unfolded, matching SettingsPanel’s folded-by-default posture.
EVIDENCE: WorldExploration.tsx L18069 `defaultFolded={false}` and the large children block that follows. Distinct from PERF-106 (double `activeEffects` filter inside the sheet) and PERF-113 (Map Effects panel).
RECOMMENDED_ACTION: Flip default fold or gate children behind fold state. Do not change persist-lock / heal math in a perf-only PR. WorldExploration stacked.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Players who relied on an always-open Stats sheet must unfold once; saved layout `folded` still wins after first persist.
VALIDATION_REQUIRED: Enter world; Stats starts folded; unfold shows vitals; HP/AP update while open; layout save restores fold preference.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-29-206
TITLE: ChatPanel isFolded never syncs when DraggablePanel restores a folded layout
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/ChatPanel.tsx (~L496 `useState(false)`, ~L1125 `onFoldChange`); src/frontend/src/components/DraggablePanel.tsx (~L459 localStorage `setFolded`, ~L528 backend reconcile `setFolded`, ~L784 `onFoldChange` only on toggle)
CURRENT_BEHAVIOUR: Chat keeps its own `isFolded` starting at `false`. DraggablePanel can restore `folded: true` from localStorage / `getUserUiLayout` without calling `onFoldChange`. Chat then treats a visually folded panel as open: the open-path focus effect (~L972–999) still schedules `inputRef.focus()` on every poll / battle-log / effects length change, and unread/scroll guards use the wrong flag. Complements PERF-080 / PERF-081 (focus + tree build) with a restore desync.
DESIRED_BEHAVIOUR: When applying a saved/backend fold state, notify `onFoldChange(saved.folded)` (or initialize Chat `isFolded` from the same layout key).
EVIDENCE: DraggablePanel mount effect sets folded at L459 / L528 with no `onFoldChange` call; only `handleFoldToggle` (~L779–785) notifies. ChatPanel L496 / L1125.
RECOMMENDED_ACTION: One `onFoldChange?.(saved.folded)` after each restore path. Do not change channel poll interval here (177 / 201). ChatPanel and DraggablePanel are stacked.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Restored-folded chat must not steal focus; unread badges must still increment while folded.
VALIDATION_REQUIRED: Fold chat, reload world; panel stays folded; battle log lines do not focus a hidden input; unfold clears unread.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-29-207
TITLE: Achievement check useCallback depends on the whole markAchievementUnlocked mutation object
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (`checkAndFireAchievement` ~L2217–2252; consumers ~L2260–2284, ~L2287–2291, ~L3629–3642)
CURRENT_BEHAVIOUR: `useCallback(..., [achievementConfigs, playerAchievements, markAchievementUnlocked])` lists the entire mutation result. TanStack Query returns a new mutation object identity every render, so `checkAndFireAchievement` is a new function every WorldExploration render. Effects that depend on it (doka/maps, jackpot, level/spell mastery) tear down and re-run on every wander commit, HP regen tick, turn timer tick, and other WX setStates — re-walking configs with `.find` / `.some` even when values are unchanged.
DESIRED_BEHAVIOUR: Depend on the stable `markAchievementUnlocked.mutate` (or a ref-held unlock fn). Keep `achievementsShownRef` / already-unlocked guards.
EVIDENCE: L2252 dependency array uses `markAchievementUnlocked`; L2284 / L2291 / L3642 effects list `checkAndFireAchievement`. Distinct from PERF-050 (feats query focus refetch) and PERF-203 (closed AchievementsPanel subscription).
RECOMMENDED_ACTION: Switch deps to `.mutate` or `useRef` the mutator. Do not weaken unlock/claim invalidate paths. WorldExploration stacked.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Unlock/toast must still fire once per feat; wallet feats must still wait for `applyRewards`.
VALIDATION_REQUIRED: Unlock `level_10` / `doka_1000` after persist; no duplicate toasts; 1 Hz timer does not re-enter the check when values are unchanged.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-29-208
TITLE: Idle HP regen interval still setStates during Game Over early-return
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (idle regen ~L3617–3627; Game Over early-return ~L17425–17438)
CURRENT_BEHAVIOUR: A 10s `setInterval` skips only `inBattleRef`. Game Over early-returns after hooks, so the interval keeps calling `setCharacterStats` while the UI is only `GameOverModal`. Combined with PERF-200 (watchdog RAF restart) this is extra React reconcile during the death modal. Distinct from 200 (null-canvas RAF) and from 201 (chat poll).
DESIRED_BEHAVIOUR: Skip regen when `showGameOver` / death overlay is active. Do not change the 10s overworld cadence or battle skip.
EVIDENCE: Interval at L3617–3627 guards only `inBattleRef`; Game Over early-return at L17425 still leaves hooks running.
RECOMMENDED_ACTION: Guard with `showGameOver` (or `isDeathOverlayActive()`). WorldExploration stacked — a `shouldRunIdleHpRegen` helper is fine once WX can call it. Do not change `respawnHpAfterDeath`.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Death Realm must still regen after Respawn; battle must still skip.
VALIDATION_REQUIRED: Die with missing HP; modal open ≥15s does not tick HP; Death Realm regen resumes; in-battle still frozen.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-29-210
TITLE: Enemy-AI reachability / cast-tile BFS still Array.shift-pops every enemy turn
CATEGORY: runtime-performance
PRIORITY: low
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/engine/enemyAI.ts (`computeReachable` ~L375–376; `findNearestLegalCastTile` ~L808–809)
CURRENT_BEHAVIOUR: Both BFSes dequeue with `queue.shift()`. On a 16×16 grid this is O(n²) copies per living enemy per decide, not a multi-frame hitch by itself. Distinct from PERF-193 (player walk-mode BFS shift) and PERF-189 (occupancy `floodPassable` shift — that one is called per open cell and is the larger occupancy cost).
DESIRED_BEHAVIOUR: Index-cursor dequeue (O(1)); keep reachable / legal-cast semantics identical.
EVIDENCE: `enemyAI.ts` L376 `const cur = queue.shift()!` inside `computeReachable`; L809 same pattern in `findNearestLegalCastTile`.
RECOMMENDED_ACTION: Replace `shift` with a head index in both loops. Add a geometry test that reachable sets match. Do not change ENEMY_REACHABLE_STEP_BUDGET or LoS. Not landed this run: 16×16 cost is a micro-opt vs player-visible HUD/canvas findings; combat sidecars already import `enemyAI.ts`.
AUTONOMY:
- SAFE_TO_AUTO_IMPLEMENT
REGRESSION_RISK: Wrong dequeue order would change move-then-cast tile choice; lock with geometry tests.
VALIDATION_REQUIRED: Pack fight with casters/chargers; `enemyAI.geometry` / walkMp tests pass; typecheck.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-29-211
TITLE: Battle status icons fillText emoji + roundRect per combatant every RAF
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (enemy icons ~L8240–8281; player icons ~L8356–8397)
CURRENT_BEHAVIOUR: While `inBattleRef`, every drawn combatant with active effects filters `activeEffectsRef`, then for up to 4 effects runs `roundRect` + `fillText(eff.iconEmoji, …)`. Canvas emoji text shaping is expensive and repeats every frame for the whole pack. Distinct from PERF-197 (dungeon portal `measureText` labels) and PERF-046 (floating combat labels).
DESIRED_BEHAVIOUR: Cache pre-rasterized icon bitmaps (or a small atlas) keyed by emoji/type; blit with `drawImage`. Keep pill colour / overflow `+N` behaviour.
EVIDENCE: L8263–8268 enemy `roundRect` + `fillText(eff.iconEmoji)`; L8379–8384 player mirror. Both sit inside the per-frame depth-sorted entity pass.
RECOMMENDED_ACTION: Offscreen atlas helper; WorldExploration only swaps draw calls. Do not change effect apply/tick rules. WorldExploration stacked.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Icon colour / overflow badge / DoT vs buff palette must stay readable at battle zoom.
VALIDATION_REQUIRED: Apply multi-DoT + buff on player and several enemies; icons stay aligned; no per-frame text thrash in a profile.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-29-212
TITLE: Walk/spell highlight pass stroke-fills a full iso diamond for every matching tile every RAF
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (MP green ~L7659–7679; spell blue ~L7686–7707; sets computed ~L7341–7350)
CURRENT_BEHAVIOUR: During walk or attack mode the floor pass, for every grid cell, builds `` `${x},${y}` `` and on hit runs `beginPath` + 4 `lineTo` + `fill` + `stroke` (save/restore). A mid-MP walk ring or spell diamond therefore pays dozens of path strokes every frame on top of PERF-193’s BFS cost. Distinct from 193 (queue `shift` inside BFS) and from hover glow (single tile radial).
DESIRED_BEHAVIOUR: Iterate the highlight Set once (or reuse a cached path / fillStyle batch); avoid per-tile string keys and redundant stroke work when the set is unchanged.
EVIDENCE: L7660–7678 green MP diamond; L7687–7706 blue spell diamond; sets refreshed each render at L7341–7350.
RECOMMENDED_ACTION: Draw from the Set’s cells via `gridToScreen` instead of scanning the full grid with string keys; optional Path2D cache keyed by mode+version. Do not change walk/spell legality. WorldExploration stacked.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Highlight must still match click gates after MP spend / barriers / summon control.
VALIDATION_REQUIRED: Walk ring and spell range match clicks; summon-control origin still correct; no flicker with slime/frozen cost.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-29-213
TITLE: Pack-enemy turns remap the full map into a fresh boolean[][] every decideEnemyAction
CATEGORY: runtime-performance
PRIORITY: high
CONFIDENCE: high
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (enemy-turn AI setup ~L16304–16307)
CURRENT_BEHAVIOUR: Before each enemy decide, WX does `(currentMap?.tiles ?? []).map((row) => (row ?? []).map((t) => t !== "wall"))`, allocating a full `boolean[][]` plus every row array. A 6–8 enemy pack therefore rebuilds the walkability grid many times per round even though tiles only change on map transition / barrier place. Distinct from PERF-022 (highlight Set/Map rebuilds) and from occupancy’s own grid consumers.
DESIRED_BEHAVIOUR: Cache `aiGrid` until `currentMap` identity / barrier version / void set changes; reuse across enemies in the same round.
EVIDENCE: L16304–16307 builds `aiGrid` immediately before `DecideEnemyContext` assembly inside the per-enemy turn body.
RECOMMENDED_ACTION: Memoize behind a map/barrier version ref; invalidate on barrier place/expire and map swap. Do not change `isCellFree` semantics. WorldExploration stacked.
AUTONOMY:
- HUMAN_APPROVAL_REQUIRED
REGRESSION_RISK: Stale true cells after barrier place would let AI path through walls; invalidation must cover barrier + void + portal edits.
VALIDATION_REQUIRED: Barrier spell mid-fight; AI refuses barrier tiles; portal/void still blocked; multi-enemy round hitch shrinks.
STATUS: NEW

---

ACTION_ID: PERF-2026-10-29-214
TITLE: Null getContext recovery assigns canvas.width = 0 then restores (full buffer wipe)
CATEGORY: runtime-performance
PRIORITY: medium
CONFIDENCE: medium
FILES_OR_SYSTEMS: src/frontend/src/components/WorldExploration.tsx (`render` null-ctx recovery ~L7219–7229)
CURRENT_BEHAVIOUR: When `canvas.getContext("2d")` returns null under GPU pressure, recovery sets `canvas.width = 0` then restores the previous width. Assigning `width` reallocates / clears the backing store. If null persists across frames, every render attempt pays a full buffer tear-down/rebuild and a black flash — compounding PERF-200’s Game Over null-canvas watchdog path (different site: animate’s `_animCtx` at ~8747 does not wipe). Distinct from PERF-187 (fractional-DPR resize clear on the happy path).
DESIRED_BEHAVIOUR: Rate-limit recovery; prefer `contextlost` / restore handlers; avoid width-thrash every frame while null.
EVIDENCE: L7224–7229 null branch; comment documents GPU-pressure intent. Animate null path at L8747–8759 returns without this wipe.
RECOMMENDED_ACTION: Report only — do not change recovery without a GPU-loss repro. If fixed later: backoff + single restore attempt per lost event.
AUTONOMY:
- REPORT_ONLY
REGRESSION_RISK: Removing the wipe without a real restore path can leave a permanently black canvas after context loss.
VALIDATION_REQUIRED: Forced context loss (devtool / DPR thrash); canvas recovers once without per-frame flicker; normal play unchanged.
STATUS: NEW
